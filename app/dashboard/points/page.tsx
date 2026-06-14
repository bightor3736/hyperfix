import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Trophy } from "lucide-react";
import { PointsLevelsTimeline } from "@/components/ui/points-levels-timeline";
import { PointsAwards, type PointsAward } from "@/components/ui/points-awards";
import { PointsBoost } from "@/components/ui/points-boost";
import { AchievementCard } from "@/components/ui/achievement-card";
import type { UserAchievement } from "@/components/ui/achievement-list";
import { LEVELS, levelForPoints } from "@/lib/gamification/levels";
import {
  ACHIEVEMENT_DEFS,
  computeUserStats,
  progressFor,
} from "@/lib/gamification/achievements";

export const dynamic = "force-dynamic";

export default async function PointsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/auth/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("total_points, username, display_name, current_streak, longest_streak, streak_freezes, is_pro")
    .eq("id", user.id)
    .single();

  const totalPoints = profile?.total_points ?? 0;
  const currentStreak = profile?.current_streak ?? 0;
  const longestStreak = profile?.longest_streak ?? 0;
  const streakFreezes = profile?.streak_freezes ?? 0;
  const isPro = profile?.is_pro ?? false;
  const { level, next } = levelForPoints(totalPoints);
  const pointsToNext = next ? next.points - totalPoints : 0;

  // History
  const { data: events } = await supabase
    .from("point_events")
    .select("id, kind, points, balance_after, description, created_at")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(40);

  const awards: PointsAward[] = (events ?? []).map(
    (e: {
      id: string;
      kind: string;
      points: number;
      balance_after: number | null;
      description: string | null;
      created_at: string;
    }) => ({
      id: e.id,
      awarded: e.points,
      date: e.created_at,
      total: e.balance_after ?? 0,
      trigger: {
        id: e.id,
        type: e.kind,
        points: e.points,
        metricName: e.description,
      },
    })
  );

  // Achievements
  const stats = await computeUserStats(supabase, user.id, totalPoints);
  const { data: owned } = await supabase
    .from("user_achievements")
    .select("achievement_id, achieved_at")
    .eq("user_id", user.id);
  const ownedMap = new Map(
    (owned ?? []).map((r: { achievement_id: string; achieved_at: string }) => [
      r.achievement_id,
      r.achieved_at,
    ])
  );

  const achievements: UserAchievement[] = ACHIEVEMENT_DEFS.map((def) => {
    const achievedAt = ownedMap.get(def.id) ?? null;
    return {
      id: def.id,
      name: def.name,
      description: def.description,
      trigger: def.trigger,
      badgeUrl: null,
      progress: progressFor(def, stats),
      rarity: def.rarity,
      achievedAt,
    };
  });
  const highlighted = achievements
    .filter((a) => a.achievedAt !== null)
    .sort((a, b) => (a.rarity ?? 100) - (b.rarity ?? 100));

  // Active boost
  const nowIso = new Date().toISOString();
  const { data: boosts } = await supabase
    .from("point_boosts")
    .select("name, description, multiplier, ends_at")
    .eq("active", true)
    .lte("starts_at", nowIso)
    .limit(1);
  const boost = (boosts ?? []).find(
    (b: { ends_at: string | null }) => !b.ends_at || b.ends_at >= nowIso
  );

  return (
    <div className="min-h-screen pb-20" style={{ background: "var(--bg)" }}>
      {/* Hero */}
      <header
        style={{
          background: "var(--bg-white)",
          borderBottom: "1px solid var(--line)",
          padding: "clamp(28px,4.5vw,44px) clamp(20px,5vw,44px) 40px",
        }}
      >
        <div>
          <p className="mb-2 uppercase" style={{ fontSize: 11, fontWeight: 600, letterSpacing: "3px", color: "var(--ink-faint)" }}>Your progress</p>
          <div className="flex items-end justify-between gap-4 flex-wrap">
            <div>
              <h1 style={{ fontWeight: 500, letterSpacing: "-0.04em", fontSize: "clamp(36px,6vw,56px)", lineHeight: 1, color: "var(--ink)" }}>
                <span style={{ fontFamily: "var(--font-serif-display, 'Instrument Serif', serif)", fontStyle: "italic", fontWeight: 400 }}>{totalPoints.toLocaleString()}</span>
                <span className="ml-2 align-middle" style={{ letterSpacing: "0.08em", color: "var(--ink-faint)", fontSize: 16, fontWeight: 600 }}>XP</span>
              </h1>
              <p className="mt-2 font-sans text-[15px]" style={{ color: "var(--ink-muted)" }}>
                You&apos;re <span style={{ color: "var(--xp)", fontWeight: 600 }}>{level.name}</span>.{" "}
                {next ? `${pointsToNext.toLocaleString()} XP to ${next.name}.` : "Maximum unwellness achieved."}
              </p>
            </div>
            <Link
              href="/leaderboard"
              className="inline-flex items-center gap-2 h-10 px-5 rounded-full text-[13px] font-medium hover:opacity-90 transition-opacity"
              style={{ background: "var(--ink)", color: "var(--bg)" }}
            >
              <Trophy size={14} strokeWidth={1.5} />
              Leaderboard
            </Link>
          </div>
          {/* Streak stat pills */}
          <div className="flex gap-3 mt-5">
            {[
              { label: "streak", value: currentStreak },
              { label: "longest", value: longestStreak },
              { label: "freezes", value: streakFreezes },
            ].map(({ label, value }) => (
              <div key={label} className="flex flex-col items-center px-4 py-2.5" style={{ background: "var(--fill)", border: "1px solid var(--line)", borderRadius: 16 }}>
                <span className="text-[20px] font-bold tabular-nums leading-none" style={{ color: "var(--ink)", letterSpacing: "-0.03em" }}>{value}</span>
                <span className="mt-1 uppercase" style={{ fontSize: 9, fontWeight: 600, letterSpacing: "0.08em", color: "var(--ink-faint)" }}>{label}</span>
              </div>
            ))}
            {streakFreezes === 0 && !isPro && (
              <Link href="/pricing" className="flex items-center px-4 py-2.5 rounded-full text-[11px] font-semibold uppercase transition-all hover:opacity-80" style={{ letterSpacing: "0.08em", background: "var(--accent)", color: "#fff" }}>
                Get Pro freezes →
              </Link>
            )}
          </div>
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-5 sm:px-8 space-y-8" style={{ marginTop: 32, paddingTop: 0 }}>

        {/* Active boost */}
        {boost && (
          <div className="anim-fadeUp delay-100">
            <PointsBoost
              boost={{
                name: boost.name,
                status: "active",
                description: boost.description ?? undefined,
                multiplier: boost.multiplier,
                endDate: boost.ends_at ?? undefined,
              }}
              cta={{ link: "/dashboard/new", text: "Earn double" }}
            />
          </div>
        )}

        {/* Achievements */}
        <section className="anim-fadeUp delay-200">
          <h2 className="text-[11px] font-mono uppercase tracking-widest text-ink-faint mb-3">
            Achievements
          </h2>
          <AchievementCard
            achievements={achievements}
            highlightedAchievements={highlighted}
          />
        </section>

        {/* Levels */}
        <section className="anim-fadeUp delay-300">
          <h2 className="text-[11px] font-mono uppercase tracking-widest text-ink-faint mb-3">
            Levels
          </h2>
          <PointsLevelsTimeline
            levels={LEVELS.map((l) => ({
              id: l.id,
              name: l.name,
              description: l.description,
              points: l.points,
            }))}
            currentPoints={totalPoints}
          />
        </section>

        {/* History */}
        <section className="anim-fadeUp delay-400">
          <h2 className="text-[11px] font-mono uppercase tracking-widest text-ink-faint mb-3">
            Recent XP
          </h2>
          {awards.length > 0 ? (
            <PointsAwards awards={awards} />
          ) : (
            <div className="rounded-xl border border-line bg-bg-elevated p-8 text-center">
              <p className="text-ink-muted text-sm">
                No XP yet. Check in on a fixation to start earning.
              </p>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
