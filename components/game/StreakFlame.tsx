"use client";

import { Flame } from "lucide-react";

/**
 * Animated streak chip. The flame flickers; goes cold (grey) at 0.
 */
export function StreakFlame({
  days,
  size = "md",
  className = "",
}: {
  days: number;
  size?: "sm" | "md" | "lg";
  className?: string;
}) {
  const lit = days > 0;
  const dims = {
    sm: { pad: "px-2.5 py-1", icon: 13, text: "text-[11px]", num: "text-[13px]" },
    md: { pad: "px-3 py-1.5", icon: 15, text: "text-[11px]", num: "text-[15px]" },
    lg: { pad: "px-4 py-2", icon: 20, text: "text-[12px]", num: "text-[20px]" },
  }[size];

  return (
    <div
      className={`inline-flex items-center gap-2 rounded-full ${dims.pad} ${className}`}
      style={{
        background: lit ? "var(--flame-soft)" : "var(--line)",
        border: `1px solid ${lit ? "var(--flame)" : "var(--line)"}`,
      }}
    >
      <Flame
        size={dims.icon}
        strokeWidth={2}
        className={lit ? "anim-flame" : ""}
        style={{ color: lit ? "var(--flame)" : "var(--ink-faint)" }}
        fill={lit ? "var(--flame)" : "none"}
      />
      <span className="inline-flex items-baseline gap-1">
        <span
          className={`font-display tabular-nums leading-none ${dims.num}`}
          style={{ color: lit ? "var(--flame)" : "var(--ink-faint)" }}
        >
          {days}
        </span>
        <span
          className={`font-mono uppercase tracking-widest ${dims.text}`}
          style={{ color: lit ? "var(--flame)" : "var(--ink-faint)" }}
        >
          day{days === 1 ? "" : "s"}
        </span>
      </span>
    </div>
  );
}
