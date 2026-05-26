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
        Start counting.
      </h1>
      <p
        className="font-sans text-base mb-1 anim-fadeUp delay-200"
        style={{ color: "rgba(255,255,255,0.55)" }}
      >
        30 seconds. Free forever. The number doesn&apos;t lie.
      </p>

      {userCount > 0 && (
        <p
          className="font-mono text-[11px] uppercase tracking-widest mb-6 anim-fadeUp delay-200"
          style={{ color: "rgba(94,234,212,0.7)" }}
        >
          join {displayCount} people already tracking
        </p>
      )}

      <div className="anim-fadeUp delay-300">
        <OAuthButtons mode="signup" />
      </div>

      <div className="mt-4 mb-4 anim-fadeUp delay-400">
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
