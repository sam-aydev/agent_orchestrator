"use client";

import { useState, useEffect, useTransition } from "react";
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
  Menu,
  X,
  Loader2,
} from "lucide-react";
import { signout } from "@/lib/actions/auth";
import { createBlankWorkflow, getWorkflowById } from "@/lib/actions/workflow";
import { toast } from "sonner";
import { useTheme } from "next-themes";
import { motion, AnimatePresence } from "framer-motion";

export function Header() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [title, setTitle] = useState("Agentic Orchestrator");
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const [isSigningOut, startSignout] = useTransition();

  const router = useRouter();
  const { theme, setTheme } = useTheme();

  const handleCreate = async () => {
    try {
      setIsCreating(true);
      const result = await createBlankWorkflow();

      if (result.success && result.workflowId) {
        router.push(`/app?workflowId=${result.workflowId}`);
        setIsMobileMenuOpen(false); // Close menu if triggered from mobile
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

  const handleSignOut = (e: React.FormEvent) => {
    e.preventDefault();
    startSignout(async () => {
      await signout();
    });
  };

  const workflowId = searchParams.get("workflowId");

  // SEPARATED LOGIC:
  // 1. Used for navigation tab highlighting
  const isBuilderRoute = pathname === "/app";
  const isLogsActive = pathname === "/app/logs";
  const isWorkflowsActive = pathname === "/app/workflows";

  // 2. Used to allow title editing and saving (only when a workspace is loaded)
  const isWorkspaceActive = isBuilderRoute && !!workflowId;

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
    <header className="fixed top-0 inset-x-0 h-16 bg-white/70 dark:bg-gray-900/80 backdrop-blur-lg border-b border-gray-200/80 dark:border-gray-800 flex items-center px-4 sm:px-6 justify-between shrink-0 z-50 shadow-sm transition-colors">
      <div className="flex items-center gap-4 sm:gap-8">
        {/* MOBILE MENU TOGGLE */}
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="lg:hidden p-2 -ml-2 rounded-md text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
        >
          {isMobileMenuOpen ? (
            <X className="w-5 h-5" />
          ) : (
            <Menu className="w-5 h-5" />
          )}
        </button>

        <div className="flex items-center gap-2 sm:gap-3">
          <div className="relative flex h-3 w-3 shrink-0 hidden sm:flex">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
          </div>

          {isEditing && isWorkspaceActive ? (
            <input
              autoFocus
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onBlur={() => {
                setIsEditing(false);
                triggerSave();
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  setIsEditing(false);
                  triggerSave();
                }
              }}
              className="font-bold text-gray-900 dark:text-gray-100 tracking-tight bg-white dark:bg-gray-950 border border-emerald-500 rounded-md px-2 py-0.5 outline-none ring-2 ring-emerald-500/20 text-base w-32 sm:w-56 transition-all"
            />
          ) : (
            <div
              onClick={() => isWorkspaceActive && setIsEditing(true)}
              className={`group flex items-center gap-2 ${isWorkspaceActive ? "cursor-pointer hover:bg-gray-100/80 dark:hover:bg-gray-800/80" : ""} px-2 py-0.5 -ml-2 rounded-md transition-colors max-w-[140px] sm:max-w-none`}
              title={
                isWorkspaceActive
                  ? "Click to rename workflow"
                  : "Agentic Orchestrator"
              }
            >
              <h1 className="font-bold text-gray-900 dark:text-gray-100 tracking-tight select-none truncate">
                {title}
              </h1>
              {isWorkspaceActive && (
                <Edit2 className="w-3.5 h-3.5 shrink-0 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity hidden sm:block" />
              )}
            </div>
          )}
        </div>

        {/* DESKTOP NAVIGATION */}
        <div className="hidden lg:flex items-center gap-1 text-sm font-medium bg-gray-100/70 dark:bg-gray-800/50 p-1 rounded-lg border border-gray-200/50 dark:border-gray-700/50 transition-colors">
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
              isBuilderRoute
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

      {/* QUICK ACTIONS */}
      <div className="flex items-center gap-2 sm:gap-4">
        <button
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          className="cursor-pointer p-2 rounded-full text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800 transition-colors"
        >
          {theme === "dark" ? (
            <Sun className="h-4 w-4" />
          ) : (
            <Moon className="h-4 w-4" />
          )}
        </button>

        <button
          onClick={handleCreate}
          disabled={isCreating}
          className="cursor-pointer bg-emerald-600 text-white px-3 sm:px-4 py-2 rounded-lg text-sm font-semibold hover:bg-emerald-700 transition-all flex items-center gap-2 disabled:opacity-50"
        >
          {isCreating ? (
            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin shrink-0" />
          ) : (
            <Plus className="w-4 h-4 shrink-0" />
          )}
          <span className="hidden sm:inline">New Agent</span>
        </button>

        {isWorkspaceActive && (
          <button
            onClick={triggerSave}
            disabled={isSaving}
            className="bg-gray-900 dark:bg-white cursor-pointer text-white dark:text-gray-900 px-3 sm:px-5 py-2 rounded-lg text-sm font-semibold hover:bg-gray-800 dark:hover:bg-gray-100 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 shadow-md hover:shadow-lg"
          >
            {isSaving ? (
              <>
                <div className="w-3.5 h-3.5 border-2 border-white/30 dark:border-gray-900/30 border-t-white dark:border-t-gray-900 rounded-full animate-spin shrink-0" />
                <span className="hidden sm:inline">Deploying...</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4 shrink-0" />
                <span className="hidden sm:inline">Save Workspace</span>
              </>
            )}
          </button>
        )}

        <div className="w-px h-6 bg-gray-200 dark:bg-gray-700 mx-1 hidden sm:block transition-colors"></div>

        {/* DESKTOP SIGNOUT BUTTON */}
        <form onSubmit={handleSignOut} className="hidden sm:block">
          <button
            type="submit"
            title="Sign Out"
            disabled={isSigningOut}
            className="text-gray-500 dark:text-gray-400 cursor-pointer hover:text-red-600 dark:hover:text-red-500 transition-colors p-2 rounded-full hover:bg-red-50 dark:hover:bg-red-950/30 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSigningOut ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <LogOut className="w-4 h-4" />
            )}
          </button>
        </form>
      </div>

      {/* MOBILE DROPDOWN MENU & BACKDROP */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            {/* INVISIBLE BACKDROP (Click outside to close) */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 top-16 z-30 bg-gray-900/20 dark:bg-black/40 backdrop-blur-sm lg:hidden cursor-pointer"
            />

            {/* DROPDOWN PANEL */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="absolute top-16 left-0 w-full bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 shadow-2xl lg:hidden flex flex-col p-4 z-40 rounded-b-3xl transition-colors"
            >
              <div className="flex flex-col gap-2">
                <Link
                  href="/app/workflows"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`px-4 py-3.5 rounded-xl flex items-center gap-3 transition-colors ${
                    isWorkflowsActive
                      ? "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-semibold"
                      : "text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800/80 font-medium"
                  }`}
                >
                  <Layers className="w-5 h-5" />
                  Workflows
                </Link>

                <Link
                  href="/app"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`px-4 py-3.5 rounded-xl flex items-center gap-3 transition-colors ${
                    isBuilderRoute
                      ? "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-semibold"
                      : "text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800/80 font-medium"
                  }`}
                >
                  <LayoutTemplate className="w-5 h-5" />
                  Builder
                </Link>

                <Link
                  href="/app/logs"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`px-4 py-3.5 rounded-xl flex items-center gap-3 transition-colors ${
                    isLogsActive
                      ? "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-semibold"
                      : "text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800/80 font-medium"
                  }`}
                >
                  <Activity className="w-5 h-5" />
                  Logs
                </Link>

                <div className="h-px bg-gray-100 dark:bg-gray-800/80 my-3"></div>

                {/* MOBILE SIGNOUT BUTTON */}
                <form onSubmit={handleSignOut}>
                  <button
                    type="submit"
                    disabled={isSigningOut}
                    className="w-full px-4 py-3.5 rounded-xl flex items-center gap-3 font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors text-left disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSigningOut ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <LogOut className="w-5 h-5" />
                    )}
                    {isSigningOut ? "Signing Out..." : "Sign Out"}
                  </button>
                </form>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  );
}