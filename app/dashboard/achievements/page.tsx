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
      {/* Hero */}
      <header
        style={{
          background: "#000000",
          borderBottom: "1px solid rgba(255,255,255,0.08)",
          padding: "clamp(28px,4.5vw,44px) clamp(20px,5vw,44px) 40px",
        }}
      >
        <div>
          <p className="mb-2 uppercase" style={{ fontSize: 11, fontWeight: 600, letterSpacing: "3px", color: "rgba(255,255,255,0.35)" }}>Achievements</p>
          <div className="flex items-end justify-between gap-4 flex-wrap">
            <div>
              <h1 style={{ fontWeight: 500, letterSpacing: "-0.04em", fontSize: "clamp(36px,5.5vw,54px)", lineHeight: 1, color: "#ffffff" }}>
                Badges <span style={{ fontFamily: "var(--font-serif-display, 'Instrument Serif', serif)", fontStyle: "italic", fontWeight: 400 }}>earned</span>.
              </h1>
              <p className="mt-3 font-sans text-[15px]" style={{ color: "rgba(255,255,255,0.55)" }}>
                {closest
                  ? <>Closest unlock: <span style={{ color: "#ffffff", fontWeight: 600 }}>{closest.name}</span> — {closest.progress}% there.</>
                  : "Every badge unlocked. Absolutely feral."}
              </p>
            </div>
            <Link
              href="/dashboard/points"
              className="liquid-glass inline-flex items-center gap-2 h-10 px-5 rounded-full text-[13px] font-medium hover:opacity-90 transition-opacity"
              style={{ color: "#ffffff" }}
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
              <div key={label} className="flex flex-col items-center px-4 py-2.5" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 16 }}>
                <span className="text-[20px] font-bold tabular-nums leading-none" style={{ color: "#ffffff", letterSpacing: "-0.03em" }}>{value}</span>
                <span className="mt-1 uppercase" style={{ fontSize: 9, fontWeight: 600, letterSpacing: "0.08em", color: "rgba(255,255,255,0.35)" }}>{label}</span>
              </div>
            ))}
          </div>
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-5 sm:px-8" style={{ marginTop: 32 }}>
        <AchievementCard
          achievements={achievements}
          highlightedAchievements={highlighted}
        />
      </div>
    </div>
  );
}
