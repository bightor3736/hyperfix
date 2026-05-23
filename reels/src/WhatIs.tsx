import React from "react";
import {
  AbsoluteFill,
  Easing,
  Sequence,
  interpolate,
  useCurrentFrame,
} from "remotion";

const fontFamily = "'Helvetica Neue', Liberation Sans, Arial, sans-serif";

// ─── tokens ──────────────────────────────────────────────────────────
const BG = "#080808";
const INK = "#F4F4F4";
const DIM = "rgba(244,244,244,0.45)";
const TEAL = "#5EEAD4";
const TEAL_DIM = "rgba(94,234,212,0.15)";
const CARD = "#101012";
const CARD_BORDER = "rgba(244,244,244,0.07)";

const FPS = 30;
const EASE = Easing.bezier(0.16, 1, 0.3, 1);
const SPRING = Easing.bezier(0.2, 1.4, 0.4, 1);

// ─── helpers ─────────────────────────────────────────────────────────
const fadeUp = (frame: number, start: number, dur = 18) => {
  const t = interpolate(frame, [start, start + dur], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: EASE,
  });
  return { opacity: t, transform: `translateY(${(1 - t) * 28}px)` };
};

const fadeOut = (frame: number, start: number, dur = 12) => {
  const t = interpolate(frame, [start, start + dur], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: EASE,
  });
  return { opacity: t, transform: `translateY(${(1 - t) * -16}px)` };
};

const popIn = (frame: number, start: number, dur = 14) => {
  const t = interpolate(frame, [start, start + dur], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: SPRING,
  });
  return {
    opacity: interpolate(frame, [start, start + dur * 0.5], [0, 1], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }),
    transform: `scale(${0.88 + 0.12 * t})`,
  };
};

// ─── gem mark ────────────────────────────────────────────────────────
const GemMark: React.FC<{ size: number }> = ({ size }) => (
  <svg width={size} height={size} viewBox="0 0 64 64" fill="none">
    <rect width="64" height="64" rx="15" fill="#0A0B0D" />
    <path d="M58,32 L50,14 L32,32 Z" fill="#3CCFBA" />
    <path d="M32,58 L14,50 L32,32 Z" fill="#3CCFBA" />
    <path d="M6,32 L14,14 L32,32 Z" fill="#3CCFBA" />
    <path d="M32,6 L50,14 L32,32 Z" fill="#5EEAD4" />
    <path d="M58,32 L50,50 L32,32 Z" fill="#0D9488" />
    <path d="M50,50 L32,58 L32,32 Z" fill="#0A7A70" />
    <path d="M14,50 L6,32 L32,32 Z" fill="#0D9488" />
    <path d="M14,14 L32,6 L32,32 Z" fill="#0A7A70" />
    <path
      d="M43,32 L39,39 L32,43 L25,39 L21,32 L25,25 L32,21 L39,25 Z"
      fill="rgba(255,255,255,0.18)"
    />
  </svg>
);

// ─── scene 1 — hook (0–6s / 0–180f) ────────────────────────────────
const Scene1: React.FC = () => {
  const frame = useCurrentFrame();
  const logoStyle = fadeUp(frame, 6, 18);
  const line1Style = fadeUp(frame, 28, 20);
  const line2Style = fadeUp(frame, 48, 20);
  const line3Style = fadeUp(frame, 70, 20);

  return (
    <AbsoluteFill
      style={{
        background: BG,
        fontFamily,
        display: "flex",
        flexDirection: "column",
        padding: "90px 80px",
      }}
    >
      {/* logo lockup */}
      <div style={{ display: "flex", alignItems: "center", gap: 16, ...logoStyle }}>
        <GemMark size={48} />
        <span
          style={{
            fontSize: 34,
            fontWeight: 800,
            letterSpacing: -1.2,
            color: INK,
          }}
        >
          hyper
          <span style={{ color: TEAL, fontStyle: "italic" }}>fix</span>
        </span>
      </div>

      {/* headline */}
      <div
        style={{
          marginTop: "auto",
          marginBottom: 160,
          display: "flex",
          flexDirection: "column",
          gap: 0,
        }}
      >
        <span
          style={{
            fontSize: 112,
            fontWeight: 900,
            lineHeight: 0.9,
            letterSpacing: -5,
            color: INK,
            ...line1Style,
          }}
        >
          your
        </span>
        <span
          style={{
            fontSize: 112,
            fontWeight: 900,
            lineHeight: 0.9,
            letterSpacing: -5,
            color: INK,
            ...line2Style,
          }}
        >
          brain
        </span>
        <span
          style={{
            fontSize: 112,
            fontWeight: 900,
            lineHeight: 0.9,
            letterSpacing: -5,
            color: TEAL,
            ...line3Style,
          }}
        >
          won&apos;t
          <br />
          let go.
        </span>
      </div>
    </AbsoluteFill>
  );
};

