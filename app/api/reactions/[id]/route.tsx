import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";

export const runtime = "edge";

const SIZE = { width: 1080, height: 1350 };

const PAPER = "#080808";
const PAPER_DEEP = "#111113";
const INK = "#F4F4F4";
const INK_SOFT = "#9A9A9A";
const MUTED = "#525252";
const ACCENT = "#A3E635";

const TOTAL = 8;

const quotes = [
  {
    n: "01",
    q: "\"you've mentioned that like five times.\"",
    sub: "have i. have i really. that seems low actually.",
  },
  {
    n: "02",
    q: "\"you don't have to know everything about it.\"",
    sub: "yes i do. you don't understand. i do have to.",
  },
  {
    n: "03",
    q: "\"didn't you say this same thing last month?\"",
    sub: "different context. different energy. completely different. i've grown.",
  },
  {
    n: "04",
    q: "\"is this still the same thing you were into before?\"",
    sub: "it's a continuous relationship. i've been consistent. that's admirable.",
  },
  {
    n: "05",
    q: "\"i can't keep up with you.\"",
    sub: "nobody can. that's fine. you don't have to. just nod.",
  },
  {
    n: "06",
    q: "\"how do you find so much to say about it?\"",
    sub: "i don't find it. it finds me. while i'm trying to sleep. at 2am.",
  },
];

function Wordmark({ dark = false, size = 44 }: { dark?: boolean; size?: number }) {
  return (
    <div style={{ display: "flex", fontFamily: "Georgia, serif", fontSize: size, letterSpacing: "-0.05em", fontWeight: 600, lineHeight: 1, color: dark ? PAPER : INK }}>
      <span>hyper</span>
      <span style={{ color: ACCENT, fontStyle: "italic" }}>fix</span>
    </div>
  );
}

function Stamp({ children, dark = false }: { children: React.ReactNode; dark?: boolean }) {
  return (
    <div style={{ display: "flex", border: `2px solid ${dark ? PAPER : INK}`, color: dark ? PAPER : INK, padding: "10px 20px", fontSize: 18, letterSpacing: "0.2em", textTransform: "uppercase", fontFamily: "monospace" }}>
      {children}
    </div>
  );
}

function FooterBar({ index, dark = false }: { index: number; dark?: boolean }) {
  const fg = dark ? "rgba(8,8,8,0.5)" : MUTED;
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", width: "100%" }}>
      <div style={{ display: "flex", flexDirection: "column" }}>
        <Wordmark dark={dark} size={40} />
        <span style={{ fontFamily: "monospace", fontSize: 14, letterSpacing: "0.22em", textTransform: "uppercase", color: fg, marginTop: 10 }}>
          hyperfix.app
        </span>
      </div>
      <span style={{ fontFamily: "monospace", fontSize: 14, letterSpacing: "0.22em", textTransform: "uppercase", color: fg, fontVariantNumeric: "tabular-nums" }}>
        {String(index).padStart(2, "0")} / {String(TOTAL).padStart(2, "0")}
      </span>
    </div>
  );
}

function CoverSlide() {
  return (
    <div style={{ width: "100%", height: "100%", background: PAPER, display: "flex", flexDirection: "column", padding: 80, fontFamily: "Georgia, serif", color: INK }}>
      <div style={{ display: "flex" }}>
        <Stamp>a hyperfixation tracker · 2026</Stamp>
      </div>

      <div style={{ display: "flex", flexDirection: "column", marginTop: 80 }}>
        <div style={{ display: "flex", flexDirection: "column", fontSize: 136, lineHeight: 0.9, letterSpacing: "-0.06em", fontWeight: 500 }}>
          <span>things people</span>
          <span style={{ color: ACCENT, fontStyle: "italic" }}>say to you</span>
          <span>mid-hyperfix.</span>
        </div>
      </div>

      <div style={{ display: "flex", marginTop: 56 }}>
        <span style={{ fontFamily: "monospace", fontSize: 22, letterSpacing: "0.25em", textTransform: "uppercase", color: MUTED }}>
          swipe →
        </span>
      </div>

      <div style={{ marginTop: "auto", display: "flex" }}>
        <FooterBar index={1} />
      </div>
    </div>
  );
}

