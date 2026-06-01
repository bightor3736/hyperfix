import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Hyperfix — your daily dopamine, on tap";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OG() {
  const BG = "#0c0a16";
  const INK = "#f4f1ff";
  const MUTED = "#a79ecb";
  const ENERGY = "#9d86ff";

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          padding: "64px 72px",
          fontFamily: "sans-serif",
          background: BG,
          backgroundImage: `radial-gradient(900px 600px at 100% 0%, #201a3a 0%, ${BG} 60%)`,
          color: INK,
          position: "relative",
        }}
      >
        {/* brand row */}
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div style={{ display: "flex", width: 56, height: 56, borderRadius: 16, background: ENERGY, alignItems: "center", justifyContent: "center" }}>
            <svg width="34" height="34" viewBox="0 0 28 28" xmlns="http://www.w3.org/2000/svg">
              <path d="M14 1 C 15.1 9.2, 18.8 12.9, 27 14 C 18.8 15.1, 15.1 18.8, 14 27 C 12.9 18.8, 9.2 15.1, 1 14 C 9.2 12.9, 12.9 9.2, 14 1 Z" fill="#ffffff" />
            </svg>
          </div>
          <span style={{ fontSize: 34, fontWeight: 700, letterSpacing: "-0.02em" }}>hyperfix</span>
        </div>

        {/* headline */}
        <div style={{ marginTop: 60, display: "flex", flexDirection: "column" }}>
          <span style={{ fontSize: 104, lineHeight: 1.02, letterSpacing: "-0.03em", fontWeight: 700, color: INK }}>
            Your daily dopamine.
          </span>
          <span style={{ fontSize: 104, lineHeight: 1.02, letterSpacing: "-0.03em", fontWeight: 700, color: ENERGY }}>
            On tap.
          </span>
        </div>

        {/* bottom row */}
        <div style={{ position: "absolute", left: 72, right: 72, bottom: 60, display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
          <span style={{ fontSize: 28, color: MUTED }}>
            the anti-doomscroll game for ADHD brains
          </span>
          <span style={{ fontSize: 28, color: INK, fontWeight: 600 }}>hyperfix.app</span>
        </div>
      </div>
    ),
    { ...size }
  );
}
