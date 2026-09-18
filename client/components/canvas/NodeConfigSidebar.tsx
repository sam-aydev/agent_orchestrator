"use client";

import { X, ExternalLink, Key, Hash, Link2 } from "lucide-react";

interface NodeConfigSidebarProps {
  selectedNode: any | null;
  onClose: () => void;
  onUpdateNodeData: (id: string, key: string, value: string) => void;
}

export function NodeConfigSidebar({
  selectedNode,
  onClose,
  onUpdateNodeData,
}: NodeConfigSidebarProps) {
  const { id, data } = selectedNode;
  const nodeType = data.type || selectedNode.type;

  return (
    <aside className="w-84 h-full bg-white dark:bg-gray-900 border-l border-gray-200 dark:border-gray-800 shadow-xl flex flex-col z-20 transition-colors duration-200 ease-in-out">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between bg-gray-50/50 dark:bg-gray-800/50 transition-colors">
        <div>
          <h3 className="font-semibold text-gray-900 dark:text-gray-100 text-sm transition-colors">
            Configure Node
          </h3>
          <p className="text-xs text-gray-500 dark:text-gray-400 font-mono mt-0.5 transition-colors">
            ID: {id} ({data.label})
          </p>
        </div>
        <button
          onClick={onClose}
          className="p-1 rounded-md text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Form Fields Body */}
      <div className="p-5 flex-1 overflow-y-auto space-y-5 text-sm">
        {/* Case 1: Tally Webhook Trigger */}
        {nodeType === "trigger" && (
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1 transition-colors">
                Generated Webhook URL
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  readOnly
                  value={`http://localhost:8000/api/v1/webhooks/${data.endpointSecret || "sec_demo_123"}`}
                  className="w-full text-xs font-mono text-black dark:text-gray-200 bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded p-2 select-all transition-colors"
                />
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 transition-colors">
                Paste this into your Tally Form webhook settings. Incoming
                submissions will trigger this workflow.
              </p>
            </div>
          </div>
        )}

        {/* Case 2: Groq AI Classifier */}
        {nodeType === "agent" && (
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1 transition-colors">
                Engine Model
              </label>
              <input
                type="text"
                disabled
                value="groq:openai/gpt-oss-20b"
                className="w-full text-xs text-gray-500 dark:text-gray-400 font-mono bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded p-2 transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1 transition-colors">
                Output Schema
              </label>
              <pre className="text-[11px] font-mono bg-gray-900 dark:bg-black text-gray-200 p-3 rounded-md overflow-x-auto border border-transparent dark:border-gray-800 transition-colors">
                {`{
  intent: string,
  priority: "low" | "medium" | "high" | "critical",
  summary: string,
  sentiment: string
}`}
              </pre>
            </div>
          </div>
        )}

        {/* Case 3: Discord Action */}
        {data.actionType === "discord" && (
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1.5 flex items-center gap-1.5 transition-colors">
                <Link2 className="w-3.5 h-3.5 text-indigo-500 dark:text-indigo-400" />
                Discord Webhook URL
              </label>
              <input
                type="password"
                placeholder="https://discord.com/api/webhooks/..."
                value={data.discordWebhookUrl || ""}
                onChange={(e) =>
                  onUpdateNodeData(id, "discordWebhookUrl", e.target.value)
                }
                className="w-full text-xs text-black dark:text-white bg-white dark:bg-gray-950 border border-gray-300 dark:border-gray-700 rounded-md p-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent font-mono transition-colors placeholder:text-gray-400 dark:placeholder:text-gray-600"
              />
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1.5 leading-relaxed transition-colors">
                Triggered automatically when the AI classifies tickets as{" "}
                <strong className="text-red-600 dark:text-red-400">high</strong>{" "}
                or{" "}
                <strong className="text-red-600 dark:text-red-400">
                  critical
                </strong>
                .
              </p>
            </div>
          </div>
        )}

        {/* Case 4: Notion Action */}
        {data.actionType === "notion" && (
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1.5 flex items-center gap-1.5 transition-colors">
                <Key className="w-3.5 h-3.5 text-slate-700 dark:text-slate-400" />
                Internal Integration Token
              </label>
              <input
                type="password"
                placeholder="secret_..."
                value={data.notionApiKey || ""}
                onChange={(e) =>
                  onUpdateNodeData(id, "notionApiKey", e.target.value)
                }
                className="w-full text-xs text-black dark:text-white bg-white dark:bg-gray-950 border border-gray-300 dark:border-gray-700 rounded-md p-2.5 focus:outline-none focus:ring-2 focus:ring-slate-800 dark:focus:ring-slate-500 focus:border-transparent font-mono transition-colors placeholder:text-gray-400 dark:placeholder:text-gray-600"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1.5 flex items-center gap-1.5 transition-colors">
                <Hash className="w-3.5 h-3.5 text-slate-700 dark:text-slate-400" />
                Database ID
              </label>
              <input
                type="text"
                placeholder="32-character Notion database id"
                value={data.notionDatabaseId || ""}
                onChange={(e) =>
                  onUpdateNodeData(id, "notionDatabaseId", e.target.value)
                }
                className="w-full text-xs text-black dark:text-white bg-white dark:bg-gray-950 border border-gray-300 dark:border-gray-700 rounded-md p-2.5 focus:outline-none focus:ring-2 focus:ring-slate-800 dark:focus:ring-slate-500 focus:border-transparent font-mono transition-colors placeholder:text-gray-400 dark:placeholder:text-gray-600"
              />
            </div>
          </div>
        )}
      </div>

      {/* Footer / Status */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/50 flex justify-between items-center text-xs text-gray-500 dark:text-gray-400 transition-colors">
        <span>Auto-saved in canvas memory</span>
        <button
          onClick={onClose}
          className="bg-black dark:bg-white text-white dark:text-black px-3 py-1.5 rounded text-xs font-medium hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors"
        >
          Done
        </button>
      </div>
    </aside>
  );
}
