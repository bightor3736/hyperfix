import React from "react";
import {
  AbsoluteFill,
  Easing,
  interpolate,
  useCurrentFrame,
} from "remotion";

const fontFamily = "'Helvetica Neue', Liberation Sans, Arial, sans-serif";

const LIME = "#A3E635";
const LIME_DEEP = "#7CB205";
const INK = "#0A0A0A";
const PAPER = "#F4F4F4";
const DIM = "#9CA3AF";

const FPS = 30;
const EASE = Easing.bezier(0.16, 1, 0.3, 1);
const EASE_BOUNCE = Easing.bezier(0.2, 1.4, 0.4, 1);

// ─────────────────────────────────────────────────────────────
// Helpers

const fadeIn = (frame: number, start: number, dur: number) => {
  const t = interpolate(frame, [start, start + dur], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: EASE,
  });
  return { opacity: t, transform: `translateY(${(1 - t) * 20}px)` };
};

const fadeInOut = (frame: number, inAt: number, outAt: number, dur = 12) => {
  const inT = interpolate(frame, [inAt, inAt + dur], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: EASE,
  });
  const outT = interpolate(frame, [outAt, outAt + dur], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: EASE,
  });
  const opacity = Math.min(inT, outT);
  const ty = (1 - inT) * 20 - (1 - outT) * 20;
  return { opacity, transform: `translateY(${ty}px)` };
};

const popScale = (frame: number, start: number, dur: number) => {
  const t = interpolate(frame, [start, start + dur], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: EASE_BOUNCE,
  });
  const opacity = interpolate(frame, [start, start + dur * 0.5], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return { opacity, transform: `scale(${0.85 + 0.15 * t})` };
};

// ─────────────────────────────────────────────────────────────
// Mark

const FocusArrow: React.FC<{ size: number; bg?: string; fg?: string; accent?: string }> = ({
  size,
  bg = INK,
  fg = LIME,
  accent = LIME_DEEP,
}) => (
  <svg width={size} height={size} viewBox="0 0 64 64">
    <rect width={64} height={64} rx={14} fill={bg} />
    <path d="M14 40 L32 20 L50 40 L42 40 L32 28 L22 40 Z" fill={fg} />
    <path d="M14 50 L32 30 L50 50 L42 50 L32 38 L22 50 Z" fill={accent} />
  </svg>
);

// ─────────────────────────────────────────────────────────────
// Scenes

// SCENE 0: pulsing dot on black (0–1.5s)
const SceneOpening: React.FC = () => {
  const frame = useCurrentFrame();
  // dot lives 0..45, fades out by 50
  const baseOp = interpolate(frame, [0, 6, 38, 50], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const pulse = 0.85 + 0.15 * Math.sin(frame * 0.4);
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        opacity: baseOp,
      }}
    >
      <div
        style={{
          width: 40,
          height: 40,
          borderRadius: 999,
          background: LIME,
          transform: `scale(${pulse})`,
          boxShadow: `0 0 80px 10px ${LIME}aa`,
        }}
      />
    </div>
  );
};

// SCENE 1: "we're starting something." (1.5–3.5s)
const SceneStarting: React.FC = () => {
  const frame = useCurrentFrame();
  const style = fadeInOut(frame, 50, 95, 14);
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "0 80px",
        textAlign: "center",
        ...style,
      }}
    >
      <div
        style={{
          fontSize: 76,
          fontWeight: 700,
          letterSpacing: -2,
          lineHeight: 1.1,
          color: PAPER,
        }}
      >
        we're starting<br />
        <span style={{ color: LIME }}>something.</span>
      </div>
    </div>
  );
};

// SCENE 2: setup line "for everyone who's ever been—" (3.5–5s)
const SceneSetup: React.FC = () => {
  const frame = useCurrentFrame();
  const style = fadeInOut(frame, 110, 145, 12);
  return (
    <div
      style={{
        position: "absolute",
        top: 720,
        left: 80,
        right: 80,
        textAlign: "center",
        fontSize: 54,
        fontWeight: 700,
        letterSpacing: -1.6,
        color: DIM,
        lineHeight: 1.2,
        ...style,
      }}
    >
      for everyone who's ever been—
    </div>
  );
};

// SCENE 3: rapid-fire examples (5–10s)
// Each example: in for ~30 frames, out for ~10
type Example = { lead: string; punch: string; color?: string };
const EXAMPLES: Example[] = [
  { lead: "unwell about",      punch: "the marauders fic that ruined my life" },
  { lead: "still looping",     punch: "sabrina carpenter's tears, day 41" },
  { lead: "memorising",        punch: "the wikipedia page of a roman emperor" },
  { lead: "rewatching",        punch: "pride & prejudice (2005) for the 37th time" },
];

