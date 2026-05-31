"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight, Flame, Zap } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { StreakCalendar } from "@/components/ui/streak-calendar";

function computeStreak(dates: string[]): { current: number; best: number } {
  if (dates.length === 0) return { current: 0, best: 0 };

  const sorted = [...new Set(dates)].sort().reverse();
  const today = new Date().toISOString().split("T")[0];
  const yesterday = new Date(Date.now() - 86400000).toISOString().split("T")[0];

  // Current streak
  let current = 0;
  let cursor =
    sorted[0] === today || sorted[0] === yesterday ? sorted[0] : null;
  if (cursor) {
    for (const d of sorted) {
      if (d === cursor) {
        current++;
        cursor = new Date(new Date(cursor).getTime() - 86400000)
          .toISOString()
          .split("T")[0];
      } else {
        break;
      }
    }
  }

  // Best streak (brute force over all consecutive runs)
  let best = 0;
  let run = 1;
  const asc = [...new Set(dates)].sort();
  for (let i = 1; i < asc.length; i++) {
    const prev = new Date(asc[i - 1]);
    const curr = new Date(asc[i]);
    const diff = (curr.getTime() - prev.getTime()) / 86400000;
    if (diff === 1) {
      run++;
      if (run > best) best = run;
    } else {
      run = 1;
    }
  }
  if (asc.length > 0 && best === 0) best = 1;

  return { current, best };
}

function getStreakStatus(streak: number): string {
  if (streak === 0) return "check in today to start your run";
  if (streak >= 365) return "a full year. unreal.";
  if (streak >= 100) return "triple digits. you are not okay. we love it.";
  if (streak >= 30) return "monthly milestone. legendary.";
  if (streak >= 14) return "two weeks straight. deeply committed.";
  if (streak >= 7) return "one week in. on a roll.";
  if (streak >= 3) return "momentum building.";
  return "it's starting.";
}

interface StreakCardProps {
  /** ISO date strings for all check-in dates */
  dates: string[];
  className?: string;
}

export function StreakCard({ dates, className }: StreakCardProps) {
  const now = new Date();
  const [viewYear, setViewYear] = useState(now.getFullYear());
  const [viewMonth, setViewMonth] = useState(now.getMonth());

  const { current, best } = computeStreak(dates);
  const status = getStreakStatus(current);

  function prevMonth() {
    if (viewMonth === 0) {
      setViewMonth(11);
      setViewYear((y) => y - 1);
    } else {
      setViewMonth((m) => m - 1);
    }
  }

  function nextMonth() {
    const isCurrentMonth =
      viewMonth === now.getMonth() && viewYear === now.getFullYear();
    if (isCurrentMonth) return;
    if (viewMonth === 11) {
      setViewMonth(0);
      setViewYear((y) => y + 1);
    } else {
      setViewMonth((m) => m + 1);
    }
  }

  const isCurrentMonth =
    viewMonth === now.getMonth() && viewYear === now.getFullYear();

  return (
    <div
      className={cn(
        "rounded-2xl border border-line bg-bg-elevated p-5 flex flex-col gap-5",
        className
      )}
    >
      {/* Top: streak count + best */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-widest text-ink-faint mb-2">
            check-in run
          </p>
          <div className="flex items-baseline gap-2">
            <span
              className="font-display leading-none tabular-nums"
              style={{
                fontSize: "clamp(44px,8vw,60px)",
                letterSpacing: "-0.04em",
                color: current > 0 ? "var(--accent)" : "var(--ink-faint)",
              }}
            >
              {current}
            </span>
            <span className="font-mono text-[11px] uppercase tracking-widest text-ink-muted">
              {current === 1 ? "day" : "days"}
            </span>
          </div>
          <p className="mt-1.5 font-sans text-xs text-ink-muted leading-snug">
            {status}
          </p>
        </div>

        {/* Best streak badge */}
        {best > 0 && (
          <div
            className="flex flex-col items-end gap-1 shrink-0"
          >
            <div
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full"
              style={{
                background: "var(--accent-soft)",
                border: "1px solid var(--accent)",
              }}
            >
              {best >= current && current > 0 ? (
                <Flame size={11} strokeWidth={1.5} className="text-accent" />
              ) : (
                <Zap size={11} strokeWidth={1.5} className="text-accent" />
              )}
              <span className="font-mono text-[10px] uppercase tracking-widest text-accent">
                best {best}d
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Divider */}
      <div className="h-px bg-line" />

      {/* Calendar navigation */}
      <div className="flex items-center justify-between">
        <Button variant="ghost" size="icon" onClick={prevMonth}>
          <ChevronLeft size={14} strokeWidth={1.5} />
        </Button>
        <span className="font-mono text-[10px] uppercase tracking-widest text-ink-faint">
          {new Date(viewYear, viewMonth, 1).toLocaleDateString("en-US", {
            month: "long",
            year: "numeric",
          })}
        </span>
        <Button
          variant="ghost"
          size="icon"
          onClick={nextMonth}
          disabled={isCurrentMonth}
        >
          <ChevronRight size={14} strokeWidth={1.5} />
        </Button>
      </div>

      {/* Calendar */}
      <StreakCalendar
        dates={dates}
        year={viewYear}
        month={viewMonth}
      />
    </div>
  );
}
