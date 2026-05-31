"use client";

import { useState, useMemo, useRef } from "react";
import Link from "next/link";
import { CategoryIcon, CATEGORY_COLOR, categoryLabel } from "@/components/CategoryIcon";
import { TombstoneIcon } from "@/components/MilestoneIcons";

export type GraveyardFix = {
  id: string;
  title: string;
  category: string;
  status: string;
  started_at: string;
  ended_at: string;
  eulogy: string | null;
};

const TEAL = "var(--accent)";
const CARD_BG = "var(--bg)";
const CARD_BORDER = "var(--line)";

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function getDayCount(startedAt: string, endedAt: string): number {
  const start = new Date(startedAt);
  const end = new Date(endedAt);
  return Math.max(1, Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)));
}

function writtenAgo(dateStr: string): string {
  const end = new Date(dateStr);
  const now = new Date();
  const diff = now.getTime() - end.getTime();
  const days = Math.floor(diff / 86_400_000);
  if (days < 1) return "today";
  if (days === 1) return "yesterday";
  if (days < 30) return `${days} days ago`;
  const months = Math.floor(days / 30);
  if (months < 12) return `${months} month${months !== 1 ? "s" : ""} ago`;
  const years = Math.floor(months / 12);
  return `${years} year${years !== 1 ? "s" : ""} ago`;
}

function TombstoneCard({ fix, index }: { fix: GraveyardFix; index: number }) {
  const days = getDayCount(fix.started_at, fix.ended_at);
  const accent = CATEGORY_COLOR[fix.category?.toLowerCase()] ?? CATEGORY_COLOR.other;
  const delay = `${Math.min(index, 8) * 50}ms`;

  return (
    <Link
      href={`/dashboard/fix/${fix.id}`}
      className="motion-card group relative overflow-hidden rounded-3xl p-6 sm:p-7 flex flex-col gap-5 anim-fadeUp transition-colors"
      style={{
        background: CARD_BG,
        border: `1px solid ${CARD_BORDER}`,
        animationDelay: delay,
        ["--hover-border" as string]: accent,
      }}
    >
      {/* Tombstone decoration top right */}
      <div
        aria-hidden
        className="absolute top-5 right-5 opacity-30 transition-opacity group-hover:opacity-60"
        style={{ color: "var(--ink-muted)" }}
      >
        <TombstoneIcon size={22} />
      </div>

      {/* Category chip */}
      <div className="flex items-center gap-2">
        <span
          className="inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-widest rounded-full px-2.5 py-1"
          style={{
            background: `${accent}14`,
            color: accent,
            border: `1px solid ${accent}33`,
          }}
        >
          <CategoryIcon category={fix.category} size={11} color={accent} />
          {categoryLabel(fix.category)}
        </span>
      </div>

      {/* Title — italic serif, "in memoriam" feel */}
      <h3
        className="font-display"
        style={{
          color: "var(--ink)",
          fontSize: "clamp(22px, 2.6vw, 26px)",
          fontWeight: 600,
          fontStyle: "italic",
          letterSpacing: "-0.015em",
          lineHeight: 1.15,
          display: "-webkit-box",
          WebkitLineClamp: 2,
          WebkitBoxOrient: "vertical",
          overflow: "hidden",
        }}
      >
        {fix.title}
      </h3>

      {/* Date range · days */}
      <p
        className="font-sans text-[13px] tabular-nums"
        style={{ color: "var(--ink-muted)" }}
      >
        {formatDate(fix.started_at)} – {formatDate(fix.ended_at)}{" "}
        <span style={{ color: "var(--ink-faint)" }}>·</span>{" "}
        <span style={{ color: TEAL }}>{days} day{days === 1 ? "" : "s"}</span>
      </p>

      {/* Eulogy quote */}
      {fix.eulogy ? (
        <blockquote
          className="font-display m-0 pl-4"
          style={{
            borderLeft: `2px solid ${accent}66`,
            color: "var(--ink-muted)",
            fontStyle: "italic",
            fontSize: 15,
            lineHeight: 1.5,
            display: "-webkit-box",
            WebkitLineClamp: 3,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}
        >
          &ldquo;{fix.eulogy}&rdquo;
        </blockquote>
      ) : (
        <p
          className="font-sans text-sm"
          style={{ color: "var(--ink-faint)", fontStyle: "italic" }}
        >
          No eulogy. Click to write one.
        </p>
      )}

      <p
        className="font-mono text-[10px] uppercase tracking-widest mt-auto"
        style={{ color: "var(--ink-faint)" }}
      >
        buried {writtenAgo(fix.ended_at)}
      </p>
    </Link>
  );
}

const PAGE_SIZE = 24;

export function GraveyardGrid({ fixes }: { fixes: GraveyardFix[] }) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<string>("all");
  const [shown, setShown] = useState(PAGE_SIZE);

  const categories = useMemo(() => {
    const set = new Set(fixes.map((f) => f.category));
    return ["all", ...Array.from(set).sort()];
  }, [fixes]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return fixes.filter((f) => {
      if (category !== "all" && f.category !== category) return false;
      if (!q) return true;
      return (
        f.title.toLowerCase().includes(q) ||
        (f.eulogy?.toLowerCase().includes(q) ?? false)
      );
    });
  }, [fixes, query, category]);

  // Reset pagination when filter changes
  const prevQuery = useRef(query);
  const prevCategory = useRef(category);
  if (prevQuery.current !== query || prevCategory.current !== category) {
    prevQuery.current = query;
    prevCategory.current = category;
    if (shown !== PAGE_SIZE) setShown(PAGE_SIZE);
  }

  const visible = filtered.slice(0, shown);
  const hasMore = filtered.length > shown;

  return (
    <div>
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search the graveyard…"
          className="font-sans text-sm flex-1 rounded-2xl px-4 py-2.5 outline-none transition-colors focus:border-[rgba(111,138,99,0.3)]"
          style={{
            background: CARD_BG,
            border: `1px solid ${CARD_BORDER}`,
            color: "var(--ink)",
          }}
        />
        {categories.length > 2 && (
          <div className="flex gap-2 flex-wrap">
            {categories.map((c) => (
              <button
                key={c}
                onClick={() => setCategory(c)}
                className="font-mono text-[10px] uppercase tracking-widest rounded-full px-3.5 py-1.5 transition-colors"
                style={
                  c === category
                    ? {
                        background: "var(--accent-soft)",
                        border: "1px solid var(--accent-soft)",
                        color: TEAL,
                      }
                    : {
                        background: "transparent",
                        border: "1px solid var(--line)",
                        color: "var(--ink-muted)",
                      }
                }
              >
                {c}
              </button>
            ))}
          </div>
        )}
      </div>

      {filtered.length === 0 ? (
        <div
          className="rounded-3xl p-12 text-center"
          style={{ background: CARD_BG, border: `1px solid ${CARD_BORDER}` }}
        >
          <p
            className="font-display text-lg"
            style={{ color: "var(--ink-muted)", fontStyle: "italic" }}
          >
            No matches.
          </p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {visible.map((fix, i) => (
              <TombstoneCard key={fix.id} fix={fix} index={i} />
            ))}
          </div>
          {hasMore && (
            <div className="flex justify-center mt-8">
              <button
                onClick={() => setShown((s) => s + PAGE_SIZE)}
                className="font-mono text-[11px] uppercase tracking-widest rounded-full px-6 py-2.5 transition-colors"
                style={{
                  background: "var(--accent-soft)",
                  border: "1px solid var(--accent)",
                  color: TEAL,
                }}
              >
                Load more · {filtered.length - shown} remaining
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
