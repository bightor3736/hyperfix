import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { FollowButton, FollowButtonLoggedIn } from "@/components/FollowButton";
import { MessageButton } from "@/components/MessageButton";
import { ShareProfileButton } from "@/components/ShareProfileButton";
import { resolveAccent, hexToRgba, isValidAccent, DEFAULT_ACCENT } from "@/lib/accent";
import { levelForPoints } from "@/lib/gamification/levels";
import { SocialChips } from "@/components/SocialChips";

// Fixed light palette — the profile card is theme-independent so it always
// reads like a clean, airy identity card regardless of the visitor's theme.
const PAGE_BG = "linear-gradient(180deg, #e9edf1 0%, #f3f5f7 55%, #eef1f4 100%)";
const CARD = "#ffffff";
const INK = "#1b1f24";
const MUTED = "#6b7280";
const FAINT = "#9aa1ab";
const LINE = "#edeff2";

interface Fix {
  id: string;
  started_at: string;
  ended_at: string | null;
  is_public: boolean;
}

interface Profile {
  id: string;
  username: string | null;
  display_name: string | null;
  avatar_url: string | null;
  bio: string | null;
  is_public: boolean;
  banner_url: string | null;
  is_pro: boolean | null;
  accent_color: string | null;
  social_link?: string | null;
  pronouns?: string | null;
  status_emoji?: string | null;
  status_text?: string | null;
  socials?: Record<string, string> | null;
  total_points?: number | null;
}

function dayCount(startedAt: string, endedAt: string | null): number {
  const start = new Date(startedAt);
  const end = endedAt ? new Date(endedAt) : new Date();
  return Math.max(1, Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ username: string }>;
}): Promise<Metadata> {
  const { username } = await params;
  const supabase = await createClient();
  const { data: profile } = await supabase
    .from("profiles")
    .select("username, display_name, bio, accent_color, is_pro")
    .eq("username", username)
    .single();

  if (!profile) return { title: "Not found · Hyperfix" };

  const typedProfile = profile as { username: string | null; display_name: string | null; bio: string | null; accent_color: string | null; is_pro: boolean | null };
  const name = typedProfile.display_name ?? typedProfile.username ?? username;
  const description = typedProfile.bio ?? `See what ${name} is hyperfixated on.`;
  resolveAccent(typedProfile.is_pro, typedProfile.accent_color);

  return {
    title: `${name} · Hyperfix`,
    description,
    openGraph: {
      title: `${name} on Hyperfix`,
      description,
      images: [{
        url: `https://hyperfix.app/api/og/profile/${username}`,
        width: 1200,
        height: 630,
      }],
    },
    twitter: {
      card: "summary_large_image",
      images: [`https://hyperfix.app/api/og/profile/${username}`],
    },
  };
}

