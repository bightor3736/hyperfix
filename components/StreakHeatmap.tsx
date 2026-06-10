"use client";

import { useState } from "react";

const DAYS = ["M", "T", "W", "T", "F", "S", "S"];
const WEEKS = 13;

function getISODateString(date: Date): string {
  return date.toISOString().split("T")[0];
}

function getMondayOfWeek(date: Date): Date {
  const d = new Date(date);
  const day = d.getDay(); // 0=Sun, 1=Mon...
  const diff = (day === 0 ? -6 : 1 - day);
  d.setDate(d.getDate() + diff);
  d.setHours(0, 0, 0, 0);
  return d;
}

export function StreakHeatmap({ dates }: { dates: string[] }) {
  const [tooltip, setTooltip] = useState<{ date: string; checkedIn: boolean; x: number; y: number } | null>(null);
  const dateSet = new Set(dates);

  // Build 91 days ending today
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Find the Monday of the current week (or Sunday's Monday)
  const endMonday = getMondayOfWeek(today);
  // End of last week that's complete: 13 weeks back from the end of this week's Sunday
  // We want 13 columns (weeks), starting from a Monday 12 weeks before the current week's Monday
  const startMonday = new Date(endMonday);
  startMonday.setDate(startMonday.getDate() - (WEEKS - 1) * 7);

  // Build the grid: columns = weeks (Mon-Sun), rows = day of week (Mon=0..Sun=6)
  const grid: Array<Array<{ date: string; inRange: boolean }>> = [];
  for (let w = 0; w < WEEKS; w++) {
    const week: Array<{ date: string; inRange: boolean }> = [];
    for (let d = 0; d < 7; d++) {
      const cell = new Date(startMonday);
      cell.setDate(cell.getDate() + w * 7 + d);
      const isoDate = getISODateString(cell);
      const inRange = cell <= today;
      week.push({ date: isoDate, inRange });
    }
    grid.push(week);
  }

  // Build month labels: find 3 evenly spaced month labels
  // Find which column each month starts in
  const monthLabels: Array<{ label: string; col: number }> = [];
  let lastMonth = -1;
  for (let w = 0; w < WEEKS; w++) {
    const firstDayOfWeek = grid[w][0];
    const month = new Date(firstDayOfWeek.date).getMonth();
    if (month !== lastMonth) {
      monthLabels.push({
        label: new Date(firstDayOfWeek.date).toLocaleDateString("en-US", { month: "short" }),
        col: w,
      });
      lastMonth = month;
    }
  }
  // Pick up to 3 evenly spaced labels
  let displayLabels = monthLabels;
  if (monthLabels.length > 3) {
    const step = (monthLabels.length - 1) / 2;
    displayLabels = [
      monthLabels[0],
      monthLabels[Math.round(step)],
      monthLabels[monthLabels.length - 1],
    ];
  }

  const CELL_SIZE = 16;
  const CELL_GAP = 4;
  const DAY_LABEL_WIDTH = 16;
  const totalWidth = DAY_LABEL_WIDTH + WEEKS * (CELL_SIZE + CELL_GAP) - CELL_GAP;

  return (
    <div className="relative" style={{ userSelect: "none" }}>
      {/* Month labels */}
      <div
        className="flex mb-1.5"
        style={{ paddingLeft: DAY_LABEL_WIDTH, position: "relative", height: 14 }}
      >
        {displayLabels.map(({ label, col }) => (
          <span
            key={label + col}
            className="font-mono text-[9px] uppercase tracking-widest absolute"
            style={{
              color: "var(--ink-faint)",
              left: DAY_LABEL_WIDTH + col * (CELL_SIZE + CELL_GAP),
            }}
          >
            {label}
          </span>
        ))}
      </div>

      {/* Grid */}
      <div style={{ display: "flex", gap: 0 }}>
        {/* Day labels */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: CELL_GAP,
            width: DAY_LABEL_WIDTH,
            paddingRight: 2,
          }}
        >
          {DAYS.map((day, i) => (
            <div
              key={i}
              className="font-mono text-[9px]"
              style={{
                color: "var(--ink-faint)",
                height: CELL_SIZE,
                lineHeight: `${CELL_SIZE}px`,
                textAlign: "right",
                paddingRight: 2,
              }}
            >
              {i % 2 === 0 ? day : ""}
            </div>
          ))}
        </div>

        {/* Weeks */}
        <div style={{ display: "flex", gap: CELL_GAP }}>
          {grid.map((week, wi) => (
            <div key={wi} style={{ display: "flex", flexDirection: "column", gap: CELL_GAP }}>
              {week.map(({ date, inRange }, di) => {
                const checkedIn = inRange && dateSet.has(date);
                const isToday = date === getISODateString(today);
                return (
                  <div
                    key={di}
                    onMouseEnter={(e) => {
                      if (!inRange) return;
                      const rect = (e.target as HTMLElement).getBoundingClientRect();
                      setTooltip({ date, checkedIn, x: rect.left + rect.width / 2, y: rect.top - 8 });
                    }}
                    onMouseLeave={() => setTooltip(null)}
                    style={{
                      width: CELL_SIZE,
                      height: CELL_SIZE,
                      borderRadius: 20,
                      background: checkedIn
                        ? "var(--accent)"
                        : inRange
                          ? "var(--line)"
                          : "transparent",
                      boxShadow: checkedIn
                        ? "0 0 8px var(--accent)"
                        : isToday
                          ? "0 0 0 1.5px var(--accent)"
                          : "none",
                      transition: "background 0.15s ease",
                      flexShrink: 0,
                    }}
                  />
                );
              })}
            </div>
          ))}
        </div>
      </div>

      {/* Tooltip */}
      {tooltip && (
        <div
          className="fixed z-50 pointer-events-none"
          style={{
            left: tooltip.x,
            top: tooltip.y,
            transform: "translate(-50%, -100%)",
          }}
        >
          <div
            className="font-mono text-[10px] whitespace-nowrap px-2.5 py-1.5 rounded-lg"
            style={{
              background: "#1C1C1E",
              border: "1px solid var(--line)",
              color: tooltip.checkedIn ? "var(--accent)" : "var(--ink-muted)",
              boxShadow: "0 4px 16px rgba(0,0,0,0.5)",
            }}
          >
            {new Date(tooltip.date + "T12:00:00").toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
            {" · "}
            {tooltip.checkedIn ? "checked in" : "no check-in"}
          </div>
        </div>
      )}
    </div>
  );
}
