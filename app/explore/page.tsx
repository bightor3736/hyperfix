import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { LogoDark } from "@/components/Logo";
import type { Metadata } from "next";
import { ExploreTabSwitcher } from "./ExploreTabSwitcher";

export const metadata: Metadata = {
  title: "Explore · Hyperfix",
  description: "What everyone's unwell about right now.",
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
    <div className="min-h-screen" style={{ background: "#0A0A0A", color: "#F4F4F4" }}>
      {/* Nav */}
      <nav className="border-b" style={{ borderColor: "rgba(244,244,244,0.07)" }}>
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" aria-label="Hyperfix home">
            <LogoDark size="sm" />
          </Link>
          {user ? (
            <Link
              href="/dashboard"
              className="font-mono text-[11px] uppercase tracking-widest transition-colors"
              style={{ color: "rgba(244,244,244,0.5)" }}
            >
              My fixes →
            </Link>
          ) : (
            <Link
              href="/auth/login"
              className="font-mono text-[11px] uppercase tracking-widest transition-colors"
              style={{ color: "rgba(244,244,244,0.5)" }}
            >
              Log in →
            </Link>
          )}
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="mb-10">
          <h1
            className="font-display font-medium mb-3"
            style={{
              fontSize: "clamp(40px, 7vw, 72px)",
              letterSpacing: "-0.03em",
              lineHeight: 1,
              color: "#F4F4F4",
            }}
          >
            Explore
          </h1>
          <p className="font-mono text-sm" style={{ color: "rgba(244,244,244,0.4)" }}>
            What everyone&apos;s unwell about right now.
          </p>
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