export default async function PublicProfilePage({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const { username } = await params;
  const supabase = await createClient();

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("id, username, display_name, avatar_url, bio, is_public, banner_url, is_pro, accent_color, social_link, pronouns, status_emoji, status_text, socials, total_points")
    .eq("username", username)
    .single();

  if (profileError || !profile) {
    notFound();
  }

  const typedProfile = profile as Profile;

  const {
    data: { user: currentUser },
  } = await supabase.auth.getUser();

  const isSelf = currentUser?.id === typedProfile.id;

  if (!typedProfile.is_public && !isSelf) {
    notFound();
  }

  const { data: fixes } = await supabase
    .from("fixes")
    .select("id, started_at, ended_at, is_public")
    .eq("user_id", typedProfile.id)
    .order("created_at", { ascending: false });

  const allFixes: Fix[] = (fixes ?? []) as Fix[];
  const visibleFixes = isSelf ? allFixes : allFixes.filter((f) => f.is_public);
  const totalDays = visibleFixes.reduce((acc, fix) => acc + dayCount(fix.started_at, fix.ended_at), 0);

  const displayName = typedProfile.display_name ?? typedProfile.username ?? "Anonymous";
  const accent = isValidAccent(typedProfile.accent_color) ? typedProfile.accent_color : DEFAULT_ACCENT;
  const socialList = [
    typedProfile.social_link ?? "",
    ...Object.values(typedProfile.socials ?? {}).filter(Boolean),
  ].filter(Boolean).join(",");

  const { count: followerCount } = await supabase
    .from("follows")
    .select("id", { count: "exact", head: true })
    .eq("following_id", typedProfile.id);

  let isFollowing = false;
  if (currentUser && !isSelf) {
    const { data: followRow } = await supabase
      .from("follows")
      .select("id")
      .eq("follower_id", currentUser.id)
      .eq("following_id", typedProfile.id)
      .maybeSingle();
    isFollowing = !!followRow;
  }

  const totalPoints = typedProfile.total_points ?? 0;
  const { level, next } = levelForPoints(totalPoints);
  const expPct = next
    ? Math.min(100, Math.max(0, ((totalPoints - level.points) / (next.points - level.points)) * 100))
    : 100;

  const stats = [
    { label: "fixations", value: String(visibleFixes.length), href: undefined as string | undefined },
    { label: "days", value: String(totalDays), href: undefined },
    { label: "followers", value: String(followerCount ?? 0), href: `/u/${typedProfile.username}/followers` },
  ];

  return (
    <div className="min-h-screen" style={{ background: PAGE_BG }}>
      {/* Minimal light nav */}
      <nav className="flex items-center justify-between px-5 py-4 sm:px-8" style={{ borderBottom: `1px solid ${LINE}` }}>
        <Link href="/" className="font-display text-[18px] tracking-tight transition-opacity hover:opacity-80" style={{ color: INK }}>
          hyperfix
        </Link>
        <Link
          href={currentUser ? "/dashboard" : "/auth/login"}
          className="rounded-full px-4 py-2 font-mono text-[11px] uppercase tracking-widest transition-opacity hover:opacity-80"
          style={{ background: "#fff", border: `1px solid ${LINE}`, color: MUTED }}
        >
          {currentUser ? "my fixes" : "log in"}
        </Link>
      </nav>

      <main id="main-content" className="flex justify-center px-4 pt-10 pb-28 sm:pt-16">
        {/* ── Profile card ──────────────────────────────────────────── */}
        <div
          className="w-full max-w-[400px] overflow-hidden rounded-[28px] anim-fadeUp"
          style={{ background: CARD, boxShadow: "0 1px 2px rgba(16,24,40,0.04), 0 24px 48px -16px rgba(16,24,40,0.18)" }}
        >
          {/* Banner */}
          <div
            className="relative"
            style={{
              height: 150,
              backgroundImage: typedProfile.banner_url ? `url(${typedProfile.banner_url})` : undefined,
              background: typedProfile.banner_url
                ? undefined
                : "linear-gradient(170deg, #cfe0f2 0%, #dbe7f4 45%, #eef3f8 100%)",
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          >
            {/* Floating action, top-right */}
            <div className="absolute right-3 top-3 flex items-center gap-2">
              {!isSelf && (
                currentUser
                  ? <FollowButtonLoggedIn
                      targetUserId={typedProfile.id}
                      targetUsername={typedProfile.username ?? ""}
                      initialFollowing={isFollowing}
                      initialCount={followerCount ?? 0}
                    />
                  : <FollowButton
                      targetUserId={typedProfile.id}
                      targetUsername={typedProfile.username ?? ""}
                      initialFollowing={false}
                      initialCount={followerCount ?? 0}
                    />
              )}
              {!isSelf && currentUser && <MessageButton targetUserId={typedProfile.id} />}
              {isSelf && <ShareProfileButton username={typedProfile.username ?? ""} displayName={displayName} />}
            </div>
          </div>

          {/* Body */}
          <div className="px-6 pb-7 text-center">
            {/* Avatar — overlaps banner, gradient ring */}
            <div className="relative mx-auto -mt-12 mb-3 w-fit">
              <div
                className="rounded-full p-[3px]"
                style={{
                  background: typedProfile.is_pro
                    ? "conic-gradient(from 210deg, #ff7a59, #ffc857, #34d399, #2dd4bf, #818cf8, #c084fc, #ff7a59)"
                    : accent,
                }}
              >
                <div className="rounded-full p-[3px]" style={{ background: CARD }}>
                  {typedProfile.avatar_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={typedProfile.avatar_url}
                      alt={displayName}
                      className="block h-[84px] w-[84px] rounded-full object-cover"
                    />
                  ) : (
                    <div
                      className="flex h-[84px] w-[84px] items-center justify-center rounded-full font-sans font-bold"
                      style={{ background: hexToRgba(accent, 0.14), color: accent, fontSize: 28 }}
                    >
                      {displayName.slice(0, 2).toUpperCase()}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* exp bar — level progress */}
            <div className="mx-auto mb-4 flex max-w-[240px] items-center gap-2.5">
              <span className="shrink-0 font-mono text-[9px] uppercase tracking-widest" style={{ color: FAINT }}>
                {level.name}
              </span>
              <div className="h-1.5 flex-1 overflow-hidden rounded-full" style={{ background: LINE }}>
                <div className="h-full rounded-full" style={{ width: `${expPct}%`, background: `linear-gradient(90deg, ${accent}, #34d399)` }} />
              </div>
            </div>

            {/* Name + pro */}
            <div className="flex items-center justify-center gap-2">
              <h1 className="font-sans font-bold tracking-tight" style={{ fontSize: "clamp(22px,4vw,28px)", color: INK, lineHeight: 1.15 }}>
                {displayName}
              </h1>
              {typedProfile.is_pro && (
                <span
                  className="rounded px-1.5 py-0.5 font-mono text-[9px] uppercase tracking-widest"
                  style={{ background: hexToRgba(accent, 0.12), color: accent, border: `1px solid ${hexToRgba(accent, 0.3)}` }}
                >
                  pro
                </span>
              )}
            </div>

            {/* handle + pronouns */}
            <p className="mt-1 inline-flex items-center gap-2 font-mono text-[12px]" style={{ color: MUTED }}>
              @{typedProfile.username}
              {typedProfile.pronouns && (
                <span className="rounded-full px-1.5 py-0.5 text-[10px] tracking-wide" style={{ background: "#f1f3f5", color: MUTED }}>
                  {typedProfile.pronouns}
                </span>
              )}
            </p>

            {/* status */}
            {(typedProfile.status_emoji || typedProfile.status_text) && (
              <div
                className="mt-3 inline-flex items-center gap-2 rounded-full px-3 py-1.5"
                style={{ background: hexToRgba(accent, 0.08), border: `1px solid ${hexToRgba(accent, 0.2)}` }}
              >
                {typedProfile.status_emoji && <span className="text-[14px] leading-none">{typedProfile.status_emoji}</span>}
                {typedProfile.status_text && <span className="font-sans text-[12px]" style={{ color: MUTED }}>{typedProfile.status_text}</span>}
              </div>
            )}

            {/* bio */}
            {typedProfile.bio && (
              <p className="mx-auto mt-4 max-w-[300px] font-sans text-[14px] leading-relaxed" style={{ color: MUTED }}>
                {typedProfile.bio}
              </p>
            )}

            {/* Stats panel — inset, soft */}
            <div className="mt-6 grid grid-cols-3 rounded-2xl py-4" style={{ background: "#f7f8fa", border: `1px solid ${LINE}` }}>
              {stats.map((s, i) => {
                const inner = (
                  <>
                    <p className="font-sans font-bold tabular-nums" style={{ fontSize: "clamp(18px,3.2vw,24px)", color: INK, lineHeight: 1 }}>
                      {s.value}
                    </p>
                    <p className="mt-1.5 font-mono text-[10px] uppercase tracking-widest" style={{ color: MUTED }}>
                      {s.label}
                    </p>
                  </>
                );
                return (
                  <div key={s.label} className={i < 2 ? "border-r" : ""} style={{ borderColor: LINE }}>
                    {s.href ? <Link href={s.href} className="block transition-opacity hover:opacity-80">{inner}</Link> : inner}
                  </div>
                );
              })}
            </div>

            {/* Social icon row */}
            {socialList && (
              <div className="mt-4">
                <SocialChips socialLink={socialList} variant="icons" />
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Sticky signup bar for logged-out visitors */}
      {!currentUser && (
        <div
          className="fixed inset-x-0 bottom-0 z-50 px-4"
          style={{ paddingBottom: "max(16px, env(safe-area-inset-bottom))" }}
        >
          <div
            className="mx-auto flex max-w-md items-center justify-between gap-4 rounded-2xl px-5 py-4"
            style={{ background: "#fff", border: `1px solid ${accent}`, boxShadow: "0 8px 40px rgba(16,24,40,0.18)" }}
          >
            <div className="min-w-0">
              <p className="truncate font-sans text-sm font-semibold" style={{ color: INK }}>
                Track your own hyperfixations
              </p>
              <p className="font-mono text-[11px]" style={{ color: MUTED }}>free · 30 seconds</p>
            </div>
            <Link
              href={`/auth/signup?next=/u/${typedProfile.username}`}
              className="shrink-0 rounded-full px-5 py-2.5 font-sans text-sm font-semibold transition-opacity hover:opacity-90"
              style={{ background: accent, color: "#fff" }}
            >
              Join free →
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
