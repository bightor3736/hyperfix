import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "404 — Not found · Hyperfix",
  robots: { index: false, follow: false },
};

const TEAL = "#5EEAD4";
const CARD_BORDER = "rgba(255,255,255,0.06)";
const NOISE_URL =
  "url(\"data:image/svg+xml;utf8,<svg viewBox='0 0 240 240' xmlns='http://www.w3.org/2000/svg'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 0.55 0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>\")";

export default function NotFound() {
  return (
    <main className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12 relative" style={{ background: "#070708" }}>
      <div aria-hidden className="absolute inset-0 pointer-events-none mix-blend-overlay" style={{ backgroundImage: NOISE_URL, backgroundSize: "240px 240px", opacity: 0.06 }} />

      <div className="relative max-w-xl w-full text-center anim-fadeUp">
        <p className="font-mono text-[10px] uppercase tracking-widest mb-6" style={{ color: "rgba(94,234,212,0.6)" }}>
          404
        </p>
        <h1
          className="font-display tabular-nums mb-3"
          style={{
            color: "#F4F4F4",
            fontSize: "clamp(80px, 18vw, 160px)",
            lineHeight: 0.9,
            letterSpacing: "-0.05em",
            fontWeight: 600,
            textShadow: "0 0 60px rgba(94,234,212,0.2)",
          }}
        >
          404
        </h1>
        <h2
          className="font-display mt-6"
          style={{
            color: "#F4F4F4",
            fontSize: "clamp(28px, 5vw, 40px)",
            letterSpacing: "-0.02em",
            fontWeight: 600,
            lineHeight: 1.05,
          }}
        >
          This fix doesn&apos;t exist.
        </h2>
        <p className="mt-4 font-sans text-base max-w-md mx-auto" style={{ color: "rgba(255,255,255,0.55)" }}>
          It may have ended. Or it never started. Or someone shared the wrong link.
        </p>

        <div className="mt-10 flex flex-wrap justify-center gap-3">
          <Link
            href="/"
            className="inline-flex items-center gap-2 font-sans text-sm font-semibold px-6 py-3 transition-all hover:opacity-95 active:scale-[0.98]"
            style={{
              background: "#FFFFFF",
              color: "#0A0A0A",
              borderRadius: 999,
            }}
          >
            Go home
          </Link>
          <Link
            href="/explore"
            className="inline-flex items-center gap-2 font-sans text-sm font-medium px-6 py-3 transition-all hover:opacity-80"
            style={{
              background: "rgba(94,234,212,0.08)",
              border: "1px solid rgba(94,234,212,0.25)",
              color: TEAL,
              borderRadius: 999,
            }}
          >
            Explore public fixations →
          </Link>
        </div>
      </div>
    </main>
  );
}
