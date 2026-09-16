"use client";

import { Zap, Bot, Send, Database } from "lucide-react";

export function NodePalette() {
  const onDragStart = (event: React.DragEvent, nodeType: string, actionType?: string) => {
    event.dataTransfer.setData("application/reactflow/type", nodeType);
    if (actionType) {
      event.dataTransfer.setData("application/reactflow/actionType", actionType);
    }
    event.dataTransfer.effectAllowed = "move";
  };

  return (
    <aside className="w-64 bg-white/80 backdrop-blur-md border-r border-gray-200/80 p-4 flex flex-col gap-4 shrink-0 z-30">
      <div>
        <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-3">
          Node Library
        </h3>
        <p className="text-xs text-gray-500 mb-4">
          Drag components onto the canvas to assemble your AI workflow.
        </p>
      </div>

      <div className="flex flex-col gap-3">
        {/* Trigger Node */}
        <div
          draggable
          onDragStart={(e) => onDragStart(e, "trigger")}
          className="flex items-center gap-3 p-3 bg-white border border-gray-200 rounded-xl shadow-sm hover:border-emerald-500 hover:shadow-md cursor-grab active:cursor-grabbing transition-all"
        >
          <div className="p-2 bg-amber-50 rounded-lg text-amber-600">
            <Zap className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-semibold text-gray-900">Webhook Trigger</h4>
            <p className="text-[10px] text-gray-500">Inbound data entry point</p>
          </div>
        </div>

        {/* AI Agent Node */}
        <div
          draggable
          onDragStart={(e) => onDragStart(e, "agent")}
          className="flex items-center gap-3 p-3 bg-white border border-gray-200 rounded-xl shadow-sm hover:border-purple-500 hover:shadow-md cursor-grab active:cursor-grabbing transition-all"
        >
          <div className="p-2 bg-purple-50 rounded-lg text-purple-600">
            <Bot className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-semibold text-gray-900">Groq Classifier</h4>
            <p className="text-[10px] text-gray-500">AI intent routing engine</p>
          </div>
        </div>

        {/* Action: Discord */}
        <div
          draggable
          onDragStart={(e) => onDragStart(e, "action", "discord")}
          className="flex items-center gap-3 p-3 bg-white border border-gray-200 rounded-xl shadow-sm hover:border-indigo-500 hover:shadow-md cursor-grab active:cursor-grabbing transition-all"
        >
          <div className="p-2 bg-indigo-50 rounded-lg text-indigo-600">
            <Send className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-semibold text-gray-900">Discord Alert</h4>
            <p className="text-[10px] text-gray-500">Send urgent notifications</p>
          </div>
        </div>

        {/* Action: Notion */}
        <div
          draggable
          onDragStart={(e) => onDragStart(e, "action", "notion")}
          className="flex items-center gap-3 p-3 bg-white border border-gray-200 rounded-xl shadow-sm hover:border-slate-800 hover:shadow-md cursor-grab active:cursor-grabbing transition-all"
        >
          <div className="p-2 bg-slate-100 rounded-lg text-slate-800">
            <Database className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-semibold text-gray-900">Notion CRM</h4>
            <p className="text-[10px] text-gray-500">Log structured records</p>
          </div>
        </div>
      </div>
    </aside>
  );
}