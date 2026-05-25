"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";

export function AffTracker() {
  const params = useSearchParams();

  useEffect(() => {
    const aff = params.get("aff");
    if (aff) {
      try {
        localStorage.setItem("hf_aff", aff);
        // Clean URL without reload
        const url = new URL(window.location.href);
        url.searchParams.delete("aff");
        window.history.replaceState({}, "", url.toString());
      } catch {}
    }
  }, [params]);

  return null;
}
