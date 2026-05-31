import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";

export const runtime = "edge";

const W = 1080;
const H = 1920;
const TOTAL = 7;

const BG = "var(--bg)";
const BG2 = "#0C0C0E";
const INK = "#F4F4F4";
const DIM = "rgba(244,244,244,0.42)";
const TEAL = "#5EEAD4";
const CARD = "#101012";
const BORDER = "rgba(244,244,244,0.06)";

function GemMark({ size = 56 }: { size?: number }) {
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
      <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
        <GemMark size={52} />
        <div style={{ display: "flex", fontFamily: "Georgia, serif", fontSize: 30, fontWeight: 700, letterSpacing: "-0.05em", lineHeight: 1 }}>
          <span style={{ color: INK }}>hyper</span>
          <span style={{ color: TEAL, fontStyle: "italic" }}>fix</span>
        </div>
      </div>
      <span style={{ fontFamily: "monospace", fontSize: 17, letterSpacing: "0.18em", color: "rgba(244,244,244,0.25)", textTransform: "uppercase" }}>
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
        width: i === current ? 32 : 8,
        height: 8,
        borderRadius: 4,
        background: i === current ? TEAL : "rgba(244,244,244,0.15)",
      }} />
    );
  }
  return <div style={{ display: "flex", gap: 8, alignItems: "center" }}>{dots}</div>;
}

function GhostNum({ n }: { n: string }) {
  return (
    <div style={{
      position: "absolute", right: -20, bottom: 100,
      fontFamily: "sans-serif", fontSize: 520, fontWeight: 900,
      lineHeight: 1, color: TEAL, opacity: 0.04, letterSpacing: -30,
      userSelect: "none",
    }}>{n}</div>
  );
}

// ─── slide 1 · cover ─────────────────────────────────────────────────
function Slide1() {
  return (
    <div style={{ width: W, height: H, background: BG, display: "flex", flexDirection: "column", padding: "100px 88px", fontFamily: "sans-serif" }}>
      <TopBar n={1} />
      <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 800, background: "radial-gradient(ellipse 90% 55% at 50% 100%, rgba(94,234,212,0.12) 0%, transparent 70%)", display: "flex" }} />

      <div style={{ display: "flex", flexDirection: "column", marginTop: 140 }}>
        <div style={{ display: "flex", padding: "12px 24px", border: `1px solid rgba(94,234,212,0.3)`, borderRadius: 100, alignSelf: "flex-start", marginBottom: 56 }}>
          <span style={{ fontFamily: "monospace", fontSize: 18, letterSpacing: "0.2em", textTransform: "uppercase", color: TEAL }}>
            actually useful
          </span>
        </div>

        <div style={{ display: "flex", flexDirection: "column", fontSize: 128, fontWeight: 900, lineHeight: 0.86, letterSpacing: "-0.05em" }}>
          <span style={{ color: INK }}>best ways</span>
          <span style={{ color: INK }}>to track</span>
          <span style={{ color: INK }}>your</span>
          <span style={{ color: TEAL }}>hyper-</span>
          <span style={{ color: TEAL }}>fixations</span>
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", marginTop: "auto" }}>
        <span style={{ fontSize: 30, color: DIM, lineHeight: 1.4, maxWidth: 780, marginBottom: 64 }}>
          because you will forget how much you cared. and future you deserves proof.
        </span>
        <Dots current={1} />
      </div>
    </div>
  );
}

