import React from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { loadInterFont } from "./font";

loadInterFont();

const FF = "Inter, 'Helvetica Neue', Arial, sans-serif";
const BG = "#080808";
const INK = "#F4F4F4";
const DIM = "rgba(244,244,244,0.4)";
const TEAL = "#5EEAD4";

const Gem: React.FC<{ size: number; rot?: number }> = ({ size, rot = 0 }) => (
  <svg width={size} height={size} viewBox="0 0 64 64" fill="none" style={{ transform: `rotate(${rot}deg)` }}>
    <rect width="64" height="64" rx="15" fill="#0A0B0D" />
    <path d="M58,32 L50,14 L32,32 Z" fill="#3CCFBA" />
    <path d="M32,58 L14,50 L32,32 Z" fill="#3CCFBA" />
    <path d="M6,32 L14,14 L32,32 Z" fill="#3CCFBA" />
    <path d="M32,6 L50,14 L32,32 Z" fill="#5EEAD4" />
    <path d="M58,32 L50,50 L32,32 Z" fill="#0D9488" />
    <path d="M50,50 L32,58 L32,32 Z" fill="#0A7A70" />
    <path d="M14,50 L6,32 L32,32 Z" fill="#0D9488" />
    <path d="M14,14 L32,6 L32,32 Z" fill="#0A7A70" />
    <path d="M43,32 L39,39 L32,43 L25,39 L21,32 L25,25 L32,21 L39,25 Z" fill="rgba(255,255,255,0.22)" />
  </svg>
);

// 120 frames = 4s @ 30fps
// 0–24:   gem drops in
// 24–60:  hook line slides up
// 60–90:  "same." appears
// 90–120: url + cta pops in

export const Story: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const gemS = spring({ frame: frame - 4, fps, config: { damping: 8, stiffness: 180 }, durationInFrames: 30 });
  const gemRot = interpolate(gemS, [0, 1], [-20, 0]);
  const gemScale = interpolate(gemS, [0, 1], [0.4, 1]);

  const hookS = spring({ frame: frame - 30, fps, config: { damping: 14, stiffness: 160 }, durationInFrames: 30 });
  const hookY = interpolate(hookS, [0, 1], [50, 0]);

  const sameS = spring({ frame: frame - 60, fps, config: { damping: 12, stiffness: 180 }, durationInFrames: 24 });
  const sameScale = interpolate(sameS, [0, 1], [0.85, 1]);

  const urlS = spring({ frame: frame - 86, fps, config: { damping: 12, stiffness: 200 }, durationInFrames: 20 });

  // soft pulsing glow behind everything
  const glowPulse = 0.06 + 0.03 * Math.sin(frame * 0.08);

  return (
    <AbsoluteFill style={{
      background: BG,
      fontFamily: FF,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
    }}>
      {/* ambient glow */}
      <div style={{
        position: "absolute",
        top: 0, left: 0, right: 0, bottom: 0,
        background: `radial-gradient(ellipse 70% 55% at 50% 50%, rgba(94,234,212,0.18) 0%, transparent 65%)`,
        opacity: glowPulse * (gemS > 0.1 ? 1 : gemS * 10),
      }} />

      {/* gem */}
      <div style={{
        opacity: gemS,
        transform: `scale(${gemScale}) rotate(${gemRot}deg)`,
        marginBottom: 64,
      }}>
        <Gem size={120} rot={0} />
      </div>

      {/* hook */}
      <div style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        opacity: hookS,
        transform: `translateY(${hookY}px)`,
      }}>
        <span style={{
          fontSize: 88,
          fontWeight: 900,
          lineHeight: 0.88,
          letterSpacing: -4,
          color: INK,
          textAlign: "center",
        }}>
          currently
        </span>
        <span style={{
          fontSize: 88,
          fontWeight: 900,
          lineHeight: 0.88,
          letterSpacing: -4,
          color: INK,
          textAlign: "center",
        }}>
          obsessed
        </span>
        <span style={{
          fontSize: 88,
          fontWeight: 900,
          lineHeight: 0.88,
          letterSpacing: -4,
          color: TEAL,
          textAlign: "center",
        }}>
          with smth?
        </span>
      </div>

      {/* same. */}
      <div style={{
        marginTop: 48,
        opacity: sameS,
        transform: `scale(${sameScale})`,
      }}>
        <span style={{
          fontSize: 52,
          fontWeight: 700,
          color: DIM,
          letterSpacing: -1.5,
        }}>
          same.
        </span>
      </div>

      {/* url + cta */}
      <div style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        marginTop: 72,
        opacity: urlS,
        transform: `translateY(${interpolate(urlS, [0, 1], [24, 0])}px)`,
      }}>
        <div style={{
          display: "flex",
          padding: "18px 44px",
          background: TEAL,
          borderRadius: 100,
          marginBottom: 20,
        }}>
          <span style={{ fontSize: 24, fontWeight: 800, color: BG, letterSpacing: -0.5 }}>
            hyperfix.app
          </span>
        </div>
        <span style={{
          fontSize: 18,
          fontWeight: 500,
          letterSpacing: 4,
          textTransform: "uppercase",
          color: "rgba(244,244,244,0.28)",
        }}>
          link in bio
        </span>
      </div>
    </AbsoluteFill>
  );
};
