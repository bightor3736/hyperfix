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
        className="font-display text-[38px] leading-tight text-ink mb-2 anim-fadeUp"
        style={{ letterSpacing: "-0.02em" }}
      >
        Start counting.
      </h1>
      <p className="text-[15px] text-ink-muted mb-1 anim-fadeUp delay-100">
        30 seconds. Free forever. The number doesn&apos;t lie.
      </p>

      {userCount > 0 && (
        <span
          className="self-start inline-flex items-center font-mono text-[10px] uppercase tracking-widest rounded-full px-3 py-1 mb-5 anim-fadeUp delay-150"
          style={{
            background: "var(--accent-soft)",
            color: "var(--accent)",
            border: "1px solid rgba(111,138,99,0.3)",
          }}
        >
          join {displayCount} people already tracking
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
