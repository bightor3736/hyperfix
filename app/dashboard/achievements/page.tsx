import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Sparkles } from "lucide-react";
import { AchievementCard } from "@/components/ui/achievement-card";
import type { UserAchievement } from "@/components/ui/achievement-list";
import {
  ACHIEVEMENT_DEFS,
  computeUserStats,
  progressFor,
} from "@/lib/gamification/achievements";

export const dynamic = "force-dynamic";

export default async function AchievementsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/auth/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("total_points")
    .eq("id", user.id)
    .single();
  const totalPoints = profile?.total_points ?? 0;

  const stats = await computeUserStats(supabase, user.id, totalPoints);
  const { data: owned } = await supabase
    .from("user_achievements")
    .select("achievement_id, achieved_at")
    .eq("user_id", user.id);
  const ownedMap = new Map(
    (owned ?? []).map((r: { achievement_id: string; achieved_at: string }) => [r.achievement_id, r.achieved_at])
  );

  const achievements: UserAchievement[] = ACHIEVEMENT_DEFS.map((def) => ({
    id: def.id,
    name: def.name,
    description: def.description,
    trigger: def.trigger,
    badgeUrl: null,
    progress: progressFor(def, stats),
    rarity: def.rarity,
    achievedAt: ownedMap.get(def.id) ?? null,
  }));
  const highlighted = achievements
    .filter((a) => a.achievedAt !== null)
    .sort((a, b) => (a.rarity ?? 100) - (b.rarity ?? 100));

  const unlocked = achievements.filter((a) => a.achievedAt !== null).length;
  const closest = achievements
    .filter((a) => a.achievedAt === null)
    .sort((a, b) => (b.progress ?? 0) - (a.progress ?? 0))[0];

  return (
    <div className="min-h-screen pb-20" style={{ background: "var(--bg)" }}>
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
        <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E\")", backgroundSize: "200px 200px", opacity: 0.7 }} />
        <div className="relative z-10">
          <p className="font-mono text-[11px] uppercase tracking-[0.18em] mb-2" style={{ color: "rgba(167,139,250,0.8)" }}>Achievements</p>
          <div className="flex items-end justify-between gap-4 flex-wrap">
            <div>
              <h1 style={{ fontFamily: "var(--font-landing-sans), Inter, sans-serif", fontWeight: 700, letterSpacing: "-0.05em", fontSize: "clamp(36px,5.5vw,54px)", lineHeight: 1, color: "#fff" }}>
                Badges <span style={{ fontFamily: "var(--font-landing-serif), 'Source Serif 4', serif", fontStyle: "italic" }}>earned</span>.
              </h1>
              <p className="mt-3 font-sans text-[15px]" style={{ color: "rgba(255,255,255,0.55)" }}>
                {closest
                  ? <>Closest unlock: <span style={{ color: "#a78bfa", fontWeight: 600 }}>{closest.name}</span> — {closest.progress}% there.</>
                  : "Every badge unlocked. Absolutely feral."}
              </p>
            </div>
            <Link
              href="/dashboard/points"
              className="inline-flex items-center gap-2 h-10 px-5 rounded-full text-[13px] font-medium hover:opacity-90 transition-opacity"
              style={{ background: "rgba(255,255,255,0.12)", border: "1px solid rgba(255,255,255,0.18)", color: "#fff" }}
            >
              <Sparkles size={14} strokeWidth={1.5} />
              XP & Levels
            </Link>
          </div>
          <div className="flex gap-3 mt-5">
            {[
              { label: "unlocked", value: unlocked },
              { label: "total", value: achievements.length },
            ].map(({ label, value }) => (
              <div key={label} className="flex flex-col items-center rounded-2xl px-4 py-2.5" style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.12)" }}>
                <span className="text-[20px] font-bold tabular-nums leading-none" style={{ color: "#fff", fontFamily: "var(--font-landing-sans), Inter, sans-serif", letterSpacing: "-0.03em" }}>{value}</span>
                <span className="font-mono text-[9px] uppercase tracking-widest mt-1" style={{ color: "rgba(255,255,255,0.45)" }}>{label}</span>
              </div>
            ))}
          </div>
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-5 sm:px-8" style={{ marginTop: -24 }}>
        <AchievementCard
          achievements={achievements}
          highlightedAchievements={highlighted}
        />
      </div>
    </div>
  );
}
