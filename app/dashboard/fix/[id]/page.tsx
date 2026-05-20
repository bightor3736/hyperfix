import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { FixStatusPill as _FixStatusPill, type FixStatus } from "@/components/FixStatusPill";
import { notFound, redirect } from "next/navigation";
import { FixDetailClient } from "./FixDetailClient";
import { ShareButton } from "@/components/ShareButton";
import { Sparkline } from "@/components/Sparkline";
import { FixReactions } from "@/components/FixReactions";

type Fix = {
  id: string;
  user_id: string;
  title: string;
  category: string;
  status: string;
  intensity: number;
  note: string | null;
  eulogy: string | null;
  is_public: boolean;
  started_at: string;
  ended_at: string | null;
  created_at: string;
  tags: string[];
};

const VALID_STATUSES: FixStatus[] = [
  "Day 1", "Obsessing", "On loop", "Fading", "Post-fix", "Ended", "Dormant", "Send help",
];

function isValidStatus(s: string): s is FixStatus {
  return VALID_STATUSES.includes(s as FixStatus);
}

function getDayCount(startedAt: string): number {
  const start = new Date(startedAt);
  const now = new Date();
  const diff = now.getTime() - start.getTime();
  return Math.max(1, Math.ceil(diff / (1000 * 60 * 60 * 24)));
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

export default async function FixDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login");
  }

  const { data: fix, error } = await supabase
    .from("fixes")
    .select("id, user_id, title, category, status, intensity, note, eulogy, is_public, started_at, ended_at, created_at, tags")
    .eq("id", id)
    .eq("user_id", user.id)
    .single();

  if (error || !fix) {
    notFound();
  }

  const typedFix = fix as Fix;
  const days = getDayCount(typedFix.started_at);
  const status = isValidStatus(typedFix.status) ? typedFix.status : "Day 1";

  // Check if already checked in today
  const today = new Date().toISOString().split("T")[0];
  const { data: todayEntry } = await supabase
    .from("fix_entries")
    .select("id")
    .eq("fix_id", id)
    .eq("date", today)
    .maybeSingle();
  const hasCheckedInToday = !!todayEntry;

  // Fetch entry history for sparkline + notes
  const { data: entriesData } = await supabase
    .from("fix_entries")
    .select("date, intensity, note")
    .eq("fix_id", id)
    .order("date", { ascending: false })
    .limit(14);
  const entries = (entriesData ?? []) as { date: string; intensity: number; note: string | null }[];
  const entriesForSparkline = [...entries].reverse();

  // Check if this fix is pinned on the user's profile + Pro status
  const { data: profileData } = await supabase
    .from("profiles")
    .select("pinned_fix_id, is_pro")
    .eq("id", user.id)
    .single();
  const isPinned = profileData?.pinned_fix_id === id;
  const isPro = profileData?.is_pro ?? false;

  // Reactions (only relevant for public fixes)
  const initialReactions: Record<string, number> = {};
  const userReactions: string[] = [];
  if (typedFix.is_public) {
    const { data: allReactions } = await supabase
      .from("fix_reactions")
      .select("emoji, user_id")
      .eq("fix_id", id);
    for (const r of allReactions ?? []) {
      initialReactions[r.emoji] = (initialReactions[r.emoji] ?? 0) + 1;
      if (r.user_id === user.id) userReactions.push(r.emoji);
    }
  }

  return (
    <div className="min-h-screen px-4 sm:px-6 lg:px-8 pt-8 pb-16" style={{ background: "#0A0A0A" }}>
      <div className="max-w-2xl mx-auto">

        {/* Back button + share */}
        <div className="flex items-center justify-between mb-8">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 font-sans text-sm transition-colors hover:text-accent"
            style={{ color: "rgba(244,244,244,0.4)" }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6" />
            </svg>
            My fixes
          </Link>
          <ShareButton fixId={id} isPublic={typedFix.is_public} fixTitle={typedFix.title} days={days} intensity={typedFix.intensity} />
        </div>

        {/* Title + meta */}
        <div className="mb-6">
          <div className="flex flex-wrap items-start gap-3 mb-4">
            <span
              className="font-mono text-[10px] uppercase tracking-widest px-2.5 py-1 rounded-full"
              style={{
                background: "rgba(244,244,244,0.06)",
                border: "1px solid rgba(244,244,244,0.1)",
                color: "rgba(244,244,244,0.45)",
              }}
            >
              {typedFix.category}
            </span>
          </div>

          <h1
            className="font-display font-bold mb-4 leading-tight"
            style={{
              color: "#F4F4F4",
              fontSize: "clamp(32px, 6vw, 56px)",
              letterSpacing: "-0.03em",
            }}
          >
            {typedFix.title}
          </h1>

          {/* Status pill — interactive */}
          <FixDetailClient
            fixId={id}
            title={typedFix.title}
            category={typedFix.category}
            days={days}
            status={status}
            intensity={typedFix.intensity}
            ended={typedFix.status === "Ended"}
            eulogyInitial={typedFix.eulogy}
            hasCheckedInToday={hasCheckedInToday}
            isPublic={typedFix.is_public}
            tagsInitial={typedFix.tags ?? []}
            isPinned={isPinned}
            isPro={isPro}
          />
        </div>

        {/* Day counter */}
        <div
          className="rounded-2xl p-6 mb-4 relative overflow-hidden"
          style={{
            background: "#111113",
            border: "1px solid rgba(244,244,244,0.07)",
          }}
        >
          {/* Ambient glow behind the number */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: "radial-gradient(ellipse 55% 60% at 10% 50%, rgba(168,85,247,0.13), transparent 70%)",
            }}
          />
          <div className="relative">
            <div className="flex items-baseline gap-2 mb-1">
              <span
                className="font-display font-black leading-none"
                style={{
                  color: "#F4F4F4",
                  fontSize: "clamp(72px, 14vw, 120px)",
                  letterSpacing: "-0.05em",
                  fontVariantNumeric: "tabular-nums",
                }}
              >
                {days}
              </span>
              <span
                className="font-sans font-medium"
                style={{ color: "rgba(244,244,244,0.35)", fontSize: "clamp(20px,4vw,32px)" }}
              >
                day{days !== 1 ? "s" : ""}
              </span>
            </div>
            <p className="font-sans text-sm" style={{ color: "rgba(244,244,244,0.35)" }}>
              Since {formatDate(typedFix.started_at)}
              {typedFix.ended_at && (
                <> · Ended {formatDate(typedFix.ended_at)}</>
              )}
            </p>

            {/* Sparkline */}
            <div className="mt-4">
              <Sparkline entries={entriesForSparkline} />
            </div>
          </div>
        </div>

        {/* Note */}
        {typedFix.note && (
          <div
            className="rounded-2xl p-5 mb-4"
            style={{
              background: "#111113",
              border: "1px solid rgba(244,244,244,0.07)",
            }}
          >
            <p
              className="font-sans text-[13px] uppercase tracking-widest mb-3"
              style={{ color: "rgba(244,244,244,0.3)" }}
            >
              Note
            </p>
            <p
              className="font-display italic text-[17px] leading-relaxed"
              style={{
                color: "rgba(244,244,244,0.75)",
                borderLeft: "2px solid rgba(168,85,247,0.35)",
                paddingLeft: 16,
              }}
            >
              {typedFix.note}
            </p>
          </div>
        )}

        {/* Reactions (public fixes only) */}
        {typedFix.is_public && (
          <div
            className="rounded-2xl p-5 mb-4"
            style={{ background: "#111113", border: "1px solid rgba(244,244,244,0.07)" }}
          >
            <p className="font-mono text-[10px] uppercase tracking-widest mb-3" style={{ color: "rgba(244,244,244,0.3)" }}>
              Reactions
            </p>
            <FixReactions
              fixId={id}
              initialReactions={initialReactions}
              userReactions={userReactions}
            />
          </div>
        )}

        {/* Check-in notes */}
        {entries.some((e) => e.note) && (
          <div
            className="rounded-2xl p-5 mb-4"
            style={{
              background: "#111113",
              border: "1px solid rgba(244,244,244,0.07)",
            }}
          >
            <p
              className="font-sans text-[13px] uppercase tracking-widest mb-4"
              style={{ color: "rgba(244,244,244,0.3)" }}
            >
              Check-in notes
            </p>
            <div className="flex flex-col gap-3">
              {entries
                .filter((e) => e.note)
                .map((e) => (
                  <div key={e.date} className="flex gap-3 items-start">
                    <span
                      className="font-mono text-[10px] uppercase tracking-widest mt-0.5 shrink-0"
                      style={{ color: "rgba(244,244,244,0.25)" }}
                    >
                      {new Date(e.date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                    </span>
                    <p
                      className="font-display italic text-sm leading-relaxed"
                      style={{ color: "rgba(244,244,244,0.6)" }}
                    >
                      {e.note}
                    </p>
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* Eulogy (if ended) */}
        {typedFix.eulogy && (
          <div
            className="rounded-2xl p-5 mb-4"
            style={{
              background: "#111113",
              border: "1px solid rgba(244,244,244,0.07)",
            }}
          >
            <p
              className="font-sans text-[13px] uppercase tracking-widest mb-3"
              style={{ color: "rgba(244,244,244,0.3)" }}
            >
              Farewell
            </p>
            <p
              className="font-display italic text-[17px] leading-relaxed"
              style={{
                color: "rgba(244,244,244,0.6)",
                borderLeft: "2px solid rgba(244,244,244,0.15)",
                paddingLeft: 16,
              }}
            >
              {typedFix.eulogy}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

