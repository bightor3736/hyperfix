import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

// Hyperfix focus-lock mark: white brackets + center block on a blue tile.
export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 180,
          height: 180,
          background: "#2F4BFF",
          borderRadius: 40,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <svg width="118" height="118" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
          <g fill="#ffffff">
            <rect x="3" y="3" width="3" height="8" />
            <rect x="3" y="3" width="8" height="3" />
            <rect x="26" y="3" width="3" height="8" />
            <rect x="21" y="3" width="8" height="3" />
            <rect x="3" y="21" width="3" height="8" />
            <rect x="3" y="26" width="8" height="3" />
            <rect x="26" y="21" width="3" height="8" />
            <rect x="21" y="26" width="8" height="3" />
            <rect x="11.5" y="11.5" width="9" height="9" />
          </g>
        </svg>
      </div>
    ),
    { ...size }
  );
}
