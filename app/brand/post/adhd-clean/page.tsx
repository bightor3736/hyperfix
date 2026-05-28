import type { Metadata } from "next";
import { Instrument_Sans } from "next/font/google";

export const metadata: Metadata = {
  title: "Hyperfix — ADHD Clean",
  robots: { index: false, follow: false },
};

const sans = Instrument_Sans({
  subsets: ["latin"],
  weight: ["700"],
  display: "swap",
  variable: "--font-sans",
});

// ── Design tokens ─────────────────────────────────────────────────────────────
const BG     = "#0B2A0B";   // dark forest green
const CREAM  = "#EDD99A";   // warm butter cream
const SKIN   = "#C07840";   // warm brown skin
const SKIN_D = "#9A5A22";   // deeper skin for ears/neck
const OL     = "#111111";   // outline colour
const OW     = 5;           // outline stroke width

// ── Flat editorial character ──────────────────────────────────────────────────

type FlatMood = "neutral" | "happy" | "sad" | "surprised" | "excited";

function FlatGuy({
  shirtColor = "#2D6A2D",
  pantsColor = "#7A5C30",
  size       = 480,
  mood       = "neutral" as FlatMood,
  cap        = false,
}) {
  const h = Math.round(size * 1.64);

  return (
    <svg width={size} height={h} viewBox="0 0 500 820" fill="none"
      style={{ filter: "drop-shadow(0 12px 0px rgba(0,0,0,0.40))" }}>

      {/* ── HAIR ── */}
      {!cap && (
        <path d="M 162 162 Q 166 60 250 54 Q 334 60 338 162 Q 296 108 250 106 Q 204 108 162 162Z"
          fill="#1C0C04" stroke="#0A0402" strokeWidth="3" />
      )}
      {cap && (
        <>
          <path d="M 162 170 Q 166 60 250 54 Q 334 60 338 170 Q 296 112 250 110 Q 204 112 162 170Z"
            fill="#F0E8C8" stroke={OL} strokeWidth={OW} />
          <path d="M 158 176 Q 154 190 140 188 Q 148 174 164 176Z"
            fill="#F0E8C8" stroke={OL} strokeWidth="4" />
          <ellipse cx="250" cy="108" rx="102" ry="24" fill="#D8CCA8" stroke={OL} strokeWidth="4" />
        </>
      )}

      {/* ── HEAD ── */}
      <ellipse cx="250" cy="180" rx="92" ry="98" fill={SKIN} stroke={OL} strokeWidth={OW} />

      {/* ── EARS ── */}
      <ellipse cx="159" cy="190" rx="14" ry="18" fill={SKIN_D} stroke={OL} strokeWidth={OW} />
      <ellipse cx="341" cy="190" rx="14" ry="18" fill={SKIN_D} stroke={OL} strokeWidth={OW} />

      {/* ── EYES ── */}
      <ellipse cx="218" cy="182" rx="11" ry="13" fill={OL} />
      <ellipse cx="282" cy="182" rx="11" ry="13" fill={OL} />
      <ellipse cx="221" cy="178" rx="4"  ry="4"  fill="white" />
      <ellipse cx="285" cy="178" rx="4"  ry="4"  fill="white" />

      {/* ── EYEBROWS ── */}
      {mood === "sad" && <>
        <path d="M 204 158 Q 218 166 232 161" stroke={OL} strokeWidth="5.5" fill="none" strokeLinecap="round" />
        <path d="M 268 161 Q 282 166 296 158" stroke={OL} strokeWidth="5.5" fill="none" strokeLinecap="round" />
      </>}
      {mood === "surprised" && <>
        <path d="M 204 150 Q 218 140 232 148" stroke={OL} strokeWidth="5.5" fill="none" strokeLinecap="round" />
        <path d="M 268 148 Q 282 140 296 150" stroke={OL} strokeWidth="5.5" fill="none" strokeLinecap="round" />
      </>}
      {(mood === "neutral" || mood === "happy" || mood === "excited") && <>
        <path d="M 204 160 Q 218 152 232 157" stroke={OL} strokeWidth="5.5" fill="none" strokeLinecap="round" />
        <path d="M 268 157 Q 282 152 296 160" stroke={OL} strokeWidth="5.5" fill="none" strokeLinecap="round" />
      </>}

      {/* ── NOSE ── */}
      <path d="M 243 205 Q 250 218 257 205" stroke={SKIN_D} strokeWidth="3.5" fill="none" strokeLinecap="round" />

      {/* ── MOUTH ── */}
      {mood === "happy" && <path d="M 222 232 Q 250 256 278 232" stroke={OL} strokeWidth="5" fill="none" strokeLinecap="round" />}
      {mood === "excited" && <>
        <path d="M 218 230 Q 250 260 282 230" stroke={OL} strokeWidth="5" fill="none" strokeLinecap="round" />
        <ellipse cx="250" cy="244" rx="22" ry="14" fill={OL} />
        <ellipse cx="250" cy="248" rx="14" ry="8"  fill="#A84020" />
      </>}
      {mood === "sad" && <path d="M 224 246 Q 250 232 276 246" stroke={OL} strokeWidth="5" fill="none" strokeLinecap="round" />}
      {mood === "surprised" && <ellipse cx="250" cy="240" rx="16" ry="13" fill={OL} />}
      {mood === "neutral" && <path d="M 226 238 Q 250 250 274 238" stroke={OL} strokeWidth="5" fill="none" strokeLinecap="round" />}

      {/* ── NECK ── */}
      <rect x="228" y="270" width="44" height="42" rx="10" fill={SKIN_D} stroke={OL} strokeWidth={OW} />

      {/* ── SHIRT / BODY ── */}
      <path d="M 132 318 L 150 530 L 350 530 L 368 318 Q 322 290 250 286 Q 178 290 132 318Z"
        fill={shirtColor} stroke={OL} strokeWidth={OW} strokeLinejoin="round" />

      {/* ── ARMS ── */}
      <path d="M 134 330 C 74 408 56 514 62 594 L 104 588 C 100 512 112 414 152 346Z"
        fill={shirtColor} stroke={OL} strokeWidth={OW} strokeLinejoin="round" />
      <path d="M 366 330 C 426 408 444 514 438 594 L 396 588 C 400 512 388 414 348 346Z"
        fill={shirtColor} stroke={OL} strokeWidth={OW} strokeLinejoin="round" />

      {/* ── HANDS ── */}
      <ellipse cx="82"  cy="604" rx="24" ry="22" fill={SKIN} stroke={OL} strokeWidth={OW} />
      <ellipse cx="418" cy="604" rx="24" ry="22" fill={SKIN} stroke={OL} strokeWidth={OW} />

      {/* ── PANTS ── */}
      <path d="M 250 522 L 260 790 L 338 790 L 334 522Z"
        fill={pantsColor} stroke={OL} strokeWidth={OW} strokeLinejoin="round" />
      <path d="M 250 522 L 240 790 L 162 790 L 166 522Z"
        fill={pantsColor} stroke={OL} strokeWidth={OW} strokeLinejoin="round" />

      {/* ── BELT ── */}
      <rect x="148" y="518" width="204" height="20" rx="6" fill="#2A1608" stroke={OL} strokeWidth="3" />
      <rect x="232" y="520" width="36" height="16" rx="4" fill="#5A7060" />

      {/* ── SHOES ── */}
      <path d="M 112 778 Q 168 760 224 778 L 224 802 Q 168 818 108 800Z"
        fill="#1A0E06" stroke={OL} strokeWidth={OW} strokeLinejoin="round" />
      <path d="M 276 778 Q 332 760 388 778 L 390 802 Q 334 818 272 800Z"
        fill="#1A0E06" stroke={OL} strokeWidth={OW} strokeLinejoin="round" />
    </svg>
  );
}

