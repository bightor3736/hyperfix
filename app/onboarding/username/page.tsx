"use client";

import { useState, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { LogoDark } from "@/components/Logo";
import Link from "next/link";

type ValidationState = "idle" | "checking" | "available" | "taken" | "invalid";

const USERNAME_REGEX = /^[a-zA-Z0-9_]{3,20}$/;

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

      // Attribute referral if stored
      const refCode = typeof localStorage !== "undefined"
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

  const feedbackColor =
    validation === "available"
      ? "#5EEAD4"
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

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ background: "#080808", color: "#F4F4F4" }}
    >
      {/* Nav */}
      <nav
        className="border-b"
        style={{ borderColor: "rgba(244,244,244,0.07)" }}
      >
        <div className="max-w-3xl mx-auto px-6 py-4">
          <Link href="/" aria-label="Hyperfix home">
            <LogoDark size="sm" />
          </Link>
        </div>
      </nav>

      <main
        id="main-content"
        className="flex-1 flex items-center justify-center px-6 py-16"
      >
        <div className="w-full max-w-sm">
          <h1 className="text-3xl font-display font-medium mb-2">
            Choose your username
          </h1>
          <p className="text-sm mb-8" style={{ color: "#9A9A9A" }}>
            This is how people will find you on Hyperfix.
          </p>

          <form onSubmit={handleSubmit} noValidate>
            <div className="mb-2">
              <div
                className="flex items-center rounded-xl overflow-hidden"
                style={{
                  background: "#111113",
                  border: `1px solid ${
                    validation === "available"
                      ? "rgba(94,234,212,0.4)"
                      : validation === "taken" || validation === "invalid"
                      ? "rgba(248,113,113,0.3)"
                      : "rgba(244,244,244,0.1)"
                  }`,
                  transition: "border-color 0.2s",
                }}
              >
                <span
                  className="pl-4 font-mono text-sm select-none"
                  style={{ color: "#9A9A9A" }}
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
                  className="flex-1 bg-transparent px-2 py-4 text-sm font-mono outline-none placeholder-[#525252]"
                  style={{ color: "#F4F4F4" }}
                  aria-describedby="username-feedback"
                />
                {validation === "checking" && (
                  <span className="pr-4 text-xs font-mono" style={{ color: "#9A9A9A" }}>
                    …
                  </span>
                )}
              </div>
            </div>

            {feedbackText && (
              <p
                id="username-feedback"
                className="text-xs font-mono mb-6 h-4"
                style={{ color: feedbackColor }}
              >
                {feedbackText}
              </p>
            )}
            {!feedbackText && <div className="mb-6 h-4" />}

            {error && (
              <p className="text-xs font-mono mb-4" style={{ color: "#f87171" }}>
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={validation !== "available" || submitting}
              className="w-full py-3.5 rounded-xl font-mono text-sm font-medium transition-opacity"
              style={{
                background:
                  validation === "available" && !submitting
                    ? "#5EEAD4"
                    : "rgba(94,234,212,0.25)",
                color:
                  validation === "available" && !submitting
                    ? "#080808"
                    : "rgba(94,234,212,0.4)",
                cursor:
                  validation === "available" && !submitting
                    ? "pointer"
                    : "not-allowed",
              }}
            >
              {submitting ? "Setting up…" : "Claim username →"}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}
