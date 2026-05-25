import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";

export const runtime = "edge";

const W = 1080;
const H = 1920;
const TOTAL = 7;

const BG = "#F8F5F0";
const INK = "#111111";
const DIM = "rgba(17,17,17,0.45)";
const ACCENT = "#5EEAD4";
const ACCENT_DARK = "#0D9488";
const CARD_TEXT = "#042F2E";
const BORDER = "rgba(17,17,17,0.07)";

function GemMark({ size = 52 }: { size?: number }) {
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

function TopBar({ n }: { n: number }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
        <GemMark size={44} />
        <div style={{ display: "flex", fontFamily: "Georgia, serif", fontSize: 28, fontWeight: 700, letterSpacing: "-0.05em", lineHeight: 1 }}>
          <span style={{ color: INK }}>hyper</span>
          <span style={{ color: ACCENT_DARK, fontStyle: "italic" }}>fix</span>
        </div>
      </div>
      <span style={{ fontFamily: "monospace", fontSize: 17, letterSpacing: "0.18em", color: "rgba(17,17,17,0.25)", textTransform: "uppercase" }}>
        {String(n).padStart(2, "0")} / {String(TOTAL).padStart(2, "0")}
      </span>
    </div>
  );
}

function Dots({ current }: { current: number }) {
  const dots = [];
  for (let i = 1; i <= TOTAL; i++) {
    dots.push(
      <div key={i} style={{
        width: i === current ? 28 : 7,
        height: 7,
        borderRadius: 4,
        background: i === current ? ACCENT_DARK : "rgba(17,17,17,0.15)",
      }} />
    );
  }
  return <div style={{ display: "flex", gap: 7, alignItems: "center" }}>{dots}</div>;
}

// ─── slide 1 · cover ─────────────────────────────────────────────────
function Slide1() {
  return (
    <div style={{ width: W, height: H, background: BG, display: "flex", flexDirection: "column", padding: "100px 88px", fontFamily: "sans-serif" }}>
      <TopBar n={1} />

      <div style={{ display: "flex", flexDirection: "column", marginTop: 120 }}>
        <div style={{ display: "flex", padding: "12px 28px", background: ACCENT, borderRadius: 100, alignSelf: "flex-start", marginBottom: 64 }}>
          <span style={{ fontFamily: "sans-serif", fontSize: 20, fontWeight: 800, letterSpacing: "0.12em", textTransform: "uppercase", color: CARD_TEXT }}>
            5 stages
          </span>
        </div>

        <div style={{ display: "flex", flexDirection: "column", fontSize: 140, fontWeight: 900, lineHeight: 0.86, letterSpacing: "-0.05em" }}>
          <span style={{ color: INK }}>the</span>
          <span style={{ color: ACCENT_DARK }}>stages</span>
          <span style={{ color: INK }}>of a</span>
          <span style={{ color: ACCENT_DARK }}>hyper-</span>
          <span style={{ color: ACCENT_DARK }}>fixation</span>
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", marginTop: "auto" }}>
        <span style={{ fontSize: 34, color: DIM, lineHeight: 1.4, maxWidth: 820, marginBottom: 72 }}>
          this is going to feel uncomfortably specific.
        </span>
        <Dots current={1} />
      </div>
    </div>
  );
}

// ─── stage slide template ─────────────────────────────────────────────
function StageSlide({
  n, num, stageLabel, headline, lines,
}: {
  n: number;
  num: number;
  stageLabel: string;
  headline: string;
  lines: string[];
}) {
  return (
    <div style={{ width: W, height: H, background: BG, display: "flex", flexDirection: "column", padding: "100px 88px", fontFamily: "sans-serif" }}>
      <TopBar n={n} />

      <div style={{ display: "flex", flexDirection: "column", marginTop: 100 }}>
        <span style={{ fontFamily: "monospace", fontSize: 18, letterSpacing: "0.22em", textTransform: "uppercase", color: DIM, marginBottom: 24 }}>
          {stageLabel}
        </span>

        <div style={{ display: "flex", flexDirection: "column", fontSize: 96, fontWeight: 900, lineHeight: 0.9, letterSpacing: "-0.04em", marginBottom: 72 }}>
          <span style={{ color: INK }}>{num}. {headline}</span>
        </div>

        <div style={{ display: "flex", flexDirection: "column", background: ACCENT, borderRadius: 28, padding: "60px 60px", gap: 36 }}>
          {lines.map((line, i) => (
            <span key={i} style={{ fontSize: 44, fontWeight: 600, color: CARD_TEXT, lineHeight: 1.28, letterSpacing: "-0.02em" }}>
              {line}
            </span>
          ))}
        </div>
      </div>

      <div style={{ display: "flex", marginTop: "auto" }}>
        <Dots current={n} />
      </div>
    </div>
  );
}

