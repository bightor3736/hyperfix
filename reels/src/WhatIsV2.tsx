import React from "react";
import {
  AbsoluteFill,
  Easing,
  Sequence,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

const FF = "'Helvetica Neue', Liberation Sans, Arial, sans-serif";

const BG = "#080808";
const INK = "#F4F4F4";
const TEAL = "#5EEAD4";
const TEAL_BG = "#0A2E2B";
const DIM = "rgba(244,244,244,0.45)";
const CARD = "#111113";

// ─── spring helpers ───────────────────────────────────────────────────
const usePop = (frame: number, fps: number, delay = 0, damping = 10, stiffness = 200) =>
  spring({ frame: frame - delay, fps, config: { damping, stiffness }, durationInFrames: 30 });

const useSlam = (frame: number, fps: number, delay = 0) =>
  spring({ frame: frame - delay, fps, config: { damping: 7, stiffness: 300 }, durationInFrames: 20 });

// ─── gem mark ─────────────────────────────────────────────────────────
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

// ─── illustrated icons ────────────────────────────────────────────────

// Blob brain with sparks
const BrainIllo: React.FC<{ frame: number }> = ({ frame }) => {
  const rot = interpolate(frame, [0, 30], [0, 8], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) *
    Math.sin(frame * 0.4);
  const spark1 = interpolate(frame, [5, 20], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) });
  const spark2 = interpolate(frame, [10, 25], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) });
  return (
    <svg width={220} height={220} viewBox="0 0 220 220" fill="none" style={{ transform: `rotate(${rot}deg)` }}>
      {/* blob brain */}
      <path
        d="M110 40 C145 40 175 60 178 90 C182 115 165 130 168 148 C172 170 155 185 130 188 C118 190 110 182 110 182 C110 182 102 190 90 188 C65 185 48 170 52 148 C55 130 38 115 42 90 C45 60 75 40 110 40Z"
        fill={TEAL}
        opacity={0.9}
      />
      {/* brain split line */}
      <path d="M110 50 C110 50 108 100 110 182" stroke="rgba(0,0,0,0.2)" strokeWidth={3} fill="none" />
      {/* left lobe wrinkle */}
      <path d="M72 80 C65 90 68 105 75 112" stroke="rgba(0,0,0,0.15)" strokeWidth={2.5} fill="none" strokeLinecap="round" />
      <path d="M60 100 C58 115 65 125 72 128" stroke="rgba(0,0,0,0.15)" strokeWidth={2.5} fill="none" strokeLinecap="round" />
      {/* right lobe wrinkle */}
      <path d="M148 80 C155 90 152 105 145 112" stroke="rgba(0,0,0,0.15)" strokeWidth={2.5} fill="none" strokeLinecap="round" />
      <path d="M160 100 C162 115 155 125 148 128" stroke="rgba(0,0,0,0.15)" strokeWidth={2.5} fill="none" strokeLinecap="round" />

      {/* spark 1 — top right */}
      <g opacity={spark1} transform={`translate(${185 + spark1 * 18}, ${38 - spark1 * 22})`}>
        <path d="M0 -14 L3 -4 L13 -4 L5 2 L8 12 L0 6 L-8 12 L-5 2 L-13 -4 L-3 -4 Z" fill={INK} />
      </g>
      {/* spark 2 — left */}
      <g opacity={spark2} transform={`translate(${22 - spark2 * 20}, ${95 - spark2 * 10})`}>
        <path d="M0 -11 L2.5 -3 L11 -3 L4 2 L6 10 L0 5 L-6 10 L-4 2 L-11 -3 L-2.5 -3 Z" fill={TEAL} />
      </g>
      {/* spark 3 — bottom right */}
      <g opacity={spark1 * 0.7} transform={`translate(${188 + spark1 * 12}, ${170 + spark1 * 14})`}>
        <path d="M0 -9 L2 -2.5 L9 -2.5 L3 1.5 L5 8 L0 4 L-5 8 L-3 1.5 L-9 -2.5 L-2 -2.5 Z" fill={INK} />
      </g>

      {/* eyes — circles */}
      <circle cx="88" cy="118" r="8" fill="rgba(0,0,0,0.18)" />
      <circle cx="132" cy="118" r="8" fill="rgba(0,0,0,0.18)" />
      <circle cx="88" cy="118" r="4" fill="rgba(0,0,0,0.4)" />
      <circle cx="132" cy="118" r="4" fill="rgba(0,0,0,0.4)" />
    </svg>
  );
};

