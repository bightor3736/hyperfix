import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Hyperfix — ADHD accountability that actually works";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OG() {
  const BG = "#f8f7f3";
  const INK = "#181613";
  const MUTED = "#57544d";
  const ENERGY = "#7c5cff";

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          padding: "64px 72px",
          fontFamily: "serif",
          background: BG,
          backgroundImage: `radial-gradient(800px 520px at 100% 0%, #e3dbff 0%, ${BG} 62%), radial-gradient(600px 400px at 0% 100%, #ffe0f0 0%, transparent 55%)`,
          color: INK,
          position: "relative",
        }}
      >
        {/* brand row */}
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div style={{ display: "flex", width: 56, height: 56, borderRadius: 16, background: ENERGY, alignItems: "center", justifyContent: "center" }}>
            <svg width="36" height="36" viewBox="0 0 28 28" xmlns="http://www.w3.org/2000/svg">
              <g fill="#ffffff">
                <circle cx="14" cy="7.4" r="6.6" />
                <circle cx="14" cy="20.6" r="6.6" />
                <circle cx="7.4" cy="14" r="6.6" />
                <circle cx="20.6" cy="14" r="6.6" />
                <circle cx="14" cy="14" r="6.6" />
              </g>
            </svg>
          </div>
          <span style={{ fontSize: 34, fontWeight: 600, letterSpacing: "-0.02em" }}>hyperfix</span>
        </div>

        {/* headline */}
        <div style={{ marginTop: 56, display: "flex", flexDirection: "column" }}>
          <span style={{ fontSize: 92, lineHeight: 1.04, letterSpacing: "-0.03em", fontWeight: 600, color: INK }}>
            Your ADHD,
          </span>
          <span style={{ fontSize: 92, lineHeight: 1.04, letterSpacing: "-0.03em", fontWeight: 600, color: ENERGY }}>
            finally on your side.
          </span>
        </div>

        {/* bottom row */}
        <div style={{ position: "absolute", left: 72, right: 72, bottom: 60, display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
          <span style={{ fontSize: 27, color: MUTED }}>
            track hyperfixations · earn real XP · beat the wall
          </span>
          <span style={{ fontSize: 28, color: INK, fontWeight: 600 }}>hyperfix.app</span>
        </div>
      </div>
    ),
    { ...size }
  );
}
