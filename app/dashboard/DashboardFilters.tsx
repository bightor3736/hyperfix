"use client";

import { useState, useMemo, useTransition } from "react";
import Link from "next/link";
import { FixStatusPill, type FixStatus } from "@/components/FixStatusPill";
import { checkInFix, bulkCheckInFixes } from "@/app/actions/fixes";
import { CountUp } from "@/components/CountUp";
import { Search, TickSquare } from "react-iconly";

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
  is_public?: boolean;
};

const VALID_STATUSES: FixStatus[] = [
  "Day 1", "Obsessing", "On loop", "Fading", "Post-fix", "Ended", "Dormant", "Send help",
];

function isValidStatus(s: string): s is FixStatus {
  return VALID_STATUSES.includes(s as FixStatus);
}

const STATUS_FILTERS = ["All", "Day 1", "Obsessing", "On loop", "Fading", "Post-fix", "Dormant", "Send help"] as const;
const CATEGORY_FILTERS = ["All", "song", "fanfic", "show", "film", "ship", "game", "book", "other"] as const;
type SortOrder = "newest" | "longest" | "intense" | "unchecked";

const TEAL = "#5EEAD4";
const CARD_BG = "#0F1011";
const CARD_BORDER = "rgba(255,255,255,0.06)";
const NOISE_URL =
  "url(\"data:image/svg+xml;utf8,<svg viewBox='0 0 240 240' xmlns='http://www.w3.org/2000/svg'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 0.55 0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>\")";

function getDayCount(startedAt: string): number {
  const start = new Date(startedAt);
  const now = new Date();
  return Math.max(1, Math.ceil((now.getTime() - start.getTime()) / 86_400_000));
}

function intensityColor(intensity: number): string {
  if (intensity >= 8) return "#E63946";
  if (intensity >= 6) return "#FB923C";
  return TEAL;
}

function intensityRGB(intensity: number): string {
  if (intensity >= 8) return "230,57,70";
  if (intensity >= 6) return "251,146,60";
  return "94,234,212";
}

function getMilestone(days: number): { icon: string; label: string } | null {
  if (days >= 365) return { icon: "★", label: "1 year" };
  if (days >= 100) return { icon: "✦", label: "100 days" };
  if (days >= 30) return { icon: "✦", label: "30 days" };
  if (days >= 7) return { icon: "✦", label: "7 days" };
  return null;
}

