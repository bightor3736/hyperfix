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

// ─── shared components ───────────────────────────────────────────────

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

// big ghost number behind content
function GhostNumber({ n }: { n: string }) {
  return (
    <div style={{
      position: "absolute",
      right: -20,
      top: 180,
      fontFamily: "sans-serif",
      fontSize: 560,
      fontWeight: 900,
      lineHeight: 1,
      color: TEAL,
      opacity: 0.04,
      letterSpacing: -30,
      userSelect: "none",
    }}>
      {n}
    </div>
  );
}

// ─── slide 1 · cover / hook ──────────────────────────────────────────
function Slide1() {
  return (
    <div style={{ width: W, height: H, background: BG, display: "flex", flexDirection: "column", padding: "100px 88px", fontFamily: "sans-serif" }}>
      <TopBar n={1} />

      {/* teal glow */}
      <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 900, background: "radial-gradient(ellipse 90% 60% at 50% 100%, rgba(94,234,212,0.13) 0%, transparent 70%)", display: "flex" }} />

      <div style={{ display: "flex", flexDirection: "column", marginTop: 140 }}>
        <div style={{ display: "flex", padding: "12px 24px", border: `1px solid rgba(94,234,212,0.3)`, borderRadius: 100, alignSelf: "flex-start", marginBottom: 56 }}>
          <span style={{ fontFamily: "monospace", fontSize: 18, letterSpacing: "0.2em", textTransform: "uppercase", color: TEAL }}>
            if this is you, hi.
          </span>
        </div>

        <div style={{ display: "flex", flexDirection: "column", fontSize: 148, fontWeight: 900, lineHeight: 0.86, letterSpacing: "-0.05em" }}>
          <span style={{ color: INK }}>the</span>
          <span style={{ color: INK }}>stages</span>
          <span style={{ color: INK }}>of a</span>
          <span style={{ color: TEAL }}>hyper-</span>
          <span style={{ color: TEAL }}>fixation</span>
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", marginTop: "auto" }}>
        <span style={{ fontSize: 30, color: DIM, lineHeight: 1.4, maxWidth: 780, marginBottom: 64 }}>
          this is going to feel uncomfortably specific.
        </span>
        <Dots current={1} />
      </div>
    </div>
  );
}

// ─── slide 2 · stage 01: discovery ──────────────────────────────────
function Slide2() {
  return (
    <div style={{ width: W, height: H, background: BG, display: "flex", flexDirection: "column", padding: "100px 88px", fontFamily: "sans-serif", position: "relative" }}>
      <GhostNumber n="1" />
      <TopBar n={2} />

      <div style={{ display: "flex", flexDirection: "column", marginTop: 130 }}>
        <span style={{ fontFamily: "monospace", fontSize: 20, letterSpacing: "0.28em", textTransform: "uppercase", color: TEAL, marginBottom: 28 }}>
          stage 01
        </span>
        <div style={{ display: "flex", flexDirection: "column", fontSize: 136, fontWeight: 900, lineHeight: 0.86, letterSpacing: "-0.05em", marginBottom: 64 }}>
          <span style={{ color: INK }}>dis-</span>
          <span style={{ color: INK }}>covery</span>
        </div>

        <div style={{ display: "flex", flexDirection: "column", borderLeft: `3px solid rgba(94,234,212,0.25)`, paddingLeft: 40, gap: 32 }}>
          <span style={{ fontSize: 44, color: INK, lineHeight: 1.25, fontWeight: 600, letterSpacing: "-0.02em" }}>
            you saw one video.
          </span>
          <span style={{ fontSize: 44, color: INK, lineHeight: 1.25, fontWeight: 600, letterSpacing: "-0.02em" }}>
            one post. one comment.
          </span>
          <span style={{ fontSize: 44, color: DIM, lineHeight: 1.25, fontWeight: 600, letterSpacing: "-0.02em" }}>
            you didn&apos;t choose this.
          </span>
          <span style={{ fontSize: 44, color: TEAL, lineHeight: 1.25, fontWeight: 700, letterSpacing: "-0.02em" }}>
            it chose you.
          </span>
        </div>
      </div>

      <div style={{ display: "flex", marginTop: "auto" }}>
        <Dots current={2} />
      </div>
    </div>
  );
}

