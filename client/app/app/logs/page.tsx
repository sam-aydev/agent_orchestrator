import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Activity, ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import LogsTable from "@/components/logs/logstable";

export default async function LogsPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const supabase = await createClient();
  const resolvedParams = await searchParams;

  // 1. Pagination Setup
  const ITEMS_PER_PAGE = 3;
  const currentPage = Number(resolvedParams?.page) || 1;
  const from = (currentPage - 1) * ITEMS_PER_PAGE;
  const to = from + ITEMS_PER_PAGE - 1;

  // 2. Verify the user session securely on the server
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // 3. Fetch the user's workflows
  const { data: workflows } = await supabase
    .from("workflows")
    .select("id, name")
    .eq("user_id", user.id);

  const workflowIds = workflows?.map((w) => w.id) || [];

  // 4. Fetch Paginated Execution Logs
  let logs: any[] = [];
  let totalCount = 0;

  if (workflowIds.length > 0) {
    const { data: executionLogs, count } = await supabase
      .from("execution_logs")
      .select("*", { count: "exact" })
      .in("workflow_id", workflowIds)
      .order("executed_at", { ascending: false })
      .range(from, to);

    logs = executionLogs || [];
    totalCount = count || 0;
  }

  const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);

  return (
    <div className="w-full h-screen bg-[#f8fafc] flex flex-col overflow-hidden font-sans">
      
      {/* Scrollable Container */}
      <div className="mt-10 w-4/5 mx-auto flex-1 overflow-hidden pb-10">
        
        <header className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Execution Logs</h1>
            <p className="text-sm text-gray-500 mt-1">
              Monitor your AI agent's real-time routing decisions.
            </p>
          </div>
          <Link
            href="/app"
            className="bg-black text-white px-4 py-2 rounded-md text-sm font-semibold hover:bg-gray-800 transition"
          >
            Open Canvas
          </Link>
        </header>

        <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden flex flex-col">
          {logs.length === 0 ? (
            <div className="p-12 text-center flex flex-col items-center">
              <Activity className="w-12 h-12 text-gray-300 mb-4" />
              <h3 className="text-lg font-medium text-gray-900">
                No executions yet
              </h3>
              <p className="text-gray-500 mt-1 text-sm">
                Submit data to your trigger webhook to see logs appear here.
              </p>
            </div>
          ) : (
            <>
              {/* Inject the Client Component Table */}
              <LogsTable logs={logs} />

              {/* Pagination Controls */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between border-t border-gray-200 bg-gray-50 px-6 py-3">
                  <p className="text-xs text-gray-500">
                    Showing{" "}
                    <span className="font-medium text-gray-900">
                      {from + 1}
                    </span>{" "}
                    to{" "}
                    <span className="font-medium text-gray-900">
                      {Math.min(to + 1, totalCount)}
                    </span>{" "}
                    of{" "}
                    <span className="font-medium text-gray-900">
                      {totalCount}
                    </span>{" "}
                    results
                  </p>

                  <div className="flex gap-2">
                    <Link
                      href={`/app/logs?page=${currentPage - 1}`}
                      className={`flex items-center gap-1 px-3 py-1.5 text-xs font-medium border border-gray-300 rounded-md bg-white text-gray-700 hover:bg-gray-50 transition ${
                        currentPage <= 1 ? "pointer-events-none opacity-50" : ""
                      }`}
                    >
                      <ChevronLeft className="w-4 h-4" />
                      Prev
                    </Link>
                    <Link
                      href={`/app/logs?page=${currentPage + 1}`}
                      className={`flex items-center gap-1 px-3 py-1.5 text-xs font-medium border border-gray-300 rounded-md bg-white text-gray-700 hover:bg-gray-50 transition ${
                        currentPage >= totalPages
                          ? "pointer-events-none opacity-50"
                          : ""
                      }`}
                    >
                      Next
                      <ChevronRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}