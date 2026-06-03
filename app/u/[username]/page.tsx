import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { LogoLockup } from "@/components/Logo";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { FollowButton, FollowButtonLoggedIn } from "@/components/FollowButton";
import { MessageButton } from "@/components/MessageButton";
import { ShareProfileButton } from "@/components/ShareProfileButton";
import { resolveAccent, hexToRgba, isValidAccent, DEFAULT_ACCENT } from "@/lib/accent";
import { getProfileTheme } from "@/lib/profile-themes";
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
  pronouns?: string | null;
  status_emoji?: string | null;
  status_text?: string | null;
  socials?: Record<string, string> | null;
  profile_theme?: string | null;
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
              background: i < intensity ? "var(--accent)" : "var(--line)",
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
    .select("id, username, display_name, avatar_url, bio, is_public, pinned_fix_id, pinned_fix_ids, banner_url, is_pro, accent_color, social_link, pronouns, status_emoji, status_text, socials, profile_theme")
    .eq("username", username)
    .single();

  if (profileError || !profile) {
    notFound();
  }

  const typedProfile = profile as Profile;

  // Check auth before deciding on visibility
  const {
    data: { user: currentUser },
  } = await supabase.auth.getUser();

  const isSelf = currentUser?.id === typedProfile.id;

  // Non-public profiles are only visible to their owner
  if (!typedProfile.is_public && !isSelf) {
    notFound();
  }

  const { data: fixes } = await supabase
    .from("fixes")
    .select("id, title, category, status, intensity, started_at, ended_at, is_public, banner_url")
    .eq("user_id", typedProfile.id)
    .order("created_at", { ascending: false });

  const allFixes: Fix[] = (fixes ?? []) as Fix[];
  // Owner sees all their own fixes; visitors only see public ones
  const publicFixes = isSelf ? allFixes : allFixes.filter((f) => f.is_public);

  // Pinned fixes — Pro users can pin multiple; fall back to legacy single pin
  const pinIds =
    typedProfile.pinned_fix_ids && typedProfile.pinned_fix_ids.length > 0
      ? typedProfile.pinned_fix_ids
      : typedProfile.pinned_fix_id
        ? [typedProfile.pinned_fix_id]
        : [];
  const pinnedFixes: Fix[] = pinIds
    .map((pid) => allFixes.find((f) => f.id === pid))
    .filter((f): f is Fix => !!f && (isSelf || f.is_public));

  const totalDays = allFixes.reduce((acc, fix) => acc + dayCount(fix.started_at, fix.ended_at), 0);
  const mostObsessed = getMostObsessedCategory(allFixes);
  const endedPublicCount = publicFixes.filter((f) => f.ended_at !== null).length;

  const displayName = typedProfile.display_name ?? typedProfile.username ?? "Anonymous";
  // Accent is now available to everyone (Pro just unlocks premium themes/effects).
  const accent = isValidAccent(typedProfile.accent_color) ? typedProfile.accent_color : DEFAULT_ACCENT;
  const theme = getProfileTheme(typedProfile.profile_theme);
  // Pro gate on premium themes — fall back to Aurora if a free user has one set.
  const themeBg = (theme.pro && !typedProfile.is_pro ? getProfileTheme("aurora") : theme).background(accent);
  // Merge structured socials with the legacy comma-separated social_link.
  const socialList = [
    typedProfile.social_link ?? "",
    ...Object.values(typedProfile.socials ?? {}).filter(Boolean),
  ].filter(Boolean).join(",");

  const { count: followerCount } = await supabase
    .from("follows")
    .select("id", { count: "exact", head: true })
    .eq("following_id", typedProfile.id);

  const { count: followingCount } = await supabase
    .from("follows")
    .select("id", { count: "exact", head: true })
    .eq("follower_id", typedProfile.id);

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

  return (
    <div className="min-h-screen relative" style={{ background: themeBg, color: "var(--ink)" }}>
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none mix-blend-overlay"
        style={{ backgroundImage: NOISE_URL, backgroundSize: "240px 240px", opacity: 0.08 }}
      />

      {/* Quiet sticky nav */}
      <nav
        className="sticky top-0 z-40 px-5 sm:px-8 py-4 flex items-center justify-between"
        style={{
          background: "rgba(7,7,8,0.78)",
          backdropFilter: "blur(20px)",
          borderBottom: "1px solid var(--line)",
        }}
      >
        <Link href="/" aria-label="Hyperfix home" className="transition-transform hover:scale-[1.02]">
          <LogoLockup size="sm" />
        </Link>
        <Link
          href={currentUser ? "/dashboard" : "/auth/login"}
          className="font-mono text-[11px] uppercase tracking-widest px-4 py-2 rounded-full transition-all hover:opacity-80"
          style={{
            background: "var(--line)",
            border: "1px solid var(--line)",
            color: "var(--ink-muted)",
          }}
        >
          {currentUser ? "my fixes" : "log in"}
        </Link>
      </nav>

      <main id="main-content" className="relative max-w-2xl mx-auto px-5 sm:px-8 pt-10 sm:pt-16 pb-20">
        {/* Optional banner — thin aesthetic strip if user set one */}
        {typedProfile.banner_url && (
          <div
            className="relative overflow-hidden rounded-2xl mb-8 anim-fadeUp"
            style={{
              height: "clamp(110px, 18vw, 160px)",
              backgroundImage: `url(${typedProfile.banner_url})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          >
            <div
              aria-hidden
              className="absolute inset-0 pointer-events-none mix-blend-overlay"
              style={{ backgroundImage: NOISE_URL, backgroundSize: "200px 200px", opacity: 0.4 }}
            />
          </div>
        )}

        {/* Header — avatar + name + handle, quiet and centered */}
        <header className="anim-fadeUp flex flex-col items-center text-center mb-8">
          <div className="relative mb-5">
            {typedProfile.is_pro && (
              <div
                aria-hidden
                className="absolute -inset-3 rounded-full pointer-events-none"
                style={{
                  background: `radial-gradient(circle, ${hexToRgba(accent, 0.45)} 0%, transparent 70%)`,
                  filter: "blur(10px)",
                }}
              />
            )}
            {typedProfile.avatar_url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={typedProfile.avatar_url}
                alt={displayName}
                className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-full object-cover"
                style={{ border: "1px solid var(--line)" }}
              />
            ) : (
              <div
                className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-full flex items-center justify-center font-display font-semibold"
                style={{
                  background: hexToRgba(accent, 0.14),
                  border: "1px solid var(--line)",
                  color: accent,
                  fontSize: 28,
                }}
              >
                {displayName.slice(0, 2).toUpperCase()}
              </div>
            )}
          </div>

          <div className="flex items-center gap-2 mb-1.5">
            <h1
              className="font-display"
              style={{
                fontSize: "clamp(28px, 4.8vw, 40px)",
                fontWeight: 600,
                color: "var(--ink)",
                letterSpacing: "-0.025em",
                lineHeight: 1,
              }}
            >
              {displayName}
            </h1>
            {typedProfile.is_pro && (
              <span
                className="font-mono text-[9px] uppercase tracking-widest rounded px-1.5 py-0.5"
                style={{
                  background: hexToRgba(accent, 0.14),
                  color: accent,
                  border: `1px solid ${hexToRgba(accent, 0.3)}`,
                }}
              >
                pro
              </span>
            )}
          </div>

          <p
            className="font-mono text-[12px] mb-4 inline-flex items-center gap-2"
            style={{ color: "var(--ink-muted)" }}
          >
            @{typedProfile.username}
            {typedProfile.pronouns && (
              <span
                className="rounded-full px-1.5 py-0.5 text-[10px] tracking-wide"
                style={{ background: "var(--line)", color: "var(--ink-muted)" }}
              >
                {typedProfile.pronouns}
              </span>
            )}
          </p>

          {(typedProfile.status_emoji || typedProfile.status_text) && (
            <div
              className="inline-flex items-center gap-2 rounded-full px-3 py-1.5 mb-4 anim-fadeUp"
              style={{ background: hexToRgba(accent, 0.10), border: `1px solid ${hexToRgba(accent, 0.22)}` }}
            >
              {typedProfile.status_emoji && <span className="text-[14px] leading-none">{typedProfile.status_emoji}</span>}
              {typedProfile.status_text && (
                <span className="font-sans text-[12px]" style={{ color: "var(--ink-muted)" }}>
                  {typedProfile.status_text}
                </span>
              )}
            </div>
          )}

          {typedProfile.bio && (
            <p
              className="font-sans text-[15px] leading-relaxed max-w-md mb-5"
              style={{ color: "var(--ink-muted)" }}
            >
              {typedProfile.bio}
            </p>
          )}

          {socialList && (
            <div className="mb-5">
              <SocialChips socialLink={socialList} />
            </div>
          )}

          {/* Followers · Following */}
          <p className="font-mono text-[11px] mb-5" style={{ color: "var(--ink-muted)" }}>
            <Link
              href={`/u/${typedProfile.username}/followers`}
              className="transition-colors hover:text-[var(--accent)]"
            >
              <span style={{ color: "var(--ink)" }}>{followerCount ?? 0}</span> followers
            </Link>
            <span className="mx-2" style={{ color: "var(--ink-faint)" }}>·</span>
            <Link
              href={`/u/${typedProfile.username}/following`}
              className="transition-colors hover:text-[var(--accent)]"
            >
              <span style={{ color: "var(--ink)" }}>{followingCount ?? 0}</span> following
            </Link>
          </p>

          {/* Actions */}
          <div className="flex items-center gap-2 flex-wrap justify-center">
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
            {!isSelf && currentUser && (
              <MessageButton targetUserId={typedProfile.id} />
            )}
            {isSelf && (
              <ShareProfileButton
                username={typedProfile.username ?? ""}
                displayName={displayName}
              />
            )}
          </div>
        </header>

        {/* Stats — type as data, no boxes */}
        <section
          className="grid grid-cols-3 gap-6 sm:gap-8 mb-12 pb-10 anim-fadeUp"
          style={{ borderBottom: "1px solid var(--line)" }}
        >
          {[
            { label: "fixations", value: String(allFixes.length) },
            { label: "days fixated", value: String(totalDays) },
            { label: "top category", value: mostObsessed ?? "—" },
          ].map((s) => (
            <div key={s.label}>
              <p
                className="font-display tabular-nums"
                style={{
                  fontSize: "clamp(24px, 4vw, 36px)",
                  fontWeight: 600,
                  letterSpacing: "-0.03em",
                  lineHeight: 1,
                  color: "var(--ink)",
                }}
              >
                {s.value}
              </p>
              <p
                className="font-mono text-[10px] uppercase tracking-widest mt-2"
                style={{ color: "var(--ink-muted)" }}
              >
                {s.label}
              </p>
            </div>
          ))}
        </section>

        {/* Pinned — vvault list rows */}
        {pinnedFixes.length > 0 && (
          <section className="mb-12 anim-fadeUp">
            <div className="flex items-center gap-2 mb-4">
              <PinIcon size={11} />
              <p className="font-mono text-[10px] uppercase tracking-widest" style={{ color: "var(--ink-muted)" }}>
                currently obsessed with
              </p>
            </div>
            <div className="flex flex-col">
              {pinnedFixes.map((pf, i) => {
                const catColor = CATEGORY_COLOR[pf.category.toLowerCase()] || accent;
                return (
                  <Link
                    key={pf.id}
                    href={`/fix/${pf.id}`}
                    className="group flex items-center gap-4 py-4 transition-colors"
                    style={{
                      borderTop: i === 0 ? "1px solid var(--line)" : undefined,
                      borderBottom: "1px solid var(--line)",
                    }}
                  >
                    <span
                      className="shrink-0 inline-flex"
                      style={{ color: catColor }}
                    >
                      <CategoryIcon category={pf.category} size={18} />
                    </span>
                    <div className="flex-1 min-w-0">
                      <h3
                        className="font-display group-hover:text-[var(--accent)] transition-colors truncate"
                        style={{ fontSize: 16, fontWeight: 500, color: "var(--ink)", letterSpacing: "-0.01em" }}
                      >
                        {pf.title}
                      </h3>
                      <p className="font-mono text-[11px] mt-0.5" style={{ color: "var(--ink-muted)" }}>
                        {pf.category}
                      </p>
                    </div>
                    <div className="shrink-0 text-right">
                      <p
                        className="font-display tabular-nums"
                        style={{ fontSize: 22, fontWeight: 600, color: accent, lineHeight: 1, letterSpacing: "-0.02em" }}
                      >
                        {dayCount(pf.started_at, pf.ended_at)}
                      </p>
                      <p className="font-mono text-[9px] uppercase tracking-widest mt-1" style={{ color: hexToRgba(accent, 0.5) }}>
                        days
                      </p>
                    </div>
                  </Link>
                );
              })}
            </div>
          </section>
        )}

        {/* Active fixations — list rows */}
        <section className="mb-12 anim-fadeUp">
          <div className="flex items-baseline justify-between mb-4">
            <p className="font-mono text-[10px] uppercase tracking-widest" style={{ color: "var(--ink-muted)" }}>
              active fixations
            </p>
            {publicFixes.filter((f) => !f.ended_at).length > 0 && (
              <p className="font-mono text-[10px] tabular-nums" style={{ color: "var(--ink-faint)" }}>
                {publicFixes.filter((f) => !f.ended_at).length}
              </p>
            )}
          </div>

          {publicFixes.filter((f) => !f.ended_at).length === 0 ? (
            <p className="font-sans text-sm py-6" style={{ color: "var(--ink-muted)" }}>
              {isSelf
                ? "nothing public yet. turn a fix public in settings to show it here."
                : "this person keeps their obsessions private."}
            </p>
          ) : (
            <div className="flex flex-col">
              {publicFixes.filter((f) => !f.ended_at).map((fix, i) => {
                const days = dayCount(fix.started_at, fix.ended_at);
                const catColor = CATEGORY_COLOR[fix.category.toLowerCase()] || "var(--accent)";
                return (
                  <Link
                    key={fix.id}
                    href={`/fix/${fix.id}`}
                    className="group flex items-center gap-4 py-4 transition-colors"
                    style={{
                      borderTop: i === 0 ? "1px solid var(--line)" : undefined,
                      borderBottom: "1px solid var(--line)",
                    }}
                  >
                    <span
                      className="shrink-0 inline-flex"
                      style={{ color: catColor }}
                    >
                      <CategoryIcon category={fix.category} size={18} />
                    </span>
                    <div className="flex-1 min-w-0">
                      <h3
                        className="font-display group-hover:text-[var(--accent)] transition-colors truncate"
                        style={{ fontSize: 16, fontWeight: 500, color: "var(--ink)", letterSpacing: "-0.01em" }}
                      >
                        {fix.title}
                      </h3>
                      <p className="font-mono text-[11px] mt-0.5" style={{ color: "var(--ink-muted)" }}>
                        {fix.category}
                      </p>
                    </div>
                    <div className="shrink-0 text-right">
                      <p
                        className="font-display tabular-nums"
                        style={{ fontSize: 20, fontWeight: 600, color: "var(--ink)", lineHeight: 1, letterSpacing: "-0.02em" }}
                      >
                        {days}
                      </p>
                      <p className="font-mono text-[9px] uppercase tracking-widest mt-1" style={{ color: "var(--ink-faint)" }}>
                        days
                      </p>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </section>

        {/* Graveyard — minimal row */}
        {endedPublicCount > 0 && (
          <Link
            href={`/u/${typedProfile.username}/graveyard`}
            className="group flex items-center justify-between gap-4 py-4 transition-colors anim-fadeUp"
            style={{ borderTop: "1px solid var(--line)" }}
          >
            <div className="flex items-center gap-3 min-w-0">
              <span style={{ color: "var(--ink-muted)" }}>
                <TombstoneIcon size={18} />
              </span>
              <div className="min-w-0">
                <p className="font-display group-hover:text-[var(--accent)] transition-colors" style={{ fontSize: 16, fontWeight: 500, color: "var(--ink)" }}>
                  the graveyard
                </p>
                <p className="font-mono text-[11px] mt-0.5" style={{ color: "var(--ink-muted)" }}>
                  {endedPublicCount} ended {endedPublicCount === 1 ? "obsession" : "obsessions"}
                </p>
              </div>
            </div>
            <span className="font-mono text-[11px] uppercase tracking-widest shrink-0" style={{ color: "var(--accent)" }}>
              view →
            </span>
          </Link>
        )}
      </main>

      {/* Sticky signup bar for logged-out visitors */}
      {!currentUser && (
        <div
          className="fixed bottom-0 inset-x-0 z-50 px-4 pb-safe"
          style={{ paddingBottom: "max(16px, env(safe-area-inset-bottom))" }}
        >
          <div
            className="max-w-lg mx-auto flex items-center justify-between gap-4 rounded-2xl px-5 py-4"
            style={{
              background: "rgba(10,10,10,0.92)",
              backdropFilter: "blur(20px)",
              border: "1px solid var(--accent)",
              boxShadow: "0 8px 40px rgba(0,0,0,0.6)",
            }}
          >
            <div className="min-w-0">
              <p className="font-sans text-sm font-semibold truncate" style={{ color: "var(--ink)" }}>
                Track your own hyperfixations
              </p>
              <p className="font-mono text-[11px]" style={{ color: "var(--ink-muted)" }}>
                free · 30 seconds
              </p>
            </div>
            <Link
              href={`/auth/signup?next=/u/${typedProfile.username}`}
              className="shrink-0 px-5 py-2.5 rounded-full font-sans text-sm font-semibold transition-all hover:opacity-90 active:scale-[0.98]"
              style={{ background: "var(--accent)", color: "var(--bg)" }}
            >
              Join free →
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
