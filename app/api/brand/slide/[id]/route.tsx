import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";

export const runtime = "edge";

const W = 1080;
const H = 1920;

const GEM = (size: number) => (
  <svg width={size} height={size} viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
    <path d="M58,32 L50,14 L32,32 Z" fill="#3CCFBA" />
    <path d="M32,58 L14,50 L32,32 Z" fill="#3CCFBA" />
    <path d="M6,32 L14,14 L32,32 Z" fill="#3CCFBA" />
    <path d="M32,6 L50,14 L32,32 Z" fill="#5EEAD4" />
    <path d="M58,32 L50,50 L32,32 Z" fill="#0D9488" />
    <path d="M50,50 L32,58 L32,32 Z" fill="#0A7A70" />
    <path d="M14,50 L6,32 L32,32 Z" fill="#0D9488" />
    <path d="M14,14 L32,6 L32,32 Z" fill="#0A7A70" />
    <path d="M58,32 L50,50 L32,58 L14,50 L6,32 L14,14 L32,6 L50,14 Z" fill="none" stroke="rgba(255,255,255,0.22)" strokeWidth="1.2" />
    <path d="M43,32 L39,39 L32,43 L25,39 L21,32 L25,25 L32,21 L39,25 Z" fill="rgba(255,255,255,0.22)" />
    <line x1="58" y1="32" x2="43" y2="32" stroke="rgba(255,255,255,0.14)" strokeWidth="0.8" />
    <line x1="50" y1="50" x2="39" y2="39" stroke="rgba(255,255,255,0.14)" strokeWidth="0.8" />
    <line x1="32" y1="58" x2="32" y2="43" stroke="rgba(255,255,255,0.14)" strokeWidth="0.8" />
    <line x1="14" y1="50" x2="25" y2="39" stroke="rgba(255,255,255,0.14)" strokeWidth="0.8" />
    <line x1="6" y1="32" x2="21" y2="32" stroke="rgba(255,255,255,0.14)" strokeWidth="0.8" />
    <line x1="14" y1="14" x2="25" y2="25" stroke="rgba(255,255,255,0.14)" strokeWidth="0.8" />
    <line x1="32" y1="6" x2="32" y2="21" stroke="rgba(255,255,255,0.14)" strokeWidth="0.8" />
    <line x1="50" y1="14" x2="39" y2="25" stroke="rgba(255,255,255,0.14)" strokeWidth="0.8" />
  </svg>
);

const Dots = ({ current, total }: { current: number; total: number }) => (
  <div style={{ display: "flex", gap: 10 }}>
    {Array.from({ length: total }).map((_, i) => (
      <div
        key={i}
        style={{
          width: i === current ? 32 : 10,
          height: 10,
          borderRadius: 999,
          background: i === current ? "#5EEAD4" : "rgba(255,255,255,0.18)",
        }}
      />
    ))}
  </div>
);

// Slide 1 — Cover: gem hero, centered
function slide1() {
  return (
    <div
      style={{
        width: W, height: H,
        display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "space-between",
        background: "#070708",
        fontFamily: "sans-serif", color: "#F4F4F4",
        padding: "120px 80px 100px",
      }}
    >
      {/* Top pill */}
      <div style={{
        display: "flex", alignItems: "center",
        background: "rgba(94,234,212,0.10)",
        border: "1px solid rgba(94,234,212,0.25)",
        color: "#5EEAD4", fontSize: 26, fontWeight: 500,
        borderRadius: 999, padding: "14px 36px",
        fontFamily: "monospace", letterSpacing: "0.1em", textTransform: "uppercase",
      }}>
        track your obsessions
      </div>

      {/* Gem — full radial treatment */}
      <div style={{
        display: "flex", flexDirection: "column", alignItems: "center",
        gap: 0,
        background: "radial-gradient(ellipse 90% 70% at 50% 50%, rgba(94,234,212,0.18) 0%, rgba(45,212,191,0.06) 45%, transparent 70%)",
        borderRadius: 999, padding: 60,
      }}>
        {GEM(480)}
      </div>

      {/* Wordmark + tagline */}
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 20 }}>
        <span style={{
          fontSize: 130, fontWeight: 700, letterSpacing: "-0.04em",
          color: "#FFFFFF", lineHeight: 1,
        }}>
          hyperfix
        </span>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div style={{ width: 40, height: 2, background: "rgba(94,234,212,0.4)", borderRadius: 999 }} />
          <span style={{
            fontSize: 24, color: "rgba(255,255,255,0.45)",
            fontFamily: "monospace", letterSpacing: "0.14em", textTransform: "uppercase",
          }}>
            hyperfixation tracker
          </span>
          <div style={{ width: 40, height: 2, background: "rgba(94,234,212,0.4)", borderRadius: 999 }} />
        </div>
      </div>

      {/* Bottom dots */}
      <Dots current={0} total={5} />
    </div>
  );
}

