import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { LogoDark } from "@/components/Logo";
import type { Metadata } from "next";
import { SearchInput } from "./SearchInput";

export const metadata: Metadata = {
  title: "Search · Hyperfix",
  description: "Search fixes and people on Hyperfix.",
};

type Profile = {
  id: string;
  username: string | null;
  display_name: string | null;
  avatar_url: string | null;
  bio: string | null;
};

type FixResult = {
  id: string;
  title: string;
  category: string;
  status: string;
  intensity: number;
  started_at: string;
  ended_at: string | null;
  profiles: {
    username: string | null;
    display_name: string | null;
    avatar_url: string | null;
  } | null;
};

const CATEGORY_EMOJI: Record<string, string> = {
  song: "🎵",
  fanfic: "📖",
  show: "📺",
  film: "🎬",
  ship: "💜",
  game: "🎮",
  "video essay": "🎥",
  podcast: "🎙️",
  book: "📚",
  character: "✨",
  other: "✦",
};

function dayCount(startedAt: string, endedAt: string | null): number {
  const start = new Date(startedAt);
  const end = endedAt ? new Date(endedAt) : new Date();
  return Math.max(1, Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)));
}

function getInitials(displayName: string | null, username: string | null): string {
  const name = displayName ?? username ?? "?";
  return name.slice(0, 2).toUpperCase();
}

function ProfileCard({ profile }: { profile: Profile }) {
  const initials = getInitials(profile.display_name, profile.username);
  return (
    <Link
      href={`/u/${profile.username}`}
      className="flex items-center gap-4 rounded-2xl p-4 transition-all duration-200 hover:-translate-y-0.5"
      style={{
        background: "#111113",
        border: "1px solid rgba(244,244,244,0.07)",
      }}
    >
      <div
        className="shrink-0 w-12 h-12 rounded-full flex items-center justify-center font-mono font-bold overflow-hidden"
        style={{
          background: "rgba(168,85,247,0.15)",
          border: "1px solid rgba(168,85,247,0.2)",
          fontSize: 13,
          color: "#A855F7",
        }}
      >
        {profile.avatar_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={profile.avatar_url} alt={profile.username ?? "user"} className="w-full h-full object-cover" />
        ) : (
          initials
        )}
      </div>
      <div className="min-w-0 flex-1">
        <p className="font-display font-medium truncate" style={{ fontSize: 15, color: "#F4F4F4" }}>
          {profile.display_name ?? profile.username ?? "Unknown"}
        </p>
        {profile.username && (
          <p className="font-mono" style={{ fontSize: 11, color: "rgba(244,244,244,0.4)" }}>
            @{profile.username}
          </p>
        )}
        {profile.bio && (
          <p
            className="mt-1"
            style={{
              fontSize: 12,
              color: "rgba(244,244,244,0.35)",
              overflow: "hidden",
              display: "-webkit-box",
              WebkitLineClamp: 1,
              WebkitBoxOrient: "vertical",
            }}
          >
            {profile.bio}
          </p>
        )}
      </div>
    </Link>
  );
}

