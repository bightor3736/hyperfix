"use client";

import { track as vercelTrack } from "@vercel/analytics";

// Client-side event helper. Fires to BOTH:
//   1. Vercel Analytics custom events (for the dashboard you already have)
//   2. our first-party /api/track (for SQL funnel queries we fully own)
// Best-effort: never awaited at call sites, never throws.
export function track(event: string, props: Record<string, string | number | boolean> = {}): void {
  try {
    vercelTrack(event, props);
  } catch {
    /* ignore */
  }
  try {
    const payload = JSON.stringify({ event, props });
    // sendBeacon survives page navigation (e.g. clicking out to share / checkout).
    if (typeof navigator !== "undefined" && navigator.sendBeacon) {
      navigator.sendBeacon("/api/track", new Blob([payload], { type: "application/json" }));
    } else {
      fetch("/api/track", { method: "POST", body: payload, headers: { "Content-Type": "application/json" }, keepalive: true }).catch(() => {});
    }
  } catch {
    /* ignore */
  }
}
