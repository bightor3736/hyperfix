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
  const diff = end.getTime() - start.getTime();
  return Math.max(1, Math.ceil(diff / (1000 * 60 * 60 * 24)));
}

function TombstoneCard({ fix }: { fix: GraveyardFix }) {
  const days = getDayCount(fix.started_at, fix.ended_at);

  return (
    <div
      className="rounded-2xl p-5 flex flex-col gap-3"
      style={{
        background: "#111113",
        border: "1px solid rgba(244,244,244,0.07)",
      }}
    >
      {/* Top row: category + status */}
      <div className="flex items-center gap-2 flex-wrap">
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

      {/* Title */}
      <h3
        className="font-display font-semibold leading-snug"
        style={{
          color: "#F4F4F4",
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

      {/* Day count */}
      <div>
        <div className="flex items-baseline gap-1.5">
          <span
            className="font-display font-black leading-none"
            style={{
              color: "#A855F7",
              fontSize: 40,
              letterSpacing: "-0.04em",
              fontVariantNumeric: "tabular-nums",
            }}
          >
            {days}
          </span>
          <span
            className="font-display font-semibold pb-0.5"
            style={{ color: "#A855F7", fontSize: 16 }}
          >
            days
          </span>
        </div>
        <p className="font-mono text-[10px] mt-1" style={{ color: "rgba(244,244,244,0.35)" }}>
          {formatDate(fix.started_at)} → {formatDate(fix.ended_at)}
        </p>
      </div>

      {/* Eulogy or prompt */}
      {fix.eulogy ? (
        <blockquote
          className="font-display italic text-[13px] leading-relaxed pl-3"
          style={{
            borderLeft: "2px solid rgba(168,85,247,0.3)",
            color: "rgba(168,85,247,0.75)",
            margin: 0,
          }}
        >
          {fix.eulogy}
        </blockquote>
      ) : (
        <p className="font-display italic text-[13px]" style={{ color: "rgba(244,244,244,0.22)" }}>
          No eulogy written.{" "}
          <Link
            href={`/dashboard/fix/${fix.id}`}
            className="not-italic underline decoration-dotted transition-opacity hover:opacity-80"
            style={{ color: "rgba(244,244,244,0.4)" }}
          >
            Write one →
          </Link>
        </p>
      )}
    </div>
  );
}

function EmptyGraveyard() {
  return (
    <div className="flex flex-col items-center justify-center py-24 px-6 text-center gap-5">
      {/* Skull SVG */}
      <svg
        width="56"
        height="56"
        viewBox="0 0 24 24"
        fill="none"
        stroke="rgba(244,244,244,0.15)"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M12 2C7.03 2 3 6.03 3 11c0 2.96 1.36 5.6 3.5 7.34V20a1 1 0 0 0 1 1h9a1 1 0 0 0 1-1v-1.66A9 9 0 0 0 21 11c0-4.97-4.03-9-9-9z" />
        <line x1="9" y1="14" x2="9" y2="14" strokeWidth="2" strokeLinecap="round" />
        <line x1="15" y1="14" x2="15" y2="14" strokeWidth="2" strokeLinecap="round" />
        <line x1="9" y1="14" x2="9.01" y2="14" />
        <line x1="15" y1="14" x2="15.01" y2="14" />
        <circle cx="9" cy="13" r="1.5" fill="rgba(244,244,244,0.15)" stroke="none" />
        <circle cx="15" cy="13" r="1.5" fill="rgba(244,244,244,0.15)" stroke="none" />
        <path d="M10 20v1M14 20v1" />
      </svg>

      <div>
        <p
          className="font-display font-semibold text-xl mb-2"
          style={{ color: "rgba(244,244,244,0.3)", letterSpacing: "-0.02em" }}
        >
          Nothing in the graveyard yet.
        </p>
        <p className="font-sans text-sm" style={{ color: "rgba(244,244,244,0.2)" }}>
          Fixes you end will be memorialized here.
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

          <div className="flex items-center justify-between mt-3">
            <p
              className="font-mono text-[10px] uppercase tracking-widest"
              style={{ color: "rgba(244,244,244,0.25)" }}
            >
              RIP · {total} {total === 1 ? "fix" : "fixes"}
            </p>
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
