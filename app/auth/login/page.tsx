"use client";

import { OAuthButtons, OrDivider, LoginFormInner } from "@/components/AuthForm";

export default function LoginPage() {
  return (
    <div className="flex flex-col gap-1">
      <span
        className="self-start inline-flex items-center font-sans text-xs rounded-full px-3 py-1 mb-5 anim-fadeUp"
        style={{
          background: "var(--accent-soft)",
          color: "var(--accent)",
          border: "1px solid var(--accent)",
        }}
      >
        log in
      </span>
      <h1
        className="font-display leading-tight mb-2 anim-fadeUp delay-100"
        style={{
          color: "var(--ink)",
          letterSpacing: "-0.02em",
          fontSize: "clamp(28px, 4.5vw, 36px)",
          fontWeight: 600,
        }}
      >
        Welcome back.
      </h1>
      <p
        className="font-sans text-base mb-6 anim-fadeUp delay-200"
        style={{ color: "var(--ink-muted)" }}
      >
        Pick up the count where you left off.
      </p>

      <div className="anim-fadeUp delay-300">
        <OAuthButtons mode="login" />
      </div>

      <div className="mt-4 mb-4 anim-fadeUp delay-400">
        <OrDivider />
      </div>

      <div className="anim-fadeUp delay-500">
        <LoginFormInner />
      </div>

      <p
        className="mt-6 text-center font-sans text-sm anim-fadeUp delay-700"
        style={{ color: "var(--ink-muted)" }}
      >
        Don&apos;t have an account?{" "}
        <a
          href="/auth/signup"
          className="motion-link font-semibold transition-colors"
          style={{ color: "var(--accent)" }}
        >
          Sign up
        </a>
      </p>
      <p
        className="mt-3 text-center font-mono text-[10px] uppercase tracking-[0.18em] anim-fadeUp delay-700"
        style={{ color: "var(--ink-faint)" }}
      >
        or join the unwell at hyperfix.app
      </p>
    </div>
  );
}
