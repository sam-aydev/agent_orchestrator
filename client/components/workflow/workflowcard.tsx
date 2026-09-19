"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Bot, Clock, ArrowRight, Trash2, AlertTriangle } from "lucide-react";
import { deleteWorkflow } from "@/lib/actions/workflow";
import { toast } from "sonner";

export default function WorkflowCard({ workflow }: { workflow: any }) {
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleCardClick = () => {
    router.push(`/app?workflowId=${workflow.id}`);
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const result = await deleteWorkflow(workflow.id);
      if (result.success) {
        toast.success("Workflow deleted successfully");
        setIsModalOpen(false);
      } else {
        toast.error(result.error || "Failed to delete workflow");
      }
    } catch (error) {
      toast.error("An unexpected error occurred");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <div
        onClick={handleCardClick}
        className="group relative bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 hover:border-emerald-300 dark:hover:border-emerald-700 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col justify-between h-48 cursor-pointer"
      >
        <div>
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 bg-emerald-50 dark:bg-emerald-500/10 group-hover:bg-emerald-100 dark:group-hover:bg-emerald-500/20 rounded-lg flex items-center justify-center transition-colors">
              <Bot className="w-5 h-5 text-emerald-600 dark:text-emerald-400 transition-colors" />
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={(e) => {
                  e.stopPropagation(); 
                  setIsModalOpen(true);
                }}
                className="p-1.5 cursor-pointer text-gray-300 dark:text-gray-600 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-md transition-all opacity-0 group-hover:opacity-100"
                title="Delete workflow"
              >
                <Trash2 className="w-4 h-4" />
              </button>
              <ArrowRight className="w-5 h-5 text-gray-300 dark:text-gray-600 group-hover:text-emerald-500 dark:group-hover:text-emerald-400 transition-colors transform group-hover:translate-x-1" />
            </div>
          </div>
          <h3
            className="font-bold text-gray-900 dark:text-gray-100 text-lg truncate transition-colors"
            title={workflow.name}
          >
            {workflow.name}
          </h3>
        </div>

        <div className="flex items-center gap-2 text-xs text-gray-400 dark:text-gray-500 mt-4 border-t border-gray-100 dark:border-gray-800 pt-4 transition-colors">
          <Clock className="w-3.5 h-3.5" />
          <span suppressHydrationWarning>
            {workflow.updated_at
              ? `Updated ${new Date(workflow.updated_at).toLocaleDateString()}`
              : `Created ${new Date(workflow.created_at).toLocaleDateString()}`}
          </span>
        </div>
      </div>

      {/* CONFIRMATION MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 dark:bg-black/60 backdrop-blur-sm px-4">
          <div
            className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl w-full max-w-sm p-6 border border-gray-200 dark:border-gray-800 transition-colors"
            onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside the modal
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="w-10 h-10 bg-red-100 dark:bg-red-500/10 rounded-full flex items-center justify-center shrink-0 transition-colors">
                <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 dark:text-gray-100 transition-colors">
                  Delete Workflow?
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 transition-colors">
                  This action cannot be undone.
                </p>
              </div>
            </div>

            <p className="text-sm text-gray-600 dark:text-gray-300 mb-6 bg-gray-50 dark:bg-gray-800/50 p-3 rounded-lg border border-gray-100 dark:border-gray-700/50 truncate transition-colors">
              Are you sure you want to delete{" "}
              <span className="font-bold text-gray-800 dark:text-gray-100">
                {workflow.name}
              </span>
              ?
            </p>

            <div className="flex items-center gap-3 justify-end">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setIsModalOpen(false);
                }}
                disabled={isDeleting}
                className="cursor-pointer px-4 py-2 text-sm font-semibold text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-xl transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleDelete();
                }}
                disabled={isDeleting}
                className="cursor-pointer flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-red-600 hover:bg-red-700 dark:bg-red-600 dark:hover:bg-red-700 rounded-xl transition-colors shadow-sm disabled:opacity-50"
              >
                {isDeleting ? (
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <Trash2 className="w-4 h-4" />
                )}
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
