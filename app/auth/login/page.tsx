"use client";

import { OAuthButtons, OrDivider, LoginFormInner } from "@/components/AuthForm";

export default function LoginPage() {
  return (
    <div className="flex flex-col gap-1">
      <h1
        className="anim-fadeUp"
        style={{ fontSize: "clamp(32px,5vw,42px)", fontWeight: 600, letterSpacing: "-0.04em", lineHeight: 1.08, color: "var(--ink)", marginBottom: 8 }}
      >
        Welcome{" "}
        <span
          style={{
            fontFamily: "var(--font-serif-display, 'Instrument Serif', serif)",
            fontStyle: "italic",
            fontWeight: 400,
          }}
        >
          back
        </span>
        .
      </h1>
      <p
        className="anim-fadeUp delay-100"
        style={{ fontSize: 15, color: "var(--ink-muted)", letterSpacing: "-0.01em", marginBottom: 24 }}
      >
        Your streak&apos;s waiting. Pick up where you left off.
      </p>

      <div className="anim-fadeUp delay-200">
        <OAuthButtons mode="login" />
      </div>

      <div className="mt-5 mb-5 anim-fadeUp delay-300">
        <OrDivider />
      </div>

      <div className="anim-fadeUp delay-400">
        <LoginFormInner />
      </div>

      <p className="mt-6 text-center font-sans text-sm text-ink-muted anim-fadeUp delay-500">
        Don&apos;t have an account?{" "}
        <a
          href="/auth/signup"
          className="font-semibold transition-colors hover:opacity-80"
          style={{ color: "var(--accent)" }}
        >
          Sign up
        </a>
      </p>
      <p className="mt-3 text-center font-mono text-[10px] uppercase tracking-[0.18em] text-ink-faint anim-fadeUp delay-600">
        your daily dopamine · hyperfix.app
      </p>
    </div>
  );
}
