import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { Suspense } from "react";
import { DashboardFilters } from "./DashboardFilters";
import { SkeletonGrid } from "@/components/FixCardSkeleton";

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
};

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "morning";
  if (hour < 18) return "afternoon";
  return "evening";
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

  // Get profile for display name
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

  // Get active fixes (gracefully handle missing table)
  let fixes: Fix[] = [];
  let fetchError: string | null = null;

  if (user) {
    const { data, error } = await supabase
      .from("fixes")
      .select("id, title, category, status, intensity, note, started_at, ended_at, created_at")
      .eq("user_id", user.id)
      .not("status", "eq", "Ended")
      .order("created_at", { ascending: false });

    if (error) {
      // Table may not exist yet — show empty state
      if (!error.message.includes("does not exist") && !error.code?.includes("42P01")) {
        fetchError = error.message;
      }
    } else {
      fixes = data || [];
    }
  }

  // Compute streak from check-in entries
  let currentStreak = 0;
  if (user) {
    const { data: entryDates } = await supabase
      .from("fix_entries")
      .select("date")
      .eq("user_id", user.id)
      .order("date", { ascending: false })
      .limit(90);

    if (entryDates && entryDates.length > 0) {
      const uniqueDates = [...new Set(entryDates.map((e: { date: string }) => e.date))].sort().reverse();
      const today = new Date().toISOString().split("T")[0];
      const yesterday = new Date(Date.now() - 86400000).toISOString().split("T")[0];

      let cursor = uniqueDates[0] === today || uniqueDates[0] === yesterday ? uniqueDates[0] : null;
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

  // Compute stats
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

  return (
    <div className="min-h-screen px-4 sm:px-6 lg:px-8 pt-8 pb-12" style={{ background: "#0A0A0A" }}>
      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1
              className="font-display font-bold leading-tight"
              style={{ color: "#F4F4F4", fontSize: "clamp(24px, 4vw, 36px)", letterSpacing: "-0.02em" }}
            >
              Good {greeting},{" "}
              <span style={{ color: "#A3E635" }}>{firstName}</span>
              <span className="font-sans font-normal" style={{ fontSize: "0.5em", color: "rgba(244,244,244,0.3)", marginLeft: 4 }}>✦</span>
            </h1>
            <p className="font-sans text-sm mt-1" style={{ color: "rgba(244,244,244,0.4)" }}>
              {totalActive === 0
                ? "Nothing logged yet. What are you unwell about?"
                : `You have ${totalActive} active fix${totalActive !== 1 ? "es" : ""}.`}
            </p>
          </div>

          <Link
            href="/dashboard/new"
            className="hidden lg:flex items-center gap-2 px-4 py-2.5 rounded-full font-sans text-sm font-bold transition-all hover:opacity-90 active:scale-[0.97] shrink-0"
            style={{ background: "#A3E635", color: "#0A0A0A" }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            New fix
          </Link>
        </div>

        {/* Stats row */}
        {(totalActive > 0 || fetchError || currentStreak > 0) && (
          <div className="grid grid-cols-4 gap-3 mb-8">
            <StatCard label="Active fixes" value={totalActive.toString()} />
            <StatCard
              label="Longest fix"
              value={longestFix > 0 ? `${longestFix}d` : "—"}
            />
            <StatCard
              label="Peak intensity"
              value={highestIntensity > 0 ? `${highestIntensity}/10` : "—"}
            />
            <StatCard
              label="Check-in streak"
              value={currentStreak > 0 ? `${currentStreak}d` : "—"}
              accent={currentStreak >= 7}
            />
          </div>
        )}

        {/* Error state */}
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

        {/* Fix grid with search + filter */}
        {fixes.length > 0 ? (
          <Suspense fallback={<SkeletonGrid />}>
            <DashboardFilters fixes={fixes} />
          </Suspense>
        ) : (
          <EmptyState />
        )}
      </div>

      {/* Mobile FAB — above tab bar */}
      <Link
        href="/dashboard/new"
        className="lg:hidden fixed flex items-center justify-center rounded-full transition-all hover:opacity-90 active:scale-95"
        style={{
          bottom: "calc(5rem + 1rem + env(safe-area-inset-bottom))",
          right: "1rem",
          width: 52,
          height: 52,
          background: "#A3E635",
          color: "#0A0A0A",
          zIndex: 40,
          boxShadow: "0 4px 24px rgba(163,230,53,0.35)",
        }}
        aria-label="New fix"
      >
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
          <line x1="12" y1="5" x2="12" y2="19" />
          <line x1="5" y1="12" x2="19" y2="12" />
        </svg>
      </Link>
    </div>
  );
}

function StatCard({ label, value, accent = false }: { label: string; value: string; accent?: boolean }) {
  return (
    <div
      className="rounded-2xl p-4 text-center"
      style={{
        background: accent ? "rgba(163,230,53,0.06)" : "#111113",
        border: accent ? "1px solid rgba(163,230,53,0.2)" : "1px solid rgba(244,244,244,0.07)",
      }}
    >
      <p
        className="font-display font-black leading-none mb-1"
        style={{ color: accent ? "#A3E635" : "#F4F4F4", fontSize: 28, letterSpacing: "-0.03em" }}
      >
        {value}
      </p>
      <p className="font-mono text-[10px] uppercase tracking-widest" style={{ color: accent ? "rgba(163,230,53,0.6)" : "rgba(244,244,244,0.35)" }}>
        {label}
      </p>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-24 px-6 text-center">
      <p
        className="font-display italic mb-2"
        style={{ color: "rgba(244,244,244,0.3)", fontSize: 28, letterSpacing: "-0.02em" }}
      >
        Nothing yet.
      </p>
      <p className="font-sans text-sm mb-6" style={{ color: "rgba(244,244,244,0.2)" }}>
        You haven&apos;t logged any fixes yet.
      </p>
      <Link
        href="/dashboard/new"
        className="flex items-center gap-2 px-5 py-2.5 rounded-full font-sans text-sm font-bold transition-all hover:opacity-90 active:scale-[0.97]"
        style={{
          background: "rgba(163,230,53,0.12)",
          border: "1px solid rgba(163,230,53,0.3)",
          color: "#A3E635",
        }}
      >
        Log your first fix →
      </Link>
    </div>
  );
}
