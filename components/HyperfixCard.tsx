"use client";

import { CountUp } from "@/components/CountUp";

export type HyperfixCardProps = {
  title: string;
  type: string;
  day: number;
  intensity: number;
  user: string;
  tilt: string;
  started: string;
  note: string;
  color: string;
  coverUrl?: string;
};

const SEVERITY: { [k: number]: string } = {
  1: "mild interest", 2: "mild interest",
  3: "it's something", 4: "it's something",
  5: "definitely a thing", 6: "definitely a thing",
  7: "deeply unwell", 8: "deeply unwell",
  9: "send help", 10: "send help",
};

// Mini sparkline — intensity builds over time
function Sparkline({ intensity }: { intensity: number }) {
  const pts = [2, 3, 2, 4, 5, intensity * 0.6, intensity * 0.7, intensity * 0.8, intensity * 0.9, intensity].map(
    (v) => Math.max(1, Math.min(10, v))
  );
  const w = 200;
  const h = 40;
  const norm = (v: number) => h - 4 - ((v - 1) / 9) * (h - 8);
  const d = pts
    .map((p, i) => `${i === 0 ? "M" : "L"}${(i / (pts.length - 1)) * w},${norm(p)}`)
    .join(" ");
  return (
    <svg width="100%" height={h} viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none">
      <defs>
        <linearGradient id="spark-fill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#5EEAD4" stopOpacity="0.2" />
          <stop offset="100%" stopColor="#5EEAD4" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={`${d} L${w},${h} L0,${h} Z`} fill="url(#spark-fill)" />
      <path d={d} fill="none" stroke="#5EEAD4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function HyperfixCard({
  title,
  type,
  day,
  intensity,
  user,
  tilt,
  started,
  note,
}: HyperfixCardProps) {
  const severity = SEVERITY[Math.min(10, Math.max(1, intensity))];
  const pct = (intensity / 10) * 100;
  const category = type.split(" · ")[0].toUpperCase();

  return (
    <div
      className={`${tilt} group relative max-w-sm w-full`}
      style={{
        background: "#111113",
        border: "1px solid rgba(244,244,244,0.08)",
        borderRadius: 24,
        padding: 20,
        fontFamily: "'Helvetica Neue', system-ui, sans-serif",
        boxShadow: "0 0 0 1px rgba(244,244,244,0.04), 0 8px 32px rgba(0,0,0,0.6)",
      }}
    >
      {/* ── HEADER ── */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 8 }}>
        <div>
          <div style={{ color: "rgba(244,244,244,0.9)", fontSize: 15, fontWeight: 700, lineHeight: 1.2 }}>
            {title}
          </div>
          <div style={{ color: "rgba(244,244,244,0.4)", fontSize: 11, marginTop: 3, letterSpacing: "0.04em" }}>
            {type}
          </div>
        </div>
        <span style={{
          background: "#5EEAD4",
          color: "#0A0A0A",
          borderRadius: 999,
          padding: "3px 10px",
          fontSize: 11,
          fontWeight: 800,
          letterSpacing: "0.06em",
          whiteSpace: "nowrap",
          flexShrink: 0,
        }}>
          {category}
        </span>
      </div>

      {/* ── DAY COUNTER ── */}
      <div style={{ marginTop: 10, display: "flex", alignItems: "flex-end", gap: 6 }}>
        <span style={{
          color: "#F4F4F4",
          fontSize: 80,
          fontWeight: 900,
          lineHeight: 1,
          letterSpacing: -3,
          fontVariantNumeric: "tabular-nums",
        }}>
          <CountUp to={day} duration={1200} />
        </span>
        <div style={{ paddingBottom: 10, display: "flex", flexDirection: "column", gap: 2 }}>
          <span style={{ color: "rgba(244,244,244,0.35)", fontSize: 13, fontWeight: 600 }}>days</span>
          <span style={{
            background: intensity >= 8 ? "#E63946" : intensity >= 6 ? "#FB923C" : "#5EEAD4",
            color: "#0A0A0A",
            borderRadius: 999,
            padding: "2px 8px",
            fontSize: 10,
            fontWeight: 800,
            letterSpacing: "0.06em",
          }}>
            {severity}
          </span>
        </div>
      </div>

      {/* ── INTENSITY BAR ── */}
      <div style={{ marginTop: 12 }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
          <span style={{ color: "rgba(244,244,244,0.35)", fontSize: 10, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase" }}>
            Intensity
          </span>
          <span style={{ color: "#5EEAD4", fontSize: 10, fontWeight: 700 }}>
            {intensity}/10
          </span>
        </div>
        <div style={{
          background: "#5EEAD4",
          borderRadius: 999,
          height: 32,
          position: "relative",
          overflow: "hidden",
          display: "flex",
          alignItems: "center",
          padding: "0 10px",
          gap: 3,
        }}>
          {Array.from({ length: 16 }).map((_, i) => (
            <div key={i} style={{
              flex: 1,
              height: i % 3 === 0 ? 16 : i % 3 === 1 ? 10 : 13,
              background: "rgba(0,0,0,0.22)",
              borderRadius: 2,
            }} />
          ))}
          <div style={{
            position: "absolute",
            left: `${pct}%`,
            top: "50%",
            transform: "translate(-50%,-50%)",
            width: 20,
            height: 20,
            borderRadius: 999,
            background: "#fff",
            boxShadow: "0 2px 6px rgba(0,0,0,0.35)",
          }} />
        </div>
      </div>

      {/* ── SPARKLINE ── */}
      <div style={{ marginTop: 12 }}>
        <Sparkline intensity={intensity} />
      </div>

      {/* ── NOTE ── */}
      <div style={{
        marginTop: 10,
        borderLeft: "2px solid rgba(94,234,212,0.4)",
        paddingLeft: 10,
        color: "rgba(244,244,244,0.55)",
        fontSize: 13,
        fontStyle: "italic",
        lineHeight: 1.4,
      }}>
        {note}
      </div>

      {/* ── FOOTER ── */}
      <div style={{
        marginTop: 14,
        paddingTop: 12,
        borderTop: "1px solid rgba(244,244,244,0.07)",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}>
        <div>
          <div style={{ color: "rgba(244,244,244,0.9)", fontSize: 12, fontWeight: 600 }}>{started}</div>
          <div style={{ color: "rgba(244,244,244,0.35)", fontSize: 10, letterSpacing: "0.12em", textTransform: "uppercase", marginTop: 2 }}>started</div>
        </div>
        <div style={{ textAlign: "right" }}>
          <div style={{ color: "rgba(244,244,244,0.5)", fontSize: 11, letterSpacing: "0.08em" }}>{user}</div>
          <div style={{
            color: "#5EEAD4",
            fontSize: 11,
            fontWeight: 700,
            marginTop: 2,
            opacity: 0,
            transition: "opacity 0.2s ease",
          }}
          className="group-hover:!opacity-100"
          >
            share →
          </div>
        </div>
      </div>
    </div>
  );
}