function QuoteSlide({ index }: { index: number }) {
  const q = quotes[index - 1];
  const bg = index % 2 === 1 ? PAPER : PAPER_DEEP;

  return (
    <div style={{ width: "100%", height: "100%", background: bg, display: "flex", flexDirection: "column", padding: 80, fontFamily: "Georgia, serif", color: INK }}>
      {/* HEADER */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <span style={{ fontFamily: "monospace", fontSize: 22, letterSpacing: "0.25em", textTransform: "uppercase", color: ACCENT, paddingTop: 14 }}>
          {q.n} of 06
        </span>
        <span style={{ fontFamily: "Georgia, serif", fontStyle: "italic", fontSize: 200, lineHeight: 0.78, fontWeight: 700, color: ACCENT, opacity: 0.10, letterSpacing: "-0.08em" }}>
          {q.n}
        </span>
      </div>

      {/* BIG QUOTE */}
      <div style={{ display: "flex", flexDirection: "column", marginTop: 80 }}>
        {/* Open quote mark */}
        <div style={{ display: "flex", fontSize: 180, lineHeight: 0.6, color: ACCENT, fontStyle: "italic", letterSpacing: "-0.04em", opacity: 0.35 }}>
          "
        </div>
        <div style={{ fontSize: 66, lineHeight: 1.15, letterSpacing: "-0.03em", fontWeight: 500, color: INK, maxWidth: 900, fontStyle: "italic", marginTop: 16 }}>
          {q.q}
        </div>
      </div>

      {/* RESPONSE */}
      <div style={{ display: "flex", marginTop: 60, paddingLeft: 32, borderLeft: `3px solid ${ACCENT}` }}>
        <div style={{ fontSize: 28, lineHeight: 1.45, color: INK_SOFT, maxWidth: 840, fontStyle: "italic" }}>
          {q.sub}
        </div>
      </div>

      {/* FOOTER */}
      <div style={{ marginTop: "auto", display: "flex", paddingTop: 40 }}>
        <FooterBar index={index + 1} />
      </div>
    </div>
  );
}

function CtaSlide() {
  return (
    <div style={{ width: "100%", height: "100%", background: INK, color: PAPER, display: "flex", flexDirection: "column", padding: 80, fontFamily: "Georgia, serif" }}>
      <div style={{ display: "flex" }}>
        <Stamp dark>they don't get it. log it.</Stamp>
      </div>

      <div style={{ display: "flex", flexDirection: "column", marginTop: 100 }}>
        <div style={{ display: "flex", flexDirection: "column", fontSize: 148, lineHeight: 0.92, letterSpacing: "-0.06em", fontWeight: 500 }}>
          <span>your fix</span>
          <span style={{ color: ACCENT, fontStyle: "italic" }}>deserves</span>
          <span>a record.</span>
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", marginTop: 56 }}>
        <div style={{ fontSize: 30, color: "rgba(8,8,8,0.65)", maxWidth: 740, lineHeight: 1.4 }}>
          count the days. note the intensity. share the card.
        </div>
        <span style={{ fontFamily: "monospace", fontSize: 26, letterSpacing: "0.22em", textTransform: "uppercase", color: ACCENT, marginTop: 48 }}>
          hyperfix.app →
        </span>
      </div>

      <div style={{ marginTop: "auto", display: "flex" }}>
        <FooterBar index={TOTAL} dark />
      </div>
    </div>
  );
}

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const n = parseInt(id, 10);

  let element: React.ReactElement;
  if (n === 0) element = <CoverSlide />;
  else if (n >= 1 && n <= 6) element = <QuoteSlide index={n} />;
  else element = <CtaSlide />;

  return new ImageResponse(element, SIZE);
}