// ─── tip slide template ───────────────────────────────────────────────
function TipSlide({
  n, num, headline, body, detail, bg = BG,
}: {
  n: number; num: string; headline: string[]; body: string; detail?: string; bg?: string;
}) {
  return (
    <div style={{ width: W, height: H, background: bg, display: "flex", flexDirection: "column", padding: "100px 88px", fontFamily: "sans-serif", position: "relative" }}>
      <GhostNum n={num} />
      <TopBar n={n} />

      <div style={{ display: "flex", flexDirection: "column", marginTop: 120 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 20, marginBottom: 40 }}>
          <div style={{ display: "flex", width: 56, height: 56, borderRadius: 28, background: TEAL, alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <span style={{ fontFamily: "sans-serif", fontSize: 26, fontWeight: 900, color: BG }}>{num}</span>
          </div>
          <span style={{ fontFamily: "monospace", fontSize: 18, letterSpacing: "0.22em", textTransform: "uppercase", color: TEAL }}>
            tip {num}
          </span>
        </div>

        <div style={{ display: "flex", flexDirection: "column", fontSize: 110, fontWeight: 900, lineHeight: 0.88, letterSpacing: "-0.05em", marginBottom: 64 }}>
          {headline.map((line, i) => (
            <span key={i} style={{ color: i === headline.length - 1 ? TEAL : INK }}>{line}</span>
          ))}
        </div>

        <div style={{ display: "flex", flexDirection: "column", borderLeft: `3px solid rgba(94,234,212,0.2)`, paddingLeft: 40, gap: 28 }}>
          <span style={{ fontSize: 42, fontWeight: 600, color: INK, lineHeight: 1.3, letterSpacing: "-0.02em" }}>{body}</span>
          {detail && (
            <span style={{ fontSize: 34, fontWeight: 500, color: DIM, lineHeight: 1.35, letterSpacing: "-0.01em" }}>{detail}</span>
          )}
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
    <div style={{ width: W, height: H, background: BG, display: "flex", flexDirection: "column", padding: "100px 88px", fontFamily: "sans-serif", position: "relative" }}>
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, background: "radial-gradient(ellipse 80% 60% at 50% 50%, rgba(94,234,212,0.07) 0%, transparent 65%)", display: "flex" }} />
      <TopBar n={7} />

      <div style={{ display: "flex", flexDirection: "column", marginTop: 120 }}>
        <span style={{ fontFamily: "monospace", fontSize: 18, letterSpacing: "0.24em", textTransform: "uppercase", color: TEAL, marginBottom: 40 }}>
          or just
        </span>
        <div style={{ display: "flex", flexDirection: "column", fontSize: 120, fontWeight: 900, lineHeight: 0.86, letterSpacing: "-0.05em", marginBottom: 64 }}>
          <span style={{ color: INK }}>use an</span>
          <span style={{ color: INK }}>app built</span>
          <span style={{ color: TEAL }}>for it.</span>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          {[
            "name it and give it a start date",
            "rate your intensity (1-10)",
            "log your notes before they vanish",
            "watch it fade in real time",
            "keep a graveyard of every obsession",
          ].map((item, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 20 }}>
              <div style={{ display: "flex", width: 10, height: 10, borderRadius: 5, background: TEAL, flexShrink: 0 }} />
              <span style={{ fontSize: 34, fontWeight: 600, color: INK, letterSpacing: "-0.01em", lineHeight: 1.3 }}>{item}</span>
            </div>
          ))}
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", marginTop: "auto", gap: 28 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <GemMark size={52} />
          <div style={{ display: "flex", fontFamily: "Georgia, serif", fontSize: 52, fontWeight: 700, letterSpacing: "-0.05em", lineHeight: 1 }}>
            <span style={{ color: INK }}>hyper</span>
            <span style={{ color: TEAL, fontStyle: "italic" }}>fix</span>
            <span style={{ color: DIM }}>   .app</span>
          </div>
        </div>
        <div style={{ display: "flex", padding: "20px 44px", background: TEAL, borderRadius: 100, alignSelf: "flex-start" }}>
          <span style={{ fontSize: 24, fontWeight: 800, color: BG }}>free to use · link in bio</span>
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

  const tips = [
    {
      num: "1", bg: BG,
      headline: ["give it", "a name."],
      body: "not just \"that thing I'm into.\" a proper title. something that deserves to exist.",
      detail: "Severance. The Mars trilogy. competitive yo-yo. name it like it matters.",
    },
    {
      num: "2", bg: BG2,
      headline: ["track", "the days."],
      body: "write down when it started. day 3 and day 47 are completely different experiences.",
      detail: "you'll want to know how long it lasted when it's gone.",
    },
    {
      num: "3", bg: BG,
      headline: ["rate your", "intensity."],
      body: "how deep are you right now? \"mentioned it once\" is a 2. \"cancelled plans for it\" is a 9.",
      detail: "being honest with yourself about the number is half the fun.",
    },
    {
      num: "4", bg: BG2,
      headline: ["write the", "one thing."],
      body: "the thing you'd explain to a stranger unprompted. write it down right now.",
      detail: "in 3 weeks you will not remember why you cared this much. future you needs proof.",
    },
    {
      num: "5", bg: BG,
      headline: ["give it", "a grave."],
      body: "when it fades, mark the date. don't just quietly move on.",
      detail: "it deserves a proper ending. a timestamp. an acknowledgment that it was real.",
    },
  ];

  let el: React.ReactElement;
  if (slide === 1) el = <Slide1 />;
  else if (slide >= 2 && slide <= 6) {
    const t = tips[slide - 2];
    el = <TipSlide n={slide} num={t.num} headline={t.headline} body={t.body} detail={t.detail} bg={t.bg} />;
  } else el = <Slide7 />;

  return new ImageResponse(el, { width: W, height: H });
}
