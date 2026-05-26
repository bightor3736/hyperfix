import React from "react";
import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";

export const runtime = "edge";

const W = 1080;
const H = 1920;
const INK      = "#070708";
const PAPER    = "#F4F4F4";
const TEAL     = "#5EEAD4";
const DIM      = "rgba(244,244,244,0.35)";
const DIMMER   = "rgba(244,244,244,0.12)";
const HAIRLINE = "rgba(244,244,244,0.07)";

function Logo() {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
      <svg width="40" height="40" viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
        <rect width="64" height="64" rx="12" fill="#0F1011" />
        <path d="M14 40 L32 20 L50 40 L42 40 L32 28 L22 40 Z" fill={TEAL} />
        <path d="M14 50 L32 30 L50 50 L42 50 L32 38 L22 50 Z" fill="#2DD4BF" opacity="0.7" />
      </svg>
      <span style={{ fontSize: 28, fontWeight: 800, letterSpacing: "-0.04em", color: PAPER }}>Hyperfix</span>
    </div>
  );
}

function Frame({
  n,
  children,
  accent,
}: {
  n: number;
  children: React.ReactNode;
  accent?: string;
}) {
  return (
    <div style={{
      width: W, height: H,
      background: INK,
      display: "flex",
      flexDirection: "column",
      padding: "100px 88px 120px",
      position: "relative",
      fontFamily: "sans-serif",
    }}>
      {/* top bar */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 80 }}>
        <Logo />
        <span style={{ fontSize: 22, fontWeight: 700, color: DIM, letterSpacing: "0.08em", fontFamily: "monospace" }}>
          {n} / 7
        </span>
      </div>

      <div style={{ display: "flex", flexDirection: "column", flex: 1 }}>
        {children}
      </div>

      {/* bottom */}
      <div style={{ display: "flex", flexDirection: "column", gap: 16, marginTop: 60 }}>
        <div style={{ height: 1, background: HAIRLINE }} />
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ fontSize: 20, color: DIM, fontFamily: "monospace", letterSpacing: "0.06em", textTransform: "uppercase" }}>
            wednesday addams · show
          </span>
          <div style={{
            display: "flex", alignItems: "center",
            background: `${TEAL}15`,
            border: `1px solid ${TEAL}30`,
            borderRadius: 999,
            padding: "8px 20px",
          }}>
            <span style={{ fontSize: 18, color: TEAL, fontFamily: "monospace", letterSpacing: "0.06em", textTransform: "uppercase" }}>
              hyperfix.app
            </span>
          </div>
        </div>
      </div>

      {accent && (
        <div style={{
          position: "absolute",
          top: -200,
          right: -200,
          width: 700,
          height: 700,
          borderRadius: "50%",
          background: `radial-gradient(ellipse, ${accent}14 0%, transparent 65%)`,
          pointerEvents: "none",
        }} />
      )}
    </div>
  );
}

function s1() {
  return (
    <Frame n={1} accent={TEAL}>
      <div style={{ display: "flex", flexDirection: "column", flex: 1, justifyContent: "center", gap: 0 }}>
        <span style={{ fontSize: 30, color: TEAL, fontFamily: "monospace", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 36 }}>
          your hyperfix
        </span>
        <span style={{ fontSize: 148, fontWeight: 800, letterSpacing: "-0.055em", lineHeight: 0.87, color: PAPER }}>in</span>
        <span style={{ fontSize: 148, fontWeight: 800, letterSpacing: "-0.055em", lineHeight: 0.87, color: TEAL }}>numbers.</span>
        <div style={{ display: "flex", marginTop: 80, gap: 16, flexWrap: "wrap" }}>
          {["days", "tabs", "hours", "people told", "rewatches", "still going"].map((tag) => (
            <div key={tag} style={{
              display: "flex",
              background: DIMMER,
              border: `1px solid ${HAIRLINE}`,
              borderRadius: 999,
              padding: "10px 24px",
            }}>
              <span style={{ fontSize: 20, color: DIM, fontFamily: "monospace", letterSpacing: "0.04em" }}>{tag}</span>
            </div>
          ))}
        </div>
      </div>
    </Frame>
  );
}

function s2() {
  return (
    <Frame n={2} accent={TEAL}>
      <div style={{ display: "flex", flexDirection: "column", flex: 1, justifyContent: "space-between" }}>
        <span style={{ fontSize: 30, color: DIM, fontFamily: "monospace", letterSpacing: "0.1em", textTransform: "uppercase" }}>
          active for
        </span>
        <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
          <span style={{ fontSize: 380, fontWeight: 800, letterSpacing: "-0.06em", lineHeight: 0.82, color: TEAL, fontVariantNumeric: "tabular-nums" }}>
            284
          </span>
          <span style={{ fontSize: 100, fontWeight: 800, letterSpacing: "-0.04em", lineHeight: 1, color: PAPER }}>days.</span>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <div style={{ height: 1, background: HAIRLINE }} />
          <span style={{ fontSize: 32, color: DIM, letterSpacing: "-0.01em" }}>
            that&apos;s <span style={{ color: PAPER, fontWeight: 700 }}>9 months</span> of your actual life.
          </span>
        </div>
      </div>
    </Frame>
  );
}

