"use client";

import { OAuthButtons, OrDivider, LoginFormInner } from "@/components/AuthForm";

export default function LoginPage() {
  return (
    <div>
      <h1
        className="font-display font-bold text-[28px] leading-tight mb-1"
        style={{ color: "#F4F4F4", letterSpacing: "-0.02em" }}
      >
        Welcome back
      </h1>
      <p className="font-sans text-sm mb-8" style={{ color: "rgba(244,244,244,0.4)" }}>
        Enter your details to log back in.
      </p>

      <OAuthButtons mode="login" />

      <div className="mt-5 mb-5">
        <OrDivider />
      </div>

      <LoginFormInner />

      <p className="mt-6 text-center font-sans text-[13px]" style={{ color: "rgba(244,244,244,0.35)" }}>
        Don&apos;t have an account?{" "}
        <a
          href="/auth/signup"
          className="font-semibold transition-colors hover:text-accent"
          style={{ color: "#F4F4F4" }}
        >
          Sign up
        </a>
      </p>
    </div>
  );
}
