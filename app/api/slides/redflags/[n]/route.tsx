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

// Red flag theme colours
const RED_CARD_BG = "#FEE2E2";
const RED_CARD_TEXT = "#7F1D1D";
const RED_BADGE_BG = "#FCA5A5";
const RED_TITLE = "#EF4444";

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
        <div style={{ display: "flex", padding: "14px 28px", background: RED_BADGE_BG, borderRadius: 100, alignSelf: "flex-start", marginBottom: 60 }}>
          <span style={{ fontFamily: "monospace", fontSize: 22, letterSpacing: "0.14em", textTransform: "uppercase", color: RED_CARD_TEXT, fontWeight: 700 }}>
            red flags
          </span>
        </div>

        <div style={{ display: "flex", flexDirection: "column", fontSize: 110, fontWeight: 900, lineHeight: 0.88, letterSpacing: "-0.05em", marginBottom: 56 }}>
          <span style={{ color: RED_TITLE }}>hyperfix-</span>
          <span style={{ color: RED_TITLE }}>ation</span>
          <span style={{ color: INK }}>red flags.</span>
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", marginTop: "auto" }}>
        <span style={{ fontSize: 36, color: DIM, lineHeight: 1.4, maxWidth: 780, marginBottom: 64 }}>
          a totally unbiased assessment.
        </span>
        <Dots current={1} total={TOTAL} />
      </div>
    </div>
  );
}

// ─── red flag slide template ──────────────────────────────────────────
function RedFlagSlide({
  n, label, headline, card, quote,
}: {
  n: number; label: string; headline: string; card: string; quote: string;
}) {
  return (
    <div style={{ width: W, height: H, background: BG, display: "flex", flexDirection: "column", padding: "100px 88px", fontFamily: "sans-serif" }}>
      <TopBar n={n} total={TOTAL} />

      <div style={{ display: "flex", flexDirection: "column", marginTop: 90 }}>
        <span style={{ fontFamily: "monospace", fontSize: 20, letterSpacing: "0.26em", textTransform: "uppercase", color: DIM, marginBottom: 28 }}>
          {label}
        </span>

        <div style={{ display: "flex", flexDirection: "column", fontSize: 96, fontWeight: 900, lineHeight: 0.9, letterSpacing: "-0.05em", marginBottom: 60 }}>
          <span style={{ color: INK }}>{headline}</span>
        </div>

        <div style={{ display: "flex", flexDirection: "column", background: RED_CARD_BG, borderRadius: 28, padding: "52px 56px", marginBottom: 52 }}>
          <span style={{ fontSize: 38, fontWeight: 600, color: RED_CARD_TEXT, lineHeight: 1.5, letterSpacing: "-0.01em" }}>
            {card}
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

// ─── slide 8 · twist cta ─────────────────────────────────────────────
function Slide8() {
  return (
    <div style={{ width: W, height: H, background: BG, display: "flex", flexDirection: "column", padding: "100px 88px", fontFamily: "sans-serif" }}>
      <TopBar n={8} total={TOTAL} />

      <div style={{ display: "flex", flexDirection: "column", marginTop: 130 }}>
        <div style={{ display: "flex", flexDirection: "column", fontSize: 100, fontWeight: 900, lineHeight: 0.9, letterSpacing: "-0.05em", marginBottom: 52 }}>
          <span style={{ color: ACCENT_DARK }}>these aren&apos;t</span>
          <span style={{ color: ACCENT_DARK }}>red flags.</span>
          <span style={{ color: INK, marginTop: 24 }}>it&apos;s just how</span>
          <span style={{ color: INK }}>your brain</span>
          <span style={{ color: INK }}>loves things.</span>
        </div>

        <span style={{ fontSize: 38, color: DIM, lineHeight: 1.45, maxWidth: 820, marginBottom: 64 }}>
          track it. rate it. keep the graveyard.
        </span>
      </div>

      <div style={{ display: "flex", flexDirection: "column", marginTop: "auto", gap: 32 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
          <GemMark size={52} />
          <div style={{ display: "flex", fontFamily: "Georgia, serif", fontSize: 48, fontWeight: 700, letterSpacing: "-0.05em", lineHeight: 1 }}>
            <span style={{ color: INK }}>hyper</span>
            <span style={{ color: ACCENT_DARK, fontStyle: "italic" }}>fix</span>
            <span style={{ color: "rgba(17,17,17,0.45)" }}>.app</span>
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

const RED_FLAGS = [
  {
    label: "red flag 01",
    headline: "you&apos;ve explained it to the same person twice.",
    card: "and both times they nodded the same way. and both times you didn&apos;t notice until after.",
    quote: "\"okay so basically what makes it interesting is—\"",
  },
  {
    label: "red flag 02",
    headline: "you bought something for it within 48 hours.",
    card: "a book. a tool. a starter kit. something you definitely needed. that is currently in a drawer.",
    quote: "\"it was on sale.\"",
  },
  {
    label: "red flag 03",
    headline: "you considered making it your career.",
    card: "for at least 20 minutes you were fully convinced this was the path. you may have googled courses.",
    quote: "\"people get paid to do this.\"",
  },
  {
    label: "red flag 04",
    headline: "your phone has a dedicated folder.",
    card: "screenshots. links. notes. photos. a voice memo from 2am that you haven&apos;t listened back to. the folder has a name.",
    quote: "\"I just like to be organised.\"",
  },
  {
    label: "red flag 05",
    headline: "your friends changed the subject.",
    card: "not once. consistently. there&apos;s a look they do now. you&apos;ve learned to recognise it. you bring it up anyway.",
    quote: "\"no but this part is actually important.\"",
  },
  {
    label: "red flag 06",
    headline: "it&apos;s been 4am twice this week.",
    card: "you weren&apos;t planning to stay up. you just needed to check one more thing. and then one more thing. and then it was 4am.",
    quote: "\"I&apos;ll sleep after this.\"",
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
    const f = RED_FLAGS[slide - 2];
    el = <RedFlagSlide n={slide} label={f.label} headline={f.headline} card={f.card} quote={f.quote} />;
  } else {
    el = <Slide8 />;
  }

  return new ImageResponse(el, { width: W, height: H });
}
