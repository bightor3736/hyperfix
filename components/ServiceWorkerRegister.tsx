"use client";

import { useEffect } from "react";

export function ServiceWorkerRegister() {
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!("serviceWorker" in navigator)) return;

    const register = async () => {
      try {
        await navigator.serviceWorker.register("/sw.js", { scope: "/" });
      } catch (err) {
        // Service worker registration failures shouldn't break the app.
        // eslint-disable-next-line no-console
        console.warn("[sw] registration failed", err);
      }
    };

    register();
  }, []);

  return null;
}

export default ServiceWorkerRegister;
