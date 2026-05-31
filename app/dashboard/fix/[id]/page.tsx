import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { FixStatusPill as _FixStatusPill, type FixStatus } from "@/components/FixStatusPill";
import { notFound, redirect } from "next/navigation";
import { FixDetailClient } from "./FixDetailClient";
import { ShareButton } from "@/components/ShareButton";
import { ShareLinkBar } from "@/components/ShareLinkBar";
import { Sparkline } from "@/components/Sparkline";
import { FixReactions } from "@/components/FixReactions";
import { LogoLockup as _LogoLockup } from "@/components/Logo";
import { CategoryIcon } from "@/components/CategoryIcon";
import { FlameIcon } from "@/components/LandingIcons";

const TEAL = "var(--accent)";
const CARD_BG = "var(--bg)";
const CARD_BORDER = "var(--line)";
const NOISE_URL =
  "url(\"data:image/svg+xml;utf8,<svg viewBox='0 0 240 240' xmlns='http://www.w3.org/2000/svg'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 0.55 0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>\")";

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
  banner_url: string | null;
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
    .select("id, user_id, title, category, status, intensity, note, eulogy, is_public, started_at, ended_at, created_at, tags, banner_url")
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

  // Fetch entry history for sparkline + timeline
  const { data: entriesData } = await supabase
    .from("fix_entries")
    .select("id, date, intensity, note")
    .eq("fix_id", id)
    .order("date", { ascending: false })
    .limit(30);
  const entries = (entriesData ?? []) as { id: string; date: string; intensity: number; note: string | null }[];
  const entriesForSparkline = [...entries].reverse();

  // Check if this fix is pinned on the user's profile + Pro status
  const { data: profileData } = await supabase
    .from("profiles")
    .select("pinned_fix_id, pinned_fix_ids, is_pro")
    .eq("id", user.id)
    .single();
  const pinnedIds: string[] =
    (profileData?.pinned_fix_ids as string[] | null) ??
    (profileData?.pinned_fix_id ? [profileData.pinned_fix_id as string] : []);
  const isPinned = pinnedIds.includes(id);
  const isPro = profileData?.is_pro ?? false;

  // "Others tracking this" — public fixes with same title from other users
  const { count: othersCount } = await supabase
    .from("fixes")
    .select("id", { count: "exact", head: true })
    .eq("title", typedFix.title)
    .neq("user_id", user.id)
    .is("ended_at", null);

  // Fix discovery — recent public fixes in the same category from other users
  const { data: discoveryData } = await supabase
    .from("fixes")
    .select("id, title, category, started_at, ended_at, profiles(username)")
    .eq("is_public", true)
    .eq("category", typedFix.category)
    .neq("user_id", user.id)
    .is("ended_at", null)
    .order("created_at", { ascending: false })
    .limit(3);
  const discoveryFixes = (discoveryData ?? []) as unknown as {
    id: string;
    title: string;
    category: string;
    started_at: string;
    ended_at: string | null;
    profiles: { username: string | null } | { username: string | null }[] | null;
  }[];

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
    <div className="min-h-screen relative" style={{ background: "var(--bg)", color: "var(--ink)" }}>
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none mix-blend-overlay"
        style={{ backgroundImage: NOISE_URL, backgroundSize: "240px 240px", opacity: 0.08 }}
      />

      {/* Glass sticky nav */}
      <nav
        className="sticky top-0 z-40 px-4 sm:px-8 py-3 flex items-center justify-between gap-3"
        style={{
          background: "rgba(7,7,8,0.85)",
          backdropFilter: "blur(20px)",
          borderBottom: `1px solid ${CARD_BORDER}`,
        }}
      >
        <Link href="/dashboard" className="font-mono text-xs shrink-0 transition-opacity hover:opacity-60" style={{ color: "var(--ink-muted)" }}>
          ← my fixes
        </Link>
        <div className="flex items-center gap-2">
          {typedFix.is_public && (
            <Link
              href={`/fix/${id}`}
              className="hidden sm:inline-flex items-center gap-1.5 font-sans text-xs font-medium px-3 py-1.5 rounded-full transition-all hover:opacity-80"
              style={{
                background: "var(--line)",
                border: "1px solid var(--line)",
                color: "var(--ink-muted)",
              }}
            >
              Public page
            </Link>
          )}
          <Link
            href={`/dashboard/fix/${id}/card`}
            className="inline-flex items-center gap-1.5 font-sans text-xs font-medium px-3 py-1.5 rounded-full transition-all hover:opacity-80"
            style={{
              background: "var(--line)",
              border: "1px solid var(--line)",
              color: "var(--ink-muted)",
            }}
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 20h9M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
            </svg>
            Customize card
          </Link>
          <ShareButton fixId={id} isPublic={typedFix.is_public} fixTitle={typedFix.title} days={days} intensity={typedFix.intensity} />
        </div>
      </nav>

      <main className="relative max-w-2xl mx-auto px-4 sm:px-6 pt-8 pb-16">

        {/* Custom banner (if set) */}
        {typedFix.banner_url && (
          <div
            className="relative overflow-hidden rounded-3xl mb-4 anim-fadeUp"
            style={{
              height: 160,
              backgroundImage: `url(${typedFix.banner_url})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              border: `1px solid ${CARD_BORDER}`,
            }}
          >
            <div
              aria-hidden
              className="absolute inset-0 pointer-events-none"
              style={{ background: "linear-gradient(180deg, transparent 0%, transparent 50%, rgba(7,7,8,0.65) 100%)" }}
            />
          </div>
        )}

        {/* Hero card — subtle when no banner, neutral when banner is set */}
        <div
          className="relative overflow-hidden rounded-3xl mb-5 p-6 sm:p-9 anim-fadeUp"
          style={{
            background: CARD_BG,
            border: `1px solid ${CARD_BORDER}`,
          }}
        >
          {/* Top teal accent line — only when there's no banner above */}
          {!typedFix.banner_url && (
            <div
              aria-hidden
              className="absolute top-0 left-0 right-0 pointer-events-none"
              style={{
                height: 2,
                background: "linear-gradient(90deg, transparent 0%, var(--accent) 50%, transparent 100%)",
              }}
            />
          )}
          {/* Subtle teal radial in corner — only when no banner */}
          {!typedFix.banner_url && (
            <div
              aria-hidden
              className="absolute pointer-events-none"
              style={{
                top: -80,
                right: -80,
                width: 240,
                height: 240,
                background: "radial-gradient(circle, var(--accent-soft) 0%, transparent 70%)",
              }}
            />
          )}
          <div className="relative">
            {/* Category eyebrow */}
            <div className="flex items-center gap-2 mb-5 flex-wrap">
              <span
                className="inline-flex items-center gap-1.5 font-sans text-xs rounded-full px-3 py-1"
                style={{
                  background: "var(--accent-soft)",
                  color: TEAL,
                  border: "1px solid var(--accent)",
                }}
              >
                <CategoryIcon category={typedFix.category} size={12} />
                {typedFix.category}
              </span>
            </div>

            {/* Title */}
            <h1
              className="font-display leading-tight mb-5"
              style={{
                color: "var(--ink)",
                fontSize: "clamp(28px, 6vw, 48px)",
                fontWeight: 600,
                letterSpacing: "-0.025em",
                lineHeight: 1.06,
              }}
            >
              {typedFix.title}
            </h1>

            {/* FixDetailClient (status pill, check-in, tags, etc.) */}
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
              bannerUrl={typedFix.banner_url}
              userId={user.id}
            />
          </div>
        </div>

        {/* Share link — public fixes only */}
        {typedFix.is_public && (
          <ShareLinkBar fixId={id} />
        )}

        {/* Day counter + sparkline card */}
        <div
          className="relative overflow-hidden rounded-3xl p-6 mb-4 anim-fadeUp motion-card"
          style={{ background: CARD_BG, border: `1px solid ${CARD_BORDER}`, animationDelay: "60ms" }}
        >
          <div
            aria-hidden
            className="absolute inset-0 pointer-events-none mix-blend-overlay"
            style={{ backgroundImage: NOISE_URL, backgroundSize: "240px 240px", opacity: 0.22 }}
          />
          <div
            aria-hidden
            className="absolute inset-0 pointer-events-none"
            style={{ background: "radial-gradient(ellipse 55% 60% at 10% 50%, var(--accent-soft), transparent 70%)" }}
          />
          <div className="relative">
            <div className="flex items-baseline gap-3 mb-1">
              <span
                className="font-display leading-none tabular-nums"
                style={{
                  color: TEAL,
                  fontSize: "clamp(72px, 14vw, 112px)",
                  fontWeight: 600,
                  letterSpacing: "-0.05em",
                }}
              >
                {days}
              </span>
              <span className="font-sans" style={{ color: "var(--ink-muted)", fontSize: "clamp(18px,4vw,28px)" }}>
                day{days !== 1 ? "s" : ""}
              </span>
            </div>
            <p className="font-sans text-sm mb-5" style={{ color: "var(--ink-faint)" }}>
              Since {formatDate(typedFix.started_at)}
              {typedFix.ended_at && <> · Ended {formatDate(typedFix.ended_at)}</>}
            </p>
            <Sparkline entries={entriesForSparkline} />
          </div>
        </div>

        {/* Note */}
        {typedFix.note && (
          <div
            className="relative overflow-hidden rounded-3xl p-6 mb-4 anim-fadeUp motion-card"
            style={{ background: CARD_BG, border: `1px solid ${CARD_BORDER}`, animationDelay: "80ms" }}
          >
            <div
              aria-hidden
              className="absolute inset-0 pointer-events-none mix-blend-overlay"
              style={{ backgroundImage: NOISE_URL, backgroundSize: "240px 240px", opacity: 0.22 }}
            />
            <p className="relative font-sans text-[10px] uppercase tracking-widest mb-3" style={{ color: "var(--ink-faint)" }}>
              Note
            </p>
            <p
              className="relative font-display italic leading-relaxed"
              style={{
                color: "var(--ink-muted)",
                fontSize: 17,
                borderLeft: "2px solid rgba(111,138,99,0.25)",
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
            className="relative overflow-hidden rounded-3xl p-6 mb-4 anim-fadeUp"
            style={{ background: CARD_BG, border: `1px solid ${CARD_BORDER}`, animationDelay: "100ms" }}
          >
            <div
              aria-hidden
              className="absolute inset-0 pointer-events-none mix-blend-overlay"
              style={{ backgroundImage: NOISE_URL, backgroundSize: "240px 240px", opacity: 0.22 }}
            />
            <p className="relative font-sans text-[10px] uppercase tracking-widest mb-4" style={{ color: "var(--ink-faint)" }}>
              Reactions
            </p>
            <div className="relative">
              <FixReactions
                fixId={id}
                initialReactions={initialReactions}
                userReactions={userReactions}
              />
            </div>
          </div>
        )}

        {/* Others tracking this */}
        {(othersCount ?? 0) > 0 && (
          <Link
            href={`/search?q=${encodeURIComponent(typedFix.title)}`}
            className="group relative overflow-hidden rounded-3xl px-6 py-5 mb-4 flex items-center gap-3 anim-fadeUp transition-all hover:border-[rgba(111,138,99,0.3)]"
            style={{
              background: CARD_BG,
              border: "1px solid var(--accent-soft)",
              animationDelay: "120ms",
            }}
          >
            <div
              aria-hidden
              className="absolute inset-0 pointer-events-none mix-blend-overlay"
              style={{ backgroundImage: NOISE_URL, backgroundSize: "240px 240px", opacity: 0.18 }}
            />
            <span className="relative inline-flex" style={{ color: TEAL }}><FlameIcon size={20} /></span>
            <p className="relative flex-1 font-display font-semibold text-sm" style={{ color: TEAL }}>
              {othersCount} other {othersCount === 1 ? "person is" : "people are"} also tracking &ldquo;{typedFix.title}&rdquo;
            </p>
            <span className="relative font-sans text-sm shrink-0 transition-transform group-hover:translate-x-0.5" style={{ color: TEAL }}>
              See them →
            </span>
          </Link>
        )}

        {/* Fix discovery */}
        {discoveryFixes.length > 0 && (
          <div
            className="relative overflow-hidden rounded-3xl p-6 mb-4 anim-fadeUp"
            style={{ background: CARD_BG, border: `1px solid ${CARD_BORDER}`, animationDelay: "140ms" }}
          >
            <div
              aria-hidden
              className="absolute inset-0 pointer-events-none mix-blend-overlay"
              style={{ backgroundImage: NOISE_URL, backgroundSize: "240px 240px", opacity: 0.22 }}
            />
            <p className="relative font-sans text-[10px] uppercase tracking-widest mb-4" style={{ color: "var(--ink-faint)" }}>
              Others also tracking {typedFix.category}
            </p>
            <div className="relative flex flex-col gap-2">
              {discoveryFixes.map((f) => {
                const fDays = Math.max(1, Math.ceil((new Date().getTime() - new Date(f.started_at).getTime()) / (1000 * 60 * 60 * 24)));
                const prof = Array.isArray(f.profiles) ? f.profiles[0] : f.profiles;
                return (
                  <Link
                    key={f.id}
                    href={`/fix/${f.id}`}
                    className="flex items-center justify-between gap-3 rounded-2xl px-4 py-3 transition-all hover:opacity-80"
                    style={{
                      background: "transparent",
                      border: `1px solid ${CARD_BORDER}`,
                    }}
                  >
                    <span
                      className="font-display text-sm leading-snug"
                      style={{
                        color: "var(--ink-muted)",
                        display: "-webkit-box",
                        WebkitLineClamp: 1,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                      }}
                    >
                      {f.title}
                    </span>
                    <span className="font-sans text-[10px] shrink-0" style={{ color: "var(--ink-faint)" }}>
                      {prof?.username ? `@${prof.username} · ` : ""}{fDays}d
                    </span>
                  </Link>
                );
              })}
            </div>
          </div>
        )}

        {/* Check-in history */}
        {entries.length > 0 && (
          <div
            className="relative overflow-hidden rounded-3xl p-6 mb-4 anim-fadeUp"
            style={{ background: CARD_BG, border: `1px solid ${CARD_BORDER}`, animationDelay: "160ms" }}
          >
            <div
              aria-hidden
              className="absolute inset-0 pointer-events-none mix-blend-overlay"
              style={{ backgroundImage: NOISE_URL, backgroundSize: "240px 240px", opacity: 0.22 }}
            />
            <p className="relative font-sans text-[10px] uppercase tracking-widest mb-5" style={{ color: "var(--ink-faint)" }}>
              Check-in history
            </p>
            <div className="relative flex flex-col gap-3">
              {entries.map((e) => {
                const intColor = e.intensity >= 8 ? "#E63946" : e.intensity >= 6 ? "#FB923C" : TEAL;
                return (
                  <div key={e.id ?? e.date} className="flex items-start gap-4">
                    <span
                      className="font-sans text-[10px] uppercase tracking-widest mt-0.5 shrink-0 w-14 text-right"
                      style={{ color: "var(--ink-faint)" }}
                    >
                      {new Date(e.date + "T12:00:00").toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                    </span>
                    <span
                      className="font-mono text-[11px] font-semibold shrink-0 w-7 text-center"
                      style={{ color: intColor }}
                    >
                      {e.intensity}
                    </span>
                    {e.note && (
                      <p
                        className="font-display italic text-[13px] leading-snug flex-1"
                        style={{ color: "var(--ink-muted)" }}
                      >
                        {e.note}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Eulogy (if ended) */}
        {typedFix.eulogy && (
          <div
            className="relative overflow-hidden rounded-3xl p-6 mb-4 anim-fadeUp"
            style={{
              background: CARD_BG,
              border: "1px solid var(--accent)",
              animationDelay: "180ms",
            }}
          >
            <div
              aria-hidden
              className="absolute inset-0 pointer-events-none mix-blend-overlay"
              style={{ backgroundImage: NOISE_URL, backgroundSize: "240px 240px", opacity: 0.22 }}
            />
            <p className="relative font-sans text-[10px] uppercase tracking-widest mb-3" style={{ color: TEAL }}>
              Farewell
            </p>
            <p
              className="relative font-display italic leading-relaxed"
              style={{
                color: "var(--ink-muted)",
                fontSize: 17,
                borderLeft: `2px solid var(--accent)`,
                paddingLeft: 16,
              }}
            >
              {typedFix.eulogy}
            </p>
          </div>
        )}
      </main>
    </div>
  );
}