// ── Flat props ────────────────────────────────────────────────────────────────

function FlatLaptop() {
  return (
    <svg width="340" height="240" viewBox="0 0 340 240" fill="none">
      {/* Screen */}
      <rect x="20" y="4"  width="300" height="188" rx="12" fill="#1A2A3A" stroke={OL} strokeWidth="5" />
      <rect x="32" y="16" width="276" height="164" rx="6"  fill="#2A3D4A" />
      {/* Tabs row */}
      {Array.from({ length: 12 }).map((_, i) => (
        <rect key={i} x={36 + i * 22} y={20} width="18" height="14" rx="3"
          fill={i === 2 ? "#4A8CC8" : "#1A2A36"} stroke="#3A5060" strokeWidth="1.5" />
      ))}
      {/* Content lines */}
      <rect x="36" y="42" width="268" height="10" rx="3" fill="#3A5060" />
      <rect x="36" y="60" width="200" height="10" rx="3" fill="#3A5060" />
      <rect x="36" y="80" width="240" height="10" rx="3" fill="#3A5060" />
      <rect x="36" y="98" width="180" height="10" rx="3" fill="#3A5060" />
      {/* "+847 tabs" badge */}
      <rect x="110" y="118" width="120" height="36" rx="8" fill="#E84040" stroke={OL} strokeWidth="3" />
      <text x="170" y="141" fontFamily="Arial Black" fontWeight="900" fontSize="16"
        fill="white" textAnchor="middle">+847 tabs</text>
      {/* Base */}
      <path d="M 4 196 L 0 228 L 340 228 L 336 196Z" fill="#2A3040" stroke={OL} strokeWidth="5" strokeLinejoin="round" />
      <path d="M 96 228 L 244 228 L 234 236 L 106 236Z" fill="#1A2030" stroke={OL} strokeWidth="4" />
    </svg>
  );
}

