import React from "react";
import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";

export const runtime = "edge";

const W = 1080;
const H = 1920;

// TikTok safe zone — UI overlays bottom ~450px and right ~130px
const PT = 180;  // top
const PB = 480;  // bottom (clears caption + buttons)
const PL = 80;   // left
const PR = 160;  // right (clears action buttons)

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

// Wrapper that enforces safe zone — all content goes inside this
function Safe({ children }: { children: React.ReactNode }) {
  return (
    <div style={{
      width: W, height: H,
      display: "flex", flexDirection: "column",
      background: "#070708", fontFamily: "sans-serif", color: "#F4F4F4",
      position: "relative",
    }}>
      {/* Safe zone content */}
      <div style={{
        position: "absolute",
        top: PT, left: PL,
        width: W - PL - PR,
        height: H - PT - PB,
        display: "flex", flexDirection: "column",
        justifyContent: "space-between",
      }}>
        {children}
      </div>
    </div>
  );
}

// Slide 1 — the hook
function slide1() {
  return (
    <Safe>
      {/* normal people */}
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        <span style={{ fontSize: 34, color: "rgba(255,255,255,0.28)", fontFamily: "monospace", letterSpacing: "0.04em" }}>
          normal people:
        </span>
        <span style={{ fontSize: 80, fontWeight: 800, letterSpacing: "-0.04em", color: "rgba(255,255,255,0.2)", lineHeight: 0.9 }}>
          &ldquo;i like this.&rdquo;
        </span>
      </div>

      {/* divider */}
      <div style={{ width: "100%", height: 1, background: "rgba(255,255,255,0.08)" }} />

      {/* me */}
      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        <span style={{ fontSize: 34, color: "#5EEAD4", fontFamily: "monospace", letterSpacing: "0.04em", marginBottom: 8 }}>
          me:
        </span>
        <span style={{ fontSize: 88, fontWeight: 800, letterSpacing: "-0.045em", color: "#FFFFFF", lineHeight: 0.88 }}>i have consumed</span>
        <span style={{ fontSize: 88, fontWeight: 800, letterSpacing: "-0.045em", color: "#FFFFFF", lineHeight: 0.88 }}>every piece</span>
        <span style={{ fontSize: 88, fontWeight: 800, letterSpacing: "-0.045em", color: "#FFFFFF", lineHeight: 0.88 }}>of media</span>
        <span style={{ fontSize: 88, fontWeight: 800, letterSpacing: "-0.045em", color: "#FFFFFF", lineHeight: 0.88 }}>related to this</span>
        <span style={{ fontSize: 88, fontWeight: 800, letterSpacing: "-0.045em", color: "#FFFFFF", lineHeight: 0.88 }}>and i&apos;m already</span>
        <span style={{ fontSize: 88, fontWeight: 800, letterSpacing: "-0.045em", color: "#5EEAD4", lineHeight: 0.88 }}>grieving it.</span>
      </div>

      {/* label */}
      <div style={{
        display: "flex", alignItems: "center", alignSelf: "flex-start",
        background: "rgba(94,234,212,0.08)", border: "1px solid rgba(94,234,212,0.2)",
        color: "#5EEAD4", fontSize: 22, fontWeight: 500, borderRadius: 999,
        padding: "10px 26px", fontFamily: "monospace", letterSpacing: "0.06em",
        textTransform: "uppercase",
      }}>
        hyperfix.app
      </div>
    </Safe>
  );
}

// Slide 2 — the spiral
function slide2() {
  const days = [
    { day: "day 1",  text: "this is interesting.", bright: false },
    { day: "day 3",  text: "i know everything about this.", bright: false },
    { day: "day 7",  text: "my entire personality now.", bright: true },
    { day: "day 14", text: "i can't explain why i'm crying.", bright: true },
  ];
  return (
    <Safe>
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <span style={{ fontSize: 24, color: "#5EEAD4", fontFamily: "monospace", letterSpacing: "0.06em", textTransform: "uppercase" }}>
          how it always goes
        </span>
        <span style={{ fontSize: 96, fontWeight: 800, letterSpacing: "-0.04em", color: "#FFFFFF", lineHeight: 0.9 }}>
          the spiral.
        </span>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 36 }}>
        {days.map((d, i) => (
          <div key={i} style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            <span style={{ fontSize: 22, color: "#5EEAD4", fontFamily: "monospace", letterSpacing: "0.08em", textTransform: "uppercase" }}>
              {d.day}
            </span>
            <span style={{
              fontSize: 48, fontWeight: 700, letterSpacing: "-0.025em", lineHeight: 1.1,
              color: d.bright ? "#FFFFFF" : "rgba(255,255,255,0.3)",
            }}>
              {d.text}
            </span>
          </div>
        ))}
      </div>

      <div style={{
        display: "flex", alignItems: "center", alignSelf: "flex-start",
        background: "rgba(94,234,212,0.08)", border: "1px solid rgba(94,234,212,0.2)",
        color: "#5EEAD4", fontSize: 22, fontWeight: 500, borderRadius: 999,
        padding: "10px 26px", fontFamily: "monospace", letterSpacing: "0.06em",
        textTransform: "uppercase",
      }}>
        hyperfix.app
      </div>
    </Safe>
  );
}

