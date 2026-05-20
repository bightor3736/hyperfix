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
      <div key={i} style={{
        width: i === current ? 32 : 10,
        height: 10, borderRadius: 999,
        background: i === current ? "#5EEAD4" : "rgba(255,255,255,0.18)",
      }} />
    ))}
  </div>
);

// Slide 1 — "it started with one listen"
function slide1() {
  return (
    <div style={{
      width: W, height: H, display: "flex", flexDirection: "column",
      justifyContent: "space-between", background: "#070708",
      fontFamily: "sans-serif", color: "#F4F4F4", padding: "140px 96px 100px",
    }}>
      <div style={{
        display: "flex", alignItems: "center",
        background: "rgba(94,234,212,0.08)", border: "1px solid rgba(94,234,212,0.2)",
        color: "#5EEAD4", fontSize: 26, fontWeight: 500, borderRadius: 999,
        padding: "12px 32px", fontFamily: "monospace", letterSpacing: "0.06em",
        textTransform: "uppercase", alignSelf: "flex-start",
      }}>
        hyperfix
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
        <span style={{ fontSize: 160, fontWeight: 800, letterSpacing: "-0.05em", color: "#FFFFFF", lineHeight: 0.85 }}>
          it started
        </span>
        <span style={{ fontSize: 160, fontWeight: 800, letterSpacing: "-0.05em", color: "#FFFFFF", lineHeight: 0.85 }}>
          with one
        </span>
        <span style={{ fontSize: 160, fontWeight: 800, letterSpacing: "-0.05em", color: "#5EEAD4", lineHeight: 0.85 }}>
          listen.
        </span>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 36 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <div style={{ width: 48, height: 3, background: "rgba(94,234,212,0.4)", borderRadius: 999 }} />
          <span style={{ fontSize: 32, color: "rgba(255,255,255,0.35)" }}>
            the app for hyperfixations
          </span>
        </div>
        <Dots current={0} total={5} />
      </div>
    </div>
  );
}

// Slide 2 — roman empire hook
function slide2() {
  return (
    <div style={{
      width: W, height: H, display: "flex", flexDirection: "column",
      justifyContent: "space-between", background: "#070708",
      fontFamily: "sans-serif", color: "#F4F4F4", padding: "140px 96px 100px",
    }}>
      <span style={{ fontSize: 32, color: "rgba(255,255,255,0.3)", fontFamily: "monospace", letterSpacing: "0.06em", textTransform: "uppercase" }}>
        how often do you think about it?
      </span>

      <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
        <span style={{ fontSize: 130, fontWeight: 800, letterSpacing: "-0.048em", color: "rgba(255,255,255,0.3)", lineHeight: 0.87 }}>
          my roman
        </span>
        <span style={{ fontSize: 130, fontWeight: 800, letterSpacing: "-0.048em", color: "rgba(255,255,255,0.3)", lineHeight: 0.87 }}>
          empire
        </span>
        <span style={{ fontSize: 130, fontWeight: 800, letterSpacing: "-0.048em", color: "rgba(255,255,255,0.3)", lineHeight: 0.87 }}>
          changes
        </span>
        <span style={{ fontSize: 130, fontWeight: 800, letterSpacing: "-0.048em", color: "#FFFFFF", lineHeight: 0.87 }}>
          every
        </span>
        <span style={{ fontSize: 130, fontWeight: 800, letterSpacing: "-0.048em", color: "#5EEAD4", lineHeight: 0.87 }}>
          3 weeks.
        </span>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 36 }}>
        <span style={{ fontSize: 34, color: "rgba(255,255,255,0.4)", lineHeight: 1.5 }}>
          and i need to document all of them.
        </span>
        <Dots current={1} total={5} />
      </div>
    </div>
  );
}

// Slide 3 — Cruel Summer · Taylor Swift
function slide3() {
  return (
    <div style={{
      width: W, height: H, display: "flex", flexDirection: "column",
      justifyContent: "space-between", background: "#070708",
      fontFamily: "sans-serif", color: "#F4F4F4", padding: "140px 96px 100px",
    }}>
      <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
        <div style={{
          display: "flex", alignItems: "center",
          background: "rgba(94,234,212,0.10)", border: "1px solid rgba(94,234,212,0.25)",
          color: "#5EEAD4", fontSize: 24, borderRadius: 999,
          padding: "12px 32px", fontFamily: "monospace",
          letterSpacing: "0.1em", textTransform: "uppercase", alignSelf: "flex-start",
        }}>
          song
        </div>
        <span style={{ fontSize: 96, fontWeight: 700, letterSpacing: "-0.035em", color: "#FFFFFF", lineHeight: 0.95 }}>
          Cruel Summer
        </span>
        <span style={{ fontSize: 48, fontWeight: 500, color: "rgba(255,255,255,0.4)", letterSpacing: "-0.01em" }}>
          Taylor Swift
        </span>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        <span style={{ fontSize: 200, fontWeight: 800, letterSpacing: "-0.06em", color: "#5EEAD4", lineHeight: 0.85 }}>
          47
        </span>
        <span style={{ fontSize: 60, fontWeight: 600, letterSpacing: "-0.02em", color: "rgba(255,255,255,0.4)", lineHeight: 1 }}>
          days obsessed
        </span>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 36 }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <div style={{ display: "flex", gap: 8 }}>
            {Array.from({ length: 10 }).map((_, i) => (
              <div key={i} style={{ flex: 1, height: 12, borderRadius: 6, background: i < 10 ? "#E63946" : "rgba(255,255,255,0.10)" }} />
            ))}
          </div>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <span style={{ fontSize: 22, color: "rgba(255,255,255,0.3)", fontFamily: "monospace", textTransform: "uppercase", letterSpacing: "0.1em" }}>intensity</span>
            <span style={{ fontSize: 30, fontWeight: 700, color: "#E63946" }}>10 / 10</span>
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <Dots current={2} total={5} />
          <span style={{ fontSize: 22, color: "rgba(255,255,255,0.22)", fontFamily: "monospace" }}>tracked on hyperfix</span>
        </div>
      </div>
    </div>
  );
}

