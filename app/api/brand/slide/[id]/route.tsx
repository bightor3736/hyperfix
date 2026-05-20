import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";

export const runtime = "edge";

const W = 1920;
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

const CatTag = ({ label }: { label: string }) => (
  <div
    style={{
      display: "flex",
      alignItems: "center",
      background: "rgba(255,255,255,0.06)",
      border: "1px solid rgba(255,255,255,0.1)",
      color: "rgba(244,244,244,0.85)",
      fontSize: 28,
      fontWeight: 500,
      borderRadius: 14,
      padding: "14px 32px",
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
      bottom: 48,
      right: 64,
      display: "flex",
      alignItems: "center",
      gap: 12,
    }}
  >
    {GEM(32)}
    <span style={{ color: "rgba(255,255,255,0.35)", fontSize: 22, fontWeight: 500, fontFamily: "sans-serif" }}>
      hyperfix.app
    </span>
  </div>
);

const Dots = ({ current, total }: { current: number; total: number }) => (
  <div
    style={{
      position: "absolute",
      bottom: 56,
      left: 64,
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

// Slide 1 — Cover: gem left, wordmark right
function slide1() {
  return (
    <div
      style={{
        width: W, height: H, display: "flex", flexDirection: "row",
        position: "relative", fontFamily: "sans-serif", color: "#F4F4F4",
        background: "#070708", overflow: "hidden",
      }}
    >
      {/* Left half — teal bloom + gem */}
      <div style={{
        width: 880, height: H, display: "flex", alignItems: "center", justifyContent: "center",
        position: "relative", flexShrink: 0,
      }}>
        <div style={{
          position: "absolute", inset: 0,
          background: "radial-gradient(ellipse 100% 90% at 40% 55%, rgba(94,234,212,0.28) 0%, rgba(45,212,191,0.12) 35%, transparent 65%)",
        }} />
        {GEM(420)}
      </div>

      {/* Divider */}
      <div style={{ width: 1, alignSelf: "stretch", background: "rgba(255,255,255,0.06)", margin: "80px 0" }} />

      {/* Right half — text */}
      <div style={{
        flex: 1, display: "flex", flexDirection: "column", justifyContent: "center",
        padding: "0 100px",
      }}>
        <div style={{
          display: "flex", alignItems: "center",
          background: "rgba(94,234,212,0.10)", border: "1px solid rgba(94,234,212,0.28)",
          color: "#5EEAD4", fontSize: 20, fontWeight: 500, borderRadius: 999,
          padding: "10px 26px", fontFamily: "monospace", letterSpacing: "0.08em",
          textTransform: "uppercase", alignSelf: "flex-start", marginBottom: 40,
        }}>
          social · tracking app
        </div>

        <span style={{ fontSize: 110, fontWeight: 700, letterSpacing: "-0.04em", color: "#FFFFFF", lineHeight: 0.92 }}>
          hyperfix
        </span>
        <span style={{ fontSize: 28, color: "rgba(255,255,255,0.5)", marginTop: 28, letterSpacing: "0.12em", textTransform: "uppercase", fontFamily: "monospace" }}>
          track your obsessions
        </span>
        <span style={{ fontSize: 22, color: "rgba(255,255,255,0.3)", marginTop: 48, lineHeight: 1.6 }}>
          the app for people who get{"\n"}way too into things.
        </span>
      </div>

      <Dots current={0} total={5} />
      <Watermark />
    </div>
  );
}

// Slide 2 — Hook: big question, left-weighted
function slide2() {
  return (
    <div
      style={{
        width: W, height: H, display: "flex", flexDirection: "row",
        position: "relative", background: "#070708",
        fontFamily: "sans-serif", color: "#F4F4F4",
      }}
    >
      {/* Left — big text */}
      <div style={{
        flex: 1.1, display: "flex", flexDirection: "column", justifyContent: "center",
        padding: "0 96px",
      }}>
        <div style={{ width: 56, height: 5, background: "#5EEAD4", borderRadius: 999, marginBottom: 52 }} />
        <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
          <span style={{ fontSize: 128, fontWeight: 700, letterSpacing: "-0.045em", color: "#FFFFFF", lineHeight: 0.9 }}>
            what are
          </span>
          <span style={{ fontSize: 128, fontWeight: 700, letterSpacing: "-0.045em", color: "#5EEAD4", lineHeight: 0.9 }}>
            you obsessed
          </span>
          <span style={{ fontSize: 128, fontWeight: 700, letterSpacing: "-0.045em", color: "#FFFFFF", lineHeight: 0.9 }}>
            with?
          </span>
        </div>
      </div>

      {/* Right — subtext + glow */}
      <div style={{
        width: 560, display: "flex", flexDirection: "column", justifyContent: "center",
        padding: "0 64px 0 32px", position: "relative",
      }}>
        <div style={{
          position: "absolute", inset: 0,
          background: "radial-gradient(ellipse 80% 60% at 60% 50%, rgba(94,234,212,0.07) 0%, transparent 70%)",
        }} />
        <span style={{ fontSize: 32, color: "rgba(255,255,255,0.55)", lineHeight: 1.55 }}>
          a song on loop.{"\n"}a show you can&apos;t quit.{"\n"}a fic that has you.{"\n"}
        </span>
        <span style={{ fontSize: 32, color: "#5EEAD4", marginTop: 24, lineHeight: 1.55 }}>
          whatever it is.
        </span>
      </div>

      <Dots current={1} total={5} />
      <Watermark />
    </div>
  );
}

// Slide 3 — Fix card demo: card left, text right
function slide3() {
  return (
    <div
      style={{
        width: W, height: H, display: "flex", flexDirection: "row",
        alignItems: "center", position: "relative",
        background: "#070708", fontFamily: "sans-serif", color: "#F4F4F4",
      }}
    >
      {/* Glow behind card */}
      <div style={{
        position: "absolute", top: "50%", left: "38%",
        transform: "translate(-50%, -50%)",
        width: 700, height: 700,
        background: "radial-gradient(circle, rgba(94,234,212,0.07) 0%, transparent 70%)",
      }} />

      {/* Left — Fix card */}
      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "0 64px 0 80px" }}>
        <div style={{
          width: "100%", background: "#0F1011",
          border: "1px solid rgba(255,255,255,0.09)",
          borderRadius: 32, padding: "52px 56px",
          display: "flex", flexDirection: "column", gap: 0,
        }}>
          <div style={{ display: "flex", marginBottom: 24 }}>
            <div style={{
              background: "rgba(94,234,212,0.10)", border: "1px solid rgba(94,234,212,0.25)",
              color: "#5EEAD4", fontSize: 18, borderRadius: 999, padding: "7px 20px",
              fontFamily: "monospace", letterSpacing: "0.08em", textTransform: "uppercase",
              display: "flex", alignItems: "center",
            }}>
              song
            </div>
          </div>

          <span style={{ fontSize: 46, fontWeight: 600, color: "#FFFFFF", letterSpacing: "-0.025em", lineHeight: 1.1 }}>
            Brat · Charli XCX
          </span>

          <div style={{ display: "flex", alignItems: "baseline", gap: 14, marginTop: 36, marginBottom: 8 }}>
            <span style={{ fontSize: 100, fontWeight: 700, color: "#5EEAD4", letterSpacing: "-0.05em", lineHeight: 1 }}>
              47
            </span>
            <span style={{ fontSize: 32, color: "rgba(255,255,255,0.45)" }}>days</span>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 14, marginTop: 14 }}>
            <span style={{ fontSize: 18, color: "rgba(255,255,255,0.4)", fontFamily: "monospace", textTransform: "uppercase", letterSpacing: "0.1em" }}>
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
      </div>

      {/* Right — text */}
      <div style={{ width: 640, display: "flex", flexDirection: "column", justifyContent: "center", padding: "0 96px 0 32px" }}>
        <div style={{ width: 56, height: 5, background: "#5EEAD4", borderRadius: 999, marginBottom: 48 }} />
        <span style={{ fontSize: 64, fontWeight: 700, letterSpacing: "-0.03em", color: "#FFFFFF", lineHeight: 1 }}>
          log it.
        </span>
        <span style={{ fontSize: 64, fontWeight: 700, letterSpacing: "-0.03em", color: "#5EEAD4", lineHeight: 1, marginTop: 8 }}>
          watch the days
        </span>
        <span style={{ fontSize: 64, fontWeight: 700, letterSpacing: "-0.03em", color: "#FFFFFF", lineHeight: 1, marginTop: 8 }}>
          pile up.
        </span>
        <span style={{ fontSize: 26, color: "rgba(255,255,255,0.45)", marginTop: 40, lineHeight: 1.6 }}>
          set intensity. track duration.{"\n"}check in every day.
        </span>
      </div>

      <Dots current={2} total={5} />
      <Watermark />
    </div>
  );
}

