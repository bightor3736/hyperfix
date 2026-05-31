import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { Suspense } from "react";
import { DashboardFilters } from "./DashboardFilters";
import { SkeletonGrid } from "@/components/FixCardSkeleton";
import { OnboardingModal } from "@/components/OnboardingModal";
import { StreakHeatmap } from "@/components/StreakHeatmap";
import { WeekRings } from "@/components/WeekRings";
import { ReferralCard } from "@/components/ReferralCard";
import { Plus } from "@/components/icons";
import { CategoryIcon } from "@/components/CategoryIcon";
import { MilestoneBanner } from "@/components/MilestoneBanner";
import { WelcomeBackBanner } from "@/components/WelcomeBackBanner";

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
const TEAL_DEEP = "var(--accent)";
const TEAL_DARK_BG = "var(--accent-soft)";
const TEAL_DARK_BORDER = "var(--accent)";
const CARD_BG = "var(--bg)";
const CARD_BORDER = "var(--line)";
const PAGE_BG = "var(--bg)";

const NOISE_URL =
  "url(\"data:image/svg+xml;utf8,<svg viewBox='0 0 240 240' xmlns='http://www.w3.org/2000/svg'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 0.55 0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>\")";

function GrainOverlay({ opacity = 0.18 }: { opacity?: number }) {
  return (
    <div
      aria-hidden
      className="absolute inset-0 pointer-events-none mix-blend-overlay"
      style={{ backgroundImage: NOISE_URL, backgroundSize: "240px 240px", opacity }}
    />
  );
}

function EyebrowPill({ children }: { children: React.ReactNode }) {
  return (
    <span
      className="inline-flex items-center font-sans text-xs rounded-full px-3 py-1"
      style={{
        background: TEAL_DARK_BG,
        color: TEAL,
        border: `1px solid ${TEAL_DARK_BORDER}`,
        boxShadow: "0 0 20px var(--accent-soft)",
      }}
    >
      {children}
    </span>
  );
}

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 6) return "it's late";
  if (hour < 12) return "morning";
  if (hour < 18) return "afternoon";
  if (hour < 22) return "evening";
  return "it's late";
}

