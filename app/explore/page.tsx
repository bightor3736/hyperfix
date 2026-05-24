import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { LogoLockup } from "@/components/Logo";
import type { Metadata } from "next";
import { ExploreTabSwitcher } from "./ExploreTabSwitcher";

const NOISE_URL =
  "url(\"data:image/svg+xml;utf8,<svg viewBox='0 0 240 240' xmlns='http://www.w3.org/2000/svg'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 0.55 0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>\")";

export const metadata: Metadata = {
  title: "Explore · Hyperfix",
  description: "What everyone's obsessed with right now.",
};

type Fix = {
  id: string;
  title: string;
  category: string;
  status: string;
  intensity: number;
  note: string | null;
  started_at: string;
  ended_at: string | null;
  created_at: string;
  is_public: boolean;
  profiles: {
    username: string | null;
    display_name: string | null;
    avatar_url: string | null;
  } | null;
};

type ReactionCounts = Record<string, number>;

export type ActivityItem = {
  type: "started" | "ended";
  fixId: string;
  fixTitle: string;
  fixCategory: string;
  daysCount: number;
  username: string | null;
  displayName: string | null;
  avatarUrl: string | null;
  timestamp: string;
};

async function getReactionMap(supabase: Awaited<ReturnType<typeof createClient>>, fixIds: string[]) {
  if (fixIds.length === 0) return {};
  const { data: reactions } = await supabase
    .from("fix_reactions")
    .select("fix_id, emoji")
    .in("fix_id", fixIds);

  const reactionMap: Record<string, ReactionCounts> = {};
  for (const r of reactions ?? []) {
    if (!reactionMap[r.fix_id]) reactionMap[r.fix_id] = {};
    reactionMap[r.fix_id][r.emoji] = (reactionMap[r.fix_id][r.emoji] ?? 0) + 1;
  }
  return reactionMap;
}

