/* eslint-disable @next/next/no-page-custom-font */
import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "700", "800", "900"],
});
const mono = JetBrains_Mono({
  subsets: ["latin"],
  display: "swap",
  weight: ["500", "700", "800"],
  variable: "--font-mono-card",
});

export const metadata: Metadata = {
  title: "Hyperfix — widget cards",
  robots: { index: false, follow: false },
};

// ─────────────────────────────────────────────────────────────
// Tokens
const SURFACE = "#7F8084";
const CARD = "#0B0B0D";
const CARD_HI = "#16161A";
const PILL_DARK = "#1F1F22";
const PILL_DARK_HI = "#2A2A30";
const PAPER = "#FAFAFA";
const DIM = "#9CA3AF";
const FAINT = "#525861";

// Accent palette per card
const ACCENTS = {
  lime:   { base: "#A3E635", bright: "#C8FF3D", deep: "#65A30D", ink: "#0A0A0A" },
  yellow: { base: "#FACC15", bright: "#FDE047", deep: "#A16207", ink: "#0A0A0A" },
  orange: { base: "#FB923C", bright: "#FDBA74", deep: "#C2410C", ink: "#0A0A0A" },
  pink:   { base: "#F472B6", bright: "#F9A8D4", deep: "#BE185D", ink: "#0A0A0A" },
  red:    { base: "#EF4444", bright: "#F87171", deep: "#991B1B", ink: "#0A0A0A" },
} as const;
type AccentKey = keyof typeof ACCENTS;

// ─────────────────────────────────────────────────────────────
// Card frame — uses an SVG path with a subtle top-center notch
// where the menu dots sit. This is the key shape detail from the
// reference.