// Slide 4 — Categories: headline left, tag wall right
function slide4() {
  const cats = ["song", "fanfic", "show", "film", "ship", "game", "book", "other"];
  return (
    <div
      style={{
        width: W, height: H, display: "flex", flexDirection: "row",
        alignItems: "center", position: "relative",
        background: "#070708", fontFamily: "sans-serif", color: "#F4F4F4",
      }}
    >
      {/* Left — headline */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", padding: "0 96px" }}>
        <span style={{ fontSize: 22, color: "rgba(255,255,255,0.35)", fontFamily: "monospace", letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: 28 }}>
          name it.
        </span>
        <span style={{ fontSize: 84, fontWeight: 700, letterSpacing: "-0.04em", color: "#FFFFFF", lineHeight: 0.92, marginBottom: 40 }}>
          whatever{"\n"}you&apos;re into.{"\n"}we track it.
        </span>
        <span style={{ fontSize: 24, color: "rgba(255,255,255,0.35)", lineHeight: 1.7 }}>
          pick a category. set the intensity.{"\n"}start the counter.
        </span>
      </div>

      {/* Divider */}
      <div style={{ width: 1, alignSelf: "stretch", background: "rgba(255,255,255,0.06)", margin: "80px 0" }} />

      {/* Right — tags */}
      <div style={{ width: 760, display: "flex", flexDirection: "column", justifyContent: "center", padding: "0 80px" }}>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 14 }}>
          {cats.map((c) => <CatTag key={c} label={c} />)}
        </div>
      </div>

      <Dots current={3} total={5} />
      <Watermark />
    </div>
  );
}

