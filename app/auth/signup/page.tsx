import { OAuthButtons, OrDivider, SignupFormInner } from "@/components/AuthForm";

export default function SignupPage() {
  return (
    <div className="flex flex-col gap-1">
      <h1
        className="text-[40px] leading-[1.04] text-ink mb-2 anim-fadeUp"
        style={{
          fontFamily: "var(--font-landing-sans), Inter, sans-serif",
          fontWeight: 600,
          letterSpacing: "-0.045em",
        }}
      >
        Start{" "}
        <span
          style={{
            fontFamily: "var(--font-landing-serif), 'Source Serif 4', serif",
            fontStyle: "italic",
            fontWeight: 600,
          }}
        >
          playing
        </span>
        .
      </h1>
      <p
        className="text-[16px] text-ink-muted mb-1 anim-fadeUp delay-100"
        style={{ fontFamily: "var(--font-landing-sans), Inter, sans-serif", letterSpacing: "-0.01em" }}
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
