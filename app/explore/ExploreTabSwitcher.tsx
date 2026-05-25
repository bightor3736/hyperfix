"use client";

import { useState } from "react";
import Link from "next/link";
import { FixStatusPill, type FixStatus } from "@/components/FixStatusPill";
import { CategoryIcon } from "@/components/CategoryIcon";
import { FlameIcon, BoltIcon } from "@/components/LandingIcons";
import { SkullIcon, TrophyIcon } from "@/components/MilestoneIcons";
import {
  REACTION_TYPES,
  normalizeReactionCounts,
  getReactionMeta,
  type ReactionType,
} from "@/lib/reactions";
import type { ActivityItem } from "./page";

const VALID_STATUSES: FixStatus[] = [
  "Day 1", "Obsessing", "On loop", "Fading", "Post-fix", "Ended", "Dormant", "Send help",
];

function isValidStatus(s: string): s is FixStatus {
  return VALID_STATUSES.includes(s as FixStatus);
}

function dayCount(startedAt: string, endedAt: string | null): number {
  const start = new Date(startedAt);
  const end = endedAt ? new Date(endedAt) : new Date();
  return Math.max(1, Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)));
}

function getInitials(displayName: string | null, username: string | null): string {
  const name = displayName ?? username ?? "?";
  return name.slice(0, 2).toUpperCase();
}

function intensityRGB(intensity: number): string {
  if (intensity >= 8) return "230,57,70";
  if (intensity >= 6) return "251,146,60";
  return "168,85,247";
}

function intensityColor(intensity: number): string {
  if (intensity >= 8) return "#E63946";
  if (intensity >= 6) return "#FB923C";
  return "#5EEAD4";
}

type MilestoneIconComponent = (p: { size?: number; className?: string }) => React.JSX.Element;
function getMilestone(days: number): { Icon: MilestoneIconComponent; label: string } | null {
  if (days >= 365) return { Icon: TrophyIcon, label: "1 year" };
  if (days >= 100) return { Icon: SkullIcon, label: "100 days" };
  if (days >= 30) return { Icon: BoltIcon, label: "30 days" };
  if (days >= 7) return { Icon: FlameIcon, label: "7 days" };
  return null;
}

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
  created_at: string;
  profiles: {
    username: string | null;
    display_name: string | null;
    avatar_url: string | null;
  } | null;
};

type ReactionCounts = Record<string, number>;

const TOP_REACTIONS: ReactionType[] = REACTION_TYPES.map((r) => r.key);

function MiniReactions({ counts }: { counts: ReactionCounts }) {
  const normalized = normalizeReactionCounts(counts);
  const top = TOP_REACTIONS.filter((k) => normalized[k] > 0).slice(0, 3);
  if (top.length === 0) return null;
  return (
    <div className="flex items-center gap-1.5 flex-wrap">
      {top.map((key) => {
        const { Icon, label } = getReactionMeta(key);
        return (
          <span
            key={key}
            className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 font-mono text-[11px] uppercase tracking-widest"
            style={{
              background: "rgba(244,244,244,0.06)",
              border: "1px solid rgba(244,244,244,0.1)",
              color: "rgba(244,244,244,0.5)",
            }}
            aria-label={label}
          >
            <Icon size={12} />
            <span className="tabular-nums">{normalized[key]}</span>
          </span>
        );
      })}
    </div>
  );
}

