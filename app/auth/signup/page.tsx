import { OAuthButtons, OrDivider, SignupFormInner } from "@/components/AuthForm";

export default function SignupPage() {
  return (
    <div className="flex flex-col gap-1">
      <h1
        className="anim-fadeUp"
        style={{ fontSize: "clamp(32px,5vw,42px)", fontWeight: 600, letterSpacing: "-0.04em", lineHeight: 1.08, color: "var(--ink)", marginBottom: 8 }}
      >
        Start{" "}
        <span
          style={{
            fontFamily: "var(--font-serif-display, 'Instrument Serif', serif)",
            fontStyle: "italic",
            fontWeight: 400,
          }}
        >
          playing
        </span>
        .
      </h1>
      <p
        className="anim-fadeUp delay-100"
        style={{ fontSize: 15, color: "var(--ink-muted)", letterSpacing: "-0.01em", marginBottom: 4 }}
      >
        30 seconds to sign up. Free forever. Your first hit is waiting.
      </p>

      <div className="mb-4" />

      <div className="anim-fadeUp delay-200">
        <OAuthButtons mode="signup" />
      </div>

      <div className="mt-5 mb-5 anim-fadeUp delay-300">
        <OrDivider />
      </div>

      <div className="anim-fadeUp delay-400">
        <SignupFormInner />
      </div>

      <p className="mt-6 text-center font-sans text-sm text-ink-muted anim-fadeUp delay-500">
        Already have an account?{" "}
        <a
          href="/auth/login"
          className="font-semibold transition-colors hover:opacity-80"
          style={{ color: "var(--accent)" }}
        >
          Log in
        </a>
      </p>
    </div>
  );
}
