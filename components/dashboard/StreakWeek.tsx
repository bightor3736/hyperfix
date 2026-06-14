"use client";

import { Flame, Snowflake } from "lucide-react";

const DAY_LETTERS = ["M", "T", "W", "T", "F", "S", "S"];

/**
 * Weekly streak strip. Shows a flame + the current streak number and a row of
 * seven day-dots so progress is glanceable. The last `min(streak,7)` days are
 * lit (approximation from the streak count we have on the client).
 */
export function StreakWeek({
  currentStreak,
  streakFreezes,
}: {
  currentStreak: number;
  streakFreezes: number;
}) {
  // Which weekday is today (Mon=0 … Sun=6).
  const jsDay = new Date().getDay(); // 0=Sun
  const todayIdx = (jsDay + 6) % 7;
  const litCount = Math.min(currentStreak, 7);

  return (
    <div
      style={{
        background: "var(--card)",
        border: "1px solid var(--line)",
        borderRadius: 20,
        padding: 22,
        boxShadow: "var(--shadow-sm)",
        display: "flex",
        flexDirection: "column",
        gap: 16,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--ink-faint)" }}>
          Streak
        </span>
        {streakFreezes > 0 && (
          <span style={{ display: "inline-flex", alignItems: "center", gap: 5, fontSize: 11, fontWeight: 600, color: "var(--ink-muted)" }}>
            <Snowflake size={11} strokeWidth={2} /> {streakFreezes} freeze{streakFreezes === 1 ? "" : "s"}
          </span>
        )}
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <span
          style={{
            display: "inline-flex", alignItems: "center", justifyContent: "center",
            width: 52, height: 52, borderRadius: 16, flexShrink: 0,
            background: "var(--flame-soft)", color: "var(--flame)",
          }}
        >
          <Flame size={26} strokeWidth={2.2} fill="currentColor" />
        </span>
        <div>
          <p style={{ fontSize: 34, fontWeight: 700, letterSpacing: "-0.03em", color: "var(--ink)", lineHeight: 1, fontVariantNumeric: "tabular-nums" }}>
            {currentStreak}
          </p>
          <p style={{ fontSize: 12, color: "var(--ink-muted)", marginTop: 3 }}>
            day{currentStreak === 1 ? "" : "s"} in a row
          </p>
        </div>
      </div>

      <div style={{ display: "flex", justifyContent: "space-between", gap: 6 }}>
        {DAY_LETTERS.map((d, i) => {
          // light the most recent `litCount` days ending today
          const distFromToday = (todayIdx - i + 7) % 7;
          const lit = distFromToday < litCount;
          const isToday = i === todayIdx;
          return (
            <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6, flex: 1 }}>
              <span
                style={{
                  width: "100%", maxWidth: 30, aspectRatio: "1", borderRadius: 9,
                  background: lit ? "var(--flame)" : "var(--fill)",
                  border: isToday && !lit ? "1.5px solid var(--flame)" : "1.5px solid transparent",
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}
              >
                {lit && <Flame size={12} strokeWidth={2.5} fill="#fff" color="#fff" />}
              </span>
              <span style={{ fontSize: 10, fontWeight: 600, color: isToday ? "var(--ink)" : "var(--ink-faint)" }}>{d}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
