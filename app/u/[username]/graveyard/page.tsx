import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { LogoLockup } from "@/components/Logo";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { FixStatusPill } from "@/components/FixStatusPill";
import { TombstoneIcon } from "@/components/MilestoneIcons";

const TEAL = "var(--accent)";
const CARD_BG = "var(--bg)";
const CARD_BORDER = "var(--line)";

type GraveyardFix = {
  id: string;
  title: string;
  category: string;
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

function TombstoneCard({ fix, index }: { fix: GraveyardFix; index: number }) {
  const days = getDayCount(fix.started_at, fix.ended_at);
  const delay = `${Math.min(index, 6) * 60}ms`;

  return (
    <Link
      href={`/fix/${fix.id}`}
      className="motion-card group relative overflow-hidden rounded-3xl p-6 flex flex-col gap-4 anim-fadeUp"
      style={{
        background: CARD_BG,
        border: `1px solid ${CARD_BORDER}`,
        animationDelay: delay,
        textDecoration: "none",
      }}
    >
      <div className="relative flex items-center gap-2 flex-wrap">
        <span
          className="inline-flex items-center font-sans text-[11px] rounded-full px-2.5 py-0.5"
          style={{
            background: "var(--accent-soft)",
            color: TEAL,
            border: "1px solid var(--accent)",
          }}
        >
          {fix.category}
        </span>
        <FixStatusPill status="Ended" size="sm" />
      </div>

      <h3
        className="relative font-display leading-snug group-hover:text-[var(--accent)] transition-colors"
        style={{
          color: "var(--ink)",
          fontSize: 19,
          fontWeight: 600,
          letterSpacing: "-0.01em",
          lineHeight: 1.18,
          display: "-webkit-box",
          WebkitLineClamp: 2,
          WebkitBoxOrient: "vertical",
          overflow: "hidden",
        }}
      >
        {fix.title}
      </h3>

      <div className="relative">
        <div className="flex items-baseline gap-2 mb-1">
          <span
            className="font-display leading-none tabular-nums"
            style={{ color: TEAL, fontSize: 44, fontWeight: 600, letterSpacing: "-0.04em" }}
          >
            {days}
          </span>
          <span className="font-sans text-sm" style={{ color: "var(--ink-muted)" }}>
            days of their life
          </span>
        </div>
        <p className="font-sans text-xs" style={{ color: "var(--ink-faint)" }}>
          {formatDate(fix.started_at)} — {formatDate(fix.ended_at)}
        </p>
      </div>

      {fix.eulogy && (
        <blockquote
          className="relative font-display text-[14px] leading-relaxed pl-4 m-0"
          style={{ borderLeft: `2px solid ${TEAL}`, color: "var(--ink-muted)", fontStyle: "italic" }}
        >
          &ldquo;{fix.eulogy}&rdquo;
        </blockquote>
      )}
    </Link>
  );
}

function EmptyGraveyard() {
  return (
    <div
      className="relative overflow-hidden rounded-3xl p-12 sm:p-16 text-center anim-fadeUp"
      style={{ background: CARD_BG, border: `1px solid ${CARD_BORDER}` }}
    >
      <div className="relative max-w-md mx-auto">
        <span
          className="inline-flex items-center font-sans text-xs rounded-full px-3 py-1 mb-6"
          style={{ background: "var(--accent-soft)", color: TEAL, border: "1px solid var(--accent)" }}
        >
          empty
        </span>
        <p
          className="font-display"
          style={{ color: "var(--ink)", fontSize: "clamp(24px, 5vw, 32px)", letterSpacing: "-0.02em", fontWeight: 600 }}
        >
          Nothing in the graveyard yet.
        </p>
        <p className="mt-3 font-sans text-base" style={{ color: "var(--ink-muted)" }}>
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

  if (profileError || !profile) {
    notFound();
  }

  const {
    data: { user: currentUser },
  } = await supabase.auth.getUser();

  const isSelf = currentUser?.id === profile.id;

  if (!profile.is_public && !isSelf) {
    notFound();
  }

  const { data: fixes } = await supabase
    .from("fixes")
    .select("id, title, category, started_at, ended_at, eulogy")
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
    eulogy: f.eulogy ?? null,
  }));

  return (
    <div className="min-h-screen relative" style={{ background: "var(--bg)", color: "var(--ink)" }}>
      <nav
        className="sticky top-0 z-40 px-6 sm:px-10 py-5 flex items-center justify-between"
        style={{
          background: "rgba(7,7,8,0.78)",
          backdropFilter: "blur(20px)",
          borderBottom: `1px solid ${CARD_BORDER}`,
        }}
      >
        <Link href="/" aria-label="Hyperfix home" className="transition-transform hover:scale-[1.02]">
          <LogoLockup size="sm" />
        </Link>
        <Link
          href={`/u/${username}`}
          className="motion-link font-sans text-sm transition-colors"
          style={{ color: "var(--ink-muted)" }}
        >
          ← @{username}
        </Link>
      </nav>

      <main className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-16">
        {/* Hero — clean header */}
        <div className="mb-10 anim-fadeUp">
          <p
            className="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.18em] mb-4"
            style={{ color: TEAL }}
          >
            <TombstoneIcon size={14} />
            @{username} · the graveyard
          </p>
          <h1
            className="font-display"
            style={{
              color: "var(--ink)",
              fontSize: "clamp(32px, 5.5vw, 48px)",
              lineHeight: 1.04,
              letterSpacing: "-0.02em",
              fontWeight: 600,
            }}
          >
            Every obsession they&apos;ve mourned.
          </h1>
          <p
            className="mt-4 font-sans text-base max-w-lg"
            style={{ color: "var(--ink-muted)" }}
          >
            Public ended fixations, with the eulogies they wrote.
          </p>
        </div>

        {graveyardFixes.length === 0 ? (
          <EmptyGraveyard />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {graveyardFixes.map((fix, i) => (
              <TombstoneCard key={fix.id} fix={fix} index={i} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
