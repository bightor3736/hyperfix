"use client";

import { useEffect, useState } from "react";
import { Zap } from "lucide-react";

/** Sticky bottom CTA on mobile — appears after scrolling past the hero. */
export function StickyMobileCTA() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 600);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      className={`fixed inset-x-0 bottom-0 z-50 px-4 pb-4 pt-3 transition-transform duration-200 sm:hidden ${
        show ? "translate-y-0" : "pointer-events-none translate-y-full"
      }`}
      style={{
        background: "var(--bg)",
        borderTop: "1.5px solid var(--line-strong)",
        paddingBottom: "calc(1rem + env(safe-area-inset-bottom))",
      }}
    >
      <a
        href="/auth/signup"
        className="brutal-btn flex w-full items-center justify-center gap-2 py-3.5 text-[16px]"
        style={{ background: "var(--accent)", color: "var(--accent-ink)" }}
      >
        <Zap size={18} strokeWidth={3} fill="var(--accent-ink)" />
        Start playing — free
      </a>
    </div>
  );
}
