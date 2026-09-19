import { Suspense } from "react";
import { Loader2 } from "lucide-react";
import { Login } from "@/components/auth/login";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign In - Agentic Orchestrator",
  description: "Enter your credentials to access your Agentic Orchestrator workspace and manage your AI workflows.",
};

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100 transition-colors">
          <Loader2 className="h-6 w-6 animate-spin text-emerald-500" />
        </div>
      }
    >
      <Login />
    </Suspense>
  );
}
