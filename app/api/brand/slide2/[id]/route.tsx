import React from "react";
import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";

export const runtime = "edge";

const W = 1080;
const H = 1920;

const PT = 180;
const PB = 480;
const PL = 80;
const PR = 160;

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

function Pill({ children }: { children: React.ReactNode }) {
  return (
    <div style={{
      display: "flex", alignItems: "center", alignSelf: "flex-start",
      background: "rgba(94,234,212,0.08)", border: "1px solid rgba(94,234,212,0.22)",
      color: "#5EEAD4", fontSize: 22, borderRadius: 999,
      padding: "10px 26px", fontFamily: "monospace",
      letterSpacing: "0.07em", textTransform: "uppercase",
    }}>
      {children}
    </div>
  );
}

function Dots({ current, total }: { current: number; total: number }) {
  return (
    <div style={{ display: "flex", gap: 10 }}>
      {Array.from({ length: total }).map((_, i) => (
        <div key={i} style={{
          width: i === current ? 36 : 10, height: 10, borderRadius: 999,
          background: i === current ? "#5EEAD4" : "rgba(255,255,255,0.18)",
          transition: "width 0.3s",
        }} />
      ))}
    </div>
  );
}

function Safe({ children, current }: { children: React.ReactNode; current: number }) {
  return (
    <div style={{
      width: W, height: H,
      display: "flex", flexDirection: "column",
      background: "#070708", fontFamily: "sans-serif", color: "#F4F4F4",
      position: "relative",
    }}>
      <div style={{
        position: "absolute",
        top: PT, left: PL,
        width: W - PL - PR,
        height: H - PT - PB,
        display: "flex", flexDirection: "column",
        justifyContent: "space-between",
      }}>
        <Dots current={current} total={6} />
        {children}
      </div>
    </div>
  );
}

// Slide 1 — Hook
function slide1() {
  return (
    <Safe current={0}>
      {/* top spacer */}
      <div style={{ display: "flex" }} />

      <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
        <div style={{
          display: "flex", alignItems: "center", alignSelf: "flex-start",
          background: "rgba(94,234,212,0.08)", border: "1px solid rgba(94,234,212,0.22)",
          color: "#5EEAD4", fontSize: 24, borderRadius: 999,
          padding: "12px 28px", fontFamily: "monospace",
          letterSpacing: "0.07em", textTransform: "uppercase",
        }}>
          current hyperfixation
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
          <span style={{ fontSize: 148, fontWeight: 800, letterSpacing: "-0.055em", color: "#FFFFFF", lineHeight: 0.84 }}>
            damage
          </span>
          <span style={{ fontSize: 148, fontWeight: 800, letterSpacing: "-0.055em", color: "#5EEAD4", lineHeight: 0.84 }}>
            report.
          </span>
        </div>

        <span style={{ fontSize: 38, color: "rgba(255,255,255,0.45)", letterSpacing: "-0.01em", lineHeight: 1.3 }}>
          a full breakdown of what this one did to me.
        </span>
      </div>

      <Pill>hyperfix.app</Pill>
    </Safe>
  );
}

