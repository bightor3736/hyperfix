import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

// Hyperfix mark: white dopamine spark on an energy-purple tile.
export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 180,
          height: 180,
          background: "#7c5cff",
          borderRadius: 42,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <svg width="112" height="112" viewBox="0 0 28 28" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M14 1 C 15.1 9.2, 18.8 12.9, 27 14 C 18.8 15.1, 15.1 18.8, 14 27 C 12.9 18.8, 9.2 15.1, 1 14 C 9.2 12.9, 12.9 9.2, 14 1 Z"
            fill="#ffffff"
          />
        </svg>
      </div>
    ),
    { ...size }
  );
}
