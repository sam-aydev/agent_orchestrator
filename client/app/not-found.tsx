"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "motion/react";
import { ArrowLeft, Home, Waypoints } from "lucide-react";

export default function NotFound() {
  const router = useRouter();

  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-gray-50 via-gray-100 to-gray-200 px-4 font-sans">
      
      {/* Animated Floating Node Graphic */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", duration: 0.8, bounce: 0.4 }}
        className="relative mb-8 flex h-24 w-24 items-center justify-center rounded-3xl bg-white shadow-xl ring-1 ring-gray-900/5"
      >
        <Waypoints className="h-10 w-10 text-emerald-500" strokeWidth={1.5} />
        
        {/* Decorative disconnected edge/pulse */}
        <motion.div 
          animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0, 0.5] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -right-2 top-1/2 h-3 w-3 -translate-y-1/2 rounded-full border-2 border-emerald-500 bg-white"
        />
      </motion.div>

      {/* Typography */}
      <div className="text-center">
        <motion.h1 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.4 }}
          className="text-7xl font-bold tracking-tighter text-gray-900"
        >
          404
        </motion.h1>
        
        <motion.h2 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.4 }}
          className="mt-4 text-2xl font-bold tracking-tight text-gray-900"
        >
          Connection Lost
        </motion.h2>

        <motion.p 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.4 }}
          className="mx-auto mt-3 max-w-sm text-gray-500"
        >
          We couldn't find the page or agentic workflow you were looking for. It might have been deleted or moved.
        </motion.p>
      </div>

      {/* Action Buttons */}
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.4 }}
        className="mt-10 flex flex-col items-center gap-4 sm:flex-row"
      >
        <button
          onClick={() => router.back()}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-white px-6 py-3 text-sm font-semibold text-gray-700 shadow-sm ring-1 ring-inset ring-gray-300 transition-all hover:bg-gray-50 active:scale-[0.98] sm:w-auto"
        >
          <ArrowLeft className="h-4 w-4" />
          Go Back
        </button>

        <Link
          href="/app/workflows"
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-gray-900 px-6 py-3 text-sm font-semibold text-white shadow-md transition-all hover:bg-gray-800 hover:shadow-lg active:scale-[0.98] sm:w-auto"
        >
          <Home className="h-4 w-4" />
          Back to Dashboard
        </Link>
      </motion.div>

    </div>
  );
}