"use client";

import { useState, useMemo, useTransition } from "react";
import Link from "next/link";
import { FixStatusPill, type FixStatus } from "@/components/FixStatusPill";
import { checkInFix, bulkCheckInFixes } from "@/app/actions/fixes";
import { CountUp } from "@/components/CountUp";
import { Search, Check, Plus } from "lucide-react";
import { CategoryIcon } from "@/components/CategoryIcon";
import { useToast } from "@/components/Toast";

// ── QuickExportButton ─────────────────────────────────────────────────────────

function QuickExportButton({ fixId, title }: { fixId: string; title: string }) {
  const [state, setState] = useState<"idle" | "loading" | "done">("idle");

  async function handleExport(e: React.MouseEvent) {
    e.preventDefault();
    if (state !== "idle") return;
    setState("loading");
    try {
      const res = await fetch(`/api/share/${fixId}`);
      if (!res.ok) throw new Error();
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const filename = `hyperfix-${title
        .slice(0, 32)
        .replace(/\s+/g, "-")
        .toLowerCase()}.png`;
      if (
        navigator.share &&
        navigator.canShare?.({
          files: [new File([blob], filename, { type: "image/png" })],
        })
      ) {
        await navigator.share({
          files: [new File([blob], filename, { type: "image/png" })],
        });
      } else {
        const a = document.createElement("a");
        a.href = url;
        a.download = filename;
        a.click();
      }
      URL.revokeObjectURL(url);
      setState("done");
      setTimeout(() => setState("idle"), 2500);
    } catch {
      setState("idle");
    }
  }

  return (
    <button
      onClick={handleExport}
      title="Export card"
      className="inline-flex items-center gap-1 font-sans text-[11px] rounded-full px-2.5 py-1 transition-all hover:opacity-90 active:scale-95"
      style={
        state === "done"
          ? {
              background: "var(--accent-soft)",
              border: "1px solid rgba(255,255,255,0.2)",
              color: "var(--accent)",
            }
          : {
              background: "transparent",
              border: "1px solid var(--line)",
              color: "var(--ink-faint)",
            }
      }
    >
      {state === "loading" ? (
        <svg
          className="animate-spin"
          width="11"
          height="11"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
        >
          <circle cx="12" cy="12" r="10" strokeOpacity="0.25" />
          <path d="M12 2a10 10 0 0 1 10 10" />
        </svg>
      ) : state === "done" ? (
        <svg
          width="11"
          height="11"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polyline points="20 6 9 17 4 12" />
        </svg>
      ) : (
        <svg
          width="11"
          height="11"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
          <polyline points="7 10 12 15 17 10" />
          <line x1="12" y1="15" x2="12" y2="3" />
        </svg>
      )}
      {state === "done" ? "saved!" : "card"}
    </button>
  );
}

// ── Types ─────────────────────────────────────────────────────────────────────

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
  banner_url?: string | null;
};

const VALID_STATUSES: FixStatus[] = [
  "Day 1",
  "Obsessing",
  "On loop",
  "Fading",
  "Post-fix",
  "Ended",
  "Dormant",
  "Send help",
];

function isValidStatus(s: string): s is FixStatus {
  return VALID_STATUSES.includes(s as FixStatus);
}

const STATUS_FILTERS = [
  "All",
  "Day 1",
  "Obsessing",
  "On loop",
  "Fading",
  "Post-fix",
  "Dormant",
  "Send help",
] as const;
const CATEGORY_FILTERS = [
  "All",
  "Song",
  "Fanfic",
  "Show",
  "Film",
  "Ship",
  "Game",
  "Book",
  "Other",
] as const;
type SortOrder = "newest" | "longest" | "intense" | "unchecked";

const TEAL = "#ffffff";

// ── Helpers ───────────────────────────────────────────────────────────────────

function getDayCount(startedAt: string): number {
  const start = new Date(startedAt);
  const now = new Date();
  return Math.max(1, Math.ceil((now.getTime() - start.getTime()) / 86_400_000));
}

function intensityColor(_intensity: number): string {
  return "#ffffff";
}

function intensityRGB(_intensity: number): string {
  return "255,255,255";
}

function getMilestone(days: number): { label: string } | null {
  if (days >= 365) return { label: "1 year" };
  if (days >= 100) return { label: "100 days" };
  if (days >= 30) return { label: "30 days" };
  if (days >= 7) return { label: "7 days" };
  return null;
}

