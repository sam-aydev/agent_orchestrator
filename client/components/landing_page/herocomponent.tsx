"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Zap } from "lucide-react";

export function HeroAnimation() {
  return (
    <div className="mx-auto max-w-7xl px-6 text-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <div className="mx-auto mb-6 flex max-w-fit items-center justify-center space-x-2 overflow-hidden rounded-full border border-emerald-200 dark:border-emerald-500/30 bg-emerald-50 dark:bg-emerald-500/10 px-7 py-2 shadow-sm transition-colors">
          <Zap className="h-4 w-4 text-emerald-600 dark:text-emerald-400 transition-colors" />
          <p className="text-sm font-semibold text-emerald-700 dark:text-emerald-400 transition-colors">
            Groq LLM Engine Now Live
          </p>
        </div>
      </motion.div>

      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1, ease: "easeOut" }}
        className="mx-auto max-w-4xl text-5xl font-extrabold tracking-tighter sm:text-7xl transition-colors"
      >
        Orchestrate AI Agents <br className="hidden sm:block" />
          At The Speed of Thought
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2, ease: "easeOut" }}
        className="mx-auto mt-6 max-w-2xl text-lg text-gray-500 dark:text-gray-400 leading-relaxed transition-colors"
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
          className="group flex w-full items-center justify-center gap-2 rounded-xl bg-black dark:bg-white px-8 py-4 text-base font-semibold text-white dark:text-black shadow-xl transition-all hover:bg-gray-800 dark:hover:bg-gray-200 hover:shadow-2xl hover:-translate-y-0.5 active:scale-95 sm:w-auto"
        >
          Start Building Free
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
        </Link>
      </motion.div>
    </div>
  );
}