// ─── scene 2 — normal people vs you (6–12s / 0–180f rel) ───────────
const Scene2: React.FC = () => {
  const frame = useCurrentFrame();

  const labelStyle = fadeUp(frame, 10, 18);
  const card1Style = fadeUp(frame, 24, 20);
  const card2Style = fadeUp(frame, 54, 20);

  return (
    <AbsoluteFill
      style={{
        background: BG,
        fontFamily,
        display: "flex",
        flexDirection: "column",
        padding: "180px 80px",
        gap: 0,
      }}
    >
      <span
        style={{
          fontSize: 22,
          fontWeight: 800,
          letterSpacing: 5,
          textTransform: "uppercase",
          color: TEAL,
          marginBottom: 56,
          ...labelStyle,
        }}
      >
        the difference
      </span>

      {/* normal people card */}
      <div
        style={{
          background: CARD,
          border: `1px solid ${CARD_BORDER}`,
          borderRadius: 28,
          padding: "44px 48px",
          marginBottom: 28,
          ...card1Style,
        }}
      >
        <span
          style={{
            display: "block",
            fontSize: 18,
            fontWeight: 800,
            letterSpacing: 4,
            textTransform: "uppercase",
            color: DIM,
            marginBottom: 18,
          }}
        >
          normal people
        </span>
        <span
          style={{
            fontSize: 44,
            fontWeight: 700,
            lineHeight: 1.15,
            letterSpacing: -1.5,
            color: INK,
          }}
        >
          discover something new, enjoy it, move on
        </span>
      </div>

      {/* you card */}
      <div
        style={{
          background: CARD,
          border: `1.5px solid ${TEAL}`,
          borderRadius: 28,
          padding: "44px 48px",
          ...card2Style,
        }}
      >
        <span
          style={{
            display: "block",
            fontSize: 18,
            fontWeight: 800,
            letterSpacing: 4,
            textTransform: "uppercase",
            color: TEAL,
            marginBottom: 18,
          }}
        >
          you
        </span>
        <span
          style={{
            fontSize: 44,
            fontWeight: 700,
            lineHeight: 1.15,
            letterSpacing: -1.5,
            color: INK,
          }}
        >
          restructure your entire life around it for 3 weeks then ghost it completely
        </span>
      </div>
    </AbsoluteFill>
  );
};

// ─── scene 3 — the lock-on bullets (12–19s / 0–210f rel) ────────────
const BULLETS = [
  "intrusive thoughts at 2am",
  "you explain it to 4 people who didn't ask",
  "so many tabs. SO many tabs.",
];

