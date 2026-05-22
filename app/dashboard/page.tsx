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
};

const TEAL = "#5EEAD4";
const TEAL_DEEP = "#2DD4BF";
const TEAL_DARK_BG = "rgba(94,234,212,0.10)";
const TEAL_DARK_BORDER = "rgba(94,234,212,0.22)";
const CARD_BG = "#0F1011";
const CARD_BORDER = "rgba(255,255,255,0.06)";
const PAGE_BG = "#070708";

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
        boxShadow: "0 0 20px rgba(94,234,212,0.10)",
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
  if (currentStreak >= 14) return `${currentStreak}-day streak. this is getting serious.`;
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
  if (user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("display_name, username")
      .eq("id", user.id)
      .single();
    if (profile) {
      displayName = profile.display_name || profile.username || displayName;
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
      .select("id, title, category, status, intensity, note, started_at, ended_at, created_at, is_public")
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

  return (
    <div className="min-h-screen px-4 sm:px-6 lg:px-8 pt-8 pb-12" style={{ background: PAGE_BG }}>
      <OnboardingModal totalFixes={totalActive} />
      <div className="max-w-5xl mx-auto">

        {/* Hero header — teal radial bloom + grain */}
        <div
          className="relative rounded-3xl overflow-hidden mb-6 anim-fadeUp"
          style={{
            background:
              "radial-gradient(ellipse 80% 120% at 50% 130%, #5EEAD4 0%, #2DD4BF 14%, #0E4F47 34%, #08231F 55%, #070708 78%)",
            border: `1px solid ${CARD_BORDER}`,
            minHeight: 220,
          }}
        >
          <div
            aria-hidden
            className="absolute inset-0 pointer-events-none mix-blend-overlay"
            style={{ backgroundImage: NOISE_URL, backgroundSize: "200px 200px", opacity: 0.55 }}
          />
          <div
            aria-hidden
            className="absolute inset-0 pointer-events-none"
            style={{
              background: "linear-gradient(180deg, #070708 0%, rgba(7,7,8,0.45) 30%, transparent 100%)",
            }}
          />

          <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-end justify-between gap-6 p-6 sm:p-10">
            <div className="flex-1">
              <div className="mb-4">
                <EyebrowPill>good {greeting}</EyebrowPill>
              </div>
              <h1
                className="font-display text-ink mb-3"
                style={{
                  fontSize: "clamp(36px, 6vw, 60px)",
                  lineHeight: 1.02,
                  letterSpacing: "-0.02em",
                  fontWeight: 600,
                }}
              >
                {firstName}.
              </h1>
              <p className="font-sans text-base sm:text-lg max-w-xl" style={{ color: "rgba(255,255,255,0.72)" }}>
                {subtext}
              </p>
            </div>

            <Link
              href="/dashboard/new"
              className="hidden lg:inline-flex items-center gap-2.5 font-sans text-sm font-semibold px-6 py-3.5 transition-all hover:opacity-95 active:scale-[0.98] anim-fadeUp delay-200"
              style={{
                background: "#FFFFFF",
                color: "#0A0A0A",
                borderRadius: 999,
                boxShadow: "0 1px 0 0 rgba(255,255,255,0.5) inset, 0 12px 36px rgba(0,0,0,0.4)",
              }}
            >
              <Plus set="light" size={16} primaryColor="currentColor" />
              New fix
            </Link>
          </div>
        </div>

        {/* Stats grid */}
        {(totalActive > 0 || fetchError || currentStreak > 0) && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            {/* Streak card */}
            <div
              className="relative overflow-hidden rounded-3xl p-7 motion-card anim-fadeUp delay-100"
              style={{ background: CARD_BG, border: `1px solid ${CARD_BORDER}` }}
            >
              <GrainOverlay opacity={0.22} />
              <div className="relative">
                <EyebrowPill>check-in streak</EyebrowPill>
                <div className="flex items-baseline gap-2 mt-6">
                  <span
                    className="font-display leading-none"
                    style={{
                      fontSize: "clamp(56px, 12vw, 84px)",
                      letterSpacing: "-0.04em",
                      fontWeight: 600,
                      color: currentStreak >= 7 ? TEAL : currentStreak > 0 ? "#FFFFFF" : "rgba(255,255,255,0.2)",
                      textShadow: currentStreak >= 7 ? "0 0 40px rgba(94,234,212,0.45)" : "none",
                    }}
                  >
                    {currentStreak > 0 ? currentStreak : "0"}
                  </span>
                  <span className="font-sans text-base" style={{ color: "rgba(255,255,255,0.45)" }}>
                    {currentStreak === 1 ? "day" : "days"}
                  </span>
                </div>
                <p className="mt-3 font-sans text-sm" style={{ color: "rgba(255,255,255,0.5)" }}>
                  {currentStreak === 0
                    ? "check in to start your streak."
                    : currentStreak >= 7
                      ? "you're on a run. don't break it."
                      : "keep going."}
                </p>
              </div>
            </div>

            {/* Week rings */}
            <div
              className="relative overflow-hidden rounded-3xl p-7 motion-card anim-fadeUp delay-200"
              style={{ background: CARD_BG, border: `1px solid ${CARD_BORDER}` }}
            >
              <GrainOverlay opacity={0.22} />
              <div className="relative">
                <EyebrowPill>this week</EyebrowPill>
                <div className="mt-6">
                  <WeekRings checkedDates={heatmapDates} />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 sm:col-span-2">
              <div
                className="relative overflow-hidden rounded-3xl p-6 motion-card anim-fadeUp delay-300"
                style={{ background: CARD_BG, border: `1px solid ${CARD_BORDER}` }}
              >
                <GrainOverlay opacity={0.22} />
                <div className="relative">
                  <EyebrowPill>active fixes</EyebrowPill>
                  <div className="flex items-baseline gap-3 mt-5">
                    <span
                      className="font-display leading-none"
                      style={{
                        fontSize: "clamp(40px, 8vw, 60px)",
                        letterSpacing: "-0.03em",
                        fontWeight: 600,
                        color: "#FFFFFF",
                      }}
                    >
                      {totalActive}
                    </span>
                    {longestFix > 0 && (
                      <span className="font-sans text-sm" style={{ color: "rgba(255,255,255,0.45)" }}>
                        longest {longestFix}d
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div
                className="relative overflow-hidden rounded-3xl p-6 motion-card anim-fadeUp delay-400"
                style={{
                  background: highestIntensity >= 8 ? "rgba(230,57,70,0.06)" : CARD_BG,
                  border: highestIntensity >= 8 ? "1px solid rgba(230,57,70,0.20)" : `1px solid ${CARD_BORDER}`,
                }}
              >
                <GrainOverlay opacity={0.22} />
                <div className="relative">
                  <EyebrowPill>peak intensity</EyebrowPill>
                  <div className="flex items-baseline gap-2 mt-5">
                    <span
                      className="font-display leading-none"
                      style={{
                        fontSize: "clamp(40px, 8vw, 60px)",
                        letterSpacing: "-0.03em",
                        fontWeight: 600,
                        color: highestIntensity >= 8 ? "#E63946" : highestIntensity > 0 ? "#FFFFFF" : "rgba(255,255,255,0.2)",
                        textShadow: highestIntensity >= 8 ? "0 0 32px rgba(230,57,70,0.35)" : "none",
                      }}
                    >
                      {highestIntensity > 0 ? highestIntensity : "—"}
                    </span>
                    {highestIntensity > 0 && (
                      <span className="font-sans text-sm" style={{ color: "rgba(255,255,255,0.45)" }}>/10</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {heatmapDates.length > 0 && (
          <div
            className="relative overflow-hidden rounded-3xl p-7 mb-6 motion-card anim-fadeUp delay-500"
            style={{ background: CARD_BG, border: `1px solid ${CARD_BORDER}` }}
          >
            <GrainOverlay opacity={0.22} />
            <div className="relative">
              <EyebrowPill>check-in history</EyebrowPill>
              <div className="mt-6">
                <StreakHeatmap dates={heatmapDates} />
              </div>
            </div>
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

        {fixes.length > 0 ? (
          <div className="anim-fadeUp delay-500">
            <Suspense fallback={<SkeletonGrid />}>
              <DashboardFilters fixes={fixes} checkedInIds={checkedInIds} />
            </Suspense>
          </div>
        ) : (
          <EmptyState />
        )}

        {referralCode && (
          <div className="mt-6">
            <ReferralCard referralCode={referralCode} referralCount={referralCount} />
          </div>
        )}
      </div>

      {/* Mobile FAB */}
      <Link
        href="/dashboard/new"
        className="lg:hidden fixed flex items-center justify-center rounded-full transition-all hover:opacity-95 active:scale-95 anim-glowPulse"
        style={{
          bottom: "calc(5rem + 1rem + env(safe-area-inset-bottom))",
          right: "1rem",
          width: 56,
          height: 56,
          background: TEAL,
          color: "#0A1F1C",
          zIndex: 40,
          boxShadow: "0 4px 28px rgba(94,234,212,0.55)",
        }}
        aria-label="New fix"
      >
        <Plus set="bold" size={24} primaryColor="currentColor" />
      </Link>
    </div>
  );
}

function EmptyState() {
  return (
    <div
      className="relative overflow-hidden rounded-3xl p-10 sm:p-16 text-center anim-fadeUp"
      style={{
        background:
          "radial-gradient(ellipse 80% 120% at 50% 130%, #2DD4BF 0%, #0E4F47 26%, #08231F 50%, #0F1011 80%)",
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
          <p className="mt-4 font-sans text-base" style={{ color: "rgba(255,255,255,0.7)" }}>
            log it. count the days. mourn it when it ends.
          </p>
        </div>

        <Link
          href="/dashboard/new"
          className="inline-flex items-center gap-2 font-sans text-sm font-semibold px-6 py-3.5 transition-all hover:opacity-95 active:scale-[0.98]"
          style={{
            background: "#FFFFFF",
            color: "#0A0A0A",
            borderRadius: 999,
            boxShadow: "0 12px 36px rgba(0,0,0,0.4)",
          }}
        >
          + Log a fix
        </Link>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full mt-2">
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
              <p className="font-sans text-xs mt-1.5 leading-relaxed" style={{ color: "rgba(255,255,255,0.5)" }}>
                {body}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
