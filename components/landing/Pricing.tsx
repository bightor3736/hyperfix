"use client";

import { useState } from "react";
import { Check } from "lucide-react";
import { Reveal } from "./Reveal";

type Billing = "monthly" | "yearly";

const FREE_FEATURES = [
  "Unlimited dopamine rolls",
  "Hyperfixation log + proof of action",
  "Daily quests, XP & 7 levels",
  "1 streak freeze a month",
  "Focus rooms — body doubling",
  "Share card + custom accent colour",
  "Jackpot rewards",
];

const PRO_FEATURES = [
  "5 streak freezes a month",
  "Boosted jackpot odds",
  "XP multipliers & boosts",
  "Premium profile themes",
  "Full stats, history & insights",
  "Priority access to new features",
];

const comparison: { label: string; free: string | boolean; pro: string | boolean }[] = [
  { label: "Dopamine rolls", free: "Unlimited", pro: "Unlimited" },
  { label: "XP, levels & daily quests", free: true, pro: true },
  { label: "Streak freezes / month", free: "1", pro: "5" },
  { label: "Focus rooms", free: true, pro: true },
  { label: "Jackpot odds", free: "Base", pro: "Boosted" },
  { label: "XP multipliers & boosts", free: false, pro: true },
  { label: "Share card + custom accent", free: true, pro: true },
  { label: "Premium profile themes", free: false, pro: true },
  { label: "Full stats & insights", free: false, pro: true },
];

function Cell({ value }: { value: string | boolean }) {
  if (value === true) return <Check className="mx-auto" size={15} style={{ color: "var(--accent)" }} strokeWidth={2.5} />;
  if (value === false) return <span className="mx-auto block h-1 w-4 rounded-full" style={{ background: "var(--line)" }} />;
  return <span className="text-[13px] text-ink">{value}</span>;
}

