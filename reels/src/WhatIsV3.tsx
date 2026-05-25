import React, { useEffect } from "react";
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
const DIM = "rgba(244,244,244,0.4)";
const TEAL = "#5EEAD4";
const CARD = "#0F1011";
const CARD_BORDER = "rgba(255,255,255,0.06)";

// ─── animation helpers ────────────────────────────────────────────────
const ease = Easing.bezier(0.16, 1, 0.3, 1);

const s = (frame: number, fps: number, delay = 0, damping = 12, stiffness = 180) =>
  spring({ frame: frame - delay, fps, config: { damping, stiffness }, durationInFrames: 40 });

const fadeUp = (frame: number, delay = 0, dist = 32) => {
  const t = interpolate(frame - delay, [0, 22], [0, 1], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: ease,
  });
  return { opacity: t, transform: `translateY(${(1 - t) * dist}px)` };
};

// ─── gem mark ────────────────────────────────────────────────────────
const Gem: React.FC<{ size: number; rotate?: number }> = ({ size, rotate = 0 }) => (
  <svg width={size} height={size} viewBox="0 0 64 64" fill="none" style={{ transform: `rotate(${rotate}deg)` }}>
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

// ─── phone mockup wrapping a screenshot ──────────────────────────────
const PhoneMockup: React.FC<{ src: string; width: number }> = ({ src, width }) => {
  const h = width * 2.16;
  const sw = width - 24;
  const sh = h - 56;
  return (
    <div style={{ position: "relative", width, height: h, flexShrink: 0 }}>
      {/* frame */}
      <svg width={width} height={h} viewBox={`0 0 ${width} ${h}`} style={{ position: "absolute", top: 0, left: 0, zIndex: 2 }}>
        <rect x="1" y="1" width={width - 2} height={h - 2} rx="36" fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth="1.5" />
        <rect x="0" y="0" width={width} height={h} rx="36" fill="#111316" opacity={0} />
        {/* side buttons */}
        <rect x={width - 3} y="100" width="3" height="48" rx="2" fill="#222" />
        <rect x={width - 3} y="160" width="3" height="72" rx="2" fill="#222" />
        <rect x="0" y="130" width="3" height="56" rx="2" fill="#222" />
        {/* dynamic island */}
        <rect x={width / 2 - 28} y="12" width="56" height="18" rx="9" fill="#000" />
      </svg>
      {/* screen */}
      <div style={{
        position: "absolute", top: 28, left: 12, width: sw, height: sh,
        borderRadius: 28, overflow: "hidden", background: "#080808",
      }}>
        <Img src={src} style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "top" }} />
      </div>
    </div>
  );
};