// Stack of browser tabs
const TabsIllo: React.FC = () => (
  <svg width={200} height={180} viewBox="0 0 200 180" fill="none">
    {/* back tab */}
    <rect x="30" y="10" width="150" height="100" rx="12" fill="#1A1A20" stroke="rgba(244,244,244,0.1)" strokeWidth={1.5} />
    <rect x="30" y="10" width="70" height="28" rx="8" fill="#252530" />
    <circle cx="90" cy="24" r="6" fill="#444" />

    {/* mid tab */}
    <rect x="18" y="30" width="150" height="100" rx="12" fill="#222228" stroke="rgba(244,244,244,0.12)" strokeWidth={1.5} />
    <rect x="18" y="30" width="75" height="28" rx="8" fill="#2E2E3A" />
    <circle cx="80" cy="44" r="6" fill="#555" />

    {/* front tab */}
    <rect x="6" y="50" width="150" height="105" rx="12" fill={CARD} stroke={`rgba(94,234,212,0.35)`} strokeWidth={1.5} />
    <rect x="6" y="50" width="80" height="28" rx="8" fill="#1A2828" />
    <text x="24" y="69" fontFamily={FF} fontSize="13" fontWeight="800" fill={TEAL}>hyperfix.app</text>
    {/* tab x button */}
    <circle cx="143" cy="64" r="8" fill="#1E1E24" />
    <text x="139" y="69" fontFamily={FF} fontSize="12" fill="#666">×</text>
    {/* content lines */}
    <rect x="20" y="96" width="120" height="8" rx="4" fill="rgba(244,244,244,0.08)" />
    <rect x="20" y="112" width="90" height="8" rx="4" fill="rgba(244,244,244,0.05)" />
    <rect x="20" y="128" width="105" height="8" rx="4" fill="rgba(244,244,244,0.05)" />

    {/* "x27" badge — too many tabs */}
    <rect x="126" y="6" width="52" height="28" rx="14" fill={TEAL} />
    <text x="141" y="25" fontFamily={FF} fontSize="15" fontWeight="900" fill={BG}>×27</text>
  </svg>
);

// Clock at 2am
const ClockIllo: React.FC<{ frame: number }> = ({ frame }) => {
  const tickOpacity = Math.sin(frame * 0.5) * 0.5 + 0.5;
  return (
    <svg width={180} height={180} viewBox="0 0 180 180" fill="none">
      <circle cx="90" cy="90" r="82" fill={CARD} stroke="rgba(244,244,244,0.1)" strokeWidth={2} />
      <circle cx="90" cy="90" r="76" fill="none" stroke="rgba(244,244,244,0.04)" strokeWidth={8} />
      {/* hour ticks */}
      {Array.from({ length: 12 }).map((_, i) => {
        const angle = (i * 30 - 90) * (Math.PI / 180);
        const x1 = 90 + Math.cos(angle) * 62;
        const y1 = 90 + Math.sin(angle) * 62;
        const x2 = 90 + Math.cos(angle) * 72;
        const y2 = 90 + Math.sin(angle) * 72;
        return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="rgba(244,244,244,0.2)" strokeWidth={i % 3 === 0 ? 3 : 1.5} strokeLinecap="round" />;
      })}
      {/* hour hand pointing to 2 */}
      <line x1="90" y1="90" x2="120" y2="57" stroke={INK} strokeWidth={5} strokeLinecap="round" />
      {/* minute hand pointing to 12 */}
      <line x1="90" y1="90" x2="90" y2="30" stroke={INK} strokeWidth={3.5} strokeLinecap="round" />
      {/* center dot */}
      <circle cx="90" cy="90" r="6" fill={TEAL} />
      {/* 2:00 AM label */}
      <text x="90" y="128" textAnchor="middle" fontFamily={FF} fontSize="16" fontWeight="900" fill={TEAL} letterSpacing="2">2:00 AM</text>
      {/* pulse ring */}
      <circle cx="90" cy="90" r="82" fill="none" stroke={TEAL} strokeWidth={2} opacity={tickOpacity * 0.3} />
    </svg>
  );
};

