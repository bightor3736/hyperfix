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
          background: "#0A0A0A",
          display: "flex",
          flexDirection: "column",
          padding: "64px 72px",
          fontFamily: "sans-serif",
          color: "#F4F4F4",
          position: "relative",
        }}
      >
        {/* pill badge top-left */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
          }}
        >
          <span
            style={{
              background: "#5EEAD4",
              color: "#0A0A0A",
              fontFamily: "monospace",
              fontSize: 18,
              fontWeight: 800,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              borderRadius: 999,
              padding: "10px 22px",
            }}
          >
            hyperfix · waitlist
          </span>
        </div>

        {/* big bold headline */}
        <div
          style={{
            marginTop: 64,
            display: "flex",
            flexDirection: "column",
            gap: 0,
          }}
        >
          <span
            style={{
              fontSize: 148,
              lineHeight: 0.92,
              letterSpacing: "-0.05em",
              fontWeight: 700,
              color: "#F4F4F4",
            }}
          >
            What are you
          </span>
          <span
            style={{
              fontSize: 148,
              lineHeight: 0.92,
              letterSpacing: "-0.05em",
              fontWeight: 700,
              fontStyle: "italic",
              color: "#5EEAD4",
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
          <span
            style={{
              fontFamily: "monospace",
              fontSize: 22,
              letterSpacing: "0.06em",
              textTransform: "uppercase",
              color: "rgba(244,244,244,0.45)",
            }}
          >
            hyperfix.app
          </span>
          <span
            style={{
              fontFamily: "sans-serif",
              fontSize: 200,
              lineHeight: 0.85,
              color: "#5EEAD4",
              letterSpacing: "-0.05em",
              fontWeight: 700,
            }}
          >
            47
          </span>
        </div>
      </div>
    ),
    { ...size }
  );
}
