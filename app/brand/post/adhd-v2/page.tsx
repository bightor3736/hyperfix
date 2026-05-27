import type { Metadata } from "next";
import { Instrument_Sans } from "next/font/google";

export const metadata: Metadata = {
  title: "Hyperfix — ADHD v2",
  robots: { index: false, follow: false },
};

const sans = Instrument_Sans({
  subsets: ["latin"],
  weight: ["700"],
  display: "swap",
  variable: "--font-sans",
});

// ── Cartoon guy ───────────────────────────────────────────────────────────────

const SKIN  = "#E8A870";
const SKIN2 = "#CF9060";
const HAIR  = "#1C0E06";
const PANTS = "#243048";

function Guy({
  shirt = "#EEE8D8",
  mood  = "happy",
  size  = 460,
}: {
  shirt?: string;
  mood?: "happy" | "excited" | "knowing" | "determined" | "confident";
  size?: number;
}) {
  const h = Math.round(size * 1.9);

  return (
    <svg width={size} height={h} viewBox="0 0 500 950" fill="none">
      {/* Ground shadow */}
      <ellipse cx="250" cy="946" rx="145" ry="20" fill="rgba(0,0,0,0.30)" />

      {/* Hair behind */}
      <ellipse cx="250" cy="140" rx="98" ry="92" fill={HAIR} />

      {/* Head */}
      <ellipse cx="250" cy="152" rx="88" ry="95" fill={SKIN} />

      {/* Hair top */}
      <path
        d="M 165 126 Q 184 57 250 53 Q 316 57 335 126 Q 305 94 250 92 Q 195 94 165 126Z"
        fill={HAIR}
      />

      {/* Ears */}
      <ellipse cx="162" cy="162" rx="13" ry="18" fill={SKIN2} />
      <ellipse cx="338" cy="162" rx="13" ry="18" fill={SKIN2} />

      {/* Neck */}
      <path
        d="M 228 241 L 234 283 L 266 283 L 272 241 Q 255 250 250 250 Q 245 250 228 241Z"
        fill={SKIN}
      />

      {/* Shirt body */}
      <path
        d="M 138 295 C 128 440 130 576 136 688 L 364 688
           C 370 576 372 440 362 295
           C 316 273 280 267 250 267
           C 220 267 184 273 138 295Z"
        fill={shirt}
      />

      {/* Arms */}
      <path
        d="M 140 307 C 84 378 70 495 76 582 L 114 578
           C 110 501 118 401 156 337Z"
        fill={shirt}
      />
      <path
        d="M 360 307 C 416 378 430 495 424 582 L 386 578
           C 390 501 382 401 344 337Z"
        fill={shirt}
      />

      {/* Hands */}
      <ellipse cx="95"  cy="586" rx="24" ry="22" fill={SKIN} />
      <ellipse cx="405" cy="586" rx="24" ry="22" fill={SKIN} />

      {/* Pants — right leg behind */}
      <path d="M 252 682 L 260 946 L 354 946 C 357 860 355 772 348 682Z" fill={PANTS} />
      {/* left leg in front */}
      <path d="M 248 682 L 240 946 L 146 946 C 143 860 145 772 152 682Z" fill={PANTS} />

      {/* Belt */}
      <rect x="136" y="677" width="228" height="18" rx="5" fill="#141E2A" />
      <rect x="233" y="679" width="34" height="14" rx="3" fill="#7E92A6" />

      {/* Shoes */}
      <path d="M 118 940 Q 168 926 214 940 L 220 955 Q 170 968 114 962Z" fill="#EFEDE2" />
      <path d="M 286 940 Q 332 926 378 940 L 384 955 Q 334 968 280 962Z" fill="#EFEDE2" />

      {/* Eyes whites */}
      <ellipse cx="217" cy="160" rx="15" ry="14" fill="white" />
      <ellipse cx="283" cy="160" rx="15" ry="14" fill="white" />

      {/* Pupils */}
      {mood === "confident" ? (
        /* wink right eye */
        <>
          <circle cx="220" cy="162" r="10" fill="#1A0800" />
          <circle cx="223" cy="158" r="3.5" fill="white" />
          <path d="M 269 158 Q 283 165 297 158" stroke="#1A0800" strokeWidth="5.5" fill="none" strokeLinecap="round" />
        </>
      ) : (
        <>
          <circle cx={mood === "excited" ? 219 : 220} cy="162" r="10" fill="#1A0800" />
          <circle cx={mood === "excited" ? 222 : 223} cy="158" r="3.5" fill="white" />
          <circle cx={mood === "excited" ? 285 : 286} cy="162" r="10" fill="#1A0800" />
          <circle cx={mood === "excited" ? 288 : 289} cy="158" r="3.5" fill="white" />
        </>
      )}

      {/* Eyebrows */}
      {mood === "excited" ? (
        <>
          <path d="M 199 132 Q 216 123 234 130" stroke={HAIR} strokeWidth="5.5" fill="none" strokeLinecap="round" />
          <path d="M 266 130 Q 284 123 301 132" stroke={HAIR} strokeWidth="5.5" fill="none" strokeLinecap="round" />
        </>
      ) : (
        <>
          <path d="M 201 138 Q 218 131 234 137" stroke={HAIR} strokeWidth="4.5" fill="none" strokeLinecap="round" />
          <path d="M 266 137 Q 282 131 299 138" stroke={HAIR} strokeWidth="4.5" fill="none" strokeLinecap="round" />
        </>
      )}

      {/* Nose */}
      <path
        d="M 250 178 Q 242 192 246 200 Q 250 204 254 200 Q 258 192 250 178"
        stroke={SKIN2}
        strokeWidth="2.5"
        fill="none"
      />

      {/* Mouth */}
      {mood === "happy"      && <path d="M 222 220 Q 250 243 278 220" stroke="#9A5820" strokeWidth="4.5" fill="none" strokeLinecap="round" />}
      {mood === "excited"    && <><ellipse cx="250" cy="226" rx="24" ry="15" fill="white" opacity="0.9" /><ellipse cx="250" cy="229" rx="15" ry="9" fill="#C08040" /></>}
      {mood === "knowing"    && <path d="M 228 222 Q 254 239 274 219" stroke="#9A5820" strokeWidth="4.5" fill="none" strokeLinecap="round" />}
      {mood === "determined" && <path d="M 224 222 Q 250 241 276 222" stroke="#9A5820" strokeWidth="5"   fill="none" strokeLinecap="round" />}
      {mood === "confident"  && <path d="M 234 224 Q 259 239 275 219" stroke="#9A5820" strokeWidth="4.5" fill="none" strokeLinecap="round" />}
    </svg>
  );
}

