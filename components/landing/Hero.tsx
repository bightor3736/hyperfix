"use client";

import { OAuthButtons } from "./OAuthButtons";

export function Hero() {
  return (
    <section className="relative">
      <div className="mx-auto grid max-w-[1200px] grid-cols-1 gap-16 px-6 pb-24 pt-12 sm:px-10 sm:pb-32 sm:pt-16 md:grid-cols-[1.05fr_0.95fr] md:gap-14 lg:pt-20">
        <div className="flex flex-col items-center justify-center text-center">
          <h1 className="font-display text-[44px] leading-[1.02] tracking-tight sm:text-[56px] lg:text-[64px]" style={{ color: "var(--ink)" }}>
            A journal for
            <br />
            your obsession.
          </h1>
          <p className="mt-6 max-w-[440px] text-[16px] leading-[1.55]" style={{ color: "var(--ink-muted)" }}>
            Log it. Count the days. Mourn it when it ends.
          </p>

          <div className="mt-9 w-full max-w-[400px]">
            <OAuthButtons />
            <p className="mt-4 text-[13px]" style={{ color: "var(--ink-faint)" }}>
              Free forever.{" "}
              <span style={{ color: "var(--accent)" }}>No nag screen.</span>
            </p>
          </div>
        </div>

        <HeroCard />
      </div>
    </section>
  );
}

function HeroCard() {
  return (
    <div className="flex items-center justify-center md:pl-4">
      <div
        className="relative w-full max-w-[440px] rounded-[24px] p-7"
        style={{ border: "1px solid var(--line)", background: "var(--bg-elevated)" }}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="inline-block h-1.5 w-1.5 rounded-full" style={{ background: "var(--accent)" }} />
            <p className="text-[13px]" style={{ color: "var(--ink-muted)" }}>Currently tracking</p>
          </div>
          <p className="text-[13px]" style={{ color: "var(--ink-faint)" }}>Public</p>
        </div>

        <h3 className="mt-5 font-display text-[32px] leading-[1.05] tracking-tight" style={{ color: "var(--ink)" }}>
          Severance, season two.
        </h3>
        <p className="mt-1.5 text-[13px]" style={{ color: "var(--ink-muted)" }}>A tv series</p>

        <div className="mt-7 flex items-end justify-between py-5" style={{ borderTop: "1px solid var(--line)", borderBottom: "1px solid var(--line)" }}>
          <div>
            <p className="text-[12px]" style={{ color: "var(--ink-faint)" }}>Day</p>
            <p className="mt-1 font-display text-[56px] leading-none tracking-tight" style={{ color: "var(--ink)" }}>14</p>
          </div>
          <div className="text-right">
            <p className="text-[12px]" style={{ color: "var(--ink-faint)" }}>Intensity</p>
            <p className="mt-1 font-display text-[40px] leading-none tracking-tight" style={{ color: "var(--ink)" }}>
              8<span style={{ color: "var(--ink-faint)" }}>/10</span>
            </p>
          </div>
        </div>

        <div className="mt-5">
          <p className="text-[12px]" style={{ color: "var(--ink-faint)" }}>Last fourteen days</p>
          <div className="mt-3 flex h-12 items-end gap-1">
            {[3, 4, 5, 5, 6, 7, 6, 7, 8, 8, 7, 8, 9, 8].map((v, i) => (
              <span
                key={i}
                className="flex-1 rounded-[3px]"
                style={{ height: `${(v / 10) * 100}%`, opacity: 0.4 + v / 25, background: "var(--ink)" }}
              />
            ))}
          </div>
        </div>

        <div className="mt-6 flex items-center justify-between text-[12px]" style={{ color: "var(--ink-muted)" }}>
          <span className="inline-flex items-center gap-2">
            <span className="inline-block h-1.5 w-1.5 rounded-full" style={{ background: "var(--accent)" }} />
            Checked in today
          </span>
          <span style={{ color: "var(--ink-faint)" }}>@edouard</span>
        </div>
      </div>
    </div>
  );
}
