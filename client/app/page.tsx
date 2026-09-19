import Link from "next/link";
import { Bot, Zap } from "lucide-react";
import { HeroAnimation } from "@/components/landing_page/herocomponent";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Agentic Orchestrator | Orchestrate AI Agents At The Speed of Thought",
  description:
    "The enterprise-grade visual canvas for designing, deploying, and monitoring autonomous AI pipelines. Powered by React Flow, Groq, and Supabase.",
  openGraph: {
    title: "Agentic Orchestrator",
    description: "Orchestrate AI Agents At The Speed of Thought",
    type: "website",
  },
};


export default function Page() {
  return (
    <div className="h-screen w-full bg-[#fafafa] dark:bg-gray-950 font-sans text-gray-900 dark:text-gray-100 selection:bg-emerald-100 selection:text-emerald-900 dark:selection:bg-emerald-900/30 dark:selection:text-emerald-200 transition-colors duration-200">
      {/* Navigation */}
      <header className="fixed inset-x-0 top-0 z-50 border-b border-gray-200/50 dark:border-gray-800/50 bg-white/70 dark:bg-gray-950/70 backdrop-blur-lg transition-colors">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
          <div className="flex items-center gap-2 font-bold tracking-tight text-gray-900 dark:text-gray-100 transition-colors">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-black dark:bg-white transition-colors">
              <Bot className="h-5 w-5 text-white dark:text-black transition-colors" />
            </div>
            <span className="hidden sm:inline-block">Agentic Orchestrator</span>
          </div>

          <div className="flex items-center gap-3 sm:gap-4 text-sm font-medium">
            <Link
              href="/login"
              className="text-gray-600 dark:text-gray-400 transition-colors hover:text-gray-900 dark:hover:text-gray-100"
            >
              Sign In
            </Link>
            <Link
              href="/signup"
              className="rounded-lg bg-black dark:bg-white px-3 py-1.5 sm:px-4 sm:py-2 text-white dark:text-black transition-all hover:bg-gray-800 dark:hover:bg-gray-200 active:scale-95 text-xs sm:text-sm shadow-sm"
            >
              Get Started
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-32 h-full flex flex-col items-center">
        <div className="absolute left-1/2 top-0 -z-10 h-[800px] w-[800px] -translate-x-1/2 opacity-30 dark:opacity-20 blur-[100px] bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-emerald-200 dark:from-emerald-600 via-transparent to-transparent transition-opacity" />

        {/* Render client animation component */}
        <HeroAnimation />
      </section>
    </div>
  );
}
