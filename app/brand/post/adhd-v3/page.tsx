import type { Metadata } from "next";
import { Instrument_Sans } from "next/font/google";

export const metadata: Metadata = {
  title: "Hyperfix — ADHD v3",
  robots: { index: false, follow: false },
};

const sans = Instrument_Sans({
  subsets: ["latin"],
  weight: ["700"],
  display: "swap",
  variable: "--font-sans",
});

// ── Shirt colour presets ──────────────────────────────────────────────────────

type ShirtSet = { base: string; light: string; dark: string };

const SHIRTS: Record<string, ShirtSet> = {
  cream:  { base: "#E8E0C6", light: "#F6F0DC", dark: "#BCBA9A" },
  yellow: { base: "#E8B828", light: "#F8D458", dark: "#B88808" },
  blue:   { base: "#4A7EC4", light: "#6A9EE4", dark: "#2A5EA4" },
  coral:  { base: "#E86E58", light: "#F89070", dark: "#C84A38" },
  green:  { base: "#44B864", light: "#64D884", dark: "#248844" },
  red:    { base: "#D84040", light: "#F06060", dark: "#A82020" },
};

// ── Guy SVG — with gradients for 3-D shading ─────────────────────────────────

function Guy({
  shirt   = "cream",
  mood    = "happy",
  size    = 620,
}: {
  shirt?: keyof typeof SHIRTS;
  mood?: "happy" | "excited" | "knowing" | "determined" | "confident";
  size?: number;
}) {
  const sc = SHIRTS[shirt];
  const h  = Math.round(size * 1.9);
  const id = `s${shirt}`;               // unique gradient id per shirt colour

  return (
    <svg width={size} height={h} viewBox="0 0 500 950" fill="none">
      <defs>
        {/* Face — radial gradient gives the sphere/3-D look */}
        <radialGradient id="g-face" cx="40%" cy="32%" r="58%">
          <stop offset="0%"   stopColor="#F5C090" />
          <stop offset="65%"  stopColor="#E8A870" />
          <stop offset="100%" stopColor="#C07848" />
        </radialGradient>

        {/* Neck / hands — same skin, slightly darker */}
        <radialGradient id="g-skin2" cx="40%" cy="32%" r="58%">
          <stop offset="0%"   stopColor="#E8A870" />
          <stop offset="100%" stopColor="#B87040" />
        </radialGradient>

        {/* Hair — radial with highlight top-left */}
        <radialGradient id="g-hair" cx="32%" cy="18%" r="68%">
          <stop offset="0%"   stopColor="#3E2412" />
          <stop offset="100%" stopColor="#0E0806" />
        </radialGradient>

        {/* Cap — left-to-right, left lighter */}
        <linearGradient id="g-cap" x1="0%" y1="0%" x2="100%" y2="60%">
          <stop offset="0%"   stopColor="#FFFFFF" />
          <stop offset="55%"  stopColor="#E8E8E4" />
          <stop offset="100%" stopColor="#C4C4BF" />
        </linearGradient>

        {/* Shirt — diagonal, left-top lighter */}
        <linearGradient id={id} x1="5%" y1="0%" x2="95%" y2="80%">
          <stop offset="0%"   stopColor={sc.light} />
          <stop offset="45%"  stopColor={sc.base}  />
          <stop offset="100%" stopColor={sc.dark}  />
        </linearGradient>

        {/* Jeans — left brighter, right darker */}
        <linearGradient id="g-jeans" x1="0%" y1="0%" x2="100%" y2="10%">
          <stop offset="0%"   stopColor="#30445E" />
          <stop offset="40%"  stopColor="#253858" />
          <stop offset="100%" stopColor="#192432" />
        </linearGradient>

        {/* Shoe — top white, bottom slightly grey */}
        <linearGradient id="g-shoe" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%"   stopColor="#FFFFFF" />
          <stop offset="100%" stopColor="#DDDBD2" />
        </linearGradient>
      </defs>

      {/* ── Ground shadow ── */}
      <ellipse cx="250" cy="945" rx="158" ry="22" fill="rgba(0,0,0,0.38)" />

      {/* ── Hair blob (sits behind head) ── */}
      <ellipse cx="250" cy="142" rx="95" ry="90" fill="url(#g-hair)" />

      {/* ── Head ── */}
      <ellipse cx="250" cy="152" rx="86" ry="92" fill="url(#g-face)" />

      {/* ── Cap ── */}
      {/* Bowl */}
      <path
        d="M 170 128 Q 172 56 250 52 Q 328 56 330 128
           Q 295 106 250 104 Q 205 106 170 128Z"
        fill="url(#g-cap)"
      />
      {/* Brim flat top face */}
      <path
        d="M 158 132 Q 250 150 342 132 L 342 144 Q 250 160 158 144Z"
        fill="#D0CEC8"
      />
      {/* Brim underside shadow */}
      <path
        d="M 160 140 Q 250 156 340 140 Q 340 152 250 156 Q 160 152 160 140Z"
        fill="rgba(0,0,0,0.22)"
      />
      {/* Cap shadow on face */}
      <path
        d="M 172 136 Q 250 158 328 136 Q 328 168 250 170 Q 172 168 172 136Z"
        fill="rgba(0,0,0,0.12)"
      />
      {/* Cap centre seam */}
      <path d="M 250 56 L 250 130" stroke="rgba(0,0,0,0.08)" strokeWidth="2" />

      {/* ── Ears ── */}
      <ellipse cx="164" cy="168" rx="13" ry="18" fill="#CC8850" />
      <ellipse cx="336" cy="168" rx="13" ry="18" fill="#CC8850" />

      {/* ── Eyes ── */}
      <ellipse cx="214" cy="172" rx="16" ry="14" fill="white" />
      <ellipse cx="286" cy="172" rx="16" ry="14" fill="white" />

      {/* Pupils & irises */}
      {mood === "confident" ? (
        /* wink right */
        <>
          <ellipse cx="217" cy="174" rx="10" ry="10" fill="#1A0A00" />
          <circle  cx="220" cy="170" r="3.5"          fill="white"   />
          <path d="M 271 170 Q 286 178 301 170"
            stroke="#1A0A00" strokeWidth="5.5" fill="none" strokeLinecap="round" />
        </>
      ) : (
        <>
          <ellipse
            cx={mood === "excited" ? 216 : 217}
            cy="174" rx="10" ry="10" fill="#1A0A00"
          />
          <circle cx={mood === "excited" ? 219 : 220} cy="170" r="3.5" fill="white" />
          <ellipse
            cx={mood === "excited" ? 288 : 289}
            cy="174" rx="10" ry="10" fill="#1A0A00"
          />
          <circle cx={mood === "excited" ? 291 : 292} cy="170" r="3.5" fill="white" />
        </>
      )}

      {/* Eyebrows */}
      {mood === "excited" ? (
        <>
          <path d="M 198 148 Q 214 140 230 147" stroke="#1C0E06" strokeWidth="5" fill="none" strokeLinecap="round" />
          <path d="M 270 147 Q 286 140 302 148" stroke="#1C0E06" strokeWidth="5" fill="none" strokeLinecap="round" />
        </>
      ) : mood === "determined" ? (
        <>
          <path d="M 196 150 Q 215 141 232 148" stroke="#1C0E06" strokeWidth="5.5" fill="none" strokeLinecap="round" />
          <path d="M 268 148 Q 285 141 304 150" stroke="#1C0E06" strokeWidth="5.5" fill="none" strokeLinecap="round" />
        </>
      ) : (
        <>
          <path d="M 198 151 Q 215 144 231 150" stroke="#1C0E06" strokeWidth="4.5" fill="none" strokeLinecap="round" />
          <path d="M 269 150 Q 285 144 302 151" stroke="#1C0E06" strokeWidth="4.5" fill="none" strokeLinecap="round" />
        </>
      )}

      {/* Nose */}
      <path
        d="M 250 184 Q 243 198 247 206 Q 250 210 253 206 Q 257 198 250 184"
        stroke="#B87040" strokeWidth="2.5" fill="rgba(180,100,50,0.12)"
      />

      {/* Rosy cheeks */}
      <ellipse cx="193" cy="204" rx="22" ry="13" fill="#F08060" opacity="0.20" />
      <ellipse cx="307" cy="204" rx="22" ry="13" fill="#F08060" opacity="0.20" />

      {/* Mouth */}
      {mood === "happy"      && <path d="M 222 226 Q 250 250 278 226" stroke="#9A5820" strokeWidth="4.5" fill="none" strokeLinecap="round" />}
      {mood === "excited"    && <><ellipse cx="250" cy="232" rx="25" ry="16" fill="white" opacity="0.90" /><ellipse cx="250" cy="236" rx="16" ry="10" fill="#C08040" /></>}
      {mood === "knowing"    && <path d="M 230 228 Q 256 244 276 224" stroke="#9A5820" strokeWidth="4.5" fill="none" strokeLinecap="round" />}
      {mood === "determined" && <path d="M 224 228 Q 250 246 276 228" stroke="#9A5820" strokeWidth="5"   fill="none" strokeLinecap="round" />}
      {mood === "confident"  && <path d="M 236 228 Q 260 244 276 224" stroke="#9A5820" strokeWidth="4.5" fill="none" strokeLinecap="round" />}

      {/* ── Neck ── */}
      <path
        d="M 228 245 L 235 290 L 265 290 L 272 245
           Q 255 255 250 255 Q 245 255 228 245Z"
        fill="#CC8850"
      />

      {/* ── Shirt body ── */}
      <path
        d="M 138 298 C 128 448 130 582 136 696
           L 364 696
           C 370 582 372 448 362 298
           C 316 274 280 267 250 267
           C 220 267 184 274 138 298Z"
        fill={`url(#${id})`}
      />
      {/* Collar shadow */}
      <path
        d="M 228 276 L 250 320 L 272 276
           C 261 270 250 268 250 268
           C 250 268 239 270 228 276Z"
        fill={sc.dark} opacity="0.85"
      />

      {/* ── Arms ── */}
      <path
        d="M 140 310 C 80 386 64 508 70 594 L 108 590
           C 104 514 112 410 150 342Z"
        fill={`url(#${id})`}
      />
      {/* Left arm inner shadow */}
      <path
        d="M 140 312 C 118 370 110 460 114 540 L 126 534
           C 122 454 128 366 150 316Z"
        fill="rgba(0,0,0,0.09)"
      />
      <path
        d="M 360 310 C 420 386 436 508 430 594 L 392 590
           C 396 514 388 410 350 342Z"
        fill={`url(#${id})`}
      />

      {/* ── Hands ── */}
      <ellipse cx="89"  cy="598" rx="24" ry="22" fill="url(#g-skin2)" />
      <ellipse cx="411" cy="598" rx="24" ry="22" fill="url(#g-skin2)" />

      {/* ── Jeans ── */}
      <path d="M 254 690 L 264 948 L 362 948 C 365 860 363 772 354 690Z" fill="url(#g-jeans)" />
      <path d="M 246 690 L 236 948 L 138 948 C 135 860 137 772 146 690Z" fill="url(#g-jeans)" />
      {/* Belt */}
      <rect x="136" y="681" width="228" height="20" rx="5.5" fill="#0C1420" />
      <rect x="232" y="683" width="36"  height="16" rx="3.5" fill="#7C909E" />
      {/* Belt buckle glint */}
      <rect x="244" y="685" width="12"  height="4"  rx="1.5" fill="rgba(255,255,255,0.35)" />
      {/* Jeans crease */}
      <path d="M 252 696 L 258 945" stroke="rgba(255,255,255,0.05)" strokeWidth="2" />
      <path d="M 248 696 L 242 945" stroke="rgba(255,255,255,0.05)" strokeWidth="2" />

      {/* ── Shoes ── */}
      <path d="M 114 940 Q 166 924 214 940 L 220 957 Q 168 972 110 962Z" fill="url(#g-shoe)" />
      <path d="M 286 940 Q 334 924 382 940 L 388 957 Q 336 972 282 962Z" fill="url(#g-shoe)" />
      {/* Sole line */}
      <path d="M 112 960 Q 166 974 222 963 L 218 968 Q 164 980 108 968Z" fill="#C8C6BC" />
      <path d="M 278 963 Q 334 974 390 960 L 392 968 Q 340 980 280 968Z" fill="#C8C6BC" />
    </svg>
  );
}