function FixGridCard({
  fix,
  checkedInToday,
  onCheckIn,
  index,
}: {
  fix: Fix;
  checkedInToday: boolean;
  onCheckIn: (fixId: string) => void;
  index: number;
}) {
  const [justCheckedIn, setJustCheckedIn] = useState(false);

  const days = getDayCount(fix.started_at);
  const pct = (fix.intensity / 10) * 100;
  const status = isValidStatus(fix.status) ? fix.status : "Day 1";
  const color = intensityColor(fix.intensity);
  const rgb = intensityRGB(fix.intensity);
  const milestone = getMilestone(days);

  function handleCheckIn(fixId: string) {
    setJustCheckedIn(true);
    setTimeout(() => setJustCheckedIn(false), 1400);
    onCheckIn(fixId);
  }

  const delay = `${Math.min(index, 6) * 60}ms`;

  return (
    <div
      className="motion-card relative overflow-hidden rounded-3xl p-5 flex flex-col anim-fadeUp"
      style={{
        background: CARD_BG,
        border: `1px solid ${CARD_BORDER}`,
        animationDelay: delay,
        boxShadow: `0 0 24px rgba(${rgb},0.05)`,
      }}
    >
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none mix-blend-overlay"
        style={{ backgroundImage: NOISE_URL, backgroundSize: "240px 240px", opacity: 0.22 }}
      />
      {/* Intensity bloom from bottom — subtle */}
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(ellipse 80% 60% at 50% 110%, rgba(${rgb},0.18) 0%, transparent 60%)`,
        }}
      />
      {/* Intensity badge — top right */}
      <div
        className="absolute z-10"
        style={{
          top: -10,
          right: -10,
          width: 40,
          height: 40,
          borderRadius: 999,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: `rgba(${rgb},0.20)`,
          border: `1px solid rgba(${rgb},0.50)`,
          color,
          boxShadow: `0 0 22px rgba(${rgb},0.55)`,
          backdropFilter: "blur(8px)",
        }}
      >
        <span className="font-display text-sm" style={{ fontWeight: 600 }}>
          {fix.intensity}
        </span>
      </div>

      <Link href={`/dashboard/fix/${fix.id}`} className="relative flex-1 block group">
        {/* Category eyebrow + status */}
        <div className="flex items-center gap-2 mb-4 flex-wrap">
          <span
            className="inline-flex items-center font-sans text-[11px] rounded-full px-2.5 py-0.5"
            style={{
              background: "rgba(94,234,212,0.10)",
              color: TEAL,
              border: "1px solid rgba(94,234,212,0.22)",
            }}
          >
            {fix.category}
          </span>
          <FixStatusPill status={status} size="sm" />
          {fix.is_public && (
            <span
              className="inline-flex items-center gap-1 font-sans text-[10px] rounded-full px-2.5 py-0.5"
              style={{
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.10)",
                color: "rgba(255,255,255,0.35)",
              }}
              title="Public — visible to anyone"
            >
              <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
              </svg>
              public
            </span>
          )}
          {milestone && (
            <span
              className="font-sans text-[11px] rounded-full px-2.5 py-0.5"
              style={{
                background: `rgba(${rgb},0.12)`,
                border: `1px solid rgba(${rgb},0.32)`,
                color,
              }}
            >
              {milestone.icon} {milestone.label}
            </span>
          )}
        </div>

        {/* Title — serif */}
        <h3
          className="font-display text-ink mb-5 transition-colors group-hover:text-[#5EEAD4]"
          style={{
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

        {/* Hero day count */}
        <div className="flex items-baseline gap-2 mb-4">
          <span
            className="font-display leading-none tabular-nums"
            style={{
              color: justCheckedIn ? color : "#FFFFFF",
              fontSize: 56,
              fontWeight: 600,
              letterSpacing: "-0.04em",
              textShadow: justCheckedIn ? `0 0 36px rgba(${rgb},0.55)` : "none",
              transition: "color 0.3s ease, text-shadow 0.3s ease",
            }}
          >
            <CountUp to={days} duration={900} />
          </span>
          <span className="font-sans text-sm" style={{ color: "rgba(255,255,255,0.45)" }}>
            day{days !== 1 ? "s" : ""}
          </span>
        </div>

        {/* Intensity bar */}
        <div
          className="h-1.5 rounded-full overflow-hidden mb-1"
          style={{ background: "rgba(255,255,255,0.06)" }}
        >
          <div
            className="h-full rounded-full"
            style={{
              width: `${pct}%`,
              background: `linear-gradient(to right, rgba(${rgb},0.5), ${color})`,
              boxShadow: `0 0 10px rgba(${rgb},0.7)`,
              transition: "width 0.4s ease",
            }}
          />
        </div>
        <p className="font-sans text-xs" style={{ color: "rgba(255,255,255,0.4)" }}>
          intensity {fix.intensity}/10
        </p>
      </Link>

      {/* Check-in row */}
      <div
        className="relative mt-4 pt-4"
        style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}
      >
        {checkedInToday || justCheckedIn ? (
          <span
            className="inline-flex items-center gap-1.5 font-sans text-xs"
            style={{
              color: justCheckedIn ? color : "rgba(94,234,212,0.7)",
              transition: "color 0.3s ease",
            }}
          >
            <TickSquare set="light" size={13} primaryColor="currentColor" />
            {justCheckedIn ? "logged" : "checked in today"}
          </span>
        ) : (
          <button
            onClick={(e) => {
              e.preventDefault();
              handleCheckIn(fix.id);
            }}
            className="inline-flex items-center gap-1.5 font-sans text-xs transition-colors hover:text-[#5EEAD4] active:scale-95"
            style={{ color: "rgba(255,255,255,0.45)" }}
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 5v14M5 12h14" />
            </svg>
            check in today
          </button>
        )}
      </div>
    </div>
  );
}

function PillButton({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="shrink-0 px-3.5 py-1.5 rounded-full font-sans text-xs transition-all duration-200 whitespace-nowrap hover:-translate-y-px"
      style={
        active
          ? {
              background: TEAL,
              color: "#0A1F1C",
              border: "1px solid transparent",
              boxShadow: "0 4px 16px rgba(94,234,212,0.30)",
              fontWeight: 600,
            }
          : {
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.08)",
              color: "rgba(255,255,255,0.55)",
            }
      }
    >
      {label}
    </button>
  );
}

const SORT_OPTIONS: { key: SortOrder; label: string }[] = [
  { key: "newest", label: "Newest" },
  { key: "longest", label: "Longest" },
  { key: "intense", label: "Most intense" },
  { key: "unchecked", label: "Needs check-in" },
];

export function DashboardFilters({ fixes, checkedInIds = [] }: { fixes: Fix[]; checkedInIds?: string[] }) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("All");
  const [categoryFilter, setCategoryFilter] = useState<string>("All");
  const [sortOrder, setSortOrder] = useState<SortOrder>("newest");
  const [localCheckedIn, setLocalCheckedIn] = useState<Set<string>>(new Set(checkedInIds));
  const [bulkPending, setBulkPending] = useState(false);
  const [_pending, startTransition] = useTransition();

  const uncheckedCount = fixes.filter((f) => !localCheckedIn.has(f.id)).length;

  async function handleBulkCheckIn() {
    if (bulkPending) return;
    const uncheckedIds = fixes.filter((f) => !localCheckedIn.has(f.id)).map((f) => f.id);
    if (uncheckedIds.length === 0) return;
    setBulkPending(true);
    setLocalCheckedIn((prev) => new Set([...prev, ...uncheckedIds]));
    try {
      await bulkCheckInFixes(uncheckedIds);
    } catch {
      setLocalCheckedIn((prev) => {
        const next = new Set(prev);
        uncheckedIds.forEach((id) => next.delete(id));
        return next;
      });
    } finally {
      setBulkPending(false);
    }
  }

  function handleQuickCheckIn(fixId: string) {
    setLocalCheckedIn((prev) => new Set([...prev, fixId]));
    startTransition(async () => {
      try {
        await checkInFix(fixId, 5);
      } catch {
        setLocalCheckedIn((prev) => {
          const next = new Set(prev);
          next.delete(fixId);
          return next;
        });
      }
    });
  }

  const filtered = useMemo(() => {
    let result = fixes.filter((fix) => {
      const matchesSearch = search.trim() === "" || fix.title.toLowerCase().includes(search.toLowerCase());
      const matchesStatus = statusFilter === "All" || fix.status === statusFilter;
      const matchesCategory = categoryFilter === "All" || fix.category === categoryFilter;
      return matchesSearch && matchesStatus && matchesCategory;
    });

    if (sortOrder === "longest") {
      result = [...result].sort((a, b) => getDayCount(b.started_at) - getDayCount(a.started_at));
    } else if (sortOrder === "intense") {
      result = [...result].sort((a, b) => b.intensity - a.intensity);
    } else if (sortOrder === "unchecked") {
      result = [...result].sort((a, b) => {
        const aChecked = localCheckedIn.has(a.id) ? 1 : 0;
        const bChecked = localCheckedIn.has(b.id) ? 1 : 0;
        return aChecked - bChecked;
      });
    }

    return result;
  }, [fixes, search, statusFilter, categoryFilter, sortOrder, localCheckedIn]);

  if (fixes.length === 0) return null;

  return (
    <div>
      {/* Search + sort row */}
      <div className="flex flex-col sm:flex-row gap-3 mb-4 items-start">
        <div className="relative w-full sm:w-[260px] shrink-0">
          <div
            className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none"
            style={{ color: "rgba(255,255,255,0.4)" }}
          >
            <Search set="light" size={16} primaryColor="currentColor" />
          </div>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search your fixes…"
            className="w-full rounded-full pl-10 pr-4 py-2.5 font-sans text-sm outline-none transition-all focus:ring-2 focus:ring-[#5EEAD4]/35 placeholder:text-[rgba(255,255,255,0.3)]"
            style={{
              background: CARD_BG,
              border: `1px solid ${CARD_BORDER}`,
              color: "#F4F4F4",
            }}
          />
        </div>
        <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-0.5 w-full sm:w-auto">
          {SORT_OPTIONS.map((opt) => (
            <PillButton
              key={opt.key}
              label={opt.label}
              active={sortOrder === opt.key}
              onClick={() => setSortOrder(opt.key)}
            />
          ))}
        </div>
        {uncheckedCount > 0 && (
          <button
            onClick={handleBulkCheckIn}
            disabled={bulkPending}
            className="shrink-0 px-4 py-2 rounded-full font-sans text-xs font-semibold transition-all hover:-translate-y-px active:scale-95 disabled:opacity-50 whitespace-nowrap"
            style={{
              background: "rgba(94,234,212,0.12)",
              border: "1px solid rgba(94,234,212,0.40)",
              color: TEAL,
              boxShadow: "0 0 20px rgba(94,234,212,0.18)",
            }}
          >
            {bulkPending ? "Checking in…" : `Check in all (${uncheckedCount})`}
          </button>
        )}
      </div>

      {/* Status filter pills */}
      <div className="flex gap-2 overflow-x-auto scrollbar-hide mb-3 pb-1">
        {STATUS_FILTERS.map((s) => (
          <PillButton key={s} label={s} active={statusFilter === s} onClick={() => setStatusFilter(s)} />
        ))}
      </div>

      {/* Category filter pills */}
      <div className="flex gap-2 overflow-x-auto scrollbar-hide mb-6 pb-1">
        {CATEGORY_FILTERS.map((c) => (
          <PillButton key={c} label={c} active={categoryFilter === c} onClick={() => setCategoryFilter(c)} />
        ))}
      </div>

      {/* Grid */}
      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((fix, i) => (
            <FixGridCard
              key={fix.id}
              fix={fix}
              checkedInToday={localCheckedIn.has(fix.id)}
              onCheckIn={handleQuickCheckIn}
              index={i}
            />
          ))}
        </div>
      ) : (
        <div className="py-16 text-center anim-fadeUp">
          <p className="font-display" style={{ color: "rgba(255,255,255,0.35)", fontSize: 22, fontWeight: 600 }}>
            No fixes match.
          </p>
        </div>
      )}
    </div>
  );
}
