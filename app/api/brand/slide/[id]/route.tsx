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

const CatTag = ({ label }: { label: string }) => (
  <div
    style={{
      display: "flex",
      alignItems: "center",
      background: "rgba(255,255,255,0.06)",
      border: "1px solid rgba(255,255,255,0.1)",
      color: "rgba(244,244,244,0.85)",
      fontSize: 36,
      fontWeight: 500,
      borderRadius: 18,
      padding: "18px 44px",
      fontFamily: "monospace",
    }}
  >
    {label}
  </div>
);

const Watermark = () => (
  <div
    style={{
      position: "absolute",
      bottom: 80,
      left: "50%",
      transform: "translateX(-50%)",
      display: "flex",
      alignItems: "center",
      gap: 14,
    }}
  >
    {GEM(36)}
    <span style={{ color: "rgba(255,255,255,0.35)", fontSize: 28, fontWeight: 500, fontFamily: "sans-serif" }}>
      hyperfix.app
    </span>
  </div>
);

const Dots = ({ current, total }: { current: number; total: number }) => (
  <div
    style={{
      position: "absolute",
      bottom: 160,
      left: "50%",
      transform: "translateX(-50%)",
      display: "flex",
      gap: 10,
    }}
  >
    {Array.from({ length: total }).map((_, i) => (
      <div
        key={i}
        style={{
          width: i === current ? 36 : 10,
          height: 10,
          borderRadius: 999,
          background: i === current ? "#5EEAD4" : "rgba(255,255,255,0.2)",
        }}
      />
    ))}
  </div>
);

// Slide 1 — Cover
function slide1() {
  return (
    <div
      style={{
        width: W, height: H, display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center", position: "relative",
        background: "radial-gradient(ellipse 110% 60% at 50% 100%, #5EEAD4 0%, #2DD4BF 14%, #0E4F47 32%, #08231F 52%, #070708 72%)",
        fontFamily: "sans-serif", color: "#F4F4F4", overflow: "hidden",
      }}
    >
      {/* Top fade */}
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 500, background: "linear-gradient(to bottom, rgba(7,7,8,0.9) 0%, transparent 100%)" }} />

      {/* Top label */}
      <div style={{
        position: "absolute", top: 120, left: 0, right: 0,
        display: "flex", justifyContent: "center",
      }}>
        <div style={{
          display: "flex", alignItems: "center",
          background: "rgba(94,234,212,0.12)", border: "1px solid rgba(94,234,212,0.28)",
          color: "#5EEAD4", fontSize: 24, fontWeight: 500, borderRadius: 999,
          padding: "12px 32px", fontFamily: "monospace", letterSpacing: "0.08em",
          textTransform: "uppercase",
        }}>
          track your obsessions
        </div>
      </div>

      {/* Center content */}
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 0 }}>
        {GEM(360)}
        <span style={{ fontSize: 128, fontWeight: 700, letterSpacing: "-0.04em", color: "#FFFFFF", lineHeight: 1, marginTop: 56 }}>
          hyperfix
        </span>
        <span style={{ fontSize: 30, color: "rgba(255,255,255,0.5)", marginTop: 24, letterSpacing: "0.14em", textTransform: "uppercase", fontFamily: "monospace" }}>
          the app for hyperfixations
        </span>
      </div>

      <Dots current={0} total={5} />
      <Watermark />
    </div>
  );
}

