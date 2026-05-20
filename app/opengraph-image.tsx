import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Hyperfix — what are you unwell about?";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OG() {
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
          color: "#F4F4F4",
          position: "relative",
          background:
            "radial-gradient(ellipse 80% 70% at 50% 110%, #5EEAD4 0%, #2DD4BF 18%, #0E4F47 38%, #08231F 58%, #070708 80%)",
        }}
      >
        {/* eyebrow pill */}
        <div style={{ display: "flex" }}>
          <span
            style={{
              background: "rgba(94,234,212,0.15)",
              color: "#5EEAD4",
              fontSize: 22,
              fontWeight: 500,
              borderRadius: 999,
              padding: "8px 22px",
              border: "1px solid rgba(94,234,212,0.35)",
            }}
          >
            hyperfix
          </span>
        </div>

        {/* headline */}
        <div
          style={{
            marginTop: 56,
            display: "flex",
            flexDirection: "column",
            gap: 0,
          }}
        >
          <span
            style={{
              fontSize: 138,
              lineHeight: 1.02,
              letterSpacing: "-0.03em",
              fontWeight: 600,
              color: "#FFFFFF",
            }}
          >
            What are you
          </span>
          <span
            style={{
              fontSize: 138,
              lineHeight: 1.02,
              letterSpacing: "-0.03em",
              fontWeight: 600,
              color: "#FFFFFF",
            }}
          >
            unwell about?
          </span>
        </div>

        {/* bottom row */}
        <div
          style={{
            position: "absolute",
            left: 72,
            right: 72,
            bottom: 56,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
          }}
        >
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <span style={{ fontSize: 28, color: "rgba(255,255,255,0.85)", fontWeight: 500 }}>
              hyperfix.app
            </span>
            <span style={{ fontSize: 20, color: "rgba(255,255,255,0.55)" }}>
              log it · count it · mourn it
            </span>
          </div>
          {/* Hex mark */}
          <svg width="120" height="120" viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M32 10 L50 20 L50 44 L32 54 L14 44 L14 20 Z"
              fill="none"
              stroke="rgba(255,255,255,0.9)"
              strokeWidth="2"
              strokeLinejoin="round"
            />
            <path d="M32 22 L42 28 L42 40 L32 46 L22 40 L22 28 Z" fill="#5EEAD4" />
            <circle cx="32" cy="34" r="2.5" fill="#0A1F1C" />
          </svg>
        </div>
      </div>
    ),
    { ...size }
  );
}
