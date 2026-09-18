import { Handle, Position } from "@xyflow/react";
import { Webhook, Bot, Send, Sparkles } from "lucide-react";

export function TriggerNode({ data }: { data: { label: string } }) {
  return (
    <div className="relative group rounded-xl border border-gray-200/60 dark:border-gray-700/60 bg-white/90 dark:bg-gray-800/90 p-4 shadow-sm backdrop-blur-xl transition-all hover:shadow-lg hover:border-emerald-500/50 dark:hover:border-emerald-500/50 w-[240px]">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-400 to-teal-400 rounded-t-xl" />

      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 shadow-inner transition-colors">
          <Webhook className="h-5 w-5" />
        </div>
        <div className="flex flex-col">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-500 mb-0.5 transition-colors">
            Trigger Event
          </span>
          <span className="text-sm font-semibold text-gray-900 dark:text-gray-100 transition-colors">
            {data.label}
          </span>
        </div>
      </div>

      <Handle
        type="source"
        position={Position.Right}
        className="!h-3 !w-3 !bg-emerald-500 !border-2 !border-white dark:!border-gray-800 shadow-[0_0_8px_rgba(16,185,129,0.6)] transition-colors"
      />
    </div>
  );
}

export function AgentNode({ data }: { data: { label: string } }) {
  return (
    <div className="relative group rounded-xl border border-gray-200/60 dark:border-gray-700/60 bg-white/90 dark:bg-gray-800/90 p-4 shadow-sm backdrop-blur-xl transition-all hover:shadow-lg hover:border-purple-500/50 dark:hover:border-purple-500/50 w-[240px]">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-fuchsia-500 to-purple-600 rounded-t-xl" />

      <Handle
        type="target"
        position={Position.Left}
        className="!h-3 !w-3 !bg-purple-500 !border-2 !border-white dark:!border-gray-800 transition-colors"
      />

      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-purple-50 dark:bg-purple-500/10 text-purple-600 dark:text-purple-400 shadow-inner relative transition-colors">
          <Bot className="h-5 w-5" />
          <Sparkles className="absolute -top-1 -right-1 h-3 w-3 text-fuchsia-400 dark:text-fuchsia-300" />
        </div>
        <div className="flex flex-col">
          <span className="text-xs font-bold uppercase tracking-wider text-purple-600 dark:text-purple-400 mb-0.5 transition-colors">
            AI Engine
          </span>
          <span className="text-sm font-semibold text-gray-900 dark:text-gray-100 transition-colors">
            {data.label}
          </span>
        </div>
      </div>

      <Handle
        type="source"
        position={Position.Right}
        className="!h-3 !w-3 !bg-purple-500 !border-2 !border-white dark:!border-gray-800 shadow-[0_0_8px_rgba(168,85,247,0.6)] transition-colors"
      />
    </div>
  );
}

export function ActionNode({
  data,
}: {
  data: { label: string; iconColor: string };
}) {
  const colorBase = data.iconColor.includes("indigo") ? "indigo" : "black";

  return (
    <div
      className={`relative group rounded-xl border border-gray-200/60 dark:border-gray-700/60 bg-white/90 dark:bg-gray-800/90 p-4 shadow-sm backdrop-blur-xl transition-all hover:shadow-lg w-[240px] border-t-4 ${
        colorBase === "indigo"
          ? "border-t-indigo-500 hover:border-indigo-500/50 dark:hover:border-indigo-500/50"
          : "border-t-slate-800 dark:border-t-slate-500 hover:border-slate-800/50 dark:hover:border-slate-400/50"
      }`}
    >
      <Handle
        type="target"
        position={Position.Left}
        className={`!h-3 !w-3 !border-2 !border-white dark:!border-gray-800 transition-colors ${
          colorBase === "indigo"
            ? "!bg-indigo-500"
            : "!bg-slate-800 dark:!bg-slate-500"
        }`}
      />

      <div className="flex items-start gap-3">
        <div
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg shadow-inner transition-colors ${
            colorBase === "indigo"
              ? "bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400"
              : "bg-slate-100 dark:bg-slate-700/50 text-slate-700 dark:text-slate-300"
          }`}
        >
          <Send className="h-4 w-4" />
        </div>
        <div className="flex flex-col">
          <span
            className={`text-xs font-bold uppercase tracking-wider mb-0.5 transition-colors ${
              colorBase === "indigo"
                ? "text-indigo-600 dark:text-indigo-400"
                : "text-black dark:text-gray-300"
            }`}
          >
            Execute Action
          </span>
          <span className="text-sm font-semibold text-gray-900 dark:text-gray-100 transition-colors">
            {data.label}
          </span>
        </div>
      </div>
    </div>
  );
}
