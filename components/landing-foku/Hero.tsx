"use client";

import { useEffect, useState } from "react";

// Mini sparkline for the hero card
function MiniSparkline() {
  const data = [3, 5, 4, 7, 6, 8, 7, 9, 8, 10, 9, 8, 9, 10];
  const max = Math.max(...data);
  return (
    <div className="flex items-end gap-0.5" style={{ height: 24 }}>
      {data.map((v, i) => (
        <div
          key={i}
          className="flex-1 rounded-sm transition-all"
          style={{
            height: `${(v / max) * 100}%`,
            background: "#5B8DEF",
            opacity: 0.3 + (v / max) * 0.7,
          }}
        />
      ))}
    </div>
  );
}

// Floating phone mockup showing a fix card
function PhoneMockup() {
  const [day, setDay] = useState(14);

  useEffect(() => {
    const interval = setInterval(() => {
      setDay((d) => (d >= 60 ? 14 : d + 1));
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div
      className="relative w-[280px] sm:w-[320px] rounded-[40px] p-3 shadow-2xl"
      style={{
        background: "#ffffff",
        boxShadow: "0 25px 80px rgba(91, 141, 239, 0.25), 0 10px 30px rgba(0,0,0,0.1)",
      }}
    >
      {/* Phone notch */}
      <div
        className="absolute top-4 left-1/2 -translate-x-1/2 w-24 h-6 rounded-full"
        style={{ background: "#1A1A2E" }}
      />

      {/* Screen */}
      <div
        className="rounded-[32px] pt-10 pb-6 px-5 min-h-[400px]"
        style={{ background: "#EEF4FF" }}
      >
        {/* Fix card */}
        <div
          className="rounded-3xl p-5"
          style={{
            background: "#ffffff",
            boxShadow: "0 4px 20px rgba(91, 141, 239, 0.15)",
          }}
        >
          {/* Category pill */}
          <div className="flex items-center gap-2 mb-3">
            <span
              className="text-[10px] font-semibold uppercase tracking-wider px-2.5 py-1 rounded-full"
              style={{ background: "rgba(91, 141, 239, 0.15)", color: "#5B8DEF" }}
            >
              📺 show
            </span>
          </div>

          {/* Title */}
          <h3 className="font-semibold text-lg" style={{ color: "#1A1A2E" }}>
            Severance, season two
          </h3>

          {/* Day counter */}
          <div className="mt-4 flex items-baseline gap-2">
            <span
              key={day}
              className="font-bold tabular-nums"
              style={{ fontSize: 56, color: "#5B8DEF", lineHeight: 1, transition: "all 0.3s ease" }}
            >
              {day}
            </span>
            <span className="text-sm font-medium" style={{ color: "#6B7280" }}>
              days
            </span>
          </div>

          {/* Intensity */}
          <div className="mt-4">
            <div className="flex justify-between text-xs mb-2">
              <span style={{ color: "#9CA3AF" }}>Intensity</span>
              <span className="font-semibold" style={{ color: "#5B8DEF" }}>
                8/10
              </span>
            </div>
            <div className="h-2 rounded-full overflow-hidden" style={{ background: "rgba(91, 141, 239, 0.15)" }}>
              <div
                className="h-full rounded-full"
                style={{ width: "80%", background: "linear-gradient(to right, #5B8DEF, #A78BFA)" }}
              />
            </div>
          </div>

          {/* Mini sparkline */}
          <div className="mt-4">
            <p className="text-[10px] uppercase tracking-wider mb-2" style={{ color: "#9CA3AF" }}>
              Last 14 days
            </p>
            <MiniSparkline />
          </div>
        </div>
      </div>
    </div>
  );
}

export function HeroFoku() {
  return (
    <section className="relative overflow-hidden px-6 pt-16 pb-24 sm:pt-24 sm:pb-32">
      {/* Floating decorative shapes */}
      <div
        className="absolute top-20 left-10 w-32 h-32 rounded-full opacity-60 blur-3xl"
        style={{ background: "#A78BFA", animation: "floatY 6s ease-in-out infinite" }}
      />
      <div
        className="absolute bottom-32 right-20 w-48 h-48 rounded-full opacity-40 blur-3xl"
        style={{ background: "#5B8DEF", animation: "driftX 8s ease-in-out infinite" }}
      />
      <div
        className="absolute top-1/2 left-1/4 w-24 h-24 rounded-full opacity-30 blur-2xl"
        style={{ background: "#F472B6", animation: "floatY 5s ease-in-out infinite reverse" }}
      />

      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
          {/* Left: Copy */}
          <div className="flex-1 text-center lg:text-left">
            <h1
              className="font-light tracking-tight leading-[1.1]"
              style={{ color: "#1A1A2E", fontSize: "clamp(40px, 6vw, 64px)" }}
            >
              A journal for your{" "}
              <span className="italic font-normal text-foku-gradient">
                obsessions
              </span>
              .
            </h1>

            <p className="mt-6 text-lg sm:text-xl leading-relaxed max-w-xl mx-auto lg:mx-0" style={{ color: "#4B5563" }}>
              Log it. Count the days. Mourn it when it ends.
            </p>

            {/* CTAs */}
            <div className="mt-10 flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start">
              <a
                href="/auth/signup?provider=google"
                className="flex items-center gap-3 px-6 py-3.5 rounded-full font-medium text-sm transition-all hover:shadow-lg hover:-translate-y-0.5"
                style={{
                  background: "#ffffff",
                  color: "#1A1A2E",
                  border: "1px solid rgba(91, 141, 239, 0.3)",
                  boxShadow: "0 4px 16px rgba(91, 141, 239, 0.1)",
                }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                Continue with Google
              </a>

              <a
                href="/auth/signup?provider=apple"
                className="flex items-center gap-3 px-6 py-3.5 rounded-full font-medium text-sm transition-all hover:opacity-90 hover:-translate-y-0.5"
                style={{ background: "#1A1A2E", color: "#ffffff" }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
                </svg>
                Continue with Apple
              </a>
            </div>
          </div>

          {/* Right: Phone mockup */}
          <div className="flex-shrink-0" style={{ animation: "floatY 6s ease-in-out infinite" }}>
            <PhoneMockup />
          </div>
        </div>
      </div>
    </section>
  );
}
