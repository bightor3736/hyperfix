"use client";

import { useEffect } from "react";
import Link from "next/link";

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
    <main className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12 relative" style={{ background: "#000000" }}>
      <div className="relative max-w-2xl w-full">
        <div
          className="relative overflow-hidden p-8 sm:p-14 text-center anim-fadeUp"
          style={{
            background: "rgba(255,255,255,0.03)",
            border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: 16,
          }}
        >
          <div className="relative">
            <span
              className="inline-flex items-center uppercase mb-5"
              style={{ fontSize: 11, fontWeight: 600, letterSpacing: "3px", color: "rgba(255,255,255,0.35)" }}
            >
              Error
            </span>
            <h1 className="anim-fadeUp delay-100" style={{ color: "#ffffff", fontSize: "clamp(40px, 7vw, 64px)", lineHeight: 1.02, letterSpacing: "-0.025em", fontWeight: 500 }}>
              Something{" "}
              <span style={{ fontFamily: "var(--font-serif-display, 'Instrument Serif', serif)", fontStyle: "italic", fontWeight: 400 }}>
                broke.
              </span>
            </h1>
            <p className="mt-5 text-base sm:text-lg max-w-md mx-auto anim-fadeUp delay-200" style={{ color: "rgba(255,255,255,0.55)" }}>
              We logged it. Try again or go home.
            </p>

            <div className="mt-7 flex flex-col sm:flex-row gap-3 justify-center anim-fadeUp delay-300">
              <button
                onClick={reset}
                className="inline-flex items-center justify-center gap-2 text-sm font-semibold px-6 py-3.5 transition-all duration-200 hover:opacity-95 hover:-translate-y-px active:scale-[0.98]"
                style={{
                  background: "#ffffff",
                  color: "#000000",
                  fontWeight: 600,
                  borderRadius: 9999,
                }}
              >
                Try again
              </button>
              <Link
                href="/"
                className="liquid-glass inline-flex items-center justify-center gap-2 text-sm font-semibold px-6 py-3.5 transition-all duration-200 hover:opacity-90"
                style={{
                  color: "#ffffff",
                  borderRadius: 9999,
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