function FlatPhone({ showRead = false }: { showRead?: boolean }) {
  return (
    <svg width="200" height="380" viewBox="0 0 200 380" fill="none">
      <rect x="8"  y="8"  width="184" height="364" rx="28" fill="#1A1A2A" stroke={OL} strokeWidth="5" />
      <rect x="20" y="22" width="160" height="336" rx="20" fill="#F0F4FF" />
      {/* Notch */}
      <rect x="72" y="26" width="56" height="14" rx="7" fill="#1A1A2A" />
      {/* Chat bubble – them */}
      <rect x="28" y="60"  width="110" height="44" rx="14" fill="#E0E4EF" />
      <text x="83" y="86"  fontFamily="Arial" fontWeight="700" fontSize="13" fill="#333" textAnchor="middle">hey you free?</text>
      {/* "3 weeks later" */}
      <text x="100" y="128" fontFamily="Arial" fontWeight="700" fontSize="11" fill="#AAA" textAnchor="middle">— 3 weeks later —</text>
      {/* Chat bubble – reply */}
      <rect x="54" y="140" width="124" height="44" rx="14" fill="#3B7FF0" />
      <text x="116" y="167" fontFamily="Arial" fontWeight="700" fontSize="13" fill="white" textAnchor="middle">omg sorry!!</text>
      {/* Read */}
      {showRead && (
        <text x="178" y="198" fontFamily="Arial" fontWeight="700" fontSize="11" fill="#3B7FF0" textAnchor="end">Read</text>
      )}
      {/* Typing dots */}
      <rect x="28" y="210" width="64" height="36" rx="14" fill="#E0E4EF" />
      <circle cx="48"  cy="228" r="6" fill="#888" />
      <circle cx="64"  cy="228" r="6" fill="#888" />
      <circle cx="80"  cy="228" r="6" fill="#888" />
    </svg>
  );
}

