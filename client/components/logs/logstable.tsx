"use client";

import { useState } from "react";
import Link from "next/link";
import {
  CheckCircle2,
  XCircle,
  Activity,
  Bot,
  X,
  ExternalLink,
} from "lucide-react";

export default function LogsTable({ logs }: { logs: any[] }) {
  const [selectedLog, setSelectedLog] = useState<any | null>(null);

  return (
    <>
      <div className="w-full overflow-x-auto">
        <table className="w-full text-left text-sm border-collapse min-w-200">
          <thead className="bg-gray-50 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-800 text-gray-600 dark:text-gray-400 sticky top-0 z-10 transition-colors">
            <tr>
              <th className="px-6 py-4 font-semibold">Timestamp</th>
              <th className="px-6 py-4 font-semibold">AI Classification</th>
              <th className="px-6 py-4 font-semibold">Priority</th>
              <th className="px-6 py-4 font-semibold">Discord Status</th>
              <th className="px-6 py-4 font-semibold">Notion Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
            {logs.map((log) => (
              <tr
                key={log.id}
                onClick={() => setSelectedLog(log)}
                className="hover:bg-gray-50/80 dark:hover:bg-gray-800/50 transition-colors group cursor-pointer"
              >
                <td className="px-6 py-4 text-gray-500 dark:text-gray-400 font-mono text-xs whitespace-nowrap transition-colors">
                  {new Date(log.executed_at).toLocaleString()}
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <Bot className="w-4 h-4 text-purple-500 dark:text-purple-400" />
                    <span className="font-medium text-gray-900 dark:text-gray-100 capitalize transition-colors">
                      {log.ai_classification?.intent?.replace("_", " ")}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 truncate max-w-xs transition-colors">
                    {log.ai_classification?.summary}
                  </p>
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-medium border transition-colors ${
                      log.ai_classification?.priority === "critical"
                        ? "bg-red-50 dark:bg-red-500/10 text-red-700 dark:text-red-400 border-red-200 dark:border-red-500/20"
                        : log.ai_classification?.priority === "high"
                          ? "bg-orange-50 dark:bg-orange-500/10 text-orange-700 dark:text-orange-400 border-orange-200 dark:border-orange-500/20"
                          : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-700"
                    }`}
                  >
                    {log.ai_classification?.priority?.toUpperCase()}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <StatusBadge status={log.discord_status} />
                </td>
                <td className="px-6 py-4">
                  <StatusBadge status={log.notion_status} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Detail Modal Overlay */}
      {selectedLog && (
        <div className="fixed inset-0 z-100 flex items-center justify-center bg-gray-900/40 dark:bg-black/60 backdrop-blur-sm p-4 transition-all">
          <div className="w-full max-w-2xl bg-white dark:bg-gray-900 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 transition-colors">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/50 transition-colors">
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-100 dark:bg-purple-500/10 text-purple-600 dark:text-purple-400 transition-colors">
                  <Bot className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-gray-100 transition-colors">
                    Execution Detail
                  </h3>
                  <p className="text-xs font-mono text-gray-600 dark:text-gray-400 transition-colors">
                    {new Date(selectedLog.executed_at).toLocaleString()}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedLog(null)}
                className="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors p-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="px-6 py-6 space-y-6">
              {/* Classification Results */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-3 transition-colors">
                  AI Analysis
                </h4>
                <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-4 border border-gray-100 dark:border-gray-700/50 transition-colors">
                  <p className="text-sm text-gray-800 dark:text-gray-200 mb-4 transition-colors">
                    {selectedLog.ai_classification?.summary}
                  </p>
                  <div className="flex gap-4">
                    <div>
                      <span className="text-xs text-gray-600 dark:text-gray-400 block mb-1 transition-colors">
                        Intent
                      </span>
                      <span className="text-sm text-gray-900 dark:text-gray-100 font-medium capitalize transition-colors">
                        {selectedLog.ai_classification?.intent?.replace(
                          "_",
                          " ",
                        )}
                      </span>
                    </div>
                    <div>
                      <span className="text-xs text-gray-600 dark:text-gray-400 block mb-1 transition-colors">
                        Priority
                      </span>
                      <span className="text-sm text-gray-900 dark:text-gray-100 font-medium capitalize transition-colors">
                        {selectedLog.ai_classification?.priority}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Routing Status */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-gray-900 dark:text-gray-100 mb-3 transition-colors">
                  Action Routing
                </h4>
                <div className="flex gap-4">
                  <div className="flex-1 bg-gray-50 dark:bg-gray-800/50 rounded-xl p-4 border border-gray-100 dark:border-gray-700/50 flex items-center justify-between transition-colors">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300 transition-colors">
                      Discord Alert
                    </span>
                    <StatusBadge status={selectedLog.discord_status} />
                  </div>
                  <div className="flex-1 bg-gray-50 dark:bg-gray-800/50 rounded-xl p-4 border border-gray-100 dark:border-gray-700/50 flex items-center justify-between transition-colors">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300 transition-colors">
                      Notion CRM
                    </span>
                    <StatusBadge status={selectedLog.notion_status} />
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 border-t border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-900 flex justify-end gap-3 transition-colors">
              <button
                onClick={() => setSelectedLog(null)}
                className="px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-200/50 dark:hover:bg-gray-800 rounded-lg transition-colors"
              >
                Close
              </button>
              <Link
                href={`/app?workflowId=${selectedLog.workflow_id}`}
                className="px-4 py-2 text-sm font-medium bg-black dark:bg-white text-white dark:text-black rounded-lg hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors flex items-center gap-2"
              >
                Open in Builder <ExternalLink className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

// Helper component
function StatusBadge({ status }: { status: string }) {
  if (status?.startsWith("success")) {
    return (
      <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 text-xs font-medium transition-colors">
        <CheckCircle2 className="w-4 h-4" />
        Success
      </div>
    );
  }
  if (status?.startsWith("skipped")) {
    return (
      <div className="flex items-center gap-1.5 text-gray-400 dark:text-gray-500 text-xs font-medium transition-colors">
        <Activity className="w-4 h-4" />
        Skipped
      </div>
    );
  }
  return (
    <div className="flex items-center gap-1.5 text-red-600 dark:text-red-400 text-xs font-medium transition-colors">
      <XCircle className="w-4 h-4" />
      Failed
    </div>
  );
}
