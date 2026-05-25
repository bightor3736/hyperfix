import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { LogoLockup } from "@/components/Logo";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { FollowButton, FollowButtonLoggedIn } from "@/components/FollowButton";
import { ShareProfileButton } from "@/components/ShareProfileButton";
import { resolveAccent, hexToRgba } from "@/lib/accent";
import { CategoryIcon, CATEGORY_COLOR } from "@/components/CategoryIcon";
import { TombstoneIcon } from "@/components/MilestoneIcons";
import { PinIcon } from "@/components/LandingIcons";
import { SocialChips } from "@/components/SocialChips";

const NOISE_URL =
  "url(\"data:image/svg+xml;utf8,<svg viewBox='0 0 240 240' xmlns='http://www.w3.org/2000/svg'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 0.55 0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>\")";

interface Fix {
  id: string;
  title: string;
  category: string;
  status: string;
  intensity: number;
  started_at: string;
  ended_at: string | null;
  is_public: boolean;
  banner_url?: string | null;
}

interface Profile {
  id: string;
  username: string | null;
  display_name: string | null;
  avatar_url: string | null;
  bio: string | null;
  is_public: boolean;
  pinned_fix_id: string | null;
  pinned_fix_ids: string[] | null;
  banner_url: string | null;
  is_pro: boolean | null;
  accent_color: string | null;
  social_link?: string | null;
}

function dayCount(startedAt: string, endedAt: string | null): number {
  const start = new Date(startedAt);
  const end = endedAt ? new Date(endedAt) : new Date();
  return Math.max(1, Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)));
}

function getMostObsessedCategory(fixes: Fix[]): string | null {
  if (fixes.length === 0) return null;
  const counts: Record<string, number> = {};
  for (const fix of fixes) {
    counts[fix.category] = (counts[fix.category] ?? 0) + 1;
  }
  return Object.entries(counts).sort((a, b) => b[1] - a[1])[0]?.[0] ?? null;
}

function Initials({ name, accent }: { name: string; accent: string }) {
  const parts = name.trim().split(/\s+/);
  const letters =
    parts.length >= 2
      ? (parts[0][0] ?? "") + (parts[parts.length - 1][0] ?? "")
      : (name[0] ?? "");
  return (
    <div
      className="w-20 h-20 rounded-full flex items-center justify-center text-2xl font-display font-medium"
      style={{ background: hexToRgba(accent, 0.15), color: accent, border: `2px solid ${hexToRgba(accent, 0.3)}` }}
    >
      {letters.toUpperCase()}
    </div>
  );
}

