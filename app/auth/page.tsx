"use client";

import { useAuth } from "@/lib/auth-context";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Home, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function AuthPage() {
  const { user, loading, isConfigured, signIn, signUp } = useAuth();
  const router = useRouter();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!loading && user) router.replace("/chat");
  }, [user, loading, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    const result =
      mode === "signin"
        ? await signIn(email, password)
        : await signUp(email, password, name || undefined);
    setSubmitting(false);
    if (result.error) {
      setError(result.error);
      return;
    }
    router.replace("/chat");
  };

  const inputClass =
    "w-full rounded-[var(--radius)] border border-[var(--card-border)] bg-[var(--input-bg)] px-4 py-3 text-[var(--foreground)] placeholder:text-[var(--muted)] focus:border-[var(--ring)] focus:outline-none focus:ring-2 focus:ring-[var(--ring)]/25 transition";

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-sky-50/60 to-[var(--background)]">
        <div className="flex flex-col items-center gap-4">
          <div className="h-9 w-9 animate-spin rounded-full border-2 border-[var(--card-border)] border-t-[var(--primary)]" />
          <p className="text-sm text-[var(--muted)]">Loading…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-sky-50/60 to-[var(--background)] px-4 py-12">
      <div className="mb-8 flex w-full max-w-[420px] justify-start px-2">
        <Link
          href="/"
          className="flex items-center gap-2 text-sm font-semibold text-[var(--muted)] hover:text-[var(--primary)] transition group"
        >
          <div className="p-2 rounded-full border border-[var(--card-border)] bg-[var(--card)] shadow-sm group-hover:border-[var(--primary)] group-hover:bg-sky-50 transition">
            <ArrowLeft size={16} />
          </div>
          <span>Back to Home</span>
        </Link>
      </div>

      <div className="w-full max-w-[420px] rounded-2xl border border-[var(--card-border)] bg-[var(--card)] p-10 shadow-[var(--shadow-md)]">
        {!isConfigured && (
          <div className="mb-6 rounded-[var(--radius)] border border-amber-200 bg-[var(--warning-bg)] p-4 text-sm text-amber-800">
            Add <code className="rounded bg-white/70 px-1.5 py-0.5 font-mono text-xs">NEXT_PUBLIC_INSFORGE_BASE_URL</code> and{" "}
            <code className="rounded bg-white/70 px-1.5 py-0.5 font-mono text-xs">NEXT_PUBLIC_INSFORGE_ANON_KEY</code> to{" "}
            <code className="rounded bg-white/70 px-1.5 py-0.5 font-mono text-xs">.env.local</code> (see README).
          </div>
        )}
        <h1 className="text-center text-2xl font-bold tracking-tight text-[var(--foreground)]">
          {mode === "signin" ? "Sign in" : "Create account"}
        </h1>
        <p className="mt-2 text-center text-sm text-[var(--muted)]">
          {mode === "signin" ? "Welcome back." : "Get started in seconds."}
        </p>
        <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-5">
          {error && (
            <div className="rounded-[var(--radius)] bg-[var(--error-bg)] px-4 py-3 text-sm text-[var(--error)]">
              {error}
            </div>
          )}
          {mode === "signup" && (
            <div>
              <label className="mb-2 block text-sm font-medium text-[var(--foreground)]">Display name</label>
              <input
                type="text"
                placeholder="How others see you"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className={inputClass}
                autoComplete="name"
              />
            </div>
          )}
          <div>
            <label className="mb-2 block text-sm font-medium text-[var(--foreground)]">Email</label>
            <input
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className={inputClass}
              autoComplete="email"
            />
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-[var(--foreground)]">Password</label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className={inputClass}
              autoComplete={mode === "signin" ? "current-password" : "new-password"}
            />
          </div>
          <button
            type="submit"
            disabled={submitting || !isConfigured}
            className="mt-2 w-full rounded-[var(--radius-lg)] bg-[var(--primary)] px-4 py-3.5 font-semibold text-[var(--primary-foreground)] shadow-[var(--shadow)] transition hover:bg-[var(--primary-hover)] disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-[var(--ring)] focus:ring-offset-2"
          >
            {submitting ? "Please wait…" : mode === "signin" ? "Sign in" : "Create account"}
          </button>
        </form>
        <p className="mt-8 text-center text-sm text-[var(--muted)]">
          {mode === "signin" ? "Don't have an account? " : "Already have an account? "}
          <button
            type="button"
            onClick={() => {
              setMode(mode === "signin" ? "signup" : "signin");
              setError(null);
            }}
            className="font-semibold text-[var(--primary)] hover:underline"
          >
            {mode === "signin" ? "Sign up" : "Sign in"}
          </button>
        </p>
      </div>
    </div>
  );
}
