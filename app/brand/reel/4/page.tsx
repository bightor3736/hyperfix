/* Reel 4 — "POV: 14 active fixes" — staggered list reveal.
   9:16, ~22s loop. */
"use client";

import { useEffect, useState } from "react";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"], weight: ["500", "700", "900"], display: "swap" });

const TEAL    = "#5EEAD4";
const TEAL_DIM = "#2DD4BF";
const INK     = "var(--bg)";
const CARD    = "var(--bg)";
const CARD_HI = "#161719";
const PAPER   = "#F4F4F4";
const DIM     = "#6B7280";
const FAINT   = "rgba(244,244,244,0.06)";

const LOOP = 22;

const FIXES = [
  { title: "Chappell Roan — Hot to Go",          cat: "music",     days: 89  },
  { title: "Wednesday Addams",                    cat: "show",      days: 34  },
  { title: "the marauders fic that ruined my life", cat: "fanfic",  days: 187 },
  { title: "third wave espresso",                 cat: "hobby",     days: 241 },
  { title: "trad goth aesthetics",                cat: "aesthetic", days: 52  },
  { title: "Jujutsu Kaisen",                      cat: "anime",     days: 61  },
  { title: "crossword speed runs",                cat: "hobby",     days: 18  },
  { title: "Twilight rewatches",                  cat: "film",      days: 116 },
  { title: "Lana Del Rey discography",            cat: "music",     days: 203 },
  { title: "cozy fantasy novels",                 cat: "books",     days: 44  },
  { title: "vintage film photography",            cat: "hobby",     days: 67  },
  { title: "that one podcast about cults",        cat: "podcast",   days: 11  },
];

const LIST_START = 5.6;
const ITEM_STAGGER = 0.45;
const CTA_T = LIST_START + FIXES.length * ITEM_STAGGER + 1.2;

