import type { Metadata } from "next";
import { Instrument_Sans } from "next/font/google";

export const metadata: Metadata = {
  title: "Hyperfix — Best Jobs ADHD",
  robots: { index: false, follow: false },
};

const sans = Instrument_Sans({
  subsets: ["latin"],
  weight: ["700"],
  display: "swap",
  variable: "--font-sans",
});

const BG    = "#0B2A0B";
const CREAM = "#EDD99A";
const SKIN  = "#C07840";
const SKD   = "#9A5A22";
const OL    = "#111111";
const OW    = 5;

// ── Flat editorial character ──────────────────────────────────────────────────

type Mood = "neutral" | "happy" | "excited" | "confident";

function Guy({
  shirt  = "#2D6A2D",
  pants  = "#7A5C30",
  size   = 420,
  mood   = "neutral" as Mood,
  hat    = "none" as "none" | "cap" | "helmet" | "beanie",
}) {
  const h = Math.round(size * 1.64);

  return (
    <svg width={size} height={h} viewBox="0 0 500 820" fill="none"
      style={{ filter: "drop-shadow(0 14px 0px rgba(0,0,0,0.45))" }}>

      {/* ── HAIR / HAT ── */}
      {hat === "none" && (
        <path d="M 160 162 Q 164 58 250 52 Q 336 58 340 162 Q 298 108 250 106 Q 202 108 160 162Z"
          fill="#1C0C04" stroke="#0A0402" strokeWidth="3" />
      )}
      {hat === "cap" && (
        <>
          <path d="M 160 170 Q 164 60 250 54 Q 336 60 340 170 Q 298 112 250 110 Q 202 112 160 170Z"
            fill="#F0E8C8" stroke={OL} strokeWidth={OW} />
          <ellipse cx="250" cy="110" rx="102" ry="24" fill="#D8CCA8" stroke={OL} strokeWidth="4" />
          <path d="M 156 176 Q 152 190 138 188 Q 146 174 162 176Z" fill="#F0E8C8" stroke={OL} strokeWidth="4" />
        </>
      )}
      {hat === "helmet" && (
        <>
          <path d="M 148 170 Q 148 52 250 46 Q 352 52 352 170 Q 316 124 250 122 Q 184 124 148 170Z"
            fill="#D03020" stroke={OL} strokeWidth={OW} />
          <rect x="144" y="166" width="212" height="22" rx="8" fill="#B02010" stroke={OL} strokeWidth="4" />
          <path d="M 142 186 Q 136 200 132 218 L 152 224 Q 154 208 162 196Z" fill="#D03020" stroke={OL} strokeWidth="4" />
          <path d="M 358 186 Q 364 200 368 218 L 348 224 Q 346 208 338 196Z" fill="#D03020" stroke={OL} strokeWidth="4" />
        </>
      )}
      {hat === "beanie" && (
        <>
          <path d="M 158 168 Q 158 58 250 52 Q 342 58 342 168 Q 302 120 250 118 Q 198 120 158 168Z"
            fill="#3A5A8A" stroke={OL} strokeWidth={OW} />
          <rect x="152" y="162" width="196" height="26" rx="8" fill="#2A4A7A" stroke={OL} strokeWidth="4" />
          <circle cx="250" cy="56" r="18" fill="#3A5A8A" stroke={OL} strokeWidth="4" />
        </>
      )}

      {/* ── HEAD ── */}
      <ellipse cx="250" cy="180" rx="92" ry="98" fill={SKIN} stroke={OL} strokeWidth={OW} />

      {/* ── EARS ── */}
      <ellipse cx="159" cy="190" rx="14" ry="18" fill={SKD} stroke={OL} strokeWidth={OW} />
      <ellipse cx="341" cy="190" rx="14" ry="18" fill={SKD} stroke={OL} strokeWidth={OW} />

      {/* ── EYES ── */}
      <ellipse cx="218" cy="182" rx="11" ry="13" fill={OL} />
      <ellipse cx="282" cy="182" rx="11" ry="13" fill={OL} />
      <ellipse cx="221" cy="177" rx="4"  ry="4"  fill="white" />
      <ellipse cx="285" cy="177" rx="4"  ry="4"  fill="white" />

      {/* ── EYEBROWS ── */}
      {mood === "confident" ? <>
        <path d="M 202 156 Q 218 148 232 154" stroke={OL} strokeWidth="6" fill="none" strokeLinecap="round" />
        <path d="M 268 154 Q 282 148 298 156" stroke={OL} strokeWidth="6" fill="none" strokeLinecap="round" />
      </> : mood === "excited" ? <>
        <path d="M 202 152 Q 218 142 232 150" stroke={OL} strokeWidth="6" fill="none" strokeLinecap="round" />
        <path d="M 268 150 Q 282 142 298 152" stroke={OL} strokeWidth="6" fill="none" strokeLinecap="round" />
      </> : <>
        <path d="M 204 160 Q 218 152 232 157" stroke={OL} strokeWidth="5.5" fill="none" strokeLinecap="round" />
        <path d="M 268 157 Q 282 152 296 160" stroke={OL} strokeWidth="5.5" fill="none" strokeLinecap="round" />
      </>}

      {/* ── NOSE ── */}
      <path d="M 243 205 Q 250 218 257 205" stroke={SKD} strokeWidth="3.5" fill="none" strokeLinecap="round" />

      {/* ── MOUTH ── */}
      {mood === "happy" && <path d="M 220 232 Q 250 258 280 232" stroke={OL} strokeWidth="5" fill="none" strokeLinecap="round" />}
      {mood === "excited" && <>
        <path d="M 216 228 Q 250 262 284 228" stroke={OL} strokeWidth="5" fill="none" strokeLinecap="round" />
        <ellipse cx="250" cy="244" rx="22" ry="14" fill={OL} />
        <ellipse cx="250" cy="249" rx="14" ry="8"  fill="#A84020" />
      </>}
      {mood === "confident" && <path d="M 234 236 Q 260 256 280 232" stroke={OL} strokeWidth="5" fill="none" strokeLinecap="round" />}
      {mood === "neutral" && <path d="M 226 238 Q 250 250 274 238" stroke={OL} strokeWidth="5" fill="none" strokeLinecap="round" />}

      {/* ── NECK ── */}
      <rect x="228" y="270" width="44" height="42" rx="10" fill={SKD} stroke={OL} strokeWidth={OW} />

      {/* ── BODY ── */}
      <path d="M 132 318 L 150 530 L 350 530 L 368 318 Q 322 290 250 286 Q 178 290 132 318Z"
        fill={shirt} stroke={OL} strokeWidth={OW} strokeLinejoin="round" />

      {/* ── ARMS ── */}
      <path d="M 134 330 C 74 408 56 514 62 594 L 104 588 C 100 512 112 414 152 346Z"
        fill={shirt} stroke={OL} strokeWidth={OW} strokeLinejoin="round" />
      <path d="M 366 330 C 426 408 444 514 438 594 L 396 588 C 400 512 388 414 348 346Z"
        fill={shirt} stroke={OL} strokeWidth={OW} strokeLinejoin="round" />

      {/* ── HANDS ── */}
      <ellipse cx="82"  cy="604" rx="24" ry="22" fill={SKIN} stroke={OL} strokeWidth={OW} />
      <ellipse cx="418" cy="604" rx="24" ry="22" fill={SKIN} stroke={OL} strokeWidth={OW} />

      {/* ── PANTS ── */}
      <path d="M 250 522 L 260 790 L 338 790 L 334 522Z"
        fill={pants} stroke={OL} strokeWidth={OW} strokeLinejoin="round" />
      <path d="M 250 522 L 240 790 L 162 790 L 166 522Z"
        fill={pants} stroke={OL} strokeWidth={OW} strokeLinejoin="round" />

      {/* ── BELT ── */}
      <rect x="148" y="518" width="204" height="20" rx="6" fill="#2A1608" stroke={OL} strokeWidth="3" />

      {/* ── SHOES ── */}
      <path d="M 112 778 Q 168 760 224 778 L 224 802 Q 168 818 108 800Z"
        fill="#1A0E06" stroke={OL} strokeWidth={OW} strokeLinejoin="round" />
      <path d="M 276 778 Q 332 760 388 778 L 390 802 Q 334 818 272 800Z"
        fill="#1A0E06" stroke={OL} strokeWidth={OW} strokeLinejoin="round" />
    </svg>
  );
}