// ── Slide ─────────────────────────────────────────────────────────────────────

function Slide({
  top,
  bottom,
  shirt,
  mood,
}: {
  top: string;
  bottom: string;
  shirt?: string;
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
      {/* Sky */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "linear-gradient(180deg, #07120A 0%, #0B1C0D 55%, #0E1E10 100%)",
        }}
      />

      {/* Lawn hill — large rounded ellipse gives the turf look */}
      <div
        style={{
          position: "absolute",
          bottom: -320,
          left: "50%",
          transform: "translateX(-50%)",
          width: 2200,
          height: 1100,
          borderRadius: "50%",
          background:
            "radial-gradient(ellipse at 50% 28%, #214822 0%, #173818 40%, #112E12 70%, #0D2410 100%)",
        }}
      />

      {/* Guy — centred, standing on the lawn */}
      <div
        style={{
          position: "absolute",
          bottom: 340,
          left: "50%",
          transform: "translateX(-50%)",
          lineHeight: 0,
        }}
      >
        <Guy shirt={shirt} mood={mood} size={460} />
      </div>

      {/* Top text */}
      <div
        style={{
          position: "absolute",
          top: 80,
          left: 70,
          right: 70,
          textAlign: "center",
        }}
      >
        <p
          style={{
            fontFamily: "var(--font-sans)",
            fontSize: 76,
            fontWeight: 700,
            color: "#FFFFFF",
            lineHeight: 1.13,
            margin: 0,
          }}
        >
          {top}
        </p>
      </div>

      {/* Bottom text */}
      <div
        style={{
          position: "absolute",
          bottom: 78,
          left: 70,
          right: 70,
          textAlign: "center",
        }}
      >
        <p
          style={{
            fontFamily: "var(--font-sans)",
            fontSize: 76,
            fontWeight: 700,
            color: "#FFFFFF",
            lineHeight: 1.13,
            margin: 0,
          }}
        >
          {bottom}
        </p>
      </div>

      {/* Watermark */}
      <div style={{ position: "absolute", bottom: 34, right: 52 }}>
        <span
          style={{
            fontFamily: "var(--font-sans)",
            fontSize: 15,
            color: "rgba(255,255,255,0.25)",
            letterSpacing: "0.04em",
          }}
        >
          hyperfix.app
        </span>
      </div>
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function AdhdV2() {
  return (
    <div
      className={sans.variable}
      style={{ background: "#020202", display: "flex", flexDirection: "column", gap: 4 }}
    >
      {/* 1 — Hyperfocus */}
      <Slide
        top="Combined with your complete inability to do anything casually,"
        bottom="ADHD turns 'I like this' into 112 consecutive days of expertise."
        shirt="#EEE8D8"
        mood="happy"
      />

      {/* 2 — Creativity */}
      <Slide
        top="While everyone else is thinking about something in straight lines,"
        bottom="Your ADHD brain has already connected dots they will never find."
        shirt="#5A8ED4"
        mood="knowing"
      />

      {/* 3 — Emotional depth */}
      <Slide
        top="Where most people casually enjoy their favourite show,"
        bottom="You watch it 6 times, cry twice, and write it a 3-paragraph eulogy."
        shirt="#F5C640"
        mood="excited"
      />

      {/* 4 — Deadline superpower */}
      <Slide
        top="When the deadline hits and everyone else is panicking,"
        bottom="Your ADHD brain finally shifts into the gear it was always built for."
        shirt="#F07850"
        mood="determined"
      />

      {/* 5 — Controversial */}
      <Slide
        top="Hot take: ADHD isn't a deficit of attention."
        bottom="It's an excess of it, aimed at whatever your brain decided actually matters."
        shirt="#5EC87A"
        mood="confident"
      />
    </div>
  );
}