function FlatClock({ time = "2:00" }: { time?: string }) {
  const [hh, mm] = time.split(":").map(Number);
  const toRad = (d: number) => (d * Math.PI) / 180;
  const hAngle = (hh % 12) * 30 + mm * 0.5 - 90;
  const mAngle = mm * 6 - 90;
  return (
    <svg width="180" height="180" viewBox="0 0 180 180" fill="none">
      <circle cx="90" cy="90" r="84" fill="#F0EAD4" stroke={OL} strokeWidth="6" />
      {Array.from({ length: 12 }).map((_, i) => {
        const a = i * 30 - 90;
        return <line key={i}
          x1={90 + Math.cos(toRad(a)) * 70} y1={90 + Math.sin(toRad(a)) * 70}
          x2={90 + Math.cos(toRad(a)) * 80} y2={90 + Math.sin(toRad(a)) * 80}
          stroke={OL} strokeWidth="4" strokeLinecap="round" />;
      })}
      <line x1="90" y1="90" x2={90 + Math.cos(toRad(hAngle)) * 46} y2={90 + Math.sin(toRad(hAngle)) * 46}
        stroke={OL} strokeWidth="7" strokeLinecap="round" />
      <line x1="90" y1="90" x2={90 + Math.cos(toRad(mAngle)) * 66} y2={90 + Math.sin(toRad(mAngle)) * 66}
        stroke={OL} strokeWidth="5" strokeLinecap="round" />
      <circle cx="90" cy="90" r="7" fill={OL} />
    </svg>
  );
}

function FlatMoon() {
  return (
    <svg width="180" height="180" viewBox="0 0 180 180" fill="none">
      <circle cx="80"  cy="90" r="76" fill="#EDD99A" stroke={OL} strokeWidth="5" />
      <circle cx="128" cy="70" r="66" fill={BG} />
      {/* Stars */}
      {([[160,30],[148,100],[48,20],[30,140],[170,150]] as [number,number][]).map(([x, y], i) => (
        <path key={i} d={`M ${x} ${y-8} L ${x+3} ${y-3} L ${x+8} ${y} L ${x+3} ${y+3} L ${x} ${y+8} L ${x-3} ${y+3} L ${x-8} ${y} L ${x-3} ${y-3}Z`}
          fill="#EDD99A" />
      ))}
    </svg>
  );
}

function FlatLightning({ x = 0, y = 0, size = 1, color = CREAM }: {
  x?: number; y?: number; size?: number; color?: string;
}) {
  return (
    <g transform={`translate(${x},${y}) scale(${size})`}>
      <path d="M 36 0 L 8 52 L 28 52 L 0 104 L 60 36 L 38 36Z"
        fill={color} stroke={OL} strokeWidth={6 / size} strokeLinejoin="round" />
    </g>
  );
}