export default async function ExplorePage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Everyone feed
  const { data: everyoneFixes } = await supabase
    .from("fixes")
    .select("*, profiles(username, display_name, avatar_url)")
    .eq("is_public", true)
    .is("ended_at", null)
    .order("created_at", { ascending: false })
    .limit(48);

  const typedEveryoneFixes = (everyoneFixes ?? []) as Fix[];
  const everyoneReactions = await getReactionMap(supabase, typedEveryoneFixes.map((f) => f.id));

  // Following feed (only if logged in)
  let followingFixes: Fix[] | null = null;
  let followingReactions: Record<string, ReactionCounts> = {};
  let activityItems: ActivityItem[] | null = null;

  if (user) {
    const { data: followRows } = await supabase
      .from("follows")
      .select("following_id")
      .eq("follower_id", user.id);

    const followingIds = (followRows ?? []).map((r: { following_id: string }) => r.following_id);

    if (followingIds.length > 0) {
      const { data: ffixes } = await supabase
        .from("fixes")
        .select("*, profiles(username, display_name, avatar_url)")
        .eq("is_public", true)
        .is("ended_at", null)
        .in("user_id", followingIds)
        .order("created_at", { ascending: false })
        .limit(48);

      followingFixes = (ffixes ?? []) as Fix[];
      followingReactions = await getReactionMap(supabase, followingFixes.map((f) => f.id));

      // Activity feed — recent starts + ends from followed users (last 14 days)
      const fourteenDaysAgo = new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString();

      const [{ data: startedRaw }, { data: endedRaw }] = await Promise.all([
        supabase
          .from("fixes")
          .select("id, title, category, started_at, ended_at, created_at, profiles(username, display_name, avatar_url)")
          .eq("is_public", true)
          .in("user_id", followingIds)
          .gte("created_at", fourteenDaysAgo)
          .order("created_at", { ascending: false })
          .limit(30),
        supabase
          .from("fixes")
          .select("id, title, category, started_at, ended_at, profiles(username, display_name, avatar_url)")
          .eq("is_public", true)
          .in("user_id", followingIds)
          .gte("ended_at", fourteenDaysAgo)
          .not("ended_at", "is", null)
          .order("ended_at", { ascending: false })
          .limit(30),
      ]);

      const items: ActivityItem[] = [];

      type RawStartedFix = { id: string; title: string; category: string; started_at: string; ended_at: string | null; created_at: string; profiles: { username: string | null; display_name: string | null; avatar_url: string | null } | null };
      for (const fix of (startedRaw ?? []) as unknown as RawStartedFix[]) {
        items.push({
          type: "started",
          fixId: fix.id,
          fixTitle: fix.title,
          fixCategory: fix.category,
          daysCount: 0,
          username: fix.profiles?.username ?? null,
          displayName: fix.profiles?.display_name ?? null,
          avatarUrl: fix.profiles?.avatar_url ?? null,
          timestamp: fix.created_at,
        });
      }

      type RawEndedFix = { id: string; title: string; category: string; started_at: string; ended_at: string | null; profiles: { username: string | null; display_name: string | null; avatar_url: string | null } | null };
      for (const fix of (endedRaw ?? []) as unknown as RawEndedFix[]) {
        const days = Math.max(1, Math.ceil((new Date(fix.ended_at!).getTime() - new Date(fix.started_at).getTime()) / (1000 * 60 * 60 * 24)));
        items.push({
          type: "ended",
          fixId: fix.id,
          fixTitle: fix.title,
          fixCategory: fix.category,
          daysCount: days,
          username: fix.profiles?.username ?? null,
          displayName: fix.profiles?.display_name ?? null,
          avatarUrl: fix.profiles?.avatar_url ?? null,
          timestamp: fix.ended_at!,
        });
      }

      items.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
      activityItems = items.slice(0, 60);
    } else {
      followingFixes = [];
      activityItems = [];
    }
  }

  const { data: allCategoryData } = await supabase
    .from("fixes")
    .select("category")
    .eq("is_public", true)
    .is("ended_at", null);

  const categoryMap: Record<string, number> = {};
  for (const row of allCategoryData ?? []) {
    categoryMap[row.category] = (categoryMap[row.category] ?? 0) + 1;
  }
  const trendingCategories = Object.entries(categoryMap)
    .map(([category, count]) => ({ category, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 8);

  // Trending: most reacted public active fixes in last 7 days
  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
  const { data: recentReactions } = await supabase
    .from("fix_reactions")
    .select("fix_id")
    .gte("created_at", sevenDaysAgo);

  const reactionCountMap: Record<string, number> = {};
  for (const r of recentReactions ?? []) {
    reactionCountMap[r.fix_id] = (reactionCountMap[r.fix_id] ?? 0) + 1;
  }
  const topFixIds = Object.entries(reactionCountMap)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 20)
    .map(([id]) => id);

  let trendingFixes: Fix[] = [];
  let trendingReactionMap: Record<string, ReactionCounts> = {};
  if (topFixIds.length > 0) {
    const { data: trendingData } = await supabase
      .from("fixes")
      .select("*, profiles(username, display_name, avatar_url)")
      .in("id", topFixIds)
      .eq("is_public", true)
      .is("ended_at", null);
    const fixMap = new Map((trendingData ?? []).map((f) => [f.id, f]));
    trendingFixes = topFixIds.map((id) => fixMap.get(id)).filter(Boolean) as Fix[];
    trendingReactionMap = await getReactionMap(supabase, trendingFixes.map((f) => f.id));
  }

  return (
    <div className="min-h-screen relative" style={{ background: "#070708", color: "#F4F4F4" }}>
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none mix-blend-overlay"
        style={{ backgroundImage: NOISE_URL, backgroundSize: "240px 240px", opacity: 0.08 }}
      />

      {/* Nav */}
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
          href={user ? "/dashboard" : "/auth/login"}
          className="font-sans text-sm font-semibold px-5 py-2.5 transition-all duration-200 hover:opacity-95 hover:-translate-y-px active:scale-[0.98]"
          style={{
            background: "#FFFFFF",
            color: "#0A0A0A",
            borderRadius: 999,
            boxShadow: "0 4px 16px rgba(94,234,212,0.18)",
          }}
        >
          {user ? "My fixes" : "Log in"}
        </Link>
      </nav>

      <main className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-12">
        {/* Hero header card */}
        <div
          className="relative overflow-hidden rounded-3xl mb-8 p-6 sm:p-10 anim-fadeUp"
          style={{
            background:
              "radial-gradient(ellipse 80% 120% at 50% 130%, #5EEAD4 0%, #2DD4BF 14%, #0E4F47 34%, #08231F 55%, #070708 78%)",
            border: "1px solid rgba(255,255,255,0.06)",
          }}
        >
          <div
            aria-hidden
            className="absolute inset-0 pointer-events-none mix-blend-overlay"
            style={{ backgroundImage: NOISE_URL, backgroundSize: "200px 200px", opacity: 0.55 }}
          />
          <div
            aria-hidden
            className="absolute inset-0 pointer-events-none"
            style={{ background: "linear-gradient(180deg, #070708 0%, rgba(7,7,8,0.45) 30%, transparent 100%)" }}
          />
          <div className="relative">
            <span
              className="inline-flex items-center font-sans text-xs rounded-full px-3 py-1 mb-5"
              style={{
                background: "rgba(94,234,212,0.12)",
                color: "#5EEAD4",
                border: "1px solid rgba(94,234,212,0.25)",
              }}
            >
              explore
            </span>
            <h1
              className="font-display"
              style={{
                color: "#FFFFFF",
                fontSize: "clamp(36px, 6vw, 60px)",
                lineHeight: 1.02,
                letterSpacing: "-0.02em",
                fontWeight: 600,
              }}
            >
              What everyone&apos;s
              <br />
              obsessed with right now.
            </h1>
            <p className="mt-4 font-sans text-base sm:text-lg" style={{ color: "rgba(255,255,255,0.72)" }}>
              Browse the obsessions running other people&apos;s lives.
            </p>
            <form action="/search" method="GET" className="mt-6 flex gap-2 max-w-md">
              <input
                type="text"
                name="q"
                placeholder="Search fixes, tags, people…"
                aria-label="Search"
                className="font-sans text-sm flex-1 rounded-full px-4 py-2.5 outline-none"
                style={{
                  background: "rgba(7,7,8,0.6)",
                  border: "1px solid rgba(255,255,255,0.16)",
                  color: "#F4F4F4",
                }}
              />
              <button
                type="submit"
                className="font-sans text-sm font-semibold px-5 py-2.5 rounded-full transition-all hover:opacity-90 active:scale-[0.98]"
                style={{ background: "#5EEAD4", color: "#0A0A0A" }}
              >
                Search
              </button>
            </form>
          </div>
        </div>

        <ExploreTabSwitcher
          everyoneFixes={typedEveryoneFixes}
          everyoneReactions={everyoneReactions}
          followingFixes={followingFixes}
          followingReactions={followingReactions}
          trendingCategories={trendingCategories}
          activityItems={activityItems}
          trendingFixes={trendingFixes}
          trendingReactionMap={trendingReactionMap}
        />
      </main>
    </div>
  );
}
