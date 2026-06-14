"use client";

import { Trophy } from "lucide-react";

/**
 * Circular level-progress ring. Replaces the old linear XP bar with a
 * compact, glanceable dial: level number in the center, progress around it.
 */
export function LevelRing({
  levelNum,
  levelName,
  totalPoints,
  currentLevelPoints,
  nextLevelPoints,
  size = 124,
}: {
  levelNum: number;
  levelName: string;
  totalPoints: number;
  currentLevelPoints: number;
  nextLevelPoints?: number;
  size?: number;
}) {
  const pct = nextLevelPoints
    ? Math.min(1, Math.max(0, (totalPoints - currentLevelPoints) / (nextLevelPoints - currentLevelPoints)))
    : 1;
  const stroke = 9;
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const toNext = nextLevelPoints ? Math.max(0, nextLevelPoints - totalPoints) : 0;

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
          Level
        </span>
        <span
          style={{
            display: "inline-flex", alignItems: "center", gap: 5,
            padding: "4px 9px", borderRadius: 9999,
            background: "var(--xp-soft)", color: "var(--xp)",
            fontSize: 11, fontWeight: 700,
          }}
        >
          <Trophy size={11} strokeWidth={2.5} /> {levelName}
        </span>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
        <div style={{ position: "relative", width: size, height: size, flexShrink: 0 }}>
          <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
            <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="var(--fill)" strokeWidth={stroke} />
            <circle
              cx={size / 2}
              cy={size / 2}
              r={r}
              fill="none"
              stroke="var(--xp)"
              strokeWidth={stroke}
              strokeLinecap="round"
              strokeDasharray={c}
              strokeDashoffset={c * (1 - pct)}
              style={{ transition: "stroke-dashoffset 0.8s ease" }}
            />
          </svg>
          <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
            <span style={{ fontSize: 34, fontWeight: 700, letterSpacing: "-0.03em", color: "var(--ink)", lineHeight: 1 }}>
              {levelNum}
            </span>
            <span style={{ fontSize: 10, fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase", color: "var(--ink-faint)", marginTop: 2 }}>
              level
            </span>
          </div>
        </div>

        <div style={{ minWidth: 0 }}>
          <p style={{ fontSize: 28, fontWeight: 700, letterSpacing: "-0.02em", color: "var(--ink)", lineHeight: 1, fontVariantNumeric: "tabular-nums" }}>
            {totalPoints.toLocaleString()}
          </p>
          <p style={{ fontSize: 12, color: "var(--ink-muted)", marginTop: 4 }}>total XP</p>
          {nextLevelPoints && (
            <p style={{ fontSize: 12, color: "var(--ink-faint)", marginTop: 10, lineHeight: 1.4 }}>
              <span style={{ color: "var(--xp)", fontWeight: 600 }}>{toNext.toLocaleString()} XP</span> to next level
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
