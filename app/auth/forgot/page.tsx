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
      <div>
        <h1
          className="font-display font-bold text-[28px] leading-tight mb-1"
          style={{ color: "#F4F4F4", letterSpacing: "-0.02em" }}
        >
          Check your email
        </h1>
        <p className="font-sans text-sm mb-8" style={{ color: "rgba(244,244,244,0.4)" }}>
          Reset link sent — it may take a minute to arrive.
        </p>
        <div
          className="rounded-xl px-4 py-3 mb-6 font-sans text-sm"
          style={{
            background: "rgba(163,230,53,0.08)",
            border: "1px solid rgba(163,230,53,0.25)",
            color: "#a3e635",
          }}
        >
          Check your email — reset link sent.
        </div>
        <a
          href="/auth/login"
          className="font-sans text-sm transition-colors hover:text-accent"
          style={{ color: "rgba(244,244,244,0.5)" }}
        >
          ← Back to login
        </a>
      </div>
    );
  }

  return (
    <div>
      <h1
        className="font-display font-bold text-[28px] leading-tight mb-1"
        style={{ color: "#F4F4F4", letterSpacing: "-0.02em" }}
      >
        Reset password
      </h1>
      <p className="font-sans text-sm mb-8" style={{ color: "rgba(244,244,244,0.4)" }}>
        Enter your email and we&apos;ll send a reset link.
      </p>

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
        <FormError message={error} />
        <button
          type="submit"
          disabled={pending}
          className="w-full rounded-xl py-3.5 font-sans text-sm font-bold transition-all hover:opacity-90 active:scale-[0.98] disabled:opacity-60"
          style={{ background: "#A3E635", color: "#0A0A0A" }}
        >
          {pending ? "Sending…" : "Send reset link"}
        </button>
      </form>

      <p className="mt-6 text-center font-sans text-[13px]" style={{ color: "rgba(244,244,244,0.35)" }}>
        Remember it?{" "}
        <a
          href="/auth/login"
          className="font-semibold transition-colors hover:text-accent"
          style={{ color: "#F4F4F4" }}
        >
          Log in
        </a>
      </p>
    </div>
  );
}