// ── Job props ─────────────────────────────────────────────────────────────────

function RisingChart() {
  const bars = [80, 120, 100, 160, 140, 200, 240];
  return (
    <svg width="360" height="260" viewBox="0 0 360 260" fill="none">
      {/* Axes */}
      <line x1="40" y1="220" x2="340" y2="220" stroke={CREAM} strokeWidth="5" strokeLinecap="round" />
      <line x1="40" y1="20"  x2="40"  y2="220" stroke={CREAM} strokeWidth="5" strokeLinecap="round" />
      {/* Bars */}
      {bars.map((h, i) => (
        <rect key={i}
          x={50 + i * 40} y={220 - h} width="28" height={h} rx="5"
          fill={i === bars.length - 1 ? CREAM : "rgba(237,217,154,0.35)"}
          stroke={CREAM} strokeWidth="3" />
      ))}
      {/* Up arrow on last bar */}
      <path d="M 324 76 L 340 52 L 356 76" stroke={CREAM} strokeWidth="5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      <line x1="340" y1="52" x2="340" y2="90" stroke={CREAM} strokeWidth="5" strokeLinecap="round" />
    </svg>
  );
}

function Palette() {
  return (
    <svg width="280" height="260" viewBox="0 0 280 260" fill="none">
      {/* Palette shape */}
      <path d="M 140 20 C 60 20 10 76 10 140 C 10 200 52 250 120 250 C 148 250 148 226 140 220
               C 132 214 136 200 152 200 C 200 200 260 168 268 120 C 276 68 228 20 140 20Z"
        fill="#F0E8D0" stroke={OL} strokeWidth="5" />
      {/* Thumb hole */}
      <ellipse cx="96" cy="220" rx="22" ry="26" fill={BG} stroke={OL} strokeWidth="5" />
      {/* Paint blobs */}
      <circle cx="70"  cy="80"  r="20" fill="#E84040" stroke={OL} strokeWidth="4" />
      <circle cx="130" cy="50"  r="20" fill="#4080E8" stroke={OL} strokeWidth="4" />
      <circle cx="196" cy="64"  r="20" fill="#40C870" stroke={OL} strokeWidth="4" />
      <circle cx="226" cy="120" r="20" fill="#E8C040" stroke={OL} strokeWidth="4" />
      <circle cx="210" cy="178" r="18" fill="#C040C8" stroke={OL} strokeWidth="4" />
      {/* Brush */}
      <rect x="190" y="190" width="14" height="80" rx="5" transform="rotate(-30 190 190)"
        fill="#8A6030" stroke={OL} strokeWidth="4" />
      <path d="M 240 224 L 252 206 L 262 220 Q 256 240 248 244Z"
        fill="#4080E8" stroke={OL} strokeWidth="4" strokeLinejoin="round" />
    </svg>
  );
}

