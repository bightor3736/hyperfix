import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { LogoDark } from "@/components/Logo";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { FollowButton, FollowButtonLoggedIn } from "@/components/FollowButton";

interface Fix {
  id: string;
  title: string;
  category: string;
  status: string;
  intensity: number;
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
  pinned_fix_id: string | null;
  banner_url: string | null;
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

function Initials({ name }: { name: string }) {
  const parts = name.trim().split(/\s+/);
  const letters =
    parts.length >= 2
      ? (parts[0][0] ?? "") + (parts[parts.length - 1][0] ?? "")
      : (name[0] ?? "");
  return (
    <div
      className="w-20 h-20 rounded-full flex items-center justify-center text-2xl font-display font-medium"
      style={{ background: "rgba(168,85,247,0.15)", color: "#A855F7", border: "2px solid rgba(168,85,247,0.3)" }}
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
              background: i < intensity ? "#A855F7" : "rgba(244,244,244,0.08)",
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
    .select("username, display_name, bio")
    .eq("username", username)
    .single();

  if (!profile) return { title: "Not found · Hyperfix" };

  const name = (profile as { username: string | null; display_name: string | null; bio: string | null }).display_name ?? profile.username ?? username;
  const typedProfile = profile as { username: string | null; display_name: string | null; bio: string | null };
  const description = typedProfile.bio ?? `See what ${name} is hyperfixated on.`;

  return {
    title: `${name} · Hyperfix`,
    description,
    openGraph: {
      title: `${name} on Hyperfix`,
      description,
      images: [{
        url: `/api/og?title=${encodeURIComponent(name)}&sub=${encodeURIComponent(description)}&accent=${encodeURIComponent("@" + username)}`,
        width: 1200,
        height: 630,
      }],
    },
    twitter: { card: "summary_large_image" },
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
    .select("id, username, display_name, avatar_url, bio, is_public, pinned_fix_id, banner_url")
    .eq("username", username)
    .single();

  if (profileError || !profile || !profile.is_public) {
    notFound();
  }

  const typedProfile = profile as Profile;

  const { data: fixes } = await supabase
    .from("fixes")
    .select("id, title, category, status, intensity, started_at, ended_at, is_public")
    .eq("user_id", typedProfile.id)
    .order("created_at", { ascending: false });

  const allFixes: Fix[] = (fixes ?? []) as Fix[];
  const publicFixes = allFixes.filter((f) => f.is_public);

  // Pinned fix (may differ from allFixes if it's a private fix still shown as pinned hero)
  let pinnedFix: Fix | null = null;
  if (typedProfile.pinned_fix_id) {
    const pinned = allFixes.find((f) => f.id === typedProfile.pinned_fix_id);
    if (pinned?.is_public) pinnedFix = pinned;
  }

  const totalDays = allFixes.reduce((acc, fix) => acc + dayCount(fix.started_at, fix.ended_at), 0);
  const mostObsessed = getMostObsessedCategory(allFixes);

  const displayName = typedProfile.display_name ?? typedProfile.username ?? "Anonymous";

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
    <div className="min-h-screen" style={{ background: "#080808", color: "#F4F4F4" }}>
      {/* Nav */}
      <nav className="border-b" style={{ borderColor: "rgba(244,244,244,0.07)" }}>
        <div className="max-w-4xl mx-auto px-6 py-4">
          <Link href="/" aria-label="Hyperfix home">
            <LogoDark size="sm" />
          </Link>
        </div>
      </nav>

      <main id="main-content" className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        {/* Profile header */}
        <div className="flex items-start gap-6 mb-10">
          {typedProfile.avatar_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={typedProfile.avatar_url}
              alt={displayName}
              className="w-20 h-20 rounded-full object-cover"
              style={{ border: "2px solid rgba(244,244,244,0.1)" }}
            />
          ) : (
            <Initials name={displayName} />
          )}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 flex-wrap mb-0.5">
              <h1 className="text-2xl font-display font-medium">{displayName}</h1>
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
            </div>
            <p className="font-mono text-sm" style={{ color: "#9A9A9A" }}>
              @{typedProfile.username}
            </p>
            <p className="font-mono text-xs mt-1 mb-3" style={{ color: "rgba(244,244,244,0.3)" }}>
              {followerCount ?? 0} followers · {followingCount ?? 0} following
            </p>
            {typedProfile.bio && (
              <p className="text-sm leading-relaxed" style={{ color: "rgba(244,244,244,0.7)" }}>
                {typedProfile.bio}
              </p>
            )}
          </div>
        </div>

        {/* Pinned fix */}
        {pinnedFix && (
          <div className="mb-8">
            <p className="font-mono text-[10px] uppercase tracking-widest mb-3" style={{ color: "rgba(244,244,244,0.35)" }}>
              📌 currently obsessed with
            </p>
            <Link
              href={`/fix/${pinnedFix.id}`}
              className="group flex items-center gap-4 rounded-2xl p-5 transition-all hover:border-[rgba(168,85,247,0.3)]"
              style={{ background: "#111113", border: "1px solid rgba(168,85,247,0.2)" }}
            >
              <div className="flex-1 min-w-0">
                <h3 className="font-display font-medium text-lg leading-snug group-hover:text-[#A855F7] transition-colors mb-1">
                  {pinnedFix.title}
                </h3>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-mono text-[10px] uppercase tracking-widest rounded-full px-2.5 py-1"
                    style={{ background: "rgba(168,85,247,0.1)", border: "1px solid rgba(168,85,247,0.25)", color: "#A855F7" }}>
                    {pinnedFix.category}
                  </span>
                  <span className="font-mono text-xs" style={{ color: "#9A9A9A" }}>
                    Day {dayCount(pinnedFix.started_at, pinnedFix.ended_at)}
                  </span>
                </div>
              </div>
              <div className="shrink-0 text-2xl font-display font-black tabular-nums" style={{ color: "#A855F7" }}>
                {dayCount(pinnedFix.started_at, pinnedFix.ended_at)}
                <span className="text-xs font-mono font-normal ml-1" style={{ color: "rgba(168,85,247,0.5)" }}>d</span>
              </div>
            </Link>
          </div>
        )}

        {/* Stats */}
        <div
          className="grid grid-cols-3 gap-px rounded-xl overflow-hidden mb-10"
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
              <div className="text-xl sm:text-2xl font-display font-medium mb-1 truncate">{stat.value}</div>
              <div className="text-[9px] sm:text-xs font-mono uppercase tracking-widest" style={{ color: "#9A9A9A" }}>
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        {/* Public fixes */}
        <div>
          <h2 className="text-sm font-mono uppercase tracking-widest mb-5" style={{ color: "#9A9A9A" }}>
            Public fixes
          </h2>

          {publicFixes.length === 0 ? (
            <p className="italic text-sm" style={{ color: "rgba(244,244,244,0.35)" }}>
              Nothing public yet.
            </p>
          ) : (
            <div className="grid sm:grid-cols-2 gap-3">
              {publicFixes.map((fix) => {
                const days = dayCount(fix.started_at, fix.ended_at);
                return (
                  <Link
                    key={fix.id}
                    href={`/fix/${fix.id}`}
                    className="group block rounded-xl p-5 transition-all duration-200 hover:scale-[1.01]"
                    style={{
                      background: "#111113",
                      border: "1px solid rgba(244,244,244,0.07)",
                    }}
                  >
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <h3 className="font-display font-medium text-base leading-snug group-hover:text-[#A855F7] transition-colors">
                        {fix.title}
                      </h3>
                      <span
                        className="shrink-0 text-[10px] font-mono uppercase tracking-widest rounded-full px-2.5 py-1"
                        style={{
                          background: "rgba(168,85,247,0.1)",
                          border: "1px solid rgba(168,85,247,0.25)",
                          color: "#A855F7",
                        }}
                      >
                        {fix.category}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 mb-3">
                      <span
                        className="text-[10px] font-mono uppercase tracking-widest rounded-full px-2.5 py-1"
                        style={{
                          background: "rgba(244,244,244,0.06)",
                          border: "1px solid rgba(244,244,244,0.12)",
                          color: "rgba(244,244,244,0.6)",
                        }}
                      >
                        {fix.status}
                      </span>
                      <span className="text-xs font-mono" style={{ color: "#9A9A9A" }}>
                        {days} {days === 1 ? "day" : "days"}
                      </span>
                    </div>
                    <IntensityBar intensity={fix.intensity} />
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
