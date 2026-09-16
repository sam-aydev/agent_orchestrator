import { Handle, Position } from "@xyflow/react";
import { Webhook, Bot, Send, Sparkles } from "lucide-react";

export function TriggerNode({ data }: { data: { label: string } }) {
  return (
    <div className="relative group rounded-xl border border-gray-200/60 bg-white/90 p-4 shadow-sm backdrop-blur-xl transition-all hover:shadow-lg hover:border-emerald-500/50 w-[240px]">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-400 to-teal-400 rounded-t-xl" />

      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600 shadow-inner">
          <Webhook className="h-5 w-5" />
        </div>
        <div className="flex flex-col">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 mb-0.5">
            Trigger Event
          </span>
          <span className="text-sm font-semibold text-gray-900">
            {data.label}
          </span>
        </div>
      </div>

      {/* Glowing output handle */}
      <Handle
        type="source"
        position={Position.Right}
        className="!h-3 !w-3 !bg-emerald-500 !border-2 !border-white shadow-[0_0_8px_rgba(16,185,129,0.6)]"
      />
    </div>
  );
}

export function AgentNode({ data }: { data: { label: string } }) {
  return (
    <div className="relative group rounded-xl border border-gray-200/60 bg-white/90 p-4 shadow-sm backdrop-blur-xl transition-all hover:shadow-lg hover:border-purple-500/50 w-[240px]">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-fuchsia-500 to-purple-600 rounded-t-xl" />

      {/* Input Handle */}
      <Handle
        type="target"
        position={Position.Left}
        className="!h-3 !w-3 !bg-purple-500 !border-2 !border-white"
      />

      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-purple-50 text-purple-600 shadow-inner relative">
          <Bot className="h-5 w-5" />
          <Sparkles className="absolute -top-1 -right-1 h-3 w-3 text-fuchsia-400" />
        </div>
        <div className="flex flex-col">
          <span className="text-xs font-bold uppercase tracking-wider text-purple-600 mb-0.5">
            AI Engine
          </span>
          <span className="text-sm font-semibold text-gray-900">
            {data.label}
          </span>
        </div>
      </div>

      {/* Output Handle */}
      <Handle
        type="source"
        position={Position.Right}
        className="!h-3 !w-3 !bg-purple-500 !border-2 !border-white shadow-[0_0_8px_rgba(168,85,247,0.6)]"
      />
    </div>
  );
}

export function ActionNode({
  data,
}: {
  data: { label: string; iconColor: string };
}) {
  // Map the border color prop to background/text colors for the icon box
  const colorBase = data.iconColor.includes("indigo") ? "indigo" : "black";

  return (
    <div
      className={`relative group ${colorBase === "indigo" ? "bg-indigo-900 border-t-4" : "bg-black border-t-4"} rounded-xl border border-gray-200/60 bg-white/90 p-4 shadow-sm backdrop-blur-xl transition-all hover:shadow-lg w-[240px] ${colorBase === "indigo" ? "hover:border-indigo-500/50" : "hover:border-slate-800/50"}`}
    >
      {/* <div
        className={`absolute top-0 left-0 w-[99%] mx-auto h-1 rounded-t-xl }
      /> */}

      {/* Input Handle */}
      <Handle
        type="target"
        position={Position.Left}
        className={`!h-3 !w-3 !border-2 !border-white ${colorBase === "indigo" ? "!bg-indigo-500" : "!bg-slate-800"}`}
      />

      <div className="flex items-start gap-3">
        <div
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg shadow-inner ${colorBase === "indigo" ? "bg-indigo-50 text-indigo-600" : "bg-slate-100 text-slate-700"}`}
        >
          <Send className="h-4 w-4" />
        </div>
        <div className="flex flex-col">
          <span
            className={`text-xs font-bold uppercase tracking-wider mb-0.5 ${colorBase === "indigo" ? "text-indigo-600" : "text-black"}`}
          >
            Execute Action
          </span>
          <span className="text-sm font-semibold text-gray-900">
            {data.label}
          </span>
        </div>
      </div>
    </div>
  );
}
