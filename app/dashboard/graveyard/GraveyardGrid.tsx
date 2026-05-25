"use client";

import { useState, useMemo } from "react";
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

const TEAL = "#5EEAD4";
const CARD_BG = "#0F1011";
const CARD_BORDER = "rgba(255,255,255,0.06)";

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
      href={`/fix/${fix.id}`}
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
        style={{ color: "rgba(255,255,255,0.7)" }}
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
          color: "#F4F4F4",
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
        style={{ color: "rgba(255,255,255,0.5)" }}
      >
        {formatDate(fix.started_at)} – {formatDate(fix.ended_at)}{" "}
        <span style={{ color: "rgba(255,255,255,0.3)" }}>·</span>{" "}
        <span style={{ color: TEAL }}>{days} day{days === 1 ? "" : "s"}</span>
      </p>

      {/* Eulogy quote */}
      {fix.eulogy ? (
        <blockquote
          className="font-display m-0 pl-4"
          style={{
            borderLeft: `2px solid ${accent}66`,
            color: "rgba(255,255,255,0.7)",
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
          style={{ color: "rgba(255,255,255,0.35)", fontStyle: "italic" }}
        >
          No eulogy. Click to write one.
        </p>
      )}

      <p
        className="font-mono text-[10px] uppercase tracking-widest mt-auto"
        style={{ color: "rgba(255,255,255,0.3)" }}
      >
        buried {writtenAgo(fix.ended_at)}
      </p>
    </Link>
  );
}

export function GraveyardGrid({ fixes }: { fixes: GraveyardFix[] }) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<string>("all");

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

  return (
    <div>
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search the graveyard…"
          className="font-sans text-sm flex-1 rounded-2xl px-4 py-2.5 outline-none transition-colors focus:border-[rgba(94,234,212,0.4)]"
          style={{
            background: CARD_BG,
            border: `1px solid ${CARD_BORDER}`,
            color: "#F4F4F4",
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
                        background: "rgba(94,234,212,0.12)",
                        border: "1px solid rgba(94,234,212,0.3)",
                        color: TEAL,
                      }
                    : {
                        background: "rgba(244,244,244,0.04)",
                        border: "1px solid rgba(244,244,244,0.08)",
                        color: "rgba(244,244,244,0.5)",
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
            style={{ color: "rgba(244,244,244,0.5)", fontStyle: "italic" }}
          >
            No matches.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {filtered.map((fix, i) => (
            <TombstoneCard key={fix.id} fix={fix} index={i} />
          ))}
        </div>
      )}
    </div>
  );
}
