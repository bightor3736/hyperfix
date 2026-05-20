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
  variable: "--font-mono-brand",
});

export const metadata: Metadata = {
  title: "Hyperfix — logo specimen",
  robots: { index: false, follow: false },
};

// ─────────────────────────────────────────────────────────────
// Tokens
const LIME = "#A855F7";
const LIME_DEEP = "#7CB205";
const LIME_DARK = "#4D7C0F";
const INK = "#0A0A0A";
const INK_2 = "#16161A";
const INK_3 = "#1F1F22";
const PAPER = "#F4F4F4";
const PAPER_DEEP = "#E8E4DC";
const DIM = "#6B7280";
const MUTED = "#9CA3AF";

// ─────────────────────────────────────────────────────────────
// The mark — Focus Arrow.
// Two stacked chevrons. Drawn on a 64-unit grid.
function FocusArrow({
  size = 64,
  fg = LIME,
  accent = LIME_DEEP,
  bg = INK,
  radius,
  tile = true,
  className = "",
}: {
  size?: number;
  fg?: string;
  accent?: string;
  bg?: string;
  radius?: number;
  tile?: boolean;
  className?: string;
}) {
  const r = radius ?? size * 0.22;
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      className={className}
      aria-hidden="true"
    >
      {tile && <rect width={64} height={64} rx={r * (64 / size)} fill={bg} />}
      <path
        d="M14 40 L32 20 L50 40 L42 40 L32 28 L22 40 Z"
        fill={fg}
      />
      <path
        d="M14 50 L32 30 L50 50 L42 50 L32 38 L22 50 Z"
        fill={accent}
      />
    </svg>
  );
}

// Wordmark
function Wordmark({
  size = 56,
  color = PAPER,
  className = "",
}: {
  size?: number;
  color?: string;
  className?: string;
}) {
  return (
    <span
      className={className}
      style={{
        fontFamily: inter.style.fontFamily,
        fontSize: size,
        fontWeight: 900,
        letterSpacing: `${-size * 0.045}px`,
        color,
        lineHeight: 1,
        display: "inline-block",
      }}
    >
      Hyperfix
    </span>
  );
}

// Horizontal lockup
function Lockup({
  markSize = 56,
  fontSize = 44,
  textColor = PAPER,
  markBg = INK,
  markFg = LIME,
  markAccent = LIME_DEEP,
  gap,
  className = "",
}: {
  markSize?: number;
  fontSize?: number;
  textColor?: string;
  markBg?: string;
  markFg?: string;
  markAccent?: string;
  gap?: number;
  className?: string;
}) {
  return (
    <div className={`inline-flex items-center ${className}`} style={{ gap: gap ?? markSize * 0.32 }}>
      <FocusArrow size={markSize} fg={markFg} accent={markAccent} bg={markBg} />
      <Wordmark size={fontSize} color={textColor} />
    </div>
  );
}

// Vertical (stacked) lockup
function VerticalLockup({
  markSize = 96,
  fontSize = 32,
  textColor = PAPER,
  markBg = INK,
  markFg = LIME,
  markAccent = LIME_DEEP,
}: {
  markSize?: number;
  fontSize?: number;
  textColor?: string;
  markBg?: string;
  markFg?: string;
  markAccent?: string;
}) {
  return (
    <div className="inline-flex flex-col items-center gap-4">
      <FocusArrow size={markSize} fg={markFg} accent={markAccent} bg={markBg} />
      <Wordmark size={fontSize} color={textColor} />
    </div>
  );
}

// Section header
function SectionLabel({ no, title }: { no: string; title: string }) {
  return (
    <div className="flex items-center gap-3 mb-6">
      <span
        className="text-[10px] font-extrabold tracking-[0.22em] uppercase"
        style={{ color: DIM }}
      >
        {no} · {title}
      </span>
      <div className="flex-1 h-px" style={{ background: INK_3 }} />
    </div>
  );
}

// Caption under tiles
function Caption({ children, color = DIM }: { children: React.ReactNode; color?: string }) {
  return (
    <span
      className="text-[10px] font-extrabold tracking-[0.18em] uppercase"
      style={{ color }}
    >
      {children}
    </span>
  );
}

// ─────────────────────────────────────────────────────────────
// Tiles

