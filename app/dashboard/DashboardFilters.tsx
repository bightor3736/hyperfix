"use client";

import { useState, useMemo, useTransition } from "react";
import Link from "next/link";
import { FixStatusPill, type FixStatus } from "@/components/FixStatusPill";
import { checkInFix, bulkCheckInFixes } from "@/app/actions/fixes";
import { Mascot, type MascotExpression } from "@/components/Mascot";

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

function getDayCount(startedAt: string): number {
  const start = new Date(startedAt);
  const now = new Date();
  return Math.max(1, Math.ceil((now.getTime() - start.getTime()) / 86_400_000));
}

function intensityColor(intensity: number): string {
  if (intensity >= 8) return "#E63946";
  if (intensity >= 6) return "#FB923C";
  return "#A855F7";
}

function intensityRGB(intensity: number): string {
  if (intensity >= 8) return "230,57,70";
  if (intensity >= 6) return "251,146,60";
  return "168,85,247";
}

function getMilestone(days: number): { icon: string; label: string } | null {
  if (days >= 365) return { icon: "🏆", label: "1 year" };
  if (days >= 100) return { icon: "💀", label: "100 days" };
  if (days >= 30) return { icon: "⚡", label: "30 days" };
  if (days >= 7) return { icon: "🔥", label: "7 days" };
  return null;
}

