import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";

export const runtime = "edge";

const SIZE = { width: 1080, height: 1350 };

const PAPER = "#080808";
const PAPER_DEEP = "#111113";
const INK = "#F4F4F4";
const INK_SOFT = "#9A9A9A";
const MUTED = "#525252";
const ACCENT = "#5EEAD4";

const slides = [
  {
    n: "01",
    h: "It's not just really liking something.",
    sub: "a hyperfixation takes over. your schedule, your thoughts, your conversations. it becomes infrastructure.",
  },
  {
    n: "02",
    h: "Your brain locks on.",
    sub: "intrusive thoughts about it at 2am. you bring it up unprompted. you've explained it to someone who didn't ask three times this week.",
  },
  {
    n: "03",
    h: "It's common with ADHD and autism.",
    sub: "not a personality flaw. not immaturity. your brain found signal in the noise and it's holding on for dear life.",
  },
  {
    n: "04",
    h: "The high is real.",
    sub: "you feel electric. you become the world's leading expert overnight. you make things, you connect things, you feel alive in a specific way.",
  },
  {
    n: "05",
    h: "Then it fades.",
    sub: "not because you chose to leave. your brain just... moved on. the tabs close. the folder sits there. you feel the absence of it.",
  },
];

const TOTAL = 7;

function Wordmark({ dark = false, size = 44 }: { dark?: boolean; size?: number }) {
  return (
    <div style={{ display: "flex", fontFamily: "Georgia, serif", fontSize: size, letterSpacing: "-0.05em", fontWeight: 600, lineHeight: 1, color: dark ? PAPER : INK }}>
      <span>hyper</span>
      <span style={{ color: ACCENT, fontStyle: "italic" }}>fix</span>
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
      <span style={{ fontFamily: "monospace", fontSize: 14, letterSpacing: "0.22em", textTransform: "uppercase", color: fg }}>
        {String(index).padStart(2, "0")} / {String(TOTAL).padStart(2, "0")}
      </span>
    </div>
  );
}

function CoverSlide() {
  return (
    <div style={{ width: "100%", height: "100%", background: PAPER, display: "flex", flexDirection: "column", padding: 80, fontFamily: "Georgia, serif", color: INK }}>
      <div style={{ display: "flex" }}>
        <div style={{ display: "flex", border: `2px solid ${INK}`, padding: "10px 20px", fontSize: 18, letterSpacing: "0.2em", textTransform: "uppercase", fontFamily: "monospace", color: INK }}>
          a hyperfixation tracker · 2026
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", marginTop: 80 }}>
        <div style={{ display: "flex", flexDirection: "column", fontSize: 148, lineHeight: 0.9, letterSpacing: "-0.06em", fontWeight: 500 }}>
          <span style={{ color: INK }}>what is</span>
          <span style={{ color: ACCENT, fontStyle: "italic" }}>a hyper</span>
          <span style={{ color: ACCENT, fontStyle: "italic" }}>fixation?</span>
        </div>
      </div>

      <div style={{ display: "flex", marginTop: 60 }}>
        <span style={{ fontFamily: "monospace", fontSize: 22, letterSpacing: "0.25em", textTransform: "uppercase", color: MUTED }}>
          swipe right
        </span>
      </div>

      <div style={{ marginTop: "auto", display: "flex" }}>
        <FooterBar index={1} />
      </div>
    </div>
  );
}

function ContentSlide({ index }: { index: number }) {
  const slide = slides[index - 1];
  const bg = index % 2 === 1 ? PAPER : PAPER_DEEP;

  return (
    <div style={{ width: "100%", height: "100%", background: bg, display: "flex", flexDirection: "column", padding: 80, fontFamily: "Georgia, serif", color: INK }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <span style={{ fontFamily: "monospace", fontSize: 22, letterSpacing: "0.25em", textTransform: "uppercase", color: ACCENT, paddingTop: 14 }}>
          {slide.n}
        </span>
        <span style={{ fontFamily: "Georgia, serif", fontStyle: "italic", fontSize: 200, lineHeight: 0.78, fontWeight: 700, color: ACCENT, opacity: 0.12, letterSpacing: "-0.08em" }}>
          {slide.n}
        </span>
      </div>

      <div style={{ display: "flex", flexDirection: "column", marginTop: 100 }}>
        <div style={{ fontSize: 82, lineHeight: 1.02, letterSpacing: "-0.04em", fontWeight: 500, color: INK, maxWidth: 920 }}>
          {slide.h}
        </div>
        <div style={{ fontSize: 30, lineHeight: 1.4, fontStyle: "italic", color: INK_SOFT, maxWidth: 820, marginTop: 48, paddingLeft: 24, borderLeft: `2px solid ${ACCENT}` }}>
          {slide.sub}
        </div>
      </div>

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
        <div style={{ display: "flex", border: `2px solid ${PAPER}`, padding: "10px 20px", fontSize: 18, letterSpacing: "0.2em", textTransform: "uppercase", fontFamily: "monospace", color: PAPER }}>
          log it while it lasts
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", marginTop: 100 }}>
        <div style={{ display: "flex", flexDirection: "column", fontSize: 148, lineHeight: 0.92, letterSpacing: "-0.06em", fontWeight: 500 }}>
          <span style={{ color: PAPER }}>track it.</span>
          <span style={{ color: ACCENT, fontStyle: "italic" }}>mourn it.</span>
          <span style={{ color: PAPER }}>repeat.</span>
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", marginTop: 56 }}>
        <div style={{ fontSize: 30, color: "rgba(244,244,244,0.55)", maxWidth: 740, lineHeight: 1.4 }}>
          count the days. share the card. build a graveyard for every obsession you&apos;ve ever had.
        </div>
        <span style={{ fontFamily: "monospace", fontSize: 26, letterSpacing: "0.22em", textTransform: "uppercase", color: ACCENT, marginTop: 48 }}>
          hyperfix.app
        </span>
      </div>

      <div style={{ marginTop: "auto", display: "flex" }}>
        <FooterBar index={TOTAL} dark />
      </div>
    </div>
  );
}

export async function GET(_req: NextRequest, { params }: { params: Promise<{ n: string }> }) {
  const { n } = await params;
  const slide = parseInt(n, 10);

  let element: React.ReactElement;
  if (slide === 0) element = <CoverSlide />;
  else if (slide >= 1 && slide <= 5) element = <ContentSlide index={slide} />;
  else element = <CtaSlide />;

  return new ImageResponse(element, SIZE);
}