const Scene3: React.FC = () => {
  const frame = useCurrentFrame();
  const headStyle = fadeUp(frame, 8, 20);

  return (
    <AbsoluteFill
      style={{
        background: BG,
        fontFamily,
        display: "flex",
        flexDirection: "column",
        padding: "180px 80px",
      }}
    >
      <div style={{ display: "flex", flexDirection: "column", gap: 0, ...headStyle }}>
        <span
          style={{
            fontSize: 108,
            fontWeight: 900,
            lineHeight: 0.88,
            letterSpacing: -4,
            color: INK,
          }}
        >
          your
        </span>
        <span
          style={{
            fontSize: 108,
            fontWeight: 900,
            lineHeight: 0.88,
            letterSpacing: -4,
            color: INK,
          }}
        >
          brain
        </span>
        <span
          style={{
            fontSize: 108,
            fontWeight: 900,
            lineHeight: 0.88,
            letterSpacing: -4,
            color: TEAL,
          }}
        >
          locks on.
        </span>
      </div>

      <div
        style={{
          marginTop: 64,
          display: "flex",
          flexDirection: "column",
          gap: 0,
          borderLeft: `2px solid rgba(94,234,212,0.25)`,
          paddingLeft: 32,
        }}
      >
        {BULLETS.map((text, i) => {
          const start = 48 + i * 40;
          const style = fadeUp(frame, start, 20);
          return (
            <span
              key={i}
              style={{
                fontSize: 34,
                fontWeight: 600,
                lineHeight: 1.35,
                color: DIM,
                paddingTop: i === 0 ? 0 : 28,
                ...style,
              }}
            >
              {text}
            </span>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

// ─── scene 4 — not a flaw (19–24s / 0–150f rel) ─────────────────────
const Scene4: React.FC = () => {
  const frame = useCurrentFrame();

  const tagStyle = fadeUp(frame, 8, 18);
  const line1Style = fadeUp(frame, 24, 18);
  const line2Style = fadeUp(frame, 42, 18);
  const line3Style = fadeUp(frame, 62, 18);
  const subStyle = fadeUp(frame, 90, 20);

  const barWidth = interpolate(frame, [90, 140], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: EASE,
  });

  return (
    <AbsoluteFill
      style={{
        background: BG,
        fontFamily,
        display: "flex",
        flexDirection: "column",
        padding: "180px 80px",
      }}
    >
      <span
        style={{
          fontSize: 18,
          fontWeight: 800,
          letterSpacing: 5,
          textTransform: "uppercase",
          color: DIM,
          marginBottom: 48,
          ...tagStyle,
        }}
      >
        common with ADHD + autism
      </span>

      <span
        style={{
          fontSize: 120,
          fontWeight: 900,
          lineHeight: 0.88,
          letterSpacing: -5,
          color: INK,
          ...line1Style,
        }}
      >
        not
      </span>
      <span
        style={{
          fontSize: 120,
          fontWeight: 900,
          lineHeight: 0.88,
          letterSpacing: -5,
          color: INK,
          ...line2Style,
        }}
      >
        a flaw.
      </span>
      <span
        style={{
          fontSize: 120,
          fontWeight: 900,
          lineHeight: 0.88,
          letterSpacing: -5,
          color: TEAL,
          ...line3Style,
        }}
      >
        a feature.
      </span>

      {/* animated teal underline */}
      <div
        style={{
          marginTop: 32,
          height: 4,
          background: "rgba(94,234,212,0.15)",
          borderRadius: 2,
          width: "100%",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            height: "100%",
            width: `${barWidth * 100}%`,
            background: TEAL,
            borderRadius: 2,
          }}
        />
      </div>

      <span
        style={{
          fontSize: 30,
          lineHeight: 1.45,
          color: DIM,
          marginTop: 48,
          maxWidth: 820,
          ...subStyle,
        }}
      >
        your brain found signal in the noise and it&apos;s holding on for dear life.
      </span>
    </AbsoluteFill>
  );
};

// ─── scene 5 — fix card + CTA (24–37s / 0–390f rel) ─────────────────
const Scene5: React.FC = () => {
  const frame = useCurrentFrame();

  const logoStyle = fadeUp(frame, 8, 18);
  const tagStyle = fadeUp(frame, 28, 18);
  const headStyle = fadeUp(frame, 48, 20);
  const cardStyle = fadeUp(frame, 80, 22);
  const ctaStyle = popIn(frame, 220, 18);
  const urlStyle = fadeUp(frame, 250, 18);

  // intensity bar fills from frame 120 → 200
  const barFill = interpolate(frame, [120, 200], [0, 0.84], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: EASE,
  });

  // day counter
  const dayVal = Math.round(
    interpolate(frame, [90, 180], [0, 47], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: EASE,
    })
  );

  // background glow that grows with bar
  const glowOpacity = interpolate(frame, [120, 200], [0, 0.12], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: EASE,
  });

  return (
    <AbsoluteFill
      style={{ background: BG, fontFamily, display: "flex", flexDirection: "column", padding: "90px 80px" }}
    >
      {/* bg glow */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: `radial-gradient(ellipse 70% 50% at 50% 100%, rgba(94,234,212,0.22) 0%, transparent 70%)`,
          opacity: glowOpacity,
          pointerEvents: "none",
        }}
      />

      {/* logo */}
      <div style={{ display: "flex", alignItems: "center", gap: 16, ...logoStyle }}>
        <GemMark size={48} />
        <span style={{ fontSize: 34, fontWeight: 800, letterSpacing: -1.2, color: INK }}>
          hyper<span style={{ color: TEAL, fontStyle: "italic" }}>fix</span>
        </span>
      </div>

      {/* headline */}
      <div style={{ marginTop: 72, ...tagStyle }}>
        <span
          style={{
            fontSize: 18,
            fontWeight: 800,
            letterSpacing: 5,
            textTransform: "uppercase",
            color: TEAL,
          }}
        >
          track every one
        </span>
      </div>
      <div style={{ marginTop: 16, display: "flex", flexDirection: "column", ...headStyle }}>
        <span
          style={{ fontSize: 88, fontWeight: 900, lineHeight: 0.9, letterSpacing: -4, color: INK }}
        >
          log it
        </span>
        <span
          style={{ fontSize: 88, fontWeight: 900, lineHeight: 0.9, letterSpacing: -4, color: INK }}
        >
          while it
        </span>
        <span
          style={{ fontSize: 88, fontWeight: 900, lineHeight: 0.9, letterSpacing: -4, color: TEAL }}
        >
          lasts.
        </span>
      </div>

      {/* fix card */}
      <div
        style={{
          marginTop: 52,
          background: CARD,
          border: `1px solid ${CARD_BORDER}`,
          borderRadius: 28,
          padding: "40px 44px",
          ...cardStyle,
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <span style={{ fontSize: 38, fontWeight: 800, letterSpacing: -1.5, color: INK, lineHeight: 1 }}>
              Severance
            </span>
            <span
              style={{
                fontSize: 18,
                fontWeight: 700,
                letterSpacing: 4,
                textTransform: "uppercase",
                color: DIM,
                marginTop: 8,
              }}
            >
              tv show
            </span>
          </div>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end" }}>
            <span
              style={{
                fontSize: 72,
                fontWeight: 900,
                letterSpacing: -3,
                lineHeight: 1,
                color: TEAL,
              }}
            >
              {dayVal}
            </span>
            <span
              style={{
                fontSize: 15,
                fontWeight: 800,
                letterSpacing: 4,
                textTransform: "uppercase",
                color: DIM,
              }}
            >
              days
            </span>
          </div>
        </div>

        {/* intensity bar */}
        <div style={{ marginTop: 32 }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
            <span
              style={{
                fontSize: 15,
                fontWeight: 800,
                letterSpacing: 4,
                textTransform: "uppercase",
                color: DIM,
              }}
            >
              intensity
            </span>
            <span style={{ fontSize: 15, fontWeight: 800, letterSpacing: 2, color: TEAL }}>
              {Math.round(barFill * 100)}%
            </span>
          </div>
          <div
            style={{
              height: 10,
              background: "rgba(244,244,244,0.06)",
              borderRadius: 999,
              overflow: "hidden",
            }}
          >
            <div
              style={{
                height: "100%",
                width: `${barFill * 100}%`,
                background: TEAL,
                borderRadius: 999,
                boxShadow: `0 0 20px -2px ${TEAL}88`,
              }}
            />
          </div>
        </div>

        {/* badge */}
        <div style={{ display: "flex", marginTop: 24, gap: 12 }}>
          <div
            style={{
              background: TEAL_DIM,
              border: `1px solid rgba(94,234,212,0.25)`,
              borderRadius: 999,
              padding: "8px 20px",
            }}
          >
            <span style={{ fontSize: 15, fontWeight: 800, color: TEAL, letterSpacing: 2 }}>
              active
            </span>
          </div>
        </div>
      </div>

      {/* CTA button */}
      <div style={{ marginTop: 44, display: "flex", ...ctaStyle }}>
        <div
          style={{
            background: TEAL,
            borderRadius: 999,
            padding: "22px 48px",
          }}
        >
          <span
            style={{
              fontSize: 26,
              fontWeight: 900,
              color: BG,
              letterSpacing: -0.5,
            }}
          >
            free to use
          </span>
        </div>
      </div>

      {/* URL */}
      <span
        style={{
          marginTop: 24,
          fontSize: 22,
          fontWeight: 800,
          letterSpacing: 4,
          textTransform: "uppercase",
          color: DIM,
          ...urlStyle,
        }}
      >
        hyperfix.app · link in bio
      </span>
    </AbsoluteFill>
  );
};

// ─── root composition ────────────────────────────────────────────────

// Scene timing (all in frames at 30fps):
// Scene 1 (hook):        0   → 180  (6s)
// Scene 2 (contrast):    180 → 360  (6s)
// Scene 3 (lock-on):     360 → 570  (7s)
// Scene 4 (not a flaw):  570 → 720  (5s)
// Scene 5 (CTA card):    720 → 1110 (13s)
// total: 1110 frames = 37s

export const WhatIs: React.FC = () => {
  return (
    <AbsoluteFill style={{ background: BG }}>
      <Sequence from={0} durationInFrames={180}>
        <Scene1 />
      </Sequence>
      <Sequence from={180} durationInFrames={180}>
        <Scene2 />
      </Sequence>
      <Sequence from={360} durationInFrames={210}>
        <Scene3 />
      </Sequence>
      <Sequence from={570} durationInFrames={150}>
        <Scene4 />
      </Sequence>
      <Sequence from={720} durationInFrames={390}>
        <Scene5 />
      </Sequence>
    </AbsoluteFill>
  );
};
