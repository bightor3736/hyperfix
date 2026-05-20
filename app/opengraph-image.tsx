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
          {/* Gem mark */}
          <svg width="120" height="120" viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
            <path d="M58,32 L50,14 L32,32 Z" fill="#3CCFBA" />
            <path d="M32,58 L14,50 L32,32 Z" fill="#3CCFBA" />
            <path d="M6,32 L14,14 L32,32 Z" fill="#3CCFBA" />
            <path d="M32,6 L50,14 L32,32 Z" fill="#5EEAD4" />
            <path d="M58,32 L50,50 L32,32 Z" fill="#0D9488" />
            <path d="M50,50 L32,58 L32,32 Z" fill="#0A7A70" />
            <path d="M14,50 L6,32 L32,32 Z" fill="#0D9488" />
            <path d="M14,14 L32,6 L32,32 Z" fill="#0A7A70" />
            <path d="M58,32 L50,50 L32,58 L14,50 L6,32 L14,14 L32,6 L50,14 Z" fill="none" stroke="rgba(255,255,255,0.25)" strokeWidth="1" />
            <path d="M43,32 L39,39 L32,43 L25,39 L21,32 L25,25 L32,21 L39,25 Z" fill="rgba(255,255,255,0.22)" />
          </svg>
        </div>
      </div>
    ),
    { ...size }
  );
}
