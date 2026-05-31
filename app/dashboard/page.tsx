import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { Suspense } from "react";
import { DashboardFilters } from "./DashboardFilters";
import { SkeletonGrid } from "@/components/FixCardSkeleton";
import { OnboardingModal } from "@/components/OnboardingModal";
import { StreakHeatmap } from "@/components/StreakHeatmap";
import { WeekRings } from "@/components/WeekRings";
import { StreakCard } from "@/components/ui/streak-card";
import { ReferralCard } from "@/components/ReferralCard";
import { CategoryIcon } from "@/components/CategoryIcon";
import { MilestoneBanner } from "@/components/MilestoneBanner";
import { WelcomeBackBanner } from "@/components/WelcomeBackBanner";
import { Plus, Users, Inbox, Timer, Activity, Pill } from "lucide-react";

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

const TEAL = "var(--accent)";
const CARD_BG = "var(--bg-elevated)";
const CARD_BORDER = "var(--line)";

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 6) return "it's late";
  if (hour < 12) return "morning";
  if (hour < 18) return "afternoon";
  if (hour < 22) return "evening";
  return "it's late";
}

function getSubtext(
  totalActive: number,
  currentStreak: number,
  highestIntensity: number
): string {
  if (totalActive === 0) return "nothing logged yet. what has taken over your brain?";
  if (highestIntensity >= 9)
    return `${totalActive} active fix${totalActive !== 1 ? "es" : ""}. you are not well. we love that for you.`;
  if (currentStreak >= 14) return `${currentStreak}-day run. this is getting serious.`;
  if (currentStreak >= 7) return `${currentStreak} days in a row. you're so normal about this.`;
  if (totalActive >= 5) return `${totalActive} active fixations. it's giving chaos.`;
  return `${totalActive} active fix${totalActive !== 1 ? "es" : ""}. the brain is doing its thing.`;
}

