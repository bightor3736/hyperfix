import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

// Hyperfix spark mark: white bolt on a coral squircle.
export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 180,
          height: 180,
          background: "#FF5A36",
          borderRadius: 40,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <svg width="150" height="150" viewBox="0 0 36 36">
          <path
            d="M20.5 6.5 L11 19.8 a1 1 0 0 0 0.82 1.58 H16.4 L15 29.2 a0.6 0.6 0 0 0 1.08 0.45 L25.4 16.2 a1 1 0 0 0 -0.82 -1.58 H19.9 L21.6 7.1 a0.6 0.6 0 0 0 -1.1 -0.6 Z"
            fill="#ffffff"
          />
        </svg>
      </div>
    ),
    { ...size }
  );
}
