import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "404 — Not found · Hyperfix",
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return (
    <main className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12 relative" style={{ background: "#000000" }}>
      <div className="relative max-w-xl w-full text-center anim-fadeUp">
        <p className="uppercase mb-6" style={{ fontSize: 11, fontWeight: 600, letterSpacing: "3px", color: "rgba(255,255,255,0.35)" }}>
          404
        </p>
        <h1
          className="tabular-nums mb-3"
          style={{
            color: "#ffffff",
            fontSize: "clamp(80px, 18vw, 160px)",
            lineHeight: 0.9,
            letterSpacing: "-0.05em",
            fontWeight: 600,
          }}
        >
          404
        </h1>
        <h2
          className="mt-6"
          style={{
            color: "#ffffff",
            fontSize: "clamp(28px, 5vw, 40px)",
            letterSpacing: "-0.025em",
            fontWeight: 500,
            lineHeight: 1.05,
          }}
        >
          This fix doesn&apos;t{" "}
          <span style={{ fontFamily: "var(--font-serif-display, 'Instrument Serif', serif)", fontStyle: "italic", fontWeight: 400 }}>
            exist.
          </span>
        </h2>
        <p className="mt-4 text-base max-w-md mx-auto" style={{ color: "rgba(255,255,255,0.55)" }}>
          It may have ended. Or it never started. Or someone shared the wrong link.
        </p>

        <div className="mt-10 flex flex-wrap justify-center gap-3">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm font-semibold px-6 py-3 transition-all hover:opacity-95 active:scale-[0.98]"
            style={{
              background: "#ffffff",
              color: "#000000",
              fontWeight: 600,
              borderRadius: 9999,
            }}
          >
            Go home
          </Link>
          <Link
            href="/explore"
            className="liquid-glass inline-flex items-center gap-2 text-sm font-medium px-6 py-3 transition-all hover:opacity-80"
            style={{
              color: "#ffffff",
              borderRadius: 9999,
            }}
          >
            Explore public fixations →
          </Link>
        </div>
      </div>
    </main>
  );
}
