"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

export function ProUpgradeButton() {
  const [loading, setLoading] = useState(false);

  async function handleClick() {
    setLoading(true);
    try {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        window.location.href = "/auth/signup";
        return;
      }

      const res = await fetch("/api/stripe/checkout", { method: "POST" });
      const json = await res.json() as { url?: string; error?: string };

      if (res.status === 503) {
        // Stripe not configured yet — join waitlist instead
        window.location.href = "/#waitlist";
        return;
      }

      if (json.url) {
        window.location.href = json.url;
      } else {
        console.error("Checkout error:", json.error);
        setLoading(false);
      }
    } catch {
      setLoading(false);
    }
  }

  return (
    <button
      onClick={handleClick}
      disabled={loading}
      className="relative flex items-center justify-center font-sans text-sm font-semibold py-3.5 rounded-full transition-all hover:opacity-90 active:scale-[0.98] disabled:opacity-60"
      style={{ background: "var(--ink)", color: "#030603" }}
    >
      {loading ? "Loading…" : "Choose Plan"}
    </button>
  );
}
