"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@heroui/react";
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  ArrowRight,
  Activity,
  ShieldCheck,
  HeartPulse,
} from "lucide-react";
import { authClient } from "@/app/lib/auth-client";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/dashboard";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    document.title = "Login | MediCare Connect";
  }, []);

  useEffect(() => {
    if (searchParams.get("error") === "suspended") {
      setError("Your account has been suspended. Please contact support.");
    }
  }, [searchParams]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    if (!email.trim() || !password) {
      setError("Please enter your email and password.");
      return;
    }

    setIsLoading(true);
    try {
      const { error: signInError } = await authClient.signIn.email({
        email: email.trim(),
        password,
        callbackURL: callbackUrl,
      });

      if (signInError) {
        setError(signInError.message || "Invalid email or password.");
        return;
      }

      router.push(callbackUrl);
      router.refresh();
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setError("");
    setIsGoogleLoading(true);
    try {
      await authClient.signIn.social({
        provider: "google",
        callbackURL: callbackUrl,
      });
    } catch {
      setError("Google sign-in failed. Please try again.");
      setIsGoogleLoading(false);
    }
  };

  return (
    <div className="grid w-full max-w-5xl overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl shadow-slate-200/60 dark:border-slate-800 dark:bg-[#111827] dark:shadow-none lg:grid-cols-2">
      <div className="relative hidden flex-col justify-between bg-gradient-to-br from-[#5e17eb] via-[#6d28d9] to-[#4c1d95] p-10 text-white lg:flex">
        <div>
          <Link href="/" className="inline-flex items-center gap-2">
            <Image src="/logo.png" alt="MediCare Connect" width={36} height={36} />
            <span className="text-xl font-bold">
              MediCare<span className="text-violet-200">Connect</span>
            </span>
          </Link>
          <h2 className="mt-10 text-3xl font-bold leading-tight">
            Welcome back to your healthcare hub
          </h2>
          <p className="mt-4 text-violet-100/90 leading-relaxed">
            Sign in to manage appointments, access medical records, and connect
            with trusted doctors anytime.
          </p>
        </div>

        <ul className="space-y-4">
          {[
            { icon: HeartPulse, text: "Book appointments in minutes" },
            { icon: ShieldCheck, text: "Secure & encrypted patient data" },
            { icon: Activity, text: "Track your health journey easily" },
          ].map(({ icon: Icon, text }) => (
            <li key={text} className="flex items-center gap-3 text-sm text-violet-100">
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/15">
                <Icon size={18} />
              </span>
              {text}
            </li>
          ))}
        </ul>
      </div>

      <div className="flex flex-col justify-center p-8 sm:p-10">
        <div className="mb-8 lg:hidden">
          <Link href="/" className="inline-flex items-center gap-2">
            <Image src="/logo.png" alt="MediCare Connect" width={32} height={32} />
            <span className="text-lg font-bold text-slate-800 dark:text-white">
              MediCare<span className="text-[#5e17eb]">Connect</span>
            </span>
          </Link>
        </div>

        <div className="mb-8">
          <h1 className="text-2xl font-bold text-slate-800 dark:text-white sm:text-3xl">
            Sign in to your account
          </h1>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
            Don&apos;t have an account?{" "}
            <Link
              href="/register"
              className="font-medium text-[#5e17eb] hover:underline"
            >
              Create one free
            </Link>
          </p>
        </div>

        {error && (
          <div className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600 dark:border-red-900/40 dark:bg-red-900/20 dark:text-red-400">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label
              htmlFor="email"
              className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300"
            >
              Email address
            </label>
            <div className="relative">
              <Mail
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                autoComplete="email"
                className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-10 pr-4 text-slate-800 outline-none transition focus:border-[#5e17eb] focus:ring-2 focus:ring-[#5e17eb]/20 dark:border-slate-700 dark:bg-slate-800/50 dark:text-white dark:focus:border-[#5e17eb]"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="password"
              className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300"
            >
              Password
            </label>
            <div className="relative">
              <Lock
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                autoComplete="current-password"
                className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-10 pr-12 text-slate-800 outline-none transition focus:border-[#5e17eb] focus:ring-2 focus:ring-[#5e17eb]/20 dark:border-slate-700 dark:bg-slate-800/50 dark:text-white dark:focus:border-[#5e17eb]"
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-1 text-slate-400 transition hover:text-[#5e17eb]"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <Button
            type="submit"
            isLoading={isLoading}
            className="w-full bg-[#5e17eb] py-6 text-base font-semibold text-white shadow-lg shadow-[#5e17eb]/25 hover:bg-[#4a12bc]"
          >
            Sign In
            <ArrowRight size={18} className="ml-1" />
          </Button>
        </form>

        <div className="my-6 flex items-center gap-3">
          <span className="h-px flex-1 bg-slate-200 dark:bg-slate-700" />
          <span className="text-xs font-medium uppercase tracking-wider text-slate-400">
            or continue with
          </span>
          <span className="h-px flex-1 bg-slate-200 dark:bg-slate-700" />
        </div>

        <button
          type="button"
          onClick={handleGoogleLogin}
          disabled={isGoogleLoading || isLoading}
          className="flex w-full items-center justify-center gap-3 rounded-xl border border-slate-200 bg-white py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60 dark:border-slate-700 dark:bg-slate-800/50 dark:text-slate-200 dark:hover:bg-slate-800"
        >
          <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
            <path
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              fill="#4285F4"
            />
            <path
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              fill="#34A853"
            />
            <path
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              fill="#FBBC05"
            />
            <path
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              fill="#EA4335"
            />
          </svg>
          {isGoogleLoading ? "Redirecting..." : "Continue with Google"}
        </button>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="text-center text-slate-500">Loading...</div>}>
      <LoginForm />
    </Suspense>
  );
}
