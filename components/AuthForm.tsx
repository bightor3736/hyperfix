"use client";

import { useState, useTransition } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";
import { useToast } from "@/components/Toast";

// ── Shared input ─────────────────────────────────────────────────────────────

export function AuthInput({
  label,
  id,
  type = "text",
  placeholder,
  required,
  autoComplete,
  minLength,
  hint,
  value,
  onChange,
}: {
  label: string;
  id: string;
  type?: string;
  placeholder?: string;
  required?: boolean;
  autoComplete?: string;
  minLength?: number;
  hint?: string;
  value?: string;
  onChange?: (v: string) => void;
}) {
  const [showPw, setShowPw] = useState(false);
  const isPassword = type === "password";

  return (
    <div className="flex flex-col gap-1.5">
      <label
        htmlFor={id}
        className="font-sans text-[13px] font-medium text-ink-muted"
      >
        {label}
        {required && <span className="text-accent ml-0.5">*</span>}
      </label>
      <div className="relative">
        <input
          id={id}
          name={id}
          type={isPassword && showPw ? "text" : type}
          placeholder={placeholder}
          required={required}
          autoComplete={autoComplete}
          minLength={minLength}
          value={value}
          onChange={onChange ? (e) => onChange(e.target.value) : undefined}
          className="w-full rounded-xl px-4 py-3 font-sans text-sm outline-none transition-all duration-200 placeholder:text-ink-faint focus:ring-2 focus:ring-accent/30"
          style={{
            background: "transparent",
            border: "1px solid var(--line)",
            color: "var(--ink)",
          }}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPw((v) => !v)}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-ink-faint hover:text-ink-muted transition-colors"
            aria-label={showPw ? "Hide password" : "Show password"}
          >
            {showPw ? (
              <EyeOff size={16} strokeWidth={1.5} />
            ) : (
              <Eye size={16} strokeWidth={1.5} />
            )}
          </button>
        )}
      </div>
      {hint && (
        <p className="font-sans text-[11px] text-ink-faint leading-snug">{hint}</p>
      )}
    </div>
  );
}

// ── OAuth buttons ─────────────────────────────────────────────────────────────

export function OAuthButtons({ mode }: { mode: "login" | "signup" }) {
  const [pending, startTransition] = useTransition();
  const supabase = createClient();
  const label = mode === "signup" ? "up" : "in";
  const origin = typeof window !== "undefined" ? window.location.origin : "";

  const handleOAuth = (provider: "google" | "apple") => {
    startTransition(async () => {
      const next =
        typeof window !== "undefined"
          ? new URLSearchParams(window.location.search).get("next") ?? ""
          : "";
      const redirectTo = next
        ? `${origin}/auth/callback?next=${encodeURIComponent(next)}`
        : `${origin}/auth/callback`;
      await supabase.auth.signInWithOAuth({
        provider,
        options: { redirectTo },
      });
    });
  };

  return (
    <div className="flex flex-col gap-2.5">
      <button
        type="button"
        disabled={pending}
        onClick={() => handleOAuth("google")}
        className="w-full flex items-center justify-center gap-2.5 rounded-full py-3 font-sans text-sm font-medium transition-all duration-200 hover:-translate-y-px active:scale-[0.98] disabled:opacity-50"
        style={{
          background: "transparent",
          border: "1px solid var(--line-strong)",
          color: "var(--ink)",
        }}
      >
        <GoogleIcon />
        Sign {label} with Google
      </button>
      <button
        type="button"
        disabled={pending}
        onClick={() => handleOAuth("apple")}
        className="w-full flex items-center justify-center gap-2.5 rounded-full py-3 font-sans text-sm font-medium transition-all duration-200 hover:opacity-90 active:scale-[0.98] disabled:opacity-50 bg-invert-bg text-invert-ink"
      >
        <AppleIcon />
        Sign {label} with Apple
      </button>
    </div>
  );
}

// ── Divider ───────────────────────────────────────────────────────────────────

export function OrDivider() {
  return (
    <div className="flex items-center gap-3">
      <div className="flex-1 h-px bg-line" />
      <span className="font-mono text-[11px] uppercase tracking-widest text-ink-faint">
        or
      </span>
      <div className="flex-1 h-px bg-line" />
    </div>
  );
}

// ── Submit button ─────────────────────────────────────────────────────────────

