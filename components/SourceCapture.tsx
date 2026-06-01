"use client";

import { useEffect } from "react";

/**
 * First-touch attribution. On first landing, reads ?ref / ?src / utm_*
 * from the URL and stores them in a 90-day cookie (`hf_src`). The cookie
 * survives the OAuth round-trip, and /auth/callback persists it to the
 * profile once, at account creation. Never overwrites an existing touch.
 */
export function SourceCapture() {
  useEffect(() => {
    if (document.cookie.includes("hf_src=")) return; // first-touch only

    const p = new URLSearchParams(window.location.search);
    const source =
      p.get("ref") || p.get("src") || p.get("utm_source") || "";
    const campaign =
      p.get("utm_campaign") || p.get("utm_medium") || "";

    if (!source && !campaign) return;

    const value = encodeURIComponent(
      JSON.stringify({
        source: source.slice(0, 60),
        campaign: campaign.slice(0, 60),
      })
    );
    const maxAge = 60 * 60 * 24 * 90; // 90 days
    document.cookie = `hf_src=${value}; path=/; max-age=${maxAge}; SameSite=Lax`;
  }, []);

  return null;
}
