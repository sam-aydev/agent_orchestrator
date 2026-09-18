"use client";

import { useTransition, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Loader2 } from "lucide-react";
import { FaGithub } from "react-icons/fa";
import { motion } from "framer-motion";
import { signup, githubOauth } from "@/lib/actions/auth";

export function SignUpContent() {
  const searchParams = useSearchParams();
  const serverError = searchParams.get("error");
  const [isLoading, setIsLoading] = useState(false);

  const [localError, setLocalError] = useState("");
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLocalError("");

    const formData = new FormData(event.currentTarget);
    const password = formData.get("password") as string;
    const confirmPassword = formData.get("confirmPassword") as string;

    if (password !== confirmPassword) {
      setLocalError("Passwords do not match. Please try again.");
      return;
    }

    startTransition(async () => {
      await signup(formData);
    });
  };

  const handleGithubSignup = async () => {
    try {
      setIsLoading(true);
      setLocalError("");

      const { error, success } = await githubOauth();

      if (error) {
        setLocalError(`GitHub Auth Error: ${error.message}`);
      }
      if (error?.message === "fetch failed") {
        setLocalError("Check Internet Connection");
      }
    } catch (err: any) {
      setLocalError("An unexpected error occurred while connecting to GitHub.");
      setIsLoading(false);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-gray-50 px-4 font-sans">
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="w-full max-w-sm rounded-2xl border border-gray-200 bg-white px-8 py-4 shadow-xl"
      >
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">
            Orchestrator
          </h1>
          <p className="mt-1.5 text-sm text-gray-500">
            Create your account to start building workflows
          </p>
        </div>

        <button
          onClick={handleGithubSignup}
          disabled={isPending || isLoading}
          className="cursor-pointer mb-6 flex w-full items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-semibold text-gray-900 transition-colors hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <FaGithub className="h-4 w-4" />
          Continue with GitHub
        </button>

        <div className="relative mb-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-200"></div>
          </div>
          <div className="relative flex justify-center text-xs uppercase tracking-widest">
            <span className="bg-white px-3 text-gray-400 font-medium">
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
              disabled={isPending || isLoading}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 transition-colors focus:border-black focus:outline-none focus:ring-1 focus:ring-black disabled:cursor-not-allowed disabled:bg-gray-100"
              placeholder="developer@example.com"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-gray-700">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              disabled={isPending || isLoading}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 transition-colors focus:border-black focus:outline-none focus:ring-1 focus:ring-black disabled:cursor-not-allowed disabled:bg-gray-100"
              placeholder="Minimum 6 characters"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-gray-700">
              Confirm Password
            </label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              required
              disabled={isPending || isLoading}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 transition-colors focus:border-black focus:outline-none focus:ring-1 focus:ring-black disabled:cursor-not-allowed disabled:bg-gray-100"
              placeholder="Repeat password"
            />
          </div>

          {(localError || serverError) && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="rounded-md border border-red-200 bg-red-50 px-3 py-2.5 text-center text-xs font-medium text-red-600"
            >
              {localError || serverError}
            </motion.div>
          )}

          <div className="mt-2 flex flex-col gap-2">
            <button
              type="submit"
              disabled={isPending || isLoading}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-black px-4 py-2.5 text-sm font-semibold text-white transition-all hover:bg-gray-800 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isPending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Creating Account...</span>
                </>
              ) : (
                "Create Account"
              )}
            </button>
          </div>
        </form>

        <div className="mt-8 text-center text-sm text-gray-500">
          Already have an account?{" "}
          <Link
            href="/login"
            className={`font-semibold text-black hover:underline ${
              isPending ? "pointer-events-none opacity-50" : ""
            }`}
          >
            Sign in
          </Link>
        </div>
      </motion.div>
    </div>
  );
}

export default function SignupPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center">
          Loading...
        </div>
      }
    >
      <SignUpContent />
    </Suspense>
  );
}
