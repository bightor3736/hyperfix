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

// Slide 1 — hook: "obsessed isn't strong enough"
function slide1() {
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
      {/* Gem */}
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "center",
        width: 120, height: 120,
        background: "rgba(94,234,212,0.08)",
        border: "1px solid rgba(94,234,212,0.2)",
        borderRadius: 999,
      }}>
        {GEM(72)}
      </div>

      {/* Hero copy */}
      <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
        <span style={{ fontSize: 148, fontWeight: 800, letterSpacing: "-0.05em", color: "#FFFFFF", lineHeight: 0.85 }}>
          obsessed
        </span>
        <span style={{ fontSize: 148, fontWeight: 800, letterSpacing: "-0.05em", color: "#FFFFFF", lineHeight: 0.85 }}>
          isn&apos;t strong
        </span>
        <span style={{ fontSize: 148, fontWeight: 800, letterSpacing: "-0.05em", color: "#5EEAD4", lineHeight: 0.85 }}>
          enough
        </span>
        <span style={{ fontSize: 148, fontWeight: 800, letterSpacing: "-0.05em", color: "#FFFFFF", lineHeight: 0.85 }}>
          of a word.
        </span>
      </div>

      {/* Footer */}
      <div style={{ display: "flex", flexDirection: "column", gap: 36 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
          <span style={{ fontSize: 32, color: "rgba(255,255,255,0.4)" }}>introducing</span>
          <span style={{ fontSize: 32, fontWeight: 700, color: "#FFFFFF" }}>hyperfix</span>
          <span style={{ fontSize: 32, color: "rgba(94,234,212,0.6)" }}>—</span>
          <span style={{ fontSize: 32, color: "rgba(255,255,255,0.4)" }}>the hyperfixation tracker</span>
        </div>
        <Dots current={0} total={5} />
      </div>
    </div>
  );
}

// Slide 2 — pov hook
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
      {/* Label */}
      <div style={{
        display: "flex", alignItems: "center",
        background: "rgba(94,234,212,0.08)",
        border: "1px solid rgba(94,234,212,0.2)",
        color: "#5EEAD4", fontSize: 26, fontWeight: 500,
        borderRadius: 999, padding: "12px 32px",
        fontFamily: "monospace", letterSpacing: "0.06em",
        textTransform: "uppercase", alignSelf: "flex-start",
      }}>
        pov
      </div>

      {/* Hero hook */}
      <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
        <span style={{ fontSize: 136, fontWeight: 800, letterSpacing: "-0.05em", color: "rgba(255,255,255,0.35)", lineHeight: 0.88 }}>
          you found
        </span>
        <span style={{ fontSize: 136, fontWeight: 800, letterSpacing: "-0.05em", color: "rgba(255,255,255,0.35)", lineHeight: 0.88 }}>
          your new
        </span>
        <span style={{ fontSize: 136, fontWeight: 800, letterSpacing: "-0.05em", color: "#FFFFFF", lineHeight: 0.88 }}>
          hyperfixation
        </span>
        <span style={{ fontSize: 136, fontWeight: 800, letterSpacing: "-0.05em", color: "#5EEAD4", lineHeight: 0.88 }}>
          at 2am.
        </span>
      </div>

      {/* Subtext + dots */}
      <div style={{ display: "flex", flexDirection: "column", gap: 36 }}>
        <span style={{ fontSize: 34, color: "rgba(255,255,255,0.4)", lineHeight: 1.55 }}>
          this is fine. this is totally fine.{"\n"}you definitely don&apos;t need to know everything about it.
        </span>
        <Dots current={1} total={5} />
      </div>
    </div>
  );
}

