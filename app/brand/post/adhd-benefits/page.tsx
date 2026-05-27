import type { Metadata } from "next";
import { Fraunces, Instrument_Sans } from "next/font/google";

export const metadata: Metadata = {
  title: "Hyperfix — ADHD Benefits Slides",
  robots: { index: false, follow: false },
};

const fraunces = Fraunces({
  subsets: ["latin"],
  weight: ["400", "600", "700", "900"],
  display: "swap",
  variable: "--font-display",
});
const sans = Instrument_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
  variable: "--font-sans",
});

// ── Cartoon brain mascot ─────────────────────────────────────────────────────
// Each mood changes the expression. bodyBg should match the slide BG.

function Brain({
  mood = "happy",
  accent = "#A78BFA",
  bodyBg = "#1A0B30",
  size = 360,
}: {
  mood?: "happy" | "excited" | "wow" | "determined" | "smug";
  accent?: string;
  bodyBg?: string;
  size?: number;
}) {
  const h = Math.round(size * 1.15);
  return (
    <svg width={size} height={h} viewBox="0 0 320 368" fill="none">
      {/* Soft glow */}
      <circle cx="160" cy="155" r="130" fill={accent} opacity="0.13" />

      {/* Brain body — filled circle */}
      <circle cx="160" cy="158" r="112" fill={bodyBg} stroke={accent} strokeWidth="5" />

      {/* Top brain bumps (decorative, drawn inside circle) */}
      <path
        d="M 88 88 Q 104 64 124 80 Q 138 58 158 70 Q 178 56 194 80 Q 214 64 232 88"
        fill="none"
        stroke={accent}
        strokeWidth="4.5"
        strokeLinecap="round"
      />
      {/* Centre divide */}
      <line x1="158" y1="58" x2="158" y2="86" stroke={accent} strokeWidth="3.5" strokeLinecap="round" />

      {/* Fold lines */}
      <path
        d="M 62 120 Q 112 100 158 116 Q 204 132 258 120"
        fill="none"
        stroke={accent}
        strokeWidth="3.5"
        strokeLinecap="round"
      />
      <path
        d="M 58 155 Q 110 138 158 154 Q 206 170 262 155"
        fill="none"
        stroke={accent}
        strokeWidth="3"
        strokeLinecap="round"
      />

      {/* Rosy cheeks */}
      <ellipse cx="96"  cy="196" rx="26" ry="16" fill="#F472B6" opacity="0.28" />
      <ellipse cx="224" cy="196" rx="26" ry="16" fill="#F472B6" opacity="0.28" />

      {/* Eyes — big cartoon circles */}
      <circle cx="124" cy="180" r="23" fill="white" stroke={accent} strokeWidth="2.5" />
      <circle cx="196" cy="180" r="23" fill="white" stroke={accent} strokeWidth="2.5" />

      {/* Pupils */}
      {mood === "smug" ? (
        /* wink left eye */
        <>
          <path d="M 106 180 Q 124 170 142 180" stroke="#111" strokeWidth="4.5" strokeLinecap="round" fill="none" />
          <circle cx="196" cy="182" r="14" fill="#111" />
          <circle cx="202" cy="176" r="5.5" fill="white" />
          <circle cx="193" cy="185" r="2.5" fill="white" />
        </>
      ) : (
        <>
          <circle cx={mood === "wow" ? 120 : 126} cy="183" r="14" fill="#111" />
          <circle cx={mood === "wow" ? 192 : 198} cy="183" r="14" fill="#111" />
          <circle cx={mood === "wow" ? 124 : 130} cy="177" r="5.5" fill="white" />
          <circle cx={mood === "wow" ? 196 : 202} cy="177" r="5.5" fill="white" />
          <circle cx={mood === "wow" ? 117 : 123} cy="187" r="2.5" fill="white" />
          <circle cx={mood === "wow" ? 189 : 195} cy="187" r="2.5" fill="white" />
        </>
      )}

      {/* Brows for wow/determined */}
      {mood === "wow" && (
        <>
          <path d="M 106 160 Q 122 151 138 158" stroke={accent} strokeWidth="3.5" strokeLinecap="round" fill="none" />
          <path d="M 178 158 Q 194 149 210 156" stroke={accent} strokeWidth="3.5" strokeLinecap="round" fill="none" />
        </>
      )}
      {mood === "determined" && (
        <>
          <path d="M 106 163 Q 124 154 142 162" stroke={accent} strokeWidth="4" strokeLinecap="round" fill="none" />
          <path d="M 174 162 Q 192 153 210 161" stroke={accent} strokeWidth="4" strokeLinecap="round" fill="none" />
        </>
      )}

      {/* Mouth */}
      {mood === "happy" && (
        <path d="M 122 215 Q 160 240 198 215" stroke={accent} strokeWidth="5.5" strokeLinecap="round" fill="none" />
      )}
      {mood === "excited" && (
        <>
          <ellipse cx="160" cy="220" rx="28" ry="18" fill={accent} opacity="0.9" />
          <ellipse cx="160" cy="224" rx="18" ry="11" fill="#111" />
          <text x="258" y="86"  fontSize="34" fill={accent}>✦</text>
          <text x="22"  y="92"  fontSize="28" fill={accent}>✦</text>
          <text x="268" y="206" fontSize="22" fill={accent}>✦</text>
          <text x="14"  y="212" fontSize="18" fill={accent}>✦</text>
        </>
      )}
      {mood === "wow" && (
        <>
          <ellipse cx="160" cy="220" rx="22" ry="18" fill={accent} opacity="0.85" />
          <ellipse cx="160" cy="222" rx="14" ry="11" fill="#111" />
        </>
      )}
      {mood === "determined" && (
        <>
          <path d="M 130 216 Q 160 232 190 216" stroke={accent} strokeWidth="5" strokeLinecap="round" fill="none" />
          {/* Lightning bolt */}
          <text x="252" y="80" fontSize="42" fill={accent}>⚡</text>
        </>
      )}
      {mood === "smug" && (
        <path d="M 135 218 Q 158 232 184 214" stroke={accent} strokeWidth="5.5" strokeLinecap="round" fill="none" />
      )}

      {/* Arms */}
      <rect
        x="22" y="142" width="30" height="72" rx="15"
        fill={bodyBg} stroke={accent} strokeWidth="4"
        transform="rotate(-14 37 178)"
      />
      <rect
        x="268" y="142" width="30" height="72" rx="15"
        fill={bodyBg} stroke={accent} strokeWidth="4"
        transform="rotate(14 283 178)"
      />

      {/* Legs */}
      <rect x="104" y="262" width="44" height="74" rx="22" fill={bodyBg} stroke={accent} strokeWidth="4" />
      <rect x="172" y="262" width="44" height="74" rx="22" fill={bodyBg} stroke={accent} strokeWidth="4" />
    </svg>
  );
}

