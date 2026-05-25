"use client";

import { useState, useEffect } from "react";

const TEAL = "#5EEAD4";
const CARD_BG = "#0F1011";
const CARD_BORDER = "rgba(255,255,255,0.08)";

const PLACEHOLDERS = [
  "severance — the door scene",
  "hozier discography",
  "the bear · season 3",
  "baldur's gate 3 (astarion route)",
  "chappell roan · the rise and fall",
  "jjk shibuya arc",
  "taylor swift · folklore",
];

const PAPER_NOISE_URL =
  "url(\"data:image/svg+xml;utf8,<svg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='1.1' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 0.07  0 0 0 0 0.07  0 0 0 0 0.07  0 0 0 0.18 0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>\")";

export function InteractiveHeroDemo() {
  const [title, setTitle] = useState("");
  const [placeholderIdx, setPlaceholderIdx] = useState(0);
  const [intensity, setIntensity] = useState(8);
  const [day, setDay] = useState(47);
  const [showCard, setShowCard] = useState(false);

  // Cycle placeholder text while input is empty
  useEffect(() => {
    if (title) return;
    const t = setInterval(() => {
      setPlaceholderIdx((i) => (i + 1) % PLACEHOLDERS.length);
    }, 2800);
    return () => clearInterval(t);
  }, [title]);

  // Animate day count when card opens
  useEffect(() => {
    if (!showCard) return;
    setDay(1);
    let n = 1;
    const target = 47;
    const t = setInterval(() => {
      n = Math.min(target, n + Math.ceil(Math.random() * 5));
      setDay(n);
      if (n >= target) clearInterval(t);
    }, 50);
    return () => clearInterval(t);
  }, [showCard]);

  const intensityColor = intensity >= 9 ? "#E63946" : intensity >= 7 ? "#FB923C" : TEAL;
  const displayTitle = title.trim() || PLACEHOLDERS[placeholderIdx];

  function handleStart() {
    if (!showCard) {
      setShowCard(true);
    }
  }

  return (
    <div className="relative w-full max-w-[680px] mx-auto">
      {/* Glow under */}
      <div
        aria-hidden
        className="absolute inset-0 -z-10"
        style={{
          background: "radial-gradient(ellipse 80% 60% at 50% 60%, rgba(94,234,212,0.20) 0%, transparent 70%)",
          filter: "blur(30px)",
        }}
      />

      {/* Demo container */}
      <div
        className="relative overflow-hidden rounded-3xl"
        style={{
          background: CARD_BG,
          border: `1px solid ${CARD_BORDER}`,
          boxShadow: "0 24px 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(94,234,212,0.08), inset 0 1px 0 rgba(255,255,255,0.05)",
        }}
      >
        {/* Window chrome */}
        <div className="flex items-center justify-between px-4 py-3" style={{ borderBottom: `1px solid ${CARD_BORDER}`, background: "rgba(255,255,255,0.02)" }}>
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full" style={{ background: "rgba(255,255,255,0.12)" }} />
            <div className="w-2.5 h-2.5 rounded-full" style={{ background: "rgba(255,255,255,0.12)" }} />
            <div className="w-2.5 h-2.5 rounded-full" style={{ background: "rgba(255,255,255,0.12)" }} />
          </div>
          <p className="font-mono text-[10px] tracking-widest uppercase" style={{ color: "rgba(255,255,255,0.3)" }}>
            try it · no signup
          </p>
          <div className="w-9" />
        </div>

        {/* Body */}
        <div className="p-5 sm:p-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Form side */}
          <div className="flex flex-col gap-5">
            <div>
              <p className="font-mono text-[10px] uppercase tracking-widest mb-2" style={{ color: "rgba(94,234,212,0.6)" }}>
                step 1 — name it
              </p>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder={PLACEHOLDERS[placeholderIdx]}
                className="w-full rounded-2xl px-4 py-3 font-sans text-base outline-none transition-all focus:ring-2 focus:ring-[#5EEAD4]/40 placeholder:text-[rgba(255,255,255,0.25)]"
                style={{
                  background: "rgba(255,255,255,0.03)",
                  border: "1px solid rgba(255,255,255,0.10)",
                  color: "#F4F4F4",
                }}
                onFocus={() => setShowCard(true)}
              />
            </div>

            <div>
              <div className="flex items-baseline justify-between mb-2">
                <p className="font-mono text-[10px] uppercase tracking-widest" style={{ color: "rgba(94,234,212,0.6)" }}>
                  step 2 — how bad is it
                </p>
                <span
                  className="font-display tabular-nums"
                  style={{ fontSize: 22, color: intensityColor, fontWeight: 700, letterSpacing: "-0.02em" }}
                >
                  {intensity}<span className="font-mono text-xs" style={{ color: "rgba(255,255,255,0.4)" }}>/10</span>
                </span>
              </div>
              <div className="relative py-2">
                <div className="h-2 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.06)" }}>
                  <div
                    className="h-full rounded-full transition-all duration-300"
                    style={{
                      width: `${intensity * 10}%`,
                      background: `linear-gradient(to right, ${TEAL}, ${intensityColor})`,
                      boxShadow: `0 0 12px ${intensityColor}80`,
                    }}
                  />
                </div>
                <input
                  type="range"
                  min={1}
                  max={10}
                  value={intensity}
                  onChange={(e) => {
                    setIntensity(parseInt(e.target.value, 10));
                    setShowCard(true);
                  }}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
              </div>
            </div>

            <button
              onClick={handleStart}
              className="font-sans text-sm font-semibold px-5 py-3 rounded-full transition-all hover:opacity-90 active:scale-[0.98]"
              style={{ background: TEAL, color: "#0A1F1C" }}
            >
              {showCard ? "see it for real →" : "start counting →"}
            </button>

            <p className="font-mono text-[10px] uppercase tracking-widest" style={{ color: "rgba(255,255,255,0.3)" }}>
              this is the demo. your real fix saves & counts daily.
            </p>
          </div>

          {/* Card preview side */}
          <div className="flex items-center justify-center">
            <div
              className="relative"
              style={{
                width: 240,
                aspectRatio: "9 / 14",
                background: "#F4EFE6",
                borderRadius: 12,
                boxShadow: "0 24px 60px -10px rgba(0,0,0,0.55), 0 8px 20px -6px rgba(0,0,0,0.35), 0 0 0 1px rgba(255,255,255,0.04)",
                overflow: "hidden",
                transform: showCard ? "rotate(-3deg)" : "rotate(-6deg) scale(0.94)",
                opacity: showCard ? 1 : 0.7,
                transition: "all 0.6s cubic-bezier(0.2, 0.8, 0.2, 1)",
              }}
            >
              <div aria-hidden className="absolute inset-0 pointer-events-none" style={{ backgroundImage: PAPER_NOISE_URL, backgroundSize: "180px 180px", opacity: 0.6 }} />
              <div style={{ height: 8, background: "#D72638" }} />
              <div className="relative p-4 flex flex-col h-[calc(100%-8px)]">
                <p style={{ fontFamily: "var(--font-jetbrains-mono), monospace", fontSize: 8, letterSpacing: "0.18em", textTransform: "uppercase", color: "rgba(17,17,17,0.5)", fontWeight: 700 }}>
                  hyperfix · log
                </p>
                <p
                  className="mt-3"
                  style={{
                    fontFamily: "Georgia, serif",
                    fontSize: 15,
                    lineHeight: 1.15,
                    color: "#111",
                    fontWeight: 700,
                    letterSpacing: "-0.01em",
                    display: "-webkit-box",
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: "vertical",
                    overflow: "hidden",
                    minHeight: 36,
                  }}
                >
                  {displayTitle}
                </p>
                <div className="mt-auto">
                  <div className="flex items-end gap-2">
                    <span
                      style={{
                        fontFamily: "Georgia, serif",
                        fontSize: 78,
                        lineHeight: 0.85,
                        color: "#D72638",
                        fontWeight: 700,
                        letterSpacing: "-0.04em",
                      }}
                    >
                      {day}
                    </span>
                    <div className="pb-1">
                      <span style={{ fontFamily: "var(--font-jetbrains-mono), monospace", fontSize: 8, letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(17,17,17,0.5)", fontWeight: 700 }}>
                        days<br />deep
                      </span>
                    </div>
                  </div>
                  <p style={{ fontFamily: "var(--font-jetbrains-mono), monospace", fontSize: 8, letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(17,17,17,0.45)", fontWeight: 700, marginTop: 12 }}>
                    intensity · {intensity}/10
                  </p>
                  <div className="flex gap-0.5 mt-1.5">
                    {Array.from({ length: 10 }).map((_, i) => (
                      <div
                        key={i}
                        style={{
                          flex: 1,
                          height: 4,
                          borderRadius: 1,
                          background: i < intensity ? "#0D9488" : "rgba(17,17,17,0.10)",
                        }}
                      />
                    ))}
                  </div>
                  <div className="mt-3 pt-2 flex items-center justify-between" style={{ borderTop: "1px dashed rgba(17,17,17,0.18)" }}>
                    <span style={{ fontFamily: "var(--font-jetbrains-mono), monospace", fontSize: 7, color: "rgba(17,17,17,0.4)", letterSpacing: "0.15em", textTransform: "uppercase" }}>
                      hyperfix.app
                    </span>
                    <span style={{ fontFamily: "Georgia, serif", fontStyle: "italic", fontSize: 9, color: "rgba(17,17,17,0.45)" }}>
                      still counting.
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Floating notification chip */}
      <div
        className="absolute -bottom-3 -right-3 sm:-bottom-4 sm:-right-4 hidden sm:flex items-center gap-2 rounded-full px-3 py-2"
        style={{
          background: "#161618",
          border: "1px solid rgba(94,234,212,0.3)",
          boxShadow: "0 8px 24px rgba(0,0,0,0.5), 0 0 0 1px rgba(94,234,212,0.05)",
        }}
      >
        <span className="relative flex h-2 w-2">
          <span className="anim-glowPulse absolute inline-flex h-full w-full rounded-full opacity-60" style={{ background: TEAL }} />
          <span className="relative inline-flex h-2 w-2 rounded-full" style={{ background: TEAL }} />
        </span>
        <span className="font-mono text-[10px] uppercase tracking-widest" style={{ color: "rgba(255,255,255,0.7)" }}>
          someone is logging
        </span>
      </div>
    </div>
  );
}