function getSubtext(totalActive: number, currentStreak: number, highestIntensity: number): string {
  if (totalActive === 0) return "nothing logged yet. what has taken over your brain?";
  if (highestIntensity >= 9) return `${totalActive} active fix${totalActive !== 1 ? "es" : ""}. you are not well. we love that for you.`;
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

  let displayName = user?.user_metadata?.full_name || user?.email?.split("@")[0] || "there";
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
      .select("id, title, category, status, intensity, note, started_at, ended_at, created_at, is_public, banner_url")
      .eq("user_id", user.id)
      .not("status", "eq", "Ended")
      .order("created_at", { ascending: false });

    if (error) {
      if (!error.message.includes("does not exist") && !error.code?.includes("42P01")) {
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
    checkedInIds = (todayEntries ?? []).map((e: { fix_id: string }) => e.fix_id);
  }

  let currentStreak = 0;
  let heatmapDates: string[] = [];
  if (user) {
    const { data: entryDates } = await supabase
      .from("fix_entries")
      .select("date")
      .eq("user_id", user.id)
      .order("date", { ascending: false })
      .limit(90);

    if (entryDates && entryDates.length > 0) {
      const uniqueDates = [...new Set(entryDates.map((e: { date: string }) => e.date))].sort().reverse();
      heatmapDates = uniqueDates as string[];
      const today2 = new Date().toISOString().split("T")[0];
      const yesterday = new Date(Date.now() - 86400000).toISOString().split("T")[0];

      let cursor = uniqueDates[0] === today2 || uniqueDates[0] === yesterday ? uniqueDates[0] : null;
      if (cursor) {
        for (const d of uniqueDates) {
          if (d === cursor) {
            currentStreak++;
            cursor = new Date(new Date(cursor).getTime() - 86400000).toISOString().split("T")[0];
          } else {
            break;
          }
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
  let trendingSuggestions: { id: string; title: string; category: string }[] = [];
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

  return (
    <div className="min-h-screen px-4 sm:px-6 lg:px-8 pt-8 pb-12" style={{ background: PAGE_BG }}>
      <OnboardingModal totalFixes={totalActive} />
      <div className="max-w-5xl mx-auto">

        {/* Hero header — tight, restrained */}
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-6 mb-8 anim-fadeUp">
          <div className="flex-1 min-w-0">
            <p className="font-mono text-[10px] uppercase tracking-widest mb-3" style={{ color: "var(--accent)" }}>
              good {greeting}
            </p>
            <h1
              className="font-display text-ink mb-2"
              style={{
                fontSize: "clamp(32px, 5vw, 48px)",
                lineHeight: 1.02,
                letterSpacing: "-0.02em",
                fontWeight: 600,
              }}
            >
              {firstName}.
            </h1>
            {username && (
              <div className="flex items-center gap-3 mb-3 flex-wrap">
                <Link
                  href={`/u/${username}`}
                  className="inline-flex items-center gap-1.5 font-mono text-[11px] transition-colors hover:text-[var(--accent)]"
                  style={{ color: "var(--ink-muted)" }}
                >
                  @{username} · profile →
                </Link>
                <span style={{ color: "var(--ink-faint)", fontSize: 10 }}>·</span>
                <Link
                  href={`/add/${username}`}
                  className="inline-flex items-center gap-1 font-mono text-[11px] transition-colors hover:text-[var(--accent)]"
                  style={{ color: "var(--accent)" }}
                >
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
                    <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
                  </svg>
                  hyperfix.app/add/{username}
                </Link>
              </div>
            )}
            <p className="font-sans text-sm sm:text-base max-w-xl" style={{ color: "var(--ink-muted)" }}>
              {subtext}
            </p>
            {fixes.length >= 3 && (
              <Link
                href="/dashboard/pattern"
                className="inline-flex items-center gap-1.5 font-mono text-xs mt-4 transition-colors hover:text-[var(--accent)]"
                style={{ color: "var(--ink-faint)" }}
              >
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
                </svg>
                see your pattern →
              </Link>
            )}
          </div>

          <Link
            href="/dashboard/new"
            className="hidden lg:inline-flex items-center gap-2.5 font-sans text-sm font-semibold px-5 py-3 transition-all hover:opacity-95 active:scale-[0.98]"
            style={{
              background: "var(--accent)",
              color: "var(--accent-ink)",
              borderRadius: 999,
            }}
          >
            <Plus set="light" size={16} primaryColor="currentColor" />
            New fix
          </Link>
        </div>

        {/* Stats grid — uniform 4-card layout */}
        {(totalActive > 0 || fetchError || currentStreak > 0) && (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6">
            {/* Streak */}
            <div
              className="relative rounded-3xl p-5 anim-fadeUp delay-100"
              style={{ background: CARD_BG, border: `1px solid ${CARD_BORDER}` }}
            >
              <p className="font-mono text-[10px] uppercase tracking-widest" style={{ color: "var(--ink-faint)" }}>
                check-in run
              </p>
              <div className="flex items-baseline gap-1.5 mt-3">
                <span
                  className="font-display leading-none tabular-nums"
                  style={{
                    fontSize: "clamp(36px, 7vw, 52px)",
                    letterSpacing: "-0.04em",
                    fontWeight: 600,
                    color: currentStreak > 0 ? TEAL : "var(--ink-faint)",
                    textShadow: currentStreak >= 7 ? "0 0 30px rgba(111,138,99,0.25)" : "none",
                  }}
                >
                  {currentStreak > 0 ? currentStreak : "0"}
                </span>
                <span className="font-mono text-[10px] uppercase tracking-widest" style={{ color: "var(--ink-muted)" }}>
                  {currentStreak === 1 ? "day" : "days"}
                </span>
              </div>
              <p className="mt-2 font-sans text-xs leading-snug" style={{ color: "var(--ink-muted)" }}>
                {currentStreak === 0
                  ? "start your run today."
                  : currentStreak >= 30
                  ? "legendary."
                  : currentStreak >= 7
                  ? "on a roll."
                  : "it's building."}
              </p>
            </div>

            {/* Active fixes */}
            <div
              className="relative rounded-3xl p-5 anim-fadeUp delay-200"
              style={{ background: CARD_BG, border: `1px solid ${CARD_BORDER}` }}
            >
              <p className="font-mono text-[10px] uppercase tracking-widest" style={{ color: "var(--ink-faint)" }}>
                active fixes
              </p>
              <div className="flex items-baseline gap-1.5 mt-3">
                <span
                  className="font-display leading-none tabular-nums"
                  style={{
                    fontSize: "clamp(36px, 7vw, 52px)",
                    letterSpacing: "-0.04em",
                    fontWeight: 600,
                    color: "var(--ink)",
                  }}
                >
                  {totalActive}
                </span>
              </div>
              {longestFix > 0 && (
                <p className="mt-2 font-mono text-[10px]" style={{ color: "var(--ink-muted)" }}>
                  longest <span style={{ color: "var(--ink-muted)" }}>{longestFix}d</span>
                </p>
              )}
            </div>

            {/* Peak intensity */}
            <div
              className="relative rounded-3xl p-5 anim-fadeUp delay-300"
              style={{
                background: highestIntensity >= 8 ? "rgba(230,57,70,0.05)" : CARD_BG,
                border: highestIntensity >= 8 ? "1px solid rgba(230,57,70,0.20)" : `1px solid ${CARD_BORDER}`,
              }}
            >
              <p className="font-mono text-[10px] uppercase tracking-widest" style={{ color: "var(--ink-faint)" }}>
                peak intensity
              </p>
              <div className="flex items-baseline gap-1.5 mt-3">
                <span
                  className="font-display leading-none tabular-nums"
                  style={{
                    fontSize: "clamp(36px, 7vw, 52px)",
                    letterSpacing: "-0.04em",
                    fontWeight: 600,
                    color: highestIntensity >= 8 ? "#E63946" : highestIntensity > 0 ? "var(--ink)" : "var(--ink-faint)",
                    textShadow: highestIntensity >= 8 ? "0 0 28px rgba(230,57,70,0.35)" : "none",
                  }}
                >
                  {highestIntensity > 0 ? highestIntensity : "—"}
                </span>
                {highestIntensity > 0 && (
                  <span className="font-mono text-[10px] uppercase tracking-widest" style={{ color: "var(--ink-muted)" }}>
                    /10
                  </span>
                )}
              </div>
              <p className="mt-2 font-mono text-[10px]" style={{ color: "var(--ink-muted)" }}>
                {highestIntensity >= 9 ? "send help" : highestIntensity >= 7 ? "deeply unwell" : highestIntensity > 0 ? "tracking it" : "log a fix"}
              </p>
            </div>

            {/* Week rings */}
            <div
              className="relative rounded-3xl p-5 anim-fadeUp delay-400 col-span-2 lg:col-span-1"
              style={{ background: CARD_BG, border: `1px solid ${CARD_BORDER}` }}
            >
              <p className="font-mono text-[10px] uppercase tracking-widest" style={{ color: "var(--ink-faint)" }}>
                this week
              </p>
              <div className="mt-3">
                <WeekRings checkedDates={heatmapDates} />
              </div>
            </div>
          </div>
        )}

        {/* Focus Rooms CTA */}
        <Link
          href="/room"
          className="flex items-center justify-between gap-4 rounded-3xl px-5 py-4 mb-6 anim-fadeUp transition-all hover:scale-[1.01] active:scale-[0.99]"
          style={{
            background: "linear-gradient(135deg, var(--accent-soft) 0%, var(--accent-soft) 100%)",
            border: "1px solid var(--accent)",
          }}
        >
          <div className="flex items-center gap-4 min-w-0">
            <div
              className="shrink-0 flex items-center justify-center rounded-2xl"
              style={{ width: 44, height: 44, background: "var(--accent-soft)", border: "1px solid var(--accent)" }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="9" cy="8" r="3" />
                <circle cx="17" cy="9" r="2.2" />
                <path d="M3 19c0-3 2.7-5 6-5s6 2 6 5" />
                <path d="M15.5 19c0-2 1-3.4 2.5-3.4 2 0 3 1.6 3 3.4" />
              </svg>
            </div>
            <div className="min-w-0">
              <p className="font-sans text-sm font-semibold" style={{ color: "#fff" }}>
                Focus Rooms
              </p>
              <p className="font-mono text-[11px] truncate" style={{ color: "var(--accent)" }}>
                Body-double with others · join a live session →
              </p>
            </div>
          </div>
          <svg className="shrink-0" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </Link>

        {/* ADHD Toolkit quick-links */}
        <div className="mb-6 anim-fadeUp">
          <p className="font-mono text-[10px] uppercase tracking-widest mb-3" style={{ color: "var(--ink-faint)" }}>
            ADHD Toolkit
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { href: "/dashboard/brain-dump", label: "Brain Dump", icon: "📥", sub: "Clear your head" },
              { href: "/dashboard/timer", label: "Timer", icon: "⏱", sub: "Focus countdown" },
              { href: "/dashboard/mood", label: "Mood Log", icon: "💚", sub: "Track patterns" },
              { href: "/dashboard/meds", label: "Meds", icon: "💊", sub: "Log doses" },
            ].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="flex flex-col gap-2 p-4 rounded-2xl transition-all hover:scale-[1.02] active:scale-[0.98]"
                style={{
                  background: CARD_BG,
                  border: `1px solid ${CARD_BORDER}`,
                }}
              >
                <span style={{ fontSize: 22 }}>{item.icon}</span>
                <div>
                  <p className="font-sans text-sm font-semibold" style={{ color: "#fff" }}>{item.label}</p>
                  <p className="font-mono text-[10px]" style={{ color: "var(--ink-faint)" }}>{item.sub}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {heatmapDates.length > 0 && (
          <div
            className="relative rounded-3xl p-5 mb-6 anim-fadeUp delay-500"
            style={{ background: CARD_BG, border: `1px solid ${CARD_BORDER}` }}
          >
            <div className="flex items-center justify-between mb-4">
              <p className="font-mono text-[10px] uppercase tracking-widest" style={{ color: "var(--ink-faint)" }}>
                check-in history
              </p>
              <p className="font-mono text-[10px] tabular-nums" style={{ color: "var(--ink-muted)" }}>
                {heatmapDates.length} {heatmapDates.length === 1 ? "day" : "days"} logged
              </p>
            </div>
            <StreakHeatmap dates={heatmapDates} />
          </div>
        )}

        {fetchError && (
          <div
            className="rounded-2xl px-4 py-3 mb-6 font-sans text-sm"
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
            <ReferralCard referralCode={referralCode} referralCount={referralCount} />
          </div>
        )}
      </div>

    </div>
  );
}

function EmptyState({ suggestions }: { suggestions: { id: string; title: string; category: string }[] }) {
  return (
    <div
      className="relative overflow-hidden rounded-3xl p-10 sm:p-16 text-center anim-fadeUp"
      style={{
        background:
          "radial-gradient(ellipse 80% 120% at 50% 130%, var(--accent) 0%, #0E4F47 26%, #08231F 50%, var(--bg) 80%)",
        border: `1px solid ${CARD_BORDER}`,
      }}
    >
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none mix-blend-overlay"
        style={{ backgroundImage: NOISE_URL, backgroundSize: "200px 200px", opacity: 0.45 }}
      />
      <div className="relative max-w-md mx-auto flex flex-col items-center gap-8">
        <div>
          <EyebrowPill>your dashboard</EyebrowPill>
          <h2
            className="mt-5 font-display text-ink"
            style={{
              fontSize: "clamp(28px, 6vw, 44px)",
              letterSpacing: "-0.02em",
              lineHeight: 1.05,
              fontWeight: 600,
            }}
          >
            What has taken over
            <br />
            your brain?
          </h2>
          <p className="mt-4 font-sans text-base" style={{ color: "var(--ink-muted)" }}>
            log it. count the days. mourn it when it ends.
          </p>
        </div>

        <Link
          href="/dashboard/new"
          className="inline-flex items-center gap-2 font-sans text-sm font-semibold px-6 py-3.5 transition-all hover:opacity-95 active:scale-[0.98]"
          style={{
            background: "var(--ink)",
            color: "#0A0A0A",
            borderRadius: 999,
            boxShadow: "0 12px 36px rgba(0,0,0,0.4)",
          }}
        >
          + Log a fix
        </Link>

        {suggestions.length > 0 && (
          <div className="w-full">
            <p className="font-mono text-[10px] uppercase tracking-widest mb-3" style={{ color: "var(--ink-faint)" }}>
              others are currently tracking
            </p>
            <div className="flex flex-wrap gap-2 justify-center">
              {suggestions.map((s) => (
                <Link
                  key={s.id}
                  href={`/dashboard/new?title=${encodeURIComponent(s.title)}&category=${encodeURIComponent(s.category)}`}
                  className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 font-sans text-xs transition-all hover:scale-105 hover:opacity-90"
                  style={{
                    background: "rgba(15,16,17,0.8)",
                    border: "1px solid var(--line)",
                    color: "var(--ink-muted)",
                  }}
                >
                  <CategoryIcon category={s.category} size={12} />
                  <span className="truncate max-w-[120px]">{s.title}</span>
                </Link>
              ))}
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full">
          {[
            { step: "01", title: "Name it", body: "Log whatever's taken over your brain." },
            { step: "02", title: "Count it", body: "The day counter starts. Check in daily." },
            { step: "03", title: "Mourn it", body: "When it fades, write the eulogy." },
          ].map(({ step, title, body }, i) => (
            <div
              key={step}
              className={`rounded-2xl p-4 text-left motion-card anim-fadeUp delay-${(i + 2) * 100}`}
              style={{ background: "rgba(15,16,17,0.7)", border: `1px solid ${CARD_BORDER}` }}
            >
              <span className="font-sans text-xs" style={{ color: TEAL }}>
                {step}
              </span>
              <p className="font-display text-base mt-2 text-ink" style={{ fontWeight: 600 }}>
                {title}
              </p>
              <p className="font-sans text-xs mt-1.5 leading-relaxed" style={{ color: "var(--ink-muted)" }}>
                {body}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
