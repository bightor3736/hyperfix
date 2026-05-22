import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";

export const runtime = "edge";

const W = 1080;
const H = 1920;

const BG = "#080808";
const BG2 = "#0F1011";
const INK = "#F4F4F4";
const INK_DIM = "rgba(244,244,244,0.5)";
const INK_SOFT = "rgba(244,244,244,0.3)";
const TEAL = "#5EEAD4";
const DARK = "#0A0A0A";

const TOTAL = 6;

/* ── shared chrome ── */

function Wordmark({ inverted = false }: { inverted?: boolean }) {
  return (
    <div style={{ display: "flex", fontFamily: "Georgia, serif", fontSize: 48, letterSpacing: "-0.05em", fontWeight: 600, lineHeight: 1 }}>
      <span style={{ color: inverted ? DARK : INK }}>hyper</span>
      <span style={{ color: TEAL, fontStyle: "italic" }}>fix</span>
    </div>
  );
}

function Footer({ n, inverted = false }: { n: number; inverted?: boolean }) {
  const muted = inverted ? "rgba(10,10,10,0.45)" : "rgba(244,244,244,0.25)";
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", width: "100%" }}>
      <div style={{ display: "flex", flexDirection: "column" }}>
        <Wordmark inverted={inverted} />
        <span style={{ fontFamily: "monospace", fontSize: 18, letterSpacing: "0.22em", textTransform: "uppercase", color: muted, marginTop: 10 }}>
          hyperfix.app
        </span>
      </div>
      <span style={{ fontFamily: "monospace", fontSize: 18, letterSpacing: "0.22em", textTransform: "uppercase", color: muted }}>
        {String(n).padStart(2, "0")} / {String(TOTAL).padStart(2, "0")}
      </span>
    </div>
  );
}

function StudioTag({ inverted = false }: { inverted?: boolean }) {
  return (
    <div style={{
      display: "flex",
      border: `1.5px solid ${inverted ? "rgba(10,10,10,0.3)" : "rgba(94,234,212,0.4)"}`,
      borderRadius: 100,
      paddingTop: 10,
      paddingBottom: 10,
      paddingLeft: 24,
      paddingRight: 24,
      alignSelf: "flex-start",
    }}>
      <span style={{ fontFamily: "monospace", fontSize: 18, letterSpacing: "0.22em", textTransform: "uppercase", color: inverted ? "rgba(10,10,10,0.6)" : TEAL }}>
        hyperfix studio
      </span>
    </div>
  );
}

/* ── slides ── */

// Slide 1 — Hook / Cover
function CoverSlide() {
  return (
    <div style={{ width: "100%", height: "100%", background: BG, display: "flex", flexDirection: "column", padding: 100, fontFamily: "Georgia, serif", color: INK, position: "relative" }}>
      {/* Teal radial glow — no transform, just a bottom-anchored block */}
      <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 800, background: "radial-gradient(ellipse 80% 60% at 50% 100%, rgba(94,234,212,0.18) 0%, transparent 70%)", display: "flex" }} />

      <div style={{ display: "flex" }}>
        <StudioTag />
      </div>

      <div style={{ display: "flex", flexDirection: "column", marginTop: 120 }}>
        <div style={{ fontSize: 148, lineHeight: 0.93, letterSpacing: "-0.05em", fontWeight: 500, color: INK, maxWidth: 880 }}>
          somewhere
        </div>
        <div style={{ fontSize: 148, lineHeight: 0.93, letterSpacing: "-0.05em", fontWeight: 500, color: TEAL, fontStyle: "italic", maxWidth: 880, marginTop: 8 }}>
          to put all
        </div>
        <div style={{ fontSize: 148, lineHeight: 0.93, letterSpacing: "-0.05em", fontWeight: 500, color: INK, maxWidth: 880, marginTop: 8 }}>
          your notes.
        </div>
      </div>

      <div style={{ display: "flex", marginTop: 80 }}>
        <span style={{ fontFamily: "monospace", fontSize: 24, letterSpacing: "0.25em", textTransform: "uppercase", color: INK_SOFT }}>
          swipe right
        </span>
      </div>

      <div style={{ marginTop: "auto", display: "flex" }}>
        <Footer n={1} />
      </div>
    </div>
  );
}