// ── Grass slide ───────────────────────────────────────────────────────────────

function Slide({
  top,
  bottom,
  shirt,
  mood,
}: {
  top: string;
  bottom: string;
  shirt?: keyof typeof SHIRTS;
  mood?: "happy" | "excited" | "knowing" | "determined" | "confident";
}) {
  return (
    <div
      style={{
        width: 1080,
        height: 1920,
        position: "relative",
        overflow: "hidden",
        background: "#08140A",
      }}
    >
      {/* Sky gradient */}
      <div style={{
        position: "absolute", inset: 0,
        background: "linear-gradient(180deg, #07110A 0%, #0C1C0E 50%, #0F2010 100%)",
      }} />

      {/* Lawn — large rounded hill (matches golf image turf look) */}
      <div style={{
        position: "absolute",
        bottom: -360,
        left: "50%",
        transform: "translateX(-50%)",
        width: 2400,
        height: 1200,
        borderRadius: "50%",
        background:
          "radial-gradient(ellipse at 50% 26%, #245228 0%, #1C3E1E 30%, #152E16 55%, #0F2210 80%, #0A1A0C 100%)",
      }} />

      {/* Spotlight glow on turf where character stands */}
      <div style={{
        position: "absolute",
        bottom: 280,
        left: "50%",
        transform: "translateX(-50%)",
        width: 700,
        height: 400,
        borderRadius: "50%",
        background:
          "radial-gradient(ellipse at 50% 80%, rgba(60,120,50,0.28) 0%, transparent 70%)",
        filter: "blur(30px)",
      }} />

      {/* Character — centred, anchored to the lawn */}
      <div style={{
        position: "absolute",
        bottom: 260,
        left: "50%",
        transform: "translateX(-50%)",
        lineHeight: 0,
      }}>
        <Guy shirt={shirt} mood={mood} size={620} />
      </div>

      {/* Top text */}
      <div style={{
        position: "absolute",
        top: 82,
        left: 72,
        right: 72,
        textAlign: "center",
      }}>
        <p style={{
          fontFamily: "var(--font-sans)",
          fontSize: 80,
          fontWeight: 700,
          color: "#FFFFFF",
          lineHeight: 1.14,
          margin: 0,
          textShadow: "0 2px 20px rgba(0,0,0,0.4)",
        }}>
          {top}
        </p>
      </div>

      {/* Bottom text */}
      <div style={{
        position: "absolute",
        bottom: 72,
        left: 72,
        right: 72,
        textAlign: "center",
      }}>
        <p style={{
          fontFamily: "var(--font-sans)",
          fontSize: 80,
          fontWeight: 700,
          color: "#FFFFFF",
          lineHeight: 1.14,
          margin: 0,
          textShadow: "0 2px 20px rgba(0,0,0,0.4)",
        }}>
          {bottom}
        </p>
      </div>

      {/* Subtle watermark */}
      <div style={{ position: "absolute", bottom: 28, right: 48 }}>
        <span style={{
          fontFamily: "var(--font-sans)",
          fontSize: 14,
          color: "rgba(255,255,255,0.22)",
          letterSpacing: "0.05em",
        }}>
          hyperfix.app
        </span>
      </div>
    </div>
  );
}

