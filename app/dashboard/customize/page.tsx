import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { ProfileCustomizer } from "./ProfileCustomizer";


export default async function CustomizePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/auth/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("id, username, display_name, avatar_url, bio, banner_url, is_pro, accent_color, social_link, pronouns, status_emoji, status_text, socials, profile_theme")
    .eq("id", user.id)
    .single();

  return (
    <div className="min-h-screen pb-16" style={{ background: "var(--bg)" }}>
      <header
        style={{
          background: "#000000",
          borderBottom: "1px solid rgba(255,255,255,0.08)",
          padding: "clamp(28px,4.5vw,44px) clamp(20px,5vw,44px) 40px",
        }}
      >
        <div>
          <p className="mb-2 uppercase" style={{ fontSize: 11, fontWeight: 600, letterSpacing: "3px", color: "rgba(255,255,255,0.35)" }}>Profile</p>
          <h1 style={{ fontWeight: 500, letterSpacing: "-0.04em", fontSize: "clamp(36px,5.5vw,54px)", lineHeight: 1, color: "#ffffff" }}>
            Make it <span style={{ fontFamily: "var(--font-serif-display, 'Instrument Serif', serif)", fontStyle: "italic", fontWeight: 400 }}>yours</span>.
          </h1>
          <p className="mt-3 font-sans text-[15px]" style={{ color: "rgba(255,255,255,0.55)" }}>
            Theme, accent, status, pronouns, and all your links — like Discord, but for your fixations.
          </p>
        </div>
      </header>

      <div className="relative max-w-2xl mx-auto px-4 sm:px-6 lg:px-8" style={{ marginTop: 32 }}>
        <div className="anim-fadeUp">
          <ProfileCustomizer profile={profile} />
        </div>
      </div>
    </div>
  );
}