export function Pricing() {
  const [billing, setBilling] = useState<Billing>("yearly");

  return (
    <section id="pricing" style={{ background: "var(--bg-soft)" }}>
      <div className="mx-auto max-w-[1100px] px-6 py-24 sm:px-10 sm:py-28">
        <Reveal>
          <div className="max-w-[600px] mb-14">
            <p className="font-mono text-[11px] uppercase tracking-widest mb-4" style={{ color: "var(--accent)" }}>
              Pricing
            </p>
            <h2 className="font-display leading-[1.04] tracking-tight" style={{ fontSize: "clamp(32px,5vw,48px)" }}>
              <span className="text-ink">Free to play. </span>
              <span className="text-game-gradient">More if you need it.</span>
            </h2>
            <p className="mt-4 text-[15px] leading-[1.6] text-ink-muted">
              The whole game is free. Power-Up adds more streak insurance, boosted odds, and multipliers for when it gets serious.
            </p>
          </div>
        </Reveal>

        {/* Billing toggle */}
        <Reveal>
          <div
            className="mb-10 inline-flex h-10 items-center rounded-full p-1 text-[13px]"
            style={{ border: "1px solid var(--line)", background: "var(--bg-elevated)" }}
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
                className="h-8 rounded-full px-5 font-medium capitalize transition-all"
                style={
                  billing === b
                    ? { background: "var(--invert-bg)", color: "var(--invert-ink)" }
                    : { color: "var(--ink-muted)" }
                }
              >
                {b === "yearly" ? "Yearly · save 33%" : "Monthly"}
              </button>
            ))}
          </div>
        </Reveal>

        {/* Tier cards */}
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 max-w-[840px]">
          {/* Free */}
          <Reveal>
            <article
              className="flex flex-col rounded-[var(--radius-xl)] p-8 h-full"
              style={{ background: "var(--bg-elevated)", border: "1px solid var(--line)" }}
            >
              <div>
                <h3 className="font-display text-[28px] leading-none tracking-tight text-ink">Free</h3>
                <p className="mt-2 text-[14px] text-ink-muted">Everything you need to start.</p>
              </div>

              <div className="mt-7 flex items-end gap-2">
                <p className="font-display text-[48px] leading-none tracking-tight text-ink">$0</p>
                <p className="mb-1.5 text-[13px] text-ink-muted">forever</p>
              </div>

              <a
                href="/auth/signup"
                className="mt-7 inline-flex h-11 w-full items-center justify-center rounded-full text-[14px] font-semibold transition-all hover:opacity-90"
                style={{ background: "var(--invert-bg)", color: "var(--invert-ink)" }}
              >
                Start free
              </a>
              <p className="mt-2.5 text-center text-[12px] text-ink-faint">No credit card.</p>

              <ul className="mt-8 space-y-3">
                {FREE_FEATURES.map((f) => (
                  <li key={f} className="flex items-start gap-3 text-[14px] leading-[1.5] text-ink">
                    <span className="mt-0.5 shrink-0" style={{ color: "var(--accent)" }}>
                      <Check size={15} strokeWidth={2.5} />
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
              className="flex flex-col rounded-[var(--radius-xl)] p-8 h-full"
              style={{ background: "var(--bg-elevated)", border: "1px solid var(--accent)" }}
            >
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-display text-[28px] leading-none tracking-tight text-ink">Power-Up</h3>
                  <p className="mt-2 text-[14px] text-ink-muted">For when you&apos;re properly hooked.</p>
                </div>
              </div>

              <div className="mt-7 flex items-end gap-2">
                <p className="font-display text-[48px] leading-none tracking-tight text-ink">
                  {billing === "yearly" ? "$3.25" : "$5"}
                </p>
                <div className="mb-1.5">
                  <p className="text-[13px] text-ink-muted">per month</p>
                  {billing === "yearly" && (
                    <p className="text-[11px] text-ink-faint">billed $39/year</p>
                  )}
                </div>
              </div>

              <a
                href="/auth/signup"
                className="mt-7 inline-flex h-11 w-full items-center justify-center rounded-full text-[14px] font-semibold transition-all hover:opacity-90"
                style={{ background: "var(--accent)", color: "var(--accent-ink)" }}
              >
                Power up
              </a>
              <p className="mt-2.5 text-center text-[12px] text-ink-faint">
                Cancel anytime · 30-day refund if it&apos;s not for you
              </p>

              <p className="mt-8 text-[13px] font-medium text-ink-muted mb-3">Everything in Free, plus:</p>
              <ul className="space-y-3">
                {PRO_FEATURES.map((f) => (
                  <li key={f} className="flex items-start gap-3 text-[14px] leading-[1.5] text-ink">
                    <span className="mt-0.5 shrink-0" style={{ color: "var(--accent)" }}>
                      <Check size={15} strokeWidth={2.5} />
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
            <h3 className="font-display text-[22px] leading-[1.1] tracking-tight text-ink mb-8">
              Compare the two
            </h3>
            <div className="overflow-hidden rounded-[var(--radius-lg)]" style={{ border: "1px solid var(--line)" }}>
              <div
                className="grid grid-cols-[1.8fr_1fr_1fr] items-center px-5 py-3.5 text-[12px] font-medium"
                style={{ background: "var(--bg-elevated)", borderBottom: "1px solid var(--line)" }}
              >
                <span />
                <span className="text-center text-ink-muted">Free</span>
                <span className="text-center" style={{ color: "var(--accent)" }}>Power-Up</span>
              </div>
              {comparison.map((row) => (
                <div
                  key={row.label}
                  className="grid grid-cols-[1.8fr_1fr_1fr] items-center px-5 py-3.5 border-t"
                  style={{ borderColor: "var(--line)", background: "var(--bg-elevated)" }}
                >
                  <span className="pr-4 text-[13px] leading-[1.4] text-ink">{row.label}</span>
                  <span className="text-center"><Cell value={row.free} /></span>
                  <span className="text-center"><Cell value={row.pro} /></span>
                </div>
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
