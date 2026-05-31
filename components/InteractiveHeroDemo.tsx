"use client";

import { useState, useEffect } from "react";

const TEAL = "var(--accent)";
const CARD_BG = "var(--bg)";
const CARD_BORDER = "var(--line)";

const PLACEHOLDERS = [
  "severance — the door scene",
  "hozier discography",
  "the bear · season 3",
  "baldur's gate 3 (astarion route)",
  "chappell roan · the rise and fall",
  "jjk shibuya arc",
  "taylor swift · folklore",
];

const CARD_NOISE_URL =
  "url(\"data:image/svg+xml;utf8,<svg viewBox='0 0 240 240' xmlns='http://www.w3.org/2000/svg'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 0.55 0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>\")";

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
          background: "radial-gradient(ellipse 80% 60% at 50% 60%, var(--accent) 0%, transparent 70%)",
          filter: "blur(30px)",
        }}
      />

      {/* Demo container */}
      <div
        className="relative overflow-hidden rounded-3xl"
        style={{
          background: CARD_BG,
          border: `1px solid ${CARD_BORDER}`,
          boxShadow: "0 24px 80px rgba(0,0,0,0.6), 0 0 0 1px var(--accent-soft), inset 0 1px 0 var(--line)",
        }}
      >
        {/* Window chrome */}
        <div className="flex items-center justify-between px-4 py-3" style={{ borderBottom: `1px solid ${CARD_BORDER}`, background: "transparent" }}>
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full" style={{ background: "var(--line)" }} />
            <div className="w-2.5 h-2.5 rounded-full" style={{ background: "var(--line)" }} />
            <div className="w-2.5 h-2.5 rounded-full" style={{ background: "var(--line)" }} />
          </div>
          <p className="font-mono text-[10px] tracking-widest uppercase" style={{ color: "var(--ink-faint)" }}>
            try it · no signup
          </p>
          <div className="w-9" />
        </div>

        {/* Body */}
        <div className="p-5 sm:p-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Form side */}
          <div className="flex flex-col gap-5">
            <div>
              <p className="font-mono text-[10px] uppercase tracking-widest mb-2" style={{ color: "var(--accent)" }}>
                step 1 — name it
              </p>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder={PLACEHOLDERS[placeholderIdx]}
                className="w-full rounded-2xl px-4 py-3 font-sans text-base outline-none transition-all focus:ring-2 focus:ring-[var(--accent)]/40 placeholder:text-[var(--ink-faint)]"
                style={{
                  background: "transparent",
                  border: "1px solid var(--line)",
                  color: "var(--ink)",
                }}
                onFocus={() => setShowCard(true)}
              />
            </div>

            <div>
              <div className="flex items-baseline justify-between mb-2">
                <p className="font-mono text-[10px] uppercase tracking-widest" style={{ color: "var(--accent)" }}>
                  step 2 — how bad is it
                </p>
                <span
                  className="font-display tabular-nums"
                  style={{ fontSize: 22, color: intensityColor, fontWeight: 700, letterSpacing: "-0.02em" }}
                >
                  {intensity}<span className="font-mono text-xs" style={{ color: "var(--ink-muted)" }}>/10</span>
                </span>
              </div>
              <div className="relative py-2">
                <div className="h-2 rounded-full overflow-hidden" style={{ background: "var(--line)" }}>
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

            <p className="font-mono text-[10px] uppercase tracking-widest" style={{ color: "var(--ink-faint)" }}>
              this is the demo. your real fix saves & counts daily.
            </p>
          </div>

          {/* Card preview side — dark Hyperfix style matching the app */}
          <div className="flex items-center justify-center">
            <div
              className="relative overflow-hidden"
              style={{
                width: 250,
                aspectRatio: "9 / 14",
                background:
                  "radial-gradient(ellipse 110% 80% at 50% 120%, var(--accent) 0%, var(--accent) 12%, #0E4F47 32%, #08231F 56%, var(--bg) 82%)",
                borderRadius: 18,
                border: "1px solid var(--accent-soft)",
                boxShadow:
                  "0 24px 60px -10px rgba(0,0,0,0.7), 0 8px 20px -6px var(--accent-soft), 0 0 0 1px transparent",
                transform: showCard ? "rotate(-2deg)" : "rotate(-5deg) scale(0.94)",
                opacity: showCard ? 1 : 0.75,
                transition: "all 0.6s cubic-bezier(0.2, 0.8, 0.2, 1)",
              }}
            >
              {/* Grain overlay */}
              <div
                aria-hidden
                className="absolute inset-0 pointer-events-none mix-blend-overlay"
                style={{ backgroundImage: CARD_NOISE_URL, backgroundSize: "180px 180px", opacity: 0.4 }}
              />
              {/* Top dim overlay */}
              <div
                aria-hidden
                className="absolute top-0 left-0 right-0 pointer-events-none"
                style={{
                  height: "55%",
                  background: "linear-gradient(180deg, rgba(7,7,8,0.7) 0%, rgba(7,7,8,0.2) 60%, transparent 100%)",
                }}
              />

              <div className="relative h-full p-5 flex flex-col">
                {/* Top row — brand + category */}
                <div className="flex items-center justify-between">
                  <span
                    className="inline-flex items-center font-mono"
                    style={{
                      fontSize: 8,
                      letterSpacing: "0.22em",
                      textTransform: "uppercase",
                      color: "var(--ink-muted)",
                      fontWeight: 600,
                    }}
                  >
                    hyperfix
                  </span>
                  <span
                    className="inline-flex items-center font-mono rounded-full px-1.5 py-0.5"
                    style={{
                      fontSize: 7,
                      letterSpacing: "0.18em",
                      textTransform: "uppercase",
                      color: TEAL,
                      background: "var(--accent-soft)",
                      border: "1px solid var(--accent)",
                      fontWeight: 600,
                    }}
                  >
                    log
                  </span>
                </div>

                {/* Title */}
                <p
                  className="mt-4"
                  style={{
                    fontFamily: "var(--font-fraunces), Georgia, serif",
                    fontSize: 17,
                    lineHeight: 1.15,
                    color: "var(--ink)",
                    fontWeight: 600,
                    letterSpacing: "-0.02em",
                    display: "-webkit-box",
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: "vertical",
                    overflow: "hidden",
                    minHeight: 40,
                  }}
                >
                  {displayTitle}
                </p>

                {/* Big day count */}
                <div className="mt-auto">
                  <div className="flex items-end gap-2">
                    <span
                      className="tabular-nums"
                      style={{
                        fontFamily: "var(--font-fraunces), Georgia, serif",
                        fontSize: 84,
                        lineHeight: 0.82,
                        color: TEAL,
                        fontWeight: 600,
                        letterSpacing: "-0.05em",
                        textShadow: "0 0 40px var(--accent)",
                      }}
                    >
                      {day}
                    </span>
                    <div className="pb-1.5">
                      <span
                        style={{
                          fontFamily: "var(--font-jetbrains-mono), monospace",
                          fontSize: 8,
                          letterSpacing: "0.22em",
                          textTransform: "uppercase",
                          color: "var(--accent)",
                          fontWeight: 600,
                        }}
                      >
                        days<br />deep
                      </span>
                    </div>
                  </div>

                  {/* Intensity */}
                  <div className="mt-4 flex items-center justify-between">
                    <span
                      style={{
                        fontFamily: "var(--font-jetbrains-mono), monospace",
                        fontSize: 8,
                        letterSpacing: "0.22em",
                        textTransform: "uppercase",
                        color: "var(--ink-muted)",
                        fontWeight: 600,
                      }}
                    >
                      intensity
                    </span>
                    <span
                      className="tabular-nums"
                      style={{
                        fontFamily: "var(--font-jetbrains-mono), monospace",
                        fontSize: 11,
                        color: intensityColor,
                        fontWeight: 700,
                      }}
                    >
                      {intensity}<span style={{ opacity: 0.55 }}>/10</span>
                    </span>
                  </div>
                  <div className="mt-1.5 h-1 rounded-full overflow-hidden" style={{ background: "var(--line)" }}>
                    <div
                      className="h-full rounded-full transition-all duration-300"
                      style={{
                        width: `${intensity * 10}%`,
                        background: `linear-gradient(to right, var(--accent), ${intensityColor})`,
                        boxShadow: `0 0 8px ${intensityColor}80`,
                      }}
                    />
                  </div>

                  {/* Footer */}
                  <div
                    className="mt-4 pt-2.5 flex items-center justify-between"
                    style={{ borderTop: "1px solid var(--line)" }}
                  >
                    <span
                      style={{
                        fontFamily: "var(--font-jetbrains-mono), monospace",
                        fontSize: 7,
                        color: "var(--ink-faint)",
                        letterSpacing: "0.18em",
                        textTransform: "uppercase",
                      }}
                    >
                      hyperfix.app
                    </span>
                    <span
                      style={{
                        fontFamily: "var(--font-fraunces), Georgia, serif",
                        fontStyle: "italic",
                        fontSize: 10,
                        color: "var(--accent)",
                      }}
                    >
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
