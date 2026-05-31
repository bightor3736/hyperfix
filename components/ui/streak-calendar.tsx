"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export interface StreakPeriod {
  /** ISO date string e.g. "2025-05-31" */
  date: string;
}

interface StreakCalendarProps extends React.HTMLAttributes<HTMLDivElement> {
  streak: StreakPeriod[];
  view?: "week" | "month";
  /** 0 = Sunday first, 1 = Monday first */
  startOfWeek?: 0 | 1;
}

const MON_LABELS = ["M", "T", "W", "T", "F", "S", "S"];
const SUN_LABELS = ["S", "M", "T", "W", "T", "F", "S"];

function buildWeekDates(startOfWeek: 0 | 1): string[] {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const day = today.getDay(); // 0=Sun
  const offset = startOfWeek === 1 ? (day === 0 ? -6 : 1 - day) : -day;
  const weekStart = new Date(today);
  weekStart.setDate(today.getDate() + offset);
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(weekStart);
    d.setDate(weekStart.getDate() + i);
    return d.toISOString().split("T")[0];
  });
}

export function StreakCalendar({
  streak,
  view = "week",
  startOfWeek = 1,
  className,
  ...props
}: StreakCalendarProps) {
  const dateSet = new Set(streak.map((p) => p.date));
  const todayStr = new Date().toISOString().split("T")[0];
  const weekDates = buildWeekDates(startOfWeek);
  const labels = startOfWeek === 1 ? MON_LABELS : SUN_LABELS;

  return (
    <div className={cn("", className)} {...props}>
      <div className="grid grid-cols-7 gap-1">
        {weekDates.map((date, i) => {
          const completed = dateSet.has(date);
          const isToday = date === todayStr;
          const isFuture = date > todayStr;

          return (
            <div key={date} className="flex flex-col items-center gap-1.5">
              <span
                className="font-mono text-[10px] uppercase tracking-widest"
                style={{ color: "var(--ink-faint)" }}
              >
                {labels[i]}
              </span>
              <div
                className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center transition-all duration-150",
                  completed
                    ? "bg-primary text-primary-foreground"
                    : isToday
                    ? "border-2 border-primary"
                    : isFuture
                    ? "border border-dashed border-line"
                    : "border-2 border-line"
                )}
                style={
                  completed
                    ? { boxShadow: "0 0 10px var(--accent)" }
                    : undefined
                }
              >
                {completed && (
                  <svg
                    width="12"
                    height="12"
                    viewBox="0 0 12 12"
                    fill="none"
                    aria-hidden="true"
                  >
                    <path
                      d="M2 6l3 3 5-5"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                )}
                {isToday && !completed && (
                  <div
                    className="w-1.5 h-1.5 rounded-full"
                    style={{ background: "var(--accent)" }}
                  />
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
