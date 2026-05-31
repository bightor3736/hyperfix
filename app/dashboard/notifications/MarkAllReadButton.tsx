"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";

export function MarkAllReadButton({ hasUnread }: { hasUnread: boolean }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [done, setDone] = useState(false);

  if (!hasUnread || done) return null;

  function markAllRead() {
    startTransition(async () => {
      await fetch("/api/notifications", { method: "PATCH" });
      setDone(true);
      router.refresh();
    });
  }

  return (
    <button
      onClick={markAllRead}
      disabled={pending}
      className="font-mono text-[11px] uppercase tracking-widest rounded-full px-3.5 py-1.5 transition-opacity hover:opacity-80 disabled:opacity-50"
      style={{
        background: "var(--accent-soft)",
        border: "1px solid var(--accent-soft)",
        color: "var(--accent)",
      }}
    >
      {pending ? "…" : "Mark all read"}
    </button>
  );
}
