import { ImageResponse } from "next/og";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 32,
          height: 32,
          background: "#0A0B0D",
          borderRadius: 7,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <svg width="32" height="32" viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
          <path d="M58,32 L50,14 L32,32 Z" fill="#3CCFBA" />
          <path d="M32,58 L14,50 L32,32 Z" fill="#3CCFBA" />
          <path d="M6,32 L14,14 L32,32 Z" fill="#3CCFBA" />
          <path d="M32,6 L50,14 L32,32 Z" fill="#5EEAD4" />
          <path d="M58,32 L50,50 L32,32 Z" fill="#0D9488" />
          <path d="M50,50 L32,58 L32,32 Z" fill="#0A7A70" />
          <path d="M14,50 L6,32 L32,32 Z" fill="#0D9488" />
          <path d="M14,14 L32,6 L32,32 Z" fill="#0A7A70" />
          <path d="M58,32 L50,50 L32,58 L14,50 L6,32 L14,14 L32,6 L50,14 Z" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="1" />
          <path d="M43,32 L39,39 L32,43 L25,39 L21,32 L25,25 L32,21 L39,25 Z" fill="rgba(255,255,255,0.22)" />
        </svg>
      </div>
    ),
    { ...size }
  );
}
