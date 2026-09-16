"use client";

import Link from "next/link";
import { motion } from "motion/react";
import {
  ArrowRight,
  Bot,
  Workflow,
  Activity,
  ShieldCheck,
  Zap,
  Network,
} from "lucide-react";

export default function LandingPage() {
  // Animation variants for staggered entrance
  const containerVariants: any = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15, delayChildren: 0.2 },
    },
  };

  const itemVariants: any = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: "spring", stiffness: 120 },
    },
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] font-sans selection:bg-emerald-200 selection:text-emerald-900 overflow-hidden">
      {/* Navigation */}
      <header className="fixed top-0 w-full bg-white/60 backdrop-blur-md border-b border-gray-200/50 z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
            </div>
            <span className="font-bold text-gray-900 tracking-tight text-lg">
              Agentic Orchestrator
            </span>
          </div>
          <div className="flex items-center gap-4">
            <Link
              href="/login"
              className="text-sm font-medium text-gray-600 hover:text-gray-900 transition"
            >
              Sign In
            </Link>
            <Link
              href="/signup"
              className="bg-gray-900 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-800 transition shadow-sm"
            >
              Get Started
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 px-6 max-w-7xl mx-auto flex flex-col items-center text-center">
        {/* Background Decorative Gradients */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-to-tr from-purple-400/20 via-emerald-300/10 to-indigo-400/20 blur-[100px] -z-10 rounded-full" />

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="max-w-4xl flex flex-col items-center"
        >
          <motion.div
            variants={itemVariants}
            className="mb-6 flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border border-gray-200 shadow-sm text-xs font-medium text-gray-600"
          >
            <Bot className="w-3.5 h-3.5 text-purple-500" />
            <span>Next-Gen Platform Engineering is Here</span>
          </motion.div>

          <motion.h1
            variants={itemVariants}
            className="text-5xl lg:text-7xl font-extrabold text-gray-900 tracking-tight leading-[1.1] mb-8"
          >
            Automate with Intelligence. <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-indigo-600">
              Orchestrate with Precision.
            </span>
          </motion.h1>

          <motion.p
            variants={itemVariants}
            className="text-lg text-gray-500 mb-10 max-w-2xl leading-relaxed"
          >
            Visually design AI-driven workflows that classify, route, and
            execute tasks in real-time. Connect Tally webhooks to Groq LLMs,
            push logic to Notion and Discord, and monitor every decision
            instantly.
          </motion.p>

          <motion.div
            variants={itemVariants}
            className="flex flex-col sm:flex-row items-center gap-4 w-full justify-center"
          >
            <Link
              href="/signup"
              className="w-full sm:w-auto flex items-center justify-center gap-2 bg-gray-900 text-white px-8 py-3.5 rounded-xl text-base font-semibold hover:bg-gray-800 transition-all shadow-lg shadow-gray-900/20 hover:shadow-xl active:scale-95"
            >
              Start Building Free
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/app/logs"
              className="w-full sm:w-auto flex items-center justify-center gap-2 bg-white text-gray-700 border border-gray-200 px-8 py-3.5 rounded-xl text-base font-semibold hover:bg-gray-50 transition-all shadow-sm active:scale-95"
            >
              <Activity className="w-4 h-4" />
              View Live Logs
            </Link>
          </motion.div>
        </motion.div>

        {/* Hero Visual Interface Mockup */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.7, type: "spring" }}
          className="mt-20 w-full max-w-5xl relative"
        >
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#f8fafc] z-10 bottom-0 h-1/2 top-auto" />
          <div className="bg-white/40 backdrop-blur-xl border border-gray-200/60 rounded-2xl shadow-2xl overflow-hidden flex flex-col h-[400px]">
            {/* Fake macOS Header */}
            <div className="h-12 bg-gray-100/50 border-b border-gray-200/50 flex items-center px-4 gap-2">
              <div className="w-3 h-3 rounded-full bg-red-400" />
              <div className="w-3 h-3 rounded-full bg-amber-400" />
              <div className="w-3 h-3 rounded-full bg-emerald-400" />
            </div>
            {/* Fake Canvas Content */}
            <div className="flex-1 relative p-8">
              <div className="absolute top-12 left-12 w-48 bg-white border border-gray-200 shadow-sm rounded-lg p-3 flex items-center gap-3">
                <Zap className="w-5 h-5 text-amber-500" />
                <span className="text-sm font-medium">Tally Webhook</span>
              </div>
              <svg
                className="absolute top-16 left-[240px] w-24 h-12 stroke-gray-300"
                fill="none"
                viewBox="0 0 100 50"
              >
                <path
                  d="M0,25 C50,25 50,25 100,25"
                  strokeWidth="2"
                  strokeDasharray="4 4"
                />
              </svg>
              <div className="absolute top-8 left-[340px] w-56 bg-white border-2 border-purple-200 shadow-md rounded-lg p-3 flex flex-col gap-1 z-10">
                <div className="flex items-center gap-3">
                  <Bot className="w-5 h-5 text-purple-500" />
                  <span className="text-sm font-medium">Groq Classifier</span>
                </div>
                <div className="text-[10px] text-gray-500 ml-8">
                  Routing based on intent...
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </main>

      {/* Feature Grid */}
      <section className="bg-white border-t border-gray-200 py-24 px-6 relative z-20">
        <div className="max-w-7xl mx-auto">
          <div className="mb-16 text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Built for the AI-Native Enterprise
            </h2>
            <p className="text-gray-500 max-w-2xl mx-auto">
              Stop writing boilerplate webhook listeners. Assemble intelligent,
              fault-tolerant data pipelines in a unified visual canvas.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard
              icon={<Workflow className="w-6 h-6 text-indigo-500" />}
              title="Visual Workflow Builder"
              description="Drag and drop triggers, AI agents, and actions on an infinite React Flow canvas with glassmorphic controls."
            />
            <FeatureCard
              icon={<Network className="w-6 h-6 text-emerald-500" />}
              title="Agentic Intent Routing"
              description="Pass raw payloads to Groq LLMs. Automatically categorize, prioritize, and route data to different downstream services."
            />
            <FeatureCard
              icon={<ShieldCheck className="w-6 h-6 text-slate-700" />}
              title="Secure Secret Vault"
              description="Notion API keys and Discord webhooks are securely encrypted in Supabase with strict Row Level Security policies."
            />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#f8fafc] border-t border-gray-200 py-12 px-6 text-center">
        <div className="flex items-center justify-center gap-2 mb-4">
          <div className="w-4 h-4 rounded-full bg-emerald-500"></div>
          <span className="font-bold text-gray-900">Agentic Orchestrator</span>
        </div>
        <p className="text-sm text-gray-500">
          Engineered for high-performance automation.
        </p>
      </footer>
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="bg-[#f8fafc] border border-gray-100 p-6 rounded-2xl hover:shadow-lg hover:border-gray-200 transition-all duration-300">
      <div className="w-12 h-12 bg-white rounded-xl shadow-sm border border-gray-100 flex items-center justify-center mb-6">
        {icon}
      </div>
      <h3 className="text-lg font-bold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-500 text-sm leading-relaxed">{description}</p>
    </div>
  );
}