// ─── slide 3 · stage 02: the spiral ─────────────────────────────────
function Slide3() {
  return (
    <div style={{ width: W, height: H, background: BG2, display: "flex", flexDirection: "column", padding: "100px 88px", fontFamily: "sans-serif", position: "relative" }}>
      <GhostNumber n="2" />
      <TopBar n={3} />

      <div style={{ display: "flex", flexDirection: "column", marginTop: 130 }}>
        <span style={{ fontFamily: "monospace", fontSize: 20, letterSpacing: "0.28em", textTransform: "uppercase", color: TEAL, marginBottom: 28 }}>
          stage 02
        </span>
        <div style={{ display: "flex", flexDirection: "column", fontSize: 128, fontWeight: 900, lineHeight: 0.86, letterSpacing: "-0.05em", marginBottom: 72 }}>
          <span style={{ color: INK }}>the</span>
          <span style={{ color: TEAL }}>spiral</span>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
          {[
            { text: "4 hours later.", color: INK },
            { text: "47 tabs open.", color: INK },
            { text: "3 reddit deep dives.", color: INK },
            { text: "you've watched every", color: DIM },
            { text: "video. you're now the", color: DIM },
            { text: "world's leading expert.", color: DIM },
            { text: "it's been one day.", color: TEAL },
          ].map((line, i) => (
            <span key={i} style={{ fontSize: 48, fontWeight: 700, lineHeight: 1.2, letterSpacing: "-0.02em", color: line.color }}>
              {line.text}
            </span>
          ))}
        </div>
      </div>

      <div style={{ display: "flex", marginTop: "auto" }}>
        <Dots current={3} />
      </div>
    </div>
  );
}

// ─── slide 4 · stage 03: evangelism ─────────────────────────────────
function Slide4() {
  return (
    <div style={{ width: W, height: H, background: BG, display: "flex", flexDirection: "column", padding: "100px 88px", fontFamily: "sans-serif", position: "relative" }}>
      <GhostNumber n="3" />
      <TopBar n={4} />

      <div style={{ display: "flex", flexDirection: "column", marginTop: 130 }}>
        <span style={{ fontFamily: "monospace", fontSize: 20, letterSpacing: "0.28em", textTransform: "uppercase", color: TEAL, marginBottom: 28 }}>
          stage 03
        </span>
        <div style={{ display: "flex", flexDirection: "column", fontSize: 114, fontWeight: 900, lineHeight: 0.88, letterSpacing: "-0.05em", marginBottom: 72 }}>
          <span style={{ color: INK }}>everyone</span>
          <span style={{ color: INK }}>must</span>
          <span style={{ color: TEAL }}>know.</span>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 36 }}>
          <div style={{ display: "flex", flexDirection: "column", background: CARD, border: `1px solid ${BORDER}`, borderRadius: 20, padding: "36px 40px" }}>
            <span style={{ fontSize: 38, fontWeight: 700, color: INK, lineHeight: 1.25, letterSpacing: "-0.02em" }}>
              you bring it up at dinner. unprompted.
            </span>
          </div>
          <div style={{ display: "flex", flexDirection: "column", background: CARD, border: `1px solid ${BORDER}`, borderRadius: 20, padding: "36px 40px" }}>
            <span style={{ fontSize: 38, fontWeight: 700, color: INK, lineHeight: 1.25, letterSpacing: "-0.02em" }}>
              you&apos;ve explained it to 4 people who definitely didn&apos;t ask.
            </span>
          </div>
          <div style={{ display: "flex", flexDirection: "column", background: "rgba(94,234,212,0.06)", border: `1px solid rgba(94,234,212,0.2)`, borderRadius: 20, padding: "36px 40px" }}>
            <span style={{ fontSize: 38, fontWeight: 700, color: TEAL, lineHeight: 1.25, letterSpacing: "-0.02em" }}>
              you can&apos;t stop. you won&apos;t stop.
            </span>
          </div>
        </div>
      </div>

      <div style={{ display: "flex", marginTop: "auto" }}>
        <Dots current={4} />
      </div>
    </div>
  );
}

// ─── slide 5 · stage 04: the high ───────────────────────────────────
function Slide5() {
  return (
    <div style={{ width: W, height: H, background: BG2, display: "flex", flexDirection: "column", padding: "100px 88px", fontFamily: "sans-serif", position: "relative" }}>
      <GhostNumber n="4" />

      {/* ambient teal glow at top */}
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 600, background: "radial-gradient(ellipse 80% 50% at 50% 0%, rgba(94,234,212,0.1) 0%, transparent 70%)", display: "flex" }} />

      <TopBar n={5} />

      <div style={{ display: "flex", flexDirection: "column", marginTop: 130 }}>
        <span style={{ fontFamily: "monospace", fontSize: 20, letterSpacing: "0.28em", textTransform: "uppercase", color: TEAL, marginBottom: 28 }}>
          stage 04
        </span>
        <div style={{ display: "flex", flexDirection: "column", fontSize: 148, fontWeight: 900, lineHeight: 0.86, letterSpacing: "-0.05em", marginBottom: 72 }}>
          <span style={{ color: INK }}>the</span>
          <span style={{ color: TEAL }}>high.</span>
        </div>

        <span style={{ fontSize: 46, fontWeight: 600, color: INK, lineHeight: 1.3, letterSpacing: "-0.02em" }}>
          you feel electric. you&apos;re making things, connecting things, staying up until 3am.
        </span>

        <div style={{ display: "flex", marginTop: 56, padding: "32px 40px", background: "rgba(94,234,212,0.07)", border: `1px solid rgba(94,234,212,0.18)`, borderRadius: 20 }}>
          <span style={{ fontSize: 40, fontWeight: 700, color: TEAL, lineHeight: 1.3, letterSpacing: "-0.02em" }}>
            you have never been more alive.
          </span>
        </div>
      </div>

      <div style={{ display: "flex", marginTop: "auto" }}>
        <Dots current={5} />
      </div>
    </div>
  );
}