// ── Simple phone frame ────────────────────────────────────────────────────────

function Phone({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        width: 330,
        height: 660,
        borderRadius: 46,
        border: "3px solid rgba(255,255,255,0.18)",
        background: "#0C0D0F",
        overflow: "hidden",
        position: "relative",
        flexShrink: 0,
        boxShadow:
          "0 28px 90px rgba(0,0,0,0.88), 0 0 0 1px rgba(255,255,255,0.06) inset",
      }}
    >
      {/* Dynamic island */}
      <div
        style={{
          position: "absolute",
          top: 12,
          left: "50%",
          transform: "translateX(-50%)",
          width: 96,
          height: 26,
          background: "#000",
          borderRadius: 18,
          zIndex: 20,
        }}
      />
      {/* Status bar */}
      <div
        style={{
          position: "absolute",
          top: 0, left: 0, right: 0,
          height: 48,
          display: "flex",
          alignItems: "flex-end",
          justifyContent: "space-between",
          padding: "0 22px 7px",
          zIndex: 15,
        }}
      >
        <span style={{ fontFamily: "monospace", fontSize: 11, fontWeight: 700, color: "rgba(255,255,255,0.6)" }}>
          9:41
        </span>
        <svg width="38" height="11" viewBox="0 0 38 11" fill="none">
          <rect x="0" y="4" width="2.5" height="7" rx="0.5" fill="rgba(255,255,255,0.6)" />
          <rect x="4" y="2.5" width="2.5" height="8.5" rx="0.5" fill="rgba(255,255,255,0.6)" />
          <rect x="8" y="0.5" width="2.5" height="10.5" rx="0.5" fill="rgba(255,255,255,0.6)" />
          <rect x="14" y="0.5" width="20" height="10" rx="2.5" stroke="rgba(255,255,255,0.55)" strokeWidth="1.1" />
          <rect x="34.2" y="3" width="3" height="5" rx="1" fill="rgba(255,255,255,0.4)" />
          <rect x="15.5" y="2" width="15" height="7" rx="1.5" fill="rgba(255,255,255,0.6)" />
        </svg>
      </div>
      {/* Screen */}
      <div style={{ position: "absolute", top: 48, left: 0, right: 0, bottom: 0 }}>
        {children}
      </div>
    </div>
  );
}

