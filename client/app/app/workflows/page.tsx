import { getAllUserWorkflows } from "@/lib/actions/workflow";
import { Bot, Layers, ChevronLeft, ChevronRight, SearchX } from "lucide-react";
import WorkflowCard from "@/components/workflow/workflowcard";
import WorkflowSearch from "@/components/workflow/workflowsearch";
import Link from "next/link";
import { Suspense } from "react";

export default async function WorkflowsPage(props: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const searchParams = await props.searchParams;

  const currentPage = Number(searchParams?.page) || 1;
  const search =
    typeof searchParams?.search === "string" ? searchParams.search : "";
  const limit = 9;

  // Pass the search term to your Supabase query
  const result = await getAllUserWorkflows(currentPage, limit, search);
  const workflows = result.data || [];
  const totalPages = result.totalPages || 1;

  // Helper string to keep search param intact when clicking Next/Prev pages
  const searchQueryParam = search
    ? `&search=${encodeURIComponent(search)}`
    : "";

  return (
    <div className="w-full h-full overflow-y-auto bg-[#f8fafc] dark:bg-gray-950 font-sans flex flex-col items-center pb-24 transition-colors">
      <div className="w-full max-w-6xl px-6 py-12">
        <header className="mb-10">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-3">
            <Layers className="w-8 h-8 text-emerald-600 dark:text-emerald-500" />
            Your Workflows
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-2 text-sm">
            Manage, edit, and monitor your automated agentic pipelines.
          </p>
        </header>

        <Suspense
          fallback={
            <div className="w-full max-w-md h-10 bg-gray-100 dark:bg-gray-800 rounded-xl animate-pulse mb-8" />
          }
        >
          <WorkflowSearch initialSearch={search} />
        </Suspense>
        {workflows.length === 0 ? (
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-12 text-center flex flex-col items-center shadow-sm">
            {search ? (
              <>
                <div className="w-16 h-16 bg-gray-50 dark:bg-gray-800 rounded-2xl flex items-center justify-center mb-6">
                  <SearchX className="w-8 h-8 text-gray-400 dark:text-gray-500" />
                </div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                  No matches found
                </h2>
                <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto mb-6">
                  We couldn't find any workflows matching "{search}".
                </p>
                <Link
                  href="/app/workflows"
                  className="text-emerald-600 hover:text-emerald-700 font-medium text-sm"
                >
                  Clear search
                </Link>
              </>
            ) : (
              // UI when the user has 0 workflows in their account
              <>
                <div className="w-16 h-16 bg-emerald-50 dark:bg-emerald-500/10 rounded-2xl flex items-center justify-center mb-6">
                  <Bot className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />
                </div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                  No workflows found
                </h2>
                <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto">
                  You haven't created any agents yet. Click "New Agent" in the
                  navigation bar to build your first workflow.
                </p>
              </>
            )}
          </div>
        ) : (
          <>
            {/* GRID OF WORKFLOWS */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {workflows.map((workflow: any) => (
                <WorkflowCard key={workflow.id} workflow={workflow} />
              ))}
            </div>

            {/* PAGINATION CONTROLS */}
            {totalPages > 1 && (
              <div className="mt-12 flex items-center justify-center gap-4">
                <Link
                  href={`/app/workflows?page=${currentPage - 1}${searchQueryParam}`}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold border transition-all ${
                    currentPage <= 1
                      ? "border-gray-200 dark:border-gray-800 text-gray-400 dark:text-gray-600 bg-gray-50 dark:bg-gray-900/50 pointer-events-none"
                      : "border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 shadow-sm"
                  }`}
                  aria-disabled={currentPage <= 1}
                >
                  <ChevronLeft className="w-4 h-4" />
                  Previous
                </Link>

                <div className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Page{" "}
                  <span className="text-gray-900 dark:text-gray-100 font-bold">
                    {currentPage}
                  </span>{" "}
                  of {totalPages}
                </div>

                <Link
                  href={`/app/workflows?page=${currentPage + 1}${searchQueryParam}`}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold border transition-all ${
                    currentPage >= totalPages
                      ? "border-gray-200 dark:border-gray-800 text-gray-400 dark:text-gray-600 bg-gray-50 dark:bg-gray-900/50 pointer-events-none"
                      : "border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 shadow-sm"
                  }`}
                  aria-disabled={currentPage >= totalPages}
                >
                  Next
                  <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