function s3() {
  const tabs = [
    "Wednesday Addams — Wikipedia",
    "jenna ortega wednesday interview",
    "wednesday addams ao3 tag",
    "wednesday addams aesthetic outfits",
    "enid sinclair personality type",
    "wednesday season 2 release date",
    "addams family 1991 full movie",
    "wednesday addams best quotes",
    "tyler galpin fanfic rec list",
    "nevermore academy floor plan",
    "wenclair fic recs 2024",
    "is wednesday addams autistic theory",
    "jenna ortega bts photos",
    "+ 34 more tabs",
  ];
  return (
    <Frame n={3}>
      <div style={{ display: "flex", flexDirection: "column", flex: 1, gap: 0 }}>
        <span style={{ fontSize: 30, color: DIM, fontFamily: "monospace", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 20 }}>
          peak tabs open
        </span>
        <div style={{ display: "flex", alignItems: "baseline", gap: 16, marginBottom: 40 }}>
          <span style={{ fontSize: 200, fontWeight: 800, letterSpacing: "-0.06em", lineHeight: 0.85, color: TEAL, fontVariantNumeric: "tabular-nums" }}>47</span>
          <span style={{ fontSize: 52, fontWeight: 700, color: DIM, letterSpacing: "-0.02em" }}>tabs</span>
        </div>
        <div style={{ display: "flex", flexDirection: "column", flex: 1 }}>
          {tabs.map((tab, i) => (
            <div key={i} style={{
              display: "flex", alignItems: "center",
              padding: "13px 0",
              borderBottom: `1px solid ${HAIRLINE}`,
              gap: 20,
            }}>
              <span style={{ fontSize: 14, fontFamily: "monospace", color: i === tabs.length - 1 ? TEAL : DIM, letterSpacing: "0.04em", minWidth: 32, fontVariantNumeric: "tabular-nums" }}>
                {i < tabs.length - 1 ? String(i + 1).padStart(2, "0") : ""}
              </span>
              <span style={{
                fontSize: 22,
                color: i === tabs.length - 1 ? TEAL : i < 3 ? PAPER : DIM,
                fontWeight: i < 3 ? 600 : 400,
                letterSpacing: "-0.01em",
                overflow: "hidden",
                whiteSpace: "nowrap",
                textOverflow: "ellipsis",
              }}>
                {tab}
              </span>
            </div>
          ))}
        </div>
      </div>
    </Frame>
  );
}

