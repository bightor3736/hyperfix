"use client";

import { useState, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { LogoLockup } from "@/components/Logo";

type ValidationState = "idle" | "checking" | "available" | "taken" | "invalid";

const USERNAME_REGEX = /^[a-zA-Z0-9_]{3,20}$/;

const NOISE_URL =
  "url(\"data:image/svg+xml;utf8,<svg viewBox='0 0 240 240' xmlns='http://www.w3.org/2000/svg'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 0.55 0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>\")";

function debounce<T extends (...args: Parameters<T>) => void>(fn: T, delay: number) {
  let timer: ReturnType<typeof setTimeout>;
  return (...args: Parameters<T>) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}

export default function OnboardingUsernamePage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [validation, setValidation] = useState<ValidationState>("idle");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const checkUsername = useCallback(
    debounce(async (value: string) => {
      if (!USERNAME_REGEX.test(value)) { setValidation("invalid"); return; }
      setValidation("checking");
      try {
        const res = await fetch(`/api/username/check?u=${encodeURIComponent(value)}`);
        const data = (await res.json()) as { available: boolean };
        setValidation(data.available ? "available" : "taken");
      } catch { setValidation("idle"); }
    }, 400),
    []
  );

  useEffect(() => {
    if (username.length === 0) { setValidation("idle"); return; }
    checkUsername(username);
  }, [username, checkUsername]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (validation !== "available") return;
    setSubmitting(true);
    setError(null);

    const supabase = createClient();
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) { setError("Not signed in."); setSubmitting(false); return; }

    try {
      const res = await fetch("/api/username/set", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${session.access_token}` },
        body: JSON.stringify({ username }),
      });
      const data = (await res.json()) as { error?: string };
      if (!res.ok) { setError(data.error ?? "Something went wrong."); setSubmitting(false); return; }

      const refCode = typeof localStorage !== "undefined" ? localStorage.getItem("hyperfix_ref") : null;
      if (refCode) {
        fetch("/api/referral", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ code: refCode }) })
          .then(() => localStorage.removeItem("hyperfix_ref")).catch(() => {});
      }

      router.push("/onboarding/goals");
    } catch {
      setError("Network error. Please try again.");
      setSubmitting(false);
    }
  }

  const borderColor =
    validation === "available" ? "var(--accent)"
    : validation === "taken" || validation === "invalid" ? "rgba(248,113,113,0.4)"
    : "var(--line)";

  const feedbackColor =
    validation === "available" ? "var(--accent)"
    : validation === "taken" ? "#0a0a0a"
    : "#737373";

  const feedbackText =
    validation === "available" ? "Available"
    : validation === "taken" ? "Already taken"
    : validation === "invalid" ? "3–20 chars, letters / numbers / underscores"
    : "";

  const canSubmit = validation === "available" && !submitting;

  return (
    <div className="min-h-screen flex flex-col" style={{ background: "var(--bg)", color: "var(--ink)" }}>
      {/* Grain */}
      <div aria-hidden className="fixed inset-0 pointer-events-none mix-blend-overlay" style={{ backgroundImage: NOISE_URL, backgroundSize: "240px 240px", opacity: 0.08 }} />

      {/* Teal bloom — top center */}
      <div aria-hidden className="fixed top-0 left-1/2 -translate-x-1/2 pointer-events-none" style={{ width: 560, height: 320, background: "radial-gradient(ellipse at 50% 0%, rgba(45,212,191,0.22) 0%, transparent 70%)" }} />

      {/* Content */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-6 py-12">

        {/* Logo */}
        <a href="/" className="mb-10 inline-block transition-transform hover:scale-[1.02]">
          <LogoLockup size="sm" />
        </a>

        {/* Card */}
        <div
          className="w-full max-w-[380px] rounded-3xl p-8 anim-fadeUp"
          style={{
            background: "var(--bg)",
            border: "1px solid var(--line)",
            boxShadow: "0 32px 80px rgba(0,0,0,0.45), 0 0 60px var(--accent-soft)",
          }}
        >
          {/* Step indicator */}
          <div className="flex items-center gap-2 mb-7">
            <div className="h-1 w-8 rounded-full" style={{ background: "var(--accent)" }} />
            <div className="h-1 w-8 rounded-full" style={{ background: "var(--accent)" }} />
            <div className="h-1 w-8 rounded-full" style={{ background: "var(--line)" }} />
            <span className="ml-auto font-mono text-[10px] uppercase tracking-widest" style={{ color: "var(--ink-faint)" }}>step 2 of 3</span>
          </div>

          {/* Heading */}
          <span
            className="inline-flex items-center font-sans text-xs rounded-full px-3 py-1 mb-4"
            style={{ background: "var(--accent-soft)", color: "var(--accent)", border: "1px solid var(--accent)" }}
          >
            almost there
          </span>
          <h1
            className="font-display mb-1"
            style={{ color: "var(--ink)", fontSize: "clamp(24px, 5vw, 30px)", fontWeight: 600, letterSpacing: "-0.02em", lineHeight: 1.1 }}
          >
            Pick your username.
          </h1>
          <p className="font-sans text-sm mb-7" style={{ color: "var(--ink-muted)" }}>
            This is how people find you on Hyperfix.
          </p>

          {/* Form */}
          <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-3">
            <div>
              <div
                className="flex items-center rounded-2xl overflow-hidden transition-all duration-200"
                style={{
                  background: "transparent",
                  border: `1px solid ${borderColor}`,
                  boxShadow: validation === "available" ? "0 0 0 3px var(--accent-soft)" : "none",
                }}
              >
                <span className="pl-4 font-mono text-sm select-none" style={{ color: "var(--ink-faint)" }}>@</span>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value.toLowerCase())}
                  placeholder="yourname"
                  maxLength={20}
                  autoFocus
                  autoComplete="username"
                  className="flex-1 bg-transparent px-2 py-3.5 text-sm font-mono outline-none"
                  style={{ color: "var(--ink)" }}
                />
                {validation === "checking" && (
                  <span className="pr-4 font-mono text-xs" style={{ color: "var(--ink-faint)" }}>…</span>
                )}
              </div>

              <div className="h-5 mt-1.5">
                {feedbackText && (
                  <p className="font-sans text-xs inline-flex items-center gap-1.5" style={{ color: feedbackColor }}>
                    {validation === "available" && (
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    )}
                    {feedbackText}
                  </p>
                )}
              </div>
            </div>

            {error && (
              <p className="font-sans text-xs rounded-xl px-3 py-2.5" style={{ background: "rgba(248,113,113,0.08)", border: "1px solid rgba(248,113,113,0.2)", color: "#0a0a0a" }}>
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={!canSubmit}
              className="w-full py-3 rounded-full font-sans text-sm font-semibold transition-all duration-200 hover:opacity-95 hover:-translate-y-px active:scale-[0.98] disabled:cursor-not-allowed"
              style={{
                background: canSubmit ? "var(--ink)" : "var(--line)",
                color: canSubmit ? "var(--bg)" : "var(--ink-faint)",
                boxShadow: canSubmit ? "0 1px 0 0 var(--ink-muted) inset, 0 8px 28px var(--accent)" : "none",
              }}
            >
              {submitting ? "Setting up…" : "Claim username →"}
            </button>
          </form>
        </div>

        <p className="relative z-10 mt-6 font-sans text-xs text-center" style={{ color: "var(--ink-faint)" }}>
          You can change this later in settings.
        </p>

        <div
          className="relative z-10 mt-4 px-5 py-3.5 rounded-2xl text-center max-w-[380px] w-full"
          style={{ background: "var(--accent-soft)", border: "1px solid var(--accent-soft)" }}
        >
          <p className="font-mono text-[11px] uppercase tracking-widest mb-1" style={{ color: "var(--accent)" }}>
            unlock Pro free
          </p>
          <p className="font-sans text-xs" style={{ color: "var(--ink-muted)" }}>
            Refer 3 friends → get Hyperfix Pro forever. Your referral link is waiting on the dashboard.
          </p>
        </div>
      </div>
    </div>
  );
}