// Slide 2 — Hook
function slide2() {
  return (
    <div
      style={{
        width: W, height: H, display: "flex", flexDirection: "column",
        justifyContent: "center", position: "relative",
        background: "#070708", fontFamily: "sans-serif", color: "#F4F4F4",
        padding: "0 96px",
      }}
    >
      {/* Subtle glow */}
      <div style={{
        position: "absolute", top: "40%", left: "50%",
        transform: "translate(-50%, -50%)",
        width: 900, height: 900,
        background: "radial-gradient(circle, rgba(94,234,212,0.07) 0%, transparent 65%)",
      }} />

      <div style={{ width: 64, height: 6, background: "#5EEAD4", borderRadius: 999, marginBottom: 64 }} />

      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        <span style={{ fontSize: 148, fontWeight: 700, letterSpacing: "-0.045em", color: "#FFFFFF", lineHeight: 0.88 }}>
          what are
        </span>
        <span style={{ fontSize: 148, fontWeight: 700, letterSpacing: "-0.045em", color: "#5EEAD4", lineHeight: 0.88 }}>
          you obsessed
        </span>
        <span style={{ fontSize: 148, fontWeight: 700, letterSpacing: "-0.045em", color: "#FFFFFF", lineHeight: 0.88 }}>
          with?
        </span>
      </div>

      <span style={{ fontSize: 38, color: "rgba(255,255,255,0.5)", marginTop: 80, lineHeight: 1.6 }}>
        a song on loop. a show you can&apos;t quit.{"\n"}a fic that has you.{"\n"}
        <span style={{ color: "#5EEAD4" }}>whatever it is.</span>
      </span>

      <Dots current={1} total={5} />
      <Watermark />
    </div>
  );
}

// Slide 3 — Fix card demo
function slide3() {
  return (
    <div
      style={{
        width: W, height: H, display: "flex", flexDirection: "column",
        justifyContent: "center", position: "relative",
        background: "#070708", fontFamily: "sans-serif", color: "#F4F4F4",
        padding: "0 80px",
      }}
    >
      {/* Glow */}
      <div style={{
        position: "absolute", top: 960, left: 540,
        width: 900, height: 900, marginLeft: -450, marginTop: -450,
        background: "radial-gradient(circle, rgba(94,234,212,0.08) 0%, transparent 65%)",
      }} />

      {/* Headline */}
      <div style={{ width: 64, height: 6, background: "#5EEAD4", borderRadius: 999, marginBottom: 36 }} />
      <div style={{ display: "flex", flexDirection: "column", gap: 4, marginBottom: 56 }}>
        <span style={{ fontSize: 76, fontWeight: 700, letterSpacing: "-0.035em", color: "#FFFFFF", lineHeight: 1 }}>
          log it.
        </span>
        <span style={{ fontSize: 76, fontWeight: 700, letterSpacing: "-0.035em", color: "#5EEAD4", lineHeight: 1 }}>
          watch the days
        </span>
        <span style={{ fontSize: 76, fontWeight: 700, letterSpacing: "-0.035em", color: "#FFFFFF", lineHeight: 1 }}>
          pile up.
        </span>
      </div>

      {/* Fix card */}
      <div
        style={{
          width: "100%",
          background: "#0F1011",
          border: "1px solid rgba(255,255,255,0.09)",
          borderRadius: 40, padding: "56px 64px",
          display: "flex", flexDirection: "column", gap: 0,
        }}
      >
        <div style={{ display: "flex", marginBottom: 28 }}>
          <div style={{
            background: "rgba(94,234,212,0.10)", border: "1px solid rgba(94,234,212,0.25)",
            color: "#5EEAD4", fontSize: 22, borderRadius: 999, padding: "10px 26px",
            fontFamily: "monospace", letterSpacing: "0.08em", textTransform: "uppercase",
            display: "flex", alignItems: "center",
          }}>
            song
          </div>
        </div>

        <span style={{ fontSize: 52, fontWeight: 600, color: "#FFFFFF", letterSpacing: "-0.025em", lineHeight: 1.1 }}>
          Brat · Charli XCX
        </span>

        <div style={{ display: "flex", alignItems: "baseline", gap: 14, marginTop: 32 }}>
          <span style={{ fontSize: 120, fontWeight: 700, color: "#5EEAD4", letterSpacing: "-0.05em", lineHeight: 1 }}>
            47
          </span>
          <span style={{ fontSize: 36, color: "rgba(255,255,255,0.45)" }}>days</span>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 16, marginTop: 20 }}>
          <span style={{ fontSize: 20, color: "rgba(255,255,255,0.4)", fontFamily: "monospace", textTransform: "uppercase", letterSpacing: "0.1em" }}>
            Intensity
          </span>
          <div style={{ display: "flex", gap: 5 }}>
            {Array.from({ length: 10 }).map((_, i) => (
              <div key={i} style={{ width: 26, height: 10, borderRadius: 4, background: i < 9 ? "#E63946" : "rgba(255,255,255,0.12)" }} />
            ))}
          </div>
          <span style={{ fontSize: 24, color: "#E63946", fontWeight: 700 }}>9/10</span>
        </div>
      </div>

      <Dots current={2} total={5} />
      <Watermark />
    </div>
  );
}

