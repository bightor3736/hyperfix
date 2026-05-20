import React from "react";

interface SparkleConfig {
  top: string;
  left: string;
  fontSize: string;
  opacity: number;
}

// Hardcoded positions (no Math.random for SSR safety)
const SPARKLE_CONFIGS: SparkleConfig[] = [
  { top: "8%",  left: "7%",   fontSize: "14px", opacity: 0.28 },
  { top: "72%", left: "12%",  fontSize: "10px", opacity: 0.15 },
  { top: "20%", left: "88%",  fontSize: "16px", opacity: 0.32 },
  { top: "58%", left: "93%",  fontSize: "8px",  opacity: 0.18 },
  { top: "85%", left: "55%",  fontSize: "12px", opacity: 0.22 },
  { top: "35%", left: "48%",  fontSize: "9px",  opacity: 0.14 },
  { top: "5%",  left: "62%",  fontSize: "11px", opacity: 0.25 },
  { top: "90%", left: "80%",  fontSize: "13px", opacity: 0.20 },
];

interface SparklesProps {
  count?: number;
  className?: string;
}

export function Sparkles({ count = 6, className = "" }: SparklesProps) {
  const configs = SPARKLE_CONFIGS.slice(0, Math.min(count, SPARKLE_CONFIGS.length));

  return (
    <div
      className={`absolute inset-0 pointer-events-none overflow-hidden ${className}`}
      aria-hidden="true"
    >
      {configs.map((cfg, i) => (
        <span
          key={i}
          style={{
            position: "absolute",
            top: cfg.top,
            left: cfg.left,
            fontSize: cfg.fontSize,
            opacity: cfg.opacity,
            color: "#5EEAD4",
            userSelect: "none",
            lineHeight: 1,
          }}
        >
          ✦
        </span>
      ))}
    </div>
  );
}
