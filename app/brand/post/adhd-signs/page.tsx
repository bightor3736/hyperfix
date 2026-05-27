import type { Metadata } from "next";
import { Instrument_Sans } from "next/font/google";

export const metadata: Metadata = {
  title: "Hyperfix — ADHD Signs",
  robots: { index: false, follow: false },
};

const sans = Instrument_Sans({
  subsets: ["latin"],
  weight: ["700"],
  display: "swap",
  variable: "--font-sans",
});

// ── Shirt presets ─────────────────────────────────────────────────────────────

type ShirtSet = { base: string; light: string; dark: string; glow: string };

const SHIRTS: Record<string, ShirtSet> = {
  white:  { base: "#EEEAE0", light: "#FEFAF4", dark: "#CCCAB8", glow: "rgba(220,215,195,0.22)" },
  yellow: { base: "#EEC030", light: "#FFD85A", dark: "#B88808", glow: "rgba(255,210,50,0.28)"  },
  blue:   { base: "#3A78CC", light: "#5A9AEC", dark: "#1A58AC", glow: "rgba(80,140,230,0.28)"  },
  coral:  { base: "#E8603A", light: "#FF8060", dark: "#B83820", glow: "rgba(240,100,60,0.28)"  },
  purple: { base: "#9050D0", light: "#B070F0", dark: "#6830B0", glow: "rgba(150,80,220,0.28)"  },
  teal:   { base: "#22B8A0", light: "#42D8C0", dark: "#089880", glow: "rgba(60,200,170,0.28)"  },
};

// ── Guy — clean round-headed cartoon ─────────────────────────────────────────

type Mood = "happy" | "excited" | "knowing" | "determined" | "confident";