// Slide 4 — Categories
function slide4() {
  const cats = ["song", "fanfic", "show", "film", "ship", "game", "book", "other"];
  return (
    <div
      style={{
        width: W, height: H, display: "flex", flexDirection: "column",
        justifyContent: "center", position: "relative",
        background: "#070708", fontFamily: "sans-serif", color: "#F4F4F4",
        padding: "0 88px",
      }}
    >
      <span style={{ fontSize: 24, color: "rgba(255,255,255,0.35)", fontFamily: "monospace", letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: 32 }}>
        name it.
      </span>
      <span style={{ fontSize: 100, fontWeight: 700, letterSpacing: "-0.04em", color: "#FFFFFF", lineHeight: 0.9, marginBottom: 72 }}>
        whatever{"\n"}you&apos;re into.{"\n"}
        <span style={{ color: "#5EEAD4" }}>we track it.</span>
      </span>

      <div style={{ display: "flex", flexWrap: "wrap", gap: 18, marginBottom: 64 }}>
        {cats.map((c) => <CatTag key={c} label={c} />)}
      </div>

      <span style={{ fontSize: 30, color: "rgba(255,255,255,0.35)", lineHeight: 1.7 }}>
        pick a category. set the intensity.{"\n"}start the counter.
      </span>

      <Dots current={3} total={5} />
      <Watermark />
    </div>
  );
}

// Slide 5 — CTA
function slide5() {
  return (
    <div
      style={{
        width: W, height: H, display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center", position: "relative",
        background: "radial-gradient(ellipse 100% 55% at 50% 100%, #5EEAD4 0%, #2DD4BF 14%, #0E4F47 32%, #08231F 52%, #070708 72%)",
        fontFamily: "sans-serif", color: "#F4F4F4", overflow: "hidden",
      }}
    >
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 560, background: "linear-gradient(to bottom, rgba(7,7,8,0.92) 0%, transparent 100%)" }} />

      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "0 96px" }}>
        {GEM(240)}

        <span style={{ fontSize: 120, fontWeight: 700, letterSpacing: "-0.04em", color: "#FFFFFF", lineHeight: 0.9, marginTop: 64, textAlign: "center" }}>
          mourn it
        </span>
        <span style={{ fontSize: 120, fontWeight: 700, letterSpacing: "-0.04em", color: "#5EEAD4", lineHeight: 0.9, textAlign: "center" }}>
          when it ends.
        </span>

        <span style={{ fontSize: 34, color: "rgba(255,255,255,0.5)", marginTop: 60, textAlign: "center", lineHeight: 1.5 }}>
          start your first fix at
        </span>
        <span style={{ fontSize: 56, fontWeight: 700, color: "#5EEAD4", marginTop: 16 }}>
          hyperfix.app
        </span>
        <span style={{ fontSize: 24, color: "rgba(255,255,255,0.3)", marginTop: 24, fontFamily: "monospace", letterSpacing: "0.1em", textTransform: "uppercase" }}>
          free forever · no credit card
        </span>
      </div>

      <Dots current={4} total={5} />
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
