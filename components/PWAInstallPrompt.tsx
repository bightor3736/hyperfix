"use client";

import { useState, useEffect } from "react";
import { AppIcon } from "@/components/Logo";
import { X, Share, Plus } from "lucide-react";

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

const DISMISS_KEY = "pwa-dismissed";

/**
 * Add-to-home-screen nudge. Being present on the lock screen is core to ADHD
 * habit formation, so we surface this for logged-in users.
 *
 * - Android / Chrome: uses the native `beforeinstallprompt` (one-tap Add).
 * - iOS Safari: no programmatic prompt exists, so we show the manual
 *   "Share → Add to Home Screen" steps (otherwise iOS users — a big slice of
 *   the audience — never get the install path).
 * - Already installed (standalone) or previously dismissed: stays hidden.
 */
export function PWAInstallPrompt() {
  const [prompt, setPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [show, setShow] = useState(false);
  const [isIOS, setIsIOS] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (localStorage.getItem(DISMISS_KEY)) return;

    // Already running as an installed app? Don't nudge.
    const standalone =
      window.matchMedia?.("(display-mode: standalone)").matches ||
      (window.navigator as Navigator & { standalone?: boolean }).standalone === true;
    if (standalone) return;

    const ua = window.navigator.userAgent;
    const ios = /iphone|ipad|ipod/i.test(ua) && !/crios|fxios/i.test(ua);

    const handler = (e: Event) => {
      e.preventDefault();
      setPrompt(e as BeforeInstallPromptEvent);
      setShow(true);
    };
    window.addEventListener("beforeinstallprompt", handler);

    // iOS never fires beforeinstallprompt — show the manual hint after a beat
    // so it doesn't slam in on first paint.
    let t: ReturnType<typeof setTimeout> | null = null;
    if (ios) {
      setIsIOS(true);
      t = setTimeout(() => setShow(true), 2500);
    }

    return () => {
      window.removeEventListener("beforeinstallprompt", handler);
      if (t) clearTimeout(t);
    };
  }, []);

  if (!show) return null;

  async function handleInstall() {
    if (!prompt) return;
    await prompt.prompt();
    const { outcome } = await prompt.userChoice;
    if (outcome === "accepted") setShow(false);
    setPrompt(null);
  }

  function handleDismiss() {
    setShow(false);
    try {
      localStorage.setItem(DISMISS_KEY, "1");
    } catch {
      /* storage blocked — fine */
    }
  }

  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-50 px-4 pb-4 lg:left-60"
      style={{ paddingBottom: "calc(5.5rem + env(safe-area-inset-bottom))" }}
    >
      <div
        className="mx-auto flex max-w-sm items-center gap-3.5 p-4 anim-fadeUp"
        style={{
          background: "rgba(10,10,10,0.95)",
          border: "1px solid rgba(255,255,255,0.08)",
          borderRadius: 16,
          boxShadow: "var(--shadow-lg)",
        }}
      >
        <div className="shrink-0">
          <AppIcon size={44} />
        </div>

        <div className="min-w-0 flex-1">
          <p className="text-[14px] font-semibold leading-tight" style={{ color: "#ffffff" }}>Put Hyperfix on your home screen</p>
          {isIOS ? (
            <p className="mt-0.5 inline-flex flex-wrap items-center gap-1 text-[12px] font-medium" style={{ color: "rgba(255,255,255,0.55)" }}>
              Tap <Share size={13} strokeWidth={2.5} className="inline" /> then
              <span className="font-semibold" style={{ color: "#ffffff" }}>Add to Home Screen</span>
            </p>
          ) : (
            <p className="mt-0.5 uppercase" style={{ fontSize: 10, fontWeight: 600, letterSpacing: "0.08em", color: "rgba(255,255,255,0.35)" }}>
              One tap · no app store · reminders on
            </p>
          )}
        </div>

        {!isIOS && (
          <button
            onClick={handleInstall}
            className="brutal-btn shrink-0 px-3.5 py-2 text-[13px]"
            style={{ background: "#ffffff", color: "#000000", fontWeight: 600, borderRadius: 10 }}
          >
            <Plus size={14} strokeWidth={3} /> Add
          </button>
        )}
        <button
          onClick={handleDismiss}
          aria-label="Dismiss"
          className="shrink-0 text-ink-faint transition-opacity hover:opacity-70"
        >
          <X size={18} strokeWidth={2.5} />
        </button>
      </div>
    </div>
  );
}
