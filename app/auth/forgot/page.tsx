"use client";

import { useState, useTransition } from "react";
import { createClient } from "@/lib/supabase/client";
import { AuthInput, FormError } from "@/components/AuthForm";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    startTransition(async () => {
      const supabase = createClient();
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: window.location.origin + "/auth/reset",
      });
      if (error) {
        setError(error.message);
      } else {
        setSent(true);
      }
    });
  }

  if (sent) {
    return (
      <div className="flex flex-col">
        <span
          className="self-start inline-flex items-center font-sans text-xs rounded-full px-3 py-1 mb-5 anim-fadeUp"
          style={{
            background: "var(--accent-soft)",
            color: "var(--accent)",
            border: "1px solid var(--accent)",
          }}
        >
          reset link sent
        </span>
        <h1
          className="font-display leading-tight mb-2 anim-fadeUp delay-100"
          style={{ color: "var(--ink)", letterSpacing: "-0.02em", fontSize: "clamp(28px, 4.5vw, 36px)", fontWeight: 600 }}
        >
          Check your email.
        </h1>
        <p className="font-sans text-base mb-8 anim-fadeUp delay-200" style={{ color: "var(--ink-muted)" }}>
          We&apos;ve sent a reset link to your inbox. It may take a minute to arrive.
        </p>
        <a
          href="/auth/login"
          className="motion-link self-start font-sans text-sm transition-colors anim-fadeUp delay-300"
          style={{ color: "var(--accent)" }}
        >
          ← Back to login
        </a>
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      <span
        className="self-start inline-flex items-center font-sans text-xs rounded-full px-3 py-1 mb-5 anim-fadeUp"
        style={{
          background: "var(--accent-soft)",
          color: "var(--accent)",
          border: "1px solid var(--accent)",
        }}
      >
        reset password
      </span>
      <h1
        className="font-display leading-tight mb-2 anim-fadeUp delay-100"
        style={{ color: "var(--ink)", letterSpacing: "-0.02em", fontSize: "clamp(28px, 4.5vw, 36px)", fontWeight: 600 }}
      >
        Forgot it?
      </h1>
      <p className="font-sans text-base mb-8 anim-fadeUp delay-200" style={{ color: "var(--ink-muted)" }}>
        Enter your email and we&apos;ll send a reset link.
      </p>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4 anim-fadeUp delay-300">
        <AuthInput
          label="Email address"
          id="email"
          type="email"
          placeholder="you@gmail.com"
          required
          autoComplete="email"
          value={email}
          onChange={setEmail}
        />
        <FormError message={error} />
        <button
          type="submit"
          disabled={pending}
          className="w-full rounded-full py-3.5 font-sans text-sm font-semibold transition-all hover:opacity-95 active:scale-[0.98] disabled:opacity-60"
          style={{
            background: "var(--ink)",
            color: "var(--bg)",
            boxShadow: "0 1px 0 0 var(--ink-muted) inset, 0 8px 28px var(--accent)",
          }}
        >
          {pending ? "Sending…" : "Send reset link"}
        </button>
      </form>

      <p className="mt-6 text-center font-sans text-sm anim-fadeUp delay-500" style={{ color: "var(--ink-muted)" }}>
        Remember it?{" "}
        <a href="/auth/login" className="motion-link font-semibold transition-colors" style={{ color: "var(--accent)" }}>
          Log in
        </a>
      </p>
    </div>
  );
}
