"use client";
import { useEffect, useRef, useState } from "react";

interface RingProps {
  radius: number;
  stroke: number;
  color: string;
  trackColor: string;
  progress: number; // 0-1
  delay?: number;
  label: string;
  value: string;
  sub: string;
}

function ActivityRing({ radius, stroke, color, trackColor, progress, delay = 0, label, value, sub }: RingProps) {
  const [animated, setAnimated] = useState(false);
  const ref = useRef<SVGCircleElement>(null);

  const c = 2 * Math.PI * radius;
  const offset = c * (1 - (animated ? progress : 0));

  useEffect(() => {
    const timer = setTimeout(() => setAnimated(true), 400 + delay);
    return () => clearTimeout(timer);
  }, [delay]);

  return (
    <div style={{ textAlign: "center" }}>
      <svg
        width={(radius + stroke) * 2 + 4}
        height={(radius + stroke) * 2 + 4}
        viewBox={`0 0 ${(radius + stroke) * 2 + 4} ${(radius + stroke) * 2 + 4}`}
        style={{ display: "block", margin: "0 auto" }}
      >
        <g transform={`translate(${radius + stroke + 2}, ${radius + stroke + 2}) rotate(-90)`}>
          {/* Track */}
          <circle cx={0} cy={0} r={radius} fill="none" stroke={trackColor} strokeWidth={stroke} />
          {/* Arc */}
          <circle
            ref={ref}
            cx={0}
            cy={0}
            r={radius}
            fill="none"
            stroke={color}
            strokeWidth={stroke}
            strokeLinecap="round"
            strokeDasharray={c}
            strokeDashoffset={offset}
            style={{ transition: `stroke-dashoffset 1.4s cubic-bezier(0.34,1.10,0.64,1) ${delay}ms` }}
          />
          {/* End dot glow */}
          {animated && (
            <circle
              cx={radius * Math.cos((progress * 2 * Math.PI) - Math.PI / 2 + 0.01)}
              cy={radius * Math.sin((progress * 2 * Math.PI) - Math.PI / 2 + 0.01)}
              r={stroke / 2}
              fill={color}
              filter="url(#dot-glow)"
            />
          )}
        </g>
        <defs>
          <filter id="dot-glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
        </defs>
      </svg>
      <div style={{ marginTop: 20 }}>
        <div style={{ fontSize: 30, fontWeight: 700, color: "#fff", letterSpacing: "-0.025em", lineHeight: 1 }}>{value}</div>
        <div style={{ fontSize: 14, fontWeight: 600, color, marginTop: 4 }}>{label}</div>
        <div style={{ fontSize: 12, color: "rgba(255,255,255,0.35)", marginTop: 2 }}>{sub}</div>
      </div>
    </div>
  );
}

export function Rings() {
  return (
    <section
      id="rings"
      style={{
        background: "var(--d-bg-2, #111)",
        padding: "120px 0",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Subtle glow */}
      <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", width: 600, height: 400, background: "radial-gradient(ellipse, rgba(124,58,237,0.12) 0%, transparent 70%)", pointerEvents: "none" }} />

      <div className="container" style={{ position: "relative", zIndex: 1 }}>
        <div style={{ textAlign: "center", marginBottom: 80 }}>
          <div className="apple-label" style={{ marginBottom: 16 }}>Your progress</div>
          <h2 className="apple-headline-lg" style={{ color: "#fff", marginBottom: 20 }}>
            At a glance.
          </h2>
          <p className="apple-body" style={{ maxWidth: 460, margin: "0 auto", color: "rgba(235,235,245,0.55)" }}>
            Three rings. Every day. Your streak, your XP, your focus time — all in one view, just like your health data.
          </p>
        </div>

        <div className="flex flex-wrap justify-center items-start gap-8 sm:gap-12 lg:gap-16">
          <ActivityRing
            radius={72}
            stroke={14}
            color="#ff375f"
            trackColor="rgba(255,55,95,0.15)"
            progress={0.78}
            delay={0}
            label="Streak"
            value="14d"
            sub="Days in a row"
          />
          <ActivityRing
            radius={72}
            stroke={14}
            color="#30d158"
            trackColor="rgba(48,209,88,0.12)"
            progress={0.65}
            delay={150}
            label="XP Today"
            value="820"
            sub="Points earned"
          />
          <ActivityRing
            radius={72}
            stroke={14}
            color="#5ac8f5"
            trackColor="rgba(90,200,245,0.12)"
            progress={0.52}
            delay={300}
            label="Focus"
            value="52m"
            sub="Minutes focused"
          />
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-16 max-w-2xl mx-auto">
          {[
            { label: "Tasks started", value: "1,240" },
            { label: "Streak freezes saved", value: "89" },
            { label: "XP earned total", value: "48.2k" },
            { label: "Bad weeks survived", value: "∞" },
          ].map((s) => (
            <div
              key={s.label}
              style={{
                padding: "16px 20px",
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.08)",
                borderRadius: 16,
                textAlign: "center",
              }}
            >
              <div style={{ fontSize: 24, fontWeight: 700, color: "#fff", letterSpacing: "-0.025em" }}>{s.value}</div>
              <div style={{ fontSize: 12, color: "rgba(255,255,255,0.40)", marginTop: 3, fontWeight: 500 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
