"use client";

export type FixStatus =
  | "Day 1"
  | "Obsessing"
  | "On loop"
  | "Fading"
  | "Post-fix"
  | "Ended"
  | "Dormant"
  | "Send help";

type PillConfig = {
  bg: string;
  border: string;
  text: string;
  glow: string;
  icon: string;
};

// Monochrome system: differentiation comes from the glyph + ink strength,
// never from hue. Active-ish statuses read brighter; finished ones fade.
const PILL_BRIGHT: PillConfig = {
  bg: "rgba(255,255,255,0.08)",
  border: "rgba(255,255,255,0.18)",
  text: "#ffffff",
  glow: "transparent",
  icon: "✦",
};
const PILL_MID: PillConfig = {
  bg: "rgba(255,255,255,0.05)",
  border: "rgba(255,255,255,0.12)",
  text: "rgba(255,255,255,0.7)",
  glow: "transparent",
  icon: "◐",
};
const PILL_FAINT: PillConfig = {
  bg: "rgba(255,255,255,0.03)",
  border: "rgba(255,255,255,0.08)",
  text: "rgba(255,255,255,0.45)",
  glow: "transparent",
  icon: "◌",
};

const CONFIG: Record<FixStatus, PillConfig> = {
  "Day 1":     { ...PILL_BRIGHT, icon: "✦" },
  "Obsessing": { ...PILL_BRIGHT, icon: "◉" },
  "On loop":   { ...PILL_BRIGHT, icon: "↻" },
  "Fading":    { ...PILL_MID,   icon: "◐" },
  "Post-fix":  { ...PILL_MID,   icon: "⌁" },
  "Ended":     { ...PILL_FAINT, icon: "◌" },
  "Dormant":   { ...PILL_FAINT, icon: "◑" },
  "Send help": { ...PILL_BRIGHT, icon: "⚠" },
};

export function FixStatusPill({
  status,
  size = "md",
}: {
  status: FixStatus;
  size?: "sm" | "md" | "lg";
}) {
  const c = CONFIG[status];
  const sizes = {
    sm: { pill: "px-2.5 py-1 text-[10px] gap-1.5", dot: 5 },
    md: { pill: "px-3.5 py-1.5 text-[11px] gap-2", dot: 6 },
    lg: { pill: "px-4 py-2 text-[13px] gap-2.5", dot: 7 },
  }[size];

  return (
    <span
      className={`inline-flex items-center font-mono font-bold uppercase tracking-widest rounded-full select-none whitespace-nowrap transition-all duration-200 hover:scale-105 cursor-default ${sizes.pill}`}
      style={{
        background: c.bg,
        border: `1px solid ${c.border}`,
        color: c.text,
      }}
    >
      <span
        className="shrink-0 leading-none"
        style={{ fontSize: sizes.dot + 4, lineHeight: 1 }}
      >
        {c.icon}
      </span>
      {status}
    </span>
  );
}

export function FixStatusPillGrid() {
  const statuses: FixStatus[] = [
    "Day 1",
    "Obsessing",
    "On loop",
    "Fading",
    "Post-fix",
    "Ended",
    "Dormant",
    "Send help",
  ];

  return (
    <div className="flex flex-wrap gap-2.5">
      {statuses.map((s) => (
        <FixStatusPill key={s} status={s} size="md" />
      ))}
    </div>
  );
}
