import React from "react";
import {
  AbsoluteFill,
  Easing,
  Img,
  Sequence,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { loadInterFont } from "./font";

loadInterFont();

const FF = "Inter, 'Helvetica Neue', Arial, sans-serif";
const BG = "#080808";
const INK = "#F4F4F4";
const DIM = "rgba(244,244,244,0.38)";
const TEAL = "#5EEAD4";
const TEAL_DARK = "#0D9488";

const ease = Easing.bezier(0.16, 1, 0.3, 1);

const sp = (frame: number, fps: number, delay = 0) =>
  spring({ frame: frame - delay, fps, config: { damping: 14, stiffness: 160 }, durationInFrames: 30 });

const fadeUp = (frame: number, delay = 0, dist = 36) => {
  const t = interpolate(frame - delay, [0, 18], [0, 1], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: ease,
  });
  return { opacity: t, transform: `translateY(${(1 - t) * dist}px)` };
};

const FadeIn: React.FC<{ frame: number; frames?: number }> = ({ frame, frames = 10 }) => {
  const op = interpolate(frame, [0, frames], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  if (op <= 0) return null;
  return <div style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, background: BG, opacity: op, pointerEvents: "none" }} />;
};

const Gem: React.FC<{ size: number }> = ({ size }) => (
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
    <path d="M43,32 L39,39 L32,43 L25,39 L21,32 L25,25 L32,21 L39,25 Z" fill="rgba(255,255,255,0.22)" />
  </svg>
);

const PhoneMockup: React.FC<{ src: string; width: number }> = ({ src, width }) => {
  const h = width * 2.16;
  const sw = width - 24;
  const sh = h - 56;
  return (
    <div style={{ position: "relative", width, height: h, flexShrink: 0 }}>
      <svg width={width} height={h} viewBox={`0 0 ${width} ${h}`} fill="none" style={{ position: "absolute", top: 0, left: 0 }}>
        <rect x="0" y="0" width={width} height={h} rx="44" fill="#1A1A1C" />
        <rect x="1" y="1" width={width - 2} height={h - 2} rx="43" fill="none" stroke="#333336" strokeWidth="2" />
        <rect x={width / 2 - 50} y="12" width="100" height="30" rx="15" fill="#0A0A0A" />
        <rect x={width - 3} y="120" width="3" height="60" rx="2" fill="#2A2A2C" />
        <rect x="0" y="100" width="3" height="40" rx="2" fill="#2A2A2C" />
        <rect x="0" y="152" width="3" height="40" rx="2" fill="#2A2A2C" />
        <rect x="12" y="28" width={sw} height={sh} rx="34" fill="#080808" />
      </svg>
      <div style={{ position: "absolute", top: 28, left: 12, width: sw, height: sh, borderRadius: 34, overflow: "hidden" }}>
        <Img src={src} style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "top" }} />
      </div>
    </div>
  );
};

// ─── Scene 1: The problem (0-90f / 3s) ────────────────────────────────
const Scene1: React.FC<{ frame: number }> = ({ frame }) => (
  <AbsoluteFill style={{ background: BG, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", fontFamily: FF, padding: "0 80px" }}>
    <div style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, background: "radial-gradient(ellipse 60% 40% at 50% 50%, rgba(94,234,212,0.06) 0%, transparent 60%)" }} />
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 20 }}>
      <div style={{ ...fadeUp(frame, 0), display: "flex" }}>
        <span style={{ fontSize: 80, fontWeight: 900, color: INK, letterSpacing: -4, textAlign: "center", lineHeight: 1 }}>
          my brain keeps
        </span>
      </div>
      <div style={{ ...fadeUp(frame, 8), display: "flex" }}>
        <span style={{ fontSize: 80, fontWeight: 900, color: TEAL, letterSpacing: -4, textAlign: "center", lineHeight: 1 }}>
          deleting my
        </span>
      </div>
      <div style={{ ...fadeUp(frame, 16), display: "flex" }}>
        <span style={{ fontSize: 80, fontWeight: 900, color: INK, letterSpacing: -4, textAlign: "center", lineHeight: 1 }}>
          hyperfixations.
        </span>
      </div>
      <div style={{ ...fadeUp(frame, 36), display: "flex", marginTop: 16 }}>
        <span style={{ fontSize: 34, fontWeight: 500, color: DIM, textAlign: "center", letterSpacing: -0.5 }}>
          they fade and i can't remember them at all.
        </span>
      </div>
    </div>
    <FadeIn frame={frame} />
  </AbsoluteFill>
);