const SceneExamples: React.FC = () => {
  const frame = useCurrentFrame();
  // first example starts at 160, each lasts 38 frames, gap 4
  const base = 160;
  const each = 38;
  return (
    <>
      {EXAMPLES.map((ex, i) => {
        const start = base + i * (each + 2);
        const inOut = fadeInOut(frame, start, start + each - 14, 8);
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              top: 720,
              left: 80,
              right: 80,
              textAlign: "center",
              ...inOut,
            }}
          >
            <div
              style={{
                fontSize: 36,
                fontWeight: 800,
                letterSpacing: 4,
                textTransform: "uppercase",
                color: DIM,
                marginBottom: 16,
              }}
            >
              {ex.lead}
            </div>
            <div
              style={{
                fontSize: 84,
                fontWeight: 900,
                letterSpacing: -3.6,
                lineHeight: 1.02,
                color: PAPER,
              }}
            >
              {ex.punch}
            </div>
          </div>
        );
      })}
    </>
  );
};

// SCENE 4: brand reveal with glow burst (10–12s)
const SceneBrand: React.FC = () => {
  const frame = useCurrentFrame();
  const start = 305;
  const pop = popScale(frame, start, 22);
  // glow ring expanding then settling
  const glowR = interpolate(frame, [start, start + 14], [40, 480], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: EASE,
  });
  const glowOp = interpolate(frame, [start, start + 8, start + 30], [0, 0.6, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        opacity: frame < start ? 0 : 1,
      }}
    >
      {/* expanding glow ring */}
      <div
        style={{
          position: "absolute",
          width: glowR,
          height: glowR,
          borderRadius: 999,
          border: `4px solid ${LIME}`,
          opacity: glowOp,
        }}
      />
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 36,
          ...pop,
        }}
      >
        <FocusArrow size={300} />
        <div
          style={{
            fontSize: 132,
            fontWeight: 900,
            letterSpacing: -6,
            lineHeight: 1,
            color: PAPER,
          }}
        >
          Hyperfix
        </div>
      </div>
    </div>
  );
};

// SCENE 5: tagline (12–13.5s)
const SceneTagline: React.FC = () => {
  const frame = useCurrentFrame();
  const style = fadeInOut(frame, 360, 400, 10);
  return (
    <div
      style={{
        position: "absolute",
        bottom: 280,
        left: 80,
        right: 80,
        textAlign: "center",
        fontSize: 40,
        fontWeight: 700,
        letterSpacing: -1,
        color: DIM,
        lineHeight: 1.25,
        ...style,
      }}
    >
      a journal for what's<br />
      running your life.
    </div>
  );
};

// SCENE 6: CTA (13.5–15s)
const SceneCTA: React.FC = () => {
  const frame = useCurrentFrame();
  const popStyle = popScale(frame, 405, 20);
  return (
    <div
      style={{
        position: "absolute",
        bottom: 140,
        left: 0,
        right: 0,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 22,
        ...popStyle,
      }}
    >
      <div
        style={{
          background: LIME,
          color: INK,
          padding: "30px 56px",
          borderRadius: 999,
          fontSize: 38,
          fontWeight: 900,
          letterSpacing: -1.2,
          boxShadow: `0 0 80px -10px ${LIME}aa`,
        }}
      >
        Join the waitlist →
      </div>
      <div
        style={{
          fontSize: 24,
          fontWeight: 800,
          letterSpacing: 5,
          color: DIM,
          textTransform: "uppercase",
        }}
      >
        hyperfix.app
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────
// Subtle ambient background — never goes fully black after brand reveal

const Ambient: React.FC = () => {
  const frame = useCurrentFrame();
  // background lightly tints lime starting from brand reveal
  const tint = interpolate(frame, [300, 320], [0, 0.12], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: EASE,
  });
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        background: `radial-gradient(circle at 50% 55%, ${LIME}55 0%, transparent 60%)`,
        opacity: tint,
        pointerEvents: "none",
      }}
    />
  );
};

// ─────────────────────────────────────────────────────────────
// Main

export const Launch: React.FC = () => {
  return (
    <AbsoluteFill style={{ background: INK, fontFamily }}>
      <Ambient />
      <SceneOpening />
      <SceneStarting />
      <SceneSetup />
      <SceneExamples />
      <SceneBrand />
      <SceneTagline />
      <SceneCTA />
    </AbsoluteFill>
  );
};