function AppPhone() {
  return (
    <svg width="260" height="500" viewBox="0 0 260 500" fill="none"
      style={{ filter: "drop-shadow(8px 10px 0px rgba(0,0,0,0.50))", transform: "rotate(4deg)" }}>
      <rect x="8"  y="8"  width="244" height="484" rx="36" fill="#1A1A2A" stroke={OL} strokeWidth="6" />
      <rect x="22" y="22" width="216" height="456" rx="26" fill="#1A3A2A" />
      {/* Camera */}
      <rect x="92" y="28" width="76" height="18" rx="9" fill="#1A1A2A" />
      {/* App header */}
      <rect x="22" y="62" width="216" height="50" fill="#0E2218" />
      <text x="130" y="94" fontFamily="Arial Black" fontWeight="900" fontSize="20" fill="#5EEAD4" textAnchor="middle">hyperfix</text>
      {/* Task cards */}
      {["Deep work session", "Brain dump", "Inbox zero", "2 tasks left"].map((label, i) => (
        <g key={i}>
          <rect x="30" y={126 + i * 72} width="200" height="58" rx="12" fill="#0E2A1C" stroke="#1E4A34" strokeWidth="2" />
          <rect x="44" y={142 + i * 72} width="18" height="18" rx="5" fill={i < 2 ? "#5EEAD4" : "#1E4A34"} stroke="#3A8A70" strokeWidth="2" />
          {i < 2 && <path d={`M 48 ${151 + i * 72} l 5 5 l 8 -8`} stroke="#0E2218" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" fill="none" />}
          <text x="72" y={158 + i * 72} fontFamily="Arial" fontWeight="700" fontSize="14" fill={i < 2 ? "#5EEAD4" : "#8AB8A8"}>{label}</text>
        </g>
      ))}
      {/* Bottom nav */}
      <rect x="22" y="428" width="216" height="50" fill="#0E2218" />
      {["☑", "🧠", "⚡", "👤"].map((icon, i) => (
        <text key={i} x={52 + i * 56} y="460" fontSize="20" textAnchor="middle" fill={i === 0 ? "#5EEAD4" : "#3A6050"}>{icon}</text>
      ))}
    </svg>
  );
}

// ── Slide layout ──────────────────────────────────────────────────────────────

function Slide({
  lines,
  sub,
  children,
  num,
  total = 6,
}: {
  lines:    string[];
  sub?:     string;
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
      {/* Subtle vignette */}
      <div style={{
        position: "absolute", inset: 0, pointerEvents: "none",
        background: "radial-gradient(ellipse at 50% 50%, transparent 55%, rgba(0,0,0,0.40) 100%)",
      }} />

      {/* Big title */}
      <div style={{ position: "absolute", top: 90, left: 72, right: 72, zIndex: 10 }}>
        <p style={{
          fontSize: 132, fontWeight: 700, color: CREAM,
          lineHeight: 1.08, margin: 0,
          textShadow: "0 4px 0px rgba(0,0,0,0.35)",
        }}>
          {lines.map((l, i) => <span key={i}>{l}{i < lines.length - 1 && <br />}</span>)}
        </p>
        {sub && (
          <p style={{
            fontSize: 52, fontWeight: 700,
            color: "rgba(237,217,154,0.55)", margin: "18px 0 0",
            lineHeight: 1.2,
          }}>{sub}</p>
        )}
      </div>

      {/* Illustration zone */}
      <div style={{ position: "absolute", inset: 0, zIndex: 5 }}>
        {children}
      </div>

      {/* Counter */}
      <p style={{
        position: "absolute", bottom: 52, right: 72, zIndex: 20,
        fontSize: 20, fontWeight: 700, margin: 0,
        color: "rgba(237,217,154,0.28)", letterSpacing: "0.06em",
      }}>
        {num} / {total}
      </p>

      {/* Watermark */}
      <p style={{
        position: "absolute", bottom: 52, left: 72, zIndex: 20,
        fontSize: 20, fontWeight: 700, margin: 0,
        color: "rgba(237,217,154,0.28)", letterSpacing: "0.06em",
      }}>
        hyperfix.app
      </p>
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function AdhdClean() {
  return (
    <div className={sans.variable}
      style={{ background: "#000", display: "flex", flexDirection: "column", gap: 4 }}>

      {/* ── 1 HOOK ────────────────────────────────────────────────────────── */}
      <Slide lines={["THIS App", "Will Fix", "Your ADHD"]} sub="(I'm not joking)" num={1}>
        {/* Three-figure progression: struggling → using app → thriving */}
        <div style={{ position: "absolute", bottom: 90, left: "50%", transform: "translateX(-50%)", display: "flex", alignItems: "flex-end", gap: 40 }}>
          {/* Small/sad */}
          <div style={{ transform: "scale(0.62)", transformOrigin: "bottom center" }}>
            <FlatGuy shirtColor="#3A5A3A" pantsColor="#5A4A2A" size={380} mood="sad" />
          </div>
          {/* Medium/neutral */}
          <div style={{ transform: "scale(0.80)", transformOrigin: "bottom center" }}>
            <FlatGuy shirtColor="#2D6A2D" pantsColor="#6A5030" size={380} mood="neutral" />
          </div>
          {/* Full/happy with app */}
          <div style={{ transform: "scale(1.0)", transformOrigin: "bottom center" }}>
            <FlatGuy shirtColor="#1A5A3A" pantsColor="#5A4020" size={380} mood="happy" cap />
          </div>
        </div>
        {/* Green arrow */}
        <div style={{ position: "absolute", bottom: 340, right: 80 }}>
          <svg width="160" height="220" viewBox="0 0 160 220" fill="none">
            <path d="M 30 220 L 30 60 L 0 60 L 80 0 L 160 60 L 130 60 L 130 220Z"
              fill="#2E8B3A" stroke={OL} strokeWidth="5" strokeLinejoin="round" />
          </svg>
        </div>
      </Slide>

      {/* ── 2 TABS ────────────────────────────────────────────────────────── */}
      <Slide lines={["You Have", "847 Browser", "Tabs Open"]} sub='"just in case"' num={2}>
        {/* Laptop floating above character */}
        <div style={{ position: "absolute", bottom: 670, left: "50%", transform: "translateX(-46%)", lineHeight: 0 }}>
          <FlatLaptop />
        </div>
        <div style={{ position: "absolute", bottom: 90, left: "50%", transform: "translateX(-50%)", lineHeight: 0 }}>
          <FlatGuy shirtColor="#5A4A8A" pantsColor="#6A5030" size={420} mood="surprised" />
        </div>
      </Slide>

      {/* ── 3 PROCRASTINATION ─────────────────────────────────────────────── */}
      <Slide lines={["'About To", "Start'", "Since 9am"]} sub="(it is now 11pm)" num={3}>
        {/* Clocks flanking the character */}
        <div style={{ position: "absolute", bottom: 760, left: 120, lineHeight: 0 }}>
          <FlatClock time="9:00" />
        </div>
        <div style={{ position: "absolute", bottom: 780, right: 100, lineHeight: 0 }}>
          <FlatClock time="11:00" />
        </div>
        {/* Arrow between clocks */}
        <div style={{ position: "absolute", bottom: 808, left: "50%", transform: "translateX(-50%)" }}>
          <svg width="200" height="36" viewBox="0 0 200 36" fill="none">
            <line x1="0" y1="18" x2="176" y2="18" stroke={CREAM} strokeWidth="5" strokeDasharray="12 8" />
            <path d="M 168 6 L 200 18 L 168 30Z" fill={CREAM} />
          </svg>
        </div>
        <div style={{ position: "absolute", bottom: 90, left: "50%", transform: "translateX(-50%)", lineHeight: 0 }}>
          <FlatGuy shirtColor="#8A6A2A" pantsColor="#5A4020" size={420} mood="sad" />
        </div>
      </Slide>

      {/* ── 4 TEXTING ─────────────────────────────────────────────────────── */}
      <Slide lines={["You Reply", "In Seconds.", "Or Not Ever."]} num={4}>
        {/* Phone to the right of character */}
        <div style={{ position: "absolute", bottom: 280, right: 80, lineHeight: 0 }}>
          <FlatPhone showRead />
        </div>
        <div style={{ position: "absolute", bottom: 90, left: "50%", transform: "translateX(-64%)", lineHeight: 0 }}>
          <FlatGuy shirtColor="#7A3A7A" pantsColor="#5A4020" size={420} mood="surprised" />
        </div>
      </Slide>

      {/* ── 5 2AM ─────────────────────────────────────────────────────────── */}
      <Slide lines={["Brain On", "Fire At", "2am"]} sub="offline at 10am when you need it" num={5}>
        {/* Moon top right */}
        <div style={{ position: "absolute", bottom: 810, right: 80, lineHeight: 0 }}>
          <FlatMoon />
        </div>
        {/* Stars */}
        <svg style={{ position: "absolute", top: 520, left: 0, width: "100%", height: 300 }} viewBox="0 0 1080 300" fill="none">
          {([[80,40],[200,100],[420,30],[640,80],[900,20],[1000,100],[300,160],[760,140]] as [number,number][]).map(([x,y], i) => (
            <path key={i} d={`M ${x} ${y-10} L ${x+3} ${y-3} L ${x+10} ${y} L ${x+3} ${y+3} L ${x} ${y+10} L ${x-3} ${y+3} L ${x-10} ${y} L ${x-3} ${y-3}Z`}
              fill={CREAM} opacity="0.5" />
          ))}
        </svg>
        <div style={{ position: "absolute", bottom: 90, left: "50%", transform: "translateX(-50%)", lineHeight: 0 }}>
          <FlatGuy shirtColor="#1A2840" pantsColor="#3A3050" size={420} mood="surprised" />
        </div>
      </Slide>

      {/* ── 6 FEELINGS ────────────────────────────────────────────────────── */}
      <Slide lines={["You Feel", "Everything", "At 1000%"]} num={6}>
        {/* Lightning bolts around character */}
        <svg style={{ position: "absolute", top: 560, left: 0, width: "100%", height: 800 }} viewBox="0 0 1080 800" fill="none">
          <FlatLightning x={40}  y={80}  size={1.4} color="#EDD99A" />
          <FlatLightning x={880} y={60}  size={1.2} color="#EDD99A" />
          <FlatLightning x={100} y={380} size={0.9} color={CREAM} />
          <FlatLightning x={900} y={360} size={1.0} color={CREAM} />
          {/* Floating emotion words */}
          <text x="60"  y="320" fontFamily="Arial Black" fontWeight="900" fontSize="44" fill={CREAM} opacity="0.55">LOUD</text>
          <text x="820" y="300" fontFamily="Arial Black" fontWeight="900" fontSize="44" fill={CREAM} opacity="0.55">FAST</text>
          <text x="80"  y="680" fontFamily="Arial Black" fontWeight="900" fontSize="44" fill={CREAM} opacity="0.55">A LOT</text>
          <text x="820" y="680" fontFamily="Arial Black" fontWeight="900" fontSize="36" fill={CREAM} opacity="0.55">NOW</text>
        </svg>
        <div style={{ position: "absolute", bottom: 90, left: "50%", transform: "translateX(-50%)", lineHeight: 0 }}>
          <FlatGuy shirtColor="#8A3030" pantsColor="#4A3020" size={420} mood="excited" />
        </div>
      </Slide>

      {/* ── 7 CTA ─────────────────────────────────────────────────────────── */}
      <div style={{
        width: 1080, height: 1920,
        background: BG,
        position: "relative", overflow: "hidden",
        fontFamily: "var(--font-sans)",
      }}>
        <div style={{
          position: "absolute", inset: 0, pointerEvents: "none",
          background: "radial-gradient(ellipse at 50% 50%, transparent 55%, rgba(0,0,0,0.40) 100%)",
        }} />

        {/* Title */}
        <div style={{ position: "absolute", top: 90, left: 72, right: 72, zIndex: 10 }}>
          <p style={{ fontSize: 132, fontWeight: 700, color: CREAM, lineHeight: 1.08, margin: 0, textShadow: "0 4px 0px rgba(0,0,0,0.35)" }}>
            Hyperfix<br />Fixes All<br />Of This.
          </p>
          <p style={{ fontSize: 52, fontWeight: 700, color: "rgba(94,234,212,0.80)", margin: "22px 0 0", lineHeight: 1.2 }}>
            Free. No account needed.
          </p>
        </div>

        {/* Character holding phone */}
        <div style={{ position: "absolute", bottom: 90, left: "50%", transform: "translateX(-68%)", lineHeight: 0, zIndex: 5 }}>
          <FlatGuy shirtColor="#1A5A3A" pantsColor="#4A3A1A" size={420} mood="happy" cap />
        </div>

        {/* App phone next to character */}
        <div style={{ position: "absolute", bottom: 160, right: 60, lineHeight: 0, zIndex: 5 }}>
          <AppPhone />
        </div>

        {/* CTA pill */}
        <div style={{
          position: "absolute", bottom: 60, left: "50%", transform: "translateX(-50%)",
          zIndex: 20,
          background: "#5EEAD4", borderRadius: 80, padding: "22px 80px",
          boxShadow: "6px 8px 0px rgba(0,0,0,0.50)",
          whiteSpace: "nowrap",
        }}>
          <span style={{ fontSize: 52, fontWeight: 700, color: "#071610", letterSpacing: "-0.01em" }}>
            hyperfix.app
          </span>
        </div>

        <p style={{ position: "absolute", bottom: 16, left: 0, right: 0, textAlign: "center", zIndex: 20, fontSize: 20, fontWeight: 700, color: "rgba(237,217,154,0.28)", margin: 0 }}>
          7 / 7
        </p>
      </div>

    </div>
  );
}