// ── CTA slide ─────────────────────────────────────────────────────────────────

function CTASlide() {
  return (
    <div
      style={{
        width: 1080,
        height: 1920,
        position: "relative",
        overflow: "hidden",
        background: "#08140A",
      }}
    >
      {/* Sky */}
      <div style={{
        position: "absolute", inset: 0,
        background: "linear-gradient(180deg, #040C06 0%, #081408 55%, #0C1C0E 100%)",
      }} />

      {/* Lawn */}
      <div style={{
        position: "absolute",
        bottom: -360,
        left: "50%",
        transform: "translateX(-50%)",
        width: 2400,
        height: 1200,
        borderRadius: "50%",
        background:
          "radial-gradient(ellipse at 50% 26%, #245228 0%, #1C3E1E 30%, #152E16 55%, #0F2210 80%, #0A1A0C 100%)",
      }} />

      {/* Teal spotlight glow */}
      <div style={{
        position: "absolute",
        bottom: 240,
        left: "50%",
        transform: "translateX(-50%)",
        width: 900,
        height: 560,
        borderRadius: "50%",
        background:
          "radial-gradient(ellipse at 50% 75%, rgba(94,234,212,0.18) 0%, transparent 68%)",
        filter: "blur(40px)",
      }} />

      {/* Character */}
      <div style={{
        position: "absolute",
        bottom: 480,
        left: "50%",
        transform: "translateX(-50%)",
        lineHeight: 0,
      }}>
        <Guy shirt="cream" mood="excited" size={540} />
      </div>

      {/* Top text */}
      <div style={{
        position: "absolute",
        top: 82,
        left: 72,
        right: 72,
        textAlign: "center",
      }}>
        <p style={{
          fontFamily: "var(--font-sans)",
          fontSize: 80,
          fontWeight: 700,
          color: "#FFFFFF",
          lineHeight: 1.14,
          margin: 0,
          textShadow: "0 2px 24px rgba(0,0,0,0.5)",
        }}>
          Your ADHD brain is built different.
        </p>
      </div>

      {/* Bottom CTA block */}
      <div style={{
        position: "absolute",
        bottom: 80,
        left: 72,
        right: 72,
        textAlign: "center",
      }}>
        {/* Sub-line */}
        <p style={{
          fontFamily: "var(--font-sans)",
          fontSize: 76,
          fontWeight: 700,
          color: "#FFFFFF",
          lineHeight: 1.14,
          margin: "0 0 52px",
          textShadow: "0 2px 24px rgba(0,0,0,0.5)",
        }}>
          Start tracking it.
        </p>

        {/* Teal pill */}
        <div style={{
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#5EEAD4",
          borderRadius: 72,
          padding: "26px 80px",
          marginBottom: 36,
          boxShadow: "0 0 60px rgba(94,234,212,0.35)",
        }}>
          <span style={{
            fontFamily: "var(--font-sans)",
            fontSize: 58,
            fontWeight: 700,
            color: "#081A10",
            letterSpacing: "-0.01em",
          }}>
            hyperfix.app
          </span>
        </div>

        {/* Fine print */}
        <p style={{
          fontFamily: "var(--font-sans)",
          fontSize: 34,
          fontWeight: 700,
          color: "rgba(255,255,255,0.35)",
          margin: 0,
          letterSpacing: "0.04em",
        }}>
          Free forever · No account needed
        </p>
      </div>
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function AdhdV3() {
  return (
    <div
      className={sans.variable}
      style={{ background: "#020202", display: "flex", flexDirection: "column", gap: 4 }}
    >
      {/* 1 — HOOK */}
      <Slide
        top="If you have ADHD, your brain can do things neurotypical brains literally cannot."
        bottom="Here are 5 of them. Swipe."
        shirt="cream"
        mood="knowing"
      />

      {/* 2 — Hyperfocus */}
      <Slide
        top="Combined with your complete inability to do anything casually,"
        bottom="ADHD turns 'I like this' into 112 consecutive days of nonstop expertise."
        shirt="yellow"
        mood="happy"
      />

      {/* 3 — Creativity */}
      <Slide
        top="While everyone else is processing one idea at a time,"
        bottom="Your ADHD brain is already 14 steps ahead making connections they'll never find."
        shirt="blue"
        mood="excited"
      />

      {/* 4 — Emotional depth */}
      <Slide
        top="Where most people casually enjoy something and move on,"
        bottom="You feel it so deeply you write a 3-paragraph eulogy when it ends."
        shirt="coral"
        mood="determined"
      />

      {/* 5 — Deadline superpower */}
      <Slide
        top="When the deadline is tomorrow and everyone else is panicking,"
        bottom="Your ADHD brain finally shifts into the gear it was always built for."
        shirt="red"
        mood="determined"
      />

      {/* 6 — Controversial */}
      <Slide
        top="Hot take: ADHD isn't a deficit of attention."
        bottom="It's an excess of it — aimed at whatever your brain decided actually matters."
        shirt="green"
        mood="confident"
      />

      {/* 7 — CTA */}
      <CTASlide />
    </div>
  );
}