// ─── slide 6 · stage 05: the fade ───────────────────────────────────
function Slide6() {
  return (
    <div style={{ width: W, height: H, background: BG, display: "flex", flexDirection: "column", padding: "100px 88px", fontFamily: "sans-serif", position: "relative" }}>
      <GhostNumber n="5" />
      <TopBar n={6} />

      <div style={{ display: "flex", flexDirection: "column", marginTop: 130 }}>
        <span style={{ fontFamily: "monospace", fontSize: 20, letterSpacing: "0.28em", textTransform: "uppercase", color: "rgba(94,234,212,0.4)", marginBottom: 28 }}>
          stage 05
        </span>
        <div style={{ display: "flex", flexDirection: "column", fontSize: 136, fontWeight: 900, lineHeight: 0.86, letterSpacing: "-0.05em", marginBottom: 72 }}>
          <span style={{ color: DIM }}>then</span>
          <span style={{ color: DIM }}>one</span>
          <span style={{ color: DIM }}>day...</span>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
          <span style={{ fontSize: 44, fontWeight: 600, color: "rgba(244,244,244,0.5)", lineHeight: 1.3, letterSpacing: "-0.02em" }}>
            the folder is still there.
          </span>
          <span style={{ fontSize: 44, fontWeight: 600, color: "rgba(244,244,244,0.4)", lineHeight: 1.3, letterSpacing: "-0.02em" }}>
            the tabs are still open.
          </span>
          <span style={{ fontSize: 44, fontWeight: 600, color: "rgba(244,244,244,0.3)", lineHeight: 1.3, letterSpacing: "-0.02em" }}>
            your friend texts you about it.
          </span>
          <span style={{ fontSize: 44, fontWeight: 700, color: INK, lineHeight: 1.3, letterSpacing: "-0.02em" }}>
            you say &ldquo;yeah&rdquo; and mean &ldquo;i don&apos;t feel that anymore and i don&apos;t know why.&rdquo;
          </span>
        </div>
      </div>

      <div style={{ display: "flex", marginTop: "auto" }}>
        <Dots current={6} />
      </div>
    </div>
  );
}

// ─── slide 7 · cta ───────────────────────────────────────────────────
function Slide7() {
  return (
    <div style={{ width: W, height: H, background: BG, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "100px 88px", fontFamily: "sans-serif", position: "relative" }}>
      {/* glow */}
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, background: "radial-gradient(ellipse 80% 60% at 50% 50%, rgba(94,234,212,0.08) 0%, transparent 65%)", display: "flex" }} />

      <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
        <GemMark size={96} />

        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginTop: 52 }}>
          <span style={{ fontFamily: "monospace", fontSize: 18, letterSpacing: "0.3em", color: DIM, textTransform: "uppercase", marginBottom: 20 }}>
            log it while it lasts
          </span>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
            <div style={{ display: "flex", fontFamily: "Georgia, serif", fontSize: 116, fontWeight: 700, letterSpacing: "-0.05em", lineHeight: 0.88 }}>
              <span style={{ color: INK }}>hyper</span>
              <span style={{ color: TEAL, fontStyle: "italic" }}>fix</span>
            </div>
            <span style={{ fontFamily: "Georgia, serif", fontSize: 116, fontWeight: 700, letterSpacing: "-0.05em", lineHeight: 0.88, color: TEAL, fontStyle: "italic" }}>
              .app
            </span>
          </div>
        </div>

        <span style={{ fontSize: 30, color: DIM, textAlign: "center", maxWidth: 720, lineHeight: 1.45, marginTop: 52 }}>
          track every hyperfixation you&apos;ve ever had. build a graveyard for the ones that faded.
        </span>

        <div style={{ display: "flex", marginTop: 60, padding: "22px 52px", background: TEAL, borderRadius: 100 }}>
          <span style={{ fontSize: 26, fontWeight: 800, color: BG, letterSpacing: "-0.02em" }}>free to use</span>
        </div>
      </div>

      <div style={{ display: "flex", position: "absolute", bottom: 100, left: 88, right: 88, justifyContent: "center" }}>
        <Dots current={7} />
      </div>
    </div>
  );
}

// ─── route ───────────────────────────────────────────────────────────
export async function GET(_req: NextRequest, { params }: { params: Promise<{ n: string }> }) {
  const { n } = await params;
  const slide = parseInt(n, 10);

  let el: React.ReactElement;
  if (slide === 1)      el = <Slide1 />;
  else if (slide === 2) el = <Slide2 />;
  else if (slide === 3) el = <Slide3 />;
  else if (slide === 4) el = <Slide4 />;
  else if (slide === 5) el = <Slide5 />;
  else if (slide === 6) el = <Slide6 />;
  else                  el = <Slide7 />;

  return new ImageResponse(el, { width: W, height: H });
}