function getDayCount(startedAt: string): number {
  const start = new Date(startedAt);
  const now = new Date();
  const diff = now.getTime() - start.getTime();
  return Math.max(1, Math.ceil(diff / (1000 * 60 * 60 * 24)));
}

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let displayName =
    user?.user_metadata?.full_name || user?.email?.split("@")[0] || "there";
  let username: string | null = null;
  if (user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("display_name, username")
      .eq("id", user.id)
      .single();
    if (profile) {
      displayName = profile.display_name || profile.username || displayName;
      username = profile.username ?? null;
    }
  }

  let referralCode: string | null = null;
  let referralCount = 0;
  if (user) {
    const { data: referralData } = await supabase
      .from("profiles")
      .select("referral_code, referral_count")
      .eq("id", user.id)
      .single();
    referralCode = referralData?.referral_code ?? null;
    referralCount = referralData?.referral_count ?? 0;
  }

  let fixes: Fix[] = [];
  let fetchError: string | null = null;

  if (user) {
    const { data, error } = await supabase
      .from("fixes")
      .select(
        "id, title, category, status, intensity, note, started_at, ended_at, created_at, is_public, banner_url"
      )
      .eq("user_id", user.id)
      .not("status", "eq", "Ended")
      .order("created_at", { ascending: false });

    if (error) {
      if (
        !error.message.includes("does not exist") &&
        !error.code?.includes("42P01")
      ) {
        fetchError = error.message;
      }
    } else {
      fixes = data || [];
    }
  }

  const today = new Date().toISOString().split("T")[0];
  let checkedInIds: string[] = [];
  if (user) {
    const { data: todayEntries } = await supabase
      .from("fix_entries")
      .select("fix_id")
      .eq("user_id", user.id)
      .eq("date", today);
    checkedInIds = (todayEntries ?? []).map(
      (e: { fix_id: string }) => e.fix_id
    );
  }

  let currentStreak = 0;
  let longestStreak = 0;
  let heatmapDates: string[] = [];
  if (user) {
    const { data: entryDates } = await supabase
      .from("fix_entries")
      .select("date")
      .eq("user_id", user.id)
      .order("date", { ascending: false })
      .limit(90);

    if (entryDates && entryDates.length > 0) {
      const uniqueDates = [
        ...new Set(entryDates.map((e: { date: string }) => e.date)),
      ]
        .sort()
        .reverse();
      heatmapDates = uniqueDates as string[];
      const today2 = new Date().toISOString().split("T")[0];
      const yesterday = new Date(Date.now() - 86400000)
        .toISOString()
        .split("T")[0];

      let cursor =
        uniqueDates[0] === today2 || uniqueDates[0] === yesterday
          ? uniqueDates[0]
          : null;
      if (cursor) {
        for (const d of uniqueDates) {
          if (d === cursor) {
            currentStreak++;
            cursor = new Date(new Date(cursor).getTime() - 86400000)
              .toISOString()
              .split("T")[0];
          } else {
            break;
          }
        }
      }

      // Compute longest streak from ascending sorted dates
      const asc = [...uniqueDates].reverse();
      let run = 1;
      longestStreak = asc.length > 0 ? 1 : 0;
      for (let i = 1; i < asc.length; i++) {
        const diff =
          (new Date(asc[i]).getTime() - new Date(asc[i - 1]).getTime()) /
          86400000;
        if (diff === 1) {
          run++;
          if (run > longestStreak) longestStreak = run;
        } else {
          run = 1;
        }
      }
    }
  }

  const totalActive = fixes.length;
  const longestFix = fixes.reduce((max, fix) => {
    const days = getDayCount(fix.started_at);
    return days > max ? days : max;
  }, 0);
  const highestIntensity = fixes.reduce((max, fix) => {
    return fix.intensity > max ? fix.intensity : max;
  }, 0);

  const greeting = getGreeting();
  const firstName = displayName.split(" ")[0];
  const subtext = getSubtext(totalActive, currentStreak, highestIntensity);

  // Trending suggestions for new users
  let trendingSuggestions: { id: string; title: string; category: string }[] =
    [];
  if (fixes.length === 0) {
    const { data: trending } = await supabase
      .from("fixes")
      .select("id, title, category")
      .eq("is_public", true)
      .is("ended_at", null)
      .order("created_at", { ascending: false })
      .limit(8);
    trendingSuggestions = (trending ?? []).slice(0, 6);
  }

  // Detect milestone fixes (day count exactly at 7, 30, 100, or 365)
  const MILESTONES = [7, 30, 100, 365] as const;
  const milestoneFixes = fixes
    .map((f) => ({ id: f.id, title: f.title, days: getDayCount(f.started_at) }))
    .filter((f) => (MILESTONES as readonly number[]).includes(f.days));

  const toolkitItems = [
    {
      href: "/dashboard/brain-dump",
      label: "Brain Dump",
      sub: "Clear your head",
      icon: <Inbox size={20} strokeWidth={1.5} className="text-accent" />,
    },
    {
      href: "/dashboard/timer",
      label: "Timer",
      sub: "Focus countdown",
      icon: <Timer size={20} strokeWidth={1.5} className="text-accent" />,
    },
    {
      href: "/dashboard/mood",
      label: "Mood Log",
      sub: "Track patterns",
      icon: <Activity size={20} strokeWidth={1.5} className="text-accent" />,
    },
    {
      href: "/dashboard/meds",
      label: "Meds",
      sub: "Log doses",
      icon: <Pill size={20} strokeWidth={1.5} className="text-accent" />,
    },
  ];

  return (
    <div className="min-h-screen px-5 sm:px-8 pt-8 pb-20 bg-bg">
      <OnboardingModal totalFixes={totalActive} />
      <div className="max-w-5xl mx-auto space-y-8">

        {/* Header */}
        <div className="flex items-start justify-between gap-4 anim-fadeUp">
          <div className="flex-1 min-w-0">
            <p className="font-mono text-[11px] uppercase tracking-widest text-accent mb-2">
              good {greeting}
            </p>
            <h1
              className="font-display text-ink leading-none tracking-tight"
              style={{ fontSize: "clamp(32px,5vw,52px)" }}
            >
              {firstName}.
            </h1>
            <p className="mt-2 text-[15px] text-ink-muted max-w-xl">
              {subtext}
            </p>
            {username && (
              <div className="flex items-center gap-3 mt-3 flex-wrap">
                <Link
                  href={`/u/${username}`}
                  className="inline-flex items-center gap-1.5 font-mono text-[11px] text-ink-muted transition-colors hover:text-accent"
                >
                  @{username} · profile →
                </Link>
                <span className="text-ink-faint" style={{ fontSize: 10 }}>·</span>
                <Link
                  href={`/add/${username}`}
                  className="inline-flex items-center gap-1 font-mono text-[11px] text-accent transition-colors hover:opacity-80"
                >
                  <svg
                    width="10"
                    height="10"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
                    <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
                  </svg>
                  hyperfix.app/add/{username}
                </Link>
              </div>
            )}
            {fixes.length >= 3 && (
              <Link
                href="/dashboard/pattern"
                className="inline-flex items-center gap-1.5 font-mono text-xs mt-4 text-ink-faint transition-colors hover:text-accent"
              >
                <svg
                  width="11"
                  height="11"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
                </svg>
                see your pattern →
              </Link>
            )}
          </div>
          <Link
            href="/dashboard/new"
            className="hidden lg:inline-flex items-center gap-2 h-10 px-5 rounded-full bg-invert-bg text-invert-ink text-[13px] font-medium hover:opacity-90 transition-opacity shrink-0"
          >
            <Plus size={14} strokeWidth={2} />
            New fix
          </Link>
        </div>

        {/* Stats row */}
        {(totalActive > 0 || fetchError || currentStreak > 0) && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 anim-fadeUp delay-100">
            {/* Streak card — spans left column */}
            <StreakCard
              streak={heatmapDates.map((d) => ({ date: d }))}
              currentStreak={currentStreak}
              longestStreak={longestStreak}
              total={heatmapDates.length}
              title="Streak"
              actionLabel="Full history"
              onActionClick={undefined}
              showHowItWorks={false}
              className="lg:row-span-2"
            />

            {/* Active fixes */}
            <div
              className="rounded-2xl border p-5"
              style={{ background: CARD_BG, borderColor: CARD_BORDER }}
            >
              <p className="font-mono text-[10px] uppercase tracking-widest text-ink-faint">
                active fixes
              </p>
              <div className="flex items-baseline gap-1.5 mt-3">
                <span
                  className="font-display leading-none tabular-nums text-ink"
                  style={{
                    fontSize: "clamp(36px,7vw,52px)",
                    letterSpacing: "-0.04em",
                  }}
                >
                  {totalActive}
                </span>
              </div>
              {longestFix > 0 && (
                <p className="mt-2 font-mono text-[10px] text-ink-muted">
                  longest{" "}
                  <span className="text-ink-muted">{longestFix}d</span>
                </p>
              )}
            </div>

            {/* Peak intensity */}
            <div
              className="rounded-2xl p-5"
              style={{
                background:
                  highestIntensity >= 8
                    ? "rgba(230,57,70,0.05)"
                    : CARD_BG,
                border:
                  highestIntensity >= 8
                    ? "1px solid rgba(230,57,70,0.20)"
                    : `1px solid ${CARD_BORDER}`,
              }}
            >
              <p className="font-mono text-[10px] uppercase tracking-widest text-ink-faint">
                peak intensity
              </p>
              <div className="flex items-baseline gap-1.5 mt-3">
                <span
                  className="font-display leading-none tabular-nums"
                  style={{
                    fontSize: "clamp(36px,7vw,52px)",
                    letterSpacing: "-0.04em",
                    color:
                      highestIntensity >= 8
                        ? "#E63946"
                        : highestIntensity > 0
                        ? "var(--ink)"
                        : "var(--ink-faint)",
                  }}
                >
                  {highestIntensity > 0 ? highestIntensity : "—"}
                </span>
                {highestIntensity > 0 && (
                  <span className="font-mono text-[10px] uppercase tracking-widest text-ink-muted">
                    /10
                  </span>
                )}
              </div>
              <p className="mt-2 font-mono text-[10px] text-ink-muted">
                {highestIntensity >= 9
                  ? "send help"
                  : highestIntensity >= 7
                  ? "deeply unwell"
                  : highestIntensity > 0
                  ? "tracking it"
                  : "log a fix"}
              </p>
            </div>

            {/* Week rings — spans bottom two right columns */}
            <div
              className="rounded-2xl border p-5 lg:col-span-2"
              style={{ background: CARD_BG, borderColor: CARD_BORDER }}
            >
              <div className="mt-0">
                <WeekRings checkedDates={heatmapDates} />
              </div>
            </div>
          </div>
        )}

        {/* Heatmap */}
        {heatmapDates.length > 0 && (
          <div
            className="rounded-2xl border p-5 anim-fadeUp delay-500"
            style={{ background: CARD_BG, borderColor: CARD_BORDER }}
          >
            <div className="flex items-center justify-between mb-4">
              <p className="font-mono text-[10px] uppercase tracking-widest text-ink-faint">
                check-in history
              </p>
              <p className="font-mono text-[10px] tabular-nums text-ink-muted">
                {heatmapDates.length}{" "}
                {heatmapDates.length === 1 ? "day" : "days"} logged
              </p>
            </div>
            <StreakHeatmap dates={heatmapDates} />
          </div>
        )}

        {/* ADHD Toolkit */}
        <section>
          <h2 className="text-[11px] font-mono uppercase tracking-widest text-ink-faint mb-3">
            ADHD Toolkit
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {toolkitItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="flex flex-col gap-3 p-5 rounded-2xl border border-line bg-bg-elevated transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                {item.icon}
                <div>
                  <p className="font-sans text-sm font-medium text-ink">
                    {item.label}
                  </p>
                  <p className="font-mono text-[10px] text-ink-faint mt-0.5">
                    {item.sub}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Focus Rooms CTA */}
        <Link
          href="/room"
          className="flex items-center justify-between gap-4 rounded-2xl px-5 py-4 anim-fadeUp transition-all hover:scale-[1.01] active:scale-[0.99]"
          style={{
            background: "var(--accent-soft)",
            border: "1px solid var(--accent)",
          }}
        >
          <div className="flex items-center gap-4 min-w-0">
            <div
              className="shrink-0 flex items-center justify-center rounded-xl"
              style={{
                width: 44,
                height: 44,
                background: "var(--bg-elevated)",
                border: "1px solid var(--accent)",
              }}
            >
              <Users size={20} strokeWidth={1.5} className="text-accent" />
            </div>
            <div className="min-w-0">
              <p className="font-sans text-sm font-semibold text-ink">
                Focus Rooms
              </p>
              <p className="font-mono text-[11px] text-accent truncate">
                Body-double with others · join a live session →
              </p>
            </div>
          </div>
          <svg
            className="shrink-0 text-accent"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </Link>

        {fetchError && (
          <div
            className="rounded-2xl px-4 py-3 font-sans text-sm"
            style={{
              background: "rgba(225,29,72,0.08)",
              border: "1px solid rgba(225,29,72,0.2)",
              color: "#fda4af",
            }}
          >
            Could not load fixes: {fetchError}
          </div>
        )}

        <WelcomeBackBanner firstName={firstName} activeCount={totalActive} />

        {milestoneFixes.length > 0 && (
          <MilestoneBanner milestones={milestoneFixes} />
        )}

        {/* Fixes grid or empty state */}
        {fixes.length > 0 ? (
          <div className="anim-fadeUp delay-500">
            <Suspense fallback={<SkeletonGrid />}>
              <DashboardFilters fixes={fixes} checkedInIds={checkedInIds} />
            </Suspense>
          </div>
        ) : (
          <EmptyState suggestions={trendingSuggestions} />
        )}

        {referralCode && (
          <div className="mt-6">
            <ReferralCard
              referralCode={referralCode}
              referralCount={referralCount}
            />
          </div>
        )}
      </div>
    </div>
  );
}