// ─── scene 1 · title (0–72f / 2.4s) ─────────────────────────────────
const S1: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const words = ["hyper-", "fixation."];
  const colors = [INK, TEAL];

  const fadeIn = interpolate(frame, [0, 8], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const sub = fadeUp(frame, 36);

  // teal line sweeps from left to right
  const lineW = interpolate(frame, [28, 58], [0, 1], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: ease,
  });

  return (
    <AbsoluteFill style={{ background: BG, fontFamily: FF, display: "flex", flexDirection: "column", justifyContent: "center", padding: "0 80px" }}>
      <div style={{ opacity: fadeIn }}>
        {words.map((word, i) => {
          const t = s(frame, fps, i * 14, 14, 160);
          return (
            <div key={word} style={{
              fontSize: 136,
              fontWeight: 900,
              lineHeight: 0.86,
              letterSpacing: -6,
              color: colors[i],
              opacity: t,
              transform: `translateY(${interpolate(t, [0, 1], [40, 0])}px)`,
            }}>
              {word}
            </div>
          );
        })}

        {/* teal sweep line */}
        <div style={{ marginTop: 32, height: 3, background: "rgba(94,234,212,0.12)", borderRadius: 2, overflow: "hidden" }}>
          <div style={{ height: "100%", width: `${lineW * 100}%`, background: TEAL, borderRadius: 2 }} />
        </div>

        <div style={{ marginTop: 28, ...sub }}>
          <span style={{ fontSize: 26, fontWeight: 400, color: DIM, letterSpacing: -0.3 }}>
            it&apos;s not just really liking something.
          </span>
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ─── scene 2 · app screenshot + headline (72–180f / 3.6s) ─────────────
const S2: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const phone = s(frame, fps, 8, 10, 120);
  const phoneY = interpolate(phone, [0, 1], [100, 0]);
  const headline = fadeUp(frame, 28);
  const sub = fadeUp(frame, 46);
  const badge = s(frame, fps, 52, 12, 200);

  return (
    <AbsoluteFill style={{ background: BG, fontFamily: FF, display: "flex", flexDirection: "column", padding: "80px 72px" }}>
      {/* eyebrow */}
      <div style={{ display: "flex", alignItems: "center", gap: 14, ...fadeUp(frame, 4) }}>
        <Gem size={40} />
        <span style={{ fontSize: 22, fontWeight: 700, color: DIM, letterSpacing: -0.5 }}>
          hyper<span style={{ color: TEAL }}>fix</span>
        </span>
      </div>

      {/* headline */}
      <div style={{ marginTop: 52, ...headline }}>
        <div style={{ fontSize: 76, fontWeight: 900, lineHeight: 0.9, letterSpacing: -3.5, color: INK }}>track</div>
        <div style={{ fontSize: 76, fontWeight: 900, lineHeight: 0.9, letterSpacing: -3.5, color: INK }}>every</div>
        <div style={{ fontSize: 76, fontWeight: 900, lineHeight: 0.9, letterSpacing: -3.5, color: TEAL }}>obsession.</div>
      </div>

      <div style={{ marginTop: 20, ...sub }}>
        <span style={{ fontSize: 22, fontWeight: 400, color: DIM, letterSpacing: -0.3, lineHeight: 1.4 }}>
          from fanfic to formula one. log it, rate it, mourn it.
        </span>
      </div>

      {/* phone mockup */}
      <div style={{
        position: "absolute", right: -20, bottom: 0,
        opacity: phone,
        transform: `translateY(${phoneY}px)`,
      }}>
        <PhoneMockup src={staticFile("landing.png")} width={280} />
      </div>

      {/* floating badge */}
      <div style={{
        position: "absolute", right: 220, bottom: 280,
        opacity: badge,
        transform: `scale(${interpolate(badge, [0, 1], [0.7, 1])})`,
      }}>
        <div style={{
          background: CARD,
          border: `1px solid ${CARD_BORDER}`,
          borderRadius: 16,
          padding: "16px 22px",
          backdropFilter: "blur(10px)",
        }}>
          <div style={{ fontSize: 13, fontWeight: 700, letterSpacing: 3, textTransform: "uppercase", color: TEAL, marginBottom: 4 }}>active fix</div>
          <div style={{ fontSize: 26, fontWeight: 800, color: INK, letterSpacing: -1 }}>Severance</div>
          <div style={{ fontSize: 15, fontWeight: 500, color: DIM, marginTop: 2 }}>day <span style={{ color: TEAL, fontWeight: 800 }}>47</span></div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ─── scene 3 · normal people vs you (180–270f / 3s) ──────────────────
const S3: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const label = fadeUp(frame, 4);
  const c1 = s(frame, fps, 12, 11, 140);
  const c2 = s(frame, fps, 32, 11, 140);

  return (
    <AbsoluteFill style={{ background: BG, fontFamily: FF, display: "flex", flexDirection: "column", justifyContent: "center", padding: "0 72px", gap: 0 }}>
      <div style={{ marginBottom: 40, ...label }}>
        <span style={{ fontSize: 14, fontWeight: 700, letterSpacing: 5, textTransform: "uppercase", color: TEAL }}>the reality</span>
      </div>

      {/* normal card */}
      <div style={{
        background: CARD, border: `1px solid ${CARD_BORDER}`, borderRadius: 20,
        padding: "36px 40px", marginBottom: 18,
        opacity: c1, transform: `translateX(${interpolate(c1, [0, 1], [-60, 0])}px)`,
      }}>
        <div style={{ fontSize: 13, fontWeight: 700, letterSpacing: 5, textTransform: "uppercase", color: DIM, marginBottom: 14 }}>normal people</div>
        <div style={{ fontSize: 42, fontWeight: 700, lineHeight: 1.12, letterSpacing: -1.5, color: INK }}>
          find something. enjoy it. move on.
        </div>
      </div>

      {/* you card */}
      <div style={{
        background: "rgba(94,234,212,0.05)", border: `1px solid rgba(94,234,212,0.2)`, borderRadius: 20,
        padding: "36px 40px",
        opacity: c2, transform: `translateX(${interpolate(c2, [0, 1], [60, 0])}px)`,
      }}>
        <div style={{ fontSize: 13, fontWeight: 700, letterSpacing: 5, textTransform: "uppercase", color: TEAL, marginBottom: 14 }}>you</div>
        <div style={{ fontSize: 42, fontWeight: 700, lineHeight: 1.12, letterSpacing: -1.5, color: INK }}>
          restructure your entire life around it for 3 weeks then ghost it completely.
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ─── scene 4 · brain locks on (270–345f / 2.5s) ──────────────────────
const LOCK_WORDS = [
  { text: "your",   color: INK,  from: -80 },
  { text: "brain",  color: INK,  from: 80 },
  { text: "locks",  color: TEAL, from: -80 },
  { text: "on.",    color: TEAL, from: 80 },
];

const S4: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // pulsing ring behind text
  const ringScale = 0.95 + 0.05 * Math.sin(frame * 0.15);
  const ringOp = interpolate(frame, [0, 20], [0, 0.06], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ background: BG, fontFamily: FF, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
      {/* ambient glow ring */}
      <div style={{
        position: "absolute", width: 700, height: 700,
        borderRadius: "50%",
        background: `radial-gradient(circle, rgba(94,234,212,0.12) 0%, transparent 65%)`,
        transform: `scale(${ringScale})`,
        opacity: ringOp,
      }} />

      {LOCK_WORDS.map((w, i) => {
        const t = s(frame, fps, i * 10 + 4, 10, 220);
        const x = interpolate(t, [0, 1], [w.from, 0]);
        return (
          <div key={w.text} style={{
            fontSize: 140,
            fontWeight: 900,
            lineHeight: 0.84,
            letterSpacing: -7,
            color: w.color,
            opacity: t,
            transform: `translateX(${x}px)`,
          }}>
            {w.text}
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

// ─── scene 5 · not a flaw (345–405f / 2s) ────────────────────────────
const S5: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const tag = fadeUp(frame, 4);
  const line1 = s(frame, fps, 14, 12, 200);
  const line2 = s(frame, fps, 26, 12, 200);
  const line3 = s(frame, fps, 38, 9, 240);
  const sub = fadeUp(frame, 52);

  return (
    <AbsoluteFill style={{ background: BG, fontFamily: FF, display: "flex", flexDirection: "column", justifyContent: "center", padding: "0 80px" }}>
      <div style={{ marginBottom: 32, ...tag }}>
        <span style={{ fontSize: 14, fontWeight: 700, letterSpacing: 5, textTransform: "uppercase", color: DIM }}>
          common with ADHD + autism
        </span>
      </div>

      <div style={{ fontSize: 124, fontWeight: 900, lineHeight: 0.84, letterSpacing: -6, color: INK, opacity: line1, transform: `scale(${interpolate(line1, [0, 1], [0.94, 1])})` }}>not</div>
      <div style={{ fontSize: 124, fontWeight: 900, lineHeight: 0.84, letterSpacing: -6, color: INK, opacity: line2, transform: `scale(${interpolate(line2, [0, 1], [0.94, 1])})` }}>a flaw.</div>
      <div style={{ fontSize: 124, fontWeight: 900, lineHeight: 0.88, letterSpacing: -6, color: TEAL, opacity: line3, transform: `scale(${interpolate(line3, [0, 1], [0.88, 1])})` }}>a feature.</div>

      <div style={{ marginTop: 36, ...sub }}>
        <span style={{ fontSize: 24, fontWeight: 400, color: DIM, lineHeight: 1.45, maxWidth: 820 }}>
          your brain found signal in the noise. it&apos;s holding on for dear life.
        </span>
      </div>
    </AbsoluteFill>
  );
};

// ─── scene 6 · fix card + CTA (405–450f / 1.5s) ──────────────────────
const S6: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const card = s(frame, fps, 0, 9, 160);
  const cardY = interpolate(card, [0, 1], [80, 0]);
  const gem = s(frame, fps, 6, 8, 200);
  const url = fadeUp(frame, 20);
  const btn = s(frame, fps, 28, 10, 180);

  return (
    <AbsoluteFill style={{
      background: "linear-gradient(160deg, #0A1A18 0%, #080808 60%)",
      fontFamily: FF, display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center", padding: "0 72px",
    }}>
      {/* ambient teal bg */}
      <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse 70% 50% at 50% 100%, rgba(94,234,212,0.1) 0%, transparent 65%)" }} />

      {/* fix card screenshot */}
      <div style={{ opacity: card, transform: `translateY(${cardY}px)`, width: "100%", marginBottom: 48 }}>
        <div style={{
          background: CARD, border: `1px solid ${CARD_BORDER}`,
          borderRadius: 24, overflow: "hidden", boxShadow: "0 40px 80px -20px rgba(0,0,0,0.6)",
        }}>
          <Img
            src={staticFile("fix-card-slide.png")}
            style={{ width: "100%", display: "block" }}
          />
        </div>
      </div>

      {/* gem + wordmark */}
      <div style={{ display: "flex", alignItems: "center", gap: 16, opacity: gem, transform: `scale(${interpolate(gem, [0, 1], [0.7, 1])}) rotate(${interpolate(gem, [0, 1], [-15, 0])}deg)` }}>
        <Gem size={52} rotate={interpolate(gem, [0, 1], [-15, 0])} />
        <span style={{ fontSize: 36, fontWeight: 900, letterSpacing: -1.5, color: INK }}>
          hyper<span style={{ color: TEAL }}>fix</span>.app
        </span>
      </div>

      <div style={{ marginTop: 10, ...url }}>
        <span style={{ fontSize: 16, fontWeight: 500, letterSpacing: 4, textTransform: "uppercase", color: DIM }}>link in bio</span>
      </div>

      {/* CTA */}
      <div style={{ marginTop: 28, opacity: btn, transform: `scale(${interpolate(btn, [0, 1], [0.8, 1])})` }}>
        <div style={{ background: TEAL, borderRadius: 999, padding: "18px 48px" }}>
          <span style={{ fontSize: 22, fontWeight: 800, color: BG, letterSpacing: -0.5 }}>free to use →</span>
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ─── root · 450f = 15s ───────────────────────────────────────────────
// S1: 0–72   S2: 72–180  S3: 180–270  S4: 270–345  S5: 345–405  S6: 405–450

export const WhatIsV3: React.FC = () => (
  <AbsoluteFill style={{ background: BG }}>
    <Sequence from={0}   durationInFrames={72}><S1 /></Sequence>
    <Sequence from={72}  durationInFrames={108}><S2 /></Sequence>
    <Sequence from={180} durationInFrames={90}><S3 /></Sequence>
    <Sequence from={270} durationInFrames={75}><S4 /></Sequence>
    <Sequence from={345} durationInFrames={60}><S5 /></Sequence>
    <Sequence from={405} durationInFrames={45}><S6 /></Sequence>
  </AbsoluteFill>
);
