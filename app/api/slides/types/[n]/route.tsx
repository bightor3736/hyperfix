import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";

export const runtime = "edge";

const W = 1080;
const H = 1920;
const TOTAL = 8;

const BG = "#F8F5F0";
const INK = "#111111";
const DIM = "rgba(17,17,17,0.45)";
const ACCENT = "#5EEAD4";
const ACCENT_DARK = "#0D9488";
const CARD_TEXT = "#042F2E";
const BORDER = "rgba(17,17,17,0.07)";

function GemMark({ size = 44 }: { size?: number }) {
  return (
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
      <path d="M43,32 L39,39 L32,43 L25,39 L21,32 L25,25 L32,21 L39,25 Z" fill="rgba(255,255,255,0.2)" />
    </svg>
  );
}

function TopBar({ n, total }: { n: number; total: number }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
        <GemMark size={44} />
        <div style={{ display: "flex", fontFamily: "Georgia, serif", fontSize: 28, fontWeight: 700, letterSpacing: "-0.05em", lineHeight: 1 }}>
          <span style={{ color: "#111111" }}>hyper</span>
          <span style={{ color: "#0D9488", fontStyle: "italic" }}>fix</span>
        </div>
      </div>
      <span style={{ fontFamily: "monospace", fontSize: 17, letterSpacing: "0.18em", color: "rgba(17,17,17,0.25)", textTransform: "uppercase" }}>
        {String(n).padStart(2, "0")} / {String(total).padStart(2, "0")}
      </span>
    </div>
  );
}

function Dots({ current, total }: { current: number; total: number }) {
  const dots = [];
  for (let i = 1; i <= total; i++) {
    dots.push(
      <div key={i} style={{ width: i === current ? 28 : 7, height: 7, borderRadius: 4, background: i === current ? "#0D9488" : "rgba(17,17,17,0.15)" }} />
    );
  }
  return <div style={{ display: "flex", gap: 7, alignItems: "center" }}>{dots}</div>;
}

// ─── slide 1 · cover ─────────────────────────────────────────────────
function Slide1() {
  return (
    <div style={{ width: W, height: H, background: BG, display: "flex", flexDirection: "column", padding: "100px 88px", fontFamily: "sans-serif" }}>
      <TopBar n={1} total={TOTAL} />

      <div style={{ display: "flex", flexDirection: "column", marginTop: 140 }}>
        <div style={{ display: "flex", padding: "14px 28px", background: ACCENT, borderRadius: 100, alignSelf: "flex-start", marginBottom: 60 }}>
          <span style={{ fontFamily: "monospace", fontSize: 22, letterSpacing: "0.14em", textTransform: "uppercase", color: CARD_TEXT, fontWeight: 700 }}>
            which one are you?
          </span>
        </div>

        <div style={{ display: "flex", flexDirection: "column", fontSize: 118, fontWeight: 900, lineHeight: 0.88, letterSpacing: "-0.05em", marginBottom: 56 }}>
          <span style={{ color: INK }}>6 types of</span>
          <span style={{ color: INK }}>hyperfix-</span>
          <span style={{ color: ACCENT_DARK }}>ators.</span>
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", marginTop: "auto" }}>
        <span style={{ fontSize: 36, color: DIM, lineHeight: 1.4, maxWidth: 780, marginBottom: 64 }}>
          comment your number below.
        </span>
        <Dots current={1} total={TOTAL} />
      </div>
    </div>
  );
}

// ─── type slide template ───────────────────────────────────────────────
function TypeSlide({
  n, label, headline, description, quote,
}: {
  n: number; label: string; headline: string; description: string; quote: string;
}) {
  return (
    <div style={{ width: W, height: H, background: BG, display: "flex", flexDirection: "column", padding: "100px 88px", fontFamily: "sans-serif" }}>
      <TopBar n={n} total={TOTAL} />

      <div style={{ display: "flex", flexDirection: "column", marginTop: 90 }}>
        <span style={{ fontFamily: "monospace", fontSize: 20, letterSpacing: "0.26em", textTransform: "uppercase", color: DIM, marginBottom: 28 }}>
          {label}
        </span>

        <div style={{ display: "flex", flexDirection: "column", fontSize: 100, fontWeight: 900, lineHeight: 0.9, letterSpacing: "-0.05em", marginBottom: 64 }}>
          <span style={{ color: INK }}>{headline}</span>
        </div>

        <div style={{ display: "flex", flexDirection: "column", background: ACCENT, borderRadius: 28, padding: "52px 56px", marginBottom: 52 }}>
          <span style={{ fontSize: 38, fontWeight: 600, color: CARD_TEXT, lineHeight: 1.45, letterSpacing: "-0.01em" }}>
            {description}
          </span>
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", marginTop: "auto" }}>
        <span style={{ fontSize: 34, fontStyle: "italic", color: DIM, lineHeight: 1.4, marginBottom: 64 }}>
          {quote}
        </span>
        <Dots current={n} total={TOTAL} />
      </div>
    </div>
  );
}

