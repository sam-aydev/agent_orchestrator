"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation"; // Added useSearchParams
import {
  Activity,
  LogOut,
  Edit2,
  LayoutTemplate,
  Save,
  Plus,
} from "lucide-react";
import { signout } from "@/lib/actions/login";
import { createBlankWorkflow, getWorkflowById } from "@/lib/actions/workflow";
import { toast } from "sonner";

export function Header() {
  const pathname = usePathname();
  const searchParams = useSearchParams(); // Initialized the hook

  const [title, setTitle] = useState("Agentic Orchestrator");
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const router = useRouter();
  const [isCreating, setIsCreating] = useState(false);

  const handleCreate = async () => {
    setIsCreating(true);
    const result = await createBlankWorkflow();

    if (result.success && result.workflowId) {
      // Instantly route them to the new blank canvas
      router.push(`/app?workflowId=${result.workflowId}`);
    } else {
      toast.error("Failed to create workflow");
      console.log(result.error);
      setIsCreating(false);
    }
  };

  const isBuilderActive = pathname === "/app";
  const isLogsActive = pathname === "/app/logs";

  const workflowId = searchParams.get("workflowId");

  // Fixed: Standard React pattern for async data fetching inside useEffect
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
  }, [workflowId]); // Added dependency

  // Listen for save states AND workflow loads
  useEffect(() => {
    const handleSaveStart = () => setIsSaving(true);
    const handleSaveEnd = () => setIsSaving(false);

    // Catch the loaded name from the canvas
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

  // Tell the canvas to initiate the save, passing the custom title
  const triggerSave = () => {
    window.dispatchEvent(
      new CustomEvent("workflow-request-save", {
        detail: { name: title },
      }),
    );
  };

  return (
    <header className="h-16 bg-white/70 backdrop-blur-lg border-b border-gray-200/80 flex items-center px-6 justify-between shrink-0 z-50 shadow-sm transition-all">
      <div className="flex items-center gap-8">
        <div className="flex items-center gap-3">
          <div className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
          </div>

          {isEditing ? (
            <input
              autoFocus
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onBlur={() => setIsEditing(false)}
              onKeyDown={(e) => e.key === "Enter" && setIsEditing(false)}
              className="font-bold text-gray-900 tracking-tight bg-white border border-emerald-500 rounded-md px-2 py-0.5 outline-none ring-2 ring-emerald-500/20 text-base w-56 transition-all"
            />
          ) : (
            <div
              onClick={() => setIsEditing(true)}
              className="group flex items-center gap-2 cursor-pointer hover:bg-gray-100/80 px-2 py-0.5 -ml-2 rounded-md transition-colors"
              title="Click to rename workflow"
            >
              <h1 className="font-bold text-gray-900 tracking-tight select-none">
                {title}
              </h1>
              <Edit2 className="w-3.5 h-3.5 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          )}
        </div>

        <div className="hidden md:flex items-center gap-1 text-sm font-medium bg-gray-100/70 p-1 rounded-lg border border-gray-200/50">
          <Link
            href="/app"
            className={`px-3 py-1.5 rounded-md flex items-center gap-2 transition-all duration-200 ${
              isBuilderActive
                ? "bg-white text-gray-900 shadow-sm border border-gray-200/50"
                : "text-gray-500 hover:text-gray-900 hover:bg-gray-200/50 border border-transparent"
            }`}
          >
            <LayoutTemplate className="w-4 h-4" />
            Builder
          </Link>

          <Link
            href="/app/logs"
            className={`px-3 py-1.5 rounded-md flex items-center gap-2 transition-all duration-200 ${
              isLogsActive
                ? "bg-white text-gray-900 shadow-sm border border-gray-200/50"
                : "text-gray-500 hover:text-gray-900 hover:bg-gray-200/50 border border-transparent"
            }`}
          >
            <Activity className="w-4 h-4" />
            Logs
          </Link>
        </div>
      </div>

      <div className="flex items-center gap-4">
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
        {isBuilderActive && (
          <button
            onClick={triggerSave}
            disabled={isSaving}
            className="bg-gray-900 cursor-pointer text-white px-5 py-2 rounded-lg text-sm font-semibold hover:bg-gray-800 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 shadow-md shadow-gray-900/10 hover:shadow-lg"
          >
            {isSaving ? (
              <>
                <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
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

        <div className="w-px h-6 bg-gray-200 mx-1 hidden md:block"></div>

        <form action={signout}>
          <button
            type="submit"
            title="Sign Out"
            className="text-gray-500 cursor-pointer hover:text-red-600 transition-colors p-2 rounded-full hover:bg-red-50"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </form>
      </div>
    </header>
  );
}
