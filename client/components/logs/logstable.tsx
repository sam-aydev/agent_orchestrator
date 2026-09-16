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
        <table className="w-full text-left text-sm border-collapse min-w-[800px]">
          <thead className="bg-gray-50 border-b border-gray-200 text-gray-600 sticky top-0 z-10">
            <tr>
              <th className="px-6 py-4 font-semibold">Timestamp</th>
              <th className="px-6 py-4 font-semibold">AI Classification</th>
              <th className="px-6 py-4 font-semibold">Priority</th>
              <th className="px-6 py-4 font-semibold">Discord Status</th>
              <th className="px-6 py-4 font-semibold">Notion Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {logs.map((log) => (
              <tr
                key={log.id}
                onClick={() => setSelectedLog(log)}
                className="hover:bg-gray-50/80 transition group cursor-pointer"
              >
                <td className="px-6 py-4 text-gray-500 font-mono text-xs whitespace-nowrap">
                  {new Date(log.executed_at).toLocaleString()}
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <Bot className="w-4 h-4 text-purple-500" />
                    <span className="font-medium black capitalize">
                      {log.ai_classification?.intent?.replace("_", " ")}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1 truncate max-w-xs">
                    {log.ai_classification?.summary}
                  </p>
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-medium border ${
                      log.ai_classification?.priority === "critical"
                        ? "bg-red-50 text-red-700 border-red-200"
                        : log.ai_classification?.priority === "high"
                          ? "bg-orange-50 text-orange-700 border-orange-200"
                          : "bg-gray-100 text-gray-700 border-gray-200"
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
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-gray-900/40 backdrop-blur-sm p-4">
          <div className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gray-50/50">
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-100 text-purple-600">
                  <Bot className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">
                    Execution Detail
                  </h3>
                  <p className="text-xs font-mono text-black">
                    {new Date(selectedLog.executed_at).toLocaleString()}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedLog(null)}
                className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-md hover:bg-gray-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="px-6 py-6 space-y-6">
              {/* Classification Results */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-3">
                  AI Analysis
                </h4>
                <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                  <p className="text-sm text-gray-800 mb-4">
                    {selectedLog.ai_classification?.summary}
                  </p>
                  <div className="flex gap-4">
                    <div>
                      <span className="text-xs text-black block mb-1">
                        Intent
                      </span>
                      <span className="text-sm text-black font-medium capitalize">
                        {selectedLog.ai_classification?.intent?.replace(
                          "_",
                          " ",
                        )}
                      </span>
                    </div>
                    <div>
                      <span className="text-xs text-black block mb-1">
                        Priority
                      </span>
                      <span className="text-sm text-black   font-medium capitalize">
                        {selectedLog.ai_classification?.priority}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Routing Status */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-gray-900 mb-3">
                  Action Routing
                </h4>
                <div className="flex gap-4">
                  <div className="flex-1 bg-gray-50 rounded-xl p-4 border border-gray-100 flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">
                      Discord Alert
                    </span>
                    <StatusBadge status={selectedLog.discord_status} />
                  </div>
                  <div className="flex-1 bg-gray-50 rounded-xl p-4 border border-gray-100 flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">
                      Notion CRM
                    </span>
                    <StatusBadge status={selectedLog.notion_status} />
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 border-t border-gray-100 bg-gray-50 flex justify-end gap-3">
              <button
                onClick={() => setSelectedLog(null)}
                className="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-200/50 rounded-lg transition"
              >
                Close
              </button>
              <Link
                href={`/app?workflowId=${selectedLog.workflow_id}`}
                className="px-4 py-2 text-sm font-medium bg-black text-white rounded-lg hover:bg-gray-800 transition flex items-center gap-2"
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

// Move the StatusBadge helper function into this file
function StatusBadge({ status }: { status: string }) {
  if (status?.startsWith("success")) {
    return (
      <div className="flex items-center gap-1.5 text-emerald-600 text-xs font-medium">
        <CheckCircle2 className="w-4 h-4" />
        Success
      </div>
    );
  }
  if (status?.startsWith("skipped")) {
    return (
      <div className="flex items-center gap-1.5 text-gray-400 text-xs font-medium">
        <Activity className="w-4 h-4" />
        Skipped
      </div>
    );
  }
  return (
    <div className="flex items-center gap-1.5 text-red-600 text-xs font-medium">
      <XCircle className="w-4 h-4" />
      Failed
    </div>
  );
}
