import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { FixStatusPill } from "@/components/FixStatusPill";
import Link from "next/link";
import { GraveyardExportButton } from "@/components/GraveyardExportButton";

type GraveyardFix = {
  id: string;
  title: string;
  category: string;
  status: string;
  started_at: string;
  ended_at: string;
  eulogy: string | null;
};

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function getDayCount(startedAt: string, endedAt: string): number {
  const start = new Date(startedAt);
  const end = new Date(endedAt);
  return Math.max(1, Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)));
}

function timeAgo(dateStr: string): string {
  const end = new Date(dateStr);
  const now = new Date();
  const diff = now.getTime() - end.getTime();
  const days = Math.floor(diff / 86_400_000);
  if (days < 1) return "today";
  if (days === 1) return "yesterday";
  if (days < 30) return `${days} days ago`;
  const months = Math.floor(days / 30);
  if (months < 12) return `${months} month${months !== 1 ? "s" : ""} ago`;
  const years = Math.floor(months / 12);
  return `${years} year${years !== 1 ? "s" : ""} ago`;
}

function TombstoneCard({ fix }: { fix: GraveyardFix }) {
  const days = getDayCount(fix.started_at, fix.ended_at);
  const rested = timeAgo(fix.ended_at);

  return (
    <div
      className="rounded-2xl p-5 flex flex-col gap-3 group transition-all duration-200"
      style={{
        background: "#111113",
        border: "1px solid rgba(244,244,244,0.07)",
        boxShadow: "0 0 20px rgba(168,85,247,0.03)",
      }}
    >
      {/* Top row: category + status + time ago */}
      <div className="flex items-center justify-between gap-2 flex-wrap">
        <div className="flex items-center gap-2">
          <span
            className="font-mono text-[9px] uppercase tracking-widest px-2.5 py-1 rounded-full"
            style={{
              background: "rgba(244,244,244,0.06)",
              border: "1px solid rgba(244,244,244,0.1)",
              color: "rgba(244,244,244,0.4)",
            }}
          >
            {fix.category}
          </span>
          <FixStatusPill status="Ended" size="sm" />
        </div>
        <span className="font-mono text-[9px]" style={{ color: "rgba(244,244,244,0.2)" }}>
          {rested}
        </span>
      </div>

      {/* Title */}
      <Link href={`/dashboard/fix/${fix.id}`}>
        <h3
          className="font-display font-semibold leading-snug hover:text-[#A855F7] transition-colors"
          style={{
            color: "rgba(244,244,244,0.85)",
            fontSize: 17,
            letterSpacing: "-0.02em",
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}
        >
          {fix.title}
        </h3>
      </Link>

      {/* Day count + dates */}
      <div>
        <div className="flex items-baseline gap-1.5 mb-1">
          <span
            className="font-display font-black leading-none"
            style={{
              color: "rgba(168,85,247,0.6)",
              fontSize: 36,
              letterSpacing: "-0.04em",
              fontVariantNumeric: "tabular-nums",
            }}
          >
            {days}
          </span>
          <span
            className="font-display font-semibold pb-0.5"
            style={{ color: "rgba(168,85,247,0.45)", fontSize: 14 }}
          >
            days of your life
          </span>
        </div>
        <p className="font-mono text-[9px]" style={{ color: "rgba(244,244,244,0.25)" }}>
          {formatDate(fix.started_at)} — {formatDate(fix.ended_at)}
        </p>
      </div>

      {/* Eulogy or prompt */}
      {fix.eulogy ? (
        <blockquote
          className="font-display italic text-[13px] leading-relaxed pl-3 mt-1"
          style={{
            borderLeft: "2px solid rgba(168,85,247,0.25)",
            color: "rgba(244,244,244,0.5)",
            margin: 0,
          }}
        >
          &ldquo;{fix.eulogy}&rdquo;
        </blockquote>
      ) : (
        <Link
          href={`/dashboard/fix/${fix.id}`}
          className="font-display italic text-[12px] transition-opacity hover:opacity-80"
          style={{ color: "rgba(244,244,244,0.2)" }}
        >
          Write a eulogy →
        </Link>
      )}
    </div>
  );
}

function EmptyGraveyard() {
  return (
    <div className="flex flex-col items-center justify-center py-24 px-6 text-center gap-5">
      <svg
        width="56"
        height="56"
        viewBox="0 0 24 24"
        fill="none"
        stroke="rgba(244,244,244,0.12)"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M12 2C7.03 2 3 6.03 3 11c0 2.96 1.36 5.6 3.5 7.34V20a1 1 0 0 0 1 1h9a1 1 0 0 0 1-1v-1.66A9 9 0 0 0 21 11c0-4.97-4.03-9-9-9z" />
        <circle cx="9" cy="13" r="1.5" fill="rgba(244,244,244,0.12)" stroke="none" />
        <circle cx="15" cy="13" r="1.5" fill="rgba(244,244,244,0.12)" stroke="none" />
        <path d="M10 20v1M14 20v1" />
      </svg>

      <div>
        <p
          className="font-display font-semibold text-xl mb-2"
          style={{ color: "rgba(244,244,244,0.25)", letterSpacing: "-0.02em" }}
        >
          Nothing here yet.
        </p>
        <p className="font-sans text-sm" style={{ color: "rgba(244,244,244,0.15)" }}>
          When a fix fades, it gets buried here. With a eulogy, if you loved it.
        </p>
      </div>
    </div>
  );
}

export default async function GraveyardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login");
  }

  const { data: fixes } = await supabase
    .from("fixes")
    .select("*")
    .eq("user_id", user.id)
    .not("ended_at", "is", null)
    .order("ended_at", { ascending: false });

  const graveyardFixes: GraveyardFix[] = (fixes ?? []).map((f) => ({
    id: f.id,
    title: f.title,
    category: f.category ?? "other",
    status: f.status ?? "Ended",
    started_at: f.started_at,
    ended_at: f.ended_at,
    eulogy: f.eulogy ?? null,
  }));

  const total = graveyardFixes.length;
  const totalDays = graveyardFixes.reduce((sum, f) => sum + getDayCount(f.started_at, f.ended_at), 0);

  return (
    <div className="min-h-screen px-4 sm:px-6 lg:px-8 pt-8 pb-16" style={{ background: "#0A0A0A" }}>
      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <div className="mb-8">
          <h1
            className="font-display font-bold leading-tight"
            style={{
              color: "#F4F4F4",
              fontSize: "clamp(28px, 5vw, 48px)",
              letterSpacing: "-0.03em",
            }}
          >
            Graveyard
          </h1>
          <p
            className="font-display italic mt-1"
            style={{
              color: "rgba(244,244,244,0.35)",
              fontSize: "clamp(14px, 2vw, 17px)",
              letterSpacing: "-0.01em",
            }}
          >
            The things that used to run your life.
          </p>

          <div className="flex items-center justify-between mt-4 flex-wrap gap-3">
            <div className="flex items-center gap-4">
              <span className="font-mono text-[10px] uppercase tracking-widest" style={{ color: "rgba(244,244,244,0.25)" }}>
                RIP · {total} {total === 1 ? "fix" : "fixes"}
              </span>
              {totalDays > 0 && (
                <span className="font-mono text-[10px] uppercase tracking-widest" style={{ color: "rgba(168,85,247,0.4)" }}>
                  · {totalDays.toLocaleString()} days lived
                </span>
              )}
            </div>
            {total > 0 && <GraveyardExportButton />}
          </div>
        </div>

        {/* Grid or empty state */}
        {total === 0 ? (
          <EmptyGraveyard />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {graveyardFixes.map((fix) => (
              <TombstoneCard key={fix.id} fix={fix} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
