import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { SettingsForm } from "./SettingsForm";

const NOISE_URL =
  "url(\"data:image/svg+xml;utf8,<svg viewBox='0 0 240 240' xmlns='http://www.w3.org/2000/svg'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 0.55 0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>\")";

export default async function SettingsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  return (
    <div className="min-h-screen px-4 sm:px-6 lg:px-8 pt-8 pb-16 relative" style={{ background: "#070708" }}>
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none mix-blend-overlay"
        style={{ backgroundImage: NOISE_URL, backgroundSize: "240px 240px", opacity: 0.08 }}
      />
      <div className="relative max-w-2xl mx-auto">
        <span
          className="inline-flex items-center font-sans text-xs rounded-full px-3 py-1 mb-5 anim-fadeUp"
          style={{
            background: "rgba(94,234,212,0.10)",
            color: "#5EEAD4",
            border: "1px solid rgba(94,234,212,0.22)",
          }}
        >
          settings
        </span>
        <h1
          className="font-display mb-3 anim-fadeUp delay-100"
          style={{
            color: "#FFFFFF",
            fontSize: "clamp(36px, 6vw, 56px)",
            letterSpacing: "-0.02em",
            fontWeight: 600,
            lineHeight: 1.05,
          }}
        >
          Your account.
        </h1>
        <p className="font-sans text-base mb-10 anim-fadeUp delay-200" style={{ color: "rgba(255,255,255,0.6)" }}>
          Profile, privacy, notifications, and the small switches that make Hyperfix yours.
        </p>

        <div className="anim-fadeUp delay-300">
          <SettingsForm profile={profile} userEmail={user.email ?? ""} userId={user.id} />
        </div>
      </div>
    </div>
  );
}