// Slide 3 — Liability · Lorde
function slide3() {
  return (
    <Safe>
      <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
        <div style={{
          display: "flex", alignItems: "center",
          background: "rgba(94,234,212,0.10)", border: "1px solid rgba(94,234,212,0.25)",
          color: "#5EEAD4", fontSize: 22, borderRadius: 999,
          padding: "10px 28px", fontFamily: "monospace",
          letterSpacing: "0.1em", textTransform: "uppercase", alignSelf: "flex-start",
        }}>
          song
        </div>
        <span style={{ fontSize: 96, fontWeight: 700, letterSpacing: "-0.035em", color: "#FFFFFF", lineHeight: 0.95 }}>
          Liability
        </span>
        <span style={{ fontSize: 44, fontWeight: 500, color: "rgba(255,255,255,0.4)" }}>
          Lorde
        </span>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        <span style={{ fontSize: 200, fontWeight: 800, letterSpacing: "-0.06em", color: "#5EEAD4", lineHeight: 0.85 }}>
          52
        </span>
        <span style={{ fontSize: 52, fontWeight: 600, letterSpacing: "-0.02em", color: "rgba(255,255,255,0.4)" }}>
          days. still in it.
        </span>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <div style={{ display: "flex", gap: 7 }}>
          {Array.from({ length: 10 }).map((_, i) => (
            <div key={i} style={{ flex: 1, height: 10, borderRadius: 6, background: i < 9 ? "#E63946" : "rgba(255,255,255,0.10)" }} />
          ))}
        </div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <span style={{ fontSize: 20, color: "rgba(255,255,255,0.3)", fontFamily: "monospace", textTransform: "uppercase", letterSpacing: "0.1em" }}>
            intensity
          </span>
          <span style={{ fontSize: 28, fontWeight: 700, color: "#E63946" }}>9 / 10</span>
        </div>
      </div>
    </Safe>
  );
}

// Slide 4 — "one day you'll open this app"
function slide4() {
  return (
    <Safe>
      <div style={{ width: 64, height: 5, background: "#5EEAD4", borderRadius: 999 }} />

      <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
        <span style={{ fontSize: 118, fontWeight: 800, letterSpacing: "-0.05em", color: "rgba(255,255,255,0.2)", lineHeight: 0.87 }}>one day</span>
        <span style={{ fontSize: 118, fontWeight: 800, letterSpacing: "-0.05em", color: "rgba(255,255,255,0.2)", lineHeight: 0.87 }}>you&apos;ll open</span>
        <span style={{ fontSize: 118, fontWeight: 800, letterSpacing: "-0.05em", color: "rgba(255,255,255,0.2)", lineHeight: 0.87 }}>this app</span>
        <span style={{ fontSize: 118, fontWeight: 800, letterSpacing: "-0.05em", color: "#FFFFFF", lineHeight: 0.87 }}>and see</span>
        <span style={{ fontSize: 118, fontWeight: 800, letterSpacing: "-0.05em", color: "#FFFFFF", lineHeight: 0.87 }}>who you</span>
        <span style={{ fontSize: 118, fontWeight: 800, letterSpacing: "-0.05em", color: "#5EEAD4", lineHeight: 0.87 }}>used to be.</span>
      </div>

      <div style={{
        display: "flex", alignItems: "center", alignSelf: "flex-start",
        background: "rgba(94,234,212,0.08)", border: "1px solid rgba(94,234,212,0.2)",
        color: "#5EEAD4", fontSize: 22, fontWeight: 500, borderRadius: 999,
        padding: "10px 26px", fontFamily: "monospace", letterSpacing: "0.06em",
        textTransform: "uppercase",
      }}>
        hyperfix.app
      </div>
    </Safe>
  );
}

// Slide 5 — CTA
function slide5() {
  return (
    <Safe>
      <div style={{
        display: "flex", alignItems: "center", alignSelf: "flex-start",
        background: "rgba(94,234,212,0.08)", border: "1px solid rgba(94,234,212,0.2)",
        color: "#5EEAD4", fontSize: 22, fontWeight: 500, borderRadius: 999,
        padding: "10px 26px", fontFamily: "monospace", letterSpacing: "0.06em",
        textTransform: "uppercase",
      }}>
        free forever
      </div>

      <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "center",
          width: 240, height: 240,
          background: "radial-gradient(ellipse 100% 100% at 50% 50%, rgba(94,234,212,0.16) 0%, transparent 70%)",
          border: "1px solid rgba(94,234,212,0.14)", borderRadius: 999,
        }}>
          {GEM(150)}
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
        <span style={{ fontSize: 130, fontWeight: 800, letterSpacing: "-0.05em", color: "#FFFFFF", lineHeight: 0.85 }}>tap the</span>
        <span style={{ fontSize: 130, fontWeight: 800, letterSpacing: "-0.05em", color: "#FFFFFF", lineHeight: 0.85 }}>link.</span>
        <span style={{ fontSize: 130, fontWeight: 800, letterSpacing: "-0.05em", color: "#5EEAD4", lineHeight: 0.85 }}>start your</span>
        <span style={{ fontSize: 130, fontWeight: 800, letterSpacing: "-0.05em", color: "#5EEAD4", lineHeight: 0.85 }}>first fix.</span>
      </div>

      <div style={{
        display: "flex", flexDirection: "column", gap: 0,
        background: "rgba(94,234,212,0.06)", border: "1px solid rgba(94,234,212,0.15)",
        borderRadius: 20, padding: "24px 32px",
      }}>
        <span style={{ fontSize: 20, color: "rgba(255,255,255,0.3)", fontFamily: "monospace", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 6 }}>
          link in bio
        </span>
        <span style={{ fontSize: 52, fontWeight: 700, color: "#5EEAD4", letterSpacing: "-0.02em" }}>
          hyperfix.app
        </span>
        <span style={{ fontSize: 24, color: "rgba(255,255,255,0.25)", marginTop: 6 }}>
          no credit card. no catch. just obsessions.
        </span>
      </div>
    </Safe>
  );
}

const slides: Record<string, () => React.ReactElement> = {
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
