import { ImageResponse } from "next/og";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

// Hyperfix mark: white bloom on a soft-blue tile.
export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 32,
          height: 32,
          background: "#14b8a6",
          borderRadius: 9,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <svg width="22" height="22" viewBox="0 0 28 28" xmlns="http://www.w3.org/2000/svg">
          <g fill="#ffffff">
            <circle cx="14" cy="7.4" r="6.6" />
            <circle cx="14" cy="20.6" r="6.6" />
            <circle cx="7.4" cy="14" r="6.6" />
            <circle cx="20.6" cy="14" r="6.6" />
            <circle cx="14" cy="14" r="6.6" />
          </g>
        </svg>
      </div>
    ),
    { ...size }
  );
}