function Guy({
  shirt = "white",
  mood  = "happy",
  size  = 640,
}: {
  shirt?: keyof typeof SHIRTS;
  mood?:  Mood;
  size?:  number;
}) {
  const sc = SHIRTS[shirt];
  const h  = Math.round(size * 1.88);
  const sid = `sg-${shirt}`;

  return (
    <svg
      width={size}
      height={h}
      viewBox="0 0 500 940"
      fill="none"
      style={{ filter: "drop-shadow(0px 20px 50px rgba(0,0,0,0.70))" }}
    >
      <defs>
        {/* ── Face — 4-stop radial, strong top-left highlight ── */}
        <radialGradient id="gf" cx="33%" cy="26%" r="65%">
          <stop offset="0%"   stopColor="#FFE4A8" />
          <stop offset="25%"  stopColor="#F8C07C" />
          <stop offset="68%"  stopColor="#E89858" />
          <stop offset="100%" stopColor="#B86022" />
        </radialGradient>

        {/* Ear / neck / hand — slightly darker skin */}
        <radialGradient id="gn" cx="35%" cy="28%" r="62%">
          <stop offset="0%"   stopColor="#EFA860" />
          <stop offset="100%" stopColor="#A85820" />
        </radialGradient>

        {/* Hair — radial highlight top-left */}
        <radialGradient id="gh" cx="28%" cy="14%" r="72%">
          <stop offset="0%"   stopColor="#3E1E08" />
          <stop offset="55%"  stopColor="#180C04" />
          <stop offset="100%" stopColor="#060200" />
        </radialGradient>

        {/* Shirt */}
        <linearGradient id={sid} x1="4%" y1="0%" x2="96%" y2="88%">
          <stop offset="0%"   stopColor={sc.light} />
          <stop offset="42%"  stopColor={sc.base}  />
          <stop offset="100%" stopColor={sc.dark}  />
        </linearGradient>

        {/* Jeans */}
        <linearGradient id="gj" x1="0%" y1="0%" x2="100%" y2="12%">
          <stop offset="0%"   stopColor="#2C4260" />
          <stop offset="42%"  stopColor="#203258" />
          <stop offset="100%" stopColor="#121C36" />
        </linearGradient>

        {/* Shoe */}
        <linearGradient id="gs" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%"   stopColor="#F8F6EE" />
          <stop offset="100%" stopColor="#D4D2CA" />
        </linearGradient>

        {/* Collar shadow */}
        <linearGradient id="gcol" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%"   stopColor="rgba(0,0,0,0.28)" />
          <stop offset="100%" stopColor="rgba(0,0,0,0)"    />
        </linearGradient>

        {/* Eye iris */}
        <radialGradient id="gi" cx="38%" cy="32%" r="60%">
          <stop offset="0%"   stopColor="#4A2800" />
          <stop offset="100%" stopColor="#100400" />
        </radialGradient>
      </defs>

      {/* ── Ground shadow ── */}
      <ellipse cx="250" cy="936" rx="170" ry="22" fill="rgba(0,0,0,0.50)" />

      {/* ══════════════════════════════════════════════════════
          HAIR — painted in two layers (back, then front fringe)
          ══════════════════════════════════════════════════════ */}
      {/* Back blob */}
      <ellipse cx="250" cy="148" rx="112" ry="106" fill="url(#gh)" />
      {/* Side tufts */}
      <path d="M 140 150 Q 128 175 132 218 Q 138 236 150 232 Q 142 210 148 186 Q 140 170 140 150Z" fill="url(#gh)" />
      <path d="M 360 150 Q 372 175 368 218 Q 362 236 350 232 Q 358 210 352 186 Q 360 170 360 150Z" fill="url(#gh)" />
      {/* Fringe over forehead */}
      <path
        d="M 152 118 Q 178 58 250 52 Q 322 58 348 118
           Q 318 86 250 84 Q 182 86 152 118Z"
        fill="url(#gh)"
      />

      {/* ══════════════════════════════════════════════════════
          HEAD — big round sphere
          ══════════════════════════════════════════════════════ */}
      <ellipse cx="250" cy="162" rx="108" ry="112" fill="url(#gf)" />

      {/* Subtle chin-shadow for depth */}
      <ellipse cx="250" cy="268" rx="88" ry="14" fill="rgba(0,0,0,0.10)" />

      {/* ══════════════════════════════════════════════════════
          EARS
          ══════════════════════════════════════════════════════ */}
      <ellipse cx="143" cy="172" rx="15" ry="21" fill="#D88040" />
      <ellipse cx="143" cy="172" rx="9"  ry="13" fill="#C06828" />
      <ellipse cx="357" cy="172" rx="15" ry="21" fill="#D88040" />
      <ellipse cx="357" cy="172" rx="9"  ry="13" fill="#C06828" />

      {/* ══════════════════════════════════════════════════════
          EYES
          ══════════════════════════════════════════════════════ */}
      {/* Eye shadow behind whites */}
      <ellipse cx="212" cy="183" rx="24" ry="21" fill="rgba(140,60,10,0.14)" />
      <ellipse cx="288" cy="183" rx="24" ry="21" fill="rgba(140,60,10,0.14)" />
      {/* Whites */}
      <ellipse cx="212" cy="180" rx="21" ry="18" fill="white" />
      <ellipse cx="288" cy="180" rx="21" ry="18" fill="white" />

      {/* Irises + pupils */}
      {mood === "confident" ? (
        /* Wink left eye, normal right */
        <>
          <path d="M 192 178 Q 212 190 232 178" stroke="#180C04" strokeWidth="6" fill="none" strokeLinecap="round" />
          <ellipse cx="288" cy="181" rx="13" ry="13" fill="url(#gi)" />
          <circle  cx="292" cy="176" r="4.5"          fill="white"   opacity="0.9" />
        </>
      ) : (
        <>
          <ellipse cx={mood === "excited" ? 210 : 212} cy="181" rx="13" ry="13" fill="url(#gi)" />
          <circle  cx={mood === "excited" ? 214 : 216} cy="176" r="4.5" fill="white" opacity="0.9" />
          <ellipse cx={mood === "excited" ? 290 : 288} cy="181" rx="13" ry="13" fill="url(#gi)" />
          <circle  cx={mood === "excited" ? 294 : 292} cy="176" r="4.5" fill="white" opacity="0.9" />
        </>
      )}

      {/* ══════════════════════════════════════════════════════
          EYEBROWS
          ══════════════════════════════════════════════════════ */}
      {mood === "excited" ? (
        <>
          <path d="M 192 153 Q 210 143 229 151" stroke="#180C04" strokeWidth="6.5" fill="none" strokeLinecap="round" />
          <path d="M 271 151 Q 290 143 308 153" stroke="#180C04" strokeWidth="6.5" fill="none" strokeLinecap="round" />
        </>
      ) : mood === "determined" ? (
        <>
          <path d="M 190 158 Q 211 147 230 155" stroke="#180C04" strokeWidth="7"   fill="none" strokeLinecap="round" />
          <path d="M 270 155 Q 289 147 310 158" stroke="#180C04" strokeWidth="7"   fill="none" strokeLinecap="round" />
        </>
      ) : mood === "knowing" ? (
        /* One brow raised slightly */
        <>
          <path d="M 190 155 Q 210 149 229 154" stroke="#180C04" strokeWidth="6"   fill="none" strokeLinecap="round" />
          <path d="M 271 150 Q 290 143 309 152" stroke="#180C04" strokeWidth="6"   fill="none" strokeLinecap="round" />
        </>
      ) : (
        <>
          <path d="M 191 156 Q 211 149 230 155" stroke="#180C04" strokeWidth="5.5" fill="none" strokeLinecap="round" />
          <path d="M 270 155 Q 289 149 309 156" stroke="#180C04" strokeWidth="5.5" fill="none" strokeLinecap="round" />
        </>
      )}

      {/* ══════════════════════════════════════════════════════
          NOSE
          ══════════════════════════════════════════════════════ */}
      <path
        d="M 250 194 Q 241 211 245 220 Q 250 225 255 220 Q 259 211 250 194"
        stroke="#C07030" strokeWidth="3" fill="rgba(180,90,30,0.14)" strokeLinecap="round"
      />

      {/* Rosy cheeks */}
      <ellipse cx="188" cy="215" rx="26" ry="15" fill="#F07050" opacity="0.18" />
      <ellipse cx="312" cy="215" rx="26" ry="15" fill="#F07050" opacity="0.18" />

      {/* ══════════════════════════════════════════════════════
          MOUTH
          ══════════════════════════════════════════════════════ */}
      {mood === "happy" && (
        <path d="M 222 236 Q 250 262 278 236"
          stroke="#9A5020" strokeWidth="5" fill="none" strokeLinecap="round" />
      )}
      {mood === "excited" && (
        <>
          <ellipse cx="250" cy="244" rx="28" ry="18" fill="white"   opacity="0.92" />
          <ellipse cx="250" cy="248" rx="18" ry="11" fill="#C07838" />
        </>
      )}
      {mood === "knowing" && (
        <path d="M 228 238 Q 256 255 278 234"
          stroke="#9A5020" strokeWidth="5" fill="none" strokeLinecap="round" />
      )}
      {mood === "determined" && (
        <path d="M 222 238 Q 250 256 278 238"
          stroke="#9A5020" strokeWidth="5.5" fill="none" strokeLinecap="round" />
      )}
      {mood === "confident" && (
        <path d="M 234 238 Q 260 256 278 234"
          stroke="#9A5020" strokeWidth="5" fill="none" strokeLinecap="round" />
      )}

      {/* ══════════════════════════════════════════════════════
          NECK
          ══════════════════════════════════════════════════════ */}
      <path
        d="M 228 256 L 235 300 L 265 300 L 272 256
           Q 255 268 250 268 Q 245 268 228 256Z"
        fill="#D08040"
      />
      {/* Neck shadow */}
      <path
        d="M 228 256 L 235 300 L 250 300 L 250 268 Q 245 268 228 256Z"
        fill="rgba(0,0,0,0.08)"
      />

      {/* ══════════════════════════════════════════════════════
          SHIRT BODY
          ══════════════════════════════════════════════════════ */}
      <path
        d="M 134 306 C 124 456 126 594 132 706
           L 368 706
           C 374 594 376 456 366 306
           C 318 280 284 272 250 272
           C 216 272 182 280 134 306Z"
        fill={`url(#${sid})`}
      />
      {/* V-collar shadow */}
      <path
        d="M 232 282 L 250 330 L 268 282
           C 258 274 250 272 250 272
           C 250 272 242 274 232 282Z"
        fill="url(#gcol)"
      />

      {/* ══════════════════════════════════════════════════════
          ARMS
          ══════════════════════════════════════════════════════ */}
      <path
        d="M 136 318 C 74 396 58 520 64 606 L 104 601
           C 100 524 108 418 148 350Z"
        fill={`url(#${sid})`}
      />
      {/* Left arm inner shadow */}
      <path
        d="M 136 320 C 112 380 106 470 110 552 L 122 548
           C 118 466 124 378 150 326Z"
        fill="rgba(0,0,0,0.10)"
      />
      <path
        d="M 364 318 C 426 396 442 520 436 606 L 396 601
           C 400 524 392 418 352 350Z"
        fill={`url(#${sid})`}
      />
      {/* Right arm inner shadow */}
      <path
        d="M 364 320 C 388 380 394 470 390 552 L 378 548
           C 382 466 376 378 350 326Z"
        fill="rgba(0,0,0,0.10)"
      />

      {/* ══════════════════════════════════════════════════════
          HANDS — rounder, slight finger definition
          ══════════════════════════════════════════════════════ */}
      <ellipse cx="83"  cy="610" rx="26" ry="24" fill="url(#gn)" />
      <ellipse cx="417" cy="610" rx="26" ry="24" fill="url(#gn)" />
      {/* Knuckle hints */}
      <path d="M 68 603 Q 76 597 84 603" stroke="rgba(0,0,0,0.08)" strokeWidth="2" fill="none" />
      <path d="M 402 603 Q 410 597 418 603" stroke="rgba(0,0,0,0.08)" strokeWidth="2" fill="none" />

      {/* ══════════════════════════════════════════════════════
          JEANS
          ══════════════════════════════════════════════════════ */}
      <path d="M 254 700 L 264 936 L 364 936 C 367 848 365 760 356 700Z" fill="url(#gj)" />
      <path d="M 246 700 L 236 936 L 136 936 C 133 848 135 760 144 700Z" fill="url(#gj)" />
      {/* Jeans crease highlight */}
      <path d="M 255 708 L 261 935" stroke="rgba(255,255,255,0.06)" strokeWidth="3" />
      <path d="M 245 708 L 239 935" stroke="rgba(255,255,255,0.06)" strokeWidth="3" />

      {/* Belt */}
      <rect x="132" y="690" width="236" height="22" rx="6" fill="#0A1222" />
      <rect x="230" y="692" width="40"  height="18" rx="4" fill="#6A8496" />
      <rect x="242" y="694" width="14"  height="5"  rx="2" fill="rgba(255,255,255,0.40)" />

      {/* ══════════════════════════════════════════════════════
          SHOES
          ══════════════════════════════════════════════════════ */}
      <path d="M 108 928 Q 162 910 214 928 L 220 947 Q 164 965 104 954Z" fill="url(#gs)" />
      <path d="M 104 952 Q 162 967 224 950 L 220 958 Q 162 975 100 960Z" fill="#C8C4BC" />
      <path d="M 286 928 Q 338 910 388 928 L 394 947 Q 340 965 282 954Z" fill="url(#gs)" />
      <path d="M 282 952 Q 340 967 398 950 L 394 958 Q 340 975 278 960Z" fill="#C8C4BC" />
    </svg>
  );
}