function MegaphoneAndChart() {
  return (
    <svg width="420" height="300" viewBox="0 0 420 300" fill="none">
      {/* Megaphone */}
      <path d="M 20 110 L 20 190 L 70 190 L 160 240 L 160 60 L 70 110Z"
        fill={CREAM} stroke={OL} strokeWidth="5" strokeLinejoin="round" />
      <ellipse cx="165" cy="150" rx="20" ry="90" fill="#D8C880" stroke={OL} strokeWidth="5" />
      {/* Sound waves */}
      <path d="M 184 114 Q 210 150 184 186" stroke={CREAM} strokeWidth="5" fill="none" strokeLinecap="round" />
      <path d="M 198 96  Q 236 150 198 204" stroke={CREAM} strokeWidth="5" fill="none" strokeLinecap="round" />
      <path d="M 212 78  Q 262 150 212 222" stroke={CREAM} strokeWidth="4" fill="none" strokeLinecap="round" />
      {/* Mini bar chart */}
      <rect x="290" y="200" width="24" height="80" rx="4" fill={CREAM} stroke={OL} strokeWidth="3" />
      <rect x="322" y="156" width="24" height="124" rx="4" fill={CREAM} stroke={OL} strokeWidth="3" />
      <rect x="354" y="112" width="24" height="168" rx="4" fill={CREAM} stroke={OL} strokeWidth="3" />
      <rect x="386" y="76"  width="24" height="204" rx="4" fill="#EDD99A" stroke={OL} strokeWidth="3" />
      <line x1="282" y1="284" x2="418" y2="284" stroke={CREAM} strokeWidth="4" strokeLinecap="round" />
    </svg>
  );
}

