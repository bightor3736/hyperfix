import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import type { Metadata } from "next";
import { SearchInput } from "./SearchInput";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Search · Hyperfix",
  description: "Search fixes and people on Hyperfix.",
};

const TEAL = "#5EEAD4";
const CARD_BG = "#0F1011";
const CARD_BORDER = "rgba(255,255,255,0.06)";
const NOISE_URL =
  "url(\"data:image/svg+xml;utf8,<svg viewBox='0 0 240 240' xmlns='http://www.w3.org/2000/svg'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 0.55 0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>\")";

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
      className="motion-card group relative overflow-hidden flex items-center gap-4 rounded-3xl p-5"
      style={{ background: CARD_BG, border: `1px solid ${CARD_BORDER}`, textDecoration: "none" }}
    >
      <div aria-hidden className="absolute inset-0 pointer-events-none mix-blend-overlay" style={{ backgroundImage: NOISE_URL, backgroundSize: "240px 240px", opacity: 0.22 }} />
      <div
        className="relative shrink-0 w-12 h-12 rounded-full flex items-center justify-center font-sans font-semibold overflow-hidden"
        style={{
          background: "rgba(94,234,212,0.15)",
          border: "1px solid rgba(94,234,212,0.22)",
          fontSize: 13,
          color: TEAL,
        }}
      >
        {profile.avatar_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={profile.avatar_url} alt={profile.username ?? "user"} className="w-full h-full object-cover" />
        ) : (
          initials
        )}
      </div>
      <div className="relative min-w-0 flex-1">
        <p className="font-display truncate" style={{ fontSize: 15, color: "#FFFFFF", fontWeight: 600 }}>
          {profile.display_name ?? profile.username ?? "Unknown"}
        </p>
        {profile.username && (
          <p className="font-sans" style={{ fontSize: 12, color: "rgba(255,255,255,0.45)" }}>
            @{profile.username}
          </p>
        )}
        {profile.bio && (
          <p
            className="font-sans mt-1"
            style={{
              fontSize: 12,
              color: "rgba(255,255,255,0.4)",
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
      className="motion-card group block relative overflow-hidden rounded-3xl p-5"
      style={{ background: CARD_BG, border: `1px solid ${CARD_BORDER}`, textDecoration: "none" }}
    >
      <div aria-hidden className="absolute inset-0 pointer-events-none mix-blend-overlay" style={{ backgroundImage: NOISE_URL, backgroundSize: "240px 240px", opacity: 0.22 }} />
      <div className="relative">
        <div className="flex items-center gap-2 mb-3">
          <span
            className="font-sans rounded-full px-2.5 py-0.5"
            style={{
              fontSize: 11,
              background: "rgba(94,234,212,0.10)",
              border: "1px solid rgba(94,234,212,0.22)",
              color: TEAL,
            }}
          >
            {emoji} {fix.category}
          </span>
        </div>
        <h3
          className="font-display mb-2 group-hover:text-[#5EEAD4] transition-colors"
          style={{
            fontSize: 16,
            lineHeight: 1.3,
            color: "#FFFFFF",
            fontWeight: 600,
            letterSpacing: "-0.01em",
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}
        >
          {fix.title}
        </h3>
        <p className="font-sans text-sm mb-3 tabular-nums" style={{ color: TEAL }}>
          {days} {days === 1 ? "day" : "days"}
        </p>
        <div
          className="flex items-center gap-2 pt-3"
          style={{ borderTop: `1px solid ${CARD_BORDER}` }}
        >
          <div
            className="shrink-0 w-5 h-5 rounded-full flex items-center justify-center font-sans font-semibold overflow-hidden"
            style={{
              background: "rgba(94,234,212,0.15)",
              border: "1px solid rgba(94,234,212,0.22)",
              fontSize: 8,
              color: TEAL,
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
            <span className="font-sans truncate" style={{ fontSize: 11, color: "rgba(255,255,255,0.45)" }}>
              @{username}
            </span>
          )}
        </div>
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

  const profiles: Profile[] = [];
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
    <>
      <Nav />
      <div className="min-h-screen px-4 sm:px-6 lg:px-8 pt-8 pb-16 relative" style={{ background: "#070708" }}>
        <div aria-hidden className="absolute inset-0 pointer-events-none mix-blend-overlay" style={{ backgroundImage: NOISE_URL, backgroundSize: "240px 240px", opacity: 0.08 }} />

        <main id="main-content" className="relative max-w-5xl mx-auto flex flex-col gap-6">
          {/* Hero card */}
          <div className="relative overflow-hidden rounded-3xl p-6 sm:p-10 anim-fadeUp" style={{ background: "radial-gradient(ellipse 80% 120% at 50% 130%, #5EEAD4 0%, #2DD4BF 14%, #0E4F47 34%, #08231F 55%, #070708 78%)", border: `1px solid ${CARD_BORDER}` }}>
            <div aria-hidden className="absolute inset-0 pointer-events-none mix-blend-overlay" style={{ backgroundImage: NOISE_URL, backgroundSize: "200px 200px", opacity: 0.55 }} />
            <div aria-hidden className="absolute inset-0 pointer-events-none" style={{ background: "linear-gradient(180deg, #070708 0%, rgba(7,7,8,0.45) 30%, transparent 100%)" }} />
            <div className="relative">
              <span className="inline-flex items-center font-sans text-xs rounded-full px-3 py-1 mb-5" style={{ background: "rgba(94,234,212,0.10)", color: TEAL, border: "1px solid rgba(94,234,212,0.22)" }}>search</span>
              <h1 className="font-display anim-fadeUp delay-100 mb-6" style={{ color: "#FFFFFF", fontSize: "clamp(28px, 4.5vw, 40px)", lineHeight: 1.05, letterSpacing: "-0.02em", fontWeight: 600 }}>
                What are you unwell about?
              </h1>
              <div className="anim-fadeUp delay-200">
                <SearchInput defaultValue={query} />
              </div>
            </div>
          </div>

          {/* Results */}
          {query && (
            <>
              {!hasResults ? (
                <div className="motion-card relative overflow-hidden rounded-3xl p-10 sm:p-16 text-center" style={{ background: CARD_BG, border: `1px solid ${CARD_BORDER}` }}>
                  <div aria-hidden className="absolute inset-0 pointer-events-none mix-blend-overlay" style={{ backgroundImage: NOISE_URL, backgroundSize: "240px 240px", opacity: 0.22 }} />
                  <div className="relative">
                    <p className="font-display mb-2" style={{ color: "rgba(255,255,255,0.85)", fontSize: 24, fontWeight: 600, letterSpacing: "-0.01em" }}>
                      No results for &ldquo;{query}&rdquo;
                    </p>
                    <p className="font-sans text-sm" style={{ color: "rgba(255,255,255,0.4)" }}>
                      Try a different search term.
                    </p>
                  </div>
                </div>
              ) : (
                <>
                  {profiles.length > 0 && (
                    <section>
                      <h2 className="font-sans text-xs mb-4 px-1" style={{ color: TEAL }}>
                        People · {profiles.length}
                      </h2>
                      <div className="grid gap-3 sm:grid-cols-2">
                        {profiles.map((profile) => (
                          <ProfileCard key={profile.id} profile={profile} />
                        ))}
                      </div>
                    </section>
                  )}

                  {fixes.length > 0 && (
                    <section>
                      <h2 className="font-sans text-xs mb-4 px-1" style={{ color: TEAL }}>
                        Fixes · {fixes.length}
                      </h2>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {fixes.map((fix) => (
                          <FixCard key={fix.id} fix={fix} />
                        ))}
                      </div>
                    </section>
                  )}
                </>
              )}
            </>
          )}

          {!query && (
            <div className="motion-card relative overflow-hidden rounded-3xl p-10 sm:p-16 text-center" style={{ background: CARD_BG, border: `1px solid ${CARD_BORDER}` }}>
              <div aria-hidden className="absolute inset-0 pointer-events-none mix-blend-overlay" style={{ backgroundImage: NOISE_URL, backgroundSize: "240px 240px", opacity: 0.22 }} />
              <div className="relative">
                <p className="font-display mb-2" style={{ color: "rgba(255,255,255,0.7)", fontSize: 22, fontWeight: 600, letterSpacing: "-0.01em" }}>
                  Search for fixes or people.
                </p>
                <p className="font-sans text-sm" style={{ color: "rgba(255,255,255,0.35)" }}>
                  Start typing above.
                </p>
              </div>
            </div>
          )}
        </main>
      </div>
      <Footer />
    </>
  );
}