// ── Logo lockup ───────────────────────────────────────────────────────────────

function Logo({ color = "rgba(255,255,255,0.5)" }: { color?: string }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
      <svg width="22" height="22" viewBox="0 0 64 64">
        <rect width="64" height="64" rx="14" fill="rgba(255,255,255,0.08)" />
        <path d="M14 40 L32 20 L50 40 L42 40 L32 28 L22 40 Z" fill={color} />
        <path d="M14 50 L32 30 L50 50 L42 50 L32 38 L22 50 Z" fill={color} opacity="0.7" />
      </svg>
      <span
        style={{
          fontFamily: "var(--font-display)",
          fontSize: 13,
          fontWeight: 600,
          color,
          letterSpacing: "-0.02em",
        }}
      >
        hyperfix.app
      </span>
    </div>
  );
}

// ── Phone screens ─────────────────────────────────────────────────────────────

function HyperfocusScreen({ accent }: { accent: string }) {
  return (
    <div style={{ padding: "14px 18px", color: "#F4F4F4", fontFamily: "var(--font-sans)" }}>
      <div style={{ display: "flex", gap: 7, marginBottom: 16 }}>
        <span style={{ fontSize: 10, padding: "3px 10px", borderRadius: 999, background: "rgba(167,139,250,0.14)", border: "1px solid rgba(167,139,250,0.3)", color: accent }}>music</span>
        <span style={{ fontSize: 10, padding: "3px 10px", borderRadius: 999, background: "rgba(167,139,250,0.10)", border: "1px solid rgba(167,139,250,0.24)", color: accent }}>active</span>
      </div>
      <p style={{ fontFamily: "var(--font-display)", fontSize: 15, fontWeight: 600, marginBottom: 20 }}>Mitski — all of it</p>
      <div style={{ textAlign: "center", padding: "18px 0 22px" }}>
        <p style={{ fontFamily: "var(--font-display)", fontSize: 108, fontWeight: 700, color: accent, letterSpacing: "-0.06em", lineHeight: 1 }}>112</p>
        <p style={{ fontSize: 12, color: "rgba(255,255,255,0.4)", textTransform: "uppercase", letterSpacing: "0.14em", marginTop: 6 }}>days straight</p>
      </div>
      <div style={{ height: 8, background: "rgba(255,255,255,0.07)", borderRadius: 999, marginBottom: 14, overflow: "hidden" }}>
        <div style={{ width: "78%", height: "100%", background: accent, borderRadius: 999, opacity: 0.7 }} />
      </div>
      <p style={{ fontFamily: "var(--font-display)", fontSize: 13, color: "rgba(255,255,255,0.35)", textAlign: "center" }}>started Jan 4</p>
    </div>
  );
}