export function SubmitButton({
  label,
  pending,
}: {
  label: string;
  pending?: boolean;
}) {
  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full rounded-full py-3 font-sans text-sm font-semibold transition-all duration-200 hover:opacity-90 hover:-translate-y-px active:scale-[0.98] disabled:opacity-60 bg-invert-bg text-invert-ink"
    >
      {pending ? "Please wait…" : label}
    </button>
  );
}

// ── Error / success message ───────────────────────────────────────────────────

export function FormError({ message }: { message: string | null }) {
  if (!message) return null;
  return (
    <p
      className="text-sm font-sans rounded-xl px-4 py-3"
      style={{
        background: "var(--bg-soft)",
        border: "1px solid var(--ink)",
        color: "var(--ink)",
      }}
    >
      {message}
    </p>
  );
}

export function FormSuccess({ message }: { message: string | null }) {
  if (!message) return null;
  return (
    <p
      className="text-sm font-sans rounded-xl px-4 py-3"
      style={{
        background: "var(--accent-soft)",
        border: "1px solid var(--accent)",
        color: "var(--accent)",
      }}
    >
      {message}
    </p>
  );
}

// ── Login form (exported for direct use) ─────────────────────────────────────

export function LoginFormInner() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const supabase = createClient();
  const { toast } = useToast();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    startTransition(async () => {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) {
        setError("Invalid email or password.");
      } else {
        toast({ message: "Welcome back.", type: "success" });
        window.location.replace("/dashboard");
      }
    });
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <AuthInput
        label="Email address"
        id="email"
        type="email"
        placeholder="e.g. you@gmail.com"
        required
        autoComplete="email"
        value={email}
        onChange={setEmail}
      />
      <AuthInput
        label="Password"
        id="password"
        type="password"
        placeholder="Enter your password"
        required
        autoComplete="current-password"
        value={password}
        onChange={setPassword}
      />
      <div className="flex justify-end -mt-1">
        <a
          href="/auth/forgot"
          className="font-sans text-[12px] text-ink-faint transition-colors hover:text-accent"
        >
          Forgot password?
        </a>
      </div>
      <FormError message={error} />
      <SubmitButton label="Log in" pending={pending} />
    </form>
  );
}

// ── Signup form (exported for direct use) ────────────────────────────────────

export function SignupFormInner() {
  const router = useRouter();
  const { toast } = useToast();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    startTransition(async () => {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, name }),
      });
      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        setError(data.error || "Something went wrong. Please try again.");
        return;
      }

      // Fire-and-forget referral attribution
      const refCode =
        typeof localStorage !== "undefined"
          ? localStorage.getItem("hyperfix_ref")
          : null;
      if (refCode) {
        fetch("/api/referral", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ code: refCode }),
        })
          .then(() => localStorage.removeItem("hyperfix_ref"))
          .catch(() => {});
      }

      // Fire-and-forget affiliate attribution
      const affSlug =
        typeof localStorage !== "undefined"
          ? localStorage.getItem("hf_aff")
          : null;
      if (affSlug) {
        fetch("/api/aff", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ slug: affSlug, event: "signup" }),
        })
          .then(() => localStorage.removeItem("hf_aff"))
          .catch(() => {});
      }

      setSuccess("Check your email to confirm your account, then log in.");
      toast({ message: "You're in. Let's start counting.", type: "success" });
      router.push("/auth/verify");
    });
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <AuthInput
        label="Full name"
        id="name"
        placeholder="e.g. Amanda Oliver"
        required
        autoComplete="name"
        value={name}
        onChange={setName}
      />
      <AuthInput
        label="Email address"
        id="email"
        type="email"
        placeholder="e.g. you@gmail.com"
        required
        autoComplete="email"
        value={email}
        onChange={setEmail}
      />
      <AuthInput
        label="Password"
        id="password"
        type="password"
        placeholder="Create a password"
        required
        autoComplete="new-password"
        minLength={8}
        hint="Must be at least 8 characters, including a number and a special character."
        value={password}
        onChange={setPassword}
      />
      <FormError message={error} />
      <FormSuccess message={success} />
      <SubmitButton label="Create account" pending={pending} />
    </form>
  );
}

// ── Icons ─────────────────────────────────────────────────────────────────────

function GoogleIcon() {
  // Monochrome Google "G" — inherits the button's text colour.
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
    </svg>
  );
}

function AppleIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
    </svg>
  );
}
