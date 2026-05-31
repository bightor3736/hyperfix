"use client";

import { OAuthButtons } from "./OAuthButtons";
import { InteractiveHeroDemo } from "@/components/InteractiveHeroDemo";

export function Hero() {
  return (
    <section className="relative overflow-hidden">
      {/* Warm paper texture tint */}
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "radial-gradient(ellipse 80% 60% at 50% 0%, var(--accent-soft) 0%, transparent 70%)",
          opacity: 0.5,
        }}
      />

      <div className="relative mx-auto max-w-[1200px] px-6 pt-16 pb-12 sm:px-10 sm:pt-20 sm:pb-16 text-center">
        {/* Eyebrow */}
        <div
          className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 mb-8 text-[13px] font-medium"
          style={{ background: "var(--accent-soft)", color: "var(--accent)", border: "1px solid var(--accent)" }}
        >
          <span className="relative flex h-1.5 w-1.5">
            <span className="absolute inline-flex h-full w-full rounded-full opacity-60 anim-glowPulse" style={{ background: "var(--accent)" }} />
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full" style={{ background: "var(--accent)" }} />
          </span>
          Free forever · no nag screen
        </div>

        <h1
          className="font-display mx-auto max-w-[820px]"
          style={{
            fontSize: "clamp(44px, 7vw, 80px)",
            lineHeight: 1.02,
            letterSpacing: "-0.02em",
            color: "var(--ink)",
          }}
        >
          A journal for
          <br />
          your obsession.
        </h1>

        <p
          className="mt-6 mx-auto max-w-[480px] text-[17px] leading-[1.6]"
          style={{ color: "var(--ink-muted)" }}
        >
          Log it. Count the days. Mourn it when it ends.
          <br />
          Built for ADHD brains.
        </p>

        <div className="mt-9 flex justify-center">
          <div className="w-full max-w-[400px]">
            <OAuthButtons />
            <p className="mt-4 text-[13px]" style={{ color: "var(--ink-faint)" }}>
              30 seconds to day one ·{" "}
              <span style={{ color: "var(--accent)" }}>no credit card</span>
            </p>
          </div>
        </div>
      </div>

      {/* Interactive demo — always dark, dramatic contrast */}
      <div className="pb-4 px-4 sm:px-6">
        <div id="try">
          <InteractiveHeroDemo />
        </div>
      </div>
    </section>
  );
}