// Slide 2 — Hook: giant question
function slide2() {
  return (
    <div
      style={{
        width: W, height: H,
        display: "flex", flexDirection: "column",
        justifyContent: "space-between",
        background: "#070708",
        fontFamily: "sans-serif", color: "#F4F4F4",
        padding: "140px 96px 100px",
      }}
    >
      {/* Teal accent line */}
      <div style={{ width: 72, height: 6, background: "#5EEAD4", borderRadius: 999 }} />

      {/* Question */}
      <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
        <span style={{ fontSize: 168, fontWeight: 800, letterSpacing: "-0.05em", color: "#FFFFFF", lineHeight: 0.85 }}>
          what
        </span>
        <span style={{ fontSize: 168, fontWeight: 800, letterSpacing: "-0.05em", color: "#FFFFFF", lineHeight: 0.85 }}>
          are you
        </span>
        <span style={{ fontSize: 168, fontWeight: 800, letterSpacing: "-0.05em", color: "#5EEAD4", lineHeight: 0.85 }}>
          obsessed
        </span>
        <span style={{ fontSize: 168, fontWeight: 800, letterSpacing: "-0.05em", color: "#FFFFFF", lineHeight: 0.85 }}>
          with?
        </span>
      </div>

      {/* Supporting + dots */}
      <div style={{ display: "flex", flexDirection: "column", gap: 40 }}>
        <span style={{ fontSize: 36, color: "rgba(255,255,255,0.45)", lineHeight: 1.55 }}>
          a song on repeat. a show you binge at 2am.{"\n"}a fic that lives in your head rent-free.
        </span>
        <Dots current={1} total={5} />
      </div>
    </div>
  );
}

// Slide 3 — Fix card: big number hero
function slide3() {
  return (
    <div
      style={{
        width: W, height: H,
        display: "flex", flexDirection: "column",
        justifyContent: "space-between",
        background: "#070708",
        fontFamily: "sans-serif", color: "#F4F4F4",
        padding: "140px 96px 100px",
      }}
    >
      {/* Category + title */}
      <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
        <div style={{
          display: "flex", alignItems: "center",
          background: "rgba(94,234,212,0.10)",
          border: "1px solid rgba(94,234,212,0.25)",
          color: "#5EEAD4", fontSize: 24, borderRadius: 999,
          padding: "12px 32px", fontFamily: "monospace",
          letterSpacing: "0.1em", textTransform: "uppercase",
          alignSelf: "flex-start",
        }}>
          song
        </div>
        <span style={{ fontSize: 72, fontWeight: 700, letterSpacing: "-0.03em", color: "#FFFFFF", lineHeight: 1.05 }}>
          Brat{"\n"}Charli XCX
        </span>
      </div>

      {/* Big day counter */}
      <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
        <span style={{ fontSize: 260, fontWeight: 800, letterSpacing: "-0.06em", color: "#5EEAD4", lineHeight: 0.85 }}>
          47
        </span>
        <span style={{ fontSize: 72, fontWeight: 700, letterSpacing: "-0.02em", color: "rgba(255,255,255,0.5)", lineHeight: 1 }}>
          days obsessed
        </span>
      </div>

      {/* Intensity + dots */}
      <div style={{ display: "flex", flexDirection: "column", gap: 40 }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <span style={{ fontSize: 22, color: "rgba(255,255,255,0.35)", fontFamily: "monospace", textTransform: "uppercase", letterSpacing: "0.1em" }}>
            intensity
          </span>
          <div style={{ display: "flex", gap: 8 }}>
            {Array.from({ length: 10 }).map((_, i) => (
              <div key={i} style={{ width: 80, height: 12, borderRadius: 6, background: i < 9 ? "#E63946" : "rgba(255,255,255,0.10)" }} />
            ))}
          </div>
          <span style={{ fontSize: 36, fontWeight: 700, color: "#E63946" }}>9 / 10</span>
        </div>
        <Dots current={2} total={5} />
      </div>
    </div>
  );
}

// Slide 4 — Categories
function slide4() {
  const cats = [
    { label: "song", color: "rgba(94,234,212,0.12)", border: "rgba(94,234,212,0.28)", text: "#5EEAD4" },
    { label: "show", color: "rgba(167,139,250,0.12)", border: "rgba(167,139,250,0.28)", text: "#A78BFA" },
    { label: "film", color: "rgba(251,191,36,0.10)", border: "rgba(251,191,36,0.25)", text: "#FBB724" },
    { label: "game", color: "rgba(52,211,153,0.12)", border: "rgba(52,211,153,0.28)", text: "#34D399" },
    { label: "book", color: "rgba(251,113,133,0.10)", border: "rgba(251,113,133,0.25)", text: "#FB7185" },
    { label: "fanfic", color: "rgba(249,168,212,0.10)", border: "rgba(249,168,212,0.25)", text: "#F9A8D4" },
    { label: "ship", color: "rgba(253,186,116,0.10)", border: "rgba(253,186,116,0.25)", text: "#FDBA74" },
    { label: "other", color: "rgba(255,255,255,0.06)", border: "rgba(255,255,255,0.12)", text: "rgba(255,255,255,0.6)" },
  ];
  return (
    <div
      style={{
        width: W, height: H,
        display: "flex", flexDirection: "column",
        justifyContent: "space-between",
        background: "#070708",
        fontFamily: "sans-serif", color: "#F4F4F4",
        padding: "140px 96px 100px",
      }}
    >
      {/* Headline */}
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        <span style={{ fontSize: 28, color: "rgba(255,255,255,0.35)", fontFamily: "monospace", letterSpacing: "0.12em", textTransform: "uppercase" }}>
          name it.
        </span>
        <span style={{ fontSize: 108, fontWeight: 800, letterSpacing: "-0.04em", color: "#FFFFFF", lineHeight: 0.88 }}>
          whatever{"\n"}you&apos;re into.
        </span>
      </div>

      {/* Tags */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: 20 }}>
        {cats.map((c) => (
          <div
            key={c.label}
            style={{
              display: "flex", alignItems: "center",
              background: c.color, border: `1px solid ${c.border}`,
              color: c.text, fontSize: 36, fontWeight: 600,
              borderRadius: 20, padding: "20px 44px",
              fontFamily: "monospace",
            }}
          >
            {c.label}
          </div>
        ))}
      </div>

      {/* Bottom */}
      <div style={{ display: "flex", flexDirection: "column", gap: 40 }}>
        <span style={{ fontSize: 32, color: "rgba(255,255,255,0.35)" }}>
          pick a category. set intensity. start the clock.
        </span>
        <Dots current={3} total={5} />
      </div>
    </div>
  );
}

