"use client";

import { Zap, Bot, Send, Database } from "lucide-react";

interface NodePaletteProps {
  onAddNode?: (type: string, actionType?: string) => void;
}

export function NodePalette({ onAddNode }: NodePaletteProps) {
  const onDragStart = (
    event: React.DragEvent,
    nodeType: string,
    actionType?: string,
  ) => {
    event.dataTransfer.setData("application/reactflow/type", nodeType);
    if (actionType) {
      event.dataTransfer.setData(
        "application/reactflow/actionType",
        actionType,
      );
    }
    event.dataTransfer.effectAllowed = "move";
  };

  return (
    // ADDED h-full and overflow-y-auto so the sidebar stretches correctly on mobile
    <aside className="w-64 h-full overflow-y-auto bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-r border-gray-200/80 dark:border-gray-800 p-4 flex flex-col shrink-0 z-30 transition-colors">
      <div className="mb-4">
        <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500 mb-3 transition-colors">
          Node Library
        </h3>
        <p className="text-xs text-gray-500 dark:text-gray-400 transition-colors">
          Drag components or{" "}
          <span className="font-bold text-gray-700 dark:text-gray-300">
            tap
          </span>{" "}
          to add them to your AI workflow.
        </p>
      </div>

      <div className="flex flex-col gap-3 pb-20 md:pb-0">
        {/* Trigger Node */}
        <div
          draggable
          onDragStart={(e) => onDragStart(e, "trigger")}
          onClick={() => onAddNode?.("trigger")}
          className="flex items-center gap-3 p-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm hover:border-emerald-500 dark:hover:border-emerald-500 hover:shadow-md cursor-grab active:cursor-grabbing transition-all"
        >
          <div className="p-2 bg-amber-50 dark:bg-amber-500/10 rounded-lg text-amber-600 dark:text-amber-500 transition-colors">
            <Zap className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-semibold text-gray-900 dark:text-gray-100 transition-colors">
              Webhook Trigger
            </h4>
            <p className="text-[10px] text-gray-500 dark:text-gray-400 transition-colors">
              Inbound data entry point
            </p>
          </div>
        </div>

        {/* AI Agent Node */}
        <div
          draggable
          onDragStart={(e) => onDragStart(e, "agent")}
          onClick={() => onAddNode?.("agent")}
          className="flex items-center gap-3 p-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm hover:border-purple-500 dark:hover:border-purple-500 hover:shadow-md cursor-grab active:cursor-grabbing transition-all"
        >
          <div className="p-2 bg-purple-50 dark:bg-purple-500/10 rounded-lg text-purple-600 dark:text-purple-400 transition-colors">
            <Bot className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-semibold text-gray-900 dark:text-gray-100 transition-colors">
              Groq Classifier
            </h4>
            <p className="text-[10px] text-gray-500 dark:text-gray-400 transition-colors">
              AI intent routing engine
            </p>
          </div>
        </div>

        {/* Action: Discord */}
        <div
          draggable
          onDragStart={(e) => onDragStart(e, "action", "discord")}
          onClick={() => onAddNode?.("action", "discord")}
          className="flex items-center gap-3 p-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm hover:border-indigo-500 dark:hover:border-indigo-500 hover:shadow-md cursor-grab active:cursor-grabbing transition-all"
        >
          <div className="p-2 bg-indigo-50 dark:bg-indigo-500/10 rounded-lg text-indigo-600 dark:text-indigo-400 transition-colors">
            <Send className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-semibold text-gray-900 dark:text-gray-100 transition-colors">
              Discord Alert
            </h4>
            <p className="text-[10px] text-gray-500 dark:text-gray-400 transition-colors">
              Send urgent notifications
            </p>
          </div>
        </div>

        {/* Action: Notion */}
        <div
          draggable
          onDragStart={(e) => onDragStart(e, "action", "notion")}
          onClick={() => onAddNode?.("action", "notion")}
          className="flex items-center gap-3 p-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm hover:border-slate-800 dark:hover:border-slate-500 hover:shadow-md cursor-grab active:cursor-grabbing transition-all"
        >
          <div className="p-2 bg-slate-100 dark:bg-slate-700/50 rounded-lg text-slate-800 dark:text-slate-300 transition-colors">
            <Database className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-semibold text-gray-900 dark:text-gray-100 transition-colors">
              Notion CRM
            </h4>
            <p className="text-[10px] text-gray-500 dark:text-gray-400 transition-colors">
              Log structured records
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
}