// Speech bubble with "EXPLAIN"
const ChatIllo: React.FC = () => (
  <svg width={200} height={160} viewBox="0 0 200 160" fill="none">
    <rect x="10" y="10" width="180" height="110" rx="20" fill={TEAL} />
    <path d="M40 120 L30 150 L75 120 Z" fill={TEAL} />
    <text x="100" y="58" textAnchor="middle" fontFamily={FF} fontSize="28" fontWeight="900" fill={BG}>told 4</text>
    <text x="100" y="90" textAnchor="middle" fontFamily={FF} fontSize="28" fontWeight="900" fill={BG}>people</text>
    <text x="100" y="114" textAnchor="middle" fontFamily={FF} fontSize="15" fontWeight="700" fill="rgba(8,8,8,0.55)">who didn&apos;t ask</text>
  </svg>
);

// ─── transition flash overlay ──────────────────────────────────────────
const Flash: React.FC<{ frame: number; color?: string }> = ({ frame, color = INK }) => {
  const op = interpolate(frame, [0, 4, 10], [0.9, 0.4, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        background: color,
        opacity: op,
        pointerEvents: "none",
      }}
    />
  );
};

// ─── scene 1 · HYPERFIXATION slams in (0–55f) ─────────────────────────
const S1: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const slam = useSlam(frame, fps, 0);
  const scale = interpolate(slam, [0, 1], [2.4, 1]);
  const op = interpolate(slam, [0, 1], [0, 1]);

  const sub = usePop(frame, fps, 18, 12, 180);
  const subOp = interpolate(sub, [0, 1], [0, 1]);
  const subY = interpolate(sub, [0, 1], [20, 0]);

  // bg teal glow that pulses
  const glowOp = interpolate(frame, [0, 20, 55], [0, 0.2, 0.08], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ background: BG, fontFamily: FF, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
      <div style={{ position: "absolute", inset: 0, background: `radial-gradient(circle at 50% 50%, ${TEAL} 0%, transparent 60%)`, opacity: glowOp }} />
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", transform: `scale(${scale})`, opacity: op }}>
        <span style={{ fontSize: 100, fontWeight: 900, lineHeight: 0.85, letterSpacing: -5, color: INK, textAlign: "center" }}>hyper-</span>
        <span style={{ fontSize: 100, fontWeight: 900, lineHeight: 0.85, letterSpacing: -5, color: TEAL, textAlign: "center" }}>fixation.</span>
      </div>
      <div style={{ position: "absolute", bottom: 220, opacity: subOp, transform: `translateY(${subY}px)` }}>
        <span style={{ fontSize: 28, fontWeight: 700, color: DIM, letterSpacing: 1 }}>it&apos;s not just really liking something.</span>
      </div>
      <Flash frame={frame} />
    </AbsoluteFill>
  );
};

// ─── scene 2 · normal people vs you (55–130f) ─────────────────────────
const S2: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const card1 = useSlam(frame, fps, 4);
  const card2 = useSlam(frame, fps, 22);

  const c1Y = interpolate(card1, [0, 1], [-80, 0]);
  const c2Y = interpolate(card2, [0, 1], [80, 0]);

  return (
    <AbsoluteFill style={{ background: BG, fontFamily: FF, display: "flex", flexDirection: "column", justifyContent: "center", padding: "0 72px", gap: 24 }}>
      <span style={{ fontSize: 20, fontWeight: 900, letterSpacing: 6, color: TEAL, textTransform: "uppercase", marginBottom: 12, opacity: interpolate(frame, [0, 10], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) }}>
        the difference
      </span>

      {/* normal card */}
      <div style={{ background: CARD, border: "1px solid rgba(244,244,244,0.07)", borderRadius: 24, padding: "36px 40px", transform: `translateY(${c1Y}px)`, opacity: card1 }}>
        <span style={{ display: "block", fontSize: 17, fontWeight: 900, letterSpacing: 5, color: DIM, textTransform: "uppercase", marginBottom: 14 }}>normal people</span>
        <span style={{ fontSize: 48, fontWeight: 800, lineHeight: 1.1, letterSpacing: -2, color: INK }}>find something new. enjoy it. move on.</span>
      </div>

      {/* you card */}
      <div style={{ background: TEAL_BG, border: `1.5px solid ${TEAL}`, borderRadius: 24, padding: "36px 40px", transform: `translateY(${c2Y}px)`, opacity: card2 }}>
        <span style={{ display: "block", fontSize: 17, fontWeight: 900, letterSpacing: 5, color: TEAL, textTransform: "uppercase", marginBottom: 14 }}>you</span>
        <span style={{ fontSize: 48, fontWeight: 800, lineHeight: 1.1, letterSpacing: -2, color: INK }}>restructure your entire life around it for 3 weeks then ghost it.</span>
      </div>

      <Flash frame={frame} />
    </AbsoluteFill>
  );
};