// Slide 5 — CTA
function slide5() {
  return (
    <div
      style={{
        width: W, height: H,
        display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "space-between",
        background: "#070708",
        fontFamily: "sans-serif", color: "#F4F4F4",
        padding: "120px 96px 100px",
      }}
    >
      {/* Top gem + teal glow panel */}
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "center",
        background: "radial-gradient(ellipse 100% 100% at 50% 50%, rgba(94,234,212,0.16) 0%, rgba(45,212,191,0.05) 50%, transparent 75%)",
        borderRadius: 999, padding: 40,
      }}>
        {GEM(320)}
      </div>

      {/* Main copy */}
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 0 }}>
        <span style={{ fontSize: 130, fontWeight: 800, letterSpacing: "-0.045em", color: "#FFFFFF", lineHeight: 0.88, textAlign: "center" }}>
          mourn it
        </span>
        <span style={{ fontSize: 130, fontWeight: 800, letterSpacing: "-0.045em", color: "#5EEAD4", lineHeight: 0.88, textAlign: "center" }}>
          when it ends.
        </span>
        <div style={{ width: 80, height: 3, background: "rgba(94,234,212,0.35)", borderRadius: 999, marginTop: 48 }} />
      </div>

      {/* URL + badge + dots */}
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 32 }}>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
          <span style={{ fontSize: 30, color: "rgba(255,255,255,0.4)" }}>start for free at</span>
          <span style={{ fontSize: 58, fontWeight: 700, color: "#5EEAD4", letterSpacing: "-0.02em" }}>hyperfix.app</span>
          <span style={{ fontSize: 22, color: "rgba(255,255,255,0.25)", fontFamily: "monospace", letterSpacing: "0.1em", textTransform: "uppercase", marginTop: 4 }}>
            free forever · no credit card
          </span>
        </div>
        <Dots current={4} total={5} />
      </div>
    </div>
  );
}

const slides: Record<string, () => JSX.Element> = {
  "1": slide1, "2": slide2, "3": slide3, "4": slide4, "5": slide5,
};

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const renderFn = slides[id];
  if (!renderFn) return new Response("Not found", { status: 404 });

  return new ImageResponse(renderFn(), { width: W, height: H });
}
