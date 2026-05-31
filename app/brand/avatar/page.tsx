import type { Metadata } from "next";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"], weight: ["900"], display: "swap" });

export const metadata: Metadata = {
  title: "Hyperfix — IG avatar",
  robots: { index: false, follow: false },
};

const LIME = "var(--bg)";
const FG = "#5EEAD4";
const FG_2 = "#7CB205";

export default function Avatar() {
  return (
    <main
      className="min-h-screen flex items-center justify-center"
      style={{ background: "#3F3F46" }}
    >
      {/* 1080×1080 — IG profile size. Lockup centered within the inscribed circle. */}
      <div
        id="avatar"
        className={inter.className}
        style={{
          width: 1080,
          height: 1080,
          background: LIME,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 36,
        }}
      >
        <svg width={420} height={420} viewBox="0 0 64 64" aria-hidden="true">
          <path d="M14 40 L32 20 L50 40 L42 40 L32 28 L22 40 Z" fill={FG} />
          <path d="M14 50 L32 30 L50 50 L42 50 L32 38 L22 50 Z" fill={FG_2} />
        </svg>
        <span
          style={{
            fontFamily: inter.style.fontFamily,
            fontSize: 132,
            fontWeight: 900,
            letterSpacing: "-6px",
            color: FG,
            lineHeight: 1,
          }}
        >
          Hyperfix
        </span>
      </div>
    </main>
  );
}