// ─── scene 3 · 3 rapid illustrated bullets (130–210f) ─────────────────
const S3: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const b1 = useSlam(frame, fps, 0);
  const b2 = useSlam(frame, fps, 20);
  const b3 = useSlam(frame, fps, 40);

  const card = (s: number) => ({
    opacity: s,
    transform: `scale(${interpolate(s, [0, 1], [0.5, 1])})`,
  });

  return (
    <AbsoluteFill style={{ background: BG, fontFamily: FF, display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", gap: 32, padding: "0 60px" }}>
      {/* clock + 2am */}
      <div style={{ display: "flex", alignItems: "center", gap: 36, ...card(b1) }}>
        <ClockIllo frame={frame} />
        <div style={{ display: "flex", flexDirection: "column" }}>
          <span style={{ fontSize: 56, fontWeight: 900, letterSpacing: -2.5, color: INK, lineHeight: 1 }}>thinking</span>
          <span style={{ fontSize: 56, fontWeight: 900, letterSpacing: -2.5, color: TEAL, lineHeight: 1 }}>at 2am</span>
        </div>
      </div>

      <div style={{ width: "100%", height: 1, background: "rgba(244,244,244,0.06)" }} />

      {/* tabs */}
      <div style={{ display: "flex", alignItems: "center", gap: 36, ...card(b2) }}>
        <TabsIllo />
        <div style={{ display: "flex", flexDirection: "column" }}>
          <span style={{ fontSize: 56, fontWeight: 900, letterSpacing: -2.5, color: INK, lineHeight: 1 }}>so many</span>
          <span style={{ fontSize: 56, fontWeight: 900, letterSpacing: -2.5, color: TEAL, lineHeight: 1 }}>tabs.</span>
        </div>
      </div>

      <div style={{ width: "100%", height: 1, background: "rgba(244,244,244,0.06)" }} />

      {/* chat */}
      <div style={{ display: "flex", alignItems: "center", gap: 36, ...card(b3) }}>
        <ChatIllo />
        <div style={{ display: "flex", flexDirection: "column" }}>
          <span style={{ fontSize: 56, fontWeight: 900, letterSpacing: -2.5, color: INK, lineHeight: 1 }}>explained</span>
          <span style={{ fontSize: 56, fontWeight: 900, letterSpacing: -2.5, color: TEAL, lineHeight: 1 }}>it. again.</span>
        </div>
      </div>

      <Flash frame={frame} />
    </AbsoluteFill>
  );
};

// ─── scene 4 · YOUR BRAIN LOCKS ON + brain illo (210–280f) ────────────
const WORDS = ["YOUR", "BRAIN", "LOCKS", "ON."];
const COLORS = [INK, INK, INK, TEAL];

const S4: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // brain wobble
  const brainScale = spring({ frame: frame - 5, fps, config: { damping: 8, stiffness: 180 }, durationInFrames: 25 });
  const brainS = interpolate(brainScale, [0, 1], [0.3, 1]);

  return (
    <AbsoluteFill style={{ background: BG, fontFamily: FF, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 0 }}>
      {/* brain illo */}
      <div style={{ transform: `scale(${brainS})`, opacity: brainScale, marginBottom: 32 }}>
        <BrainIllo frame={frame} />
      </div>

      {/* staggered words */}
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
        {WORDS.map((word, i) => {
          const s = useSlam(frame, fps, i * 12 + 8);
          const sx = interpolate(s, [0, 1], [i % 2 === 0 ? -60 : 60, 0]);
          return (
            <span
              key={word}
              style={{
                fontSize: 124,
                fontWeight: 900,
                lineHeight: 0.88,
                letterSpacing: -5,
                color: COLORS[i],
                opacity: s,
                transform: `translateX(${sx}px)`,
              }}
            >
              {word}
            </span>
          );
        })}
      </div>
      <Flash frame={frame} />
    </AbsoluteFill>
  );
};