function IntensityBar({ intensity }: { intensity: number }) {
  return (
    <div className="flex items-center gap-1.5">
      <div className="flex gap-0.5">
        {Array.from({ length: 10 }).map((_, i) => (
          <div
            key={i}
            className="w-1.5 h-3 rounded-sm"
            style={{
              background: i < intensity ? "#5EEAD4" : "rgba(244,244,244,0.08)",
            }}
          />
        ))}
      </div>
      <span className="text-xs font-mono" style={{ color: "#9A9A9A" }}>
        {intensity}/10
      </span>
    </div>
  );
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
  const ogAccent = resolveAccent(typedProfile.is_pro, typedProfile.accent_color);

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
    .select("id, username, display_name, avatar_url, bio, is_public, pinned_fix_id, pinned_fix_ids, banner_url, is_pro, accent_color, social_link")
    .eq("username", username)
    .single();

  if (profileError || !profile || !profile.is_public) {
    notFound();
  }

  const typedProfile = profile as Profile;

  const { data: fixes } = await supabase
    .from("fixes")
    .select("id, title, category, status, intensity, started_at, ended_at, is_public, banner_url")
    .eq("user_id", typedProfile.id)
    .order("created_at", { ascending: false });

  const allFixes: Fix[] = (fixes ?? []) as Fix[];
  const publicFixes = allFixes.filter((f) => f.is_public);

  // Pinned fixes — Pro users can pin multiple; fall back to legacy single pin
  const pinIds =
    typedProfile.pinned_fix_ids && typedProfile.pinned_fix_ids.length > 0
      ? typedProfile.pinned_fix_ids
      : typedProfile.pinned_fix_id
        ? [typedProfile.pinned_fix_id]
        : [];
  const pinnedFixes: Fix[] = pinIds
    .map((pid) => allFixes.find((f) => f.id === pid))
    .filter((f): f is Fix => !!f && f.is_public);

  const totalDays = allFixes.reduce((acc, fix) => acc + dayCount(fix.started_at, fix.ended_at), 0);
  const mostObsessed = getMostObsessedCategory(allFixes);
  const endedPublicCount = publicFixes.filter((f) => f.ended_at !== null).length;

  const displayName = typedProfile.display_name ?? typedProfile.username ?? "Anonymous";
  const accent = resolveAccent(typedProfile.is_pro, typedProfile.accent_color);

  // Follow state and counts
  const {
    data: { user: currentUser },
  } = await supabase.auth.getUser();

  const { count: followerCount } = await supabase
    .from("follows")
    .select("id", { count: "exact", head: true })
    .eq("following_id", typedProfile.id);

  const { count: followingCount } = await supabase
    .from("follows")
    .select("id", { count: "exact", head: true })
    .eq("follower_id", typedProfile.id);

  let isFollowing = false;
  const isSelf = currentUser?.id === typedProfile.id;
  if (currentUser && !isSelf) {
    const { data: followRow } = await supabase
      .from("follows")
      .select("id")
      .eq("follower_id", currentUser.id)
      .eq("following_id", typedProfile.id)
      .maybeSingle();
    isFollowing = !!followRow;
  }

  return (
    <div className="min-h-screen relative" style={{ background: "#070708", color: "#F4F4F4" }}>
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none mix-blend-overlay"
        style={{ backgroundImage: NOISE_URL, backgroundSize: "240px 240px", opacity: 0.08 }}
      />

      <nav
        className="sticky top-0 z-40 px-6 sm:px-10 py-5 flex items-center justify-between"
        style={{
          background: "rgba(7,7,8,0.78)",
          backdropFilter: "blur(20px)",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        <Link href="/" aria-label="Hyperfix home" className="transition-transform hover:scale-[1.02]">
          <LogoLockup size="sm" />
        </Link>
        <Link
          href={currentUser ? "/dashboard" : "/auth/login"}
          className="font-sans text-sm font-semibold px-5 py-2.5 transition-all duration-200 hover:opacity-95 hover:-translate-y-px"
          style={{
            background: "#FFFFFF",
            color: "#0A0A0A",
            borderRadius: 999,
            boxShadow: "0 4px 16px rgba(94,234,212,0.18)",
          }}
        >
          {currentUser ? "My fixes" : "Log in"}
        </Link>
      </nav>

      <main id="main-content" className="relative max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-10">
        {/* Banner — full width, vvault-style with avatar overlap */}
        <div
          className="relative overflow-hidden rounded-3xl anim-fadeUp"
          style={{
            height: "clamp(220px, 36vw, 320px)",
            ...(typedProfile.banner_url
              ? {
                  backgroundImage: `url(${typedProfile.banner_url})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }
              : {
                  background: `radial-gradient(ellipse 90% 100% at 50% 110%, ${accent} 0%, ${hexToRgba(accent, 0.55)} 18%, ${hexToRgba(accent, 0.16)} 38%, ${hexToRgba(accent, 0.04)} 58%, #070708 80%)`,
                }),
            border: "1px solid rgba(255,255,255,0.06)",
          }}
        >
          {/* Grain (hyperfix identity) */}
          <div
            aria-hidden
            className="absolute inset-0 pointer-events-none mix-blend-overlay"
            style={{ backgroundImage: NOISE_URL, backgroundSize: "200px 200px", opacity: 0.45 }}
          />
          {/* Dark scrim — only on bottom 50% so the photo stays visible */}
          <div
            aria-hidden
            className="absolute inset-0 pointer-events-none"
            style={{
              background: "linear-gradient(180deg, transparent 0%, transparent 35%, rgba(7,7,8,0.45) 75%, rgba(7,7,8,0.85) 100%)",
            }}
          />

          {/* Name + handle overlay on banner bottom */}
          <div className="absolute inset-x-0 bottom-0 px-5 sm:px-8 pb-5 sm:pb-7 flex items-end gap-4 sm:gap-5">
            {/* Avatar — overlaps banner bottom-left */}
            <div className="relative shrink-0">
              {typedProfile.is_pro && (
                <div
                  className="absolute -inset-2 rounded-full pointer-events-none"
                  style={{
                    background: `radial-gradient(circle, ${hexToRgba(accent, 0.5)} 0%, transparent 70%)`,
                    filter: "blur(8px)",
                  }}
                />
              )}
              {typedProfile.avatar_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={typedProfile.avatar_url}
                  alt={displayName}
                  className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-full object-cover"
                  style={{
                    border: `3px solid #070708`,
                    boxShadow: `0 4px 16px rgba(0,0,0,0.6)`,
                  }}
                />
              ) : (
                <div
                  className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-full flex items-center justify-center font-display font-semibold"
                  style={{
                    background: `${accent}22`,
                    border: `3px solid #070708`,
                    boxShadow: `0 4px 16px rgba(0,0,0,0.6)`,
                    color: accent,
                    fontSize: 24,
                  }}
                >
                  {displayName.slice(0, 2).toUpperCase()}
                </div>
              )}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h1
                  className="font-display"
                  style={{
                    fontSize: "clamp(24px, 5vw, 36px)",
                    fontWeight: 600,
                    color: "#F4F4F4",
                    letterSpacing: "-0.02em",
                    lineHeight: 1,
                    textShadow: "0 2px 16px rgba(0,0,0,0.5)",
                  }}
                >
                  {displayName}
                </h1>
                {typedProfile.is_pro && (
                  <span
                    className="font-mono text-[9px] rounded px-1.5 py-0.5 shrink-0"
                    style={{
                      background: hexToRgba(accent, 0.22),
                      color: accent,
                      border: `1px solid ${hexToRgba(accent, 0.4)}`,
                      boxShadow: `0 0 12px ${hexToRgba(accent, 0.25)}`,
                    }}
                  >
                    PRO
                  </span>
                )}
              </div>
              <p
                className="font-mono mt-1"
                style={{
                  fontSize: 13,
                  color: typedProfile.is_pro ? accent : "rgba(94,234,212,0.7)",
                  textShadow: "0 1px 8px rgba(0,0,0,0.5)",
                }}
              >
                @{typedProfile.username}
              </p>
            </div>
          </div>
        </div>

        {/* Action row + social chips */}
        <div className="flex items-start justify-between gap-4 mt-5 mb-5 flex-wrap">
          <div className="flex-1 min-w-0 flex flex-col gap-3">
            {typedProfile.social_link && (
              <SocialChips socialLink={typedProfile.social_link} />
            )}
            <p className="font-mono text-xs" style={{ color: "rgba(244,244,244,0.45)" }}>
              <Link
                href={`/u/${typedProfile.username}/followers`}
                className="transition-colors hover:text-[#5EEAD4]"
              >
                <span style={{ color: "rgba(244,244,244,0.7)" }}>{followerCount ?? 0}</span> followers
              </Link>
              {" · "}
              <Link
                href={`/u/${typedProfile.username}/following`}
                className="transition-colors hover:text-[#5EEAD4]"
              >
                <span style={{ color: "rgba(244,244,244,0.7)" }}>{followingCount ?? 0}</span> following
              </Link>
            </p>
          </div>
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
            {isSelf && (
              <ShareProfileButton
                username={typedProfile.username ?? ""}
                displayName={displayName}
              />
            )}
          </div>
        </div>

        {typedProfile.bio && (
          <p className="text-sm leading-relaxed mb-8 max-w-2xl" style={{ color: "rgba(255,255,255,0.7)" }}>
            {typedProfile.bio}
          </p>
        )}

        {/* Pinned fixes */}
        {pinnedFixes.length > 0 && (
          <div className="mb-8">
            <div className="flex items-center gap-1.5 mb-3" style={{ color: "rgba(244,244,244,0.35)" }}>
              <PinIcon size={11} />
              <p className="font-mono text-[10px] uppercase tracking-widest">
                currently obsessed with
              </p>
            </div>
            <div className="flex flex-col gap-3">
              {pinnedFixes.map((pf) => (
                <Link
                  key={pf.id}
                  href={`/fix/${pf.id}`}
                  className="group flex items-center gap-4 rounded-2xl p-5 transition-all"
                  style={{ background: "#111113", border: `1px solid ${hexToRgba(accent, 0.2)}` }}
                >
                  <div className="flex-1 min-w-0">
                    <h3
                      className="font-display font-medium text-lg leading-snug transition-colors mb-1"
                      style={{ color: "#F4F4F4" }}
                    >
                      {pf.title}
                    </h3>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-mono text-[10px] uppercase tracking-widest rounded-full px-2.5 py-1"
                        style={{ background: hexToRgba(accent, 0.1), border: `1px solid ${hexToRgba(accent, 0.25)}`, color: accent }}>
                        {pf.category}
                      </span>
                      <span className="font-mono text-xs" style={{ color: "#9A9A9A" }}>
                        Day {dayCount(pf.started_at, pf.ended_at)}
                      </span>
                    </div>
                  </div>
                  <div className="shrink-0 text-2xl font-display font-black tabular-nums" style={{ color: accent }}>
                    {dayCount(pf.started_at, pf.ended_at)}
                    <span className="text-xs font-mono font-normal ml-1" style={{ color: hexToRgba(accent, 0.5) }}>d</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Stats */}
        <div
          className="grid grid-cols-3 gap-px rounded-2xl overflow-hidden mb-10"
          style={{ background: "rgba(244,244,244,0.07)" }}
        >
          {[
            { label: "hyperfixations", value: allFixes.length },
            { label: "total days", value: totalDays },
            { label: "top category", value: mostObsessed ?? "—" },
          ].map((stat) => (
            <div
              key={stat.label}
              className="px-3 py-4 sm:px-6 sm:py-5 text-center"
              style={{ background: "#111113" }}
            >
              <div className="text-2xl sm:text-3xl font-display font-medium mb-1 truncate">{stat.value}</div>
              <div className="text-[9px] sm:text-xs font-mono uppercase tracking-widest" style={{ color: "#9A9A9A" }}>
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        {/* Graveyard link */}
        {endedPublicCount > 0 && (
          <Link
            href={`/u/${typedProfile.username}/graveyard`}
            className="group flex items-center justify-between gap-4 rounded-3xl p-5 mb-8 transition-all hover:border-[rgba(94,234,212,0.3)]"
            style={{ background: "#111113", border: "1px solid rgba(244,244,244,0.07)" }}
          >
            <div className="flex items-center gap-3">
              <div
                className="flex items-center justify-center rounded-xl shrink-0"
                style={{
                  width: 40,
                  height: 40,
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  color: "rgba(255,255,255,0.5)",
                }}
              >
                <TombstoneIcon size={20} />
              </div>
              <div>
                <p className="font-display font-medium text-base leading-snug group-hover:text-[#5EEAD4] transition-colors">
                  The graveyard
                </p>
                <p className="font-sans text-xs mt-0.5" style={{ color: "rgba(244,244,244,0.4)" }}>
                  {endedPublicCount} ended {endedPublicCount === 1 ? "obsession" : "obsessions"} — mourned, archived, preserved
                </p>
              </div>
            </div>
            <span className="font-sans text-sm shrink-0" style={{ color: "#5EEAD4" }}>View →</span>
          </Link>
        )}

        {/* Public fixes — vvault-style visual cards */}
        <div>
          <div className="flex items-baseline justify-between mb-5">
            <h2 className="text-sm font-mono uppercase tracking-widest" style={{ color: "rgba(244,244,244,0.6)" }}>
              Active fixations
            </h2>
            {publicFixes.filter((f) => !f.ended_at).length > 4 && (
              <span className="font-mono text-xs" style={{ color: "rgba(244,244,244,0.35)" }}>
                {publicFixes.filter((f) => !f.ended_at).length} total
              </span>
            )}
          </div>

          {publicFixes.filter((f) => !f.ended_at).length === 0 ? (
            <div
              className="rounded-3xl p-10 text-center"
              style={{ background: "#0F1011", border: "1px solid rgba(244,244,244,0.06)" }}
            >
              <p className="font-display text-lg mb-2" style={{ color: "rgba(244,244,244,0.5)" }}>
                {isSelf ? "Nothing public yet." : "No active fixations yet."}
              </p>
              <p className="font-sans text-sm" style={{ color: "rgba(244,244,244,0.3)" }}>
                {isSelf
                  ? "Turn a fix public to show it here."
                  : "This person keeps their obsessions private."}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3">
              {publicFixes.filter((f) => !f.ended_at).map((fix) => {
                const days = dayCount(fix.started_at, fix.ended_at);
                const catColor = CATEGORY_COLOR[fix.category.toLowerCase()] || "#5EEAD4";
                return (
                  <Link
                    key={fix.id}
                    href={`/fix/${fix.id}`}
                    className="group block rounded-3xl overflow-hidden transition-all duration-200 hover:-translate-y-1"
                    style={{
                      background: "#0F1011",
                      border: "1px solid rgba(244,244,244,0.06)",
                    }}
                  >
                    {/* Cover area — banner_url or category gradient */}
                    <div
                      className="relative w-full aspect-square"
                      style={{
                        backgroundImage: fix.banner_url ? `url(${fix.banner_url})` : undefined,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                        background: fix.banner_url
                          ? undefined
                          : `linear-gradient(135deg, ${catColor}40 0%, ${catColor}10 60%, #0F1011 100%)`,
                      }}
                    >
                      <div
                        aria-hidden
                        className="absolute inset-0 pointer-events-none"
                        style={{ background: "linear-gradient(180deg, transparent 0%, transparent 50%, rgba(15,16,17,0.92) 100%)" }}
                      />
                      {/* Day count badge top-left */}
                      <div
                        className="absolute top-3 left-3 inline-flex items-baseline gap-0.5 rounded-md px-2 py-1"
                        style={{
                          background: "rgba(15,16,17,0.7)",
                          border: "1px solid rgba(244,244,244,0.08)",
                          backdropFilter: "blur(8px)",
                        }}
                      >
                        <span className="font-display tabular-nums" style={{ fontSize: 18, fontWeight: 700, color: "#F4F4F4", lineHeight: 1, letterSpacing: "-0.02em" }}>
                          {days}
                        </span>
                        <span className="font-mono text-[9px] uppercase tracking-widest" style={{ color: "rgba(244,244,244,0.55)" }}>
                          d
                        </span>
                      </div>
                      {/* Category chip bottom-left */}
                      <div className="absolute bottom-3 left-3 right-3">
                        <span
                          className="inline-flex items-center gap-1 font-mono text-[9px] uppercase tracking-widest rounded-full px-2 py-0.5"
                          style={{
                            background: `${catColor}22`,
                            border: `1px solid ${catColor}44`,
                            color: catColor,
                            backdropFilter: "blur(8px)",
                          }}
                        >
                          <CategoryIcon category={fix.category} size={9} />
                          {fix.category}
                        </span>
                      </div>
                    </div>
                    {/* Title */}
                    <div className="p-4">
                      <h3
                        className="font-display font-medium leading-snug group-hover:text-[#5EEAD4] transition-colors"
                        style={{
                          fontSize: 14,
                          color: "#F4F4F4",
                          display: "-webkit-box",
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: "vertical",
                          overflow: "hidden",
                          letterSpacing: "-0.01em",
                        }}
                      >
                        {fix.title}
                      </h3>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
