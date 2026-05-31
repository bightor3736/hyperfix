"use client";

import { useEffect, useRef, useState } from "react";
import type { TickerItem } from "./ActivityTicker";

const STORAGE_KEY = "hyperfix:activityTicker:dismissed";

export function ActivityTickerClient({ items }: { items: TickerItem[] }) {
  const [index, setIndex] = useState(0);
  const [visible, setVisible] = useState(true);
  const [dismissed, setDismissed] = useState(false);
  const [animState, setAnimState] = useState<"in" | "out">("in");
  const [hovered, setHovered] = useState(false);
  const hoveredRef = useRef(false);

  useEffect(() => {
    hoveredRef.current = hovered;
  }, [hovered]);

  useEffect(() => {
    try {
      if (sessionStorage.getItem(STORAGE_KEY) === "1") {
        setDismissed(true);
      }
    } catch {
      /* ignore */
    }
  }, []);

  useEffect(() => {
    if (dismissed || items.length <= 1) return;
    const tick = () => {
      if (hoveredRef.current) return;
      setAnimState("out");
      window.setTimeout(() => {
        setIndex((i) => (i + 1) % items.length);
        setAnimState("in");
      }, 300);
    };
    const interval = window.setInterval(tick, 5000);
    return () => window.clearInterval(interval);
  }, [dismissed, items.length]);

  if (dismissed || !visible || items.length === 0) return null;

  const item = items[index];
  const verb = item.type === "started" ? "just started tracking" : "just checked in on";

  const handleDismiss = () => {
    try {
      sessionStorage.setItem(STORAGE_KEY, "1");
    } catch {
      /* ignore */
    }
    setVisible(false);
    setDismissed(true);
  };

  return (
    <div
      role="status"
      aria-live="polite"
      className="hidden sm:flex fixed bottom-6 right-6 z-40"
      style={{ maxWidth: 320 }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div
        className="relative rounded-2xl p-3 flex items-start gap-3 transition-all duration-200"
        style={{
          background: "rgba(15,16,17,0.95)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          border: hovered
            ? "1px solid rgba(111,138,99,0.3)"
            : "1px solid var(--accent)",
          boxShadow: "0 8px 32px rgba(0,0,0,0.5)",
          width: 320,
        }}
      >
        {/* Avatar dot with letter + pulse */}
        <div className="relative shrink-0 mt-0.5">
          <div
            className="flex items-center justify-center rounded-full font-mono font-bold"
            style={{
              width: 32,
              height: 32,
              background: "var(--accent-soft)",
              border: "1px solid var(--accent)",
              color: "var(--accent)",
              fontSize: 12,
            }}
          >
            {item.initial}
          </div>
          {/* Pulse indicator SVG */}
          <span
            aria-hidden
            className="absolute -top-0.5 -right-0.5 anim-glowPulse"
            style={{ width: 8, height: 8 }}
          >
            <svg viewBox="0 0 8 8" width="8" height="8">
              <circle cx="4" cy="4" r="3" fill="var(--accent)" />
              <circle
                cx="4"
                cy="4"
                r="3.5"
                fill="none"
                stroke="var(--accent)"
                strokeOpacity="0.5"
                strokeWidth="0.6"
              />
            </svg>
          </span>
        </div>

        {/* Content with slide+fade animation */}
        <div className="min-w-0 flex-1 overflow-hidden">
          <div
            key={item.id}
            style={{
              transition: "opacity 300ms ease, transform 300ms ease",
              opacity: animState === "in" ? 1 : 0,
              transform: animState === "in" ? "translateY(0)" : "translateY(6px)",
            }}
          >
            <p
              className="font-sans text-[12px] leading-tight"
              style={{ color: "var(--ink-muted)" }}
            >
              <span style={{ color: "var(--ink)" }}>{item.initial}</span> {verb}
            </p>
            <p
              className="font-sans text-[13px] font-medium mt-0.5 truncate"
              style={{ color: "var(--accent)", letterSpacing: "-0.005em" }}
              title={item.title}
            >
              &ldquo;{item.title}&rdquo;
            </p>
            <p
              className="font-mono text-[10px] mt-1"
              style={{ color: "var(--ink-muted)" }}
            >
              {item.timeAgo}
            </p>
          </div>
        </div>

        {/* Dismiss button — visible on hover */}
        {hovered && (
          <button
            type="button"
            aria-label="Dismiss activity ticker"
            onClick={handleDismiss}
            className="absolute -top-2 -right-2 flex items-center justify-center rounded-full transition-all hover:scale-110"
            style={{
              width: 20,
              height: 20,
              background: "var(--bg)",
              border: "1px solid rgba(111,138,99,0.3)",
              color: "var(--ink-muted)",
            }}
          >
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 6 6 18M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
}
