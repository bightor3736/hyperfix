"use client";

import { useState, useEffect } from "react";

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

export function PWAInstallPrompt() {
  const [prompt, setPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [show, setShow] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (localStorage.getItem("pwa-dismissed")) return;

    const handler = (e: Event) => {
      e.preventDefault();
      setPrompt(e as BeforeInstallPromptEvent);
      setShow(true);
    };
    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  if (!show || dismissed) return null;

  async function handleInstall() {
    if (!prompt) return;
    await prompt.prompt();
    const { outcome } = await prompt.userChoice;
    if (outcome === "accepted") setShow(false);
    setPrompt(null);
  }

  function handleDismiss() {
    setDismissed(true);
    setShow(false);
    localStorage.setItem("pwa-dismissed", "1");
  }

  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-50 px-4 pb-4"
      style={{ paddingBottom: "calc(1rem + env(safe-area-inset-bottom))" }}
    >
      <div
        className="max-w-sm mx-auto rounded-2xl p-4 flex items-center gap-4"
        style={{
          background: "#1C1C1E",
          border: "1px solid rgba(94,234,212,0.2)",
          boxShadow: "0 8px 32px rgba(0,0,0,0.5)",
        }}
      >
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 font-display font-black text-sm"
          style={{ background: "#5EEAD4", color: "#0A0A0A" }}
        >
          hf
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-sans text-sm font-semibold" style={{ color: "#F4F4F4" }}>
            Add Hyperfix to home screen
          </p>
          <p className="font-mono text-[10px] uppercase tracking-widest" style={{ color: "rgba(244,244,244,0.4)" }}>
            quick access · no app store needed
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={handleInstall}
            className="px-3 py-1.5 rounded-full font-sans text-xs font-bold transition-all hover:opacity-90"
            style={{ background: "#5EEAD4", color: "#0A0A0A" }}
          >
            Add
          </button>
          <button
            onClick={handleDismiss}
            className="w-7 h-7 flex items-center justify-center rounded-full transition-all hover:bg-[rgba(244,244,244,0.08)]"
            style={{ color: "rgba(244,244,244,0.3)" }}
            aria-label="Dismiss"
          >
            ✕
          </button>
        </div>
      </div>
    </div>
  );
}
