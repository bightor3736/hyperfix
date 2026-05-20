import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";

export const runtime = "edge";

const W = 1080;
const H = 1080;

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

// Pill label
const Pill = ({ label }: { label: string }) => (
  <div
    style={{
      display: "flex",
      alignItems: "center",
      background: "rgba(94,234,212,0.12)",
      border: "1px solid rgba(94,234,212,0.28)",
      color: "#5EEAD4",
      fontSize: 22,
      fontWeight: 500,
      borderRadius: 999,
      padding: "10px 28px",
      fontFamily: "monospace",
      letterSpacing: "0.06em",
      textTransform: "uppercase",
    }}
  >
    {label}
  </div>
);

// Category tag
const CatTag = ({ label }: { label: string }) => (
  <div
    style={{
      display: "flex",
      alignItems: "center",
      background: "rgba(255,255,255,0.06)",
      border: "1px solid rgba(255,255,255,0.1)",
      color: "rgba(244,244,244,0.8)",
      fontSize: 30,
      fontWeight: 500,
      borderRadius: 16,
      padding: "16px 36px",
      fontFamily: "monospace",
    }}
  >
    {label}
  </div>
);

// Bottom watermark
const Watermark = () => (
  <div
    style={{
      position: "absolute",
      bottom: 52,
      right: 60,
      display: "flex",
      alignItems: "center",
      gap: 14,
    }}
  >
    {GEM(38)}
    <span style={{ color: "rgba(255,255,255,0.4)", fontSize: 24, fontWeight: 500, fontFamily: "sans-serif" }}>
      hyperfix.app
    </span>
  </div>
);

// Slide counter dots
const Dots = ({ current, total }: { current: number; total: number }) => (
  <div
    style={{
      position: "absolute",
      bottom: 60,
      left: 60,
      display: "flex",
      gap: 8,
    }}
  >
    {Array.from({ length: total }).map((_, i) => (
      <div
        key={i}
        style={{
          width: i === current ? 28 : 8,
          height: 8,
          borderRadius: 999,
          background: i === current ? "#5EEAD4" : "rgba(255,255,255,0.2)",
        }}
      />
    ))}
  </div>
);

function slide1() {
  return (
    <div
      style={{
        width: W, height: H, display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center", position: "relative",
        background: "radial-gradient(ellipse 90% 80% at 50% 108%, #5EEAD4 0%, #2DD4BF 16%, #0E4F47 36%, #08231F 58%, #070708 80%)",
        fontFamily: "sans-serif", color: "#F4F4F4",
      }}
    >
      {/* Top vignette */}
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 300, background: "linear-gradient(to bottom, rgba(7,7,8,0.85) 0%, transparent 100%)" }} />

      {GEM(260)}

      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 0, marginTop: 48 }}>
        <span style={{ fontSize: 80, fontWeight: 700, letterSpacing: "-0.035em", color: "#FFFFFF", lineHeight: 1 }}>
          hyperfix
        </span>
        <span style={{ fontSize: 26, color: "rgba(255,255,255,0.6)", marginTop: 18, letterSpacing: "0.14em", textTransform: "uppercase", fontFamily: "monospace" }}>
          track your obsessions
        </span>
      </div>

      <Dots current={0} total={5} />
      <Watermark />
    </div>
  );
}

function slide2() {
  return (
    <div
      style={{
        width: W, height: H, display: "flex", flexDirection: "column",
        justifyContent: "center", position: "relative",
        background: "#070708", fontFamily: "sans-serif", color: "#F4F4F4",
        padding: "0 88px",
      }}
    >
      {/* Teal accent bar */}
      <div style={{ width: 64, height: 5, background: "#5EEAD4", borderRadius: 999, marginBottom: 56 }} />

      <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
        <span style={{ fontSize: 116, fontWeight: 700, letterSpacing: "-0.04em", color: "#FFFFFF", lineHeight: 0.95 }}>
          what are
        </span>
        <span style={{ fontSize: 116, fontWeight: 700, letterSpacing: "-0.04em", color: "#5EEAD4", lineHeight: 0.95 }}>
          you obsessed
        </span>
        <span style={{ fontSize: 116, fontWeight: 700, letterSpacing: "-0.04em", color: "#FFFFFF", lineHeight: 0.95 }}>
          with?
        </span>
      </div>

      <span style={{ fontSize: 30, color: "rgba(255,255,255,0.5)", marginTop: 56, lineHeight: 1.5 }}>
        a song on loop. a show you can&apos;t quit.{"\n"}a fic that has you. whatever it is.
      </span>

      <Dots current={1} total={5} />
      <Watermark />
    </div>
  );
}

