"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

const STORAGE_KEY = "hyperfix_onboarded";

export function OnboardingModal({ totalFixes }: { totalFixes: number }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (totalFixes > 0) return;
    try {
      if (!localStorage.getItem(STORAGE_KEY)) {
        setVisible(true);
      }
    } catch {
      // localStorage unavailable
    }
  }, [totalFixes]);

  function dismiss() {
    try {
      localStorage.setItem(STORAGE_KEY, "1");
    } catch {}
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.75)", backdropFilter: "blur(8px)" }}
    >
      <div
        className="w-full max-w-md rounded-3xl p-7 flex flex-col gap-5 relative"
        style={{
          background: "#111113",
          border: "1px solid rgba(168,85,247,0.2)",
          boxShadow: "0 0 60px rgba(168,85,247,0.15), 0 24px 60px rgba(0,0,0,0.7)",
        }}
      >
        {/* Ambient glow */}
        <div
          className="absolute inset-x-0 top-0 h-32 rounded-t-3xl pointer-events-none"
          style={{ background: "radial-gradient(ellipse 80% 60% at 50% 0%, rgba(168,85,247,0.12), transparent)" }}
        />

        <div className="relative text-center">
          <p className="font-mono text-[10px] uppercase tracking-widest mb-4" style={{ color: "#A855F7" }}>
            welcome to hyperfix
          </p>
          <h2
            className="font-display font-bold leading-tight mb-2"
            style={{ color: "#F4F4F4", fontSize: "clamp(24px, 5vw, 32px)", letterSpacing: "-0.03em" }}
          >
            What are you unwell about?
          </h2>
          <p className="font-sans text-sm leading-relaxed" style={{ color: "rgba(244,244,244,0.5)" }}>
            Log your first fix — a song on loop, a fic you can&rsquo;t quit,
            a show that has you. Start the day counter. Mourn it when it ends.
          </p>
        </div>

        <div className="flex flex-col gap-2 relative">
          <Link
            href="/dashboard/new"
            onClick={dismiss}
            className="w-full py-3.5 rounded-2xl font-sans text-sm font-bold text-center transition-all hover:opacity-90 active:scale-[0.98]"
            style={{ background: "#A855F7", color: "#0A0A0A" }}
          >
            Log my first fix →
          </Link>
          <Link
            href="/explore"
            onClick={dismiss}
            className="w-full py-3 rounded-2xl font-sans text-sm font-medium text-center transition-all hover:opacity-80"
            style={{
              background: "rgba(244,244,244,0.05)",
              border: "1px solid rgba(244,244,244,0.1)",
              color: "rgba(244,244,244,0.55)",
            }}
          >
            Browse what others are tracking
          </Link>
        </div>

        <button
          onClick={dismiss}
          className="absolute top-4 right-4 p-1.5 rounded-lg transition-opacity hover:opacity-60"
          style={{ color: "rgba(244,244,244,0.3)" }}
          aria-label="Dismiss"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      </div>
    </div>
  );
}