function AmbulanceCross() {
  return (
    <svg width="260" height="260" viewBox="0 0 260 260" fill="none">
      {/* Circle bg */}
      <circle cx="130" cy="130" r="120" fill="#C83030" stroke={OL} strokeWidth="6" />
      <circle cx="130" cy="130" r="108" fill="none" stroke="#A02020" strokeWidth="4" />
      {/* Cross */}
      <rect x="100" y="54"  width="60" height="152" rx="12" fill="white" stroke={OL} strokeWidth="5" />
      <rect x="54"  y="100" width="152" height="60"  rx="12" fill="white" stroke={OL} strokeWidth="5" />
      {/* Siren light on top */}
      <rect x="106" y="20" width="48" height="28" rx="8" fill="#E84040" stroke={OL} strokeWidth="4" />
      <ellipse cx="130" cy="18" rx="24" ry="10" fill="#FF6060" stroke={OL} strokeWidth="3" />
    </svg>
  );
}

function CodeMonitor() {
  return (
    <svg width="400" height="300" viewBox="0 0 400 300" fill="none">
      {/* Monitor */}
      <rect x="10"  y="10"  width="380" height="238" rx="16" fill="#1A2A1A" stroke={OL} strokeWidth="5" />
      <rect x="24"  y="24"  width="352" height="210" rx="8"  fill="#0E1A0E" />
      {/* Code lines */}
      {[
        { x: 36, w: 80,  color: "#6080E8" },
        { x: 36, w: 140, color: CREAM },
        { x: 36, w: 60,  color: "#E86040" },
        { x: 36, w: 100, color: "#40C870" },
        { x: 36, w: 180, color: CREAM },
        { x: 36, w: 80,  color: "#6080E8" },
        { x: 36, w: 220, color: CREAM },
        { x: 36, w: 120, color: "#E8C040" },
      ].map((row, i) => (
        <g key={i}>
          {/* Line number */}
          <rect x={28} y={38 + i * 22} width={16} height={12} rx={3} fill="#1E3A1E" />
          {/* Code block */}
          <rect x={58} y={38 + i * 22} width={row.w} height={12} rx={3} fill={row.color} opacity={0.7} />
          {i % 3 !== 2 && (
            <rect x={58 + row.w + 8} y={38 + i * 22} width={40} height={12} rx={3} fill={CREAM} opacity={0.3} />
          )}
        </g>
      ))}
      {/* Cursor blink */}
      <rect x="58" y="214" width="3" height="16" rx="1" fill={CREAM} />
      {/* Stand */}
      <rect x="170" y="248" width="60"  height="24" rx="4" fill="#2A3A2A" stroke={OL} strokeWidth="4" />
      <rect x="120" y="268" width="160" height="16" rx="8" fill="#2A3A2A" stroke={OL} strokeWidth="4" />
    </svg>
  );
}

function WrenchGear() {
  return (
    <svg width="300" height="280" viewBox="0 0 300 280" fill="none">
      {/* Big gear */}
      <path d="M 150 30 L 168 10 L 186 18 L 178 42 C 196 50 210 64 218 82 L 244 78 L 252 96 L 234 110
               L 240 130 L 236 150 L 214 148 C 208 166 196 180 180 188 L 184 214 L 166 222 L 154 200
               L 134 202 L 114 194 L 120 170 C 102 162 88 148 80 130 L 56 134 L 48 116 L 68 102
               L 62 82 L 68 62 L 92 66 C 100 48 114 34 130 26Z"
        fill={CREAM} stroke={OL} strokeWidth="5" strokeLinejoin="round" />
      <circle cx="150" cy="130" r="46" fill={BG} stroke={OL} strokeWidth="5" />
      <circle cx="150" cy="130" r="22" fill={CREAM} stroke={OL} strokeWidth="4" />
      {/* Wrench */}
      <path d="M 226 208 L 278 256 Q 290 268 282 278 Q 274 288 260 278 L 210 228Z"
        fill="#8A8A8A" stroke={OL} strokeWidth="5" strokeLinejoin="round" />
      <ellipse cx="212" cy="212" rx="28" ry="20" transform="rotate(-45 212 212)"
        fill="#AAAAAA" stroke={OL} strokeWidth="5" />
      <ellipse cx="212" cy="212" rx="12" ry="8" transform="rotate(-45 212 212)"
        fill={BG} stroke={OL} strokeWidth="3" />
    </svg>
  );
}