// Slide 2 — Time consumed
function slide2() {
  return (
    <Safe current={1}>
      <div style={{ display: "flex" }} />

      <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>
        <span style={{ fontSize: 28, color: "#5EEAD4", fontFamily: "monospace", letterSpacing: "0.09em", textTransform: "uppercase" }}>
          category: time lost
        </span>

        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <span style={{ fontSize: 52, fontWeight: 700, letterSpacing: "-0.025em", color: "rgba(255,255,255,0.35)", lineHeight: 1.1 }}>
            hours consumed this week:
          </span>
          <span style={{ fontSize: 200, fontWeight: 800, letterSpacing: "-0.07em", color: "#FFFFFF", lineHeight: 0.82 }}>
            idk
          </span>
          <span style={{ fontSize: 44, color: "rgba(255,255,255,0.3)", letterSpacing: "-0.01em" }}>
            (definitely more than i&apos;ve slept)
          </span>
        </div>

        <div style={{
          display: "flex", flexDirection: "column", gap: 4,
          background: "rgba(94,234,212,0.06)", border: "1px solid rgba(94,234,212,0.12)",
          borderRadius: 20, padding: "24px 32px",
        }}>
          <span style={{ fontSize: 28, color: "rgba(255,255,255,0.3)", fontFamily: "monospace", letterSpacing: "0.06em", textTransform: "uppercase" }}>
            status
          </span>
          <span style={{ fontSize: 44, fontWeight: 700, color: "#5EEAD4", letterSpacing: "-0.02em" }}>
            not normal about this
          </span>
        </div>
      </div>

      <Pill>hyperfix.app</Pill>
    </Safe>
  );
}

// Slide 3 — Emotional status
function slide3() {
  return (
    <Safe current={2}>
      <div style={{ display: "flex" }} />

      <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>
        <span style={{ fontSize: 28, color: "#5EEAD4", fontFamily: "monospace", letterSpacing: "0.09em", textTransform: "uppercase" }}>
          category: emotional state
        </span>

        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <span style={{ fontSize: 54, fontWeight: 700, letterSpacing: "-0.025em", color: "rgba(255,255,255,0.35)", lineHeight: 1.05 }}>
            current status:
          </span>
          <span style={{ fontSize: 90, fontWeight: 800, letterSpacing: "-0.04em", color: "#FFFFFF", lineHeight: 0.88 }}>
            i have
          </span>
          <span style={{ fontSize: 90, fontWeight: 800, letterSpacing: "-0.04em", color: "#FFFFFF", lineHeight: 0.88 }}>
            parasocial
          </span>
          <span style={{ fontSize: 90, fontWeight: 800, letterSpacing: "-0.04em", color: "#FFFFFF", lineHeight: 0.88 }}>
            feelings i&apos;m not
          </span>
          <span style={{ fontSize: 90, fontWeight: 800, letterSpacing: "-0.04em", color: "#5EEAD4", lineHeight: 0.88 }}>
            ready to
          </span>
          <span style={{ fontSize: 90, fontWeight: 800, letterSpacing: "-0.04em", color: "#5EEAD4", lineHeight: 0.88 }}>
            discuss.
          </span>
        </div>

        <span style={{ fontSize: 34, color: "rgba(255,255,255,0.25)", letterSpacing: "-0.01em" }}>
          send help. or don&apos;t. i&apos;m fine.
        </span>
      </div>

      <Pill>hyperfix.app</Pill>
    </Safe>
  );
}

// Slide 4 — Collateral damage
function slide4() {
  const items = [
    "a dedicated playlist",
    "three tasks that needed doing",
    "one very concerning wikipedia spiral",
    "an opinion on everything related to it",
    "feelings",
  ];

  return (
    <Safe current={3}>
      <div style={{ display: "flex" }} />

      <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>
        <span style={{ fontSize: 28, color: "#5EEAD4", fontFamily: "monospace", letterSpacing: "0.09em", textTransform: "uppercase" }}>
          category: collateral damage
        </span>

        <span style={{ fontSize: 96, fontWeight: 800, letterSpacing: "-0.045em", color: "#FFFFFF", lineHeight: 0.88 }}>
          what it
          {"\n"}took from
          {"\n"}me:
        </span>

        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          {items.map((item, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 20 }}>
              <span style={{ fontSize: 28, color: "#5EEAD4", fontFamily: "monospace" }}>—</span>
              <span style={{ fontSize: 36, color: i < 3 ? "rgba(255,255,255,0.85)" : "rgba(255,255,255,0.4)", letterSpacing: "-0.01em", lineHeight: 1.2 }}>
                {item}
              </span>
            </div>
          ))}
        </div>
      </div>

      <Pill>hyperfix.app</Pill>
    </Safe>
  );
}