// Slide 4 — "you know you're hyperfixated when"
function slide4() {
  const signs = [
    "you've listened to one song more than you've slept",
    "you explained the whole lore to someone who didn't ask",
    "you made a playlist, a tier list, and a google doc",
    "you're already grieving it and it's not even over",
  ];
  return (
    <div style={{
      width: W, height: H, display: "flex", flexDirection: "column",
      justifyContent: "space-between", background: "#070708",
      fontFamily: "sans-serif", color: "#F4F4F4", padding: "140px 96px 100px",
    }}>
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        <span style={{ fontSize: 30, color: "#5EEAD4", fontFamily: "monospace", letterSpacing: "0.06em", textTransform: "uppercase" }}>
          you know you&apos;re hyperfixated when
        </span>
        <span style={{ fontSize: 108, fontWeight: 800, letterSpacing: "-0.04em", color: "#FFFFFF", lineHeight: 0.88 }}>
          all of{"\n"}these{"\n"}are true.
        </span>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
        {signs.map((s, i) => (
          <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 28 }}>
            <span style={{ fontSize: 26, color: "#5EEAD4", fontFamily: "monospace", fontWeight: 700, marginTop: 6, flexShrink: 0 }}>
              {String(i + 1).padStart(2, "0")}
            </span>
            <span style={{ fontSize: 36, color: "rgba(255,255,255,0.7)", lineHeight: 1.35 }}>{s}</span>
          </div>
        ))}
      </div>

      <Dots current={3} total={5} />
    </div>
  );
}

// Slide 5 — CTA
function slide5() {
  return (
    <div style={{
      width: W, height: H, display: "flex", flexDirection: "column",
      justifyContent: "space-between", background: "#070708",
      fontFamily: "sans-serif", color: "#F4F4F4", padding: "140px 96px 100px",
    }}>
      <div style={{
        display: "flex", alignItems: "center",
        background: "rgba(94,234,212,0.08)", border: "1px solid rgba(94,234,212,0.2)",
        color: "#5EEAD4", fontSize: 26, fontWeight: 500, borderRadius: 999,
        padding: "12px 32px", fontFamily: "monospace", letterSpacing: "0.06em",
        textTransform: "uppercase", alignSelf: "flex-start",
      }}>
        free forever
      </div>

      <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "center",
          width: 280, height: 280,
          background: "radial-gradient(ellipse 100% 100% at 50% 50%, rgba(94,234,212,0.16) 0%, rgba(45,212,191,0.04) 55%, transparent 75%)",
          border: "1px solid rgba(94,234,212,0.14)", borderRadius: 999,
        }}>
          {GEM(180)}
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
        <span style={{ fontSize: 148, fontWeight: 800, letterSpacing: "-0.05em", color: "#FFFFFF", lineHeight: 0.85 }}>
          tap the
        </span>
        <span style={{ fontSize: 148, fontWeight: 800, letterSpacing: "-0.05em", color: "#FFFFFF", lineHeight: 0.85 }}>
          link.
        </span>
        <span style={{ fontSize: 148, fontWeight: 800, letterSpacing: "-0.05em", color: "#5EEAD4", lineHeight: 0.85 }}>
          start your
        </span>
        <span style={{ fontSize: 148, fontWeight: 800, letterSpacing: "-0.05em", color: "#5EEAD4", lineHeight: 0.85 }}>
          first fix.
        </span>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>
        <div style={{
          display: "flex", flexDirection: "column", gap: 0,
          background: "rgba(94,234,212,0.06)", border: "1px solid rgba(94,234,212,0.15)",
          borderRadius: 24, padding: "28px 40px",
        }}>
          <span style={{ fontSize: 22, color: "rgba(255,255,255,0.3)", fontFamily: "monospace", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 8 }}>
            link in bio
          </span>
          <span style={{ fontSize: 58, fontWeight: 700, color: "#5EEAD4", letterSpacing: "-0.02em" }}>
            hyperfix.app
          </span>
          <span style={{ fontSize: 26, color: "rgba(255,255,255,0.25)", marginTop: 8 }}>
            no credit card. no catch. just obsessions.
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