function AppPhone() {
  return (
    <svg width="240" height="460" viewBox="0 0 240 460" fill="none"
      style={{ filter: "drop-shadow(8px 10px 0px rgba(0,0,0,0.55))", transform: "rotate(3deg)" }}>
      <rect x="8"  y="8"  width="224" height="444" rx="34" fill="#1A1A2A" stroke={OL} strokeWidth="6" />
      <rect x="20" y="20" width="200" height="420" rx="24" fill="#1A3A2A" />
      <rect x="82" y="26" width="76"  height="16"  rx="8"  fill="#1A1A2A" />
      <rect x="20" y="56" width="200" height="46"  fill="#0E2218" />
      <text x="120" y="86" fontFamily="Arial Black" fontWeight="900" fontSize="18" fill="#5EEAD4" textAnchor="middle">hyperfix</text>
      {["Deep work block","Brain dump","Priority #1","3 tasks done"].map((t, i) => (
        <g key={i}>
          <rect x="28" y={116 + i * 68} width="184" height="54" rx="12" fill="#0E2A1C" stroke="#1E4A34" strokeWidth="2" />
          <rect x="40" y={130 + i * 68} width="16"  height="16"  rx="4"  fill={i < 2 ? "#5EEAD4" : "#1E4A34"} stroke="#3A8A70" strokeWidth="2" />
          <text x="66" y={145 + i * 68} fontFamily="Arial" fontWeight="700" fontSize="13" fill={i < 2 ? "#5EEAD4" : "#8AB8A8"}>{t}</text>
        </g>
      ))}
    </svg>
  );
}

// ── Slide wrapper ─────────────────────────────────────────────────────────────

