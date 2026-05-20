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
          background: "#0A0A0A",
          borderRadius: 40,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <svg width="140" height="140" viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
          <path d="M14 12 L44 12 L50 26 L20 26 Z" fill="#A855F7" />
          <path d="M20 30 L50 30 L44 52 L14 52 Z" fill="#A855F7" />
          <path d="M20 26 L50 26 L50 30 L20 30 Z" fill="#7CB205" />
        </svg>
      </div>
    ),
    { ...size }
  );
}
