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
const DIM = "rgba(244,244,244,0.4)";
const DIM2 = "rgba(244,244,244,0.18)";
const TEAL = "#5EEAD4";
const TEAL_DARK = "#0D9488";

const ease = Easing.bezier(0.16, 1, 0.3, 1);

const sp = (frame: number, fps: number, delay = 0, damping = 14, stiffness = 160) =>
  spring({ frame: frame - delay, fps, config: { damping, stiffness }, durationInFrames: 40 });

const fadeUp = (frame: number, delay = 0, dist = 40) => {
  const t = interpolate(frame - delay, [0, 22], [0, 1], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: ease,
  });
  return { opacity: t, transform: `translateY(${(1 - t) * dist}px)` };
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
        {/* dynamic island */}
        <rect x={width / 2 - 50} y="12" width="100" height="30" rx="15" fill="#0A0A0A" />
        {/* side button */}
        <rect x={width - 3} y="120" width="3" height="60" rx="2" fill="#2A2A2C" />
        {/* volume buttons */}
        <rect x="0" y="100" width="3" height="40" rx="2" fill="#2A2A2C" />
        <rect x="0" y="152" width="3" height="40" rx="2" fill="#2A2A2C" />
        {/* screen bg */}
        <rect x="12" y="28" width={sw} height={sh} rx="34" fill="#080808" />
      </svg>
      <div style={{
        position: "absolute", top: 28, left: 12,
        width: sw, height: sh,
        borderRadius: 34, overflow: "hidden",
      }}>
        <Img src={src} style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "top" }} />
      </div>
    </div>
  );
};

// Animated typing cursor
const TypedText: React.FC<{ text: string; frame: number; startFrame: number; fps: number }> = ({ text, frame, startFrame, fps }) => {
  const elapsed = frame - startFrame;
  const charsPerSecond = 18;
  const charsToShow = Math.min(text.length, Math.floor(elapsed / fps * charsPerSecond));
  const showCursor = elapsed > 0 && charsToShow < text.length;
  return (
    <span>
      {text.slice(0, charsToShow)}
      {showCursor && <span style={{ opacity: Math.floor(elapsed / 8) % 2 === 0 ? 1 : 0 }}>|</span>}
    </span>
  );
};

// Intensity bar animation
const IntensityBar: React.FC<{ frame: number; startFrame: number; value: number }> = ({ frame, startFrame, value }) => {
  const elapsed = frame - startFrame;
  const pct = interpolate(elapsed, [0, 25], [0, value], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: ease });
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ fontFamily: FF, fontSize: 22, fontWeight: 600, color: DIM }}>intensity</span>
        <span style={{ fontFamily: FF, fontSize: 26, fontWeight: 800, color: TEAL }}>{Math.round(pct)}</span>
      </div>
      <div style={{ display: "flex", height: 10, background: "rgba(255,255,255,0.08)", borderRadius: 5, overflow: "hidden" }}>
        <div style={{ width: `${pct * 10}%`, background: `linear-gradient(90deg, #0D9488, #5EEAD4)`, borderRadius: 5 }} />
      </div>
    </div>
  );
};

