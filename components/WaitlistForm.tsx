"use client";

import { useActionState, useEffect, useState } from "react";
import { joinWaitlist, type WaitlistResult } from "@/app/actions/waitlist";

const ERROR_COPY: Record<string, string> = {
  invalid_email: "that doesn't look like a real email.",
  already_on_list: "you're already on the list. we see you.",
  server_error: "something broke on our end. try again in a sec.",
};

export default function WaitlistForm({
  variant = "light",
  id,
}: {
  variant?: "light" | "dark";
  id?: string;
}) {
  const [state, action, pending] = useActionState<WaitlistResult | null, FormData>(
    joinWaitlist,
    null
  );
  const [count, setCount] = useState<number | null>(null);

  useEffect(() => {
    fetch("/api/waitlist-count")
      .then((r) => r.json())
      .then((d) => setCount(d.count))
      .catch(() => {});
  }, []);

  if (state?.ok) {
    return (
      <div className="mt-10 max-w-md">
        <div
          className="rounded-[20px] border border-[var(--line)] p-6 sm:p-8"
          style={{ background: "#1C1C1E" }}
        >
          <span
            className="inline-flex items-center font-mono text-[10px] uppercase tracking-widest rounded-full px-3 py-1 mb-5"
            style={{ background: "var(--accent)", color: "var(--bg)", fontWeight: 800 }}
          >
            waitlist confirmed
          </span>
          <p className="font-display text-4xl sm:text-5xl leading-none tracking-tightest mb-2 text-[var(--ink)]">
            #{" "}
            <span className="text-accent tabular">
              {state.position.toLocaleString()}
            </span>
          </p>
          <p className="font-mono text-[11px] uppercase tracking-widest mt-3 text-[var(--ink-muted)]">
            in line · check your inbox
          </p>
          <p className="mt-3 font-display italic text-sm leading-snug text-[var(--ink-muted)]">
            first access goes out in waves. we'll email when it's your turn.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div id={id} className="mt-10">
      <form
        action={action}
        className="flex flex-col sm:flex-row gap-2 max-w-md"
      >
        <input
          type="email"
          name="email"
          required
          placeholder="your@email.com"
          aria-label="Email address"
          disabled={pending}
          className="flex-1 px-4 py-3.5 font-mono text-sm focus:outline-none transition-all duration-200 disabled:opacity-50 text-[var(--ink)] placeholder:text-[var(--ink-faint)] focus:ring-2 focus:ring-[var(--accent)]/40 focus:border-[rgba(111,138,99,0.3)] focus:-translate-y-px"
          style={{
            background: "#1C1C1E",
            border: "1px solid var(--line)",
            borderRadius: 20,
            boxShadow: "0 1px 0 0 transparent inset",
          }}
        />
        <button
          type="submit"
          disabled={pending}
          className="shrink-0 px-6 py-3.5 font-mono text-[11px] uppercase tracking-widest font-bold transition-all duration-200 disabled:opacity-50 active:scale-[0.98] hover:opacity-95 hover:-translate-y-px"
          style={{
            background: "var(--accent)",
            color: "var(--bg)",
            borderRadius: 999,
            boxShadow:
              "0 1px 0 0 var(--ink-muted) inset, 0 8px 28px rgba(111,138,99,0.2)",
          }}
        >
          {pending ? "adding you…" : "I'm obsessed, let me in →"}
        </button>
      </form>

      {state && !state.ok && (
        <p className="mt-3 font-mono text-[11px] uppercase tracking-widest text-accent">
          ✕ {ERROR_COPY[state.error] ?? ERROR_COPY.server_error}
        </p>
      )}

      {!state && (
        <p className="mt-3 font-mono text-[11px] uppercase tracking-widest text-[var(--ink-muted)]">
          <span className="text-accent pulse-dot">●</span>{" "}
          <span className="tabular">
            {count !== null ? count.toLocaleString() : "1,247"}
          </span>{" "}
          on the list · currently obsessed with something
        </p>
      )}
    </div>
  );
}
