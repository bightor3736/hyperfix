"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { FixStatusPill } from "@/components/FixStatusPill";

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
const NOISE_URL =
  "url(\"data:image/svg+xml;utf8,<svg viewBox='0 0 240 240' xmlns='http://www.w3.org/2000/svg'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 0.55 0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>\")";

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

function getDayCount(startedAt: string, endedAt: string): number {
  const start = new Date(startedAt);
  const end = new Date(endedAt);
  return Math.max(1, Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)));
}

function timeAgo(dateStr: string): string {
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
  const rested = timeAgo(fix.ended_at);
  const delay = `${Math.min(index, 6) * 60}ms`;

  return (
    <div
      className="motion-card relative overflow-hidden rounded-3xl p-6 flex flex-col gap-4 anim-fadeUp"
      style={{ background: CARD_BG, border: `1px solid ${CARD_BORDER}`, animationDelay: delay }}
    >
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none mix-blend-overlay"
        style={{ backgroundImage: NOISE_URL, backgroundSize: "240px 240px", opacity: 0.22 }}
      />
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{ background: "radial-gradient(ellipse 80% 40% at 50% 110%, rgba(94,234,212,0.08), transparent 70%)" }}
      />

      <div className="relative flex items-center justify-between gap-2 flex-wrap">
        <div className="flex items-center gap-2">
          <span
            className="inline-flex items-center font-sans text-[11px] rounded-full px-2.5 py-0.5"
            style={{ background: "rgba(94,234,212,0.10)", color: TEAL, border: "1px solid rgba(94,234,212,0.22)" }}
          >
            {fix.category}
          </span>
          <FixStatusPill status="Ended" size="sm" />
        </div>
        <span className="font-sans text-xs" style={{ color: "rgba(255,255,255,0.35)" }}>
          {rested}
        </span>
      </div>

      <Link href={`/dashboard/fix/${fix.id}`} className="relative">
        <h3
          className="font-display transition-colors hover:text-[#5EEAD4]"
          style={{
            color: "#FFFFFF",
            fontSize: 19,
            fontWeight: 600,
            letterSpacing: "-0.01em",
            lineHeight: 1.18,
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}
        >
          {fix.title}
        </h3>
      </Link>

      <div className="relative">
        <div className="flex items-baseline gap-2 mb-1">
          <span
            className="font-display leading-none tabular-nums"
            style={{ color: TEAL, fontSize: 44, fontWeight: 600, letterSpacing: "-0.04em" }}
          >
            {days}
          </span>
          <span className="font-sans text-sm" style={{ color: "rgba(255,255,255,0.5)" }}>
            days of your life
          </span>
        </div>
        <p className="font-sans text-xs" style={{ color: "rgba(255,255,255,0.35)" }}>
          {formatDate(fix.started_at)} — {formatDate(fix.ended_at)}
        </p>
      </div>

      {fix.eulogy ? (
        <blockquote
          className="relative font-display text-[14px] leading-relaxed pl-4 m-0"
          style={{ borderLeft: `2px solid ${TEAL}`, color: "rgba(255,255,255,0.7)", fontStyle: "italic" }}
        >
          &ldquo;{fix.eulogy}&rdquo;
        </blockquote>
      ) : (
        <Link
          href={`/dashboard/fix/${fix.id}`}
          className="motion-link relative inline-flex font-sans text-sm transition-colors"
          style={{ color: TEAL }}
        >
          Write a eulogy →
        </Link>
      )}
    </div>
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
          className="font-sans text-sm flex-1 rounded-2xl px-4 py-2.5 outline-none"
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
                className="font-mono text-[11px] uppercase tracking-widest rounded-full px-3.5 py-1.5 transition-colors"
                style={
                  c === category
                    ? { background: "rgba(94,234,212,0.12)", border: "1px solid rgba(94,234,212,0.3)", color: TEAL }
                    : { background: "rgba(244,244,244,0.04)", border: "1px solid rgba(244,244,244,0.08)", color: "rgba(244,244,244,0.5)" }
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
          <p className="font-display text-lg" style={{ color: "rgba(244,244,244,0.5)" }}>
            No matches.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((fix, i) => (
            <TombstoneCard key={fix.id} fix={fix} index={i} />
          ))}
        </div>
      )}
    </div>
  );
}