function FixGridCard({
  fix,
  checkedInToday,
  onCheckIn,
}: {
  fix: Fix;
  checkedInToday: boolean;
  onCheckIn: (fixId: string) => void;
}) {
  const [hovered, setHovered] = useState(false);
  const [justCheckedIn, setJustCheckedIn] = useState(false);

  const days = getDayCount(fix.started_at);
  const pct = (fix.intensity / 10) * 100;
  const status = isValidStatus(fix.status) ? fix.status : "Day 1";
  const color = intensityColor(fix.intensity);
  const rgb = intensityRGB(fix.intensity);
  const milestone = getMilestone(days);

  const ambientAlpha = fix.intensity >= 8 ? 0.15 : fix.intensity >= 6 ? 0.08 : 0.04;
  const hoverAlpha = fix.intensity >= 8 ? 0.28 : fix.intensity >= 6 ? 0.18 : 0.1;

  function handleCheckIn(fixId: string) {
    setJustCheckedIn(true);
    setTimeout(() => setJustCheckedIn(false), 1400);
    onCheckIn(fixId);
  }

  return (
    <div
      className="rounded-2xl p-4 flex flex-col"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: justCheckedIn ? `rgba(${rgb},0.07)` : hovered ? "#141416" : "#111113",
        border: `1px solid ${hovered ? `rgba(${rgb},0.3)` : "rgba(244,244,244,0.07)"}`,
        boxShadow: hovered
          ? `0 0 0 1px rgba(${rgb},0.12), 0 8px 32px rgba(${rgb},${hoverAlpha})`
          : `0 0 20px rgba(${rgb},${ambientAlpha})`,
        transition: "all 0.25s ease",
      }}
    >
      <Link href={`/dashboard/fix/${fix.id}`} className="flex-1 block group">
        {/* Title + milestone badge */}
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3
            className="font-display font-bold text-[15px] leading-tight group-hover:text-[#A855F7] transition-colors flex-1 min-w-0"
            style={{
              color: "#F4F4F4",
              letterSpacing: "-0.01em",
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
            }}
          >
            {fix.title}
          </h3>
          {milestone && (
            <span
              className="shrink-0 font-mono text-[9px] uppercase tracking-widest px-1.5 py-0.5 rounded-full whitespace-nowrap"
              style={{
                background: `rgba(${rgb},0.12)`,
                border: `1px solid rgba(${rgb},0.28)`,
                color,
              }}
            >
              {milestone.icon} {milestone.label}
            </span>
          )}
        </div>

        {/* Category + status pill */}
        <div className="flex items-center gap-2 mb-3 flex-wrap">
          <span
            className="font-mono text-[9px] uppercase tracking-widest px-2 py-0.5 rounded-full shrink-0"
            style={{
              background: "rgba(244,244,244,0.06)",
              border: "1px solid rgba(244,244,244,0.1)",
              color: "rgba(244,244,244,0.45)",
            }}
          >
            {fix.category}
          </span>
          <FixStatusPill status={status} size="sm" />
        </div>

        {/* Day number + intensity */}
        <div className="flex items-end justify-between mb-3">
          <div className="flex items-baseline gap-1">
            <span
              className="font-mono font-black leading-none tabular-nums"
              style={{
                color: justCheckedIn ? color : "#A855F7",
                fontSize: 40,
                letterSpacing: "-0.04em",
                transition: "color 0.3s ease",
              }}
            >
              {days}
            </span>
            <span className="font-sans text-xs pb-1" style={{ color: "rgba(244,244,244,0.3)" }}>
              days
            </span>
          </div>
          <span className="font-mono text-[11px] tabular-nums pb-1 font-semibold" style={{ color }}>
            {fix.intensity}/10
          </span>
        </div>

        {/* Intensity bar with glow */}
        <div className="h-1.5 rounded-full overflow-hidden" style={{ background: "rgba(244,244,244,0.07)" }}>
          <div
            className="h-full rounded-full"
            style={{
              width: `${pct}%`,
              background: `linear-gradient(to right, rgba(${rgb},0.6), ${color})`,
              boxShadow: `0 0 8px rgba(${rgb},0.7)`,
            }}
          />
        </div>
      </Link>

      {/* Quick check-in */}
      <div className="mt-3 pt-3" style={{ borderTop: "1px solid rgba(244,244,244,0.06)" }}>
        {checkedInToday || justCheckedIn ? (
          <span
            className="font-mono text-[10px] uppercase tracking-widest"
            style={{
              color: justCheckedIn ? color : "rgba(168,85,247,0.5)",
              transition: "color 0.3s ease",
            }}
          >
            {justCheckedIn ? "✦ logged!" : "✓ checked in today"}
          </span>
        ) : (
          <button
            onClick={(e) => { e.preventDefault(); handleCheckIn(fix.id); }}
            className="font-mono text-[10px] uppercase tracking-widest transition-all hover:text-[#A855F7] active:scale-95"
            style={{ color: "rgba(244,244,244,0.3)" }}
          >
            + check in today
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
      className="shrink-0 px-3 py-1.5 rounded-full font-mono text-[10px] uppercase tracking-widest transition-all duration-150 whitespace-nowrap"
      style={
        active
          ? { background: "#A855F7", color: "#F4F4F4", border: "1px solid transparent" }
          : { background: "rgba(244,244,244,0.04)", border: "1px solid rgba(244,244,244,0.1)", color: "rgba(244,244,244,0.45)" }
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
      // Revert on failure
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
        <div className="relative w-full sm:w-[240px] shrink-0">
          <div className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: "rgba(244,244,244,0.3)" }}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
          </div>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search your fixes…"
            className="w-full rounded-xl pl-9 pr-4 py-2.5 font-sans text-sm outline-none transition-all focus:ring-2 focus:ring-[#A855F7]/25 placeholder:text-[rgba(244,244,244,0.3)]"
            style={{ background: "#111113", border: "1px solid rgba(244,244,244,0.1)", color: "#F4F4F4" }}
          />
        </div>
        <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-0.5 w-full sm:w-auto">
          {SORT_OPTIONS.map((opt) => (
            <PillButton key={opt.key} label={opt.label} active={sortOrder === opt.key} onClick={() => setSortOrder(opt.key)} />
          ))}
        </div>
        {uncheckedCount > 0 && (
          <button
            onClick={handleBulkCheckIn}
            disabled={bulkPending}
            className="shrink-0 px-4 py-2 rounded-full font-mono text-[10px] uppercase tracking-widest transition-all hover:opacity-80 active:scale-95 disabled:opacity-50 whitespace-nowrap"
            style={{
              background: "rgba(168,85,247,0.08)",
              border: "1px solid rgba(168,85,247,0.35)",
              color: "#A855F7",
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
          {filtered.map((fix) => (
            <FixGridCard
              key={fix.id}
              fix={fix}
              checkedInToday={localCheckedIn.has(fix.id)}
              onCheckIn={handleQuickCheckIn}
            />
          ))}
        </div>
      ) : (
        <div className="py-16 text-center">
          <p className="font-display italic" style={{ color: "rgba(244,244,244,0.25)", fontSize: 22 }}>
            No fixes match.
          </p>
        </div>
      )}
    </div>
  );
}