function s4() {
  const hours = [
    { label: "6pm – 9pm",  pct: 0.2,  tag: "normal hours",     color: TEAL },
    { label: "9pm – 12am", pct: 0.6,  tag: "it's fine",        color: TEAL },
    { label: "12am – 3am", pct: 1.0,  tag: "the fix hours",    color: "#E63946" },
    { label: "3am – 6am",  pct: 0.45, tag: "getting concerning", color: "#E63946" },
  ];
  return (
    <Frame n={4} accent="#E63946">
      <div style={{ display: "flex", flexDirection: "column", flex: 1, gap: 0 }}>
        <span style={{ fontSize: 30, color: DIM, fontFamily: "monospace", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 20 }}>
          most active between
        </span>
        <div style={{ display: "flex", alignItems: "baseline", gap: 16, marginBottom: 60 }}>
          <span style={{ fontSize: 130, fontWeight: 800, letterSpacing: "-0.05em", lineHeight: 0.85, color: PAPER }}>12am</span>
          <span style={{ fontSize: 60, fontWeight: 700, color: DIM }}>–</span>
          <span style={{ fontSize: 130, fontWeight: 800, letterSpacing: "-0.05em", lineHeight: 0.85, color: "#E63946" }}>3am</span>
        </div>
        <div style={{ display: "flex", flexDirection: "column", flex: 1, gap: 32 }}>
          {hours.map((h) => (
            <div key={h.label} style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ fontSize: 24, color: PAPER, fontFamily: "monospace", letterSpacing: "0.04em" }}>{h.label}</span>
                <span style={{ fontSize: 20, color: DIM, fontFamily: "monospace" }}>{h.tag}</span>
              </div>
              <div style={{ height: 16, background: DIMMER, borderRadius: 999, overflow: "hidden", display: "flex", alignItems: "stretch" }}>
                <div style={{ height: "100%", width: `${h.pct * 100}%`, background: h.color, borderRadius: 999, opacity: h.pct === 1.0 ? 1 : 0.5 }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </Frame>
  );
}

function s5() {
  return (
    <Frame n={5}>
      <div style={{ display: "flex", flexDirection: "column", flex: 1, justifyContent: "space-between" }}>
        <span style={{ fontSize: 30, color: DIM, fontFamily: "monospace", letterSpacing: "0.1em", textTransform: "uppercase" }}>
          people told about it
        </span>
        <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
          <span style={{ fontSize: 300, fontWeight: 800, letterSpacing: "-0.06em", lineHeight: 0.85, color: PAPER, fontVariantNumeric: "tabular-nums" }}>23</span>
          <span style={{ fontSize: 52, color: DIM, fontWeight: 500, letterSpacing: "-0.02em", marginTop: 8 }}>who didn&apos;t ask.</span>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
          {[
            { label: "actually got it",       n: "3",  bright: true  },
            { label: "pretended to get it",   n: "11", bright: false },
            { label: "slowly backed away",    n: "6",  bright: false },
            { label: "sent you a meme later", n: "3",  bright: true  },
          ].map((row) => (
            <div key={row.label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "20px 0", borderBottom: `1px solid ${HAIRLINE}` }}>
              <span style={{ fontSize: 30, color: PAPER, letterSpacing: "-0.01em" }}>{row.label}</span>
              <span style={{ fontSize: 36, fontWeight: 800, color: row.bright ? TEAL : DIM, fontVariantNumeric: "tabular-nums" }}>{row.n}</span>
            </div>
          ))}
        </div>
      </div>
    </Frame>
  );
}

function s6() {
  return (
    <Frame n={6} accent={TEAL}>
      <div style={{ display: "flex", flexDirection: "column", flex: 1, justifyContent: "space-between" }}>
        <span style={{ fontSize: 30, color: DIM, fontFamily: "monospace", letterSpacing: "0.1em", textTransform: "uppercase" }}>
          full rewatches
        </span>
        <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
          <span style={{ fontSize: 420, fontWeight: 800, letterSpacing: "-0.065em", lineHeight: 0.82, color: TEAL, fontVariantNumeric: "tabular-nums" }}>8</span>
          <div style={{ display: "flex", gap: 12, marginTop: 20 }}>
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} style={{ flex: 1, height: 8, borderRadius: 999, background: TEAL, opacity: i < 3 ? 0.3 : i < 6 ? 0.6 : 1 }} />
            ))}
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div style={{ height: 1, background: HAIRLINE }} />
          <span style={{ fontSize: 34, color: DIM, letterSpacing: "-0.015em", lineHeight: 1.3 }}>
            and you <span style={{ color: PAPER, fontWeight: 700 }}>notice something new</span> every single time.
          </span>
        </div>
      </div>
    </Frame>
  );
}

function s7() {
  return (
    <Frame n={7} accent={TEAL}>
      <div style={{ display: "flex", flexDirection: "column", flex: 1, justifyContent: "space-between" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
          <span style={{ fontSize: 30, color: DIM, fontFamily: "monospace", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 40 }}>
            still going.
          </span>
          <span style={{ fontSize: 118, fontWeight: 800, letterSpacing: "-0.05em", lineHeight: 0.87, color: PAPER }}>your brain</span>
          <span style={{ fontSize: 118, fontWeight: 800, letterSpacing: "-0.05em", lineHeight: 0.87, color: PAPER }}>deserves</span>
          <span style={{ fontSize: 118, fontWeight: 800, letterSpacing: "-0.05em", lineHeight: 0.87, color: TEAL }}>a journal.</span>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          {["log it.", "count it.", "mourn it when it ends."].map((line) => (
            <div key={line} style={{ display: "flex", alignItems: "center", gap: 20 }}>
              <div style={{ width: 8, height: 8, borderRadius: 999, background: TEAL, flexShrink: 0 }} />
              <span style={{ fontSize: 38, color: DIM, letterSpacing: "-0.02em" }}>{line}</span>
            </div>
          ))}
        </div>
        <div style={{
          display: "flex", flexDirection: "column", gap: 0,
          background: `${TEAL}10`,
          border: `1px solid ${TEAL}28`,
          borderRadius: 24,
          padding: "36px 40px",
        }}>
          <span style={{ fontSize: 20, color: DIM, fontFamily: "monospace", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 8 }}>
            free · link in bio
          </span>
          <span style={{ fontSize: 64, fontWeight: 800, color: TEAL, letterSpacing: "-0.03em" }}>hyperfix.app</span>
        </div>
      </div>
    </Frame>
  );
}

const SLIDES: Record<string, () => React.ReactElement> = {
  "1": s1, "2": s2, "3": s3, "4": s4, "5": s5, "6": s6, "7": s7,
};

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const fn = SLIDES[id];
  if (!fn) return new Response("Not found", { status: 404 });
  return new ImageResponse(fn(), { width: W, height: H });
}
