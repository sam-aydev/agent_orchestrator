import { Suspense } from "react";
import { Loader2 } from "lucide-react";
import { SignUp } from "@/components/auth/signup";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Create Account - Agentic Orchestrator",
  description: "Create your account to start building, deploying, and monitoring autonomous AI pipelines.",
};

export default function SignupPage() {
  return (
    <Suspense
      fallback={
        <div className="flex h-screen items-center justify-center bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100 transition-colors">
          <Loader2 className="size-12 animate-spin text-emerald-500" />
        </div>
      }
    >
      <SignUp />
    </Suspense>
  );
}
