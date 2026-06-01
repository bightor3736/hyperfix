import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { DailyQuestsClient } from "@/components/DailyQuestsClient";
import { DopamineMenu } from "@/components/game/DopamineMenu";
import { BeatTheWall } from "@/components/game/BeatTheWall";
import { XpHud } from "@/components/game/XpHud";
import { StreakFlame } from "@/components/game/StreakFlame";
import { ShareStatsButton } from "@/components/game/ShareStatsButton";
import { getDailyQuests } from "@/lib/quests/generate";
import { levelForPoints } from "@/lib/gamification/levels";
import { Snowflake, Trophy } from "lucide-react";

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 6) return "night owl";
  if (hour < 12) return "morning";
  if (hour < 18) return "afternoon";
  if (hour < 22) return "evening";
  return "night owl";
}

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  let displayName = user?.user_metadata?.full_name || user?.email?.split("@")[0] || "there";
  let username: string | null = null;

  let profile: {
    display_name: string | null;
    username: string | null;
    total_points: number;
    current_streak: number;
    longest_streak: number;
    streak_freezes: number;
  } | null = null;

  if (user) {
    const { data } = await supabase
      .from("profiles")
      .select("display_name, username, total_points, current_streak, longest_streak, streak_freezes")
      .eq("id", user.id)
      .single();
    profile = data;
    if (data) {
      displayName = data.display_name || data.username || displayName;
      username = data.username ?? null;
    }
  }

  const totalPoints = profile?.total_points ?? 0;
  const currentStreak = profile?.current_streak ?? 0;
  const streakFreezes = profile?.streak_freezes ?? 0;

  const quests = user ? await getDailyQuests(user.id) : [];
  const questsDone = quests.filter((q) => q.completed_at).length;

  // Dopamine hits — today (the core loop) + lifetime total (for the share card)
  let dopamineToday = 0;
  let dopamineTotal = 0;
  if (user) {
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);
    const [todayRes, totalRes] = await Promise.all([
      supabase
        .from("dopamine_hits")
        .select("id", { count: "exact", head: true })
        .eq("user_id", user.id)
        .gte("created_at", startOfDay.toISOString()),
      supabase
        .from("dopamine_hits")
        .select("id", { count: "exact", head: true })
        .eq("user_id", user.id),
    ]);
    dopamineToday = todayRes.count ?? 0;
    dopamineTotal = totalRes.count ?? 0;
  }

  let wallsTotal = 0;
  if (user) {
    const { count } = await supabase
      .from("walls_broken")
      .select("id", { count: "exact", head: true })
      .eq("user_id", user.id);
    wallsTotal = count ?? 0;
  }

  const levelName = levelForPoints(totalPoints).level.name;
  const greeting = getGreeting();
  const firstName = displayName.split(" ")[0];

  return (
    <div className="min-h-screen px-5 sm:px-8 pt-8 pb-20" style={{ background: "var(--bg)" }}>
      <div className="max-w-3xl mx-auto space-y-6">

        {/* Greeting row */}
        <div className="flex items-center justify-between gap-4 anim-fadeUp">
          <div className="min-w-0">
            <p className="font-mono text-[11px] uppercase tracking-widest mb-0.5" style={{ color: "var(--energy)" }}>
              {greeting}
            </p>
            <h1 className="font-display text-ink leading-none tracking-tight truncate" style={{ fontSize: "clamp(26px,4.5vw,42px)" }}>
              {firstName}.
            </h1>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <StreakFlame days={currentStreak} size="md" />
            {streakFreezes > 0 && (
              <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full" style={{ background: "var(--bg-elevated)", border: "1px solid var(--line)" }}>
                <Snowflake size={13} strokeWidth={1.5} className="text-ink-muted" />
                <span className="font-mono text-[11px] text-ink-muted">{streakFreezes}</span>
              </div>
            )}
          </div>
        </div>

        {/* Dopamine Menu — the hero, the core daily loop */}
        {user && (
          <section className="anim-fadeUp" style={{ animationDelay: "40ms" }}>
            <DopamineMenu todayCount={dopamineToday} name={firstName} />
          </section>
        )}

        {/* Beat the Wall — task initiation */}
        {user && (
          <section className="anim-fadeUp" style={{ animationDelay: "55ms" }}>
            <BeatTheWall wallsTotal={wallsTotal} name={firstName} />
          </section>
        )}

        {/* XP HUD */}
        {user && (
          <section className="anim-fadeUp" style={{ animationDelay: "70ms" }}>
            <XpHud totalPoints={totalPoints} />
            <div className="flex items-center justify-between gap-3 mt-3 flex-wrap px-1">
              <div className="flex items-center gap-3 flex-wrap">
                {username && (
                  <Link href={`/u/${username}`} className="font-mono text-[11px] text-ink-muted hover:text-accent transition-colors">
                    @{username} · profile →
                  </Link>
                )}
                <Link href="/leaderboard" className="inline-flex items-center gap-1 font-mono text-[11px] text-ink-faint hover:text-accent transition-colors">
                  <Trophy size={10} strokeWidth={2} />
                  leaderboard →
                </Link>
              </div>
              <ShareStatsButton
                name={firstName}
                streak={currentStreak}
                level={levelName}
                xp={totalPoints}
                hits={dopamineTotal}
              />
            </div>
          </section>
        )}

        {/* Daily Quests */}
        {user && (
          <section className="anim-fadeUp" style={{ animationDelay: "100ms" }}>
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-mono text-[11px] uppercase tracking-widest text-ink-faint">
                Today&apos;s Quests
              </h2>
              <span
                className="font-mono text-[10px] px-2 py-0.5 rounded-full"
                style={{
                  background: questsDone === quests.length && quests.length > 0 ? "var(--accent-soft)" : "var(--line)",
                  color: questsDone === quests.length && quests.length > 0 ? "var(--accent)" : "var(--ink-muted)",
                }}
              >
                {questsDone}/{quests.length} done
              </span>
            </div>
            <DailyQuestsClient initialQuests={quests} />
          </section>
        )}
      </div>
    </div>
  );
}
