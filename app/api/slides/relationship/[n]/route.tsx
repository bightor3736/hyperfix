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
            it&apos;s complicated
          </span>
        </div>

        <div style={{ display: "flex", flexDirection: "column", fontSize: 106, fontWeight: 900, lineHeight: 0.88, letterSpacing: "-0.05em", marginBottom: 56 }}>
          <span style={{ color: INK }}>your hyper-</span>
          <span style={{ color: INK }}>fixation as</span>
          <span style={{ color: INK }}>a</span>
          <span style={{ color: ACCENT_DARK }}>relationship.</span>
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", marginTop: "auto" }}>
        <span style={{ fontSize: 34, color: DIM, lineHeight: 1.45, maxWidth: 800, marginBottom: 64 }}>
          you will feel seen and attacked at the same time.
        </span>
        <Dots current={1} total={TOTAL} />
      </div>
    </div>
  );
}

// ─── stage slide template ─────────────────────────────────────────────
function StageSlide({
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

        <div style={{ display: "flex", flexDirection: "column", background: ACCENT, borderRadius: 28, padding: "52px 56px", marginBottom: 52 }}>
          <span style={{ fontSize: 38, fontWeight: 600, color: CARD_TEXT, lineHeight: 1.5, letterSpacing: "-0.01em" }}>
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

// ─── slide 8 · cta ───────────────────────────────────────────────────
function Slide8() {
  return (
    <div style={{ width: W, height: H, background: BG, display: "flex", flexDirection: "column", padding: "100px 88px", fontFamily: "sans-serif" }}>
      <TopBar n={8} total={TOTAL} />

      <div style={{ display: "flex", flexDirection: "column", marginTop: 130 }}>
        <div style={{ display: "flex", flexDirection: "column", fontSize: 100, fontWeight: 900, lineHeight: 0.9, letterSpacing: "-0.05em", marginBottom: 52 }}>
          <span style={{ color: INK }}>it deserves</span>
          <span style={{ color: INK }}>a proper</span>
          <span style={{ color: ACCENT_DARK }}>ending.</span>
          <span style={{ color: INK, marginTop: 20 }}>log it.</span>
          <span style={{ color: INK }}>rate it.</span>
          <span style={{ color: ACCENT_DARK }}>bury it.</span>
        </div>

        <span style={{ fontSize: 38, color: DIM, lineHeight: 1.45, maxWidth: 820, marginBottom: 64 }}>
          your graveyard of obsessions is waiting.
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

const STAGES = [
  {
    label: "stage 01",
    headline: "love at first sight.",
    card: "you saw one post. one video. one comment. you didn’t go looking for this. it found you. and now nothing else exists.",
    quote: "\"it’s different this time.\"",
  },
  {
    label: "stage 02",
    headline: "the honeymoon phase.",
    card: "you’re telling everyone. you can’t stop thinking about it. you cancelled plans. you’re making plans around it. you feel electric.",
    quote: "\"I’ve never felt this way about anything.\"",
  },
  {
    label: "stage 03",
    headline: "the obsession.",
    card: "4am. 47 tabs. you know everything about it. more than you know about yourself. you are fully, completely consumed.",
    quote: "\"just one more thing and I’ll go to sleep.\"",
  },
  {
    label: "stage 04",
    headline: "telling people who didn't ask.",
    card: "your friends know about it now. all of them. even the ones who gave you that look. you couldn’t help it. you needed them to understand.",
    quote: "\"okay but can I show you one thing.\"",
  },
  {
    label: "stage 05",
    headline: "something feels different.",
    card: "you open the folder. you look at the tabs. the feeling isn’t there the same way. you try to explain it to someone and the words don’t come out right.",
    quote: "\"no I still like it. I just...\"",
  },
  {
    label: "stage 06",
    headline: "then one day.",
    card: "your friend brings it up. you say \"yeah.\" and mean \"I don’t feel that anymore and I don’t know why. and I kind of miss it. and I miss being that person.\"",
    quote: "\"I was really into that.\"",
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
    const s = STAGES[slide - 2];
    el = <StageSlide n={slide} label={s.label} headline={s.headline} card={s.card} quote={s.quote} />;
  } else {
    el = <Slide8 />;
  }

  return new ImageResponse(el, { width: W, height: H });
}
