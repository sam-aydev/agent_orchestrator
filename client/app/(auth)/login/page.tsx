"use client";

import { Suspense, useState, useTransition } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Loader2, LogIn } from "lucide-react";
import { FaGithub } from "react-icons/fa";
import { motion } from "motion/react";
import { githubOauth, login } from "@/lib/actions/auth";
import { toast } from "sonner";
import { AuthError } from "@supabase/supabase-js";

export function LoginContent() {
  const searchParams = useSearchParams();
  const error = searchParams.get("error");
  const [isPending, startTransition] = useTransition();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    startTransition(async () => {
      await login(formData);
    });
  };

  const handleGithubLogin = async () => {
    try {
      setIsLoading(true);

      const { error } = await githubOauth();

      if (error) {
        toast.error(error ? error.message : "Unknown error");
      }
    } catch (err: any) {
      setIsLoading(false);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-[radial-gradient(ellipse_at_top,var(--tw-gradient-stops))] from-gray-50 via-gray-100 to-gray-200 px-4 font-sans">
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="w-full max-w-sm rounded-2xl border border-gray-200 bg-white/95 p-8 shadow-2xl backdrop-blur-xl"
      >
        <div className="mb-8 text-center">
          <motion.h1
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="text-2xl font-bold tracking-tight text-gray-900"
          >
            Welcome back
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="mt-1.5 text-sm text-gray-500"
          >
            Enter your credentials to access your workspace.
          </motion.p>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <button
            type="button"
            onClick={handleGithubLogin}
            disabled={isPending}
            className="mb-6 flex w-full items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-semibold text-gray-900 transition-colors hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <FaGithub className="h-4 w-4" />
            Sign in with GitHub
          </button>

          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200"></div>
            </div>
            <div className="relative flex justify-center text-xs uppercase tracking-widest">
              <span className="bg-white px-3 font-medium text-gray-400">
                Or email
              </span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-gray-700">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                disabled={isPending}
                className="w-full rounded-lg border border-gray-300 bg-gray-50/50 px-3 py-2 text-sm text-gray-900 transition-colors focus:border-black focus:bg-white focus:outline-none focus:ring-1 focus:ring-black disabled:cursor-not-allowed disabled:opacity-50"
                placeholder="developer@example.com"
              />
            </div>

            <div>
              <div className="mb-1.5 flex items-center justify-between">
                <label className="block text-xs font-semibold uppercase tracking-wider text-gray-700">
                  Password
                </label>
              </div>
              <input
                id="password"
                name="password"
                type="password"
                required
                disabled={isPending}
                className="w-full rounded-lg border border-gray-300 bg-gray-50/50 px-3 py-2 text-sm text-gray-900 transition-colors focus:border-black focus:bg-white focus:outline-none focus:ring-1 focus:ring-black disabled:cursor-not-allowed disabled:opacity-50"
                placeholder="••••••••"
              />
            </div>

            {error && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="rounded-md border border-red-200 bg-red-50 px-3 py-2.5 text-center text-xs font-medium text-red-600"
              >
                {error}
              </motion.div>
            )}

            <div className="mt-2 flex flex-col gap-2">
              <button
                type="submit"
                disabled={isPending}
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-black px-4 py-2.5 text-sm font-semibold text-white transition-all hover:bg-gray-800 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-70"
              >
                {isPending ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Signing In...</span>
                  </>
                ) : (
                  <>
                    Sign In
                    <LogIn className="h-4 w-4" />
                  </>
                )}
              </button>
            </div>
          </form>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mt-8 text-center text-sm text-gray-500"
        >
          Don&apos;t have an account?{" "}
          <Link
            href="/signup"
            className={`font-semibold text-black transition-colors hover:underline ${
              isPending ? "pointer-events-none opacity-50" : ""
            }`}
          >
            Create an account
          </Link>
        </motion.div>
      </motion.div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="flex min-h-screen items-center justify-center">Loading...</div>}>
      <LoginContent />
    </Suspense>
  );
}