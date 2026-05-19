import React from "react";
import {
  AbsoluteFill,
  Easing,
  Sequence,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
// System sans (Liberation Sans / Helvetica fallback). Avoids network-blocked Google Fonts.
const fontFamily = "'Helvetica Neue', Liberation Sans, Arial, sans-serif";

// ─────────────────────────────────────────────────────────────
// Tokens
const LIME = "#A3E635";
const LIME_BRIGHT = "#C8FF3D";
const LIME_DEEP = "#7CB205";
const INK = "#0A0A0A";
const CARD = "#0F0F12";
const CARD_HI = "#1A1A1E";
const PAPER = "#F4F4F4";
const DIM = "#9CA3AF";

const TARGET = 47;
const EASE_OUT = Easing.bezier(0.16, 1, 0.3, 1);

// ─────────────────────────────────────────────────────────────
// Mark
const FocusArrow: React.FC<{ size: number; bg?: string }> = ({ size, bg = INK }) => (
  <svg width={size} height={size} viewBox="0 0 64 64">
    <rect width={64} height={64} rx={14} fill={bg} />
    <path d="M14 40 L32 20 L50 40 L42 40 L32 28 L22 40 Z" fill={LIME} />
    <path d="M14 50 L32 30 L50 50 L42 50 L32 38 L22 50 Z" fill={LIME_DEEP} />
  </svg>
);

// ─────────────────────────────────────────────────────────────
// Helpers

const useFadeUp = (delayFrames: number, durFrames: number) => {
  const frame = useCurrentFrame();
  const local = frame - delayFrames;
  const t = interpolate(local, [0, durFrames], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: EASE_OUT,
  });
  return {
    opacity: t,
    transform: `translateY(${(1 - t) * 24}px)`,
  };
};

const usePopIn = (delayFrames: number, durFrames: number) => {
  const frame = useCurrentFrame();
  const local = frame - delayFrames;
  const t = interpolate(local, [0, durFrames], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.2, 1.4, 0.4, 1),
  });
  return {
    opacity: interpolate(local, [0, durFrames * 0.5], [0, 1], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }),
    transform: `scale(${0.85 + 0.15 * t})`,
  };
};

// ─────────────────────────────────────────────────────────────
// Components

const TopLockup: React.FC = () => {
  const style = useFadeUp(9, 18); // ~0.3s delay, 0.6s
  return (
    <div
      style={{
        position: "absolute",
        top: 90,
        left: 80,
        display: "flex",
        alignItems: "center",
        gap: 18,
        ...style,
      }}
    >
      <FocusArrow size={48} />
      <span style={{ fontSize: 36, fontWeight: 900, letterSpacing: -1.5, lineHeight: 1, color: PAPER }}>
        Hyperfix
      </span>
    </div>
  );
};

const TopMeta: React.FC = () => {
  const style = useFadeUp(9, 18);
  return (
    <div
      style={{
        position: "absolute",
        top: 102,
        right: 80,
        fontSize: 18,
        fontWeight: 800,
        letterSpacing: 4,
        textTransform: "uppercase",
        color: LIME,
        ...style,
      }}
    >
      live demo
    </div>
  );
};

const CardShell: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [30, 50], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: EASE_OUT,
  });
  const ty = interpolate(frame, [30, 50], [40, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: EASE_OUT,
  });
  return (
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
        opacity,
        transform: `translateY(${ty}px)`,
        overflow: "hidden",
      }}
    >
      {/* menu dots */}
      <div style={{ position: "absolute", top: 32, right: 64, display: "flex", gap: 10 }}>
        {[0, 1, 2].map((i) => (
          <span key={i} style={{ width: 8, height: 8, borderRadius: 999, background: "#3A3A40" }} />
        ))}
      </div>
      {children}
    </div>
  );
};

const Header: React.FC = () => {
  const style = useFadeUp(54, 18); // 1.8s
  return (
    <div style={style}>
      <div style={{ fontSize: 36, fontWeight: 700, color: PAPER }}>
        Marauders
        <sup style={{ marginLeft: 8, fontSize: 22, fontWeight: 700, color: DIM }}>47</sup>
      </div>
      <div style={{ marginTop: 8, fontSize: 22, fontWeight: 500, color: DIM }}>
        fanfic · ao3
      </div>
    </div>
  );
};

