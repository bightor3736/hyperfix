"use client";

import { useEffect } from "react";

/**
 * Feeds the cursor position into every `.brutal-btn` as --mx/--my so the
 * CSS glow (globals.css) can follow the pointer inside the button.
 * One delegated listener for the whole app; renders nothing.
 */
export function CursorGlow() {
  useEffect(() => {
    function onMove(e: PointerEvent) {
      const btn = (e.target as Element | null)?.closest?.(".brutal-btn") as HTMLElement | null;
      if (!btn) return;
      const r = btn.getBoundingClientRect();
      btn.style.setProperty("--mx", `${e.clientX - r.left}px`);
      btn.style.setProperty("--my", `${e.clientY - r.top}px`);
    }
    document.addEventListener("pointermove", onMove, { passive: true });
    return () => document.removeEventListener("pointermove", onMove);
  }, []);

  return null;
}
