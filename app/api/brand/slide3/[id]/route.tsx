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
      <div style={{ display: "flex" }} />

      <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
        <div style={{
          display: "flex", alignItems: "center", alignSelf: "flex-start",
          background: "rgba(94,234,212,0.08)", border: "1px solid rgba(94,234,212,0.22)",
          color: "#5EEAD4", fontSize: 24, borderRadius: 999,
          padding: "12px 28px", fontFamily: "monospace",
          letterSpacing: "0.07em", textTransform: "uppercase",
        }}>
          you need to see this
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          <span style={{ fontSize: 118, fontWeight: 800, letterSpacing: "-0.05em", color: "#FFFFFF", lineHeight: 0.86 }}>
            signs
          </span>
          <span style={{ fontSize: 118, fontWeight: 800, letterSpacing: "-0.05em", color: "#FFFFFF", lineHeight: 0.86 }}>
            you&apos;re
          </span>
          <span style={{ fontSize: 118, fontWeight: 800, letterSpacing: "-0.05em", color: "#FFFFFF", lineHeight: 0.86 }}>
            actually
          </span>
          <span style={{ fontSize: 118, fontWeight: 800, letterSpacing: "-0.05em", color: "#5EEAD4", lineHeight: 0.86 }}>
            in one.
          </span>
        </div>

        <span style={{ fontSize: 40, color: "rgba(255,255,255,0.45)", letterSpacing: "-0.01em", lineHeight: 1.3 }}>
          (not just really liking something.)
        </span>
      </div>

      <Pill>hyperfix.app</Pill>
    </Safe>
  );
}

// Slide 2 — Signs 1–3
function slide2() {
  const signs = [
    { n: "01", text: "you looked it up once and now you have seventeen tabs open" },
    { n: "02", text: "you've started explaining it to people who did not ask" },
    { n: "03", text: "your sleep schedule has quietly reorganised around it" },
  ];

  return (
    <Safe current={1}>
      <div style={{ display: "flex" }} />

      <div style={{ display: "flex", flexDirection: "column", gap: 36 }}>
        <span style={{ fontSize: 28, color: "#5EEAD4", fontFamily: "monospace", letterSpacing: "0.09em", textTransform: "uppercase" }}>
          the early signs
        </span>

        <div style={{ display: "flex", flexDirection: "column", gap: 40 }}>
          {signs.map((s) => (
            <div key={s.n} style={{ display: "flex", gap: 28, alignItems: "flex-start" }}>
              <span style={{ fontSize: 26, color: "rgba(94,234,212,0.5)", fontFamily: "monospace", letterSpacing: "0.08em", minWidth: 48, paddingTop: 6 }}>
                {s.n}
              </span>
              <span style={{ fontSize: 50, fontWeight: 700, letterSpacing: "-0.025em", color: "#FFFFFF", lineHeight: 1.1 }}>
                {s.text}
              </span>
            </div>
          ))}
        </div>
      </div>

      <Pill>hyperfix.app</Pill>
    </Safe>
  );
}

// Slide 3 — Signs 4–6
function slide3() {
  const signs = [
    { n: "04", text: "you keep refreshing for new content even though nothing has changed" },
    { n: "05", text: "you've built a playlist. it has 47 songs. all of them are correct." },
    { n: "06", text: "you are comparing everything else unfavourably to it" },
  ];

  return (
    <Safe current={2}>
      <div style={{ display: "flex" }} />

      <div style={{ display: "flex", flexDirection: "column", gap: 36 }}>
        <span style={{ fontSize: 28, color: "#5EEAD4", fontFamily: "monospace", letterSpacing: "0.09em", textTransform: "uppercase" }}>
          getting worse
        </span>

        <div style={{ display: "flex", flexDirection: "column", gap: 40 }}>
          {signs.map((s) => (
            <div key={s.n} style={{ display: "flex", gap: 28, alignItems: "flex-start" }}>
              <span style={{ fontSize: 26, color: "rgba(94,234,212,0.5)", fontFamily: "monospace", letterSpacing: "0.08em", minWidth: 48, paddingTop: 6 }}>
                {s.n}
              </span>
              <span style={{ fontSize: 50, fontWeight: 700, letterSpacing: "-0.025em", color: "#FFFFFF", lineHeight: 1.1 }}>
                {s.text}
              </span>
            </div>
          ))}
        </div>
      </div>

      <Pill>hyperfix.app</Pill>
    </Safe>
  );
}

