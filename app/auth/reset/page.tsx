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
      if (session) setReady(true);
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
        setTimeout(() => router.push("/dashboard"), 2000);
      }
    });
  }

  if (!ready) {
    return (
      <div className="flex flex-col">
        <span
          className="self-start inline-flex items-center font-sans text-xs rounded-full px-3 py-1 mb-5 anim-fadeUp"
          style={{
            background: "rgba(94,234,212,0.10)",
            color: "#5EEAD4",
            border: "1px solid rgba(94,234,212,0.22)",
          }}
        >
          verifying
        </span>
        <h1
          className="font-display leading-tight mb-2 anim-fadeUp delay-100"
          style={{ color: "#FFFFFF", letterSpacing: "-0.02em", fontSize: "clamp(28px, 4.5vw, 36px)", fontWeight: 600 }}
        >
          Reset password.
        </h1>
        <p className="font-sans text-base anim-fadeUp delay-200" style={{ color: "rgba(255,255,255,0.55)" }}>
          Verifying your reset link…
        </p>
      </div>
    );
  }

  if (success) {
    return (
      <div className="flex flex-col">
        <span
          className="self-start inline-flex items-center font-sans text-xs rounded-full px-3 py-1 mb-5 anim-fadeUp"
          style={{
            background: "rgba(94,234,212,0.10)",
            color: "#5EEAD4",
            border: "1px solid rgba(94,234,212,0.22)",
          }}
        >
          password updated
        </span>
        <h1
          className="font-display leading-tight mb-2 anim-fadeUp delay-100"
          style={{ color: "#FFFFFF", letterSpacing: "-0.02em", fontSize: "clamp(28px, 4.5vw, 36px)", fontWeight: 600 }}
        >
          You&apos;re back in.
        </h1>
        <p className="font-sans text-base anim-fadeUp delay-200" style={{ color: "rgba(255,255,255,0.55)" }}>
          Redirecting you to your dashboard…
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      <span
        className="self-start inline-flex items-center font-sans text-xs rounded-full px-3 py-1 mb-5 anim-fadeUp"
        style={{
          background: "rgba(94,234,212,0.10)",
          color: "#5EEAD4",
          border: "1px solid rgba(94,234,212,0.22)",
        }}
      >
        new password
      </span>
      <h1
        className="font-display leading-tight mb-2 anim-fadeUp delay-100"
        style={{ color: "#FFFFFF", letterSpacing: "-0.02em", fontSize: "clamp(28px, 4.5vw, 36px)", fontWeight: 600 }}
      >
        Set a new password.
      </h1>
      <p className="font-sans text-base mb-8 anim-fadeUp delay-200" style={{ color: "rgba(255,255,255,0.55)" }}>
        Choose a strong password for your account.
      </p>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4 anim-fadeUp delay-300">
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
          className="w-full rounded-full py-3.5 font-sans text-sm font-semibold transition-all hover:opacity-95 active:scale-[0.98] disabled:opacity-60"
          style={{
            background: "#FFFFFF",
            color: "#0A0A0A",
            boxShadow: "0 1px 0 0 rgba(255,255,255,0.4) inset, 0 8px 28px rgba(94,234,212,0.22)",
          }}
        >
          {pending ? "Updating…" : "Update password"}
        </button>
      </form>
    </div>
  );
}
