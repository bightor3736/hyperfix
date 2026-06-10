"use client";

import { useState } from "react";
import { Check, X, Zap } from "lucide-react";
import { Reveal } from "./Reveal";

type Billing = "monthly" | "yearly";

const FREE_FEATURES = [
  "Unlimited tasks + the Just Start flow",
  "Focus timer + 5-minute starts",
  "XP for starting, daily quests & 7 levels",
  "Forgiving streak + 1 freeze a month",
  "Deep dives + brain bursts (earn XP)",
  "Share card + custom accent colour",
];

const PRO_FEATURES = [
  "5 streak freezes a month",
  "XP multiplier, always on",
  "Premium profile themes",
  "Full stats, history & insights",
  "Priority access to new features",
];

const comparison: { label: string; free: string | boolean; pro: string | boolean }[] = [
  { label: "Hyperfixation logs", free: "Unlimited", pro: "Unlimited" },
  { label: "Deep dives & brain bursts", free: true, pro: true },
  { label: "XP, levels & daily quests", free: true, pro: true },
  { label: "Streak freezes / month", free: "1", pro: "5" },
  { label: "Focus timer", free: true, pro: true },
  { label: "XP multiplier", free: false, pro: true },
  { label: "Share card + custom accent", free: true, pro: true },
  { label: "Premium profile themes", free: false, pro: true },
  { label: "Full stats & insights", free: false, pro: true },
];

function Cell({ value }: { value: string | boolean }) {
  if (value === true) return <Check className="mx-auto" size={17} style={{ color: "var(--ink)" }} strokeWidth={3} />;
  if (value === false) return <X className="mx-auto" size={16} style={{ color: "var(--ink-faint)" }} strokeWidth={3} />;
  return <span className="text-[13px] font-bold text-ink">{value}</span>;
}

