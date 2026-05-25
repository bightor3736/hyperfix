"use client";

import React, { createContext, useContext, useState, useCallback, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { TickSquare, CloseSquare, InfoCircle } from "react-iconly";

type ToastType = "success" | "error" | "info";

interface ToastItem {
  id: string;
  message: string;
  type: ToastType;
  visible: boolean;
}

interface ToastContextValue {
  toast: (opts: { message: string; type?: ToastType }) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

const NOOP_TOAST: ToastContextValue = { toast: () => {} };

export function useToast() {
  const ctx = useContext(ToastContext);
  // Gracefully degrade outside a ToastProvider (e.g. on public pages that
  // share components with the dashboard) instead of throwing.
  return ctx ?? NOOP_TOAST;
}

function ToastIcon({ type }: { type: ToastType }) {
  if (type === "success") return <TickSquare set="bold" size={16} primaryColor="#5EEAD4" />;
  if (type === "error") return <CloseSquare set="bold" size={16} primaryColor="#f87171" />;
  return <InfoCircle set="light" size={16} primaryColor="rgba(244,244,244,0.7)" />;
}

function ToastBorderColor(type: ToastType) {
  if (type === "success") return "rgba(94,234,212,0.4)";
  if (type === "error") return "rgba(248,113,113,0.4)";
  return "rgba(244,244,244,0.15)";
}

function SingleToast({ item, onDismiss }: { item: ToastItem; onDismiss: (id: string) => void }) {
  return (
    <div
      onClick={() => onDismiss(item.id)}
      className="flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer select-none"
      style={{
        background: "rgba(17,17,19,0.95)",
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
        border: `1px solid ${ToastBorderColor(item.type)}`,
        boxShadow: "0 8px 32px rgba(0,0,0,0.5), 0 2px 8px rgba(0,0,0,0.3)",
        animation: item.visible
          ? "toast-in 0.3s cubic-bezier(0.2,0.6,0.2,1) both"
          : "toast-out 0.25s cubic-bezier(0.4,0,1,1) both",
        maxWidth: 360,
        minWidth: 220,
      }}
    >
      <ToastIcon type={item.type} />
      <span className="font-sans text-sm" style={{ color: "#F4F4F4" }}>
        {item.message}
      </span>
    </div>
  );
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const [mounted, setMounted] = useState(false);
  const timers = useRef<Map<string, ReturnType<typeof setTimeout>>>(new Map());

  useEffect(() => {
    setMounted(true);
    return () => {
      timers.current.forEach((t) => clearTimeout(t));
    };
  }, []);

  const dismiss = useCallback((id: string) => {
    setToasts((prev) =>
      prev.map((t) => (t.id === id ? { ...t, visible: false } : t))
    );
    const removeTimer = setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 300);
    timers.current.set(id + "_remove", removeTimer);
  }, []);

  const toast = useCallback(({ message, type = "info" }: { message: string; type?: ToastType }) => {
    const id = Math.random().toString(36).slice(2);
    setToasts((prev) => [...prev, { id, message, type, visible: true }]);

    const autoTimer = setTimeout(() => dismiss(id), 3000);
    timers.current.set(id, autoTimer);
  }, [dismiss]);

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      {mounted && createPortal(
        <div
          className="fixed bottom-6 right-6 z-[9999] flex flex-col gap-2 items-end pointer-events-none"
          aria-live="polite"
          aria-label="Notifications"
        >
          {toasts.map((item) => (
            <div key={item.id} className="pointer-events-auto">
              <SingleToast item={item} onDismiss={dismiss} />
            </div>
          ))}
        </div>,
        document.body
      )}
    </ToastContext.Provider>
  );
}
