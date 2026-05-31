"use client";

import { useEffect, useState } from "react";

const TEAL = "var(--accent)";
const CARD_BG = "var(--bg)";
const CARD_BORDER = "var(--line)";

export function HeroProductMock() {
  const [day, setDay] = useState(47);
  const [intensity, setIntensity] = useState(8);
  const [checkedIn, setCheckedIn] = useState(false);

  useEffect(() => {
    const dayInterval = setInterval(() => {
      setDay((d) => (d >= 312 ? 47 : d + Math.ceil(Math.random() * 7)));
    }, 4500);
    const intensityInterval = setInterval(() => {
      setIntensity((i) => {
        const next = i + (Math.random() > 0.5 ? 1 : -1);
        return Math.max(5, Math.min(10, next));
      });
    }, 2200);
    const checkInterval = setInterval(() => {
      setCheckedIn((v) => !v);
    }, 3800);
    return () => {
      clearInterval(dayInterval);
      clearInterval(intensityInterval);
      clearInterval(checkInterval);
    };
  }, []);

  return (
    <div className="relative w-full max-w-[640px] mx-auto">
      {/* Subtle teal glow under the card */}
      <div
        aria-hidden
        className="absolute inset-0 -z-10"
        style={{
          background: "radial-gradient(ellipse 80% 60% at 50% 60%, var(--accent-soft) 0%, transparent 70%)",
          filter: "blur(30px)",
        }}
      />

      {/* Main card */}
      <div
        className="relative overflow-hidden rounded-3xl"
        style={{
          background: CARD_BG,
          border: `1px solid ${CARD_BORDER}`,
          boxShadow:
            "0 24px 80px rgba(0,0,0,0.6), 0 0 0 1px var(--accent-soft), inset 0 1px 0 var(--line)",
        }}
      >
        {/* Window chrome */}
        <div
          className="flex items-center justify-between px-4 py-3"
          style={{ borderBottom: `1px solid ${CARD_BORDER}`, background: "transparent" }}
        >
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full" style={{ background: "var(--line)" }} />
            <div className="w-2.5 h-2.5 rounded-full" style={{ background: "var(--line)" }} />
            <div className="w-2.5 h-2.5 rounded-full" style={{ background: "var(--line)" }} />
          </div>
          <p className="font-mono text-[10px] tracking-widest uppercase" style={{ color: "var(--ink-faint)" }}>
            hyperfix.app
          </p>
          <div className="w-9" />
        </div>

        {/* Body */}
        <div className="p-5 sm:p-7">
          {/* Breadcrumb / category strip */}
          <div className="flex items-center gap-2 mb-5">
            <span
              className="inline-flex items-center font-mono text-[9px] uppercase tracking-widest rounded-full px-2 py-0.5"
              style={{
                background: "var(--accent-soft)",
                border: "1px solid var(--accent)",
                color: TEAL,
              }}
            >
              show
            </span>
            <span className="font-mono text-[10px]" style={{ color: "var(--ink-faint)" }}>
              · public
            </span>
            <span className="font-mono text-[10px] ml-auto" style={{ color: "var(--ink-faint)" }}>
              started apr 12
            </span>
          </div>

          {/* Title */}
          <p
            className="font-display"
            style={{
              fontSize: "clamp(20px, 3.5vw, 28px)",
              fontWeight: 600,
              letterSpacing: "-0.02em",
              color: "var(--ink)",
              lineHeight: 1.2,
            }}
          >
            severance — the door scene
          </p>

          {/* Day counter */}
          <div
            className="mt-6 rounded-2xl p-5"
            style={{
              background: "var(--accent-soft)",
              border: "1px solid var(--accent-soft)",
            }}
          >
            <div className="flex items-baseline gap-3">
              <span
                key={day}
                className="font-display tabular-nums anim-cellPop"
                style={{
                  fontSize: "clamp(56px, 9vw, 88px)",
                  color: TEAL,
                  fontWeight: 700,
                  lineHeight: 1,
                  letterSpacing: "-0.04em",
                  textShadow: "0 0 40px rgba(111,138,99,0.3)",
                }}
              >
                {day}
              </span>
              <div>
                <p className="font-mono text-[10px] uppercase tracking-widest" style={{ color: "var(--accent)" }}>
                  days
                </p>
                <p className="font-mono text-[9px] uppercase tracking-widest mt-0.5" style={{ color: "var(--ink-faint)" }}>
                  and counting
                </p>
              </div>
              <div className="ml-auto text-right">
                <p className="font-mono text-[9px] uppercase tracking-widest" style={{ color: "var(--ink-faint)" }}>
                  intensity
                </p>
                <p className="font-display tabular-nums" style={{ fontSize: 28, color: "var(--ink)", fontWeight: 600, lineHeight: 1, letterSpacing: "-0.02em" }}>
                  {intensity}<span className="font-mono text-sm" style={{ color: "var(--ink-faint)" }}>/10</span>
                </p>
              </div>
            </div>

            {/* Intensity bar */}
            <div className="mt-4 h-1.5 rounded-full overflow-hidden" style={{ background: "var(--line)" }}>
              <div
                className="h-full rounded-full transition-all duration-700 ease-out"
                style={{
                  width: `${intensity * 10}%`,
                  background: `linear-gradient(to right, rgba(111,138,99,0.3), ${TEAL})`,
                  boxShadow: `0 0 12px var(--accent)`,
                }}
              />
            </div>
          </div>

          {/* Streak row */}
          <div className="mt-4 grid grid-cols-2 gap-3">
            <div
              className="rounded-2xl p-4"
              style={{
                background: "transparent",
                border: `1px solid ${CARD_BORDER}`,
              }}
            >
              <p className="font-mono text-[9px] uppercase tracking-widest mb-2" style={{ color: "var(--ink-faint)" }}>
                check-in run
              </p>
              <div className="flex items-baseline gap-1.5">
                <span className="font-display tabular-nums" style={{ fontSize: 24, color: TEAL, fontWeight: 700, letterSpacing: "-0.02em" }}>
                  12
                </span>
                <span className="font-mono text-[10px]" style={{ color: "var(--ink-muted)" }}>
                  days
                </span>
              </div>
              {/* Mini sparkline */}
              <div className="mt-2 flex items-end gap-0.5" style={{ height: 14 }}>
                {[3, 5, 4, 7, 6, 8, 9, 7, 10, 8, 11, 12].map((h, idx) => (
                  <div
                    key={idx}
                    className="flex-1 rounded-sm"
                    style={{
                      height: `${(h / 12) * 100}%`,
                      background: TEAL,
                      opacity: 0.25 + (h / 12) * 0.6,
                    }}
                  />
                ))}
              </div>
            </div>

            <div
              className="rounded-2xl p-4 flex flex-col justify-between transition-all duration-300"
              style={{
                background: checkedIn ? "var(--accent-soft)" : "transparent",
                border: `1px solid ${checkedIn ? "var(--accent-soft)" : CARD_BORDER}`,
              }}
            >
              <p className="font-mono text-[9px] uppercase tracking-widest" style={{ color: "var(--ink-faint)" }}>
                today
              </p>
              <div className="flex items-center gap-2">
                {checkedIn ? (
                  <>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={TEAL} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M20 6 9 17l-5-5" />
                    </svg>
                    <span className="font-sans text-sm font-semibold" style={{ color: TEAL }}>checked in</span>
                  </>
                ) : (
                  <>
                    <div className="w-3.5 h-3.5 rounded-full" style={{ border: "1.5px solid var(--ink-faint)" }} />
                    <span className="font-sans text-sm" style={{ color: "var(--ink-muted)" }}>check in →</span>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Floating notification chip */}
      <div
        className="absolute -bottom-3 -right-3 sm:-bottom-4 sm:-right-4 hidden sm:flex items-center gap-2 rounded-full px-3 py-2"
        style={{
          background: "var(--bg)",
          border: "1px solid var(--accent-soft)",
          boxShadow: "0 8px 24px rgba(0,0,0,0.5), 0 0 0 1px var(--accent-soft)",
        }}
      >
        <span className="relative flex h-2 w-2">
          <span className="anim-glowPulse absolute inline-flex h-full w-full rounded-full opacity-60" style={{ background: TEAL }} />
          <span className="relative inline-flex h-2 w-2 rounded-full" style={{ background: TEAL }} />
        </span>
        <span className="font-mono text-[10px] uppercase tracking-widest" style={{ color: "var(--ink-muted)" }}>
          someone is logging
        </span>
      </div>
    </div>
  );
}
