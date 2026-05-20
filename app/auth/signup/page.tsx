"use client";

import { OAuthButtons, OrDivider, SignupFormInner } from "@/components/AuthForm";

export default function SignupPage() {
  return (
    <div className="flex flex-col gap-1">
      <span
        className="self-start inline-flex items-center font-sans text-xs rounded-full px-3 py-1 mb-5 anim-fadeUp"
        style={{
          background: "rgba(94,234,212,0.10)",
          color: "#5EEAD4",
          border: "1px solid rgba(94,234,212,0.22)",
        }}
      >
        sign up
      </span>
      <h1
        className="font-display leading-tight mb-2 anim-fadeUp delay-100"
        style={{
          color: "#FFFFFF",
          letterSpacing: "-0.02em",
          fontSize: "clamp(28px, 4.5vw, 36px)",
          fontWeight: 600,
        }}
      >
        Create your account.
      </h1>
      <p
        className="font-sans text-base mb-8 anim-fadeUp delay-200"
        style={{ color: "rgba(255,255,255,0.55)" }}
      >
        Free forever. No credit card. Start counting the days.
      </p>

      <div className="anim-fadeUp delay-300">
        <OAuthButtons mode="signup" />
      </div>

      <div className="mt-5 mb-5 anim-fadeUp delay-400">
        <OrDivider />
      </div>

      <div className="anim-fadeUp delay-500">
        <SignupFormInner />
      </div>

      <p
        className="mt-6 text-center font-sans text-sm anim-fadeUp delay-700"
        style={{ color: "rgba(255,255,255,0.45)" }}
      >
        Already have an account?{" "}
        <a
          href="/auth/login"
          className="motion-link font-semibold transition-colors"
          style={{ color: "#5EEAD4" }}
        >
          Log in
        </a>
      </p>
    </div>
  );
}
