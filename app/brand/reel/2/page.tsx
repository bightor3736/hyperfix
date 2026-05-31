/* Reel 2 — "Day 47" — counter card live build animation.
   9:16, ~15s loop. */
"use client";

import { useEffect, useState } from "react";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"], weight: ["500", "700", "900"], display: "swap" });

const LIME = "#5EEAD4";
const LIME_BRIGHT = "#C8FF3D";
const LIME_DEEP = "#7CB205";
const INK = "var(--bg)";
const CARD = "#0F0F12";
const CARD_HI = "#1A1A1E";
const PAPER = "#F4F4F4";
const DIM = "#9CA3AF";
const FAINT = "#525861";

const TARGET = 47;
const COUNTER_START = 2.6; // seconds into reel
const COUNTER_DUR = 3.6;   // seconds
const LOOP = 15;            // total reel length

export default function Reel2() {
  const [count, setCount] = useState(0);
  const [t, setT] = useState(0);

  useEffect(() => {
    let raf = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const elapsed = ((now - start) / 1000) % LOOP;
      setT(elapsed);
      if (elapsed < COUNTER_START) setCount(0);
      else if (elapsed > COUNTER_START + COUNTER_DUR) setCount(TARGET);
      else {
        const p = (elapsed - COUNTER_START) / COUNTER_DUR;
        // ease-out cubic
        const e = 1 - Math.pow(1 - p, 3);
        setCount(Math.round(TARGET * e));
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  const fadeAt = (start: number, dur = 0.6) => {
    if (t < start) return { opacity: 0, transform: "translateY(20px)" };
    const p = Math.min(1, (t - start) / dur);
    return {
      opacity: p,
      transform: `translateY(${(1 - p) * 20}px)`,
    };
  };

  const popAt = (start: number, dur = 0.55) => {
    if (t < start) return { opacity: 0, transform: "scale(0.85)" };
    const p = Math.min(1, (t - start) / dur);
    const e = 1 - Math.pow(1 - p, 3);
    const overshoot = p < 0.7 ? 1 + e * 0.08 : 1.05 - (p - 0.7) * 0.17;
    return {
      opacity: e,
      transform: `scale(${overshoot})`,
    };
  };

  const barFill = (start: number, dur: number, target: number) => {
    if (t < start) return 0;
    const p = Math.min(1, (t - start) / dur);
    const e = 1 - Math.pow(1 - p, 3);
    return target * e;
  };

  const intensity = barFill(8.0, 2.5, 0.92);
  const intensityPct = `${(intensity * 100).toFixed(0)}%`;

  return (
    <main className="min-h-screen flex items-center justify-center" style={{ background: "#3F3F46" }}>
      <div
        id="reel"
        className={inter.className}
        style={{
          width: 1080,
          height: 1920,
          background: INK,
          color: PAPER,
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Lockup top */}
        <div
          style={{
            position: "absolute",
            top: 90,
            left: 80,
            display: "flex",
            alignItems: "center",
            gap: 18,
            ...fadeAt(0.3),
          }}
        >
          <svg width={48} height={48} viewBox="0 0 64 64">
            <rect width="64" height="64" rx="14" fill={INK} />
            <path d="M14 40 L32 20 L50 40 L42 40 L32 28 L22 40 Z" fill={LIME} />
            <path d="M14 50 L32 30 L50 50 L42 50 L32 38 L22 50 Z" fill={LIME_DEEP} />
          </svg>
          <span style={{ fontSize: 36, fontWeight: 900, letterSpacing: -1.5, lineHeight: 1 }}>Hyperfix</span>
        </div>
        <div style={{ position: "absolute", top: 102, right: 80, fontSize: 18, fontWeight: 700, letterSpacing: 3, color: DIM, textTransform: "uppercase", ...fadeAt(0.3) }}>
          Live demo
        </div>

        {/* CARD */}
        <div
          style={{
            position: "absolute",
            top: 280,
            left: 80,
            width: 920,
            height: 1380,
            background: `linear-gradient(180deg, ${CARD_HI} 0%, ${CARD} 60%)`,
            borderRadius: 56,
            boxShadow: "0 40px 80px -20px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.06)",
            padding: 64,
            ...fadeAt(1.0, 0.7),
          }}
        >
          {/* menu dots */}
          <div style={{ position: "absolute", top: 32, right: 64, display: "flex", gap: 10 }}>
            <span style={{ width: 8, height: 8, borderRadius: 999, background: "#3A3A40" }} />
            <span style={{ width: 8, height: 8, borderRadius: 999, background: "#3A3A40" }} />
            <span style={{ width: 8, height: 8, borderRadius: 999, background: "#3A3A40" }} />
          </div>

          {/* header */}
          <div style={{ ...fadeAt(1.8) }}>
            <div style={{ fontSize: 36, fontWeight: 700, color: PAPER }}>
              Marauders
              <sup style={{ marginLeft: 8, fontSize: 22, fontWeight: 700, color: DIM }}>47</sup>
            </div>
            <div style={{ marginTop: 8, fontSize: 22, fontWeight: 500, color: DIM }}>
              fanfic · ao3
            </div>
          </div>

          {/* DAY label */}
          <div
            style={{
              marginTop: 90,
              fontSize: 28,
              fontWeight: 800,
              letterSpacing: 6,
              textTransform: "uppercase",
              color: DIM,
              ...fadeAt(2.3),
            }}
          >
            Day
          </div>

          {/* COUNTER */}
          <div
            style={{
              marginTop: 8,
              fontSize: 360,
              fontWeight: 900,
              letterSpacing: -22,
              lineHeight: 1,
              color: PAPER,
              fontVariantNumeric: "tabular-nums",
              ...popAt(2.5, 0.4),
            }}
          >
            {count}
          </div>

          {/* TITLE */}
          <div
            style={{
              marginTop: 24,
              fontSize: 44,
              fontWeight: 700,
              lineHeight: 1.1,
              letterSpacing: -1.5,
              color: PAPER,
              ...fadeAt(6.6, 0.7),
            }}
          >
            the marauders fic that ruined my life
          </div>

          {/* INTENSITY label row */}
          <div
            style={{
              marginTop: 64,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "baseline",
              ...fadeAt(7.5),
            }}
          >
            <span style={{ fontSize: 22, fontWeight: 800, letterSpacing: 4, textTransform: "uppercase", color: DIM }}>
              Intensity
            </span>
            <span style={{ fontSize: 22, fontWeight: 800, letterSpacing: 2, textTransform: "uppercase", color: PAPER, opacity: intensity > 0.85 ? 1 : 0, transition: "opacity 0.3s" }}>
              Send help
            </span>
          </div>

          {/* INTENSITY BAR */}
          <div style={{ position: "relative", marginTop: 22, height: 80, borderRadius: 999, background: "#222226", overflow: "hidden", ...fadeAt(7.5) }}>
            <div
              style={{
                position: "absolute",
                inset: 0,
                width: intensityPct,
                background: LIME,
                borderRadius: 999,
                boxShadow: `0 0 40px -5px ${LIME}aa, inset 0 2px 0 ${LIME_BRIGHT}`,
                transition: "none",
              }}
            />
            <div
              style={{
                position: "absolute",
                top: 4,
                left: 4,
                height: 36,
                width: intensity > 0 ? `calc(${intensityPct} - 8px)` : "0",
                background: `linear-gradient(180deg, ${LIME_BRIGHT} 0%, transparent 100%)`,
                opacity: 0.5,
                borderRadius: 999,
              }}
            />
          </div>

          {/* SHARE chip + handle */}
          <div
            style={{
              position: "absolute",
              bottom: 64,
              left: 64,
              right: 64,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              ...fadeAt(11.0, 0.6),
            }}
          >
            <span style={{ fontSize: 22, fontWeight: 700, letterSpacing: 3, textTransform: "uppercase", color: DIM }}>
              @lupin-loving-loser
            </span>
            <div
              style={{
                background: LIME,
                color: INK,
                padding: "20px 36px",
                borderRadius: 999,
                fontSize: 24,
                fontWeight: 900,
                letterSpacing: -0.5,
                boxShadow: `0 0 50px -10px ${LIME}aa`,
              }}
            >
              Share →
            </div>
          </div>
        </div>

        {/* footer caption */}
        <div
          style={{
            position: "absolute",
            bottom: 80,
            left: 80,
            right: 80,
            textAlign: "center",
            fontSize: 26,
            fontWeight: 700,
            color: DIM,
            letterSpacing: 4,
            textTransform: "uppercase",
            ...fadeAt(12.2),
          }}
        >
          hyperfix.app · the card is the product
        </div>
      </div>
    </main>
  );
}
