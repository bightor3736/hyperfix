"use client";

import { useCallback, useEffect, useState } from "react";

const cardStyle: React.CSSProperties = {
  background: "var(--bg)",
  border: "1px solid var(--line)",
};

function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const rawData = atob(base64);
  const output = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; i++) output[i] = rawData.charCodeAt(i);
  return output;
}

export function PushToggle() {
  const vapidPublic = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
  const supported =
    typeof window !== "undefined" &&
    "serviceWorker" in navigator &&
    "PushManager" in window &&
    "Notification" in window;

  const [enabled, setEnabled] = useState(false);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [ready, setReady] = useState(false);

  const refreshState = useCallback(async () => {
    if (!supported) {
      setReady(true);
      return;
    }
    try {
      const reg = await navigator.serviceWorker.getRegistration();
      if (!reg) {
        setEnabled(false);
        setReady(true);
        return;
      }
      const sub = await reg.pushManager.getSubscription();
      setEnabled(!!sub && Notification.permission === "granted");
    } catch {
      setEnabled(false);
    } finally {
      setReady(true);
    }
  }, [supported]);

  useEffect(() => {
    refreshState();
  }, [refreshState]);

  async function handleEnable() {
    if (!supported || !vapidPublic) return;
    setError(null);
    setPending(true);
    try {
      const permission = await Notification.requestPermission();
      if (permission !== "granted") {
        setError("Permission denied. Enable notifications in your browser settings.");
        return;
      }

      let reg = await navigator.serviceWorker.getRegistration();
      if (!reg) {
        reg = await navigator.serviceWorker.register("/sw.js", { scope: "/" });
      }
      await navigator.serviceWorker.ready;

      let sub = await reg.pushManager.getSubscription();
      if (!sub) {
        sub = await reg.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: urlBase64ToUint8Array(vapidPublic),
        });
      }

      const json = sub.toJSON();
      const res = await fetch("/api/push/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          endpoint: json.endpoint,
          keys: json.keys,
        }),
      });
      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        throw new Error(j.error ?? "Failed to save subscription.");
      }
      setEnabled(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to enable push.");
    } finally {
      setPending(false);
    }
  }

  async function handleDisable() {
    setError(null);
    setPending(true);
    try {
      const reg = await navigator.serviceWorker.getRegistration();
      const sub = await reg?.pushManager.getSubscription();
      const endpoint = sub?.endpoint;
      if (sub) {
        await sub.unsubscribe().catch(() => {});
      }
      if (endpoint) {
        await fetch("/api/push/unsubscribe", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ endpoint }),
        }).catch(() => {});
      }
      setEnabled(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to disable push.");
    } finally {
      setPending(false);
    }
  }

  const missingVapid = !vapidPublic;
  const disabled = missingVapid || !supported || pending || !ready;

  let buttonLabel = "Enable";
  if (pending) buttonLabel = "…";
  else if (missingVapid) buttonLabel = "Coming soon";
  else if (!supported) buttonLabel = "Unsupported";
  else if (enabled) buttonLabel = "On — Disable";

  const buttonStyle: React.CSSProperties = enabled
    ? {
        background: "var(--accent)",
        border: "1px solid rgba(111,138,99,0.3)",
        color: "var(--accent)",
      }
    : {
        background: "var(--line)",
        border: "1px solid var(--line)",
        color: "var(--ink-muted)",
      };

  return (
    <div className="flex flex-col gap-2 p-4 rounded-2xl mb-3" style={cardStyle}>
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="font-sans text-sm font-medium" style={{ color: "var(--ink)" }}>
            Push notifications
          </p>
          <p className="font-sans text-[12px] mt-0.5" style={{ color: "var(--ink-faint)" }}>
            {missingVapid
              ? "Push notifications coming soon."
              : !supported
                ? "This browser doesn't support push notifications."
                : "Daily check-in reminder on your phone."}
          </p>
        </div>
        <button
          type="button"
          onClick={enabled ? handleDisable : handleEnable}
          disabled={disabled}
          className="shrink-0 px-4 py-2 rounded-full font-sans text-xs font-medium transition-all hover:opacity-80 disabled:opacity-40"
          style={buttonStyle}
        >
          {buttonLabel}
        </button>
      </div>
      {error && (
        <p className="font-sans text-[12px]" style={{ color: "#fda4af" }}>
          {error}
        </p>
      )}
    </div>
  );
}

export default PushToggle;
