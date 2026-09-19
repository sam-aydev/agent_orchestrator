"use client";

import {
  useCallback,
  useEffect,
  useState,
  useTransition,
  useRef,
  Suspense,
} from "react";
import { useTheme } from "next-themes";
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
import { Bot, Loader2, Plus, Menu } from "lucide-react";

// CUSTOM EDGE COMPONENT (DELETE BUTTON)
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
            pointerEvents: "all",
          }}
          className="nodrag nopan"
        >
          <button
            className="w-5 h-5 bg-white dark:bg-gray-800 hover:bg-red-500 dark:hover:bg-red-600 text-gray-400 dark:text-gray-500 hover:text-white dark:hover:text-white rounded-full flex items-center justify-center border border-gray-200 dark:border-gray-700 hover:border-red-500 dark:hover:border-red-600 transition-all shadow-sm text-sm cursor-pointer z-50"
            onClick={(event) => {
              event.stopPropagation();
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

// MAIN CANVAS FLOW
function CanvasFlow() {
  const [nodes, setNodes] = useState<Node[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [activeSidebarNode, setActiveSidebarNode] = useState<Node | null>(null);
  const [isPending, startTransition] = useTransition();
  const [mounted, setMounted] = useState(false);

  // NEW: State for tracking the workflow name internally for Autosave
  const [workflowName, setWorkflowName] = useState("Untitled Agent");

  // State to control the mobile node palette drawer
  const [isMobilePaletteOpen, setIsMobilePaletteOpen] = useState(false);

  const searchParams = useSearchParams();
  const workflowId = searchParams.get("workflowId");

  const { resolvedTheme } = useTheme();

  const { screenToFlowPosition } = useReactFlow();
  const hasToastedRef = useRef<boolean>(false);

  // Ref to prevent autosaving on initial page load
  const isDataLoadedRef = useRef<boolean>(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // LOAD WORKFLOW ON MOUNT
  useEffect(() => {
    if (!workflowId) return;

    async function loadSavedWorkflow() {
      const result = await getWorkflowById(workflowId as string);

      if (result.success && result.data) {
        const dbWorkflow = result.data;

        setNodes(
          dbWorkflow.nodes && Array.isArray(dbWorkflow.nodes)
            ? dbWorkflow.nodes
            : [],
        );
        setEdges(
          dbWorkflow.edges && Array.isArray(dbWorkflow.edges)
            ? dbWorkflow.edges
            : [],
        );

        if (dbWorkflow.name) {
          setWorkflowName(dbWorkflow.name);
          window.dispatchEvent(
            new CustomEvent("workflow-loaded", {
              detail: { name: dbWorkflow.name },
            }),
          );
        }

        // Delay setting "loaded" state slightly to prevent React Flow's initial layout shifts from triggering an autosave
        setTimeout(() => {
          isDataLoadedRef.current = true;
        }, 500);
      }
    }

    loadSavedWorkflow();
  }, [workflowId]);

  // AUTOSAVE EFFECT (Debounced)
  useEffect(() => {
    if (!isDataLoadedRef.current || !workflowId) return;

    const autosaveTimer = setTimeout(() => {
      // Dispatch events so the Header shows the "Deploying..." loading state
      window.dispatchEvent(new Event("workflow-save-start"));

      startTransition(async () => {
        const result = await saveWorkflowConfiguration(
          workflowId as string,
          nodes,
          edges,
          workflowName,
        );

        window.dispatchEvent(new Event("workflow-save-end"));

        if (result.success) {
          toast.success("Autosaved", {
            position: "bottom-right",
            style: { padding: "8px", fontSize: "12px" }, // Make autosave toasts smaller & subtle
          });
        }
      });
    }, 2500); // Wait 2.5 seconds after the user stops dragging/editing before saving

    return () => clearTimeout(autosaveTimer);
  }, [nodes, edges, workflowId, workflowName]);

  // MANUAL SAVE FROM HEADER
  useEffect(() => {
    const handleSaveEvent = (e: Event) => {
      if (!workflowId) return;

      const customEvent = e as CustomEvent;
      const updatedName = customEvent.detail?.name || workflowName;
      setWorkflowName(updatedName); // Keep local name in sync

      window.dispatchEvent(new Event("workflow-save-start"));

      startTransition(async () => {
        const result = await saveWorkflowConfiguration(
          workflowId as string,
          nodes,
          edges,
          updatedName,
        );

        window.dispatchEvent(new Event("workflow-save-end"));

        if (!result.success) {
          toast.error(`Save failed: ${result.error}`);
        } else {
          toast.success(`Workspace "${updatedName}" securely saved!`);
        }
      });
    };

    window.addEventListener("workflow-request-save", handleSaveEvent);
    return () =>
      window.removeEventListener("workflow-request-save", handleSaveEvent);
  }, [nodes, edges, workflowId, workflowName]);

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }, []);

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();
      setIsMobilePaletteOpen(false);

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

  const handleAddNodeClick = useCallback(
    (type: string, actionType?: string) => {
      setIsMobilePaletteOpen(false);

      const offsetX = Math.random() * 50 - 25;
      const offsetY = Math.random() * 50 - 25;

      const position = screenToFlowPosition({
        x: window.innerWidth / 2 + offsetX,
        y: window.innerHeight / 2 + offsetY,
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
      setEdges((eds) =>
        addEdge({ ...params, type: "custom", animated: true }, eds),
      );
    },
    [setEdges],
  );

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
      <div className="flex-1 flex flex-col items-center mt-5 justify-center bg-[#f8fafc] dark:bg-gray-950 w-full px-4 mx-auto h-screen font-sans transition-colors duration-200">
        <div className="bg-white dark:bg-gray-900 p-6 sm:p-8 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 flex flex-col items-center w-full max-w-md text-center transition-colors">
          <div className="w-16 h-16 bg-emerald-50 dark:bg-emerald-500/10 rounded-2xl flex items-center justify-center mb-6 border border-emerald-100 dark:border-emerald-500/20 transition-colors">
            <Bot className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2 transition-colors">
            Welcome to your Workspace
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-8 leading-relaxed transition-colors">
            You don't have an active agent selected. Create a new blank canvas
            to start building your AI workflow.
          </p>

          <button
            onClick={() => {
              startTransition(async () => {
                const result = await createBlankWorkflow();
                if (result.success && result.workflowId) {
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
            className="cursor-pointer flex items-center justify-center w-full sm:w-auto gap-2 bg-emerald-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-emerald-700 transition-all shadow-sm hover:shadow-md"
          >
            <Plus className="w-5 h-5" />
            Create New Agent
          </button>
        </div>
      </div>
    );
  }

  const isDarkMode = mounted && resolvedTheme === "dark";

  return (
    <div className="w-full h-screen bg-[#f8fafc] dark:bg-gray-950 flex flex-col overflow-hidden font-sans transition-colors duration-200 relative">
      <div className="flex-1 flex w-full relative overflow-hidden">
        {/* DESKTOP NODE PALETTE */}
        <div className="hidden md:block z-30 h-full pt-16">
          <NodePalette onAddNode={handleAddNodeClick} />
        </div>

        {/* MOBILE: FLOATING ADD NODE BUTTON */}
        <div className="md:hidden absolute top-20 left-4 z-40">
          <button
            onClick={() => setIsMobilePaletteOpen(!isMobilePaletteOpen)}
            className="cursor-pointer flex items-center gap-2 bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100 px-4 py-2.5 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 font-semibold text-sm transition-colors"
          >
            <Menu className="w-4 h-4" />
            Node Library
          </button>
        </div>

        {/* MOBILE: NODE PALETTE SLIDE-OUT DRAWER */}
        <AnimatePresence>
          {isMobilePaletteOpen && (
            <>
              {/* BACKDROP */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsMobilePaletteOpen(false)}
                className="absolute inset-0 z-40 bg-gray-900/30 dark:bg-black/50 backdrop-blur-sm md:hidden"
              />
              {/* PANEL */}
              <motion.div
                initial={{ x: "-100%" }}
                animate={{ x: 0 }}
                exit={{ x: "-100%" }}
                transition={{ type: "spring", bounce: 0, duration: 0.4 }}
                className="absolute top-0 left-0 h-full z-50 md:hidden shadow-2xl"
              >
                <NodePalette onAddNode={handleAddNodeClick} />
              </motion.div>
            </>
          )}
        </AnimatePresence>

        <div
          className="flex-1 h-full w-full relative [&_.react-flow__pane]:cursor-crosshair"
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
            colorMode={isDarkMode ? "dark" : "light"}
          >
            <Background
              color={isDarkMode ? "#475569" : "#94a3b8"}
              gap={24}
              size={1.5}
            />
            {/* SCALED DOWN ON MOBILE */}
            <Controls
              position="bottom-left"
              className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl shadow-2xl border-2 border-gray-200 dark:border-gray-800 rounded-xl overflow-hidden scale-100 sm:scale-125 origin-bottom-left m-4 sm:m-6 text-gray-900 dark:text-gray-100 transition-colors"
            />
          </ReactFlow>
        </div>

        {/* RESPONSIVE NODE CONFIG SIDEBAR */}
        <AnimatePresence>
          {selectedNodeId && activeSidebarNode && (
            <motion.div
              initial={{ x: "100%", opacity: 0.5 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: "100%", opacity: 0.5 }}
              transition={{ type: "spring", bounce: 0, duration: 0.4 }}
              // w-full on mobile, fixed max-width on sm+ screens
              className="absolute top-16 right-0 h-[calc(100%-4rem)] w-full sm:w-auto sm:max-w-md shadow-2xl z-50"
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

export default function Canvas() {
  return (
    <ReactFlowProvider>
      <Suspense
        fallback={
          <div className="flex w-full h-screen items-center justify-center bg-[#f8fafc] dark:bg-gray-950 transition-colors">
            <Loader2 className="w-8 h-8 text-emerald-500 animate-spin" />
          </div>
        }
      >
        <CanvasFlow />
      </Suspense>
    </ReactFlowProvider>
  );
}
