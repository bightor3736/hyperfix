import type { Metadata } from "next";
import { Instrument_Sans } from "next/font/google";
import type { CSSProperties } from "react";

export const metadata: Metadata = {
  title: "Hyperfix — ADHD Signs v2",
  robots: { index: false, follow: false },
};

const sans = Instrument_Sans({
  subsets: ["latin"],
  weight: ["700"],
  display: "swap",
  variable: "--font-sans",
});

// ─────────────────────────────────────────────────────────────────────────────
// CARTOON GUY — bold outlines, big head, flat colors
// viewBox: 0 0 500 960
// ─────────────────────────────────────────────────────────────────────────────

type Pose   = "stand" | "excited" | "holdPhone" | "shrug" | "arms-out";
type Mouth  = "happy" | "open" | "flat" | "smirk";

function CartoonGuy({
  shirtColor = "#FFFFFF",
  pose       = "stand",
  mouth      = "happy",
  size       = 560,
}: {
  shirtColor?: string;
  pose?:       Pose;
  mouth?:      Mouth;
  size?:       number;
}) {
  const h   = Math.round(size * 1.92);
  const OUT = 5;  // main outline stroke width (in 500-unit viewbox)
  const SK  = "#1A0800";
  const SH  = "#0A0400";

  // ── Arm paths per pose ────────────────────────────────────────────────────
  const arms: Record<Pose, { L: string; R: string }> = {
    stand: {
      L: "M 132 320 C 68 402 56 528 64 618 L 108 612 C 102 530 110 420 148 354Z",
      R: "M 368 320 C 432 402 444 528 436 618 L 392 612 C 398 530 390 420 352 354Z",
    },
    excited: {
      L: "M 132 318 C 68 248 44 186 38 138 L 78 124 C 82 164 106 224 152 298Z",
      R: "M 368 318 C 432 248 456 186 462 138 L 422 124 C 418 164 394 224 348 298Z",
    },
    holdPhone: {
      L: "M 132 320 C 68 402 56 528 64 618 L 108 612 C 102 530 110 420 148 354Z",
      R: "M 368 318 C 410 280 432 240 438 192 L 396 178 C 392 222 374 260 348 296Z",
    },
    shrug: {
      L: "M 132 318 C 86 330 56 340 38 370 L 64 400 C 78 374 106 360 150 350Z",
      R: "M 368 318 C 414 330 444 340 462 370 L 436 400 C 422 374 394 360 350 350Z",
    },
    "arms-out": {
      L: "M 132 318 C 82 330 36 360 14 388 L 46 416 C 66 390 110 362 152 348Z",
      R: "M 368 318 C 418 330 464 360 486 388 L 454 416 C 434 390 390 362 348 348Z",
    },
  };

  const AL = arms[pose].L;
  const AR = arms[pose].R;

  // ── Hand positions per pose ────────────────────────────────────────────────
  const hands: Record<Pose, { lx: number; ly: number; rx: number; ry: number }> = {
    stand:       { lx: 82,  ly: 628, rx: 418, ry: 628 },
    excited:     { lx: 28,  ly: 132, rx: 472, ry: 132 },
    holdPhone:   { lx: 82,  ly: 628, rx: 440, ry: 182 },
    shrug:       { lx: 28,  ly: 410, rx: 472, ry: 410 },
    "arms-out":  { lx: 10,  ly: 428, rx: 490, ry: 428 },
  };
  const { lx, ly, rx, ry } = hands[pose];

  return (
    <svg
      width={size}
      height={h}
      viewBox="0 0 500 960"
      fill="none"
      style={{ filter: "drop-shadow(4px 8px 0px rgba(0,0,0,0.22))" }}
    >
      {/* ── HAIR (back) ── */}
      <ellipse cx="250" cy="148" rx="118" ry="110"
        fill="#1A0804" stroke={SH} strokeWidth={OUT - 1} />
      <path
        d="M 146 114 Q 174 48 250 44 Q 326 48 354 114 Q 312 76 250 74 Q 188 76 146 114Z"
        fill="#1A0804" stroke={SH} strokeWidth={OUT - 1} strokeLinejoin="round"
      />
      {/* side tufts */}
      <path d="M 138 148 Q 126 172 130 218 Q 136 238 150 234 Q 142 214 148 190 Q 138 172 138 148Z"
        fill="#1A0804" stroke={SH} strokeWidth={OUT - 1} />
      <path d="M 362 148 Q 374 172 370 218 Q 364 238 350 234 Q 358 214 352 190 Q 362 172 362 148Z"
        fill="#1A0804" stroke={SH} strokeWidth={OUT - 1} />

      {/* ── HEAD ── */}
      <ellipse cx="250" cy="162" rx="112" ry="116"
        fill="#F7C07C" stroke={SK} strokeWidth={OUT} />

      {/* ── EARS ── */}
      <ellipse cx="139" cy="174" rx="17" ry="23" fill="#EFA84A" stroke={SK} strokeWidth={OUT} />
      <ellipse cx="139" cy="174" rx="9"  ry="13" fill="#D88830" />
      <ellipse cx="361" cy="174" rx="17" ry="23" fill="#EFA84A" stroke={SK} strokeWidth={OUT} />
      <ellipse cx="361" cy="174" rx="9"  ry="13" fill="#D88830" />

      {/* ── EYES (cartoon — white + big pupil + shine) ── */}
      <circle cx="208" cy="178" r="26" fill="white"  stroke={SK} strokeWidth={OUT} />
      <circle cx="292" cy="178" r="26" fill="white"  stroke={SK} strokeWidth={OUT} />
      <circle cx="208" cy="182" r="17" fill="#111"   />
      <circle cx="292" cy="182" r="17" fill="#111"   />
      <circle cx="215" cy="173" r="7"  fill="white"  />
      <circle cx="299" cy="173" r="7"  fill="white"  />

      {/* ── EYEBROWS ── */}
      <path d="M 186 148 Q 208 137 228 145" stroke={SK} strokeWidth="8" fill="none" strokeLinecap="round" />
      <path d="M 272 145 Q 292 137 314 148" stroke={SK} strokeWidth="8" fill="none" strokeLinecap="round" />

      {/* ── NOSE ── */}
      <ellipse cx="250" cy="212" rx="9" ry="7" fill="#D07828" />

      {/* ── MOUTH ── */}
      {mouth === "happy" && (
        <path d="M 218 234 Q 250 264 282 234"
          stroke={SK} strokeWidth="6" fill="none" strokeLinecap="round" />
      )}
      {mouth === "open" && (
        <>
          <path d="M 218 234 Q 250 268 282 234" stroke={SK} strokeWidth="5" fill="none" strokeLinecap="round" />
          <ellipse cx="250" cy="248" rx="26" ry="16" fill="#111" />
          <ellipse cx="250" cy="252" rx="16" ry="8"  fill="#CC5028" />
        </>
      )}
      {mouth === "flat" && (
        <path d="M 224 244 L 276 244" stroke={SK} strokeWidth="6" fill="none" strokeLinecap="round" />
      )}
      {mouth === "smirk" && (
        <path d="M 232 244 Q 258 258 280 240" stroke={SK} strokeWidth="6" fill="none" strokeLinecap="round" />
      )}

      {/* ── NECK ── */}
      <rect x="228" y="262" width="44" height="46" rx="10"
        fill="#EFA84A" stroke={SK} strokeWidth={OUT} />

      {/* ── SHIRT BODY ── */}
      <path
        d="M 126 310 C 116 462 118 600 126 712 L 374 712
           C 382 600 384 462 374 310
           C 322 278 286 270 250 270
           C 214 270 178 278 126 310Z"
        fill={shirtColor} stroke="#1A1A1A" strokeWidth={OUT} strokeLinejoin="round"
      />
      {/* V-neck */}
      <path d="M 234 280 L 250 330 L 266 280"
        fill="rgba(0,0,0,0.08)" stroke="rgba(0,0,0,0.10)" strokeWidth="2" />

      {/* ── ARMS ── */}
      <path d={AL} fill={shirtColor} stroke="#1A1A1A" strokeWidth={OUT} strokeLinejoin="round" />
      <path d={AR} fill={shirtColor} stroke="#1A1A1A" strokeWidth={OUT} strokeLinejoin="round" />

      {/* ── HANDS ── */}
      <circle cx={lx} cy={ly} r="27" fill="#EFA84A" stroke={SK} strokeWidth={OUT} />
      <circle cx={rx} cy={ry} r="27" fill="#EFA84A" stroke={SK} strokeWidth={OUT} />

      {/* ── PANTS ── */}
      <path d="M 250 702 L 262 952 L 368 952 C 370 862 366 774 358 702Z"
        fill="#2A4088" stroke="#101830" strokeWidth={OUT} strokeLinejoin="round" />
      <path d="M 250 702 L 238 952 L 132 952 C 130 862 134 774 142 702Z"
        fill="#2A4088" stroke="#101830" strokeWidth={OUT} strokeLinejoin="round" />
      {/* Belt */}
      <rect x="128" y="694" width="244" height="22" rx="8"
        fill="#111820" stroke="#080C18" strokeWidth="3" />
      <rect x="232" y="696" width="36" height="16" rx="4" fill="#6080A0" />

      {/* ── SHOES ── */}
      <path d="M 104 936 Q 162 916 220 936 L 222 958 Q 162 974 100 958Z"
        fill="#F4F0E6" stroke="#222018" strokeWidth={OUT} strokeLinejoin="round" />
      <path d="M 280 936 Q 340 916 396 936 L 394 958 Q 340 974 276 958Z"
        fill="#F4F0E6" stroke="#222018" strokeWidth={OUT} strokeLinejoin="round" />
    </svg>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// PROPS — scene elements
// ─────────────────────────────────────────────────────────────────────────────

function BrowserWindow() {
  // A floating browser with TONS of tiny tabs
  const tabs = Array.from({ length: 18 });
  return (
    <svg width="520" height="360" viewBox="0 0 520 360" fill="none"
      style={{ filter: "drop-shadow(6px 8px 0px rgba(0,0,0,0.25))" }}>
      {/* Window */}
      <rect x="4" y="4" width="512" height="352" rx="16" fill="#E8EEF8" stroke="#1A1A2A" strokeWidth="5" />
      {/* Title bar */}
      <rect x="4" y="4" width="512" height="46" rx="16" fill="#C8D0E8" stroke="#1A1A2A" strokeWidth="5" />
      <rect x="4" y="28" width="512" height="22" fill="#C8D0E8" />
      {/* Traffic lights */}
      <circle cx="32" cy="26" r="10" fill="#FF5F57" stroke="#1A1A2A" strokeWidth="3" />
      <circle cx="60" cy="26" r="10" fill="#FEBC2E" stroke="#1A1A2A" strokeWidth="3" />
      <circle cx="88" cy="26" r="10" fill="#28C840" stroke="#1A1A2A" strokeWidth="3" />
      {/* Tab row */}
      {tabs.map((_, i) => {
        const x = 10 + i * 27;
        const active = i === 3;
        return (
          <g key={i}>
            <rect x={x} y={48} width="24" height="20" rx="5"
              fill={active ? "#FFFFFF" : "#D0DAF0"} stroke="#1A1A2A" strokeWidth="2.5" />
            {/* Favicon dot */}
            <rect x={x + 4} y={54} width="7" height="7" rx="2"
              fill={active ? "#4A80E0" : "#8898C0"} />
          </g>
        );
      })}
      {/* "18 MORE TABS" badge */}
      <rect x="200" y="132" width="120" height="44" rx="12" fill="#FF4848" stroke="#1A1A2A" strokeWidth="4" />
      <text x="260" y="161" fontFamily="Arial Black" fontWeight="900" fontSize="18" fill="white" textAnchor="middle">
        +847 tabs
      </text>
      {/* Content lines */}
      <rect x="28" y="98" width="464" height="18" rx="6" fill="#D0D8EC" />
      <rect x="28" y="126" width="320" height="18" rx="6" fill="#D0D8EC" />
      <rect x="28" y="200" width="464" height="14" rx="5" fill="#D8E0F0" />
      <rect x="28" y="222" width="380" height="14" rx="5" fill="#D8E0F0" />
      <rect x="28" y="244" width="260" height="14" rx="5" fill="#D8E0F0" />
      <rect x="28" y="280" width="464" height="14" rx="5" fill="#D8E0F0" />
      <rect x="28" y="302" width="400" height="14" rx="5" fill="#D8E0F0" />
    </svg>
  );
}

function TodoList() {
  const items = [
    { text: "Start project report",  done: false },
    { text: "Reply to 47 emails",    done: false },
    { text: "Clean the kitchen",     done: false },
    { text: "Actually start report", done: false },
    { text: "Do literally anything", done: false },
  ];
  return (
    <svg width="400" height="360" viewBox="0 0 400 360" fill="none"
      style={{ filter: "drop-shadow(6px 8px 0px rgba(0,0,0,0.25))", transform: "rotate(-4deg)" }}>
      {/* Paper */}
      <rect x="4" y="4" width="392" height="352" rx="16" fill="#FFFDE6" stroke="#1A1A2A" strokeWidth="5" />
      {/* Ruled lines */}
      {[0,1,2,3,4,5,6].map(i => (
        <line key={i} x1="20" y1={68 + i * 42} x2="380" y2={68 + i * 42}
          stroke="#E0D8B0" strokeWidth="2" />
      ))}
      {/* Title */}
      <text x="200" y="46" fontFamily="Arial Black" fontWeight="900" fontSize="22" fill="#111" textAnchor="middle">
        TO DO TODAY
      </text>
      {/* Items */}
      {items.map((item, i) => (
        <g key={i}>
          <rect x="28" y={72 + i * 42} width="24" height="24" rx="5"
            fill="white" stroke="#1A1A2A" strokeWidth="3" />
          <text x="68" y={90 + i * 42} fontFamily="Arial" fontWeight="700" fontSize="17"
            fill={item.done ? "#888" : "#111"}
            textDecoration={item.done ? "line-through" : "none"}>
            {item.text}
          </text>
        </g>
      ))}
    </svg>
  );
}

function ClockProp({ time = "3:00" }: { time?: string }) {
  // parse hours/minutes
  const [h, m] = time.split(":").map(Number);
  const hourAngle = (h % 12) * 30 + m * 0.5 - 90;
  const minAngle  = m * 6 - 90;
  const toRad = (deg: number) => (deg * Math.PI) / 180;

  const hourX = 100 + Math.cos(toRad(hourAngle)) * 50;
  const hourY = 100 + Math.sin(toRad(hourAngle)) * 50;
  const minX  = 100 + Math.cos(toRad(minAngle))  * 72;
  const minY  = 100 + Math.sin(toRad(minAngle))  * 72;

  return (
    <svg width="200" height="200" viewBox="0 0 200 200" fill="none"
      style={{ filter: "drop-shadow(4px 6px 0px rgba(0,0,0,0.25))" }}>
      <circle cx="100" cy="100" r="95" fill="#FFF8E0" stroke="#1A1A2A" strokeWidth="8" />
      <circle cx="100" cy="100" r="86" fill="none"   stroke="#E0D8B0" strokeWidth="3" />
      {/* Tick marks */}
      {Array.from({ length: 12 }).map((_, i) => {
        const a  = i * 30 - 90;
        const r1 = 78, r2 = 90;
        return (
          <line key={i}
            x1={100 + Math.cos(toRad(a)) * r1} y1={100 + Math.sin(toRad(a)) * r1}
            x2={100 + Math.cos(toRad(a)) * r2} y2={100 + Math.sin(toRad(a)) * r2}
            stroke="#1A1A2A" strokeWidth="4" strokeLinecap="round"
          />
        );
      })}
      {/* Hour hand */}
      <line x1="100" y1="100" x2={hourX} y2={hourY}
        stroke="#1A1A2A" strokeWidth="8" strokeLinecap="round" />
      {/* Minute hand */}
      <line x1="100" y1="100" x2={minX} y2={minY}
        stroke="#1A1A2A" strokeWidth="5" strokeLinecap="round" />
      {/* Center */}
      <circle cx="100" cy="100" r="8" fill="#1A1A2A" />
    </svg>
  );
}

function PhoneProp() {
  return (
    <svg width="280" height="480" viewBox="0 0 280 480" fill="none"
      style={{ filter: "drop-shadow(6px 8px 0px rgba(0,0,0,0.30))" }}>
      {/* Phone body */}
      <rect x="8" y="8" width="264" height="464" rx="36" fill="#1A1A2A" stroke="#1A1A2A" strokeWidth="8" />
      <rect x="20" y="20" width="240" height="440" rx="28" fill="#F0F4FF" />
      {/* Camera notch */}
      <rect x="100" y="28" width="80" height="20" rx="10" fill="#1A1A2A" />
      {/* Chat bubbles */}
      {/* Sent (grey, them) */}
      <rect x="36" y="80"  width="160" height="50" rx="18" fill="#E0E4EE" stroke="#C8CCDE" strokeWidth="2" />
      <text x="54" y="111" fontFamily="Arial" fontWeight="700" fontSize="16" fill="#444">hey you free tonight?</text>
      <text x="54" y="128" fontFamily="Arial" fontSize="13" fill="#AAA">Mon 7:14pm</text>

      <rect x="36" y="146" width="130" height="50" rx="18" fill="#E0E4EE" stroke="#C8CCDE" strokeWidth="2" />
      <text x="54" y="178" fontFamily="Arial" fontWeight="700" fontSize="16" fill="#444">helloo?? 👀</text>
      <text x="54" y="192" fontFamily="Arial" fontSize="13" fill="#AAA">Tue 10:02am</text>

      {/* Date divider */}
      <text x="140" y="226" fontFamily="Arial" fontWeight="700" fontSize="14" fill="#888" textAnchor="middle">
        — 3 WEEKS LATER —
      </text>

      {/* Reply bubble (blue, you) */}
      <rect x="64" y="242" width="180" height="50" rx="18" fill="#3B7FF0" />
      <text x="82" y="272" fontFamily="Arial" fontWeight="700" fontSize="16" fill="white">sorry just saw this!!</text>

      {/* Read receipt */}
      <text x="222" y="305" fontFamily="Arial" fontWeight="700" fontSize="14" fill="#3B7FF0" textAnchor="end">
        Read 3 weeks ago
      </text>

      {/* Typing indicator */}
      <rect x="36" y="318" width="80" height="44" rx="18" fill="#E0E4EE" />
      <circle cx="60"  cy="340" r="7" fill="#888" />
      <circle cx="80"  cy="340" r="7" fill="#888" />
      <circle cx="100" cy="340" r="7" fill="#888" />

      {/* Input bar */}
      <rect x="28" y="390" width="224" height="50" rx="25" fill="#E8ECF8" stroke="#C8CCDE" strokeWidth="2" />
      <text x="54" y="422" fontFamily="Arial" fontSize="16" fill="#AAA">Message...</text>
      <circle cx="232" cy="415" r="18" fill="#3B7FF0" />
      <path d="M 224 415 L 240 415 M 233 408 L 240 415 L 233 422"
        stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </svg>
  );
}

function LightningBolt({ x = 0, y = 0, scale = 1, color = "#FFE14D" }: {
  x?: number; y?: number; scale?: number; color?: string;
}) {
  return (
    <g transform={`translate(${x},${y}) scale(${scale})`}>
      <path d="M 30 0 L 8 46 L 24 46 L 0 90 L 52 32 L 34 32 Z"
        fill={color} stroke="#1A1A2A" strokeWidth={6 / scale} strokeLinejoin="round" />
    </g>
  );
}

function MoonScene() {
  return (
    <svg width="600" height="500" viewBox="0 0 600 500" fill="none">
      {/* Big crescent moon */}
      <circle cx="290" cy="180" r="160" fill="#FFE680" stroke="#1A1A2A" strokeWidth="6" />
      <circle cx="352" cy="150" r="136" fill="#0D1A3A" />
      {/* Moon face */}
      <circle cx="222" cy="170" r="16" fill="#1A1A2A" />
      <circle cx="272" cy="210" r="12" fill="#1A1A2A" />
      <path d="M 210 210 Q 228 228 248 214" stroke="#1A1A2A" strokeWidth="5" fill="none" strokeLinecap="round" />
      {/* Stars */}
      {[
        [490, 40],  [520, 110], [440, 80], [560, 160],
        [60,  60],  [30,  130], [90, 160], [500, 260],
        [410, 380], [540, 340], [70, 290], [150, 380],
      ].map(([sx, sy], i) => (
        <g key={i} transform={`translate(${sx},${sy})`}>
          <path d="M 0 -12 L 3 -3 L 12 0 L 3 3 L 0 12 L -3 3 L -12 0 L -3 -3Z"
            fill="#FFE680" stroke="#1A1A2A" strokeWidth="2" />
        </g>
      ))}
      {/* 2:00 AM clock in corner */}
      <g transform="translate(420, 300)">
        <rect x="0" y="0" width="160" height="80" rx="16" fill="#1A2A4A" stroke="#1A1A2A" strokeWidth="4" />
        <text x="80" y="52" fontFamily="Courier New" fontWeight="900" fontSize="40" fill="#4ACCE8" textAnchor="middle">
          2:00
        </text>
        <text x="80" y="70" fontFamily="Arial" fontWeight="700" fontSize="13" fill="#4ACCE8" textAnchor="middle" opacity="0.6">
          AM
        </text>
      </g>
      {/* ZZZ */}
      <text x="488" y="220" fontFamily="Arial Black" fontWeight="900" fontSize="28" fill="#FFE680" stroke="#1A1A2A" strokeWidth="3">
        zzz
      </text>
    </svg>
  );
}

function BrainThoughtBubble() {
  return (
    <svg width="500" height="420" viewBox="0 0 500 420" fill="none">
      {/* Thought chain */}
      <circle cx="80" cy="390" r="10" fill="white" stroke="#1A1A2A" strokeWidth="4" />
      <circle cx="108" cy="368" r="14" fill="white" stroke="#1A1A2A" strokeWidth="4" />
      <circle cx="142" cy="340" r="18" fill="white" stroke="#1A1A2A" strokeWidth="4" />
      {/* Main bubble */}
      <ellipse cx="300" cy="200" rx="192" ry="174"
        fill="white" stroke="#1A1A2A" strokeWidth="6" />
      {/* Chaos inside the bubble */}
      {/* Mini tab */}
      <rect x="130" y="80"  width="80" height="56" rx="8" fill="#4A90E2" stroke="#1A1A2A" strokeWidth="3" />
      <rect x="130" y="68"  width="28" height="16" rx="4" fill="#4A90E2" stroke="#1A1A2A" strokeWidth="3" />
      <text x="170" y="116" fontFamily="Arial Black" fontSize="14" fill="white" textAnchor="middle">Tab</text>

      {/* Clock */}
      <circle cx="304" cy="100" r="38" fill="#FFE14D" stroke="#1A1A2A" strokeWidth="4" />
      <line x1="304" y1="100" x2="304" y2="72" stroke="#1A1A2A" strokeWidth="5" strokeLinecap="round" />
      <line x1="304" y1="100" x2="324" y2="110" stroke="#1A1A2A" strokeWidth="4" strokeLinecap="round" />
      <circle cx="304" cy="100" r="5" fill="#1A1A2A" />

      {/* Phone */}
      <rect x="368" y="88" width="48" height="84" rx="10" fill="#1A1A2A" stroke="#1A1A2A" strokeWidth="3" />
      <rect x="373" y="98" width="38" height="62" rx="6" fill="#4ACCE8" />
      <text x="392" y="132" fontFamily="Arial" fontWeight="900" fontSize="10" fill="#1A1A2A" textAnchor="middle">msg</text>

      {/* Wavy lines = overwhelm */}
      <path d="M 148 198 Q 166 182 184 198 Q 202 214 220 198" stroke="#FF6B6B" strokeWidth="5" fill="none" strokeLinecap="round" />
      <path d="M 148 222 Q 166 206 184 222 Q 202 238 220 222" stroke="#FF6B6B" strokeWidth="5" fill="none" strokeLinecap="round" />

      {/* Lightning */}
      <path d="M 270 170 L 256 208 L 268 208 L 252 248 L 288 200 L 273 200Z"
        fill="#FFE14D" stroke="#1A1A2A" strokeWidth="3" strokeLinejoin="round" />

      {/* Question marks */}
      <text x="330" y="240" fontFamily="Arial Black" fontWeight="900" fontSize="46" fill="#FF6B6B" stroke="#1A1A2A" strokeWidth="3">?</text>
      <text x="370" y="210" fontFamily="Arial Black" fontWeight="900" fontSize="32" fill="#C77DFF" stroke="#1A1A2A" strokeWidth="2">!</text>
    </svg>
  );
}

function EmotionCloud() {
  return (
    <svg width="640" height="560" viewBox="0 0 640 560" fill="none">
      {/* Big lightning bolts */}
      <g transform="translate(20, 80) rotate(-15)">
        <path d="M 40 0 L 10 60 L 30 60 L 0 120 L 66 42 L 42 42Z"
          fill="#FFE14D" stroke="#1A1A2A" strokeWidth="6" strokeLinejoin="round" />
      </g>
      <g transform="translate(530, 60) rotate(18)">
        <path d="M 40 0 L 10 60 L 30 60 L 0 120 L 66 42 L 42 42Z"
          fill="#FF6B6B" stroke="#1A1A2A" strokeWidth="6" strokeLinejoin="round" />
      </g>
      <g transform="translate(60, 340) rotate(10)">
        <path d="M 28 0 L 7 42 L 21 42 L 0 84 L 46 29 L 29 29Z"
          fill="#C77DFF" stroke="#1A1A2A" strokeWidth="5" strokeLinejoin="round" />
      </g>
      <g transform="translate(540, 360) rotate(-12)">
        <path d="M 28 0 L 7 42 L 21 42 L 0 84 L 46 29 L 29 29Z"
          fill="#FFE14D" stroke="#1A1A2A" strokeWidth="5" strokeLinejoin="round" />
      </g>
      {/* Heart */}
      <path d="M 300 60 C 300 40 272 28 258 46 C 246 62 258 80 300 112
               C 342 80 354 62 342 46 C 328 28 300 40 300 60Z"
        fill="#FF6B6B" stroke="#1A1A2A" strokeWidth="6" />
      {/* Fire */}
      <g transform="translate(480, 290) scale(0.9)">
        <path d="M 40 90 C 40 90 10 70 20 40 C 28 18 40 10 40 10
                 C 40 10 36 30 50 36 C 46 18 58 0 58 0
                 C 58 0 80 28 68 56 C 78 48 80 36 76 26
                 C 92 46 90 72 72 84 C 70 74 60 68 60 68
                 C 68 82 62 96 40 90Z"
          fill="#FF9A3C" stroke="#1A1A2A" strokeWidth="5" strokeLinejoin="round" />
      </g>
      {/* Stars / sparkles */}
      {([[90, 200], [548, 220], [300, 480]] as [number,number][]).map(([sx, sy], i) => (
        <g key={i} transform={`translate(${sx},${sy})`}>
          <path d="M 0 -20 L 5 -5 L 20 0 L 5 5 L 0 20 L -5 5 L -20 0 L -5 -5Z"
            fill="#FFE14D" stroke="#1A1A2A" strokeWidth="3" />
        </g>
      ))}
    </svg>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// SLIDE WRAPPER
// ─────────────────────────────────────────────────────────────────────────────

function Slide({
  bg,
  textColor = "#111",
  topLine1,
  topLine2,
  bottomLine1,
  bottomLine2,
  children,
  num,
  total = 6,
}: {
  bg:          string;
  textColor?:  string;
  topLine1:    string;
  topLine2?:   string;
  bottomLine1: string;
  bottomLine2?: string;
  children:    React.ReactNode;
  num:         number;
  total?:      number;
}) {
  const fs = 76;
  const lh = 1.18;
  return (
    <div style={{
      width: 1080, height: 1920,
      background: bg,
      position: "relative", overflow: "hidden",
      fontFamily: "var(--font-sans)",
    }}>
      {children}

      {/* Top text */}
      <div style={{
        position: "absolute", top: 72, left: 64, right: 64,
        textAlign: "center",
      }}>
        <p style={{
          fontSize: fs, fontWeight: 700, color: textColor,
          lineHeight: lh, margin: 0,
        }}>
          {topLine1}
          {topLine2 && <><br />{topLine2}</>}
        </p>
      </div>

      {/* Bottom text */}
      <div style={{
        position: "absolute", bottom: 64, left: 64, right: 64,
        textAlign: "center",
      }}>
        <p style={{
          fontSize: fs, fontWeight: 700, color: textColor,
          lineHeight: lh, margin: 0,
        }}>
          {bottomLine1}
          {bottomLine2 && <><br />{bottomLine2}</>}
        </p>
      </div>

      {/* Counter */}
      <p style={{
        position: "absolute", bottom: 26, right: 64,
        fontSize: 15, fontWeight: 700, margin: 0,
        color: textColor, opacity: 0.3, letterSpacing: "0.04em",
      }}>
        {num} / {total}
      </p>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// PAGE
// ─────────────────────────────────────────────────────────────────────────────

export default function AdhdSigns2() {
  return (
    <div className={sans.variable}
      style={{ background: "#111", display: "flex", flexDirection: "column", gap: 4 }}>

      {/* ── 1 HOOK ── yellow bg, thought bubble ───────────────────────── */}
      <Slide bg="#FFE14D" textColor="#111"
        topLine1="Signs you might have ADHD"
        bottomLine1="(not laziness, I promise)"
        num={1}>
        {/* Thought bubble top-right */}
        <div style={{ position: "absolute", top: 220, right: -40, zIndex: 2, lineHeight: 0 }}>
          <BrainThoughtBubble />
        </div>
        {/* Guy left of center, looking toward bubble */}
        <div style={{
          position: "absolute", bottom: 180, left: "50%",
          transform: "translateX(-62%)", lineHeight: 0, zIndex: 3,
        }}>
          <CartoonGuy shirtColor="#FFFFFF" pose="stand" mouth="smirk" size={580} />
        </div>
        {/* Ground shadow */}
        <div style={{
          position: "absolute", bottom: 208,
          left: "50%", transform: "translateX(-68%)",
          width: 420, height: 36,
          background: "rgba(0,0,0,0.12)",
          borderRadius: "50%", filter: "blur(10px)",
        }} />
      </Slide>

      {/* ── 2 TABS ── blue bg, browser window ─────────────────────────── */}
      <Slide bg="#74C2E8" textColor="#111"
        topLine1="You have 847 browser tabs open"
        bottomLine1='"just in case you need them later"'
        num={2}>
        {/* Browser in background */}
        <div style={{
          position: "absolute", top: 230, left: "50%",
          transform: "translateX(-50%) rotate(-3deg)",
          lineHeight: 0, zIndex: 1,
        }}>
          <BrowserWindow />
        </div>
        {/* Guy in front */}
        <div style={{
          position: "absolute", bottom: 160, left: "50%",
          transform: "translateX(-54%)", lineHeight: 0, zIndex: 3,
        }}>
          <CartoonGuy shirtColor="#FF7043" pose="shrug" mouth="open" size={560} />
        </div>
        <div style={{
          position: "absolute", bottom: 192,
          left: "50%", transform: "translateX(-60%)",
          width: 400, height: 36,
          background: "rgba(0,0,0,0.15)",
          borderRadius: "50%", filter: "blur(10px)", zIndex: 2,
        }} />
      </Slide>

      {/* ── 3 PROCRASTINATION ── orange bg, todo list ─────────────────── */}
      <Slide bg="#FF7043" textColor="#FFFFFF"
        topLine1="You've been 'about to start'"
        topLine2="for 3 hours."
        bottomLine1="You haven't moved."
        num={3}>
        {/* Todo list left side */}
        <div style={{
          position: "absolute", top: 310, left: -30,
          lineHeight: 0, zIndex: 2,
          transform: "rotate(4deg)",
        }}>
          <TodoList />
        </div>
        {/* Clock right side */}
        <div style={{
          position: "absolute", top: 520, right: 60,
          lineHeight: 0, zIndex: 2,
        }}>
          <ClockProp time="3:00" />
        </div>
        {/* Guy center */}
        <div style={{
          position: "absolute", bottom: 160, left: "50%",
          transform: "translateX(-46%)", lineHeight: 0, zIndex: 3,
        }}>
          <CartoonGuy shirtColor="#FFDE59" pose="stand" mouth="flat" size={560} />
        </div>
        <div style={{
          position: "absolute", bottom: 190,
          left: "50%", transform: "translateX(-52%)",
          width: 400, height: 36,
          background: "rgba(0,0,0,0.20)",
          borderRadius: "50%", filter: "blur(10px)", zIndex: 2,
        }} />
      </Slide>

      {/* ── 4 TEXTING ── mint bg, phone prop ──────────────────────────── */}
      <Slide bg="#A8E8C8" textColor="#111"
        topLine1="You reply in 0.3 seconds"
        bottomLine1="or completely forget someone exists for 6 weeks."
        num={4}>
        {/* Phone right side */}
        <div style={{
          position: "absolute", top: 290, right: 60,
          lineHeight: 0, zIndex: 2,
        }}>
          <PhoneProp />
        </div>
        {/* Guy left-ish */}
        <div style={{
          position: "absolute", bottom: 160, left: "50%",
          transform: "translateX(-70%)", lineHeight: 0, zIndex: 3,
        }}>
          <CartoonGuy shirtColor="#9B59B6" pose="holdPhone" mouth="open" size={560} />
        </div>
        <div style={{
          position: "absolute", bottom: 192,
          left: "50%", transform: "translateX(-76%)",
          width: 400, height: 36,
          background: "rgba(0,0,0,0.12)",
          borderRadius: "50%", filter: "blur(10px)", zIndex: 2,
        }} />
      </Slide>

      {/* ── 5 2AM ── dark bg, moon stars ──────────────────────────────── */}
      <Slide bg="#0D1A3A" textColor="#FFFFFF"
        topLine1="On fire at 2am."
        bottomLine1="Completely offline at 10am when you need to function."
        num={5}>
        {/* Moon scene fills background */}
        <div style={{
          position: "absolute", top: 160, left: "50%",
          transform: "translateX(-50%)", lineHeight: 0, zIndex: 1,
        }}>
          <MoonScene />
        </div>
        {/* Guy */}
        <div style={{
          position: "absolute", bottom: 156, left: "50%",
          transform: "translateX(-50%)", lineHeight: 0, zIndex: 3,
        }}>
          <CartoonGuy shirtColor="#1A2840" pose="excited" mouth="open" size={560} />
        </div>
        <div style={{
          position: "absolute", bottom: 188,
          left: "50%", transform: "translateX(-50%)",
          width: 420, height: 40,
          background: "rgba(255,255,255,0.06)",
          borderRadius: "50%", filter: "blur(12px)", zIndex: 2,
        }} />
      </Slide>

      {/* ── 6 FEELINGS ── purple bg, lightning ────────────────────────── */}
      <Slide bg="#C77DFF" textColor="#111"
        topLine1="You don't feel things a little."
        bottomLine1="You feel everything at full volume, all at once."
        num={6}>
        {/* Emotion cloud behind */}
        <div style={{
          position: "absolute", top: 200, left: "50%",
          transform: "translateX(-50%)", lineHeight: 0, zIndex: 1,
        }}>
          <EmotionCloud />
        </div>
        {/* Guy in front */}
        <div style={{
          position: "absolute", bottom: 160, left: "50%",
          transform: "translateX(-50%)", lineHeight: 0, zIndex: 3,
        }}>
          <CartoonGuy shirtColor="#FF6B6B" pose="arms-out" mouth="open" size={560} />
        </div>
        <div style={{
          position: "absolute", bottom: 192,
          left: "50%", transform: "translateX(-50%)",
          width: 420, height: 36,
          background: "rgba(0,0,0,0.14)",
          borderRadius: "50%", filter: "blur(10px)", zIndex: 2,
        }} />
      </Slide>

      {/* ── 7 CTA ── teal bg ───────────────────────────────────────────── */}
      <div style={{
        width: 1080, height: 1920,
        background: "#00BFA5",
        position: "relative", overflow: "hidden",
        fontFamily: "var(--font-sans)",
      }}>
        {/* Big decorative shapes */}
        <div style={{
          position: "absolute", top: -120, right: -120,
          width: 580, height: 580, borderRadius: "50%",
          background: "rgba(255,255,255,0.15)",
        }} />
        <div style={{
          position: "absolute", bottom: -180, left: -100,
          width: 700, height: 700, borderRadius: "50%",
          background: "rgba(255,255,255,0.10)",
        }} />

        {/* Top text */}
        <div style={{
          position: "absolute", top: 90, left: 64, right: 64, textAlign: "center",
        }}>
          <p style={{ fontSize: 78, fontWeight: 700, color: "#111", lineHeight: 1.15, margin: 0 }}>
            Your brain isn't broken.
          </p>
        </div>

        {/* Guy */}
        <div style={{
          position: "absolute", bottom: 350, left: "50%",
          transform: "translateX(-50%)", lineHeight: 0, zIndex: 2,
        }}>
          <CartoonGuy shirtColor="#FFFFFF" pose="excited" mouth="open" size={580} />
        </div>
        <div style={{
          position: "absolute", bottom: 380,
          left: "50%", transform: "translateX(-50%)",
          width: 440, height: 40,
          background: "rgba(0,0,0,0.14)",
          borderRadius: "50%", filter: "blur(12px)", zIndex: 1,
        }} />

        {/* CTA Block */}
        <div style={{
          position: "absolute", bottom: 72, left: 64, right: 64, textAlign: "center",
        }}>
          <p style={{ fontSize: 72, fontWeight: 700, color: "#111", lineHeight: 1.15, margin: "0 0 40px" }}>
            It just needs the right system.
          </p>
          <div style={{
            display: "inline-flex", alignItems: "center", justifyContent: "center",
            background: "#111", borderRadius: 80, padding: "28px 88px",
            marginBottom: 28,
            boxShadow: "6px 8px 0px rgba(0,0,0,0.35)",
          }}>
            <span style={{ fontSize: 54, fontWeight: 700, color: "#FFFFFF", letterSpacing: "-0.01em" }}>
              hyperfix.app
            </span>
          </div>
          <p style={{ fontSize: 30, fontWeight: 700, color: "rgba(0,0,0,0.40)", margin: 0, letterSpacing: "0.05em" }}>
            Free forever · No account needed
          </p>
        </div>
      </div>

    </div>
  );
}
