import { ImageResponse } from "next/og";

export const runtime = "edge";

const W = 1080;
const H = 1080;

const BG = "#F8F5F0";
const INK = "#111111";
const DIM = "rgba(17,17,17,0.4)";
const DIM2 = "rgba(17,17,17,0.18)";
const ACCENT = "#0D9488";
const ACCENT_LIGHT = "#5EEAD4";
const CARD = "#FFFFFF";
const CARD_BORDER = "rgba(17,17,17,0.07)";

function GemMark({ size = 36 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none">
      <rect width="64" height="64" rx="15" fill="#0A0B0D" />
      <path d="M58,32 L50,14 L32,32 Z" fill="#3CCFBA" />
      <path d="M32,58 L14,50 L32,32 Z" fill="#3CCFBA" />
      <path d="M6,32 L14,14 L32,32 Z" fill="#3CCFBA" />
      <path d="M32,6 L50,14 L32,32 Z" fill="#5EEAD4" />
      <path d="M58,32 L50,50 L32,32 Z" fill="#0D9488" />
      <path d="M50,50 L32,58 L32,32 Z" fill="#0A7A70" />
      <path d="M14,50 L6,32 L32,32 Z" fill="#0D9488" />
      <path d="M14,14 L32,6 L32,32 Z" fill="#0A7A70" />
      <path d="M43,32 L39,39 L32,43 L25,39 L21,32 L25,25 L32,21 L39,25 Z" fill="rgba(255,255,255,0.2)" />
    </svg>
  );
}

const fixations = [
  { name: "Severance (the show)", days: 47, peak: 9, faded: true },
  { name: "competitive yo-yo", days: 23, peak: 10, faded: true },
  { name: "sourdough", days: 11, peak: 7, faded: true },
  { name: "mechanical keyboards", days: 61, peak: 10, faded: true },
  { name: "whatever this is", days: 3, peak: 8, faded: false },
];

export async function GET() {
  return new ImageResponse(
    (
      <div style={{
        width: W, height: H, background: BG,
        display: "flex", flexDirection: "column",
        padding: "72px 80px",
        fontFamily: "sans-serif",
      }}>
        {/* header */}
        <div style={{ display: "flex", flexDirection: "column", marginBottom: 48 }}>
          <span style={{
            fontSize: 20, fontWeight: 700, letterSpacing: "0.18em",
            textTransform: "uppercase", color: DIM2, marginBottom: 14,
          }}>
            my fixation graveyard
          </span>
          <div style={{ display: "flex", flexDirection: "column", fontSize: 64, fontWeight: 900, lineHeight: 0.9, letterSpacing: "-0.04em" }}>
            <span style={{ color: INK }}>things i was</span>
            <span style={{ color: INK }}>obsessed with.</span>
          </div>
        </div>

        {/* fixation list */}
        <div style={{ display: "flex", flexDirection: "column", gap: 14, flex: 1 }}>
          {fixations.map((f, i) => (
            <div key={i} style={{
              display: "flex", alignItems: "center",
              background: f.faded ? CARD : ACCENT_LIGHT,
              border: `1px solid ${f.faded ? CARD_BORDER : "transparent"}`,
              borderRadius: 18,
              padding: "22px 28px",
              gap: 20,
            }}>
              {/* intensity bar strip */}
              <div style={{
                display: "flex", flexDirection: "column",
                width: 6, alignSelf: "stretch", borderRadius: 3,
                background: f.faded
                  ? `rgba(13,148,136,${0.15 + f.peak * 0.07})`
                  : ACCENT,
                flexShrink: 0,
              }} />

              <div style={{ display: "flex", flexDirection: "column", flex: 1, gap: 4 }}>
                <span style={{
                  fontSize: 32, fontWeight: 800, letterSpacing: "-0.02em",
                  color: f.faded ? "rgba(17,17,17,0.35)" : "#042F2E",
                  textDecoration: f.faded ? "line-through" : "none",
                }}>
                  {f.name}
                </span>
                <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
                  <span style={{ fontSize: 18, fontWeight: 600, color: f.faded ? DIM2 : "rgba(4,47,46,0.5)" }}>
                    {f.days} days
                  </span>
                  <div style={{ display: "flex", width: 4, height: 4, borderRadius: 2, background: f.faded ? DIM2 : "rgba(4,47,46,0.3)" }} />
                  <span style={{ fontSize: 18, fontWeight: 600, color: f.faded ? DIM2 : "rgba(4,47,46,0.5)" }}>
                    peak intensity {f.peak}/10
                  </span>
                </div>
              </div>

              {/* status badge */}
              <div style={{
                display: "flex", padding: "8px 18px",
                background: f.faded ? "rgba(17,17,17,0.05)" : "rgba(4,47,46,0.12)",
                borderRadius: 100, flexShrink: 0,
              }}>
                <span style={{
                  fontSize: 15, fontWeight: 700,
                  color: f.faded ? DIM2 : "#042F2E",
                  letterSpacing: "0.06em",
                }}>
                  {f.faded ? "rip" : "active"}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* footer */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 36 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <GemMark size={36} />
            <div style={{ display: "flex", fontFamily: "Georgia, serif", fontSize: 28, fontWeight: 700, letterSpacing: "-0.04em" }}>
              <span style={{ color: INK }}>hyper</span>
              <span style={{ color: ACCENT, fontStyle: "italic" }}>fix</span>
              <span style={{ color: DIM }}>.app</span>
            </div>
          </div>
          <span style={{ fontSize: 18, color: DIM2, fontWeight: 500, letterSpacing: "-0.01em" }}>
            track every fixation. keep the graveyard.
          </span>
        </div>
      </div>
    ),
    { width: W, height: H }
  );
}
