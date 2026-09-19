"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Bot,
  Workflow,
  Zap,
  Database,
  ShieldCheck,
  MessageSquare,
} from "lucide-react";

export default function Page() {
  return (
    <div className="h-screen w-full bg-[#fafafa] font-sans text-gray-900 selection:bg-emerald-100 selection:text-emerald-900">
      {/* Navigation */}
      <header className="fixed inset-x-0 top-0 z-50 border-b border-gray-200/50 dark:border-gray-800/50 bg-white/70 dark:bg-black backdrop-blur-lg transition-colors">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
          {/* BRANDING */}
          <div className="flex items-center gap-2 font-bold tracking-tight text-gray-900 dark:text-gray-100">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-black dark:bg-white transition-colors">
              <Bot className="h-5 w-5 text-white dark:text-black transition-colors" />
            </div>
            {/* Hidden on ultra-small mobile screens, visible on 'sm' and up */}
            <span className="hidden sm:inline-block">Agentic Orchestrator</span>
          </div>

          {/* ACTIONS */}
          <div className="flex items-center gap-3 sm:gap-4 text-sm font-medium">
            <Link
              href="/login"
              className="text-gray-600 dark:text-white transition-colors hover:text-gray-900 dark:hover:text-gray-100"
            >
              Sign In
            </Link>
            <Link
              href="/signup"
              className="rounded-lg bg-black dark:bg-white px-3 py-1.5 sm:px-4 sm:py-2 text-white dark:text-black transition-all hover:bg-gray-800 dark:hover:bg-gray-200 active:scale-95 text-xs sm:text-sm"
            >
              Get Started
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-32 ">
        {/* Subtle Background Gradients */}
        <div className="absolute left-1/2 top-0 -z-10 h-[800px] w-[800px] -translate-x-1/2 opacity-30 blur-[100px] bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-emerald-200 via-transparent to-transparent" />

        <div className="mx-auto max-w-7xl px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          >
            <div className="mx-auto mb-6 flex max-w-fit items-center justify-center space-x-2 overflow-hidden rounded-full border border-emerald-200 bg-emerald-50 px-7 py-2 shadow-sm">
              <Zap className="h-4 w-4 text-emerald-600" />
              <p className="text-sm font-semibold text-emerald-700">
                Groq LLM Engine Now Live
              </p>
            </div>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1, ease: "easeOut" }}
            className="mx-auto max-w-4xl text-5xl font-extrabold tracking-tighter sm:text-7xl"
          >
            Orchestrate AI Agents <br className="hidden sm:block" />
            <span>At The Speed of Thought</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2, ease: "easeOut" }}
            className="mx-auto mt-6 max-w-2xl text-lg text-gray-500 leading-relaxed"
          >
            The enterprise-grade visual canvas for designing, deploying, and
            monitoring autonomous AI pipelines. Powered by React Flow, Groq, and
            Supabase.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3, ease: "easeOut" }}
            className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row"
          >
            <Link
              href="/signup"
              className="group flex w-full items-center justify-center gap-2 rounded-xl bg-black px-8 py-4 text-base font-semibold text-white shadow-xl transition-all hover:bg-gray-800 hover:shadow-2xl hover:-translate-y-0.5 active:scale-95 sm:w-auto"
            >
              Start Building Free
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