function CreativityScreen({ accent }: { accent: string }) {
  const fixes = [
    { label: "Severance s2", cat: "show",    color: "#60A5FA" },
    { label: "Phoebe Bridgers", cat: "music", color: "#F472B6" },
    { label: "Normal People", cat: "book",   color: "#FB923C" },
    { label: "Fleabag",      cat: "show",    color: "#60A5FA" },
    { label: "Chappell Roan", cat: "music",  color: "#F472B6" },
  ];
  return (
    <div style={{ padding: "14px 18px", color: "#F4F4F4", fontFamily: "var(--font-sans)" }}>
      <p style={{ fontFamily: "var(--font-display)", fontSize: 14, fontWeight: 600, marginBottom: 16, color: "rgba(255,255,255,0.7)" }}>your fixations</p>
      <div style={{ display: "flex", flexDirection: "column", gap: 9 }}>
        {fixes.map((f, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, background: "rgba(255,255,255,0.05)", borderRadius: 12, padding: "10px 14px", border: "1px solid rgba(255,255,255,0.07)" }}>
            <div style={{ width: 8, height: 8, borderRadius: 999, background: f.color, flexShrink: 0 }} />
            <p style={{ fontSize: 13, fontWeight: 500, flex: 1 }}>{f.label}</p>
            <span style={{ fontSize: 10, color: "rgba(255,255,255,0.35)" }}>{f.cat}</span>
          </div>
        ))}
      </div>
      <div style={{ marginTop: 16, background: "rgba(52,211,153,0.08)", border: `1px solid rgba(52,211,153,0.22)`, borderRadius: 12, padding: "10px 14px", textAlign: "center" }}>
        <p style={{ fontSize: 12, color: accent, fontWeight: 600 }}>5 obsessions. 0 regrets.</p>
      </div>
    </div>
  );
}

function PassionScreen({ accent }: { accent: string }) {
  return (
    <div style={{ padding: "14px 18px", color: "#F4F4F4", fontFamily: "var(--font-sans)" }}>
      <p style={{ fontFamily: "var(--font-display)", fontSize: 14, fontWeight: 600, marginBottom: 4, color: "rgba(255,255,255,0.65)" }}>Interview With the Vampire</p>
      <p style={{ fontSize: 11, color: "rgba(255,255,255,0.35)", marginBottom: 20 }}>71 days · show</p>
      {/* Intensity */}
      <div style={{ background: "rgba(255,255,255,0.05)", borderRadius: 14, padding: "14px 16px", marginBottom: 12 }}>
        <p style={{ fontSize: 10, color: "rgba(255,255,255,0.38)", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 8 }}>intensity</p>
        <div style={{ display: "flex", alignItems: "baseline", gap: 5, marginBottom: 8 }}>
          <span style={{ fontFamily: "var(--font-display)", fontSize: 62, fontWeight: 700, color: accent, letterSpacing: "-0.05em", lineHeight: 1 }}>10</span>
          <span style={{ fontSize: 18, color: "rgba(255,255,255,0.3)" }}>/10</span>
        </div>
        <span style={{ fontSize: 12, color: accent, background: "rgba(244,114,182,0.12)", border: "1px solid rgba(244,114,182,0.28)", borderRadius: 999, padding: "3px 12px", fontWeight: 600 }}>send help</span>
      </div>
      {/* Eulogy preview */}
      <div style={{ background: "rgba(244,114,182,0.06)", border: "1px solid rgba(244,114,182,0.18)", borderRadius: 14, padding: "13px 15px" }}>
        <p style={{ fontSize: 12, color: "rgba(255,255,255,0.65)", fontStyle: "italic", lineHeight: 1.7 }}>
          &ldquo;this show rearranged something inside me. i&apos;ll never be the same.&rdquo;
        </p>
      </div>
    </div>
  );
}

