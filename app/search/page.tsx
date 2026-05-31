import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import type { Metadata } from "next";
import { SearchInput } from "./SearchInput";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import { CategoryIcon } from "@/components/CategoryIcon";

export const metadata: Metadata = {
  title: "Search Hyperfixations & People · Hyperfix",
  description: "Search thousands of hyperfixations — anime, music, shows, games, fanfic, and more. Find people tracking the same obsessions as you.",
  keywords: ["hyperfixation search", "ADHD obsession tracker", "fandom search", "anime tracker", "music obsession"],
  openGraph: {
    title: "Search Hyperfixations · Hyperfix",
    description: "Find people tracking the same obsessions as you.",
    images: [{ url: "https://hyperfix.app/opengraph-image", width: 1200, height: 630 }],
  },
};

const TEAL = "var(--accent)";
const CARD_BG = "var(--bg)";
const CARD_BORDER = "var(--line)";
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
          background: "var(--accent)",
          border: "1px solid var(--accent)",
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
        <p className="font-display truncate" style={{ fontSize: 15, color: "var(--ink)", fontWeight: 600 }}>
          {profile.display_name ?? profile.username ?? "Unknown"}
        </p>
        {profile.username && (
          <p className="font-sans" style={{ fontSize: 12, color: "var(--ink-muted)" }}>
            @{profile.username}
          </p>
        )}
        {profile.bio && (
          <p
            className="font-sans mt-1"
            style={{
              fontSize: 12,
              color: "var(--ink-muted)",
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
            className="inline-flex items-center gap-1.5 font-sans rounded-full px-2.5 py-0.5"
            style={{
              fontSize: 11,
              background: "var(--accent-soft)",
              border: "1px solid var(--accent)",
              color: TEAL,
            }}
          >
            <CategoryIcon category={fix.category} size={11} />
            {fix.category}
          </span>
        </div>
        <h3
          className="font-display mb-2 group-hover:text-[var(--accent)] transition-colors"
          style={{
            fontSize: 16,
            lineHeight: 1.3,
            color: "var(--ink)",
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
              background: "var(--accent)",
              border: "1px solid var(--accent)",
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
            <span className="font-sans truncate" style={{ fontSize: 11, color: "var(--ink-muted)" }}>
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

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const profiles: Profile[] = [];
  let fixes: FixResult[] = [];

  if (query) {

    const [
      { data: byUsername },
      { data: byDisplayName },
      { data: byTitle },
      { data: byTag },
      { data: byCategory },
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
      supabase
        .from("fixes")
        .select("id, title, category, status, intensity, started_at, ended_at, profiles(username, display_name, avatar_url)")
        .eq("is_public", true)
        .contains("tags", [query.toLowerCase()])
        .is("ended_at", null)
        .order("created_at", { ascending: false })
        .limit(10),
      supabase
        .from("fixes")
        .select("id, title, category, status, intensity, started_at, ended_at, profiles(username, display_name, avatar_url)")
        .eq("is_public", true)
        .ilike("category", query)
        .is("ended_at", null)
        .order("created_at", { ascending: false })
        .limit(10),
    ]);

    const seen = new Set<string>();
    for (const p of [...(byUsername ?? []), ...(byDisplayName ?? [])]) {
      if (!seen.has(p.id)) {
        seen.add(p.id);
        profiles.push(p as Profile);
      }
    }

    const seenFixes = new Set<string>();
    for (const f of [...(byTitle ?? []), ...(byTag ?? []), ...(byCategory ?? [])]) {
      const fix = f as unknown as FixResult;
      if (!seenFixes.has(fix.id)) {
        seenFixes.add(fix.id);
        fixes.push(fix);
      }
    }
  }

  const hasResults = profiles.length > 0 || fixes.length > 0;

  return (
    <>
      <Nav />
      <div className="min-h-screen px-4 sm:px-6 lg:px-8 pt-8 pb-16 relative" style={{ background: "var(--bg)" }}>
        <div aria-hidden className="absolute inset-0 pointer-events-none mix-blend-overlay" style={{ backgroundImage: NOISE_URL, backgroundSize: "240px 240px", opacity: 0.08 }} />

        <main id="main-content" className="relative max-w-5xl mx-auto flex flex-col gap-6">
          {/* Hero — tight, restrained */}
          <div className="anim-fadeUp">
            <div className="relative">
              <p className="font-mono text-[10px] uppercase tracking-widest mb-3" style={{ color: "var(--accent)" }}>search</p>
              <h1 className="font-display anim-fadeUp delay-100 mb-6" style={{ color: "var(--ink)", fontSize: "clamp(28px, 4.5vw, 40px)", lineHeight: 1.05, letterSpacing: "-0.02em", fontWeight: 600 }}>
                What are you obsessed with?
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
                    <p className="font-display mb-2" style={{ color: "var(--ink)", fontSize: 24, fontWeight: 600, letterSpacing: "-0.01em" }}>
                      No results for &ldquo;{query}&rdquo;
                    </p>
                    <p className="font-sans text-sm" style={{ color: "var(--ink-muted)" }}>
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
                <p className="font-display mb-2" style={{ color: "var(--ink-muted)", fontSize: 22, fontWeight: 600, letterSpacing: "-0.01em" }}>
                  Search for fixes or people.
                </p>
                <p className="font-sans text-sm" style={{ color: "var(--ink-faint)" }}>
                  Start typing above.
                </p>
              </div>
            </div>
          )}

          {/* Signup CTA for logged-out visitors */}
          {!user && (
            <div
              className="relative overflow-hidden rounded-3xl p-8 sm:p-10 anim-fadeUp"
              style={{
                background: "radial-gradient(ellipse 120% 140% at 50% 120%, var(--accent-soft) 0%, transparent 60%), var(--bg)",
                border: "1px solid var(--accent-soft)",
              }}
            >
              <div aria-hidden className="absolute inset-0 pointer-events-none mix-blend-overlay" style={{ backgroundImage: NOISE_URL, backgroundSize: "240px 240px", opacity: 0.22 }} />
              <div className="relative flex flex-col sm:flex-row items-center gap-6">
                <div className="flex-1 text-center sm:text-left">
                  <p
                    className="font-display mb-1"
                    style={{ fontSize: "clamp(20px, 3vw, 26px)", fontWeight: 600, color: "var(--ink)", letterSpacing: "-0.02em" }}
                  >
                    Track your own obsessions.
                  </p>
                  <p className="font-sans text-sm" style={{ color: "var(--ink-muted)" }}>
                    Free forever. Log what you&apos;re fixated on and watch the days pile up.
                  </p>
                </div>
                <Link
                  href="/auth/signup"
                  className="shrink-0 px-6 py-3 rounded-2xl font-sans text-sm font-semibold transition-all hover:opacity-90 hover:-translate-y-px active:scale-[0.98]"
                  style={{ background: "var(--ink)", color: "var(--bg)", boxShadow: "0 4px 24px var(--accent)" }}
                >
                  Join free →
                </Link>
              </div>
            </div>
          )}
        </main>
      </div>
      <Footer />
    </>
  );
}
