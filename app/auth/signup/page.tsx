"use client";

import { OAuthButtons, OrDivider, SignupFormInner } from "@/components/AuthForm";

export default function SignupPage() {
  return (
    <div>
      <h1
        className="font-display font-bold text-[28px] leading-tight mb-1"
        style={{ color: "#F4F4F4", letterSpacing: "-0.02em" }}
      >
        Create Account
      </h1>
      <p className="font-sans text-sm mb-8" style={{ color: "rgba(244,244,244,0.4)" }}>
        Enter your personal data to create your account.
      </p>

      <OAuthButtons mode="signup" />

      <div className="mt-5 mb-5">
        <OrDivider />
      </div>

      <SignupFormInner />

      <p className="mt-6 text-center font-sans text-[13px]" style={{ color: "rgba(244,244,244,0.35)" }}>
        Already have an account?{" "}
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
