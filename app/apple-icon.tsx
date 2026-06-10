import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

// Hyperfix start-spark mark: white rounded play + spark dot on a lilac squircle.
export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 180,
          height: 180,
          background: "#6957E8",
          borderRadius: 50,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <svg width="118" height="118" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M11 9.5 L23.5 16.75 L11 24 Z"
            fill="#ffffff"
            stroke="#ffffff"
            strokeWidth="5.5"
            strokeLinejoin="round"
          />
          <circle cx="25.5" cy="6.5" r="3.5" fill="#FFC93F" />
        </svg>
      </div>
    ),
    { ...size }
  );
}
