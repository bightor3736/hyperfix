import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "404 — Not found · Hyperfix",
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return (
    <main
      className="min-h-screen flex flex-col"
      style={{ background: "#080808", color: "#F4F4F4" }}
    >
      {/* Top-left logo */}
      <div className="p-6">
        <Link
          href="/"
          className="font-display font-bold text-lg tracking-tight transition-opacity hover:opacity-70"
          style={{ color: "#F4F4F4", letterSpacing: "-0.03em" }}
        >
          Hyperfix
        </Link>
      </div>

      {/* Center content */}
      <div className="flex-1 flex items-center justify-center px-6">
        <div className="text-center">
          {/* Giant 404 outline */}
          <p
            className="font-display font-black leading-none select-none"
            style={{
              fontSize: "clamp(120px, 25vw, 220px)",
              color: "transparent",
              WebkitTextStroke: "1px rgba(163,230,53,0.3)",
              letterSpacing: "-0.05em",
            }}
          >
            404
          </p>

          {/* Heading */}
          <h1
            className="font-display italic font-medium mt-2"
            style={{
              color: "#F4F4F4",
              fontSize: "clamp(24px, 5vw, 40px)",
              letterSpacing: "-0.02em",
            }}
          >
            This fix doesn&apos;t exist.
          </h1>

          {/* Subtext */}
          <p
            className="font-mono mt-3 text-[12px] uppercase tracking-widest"
            style={{ color: "rgba(244,244,244,0.3)" }}
          >
            It may have ended, or it never started.
          </p>

          {/* CTA */}
          <div className="mt-8">
            <Link
              href="/"
              className="inline-block rounded-xl px-6 py-3 font-sans text-sm font-bold transition-all hover:opacity-90 active:scale-[0.98]"
              style={{ background: "#A3E635", color: "#0A0A0A" }}
            >
              Go home →
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
