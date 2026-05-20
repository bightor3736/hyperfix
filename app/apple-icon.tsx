import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 180,
          height: 180,
          background: "#0A0B0D",
          borderRadius: 40,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <svg width="140" height="140" viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M32 10 L50 20 L50 44 L32 54 L14 44 L14 20 Z"
            fill="none"
            stroke="rgba(255,255,255,0.9)"
            strokeWidth="2"
            strokeLinejoin="round"
          />
          <path
            d="M32 22 L42 28 L42 40 L32 46 L22 40 L22 28 Z"
            fill="#5EEAD4"
          />
          <circle cx="32" cy="34" r="2.5" fill="#0A1F1C" />
        </svg>
      </div>
    ),
    { ...size }
  );
}
