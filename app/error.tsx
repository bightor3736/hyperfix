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
    <main
      className="min-h-screen flex flex-col items-center justify-center px-6"
      style={{ background: "#080808", color: "#F4F4F4" }}
    >
      <div className="text-center max-w-lg">
        {/* Heading */}
        <h1
          className="font-display font-bold leading-tight"
          style={{
            color: "#F4F4F4",
            fontSize: "clamp(36px, 8vw, 64px)",
            letterSpacing: "-0.03em",
          }}
        >
          Something broke.
        </h1>

        {/* Subtext */}
        <p
          className="mt-4 font-sans text-sm"
          style={{ color: "rgba(244,244,244,0.4)" }}
        >
          We logged it. Try again or go home.
        </p>

        {/* Actions */}
        <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={reset}
            className="rounded-xl px-6 py-3 font-sans text-sm font-bold transition-all hover:opacity-90 active:scale-[0.98]"
            style={{ background: "#A3E635", color: "#0A0A0A" }}
          >
            Try again
          </button>
          <Link
            href="/"
            className="rounded-xl px-6 py-3 font-sans text-sm font-medium transition-all hover:opacity-80"
            style={{
              background: "rgba(244,244,244,0.06)",
              border: "1px solid rgba(244,244,244,0.1)",
              color: "rgba(244,244,244,0.6)",
            }}
          >
            Go home →
          </Link>
        </div>
      </div>
    </main>
  );
}