function FixCard({ fix }: { fix: FixResult }) {
  const days = dayCount(fix.started_at, fix.ended_at);
  const emoji = CATEGORY_EMOJI[fix.category] ?? "✦";
  const username = fix.profiles?.username;
  const displayName = fix.profiles?.display_name;
  const avatarUrl = fix.profiles?.avatar_url;
  const initials = getInitials(displayName ?? null, username ?? null);

  return (
    <Link
      href={`/fix/${fix.id}`}
      className="block rounded-2xl p-4 transition-all duration-200 hover:-translate-y-0.5 group"
      style={{
        background: "#111113",
        border: "1px solid rgba(244,244,244,0.07)",
      }}
    >
      <div className="flex items-center gap-2 mb-3">
        <span
          className="font-mono uppercase tracking-widest rounded-full px-2.5 py-1"
          style={{
            fontSize: 9,
            background: "rgba(168,85,247,0.08)",
            border: "1px solid rgba(168,85,247,0.2)",
            color: "#A855F7",
          }}
        >
          {emoji} {fix.category}
        </span>
      </div>
      <h3
        className="font-display font-medium mb-2 group-hover:text-[#A855F7] transition-colors"
        style={{
          fontSize: 15,
          lineHeight: 1.35,
          color: "#F4F4F4",
          display: "-webkit-box",
          WebkitLineClamp: 2,
          WebkitBoxOrient: "vertical",
          overflow: "hidden",
        }}
      >
        {fix.title}
      </h3>
      <p className="font-mono text-sm mb-3" style={{ color: "#A855F7" }}>
        {days} {days === 1 ? "day" : "days"}
      </p>
      <div
        className="flex items-center gap-2 pt-3"
        style={{ borderTop: "1px solid rgba(244,244,244,0.06)" }}
      >
        <div
          className="shrink-0 w-5 h-5 rounded-full flex items-center justify-center font-mono font-bold overflow-hidden"
          style={{
            background: "rgba(168,85,247,0.15)",
            border: "1px solid rgba(168,85,247,0.2)",
            fontSize: 8,
            color: "#A855F7",
          }}
        >
          {avatarUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={avatarUrl} alt={username ?? "user"} className="w-full h-full object-cover" />
          ) : (
            initials
          )}
        </div>
        {username && (
          <span className="font-mono truncate" style={{ fontSize: 10, color: "rgba(244,244,244,0.4)" }}>
            @{username}
          </span>
        )}
      </div>
    </Link>
  );
}

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  const query = q?.trim() ?? "";

  let profiles: Profile[] = [];
  let fixes: FixResult[] = [];

  if (query) {
    const supabase = await createClient();

    const [
      { data: byUsername },
      { data: byDisplayName },
      { data: fixData },
    ] = await Promise.all([
      supabase
        .from("profiles")
        .select("id, username, display_name, avatar_url, bio")
        .ilike("username", `%${query}%`)
        .eq("is_public", true)
        .limit(8),
      supabase
        .from("profiles")
        .select("id, username, display_name, avatar_url, bio")
        .ilike("display_name", `%${query}%`)
        .eq("is_public", true)
        .limit(8),
      supabase
        .from("fixes")
        .select("id, title, category, status, intensity, started_at, ended_at, profiles(username, display_name, avatar_url)")
        .eq("is_public", true)
        .ilike("title", `%${query}%`)
        .is("ended_at", null)
        .order("created_at", { ascending: false })
        .limit(20),
    ]);

    // Merge and deduplicate profiles by id
    const seen = new Set<string>();
    for (const p of [...(byUsername ?? []), ...(byDisplayName ?? [])]) {
      if (!seen.has(p.id)) {
        seen.add(p.id);
        profiles.push(p as Profile);
      }
    }

    fixes = (fixData ?? []) as unknown as FixResult[];
  }

  const hasResults = profiles.length > 0 || fixes.length > 0;

  return (
    <div className="min-h-screen" style={{ background: "#0A0A0A", color: "#F4F4F4" }}>
      {/* Nav */}
      <nav className="border-b" style={{ borderColor: "rgba(244,244,244,0.07)" }}>
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" aria-label="Hyperfix home">
            <LogoDark size="sm" />
          </Link>
          <Link
            href="/explore"
            className="font-mono text-[11px] uppercase tracking-widest transition-colors"
            style={{ color: "rgba(244,244,244,0.5)" }}
          >
            Explore →
          </Link>
        </div>
      </nav>

      <main className="max-w-5xl mx-auto px-6 py-12">
        {/* Search input */}
        <div className="mb-12">
          <SearchInput defaultValue={query} />
        </div>

        {/* Results */}
        {query && (
          <div>
            {!hasResults ? (
              <div className="flex flex-col items-center justify-center py-24 text-center">
                <p className="font-display text-2xl mb-2" style={{ color: "rgba(244,244,244,0.5)" }}>
                  No results for &ldquo;{query}&rdquo;
                </p>
                <p className="font-mono text-sm" style={{ color: "rgba(244,244,244,0.3)" }}>
                  Try a different search term.
                </p>
              </div>
            ) : (
              <div className="flex flex-col gap-12">
                {/* People section */}
                {profiles.length > 0 && (
                  <section>
                    <h2
                      className="font-mono uppercase tracking-widest mb-5"
                      style={{ fontSize: 11, color: "rgba(244,244,244,0.4)" }}
                    >
                      People · {profiles.length}
                    </h2>
                    <div className="grid gap-3 sm:grid-cols-2">
                      {profiles.map((profile) => (
                        <ProfileCard key={profile.id} profile={profile} />
                      ))}
                    </div>
                  </section>
                )}

                {/* Fixes section */}
                {fixes.length > 0 && (
                  <section>
                    <h2
                      className="font-mono uppercase tracking-widest mb-5"
                      style={{ fontSize: 11, color: "rgba(244,244,244,0.4)" }}
                    >
                      Fixes · {fixes.length}
                    </h2>
                    <div className="masonry-grid" style={{ columnGap: "16px" }}>
                      {fixes.map((fix) => (
                        <FixCard key={fix.id} fix={fix} />
                      ))}
                    </div>
                  </section>
                )}
              </div>
            )}
          </div>
        )}

        {/* Empty state when no query */}
        {!query && (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <p className="font-display text-2xl mb-2" style={{ color: "rgba(244,244,244,0.4)" }}>
              What are you unwell about?
            </p>
            <p className="font-mono text-sm" style={{ color: "rgba(244,244,244,0.25)" }}>
              Search for fixes or people.
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
