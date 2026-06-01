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
import { Snowflake, Flame } from "lucide-react";

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

  const allQuestsDone = questsDone === quests.length && quests.length > 0;

  return (
    <div className="min-h-screen px-5 sm:px-8 pt-8 pb-24" style={{ background: "var(--bg)" }}>
      <div className="max-w-2xl mx-auto">

        {/* ── Top: greeting + progress snapshot ───────────────────────── */}
        <div className="flex items-center justify-between gap-4 anim-fadeUp mb-5">
          <div className="min-w-0">
            <p
              className="mb-0.5 uppercase tracking-[0.12em] text-[11px]"
              style={{ fontFamily: "var(--font-landing-sans), Inter, sans-serif", color: "var(--accent)", letterSpacing: "0.12em" }}
            >
              {greeting}
            </p>
            <h1
              className="text-ink leading-none truncate"
              style={{
                fontFamily: "var(--font-landing-sans), Inter, sans-serif",
                fontWeight: 600,
                letterSpacing: "-0.045em",
                fontSize: "clamp(26px,4.5vw,40px)",
              }}
            >
              <span
                style={{
                  fontFamily: "var(--font-landing-serif), 'Source Serif 4', serif",
                  fontStyle: "italic",
                }}
              >
                {firstName}
              </span>
              .
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

        {/* slim XP snapshot */}
        {user && (
          <div className="anim-fadeUp mb-9" style={{ animationDelay: "30ms" }}>
            <XpHud totalPoints={totalPoints} />
          </div>
        )}

        {/* ── THE ONE THING — single primary action ───────────────────── */}
        {user && (
          <section className="anim-fadeUp" style={{ animationDelay: "60ms" }}>
            <p className="font-mono text-[11px] uppercase tracking-widest text-ink-faint mb-3">
              Right now
            </p>
            <DopamineMenu todayCount={dopamineToday} name={firstName} />
          </section>
        )}

        {/* ── Secondary — calm, optional, clearly de-emphasized ───────── */}
        {user && (
          <div className="mt-14 anim-fadeUp" style={{ animationDelay: "120ms" }}>
            <div className="flex items-center gap-3 mb-6">
              <span className="h-px flex-1" style={{ background: "var(--line)" }} />
              <span className="font-mono text-[10px] uppercase tracking-widest text-ink-faint shrink-0">
                When you&apos;ve got more in you
              </span>
              <span className="h-px flex-1" style={{ background: "var(--line)" }} />
            </div>

            <div className="space-y-5">
              {/* Beat the Wall — task initiation */}
              <BeatTheWall wallsTotal={wallsTotal} name={firstName} />

              {/* Daily Quests */}
              <section>
                <div className="flex items-center justify-between mb-3">
                  <h2 className="font-mono text-[11px] uppercase tracking-widest text-ink-faint">
                    Today&apos;s Quests
                  </h2>
                  <span
                    className="font-mono text-[10px] px-2 py-0.5 rounded-full"
                    style={{
                      background: allQuestsDone ? "var(--reward-mint-soft)" : "var(--line)",
                      color: allQuestsDone ? "var(--reward-mint)" : "var(--ink-muted)",
                    }}
                  >
                    {questsDone}/{quests.length} done
                  </span>
                </div>
                <DailyQuestsClient initialQuests={quests} />
              </section>

              {/* quiet links + share */}
              <div className="flex items-center justify-between gap-3 flex-wrap pt-1">
                <div className="flex items-center gap-4 flex-wrap">
                  <Link href="/dashboard/fixations" className="inline-flex items-center gap-1.5 font-mono text-[11px] text-ink-muted hover:text-accent transition-colors">
                    <Flame size={11} strokeWidth={2} />
                    Hyperfixations →
                  </Link>
                  {username && (
                    <Link href={`/u/${username}`} className="font-mono text-[11px] text-ink-faint hover:text-accent transition-colors">
                      @{username} →
                    </Link>
                  )}
                </div>
                <ShareStatsButton
                  name={firstName}
                  streak={currentStreak}
                  level={levelName}
                  xp={totalPoints}
                  hits={dopamineTotal}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