// Slide 5 — The timeline
function slide5() {
  const days = [
    { label: "day 1",  text: "this seems interesting",       dim: true },
    { label: "day 3",  text: "okay i'm a little obsessed",   dim: true },
    { label: "day 9",  text: "this is all i think about",    dim: false },
    { label: "day 21", text: "i'm already grieving it",      dim: false },
  ];

  return (
    <Safe current={4}>
      <div style={{ display: "flex" }} />

      <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>
        <span style={{ fontSize: 28, color: "#5EEAD4", fontFamily: "monospace", letterSpacing: "0.09em", textTransform: "uppercase" }}>
          category: timeline
        </span>

        <span style={{ fontSize: 96, fontWeight: 800, letterSpacing: "-0.045em", color: "#FFFFFF", lineHeight: 0.88 }}>
          how it
          {"\n"}always
          {"\n"}goes:
        </span>

        <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
          {days.map((d, i) => (
            <div key={i} style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              <span style={{ fontSize: 22, color: "#5EEAD4", fontFamily: "monospace", letterSpacing: "0.1em", textTransform: "uppercase" }}>
                {d.label}
              </span>
              <span style={{
                fontSize: 50, fontWeight: 700, letterSpacing: "-0.025em", lineHeight: 1.1,
                color: d.dim ? "rgba(255,255,255,0.28)" : "#FFFFFF",
              }}>
                {d.text}
              </span>
            </div>
          ))}
        </div>
      </div>

      <Pill>hyperfix.app</Pill>
    </Safe>
  );
}

// Slide 6 — CTA
function slide6() {
  return (
    <Safe current={5}>
      <div style={{ display: "flex" }} />

      <div style={{ display: "flex", flexDirection: "column", gap: 40 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{
            display: "flex", alignItems: "center", justifyContent: "center",
            width: 220, height: 220,
            background: "radial-gradient(ellipse 100% 100% at 50% 50%, rgba(94,234,212,0.14) 0%, transparent 70%)",
            border: "1px solid rgba(94,234,212,0.12)", borderRadius: 999,
          }}>
            {GEM(136)}
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
          <span style={{ fontSize: 116, fontWeight: 800, letterSpacing: "-0.05em", color: "#FFFFFF", lineHeight: 0.85 }}>log it.</span>
          <span style={{ fontSize: 116, fontWeight: 800, letterSpacing: "-0.05em", color: "#FFFFFF", lineHeight: 0.85 }}>count the</span>
          <span style={{ fontSize: 116, fontWeight: 800, letterSpacing: "-0.05em", color: "#FFFFFF", lineHeight: 0.85 }}>days.</span>
          <span style={{ fontSize: 116, fontWeight: 800, letterSpacing: "-0.05em", color: "#5EEAD4", lineHeight: 0.85 }}>mourn it.</span>
        </div>

        <div style={{
          display: "flex", flexDirection: "column", gap: 4,
          background: "rgba(94,234,212,0.06)", border: "1px solid rgba(94,234,212,0.15)",
          borderRadius: 20, padding: "22px 32px",
        }}>
          <span style={{ fontSize: 20, color: "rgba(255,255,255,0.3)", fontFamily: "monospace", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 4 }}>
            link in bio
          </span>
          <span style={{ fontSize: 52, fontWeight: 700, color: "#5EEAD4", letterSpacing: "-0.02em" }}>
            hyperfix.app
          </span>
          <span style={{ fontSize: 24, color: "rgba(255,255,255,0.22)", marginTop: 4 }}>
            free forever. no credit card.
          </span>
        </div>
      </div>

      <div style={{ display: "flex" }} />
    </Safe>
  );
}

const slides: Record<string, () => React.ReactElement> = {
  "1": slide1, "2": slide2, "3": slide3,
  "4": slide4, "5": slide5, "6": slide6,
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
