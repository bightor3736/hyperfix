import { ImageResponse } from "next/og";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

// Hyperfix focus-lock mark: white brackets + center block on a blue tile.
export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 32,
          height: 32,
          background: "#2F4BFF",
          borderRadius: 7,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <svg width="22" height="22" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
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