// Slide 2 — What is Studio
function StudioIntroSlide() {
  return (
    <div style={{ width: "100%", height: "100%", background: BG2, display: "flex", flexDirection: "column", padding: 100, fontFamily: "Georgia, serif", color: INK }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <span style={{ fontFamily: "monospace", fontSize: 20, letterSpacing: "0.25em", textTransform: "uppercase", color: TEAL }}>
          new feature
        </span>
        <span style={{ fontFamily: "Georgia, serif", fontStyle: "italic", fontSize: 240, lineHeight: 0.78, fontWeight: 700, color: TEAL, opacity: 0.08, letterSpacing: "-0.08em" }}>
          S
        </span>
      </div>

      <div style={{ display: "flex", flexDirection: "column", marginTop: 100 }}>
        <div style={{ fontSize: 100, lineHeight: 0.96, letterSpacing: "-0.04em", fontWeight: 500, color: INK, maxWidth: 880 }}>
          a private workspace inside each fix.
        </div>
        <div style={{ marginTop: 60, paddingLeft: 28, borderLeft: `3px solid ${TEAL}`, display: "flex" }}>
          <div style={{ fontSize: 34, lineHeight: 1.45, fontStyle: "italic", color: INK_DIM, maxWidth: 800 }}>
            every hyperfixation gets its own corner. notes, links, images — all in one place, only you can see it.
          </div>
        </div>
      </div>

      <div style={{ marginTop: "auto", display: "flex" }}>
        <Footer n={2} />
      </div>
    </div>
  );
}

// Slide 3 — What you can do
function WhatYouCanDoSlide() {
  // No emoji — Satori can't load emoji fonts at edge runtime
  const items = [
    { mark: "N", label: "note blocks", desc: "brain dumps, theories, lore — no character limit on unhinged" },
    { mark: "L", label: "link drops", desc: "save every rabbit hole. the subreddit, the fanwiki, the 2019 thread" },
    { mark: "I", label: "image boards", desc: "screenshots, moodboards, character refs, your 47 saved screenshots" },
    { mark: "S", label: "slideshows", desc: "up to 20 images in a carousel. for the ones who collect evidence" },
  ];

  return (
    <div style={{ width: "100%", height: "100%", background: BG, display: "flex", flexDirection: "column", padding: 100, fontFamily: "Georgia, serif", color: INK }}>
      <div style={{ display: "flex" }}>
        <StudioTag />
      </div>

      <div style={{ display: "flex", flexDirection: "column", marginTop: 80 }}>
        <div style={{ display: "flex", flexWrap: "wrap", fontSize: 96, lineHeight: 0.96, letterSpacing: "-0.04em", fontWeight: 500, color: INK }}>
          <span>what you</span>
          <span style={{ color: TEAL, fontStyle: "italic" }}>&nbsp;can do</span>
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", marginTop: 72 }}>
        {items.map((item, i) => (
          <div key={i} style={{ display: "flex", alignItems: "flex-start", marginTop: i === 0 ? 0 : 48 }}>
            <div style={{ width: 64, height: 64, borderRadius: 16, background: "rgba(94,234,212,0.1)", border: "1px solid rgba(94,234,212,0.2)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28, flexShrink: 0, color: TEAL, fontFamily: "monospace", fontWeight: 700 }}>
              {item.mark}
            </div>
            <div style={{ display: "flex", flexDirection: "column", marginLeft: 28 }}>
              <span style={{ fontFamily: "monospace", fontSize: 20, letterSpacing: "0.15em", textTransform: "uppercase", color: TEAL }}>
                {item.label}
              </span>
              <span style={{ fontSize: 28, lineHeight: 1.35, color: INK_DIM, marginTop: 6, maxWidth: 760 }}>
                {item.desc}
              </span>
            </div>
          </div>
        ))}
      </div>

      <div style={{ marginTop: "auto", display: "flex" }}>
        <Footer n={3} />
      </div>
    </div>
  );
}

// Slide 4 — Just yours (emotional)
function JustYoursSlide() {
  return (
    <div style={{ width: "100%", height: "100%", background: TEAL, display: "flex", flexDirection: "column", padding: 100, fontFamily: "Georgia, serif", color: DARK, position: "relative" }}>
      <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 600, background: "rgba(10,10,10,0.12)", display: "flex" }} />

      <div style={{ display: "flex" }}>
        <StudioTag inverted />
      </div>

      <div style={{ display: "flex", flexDirection: "column", marginTop: "auto", marginBottom: "auto" }}>
        <div style={{ fontSize: 180, lineHeight: 0.9, letterSpacing: "-0.06em", fontWeight: 600, color: DARK }}>
          no one
        </div>
        <div style={{ fontSize: 180, lineHeight: 0.9, letterSpacing: "-0.06em", fontWeight: 600, color: DARK }}>
          else sees
        </div>
        <div style={{ fontSize: 180, lineHeight: 0.9, letterSpacing: "-0.06em", fontWeight: 600, fontStyle: "italic", color: DARK, opacity: 0.5 }}>
          it.
        </div>
        <div style={{ marginTop: 60, display: "flex" }}>
          <div style={{ fontSize: 40, fontStyle: "italic", color: "rgba(10,10,10,0.6)", maxWidth: 700, lineHeight: 1.4 }}>
            your obsession, fully documented, completely private.
          </div>
        </div>
      </div>

      <div style={{ display: "flex" }}>
        <Footer n={4} inverted />
      </div>
    </div>
  );
}

// Slide 5 — Great for
function GreatForSlide() {
  const uses = [
    "song analysis brainrot",
    "fanfic saves & links",
    "character lore dumps",
    "evidence for your ship",
    "research spirals",
    "moodboards that make no sense to anyone else",
  ];

  return (
    <div style={{ width: "100%", height: "100%", background: BG2, display: "flex", flexDirection: "column", padding: 100, fontFamily: "Georgia, serif", color: INK }}>
      <div style={{ display: "flex" }}>
        <StudioTag />
      </div>

      <div style={{ display: "flex", flexDirection: "column", marginTop: 80 }}>
        <div style={{ display: "flex", flexWrap: "wrap", fontSize: 96, lineHeight: 0.96, letterSpacing: "-0.04em", fontWeight: 500 }}>
          <span style={{ color: TEAL, fontStyle: "italic" }}>great</span>
          <span style={{ color: INK }}>&nbsp;for:</span>
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", marginTop: 72 }}>
        {uses.map((use, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", marginTop: i === 0 ? 0 : 36 }}>
            <div style={{ width: 10, height: 10, borderRadius: 2, background: TEAL, marginRight: 28, flexShrink: 0, display: "flex" }} />
            <span style={{ fontSize: 36, color: INK_DIM, lineHeight: 1.2 }}>{use}</span>
          </div>
        ))}
      </div>

      <div style={{ marginTop: "auto", display: "flex" }}>
        <Footer n={5} />
      </div>
    </div>
  );
}

// Slide 6 — CTA
function CtaSlide() {
  return (
    <div style={{ width: "100%", height: "100%", background: BG, display: "flex", flexDirection: "column", padding: 100, fontFamily: "Georgia, serif", color: INK, position: "relative" }}>
      <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 900, background: "radial-gradient(ellipse 80% 60% at 50% 100%, rgba(94,234,212,0.22) 0%, transparent 65%)", display: "flex" }} />

      <div style={{ display: "flex" }}>
        <div style={{ display: "flex", border: `1.5px solid rgba(244,244,244,0.15)`, borderRadius: 100, paddingTop: 10, paddingBottom: 10, paddingLeft: 24, paddingRight: 24 }}>
          <span style={{ fontFamily: "monospace", fontSize: 18, letterSpacing: "0.22em", textTransform: "uppercase", color: INK_SOFT }}>
            free to start
          </span>
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", marginTop: "auto", marginBottom: "auto" }}>
        <div style={{ fontSize: 148, lineHeight: 0.92, letterSpacing: "-0.05em", fontWeight: 500, color: INK }}>
          build your
        </div>
        <div style={{ fontSize: 148, lineHeight: 0.92, letterSpacing: "-0.05em", fontWeight: 500, color: TEAL, fontStyle: "italic" }}>
          corner.
        </div>
        <div style={{ marginTop: 64, display: "flex" }}>
          <div style={{ fontSize: 34, lineHeight: 1.4, color: INK_DIM, maxWidth: 760 }}>
            log your fixes. document your brainrot. share the ones worth sharing.
          </div>
        </div>
        <div style={{ marginTop: 60, display: "flex" }}>
          <span style={{ fontFamily: "monospace", fontSize: 32, letterSpacing: "0.22em", textTransform: "uppercase", color: TEAL }}>
            hyperfix.app →
          </span>
        </div>
      </div>

      <div style={{ display: "flex" }}>
        <Footer n={6} />
      </div>
    </div>
  );
}

/* ── handler ── */

export async function GET(_req: NextRequest, { params }: { params: Promise<{ n: string }> }) {
  const { n } = await params;
  const slide = parseInt(n, 10);

  let element: React.ReactElement;
  switch (slide) {
    case 1:  element = <CoverSlide />;        break;
    case 2:  element = <StudioIntroSlide />;  break;
    case 3:  element = <WhatYouCanDoSlide />; break;
    case 4:  element = <JustYoursSlide />;    break;
    case 5:  element = <GreatForSlide />;     break;
    case 6:  element = <CtaSlide />;          break;
    default: element = <CoverSlide />;
  }

  return new ImageResponse(element, { width: W, height: H });
}
