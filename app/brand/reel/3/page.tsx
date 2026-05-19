/* Reel 3 — "Wrapped 2026" — Spotify-Wrapped-style countdown.
   9:16, ~20s loop. */
"use client";

import { useEffect, useState } from "react";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"], weight: ["500", "700", "900"], display: "swap" });

const LIME = "#A3E635";
const LIME_BRIGHT = "#C8FF3D";
const LIME_DEEP = "#7CB205";
const INK = "#0A0A0A";
const PAPER = "#F4F4F4";
const DIM = "#9CA3AF";

const TOP = [
  { rank: "03", title: "Sabrina Carpenter — Tears", meta: "song · 41 days · 219 loops", color: "#F472B6" },
  { rank: "02", title: "Larissa Weems × Wednesday", meta: "ship · 89 days · intensity 9.1", color: "#FACC15" },
  { rank: "01", title: "The Marauders fic that ruined my life", meta: "fanfic · 187 days · your longest fix ever", color: LIME },
];

const LOOP = 18;
// scene timings (seconds)
const T_INTRO_IN  = 0.4;
const T_INTRO_OUT = 3.5;
const T_03_IN     = 4.0;
const T_03_OUT    = 7.5;
const T_02_IN     = 8.0;
const T_02_OUT    = 11.5;
const T_01_IN     = 12.0;
const T_01_OUT    = 17.0;
const T_CTA       = 14.0;

export default function Reel3() {
  const [t, setT] = useState(0);

  useEffect(() => {
    let raf = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const elapsed = ((now - start) / 1000) % LOOP;
      setT(elapsed);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  // helpers
  const visAt = (inT: number, outT: number, dur = 0.5) => {
    if (t < inT) return { opacity: 0, transform: "translateY(40px)" };
    if (t > outT) {
      const p = Math.min(1, (t - outT) / dur);
      return { opacity: 1 - p, transform: `translateY(${-p * 40}px)` };
    }
    const p = Math.min(1, (t - inT) / dur);
    const e = 1 - Math.pow(1 - p, 3);
    return { opacity: e, transform: `translateY(${(1 - e) * 40}px)` };
  };

  const fadeAt = (start: number, dur = 0.6) => {
    if (t < start) return { opacity: 0 };
    const p = Math.min(1, (t - start) / dur);
    return { opacity: p };
  };

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
        {/* Persistent lockup top */}
        <div
          style={{
            position: "absolute",
            top: 90,
            left: 80,
            display: "flex",
            alignItems: "center",
            gap: 18,
          }}
        >
          <svg width={48} height={48} viewBox="0 0 64 64">
            <rect width="64" height="64" rx="14" fill={INK} />
            <path d="M14 40 L32 20 L50 40 L42 40 L32 28 L22 40 Z" fill={LIME} />
            <path d="M14 50 L32 30 L50 50 L42 50 L32 38 L22 50 Z" fill={LIME_DEEP} />
          </svg>
          <span style={{ fontSize: 36, fontWeight: 900, letterSpacing: -1.5, lineHeight: 1 }}>Hyperfix</span>
        </div>
        <div style={{ position: "absolute", top: 102, right: 80, fontSize: 18, fontWeight: 800, letterSpacing: 4, color: LIME, textTransform: "uppercase" }}>
          Wrapped · 2026
        </div>

        {/* INTRO scene */}
        <div
          style={{
            position: "absolute",
            top: 720,
            left: 80,
            right: 80,
            textAlign: "center",
            ...visAt(T_INTRO_IN, T_INTRO_OUT),
          }}
        >
          <div style={{ fontSize: 32, fontWeight: 800, letterSpacing: 6, color: DIM, textTransform: "uppercase" }}>
            Your top hyperfixes
          </div>
          <div style={{ fontSize: 280, fontWeight: 900, letterSpacing: -16, lineHeight: 1, marginTop: 30, color: PAPER }}>
            2026
          </div>
          <div style={{ marginTop: 36, fontSize: 32, fontWeight: 500, color: DIM, letterSpacing: -0.5 }}>
            187 days · 14 fixes · 1 brain
          </div>
        </div>

        {/* RANK SCENES */}
        {TOP.map((item, i) => {
          const inT  = [T_03_IN, T_02_IN, T_01_IN][i];
          const outT = [T_03_OUT, T_02_OUT, T_01_OUT][i];
          const isOne = i === 2;
          return (
            <div
              key={item.rank}
              style={{
                position: "absolute",
                top: isOne ? 360 : 420,
                left: 80,
                right: 80,
                ...visAt(inT, outT),
              }}
            >
              <div style={{ fontSize: 32, fontWeight: 800, letterSpacing: 6, color: DIM, textTransform: "uppercase" }}>
                #{item.rank}
              </div>
              <div
                style={{
                  fontSize: isOne ? 520 : 360,
                  fontWeight: 900,
                  letterSpacing: isOne ? -28 : -20,
                  lineHeight: 0.92,
                  marginTop: 24,
                  color: item.color,
                  fontVariantNumeric: "tabular-nums",
                  textShadow: isOne ? `0 0 80px ${item.color}66` : "none",
                }}
              >
                {item.rank}
              </div>
              <div
                style={{
                  marginTop: isOne ? 40 : 24,
                  fontSize: isOne ? 64 : 52,
                  fontWeight: 900,
                  letterSpacing: -2,
                  lineHeight: 1.05,
                  color: PAPER,
                }}
              >
                {item.title}
              </div>
              <div style={{ marginTop: 24, fontSize: 26, fontWeight: 700, letterSpacing: 3, color: DIM, textTransform: "uppercase" }}>
                {item.meta}
              </div>
              {isOne && (
                <div
                  style={{
                    marginTop: 48,
                    display: "inline-block",
                    background: LIME,
                    color: INK,
                    padding: "20px 36px",
                    borderRadius: 999,
                    fontSize: 26,
                    fontWeight: 900,
                    boxShadow: `0 0 50px -10px ${LIME}aa`,
                  }}
                >
                  Your longest fix. Ever.
                </div>
              )}
            </div>
          );
        })}

        {/* CTA at end */}
        <div
          style={{
            position: "absolute",
            bottom: 140,
            left: 80,
            right: 80,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            ...fadeAt(T_CTA),
          }}
        >
          <div>
            <div style={{ fontSize: 26, fontWeight: 700, letterSpacing: 4, color: DIM, textTransform: "uppercase" }}>
              Get yours
            </div>
            <div style={{ marginTop: 12, fontSize: 38, fontWeight: 900, letterSpacing: -1.5, color: PAPER }}>
              hyperfix.app
            </div>
          </div>
          <div
            style={{
              background: LIME,
              color: INK,
              padding: "28px 40px",
              borderRadius: 999,
              fontSize: 30,
              fontWeight: 900,
              letterSpacing: -1,
              boxShadow: `0 0 60px -10px ${LIME}aa`,
            }}
          >
            Join waitlist →
          </div>
        </div>
      </div>
    </main>
  );
}