// ─── Scene 2: The solution tease (90-180f / 3s) ───────────────────────
const Scene2: React.FC<{ frame: number }> = ({ frame }) => (
  <AbsoluteFill style={{ background: BG, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", fontFamily: FF, padding: "0 80px", gap: 32 }}>
    <div style={{ ...fadeUp(frame, 0), display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
      <span style={{ fontSize: 36, fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", color: TEAL }}>so i built</span>
      <span style={{ fontSize: 76, fontWeight: 900, color: INK, letterSpacing: -4, textAlign: "center", lineHeight: 0.9 }}>
        an app to
      </span>
      <span style={{ fontSize: 76, fontWeight: 900, color: INK, letterSpacing: -4, textAlign: "center", lineHeight: 0.9 }}>
        remember them.
      </span>
    </div>

    <div style={{ display: "flex", flexDirection: "column", gap: 16, width: "100%" }}>
      {[
        { text: "name it", delay: 16 },
        { text: "rate your intensity", delay: 24 },
        { text: "log notes while you still care", delay: 32 },
      ].map((item, i) => (
        <div key={i} style={{ ...fadeUp(frame, item.delay), display: "flex", alignItems: "center", gap: 20 }}>
          <div style={{ display: "flex", width: 10, height: 10, borderRadius: 5, background: TEAL, flexShrink: 0 }} />
          <span style={{ fontSize: 36, fontWeight: 600, color: INK, letterSpacing: -0.5 }}>{item.text}</span>
        </div>
      ))}
    </div>
    <FadeIn frame={frame} />
  </AbsoluteFill>
);

// ─── Scene 3: The graveyard (180-270f / 3s) ───────────────────────────
const Scene3: React.FC<{ frame: number }> = ({ frame }) => {
  const deadFixes = [
    { name: "competitive yo-yo", days: "23 days", val: 9 },
    { name: "sourdough", days: "11 days", val: 7 },
    { name: "Severance lore", days: "47 days", val: 10 },
  ];

  return (
    <AbsoluteFill style={{ background: BG, display: "flex", flexDirection: "column", fontFamily: FF, padding: "120px 80px", gap: 40 }}>
      <div style={{ ...fadeUp(frame, 0), display: "flex", flexDirection: "column", gap: 8 }}>
        <span style={{ fontSize: 22, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(94,234,212,0.5)" }}>
          the graveyard
        </span>
        <span style={{ fontSize: 64, fontWeight: 900, color: INK, letterSpacing: -3, lineHeight: 0.9 }}>
          proof every obsession was real.
        </span>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        {deadFixes.map((f, i) => {
          const t = interpolate(frame - (12 + i * 14), [0, 16], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: ease });
          return (
            <div key={i} style={{
              display: "flex", alignItems: "center", justifyContent: "space-between",
              background: "#101012", borderRadius: 18, padding: "24px 32px",
              border: "1px solid rgba(244,244,244,0.07)",
              opacity: t, transform: `translateY(${(1 - t) * 20}px)`,
            }}>
              <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                <span style={{ fontSize: 30, fontWeight: 700, color: "rgba(244,244,244,0.3)", textDecoration: "line-through", letterSpacing: -0.5 }}>
                  {f.name}
                </span>
                <span style={{ fontSize: 18, fontWeight: 500, color: "rgba(244,244,244,0.18)" }}>
                  {f.days} · peak {f.val}/10
                </span>
              </div>
              <span style={{ fontSize: 22, color: "rgba(94,234,212,0.3)", fontWeight: 700 }}>rip</span>
            </div>
          );
        })}
      </div>
      <FadeIn frame={frame} />
    </AbsoluteFill>
  );
};

// ─── Scene 4: CTA (270-360f / 3s) ────────────────────────────────────
const Scene4: React.FC<{ frame: number }> = ({ frame }) => {
  const { fps } = useVideoConfig();
  const gemS = sp(frame, fps, 0);
  const wordS = sp(frame, fps, 8);
  const ctaS = sp(frame, fps, 18);

  return (
    <AbsoluteFill style={{ background: BG, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", fontFamily: FF, gap: 36 }}>
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, background: "radial-gradient(ellipse 70% 55% at 50% 50%, rgba(94,234,212,0.12) 0%, transparent 65%)" }} />

      <div style={{ opacity: gemS, transform: `scale(${interpolate(gemS, [0, 1], [0.8, 1])})`, display: "flex" }}>
        <Gem size={96} />
      </div>

      <div style={{ opacity: wordS, display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
        <div style={{ display: "flex", fontFamily: "Georgia, serif", fontSize: 88, fontWeight: 700, letterSpacing: -5, lineHeight: 0.9 }}>
          <span style={{ color: INK }}>hyper</span>
          <span style={{ color: TEAL, fontStyle: "italic" }}>fix</span>
        </div>
        <span style={{ fontFamily: "Georgia, serif", fontSize: 88, fontWeight: 700, letterSpacing: -5, lineHeight: 0.9, color: TEAL, fontStyle: "italic" }}>
          .app
        </span>
      </div>

      <div style={{ opacity: ctaS, display: "flex", flexDirection: "column", alignItems: "center", gap: 14 }}>
        <span style={{ fontSize: 28, color: DIM, fontWeight: 500, letterSpacing: -0.5 }}>free. link in bio.</span>
        <div style={{ display: "flex", padding: "18px 48px", background: TEAL, borderRadius: 100 }}>
          <span style={{ fontSize: 26, fontWeight: 800, color: BG }}>track your fixations</span>
        </div>
      </div>
      <FadeIn frame={frame} />
    </AbsoluteFill>
  );
};

// 360f = 12s
export const Reveal: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ background: BG }}>
      <Sequence from={0} durationInFrames={90}><Scene1 frame={frame} /></Sequence>
      <Sequence from={90} durationInFrames={90}><Scene2 frame={frame - 90} /></Sequence>
      <Sequence from={180} durationInFrames={90}><Scene3 frame={frame - 180} /></Sequence>
      <Sequence from={270} durationInFrames={90}><Scene4 frame={frame - 270} /></Sequence>
    </AbsoluteFill>
  );
};