function PressureScreen({ accent }: { accent: string }) {
  return (
    <div style={{ padding: "14px 18px", color: "#F4F4F4", fontFamily: "var(--font-sans)" }}>
      <p style={{ fontFamily: "var(--font-display)", fontSize: 14, fontWeight: 600, marginBottom: 18, color: "rgba(255,255,255,0.65)" }}>check-in streak</p>
      {/* Heatmap */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: 5, marginBottom: 20 }}>
        {Array.from({ length: 49 }).map((_, i) => (
          <div key={i} style={{
            width: 18, height: 18, borderRadius: 5,
            background: i < 44
              ? (i % 3 === 0 ? `${accent}50` : `${accent}90`)
              : "rgba(255,255,255,0.07)",
          }} />
        ))}
      </div>
      <div style={{ background: "rgba(255,255,255,0.05)", borderRadius: 14, padding: "14px 16px", marginBottom: 10 }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
          <p style={{ fontSize: 11, color: "rgba(255,255,255,0.4)" }}>current streak</p>
          <p style={{ fontSize: 11, color: accent, fontWeight: 600 }}>44 days</p>
        </div>
        <div style={{ height: 7, background: "rgba(255,255,255,0.07)", borderRadius: 999, overflow: "hidden" }}>
          <div style={{ width: "89%", height: "100%", background: accent, borderRadius: 999, opacity: 0.7 }} />
        </div>
      </div>
      <div style={{ textAlign: "center", padding: "8px 0" }}>
        <span style={{ fontSize: 12, color: accent, fontWeight: 600 }}>✓ logged today</span>
      </div>
    </div>
  );
}

function ControversialScreen({ accent }: { accent: string }) {
  return (
    <div style={{ padding: "14px 18px", color: "#F4F4F4", fontFamily: "var(--font-sans)" }}>
      <p style={{ fontFamily: "var(--font-display)", fontSize: 13, fontWeight: 600, marginBottom: 16, color: "rgba(255,255,255,0.5)" }}>your obsessions, documented</p>
      {[
        { title: "Severance s2", days: 34, ended: false },
        { title: "Taylor Swift — TTPD", days: 139, ended: false },
        { title: "Chappell Roan", days: 88, ended: true },
        { title: "Heartstopper", days: 55, ended: true },
        { title: "Mitski — all of it", days: 112, ended: true },
      ].map((f, i) => (
        <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, padding: "9px 0", borderBottom: i < 4 ? "1px solid rgba(255,255,255,0.06)" : "none" }}>
          <div style={{ width: 7, height: 7, borderRadius: 999, background: f.ended ? "rgba(255,255,255,0.2)" : accent, flexShrink: 0 }} />
          <p style={{ fontSize: 12, fontWeight: 500, flex: 1, color: f.ended ? "rgba(255,255,255,0.38)" : "#F4F4F4" }}>{f.title}</p>
          <p style={{ fontFamily: "var(--font-display)", fontSize: 14, fontWeight: 600, color: f.ended ? "rgba(255,255,255,0.22)" : accent }}>{f.days}d</p>
        </div>
      ))}
      <div style={{ marginTop: 14, background: `rgba(56,189,248,0.09)`, border: `1px solid rgba(56,189,248,0.22)`, borderRadius: 12, padding: "9px 14px", textAlign: "center" }}>
        <p style={{ fontSize: 11, color: accent, fontWeight: 600 }}>428 total days. 0 apologies.</p>
      </div>
    </div>
  );
}

// ── Slide wrapper ─────────────────────────────────────────────────────────────