function slide3() {
  return (
    <div
      style={{
        width: W, height: H, display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center", position: "relative",
        background: "#070708", fontFamily: "sans-serif", color: "#F4F4F4",
        padding: "0 72px",
      }}
    >
      {/* Glow orb behind card */}
      <div style={{
        position: "absolute",
        top: "50%", left: "50%",
        transform: "translate(-50%, -50%)",
        width: 600, height: 600,
        background: "radial-gradient(circle, rgba(94,234,212,0.08) 0%, transparent 70%)",
      }} />

      {/* Fix card */}
      <div
        style={{
          width: "100%",
          background: "#0F1011",
          border: "1px solid rgba(255,255,255,0.08)",
          borderRadius: 36,
          padding: "60px 64px",
          display: "flex",
          flexDirection: "column",
          gap: 0,
          position: "relative",
        }}
      >
        {/* Category pill */}
        <div style={{ display: "flex", marginBottom: 28 }}>
          <div style={{
            background: "rgba(94,234,212,0.10)", border: "1px solid rgba(94,234,212,0.25)",
            color: "#5EEAD4", fontSize: 20, borderRadius: 999, padding: "8px 22px",
            fontFamily: "monospace", letterSpacing: "0.08em", textTransform: "uppercase",
          }}>
            song
          </div>
        </div>

        <span style={{ fontSize: 42, fontWeight: 600, color: "#FFFFFF", letterSpacing: "-0.02em", lineHeight: 1.15 }}>
          Brat · Charli XCX
        </span>

        {/* Day counter */}
        <div style={{ display: "flex", alignItems: "baseline", gap: 14, marginTop: 40, marginBottom: 8 }}>
          <span style={{ fontSize: 120, fontWeight: 700, color: "#5EEAD4", letterSpacing: "-0.05em", lineHeight: 1 }}>
            47
          </span>
          <span style={{ fontSize: 36, color: "rgba(255,255,255,0.45)" }}>days</span>
        </div>

        {/* Intensity bar */}
        <div style={{ display: "flex", alignItems: "center", gap: 16, marginTop: 16 }}>
          <span style={{ fontSize: 20, color: "rgba(255,255,255,0.4)", fontFamily: "monospace", textTransform: "uppercase", letterSpacing: "0.1em" }}>
            Intensity
          </span>
          <div style={{ display: "flex", gap: 5 }}>
            {Array.from({ length: 10 }).map((_, i) => (
              <div key={i} style={{ width: 22, height: 8, borderRadius: 3, background: i < 9 ? "#E63946" : "rgba(255,255,255,0.12)" }} />
            ))}
          </div>
          <span style={{ fontSize: 22, color: "#E63946", fontWeight: 700 }}>9/10</span>
        </div>
      </div>

      <span style={{ fontSize: 28, color: "rgba(255,255,255,0.4)", marginTop: 48, textAlign: "center" }}>
        log it. watch the days pile up.
      </span>

      <Dots current={2} total={5} />
      <Watermark />
    </div>
  );
}

function slide4() {
  const cats = ["song", "fanfic", "show", "film", "ship", "game", "book", "other"];
  return (
    <div
      style={{
        width: W, height: H, display: "flex", flexDirection: "column",
        justifyContent: "center", position: "relative",
        background: "#070708", fontFamily: "sans-serif", color: "#F4F4F4",
        padding: "0 72px",
      }}
    >
      <span style={{ fontSize: 26, color: "rgba(255,255,255,0.35)", fontFamily: "monospace", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 28 }}>
        name it.
      </span>
      <span style={{ fontSize: 88, fontWeight: 700, letterSpacing: "-0.04em", color: "#FFFFFF", lineHeight: 0.95, marginBottom: 56 }}>
        whatever you&apos;re into. we track it.
      </span>

      {/* Category grid */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: 16 }}>
        {cats.map((c) => <CatTag key={c} label={c} />)}
      </div>

      <span style={{ fontSize: 26, color: "rgba(255,255,255,0.35)", marginTop: 56 }}>
        pick a category. set the intensity. start the counter.
      </span>

      <Dots current={3} total={5} />
      <Watermark />
    </div>
  );
}

function slide5() {
  return (
    <div
      style={{
        width: W, height: H, display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center", position: "relative",
        background: "radial-gradient(ellipse 80% 70% at 50% 108%, #5EEAD4 0%, #2DD4BF 16%, #0E4F47 36%, #08231F 58%, #070708 80%)",
        fontFamily: "sans-serif", color: "#F4F4F4",
      }}
    >
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 360, background: "linear-gradient(to bottom, rgba(7,7,8,0.9) 0%, transparent 100%)" }} />

      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 0, padding: "0 80px" }}>
        {GEM(180)}

        <span style={{ fontSize: 108, fontWeight: 700, letterSpacing: "-0.04em", color: "#FFFFFF", lineHeight: 0.95, marginTop: 48, textAlign: "center" }}>
          mourn it when it ends.
        </span>
        <span style={{ fontSize: 30, color: "rgba(255,255,255,0.55)", marginTop: 36, textAlign: "center" }}>
          start your first fix at
        </span>
        <span style={{ fontSize: 46, fontWeight: 700, color: "#5EEAD4", marginTop: 12 }}>
          hyperfix.app
        </span>
        <span style={{ fontSize: 22, color: "rgba(255,255,255,0.3)", marginTop: 20, fontFamily: "monospace", letterSpacing: "0.1em", textTransform: "uppercase" }}>
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
