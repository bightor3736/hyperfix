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
    <div className="min-h-screen px-5 sm:px-8 pt-8 pb-20 bg-bg">
      <div className="max-w-3xl mx-auto space-y-8">
        {/* Header */}
        <header className="anim-fadeUp">
          <p className="font-mono text-[11px] uppercase tracking-widest text-accent mb-2">
            your progress
          </p>
          <div className="flex items-end justify-between gap-4 flex-wrap">
            <div>
              <h1
                className="font-display text-ink leading-none tracking-tight"
                style={{ fontSize: "clamp(36px,6vw,56px)" }}
              >
                {totalPoints.toLocaleString()}
                <span className="font-mono text-base text-ink-muted ml-2 align-middle">
                  XP
                </span>
              </h1>
              <p className="mt-2 text-[15px] text-ink-muted">
                You&apos;re{" "}
                <span className="text-accent font-medium">{level.name}</span>.{" "}
                {next
                  ? `${pointsToNext.toLocaleString()} XP to ${next.name}.`
                  : "Maximum unwellness achieved."}
              </p>
            </div>
            <Link
              href="/leaderboard"
              className="inline-flex items-center gap-2 h-10 px-5 rounded-full bg-invert-bg text-invert-ink text-[13px] font-medium hover:opacity-90 transition-opacity"
            >
              <Trophy size={14} strokeWidth={1.5} />
              Leaderboard
            </Link>
          </div>
        </header>

        {/* Streak + freezes */}
        <div className="grid grid-cols-3 gap-3 anim-fadeUp delay-100">
          <div className="rounded-2xl border border-line bg-bg-elevated p-4">
            <p className="font-mono text-[10px] uppercase tracking-widest text-ink-faint">streak</p>
            <p className="font-display text-3xl text-ink tabular-nums mt-1">{currentStreak}</p>
          </div>
          <div className="rounded-2xl border border-line bg-bg-elevated p-4">
            <p className="font-mono text-[10px] uppercase tracking-widest text-ink-faint">longest</p>
            <p className="font-display text-3xl text-ink tabular-nums mt-1">{longestStreak}</p>
          </div>
          <Link
            href={streakFreezes > 0 || isPro ? "/dashboard/points" : "/pricing"}
            className="rounded-2xl border p-4 block transition-all hover:-translate-y-0.5"
            style={{
              background: streakFreezes > 0 ? "var(--bg-elevated)" : "var(--accent-soft)",
              borderColor: streakFreezes > 0 ? "var(--line)" : "var(--accent)",
            }}
          >
            <p className="font-mono text-[10px] uppercase tracking-widest text-ink-faint">freezes</p>
            <p className="font-display text-3xl text-ink tabular-nums mt-1">{streakFreezes}</p>
            {streakFreezes === 0 && !isPro && (
              <p className="font-mono text-[9px] uppercase tracking-widest text-accent mt-1">Get more →</p>
            )}
          </Link>
        </div>

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
