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
    <div className="min-h-screen pb-16" style={{ background: "var(--bg)" }}>
      {/* Dark hero */}
      <header
        className="relative overflow-hidden"
        style={{
          background: [
            "radial-gradient(ellipse 80% 140% at 110% 65%, rgba(139,92,246,0.60) 0%, transparent 55%)",
            "radial-gradient(ellipse 50% 80%  at 85%  -5%, rgba(99,102,241,0.45) 0%, transparent 50%)",
            "linear-gradient(145deg, #1e1880 0%, #0f0d40 100%)",
          ].join(", "),
          padding: "clamp(28px,4.5vw,44px) clamp(20px,5vw,44px) 56px",
        }}
      >
        <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: NOISE_URL, backgroundSize: "200px 200px", opacity: 0.7 }} />
        <div className="relative z-10">
          <p className="font-mono text-[11px] uppercase tracking-[0.18em] mb-2" style={{ color: "rgba(167,139,250,0.8)" }}>Account</p>
          <h1 style={{ fontFamily: "var(--font-landing-sans), Inter, sans-serif", fontWeight: 700, letterSpacing: "-0.05em", fontSize: "clamp(36px,5.5vw,54px)", lineHeight: 1, color: "#fff" }}>
            Your <span style={{ fontFamily: "var(--font-landing-serif), 'Source Serif 4', serif", fontStyle: "italic" }}>settings</span>.
          </h1>
          <p className="mt-3 font-sans text-[15px]" style={{ color: "rgba(255,255,255,0.55)" }}>
            Profile, privacy, notifications, and the small switches that make Hyperfix yours.
          </p>
        </div>
      </header>

      <div className="relative max-w-2xl mx-auto px-4 sm:px-6 lg:px-8" style={{ marginTop: -24 }}>
        <div className="anim-fadeUp">
          <SettingsForm profile={profile} userEmail={user.email ?? ""} userId={user.id} />
        </div>
      </div>
    </div>
  );
}