// ─── scene 5 · NOT A FLAW / A FEATURE (280–330f) ──────────────────────
const S5: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const bgFlash = interpolate(frame, [0, 8, 20], [1, 0.7, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const line1 = useSlam(frame, fps, 6);
  const line2 = useSlam(frame, fps, 18);
  const line3 = useSlam(frame, fps, 30);
  const tag = usePop(frame, fps, 28, 14, 200);

  return (
    <AbsoluteFill style={{ background: BG, fontFamily: FF, display: "flex", flexDirection: "column", justifyContent: "center", padding: "0 72px" }}>
      {/* white flash overlay */}
      <div style={{ position: "absolute", inset: 0, background: INK, opacity: bgFlash, pointerEvents: "none" }} />

      <span style={{ fontSize: 18, fontWeight: 900, letterSpacing: 6, color: DIM, textTransform: "uppercase", marginBottom: 32, opacity: interpolate(frame, [15, 25], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) }}>
        common with ADHD + autism
      </span>
      <span style={{ fontSize: 128, fontWeight: 900, lineHeight: 0.85, letterSpacing: -5, color: INK, opacity: line1, transform: `scale(${interpolate(line1, [0, 1], [1.3, 1])})` }}>
        not
      </span>
      <span style={{ fontSize: 128, fontWeight: 900, lineHeight: 0.85, letterSpacing: -5, color: INK, opacity: line2, transform: `scale(${interpolate(line2, [0, 1], [1.3, 1])})` }}>
        a flaw.
      </span>
      <span style={{ fontSize: 128, fontWeight: 900, lineHeight: 0.88, letterSpacing: -5, color: TEAL, opacity: line3, transform: `scale(${interpolate(line3, [0, 1], [1.5, 1])})` }}>
        a feature.
      </span>
      <div style={{ marginTop: 32, opacity: tag, transform: `scale(${interpolate(tag, [0, 1], [0.8, 1])})` }}>
        <div style={{ display: "inline-flex", padding: "14px 32px", border: `1.5px solid ${TEAL}`, borderRadius: 999 }}>
          <span style={{ fontSize: 18, fontWeight: 800, color: TEAL, letterSpacing: 4, textTransform: "uppercase" }}>your brain, your rules</span>
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ─── scene 6 · fix card + counter (330–415f) ──────────────────────────
const S6: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const cardSpring = spring({ frame: frame - 4, fps, config: { damping: 9, stiffness: 150 }, durationInFrames: 30 });
  const cardY = interpolate(cardSpring, [0, 1], [120, 0]);

  const dayVal = Math.round(interpolate(frame, [20, 65], [0, 47], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }));
  const bar = interpolate(frame, [25, 72], [0, 0.87], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) });
  const glowOp = interpolate(frame, [25, 72], [0, 0.18], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  const headStyle = { opacity: cardSpring, transform: `translateY(${interpolate(cardSpring, [0, 1], [30, 0])}px)` };

  return (
    <AbsoluteFill style={{ background: BG, fontFamily: FF, display: "flex", flexDirection: "column", padding: "90px 72px" }}>
      <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 600, background: `radial-gradient(ellipse 80% 60% at 50% 100%, rgba(94,234,212,0.22) 0%, transparent 70%)`, opacity: glowOp }} />

      <div style={{ display: "flex", alignItems: "center", gap: 14, ...headStyle }}>
        <Gem size={48} />
        <span style={{ fontSize: 34, fontWeight: 800, letterSpacing: -1, color: INK }}>hyper<span style={{ color: TEAL, fontStyle: "italic" }}>fix</span></span>
      </div>

      <div style={{ marginTop: 48, ...headStyle }}>
        <span style={{ fontSize: 18, fontWeight: 900, letterSpacing: 5, color: TEAL, textTransform: "uppercase" }}>log it while it lasts</span>
        <div style={{ display: "flex", flexDirection: "column", marginTop: 12 }}>
          <span style={{ fontSize: 88, fontWeight: 900, lineHeight: 0.88, letterSpacing: -4, color: INK }}>track</span>
          <span style={{ fontSize: 88, fontWeight: 900, lineHeight: 0.88, letterSpacing: -4, color: TEAL }}>every one.</span>
        </div>
      </div>

      {/* card */}
      <div style={{ marginTop: 40, background: CARD, border: "1px solid rgba(244,244,244,0.07)", borderRadius: 24, padding: "36px 40px", opacity: cardSpring, transform: `translateY(${cardY}px)` }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <span style={{ fontSize: 36, fontWeight: 800, letterSpacing: -1.5, color: INK }}>Severance</span>
            <span style={{ fontSize: 16, fontWeight: 800, letterSpacing: 4, textTransform: "uppercase", color: DIM, marginTop: 6 }}>tv show</span>
          </div>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end" }}>
            <span style={{ fontSize: 68, fontWeight: 900, letterSpacing: -3, lineHeight: 1, color: TEAL }}>{dayVal}</span>
            <span style={{ fontSize: 13, fontWeight: 800, letterSpacing: 4, textTransform: "uppercase", color: DIM }}>days</span>
          </div>
        </div>
        <div style={{ marginTop: 24 }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
            <span style={{ fontSize: 13, fontWeight: 800, letterSpacing: 4, textTransform: "uppercase", color: DIM }}>intensity</span>
            <span style={{ fontSize: 13, fontWeight: 800, letterSpacing: 2, color: TEAL }}>{Math.round(bar * 100)}%</span>
          </div>
          <div style={{ height: 10, background: "rgba(244,244,244,0.06)", borderRadius: 999, overflow: "hidden" }}>
            <div style={{ height: "100%", width: `${bar * 100}%`, background: TEAL, borderRadius: 999, boxShadow: `0 0 16px -2px ${TEAL}88` }} />
          </div>
        </div>
      </div>
      <Flash frame={frame} />
    </AbsoluteFill>
  );
};

