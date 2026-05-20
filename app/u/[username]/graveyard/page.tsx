import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { LogoDark } from "@/components/Logo";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { FixStatusPill } from "@/components/FixStatusPill";

type GraveyardFix = {
  id: string;
  title: string;
  category: string;
  started_at: string;
  ended_at: string;
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
        stroke="rgba(244,244,244,0.15)"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M12 2C7.03 2 3 6.03 3 11c0 2.96 1.36 5.6 3.5 7.34V20a1 1 0 0 0 1 1h9a1 1 0 0 0 1-1v-1.66A9 9 0 0 0 21 11c0-4.97-4.03-9-9-9z" />
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
          No public ended fixes to show.
        </p>
      </div>
    </div>
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ username: string }>;
}): Promise<Metadata> {
  const { username } = await params;
  return {
    title: `@${username}'s graveyard · Hyperfix`,
  };
}

export default async function PublicGraveyardPage({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const { username } = await params;
  const supabase = await createClient();

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("id, username, is_public")
    .eq("username", username)
    .single();

  if (profileError || !profile || !profile.is_public) {
    notFound();
  }

  const { data: fixes } = await supabase
    .from("fixes")
    .select("id, title, category, started_at, ended_at")
    .eq("user_id", profile.id)
    .eq("is_public", true)
    .not("ended_at", "is", null)
    .order("ended_at", { ascending: false });

  const graveyardFixes: GraveyardFix[] = (fixes ?? []).map((f) => ({
    id: f.id,
    title: f.title,
    category: f.category ?? "other",
    started_at: f.started_at,
    ended_at: f.ended_at as string,
  }));

  return (
    <div className="min-h-screen" style={{ background: "#0A0A0A", color: "#F4F4F4" }}>
      {/* Nav */}
      <nav className="border-b" style={{ borderColor: "rgba(244,244,244,0.07)" }}>
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" aria-label="Hyperfix home">
            <LogoDark size="sm" />
          </Link>
          <Link
            href={`/u/${username}`}
            className="font-mono text-sm transition-opacity hover:opacity-70"
            style={{ color: "rgba(244,244,244,0.5)" }}
          >
            ← @{username}
          </Link>
        </div>
      </nav>

      <main className="max-w-5xl mx-auto px-6 pt-12 pb-20">
        {/* Header */}
        <div className="mb-10">
          <h1
            className="font-display font-bold leading-tight"
            style={{
              color: "#F4F4F4",
              fontSize: "clamp(28px, 5vw, 52px)",
              letterSpacing: "-0.03em",
            }}
          >
            @{username}&apos;s graveyard
          </h1>
          <p
            className="font-display italic mt-2"
            style={{
              color: "rgba(244,244,244,0.35)",
              fontSize: "clamp(14px, 2vw, 18px)",
              letterSpacing: "-0.01em",
            }}
          >
            every obsession they&apos;ve mourned
          </p>
        </div>

        {/* Grid or empty state */}
        {graveyardFixes.length === 0 ? (
          <EmptyGraveyard />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {graveyardFixes.map((fix) => (
              <TombstoneCard key={fix.id} fix={fix} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
