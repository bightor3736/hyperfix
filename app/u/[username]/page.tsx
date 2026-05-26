import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { LogoLockup } from "@/components/Logo";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { FollowButton, FollowButtonLoggedIn } from "@/components/FollowButton";
import { MessageButton } from "@/components/MessageButton";
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
  const accent = resolveAccent(typedProfile.is_pro, typedProfile.accent_color);

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
    <div className="min-h-screen relative" style={{ background: "#070708", color: "#F4F4F4" }}>
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
          borderBottom: "1px solid rgba(255,255,255,0.05)",
        }}
      >
        <Link href="/" aria-label="Hyperfix home" className="transition-transform hover:scale-[1.02]">
          <LogoLockup size="sm" />
        </Link>
        <Link
          href={currentUser ? "/dashboard" : "/auth/login"}
          className="font-mono text-[11px] uppercase tracking-widest px-4 py-2 rounded-full transition-all hover:opacity-80"
          style={{
            background: "rgba(244,244,244,0.05)",
            border: "1px solid rgba(244,244,244,0.08)",
            color: "rgba(244,244,244,0.7)",
          }}
        >
          {currentUser ? "my fixes" : "log in"}
        </Link>
      </nav>

      <main id="main-content" className="relative max-w-2xl mx-auto px-5 sm:px-8 pt-10 sm:pt-16 pb-20">
        {/* Private profile notice — only shown to owner */}
        {isSelf && !typedProfile.is_public && (
          <div
            className="flex items-center justify-between gap-4 rounded-2xl px-4 py-3 mb-6 font-sans text-sm"
            style={{ background: "rgba(251,191,36,0.08)", border: "1px solid rgba(251,191,36,0.2)", color: "#FCD34D" }}
          >
            <span>Your profile is private — only you can see this.</span>
            <Link href="/dashboard/settings" className="font-mono text-xs underline underline-offset-2 shrink-0" style={{ color: "#FCD34D" }}>
              make public →
            </Link>
          </div>
        )}

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
                style={{ border: "1px solid rgba(244,244,244,0.08)" }}
              />
            ) : (
              <div
                className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-full flex items-center justify-center font-display font-semibold"
                style={{
                  background: hexToRgba(accent, 0.14),
                  border: "1px solid rgba(244,244,244,0.08)",
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
                color: "#F4F4F4",
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
            className="font-mono text-[12px] mb-4"
            style={{ color: "rgba(244,244,244,0.45)" }}
          >
            @{typedProfile.username}
          </p>

          {typedProfile.bio && (
            <p
              className="font-sans text-[15px] leading-relaxed max-w-md mb-5"
              style={{ color: "rgba(244,244,244,0.7)" }}
            >
              {typedProfile.bio}
            </p>
          )}

          {typedProfile.social_link && (
            <div className="mb-5">
              <SocialChips socialLink={typedProfile.social_link} />
            </div>
          )}

          {/* Followers · Following */}
          <p className="font-mono text-[11px] mb-5" style={{ color: "rgba(244,244,244,0.4)" }}>
            <Link
              href={`/u/${typedProfile.username}/followers`}
              className="transition-colors hover:text-[#5EEAD4]"
            >
              <span style={{ color: "rgba(244,244,244,0.85)" }}>{followerCount ?? 0}</span> followers
            </Link>
            <span className="mx-2" style={{ color: "rgba(244,244,244,0.2)" }}>·</span>
            <Link
              href={`/u/${typedProfile.username}/following`}
              className="transition-colors hover:text-[#5EEAD4]"
            >
              <span style={{ color: "rgba(244,244,244,0.85)" }}>{followingCount ?? 0}</span> following
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
          style={{ borderBottom: "1px solid rgba(244,244,244,0.06)" }}
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
                  color: "#F4F4F4",
                }}
              >
                {s.value}
              </p>
              <p
                className="font-mono text-[10px] uppercase tracking-widest mt-2"
                style={{ color: "rgba(244,244,244,0.4)" }}
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
              <p className="font-mono text-[10px] uppercase tracking-widest" style={{ color: "rgba(244,244,244,0.4)" }}>
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
                      borderTop: i === 0 ? "1px solid rgba(244,244,244,0.06)" : undefined,
                      borderBottom: "1px solid rgba(244,244,244,0.06)",
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
                        className="font-display group-hover:text-[#5EEAD4] transition-colors truncate"
                        style={{ fontSize: 16, fontWeight: 500, color: "#F4F4F4", letterSpacing: "-0.01em" }}
                      >
                        {pf.title}
                      </h3>
                      <p className="font-mono text-[11px] mt-0.5" style={{ color: "rgba(244,244,244,0.4)" }}>
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
            <p className="font-mono text-[10px] uppercase tracking-widest" style={{ color: "rgba(244,244,244,0.4)" }}>
              active fixations
            </p>
            {publicFixes.filter((f) => !f.ended_at).length > 0 && (
              <p className="font-mono text-[10px] tabular-nums" style={{ color: "rgba(244,244,244,0.3)" }}>
                {publicFixes.filter((f) => !f.ended_at).length}
              </p>
            )}
          </div>

          {publicFixes.filter((f) => !f.ended_at).length === 0 ? (
            <p className="font-sans text-sm py-6" style={{ color: "rgba(244,244,244,0.4)" }}>
              {isSelf
                ? "nothing public yet. turn a fix public in settings to show it here."
                : "this person keeps their obsessions private."}
            </p>
          ) : (
            <div className="flex flex-col">
              {publicFixes.filter((f) => !f.ended_at).map((fix, i) => {
                const days = dayCount(fix.started_at, fix.ended_at);
                const catColor = CATEGORY_COLOR[fix.category.toLowerCase()] || "#5EEAD4";
                return (
                  <Link
                    key={fix.id}
                    href={`/fix/${fix.id}`}
                    className="group flex items-center gap-4 py-4 transition-colors"
                    style={{
                      borderTop: i === 0 ? "1px solid rgba(244,244,244,0.06)" : undefined,
                      borderBottom: "1px solid rgba(244,244,244,0.06)",
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
                        className="font-display group-hover:text-[#5EEAD4] transition-colors truncate"
                        style={{ fontSize: 16, fontWeight: 500, color: "#F4F4F4", letterSpacing: "-0.01em" }}
                      >
                        {fix.title}
                      </h3>
                      <p className="font-mono text-[11px] mt-0.5" style={{ color: "rgba(244,244,244,0.4)" }}>
                        {fix.category}
                      </p>
                    </div>
                    <div className="shrink-0 text-right">
                      <p
                        className="font-display tabular-nums"
                        style={{ fontSize: 20, fontWeight: 600, color: "#F4F4F4", lineHeight: 1, letterSpacing: "-0.02em" }}
                      >
                        {days}
                      </p>
                      <p className="font-mono text-[9px] uppercase tracking-widest mt-1" style={{ color: "rgba(244,244,244,0.35)" }}>
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
            style={{ borderTop: "1px solid rgba(244,244,244,0.06)" }}
          >
            <div className="flex items-center gap-3 min-w-0">
              <span style={{ color: "rgba(244,244,244,0.4)" }}>
                <TombstoneIcon size={18} />
              </span>
              <div className="min-w-0">
                <p className="font-display group-hover:text-[#5EEAD4] transition-colors" style={{ fontSize: 16, fontWeight: 500, color: "#F4F4F4" }}>
                  the graveyard
                </p>
                <p className="font-mono text-[11px] mt-0.5" style={{ color: "rgba(244,244,244,0.4)" }}>
                  {endedPublicCount} ended {endedPublicCount === 1 ? "obsession" : "obsessions"}
                </p>
              </div>
            </div>
            <span className="font-mono text-[11px] uppercase tracking-widest shrink-0" style={{ color: "rgba(94,234,212,0.7)" }}>
              view →
            </span>
          </Link>
        )}
      </main>
    </div>
  );
}