// Slide 3 — fix card: Espresso · Sabrina Carpenter
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
      {/* Category + song */}
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
        <span style={{ fontSize: 80, fontWeight: 700, letterSpacing: "-0.03em", color: "#FFFFFF", lineHeight: 1.0 }}>
          Espresso
        </span>
        <span style={{ fontSize: 44, fontWeight: 500, color: "rgba(255,255,255,0.45)", letterSpacing: "-0.01em" }}>
          Sabrina Carpenter
        </span>
      </div>

      {/* Day counter */}
      <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
        <span style={{ fontSize: 240, fontWeight: 800, letterSpacing: "-0.06em", color: "#5EEAD4", lineHeight: 0.85 }}>
          23
        </span>
        <span style={{ fontSize: 60, fontWeight: 600, letterSpacing: "-0.02em", color: "rgba(255,255,255,0.45)", lineHeight: 1 }}>
          days on repeat
        </span>
      </div>

      {/* Intensity + watermark + dots */}
      <div style={{ display: "flex", flexDirection: "column", gap: 36 }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div style={{ display: "flex", gap: 8 }}>
            {Array.from({ length: 10 }).map((_, i) => (
              <div key={i} style={{ flex: 1, height: 12, borderRadius: 6, background: i < 10 ? "#E63946" : "rgba(255,255,255,0.10)" }} />
            ))}
          </div>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <span style={{ fontSize: 22, color: "rgba(255,255,255,0.3)", fontFamily: "monospace", textTransform: "uppercase", letterSpacing: "0.1em" }}>
              intensity
            </span>
            <span style={{ fontSize: 30, fontWeight: 700, color: "#E63946" }}>10 / 10</span>
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <Dots current={2} total={5} />
          <span style={{ fontSize: 22, color: "rgba(255,255,255,0.25)", fontFamily: "monospace" }}>tracked on hyperfix</span>
        </div>
      </div>
    </div>
  );
}

// Slide 4 — "if any of these are you"
function slide4() {
  const signs = [
    "listened to one song 400+ times this week",
    "forced everyone around you to care about it",
    "know the entire wikipedia page by heart",
    "can't explain why you care this much",
    "already planning your next obsession",
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
        <span style={{ fontSize: 30, color: "#5EEAD4", fontFamily: "monospace", letterSpacing: "0.08em", textTransform: "uppercase" }}>
          signs you need this app
        </span>
        <span style={{ fontSize: 100, fontWeight: 800, letterSpacing: "-0.04em", color: "#FFFFFF", lineHeight: 0.88 }}>
          you&apos;ve{"\n"}done all{"\n"}of these.
        </span>
      </div>

      {/* List */}
      <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
        {signs.map((s, i) => (
          <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 24 }}>
            <span style={{ fontSize: 28, color: "#5EEAD4", fontFamily: "monospace", fontWeight: 700, marginTop: 4, flexShrink: 0 }}>
              {String(i + 1).padStart(2, "0")}
            </span>
            <span style={{ fontSize: 34, color: "rgba(255,255,255,0.75)", lineHeight: 1.35 }}>
              {s}
            </span>
          </div>
        ))}
      </div>

      {/* Dots */}
      <Dots current={3} total={5} />
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
        justifyContent: "space-between",
        background: "#070708",
        fontFamily: "sans-serif", color: "#F4F4F4",
        padding: "140px 96px 100px",
      }}
    >
      {/* Gem */}
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "center",
        width: 160, height: 160,
        background: "rgba(94,234,212,0.08)",
        border: "1px solid rgba(94,234,212,0.18)",
        borderRadius: 999,
      }}>
        {GEM(96)}
      </div>

      {/* Hero copy */}
      <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
        <span style={{ fontSize: 140, fontWeight: 800, letterSpacing: "-0.05em", color: "#FFFFFF", lineHeight: 0.85 }}>
          your
        </span>
        <span style={{ fontSize: 140, fontWeight: 800, letterSpacing: "-0.05em", color: "#FFFFFF", lineHeight: 0.85 }}>
          hyperfixation
        </span>
        <span style={{ fontSize: 140, fontWeight: 800, letterSpacing: "-0.05em", color: "#FFFFFF", lineHeight: 0.85 }}>
          era deserves
        </span>
        <span style={{ fontSize: 140, fontWeight: 800, letterSpacing: "-0.05em", color: "#5EEAD4", lineHeight: 0.85 }}>
          to be logged.
        </span>
      </div>

      {/* CTA + dots */}
      <div style={{ display: "flex", flexDirection: "column", gap: 36 }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <span style={{ fontSize: 52, fontWeight: 700, color: "#5EEAD4", letterSpacing: "-0.02em" }}>
            hyperfix.app
          </span>
          <span style={{ fontSize: 28, color: "rgba(255,255,255,0.35)" }}>
            free forever. no credit card. just obsessions.
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
