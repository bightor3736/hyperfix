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

const CONFIG: Record<FixStatus, PillConfig> = {
  "Day 1": {
    bg: "rgba(20, 184, 166, 0.12)",
    border: "rgba(20, 184, 166, 0.35)",
    text: "#5eead4",
    glow: "rgba(20, 184, 166, 0.18)",
    icon: "✦",
  },
  "Obsessing": {
    bg: "rgba(163, 230, 53, 0.11)",
    border: "rgba(163, 230, 53, 0.38)",
    text: "#a3e635",
    glow: "rgba(163, 230, 53, 0.18)",
    icon: "◉",
  },
  "On loop": {
    bg: "rgba(139, 92, 246, 0.13)",
    border: "rgba(139, 92, 246, 0.4)",
    text: "#c4b5fd",
    glow: "rgba(139, 92, 246, 0.2)",
    icon: "↻",
  },
  "Fading": {
    bg: "rgba(234, 179, 8, 0.10)",
    border: "rgba(234, 179, 8, 0.32)",
    text: "#fcd34d",
    glow: "rgba(234, 179, 8, 0.15)",
    icon: "◐",
  },
  "Post-fix": {
    bg: "rgba(71, 130, 180, 0.12)",
    border: "rgba(71, 130, 180, 0.35)",
    text: "#93c5fd",
    glow: "rgba(71, 130, 180, 0.18)",
    icon: "⌁",
  },
  "Ended": {
    bg: "rgba(244, 244, 244, 0.06)",
    border: "rgba(244, 244, 244, 0.14)",
    text: "rgba(244, 244, 244, 0.45)",
    glow: "rgba(244, 244, 244, 0.06)",
    icon: "◌",
  },
  "Dormant": {
    bg: "rgba(56, 80, 130, 0.13)",
    border: "rgba(56, 80, 130, 0.38)",
    text: "#a5b4fc",
    glow: "rgba(56, 80, 130, 0.18)",
    icon: "◑",
  },
  "Send help": {
    bg: "rgba(225, 29, 72, 0.11)",
    border: "rgba(225, 29, 72, 0.38)",
    text: "#fda4af",
    glow: "rgba(225, 29, 72, 0.18)",
    icon: "⚠",
  },
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
        boxShadow: `0 0 12px ${c.glow}, inset 0 1px 0 transparent`,
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
