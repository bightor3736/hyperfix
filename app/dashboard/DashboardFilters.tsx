"use client";

import { useState, useMemo, useTransition } from "react";
import Link from "next/link";
import { FixStatusPill, type FixStatus } from "@/components/FixStatusPill";
import { checkInFix } from "@/app/actions/fixes";

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

function FixGridCard({
  fix,
  checkedInToday,
  onCheckIn,
}: {
  fix: Fix;
  checkedInToday: boolean;
  onCheckIn: (fixId: string) => void;
}) {
  const days = getDayCount(fix.started_at);
  const pct = (fix.intensity / 10) * 100;
  const status = isValidStatus(fix.status) ? fix.status : "Day 1";
  const color = intensityColor(fix.intensity);

  return (
    <div
      className="rounded-2xl p-4 transition-all duration-200 hover:border-[rgba(168,85,247,0.2)] flex flex-col"
      style={{ background: "#111113", border: "1px solid rgba(244,244,244,0.07)" }}
    >
      <Link href={`/dashboard/fix/${fix.id}`} className="flex-1 block group">
        {/* Title */}
        <h3
          className="font-display font-bold text-[15px] leading-tight truncate mb-2 group-hover:text-[#A855F7] transition-colors"
          style={{ color: "#F4F4F4", letterSpacing: "-0.01em" }}
        >
          {fix.title}
        </h3>

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

        {/* Day number + intensity number */}
        <div className="flex items-end justify-between mb-3">
          <div className="flex items-baseline gap-1">
            <span
              className="font-mono font-black leading-none tabular-nums"
              style={{ color: "#A855F7", fontSize: 40, letterSpacing: "-0.04em" }}
            >
              {days}
            </span>
            <span className="font-sans text-xs pb-1" style={{ color: "rgba(244,244,244,0.3)" }}>
              days
            </span>
          </div>
          <span
            className="font-mono text-[11px] tabular-nums pb-1"
            style={{ color }}
          >
            {fix.intensity}/10
          </span>
        </div>

        {/* Intensity bar */}
        <div className="h-1 rounded-full overflow-hidden" style={{ background: "rgba(244,244,244,0.08)" }}>
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{ width: `${pct}%`, background: color }}
          />
        </div>
      </Link>

      {/* Quick check-in */}
      <div className="mt-3 pt-3" style={{ borderTop: "1px solid rgba(244,244,244,0.06)" }}>
        {checkedInToday ? (
          <span className="font-mono text-[10px] uppercase tracking-widest" style={{ color: "rgba(168,85,247,0.5)" }}>
            ✓ checked in today
          </span>
        ) : (
          <button
            onClick={(e) => { e.preventDefault(); onCheckIn(fix.id); }}
            className="font-mono text-[10px] uppercase tracking-widest transition-colors hover:text-[#A855F7]"
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
          ? { background: "#A855F7", color: "#0A0A0A", border: "1px solid transparent" }
          : { background: "rgba(244,244,244,0.04)", border: "1px solid rgba(244,244,244,0.1)", color: "rgba(244,244,244,0.45)" }
      }
    >
      {label}
    </button>
  );
}

export function DashboardFilters({ fixes, checkedInIds = [] }: { fixes: Fix[]; checkedInIds?: string[] }) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("All");
  const [categoryFilter, setCategoryFilter] = useState<string>("All");
  const [localCheckedIn, setLocalCheckedIn] = useState<Set<string>>(new Set(checkedInIds));
  const [_pending, startTransition] = useTransition();

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
    return fixes.filter((fix) => {
      const matchesSearch = search.trim() === "" || fix.title.toLowerCase().includes(search.toLowerCase());
      const matchesStatus = statusFilter === "All" || fix.status === statusFilter;
      const matchesCategory = categoryFilter === "All" || fix.category === categoryFilter;
      return matchesSearch && matchesStatus && matchesCategory;
    });
  }, [fixes, search, statusFilter, categoryFilter]);

  if (fixes.length === 0) return null;

  return (
    <div>
      {/* Search input */}
      <div className="relative mb-4">
        <div className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: "rgba(244,244,244,0.3)" }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
        </div>
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search your fixes…"
          className="w-full sm:w-[280px] rounded-xl pl-9 pr-4 py-2.5 font-sans text-sm outline-none transition-all focus:ring-2 focus:ring-[#A855F7]/25 placeholder:text-[rgba(244,244,244,0.3)]"
          style={{ background: "#111113", border: "1px solid rgba(244,244,244,0.1)", color: "#F4F4F4" }}
        />
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