export function Pricing() {
  const [billing, setBilling] = useState<Billing>("yearly");

  return (
    <section id="pricing" style={{ background: "var(--bg-soft)" }}>
      <div className="mx-auto max-w-[1100px] px-5 py-24 sm:px-8 sm:py-28">
        <Reveal>
          <div className="max-w-[600px] mb-12">
            <span
              className="brutal-tag anim-fadeUp mb-6"
              style={{ background: "var(--lime)", color: "var(--ink)" }}
            >
              <Zap size={13} strokeWidth={3} /> Pricing
            </span>
            <h2
              className="anim-fadeUp delay-100 leading-[0.98] text-ink"
              style={{ fontSize: "clamp(34px,5.5vw,56px)", fontWeight: 700, letterSpacing: "-0.03em" }}
            >
              Free to play.
              <br />
              <span
                className="inline-block px-2 mt-1"
                style={{ background: "var(--accent)", color: "var(--accent-ink)", border: "1.5px solid var(--line-strong)", boxShadow: "var(--shadow)", transform: "rotate(-1deg)" }}
              >
                More if you need it.
              </span>
            </h2>
            <p className="anim-fadeUp delay-200 mt-7 text-[17px] font-medium leading-[1.5] text-ink-muted">
              The whole game is free. Power-Up adds more streak insurance, an XP multiplier, and premium themes for when it gets serious.
            </p>
          </div>
        </Reveal>

        {/* Billing toggle */}
        <Reveal>
          <div
            className="mb-12 inline-flex items-center p-1 text-[13px]"
            style={{ border: "1.5px solid var(--line-strong)", borderRadius: 16, background: "var(--bg-elevated)", boxShadow: "var(--shadow)" }}
            role="radiogroup"
            aria-label="Billing period"
          >
            {(["monthly", "yearly"] as Billing[]).map((b) => (
              <button
                key={b}
                type="button"
                role="radio"
                aria-checked={billing === b}
                onClick={() => setBilling(b)}
                className="h-9 px-5 font-mono text-[12px] font-bold uppercase tracking-widest capitalize transition-colors"
                style={
                  billing === b
                    ? { background: "var(--ink)", color: "var(--bg)", borderRadius: 5 }
                    : { color: "var(--ink-muted)" }
                }
              >
                {b === "yearly" ? "Yearly · save 33%" : "Monthly"}
              </button>
            ))}
          </div>
        </Reveal>

        {/* Tier cards */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 max-w-[840px] items-stretch">
          {/* Free */}
          <Reveal>
            <article
              className="flex flex-col p-8 h-full"
              style={{ background: "var(--bg-elevated)", border: "1.5px solid var(--line-strong)", borderRadius: 16, boxShadow: "var(--shadow)" }}
            >
              <div>
                <h3 className="text-[30px] font-bold leading-none text-ink" style={{ letterSpacing: "-0.02em" }}>Free Player</h3>
                <p className="mt-3 text-[14px] font-medium text-ink-muted">Everything you need to start.</p>
              </div>

              <div className="mt-7 flex items-end gap-2">
                <p className="text-[52px] font-bold leading-none text-ink" style={{ letterSpacing: "-0.03em" }}>$0</p>
                <p className="mb-2 font-mono text-[12px] uppercase tracking-widest text-ink-muted">forever</p>
              </div>

              <a
                href="/auth/signup"
                className="brutal-btn mt-7 h-12 w-full text-[15px]"
                style={{ background: "var(--bg-elevated)", color: "var(--ink)" }}
              >
                Start free
              </a>
              <p className="mt-3 text-center font-mono text-[11px] uppercase tracking-widest text-ink-faint">No credit card.</p>

              <ul className="mt-8 space-y-3.5">
                {FREE_FEATURES.map((f) => (
                  <li key={f} className="flex items-start gap-3 text-[14px] font-medium leading-[1.5] text-ink">
                    <span
                      className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center"
                      style={{ background: "var(--lime)", border: "1px solid var(--line)", borderRadius: 20 }}
                    >
                      <Check size={12} strokeWidth={3.5} style={{ color: "var(--ink)" }} />
                    </span>
                    {f}
                  </li>
                ))}
              </ul>
            </article>
          </Reveal>

          {/* Power-Up */}
          <Reveal delay={80}>
            <article
              className="relative flex flex-col p-8 h-full"
              style={{ background: "var(--yellow)", border: "1.5px solid var(--line-strong)", borderRadius: 16, boxShadow: "var(--shadow-xl)" }}
            >
              {/* MOST POPULAR badge */}
              <span
                className="brutal-tag absolute -top-3.5 right-6 font-bold"
                style={{ background: "var(--accent)", color: "var(--accent-ink)", boxShadow: "var(--shadow-sm)" }}
              >
                <Zap size={12} strokeWidth={3} /> Most popular
              </span>

              <div>
                <h3 className="text-[30px] font-bold leading-none text-ink" style={{ letterSpacing: "-0.02em" }}>Power-Up</h3>
                <p className="mt-3 text-[14px] font-medium text-ink" style={{ opacity: 0.75 }}>For when you&apos;re properly hooked.</p>
              </div>

              <div className="mt-7 flex items-end gap-2">
                <p className="text-[52px] font-bold leading-none text-ink" style={{ letterSpacing: "-0.03em" }}>
                  {billing === "yearly" ? "$3.25" : "$5"}
                </p>
                <div className="mb-2">
                  <p className="font-mono text-[12px] uppercase tracking-widest text-ink">per month</p>
                  {billing === "yearly" && (
                    <p className="font-mono text-[10px] uppercase tracking-widest text-ink" style={{ opacity: 0.7 }}>billed $39/year</p>
                  )}
                </div>
              </div>

              <a
                href="/auth/signup"
                className="brutal-btn mt-7 h-12 w-full text-[15px]"
                style={{ background: "var(--ink)", color: "var(--bg)" }}
              >
                Power up <Zap size={16} strokeWidth={3} />
              </a>
              <p className="mt-3 text-center font-mono text-[11px] uppercase tracking-widest text-ink" style={{ opacity: 0.7 }}>
                Cancel anytime · 30-day refund
              </p>

              <p className="mt-8 mb-3 font-mono text-[12px] font-bold uppercase tracking-widest text-ink">Everything in Free, plus:</p>
              <ul className="space-y-3.5">
                {PRO_FEATURES.map((f) => (
                  <li key={f} className="flex items-start gap-3 text-[14px] font-bold leading-[1.5] text-ink">
                    <span
                      className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center"
                      style={{ background: "var(--bg-elevated)", border: "1px solid var(--line)", borderRadius: 20 }}
                    >
                      <Check size={12} strokeWidth={3.5} style={{ color: "var(--ink)" }} />
                    </span>
                    {f}
                  </li>
                ))}
              </ul>
            </article>
          </Reveal>
        </div>

        {/* Comparison table */}
        <Reveal>
          <div className="mt-20 max-w-[840px]">
            <h3 className="mb-8 text-[26px] font-bold leading-[1.1] text-ink" style={{ letterSpacing: "-0.02em" }}>
              Compare the two
            </h3>
            <div
              className="overflow-hidden"
              style={{ border: "1.5px solid var(--line-strong)", borderRadius: 16, boxShadow: "var(--shadow)", background: "var(--bg-elevated)" }}
            >
              <div
                className="grid grid-cols-[1.8fr_1fr_1fr] items-center px-5 py-3.5 font-mono text-[11px] font-bold uppercase tracking-widest"
                style={{ background: "var(--ink)", color: "var(--bg)" }}
              >
                <span />
                <span className="text-center">Free</span>
                <span className="text-center" style={{ color: "var(--yellow)" }}>Power-Up</span>
              </div>
              {comparison.map((row, idx) => (
                <div
                  key={row.label}
                  className="grid grid-cols-[1.8fr_1fr_1fr] items-center px-5 py-3.5"
                  style={{
                    borderTop: idx === 0 ? "none" : "1px solid var(--line)",
                    background: idx % 2 === 1 ? "var(--bg-soft)" : "var(--bg-elevated)",
                  }}
                >
                  <span className="pr-4 text-[13px] font-medium leading-[1.4] text-ink">{row.label}</span>
                  <span className="text-center" style={{ borderLeft: "1px solid var(--line)" }}><Cell value={row.free} /></span>
                  <span className="text-center" style={{ borderLeft: "1px solid var(--line)" }}><Cell value={row.pro} /></span>
                </div>
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