// Slide 5 — CTA: centered with gem + bloom
function slide5() {
  return (
    <div
      style={{
        width: W, height: H, display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center", position: "relative",
        background: "radial-gradient(ellipse 60% 120% at 50% 110%, #5EEAD4 0%, #2DD4BF 16%, #0E4F47 36%, #08231F 58%, #070708 78%)",
        fontFamily: "sans-serif", color: "#F4F4F4",
      }}
    >
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 400, background: "linear-gradient(to bottom, rgba(7,7,8,0.9) 0%, transparent 100%)" }} />

      <div style={{ display: "flex", flexDirection: "row", alignItems: "center", gap: 96, padding: "0 120px", zIndex: 1 }}>
        {GEM(220)}

        <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
          <span style={{ fontSize: 96, fontWeight: 700, letterSpacing: "-0.04em", color: "#FFFFFF", lineHeight: 0.92 }}>
            mourn it
          </span>
          <span style={{ fontSize: 96, fontWeight: 700, letterSpacing: "-0.04em", color: "#5EEAD4", lineHeight: 0.92 }}>
            when it ends.
          </span>

          <span style={{ fontSize: 26, color: "rgba(255,255,255,0.5)", marginTop: 40, lineHeight: 1.5 }}>
            start your first fix at
          </span>
          <span style={{ fontSize: 44, fontWeight: 700, color: "#5EEAD4", marginTop: 10 }}>
            hyperfix.app
          </span>
          <span style={{ fontSize: 20, color: "rgba(255,255,255,0.28)", marginTop: 18, fontFamily: "monospace", letterSpacing: "0.1em", textTransform: "uppercase" }}>
            free forever · no credit card
          </span>
        </div>
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
