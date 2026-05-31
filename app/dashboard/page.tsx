import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { Suspense } from "react";
import { DashboardFilters } from "./DashboardFilters";
import { SkeletonGrid } from "@/components/FixCardSkeleton";
import { OnboardingModal } from "@/components/OnboardingModal";
import { WelcomeBackBanner } from "@/components/WelcomeBackBanner";
import { MilestoneBanner } from "@/components/MilestoneBanner";
import { DailyQuestsClient } from "@/components/DailyQuestsClient";
import { getDailyQuests } from "@/lib/quests/generate";
import { levelForPoints } from "@/lib/gamification/levels";
import { Plus, Users, Inbox, Timer, Activity, Pill, BookOpen, Flame, Snowflake, Sparkles, Trophy } from "lucide-react";

type Fix = {
  id: string;
  title: string;
  category: string;
  status: string;
  intensity: number;
  note: string | null;
  started_at: string;
  ended_at: string | null;
  created_at: string;
  is_public: boolean;
  banner_url: string | null;
};

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 6) return "night owl";
  if (hour < 12) return "morning";
  if (hour < 18) return "afternoon";
  if (hour < 22) return "evening";
  return "night owl";
}

function getDayCount(startedAt: string): number {
  const diff = Date.now() - new Date(startedAt).getTime();
  return Math.max(1, Math.ceil(diff / 86400000));
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
  const { level, next } = levelForPoints(totalPoints);
  const levelPct = next
    ? Math.min(100, Math.max(0, ((totalPoints - level.points) / (next.points - level.points)) * 100))
    : 100;

  let fixes: Fix[] = [];
  if (user) {
    const { data } = await supabase
      .from("fixes")
      .select("id, title, category, status, intensity, note, started_at, ended_at, created_at, is_public, banner_url")
      .eq("user_id", user.id)
      .not("status", "eq", "Ended")
      .order("created_at", { ascending: false });
    fixes = data || [];
  }

  const today = new Date().toISOString().split("T")[0];
  let checkedInIds: string[] = [];
  if (user) {
    const { data: todayEntries } = await supabase
      .from("fix_entries")
      .select("fix_id")
      .eq("user_id", user.id)
      .eq("date", today);
    checkedInIds = (todayEntries ?? []).map((e: { fix_id: string }) => e.fix_id);
  }

  const MILESTONES = [7, 30, 100, 365] as const;
  const milestoneFixes = fixes
    .map((f) => ({ id: f.id, title: f.title, days: getDayCount(f.started_at) }))
    .filter((f) => (MILESTONES as readonly number[]).includes(f.days));

  const quests = user ? await getDailyQuests(user.id) : [];
  const questsDone = quests.filter((q) => q.completed_at).length;

  const greeting = getGreeting();
  const firstName = displayName.split(" ")[0];

  const toolkitItems = [
    { href: "/dashboard/brain-dump", label: "Brain Dump", sub: "Clear your head", icon: <Inbox size={18} strokeWidth={1.5} className="text-accent" /> },
    { href: "/dashboard/timer", label: "Focus Timer", sub: "25-min sessions", icon: <Timer size={18} strokeWidth={1.5} className="text-accent" /> },
    { href: "/dashboard/mood", label: "Mood Log", sub: "Track patterns", icon: <Activity size={18} strokeWidth={1.5} className="text-accent" /> },
    { href: "/dashboard/meds", label: "Medications", sub: "Log doses", icon: <Pill size={18} strokeWidth={1.5} className="text-accent" /> },
  ];

  return (
    <div className="min-h-screen px-5 sm:px-8 pt-8 pb-20" style={{ background: "var(--bg)" }}>
      <OnboardingModal totalFixes={fixes.length} />
      <div className="max-w-5xl mx-auto space-y-6">

        {/* Header: greeting + XP */}
        <div className="anim-fadeUp">
          <p className="font-mono text-[11px] uppercase tracking-widest text-accent mb-1">
            {greeting}
          </p>
          <div className="flex items-end justify-between gap-4">
            <h1
              className="font-display text-ink leading-none tracking-tight"
              style={{ fontSize: "clamp(30px,5vw,48px)" }}
            >
              {firstName}.
            </h1>
            <div className="hidden lg:flex items-center gap-3 pb-1">
              {currentStreak > 0 && (
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full" style={{ background: "var(--accent-soft)", border: "1px solid var(--accent)" }}>
                  <Flame size={13} strokeWidth={2} className="text-accent" />
                  <span className="font-mono text-[11px] text-accent">{currentStreak}d streak</span>
                </div>
              )}
              {streakFreezes > 0 && (
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full" style={{ background: "var(--bg-elevated)", border: "1px solid var(--line)" }}>
                  <Snowflake size={13} strokeWidth={1.5} className="text-ink-muted" />
                  <span className="font-mono text-[11px] text-ink-muted">{streakFreezes} freeze{streakFreezes !== 1 ? "s" : ""}</span>
                </div>
              )}
            </div>
          </div>

          {/* XP Progress bar */}
          <Link href="/dashboard/points" className="block mt-4 group">
            <div
              className="rounded-2xl p-4 transition-all hover:-translate-y-0.5"
              style={{ background: "var(--bg-elevated)", border: "1px solid var(--line)" }}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Sparkles size={13} strokeWidth={1.5} className="text-accent" />
                  <span className="font-mono text-[11px] uppercase tracking-widest text-accent">{level.name}</span>
                </div>
                <span className="font-mono text-[11px] tabular-nums text-ink-muted">
                  {totalPoints.toLocaleString()} XP
                  {next && <span className="text-ink-faint"> / {next.points.toLocaleString()}</span>}
                </span>
              </div>
              <div className="h-2 rounded-full overflow-hidden" style={{ background: "var(--line)" }}>
                <div
                  className="h-full rounded-full transition-all duration-700"
                  style={{ width: `${levelPct}%`, background: "var(--accent)" }}
                />
              </div>
              {next && (
                <p className="mt-1.5 font-mono text-[10px] text-ink-faint">
                  {(next.points - totalPoints).toLocaleString()} XP to {next.name}
                </p>
              )}
            </div>
          </Link>

          {username && (
            <div className="flex items-center gap-3 mt-3 flex-wrap">
              <Link href={`/u/${username}`} className="font-mono text-[11px] text-ink-muted hover:text-accent transition-colors">
                @{username} · profile →
              </Link>
              <Link href="/leaderboard" className="inline-flex items-center gap-1 font-mono text-[11px] text-ink-faint hover:text-accent transition-colors">
                <Trophy size={10} strokeWidth={2} />
                leaderboard →
              </Link>
            </div>
          )}
        </div>

        {/* Daily Quests */}
        {user && (
          <section className="anim-fadeUp" style={{ animationDelay: "80ms" }}>
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

        {/* ADHD Toolkit */}
        <section className="anim-fadeUp" style={{ animationDelay: "160ms" }}>
          <h2 className="font-mono text-[11px] uppercase tracking-widest text-ink-faint mb-3">
            ADHD Toolkit
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {toolkitItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="flex flex-col gap-3 p-4 rounded-2xl border transition-all hover:scale-[1.02] active:scale-[0.98]"
                style={{ background: "var(--bg-elevated)", borderColor: "var(--line)" }}
              >
                {item.icon}
                <div>
                  <p className="font-sans text-[13px] font-medium text-ink">{item.label}</p>
                  <p className="font-mono text-[10px] text-ink-faint mt-0.5">{item.sub}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Focus Rooms */}
        <Link
          href="/room"
          className="flex items-center justify-between gap-4 rounded-2xl px-5 py-4 anim-fadeUp transition-all hover:scale-[1.01] active:scale-[0.99]"
          style={{ background: "var(--accent-soft)", border: "1px solid var(--accent)" }}
        >
          <div className="flex items-center gap-4 min-w-0">
            <div
              className="shrink-0 flex items-center justify-center rounded-xl"
              style={{ width: 40, height: 40, background: "var(--bg-elevated)", border: "1px solid var(--accent)" }}
            >
              <Users size={18} strokeWidth={1.5} className="text-accent" />
            </div>
            <div className="min-w-0">
              <p className="font-sans text-[13px] font-semibold text-ink">Focus Rooms</p>
              <p className="font-mono text-[11px] text-accent truncate">
                Body-double with others · join a live session →
              </p>
            </div>
          </div>
          <svg className="shrink-0 text-accent" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </Link>

        <WelcomeBackBanner firstName={firstName} activeCount={fixes.length} />
        {milestoneFixes.length > 0 && <MilestoneBanner milestones={milestoneFixes} />}

        {/* Active Projects */}
        <section className="anim-fadeUp" style={{ animationDelay: "240ms" }}>
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-mono text-[11px] uppercase tracking-widest text-ink-faint">
              Active Projects
              {fixes.length > 0 && <span className="ml-2 text-ink-faint">· {fixes.length}</span>}
            </h2>
            <Link
              href="/dashboard/new"
              className="inline-flex items-center gap-1.5 font-mono text-[10px] text-accent hover:opacity-80 transition-opacity"
            >
              <Plus size={11} strokeWidth={2} />
              New project
            </Link>
          </div>

          {fixes.length > 0 ? (
            <Suspense fallback={<SkeletonGrid />}>
              <DashboardFilters fixes={fixes} checkedInIds={checkedInIds} />
            </Suspense>
          ) : (
            <EmptyProjects />
          )}
        </section>
      </div>
    </div>
  );
}

function EmptyProjects() {
  return (
    <div
      className="rounded-2xl border p-10 text-center"
      style={{ background: "var(--bg-elevated)", borderColor: "var(--line)" }}
    >
      <div className="max-w-sm mx-auto flex flex-col items-center gap-5">
        <div>
          <h3
            className="font-display text-ink"
            style={{ fontSize: "clamp(22px,4vw,32px)", letterSpacing: "-0.02em" }}
          >
            What are you working on?
          </h3>
          <p className="mt-2 text-[14px] text-ink-muted leading-relaxed">
            Add a project to start tracking your focus, intensity, and progress.
          </p>
        </div>
        <Link
          href="/dashboard/new"
          className="inline-flex items-center gap-2 text-[13px] font-medium px-5 py-2.5 rounded-full transition-all hover:opacity-90 active:scale-[0.98]"
          style={{ background: "var(--invert-bg)", color: "var(--invert-ink)" }}
        >
          <Plus size={13} strokeWidth={2} />
          New project
        </Link>
        <div className="grid grid-cols-3 gap-3 w-full mt-2">
          {[
            { step: "01", title: "Name it", body: "What has taken over your brain lately?" },
            { step: "02", title: "Track it", body: "Daily check-ins, intensity, notes." },
            { step: "03", title: "Earn XP", body: "Every action builds your streak and level." },
          ].map(({ step, title, body }) => (
            <div
              key={step}
              className="rounded-xl p-4 text-left border"
              style={{ background: "var(--bg)", borderColor: "var(--line)" }}
            >
              <span className="font-mono text-[9px] uppercase tracking-widest text-accent">{step}</span>
              <p className="font-display text-[15px] mt-1.5 text-ink">{title}</p>
              <p className="text-[11px] mt-1 leading-relaxed text-ink-muted">{body}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
