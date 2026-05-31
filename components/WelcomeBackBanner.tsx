"use client";

import { useState, useEffect } from "react";

const STORAGE_KEY = "hyperfix_last_visit";
const DAYS_THRESHOLD = 5;

type Props = {
  firstName: string;
  activeCount: number;
};

export function WelcomeBackBanner({ firstName, activeCount }: Props) {
  const [show, setShow] = useState(false);
  const [daysSince, setDaysSince] = useState(0);

  useEffect(() => {
    try {
      const last = localStorage.getItem(STORAGE_KEY);
      const now = Date.now();
      if (last) {
        const diff = Math.floor((now - parseInt(last, 10)) / 86_400_000);
        if (diff >= DAYS_THRESHOLD) {
          setDaysSince(diff);
          setShow(true);
        }
      }
      localStorage.setItem(STORAGE_KEY, String(now));
    } catch {}
  }, []);

  if (!show) return null;

  const copy =
    daysSince >= 30
      ? "it's been a minute. your fixations have been holding down the fort."
      : daysSince >= 14
      ? "you're back. no shame — life happens. what's the brain on now?"
      : "hey, welcome back. your obsessions missed you.";

  return (
    <div
      className="relative overflow-hidden rounded-3xl p-5 sm:p-6 mb-6 anim-fadeUp"
      style={{
        background: "radial-gradient(ellipse 100% 200% at 50% 120%, var(--accent-soft) 0%, var(--accent-soft) 40%, var(--bg) 80%)",
        border: "1px solid var(--accent-soft)",
      }}
    >
      <button
        onClick={() => setShow(false)}
        className="absolute top-3 right-3 p-1.5 rounded-lg transition-opacity hover:opacity-70"
        style={{ color: "var(--ink-faint)" }}
        aria-label="Dismiss"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
          <path d="M18 6 6 18M6 6l12 12" />
        </svg>
      </button>

      <div className="flex items-start gap-4 pr-6">
        <span style={{ fontSize: 36, lineHeight: 1, flexShrink: 0 }}>👋</span>
        <div className="flex-1 min-w-0">
          <p
            className="font-display font-semibold leading-tight mb-1"
            style={{ color: "var(--ink)", fontSize: "clamp(18px, 4vw, 22px)", letterSpacing: "-0.02em" }}
          >
            welcome back{firstName && firstName !== "there" ? `, ${firstName}` : ""}.
          </p>
          <p className="font-sans text-sm" style={{ color: "var(--ink-muted)" }}>
            {copy}
          </p>
          {activeCount > 0 && (
            <p className="font-sans text-sm mt-1.5" style={{ color: "var(--accent)" }}>
              {activeCount} fixation{activeCount !== 1 ? "s" : ""} still going. pick up where you left off.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