function Slide({
  bg,
  bloom,
  number,
  numberColor,
  topLines,
  phone,
  brain,
  bottomLines,
  logoColor,
}: {
  bg: string;
  bloom: string;
  number: string;
  numberColor: string;
  topLines: React.ReactNode;
  phone: React.ReactNode;
  brain: React.ReactNode;
  bottomLines: React.ReactNode;
  logoColor?: string;
}) {
  return (
    <div
      style={{
        width: 1080,
        height: 1920,
        background: bg,
        position: "relative",
        overflow: "hidden",
        color: "#F4F4F4",
      }}
    >
      {/* Bloom circle */}
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -40%)",
          width: 900,
          height: 900,
          borderRadius: "50%",
          background: bloom,
          pointerEvents: "none",
        }}
      />

      {/* Slide number chip */}
      <div
        style={{
          position: "absolute",
          top: 72,
          right: 80,
          fontFamily: "var(--font-sans)",
          fontSize: 13,
          fontWeight: 700,
          color: numberColor,
          background: `${numberColor}18`,
          border: `1px solid ${numberColor}38`,
          borderRadius: 999,
          padding: "5px 16px",
          letterSpacing: "0.08em",
        }}
      >
        {number}
      </div>

      {/* Top text block */}
      <div
        style={{
          position: "absolute",
          top: 72,
          left: 80,
          right: 200,
        }}
      >
        {topLines}
      </div>

      {/* Middle: phone + brain */}
      <div
        style={{
          position: "absolute",
          top: 540,
          left: 0,
          right: 0,
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "center",
          gap: 0,
          paddingLeft: 44,
        }}
      >
        {phone}
        <div style={{ marginLeft: -14, marginTop: 40 }}>{brain}</div>
      </div>

      {/* Bottom text block */}
      <div
        style={{
          position: "absolute",
          bottom: 100,
          left: 80,
          right: 80,
        }}
      >
        {bottomLines}
      </div>

      {/* Logo */}
      <div style={{ position: "absolute", bottom: 50, left: "50%", transform: "translateX(-50%)" }}>
        <Logo color={logoColor} />
      </div>
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function AdhdBenefits() {
  const cls = `${fraunces.variable} ${sans.variable}`;

  // Colours per slide
  const PURPLE = "#A78BFA";
  const GREEN  = "#34D399";
  const PINK   = "#F472B6";
  const ORANGE = "#FB923C";
  const CYAN   = "#38BDF8";

  const topStyle = (size: number, color = "#F4F4F4"): React.CSSProperties => ({
    fontFamily: "var(--font-display)",
    fontSize: size,
    fontWeight: 700,
    letterSpacing: "-0.03em",
    lineHeight: 1.06,
    color,
  });

  const bottomStyle = (size: number, color = "#F4F4F4"): React.CSSProperties => ({
    fontFamily: "var(--font-display)",
    fontSize: size,
    fontWeight: 700,
    letterSpacing: "-0.03em",
    lineHeight: 1.06,
    color,
  });

  return (
    <div className={cls} style={{ background: "#020202", display: "flex", flexDirection: "column", gap: 6 }}>

      {/* ══ SLIDE 1 — Hyperfocus ══ */}
      <Slide
        bg="#100720"
        bloom="radial-gradient(ellipse, rgba(167,139,250,0.18) 0%, transparent 68%)"
        number="01 / 05"
        numberColor={PURPLE}
        logoColor={`${PURPLE}80`}
        topLines={
          <>
            <p style={{ fontFamily: "var(--font-sans)", fontSize: 14, textTransform: "uppercase", letterSpacing: "0.2em", color: `${PURPLE}CC`, marginBottom: 22 }}>
              benefit #1
            </p>
            <h1 style={topStyle(72)}>
              When your ADHD<br />
              brain locks onto<br />
              <span style={{ color: PURPLE }}>something it likes...</span>
            </h1>
          </>
        }
        phone={<Phone><HyperfocusScreen accent={PURPLE} /></Phone>}
        brain={<Brain mood="excited" accent={PURPLE} bodyBg="#1A0B30" size={370} />}
        bottomLines={
          <h2 style={bottomStyle(68)}>
            It will not stop<br />
            for<span style={{ color: PURPLE }}> 112 days.</span>
          </h2>
        }
      />

      {/* ══ SLIDE 2 — Creativity ══ */}
      <Slide
        bg="#041A12"
        bloom="radial-gradient(ellipse, rgba(52,211,153,0.17) 0%, transparent 68%)"
        number="02 / 05"
        numberColor={GREEN}
        logoColor={`${GREEN}80`}
        topLines={
          <>
            <p style={{ fontFamily: "var(--font-sans)", fontSize: 14, textTransform: "uppercase", letterSpacing: "0.2em", color: `${GREEN}CC`, marginBottom: 22 }}>
              benefit #2
            </p>
            <h1 style={topStyle(72)}>
              Your brain doesn&apos;t<br />
              think in straight<br />
              <span style={{ color: GREEN }}>lines.</span>
            </h1>
          </>
        }
        phone={<Phone><CreativityScreen accent={GREEN} /></Phone>}
        brain={<Brain mood="wow" accent={GREEN} bodyBg="#061E14" size={370} />}
        bottomLines={
          <h2 style={bottomStyle(62)}>
            It thinks in webs, tangents,<br />
            and connections<br />
            <span style={{ color: GREEN }}>most people never reach.</span>
          </h2>
        }
      />

      {/* ══ SLIDE 3 — Emotional depth ══ */}
      <Slide
        bg="#1C0518"
        bloom="radial-gradient(ellipse, rgba(244,114,182,0.18) 0%, transparent 68%)"
        number="03 / 05"
        numberColor={PINK}
        logoColor={`${PINK}80`}
        topLines={
          <>
            <p style={{ fontFamily: "var(--font-sans)", fontSize: 14, textTransform: "uppercase", letterSpacing: "0.2em", color: `${PINK}CC`, marginBottom: 22 }}>
              benefit #3
            </p>
            <h1 style={topStyle(72)}>
              You feel things at<br />
              a volume most<br />
              <span style={{ color: PINK }}>people never reach.</span>
            </h1>
          </>
        }
        phone={<Phone><PassionScreen accent={PINK} /></Phone>}
        brain={<Brain mood="happy" accent={PINK} bodyBg="#220618" size={370} />}
        bottomLines={
          <h2 style={bottomStyle(66)}>
            That&apos;s not<br />
            &ldquo;too much.&rdquo;<br />
            <span style={{ color: PINK }}>That&apos;s depth.</span>
          </h2>
        }
      />

      {/* ══ SLIDE 4 — Thriving under pressure ══ */}
      <Slide
        bg="#180A02"
        bloom="radial-gradient(ellipse, rgba(251,146,60,0.17) 0%, transparent 68%)"
        number="04 / 05"
        numberColor={ORANGE}
        logoColor={`${ORANGE}80`}
        topLines={
          <>
            <p style={{ fontFamily: "var(--font-sans)", fontSize: 14, textTransform: "uppercase", letterSpacing: "0.2em", color: `${ORANGE}CC`, marginBottom: 22 }}>
              benefit #4
            </p>
            <h1 style={topStyle(72)}>
              When everyone<br />
              else panics at a<br />
              <span style={{ color: ORANGE }}>deadline...</span>
            </h1>
          </>
        }
        phone={<Phone><PressureScreen accent={ORANGE} /></Phone>}
        brain={<Brain mood="determined" accent={ORANGE} bodyBg="#1E0D02" size={370} />}
        bottomLines={
          <h2 style={bottomStyle(64)}>
            Your brain finally<br />
            shifts into the gear<br />
            <span style={{ color: ORANGE }}>it was built for.</span>
          </h2>
        }
      />

      {/* ══ SLIDE 5 — Controversial ══ */}
      <Slide
        bg="#040E1C"
        bloom="radial-gradient(ellipse, rgba(56,189,248,0.16) 0%, transparent 68%)"
        number="hot take"
        numberColor={CYAN}
        logoColor={`${CYAN}80`}
        topLines={
          <>
            <p style={{ fontFamily: "var(--font-sans)", fontSize: 14, textTransform: "uppercase", letterSpacing: "0.2em", color: `${CYAN}CC`, marginBottom: 22 }}>
              benefit #5 · controversial
            </p>
            <h1 style={topStyle(68)}>
              ADHD isn&apos;t a<br />
              deficit of attention.<br />
              <span style={{ color: CYAN }}>It&apos;s an excess of it.</span>
            </h1>
          </>
        }
        phone={<Phone><ControversialScreen accent={CYAN} /></Phone>}
        brain={<Brain mood="smug" accent={CYAN} bodyBg="#050F1E" size={370} />}
        bottomLines={
          <h2 style={bottomStyle(60)}>
            Just aimed at whatever<br />
            your brain decided<br />
            <span style={{ color: CYAN }}>actually matters.</span>
          </h2>
        }
      />

    </div>
  );
}