// ─── scene 7 · CTA (415–450f) ────────────────────────────────────────
const S7: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const gemS = spring({ frame: frame - 2, fps, config: { damping: 7, stiffness: 250 }, durationInFrames: 20 });
  const urlS = usePop(frame, fps, 12, 12, 200);
  const btnS = usePop(frame, fps, 22, 10, 180);

  return (
    <AbsoluteFill style={{ background: TEAL_BG, fontFamily: FF, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 0 }}>
      <div style={{ position: "absolute", inset: 0, background: `radial-gradient(circle at 50% 50%, rgba(94,234,212,0.18) 0%, transparent 65%)` }} />
      <div style={{ opacity: gemS, transform: `scale(${interpolate(gemS, [0, 1], [0.5, 1])}) rotate(${interpolate(gemS, [0, 1], [-20, 0])}deg)` }}>
        <Gem size={120} />
      </div>
      <div style={{ marginTop: 32, opacity: urlS, transform: `scale(${interpolate(urlS, [0, 1], [0.8, 1])})`, display: "flex", flexDirection: "column", alignItems: "center" }}>
        <span style={{ fontSize: 17, fontWeight: 900, letterSpacing: 6, color: "rgba(94,234,212,0.6)", textTransform: "uppercase", marginBottom: 12 }}>link in bio</span>
        <span style={{ fontSize: 108, fontWeight: 900, lineHeight: 0.85, letterSpacing: -5, color: INK, textAlign: "center" }}>
          hyper<span style={{ color: TEAL }}>fix</span>
        </span>
        <span style={{ fontSize: 108, fontWeight: 900, lineHeight: 0.85, letterSpacing: -5, color: TEAL, textAlign: "center" }}>.app</span>
      </div>
      <div style={{ marginTop: 40, opacity: btnS, transform: `scale(${interpolate(btnS, [0, 1], [0.7, 1])})` }}>
        <div style={{ background: TEAL, borderRadius: 999, padding: "20px 52px" }}>
          <span style={{ fontSize: 26, fontWeight: 900, color: BG, letterSpacing: -0.5 }}>free to use</span>
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ─── root ──────────────────────────────────────────────────────────────
// 450 frames = 15s @ 30fps
// S1: 0–55   S2: 55–130  S3: 130–210  S4: 210–280
// S5: 280–330  S6: 330–415  S7: 415–450

export const WhatIsV2: React.FC = () => (
  <AbsoluteFill style={{ background: BG }}>
    <Sequence from={0}   durationInFrames={55}>  <S1 /> </Sequence>
    <Sequence from={55}  durationInFrames={75}>  <S2 /> </Sequence>
    <Sequence from={130} durationInFrames={80}>  <S3 /> </Sequence>
    <Sequence from={210} durationInFrames={70}>  <S4 /> </Sequence>
    <Sequence from={280} durationInFrames={50}>  <S5 /> </Sequence>
    <Sequence from={330} durationInFrames={85}>  <S6 /> </Sequence>
    <Sequence from={415} durationInFrames={35}>  <S7 /> </Sequence>
  </AbsoluteFill>
);