// Tile shell — generic container
function Tile({
  bg = INK_2,
  border = false,
  children,
  className = "",
  style = {},
}: {
  bg?: string;
  border?: boolean;
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <div
      className={`relative rounded-[14px] overflow-hidden ${className}`}
      style={{
        background: bg,
        boxShadow: border ? `inset 0 0 0 1px ${INK_3}` : undefined,
        ...style,
      }}
    >
      {children}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Page sections

// 1 · Primary hero — full-bleed dark, big lockup
function HeroSection() {
  return (
    <Tile bg={INK} className="col-span-12 h-[420px]">
      <div className="absolute top-6 left-7 right-7 flex items-center justify-between">
        <Caption color={LIME}>01 · PRIMARY LOCKUP</Caption>
        <Caption>HYPERFIX · IDENTITY · 2026</Caption>
      </div>
      <div className="absolute inset-0 flex items-center justify-center">
        <Lockup markSize={120} fontSize={96} />
      </div>
      <div className="absolute bottom-7 left-7 right-7 flex items-end justify-between">
        <div className="text-[13px] font-medium" style={{ color: MUTED }}>
          The hyperfixation tracker.
          <br />
          Days, intensity, eulogies.
        </div>
        <Caption>SPECIMEN · v0.1</Caption>
      </div>
    </Tile>
  );
}

// 2 · Mark variations — 4 colorways
function MarkVariationsSection() {
  const variants = [
    { label: "Primary",     bg: INK,   markBg: INK,   markFg: LIME, markAccent: LIME_DEEP },
    { label: "Knockout",    bg: LIME,  markBg: INK,   markFg: LIME, markAccent: LIME_DEEP },
    { label: "Reverse",     bg: LIME,  markBg: LIME,  markFg: INK,  markAccent: INK_3 },
    { label: "Monochrome",  bg: PAPER, markBg: PAPER, markFg: INK,  markAccent: INK_3, border: true },
  ];
  return (
    <div className="col-span-12">
      <SectionLabel no="02" title="Mark colorways" />
      <div className="grid grid-cols-4 gap-4">
        {variants.map((v) => (
          <div key={v.label} className="flex flex-col gap-3">
            <Tile bg={v.bg} border={v.border} className="aspect-square flex items-center justify-center">
              <FocusArrow
                size={112}
                bg={v.markBg}
                fg={v.markFg}
                accent={v.markAccent}
              />
            </Tile>
            <Caption>{v.label.toUpperCase()}</Caption>
          </div>
        ))}
      </div>
    </div>
  );
}

// 3 · Wordmark — large paper-bg specimen
function WordmarkSection() {
  return (
    <div className="col-span-12">
      <SectionLabel no="03" title="Wordmark" />
      <Tile bg={PAPER} className="h-[300px] flex items-center justify-center">
        <div className="relative flex items-center">
          {/* clearspace ticks */}
          <div className="absolute -left-12 -top-[68px] -bottom-[18px] flex flex-col items-center justify-between">
            <div className="h-3 w-px" style={{ background: DIM }} />
            <div className="w-px flex-1" style={{ background: DIM }} />
            <div className="h-3 w-px" style={{ background: DIM }} />
          </div>
          <span
            className="absolute -left-[58px] top-1/2 -translate-y-1/2 text-[10px] font-extrabold tracking-[0.18em] uppercase rotate-[-90deg]"
            style={{ color: DIM }}
          >
            1X CAP
          </span>
          <Wordmark size={140} color={INK} />
        </div>
      </Tile>
      <div className="mt-4 grid grid-cols-3 gap-4">
        <div>
          <Caption>Typeface</Caption>
          <div className="text-[13px] font-bold mt-1" style={{ color: PAPER }}>
            Inter Display · Black (900)
          </div>
        </div>
        <div>
          <Caption>Tracking</Caption>
          <div className="text-[13px] font-bold mt-1" style={{ color: PAPER }}>
            −4.5% at all sizes
          </div>
        </div>
        <div>
          <Caption>Clearspace</Caption>
          <div className="text-[13px] font-bold mt-1" style={{ color: PAPER }}>
            ≥ 1× cap height
          </div>
        </div>
      </div>
    </div>
  );
}

// 4 · Color palette — swatches with full color specs
function PaletteSection() {
  const swatches = [
    {
      name: "Acid",
      role: "Accent",
      hex: "#A855F7",
      rgb: "163, 230, 53",
      cmyk: "29, 0, 77, 10",
      pantone: "382 C",
      fill: LIME,
      fg: INK,
    },
    {
      name: "Ink",
      role: "Surface",
      hex: "#0A0A0A",
      rgb: "10, 10, 10",
      cmyk: "0, 0, 0, 96",
      pantone: "Black 6 C",
      fill: INK,
      fg: PAPER,
    },
    {
      name: "Paper",
      role: "Page",
      hex: "#F4F4F4",
      rgb: "244, 244, 244",
      cmyk: "0, 0, 0, 4",
      pantone: "Cool Gray 1 C",
      fill: PAPER,
      fg: INK,
      border: true,
    },
  ];
  return (
    <div className="col-span-12">
      <SectionLabel no="04" title="Palette" />
      <div className="grid grid-cols-3 gap-4">
        {swatches.map((s) => (
          <Tile key={s.name} bg={s.fill} border={s.border} className="h-[240px] relative">
            <div className="absolute inset-0 p-6 flex flex-col justify-between">
              <div className="flex items-start justify-between">
                <div>
                  <Caption color={s.fg === INK ? "#525861" : "#9CA3AF"}>{`0${swatches.indexOf(s)+1} · ${s.role}`}</Caption>
                  <div
                    className="mt-2 text-[28px] font-black tracking-[-0.04em]"
                    style={{ color: s.fg }}
                  >
                    {s.name}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-[20px] font-black tracking-[-0.02em]" style={{ color: s.fg }}>
                    {s.hex}
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-3 text-[10px] font-bold tracking-[0.06em] uppercase">
                <div>
                  <div className="opacity-60" style={{ color: s.fg }}>RGB</div>
                  <div className="mt-0.5" style={{ color: s.fg }}>{s.rgb}</div>
                </div>
                <div>
                  <div className="opacity-60" style={{ color: s.fg }}>CMYK</div>
                  <div className="mt-0.5" style={{ color: s.fg }}>{s.cmyk}</div>
                </div>
                <div>
                  <div className="opacity-60" style={{ color: s.fg }}>PMS</div>
                  <div className="mt-0.5" style={{ color: s.fg }}>{s.pantone}</div>
                </div>
              </div>
            </div>
          </Tile>
        ))}
      </div>
    </div>
  );
}

// 5 · Typography — Aa specimen + alphabet
function TypographySection() {
  return (
    <div className="col-span-12">
      <SectionLabel no="05" title="Typography" />
      <div className="grid grid-cols-12 gap-4">
        <Tile bg={PAPER} className="col-span-4 h-[280px] relative">
          <div className="absolute inset-0 flex items-center justify-center">
            <span
              className="font-black leading-none"
              style={{
                fontFamily: inter.style.fontFamily,
                fontSize: 220,
                color: INK,
                letterSpacing: "-12px",
              }}
            >
              Aa
            </span>
          </div>
          <div className="absolute top-5 left-5 text-[10px] font-extrabold tracking-[0.18em] uppercase" style={{ color: "#525861" }}>
            DISPLAY · INTER 900
          </div>
        </Tile>

        <Tile bg={INK_2} className="col-span-8 h-[280px] p-7">
          <div className="text-[10px] font-extrabold tracking-[0.18em] uppercase mb-5" style={{ color: DIM }}>
            CHARACTER SET
          </div>
          <div
            className="text-[24px] font-black tracking-[0.02em] mb-2"
            style={{ color: PAPER, fontFamily: inter.style.fontFamily }}
          >
            ABCDEFGHIJKLMNOPQRSTUVWXYZ
          </div>
          <div
            className="text-[24px] font-medium tracking-[0.02em] mb-2"
            style={{ color: PAPER, fontFamily: inter.style.fontFamily }}
          >
            abcdefghijklmnopqrstuvwxyz
          </div>
          <div
            className="text-[22px] tabular-nums mb-6"
            style={{
              color: PAPER,
              fontFamily: mono.style.fontFamily,
              fontFeatureSettings: '"tnum"',
            }}
          >
            0 1 2 3 4 5 6 7 8 9 — & % @ #
          </div>
          <div className="grid grid-cols-3 gap-4 pt-5" style={{ borderTop: `1px solid ${INK_3}` }}>
            <div>
              <Caption>Display</Caption>
              <div className="mt-1 text-[14px] font-bold" style={{ color: PAPER }}>Inter 900</div>
            </div>
            <div>
              <Caption>Body</Caption>
              <div className="mt-1 text-[14px] font-bold" style={{ color: PAPER }}>Inter 500 / 700</div>
            </div>
            <div>
              <Caption>Mono</Caption>
              <div className="mt-1 text-[14px] font-bold" style={{ color: PAPER }}>JetBrains 700</div>
            </div>
          </div>
        </Tile>
      </div>
    </div>
  );
}

// 6 · Sizing — mark at multiple sizes
function SizingSection() {
  const sizes = [128, 96, 72, 56, 40, 28, 20, 16];
  return (
    <div className="col-span-12">
      <SectionLabel no="06" title="Sizing" />
      <Tile bg={INK_2} className="h-[240px] flex items-end gap-8 px-10 pb-10 pt-8">
        {sizes.map((s) => (
          <div key={s} className="flex flex-col items-center gap-3">
            <FocusArrow size={s} />
            <Caption>{s}px</Caption>
          </div>
        ))}
      </Tile>
    </div>
  );
}

// 7 · Lockups
function LockupsSection() {
  return (
    <div className="col-span-12">
      <SectionLabel no="07" title="Lockups" />
      <div className="grid grid-cols-2 gap-4">
        <Tile bg={INK_2} className="h-[200px] flex items-center justify-center">
          <Lockup markSize={64} fontSize={48} />
        </Tile>
        <Tile bg={LIME} className="h-[200px] flex items-center justify-center">
          <Lockup
            markSize={64}
            fontSize={48}
            textColor={INK}
            markBg={INK}
            markFg={LIME}
            markAccent={LIME_DEEP}
          />
        </Tile>
        <Tile bg={INK_2} className="h-[260px] flex items-center justify-center">
          <VerticalLockup markSize={88} fontSize={32} />
        </Tile>
        <Tile bg={PAPER} className="h-[260px] flex items-center justify-center" border>
          <VerticalLockup
            markSize={88}
            fontSize={32}
            textColor={INK}
            markBg={PAPER}
            markFg={INK}
            markAccent={INK_3}
          />
        </Tile>
      </div>
    </div>
  );
}

// 8 · Don'ts
function DontsSection() {
  return (
    <div className="col-span-12">
      <SectionLabel no="08" title="Misuse" />
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: "Don't stretch", svg: (
            <FocusArrow size={96} />
          ), transform: "scaleX(1.4)" },
          { label: "Don't recolor",  svg: (
            <FocusArrow size={96} fg="#F472B6" accent="#BE185D" />
          )},
          { label: "Don't tilt",     svg: (
            <FocusArrow size={96} />
          ), transform: "rotate(-12deg)" },
          { label: "Don't outline",  svg: (
            <svg width="96" height="96" viewBox="0 0 64 64">
              <rect width="64" height="64" rx="14" fill={INK} />
              <path d="M14 40 L32 20 L50 40 L42 40 L32 28 L22 40 Z" fill="none" stroke={LIME} strokeWidth="1.5"/>
              <path d="M14 50 L32 30 L50 50 L42 50 L32 38 L22 50 Z" fill="none" stroke={LIME_DEEP} strokeWidth="1.5"/>
            </svg>
          )},
        ].map((d) => (
          <div key={d.label} className="flex flex-col gap-3">
            <Tile bg={INK_2} className="aspect-square flex items-center justify-center relative">
              <div style={{ transform: d.transform }}>{d.svg}</div>
              <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 100 100" preserveAspectRatio="none">
                <line x1="0" y1="100" x2="100" y2="0" stroke="#EF4444" strokeWidth="0.6" vectorEffect="non-scaling-stroke" />
              </svg>
            </Tile>
            <Caption color="#EF4444">{d.label.toUpperCase()}</Caption>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Page

export default function LogoSpecimen() {
  return (
    <main
      className={`min-h-screen ${inter.className} ${mono.variable}`}
      style={{ background: INK, fontFamily: inter.style.fontFamily }}
    >
      <style>{`
        .tabular-nums { font-variant-numeric: tabular-nums; }
      `}</style>
      <div className="max-w-[1280px] mx-auto px-10 py-12">
        {/* page header */}
        <div className="flex items-center justify-between mb-8">
          <Lockup markSize={32} fontSize={24} />
          <div className="flex items-center gap-8">
            <Caption>SPEC · v0.1</Caption>
            <Caption>BRAND BOOK · 01 / 01</Caption>
          </div>
        </div>
        <div className="h-px mb-10" style={{ background: INK_3 }} />

        {/* grid sections */}
        <div className="grid grid-cols-12 gap-8">
          <HeroSection />
          <MarkVariationsSection />
          <WordmarkSection />
          <PaletteSection />
          <TypographySection />
          <SizingSection />
          <LockupsSection />
          <DontsSection />
        </div>

        {/* page footer */}
        <div className="mt-12 pt-6 flex items-center justify-between" style={{ borderTop: `1px solid ${INK_3}` }}>
          <Caption>© 2026 HYPERFIX</Caption>
          <Caption>NOT FOR EXTERNAL DISTRIBUTION</Caption>
        </div>
      </div>
    </main>
  );
}
