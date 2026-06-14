import { ImageResponse } from "next/og";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

// Hyperfix spark mark: white bolt on a coral squircle.
export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 32,
          height: 32,
          background: "#FF5A36",
          borderRadius: 9,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <svg width="32" height="32" viewBox="0 0 36 36">
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