// ── FixGridCard ───────────────────────────────────────────────────────────────

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

  if (fix.banner_url) {
    // ── Banner card variant ──────────────────────────────────────────────────
    return (
      <div
        className="rounded-2xl border border-line bg-bg-elevated flex flex-col anim-fadeUp transition-transform duration-200 hover:-translate-y-0.5 overflow-hidden"
        style={{
          animationDelay: delay,
          borderColor: checkedInToday ? "var(--accent)" : "var(--line)",
        }}
      >
        {/* Banner */}
        <div className="relative h-28 overflow-hidden rounded-t-2xl">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={fix.banner_url}
            alt=""
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          {/* Day count on banner */}
          <div className="absolute bottom-2 left-3 flex items-baseline gap-1.5">
            <span
              className="font-display leading-none tracking-tight"
              style={{ fontSize: 28, color: "#ffffff" }}
            >
              {days}
            </span>
            <span
              className="font-mono uppercase tracking-widest"
              style={{ fontSize: 9, color: "rgba(255,255,255,0.7)" }}
            >
              day{days !== 1 ? "s" : ""}
            </span>
          </div>
          {/* Intensity chip */}
          <div
            className="absolute bottom-2 right-2 inline-flex items-center gap-1 rounded-full px-2 py-0.5"
            style={{
              background: "rgba(0,0,0,0.55)",
              border: `1px solid rgba(${rgb},0.4)`,
              backdropFilter: "blur(8px)",
              color,
            }}
          >
            <span className="font-mono tabular-nums" style={{ fontSize: 10, fontWeight: 600 }}>
              {fix.intensity}
              <span style={{ opacity: 0.55 }}>/10</span>
            </span>
          </div>
          {/* Checked indicator */}
          {checkedInToday && (
            <div
              className="absolute top-2 right-2 w-5 h-5 rounded-full flex items-center justify-center"
              style={{ background: TEAL, color: "var(--bg)" }}
            >
              <svg
                width="10"
                height="10"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="3.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M20 6 9 17l-5-5" />
              </svg>
            </div>
          )}
        </div>

        {/* Content */}
        <Link href={`/dashboard/fix/${fix.id}`} className="p-5 flex-1 block">
          <div className="flex items-center gap-1.5 mb-3 flex-wrap">
            <span
              className="inline-flex items-center gap-1 font-mono text-[9px] uppercase tracking-widest rounded-full px-2 py-0.5"
              style={{
                background: "rgba(255,255,255,0.06)",
                color: "rgba(255,255,255,0.7)",
                border: "1px solid rgba(255,255,255,0.1)",
              }}
            >
              <CategoryIcon category={fix.category} size={9} />
              {fix.category}
            </span>
            <FixStatusPill status={status} size="sm" />
            {milestone && (
              <span
                className="inline-flex items-center font-mono text-[9px] uppercase tracking-widest rounded-full px-2 py-0.5"
                style={{
                  background: `rgba(${rgb},0.10)`,
                  border: `1px solid rgba(${rgb},0.28)`,
                  color,
                }}
              >
                {milestone.label}
              </span>
            )}
          </div>
          <h3
            className="font-display text-ink mb-3"
            style={{
              fontSize: 18,
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
          {/* Intensity bar */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="font-mono text-[10px] uppercase tracking-widest text-ink-faint">
                Intensity
              </span>
              <span className="font-mono text-[11px] text-ink-muted">
                {fix.intensity}/10
              </span>
            </div>
            <div className="h-1.5 rounded-full overflow-hidden bg-line">
              <div
                className="h-full rounded-full transition-all"
                style={{
                  width: `${pct}%`,
                  background: "#ffffff",
                }}
              />
            </div>
          </div>
        </Link>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-line flex items-center justify-between">
          {checkedInToday || justCheckedIn ? (
            <span
              className="inline-flex items-center gap-1.5 font-sans text-xs"
              style={{ color: justCheckedIn ? color : "var(--accent)" }}
            >
              <Check size={13} strokeWidth={2.5} />
              {justCheckedIn ? "logged" : "checked in today"}
            </span>
          ) : (
            <button
              onClick={(e) => {
                e.preventDefault();
                handleCheckIn(fix.id);
              }}
              className="inline-flex items-center gap-1.5 font-sans text-xs text-ink-muted hover:text-accent transition-colors active:scale-95"
            >
              <Plus size={12} strokeWidth={2.5} />
              Check in today
            </button>
          )}
          <div className="flex items-center gap-1.5">
            <Link
              href={`/dashboard/fix/${fix.id}/card`}
              onClick={(e) => e.stopPropagation()}
              className="text-[11px] text-ink-faint hover:text-ink border border-line rounded-full px-2.5 py-1 transition-colors"
            >
              Card
            </Link>
            <QuickExportButton fixId={fix.id} title={fix.title} />
          </div>
        </div>
      </div>
    );
  }

  // ── No-banner card variant ─────────────────────────────────────────────────
  return (
    <div
      className="rounded-2xl flex flex-col anim-fadeUp transition-transform duration-200 hover:-translate-y-0.5"
      style={{
        background: "var(--bg-elevated)",
        border: `1px solid ${checkedInToday ? "var(--accent)" : "var(--line)"}`,
        animationDelay: delay,
        boxShadow: checkedInToday
          ? "0 0 0 1px var(--accent-soft), 0 8px 32px var(--accent-soft)"
          : undefined,
      }}
    >
      <Link href={`/dashboard/fix/${fix.id}`} className="p-5 flex-1 block">
        {/* Top row: category pill + checked indicator */}
        <div className="flex items-center justify-between mb-4">
          <span
            className="inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-widest rounded-full px-2.5 py-1"
            style={{
              background: "rgba(255,255,255,0.06)",
              color: "rgba(255,255,255,0.7)",
              border: "1px solid rgba(255,255,255,0.1)",
            }}
          >
            <CategoryIcon category={fix.category} size={9} />
            {fix.category}
          </span>
          <div className="flex items-center gap-1.5">
            {fix.is_public && (
              <span
                className="font-mono text-[9px] uppercase tracking-widest rounded-full px-2 py-0.5 text-ink-faint"
                style={{
                  background: "transparent",
                  border: "1px solid var(--line)",
                }}
              >
                public
              </span>
            )}
            {checkedInToday && (
              <Check size={14} className="text-accent" strokeWidth={2.5} />
            )}
          </div>
        </div>

        {/* Milestone pill */}
        {milestone && (
          <div className="mb-3">
            <span
              className="inline-flex items-center font-mono text-[9px] uppercase tracking-widest rounded-full px-2 py-0.5"
              style={{
                background: `rgba(${rgb},0.10)`,
                border: `1px solid rgba(${rgb},0.28)`,
                color,
              }}
            >
              {milestone.label}
            </span>
          </div>
        )}

        {/* Day counter — hero element */}
        <div className="flex items-baseline gap-2 mb-3">
          <span
            className="font-display leading-none tracking-tight"
            style={{
              fontSize: 56,
              color: justCheckedIn ? color : "var(--ink)",
              transition: "color 0.3s ease",
            }}
          >
            <CountUp to={days} duration={900} />
          </span>
          <span className="font-mono text-[11px] uppercase tracking-widest text-ink-faint">
            day{days !== 1 ? "s" : ""}
          </span>
        </div>

        {/* Title */}
        <h3
          className="font-display text-ink mb-4 transition-colors hover:text-accent"
          style={{
            fontSize: 17,
            letterSpacing: "-0.01em",
            lineHeight: 1.25,
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}
        >
          {fix.title}
        </h3>

        {/* Status + intensity row */}
        <div className="flex items-center gap-2 mb-4">
          <FixStatusPill status={status} size="sm" />
        </div>

        {/* Intensity bar */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="font-mono text-[10px] uppercase tracking-widest text-ink-faint">
              Intensity
            </span>
            <span className="font-mono text-[11px] text-ink-muted">
              {fix.intensity}/10
            </span>
          </div>
          <div className="h-1.5 rounded-full overflow-hidden bg-line">
            <div
              className="h-full rounded-full transition-all"
              style={{
                width: `${pct}%`,
                background: "#ffffff",
              }}
            />
          </div>
        </div>
      </Link>

      {/* Footer actions */}
      <div className="px-5 py-3 border-t border-line flex items-center justify-between">
        {checkedInToday || justCheckedIn ? (
          <span
            className="inline-flex items-center gap-1.5 font-sans text-xs"
            style={{ color: justCheckedIn ? color : "var(--accent)" }}
          >
            <Check size={13} strokeWidth={2.5} />
            {justCheckedIn ? "logged" : "checked in today"}
          </span>
        ) : (
          <button
            onClick={(e) => {
              e.preventDefault();
              handleCheckIn(fix.id);
            }}
            className="inline-flex items-center gap-1.5 font-sans text-xs text-ink-muted hover:text-accent transition-colors active:scale-95"
          >
            <Plus size={12} strokeWidth={2.5} />
            Check in today
          </button>
        )}
        <div className="flex items-center gap-1.5">
          <Link
            href={`/dashboard/fix/${fix.id}/card`}
            onClick={(e) => e.stopPropagation()}
            className="text-[11px] text-ink-faint hover:text-ink border border-line rounded-full px-2.5 py-1 transition-colors"
          >
            Card
          </Link>
          <QuickExportButton fixId={fix.id} title={fix.title} />
        </div>
      </div>
    </div>
  );
}

// ── PillButton ────────────────────────────────────────────────────────────────

function PillButton({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="shrink-0 px-3.5 py-1.5 rounded-full font-sans text-xs transition-all duration-200 whitespace-nowrap hover:-translate-y-px"
      style={
        active
          ? {
              background: "var(--invert-bg)",
              color: "var(--invert-ink)",
              border: "1px solid var(--invert-bg)",
              fontWeight: 500,
            }
          : {
              background: "transparent",
              border: "1px solid var(--line)",
              color: "var(--ink-muted)",
            }
      }
    >
      {label}
    </button>
  );
}

// ── Sort options ──────────────────────────────────────────────────────────────

const SORT_OPTIONS: { key: SortOrder; label: string }[] = [
  { key: "newest", label: "Newest" },
  { key: "longest", label: "Longest" },
  { key: "intense", label: "Most intense" },
  { key: "unchecked", label: "Needs check-in" },
];

// ── DashboardFilters (main export) ────────────────────────────────────────────

export function DashboardFilters({
  fixes,
  checkedInIds = [],
}: {
  fixes: Fix[];
  checkedInIds?: string[];
}) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("All");
  const [categoryFilter, setCategoryFilter] = useState<string>("All");
  const [sortOrder, setSortOrder] = useState<SortOrder>("newest");
  const [localCheckedIn, setLocalCheckedIn] = useState<Set<string>>(
    new Set(checkedInIds)
  );
  const [bulkPending, setBulkPending] = useState(false);
  const [_pending, startTransition] = useTransition();
  const { toast } = useToast();

  const uncheckedCount = fixes.filter((f) => !localCheckedIn.has(f.id)).length;

  async function handleBulkCheckIn() {
    if (bulkPending) return;
    const uncheckedIds = fixes
      .filter((f) => !localCheckedIn.has(f.id))
      .map((f) => f.id);
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
        toast({ message: "Checked in.", type: "success" });
      } catch {
        setLocalCheckedIn((prev) => {
          const next = new Set(prev);
          next.delete(fixId);
          return next;
        });
        toast({ message: "Check-in failed.", type: "error" });
      }
    });
  }

  const filtered = useMemo(() => {
    let result = fixes.filter((fix) => {
      const matchesSearch =
        search.trim() === "" ||
        fix.title.toLowerCase().includes(search.toLowerCase());
      const matchesStatus =
        statusFilter === "All" || fix.status === statusFilter;
      const matchesCategory =
        categoryFilter === "All" ||
        fix.category.toLowerCase() === categoryFilter.toLowerCase();
      return matchesSearch && matchesStatus && matchesCategory;
    });

    if (sortOrder === "longest") {
      result = [...result].sort(
        (a, b) => getDayCount(b.started_at) - getDayCount(a.started_at)
      );
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
          <div className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-ink-muted">
            <Search size={15} strokeWidth={1.5} />
          </div>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search your fixes…"
            className="w-full rounded-full pl-9 pr-4 py-2.5 font-sans text-sm outline-none transition-all focus:ring-2 focus:ring-accent/30 placeholder:text-ink-faint bg-bg-elevated border border-line text-ink"
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
            className="shrink-0 px-4 py-2 rounded-full font-sans text-xs font-medium transition-all hover:-translate-y-px active:scale-95 disabled:opacity-50 whitespace-nowrap"
            style={{
              background: "var(--accent-soft)",
              border: "1px solid var(--accent)",
              color: "var(--accent)",
            }}
          >
            {bulkPending
              ? "Checking in…"
              : `Check in all (${uncheckedCount})`}
          </button>
        )}
      </div>

      {/* Status filter pills */}
      <div className="flex gap-2 overflow-x-auto scrollbar-hide mb-3 pb-1">
        {STATUS_FILTERS.map((s) => (
          <PillButton
            key={s}
            label={s}
            active={statusFilter === s}
            onClick={() => setStatusFilter(s)}
          />
        ))}
      </div>

      {/* Category filter pills */}
      <div className="flex gap-2 overflow-x-auto scrollbar-hide mb-6 pb-1">
        {CATEGORY_FILTERS.map((c) => (
          <PillButton
            key={c}
            label={c}
            active={categoryFilter === c}
            onClick={() => setCategoryFilter(c)}
          />
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
          <p className="font-display text-ink-muted" style={{ fontSize: 22 }}>
            No fixes match.
          </p>
        </div>
      )}
    </div>
  );
}
