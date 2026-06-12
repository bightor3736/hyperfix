"use client";
import { useState } from "react";
import { Wordmark } from "@/components/Logo";

const VIDEO_URL =
  "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260602_150901_c45b90ec-18d7-42ff-90e2-b95d7109e330.mp4";

const NAV_LINKS = ["How it works", "Pricing"];

export function Hero() {
  const [email, setEmail] = useState("");
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSending(true);
    window.location.href = `/auth/signup?email=${encodeURIComponent(email)}`;
  }

  return (
    <div className="min-h-screen bg-white p-3 sm:p-4">
      {/* Full-bleed card */}
      <div
        className="
          relative rounded-2xl sm:rounded-3xl overflow-hidden
          min-h-[calc(100vh-24px)] sm:min-h-[calc(100vh-32px)]
        "
      >
        {/* Background video */}
        <video
          className="absolute inset-0 w-full h-full object-cover"
          src={VIDEO_URL}
          autoPlay
          muted
          loop
          playsInline
        />

        {/* Dark scrim */}
        <div className="absolute inset-0 bg-black/35" />

        {/* Content */}
        <div
          className="
            relative z-10 flex flex-col
            min-h-[calc(100vh-24px)] sm:min-h-[calc(100vh-32px)]
            p-4 sm:p-6 md:p-8 gap-6
          "
        >
          {/* ── Nav inside the card ── */}
          <nav className="flex items-center gap-3 sm:gap-6 bg-white/65 backdrop-blur-md rounded-2xl shadow-sm pl-3 sm:pl-4 pr-2 py-2 w-full sm:w-auto self-start">
            <Wordmark dark={false} size={15} />

            {/* Links — hidden on mobile */}
            <div className="hidden sm:flex items-center gap-5">
              {NAV_LINKS.map((label) => (
                <a
                  key={label}
                  href={label === "How it works" ? "#features" : "#pricing"}
                  className="text-gray-800 text-sm font-medium hover:opacity-60 transition-opacity whitespace-nowrap"
                >
                  {label}
                </a>
              ))}
            </div>

            <a
              href="/auth/signup"
              className="ml-auto bg-black text-white text-sm font-medium px-4 sm:px-5 py-2 rounded-xl hover:bg-gray-800 transition-colors whitespace-nowrap"
            >
              Get started
            </a>
          </nav>

          {/* Spacer */}
          <div className="flex-1 min-h-[2rem]" />

          {/* ── Bottom row ── */}
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
            {/* Headline */}
            <p className="text-white text-3xl sm:text-4xl xl:text-5xl font-medium leading-tight drop-shadow-lg lg:max-w-lg xl:max-w-2xl shrink-0">
              Start the task<br />
              you&apos;ve been{" "}
              <span
                style={{
                  fontFamily: "var(--font-serif-display, 'Instrument Serif', serif)",
                  fontStyle: "italic",
                  fontWeight: 400,
                }}
              >
                avoiding.
              </span>
            </p>

            {/* ── Sign-up card ── */}
            <div className="w-full lg:w-[min(440px,45%)] shrink-0">
              <div className="bg-white rounded-2xl sm:rounded-3xl shadow-2xl p-5 sm:p-6 flex flex-col gap-4">
                <div>
                  <h2 className="text-xl sm:text-2xl font-semibold text-black tracking-tight mb-1">
                    Join 2,400+ people who started.
                  </h2>
                  <p className="text-sm text-gray-500">
                    Free forever. No credit card. 5 minutes to try it.
                  </p>
                </div>

                {sent ? (
                  <div className="flex flex-col items-center justify-center py-6 gap-3">
                    <div className="w-12 h-12 rounded-full bg-green-50 flex items-center justify-center text-xl">
                      ✓
                    </div>
                    <p className="text-base font-semibold text-gray-900">
                      You&apos;re in!
                    </p>
                    <p className="text-sm text-gray-500">
                      Check your email to continue.
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="flex flex-col gap-3">
                    <input
                      type="email"
                      placeholder="Your email address"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="text-sm px-3 py-2.5 rounded-xl border border-gray-200 bg-transparent placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition"
                    />
                    <button
                      type="submit"
                      disabled={sending}
                      className="w-full bg-black text-white text-sm font-semibold py-3 rounded-2xl hover:bg-gray-800 transition-colors disabled:opacity-60"
                    >
                      {sending ? "Redirecting…" : "Start free →"}
                    </button>
                  </form>
                )}

                {/* Divider + log in */}
                <div className="flex items-center gap-3">
                  <div className="flex-1 h-px bg-gray-100" />
                  <span className="text-gray-400 text-xs font-medium whitespace-nowrap">
                    Already have an account?
                  </span>
                  <div className="flex-1 h-px bg-gray-100" />
                </div>

                <a
                  href="/auth/login"
                  className="w-full text-center text-sm font-medium text-gray-600 hover:text-black transition-colors"
                >
                  Log in
                </a>

                {/* Proof chips */}
                <div className="flex flex-wrap gap-3 pt-1">
                  {["✓ Free to start", "✓ No credit card", "✓ ADHD-friendly"].map((t) => (
                    <span key={t} className="text-xs font-medium text-gray-400">
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
