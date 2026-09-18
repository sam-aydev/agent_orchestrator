"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  Activity,
  LogOut,
  Edit2,
  LayoutTemplate,
  Save,
  Plus,
  Layers,
  Sun,
  Moon,
} from "lucide-react";
import { signout } from "@/lib/actions/auth";
import { createBlankWorkflow, getWorkflowById } from "@/lib/actions/workflow";
import { toast } from "sonner";
import { useTheme } from "next-themes";

export function Header() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [title, setTitle] = useState("Agentic Orchestrator");
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const router = useRouter();
  const [isCreating, setIsCreating] = useState(false);
  const { theme, setTheme } = useTheme();

  const handleCreate = async () => {
    try {
      setIsCreating(true);
      const result = await createBlankWorkflow();

      if (result.success && result.workflowId) {
        router.push(`/app?workflowId=${result.workflowId}`);
      } else {
        toast.error("Failed to create workflow");
        setIsCreating(false);
      }
    } catch (error: any) {
      toast.error(error.message || "An error occurred");
    } finally {
      setIsCreating(false);
    }
  };

  const isBuilderActive = pathname === "/app";
  const isLogsActive = pathname === "/app/logs";
  const isWorkflowsActive = pathname === "/app/workflows";

  const workflowId = searchParams.get("workflowId");

  useEffect(() => {
    if (!workflowId) {
      setTitle("Agentic Orchestrator");
      return;
    }

    async function loadWorkflowTitle() {
      const result = await getWorkflowById(workflowId as string);
      if (result?.data?.name) {
        setTitle(result.data.name);
      }
    }
    loadWorkflowTitle();
  }, [workflowId]);

  useEffect(() => {
    const handleSaveStart = () => setIsSaving(true);
    const handleSaveEnd = () => setIsSaving(false);
    const handleWorkflowLoaded = (e: Event) => {
      const customEvent = e as CustomEvent;
      if (customEvent.detail?.name) {
        setTitle(customEvent.detail.name);
      }
    };

    window.addEventListener("workflow-save-start", handleSaveStart);
    window.addEventListener("workflow-save-end", handleSaveEnd);
    window.addEventListener("workflow-loaded", handleWorkflowLoaded);

    return () => {
      window.removeEventListener("workflow-save-start", handleSaveStart);
      window.removeEventListener("workflow-save-end", handleSaveEnd);
      window.removeEventListener("workflow-loaded", handleWorkflowLoaded);
    };
  }, []);

  const triggerSave = () => {
    window.dispatchEvent(
      new CustomEvent("workflow-request-save", {
        detail: { name: title },
      }),
    );
  };

  return (
    <header className="h-16 bg-white/70 dark:bg-gray-900/80 backdrop-blur-lg border-b border-gray-200/80 dark:border-gray-800 flex items-center px-6 justify-between shrink-0 z-50 shadow-sm transition-colors">
      <div className="flex items-center gap-8">
        <div className="flex items-center gap-3">
          <div className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
          </div>

          {isEditing && isBuilderActive ? (
            <input
              autoFocus
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onBlur={() => setIsEditing(false)}
              onKeyDown={(e) => e.key === "Enter" && setIsEditing(false)}
              className="font-bold text-gray-900 dark:text-gray-100 tracking-tight bg-white dark:bg-gray-950 border border-emerald-500 rounded-md px-2 py-0.5 outline-none ring-2 ring-emerald-500/20 text-base w-56 transition-all"
            />
          ) : (
            <div
              onClick={() => isBuilderActive && setIsEditing(true)}
              className={`group flex items-center gap-2 ${isBuilderActive ? "cursor-pointer hover:bg-gray-100/80 dark:hover:bg-gray-800/80" : ""} px-2 py-0.5 -ml-2 rounded-md transition-colors`}
              title={
                isBuilderActive
                  ? "Click to rename workflow"
                  : "Agentic Orchestrator"
              }
            >
              <h1 className="font-bold text-gray-900 dark:text-gray-100 tracking-tight select-none">
                {title}
              </h1>
              {isBuilderActive && (
                <Edit2 className="w-3.5 h-3.5 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
              )}
            </div>
          )}
        </div>

        <div className="hidden md:flex items-center gap-1 text-sm font-medium bg-gray-100/70 dark:bg-gray-800/50 p-1 rounded-lg border border-gray-200/50 dark:border-gray-700/50 transition-colors">
          <Link
            href="/app/workflows"
            className={`px-3 py-1.5 rounded-md flex items-center gap-2 transition-all duration-200 ${
              isWorkflowsActive
                ? "bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 shadow-sm border border-gray-200/50 dark:border-gray-600/50"
                : "text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 hover:bg-gray-200/50 dark:hover:bg-gray-700/50 border border-transparent"
            }`}
          >
            <Layers className="w-4 h-4" />
            Workflows
          </Link>

          <Link
            href="/app"
            className={`px-3 py-1.5 rounded-md flex items-center gap-2 transition-all duration-200 ${
              isBuilderActive
                ? "bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 shadow-sm border border-gray-200/50 dark:border-gray-600/50"
                : "text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 hover:bg-gray-200/50 dark:hover:bg-gray-700/50 border border-transparent"
            }`}
          >
            <LayoutTemplate className="w-4 h-4" />
            Builder
          </Link>

          <Link
            href="/app/logs"
            className={`px-3 py-1.5 rounded-md flex items-center gap-2 transition-all duration-200 ${
              isLogsActive
                ? "bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 shadow-sm border border-gray-200/50 dark:border-gray-600/50"
                : "text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 hover:bg-gray-200/50 dark:hover:bg-gray-700/50 border border-transparent"
            }`}
          >
            <Activity className="w-4 h-4" />
            Logs
          </Link>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          className="p-2 rounded-full text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800 transition-colors"
        >
          {theme === "dark" ? (
            <Sun className="h-4 w-4  " />
          ) : (
            <Moon className="h-4 w-4 " />
          )}
        </button>
        <button
          onClick={handleCreate}
          disabled={isCreating}
          className="cursor-pointer bg-emerald-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-emerald-700 transition-all flex items-center gap-2 disabled:opacity-50"
        >
          {isCreating ? (
            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <Plus className="w-4 h-4" />
          )}
          New Agent
        </button>
        {isBuilderActive && workflowId && (
          <button
            onClick={triggerSave}
            disabled={isSaving}
            className="bg-gray-900 dark:bg-white cursor-pointer text-white dark:text-gray-900 px-5 py-2 rounded-lg text-sm font-semibold hover:bg-gray-800 dark:hover:bg-gray-100 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 shadow-md hover:shadow-lg"
          >
            {isSaving ? (
              <>
                <div className="w-3.5 h-3.5 border-2 border-white/30 dark:border-gray-900/30 border-t-white dark:border-t-gray-900 rounded-full animate-spin" />
                Deploying...
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                Save Workspace
              </>
            )}
          </button>
        )}

        <div className="w-px h-6 bg-gray-200 dark:bg-gray-700 mx-1 hidden md:block transition-colors"></div>

        <form action={signout}>
          <button
            type="submit"
            title="Sign Out"
            className="text-gray-500 dark:text-gray-400 cursor-pointer hover:text-red-600 dark:hover:text-red-500 transition-colors p-2 rounded-full hover:bg-red-50 dark:hover:bg-red-950/30"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </form>
      </div>
    </header>
  );
}
