import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Hyperfix — start the task you've been avoiding";
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
          background: "#000000",
          color: "#ffffff",
          position: "relative",
        }}
      >
        {/* subtle vignette */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            background:
              "radial-gradient(900px 500px at 50% 110%, rgba(255,255,255,0.08) 0%, transparent 60%)",
          }}
        />

        {/* brand row */}
        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
          <div
            style={{
              width: 56,
              height: 56,
              background: "#ffffff",
              borderRadius: 15,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <svg width="46" height="46" viewBox="0 0 36 36">
              <line x1="11" y1="9" x2="11" y2="27" stroke="#000000" strokeWidth="3.2" strokeLinecap="round" />
              <path d="M11 19 C11 13.5 25 13.5 25 19" stroke="#000000" strokeWidth="3.2" strokeLinecap="round" fill="none" />
              <line x1="25" y1="19" x2="25" y2="27" stroke="#000000" strokeWidth="3.2" strokeLinecap="round" />
            </svg>
          </div>
          <span style={{ fontSize: 34, fontWeight: 600, letterSpacing: "-1px" }}>hyperfix</span>
        </div>

        {/* headline */}
        <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
          <span
            style={{
              fontSize: 84,
              fontWeight: 500,
              letterSpacing: "-3px",
              lineHeight: 1.05,
              maxWidth: 980,
            }}
          >
            Start the task you&apos;ve been avoiding.
          </span>
          <span
            style={{
              fontSize: 30,
              color: "rgba(255,255,255,0.55)",
              maxWidth: 820,
              lineHeight: 1.4,
            }}
          >
            Name it. Do 5 minutes. Earn XP for starting — not for finishing.
          </span>
        </div>

        {/* footer row */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <span style={{ fontSize: 22, color: "rgba(255,255,255,0.35)" }}>
            Built for the way ADHD actually works
          </span>
          <span style={{ fontSize: 28, fontWeight: 600 }}>hyperfix.app</span>
        </div>
      </div>
    ),
    { ...size }
  );
}