function CardShell({
  children,
  accent = "lime",
}: {
  children: React.ReactNode;
  accent?: AccentKey;
}) {
  const a = ACCENTS[accent];
  // shape: rounded rect with a tiny dip in top edge between ~58% and ~78%
  const W = 380, H = 380, R = 32;
  const nLeft = W * 0.58;
  const nRight = W * 0.78;
  const nDip = 7;
  const path = `
    M ${R} 0
    L ${nLeft} 0
    C ${nLeft + 6} 0 ${nLeft + 8} ${nDip} ${(nLeft + nRight) / 2} ${nDip}
    C ${nRight - 8} ${nDip} ${nRight - 6} 0 ${nRight} 0
    L ${W - R} 0
    Q ${W} 0 ${W} ${R}
    L ${W} ${H - R}
    Q ${W} ${H} ${W - R} ${H}
    L ${R} ${H}
    Q 0 ${H} 0 ${H - R}
    L 0 ${R}
    Q 0 0 ${R} 0 Z
  `;
  const id = Math.random().toString(36).slice(2, 8);
  return (
    <div className="relative" style={{ width: W, height: H }}>
      <svg
        className="absolute inset-0"
        width={W}
        height={H}
        style={{
          filter: "drop-shadow(0 18px 28px rgba(0,0,0,0.45)) drop-shadow(0 2px 4px rgba(0,0,0,0.4))",
        }}
      >
        <defs>
          <linearGradient id={`grad-${id}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor={CARD_HI} />
            <stop offset="0.5" stopColor={CARD} />
            <stop offset="1" stopColor={CARD} />
          </linearGradient>
          <clipPath id={`clip-${id}`}>
            <path d={path} />
          </clipPath>
        </defs>
        <path d={path} fill={`url(#grad-${id})`} />
      </svg>
      {/* inner content clipped to the same shape */}
      <div
        className="absolute inset-0"
        style={{
          clipPath: `path('${path.replace(/\s+/g, " ").trim()}')`,
        }}
      >
        {children}
        {/* subtle inner top highlight */}
        <div
          className="absolute inset-x-0 top-0 h-[2px] pointer-events-none"
          style={{
            background:
              "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.08) 50%, transparent 100%)",
          }}
        />
      </div>
      {/* menu dots sit inside the notch */}
      <div
        className="absolute flex gap-[5px] pointer-events-none"
        style={{ left: W * 0.68 - 10, top: 1 }}
      >
        <span className="block w-[4px] h-[4px] rounded-full" style={{ background: "#4A4A52" }} />
        <span className="block w-[4px] h-[4px] rounded-full" style={{ background: "#4A4A52" }} />
        <span className="block w-[4px] h-[4px] rounded-full" style={{ background: "#4A4A52" }} />
      </div>
      {/* invisible accent ref so unused-var doesn't trip */}
      <span hidden>{a.base}</span>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Primitive: Pill with gloss + glow
function Pill({
  children,
  className = "",
  accent = "lime",
  glow = true,
}: {
  children?: React.ReactNode;
  className?: string;
  accent?: AccentKey | "dark";
  glow?: boolean;
}) {
  const isDark = accent === "dark";
  const a = isDark ? null : ACCENTS[accent as AccentKey];
  return (
    <div
      className={`relative rounded-full overflow-hidden ${className}`}
      style={{
        background: isDark ? PILL_DARK : a!.base,
        boxShadow:
          !isDark && glow
            ? `0 0 28px -4px ${a!.base}55, inset 0 1px 0 ${a!.bright}aa`
            : isDark
            ? "inset 0 1px 0 rgba(255,255,255,0.04)"
            : undefined,
      }}
    >
      {!isDark && (
        <div
          className="absolute inset-x-[2px] top-[1px] h-[42%] rounded-full pointer-events-none"
          style={{
            background: `linear-gradient(180deg, ${a!.bright} 0%, transparent 100%)`,
            opacity: 0.5,
          }}
        />
      )}
      <div className="relative">{children}</div>
    </div>
  );
}

// Chip — small pill with text
function Chip({
  children,
  accent = "dark",
  className = "",
}: {
  children: React.ReactNode;
  accent?: AccentKey | "dark";
  className?: string;
}) {
  const isDark = accent === "dark";
  const a = isDark ? null : ACCENTS[accent as AccentKey];
  return (
    <div
      className={`inline-flex items-center justify-center px-[10px] h-[24px] rounded-full text-[11px] font-extrabold tracking-[0.02em] relative overflow-hidden ${className}`}
      style={{
        background: isDark ? PILL_DARK : a!.base,
        color: isDark ? PAPER : a!.ink,
        boxShadow: !isDark
          ? `0 0 20px -4px ${a!.base}66, inset 0 1px 0 ${a!.bright}cc`
          : "inset 0 1px 0 rgba(255,255,255,0.05)",
      }}
    >
      {!isDark && (
        <div
          className="absolute inset-x-[2px] top-[1px] h-[40%] rounded-full pointer-events-none"
          style={{
            background: `linear-gradient(180deg, ${a!.bright} 0%, transparent 100%)`,
            opacity: 0.55,
          }}
        />
      )}
      <span className="relative">{children}</span>
    </div>
  );
}

// Tick marks across a pill (sleep / flight / FM band)
function PillTicks({
  count = 14,
  majorAt = [],
  color = "#000",
  className = "",
}: {
  count?: number;
  majorAt?: number[];
  color?: string;
  className?: string;
}) {
  return (
    <svg
      className={`absolute inset-0 w-full h-full pointer-events-none ${className}`}
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
    >
      {Array.from({ length: count }).map((_, i) => {
        const tx = 4 + (i / (count - 1)) * 92;
        const isMajor =
          majorAt.includes(i) || i === 0 || i === count - 1;
        const th = isMajor ? 26 : 10;
        return (
          <line
            key={i}
            x1={tx}
            x2={tx}
            y1={50 - th / 2}
            y2={50 + th / 2}
            stroke={color}
            strokeWidth={isMajor ? 0.6 : 0.4}
            opacity={isMajor ? 0.7 : 0.35}
            vectorEffect="non-scaling-stroke"
          />
        );
      })}
    </svg>
  );
}

// Glossy round button (radio buttons)
function GlossButton({
  size = 44,
  children,
}: {
  size?: number;
  children?: React.ReactNode;
}) {
  return (
    <div
      className="relative rounded-full flex items-center justify-center text-white"
      style={{
        width: size,
        height: size,
        background:
          "radial-gradient(circle at 50% 28%, #52525A 0%, #27272A 65%, #0F0F11 100%)",
        boxShadow:
          "0 2px 4px rgba(0,0,0,0.4), inset 0 0 0 0.5px rgba(255,255,255,0.06)",
      }}
    >
      <div
        className="absolute rounded-full pointer-events-none"
        style={{
          left: size * 0.18,
          right: size * 0.18,
          top: size * 0.08,
          height: size * 0.32,
          background:
            "linear-gradient(180deg, rgba(255,255,255,0.18) 0%, transparent 100%)",
        }}
      />
      <span className="relative">{children}</span>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Card 1 — CURRENTLY (lime / clock style)
function CardCurrently() {
  return (
    <CardShell accent="lime">
      <div className="absolute top-[26px] left-[28px]">
        <div className="text-[17px] font-bold text-white leading-none">
          Marauders
          <sup className="ml-[3px] text-[11px] font-bold align-super" style={{ color: DIM }}>
            47
          </sup>
        </div>
        <div className="mt-[6px] text-[12px] font-medium" style={{ color: DIM }}>
          fanfic · ao3
        </div>
      </div>

      <div className="absolute top-[16px] right-[22px] flex gap-[6px]">
        <Chip>9/10</Chip>
        <Chip accent="lime">
          <svg width="11" height="10" viewBox="0 0 12 11" fill={ACCENTS.lime.ink}>
            <path d="M6 10 C-1 6 -1 1 3 1 C5 1 6 3 6 4 C6 3 7 1 9 1 C13 1 13 6 6 10 Z" />
          </svg>
        </Chip>
      </div>

      <div className="absolute top-[110px] left-[28px] flex items-baseline">
        <span
          className="font-black tracking-[-0.06em] leading-none text-white tabular-nums"
          style={{ fontSize: 116 }}
        >
          47
        </span>
        <sup
          className="ml-[8px] font-bold align-super"
          style={{ color: DIM, fontSize: 22, lineHeight: 1 }}
        >
          09
        </sup>
      </div>

      <div className="absolute top-[244px] left-[28px] right-[28px] flex items-end justify-between">
        <span
          className="text-[11px] font-extrabold tracking-[0.16em] uppercase"
          style={{ color: DIM }}
        >
          Intensity
        </span>
        <span className="text-[11px] font-extrabold tracking-[0.04em] uppercase text-white">
          Send help · 8H 42M
        </span>
      </div>

      <div className="absolute bottom-[58px] left-[28px] right-[28px] h-[56px]">
        <Pill accent="lime" className="absolute inset-0">
          <div className="w-full h-[56px]" />
        </Pill>
        <PillTicks count={13} majorAt={[6]} />
        <div
          className="absolute -bottom-[20px] left-[18px] text-[10px] font-extrabold tracking-[0.14em] uppercase"
          style={{ color: DIM }}
        >
          08:23
        </div>
        <div
          className="absolute -bottom-[20px] right-[18px] text-[10px] font-extrabold tracking-[0.14em] uppercase"
          style={{ color: DIM }}
        >
          12:44
        </div>
        <div
          className="absolute -top-[22px] right-[6px] text-[11px] font-extrabold tracking-[0.06em] uppercase text-white"
        >
          peak
        </div>
      </div>

      <div className="absolute bottom-[20px] left-[28px] text-[13px] font-medium flex items-center gap-[6px]" style={{ color: DIM }}>
        <svg width="14" height="14" viewBox="0 0 14 14">
          <path
            d="M2 9 Q4 5 7 7 T12 5"
            fill="none"
            stroke={ACCENTS.lime.base}
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </svg>
        9.4 avg this week
      </div>
    </CardShell>
  );
}

// ─────────────────────────────────────────────────────────────
// Card 2 — EULOGY (orange / recording style)
function CardEulogy() {
  const bars = Array.from({ length: 66 }).map((_, i) => {
    const t = i / 65;
    const env = Math.exp(-Math.pow((t - 0.35) * 2.5, 2));
    const tail = t > 0.78 ? Math.max(0, 1 - (t - 0.78) * 5) : 1;
    const seed = (i * 9301 + 7) % 100;
    return env * tail * (0.55 + seed / 200);
  });
  return (
    <CardShell accent="orange">
      <div className="absolute top-[26px] left-[28px] flex items-center gap-[10px]">
        <span
          className="block w-[10px] h-[10px] rounded-full"
          style={{
            background: ACCENTS.orange.base,
            boxShadow: `0 0 14px 2px ${ACCENTS.orange.base}aa`,
          }}
        />
        <span className="text-[17px] font-bold text-white leading-none">
          Ended
        </span>
      </div>

      <div className="absolute top-[18px] right-[22px]">
        <Chip accent="orange">2.4 MB</Chip>
      </div>

      <div className="absolute top-[108px] left-[28px] flex items-baseline">
        <span
          className="font-black tracking-[-0.05em] leading-none text-white tabular-nums"
          style={{ fontSize: 96 }}
        >
          02:52
        </span>
        <sup
          className="ml-[8px] font-bold align-super"
          style={{ color: DIM, fontSize: 22, lineHeight: 1 }}
        >
          26
        </sup>
      </div>

      <div className="absolute top-[214px] left-[28px] text-[13px] font-medium" style={{ color: DIM }}>
        Sabrina Carpenter — Tears
      </div>
      <div className="absolute top-[234px] left-[28px] text-[10px] font-extrabold tracking-[0.18em] uppercase" style={{ color: FAINT }}>
        Mar 14 — Apr 23 · 219 loops
      </div>

      <div
        className="absolute bottom-[28px] left-[28px] right-[28px] h-[60px] rounded-full overflow-hidden"
        style={{
          background: ACCENTS.orange.base,
          boxShadow: `0 0 36px -6px ${ACCENTS.orange.base}77, inset 0 1px 0 ${ACCENTS.orange.bright}`,
        }}
      >
        <div
          className="absolute inset-x-[2px] top-[1px] h-[42%] rounded-full pointer-events-none"
          style={{
            background: `linear-gradient(180deg, ${ACCENTS.orange.bright} 0%, transparent 100%)`,
            opacity: 0.5,
          }}
        />
        <div className="absolute inset-0 flex items-center justify-center gap-[2px] px-[16px]">
          {bars.map((amp, i) => (
            <div
              key={i}
              className="rounded-[2px]"
              style={{
                width: 2.4,
                height: 4 + amp * 50,
                background: "rgba(0,0,0,0.85)",
              }}
            />
          ))}
        </div>
      </div>

      <div className="absolute bottom-[100px] left-[28px] text-[10px] font-extrabold tracking-[0.18em] uppercase" style={{ color: DIM }}>
        .LOOP
      </div>
    </CardShell>
  );
}

// ─────────────────────────────────────────────────────────────
// Card 3 — STREAK (yellow / stock chart)
function CardStreak() {
  const W = 324;
  const H = 100;
  const N = 40;
  const data = Array.from({ length: N }).map((_, i) => {
    const t = i / (N - 1);
    const v = 0.28 + 0.5 * t + Math.sin(i * 0.55) * 0.07 + Math.sin(i * 0.13) * 0.08;
    return Math.max(0.08, Math.min(0.95, v));
  });
  const pts = data.map((v, i) => ({
    x: (i / (N - 1)) * W,
    y: H - v * H,
  }));
  const line = pts
    .map((p, i) => `${i === 0 ? "M" : "L"} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`)
    .join(" ");
  const area = `${line} L ${pts.at(-1)!.x.toFixed(1)} ${H} L ${pts[0].x.toFixed(1)} ${H} Z`;
  const last = pts.at(-1)!;
  const y = ACCENTS.yellow;
  return (
    <CardShell accent="yellow">
      <div className="absolute top-[24px] left-[28px] flex items-center gap-[12px]">
        <div
          className="w-[32px] h-[32px] rounded-[9px] flex items-center justify-center"
          style={{
            background: y.base,
            boxShadow: `0 0 18px -2px ${y.base}77`,
          }}
        >
          <span className="text-[18px] font-black leading-none" style={{ color: y.ink }}>M</span>
        </div>
        <div>
          <div className="text-[18px] font-bold text-white leading-none">
            Marauders
          </div>
          <div className="mt-[4px] text-[10px] font-extrabold uppercase tracking-[0.16em]" style={{ color: DIM }}>
            FANFIC
          </div>
        </div>
      </div>

      <div className="absolute top-[104px] left-[28px]">
        <span
          className="font-black tracking-[-0.05em] leading-none text-white tabular-nums"
          style={{ fontSize: 64 }}
        >
          DAY 47
        </span>
      </div>

      <div className="absolute top-[104px] right-[22px] flex flex-col items-end gap-[8px]">
        <Chip accent="yellow">+1 TODAY</Chip>
        <div className="flex items-center gap-[6px]">
          <svg width="10" height="10" viewBox="0 0 10 10">
            <polygon points="5,0 10,8 0,8" fill={y.base} />
          </svg>
          <span className="text-[13px] font-bold" style={{ color: y.base }}>
            +1,24%
          </span>
        </div>
      </div>

      <div className="absolute top-[186px] left-[28px] text-[13px] font-bold text-white">
        Strong Buy <span className="text-[10px] font-medium" style={{ color: DIM }}>Rating</span>
      </div>
      <div className="absolute top-[182px] right-[28px]">
        <Chip accent="yellow">10 Sec</Chip>
      </div>

      <svg
        className="absolute left-[28px] top-[214px]"
        width={W}
        height={H + 24}
        viewBox={`0 0 ${W} ${H + 24}`}
        style={{ filter: `drop-shadow(0 0 8px ${y.base}55)` }}
      >
        <path d={area} fill={y.base} opacity={0.22} />
        <path d={line} fill="none" stroke={y.base} strokeWidth={2} />
        <line
          x1={last.x}
          x2={last.x}
          y1={0}
          y2={H}
          stroke={y.base}
          strokeWidth={1}
          strokeDasharray="3,3"
        />
        <g fontSize={9} fontWeight={700} fill={DIM}>
          <text x={0} y={H + 18}>10AM</text>
          <text x={W * 0.25} y={H + 18}>11AM</text>
          <text x={W * 0.5} y={H + 18} textAnchor="middle">12PM</text>
          <text x={W * 0.74} y={H + 18}>1PM</text>
          <text x={W} y={H + 18} textAnchor="end">3PM</text>
        </g>
      </svg>
    </CardShell>
  );
}

// ─────────────────────────────────────────────────────────────
// Card 4 — WRAPPED (lime / walking + timeline)
function CardWrapped() {
  return (
    <CardShell accent="lime">
      <div className="absolute top-[24px] left-[28px] flex items-center gap-[12px]">
        <div
          className="w-[32px] h-[32px] rounded-[9px] flex items-center justify-center"
          style={{ background: PILL_DARK_HI }}
        >
          <svg width="14" height="14" viewBox="0 0 14 14">
            <circle cx="7" cy="3" r="1.8" fill={ACCENTS.lime.base} />
            <path
              d="M5 6 L9 6 L8 9 L10 12 L8 12 L7 9 L6 12 L4 12 L6 9 Z"
              fill={ACCENTS.lime.base}
            />
          </svg>
        </div>
        <div>
          <div className="text-[18px] font-bold text-white leading-none">
            Walking
          </div>
          <div className="mt-[4px] text-[10px] font-extrabold uppercase tracking-[0.16em]" style={{ color: DIM }}>
            5 Days streak
          </div>
        </div>
      </div>

      <div className="absolute top-[28px] right-[28px] flex items-center gap-[6px] text-[11px] font-bold" style={{ color: DIM }}>
        <svg width="11" height="11" viewBox="0 0 11 11" fill="none" stroke={DIM} strokeWidth="1.4">
          <circle cx="5.5" cy="5.5" r="4.5" />
          <line x1="5.5" y1="5.5" x2="5.5" y2="2.5" />
          <line x1="5.5" y1="5.5" x2="8" y2="5.5" />
        </svg>
        8:46<sup className="ml-[1px] text-[8px]">PM</sup>
      </div>

      <div className="absolute top-[92px] left-[28px] right-[28px] h-[60px]">
        <Pill accent="lime" className="absolute inset-0">
          <div className="w-full h-[60px]" />
        </Pill>
        <div className="absolute inset-x-0 top-[12px] flex justify-between px-[28px] text-[11px] font-extrabold text-black">
          <span>08:00</span>
          <span>16:10</span>
          <span>20:34</span>
        </div>
        <div className="absolute inset-x-0 top-[34px] flex justify-between px-[28px] text-[10px] font-bold text-black/70 tabular-nums">
          <span>2,251</span>
          <span>841</span>
          <span>1,340</span>
        </div>
      </div>

      <div className="absolute top-[184px] left-[28px] flex items-baseline">
        <span
          className="font-black tracking-[-0.05em] leading-none text-white tabular-nums"
          style={{ fontSize: 80 }}
        >
          4,432
        </span>
      </div>
      <div className="absolute top-[268px] left-[28px] flex items-center gap-[6px] text-[13px] font-bold text-white">
        <svg width="14" height="14" viewBox="0 0 14 14">
          <circle cx="7" cy="3" r="1.8" fill={DIM} />
          <path d="M5 6 L9 6 L8 9 L10 12 L8 12 L7 9 L6 12 L4 12 L6 9 Z" fill={DIM} />
        </svg>
        Steps
        <span className="ml-[4px] text-[12px] font-medium" style={{ color: DIM }}>Today</span>
      </div>

      <div className="absolute top-[184px] right-[28px] text-right">
        <div className="text-[28px] font-black text-white tabular-nums leading-none">
          92 <span className="text-[12px] font-bold" style={{ color: DIM }}>BPM</span>
        </div>
        <svg width="100" height="40" viewBox="0 0 100 40" className="mt-[6px]">
          <path
            d="M0 30 L20 28 L35 12 L50 26 L65 18 L80 22 L100 14"
            fill="none"
            stroke={ACCENTS.lime.base}
            strokeWidth="2"
          />
        </svg>
      </div>

      <div className="absolute bottom-[22px] left-[28px] right-[28px] flex justify-between text-[12px] font-bold text-white">
        <div className="flex items-center gap-[6px]">
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke={ACCENTS.lime.base} strokeWidth="1.4">
            <path d="M3 6 a3 3 0 1 0 3 -3" /><path d="M5.5 1.5 L6 3 L4.5 3" />
          </svg>
          7.20 <span className="font-medium" style={{ color: DIM }}>km</span>
        </div>
        <div className="flex items-center gap-[6px]">
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke={ACCENTS.lime.base} strokeWidth="1.4">
            <circle cx="6" cy="6" r="4.5" /><line x1="6" y1="6" x2="6" y2="3" /><line x1="6" y1="6" x2="8" y2="6" />
          </svg>
          320 <span className="font-medium" style={{ color: DIM }}>min</span>
        </div>
        <div className="flex items-center gap-[6px]">
          <svg width="12" height="12" viewBox="0 0 12 12">
            <path d="M6 11 C2 9 2 5 5 3 C5 5 7 5 6 1 C9 3 11 6 10 8 C10 10 8 11 6 11 Z" fill={ACCENTS.lime.base} />
          </svg>
          2,340 <span className="font-medium" style={{ color: DIM }}>kCal</span>
        </div>
      </div>
    </CardShell>
  );
}

// ─────────────────────────────────────────────────────────────
// Card 5 — MILESTONE (lime / flight style)
function CardMilestone() {
  return (
    <CardShell accent="lime">
      <div className="absolute top-[26px] left-[28px] text-[16px] font-extrabold tracking-[0.06em] text-white">
        HFX047
      </div>

      <div className="absolute top-[80px] left-[28px]">
        <div
          className="font-black tracking-[-0.05em] leading-[0.95] text-white"
          style={{ fontSize: 60 }}
        >
          MAR
        </div>
        <div className="mt-[6px] text-[12px] font-medium" style={{ color: DIM }}>
          Today
        </div>
      </div>
      <div className="absolute top-[80px] right-[28px] text-right">
        <div
          className="font-black tracking-[-0.05em] leading-[0.95] text-white"
          style={{ fontSize: 60 }}
        >
          JUN
        </div>
        <div className="mt-[6px] text-[12px] font-medium" style={{ color: DIM }}>
          Milestone
        </div>
      </div>

      <div className="absolute top-[112px] left-1/2 -translate-x-1/2 flex flex-col items-center">
        <svg width="64" height="14" viewBox="0 0 64 14">
          <line x1="0" y1="7" x2="64" y2="7" stroke={ACCENTS.lime.base} strokeWidth="1" strokeDasharray="3,3" />
          <polygon points="32,1 42,7 32,13 30,7" fill={ACCENTS.lime.base} />
        </svg>
        <div className="mt-[6px] text-[10px] font-extrabold tracking-[0.18em]" style={{ color: ACCENTS.lime.base }}>
          53 DAYS
        </div>
      </div>

      <div className="absolute top-[170px] left-[28px] right-[28px] h-[60px]">
        <Pill accent="lime" className="absolute inset-0">
          <div className="w-full h-[60px]" />
        </Pill>
        <div className="absolute inset-x-0 top-[14px] flex justify-between px-[28px] text-[11px] font-extrabold text-black">
          <span>15:00</span>
          <span>19:22</span>
        </div>
        <div className="absolute inset-x-0 top-[34px] flex justify-between px-[28px] text-[10px] font-bold text-black/70 uppercase tracking-[0.1em]">
          <span>start</span>
          <span>now</span>
        </div>
        <svg className="absolute inset-y-0 left-1/2 -translate-x-1/2" width="14" height="60" viewBox="0 0 14 60">
          <polygon points="3,28 11,32 3,36 1,32" fill="black" opacity="0.5" />
        </svg>
      </div>

      <div className="absolute bottom-[80px] left-[28px]">
        <div
          className="font-black tracking-[-0.04em] leading-none text-white tabular-nums"
          style={{ fontSize: 36 }}
        >
          15:00
        </div>
      </div>
      <div className="absolute bottom-[80px] right-[28px] text-right">
        <div
          className="font-black tracking-[-0.04em] leading-none text-white tabular-nums"
          style={{ fontSize: 36 }}
        >
          22:19
        </div>
      </div>
      <div className="absolute bottom-[58px] left-1/2 -translate-x-1/2 text-[12px] font-medium" style={{ color: DIM }}>
        With transfer
      </div>

      <div className="absolute bottom-[22px] left-[28px] text-[12px] font-bold" style={{ color: DIM }}>
        08 Mar, 2026
      </div>
      <div className="absolute bottom-[22px] right-[28px] text-[12px] font-bold" style={{ color: DIM }}>
        30 Jun, 2026
      </div>
    </CardShell>
  );
}

// ─────────────────────────────────────────────────────────────
// Card 6 — LOOP (pink / radio style w/ glossy buttons)
function CardLoop() {
  const p = ACCENTS.pink;
  return (
    <CardShell accent="pink">
      <div className="absolute top-[24px] left-[28px] flex items-center gap-[10px]">
        <span
          className="block w-[9px] h-[9px] rounded-full"
          style={{
            background: ACCENTS.red.base,
            boxShadow: `0 0 12px 2px ${ACCENTS.red.base}aa`,
          }}
        />
        <span className="text-[17px] font-bold text-white leading-none">
          Loop Hard<sup className="text-[9px] align-super">™</sup>
        </span>
      </div>

      <div className="absolute top-[18px] right-[22px] flex gap-[6px]">
        <Chip>AM</Chip>
        <Chip accent="red">FM</Chip>
      </div>

      <div className="absolute top-[80px] left-[28px] flex items-baseline">
        <span
          className="font-black tracking-[-0.05em] leading-none text-white tabular-nums"
          style={{ fontSize: 72 }}
        >
          102.6
        </span>
        <span className="ml-[10px] text-[14px] font-bold" style={{ color: DIM }}>
          MHz
        </span>
      </div>

      <div className="absolute top-[170px] left-[28px] text-[11px] font-extrabold tracking-[0.18em] text-white uppercase">
        Sabrina Carpenter — Tears
      </div>

      <div className="absolute top-[200px] left-[28px] right-[28px] h-[58px]">
        <div
          className="absolute inset-0 rounded-full overflow-hidden"
          style={{
            background: p.base,
            boxShadow: `0 0 30px -6px ${p.base}88, inset 0 1px 0 ${p.bright}cc`,
          }}
        >
          <div
            className="absolute inset-x-[2px] top-[1px] h-[42%] rounded-full pointer-events-none"
            style={{
              background: `linear-gradient(180deg, ${p.bright} 0%, transparent 100%)`,
              opacity: 0.5,
            }}
          />
        </div>
        <PillTicks count={24} majorAt={[0, 8, 16, 23]} />
        <div className="absolute -bottom-[16px] left-0 right-0 flex justify-between px-[10px] text-[9px] font-bold tabular-nums" style={{ color: DIM }}>
          <span>99</span>
          <span>100</span>
          <span>101</span>
          <span>103</span>
          <span>105</span>
        </div>
        <div className="absolute -top-[14px] right-[6px] text-[10px] font-bold tabular-nums" style={{ color: DIM }}>
          .6
        </div>
      </div>

      <div className="absolute bottom-[18px] left-[20px] right-[20px] flex justify-between items-center">
        <GlossButton size={38}>
          <svg width="14" height="14" viewBox="0 0 14 14"><polygon points="7,0 9,5 14,5 10,8 12,13 7,10 2,13 4,8 0,5 5,5" fill={p.base}/></svg>
        </GlossButton>
        <GlossButton size={40}>
          <svg width="13" height="13" viewBox="0 0 13 13"><polygon points="13,1 4,6.5 13,12" fill="white"/><rect x="0" y="1" width="3" height="11" fill="white"/></svg>
        </GlossButton>
        <GlossButton size={44}>
          <svg width="12" height="12" viewBox="0 0 12 12"><rect x="1" y="1" width="4" height="10" fill="white"/><rect x="7" y="1" width="4" height="10" fill="white"/></svg>
        </GlossButton>
        <GlossButton size={40}>
          <svg width="13" height="13" viewBox="0 0 13 13"><polygon points="0,1 9,6.5 0,12" fill="white"/><rect x="10" y="1" width="3" height="11" fill="white"/></svg>
        </GlossButton>
      </div>
    </CardShell>
  );
}

// ─────────────────────────────────────────────────────────────
// Page
export default function CardsPage() {
  return (
    <main
      className={`min-h-screen flex items-center justify-center p-10 ${inter.className} ${mono.variable}`}
      style={{ background: SURFACE }}
    >
      <style>{`
        .tabular-nums { font-variant-numeric: tabular-nums; }
        sub, sup { font-feature-settings: "sups"; }
      `}</style>
      <div className="grid grid-cols-3 gap-6">
        <CardCurrently />
        <CardMilestone />
        <CardWrapped />
        <CardStreak />
        <CardEulogy />
        <CardLoop />
      </div>
    </main>
  );
}
