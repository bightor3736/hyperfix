"use client";

import { useState } from "react";

export function UnsubscribeForm({ email: prefillEmail }: { email?: string }) {
  const [email, setEmail] = useState(prefillEmail ?? "");
  const [status, setStatus] = useState<"idle" | "pending" | "done" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;
    setStatus("pending");
    setErrorMsg(null);
    try {
      const res = await fetch("/api/unsubscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (res.ok) {
        setStatus("done");
      } else {
        const json = await res.json().catch(() => ({}));
        setErrorMsg(json.error ?? "Something went wrong.");
        setStatus("error");
      }
    } catch {
      setErrorMsg("Network error — please try again.");
      setStatus("error");
    }
  }

  if (status === "done") {
    return (
      <div
        className="px-6 py-5 text-left"
        style={{ background: "var(--fill)", border: "1px solid var(--line)", borderRadius: 16 }}
      >
        <p className="uppercase mb-1" style={{ fontSize: 11, fontWeight: 600, letterSpacing: "3px", color: "var(--ink-muted)" }}>done</p>
        <p className="font-sans text-sm" style={{ color: "var(--ink-muted)" }}>
          You&apos;ve been unsubscribed ✓. If you signed up with an account, you can manage notification preferences in settings.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3 max-w-sm mx-auto">
      {errorMsg && (
        <p className="font-mono text-[11px] uppercase tracking-widest" style={{ color: "#E5484D" }}>
          {errorMsg}
        </p>
      )}
      <input
        type="email"
        name="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="your@email.com"
        disabled={status === "pending" || !!prefillEmail}
        className="w-full px-4 py-3.5 font-mono text-sm focus:outline-none focus:ring-1 transition-colors disabled:opacity-60"
        style={{
          background: "var(--fill)",
          border: "1px solid var(--line)",
          borderRadius: 10,
          color: "var(--ink)",
        }}
      />
      <button
        type="submit"
        disabled={status === "pending"}
        className="w-full px-6 py-3.5 text-sm transition-all hover:opacity-90 active:scale-[0.98] disabled:opacity-60"
        style={{
          background: "var(--accent)",
          borderRadius: 9999,
          color: "#fff",
          fontWeight: 600,
        }}
      >
        {status === "pending" ? "Unsubscribing…" : "Unsubscribe from all emails"}
      </button>
    </form>
  );
}
