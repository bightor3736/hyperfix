"use client";

import { useState, useEffect, useTransition } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { AuthInput, FormError } from "@/components/AuthForm";

export default function ResetPasswordPage() {
  const router = useRouter();
  const [ready, setReady] = useState(false);
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [pending, startTransition] = useTransition();

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        setReady(true);
      }
    });
  }, []);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    if (password !== confirm) {
      setError("Passwords don't match.");
      return;
    }

    startTransition(async () => {
      const supabase = createClient();
      const { error } = await supabase.auth.updateUser({ password });
      if (error) {
        setError(error.message);
      } else {
        setSuccess(true);
        setTimeout(() => {
          router.push("/dashboard");
        }, 2000);
      }
    });
  }

  if (!ready) {
    return (
      <div>
        <h1
          className="font-display font-bold text-[28px] leading-tight mb-1"
          style={{ color: "#F4F4F4", letterSpacing: "-0.02em" }}
        >
          Reset password
        </h1>
        <p className="font-sans text-sm" style={{ color: "rgba(244,244,244,0.4)" }}>
          Verifying your reset link…
        </p>
      </div>
    );
  }

  if (success) {
    return (
      <div>
        <h1
          className="font-display font-bold text-[28px] leading-tight mb-2"
          style={{ color: "#F4F4F4", letterSpacing: "-0.02em" }}
        >
          Password updated ✓
        </h1>
        <p className="font-sans text-sm" style={{ color: "rgba(244,244,244,0.4)" }}>
          Redirecting you to your dashboard…
        </p>
      </div>
    );
  }

  return (
    <div>
      <h1
        className="font-display font-bold text-[28px] leading-tight mb-1"
        style={{ color: "#F4F4F4", letterSpacing: "-0.02em" }}
      >
        Set new password
      </h1>
      <p className="font-sans text-sm mb-8" style={{ color: "rgba(244,244,244,0.4)" }}>
        Choose a strong password for your account.
      </p>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <AuthInput
          label="New password"
          id="password"
          type="password"
          placeholder="Min. 8 characters"
          required
          autoComplete="new-password"
          minLength={8}
          value={password}
          onChange={setPassword}
        />
        <AuthInput
          label="Confirm password"
          id="confirm"
          type="password"
          placeholder="Repeat your new password"
          required
          autoComplete="new-password"
          value={confirm}
          onChange={setConfirm}
        />
        <FormError message={error} />
        <button
          type="submit"
          disabled={pending}
          className="w-full rounded-xl py-3.5 font-sans text-sm font-bold transition-all hover:opacity-90 active:scale-[0.98] disabled:opacity-60"
          style={{ background: "#A3E635", color: "#0A0A0A" }}
        >
          {pending ? "Updating…" : "Update password"}
        </button>
      </form>
    </div>
  );
}