function Slide({
  lines, sub, accent, children, num, total = 6,
}: {
  lines:    string[];
  sub?:     string;
  accent?:  string;
  children: React.ReactNode;
  num:      number;
  total?:   number;
}) {
  return (
    <div style={{
      width: 1080, height: 1920,
      background: BG,
      position: "relative", overflow: "hidden",
      fontFamily: "var(--font-sans)",
    }}>
      <div style={{
        position: "absolute", inset: 0, pointerEvents: "none",
        background: "radial-gradient(ellipse at 50% 50%, transparent 52%, rgba(0,0,0,0.45) 100%)",
      }} />

      {/* Big title */}
      <div style={{ position: "absolute", top: 88, left: 72, right: 72, zIndex: 10 }}>
        <p style={{
          fontSize: 132, fontWeight: 700,
          color: accent ?? CREAM,
          lineHeight: 1.06, margin: 0,
          textShadow: "0 4px 0px rgba(0,0,0,0.40)",
        }}>
          {lines.map((l, i) => <span key={i}>{l}{i < lines.length - 1 && <br />}</span>)}
        </p>
        {sub && (
          <p style={{
            fontSize: 50, fontWeight: 700,
            color: "rgba(237,217,154,0.52)",
            margin: "16px 0 0", lineHeight: 1.22,
          }}>{sub}</p>
        )}
      </div>

      {/* Scene */}
      <div style={{ position: "absolute", inset: 0, zIndex: 5 }}>{children}</div>

      {/* Footer */}
      <p style={{ position: "absolute", bottom: 50, left: 72, zIndex: 20, fontSize: 20, fontWeight: 700, margin: 0, color: "rgba(237,217,154,0.26)", letterSpacing: "0.06em" }}>
        hyperfix.app
      </p>
      <p style={{ position: "absolute", bottom: 50, right: 72, zIndex: 20, fontSize: 20, fontWeight: 700, margin: 0, color: "rgba(237,217,154,0.26)", letterSpacing: "0.06em" }}>
        {num} / {total}
      </p>
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function BestJobsAdhd() {
  return (
    <div className={sans.variable}
      style={{ background: "#000", display: "flex", flexDirection: "column", gap: 4 }}>

      {/* ── 1 HOOK ── */}
      <Slide lines={["Best Jobs", "For People", "With ADHD"]} sub="(your brain is actually built for these)" num={1}>
        {/* Three figures: small unhappy office drone → medium → large thriving */}
        <div style={{ position: "absolute", bottom: 80, left: "50%", transform: "translateX(-50%)", display: "flex", alignItems: "flex-end", gap: 44 }}>
          <div style={{ transform: "scale(0.60)", transformOrigin: "bottom center" }}>
            <Guy shirt="#3A4A3A" pants="#4A4030" size={380} mood="neutral" />
          </div>
          <div style={{ transform: "scale(0.80)", transformOrigin: "bottom center" }}>
            <Guy shirt="#2A5A5A" pants="#5A4A28" size={380} mood="happy" hat="cap" />
          </div>
          <div style={{ transform: "scale(1.02)", transformOrigin: "bottom center" }}>
            <Guy shirt="#1A5A3A" pants="#4A3818" size={380} mood="excited" hat="cap" />
          </div>
        </div>
        {/* Up arrow */}
        <div style={{ position: "absolute", bottom: 380, right: 68 }}>
          <svg width="140" height="200" viewBox="0 0 140 200" fill="none">
            <path d="M 26 200 L 26 56 L 0 56 L 70 0 L 140 56 L 114 56 L 114 200Z"
              fill="#2E8B3A" stroke={OL} strokeWidth="5" strokeLinejoin="round" />
          </svg>
        </div>
        {/* Label row */}
        {[["Miserable", 148],["Getting there", 386],["Thriving", 692]].map(([label, lx], i) => (
          <p key={i} style={{
            position: "absolute", bottom: 44, left: lx as number,
            fontSize: 26, fontWeight: 700, color: "rgba(237,217,154,0.50)",
            margin: 0, textAlign: "center", width: 160, transform: "translateX(-50%)",
          }}>{label as string}</p>
        ))}
      </Slide>

      {/* ── 2 ENTREPRENEUR ── */}
      <Slide
        lines={["Entre-", "preneur"]}
        sub="You make the rules. No boring routine."
        num={2}
      >
        {/* Rising chart right side */}
        <div style={{ position: "absolute", bottom: 560, right: 60, lineHeight: 0 }}>
          <RisingChart />
        </div>
        {/* Guy */}
        <div style={{ position: "absolute", bottom: 80, left: "50%", transform: "translateX(-50%)", lineHeight: 0 }}>
          <Guy shirt="#2A4A7A" pants="#5A4020" size={430} mood="confident" hat="cap" />
        </div>
        {/* Floating dollar / idea labels */}
        <svg style={{ position: "absolute", top: 680, left: 0, width: "100%", height: 240 }} viewBox="0 0 1080 240" fill="none">
          {["💡 BIG IDEAS", "📈 GROWTH", "🔥 MOMENTUM"].map((w, i) => (
            <text key={i} x={80 + i * 340} y={80 + (i % 2) * 60}
              fontFamily="Arial Black" fontWeight="900" fontSize="36"
              fill={CREAM} opacity="0.22" textAnchor="middle">{w}</text>
          ))}
        </svg>
      </Slide>

      {/* ── 3 CREATIVE ── */}
      <Slide
        lines={["Creative", "Roles"]}
        sub="Designer. Artist. Content creator."
        num={3}
      >
        {/* Palette left */}
        <div style={{ position: "absolute", bottom: 620, left: 70, lineHeight: 0 }}>
          <Palette />
        </div>
        {/* Colour blobs in background */}
        <svg style={{ position: "absolute", top: 500, left: 0, width: "100%", height: 400 }} viewBox="0 0 1080 400" fill="none">
          <circle cx="880" cy="120" r="90" fill="#E84040" opacity="0.14" />
          <circle cx="820" cy="240" r="60" fill="#4080E8" opacity="0.14" />
          <circle cx="940" cy="220" r="70" fill="#40C870" opacity="0.14" />
        </svg>
        {/* Guy */}
        <div style={{ position: "absolute", bottom: 80, left: "50%", transform: "translateX(-40%)", lineHeight: 0 }}>
          <Guy shirt="#7A3A7A" pants="#3A2858" size={430} mood="happy" />
        </div>
      </Slide>

      {/* ── 4 SALES ── */}
      <Slide
        lines={["Sales &", "Marketing"]}
        sub="Your energy literally closes deals."
        num={4}
      >
        {/* Megaphone + chart */}
        <div style={{ position: "absolute", bottom: 600, left: "50%", transform: "translateX(-50%)", lineHeight: 0 }}>
          <MegaphoneAndChart />
        </div>
        {/* Guy pointing at it */}
        <div style={{ position: "absolute", bottom: 80, left: "50%", transform: "translateX(-56%)", lineHeight: 0 }}>
          <Guy shirt="#C07020" pants="#4A3010" size={430} mood="excited" />
        </div>
      </Slide>

      {/* ── 5 EMERGENCY SERVICES ── */}
      <Slide
        lines={["Emergency", "Services"]}
        sub="High stakes = instant hyperfocus."
        num={5}
      >
        {/* Red cross / siren */}
        <div style={{ position: "absolute", bottom: 660, left: "50%", transform: "translateX(-50%)", lineHeight: 0 }}>
          <AmbulanceCross />
        </div>
        {/* Guy in red helmet */}
        <div style={{ position: "absolute", bottom: 80, left: "50%", transform: "translateX(-50%)", lineHeight: 0 }}>
          <Guy shirt="#C03020" pants="#2A2830" size={430} mood="confident" hat="helmet" />
        </div>
        {/* Siren flash effect */}
        <div style={{
          position: "absolute", top: 0, left: 0, right: 0, height: 800,
          background: "radial-gradient(ellipse at 50% -10%, rgba(200,48,48,0.20) 0%, transparent 60%)",
          pointerEvents: "none",
        }} />
      </Slide>

      {/* ── 6 TECH / ENGINEERING ── */}
      <Slide
        lines={["Tech &", "Engineering"]}
        sub="Hyperfocus mode = superpower."
        num={6}
      >
        {/* Code monitor */}
        <div style={{ position: "absolute", bottom: 620, left: "50%", transform: "translateX(-50%)", lineHeight: 0 }}>
          <CodeMonitor />
        </div>
        {/* Guy with beanie */}
        <div style={{ position: "absolute", bottom: 80, left: "50%", transform: "translateX(-50%)", lineHeight: 0 }}>
          <Guy shirt="#2A3A6A" pants="#2A2A3A" size={430} mood="confident" hat="beanie" />
        </div>
        {/* Floating code symbols */}
        <svg style={{ position: "absolute", top: 520, left: 0, width: "100%", height: 200 }} viewBox="0 0 1080 200" fill="none">
          {["{ }", "</>", "//", "=>", "[ ]", "&&"].map((sym, i) => (
            <text key={i} x={80 + i * 170} y={60 + (i % 2) * 80}
              fontFamily="Courier New" fontWeight="900" fontSize="38"
              fill={CREAM} opacity="0.18">{sym}</text>
          ))}
        </svg>
      </Slide>

      {/* ── 7 CTA ── */}
      <div style={{
        width: 1080, height: 1920,
        background: BG,
        position: "relative", overflow: "hidden",
        fontFamily: "var(--font-sans)",
      }}>
        <div style={{
          position: "absolute", inset: 0, pointerEvents: "none",
          background: "radial-gradient(ellipse at 50% 50%, transparent 52%, rgba(0,0,0,0.45) 100%)",
        }} />

        {/* Title */}
        <div style={{ position: "absolute", top: 88, left: 72, right: 72, zIndex: 10 }}>
          <p style={{ fontSize: 132, fontWeight: 700, color: CREAM, lineHeight: 1.06, margin: 0, textShadow: "0 4px 0px rgba(0,0,0,0.40)" }}>
            Now Go<br />Get The<br />Right Job.
          </p>
          <p style={{ fontSize: 50, fontWeight: 700, color: "rgba(94,234,212,0.72)", margin: "20px 0 0", lineHeight: 1.22 }}>
            Hyperfix keeps your ADHD<br />brain on track while you do.
          </p>
        </div>

        {/* Character */}
        <div style={{ position: "absolute", bottom: 280, left: "50%", transform: "translateX(-68%)", lineHeight: 0, zIndex: 5 }}>
          <Guy shirt="#1A5A3A" pants="#3A2C10" size={430} mood="excited" hat="cap" />
        </div>

        {/* App phone */}
        <div style={{ position: "absolute", bottom: 310, right: 50, lineHeight: 0, zIndex: 5 }}>
          <AppPhone />
        </div>

        {/* CTA pill */}
        <div style={{
          position: "absolute", bottom: 72, left: "50%", transform: "translateX(-50%)",
          zIndex: 20, background: "#5EEAD4", borderRadius: 80,
          padding: "22px 80px", whiteSpace: "nowrap",
          boxShadow: "6px 8px 0px rgba(0,0,0,0.55)",
        }}>
          <span style={{ fontSize: 52, fontWeight: 700, color: "#071610", letterSpacing: "-0.01em" }}>
            hyperfix.app
          </span>
        </div>

        <p style={{ position: "absolute", bottom: 16, left: 0, right: 0, textAlign: "center", zIndex: 20, fontSize: 20, fontWeight: 700, color: "rgba(237,217,154,0.26)", margin: 0 }}>7 / 7</p>
      </div>

    </div>
  );
}