function EmptyState({
  suggestions,
}: {
  suggestions: { id: string; title: string; category: string }[];
}) {
  return (
    <div className="rounded-2xl border border-line bg-bg-elevated p-10 sm:p-16 text-center anim-fadeUp">
      <div className="max-w-md mx-auto flex flex-col items-center gap-8">
        <div>
          <h2
            className="font-display text-ink"
            style={{
              fontSize: "clamp(28px,6vw,44px)",
              letterSpacing: "-0.02em",
              lineHeight: 1.05,
            }}
          >
            What has taken over
            <br />
            your brain?
          </h2>
          <p className="mt-4 text-[15px] leading-[1.6] text-ink-muted">
            Log it. Count the days. Mourn it when it ends.
          </p>
        </div>

        <Link
          href="/dashboard/new"
          className="inline-flex items-center gap-2 text-[14px] font-medium px-6 py-3 rounded-full transition-all hover:opacity-90 active:scale-[0.98] bg-invert-bg text-invert-ink"
        >
          <Plus size={14} strokeWidth={2} />
          Log a fix
        </Link>

        {suggestions.length > 0 && (
          <div className="w-full">
            <p className="font-mono text-[10px] uppercase tracking-widest mb-3 text-ink-faint">
              others are currently tracking
            </p>
            <div className="flex flex-wrap gap-2 justify-center">
              {suggestions.map((s) => (
                <Link
                  key={s.id}
                  href={`/dashboard/new?title=${encodeURIComponent(s.title)}&category=${encodeURIComponent(s.category)}`}
                  className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[12px] border border-line text-ink-muted transition-all hover:border-ink-muted hover:text-ink"
                >
                  <CategoryIcon category={s.category} size={12} />
                  <span className="truncate max-w-[120px]">{s.title}</span>
                </Link>
              ))}
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full">
          {[
            { step: "01", title: "Name it", body: "Log whatever's taken over your brain." },
            { step: "02", title: "Count it", body: "The day counter starts. Check in daily." },
            { step: "03", title: "Mourn it", body: "When it fades, write the eulogy." },
          ].map(({ step, title, body }) => (
            <div
              key={step}
              className="rounded-2xl p-5 text-left border border-line"
              style={{ background: "var(--bg)" }}
            >
              <span className="font-mono text-[10px] uppercase tracking-widest text-accent">
                {step}
              </span>
              <p className="font-display text-[18px] mt-2 text-ink">{title}</p>
              <p className="text-[13px] mt-1.5 leading-relaxed text-ink-muted">
                {body}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