function FixCard({ fix, reactions }: { fix: Fix; reactions: ReactionCounts }) {
  const [hovered, setHovered] = useState(false);

  const profile = fix.profiles;
  const username = profile?.username ?? null;
  const displayName = profile?.display_name ?? null;
  const avatarUrl = profile?.avatar_url ?? null;
  const days = dayCount(fix.started_at, fix.ended_at);
  const status = isValidStatus(fix.status) ? fix.status : "Day 1";
  const initials = getInitials(displayName, username);
  const rgb = intensityRGB(fix.intensity);
  const color = intensityColor(fix.intensity);
  const milestone = getMilestone(days);
  const pct = (fix.intensity / 10) * 100;

  const ambientAlpha = fix.intensity >= 8 ? 0.12 : fix.intensity >= 6 ? 0.06 : 0.03;
  const hoverAlpha = fix.intensity >= 8 ? 0.24 : fix.intensity >= 6 ? 0.15 : 0.09;

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="rounded-2xl p-4 mb-4 group"
      style={{
        background: hovered ? "#141416" : "#111113",
        border: `1px solid ${hovered ? `rgba(${rgb},0.28)` : "rgba(244,244,244,0.07)"}`,
        boxShadow: hovered
          ? `0 8px 28px rgba(${rgb},${hoverAlpha})`
          : `0 0 18px rgba(${rgb},${ambientAlpha})`,
        breakInside: "avoid",
        transition: "all 0.22s ease",
      }}
    >
      <Link href={`/fix/${fix.id}`} className="block">
        {/* Category + status + milestone */}
        <div className="flex items-center gap-2 flex-wrap mb-3">
          <span
            className="inline-flex items-center gap-1 font-mono uppercase tracking-widest rounded-full px-2.5 py-1"
            style={{
              fontSize: 9,
              background: `rgba(${rgb},0.1)`,
              border: `1px solid rgba(${rgb},0.22)`,
              color,
            }}
          >
            <CategoryIcon category={fix.category} size={10} />
            {fix.category}
          </span>
          <FixStatusPill status={status} size="sm" />
          {milestone && (
            <span
              className="inline-flex items-center gap-1 font-mono rounded-full px-1.5 py-0.5 uppercase tracking-widest"
              style={{
                fontSize: 9,
                background: `rgba(${rgb},0.1)`,
                border: `1px solid rgba(${rgb},0.22)`,
                color,
              }}
            >
              <milestone.Icon size={10} />
              {milestone.label}
            </span>
          )}
        </div>

        {/* Title */}
        <h2
          className="font-display font-medium mb-2 group-hover:text-[#5EEAD4] transition-colors"
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
        </h2>

        {/* Day count + intensity number */}
        <div className="flex items-center justify-between mb-2">
          <p className="font-mono text-sm font-bold" style={{ color }}>
            {days} {days === 1 ? "day" : "days"}
          </p>
          <span className="font-mono text-[11px]" style={{ color: "rgba(244,244,244,0.35)" }}>
            {fix.intensity}/10
          </span>
        </div>

        {/* Intensity bar */}
        <div className="h-1 rounded-full overflow-hidden mb-3" style={{ background: "rgba(244,244,244,0.07)" }}>
          <div
            className="h-full rounded-full"
            style={{
              width: `${pct}%`,
              background: `linear-gradient(to right, rgba(${rgb},0.5), ${color})`,
              boxShadow: `0 0 6px rgba(${rgb},0.6)`,
            }}
          />
        </div>

        {/* Note */}
        {fix.note && (
          <p
            className="italic mb-3"
            style={{
              fontSize: 13,
              color: "rgba(244,244,244,0.38)",
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
              lineHeight: 1.5,
            }}
          >
            {fix.note}
          </p>
        )}

        {/* Footer */}
        <div
          className="flex items-center justify-between gap-3 mt-3 pt-3"
          style={{ borderTop: "1px solid rgba(244,244,244,0.06)" }}
        >
          <div className="flex items-center gap-2 min-w-0">
            <div
              className="shrink-0 w-6 h-6 rounded-full flex items-center justify-center font-mono font-bold overflow-hidden"
              style={{
                background: "rgba(94,234,212,0.12)",
                border: "1px solid rgba(94,234,212,0.2)",
                fontSize: 9,
                color: "#5EEAD4",
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
              <span className="font-mono truncate" style={{ fontSize: 10, color: "rgba(244,244,244,0.38)" }}>
                @{username}
              </span>
            )}
          </div>
          <MiniReactions counts={reactions} />
        </div>
      </Link>

      {/* Twitter share — outside Link to avoid nested a */}
      {hovered && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            const url = `${window.location.origin}/fix/${fix.id}`;
            const text = `day ${days} of ${fix.title}. intensity: ${fix.intensity}/10. i'm so normal 😭 ${url}`;
            window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`, "_blank", "noopener,noreferrer");
          }}
          className="mt-2 w-full flex items-center justify-center gap-1.5 py-1.5 rounded-xl font-mono transition-all hover:opacity-80"
          style={{
            fontSize: 10,
            background: "rgba(244,244,244,0.04)",
            border: "1px solid rgba(244,244,244,0.08)",
            color: "rgba(244,244,244,0.35)",
          }}
        >
          <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor">
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L1.254 2.25H8.08l4.26 5.632zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
          </svg>
          post this
        </button>
      )}
    </div>
  );
}

function formatTimeAgo(timestamp: string): string {
  const diff = Date.now() - new Date(timestamp).getTime();
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);
  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes}m`;
  if (hours < 24) return `${hours}h`;
  return `${days}d`;
}

function ActivityCard({ item }: { item: ActivityItem }) {
  const initials = getInitials(item.displayName, item.username);
  const timeAgo = formatTimeAgo(item.timestamp);

  return (
    <div
      className="flex items-start gap-3 py-4"
      style={{ borderBottom: "1px solid rgba(244,244,244,0.06)" }}
    >
      <div
        className="shrink-0 w-8 h-8 rounded-full flex items-center justify-center font-mono font-bold overflow-hidden"
        style={{
          background: "rgba(94,234,212,0.12)",
          border: "1px solid rgba(94,234,212,0.2)",
          fontSize: 10,
          color: "#5EEAD4",
        }}
      >
        {item.avatarUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={item.avatarUrl} alt={item.username ?? "user"} className="w-full h-full object-cover" />
        ) : (
          initials
        )}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-3">
          <p className="text-sm leading-snug" style={{ color: "#F4F4F4" }}>
            {item.username ? (
              <Link href={`/u/${item.username}`} className="font-medium hover:text-[#5EEAD4] transition-colors">
                @{item.username}
              </Link>
            ) : (
              <span className="font-medium">someone</span>
            )}{" "}
            <span style={{ color: "rgba(244,244,244,0.45)" }}>
              {item.type === "started" ? "started tracking" : "finished their fixation on"}
            </span>{" "}
            <Link href={`/fix/${item.fixId}`} className="font-display font-medium hover:text-[#5EEAD4] transition-colors">
              {item.fixTitle}
            </Link>
            {item.type === "ended" && item.daysCount > 0 && (
              <span style={{ color: "rgba(244,244,244,0.35)" }}> after {item.daysCount} days</span>
            )}
          </p>
          <span className="shrink-0 font-mono tabular-nums" style={{ fontSize: 10, color: "rgba(244,244,244,0.3)" }}>
            {timeAgo}
          </span>
        </div>
        <div className="flex items-center gap-1.5 mt-1.5">
          <span
            className="inline-flex items-center gap-1 font-mono uppercase tracking-widest rounded-full px-2 py-0.5"
            style={{
              fontSize: 9,
              background: item.type === "ended" ? "rgba(244,244,244,0.05)" : "rgba(94,234,212,0.08)",
              border: item.type === "ended" ? "1px solid rgba(244,244,244,0.1)" : "1px solid rgba(94,234,212,0.2)",
              color: item.type === "ended" ? "rgba(244,244,244,0.4)" : "#5EEAD4",
            }}
          >
            <CategoryIcon category={item.fixCategory} size={9} />
            {item.fixCategory}
          </span>
          {item.type === "ended" && (
            <span className="font-mono" style={{ fontSize: 9, color: "rgba(244,244,244,0.25)" }}>◼ ended</span>
          )}
        </div>
      </div>
    </div>
  );
}

