"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { CloseSquare } from "react-iconly";

const STORAGE_KEY = "hyperfix_onboarded";

const NOISE_URL =
  "url(\"data:image/svg+xml;utf8,<svg viewBox='0 0 240 240' xmlns='http://www.w3.org/2000/svg'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 0.55 0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>\")";

export function OnboardingModal({ totalFixes }: { totalFixes: number }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (totalFixes > 0) return;
    try {
      if (!localStorage.getItem(STORAGE_KEY)) {
        setVisible(true);
      }
    } catch {
      /* localStorage unavailable */
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
      className="fixed inset-0 z-50 flex items-center justify-center p-4 anim-fadeIn"
      style={{ background: "rgba(0,0,0,0.78)", backdropFilter: "blur(10px)" }}
    >
      <div
        className="relative overflow-hidden w-full max-w-md rounded-3xl p-8 flex flex-col gap-6 anim-scaleIn"
        style={{
          background:
            "radial-gradient(ellipse 110% 90% at 50% 115%, #5EEAD4 0%, #2DD4BF 14%, #0E4F47 36%, #08231F 58%, #0F1011 82%)",
          border: "1px solid rgba(94,234,212,0.20)",
          boxShadow: "0 32px 80px rgba(0,0,0,0.7), 0 0 80px rgba(94,234,212,0.20)",
        }}
      >
        <div
          aria-hidden
          className="absolute inset-0 pointer-events-none mix-blend-overlay"
          style={{ backgroundImage: NOISE_URL, backgroundSize: "200px 200px", opacity: 0.55 }}
        />
        <div
          aria-hidden
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "linear-gradient(180deg, #0F1011 0%, rgba(15,16,17,0.45) 30%, transparent 100%)",
          }}
        />

        <button
          onClick={dismiss}
          className="absolute top-4 right-4 p-2 rounded-full transition-opacity hover:opacity-70 z-10"
          style={{
            background: "rgba(255,255,255,0.08)",
            color: "rgba(255,255,255,0.55)",
            border: "1px solid rgba(255,255,255,0.10)",
          }}
          aria-label="Dismiss"
        >
          <CloseSquare set="light" size={16} primaryColor="currentColor" />
        </button>

        <div className="relative text-center">
          <span
            className="inline-flex items-center font-sans text-xs rounded-full px-3 py-1 mb-5 anim-fadeUp delay-100"
            style={{
              background: "rgba(94,234,212,0.12)",
              color: "#5EEAD4",
              border: "1px solid rgba(94,234,212,0.30)",
            }}
          >
            welcome to hyperfix
          </span>
          <h2
            className="font-display anim-fadeUp delay-200"
            style={{
              color: "#FFFFFF",
              fontSize: "clamp(26px, 5vw, 32px)",
              letterSpacing: "-0.02em",
              fontWeight: 600,
              lineHeight: 1.08,
            }}
          >
            What are you
            <br />
            obsessed with?
          </h2>
          <p className="mt-4 font-sans text-base leading-relaxed anim-fadeUp delay-300" style={{ color: "rgba(255,255,255,0.72)" }}>
            Log your first fix — a song on loop, a fic you can&apos;t quit, a show
            that has you. Start the counter. Mourn it when it ends.
          </p>
        </div>

        <div className="relative flex flex-col gap-2.5 anim-fadeUp delay-400">
          <Link
            href="/dashboard/new"
            onClick={dismiss}
            className="w-full py-3.5 rounded-full font-sans text-sm font-semibold text-center transition-all duration-200 hover:opacity-95 hover:-translate-y-px active:scale-[0.98]"
            style={{
              background: "#FFFFFF",
              color: "#0A0A0A",
              boxShadow:
                "0 1px 0 0 rgba(255,255,255,0.5) inset, 0 12px 36px rgba(0,0,0,0.4), 0 0 40px rgba(94,234,212,0.30)",
            }}
          >
            Log my first fix →
          </Link>
          <Link
            href="/explore"
            onClick={dismiss}
            className="w-full py-3.5 rounded-full font-sans text-sm text-center transition-all hover:bg-white/[0.06]"
            style={{
              color: "rgba(255,255,255,0.75)",
              border: "1px solid rgba(255,255,255,0.12)",
            }}
          >
            Browse what others are tracking
          </Link>
        </div>
      </div>
    </div>
  );
}
