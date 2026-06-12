import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { FollowButton, FollowButtonLoggedIn } from "@/components/FollowButton";
import { ShareProfileButton } from "@/components/ShareProfileButton";
import { resolveAccent, hexToRgba, isValidAccent, DEFAULT_ACCENT } from "@/lib/accent";
import { levelForPoints } from "@/lib/gamification/levels";
import { SocialChips } from "@/components/SocialChips";

interface Fix {
  id: string;
  name: string;
  description: string | null;
  intensity: number;
  status: "active" | "fading" | "archived";
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

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const days = Math.floor(diff / 86400000);
  if (days === 0) return "today";
  if (days === 1) return "1 day ago";
  if (days < 30) return `${days} days ago`;
  const months = Math.floor(days / 30);
  if (months === 1) return "1 month ago";
  if (months < 12) return `${months} months ago`;
  return `${Math.floor(months / 12)}y ago`;
}

// Deterministic pastel gradient per category/name
function cardAccent(name: string): { from: string; to: string } {
  const hash = name.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0);
  const palettes = [
    { from: "#6957E8", to: "#9B8AFB" },
    { from: "#FF6B6B", to: "#FF9F9F" },
    { from: "#30D158", to: "#7BE0A2" },
    { from: "#FF9F0A", to: "#FFCC70" },
    { from: "#BF5AF2", to: "#D88BF5" },
    { from: "#5AC8FA", to: "#9ADEFF" },
    { from: "#F97E6D", to: "#FFB4A9" },
    { from: "#34C759", to: "#80D98E" },
  ];
  return palettes[hash % palettes.length];
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
      images: [{ url: `https://hyperfix.app/api/og/profile/${username}`, width: 1200, height: 630 }],
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

  if (profileError || !profile) notFound();

  const typedProfile = profile as Profile;

  const { data: { user: currentUser } } = await supabase.auth.getUser();
  const isSelf = currentUser?.id === typedProfile.id;

  if (!typedProfile.is_public && !isSelf) notFound();

  const { data: fixes } = await supabase
    .from("fixes")
    .select("id, name, description, intensity, status, started_at, ended_at, is_public")
    .eq("user_id", typedProfile.id)
    .order("created_at", { ascending: false });

  const allFixes: Fix[] = (fixes ?? []) as Fix[];
  const visibleFixes = isSelf ? allFixes : allFixes.filter((f) => f.is_public);
  const totalDays = visibleFixes.reduce((acc, f) => acc + dayCount(f.started_at, f.ended_at), 0);
  const activeFixes = visibleFixes.filter((f) => f.status === "active");

  const displayName = typedProfile.display_name ?? typedProfile.username ?? "Anonymous";
  const accent = isValidAccent(typedProfile.accent_color) ? (typedProfile.accent_color as string) : DEFAULT_ACCENT;

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

  // Build accent hex for inline use
  const accentHex = accent ?? "#6957E8";

  return (
    <div
      className="min-h-screen"
      style={{
        background: "#000000",
        color: "#FAFAFA",
        fontFamily: "var(--font-grotesk), system-ui, sans-serif",
      }}
    >
      {/* Accent glow behind everything */}
      <div
        aria-hidden
        style={{
          position: "fixed",
          inset: 0,
          background: `radial-gradient(ellipse 70% 40% at 50% 0%, ${hexToRgba(accentHex, 0.18)} 0%, transparent 70%)`,
          pointerEvents: "none",
          zIndex: 0,
        }}
      />

      {/* ── NAV ── */}
      <nav
        className="relative z-10 flex items-center justify-between px-5 py-3 sm:px-8"
        style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}
      >
        <Link
          href="/"
          className="font-display text-[16px] font-semibold tracking-tight transition-opacity hover:opacity-70"
          style={{ color: "#FAFAFA" }}
        >
          hyperfix
        </Link>
        <Link
          href={currentUser ? "/dashboard" : "/auth/login"}
          className="rounded-full px-4 py-1.5 text-[13px] font-medium transition-opacity hover:opacity-80"
          style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.10)", color: "rgba(255,255,255,0.6)" }}
        >
          {currentUser ? "my dashboard" : "log in"}
        </Link>
      </nav>

      <main id="main-content" className="relative z-10 mx-auto max-w-[900px] px-4 pb-32 sm:px-6">

        {/* ── PROFILE HEADER ── */}
        <div className="pt-10 sm:pt-14">

          {/* Banner */}
          {typedProfile.banner_url && (
            <div
              className="w-full rounded-[18px] overflow-hidden mb-8"
              style={{ height: 180 }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={typedProfile.banner_url}
                alt=""
                className="w-full h-full object-cover"
              />
            </div>
          )}

          {/* Avatar + info row */}
          <div className="flex flex-col sm:flex-row sm:items-end gap-5">

            {/* Avatar */}
            <div className="relative shrink-0">
              <div
                className="rounded-[22px] p-[2.5px]"
                style={{
                  background: typedProfile.is_pro
                    ? "conic-gradient(from 210deg, #ff7a59, #ffc857, #34d399, #5eead4, #818cf8, #c084fc, #ff7a59)"
                    : `linear-gradient(135deg, ${accentHex}, ${hexToRgba(accentHex, 0.4)})`,
                  boxShadow: `0 0 0 1px ${hexToRgba(accentHex, 0.2)}, 0 8px 24px ${hexToRgba(accentHex, 0.3)}`,
                }}
              >
                {typedProfile.avatar_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={typedProfile.avatar_url}
                    alt={displayName}
                    className="block h-[88px] w-[88px] rounded-[20px] object-cover"
                  />
                ) : (
                  <div
                    className="flex h-[88px] w-[88px] items-center justify-center rounded-[20px] font-semibold text-[28px]"
                    style={{ background: hexToRgba(accentHex, 0.15), color: accentHex }}
                  >
                    {displayName.slice(0, 2).toUpperCase()}
                  </div>
                )}
              </div>
              {/* Online dot for active fixers */}
              {activeFixes.length > 0 && (
                <div
                  className="absolute -bottom-1 -right-1 h-4 w-4 rounded-full"
                  style={{
                    background: "#30D158",
                    border: "2px solid #000000",
                    boxShadow: "0 0 6px rgba(48,209,88,0.6)",
                  }}
                />
              )}
            </div>

            {/* Name + meta */}
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2.5">
                <h1
                  className="font-display font-bold tracking-tight leading-tight"
                  style={{ fontSize: "clamp(22px,4vw,30px)", color: "#FAFAFA" }}
                >
                  {displayName}
                </h1>
                {typedProfile.is_pro && (
                  <span
                    className="rounded-md px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-[0.06em]"
                    style={{ background: hexToRgba(accentHex, 0.15), color: accentHex, border: `1px solid ${hexToRgba(accentHex, 0.3)}` }}
                  >
                    Pro
                  </span>
                )}
              </div>

              <div className="mt-1 flex flex-wrap items-center gap-2">
                <span className="text-[13px]" style={{ color: "rgba(255,255,255,0.4)" }}>
                  @{typedProfile.username}
                </span>
                {typedProfile.pronouns && (
                  <span
                    className="rounded-full px-2 py-0.5 text-[11px]"
                    style={{ background: "rgba(255,255,255,0.07)", color: "rgba(255,255,255,0.4)" }}
                  >
                    {typedProfile.pronouns}
                  </span>
                )}
                {(typedProfile.status_emoji || typedProfile.status_text) && (
                  <span
                    className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[12px]"
                    style={{ background: "rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.55)", border: "1px solid rgba(255,255,255,0.08)" }}
                  >
                    {typedProfile.status_emoji && <span>{typedProfile.status_emoji}</span>}
                    {typedProfile.status_text && <span>{typedProfile.status_text}</span>}
                  </span>
                )}
              </div>

              {typedProfile.bio && (
                <p
                  className="mt-2 max-w-[500px] text-[14px] leading-relaxed"
                  style={{ color: "rgba(255,255,255,0.55)" }}
                >
                  {typedProfile.bio}
                </p>
              )}
            </div>

            {/* Action buttons */}
            <div className="flex items-center gap-2 shrink-0">
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
              {isSelf && <ShareProfileButton username={typedProfile.username ?? ""} displayName={displayName} />}
              {isSelf && (
                <Link
                  href="/dashboard/settings"
                  className="rounded-full px-4 py-2 text-[13px] font-medium transition-opacity hover:opacity-80"
                  style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.10)", color: "rgba(255,255,255,0.6)" }}
                >
                  Edit
                </Link>
              )}
            </div>
          </div>

          {/* ── STATS ROW ── */}
          <div
            className="mt-8 flex items-stretch rounded-[14px] overflow-hidden"
            style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}
          >
            {[
              { label: "fixations", value: visibleFixes.length, href: undefined as string | undefined },
              { label: "active",    value: activeFixes.length,  href: undefined },
              { label: "total days", value: totalDays,          href: undefined },
              { label: "followers", value: followerCount ?? 0,  href: `/u/${typedProfile.username}/followers` },
            ].map((s, i) => {
              const inner = (
                <div className="flex flex-col items-center gap-0.5 px-5 py-3.5">
                  <span
                    className="tabular-nums font-display font-semibold leading-none"
                    style={{ fontSize: "clamp(18px,3vw,22px)", color: "#FAFAFA" }}
                  >
                    {s.value}
                  </span>
                  <span className="text-[11px] font-medium" style={{ color: "rgba(255,255,255,0.35)" }}>
                    {s.label}
                  </span>
                </div>
              );
              return (
                <div
                  key={s.label}
                  className="flex-1 text-center"
                  style={{ borderLeft: i > 0 ? "1px solid rgba(255,255,255,0.07)" : "none" }}
                >
                  {s.href
                    ? <Link href={s.href} className="block transition-opacity hover:opacity-70">{inner}</Link>
                    : inner}
                </div>
              );
            })}
          </div>

          {/* XP + level bar */}
          <div className="mt-4 flex items-center gap-3">
            <span className="text-[11px] font-medium shrink-0" style={{ color: "rgba(255,255,255,0.35)" }}>
              {level.name}
            </span>
            <div className="h-1 flex-1 overflow-hidden rounded-full" style={{ background: "rgba(255,255,255,0.08)" }}>
              <div
                className="h-full rounded-full"
                style={{ width: `${expPct}%`, background: `linear-gradient(90deg, ${accentHex}, ${hexToRgba(accentHex, 0.6)})` }}
              />
            </div>
            <span className="text-[11px] tabular-nums shrink-0" style={{ color: "rgba(255,255,255,0.35)" }}>
              {totalPoints.toLocaleString()} XP
            </span>
          </div>

          {/* Social links */}
          {socialList && (
            <div className="mt-5">
              <SocialChips socialLink={socialList} variant="icons" dark />
            </div>
          )}
        </div>

        {/* ── FIXATION GRID ── */}
        {visibleFixes.length > 0 && (
          <section className="mt-12">
            <div className="mb-4 flex items-center justify-between">
              <h2
                className="text-[13px] font-semibold uppercase tracking-[0.06em]"
                style={{ color: "rgba(255,255,255,0.3)" }}
              >
                {activeFixes.length > 0 ? "Currently into" : "Fixations"}
              </h2>
              <span className="text-[12px]" style={{ color: "rgba(255,255,255,0.2)" }}>
                {visibleFixes.length} total
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {visibleFixes.map((fix) => {
                const days = dayCount(fix.started_at, fix.ended_at);
                const { from, to } = cardAccent(fix.name);
                const pct = (fix.intensity / 5) * 100;
                const isActive = fix.status === "active";

                return (
                  <div
                    key={fix.id}
                    className="group relative overflow-hidden rounded-[16px] transition-transform duration-200 hover:-translate-y-0.5"
                    style={{
                      background: "rgba(255,255,255,0.04)",
                      border: "1px solid rgba(255,255,255,0.07)",
                      cursor: "default",
                    }}
                  >
                    {/* Gradient accent strip */}
                    <div
                      style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        right: 0,
                        height: 3,
                        background: `linear-gradient(90deg, ${from}, ${to})`,
                        opacity: isActive ? 1 : 0.4,
                      }}
                    />

                    {/* Hover glow */}
                    <div
                      className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                      style={{ background: `radial-gradient(ellipse 80% 60% at 50% 0%, ${hexToRgba(from, 0.08)} 0%, transparent 70%)` }}
                    />

                    <div className="relative p-5">
                      {/* Header */}
                      <div className="flex items-start justify-between gap-3 mb-3">
                        <h3
                          className="font-display font-semibold leading-tight flex-1 min-w-0"
                          style={{ fontSize: "clamp(14px,2vw,16px)", color: "#FAFAFA", lineHeight: 1.3 }}
                        >
                          {fix.name}
                        </h3>
                        <span
                          className="shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold"
                          style={{
                            background: isActive ? hexToRgba(from, 0.15) : "rgba(255,255,255,0.06)",
                            color: isActive ? from : "rgba(255,255,255,0.3)",
                            border: `1px solid ${isActive ? hexToRgba(from, 0.25) : "transparent"}`,
                          }}
                        >
                          {isActive ? "active" : fix.status}
                        </span>
                      </div>

                      {/* Description */}
                      {fix.description && (
                        <p
                          className="mb-4 text-[12px] leading-relaxed line-clamp-2"
                          style={{ color: "rgba(255,255,255,0.4)" }}
                        >
                          {fix.description}
                        </p>
                      )}

                      {/* Stats row */}
                      <div className="flex items-end justify-between">
                        <div>
                          <div className="flex items-baseline gap-1">
                            <span
                              className="font-display font-bold tabular-nums leading-none"
                              style={{ fontSize: 32, color: "#FAFAFA", letterSpacing: "-0.04em" }}
                            >
                              {days}
                            </span>
                            <span className="text-[12px]" style={{ color: "rgba(255,255,255,0.35)" }}>
                              days
                            </span>
                          </div>
                          <p className="mt-0.5 text-[11px]" style={{ color: "rgba(255,255,255,0.25)" }}>
                            {timeAgo(fix.started_at)}
                          </p>
                        </div>

                        {/* Intensity */}
                        <div className="flex flex-col items-end gap-1.5">
                          <span className="text-[10px]" style={{ color: "rgba(255,255,255,0.3)" }}>
                            intensity
                          </span>
                          <div className="flex items-center gap-1">
                            {[1, 2, 3, 4, 5].map((v) => (
                              <div
                                key={v}
                                className="rounded-[3px]"
                                style={{
                                  width: 6,
                                  height: v <= fix.intensity ? 14 : 8,
                                  background: v <= fix.intensity
                                    ? `linear-gradient(180deg, ${from}, ${to})`
                                    : "rgba(255,255,255,0.08)",
                                  transition: "height 0.2s ease",
                                }}
                              />
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* Empty state */}
        {visibleFixes.length === 0 && (
          <div className="mt-16 flex flex-col items-center text-center">
            <div
              className="mb-4 flex h-16 w-16 items-center justify-center rounded-[18px] text-3xl"
              style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}
            >
              🎯
            </div>
            <p className="text-[14px] font-medium" style={{ color: "rgba(255,255,255,0.3)" }}>
              No fixations shared yet
            </p>
          </div>
        )}
      </main>

      {/* ── STICKY SIGNUP BAR for non-users ── */}
      {!currentUser && (
        <div
          className="fixed inset-x-0 bottom-0 z-50 px-4"
          style={{ paddingBottom: "max(16px, env(safe-area-inset-bottom))" }}
        >
          <div
            className="mx-auto flex max-w-md items-center justify-between gap-4 rounded-[16px] px-5 py-3.5"
            style={{
              background: "rgba(0,0,0,0.92)",
              border: "1px solid rgba(255,255,255,0.10)",
              backdropFilter: "blur(20px)",
              boxShadow: "0 8px 40px rgba(0,0,0,0.6)",
            }}
          >
            <div className="min-w-0">
              <p className="truncate text-[14px] font-semibold" style={{ color: "#FAFAFA" }}>
                Track your hyperfixations
              </p>
              <p className="text-[12px]" style={{ color: "rgba(255,255,255,0.4)" }}>
                free · 30 seconds
              </p>
            </div>
            <Link
              href={`/auth/signup?next=/u/${typedProfile.username}`}
              className="shrink-0 rounded-full px-5 py-2.5 text-[13px] font-semibold transition-opacity hover:opacity-90"
              style={{ background: accentHex, color: "#fff" }}
            >
              Join free →
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