type Props = {
  everyoneFixes: Fix[];
  everyoneReactions: Record<string, ReactionCounts>;
  followingFixes: Fix[] | null;
  followingReactions: Record<string, ReactionCounts>;
  trendingCategories: { category: string; count: number }[];
  activityItems: ActivityItem[] | null;
  trendingFixes: Fix[];
  trendingReactionMap: Record<string, ReactionCounts>;
};

function TabButton({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="px-4 py-2 rounded-full font-mono text-[11px] uppercase tracking-widest transition-all duration-150"
      style={
        active
          ? { background: "#5EEAD4", color: "#F4F4F4", border: "1px solid transparent" }
          : { background: "rgba(244,244,244,0.04)", border: "1px solid rgba(244,244,244,0.1)", color: "rgba(244,244,244,0.5)" }
      }
    >
      {label}
    </button>
  );
}

export function ExploreTabSwitcher({
  everyoneFixes,
  everyoneReactions,
  followingFixes,
  followingReactions,
  trendingCategories,
  activityItems,
  trendingFixes,
  trendingReactionMap,
}: Props) {
  const [tab, setTab] = useState<"everyone" | "trending" | "longest" | "following" | "activity" | "cards">("everyone");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [extraFixes, setExtraFixes] = useState<Fix[]>([]);
  const [extraReactions, setExtraReactions] = useState<Record<string, ReactionCounts>>({});
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(everyoneFixes.length >= 48);

  const isLoggedIn = followingFixes !== null;

  const allEveryoneFixes = [...everyoneFixes, ...extraFixes];
  const allEveryoneReactions = { ...everyoneReactions, ...extraReactions };

  const longestFixes = [...allEveryoneFixes].sort(
    (a, b) => dayCount(a.started_at, a.ended_at) - dayCount(b.started_at, b.ended_at)
  ).reverse();

  const rawFixes =
    tab === "following" && followingFixes
      ? followingFixes
      : tab === "trending"
      ? trendingFixes
      : tab === "longest"
      ? longestFixes
      : allEveryoneFixes;
  const fixes = selectedCategory ? rawFixes.filter((f) => f.category === selectedCategory) : rawFixes;
  const reactions =
    tab === "following" ? followingReactions : tab === "trending" ? trendingReactionMap : allEveryoneReactions;

  async function loadMore() {
    setLoadingMore(true);
    try {
      const last = allEveryoneFixes.at(-1);
      const params = new URLSearchParams({ cursor: last?.created_at ?? "" });
      if (selectedCategory) params.set("category", selectedCategory);
      const res = await fetch(`/api/explore/fixes?${params}`);
      const data = await res.json();
      setExtraFixes((prev) => [...prev, ...(data.fixes ?? [])]);
      setExtraReactions((prev) => ({ ...prev, ...(data.reactions ?? {}) }));
      setHasMore(data.hasMore ?? false);
    } finally {
      setLoadingMore(false);
    }
  }

  return (
    <div>
      {/* Tab switcher */}
      <div className="flex gap-2 mb-8 overflow-x-auto scrollbar-hide pb-1">
        <TabButton label="Everyone" active={tab === "everyone"} onClick={() => setTab("everyone")} />
        <TabButton label="Cards" active={tab === "cards"} onClick={() => setTab("cards")} />
        <TabButton label="Trending" active={tab === "trending"} onClick={() => setTab("trending")} />
        <TabButton label="Longest" active={tab === "longest"} onClick={() => setTab("longest")} />
        {isLoggedIn && <TabButton label="Following" active={tab === "following"} onClick={() => setTab("following")} />}
        {isLoggedIn && <TabButton label="Activity" active={tab === "activity"} onClick={() => setTab("activity")} />}
      </div>

      {/* Cards gallery */}
      {tab === "cards" && (
        <div>
          {allEveryoneFixes.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-32 text-center">
              <p className="font-display text-2xl mb-2" style={{ color: "rgba(244,244,244,0.5)" }}>Nothing public yet.</p>
              <p className="font-mono text-sm mb-8" style={{ color: "rgba(244,244,244,0.3)" }}>Be the first.</p>
              <Link href="/auth/signup" className="font-mono text-sm px-6 py-3 rounded-full font-bold transition-opacity hover:opacity-90" style={{ background: "#5EEAD4", color: "#F4F4F4" }}>
                Start tracking →
              </Link>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {allEveryoneFixes.map((fix) => {
                  const days = dayCount(fix.started_at, fix.ended_at);
                  return (
                    <Link
                      key={fix.id}
                      href={`/fix/${fix.id}`}
                      className="group block rounded-2xl overflow-hidden transition-all hover:-translate-y-1 hover:shadow-xl"
                      style={{ border: "1px solid rgba(244,244,244,0.08)" }}
                    >
                      <div className="relative" style={{ aspectRatio: "9/16" }}>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={`/api/share/${fix.id}`}
                          alt={fix.title}
                          className="w-full h-full object-cover"
                          loading="lazy"
                        />
                        <div
                          className="absolute inset-x-0 bottom-0 p-2.5"
                          style={{ background: "linear-gradient(to top, rgba(7,7,8,0.95) 0%, transparent 100%)" }}
                        >
                          <p className="font-display text-xs font-semibold leading-snug" style={{ color: "#F4F4F4", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                            {fix.title}
                          </p>
                          <div className="flex items-center justify-between mt-1">
                            <p className="font-mono text-[10px]" style={{ color: "rgba(94,234,212,0.8)" }}>day {days}</p>
                            {fix.profiles?.username && (
                              <p className="font-mono text-[9px] truncate ml-2" style={{ color: "rgba(244,244,244,0.35)" }}>@{fix.profiles.username}</p>
                            )}
                          </div>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
              {hasMore && (
                <div className="flex justify-center mt-10">
                  <button
                    onClick={loadMore}
                    disabled={loadingMore}
                    className="px-8 py-3 rounded-full font-mono text-[11px] uppercase tracking-widest transition-all hover:opacity-80 disabled:opacity-50"
                    style={{ background: "rgba(244,244,244,0.06)", border: "1px solid rgba(244,244,244,0.12)", color: "rgba(244,244,244,0.6)" }}
                  >
                    {loadingMore ? "Loading…" : "Load more"}
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      )}

      {/* Find your people */}
      {tab === "everyone" && !selectedCategory && trendingCategories.length > 0 && allEveryoneFixes.length > 0 && (
        <div className="mb-8 rounded-3xl p-5 sm:p-6" style={{ background: "#0F1011", border: "1px solid rgba(255,255,255,0.06)" }}>
          <p className="font-mono text-[10px] uppercase tracking-widest mb-4" style={{ color: "rgba(244,244,244,0.3)" }}>
            find your people
          </p>
          <div className="flex flex-col gap-3">
            {trendingCategories.slice(0, 5).map(({ category, count }) => {
              const sample = allEveryoneFixes.filter((f) => f.category === category).slice(0, 4);
              return (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className="flex items-center gap-3 w-full text-left rounded-2xl p-3 transition-all hover:bg-[rgba(255,255,255,0.03)]"
                  style={{ border: "1px solid rgba(255,255,255,0.06)" }}
                >
                  <span style={{ flexShrink: 0, color: "rgba(244,244,244,0.6)" }}>
                    <CategoryIcon category={category} size={22} />
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="font-sans text-sm font-medium capitalize" style={{ color: "#F4F4F4" }}>{category}</p>
                    <p className="font-mono text-[10px]" style={{ color: "rgba(244,244,244,0.35)" }}>{count} {count === 1 ? "person" : "people"} tracking this right now</p>
                  </div>
                  <div className="flex -space-x-2 shrink-0">
                    {sample.map((fix) => (
                      fix.profiles?.avatar_url ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          key={fix.id}
                          src={fix.profiles.avatar_url}
                          alt={fix.profiles.display_name ?? ""}
                          className="w-7 h-7 rounded-full object-cover"
                          style={{ border: "2px solid #0F1011" }}
                        />
                      ) : (
                        <div
                          key={fix.id}
                          className="w-7 h-7 rounded-full flex items-center justify-center font-mono text-[10px]"
                          style={{ background: "rgba(94,234,212,0.15)", border: "2px solid #0F1011", color: "#5EEAD4" }}
                        >
                          {(fix.profiles?.display_name ?? fix.profiles?.username ?? "?").slice(0, 1).toUpperCase()}
                        </div>
                      )
                    ))}
                  </div>
                  <span className="font-mono text-[10px] shrink-0" style={{ color: "rgba(94,234,212,0.6)" }}>see all →</span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Activity feed */}
      {tab === "activity" && (
        <div className="max-w-2xl">
          {!activityItems || activityItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-32 text-center">
              <p className="font-display text-2xl mb-2" style={{ color: "rgba(244,244,244,0.5)" }}>Nothing yet.</p>
              <p className="font-mono text-sm" style={{ color: "rgba(244,244,244,0.3)" }}>Follow people to see their activity here.</p>
            </div>
          ) : (
            <div>{activityItems.map((item, i) => <ActivityCard key={`${item.type}-${item.fixId}-${i}`} item={item} />)}</div>
          )}
        </div>
      )}

      {/* Category filter pills */}
      {tab !== "activity" && tab !== "trending" && trendingCategories.length > 0 && (
        <div className="overflow-x-auto no-scrollbar mb-8 -mx-1 px-1">
          <div className="flex gap-2 w-max">
            {trendingCategories.map(({ category, count }) => {
              const isSelected = selectedCategory === category;
              return (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(isSelected ? null : category)}
                  className="shrink-0 flex items-center gap-1.5 rounded-full px-3 py-1.5 font-mono text-[11px] uppercase tracking-widest transition-all duration-150"
                  style={
                    isSelected
                      ? { background: "#5EEAD4", color: "#F4F4F4", border: "1px solid transparent" }
                      : { background: "#111113", border: "1px solid rgba(244,244,244,0.1)", color: "rgba(244,244,244,0.5)" }
                  }
                >
                  <CategoryIcon category={category} size={11} />
                  <span>{category}</span>
                  <span className="font-mono tabular-nums" style={{ color: isSelected ? "rgba(244,244,244,0.5)" : "rgba(244,244,244,0.3)", fontSize: 10 }}>
                    · {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Feed */}
      {tab !== "activity" && (
        fixes.length === 0 && !loadingMore ? (
          <div className="flex flex-col items-center justify-center py-32 text-center">
            {selectedCategory && tab !== "trending" ? (
              <>
                <p className="font-display text-2xl mb-2" style={{ color: "rgba(244,244,244,0.5)" }}>Nothing here yet.</p>
                <p className="font-mono text-sm mb-6" style={{ color: "rgba(244,244,244,0.3)" }}>No public fixes in this category.</p>
                <button onClick={() => setSelectedCategory(null)} className="font-mono text-sm px-4 py-2 rounded-full transition-all duration-150"
                  style={{ background: "rgba(244,244,244,0.06)", border: "1px solid rgba(244,244,244,0.1)", color: "rgba(244,244,244,0.5)" }}>
                  Clear filter
                </button>
              </>
            ) : tab === "trending" ? (
              <>
                <p className="font-display text-2xl mb-2" style={{ color: "rgba(244,244,244,0.5)" }}>Nothing trending yet.</p>
                <p className="font-mono text-sm" style={{ color: "rgba(244,244,244,0.3)" }}>Be the first to react to fixes.</p>
              </>
            ) : tab === "following" ? (
              <>
                <p className="font-display text-2xl mb-2" style={{ color: "rgba(244,244,244,0.5)" }}>Nobody yet.</p>
                <p className="font-mono text-sm" style={{ color: "rgba(244,244,244,0.3)" }}>Follow people to see their fixes here.</p>
              </>
            ) : (
              <>
                <p className="font-display text-2xl mb-2" style={{ color: "rgba(244,244,244,0.5)" }}>Nothing public yet.</p>
                <p className="font-mono text-sm mb-8" style={{ color: "rgba(244,244,244,0.3)" }}>Be the first.</p>
                <Link href="/auth/signup" className="font-mono text-sm px-6 py-3 rounded-full font-bold transition-opacity hover:opacity-90"
                  style={{ background: "#5EEAD4", color: "#F4F4F4" }}>
                  Start tracking →
                </Link>
              </>
            )}
          </div>
        ) : (
          <>
            <div className="masonry-grid" style={{ columnGap: "16px" }}>
              {fixes.map((fix) => <FixCard key={fix.id} fix={fix} reactions={reactions[fix.id] ?? {}} />)}
            </div>
            {tab === "everyone" && hasMore && (
              <div className="flex justify-center mt-10">
                <button
                  onClick={loadMore}
                  disabled={loadingMore}
                  className="px-8 py-3 rounded-full font-mono text-[11px] uppercase tracking-widest transition-all hover:opacity-80 disabled:opacity-50"
                  style={{ background: "rgba(244,244,244,0.06)", border: "1px solid rgba(244,244,244,0.12)", color: "rgba(244,244,244,0.6)" }}
                >
                  {loadingMore ? "Loading…" : "Load more"}
                </button>
              </div>
            )}
          </>
        )
      )}
    </div>
  );
}