// ─── slide 8 · cta ───────────────────────────────────────────────────
function Slide8() {
  const features = [
    "name it. give it a start date.",
    "rate your intensity 1-10",
    "build your graveyard",
    "see who you've been",
  ];
  return (
    <div style={{ width: W, height: H, background: BG, display: "flex", flexDirection: "column", padding: "100px 88px", fontFamily: "sans-serif" }}>
      <TopBar n={8} total={TOTAL} />

      <div style={{ display: "flex", flexDirection: "column", marginTop: 110 }}>
        <div style={{ display: "flex", flexDirection: "column", fontSize: 100, fontWeight: 900, lineHeight: 0.9, letterSpacing: "-0.05em", marginBottom: 64 }}>
          <span style={{ color: INK }}>track which</span>
          <span style={{ color: INK }}>type you are.</span>
          <span style={{ color: ACCENT_DARK, marginTop: 12 }}>log every</span>
          <span style={{ color: ACCENT_DARK }}>fixation.</span>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 28, marginBottom: 72 }}>
          {features.map((item, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 22 }}>
              <div style={{ display: "flex", width: 14, height: 14, borderRadius: 7, background: ACCENT_DARK, flexShrink: 0 }} />
              <span style={{ fontSize: 36, fontWeight: 600, color: INK, letterSpacing: "-0.01em", lineHeight: 1.3 }}>{item}</span>
            </div>
          ))}
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", marginTop: "auto", gap: 32 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
          <GemMark size={52} />
          <div style={{ display: "flex", fontFamily: "Georgia, serif", fontSize: 48, fontWeight: 700, letterSpacing: "-0.05em", lineHeight: 1 }}>
            <span style={{ color: INK }}>hyper</span>
            <span style={{ color: ACCENT_DARK, fontStyle: "italic" }}>fix</span>
            <span style={{ color: DIM }}>.app</span>
          </div>
        </div>
        <div style={{ display: "flex", padding: "20px 44px", background: ACCENT_DARK, borderRadius: 100, alignSelf: "flex-start" }}>
          <span style={{ fontSize: 26, fontWeight: 800, color: "#ffffff" }}>free to use - link in bio</span>
        </div>
        <Dots current={8} total={TOTAL} />
      </div>
    </div>
  );
}

const TYPES = [
  {
    label: "type 01",
    headline: "The Collector",
    description: "buys the merch before finishing the first episode. has 3 notebooks and 7 browser profiles dedicated to this.",
    quote: "\"I just need one more thing about it.\"",
  },
  {
    label: "type 02",
    headline: "The Evangelist",
    description: "has explained it to 6 people this week. 4 of them didn't ask. 2 of them have blocked your number.",
    quote: "\"okay but hear me out for a second.\"",
  },
  {
    label: "type 03",
    headline: "The Academic",
    description: "knows more than actual experts. could write a thesis. might write a thesis. has considered writing a thesis.",
    quote: "\"actually that's a common misconception.\"",
  },
  {
    label: "type 04",
    headline: "The Creator",
    description: "immediately starts making something. a playlist, a doc, a fan edit, a business plan. most of it never gets finished.",
    quote: "\"I have an idea.\"",
  },
  {
    label: "type 05",
    headline: "The Ghost",
    description: "goes extremely deep for 2 weeks then vanishes. no explanation. just gone. already onto the next thing.",
    quote: "\"wait, I used to love that.\"",
  },
  {
    label: "type 06",
    headline: "The Recursive",
    description: "hyperfixating on hyperfixating. has researched ADHD for 200 hours. built a graveyard of dead fixations. probably uses an app to track them.",
    quote: "\"this one's about me isn't it.\"",
  },
];

// ─── route ───────────────────────────────────────────────────────────
export async function GET(_req: NextRequest, { params }: { params: Promise<{ n: string }> }) {
  const { n } = await params;
  const slide = parseInt(n, 10);

  let el: React.ReactElement;
  if (slide === 1) {
    el = <Slide1 />;
  } else if (slide >= 2 && slide <= 7) {
    const t = TYPES[slide - 2];
    el = <TypeSlide n={slide} label={t.label} headline={t.headline} description={t.description} quote={t.quote} />;
  } else {
    el = <Slide8 />;
  }

  return new ImageResponse(el, { width: W, height: H });
}
