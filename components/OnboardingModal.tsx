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
      style={{
        background: "rgba(7,7,8,0.85)",
        backdropFilter: "blur(8px)",
        WebkitBackdropFilter: "blur(8px)",
      }}
    >
      <div
        className="relative w-full max-w-md rounded-3xl p-8 flex flex-col gap-7 anim-scaleIn"
        style={{
          background: "var(--bg)",
          border: "1px solid var(--accent)",
          boxShadow:
            "0 32px 80px rgba(0,0,0,0.7), 0 0 60px var(--accent-soft)",
        }}
      >
        <div>
          <h2
            className="font-display"
            style={{
              color: "var(--ink)",
              fontSize: "clamp(28px, 5vw, 36px)",
              letterSpacing: "-0.02em",
              fontWeight: 600,
              lineHeight: 1.05,
            }}
          >
            Welcome to Hyperfix.
          </h2>
          <p
            className="mt-3 font-sans text-base leading-relaxed"
            style={{ color: "var(--ink-muted)" }}
          >
            Three steps to your first viral share card.
          </p>
        </div>

        <ol className="flex flex-col gap-5">
          <Step
            n={1}
            icon={<IconPencil />}
            title="Log what's taken over your brain"
            desc="Name it, pick a category, set intensity. 30 seconds."
          />
          <Step
            n={2}
            icon={<IconUpload />}
            title="Upload a banner image"
            desc="Album art, scene from the show, character art. Makes your card unique."
          />
          <Step
            n={3}
            icon={<IconDownload />}
            title="Download the share card"
            desc="1080×1920 PNG. Post to Stories. Watch the group chat lose it."
          />
        </ol>

        <div className="flex flex-col gap-3">
          <Link
            href="/dashboard/new"
            onClick={dismiss}
            className="w-full py-3.5 rounded-full font-sans text-sm font-semibold text-center transition-all duration-200 hover:opacity-95 hover:-translate-y-px active:scale-[0.98]"
            style={{
              background: "var(--ink)",
              color: "var(--bg)",
            }}
          >
            Log my first fix
          </Link>
          <button
            type="button"
            onClick={dismiss}
            className="w-full font-sans text-sm text-center transition-colors hover:text-white"
            style={{ color: "var(--ink-muted)" }}
          >
            Skip
          </button>
        </div>
      </div>
    </div>
  );
}

function Step({
  n,
  icon,
  title,
  desc,
}: {
  n: number;
  icon: React.ReactNode;
  title: string;
  desc: string;
}) {
  return (
    <li className="flex items-start gap-4">
      <div
        className="flex-shrink-0 flex items-center justify-center rounded-full font-mono text-xs font-semibold"
        style={{
          width: 24,
          height: 24,
          background: "var(--accent-soft)",
          color: "var(--accent)",
          border: "1px solid rgba(111,138,99,0.25)",
        }}
      >
        {n}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span
            className="flex-shrink-0"
            style={{ color: "var(--accent)" }}
            aria-hidden
          >
            {icon}
          </span>
          <h3
            className="font-sans text-sm font-semibold"
            style={{ color: "var(--ink)", letterSpacing: "-0.01em" }}
          >
            {title}
          </h3>
        </div>
        <p
          className="mt-1 font-sans text-[13px] leading-relaxed"
          style={{ color: "var(--ink-muted)" }}
        >
          {desc}
        </p>
      </div>
    </li>
  );
}

function IconPencil() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 20h9" />
      <path d="M16.5 3.5a2.121 2.121 0 1 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
    </svg>
  );
}

function IconUpload() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="17 8 12 3 7 8" />
      <line x1="12" y1="3" x2="12" y2="15" />
    </svg>
  );
}

function IconDownload() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="7 10 12 15 17 10" />
      <line x1="12" y1="15" x2="12" y2="3" />
    </svg>
  );
}
