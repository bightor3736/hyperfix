"use client";

import { useState, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { LogoLockup } from "@/components/Logo";
import Link from "next/link";

type ValidationState = "idle" | "checking" | "available" | "taken" | "invalid";

const USERNAME_REGEX = /^[a-zA-Z0-9_]{3,20}$/;

const TEAL = "#5EEAD4";
const CARD_BG = "#0F1011";
const CARD_BORDER = "rgba(255,255,255,0.06)";
const NOISE_URL =
  "url(\"data:image/svg+xml;utf8,<svg viewBox='0 0 240 240' xmlns='http://www.w3.org/2000/svg'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 0.55 0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>\")";

function debounce<T extends (...args: Parameters<T>) => void>(
  fn: T,
  delay: number
): (...args: Parameters<T>) => void {
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
      if (!USERNAME_REGEX.test(value)) {
        setValidation("invalid");
        return;
      }
      setValidation("checking");
      try {
        const res = await fetch(
          `/api/username/check?u=${encodeURIComponent(value)}`
        );
        const data = (await res.json()) as { available: boolean };
        setValidation(data.available ? "available" : "taken");
      } catch {
        setValidation("idle");
      }
    }, 400),
    []
  );

  useEffect(() => {
    if (username.length === 0) {
      setValidation("idle");
      return;
    }
    checkUsername(username);
  }, [username, checkUsername]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (validation !== "available") return;

    setSubmitting(true);
    setError(null);

    const supabase = createClient();
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      setError("Not signed in.");
      setSubmitting(false);
      return;
    }

    try {
      const res = await fetch("/api/username/set", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({ username }),
      });
      const data = (await res.json()) as { error?: string };
      if (!res.ok) {
        setError(data.error ?? "Something went wrong.");
        setSubmitting(false);
        return;
      }

      const refCode =
        typeof localStorage !== "undefined"
          ? localStorage.getItem("hyperfix_ref")
          : null;
      if (refCode) {
        fetch("/api/referral", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ code: refCode }),
        })
          .then(() => localStorage.removeItem("hyperfix_ref"))
          .catch(() => {});
      }

      router.push("/dashboard/new?welcome=1");
    } catch {
      setError("Network error. Please try again.");
      setSubmitting(false);
    }
  }

  const inputBorderColor =
    validation === "available"
      ? "rgba(94,234,212,0.45)"
      : validation === "taken" || validation === "invalid"
      ? "rgba(248,113,113,0.35)"
      : CARD_BORDER;

  const feedbackColor =
    validation === "available"
      ? TEAL
      : validation === "taken"
      ? "#f87171"
      : validation === "invalid"
      ? "#fcd34d"
      : "transparent";

  const feedbackText =
    validation === "available"
      ? "Looks good ✓"
      : validation === "taken"
      ? "Already taken"
      : validation === "invalid"
      ? "3–20 chars, letters/numbers/underscores only"
      : "";

  const canSubmit = validation === "available" && !submitting;

  return (
    <div
      className="min-h-screen relative flex flex-col"
      style={{ background: "#070708", color: "#F4F4F4" }}
    >
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none mix-blend-overlay"
        style={{ backgroundImage: NOISE_URL, backgroundSize: "240px 240px", opacity: 0.08 }}
      />

      {/* Glass sticky nav */}
      <nav
        className="sticky top-0 z-40 px-6 sm:px-10 py-5 flex items-center"
        style={{
          background: "rgba(7,7,8,0.78)",
          backdropFilter: "blur(20px)",
          borderBottom: `1px solid ${CARD_BORDER}`,
        }}
      >
        <Link href="/" aria-label="Hyperfix home" className="transition-transform hover:scale-[1.02]">
          <LogoLockup size="sm" />
        </Link>
      </nav>

      <main
        id="main-content"
        className="relative flex-1 flex items-center justify-center px-6 py-16"
      >
        <div className="w-full max-w-sm">
          {/* Bloom hero card */}
          <div
            className="relative overflow-hidden rounded-3xl mb-8 px-7 pt-8 pb-7 anim-fadeUp"
            style={{
              background:
                "radial-gradient(ellipse 80% 120% at 50% 130%, #5EEAD4 0%, #2DD4BF 14%, #0E4F47 34%, #08231F 55%, #070708 78%)",
              border: `1px solid ${CARD_BORDER}`,
            }}
          >
            <div
              aria-hidden
              className="absolute inset-0 pointer-events-none mix-blend-overlay"
              style={{ backgroundImage: NOISE_URL, backgroundSize: "200px 200px", opacity: 0.55 }}
            />
            <div
              aria-hidden
              className="absolute inset-0 pointer-events-none"
              style={{ background: "linear-gradient(180deg, #070708 0%, rgba(7,7,8,0.45) 30%, transparent 100%)" }}
            />
            <div className="relative">
              <span
                className="inline-flex items-center font-sans text-xs rounded-full px-3 py-1 mb-5"
                style={{
                  background: "rgba(94,234,212,0.12)",
                  color: TEAL,
                  border: "1px solid rgba(94,234,212,0.25)",
                }}
              >
                almost there
              </span>
              <h1
                className="font-display"
                style={{
                  color: "#FFFFFF",
                  fontSize: "clamp(28px, 6vw, 36px)",
                  fontWeight: 600,
                  letterSpacing: "-0.02em",
                  lineHeight: 1.1,
                }}
              >
                Choose your
                <br />
                username
              </h1>
              <p className="mt-3 font-sans text-sm" style={{ color: "rgba(255,255,255,0.55)" }}>
                This is how people find you on Hyperfix.
              </p>
            </div>
          </div>

          {/* Form card */}
          <div
            className="relative overflow-hidden rounded-3xl px-7 py-7 anim-fadeUp"
            style={{ background: CARD_BG, border: `1px solid ${CARD_BORDER}`, animationDelay: "80ms" }}
          >
            <div
              aria-hidden
              className="absolute inset-0 pointer-events-none mix-blend-overlay"
              style={{ backgroundImage: NOISE_URL, backgroundSize: "240px 240px", opacity: 0.22 }}
            />
            <form onSubmit={handleSubmit} noValidate className="relative">
              <div className="mb-2">
                <div
                  className="flex items-center rounded-2xl overflow-hidden transition-all duration-200"
                  style={{
                    background: "rgba(255,255,255,0.04)",
                    border: `1px solid ${inputBorderColor}`,
                    boxShadow: validation === "available"
                      ? "0 0 0 3px rgba(94,234,212,0.08)"
                      : "none",
                  }}
                >
                  <span
                    className="pl-4 font-mono text-sm select-none"
                    style={{ color: "rgba(255,255,255,0.4)" }}
                  >
                    @
                  </span>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value.toLowerCase())}
                    placeholder="yourname"
                    maxLength={20}
                    autoFocus
                    autoComplete="username"
                    className="flex-1 bg-transparent px-2 py-4 text-sm font-mono outline-none"
                    style={{ color: "#F4F4F4" }}
                    aria-describedby="username-feedback"
                  />
                  {validation === "checking" && (
                    <span className="pr-4 text-xs font-mono" style={{ color: "rgba(255,255,255,0.4)" }}>
                      …
                    </span>
                  )}
                </div>
              </div>

              <div className="mb-6 h-5">
                {feedbackText && (
                  <p
                    id="username-feedback"
                    className="text-xs font-sans pt-1.5"
                    style={{ color: feedbackColor }}
                  >
                    {feedbackText}
                  </p>
                )}
              </div>

              {error && (
                <p className="text-xs font-sans mb-4" style={{ color: "#f87171" }}>
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={!canSubmit}
                className="w-full py-3.5 rounded-full font-sans text-sm font-semibold transition-all duration-200"
                style={{
                  background: canSubmit ? "#FFFFFF" : "rgba(255,255,255,0.12)",
                  color: canSubmit ? "#070708" : "rgba(255,255,255,0.3)",
                  cursor: canSubmit ? "pointer" : "not-allowed",
                  boxShadow: canSubmit
                    ? "0 0 0 1px rgba(255,255,255,0.15), 0 4px 16px rgba(94,234,212,0.25)"
                    : "none",
                }}
              >
                {submitting ? "Setting up…" : "Claim username →"}
              </button>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}