// ─── Scene 1: Hook (0–75f) ────────────────────────────────────────────
// "you got into something new."
const Scene1: React.FC<{ frame: number }> = ({ frame }) => {
  const { fps } = useVideoConfig();
  const glowOp = interpolate(frame, [0, 30], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ background: BG, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", fontFamily: FF }}>
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, background: "radial-gradient(ellipse 60% 40% at 50% 50%, rgba(94,234,212,0.12) 0%, transparent 70%)", opacity: glowOp }} />

      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 24 }}>
        <div style={{ ...fadeUp(frame, 0), display: "flex" }}>
          <Gem size={80} />
        </div>
        <div style={{ ...fadeUp(frame, 8), display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: 68, fontWeight: 900, color: INK, letterSpacing: -3, lineHeight: 1.1, textAlign: "center" }}>
            you got into
          </span>
          <span style={{ fontSize: 68, fontWeight: 900, color: TEAL, letterSpacing: -3, lineHeight: 1.1, textAlign: "center" }}>
            something new.
          </span>
        </div>
        <div style={{ ...fadeUp(frame, 20), display: "flex" }}>
          <span style={{ fontSize: 32, fontWeight: 500, color: DIM, letterSpacing: -0.5, textAlign: "center" }}>
            track it before your brain moves on.
          </span>
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ─── Scene 2: Naming the fixation (75–165f) ────────────────────────────
const Scene2: React.FC<{ frame: number }> = ({ frame }) => {
  const FIXATION_NAME = "Severance (the show)";

  return (
    <AbsoluteFill style={{ background: BG, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", fontFamily: FF, gap: 48 }}>
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, background: "radial-gradient(ellipse 70% 50% at 50% 30%, rgba(94,234,212,0.07) 0%, transparent 60%)" }} />

      <div style={{ ...fadeUp(frame, 0), display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
        <span style={{ fontSize: 22, fontWeight: 600, letterSpacing: 4, textTransform: "uppercase", color: DIM2 }}>step 1</span>
        <span style={{ fontSize: 52, fontWeight: 800, color: INK, letterSpacing: -2 }}>name it.</span>
      </div>

      {/* mock app input card */}
      <div style={{ ...fadeUp(frame, 8), display: "flex", width: 760, flexDirection: "column", background: "#0F1011", borderRadius: 24, padding: "40px 44px", gap: 16, border: "1px solid rgba(255,255,255,0.06)" }}>
        <span style={{ fontSize: 18, fontWeight: 600, letterSpacing: 3, textTransform: "uppercase", color: DIM2 }}>new fixation</span>
        <div style={{ display: "flex", borderBottom: "2px solid rgba(94,234,212,0.4)", paddingBottom: 12 }}>
          <span style={{ fontSize: 44, fontWeight: 700, color: INK, letterSpacing: -1.5 }}>
            <TypedText text={FIXATION_NAME} frame={frame} startFrame={12} fps={30} />
          </span>
        </div>
        <span style={{ fontSize: 20, color: "rgba(244,244,244,0.2)", fontWeight: 500 }}>what are you into right now?</span>
      </div>

      {/* date badge */}
      <div style={{ ...fadeUp(frame, 22), display: "flex", alignItems: "center", gap: 20 }}>
        <div style={{ display: "flex", padding: "14px 28px", background: "rgba(94,234,212,0.08)", border: "1px solid rgba(94,234,212,0.2)", borderRadius: 100 }}>
          <span style={{ fontSize: 24, fontWeight: 700, color: TEAL, letterSpacing: -0.5 }}>started today</span>
        </div>
        <span style={{ fontSize: 24, color: DIM, fontWeight: 500 }}>day 1</span>
      </div>
    </AbsoluteFill>
  );
};

// ─── Scene 3: Rate intensity (165–255f) ─────────────────────────────────
const Scene3: React.FC<{ frame: number }> = ({ frame }) => {
  return (
    <AbsoluteFill style={{ background: BG, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", fontFamily: FF, gap: 48 }}>
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, background: "radial-gradient(ellipse 70% 50% at 50% 70%, rgba(94,234,212,0.07) 0%, transparent 60%)" }} />

      <div style={{ ...fadeUp(frame, 0), display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
        <span style={{ fontSize: 22, fontWeight: 600, letterSpacing: 4, textTransform: "uppercase", color: DIM2 }}>step 2</span>
        <span style={{ fontSize: 52, fontWeight: 800, color: INK, letterSpacing: -2 }}>rate your intensity.</span>
      </div>

      <div style={{ ...fadeUp(frame, 8), display: "flex", width: 760, flexDirection: "column", background: "#0F1011", borderRadius: 24, padding: "40px 44px", gap: 28, border: "1px solid rgba(255,255,255,0.06)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <span style={{ fontSize: 40, fontWeight: 800, color: INK, letterSpacing: -1 }}>Severance</span>
          <div style={{ display: "flex", padding: "6px 18px", background: "rgba(94,234,212,0.1)", borderRadius: 100 }}>
            <span style={{ fontSize: 18, color: TEAL, fontWeight: 700 }}>day 1</span>
          </div>
        </div>

        <IntensityBar frame={frame} startFrame={14} value={8} />

        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <span style={{ fontSize: 18, color: DIM2, fontWeight: 500 }}>mild interest</span>
          <span style={{ fontSize: 18, color: TEAL, fontWeight: 700 }}>hyperfixation</span>
        </div>
      </div>

      <div style={{ ...fadeUp(frame, 30), display: "flex" }}>
        <span style={{ fontSize: 28, color: DIM, fontWeight: 500, textAlign: "center", letterSpacing: -0.5 }}>
          8/10 — you're already obsessed.
        </span>
      </div>
    </AbsoluteFill>
  );
};

// ─── Scene 4: Phone mockup + app screenshot (255–345f) ─────────────────
const Scene4: React.FC<{ frame: number }> = ({ frame }) => {
  const phoneScale = interpolate(sp(frame, 30, 0), [0, 1], [0.88, 1]);
  const phoneOp = sp(frame, 30, 0);

  return (
    <AbsoluteFill style={{ background: BG, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", fontFamily: FF, gap: 52 }}>
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, background: "radial-gradient(ellipse 80% 60% at 50% 60%, rgba(94,234,212,0.1) 0%, transparent 65%)" }} />

      <div style={{ ...fadeUp(frame, 0), display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
        <span style={{ fontSize: 22, fontWeight: 600, letterSpacing: 4, textTransform: "uppercase", color: DIM2 }}>step 3</span>
        <span style={{ fontSize: 52, fontWeight: 800, color: INK, letterSpacing: -2, textAlign: "center" }}>watch it in real time.</span>
      </div>

      <div style={{ opacity: phoneOp, transform: `scale(${phoneScale})`, display: "flex" }}>
        <PhoneMockup src={staticFile("fix-card-slide.png")} width={340} />
      </div>

      <div style={{ ...fadeUp(frame, 20), display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
        <span style={{ fontSize: 26, color: DIM, fontWeight: 500, textAlign: "center", letterSpacing: -0.5 }}>
          your intensity. your notes. your timeline.
        </span>
        <span style={{ fontSize: 26, color: TEAL, fontWeight: 700, textAlign: "center", letterSpacing: -0.5 }}>
          all in one place.
        </span>
      </div>
    </AbsoluteFill>
  );
};

// ─── Scene 5: Graveyard concept (345–420f) ──────────────────────────────
const Scene5: React.FC<{ frame: number }> = ({ frame }) => {
  const faded = [
    { name: "competitive yo-yo", days: "23 days", intensity: 9 },
    { name: "sourdough", days: "14 days", intensity: 6 },
    { name: "mechanical keyboards", days: "61 days", intensity: 10 },
  ];

  return (
    <AbsoluteFill style={{ background: BG, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", fontFamily: FF, gap: 40 }}>
      <div style={{ ...fadeUp(frame, 0), display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
        <span style={{ fontSize: 22, fontWeight: 600, letterSpacing: 4, textTransform: "uppercase", color: DIM2 }}>when it fades</span>
        <span style={{ fontSize: 52, fontWeight: 800, color: INK, letterSpacing: -2 }}>the graveyard.</span>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 16, width: 760 }}>
        {faded.map((item, i) => {
          const style = fadeUp(frame, 10 + i * 8);
          return (
            <div key={i} style={{ ...style, display: "flex", alignItems: "center", justifyContent: "space-between", background: "#0F1011", borderRadius: 18, padding: "28px 36px", border: "1px solid rgba(255,255,255,0.05)" }}>
              <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                <span style={{ fontSize: 30, fontWeight: 700, color: "rgba(244,244,244,0.35)", letterSpacing: -0.5 }}>{item.name}</span>
                <span style={{ fontSize: 20, color: "rgba(244,244,244,0.2)", fontWeight: 500 }}>{item.days} · peak {item.intensity}/10</span>
              </div>
              <span style={{ fontSize: 26, color: "rgba(94,234,212,0.3)" }}>rip</span>
            </div>
          );
        })}
      </div>

      <div style={{ ...fadeUp(frame, 38), display: "flex" }}>
        <span style={{ fontSize: 28, color: DIM, fontWeight: 500, textAlign: "center", letterSpacing: -0.5 }}>
          proof that every obsession was real.
        </span>
      </div>
    </AbsoluteFill>
  );
};

// ─── Scene 6: CTA (420–480f) ─────────────────────────────────────────────
const Scene6: React.FC<{ frame: number }> = ({ frame }) => {
  const glowOp = interpolate(frame, [0, 20], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ background: BG, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", fontFamily: FF, gap: 40 }}>
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, background: "radial-gradient(ellipse 70% 55% at 50% 50%, rgba(94,234,212,0.14) 0%, transparent 65%)", opacity: glowOp }} />

      <div style={{ ...fadeUp(frame, 0), display: "flex" }}>
        <Gem size={100} />
      </div>

      <div style={{ ...fadeUp(frame, 10), display: "flex", flexDirection: "column", alignItems: "center", gap: 0 }}>
        <div style={{ display: "flex", fontFamily: "'Georgia', serif", fontSize: 96, fontWeight: 700, letterSpacing: -5, lineHeight: 0.9 }}>
          <span style={{ color: INK }}>hyper</span>
          <span style={{ color: TEAL, fontStyle: "italic" }}>fix</span>
        </div>
        <span style={{ fontFamily: "'Georgia', serif", fontSize: 96, fontWeight: 700, letterSpacing: -5, lineHeight: 0.9, color: TEAL, fontStyle: "italic" }}>.app</span>
      </div>

      <div style={{ ...fadeUp(frame, 20), display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
        <span style={{ fontSize: 30, color: DIM, fontWeight: 500, textAlign: "center", letterSpacing: -0.5 }}>
          free to use. link in bio.
        </span>
        <div style={{ display: "flex", padding: "20px 52px", background: TEAL, borderRadius: 100 }}>
          <span style={{ fontSize: 28, fontWeight: 800, color: BG, letterSpacing: -0.5 }}>track your fixations</span>
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ─── FadeIn overlay between scenes ───────────────────────────────────────
const FadeIn: React.FC<{ frame: number }> = ({ frame }) => {
  const op = interpolate(frame, [0, 10], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  if (op <= 0) return null;
  return <div style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, background: "#080808", opacity: op, pointerEvents: "none" }} />;
};

// ─── Main composition ─────────────────────────────────────────────────────
// Total: 480f = 16s @ 30fps
// Scene 1: 0–75    (2.5s) hook
// Scene 2: 75–165  (3s)   naming
// Scene 3: 165–255 (3s)   intensity
// Scene 4: 255–345 (3s)   phone mockup
// Scene 5: 345–420 (2.5s) graveyard
// Scene 6: 420–480 (2s)   CTA

export const AppDemo: React.FC = () => {
  const frame = useCurrentFrame();

  return (
    <AbsoluteFill style={{ background: BG }}>
      <Sequence from={0} durationInFrames={75}>
        <Scene1 frame={frame} />
        <FadeIn frame={frame} />
      </Sequence>
      <Sequence from={75} durationInFrames={90}>
        <Scene2 frame={frame - 75} />
        <FadeIn frame={frame - 75} />
      </Sequence>
      <Sequence from={165} durationInFrames={90}>
        <Scene3 frame={frame - 165} />
        <FadeIn frame={frame - 165} />
      </Sequence>
      <Sequence from={255} durationInFrames={90}>
        <Scene4 frame={frame - 255} />
        <FadeIn frame={frame - 255} />
      </Sequence>
      <Sequence from={345} durationInFrames={75}>
        <Scene5 frame={frame - 345} />
        <FadeIn frame={frame - 345} />
      </Sequence>
      <Sequence from={420} durationInFrames={60}>
        <Scene6 frame={frame - 420} />
        <FadeIn frame={frame - 420} />
      </Sequence>
    </AbsoluteFill>
  );
};
