import { createClient } from "@/lib/supabase/server";
import { OAuthButtons, OrDivider, SignupFormInner } from "@/components/AuthForm";

export default async function SignupPage() {
  const supabase = await createClient();
  const { count } = await supabase
    .from("profiles")
    .select("id", { count: "exact", head: true });

  const userCount = count ?? 0;
  const displayCount =
    userCount >= 1000
      ? `${Math.floor(userCount / 100) / 10}k`
      : String(userCount);

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

      {userCount > 0 && (
        <span
          className="self-start inline-flex items-center font-mono text-[10px] uppercase tracking-widest rounded-full px-3 py-1 mb-5 anim-fadeUp delay-150"
          style={{
            background: "var(--accent-soft)",
            color: "var(--ink)",
            border: "1px solid var(--line)",
          }}
        >
          join {displayCount} people already playing
        </span>
      )}

      {userCount === 0 && <div className="mb-4" />}

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