// ── Slide ─────────────────────────────────────────────────────────────────────

function Slide({
  top,
  bottom,
  shirt,
  mood,
  number,
  total,
}: {
  top: string;
  bottom: string;
  shirt?: keyof typeof SHIRTS;
  mood?: Mood;
  number?: number;
  total?: number;
}) {
  const glow = shirt ? SHIRTS[shirt].glow : "rgba(80,120,80,0.20)";

  return (
    <div
      style={{
        width: 1080,
        height: 1920,
        position: "relative",
        overflow: "hidden",
        background: "#060E08",
      }}
    >
      {/* Deep sky */}
      <div style={{
        position: "absolute", inset: 0,
        background:
          "linear-gradient(180deg, #050C06 0%, #08140A 45%, #0C1C0E 100%)",
      }} />

      {/* Vivid grass hill */}
      <div style={{
        position: "absolute",
        bottom: -400, left: "50%", transform: "translateX(-50%)",
        width: 2600, height: 1300, borderRadius: "50%",
        background:
          "radial-gradient(ellipse at 50% 24%, #2A5C2C 0%, #1E4420 28%, #163214 52%, #0E2410 76%, #08180A 100%)",
      }} />

      {/* Shirt-colour glow behind character */}
      <div style={{
        position: "absolute",
        bottom: 200, left: "50%", transform: "translateX(-50%)",
        width: 860, height: 900, borderRadius: "50%",
        background: `radial-gradient(ellipse at 50% 60%, ${glow} 0%, transparent 65%)`,
        filter: "blur(50px)",
      }} />

      {/* Green lawn spotlight */}
      <div style={{
        position: "absolute",
        bottom: 240, left: "50%", transform: "translateX(-50%)",
        width: 680, height: 380, borderRadius: "50%",
        background:
          "radial-gradient(ellipse at 50% 82%, rgba(50,130,50,0.30) 0%, transparent 68%)",
        filter: "blur(28px)",
      }} />

      {/* Character */}
      <div style={{
        position: "absolute",
        bottom: 230, left: "50%", transform: "translateX(-50%)",
        lineHeight: 0,
      }}>
        <Guy shirt={shirt} mood={mood} size={640} />
      </div>

      {/* Top text */}
      <div style={{
        position: "absolute",
        top: 80, left: 68, right: 68,
        textAlign: "center",
      }}>
        <p style={{
          fontFamily: "var(--font-sans)",
          fontSize: 78,
          fontWeight: 700,
          color: "#FFFFFF",
          lineHeight: 1.15,
          margin: 0,
          textShadow: "0 3px 28px rgba(0,0,0,0.55)",
        }}>
          {top}
        </p>
      </div>

      {/* Bottom text */}
      <div style={{
        position: "absolute",
        bottom: 70, left: 68, right: 68,
        textAlign: "center",
      }}>
        <p style={{
          fontFamily: "var(--font-sans)",
          fontSize: 78,
          fontWeight: 700,
          color: "#FFFFFF",
          lineHeight: 1.15,
          margin: 0,
          textShadow: "0 3px 28px rgba(0,0,0,0.55)",
        }}>
          {bottom}
        </p>
      </div>

      {/* Slide counter + watermark row */}
      <div style={{
        position: "absolute",
        bottom: 26,
        left: 68,
        right: 68,
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}>
        <span style={{
          fontFamily: "var(--font-sans)", fontSize: 13,
          color: "rgba(255,255,255,0.20)", letterSpacing: "0.06em",
        }}>
          {number && total ? `${number} / ${total}` : ""}
        </span>
        <span style={{
          fontFamily: "var(--font-sans)", fontSize: 13,
          color: "rgba(255,255,255,0.20)", letterSpacing: "0.06em",
        }}>
          hyperfix.app
        </span>
      </div>
    </div>
  );
}

// ── CTA Slide ─────────────────────────────────────────────────────────────────

function CTASlide() {
  return (
    <div
      style={{
        width: 1080,
        height: 1920,
        position: "relative",
        overflow: "hidden",
        background: "#060E08",
      }}
    >
      {/* Sky */}
      <div style={{
        position: "absolute", inset: 0,
        background: "linear-gradient(180deg, #040A06 0%, #081008 50%, #0C1A0E 100%)",
      }} />

      {/* Grass */}
      <div style={{
        position: "absolute",
        bottom: -400, left: "50%", transform: "translateX(-50%)",
        width: 2600, height: 1300, borderRadius: "50%",
        background:
          "radial-gradient(ellipse at 50% 24%, #2A5C2C 0%, #1E4420 28%, #163214 52%, #0E2410 76%, #08180A 100%)",
      }} />

      {/* Teal glow */}
      <div style={{
        position: "absolute",
        bottom: 200, left: "50%", transform: "translateX(-50%)",
        width: 920, height: 960, borderRadius: "50%",
        background:
          "radial-gradient(ellipse at 50% 58%, rgba(94,234,212,0.20) 0%, transparent 64%)",
        filter: "blur(55px)",
      }} />

      {/* Character */}
      <div style={{
        position: "absolute",
        bottom: 440, left: "50%", transform: "translateX(-50%)",
        lineHeight: 0,
      }}>
        <Guy shirt="white" mood="excited" size={580} />
      </div>

      {/* Top */}
      <div style={{
        position: "absolute",
        top: 80, left: 68, right: 68, textAlign: "center",
      }}>
        <p style={{
          fontFamily: "var(--font-sans)", fontSize: 78, fontWeight: 700,
          color: "#FFFFFF", lineHeight: 1.15, margin: 0,
          textShadow: "0 3px 28px rgba(0,0,0,0.55)",
        }}>
          Your brain isn't broken.
        </p>
      </div>

      {/* Bottom CTA block */}
      <div style={{
        position: "absolute",
        bottom: 72, left: 68, right: 68,
        textAlign: "center",
      }}>
        <p style={{
          fontFamily: "var(--font-sans)", fontSize: 74, fontWeight: 700,
          color: "#FFFFFF", lineHeight: 1.15, margin: "0 0 48px",
          textShadow: "0 3px 28px rgba(0,0,0,0.55)",
        }}>
          It just needs the right app.
        </p>

        {/* Pill button */}
        <div style={{
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#5EEAD4",
          borderRadius: 80,
          padding: "28px 88px",
          marginBottom: 32,
          boxShadow:
            "0 0 0 1px rgba(94,234,212,0.30), 0 0 70px rgba(94,234,212,0.40)",
        }}>
          <span style={{
            fontFamily: "var(--font-sans)", fontSize: 56, fontWeight: 700,
            color: "#071610", letterSpacing: "-0.01em",
          }}>
            hyperfix.app
          </span>
        </div>

        <p style={{
          fontFamily: "var(--font-sans)", fontSize: 32, fontWeight: 700,
          color: "rgba(255,255,255,0.32)", margin: 0, letterSpacing: "0.05em",
        }}>
          Free forever · No account needed
        </p>
      </div>
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────

const TOTAL = 6;

export default function AdhdSigns() {
  return (
    <div
      className={sans.variable}
      style={{ background: "#020202", display: "flex", flexDirection: "column", gap: 4 }}
    >
      {/* 1 — Hook */}
      <Slide
        top="Signs you might have ADHD"
        bottom="(that everyone mistakes for a personality flaw)"
        shirt="white"
        mood="knowing"
        number={1}
        total={TOTAL}
      />

      {/* 2 — Tab hoarding */}
      <Slide
        top="You open 30 browser tabs 'just in case'"
        bottom="and close all of them without reading a single one."
        shirt="yellow"
        mood="knowing"
        number={2}
        total={TOTAL}
      />

      {/* 3 — Task initiation */}
      <Slide
        top="You've been 'about to start' for 3 hours"
        bottom="and genuinely cannot explain why you haven't moved yet."
        shirt="blue"
        mood="determined"
        number={3}
        total={TOTAL}
      />

      {/* 4 — Texting */}
      <Slide
        top="You reply to texts in 0.3 seconds"
        bottom="or forget someone exists for 6 weeks. There is no in between."
        shirt="coral"
        mood="excited"
        number={4}
        total={TOTAL}
      />

      {/* 5 — Clock */}
      <Slide
        top="Your brain is on fire at 2am"
        bottom="and completely offline at 10am when you actually need it."
        shirt="purple"
        mood="determined"
        number={5}
        total={TOTAL}
      />

      {/* 6 — Emotional volume */}
      <Slide
        top="You don't feel things a little."
        bottom="You feel everything at full volume, all at once, all day."
        shirt="teal"
        mood="excited"
        number={6}
        total={TOTAL}
      />

      {/* 7 — CTA */}
      <CTASlide />
    </div>
  );
}
