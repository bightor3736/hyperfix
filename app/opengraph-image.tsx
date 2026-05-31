import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Hyperfix — a journal for your obsession";
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
          background: "#f7f4ec",
          color: "#1b1a17",
          position: "relative",
        }}
      >
        {/* eyebrow pill */}
        <div style={{ display: "flex" }}>
          <span
            style={{
              background: "#dbe4d0",
              color: "#6f8a63",
              fontSize: 22,
              fontWeight: 500,
              borderRadius: 999,
              padding: "8px 22px",
              border: "1px solid #6f8a63",
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
              fontSize: 120,
              lineHeight: 1.02,
              letterSpacing: "-0.03em",
              fontWeight: 300,
              color: "#1b1a17",
            }}
          >
            A journal for
          </span>
          <span
            style={{
              fontSize: 120,
              lineHeight: 1.02,
              letterSpacing: "-0.03em",
              fontWeight: 300,
              color: "#6f8a63",
            }}
          >
            your obsession.
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
            <span style={{ fontSize: 28, color: "#1b1a17", fontWeight: 500 }}>
              hyperfix.app
            </span>
            <span style={{ fontSize: 20, color: "#6b6659" }}>
              log it · count it · mourn it
            </span>
          </div>
          {/* New asterisk mark */}
          <svg width="100" height="100" viewBox="0 0 28 28" xmlns="http://www.w3.org/2000/svg">
            <line x1="14" y1="4"    x2="14" y2="24"   stroke="#6f8a63" strokeWidth="2.2" strokeLinecap="round" />
            <line x1="22.66" y1="9"  x2="5.34" y2="19"  stroke="#6f8a63" strokeWidth="2.2" strokeLinecap="round" />
            <line x1="5.34"  y1="9"  x2="22.66" y2="19" stroke="#6f8a63" strokeWidth="2.2" strokeLinecap="round" />
          </svg>
        </div>
      </div>
    ),
    { ...size }
  );
}
