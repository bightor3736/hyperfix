"use client";

import { useEffect } from "react";
import Link from "next/link";

const TEAL = "#5EEAD4";
const CARD_BORDER = "rgba(255,255,255,0.06)";
const NOISE_URL =
  "url(\"data:image/svg+xml;utf8,<svg viewBox='0 0 240 240' xmlns='http://www.w3.org/2000/svg'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 0.55 0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>\")";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12 relative" style={{ background: "#070708" }}>
      <div aria-hidden className="absolute inset-0 pointer-events-none mix-blend-overlay" style={{ backgroundImage: NOISE_URL, backgroundSize: "240px 240px", opacity: 0.08 }} />

      <div className="relative max-w-2xl w-full">
        <div className="relative overflow-hidden rounded-3xl p-8 sm:p-14 text-center anim-fadeUp" style={{ background: "radial-gradient(ellipse 80% 120% at 50% 130%, #5EEAD4 0%, #2DD4BF 14%, #0E4F47 34%, #08231F 55%, #070708 78%)", border: `1px solid ${CARD_BORDER}` }}>
          <div aria-hidden className="absolute inset-0 pointer-events-none mix-blend-overlay" style={{ backgroundImage: NOISE_URL, backgroundSize: "200px 200px", opacity: 0.55 }} />
          <div aria-hidden className="absolute inset-0 pointer-events-none" style={{ background: "linear-gradient(180deg, #070708 0%, rgba(7,7,8,0.45) 30%, transparent 100%)" }} />
          <div className="relative">
            <span className="inline-flex items-center font-sans text-xs rounded-full px-3 py-1 mb-5" style={{ background: "rgba(94,234,212,0.10)", color: TEAL, border: "1px solid rgba(94,234,212,0.22)" }}>error</span>
            <h1 className="font-display anim-fadeUp delay-100" style={{ color: "#FFFFFF", fontSize: "clamp(40px, 7vw, 64px)", lineHeight: 1.02, letterSpacing: "-0.02em", fontWeight: 600 }}>
              Something broke.
            </h1>
            <p className="mt-5 font-sans text-base sm:text-lg max-w-md mx-auto anim-fadeUp delay-200" style={{ color: "rgba(255,255,255,0.72)" }}>
              We logged it. Try again or go home.
            </p>

            <div className="mt-7 flex flex-col sm:flex-row gap-3 justify-center anim-fadeUp delay-300">
              <button
                onClick={reset}
                className="inline-flex items-center justify-center gap-2 font-sans text-sm font-semibold px-6 py-3.5 transition-all duration-200 hover:opacity-95 hover:-translate-y-px active:scale-[0.98]"
                style={{
                  background: "#FFFFFF",
                  color: "#0A0A0A",
                  borderRadius: 999,
                  boxShadow: "0 1px 0 0 rgba(255,255,255,0.5) inset, 0 12px 36px rgba(0,0,0,0.4), 0 0 40px rgba(94,234,212,0.25)",
                }}
              >
                Try again
              </button>
              <Link
                href="/"
                className="inline-flex items-center justify-center gap-2 font-sans text-sm font-semibold px-6 py-3.5 transition-all duration-200 hover:opacity-90"
                style={{
                  background: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(255,255,255,0.12)",
                  color: "rgba(255,255,255,0.75)",
                  borderRadius: 999,
                }}
              >
                Go home →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
