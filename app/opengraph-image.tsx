import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Hyperfix — start small, that counts";
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
          justifyContent: "space-between",
          padding: "72px 80px",
          background: "#FBF7F1",
          color: "#181410",
          position: "relative",
        }}
      >
        {/* warm spark glow */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            background:
              "radial-gradient(700px 460px at 88% 6%, rgba(255,90,54,0.18) 0%, transparent 60%)",
          }}
        />

        {/* brand row */}
        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
          <div
            style={{
              width: 60,
              height: 60,
              background: "#FF5A36",
              borderRadius: 16,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <svg width="52" height="52" viewBox="0 0 36 36">
              <path
                d="M20.5 6.5 L11 19.8 a1 1 0 0 0 0.82 1.58 H16.4 L15 29.2 a0.6 0.6 0 0 0 1.08 0.45 L25.4 16.2 a1 1 0 0 0 -0.82 -1.58 H19.9 L21.6 7.1 a0.6 0.6 0 0 0 -1.1 -0.6 Z"
                fill="#ffffff"
              />
            </svg>
          </div>
          <span style={{ fontSize: 36, fontWeight: 600, letterSpacing: "-1px" }}>hyperfix</span>
        </div>

        {/* headline */}
        <div style={{ display: "flex", flexDirection: "column", gap: 26 }}>
          <span
            style={{
              fontSize: 86,
              fontWeight: 600,
              letterSpacing: "-3px",
              lineHeight: 1.04,
              maxWidth: 960,
            }}
          >
            Start small.{" "}
            <span style={{ color: "#FF5A36" }}>That counts.</span>
          </span>
          <span
            style={{
              fontSize: 30,
              color: "rgba(24,20,16,0.62)",
              maxWidth: 820,
              lineHeight: 1.4,
            }}
          >
            The ADHD app that rewards you for starting — not finishing. Five minutes counts.
          </span>
        </div>

        {/* footer row */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <span style={{ fontSize: 22, color: "rgba(24,20,16,0.45)" }}>
            No guilt. No streak resets. No leaderboards.
          </span>
          <span style={{ fontSize: 28, fontWeight: 600 }}>hyperfix.app</span>
        </div>
      </div>
    ),
    { ...size }
  );
}