// Slide 4 — Signs 7–9
function slide4() {
  const signs = [
    { n: "07", text: "you've started to mourn it. it hasn't ended. you're mourning it anyway." },
    { n: "08", text: "you went down a wikipedia path that started at one thing and ended at 17th-century tax law" },
    { n: "09", text: "you have opinions on the fandom" },
  ];

  return (
    <Safe current={3}>
      <div style={{ display: "flex" }} />

      <div style={{ display: "flex", flexDirection: "column", gap: 36 }}>
        <span style={{ fontSize: 28, color: "#5EEAD4", fontFamily: "monospace", letterSpacing: "0.09em", textTransform: "uppercase" }}>
          fully unwell
        </span>

        <div style={{ display: "flex", flexDirection: "column", gap: 40 }}>
          {signs.map((s) => (
            <div key={s.n} style={{ display: "flex", gap: 28, alignItems: "flex-start" }}>
              <span style={{ fontSize: 26, color: "rgba(94,234,212,0.5)", fontFamily: "monospace", letterSpacing: "0.08em", minWidth: 48, paddingTop: 6 }}>
                {s.n}
              </span>
              <span style={{ fontSize: 50, fontWeight: 700, letterSpacing: "-0.025em", color: "#FFFFFF", lineHeight: 1.1 }}>
                {s.text}
              </span>
            </div>
          ))}
        </div>
      </div>

      <Pill>hyperfix.app</Pill>
    </Safe>
  );
}

// Slide 5 — Signs 10–12 (the final stage)
function slide5() {
  const signs = [
    { n: "10", text: "you've started logging how many days it's been" },
    { n: "11", text: "you are already grieving the end, and you're on day 12" },
    { n: "12", text: "you sent this slideshow to at least one person who understood immediately" },
  ];

  return (
    <Safe current={4}>
      <div style={{ display: "flex" }} />

      <div style={{ display: "flex", flexDirection: "column", gap: 36 }}>
        <span style={{ fontSize: 28, color: "#5EEAD4", fontFamily: "monospace", letterSpacing: "0.09em", textTransform: "uppercase" }}>
          the final stage
        </span>

        <div style={{ display: "flex", flexDirection: "column", gap: 40 }}>
          {signs.map((s) => (
            <div key={s.n} style={{ display: "flex", gap: 28, alignItems: "flex-start" }}>
              <span style={{ fontSize: 26, color: "rgba(94,234,212,0.5)", fontFamily: "monospace", letterSpacing: "0.08em", minWidth: 48, paddingTop: 6 }}>
                {s.n}
              </span>
              <span style={{ fontSize: 50, fontWeight: 700, letterSpacing: "-0.025em", color: "#FFFFFF", lineHeight: 1.1 }}>
                {s.text}
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
        <div style={{ display: "flex" }}>
          {GEM(80)}
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <span style={{ fontSize: 100, fontWeight: 800, letterSpacing: "-0.05em", color: "#FFFFFF", lineHeight: 0.86 }}>
            track it.
          </span>
          <span style={{ fontSize: 100, fontWeight: 800, letterSpacing: "-0.05em", color: "#FFFFFF", lineHeight: 0.86 }}>
            count the
          </span>
          <span style={{ fontSize: 100, fontWeight: 800, letterSpacing: "-0.05em", color: "#FFFFFF", lineHeight: 0.86 }}>
            days.
          </span>
          <span style={{ fontSize: 100, fontWeight: 800, letterSpacing: "-0.05em", color: "#5EEAD4", lineHeight: 0.86 }}>
            mourn it.
          </span>
        </div>

        <span style={{ fontSize: 38, color: "rgba(255,255,255,0.45)", letterSpacing: "-0.01em", lineHeight: 1.3 }}>
          a journal for your hyperfixations.{"\n"}because this is a normal thing to need.
        </span>

        <div style={{
          display: "flex", flexDirection: "column", gap: 4,
          background: "rgba(94,234,212,0.06)", border: "1px solid rgba(94,234,212,0.15)",
          borderRadius: 20, padding: "28px 36px",
        }}>
          <span style={{ fontSize: 30, color: "rgba(255,255,255,0.35)", fontFamily: "monospace", letterSpacing: "0.06em", textTransform: "uppercase" }}>
            free to use
          </span>
          <span style={{ fontSize: 52, fontWeight: 800, color: "#5EEAD4", letterSpacing: "-0.03em" }}>
            hyperfix.app
          </span>
        </div>
      </div>

      <Pill>link in bio</Pill>
    </Safe>
  );
}

const slides: Record<string, () => React.ReactElement> = {
  "1": slide1,
  "2": slide2,
  "3": slide3,
  "4": slide4,
  "5": slide5,
  "6": slide6,
};

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const render = slides[id];
  if (!render) return new Response("Not found", { status: 404 });

  return new ImageResponse(render(), {
    width: W,
    height: H,
  });
}