export default function Reel4() {
  const [t, setT] = useState(0);

  useEffect(() => {
    let raf = 0;
    const start = performance.now();
    const tick = (now: number) => {
      setT(((now - start) / 1000) % LOOP);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  const fade = (inT: number, dur = 0.5) => {
    if (t < inT) return { opacity: 0, transform: "translateY(16px)" };
    const p = Math.min(1, (t - inT) / dur);
    const e = 1 - Math.pow(1 - p, 3);
    return { opacity: e, transform: `translateY(${(1 - e) * 16}px)` };
  };

  const pop = (inT: number, dur = 0.4) => {
    if (t < inT) return { opacity: 0, transform: "scale(0.9) translateX(-12px)" };
    const p = Math.min(1, (t - inT) / dur);
    const e = 1 - Math.pow(1 - p, 3);
    const scale = p < 0.6 ? 0.9 + e * 0.12 : 1.02 - (p - 0.6) * 0.05;
    return { opacity: e, transform: `scale(${scale}) translateX(${(1 - e) * -12}px)` };
  };

  const ctaVisible = t > CTA_T;
  const ctaP = ctaVisible ? Math.min(1, (t - CTA_T) / 0.7) : 0;
  const ctaE = 1 - Math.pow(1 - ctaP, 3);

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
        {/* ambient teal bloom */}
        <div
          style={{
            position: "absolute",
            top: -300,
            left: "50%",
            transform: "translateX(-50%)",
            width: 900,
            height: 900,
            background: `radial-gradient(ellipse, ${TEAL}18 0%, transparent 70%)`,
            pointerEvents: "none",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: -200,
            left: "50%",
            transform: "translateX(-50%)",
            width: 700,
            height: 700,
            background: `radial-gradient(ellipse, ${TEAL}10 0%, transparent 70%)`,
            pointerEvents: "none",
            opacity: ctaE,
          }}
        />

        {/* top lockup */}
        <div
          style={{
            position: "absolute",
            top: 80,
            left: 80,
            display: "flex",
            alignItems: "center",
            gap: 18,
            ...fade(0.2),
          }}
        >
          <svg width={44} height={44} viewBox="0 0 64 64">
            <rect width="64" height="64" rx="14" fill={CARD_HI} />
            <path d="M14 40 L32 20 L50 40 L42 40 L32 28 L22 40 Z" fill={TEAL} />
            <path d="M14 50 L32 30 L50 50 L42 50 L32 38 L22 50 Z" fill={TEAL_DIM} opacity="0.7" />
          </svg>
          <span style={{ fontSize: 34, fontWeight: 900, letterSpacing: -1.5, lineHeight: 1 }}>Hyperfix</span>
        </div>
        <div
          style={{
            position: "absolute",
            top: 92,
            right: 80,
            fontSize: 18,
            fontWeight: 700,
            letterSpacing: 4,
            color: TEAL,
            textTransform: "uppercase",
            ...fade(0.2),
          }}
        >
          live now
        </div>

        {/* HEADLINE */}
        <div
          style={{
            position: "absolute",
            top: 220,
            left: 80,
            right: 80,
          }}
        >
          {/* POV pill */}
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 10,
              background: `${TEAL}18`,
              border: `1px solid ${TEAL}30`,
              borderRadius: 999,
              padding: "10px 24px",
              marginBottom: 32,
              ...fade(0.4),
            }}
          >
            <span
              style={{
                display: "block",
                width: 8,
                height: 8,
                borderRadius: 999,
                background: TEAL,
                boxShadow: `0 0 8px ${TEAL}`,
              }}
            />
            <span style={{ fontSize: 20, fontWeight: 800, letterSpacing: 4, color: TEAL, textTransform: "uppercase" }}>
              POV
            </span>
          </div>

          <div
            style={{
              fontSize: 108,
              fontWeight: 900,
              letterSpacing: -6,
              lineHeight: 0.93,
              ...fade(0.7),
            }}
          >
            you have
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "baseline",
              gap: 16,
              marginTop: 8,
              ...fade(1.4, 0.55),
            }}
          >
            <span
              style={{
                fontSize: 168,
                fontWeight: 900,
                letterSpacing: -10,
                lineHeight: 0.92,
                color: TEAL,
                fontVariantNumeric: "tabular-nums",
                textShadow: `0 0 60px ${TEAL}55`,
              }}
            >
              {FIXES.length}
            </span>
            <span
              style={{
                fontSize: 92,
                fontWeight: 900,
                letterSpacing: -5,
                lineHeight: 0.92,
              }}
            >
              active
              <br />
              fixes
            </span>
          </div>

          <div
            style={{
              marginTop: 20,
              fontSize: 68,
              fontWeight: 900,
              letterSpacing: -3,
              lineHeight: 0.97,
              color: DIM,
              ...fade(2.5, 0.6),
            }}
          >
            and you&apos;re{" "}
            <span style={{ color: PAPER }}>thriving</span>
          </div>
        </div>

        {/* FIX LIST */}
        <div
          style={{
            position: "absolute",
            top: 800,
            left: 0,
            right: 0,
            padding: "0 80px",
          }}
        >
          {FIXES.map((fix, i) => {
            const inT = LIST_START + i * ITEM_STAGGER;
            const style = pop(inT);
            const isDone = t > inT + 0.4;

            return (
              <div
                key={i}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  paddingTop: 18,
                  paddingBottom: 18,
                  borderBottom: `1px solid ${FAINT}`,
                  gap: 20,
                  ...style,
                }}
              >
                {/* left: category + title */}
                <div style={{ display: "flex", alignItems: "center", gap: 20, minWidth: 0 }}>
                  <span
                    style={{
                      flexShrink: 0,
                      fontSize: 14,
                      fontWeight: 800,
                      letterSpacing: 3,
                      textTransform: "uppercase",
                      color: isDone ? TEAL : DIM,
                      fontFamily: "monospace",
                      minWidth: 90,
                    }}
                  >
                    {fix.cat}
                  </span>
                  <span
                    style={{
                      fontSize: 28,
                      fontWeight: 700,
                      letterSpacing: -0.5,
                      lineHeight: 1.1,
                      color: PAPER,
                      overflow: "hidden",
                      whiteSpace: "nowrap",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {fix.title}
                  </span>
                </div>

                {/* right: day count */}
                <div style={{ flexShrink: 0, textAlign: "right" }}>
                  <span
                    style={{
                      fontSize: 28,
                      fontWeight: 900,
                      letterSpacing: -1,
                      fontVariantNumeric: "tabular-nums",
                      color: isDone ? TEAL : DIM,
                    }}
                  >
                    {fix.days}
                  </span>
                  <span
                    style={{
                      fontSize: 14,
                      fontWeight: 700,
                      letterSpacing: 2,
                      textTransform: "uppercase",
                      color: DIM,
                      marginLeft: 4,
                    }}
                  >
                    d
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* total tally */}
        <div
          style={{
            position: "absolute",
            top: 800 + FIXES.length * 66 + 20,
            left: 80,
            right: 80,
            paddingTop: 24,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            opacity: ctaE,
          }}
        >
          <span style={{ fontSize: 18, fontWeight: 700, letterSpacing: 4, textTransform: "uppercase", color: DIM }}>
            Total logged
          </span>
          <span
            style={{
              fontSize: 32,
              fontWeight: 900,
              letterSpacing: -1,
              fontVariantNumeric: "tabular-nums",
              color: TEAL,
            }}
          >
            {FIXES.reduce((a, f) => a + f.days, 0).toLocaleString()} days
          </span>
        </div>

        {/* CTA */}
        <div
          style={{
            position: "absolute",
            bottom: 100,
            left: 80,
            right: 80,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            opacity: ctaE,
            transform: `translateY(${(1 - ctaE) * 24}px)`,
          }}
        >
          <div>
            <div style={{ fontSize: 22, fontWeight: 700, letterSpacing: 4, textTransform: "uppercase", color: DIM }}>
              what&apos;s yours?
            </div>
            <div
              style={{
                marginTop: 10,
                fontSize: 34,
                fontWeight: 900,
                letterSpacing: -1.5,
                color: PAPER,
              }}
            >
              hyperfix.app
            </div>
          </div>
          <div
            style={{
              background: TEAL,
              color: INK,
              padding: "26px 40px",
              borderRadius: 999,
              fontSize: 28,
              fontWeight: 900,
              letterSpacing: -0.5,
              boxShadow: `0 0 60px -10px ${TEAL}aa`,
            }}
          >
            Log a fix →
          </div>
        </div>
      </div>
    </main>
  );
}
