import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

// New brand mark: six-pointed asterisk in sage green on warm beige tile
export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 180,
          height: 180,
          background: "#f7f4ec",
          borderRadius: 40,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <svg width="120" height="120" viewBox="0 0 28 28" xmlns="http://www.w3.org/2000/svg">
          <line x1="14" y1="4"    x2="14" y2="24"   stroke="#6f8a63" strokeWidth="2.2" strokeLinecap="round" />
          <line x1="22.66" y1="9"  x2="5.34" y2="19"  stroke="#6f8a63" strokeWidth="2.2" strokeLinecap="round" />
          <line x1="5.34"  y1="9"  x2="22.66" y2="19" stroke="#6f8a63" strokeWidth="2.2" strokeLinecap="round" />
        </svg>
      </div>
    ),
    { ...size }
  );
}
