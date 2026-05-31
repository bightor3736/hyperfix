import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { LogoLockup } from "@/components/Logo";
import { FollowButton, FollowButtonLoggedIn } from "@/components/FollowButton";
import { resolveAccent, hexToRgba } from "@/lib/accent";
import { CategoryIcon, CATEGORY_COLOR } from "@/components/CategoryIcon";

interface Fix {
  id: string;
  title: string;
  category: string;
  started_at: string;
  ended_at: string | null;
}

function dayCount(startedAt: string): number {
  return Math.max(1, Math.ceil((Date.now() - new Date(startedAt).getTime()) / 86_400_000));
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
    .select("display_name, username, bio")
    .eq("username", username)
    .single();

  const name = profile?.display_name ?? profile?.username ?? username;
  return {
    title: `${name} wants to connect · Hyperfix`,
    description: `Follow ${name} on Hyperfix — the journal for your obsessions.`,
  };
}

export default async function AddFriendPage({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const { username } = await params;
  const supabase = await createClient();

  const { data: profile } = await supabase
    .from("profiles")
    .select("id, username, display_name, avatar_url, bio, is_pro, accent_color")
    .eq("username", username)
    .single();

  if (!profile) notFound();

  const displayName = profile.display_name ?? profile.username ?? "Someone";
  const accent = resolveAccent(profile.is_pro, profile.accent_color);

  // Get their active public fixes (up to 3)
  const { data: fixes } = await supabase
    .from("fixes")
    .select("id, title, category, started_at, ended_at")
    .eq("user_id", profile.id)
    .eq("is_public", true)
    .is("ended_at", null)
    .order("created_at", { ascending: false })
    .limit(3);

  const activeFixes: Fix[] = (fixes ?? []) as Fix[];

  const { count: followerCount } = await supabase
    .from("follows")
    .select("id", { count: "exact", head: true })
    .eq("following_id", profile.id);

  const {
    data: { user: currentUser },
  } = await supabase.auth.getUser();

  const isSelf = currentUser?.id === profile.id;

  let isFollowing = false;
  if (currentUser && !isSelf) {
    const { data: followRow } = await supabase
      .from("follows")
      .select("id")
      .eq("follower_id", currentUser.id)
      .eq("following_id", profile.id)
      .maybeSingle();
    isFollowing = !!followRow;
  }

  const NOISE_URL = "url(\"data:image/svg+xml;utf8,<svg viewBox='0 0 240 240' xmlns='http://www.w3.org/2000/svg'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 0.55 0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>\")";

  return (
    <div className="min-h-screen flex flex-col" style={{ background: "var(--bg)", color: "var(--ink)" }}>
      <div aria-hidden className="absolute inset-0 pointer-events-none mix-blend-overlay" style={{ backgroundImage: NOISE_URL, backgroundSize: "240px 240px", opacity: 0.07 }} />

      {/* nav */}
      <nav className="relative z-10 flex items-center justify-between px-5 sm:px-8 py-4" style={{ borderBottom: "1px solid var(--line)" }}>
        <Link href="/">
          <LogoLockup size="sm" />
        </Link>
        {currentUser ? (
          <Link href="/dashboard" className="font-mono text-[11px] uppercase tracking-widest px-4 py-2 rounded-full" style={{ background: "var(--line)", border: "1px solid var(--line)", color: "var(--ink-muted)" }}>
            my fixes
          </Link>
        ) : (
          <Link href="/auth/login" className="font-mono text-[11px] uppercase tracking-widest px-4 py-2 rounded-full" style={{ background: "var(--line)", border: "1px solid var(--line)", color: "var(--ink-muted)" }}>
            log in
          </Link>
        )}
      </nav>

      {/* main */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center px-5 py-16 sm:py-24">

        {/* bloom behind avatar */}
        <div
          className="absolute pointer-events-none"
          style={{
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -70%)",
            width: 400,
            height: 400,
            borderRadius: "50%",
            background: `radial-gradient(ellipse, ${hexToRgba(accent, 0.18)} 0%, transparent 65%)`,
            filter: "blur(20px)",
          }}
        />

        <div className="relative flex flex-col items-center text-center max-w-sm w-full">

          {/* avatar */}
          <div className="relative mb-5">
            {profile.avatar_url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={profile.avatar_url}
                alt={displayName}
                className="w-24 h-24 rounded-full object-cover"
                style={{ border: `2px solid ${hexToRgba(accent, 0.35)}` }}
              />
            ) : (
              <div
                className="w-24 h-24 rounded-full flex items-center justify-center font-display font-semibold text-3xl"
                style={{ background: hexToRgba(accent, 0.14), color: accent, border: `2px solid ${hexToRgba(accent, 0.3)}` }}
              >
                {displayName.slice(0, 2).toUpperCase()}
              </div>
            )}
          </div>

          {/* name + handle */}
          <h1
            className="font-display mb-1"
            style={{ fontSize: "clamp(28px, 6vw, 40px)", fontWeight: 600, letterSpacing: "-0.025em", lineHeight: 1 }}
          >
            {displayName}
          </h1>
          <p className="font-mono text-[12px] mb-2" style={{ color: "var(--ink-muted)" }}>
            @{profile.username}
          </p>
          <p className="font-mono text-[11px] mb-6" style={{ color: "var(--ink-faint)" }}>
            {followerCount ?? 0} {followerCount === 1 ? "follower" : "followers"} on Hyperfix
          </p>

          {/* bio */}
          {profile.bio && (
            <p className="font-sans text-[15px] leading-relaxed mb-6 max-w-xs" style={{ color: "var(--ink-muted)" }}>
              {profile.bio}
            </p>
          )}

          {/* active fixes preview */}
          {activeFixes.length > 0 && (
            <div className="w-full mb-8">
              <p className="font-mono text-[10px] uppercase tracking-widest mb-3 text-left" style={{ color: "var(--ink-faint)" }}>
                currently fixated on
              </p>
              <div className="flex flex-col gap-0" style={{ border: "1px solid var(--line)", borderRadius: 16, overflow: "hidden" }}>
                {activeFixes.map((fix, i) => {
                  const catColor = CATEGORY_COLOR[fix.category.toLowerCase()] ?? accent;
                  const days = dayCount(fix.started_at);
                  return (
                    <div
                      key={fix.id}
                      className="flex items-center gap-3 px-4 py-3.5"
                      style={{
                        background: "var(--bg)",
                        borderBottom: i < activeFixes.length - 1 ? "1px solid var(--line)" : "none",
                      }}
                    >
                      <span style={{ color: catColor, flexShrink: 0 }}>
                        <CategoryIcon category={fix.category} size={16} />
                      </span>
                      <p className="font-sans text-sm flex-1 min-w-0 truncate text-left" style={{ color: "var(--ink-muted)", fontWeight: 500 }}>
                        {fix.title}
                      </p>
                      <p className="font-mono text-[11px] shrink-0 tabular-nums" style={{ color: "var(--ink-faint)" }}>
                        {days}d
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* CTA */}
          {isSelf ? (
            <div className="w-full">
              <p className="font-sans text-sm mb-3" style={{ color: "var(--ink-muted)" }}>
                This is your link — share it so people can follow you.
              </p>
              <div
                className="w-full rounded-2xl px-4 py-3 font-mono text-sm text-center select-all"
                style={{ background: "var(--accent-soft)", border: "1px solid var(--accent)", color: "var(--accent)" }}
              >
                hyperfix.app/add/{profile.username}
              </div>
            </div>
          ) : currentUser ? (
            <div className="w-full flex flex-col gap-3">
              <FollowButtonLoggedIn
                targetUserId={profile.id}
                targetUsername={profile.username ?? ""}
                initialFollowing={isFollowing}
                initialCount={followerCount ?? 0}
              />
              <Link
                href={`/u/${profile.username}`}
                className="font-mono text-[12px] uppercase tracking-widest text-center"
                style={{ color: "var(--ink-faint)" }}
              >
                view full profile →
              </Link>
            </div>
          ) : (
            <div className="w-full flex flex-col gap-3">
              <Link
                href={`/auth/signup?next=/add/${username}`}
                className="w-full flex items-center justify-center gap-2 font-sans text-base font-semibold py-4 rounded-2xl transition-all active:scale-[0.98]"
                style={{ background: "var(--ink)", color: "var(--bg)", boxShadow: "0 8px 32px rgba(0,0,0,0.4)" }}
              >
                join Hyperfix + follow {displayName.split(" ")[0]}
              </Link>
              <p className="font-sans text-sm" style={{ color: "var(--ink-faint)" }}>
                free forever · takes 30 seconds
              </p>
              <div className="flex items-center gap-3 mt-1">
                <div style={{ flex: 1, height: 1, background: "var(--line)" }} />
                <span className="font-mono text-[11px]" style={{ color: "var(--ink-faint)" }}>or</span>
                <div style={{ flex: 1, height: 1, background: "var(--line)" }} />
              </div>
              <Link
                href={`/auth/login?next=/add/${username}`}
                className="font-mono text-[12px] uppercase tracking-widest text-center"
                style={{ color: "var(--ink-faint)" }}
              >
                already have an account →
              </Link>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
