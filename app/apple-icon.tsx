import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

// Hyperfix mark: black "h" on a white rounded square.
export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 180,
          height: 180,
          background: "#ffffff",
          borderRadius: 40,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <svg width="150" height="150" viewBox="0 0 36 36" xmlns="http://www.w3.org/2000/svg">
          <line x1="11" y1="9" x2="11" y2="27" stroke="#000000" strokeWidth="3.2" strokeLinecap="round" />
          <path d="M11 19 C11 13.5 25 13.5 25 19" stroke="#000000" strokeWidth="3.2" strokeLinecap="round" fill="none" />
          <line x1="25" y1="19" x2="25" y2="27" stroke="#000000" strokeWidth="3.2" strokeLinecap="round" />
        </svg>
      </div>
    ),
    { ...size }
  );
}
