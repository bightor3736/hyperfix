"use client";

import { cn } from "@/lib/utils";

const DAY_HEADERS = ["M", "T", "W", "T", "F", "S", "S"];

function getISODateString(date: Date): string {
  return date.toISOString().split("T")[0];
}

function getDaysInMonth(year: number, month: number): Date[] {
  const days: Date[] = [];
  const date = new Date(year, month, 1);
  while (date.getMonth() === month) {
    days.push(new Date(date));
    date.setDate(date.getDate() + 1);
  }
  return days;
}

// Monday = 0 offset
function getMondayOffset(date: Date): number {
  const day = date.getDay(); // 0=Sun
  return day === 0 ? 6 : day - 1;
}

interface StreakCalendarProps {
  /** ISO date strings that are checked-in */
  dates: string[];
  /** Year to display (default: current year) */
  year?: number;
  /** Month to display 0-11 (default: current month) */
  month?: number;
  className?: string;
}

export function StreakCalendar({
  dates,
  year,
  month,
  className,
}: StreakCalendarProps) {
  const now = new Date();
  const displayYear = year ?? now.getFullYear();
  const displayMonth = month ?? now.getMonth();

  const todayStr = getISODateString(now);
  const dateSet = new Set(dates);

  const days = getDaysInMonth(displayYear, displayMonth);
  const firstDay = days[0];
  const offset = getMondayOffset(firstDay);

  // Build 6-row grid (6*7 = 42 cells)
  const cells: (Date | null)[] = [
    ...Array(offset).fill(null),
    ...days,
  ];
  // Pad to full weeks
  while (cells.length % 7 !== 0) cells.push(null);

  const monthLabel = firstDay.toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  return (
    <div className={cn("select-none", className)}>
      {/* Month label */}
      <p className="font-mono text-[10px] uppercase tracking-widest text-ink-faint mb-3">
        {monthLabel}
      </p>

      {/* Day headers */}
      <div className="grid grid-cols-7 mb-1">
        {DAY_HEADERS.map((d, i) => (
          <div
            key={i}
            className="flex items-center justify-center font-mono text-[9px] uppercase tracking-widest text-ink-faint"
            style={{ height: 20 }}
          >
            {d}
          </div>
        ))}
      </div>

      {/* Day cells */}
      <div className="grid grid-cols-7 gap-y-1">
        {cells.map((date, i) => {
          if (!date) {
            return <div key={`empty-${i}`} className="h-7" />;
          }

          const iso = getISODateString(date);
          const isToday = iso === todayStr;
          const checkedIn = dateSet.has(iso);
          const isFuture = iso > todayStr;

          return (
            <div key={iso} className="flex items-center justify-center h-7">
              <div
                className={cn(
                  "w-7 h-7 rounded-full flex items-center justify-center font-mono text-[11px] transition-all duration-150",
                  {
                    "bg-accent text-accent-ink font-medium": checkedIn,
                    "ring-1 ring-accent text-accent": isToday && !checkedIn,
                    "text-ink-faint": isFuture && !isToday,
                    "text-ink-muted": !isFuture && !checkedIn && !isToday,
                  }
                )}
                style={
                  checkedIn
                    ? { boxShadow: "0 0 8px var(--accent)" }
                    : undefined
                }
              >
                {date.getDate()}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
