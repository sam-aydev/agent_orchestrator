"use client";

import { useCallback, useEffect, useState, useTransition, useRef } from "react";
import {
  ReactFlow,
  Controls,
  Background,
  applyNodeChanges,
  applyEdgeChanges,
  NodeChange,
  EdgeChange,
  Edge,
  Node,
  MarkerType,
  useReactFlow,
  ReactFlowProvider,
  addEdge,
  Connection,
  BaseEdge,
  EdgeLabelRenderer,
  getSmoothStepPath,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";

import {
  TriggerNode,
  AgentNode,
  ActionNode,
} from "@/components/canvas/CustomNodes";
import { NodeConfigSidebar } from "@/components/canvas/NodeConfigSidebar";
import { NodePalette } from "@/components/canvas/NodePallet";
import {
  createBlankWorkflow,
  getWorkflowById,
  saveWorkflowConfiguration,
} from "@/lib/actions/workflow";
import { AnimatePresence, motion } from "framer-motion";
import { toast } from "sonner";
import { useSearchParams } from "next/navigation";
import { Bot, Plus } from "lucide-react";

// ==========================================
// 1. CUSTOM EDGE COMPONENT (DELETE BUTTON)
// ==========================================
const CustomEdge = ({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style,
  markerEnd,
}: any) => {
  const { setEdges } = useReactFlow();
  const [edgePath, labelX, labelY] = getSmoothStepPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  return (
    <>
      <BaseEdge path={edgePath} markerEnd={markerEnd} style={style} />
      <EdgeLabelRenderer>
        <div
          style={{
            position: "absolute",
            transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
            pointerEvents: "all", // Ensures the button is clickable
          }}
          className="nodrag nopan"
        >
          <button
            className="w-5 h-5 bg-white hover:bg-red-500 text-gray-400 hover:text-white rounded-full flex items-center justify-center border border-gray-200 hover:border-red-500 transition-all shadow-sm text-sm cursor-pointer z-50"
            onClick={(event) => {
              event.stopPropagation();
              // Instantly removes this specific edge from the canvas
              setEdges((es) => es.filter((e) => e.id !== id));
            }}
            title="Delete Connection"
          >
            ×
          </button>
        </div>
      </EdgeLabelRenderer>
    </>
  );
};

const edgeTypes = {
  custom: CustomEdge,
};

const nodeTypes = {
  trigger: TriggerNode,
  agent: AgentNode,
  action: ActionNode,
};

const generateSecret = () => Math.random().toString(36).substring(2, 12);

// ==========================================
// 2. MAIN CANVAS FLOW
// ==========================================
function CanvasFlow() {
  const [nodes, setNodes] = useState<Node[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [activeSidebarNode, setActiveSidebarNode] = useState<Node | null>(null);
  const [, startTransition] = useTransition();

  const searchParams = useSearchParams();
  const workflowId = searchParams.get("workflowId");

  // Hook to convert screen coordinates to React Flow canvas coordinates
  const { screenToFlowPosition } = useReactFlow();

  // Ref to prevent toast spam during continuous hover validation
  const hasToastedRef = useRef<boolean>(false);

  // Load exact visual state from Supabase using workflowId
  useEffect(() => {
    if (!workflowId) return;

    async function loadSavedWorkflow() {
      const result = await getWorkflowById(workflowId as string);

      if (result.success && result.data) {
        const dbWorkflow = result.data;

        if (dbWorkflow.nodes && Array.isArray(dbWorkflow.nodes)) {
          setNodes(dbWorkflow.nodes);
        } else {
          setNodes([]);
        }

        if (dbWorkflow.edges && Array.isArray(dbWorkflow.edges)) {
          setEdges(dbWorkflow.edges);
        } else {
          setEdges([]);
        }

        if (dbWorkflow.name) {
          window.dispatchEvent(
            new CustomEvent("workflow-loaded", {
              detail: { name: dbWorkflow.name },
            }),
          );
        }
      }
    }

    loadSavedWorkflow();
  }, [workflowId]);

  // Listen for save requests from the Header
  useEffect(() => {
    const handleSaveEvent = (e: Event) => {
      if (!workflowId) {
        toast.error(
          "No active workflow ID found. Create or open an agent first.",
        );
        return;
      }

      const customEvent = e as CustomEvent;
      const workflowName = customEvent.detail?.name || "Untitled Agent";

      window.dispatchEvent(new Event("workflow-save-start"));

      startTransition(async () => {
        const result = await saveWorkflowConfiguration(
          workflowId as string,
          nodes,
          edges,
          workflowName,
        );

        window.dispatchEvent(new Event("workflow-save-end"));

        if (!result.success) {
          toast.error(`Save failed: ${result.error}`);
        } else {
          toast.success(
            `Workspace "${workflowName}" securely saved to Supabase!`,
          );
        }
      });
    };

    window.addEventListener("workflow-request-save", handleSaveEvent);
    return () =>
      window.removeEventListener("workflow-request-save", handleSaveEvent);
  }, [nodes, edges, workflowId]);

  // DRAG AND DROP HANDLERS
  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }, []);

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();

      const type = event.dataTransfer.getData("application/reactflow/type");
      const actionType = event.dataTransfer.getData(
        "application/reactflow/actionType",
      );

      if (!type) return;

      const position = screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });

      const newNodeId = crypto.randomUUID();
      let newNodeData: Record<string, any> = { label: `New ${type}` };

      if (type === "trigger") {
        newNodeData = {
          label: "Webhook Trigger",
          endpointSecret: `sec_${generateSecret()}`,
        };
      } else if (type === "agent") {
        newNodeData = { label: "AI Classifier" };
      } else if (type === "action") {
        if (actionType === "discord") {
          newNodeData = {
            label: "Discord Alert",
            iconColor: "border-indigo-500",
            actionType: "discord",
            discordWebhookUrl: "",
          };
        } else if (actionType === "notion") {
          newNodeData = {
            label: "Notion CRM",
            iconColor: "border-slate-800",
            actionType: "notion",
            notionApiKey: "",
            notionDatabaseId: "",
          };
        }
      }

      const newNode: Node = {
        id: newNodeId,
        type,
        position,
        data: newNodeData,
      };

      setNodes((nds) => (Array.isArray(nds) ? nds.concat(newNode) : [newNode]));
    },
    [screenToFlowPosition],
  );

  const onNodesChange = useCallback(
    (changes: NodeChange[]) =>
      setNodes((nds) => applyNodeChanges(changes, nds)),
    [],
  );

  const onEdgesChange = useCallback(
    (changes: EdgeChange[]) =>
      setEdges((eds) => applyEdgeChanges(changes, eds)),
    [],
  );

  const onConnect = useCallback(
    (params: Connection) => {
      // Switched to our custom edge type for the delete button
      setEdges((eds) =>
        addEdge({ ...params, type: "custom", animated: true }, eds),
      );
    },
    [setEdges],
  );

  // Reset the toast tracker every time a user starts dragging a new line
  const onConnectStart = useCallback(() => {
    hasToastedRef.current = false;
  }, []);

  const isValidConnection = useCallback(
    (connection: Connection | Edge) => {
      const sourceNode = nodes.find((n) => n.id === connection.source);
      const targetNode = nodes.find((n) => n.id === connection.target);

      if (!sourceNode || !targetNode) return false;

      let errorMessage = "";

      if (sourceNode.id === targetNode.id) {
        errorMessage = "You cannot connect a node to itself.";
      } else if (sourceNode.type === "action") {
        errorMessage =
          "Actions are final endpoints. You cannot route out of them.";
      } else if (targetNode.type === "trigger") {
        errorMessage = "Triggers must be the start of the workflow.";
      } else if (
        sourceNode.type === "trigger" &&
        targetNode.type === "action"
      ) {
        errorMessage =
          "Invalid flow: Webhooks must route through an AI Agent before executing an Action.";
      }

      if (errorMessage) {
        if (!hasToastedRef.current) {
          toast.error(errorMessage);
          hasToastedRef.current = true;
        }
        return false;
      }

      return true;
    },
    [nodes],
  );

  const onNodeClick = useCallback((_: React.MouseEvent, node: Node) => {
    setSelectedNodeId(node.id);
    setActiveSidebarNode(node);
  }, []);

  const onPaneClick = useCallback(() => {
    setSelectedNodeId(null);
  }, []);

  const handleUpdateNodeData = (
    nodeId: string,
    field: string,
    value: string,
  ) => {
    setNodes((nds) =>
      nds.map((n) => {
        if (n.id === nodeId) {
          const updatedNode = { ...n, data: { ...n.data, [field]: value } };
          if (activeSidebarNode?.id === nodeId) {
            setActiveSidebarNode(updatedNode);
          }
          return updatedNode;
        }
        return n;
      }),
    );
  };

  if (!workflowId) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center bg-[#f8fafc] w-full h-screen font-sans">
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center max-w-md text-center">
          <div className="w-16 h-16 bg-emerald-50 rounded-2xl flex items-center justify-center mb-6 border border-emerald-100">
            <Bot className="w-8 h-8 text-emerald-600" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">
            Welcome to your Workspace
          </h2>
          <p className="text-sm text-gray-500 mb-8 leading-relaxed">
            You don't have an active agent selected. Create a new blank canvas
            to start building your AI workflow.
          </p>

          <button
            onClick={() => {
              startTransition(async () => {
                const result = await createBlankWorkflow();
                if (result.success && result.workflowId) {
                  // Updates the URL, which instantly mounts the React Flow canvas!
                  window.history.pushState(
                    null,
                    "",
                    `?workflowId=${result.workflowId}`,
                  );
                } else {
                  toast.error("Failed to create workspace.");
                }
              });
            }}
            className="cursor-pointer flex items-center gap-2 bg-emerald-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-emerald-700 transition-all shadow-sm hover:shadow-md"
          >
            <Plus className="w-5 h-5" />
            Create New Agent
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-screen bg-[#f8fafc] flex flex-col overflow-hidden font-sans">
      <div className="flex-1 flex w-full relative overflow-hidden">
        <NodePalette />

        {/* Added [&_.react-flow__pane]:cursor-crosshair to force a high-visibility cursor */}
        <div
          className="flex-1 h-full relative [&_.react-flow__pane]:cursor-crosshair"
          onDragOver={onDragOver}
          onDrop={onDrop}
        >
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onNodeClick={onNodeClick}
            onPaneClick={onPaneClick}
            onConnect={onConnect}
            onConnectStart={onConnectStart}
            isValidConnection={isValidConnection}
            nodeTypes={nodeTypes}
            edgeTypes={edgeTypes}
            fitView
            fitViewOptions={{ padding: 0.2 }}
            defaultEdgeOptions={{ type: "custom", animated: true }}
          >
            <Background color="#64748b" gap={24} size={1.5} />
            <Controls
              position="bottom-left"
              className="bg-white/95 backdrop-blur-xl shadow-2xl border-2 border-gray-200 rounded-xl overflow-hidden scale-125 origin-bottom-left m-6 text-gray-900"
            />
          </ReactFlow>
        </div>

        <AnimatePresence>
          {selectedNodeId && activeSidebarNode && (
            <motion.div
              initial={{ x: "100%", opacity: 0.5 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: "100%", opacity: 0.5 }}
              transition={{ type: "spring", bounce: 0, duration: 0.4 }}
              className="absolute top-0 right-0 h-full shadow-2xl z-40"
            >
              <NodeConfigSidebar
                selectedNode={activeSidebarNode}
                onClose={() => setSelectedNodeId(null)}
                onUpdateNodeData={handleUpdateNodeData}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default function Page() {
  return (
    <ReactFlowProvider>
      <CanvasFlow />
    </ReactFlowProvider>
  );
}
