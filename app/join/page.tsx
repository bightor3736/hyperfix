"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import { Suspense } from "react";

function JoinPageInner() {
  const searchParams = useSearchParams();
  const refCode = searchParams.get("ref");
  const [displayName, setDisplayName] = useState<string | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (!refCode) {
      setLoaded(true);
      return;
    }

    // Store referral code in localStorage for pickup during signup
    localStorage.setItem("hyperfix_ref", refCode);

    // Look up the referrer
    fetch(`/api/referral?code=${encodeURIComponent(refCode)}`)
      .then((r) => r.json())
      .then((data: { displayName?: string }) => {
        if (data.displayName) setDisplayName(data.displayName);
      })
      .catch(() => {})
      .finally(() => setLoaded(true));
  }, [refCode]);

  if (!loaded) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-6 h-6 rounded-full border-2 border-accent border-t-transparent animate-spin" />
      </div>
    );
  }

  return (
    <main id="main-content" className="flex-1 flex flex-col items-center justify-center px-6 py-20 text-center">
      <div className="max-w-md mx-auto">
        {/* Badge */}
        <div
          className="inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest rounded-full px-4 py-2 mb-8"
          style={{
            background: "rgba(94,234,212,0.1)",
            border: "1px solid rgba(94,234,212,0.2)",
            color: "#5EEAD4",
          }}
        >
          <span>✦</span>
          <span>You were invited</span>
        </div>

        {/* Headline */}
        <h1
          className="font-display font-bold mb-4 leading-tight"
          style={{
            color: "#F4F4F4",
            fontSize: "clamp(2rem, 6vw, 3.5rem)",
            letterSpacing: "-0.03em",
          }}
        >
          {displayName
            ? `${displayName} invited you to Hyperfix`
            : "You've been invited to Hyperfix"}
        </h1>

        <p
          className="font-sans text-base sm:text-lg leading-relaxed mb-10"
          style={{ color: "rgba(244,244,244,0.5)" }}
        >
          Track your hyperfixations. Count the days. Build your graveyard. It&apos;s free.
        </p>

        {/* Features list */}
        <div className="flex flex-col gap-3 mb-10 text-left">
          {[
            "Log what you're obsessed with right now",
            "Track how many days you've been in it",
            "Build a graveyard of everything that's ended",
            "Share your fix cards with friends",
          ].map((feat) => (
            <div key={feat} className="flex items-start gap-3">
              <svg className="shrink-0 mt-0.5" width="16" height="16" viewBox="0 0 18 18" fill="none">
                <circle cx="9" cy="9" r="9" fill="rgba(94,234,212,0.15)" />
                <path d="M5.5 9l2.5 2.5 4.5-5" stroke="#a3e635" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <span className="font-sans text-sm" style={{ color: "rgba(244,244,244,0.65)" }}>
                {feat}
              </span>
            </div>
          ))}
        </div>

        <a
          href="/auth/signup"
          className="inline-flex items-center justify-center w-full py-4 rounded-2xl font-sans text-base font-bold transition-all hover:opacity-90 active:scale-[0.98]"
          style={{ background: "#5EEAD4", color: "#0A0A0A" }}
        >
          Join free →
        </a>

        <p className="mt-4 font-sans text-xs" style={{ color: "rgba(244,244,244,0.25)" }}>
          No credit card required. Free forever.
        </p>
      </div>
    </main>
  );
}

export default function JoinPage() {
  return (
    <div className="min-h-screen flex flex-col" style={{ background: "#0A0A0A" }}>
      <Nav />
      <Suspense
        fallback={
          <div className="flex-1 flex items-center justify-center">
            <div className="w-6 h-6 rounded-full border-2 border-accent border-t-transparent animate-spin" />
          </div>
        }
      >
        <JoinPageInner />
      </Suspense>
      <Footer />
    </div>
  );
}