const DayLabel: React.FC = () => {
  const style = useFadeUp(69, 18); // ~2.3s
  return (
    <div
      style={{
        marginTop: 90,
        fontSize: 28,
        fontWeight: 800,
        letterSpacing: 6,
        textTransform: "uppercase",
        color: DIM,
        ...style,
      }}
    >
      Day
    </div>
  );
};

const Counter: React.FC = () => {
  const frame = useCurrentFrame();
  // start at frame 75 (2.5s), count to 47 over 108 frames (3.6s)
  const value = interpolate(frame, [75, 183], [0, TARGET], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: EASE_OUT,
  });
  const popStyle = usePopIn(75, 12);
  // settle once landed
  const landed = frame >= 183;
  return (
    <div
      style={{
        marginTop: 8,
        fontSize: 360,
        fontWeight: 900,
        letterSpacing: -22,
        lineHeight: 1,
        color: landed ? LIME : PAPER,
        fontVariantNumeric: "tabular-nums",
        transition: "none",
        textShadow: landed ? `0 0 80px ${LIME}55` : "none",
        ...popStyle,
      }}
    >
      {Math.round(value)}
    </div>
  );
};

const TitleLine: React.FC = () => {
  const style = useFadeUp(198, 21); // 6.6s
  return (
    <div
      style={{
        marginTop: 24,
        fontSize: 44,
        fontWeight: 700,
        lineHeight: 1.1,
        letterSpacing: -1.5,
        color: PAPER,
        ...style,
      }}
    >
      the marauders fic that ruined my life
    </div>
  );
};

const IntensityRow: React.FC = () => {
  const frame = useCurrentFrame();
  const fadeStyle = useFadeUp(225, 18); // 7.5s
  // bar fill: 8s start, 2.5s duration → frame 240..315
  const fill = interpolate(frame, [240, 315], [0, 0.92], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: EASE_OUT,
  });
  const showLabel = fill > 0.85;
  return (
    <div style={{ marginTop: 64, ...fadeStyle }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "baseline",
        }}
      >
        <span style={{ fontSize: 22, fontWeight: 800, letterSpacing: 4, textTransform: "uppercase", color: DIM }}>
          Intensity
        </span>
        <span
          style={{
            fontSize: 22,
            fontWeight: 800,
            letterSpacing: 2,
            textTransform: "uppercase",
            color: PAPER,
            opacity: showLabel ? 1 : 0,
          }}
        >
          Send help
        </span>
      </div>
      <div
        style={{
          position: "relative",
          marginTop: 22,
          height: 80,
          borderRadius: 999,
          background: "#222226",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            width: `${fill * 100}%`,
            background: LIME,
            borderRadius: 999,
            boxShadow: `0 0 40px -5px ${LIME}aa, inset 0 2px 0 ${LIME_BRIGHT}`,
          }}
        />
        {/* gloss highlight */}
        <div
          style={{
            position: "absolute",
            top: 4,
            left: 4,
            height: 36,
            width: fill > 0 ? `calc(${fill * 100}% - 8px)` : 0,
            background: `linear-gradient(180deg, ${LIME_BRIGHT} 0%, transparent 100%)`,
            opacity: 0.5,
            borderRadius: 999,
          }}
        />
      </div>
    </div>
  );
};

const ShareRow: React.FC = () => {
  const popStyle = usePopIn(330, 18); // 11s
  return (
    <div
      style={{
        position: "absolute",
        bottom: 64,
        left: 64,
        right: 64,
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        ...popStyle,
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
  );
};

const FooterCaption: React.FC = () => {
  const style = useFadeUp(366, 18); // 12.2s
  return (
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
        ...style,
      }}
    >
      hyperfix.app · the card is the product
    </div>
  );
};

// Subtle background glow that pulses with the counter
const BgGlow: React.FC = () => {
  const frame = useCurrentFrame();
  const intensity = interpolate(frame, [75, 183], [0, 0.18], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: EASE_OUT,
  });
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        background: `radial-gradient(circle at 50% 60%, ${LIME}33 0%, transparent 55%)`,
        opacity: intensity,
        pointerEvents: "none",
      }}
    />
  );
};

// ─────────────────────────────────────────────────────────────
// Main composition

export const Day47: React.FC = () => {
  return (
    <AbsoluteFill style={{ background: INK, fontFamily }}>
      <BgGlow />
      <TopLockup />
      <TopMeta />
      <CardShell>
        <Header />
        <DayLabel />
        <Counter />
        <TitleLine />
        <IntensityRow />
        <ShareRow />
      </CardShell>
      <FooterCaption />
    </AbsoluteFill>
  );
};
