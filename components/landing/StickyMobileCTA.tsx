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
      className={`fixed inset-x-0 bottom-0 z-50 px-4 pb-4 pt-3 transition-all duration-300 sm:hidden ${
        show ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-full opacity-0"
      }`}
      style={{
        background: "linear-gradient(to top, var(--bg) 70%, transparent)",
        paddingBottom: "calc(1rem + env(safe-area-inset-bottom))",
      }}
    >
      <a
        href="/auth/signup"
        className="press-pop flex w-full items-center justify-center gap-2 rounded-[var(--radius-lg)] py-3.5 font-sans text-[16px] font-bold"
        style={{ background: "var(--energy)", color: "#fff" }}
      >
        <Zap size={18} strokeWidth={2.5} fill="#fff" />
        Start playing — free
      </a>
    </div>
  );
}
