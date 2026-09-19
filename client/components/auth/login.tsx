"use client";

import { useState, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Bot, Loader2, LogIn } from "lucide-react";
import { FaGithub } from "react-icons/fa";
import { motion } from "framer-motion";
import { githubOauth, login } from "@/lib/actions/auth";
import { toast } from "sonner";

export function Login() {
  const searchParams = useSearchParams();
  const error = searchParams.get("error");
  const [isPending, startTransition] = useTransition();
  const [isLoading, setIsLoading] = useState(false);
  const { replace } = useRouter();

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
      const res = await githubOauth();
      console.log(res);

      if (res?.error) {
        // toast.error(res.error);
        setIsLoading(false);
        return;
      }

      // Safely redirect on the client side using the returned URL
      if (res?.url) {
        replace(res.url);
      }
    } catch (err: any) {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-gray-50 dark:bg-gray-950 px-4 font-sans transition-colors duration-200">
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="w-full max-w-sm rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 px-8 py-4 shadow-xl transition-colors"
      >
        <div className="mb-8 text-center">
          <Link href={"/"}>
            <div className="flex justify-center items-center gap-2 font-bold tracking-tight text-gray-900 dark:text-gray-100">
              <div className="flex size-12 shrink-0 items-center justify-center rounded-lg bg-black dark:bg-white transition-colors">
                <Bot className="size-10 text-white dark:text-black transition-colors" />
              </div>
              <span className="hidden text-xl sm:inline-block text-black dark:text-white transition-colors">
                Agentic Orchestrator
              </span>
            </div>
          </Link>
          <p className="mt-1.5 text-sm text-gray-500 dark:text-gray-400 transition-colors">
            Enter your credentials to access your workspace.
          </p>
        </div>

        <button
          type="button"
          onClick={handleGithubLogin}
          disabled={isPending || isLoading}
          className="cursor-pointer mb-6 flex w-full items-center justify-center gap-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-4 py-2.5 text-sm font-semibold text-gray-900 dark:text-gray-100 transition-colors hover:bg-gray-50 dark:hover:bg-gray-700/50 focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white focus:ring-offset-1 dark:focus:ring-offset-gray-900 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <FaGithub className="h-4 w-4" />
          Sign in with GitHub
        </button>

        <div className="relative mb-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-200 dark:border-gray-800 transition-colors"></div>
          </div>
          <div className="relative flex justify-center text-xs uppercase tracking-widest">
            <span className="bg-white dark:bg-gray-900 px-3 font-medium text-gray-400 dark:text-gray-500 transition-colors">
              Or email
            </span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-gray-700 dark:text-gray-300 transition-colors">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              disabled={isPending || isLoading}
              className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-950/50 px-3 py-2 text-sm text-gray-900 dark:text-white transition-colors focus:border-black dark:focus:border-white focus:outline-none focus:ring-1 focus:ring-black dark:focus:ring-white disabled:cursor-not-allowed disabled:bg-gray-100 dark:disabled:bg-gray-800 placeholder:text-gray-400 dark:placeholder:text-gray-600"
              placeholder="developer@example.com"
            />
          </div>

          <div>
            <div className="mb-1.5 flex items-center justify-between">
              <label className="block text-xs font-semibold uppercase tracking-wider text-gray-700 dark:text-gray-300 transition-colors">
                Password
              </label>
            </div>
            <input
              id="password"
              name="password"
              type="password"
              required
              disabled={isPending || isLoading}
              className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-950/50 px-3 py-2 text-sm text-gray-900 dark:text-white transition-colors focus:border-black dark:focus:border-white focus:outline-none focus:ring-1 focus:ring-black dark:focus:ring-white disabled:cursor-not-allowed disabled:bg-gray-100 dark:disabled:bg-gray-800 placeholder:text-gray-400 dark:placeholder:text-gray-600"
              placeholder="••••••••"
            />
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="rounded-md border border-red-200 dark:border-red-500/20 bg-red-50 dark:bg-red-500/10 px-3 py-2.5 text-center text-xs font-medium text-red-600 dark:text-red-400 transition-colors"
            >
              {error}
            </motion.div>
          )}

          <div className="mt-2 flex flex-col gap-2">
            <button
              type="submit"
              disabled={isPending || isLoading}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-black dark:bg-white px-4 py-2.5 text-sm font-semibold text-white dark:text-black transition-all hover:bg-gray-800 dark:hover:bg-gray-200 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-70"
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

        <div className="mt-8 text-center text-sm text-gray-500 dark:text-gray-400 transition-colors">
          Don't have an account?{" "}
          <Link
            href="/signup"
            className={`font-semibold text-black dark:text-white transition-colors hover:underline ${
              isPending || isLoading ? "pointer-events-none opacity-50" : ""
            }`}
          >
            Create an account
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