// ─── slide 7 · cta ───────────────────────────────────────────────────
function Slide7() {
  return (
    <div style={{ width: W, height: H, background: BG, display: "flex", flexDirection: "column", padding: "100px 88px", fontFamily: "sans-serif" }}>
      <TopBar n={7} />

      <div style={{ display: "flex", flexDirection: "column", marginTop: 120 }}>
        <div style={{ display: "flex", flexDirection: "column", fontSize: 116, fontWeight: 900, lineHeight: 0.86, letterSpacing: "-0.05em", marginBottom: 60 }}>
          <span style={{ color: ACCENT_DARK }}>sound</span>
          <span style={{ color: ACCENT_DARK }}>familiar?</span>
          <span style={{ color: INK }}>track it</span>
          <span style={{ color: INK }}>before</span>
          <span style={{ color: INK }}>it fades.</span>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 20, marginBottom: 72 }}>
          {[
            "name it. give it a start date.",
            "rate how deep you are (1-10)",
            "log your notes before they vanish",
            "keep a graveyard of old fixations",
          ].map((item, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 22 }}>
              <div style={{ display: "flex", width: 10, height: 10, borderRadius: 5, background: ACCENT_DARK, flexShrink: 0 }} />
              <span style={{ fontSize: 34, fontWeight: 600, color: INK, lineHeight: 1.3, letterSpacing: "-0.01em" }}>{item}</span>
            </div>
          ))}
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", marginTop: "auto", gap: 24 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <GemMark size={48} />
          <div style={{ display: "flex", fontFamily: "Georgia, serif", fontSize: 48, fontWeight: 700, letterSpacing: "-0.05em", lineHeight: 1 }}>
            <span style={{ color: INK }}>hyper</span>
            <span style={{ color: ACCENT_DARK, fontStyle: "italic" }}>fix</span>
            <span style={{ color: DIM }}>.app</span>
          </div>
        </div>
        <div style={{ display: "flex", padding: "22px 48px", background: ACCENT_DARK, borderRadius: 100, alignSelf: "flex-start" }}>
          <span style={{ fontSize: 26, fontWeight: 800, color: "#fff" }}>free to use - link in bio</span>
        </div>
        <Dots current={7} />
      </div>
    </div>
  );
}

// ─── route ───────────────────────────────────────────────────────────
export async function GET(_req: NextRequest, { params }: { params: Promise<{ n: string }> }) {
  const { n } = await params;
  const slide = parseInt(n, 10);

  const stages = [
    {
      stageLabel: "stage 01",
      headline: "Discovery.",
      lines: [
        "You saw one video. One post. One comment.",
        "You didn't choose this.",
        "It chose you.",
      ],
    },
    {
      stageLabel: "stage 02",
      headline: "The spiral.",
      lines: [
        "4 hours later. 47 tabs open. 3 reddit deep dives.",
        "You've watched every video. You're now the world's leading expert.",
        "It's been one day.",
      ],
    },
    {
      stageLabel: "stage 03",
      headline: "Everyone must know.",
      lines: [
        "You bring it up at dinner. Unprompted.",
        "You've explained it to 4 people who didn't ask.",
        "You can't stop. You won't stop.",
      ],
    },
    {
      stageLabel: "stage 04",
      headline: "The high.",
      lines: [
        "You feel electric. Making things, connecting things, staying up until 3am.",
        "You have never been more alive.",
      ],
    },
    {
      stageLabel: "stage 05",
      headline: "Then one day...",
      lines: [
        "The folder is still there. The tabs are still open.",
        "Your friend texts you about it. You say \"yeah\" and mean \"I don't feel that anymore and I don't know why.\"",
      ],
    },
  ];

  let el: React.ReactElement;
  if (slide === 1) el = <Slide1 />;
  else if (slide >= 2 && slide <= 6) {
    const s = stages[slide - 2];
    el = <StageSlide n={slide} num={slide - 1} stageLabel={s.stageLabel} headline={s.headline} lines={s.lines} />;
  } else el = <Slide7 />;

  return new ImageResponse(el, { width: W, height: H });
}
