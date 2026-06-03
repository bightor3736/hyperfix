"use client";

import { useState } from "react";
import { Check, Zap, Snowflake, Sparkles, Crown } from "lucide-react";
import { Reveal } from "./Reveal";

type Billing = "monthly" | "yearly";

const tiers = [
  {
    name: "Free Player",
    icon: Zap,
    tint: "var(--energy)",
    tagline: "Everything you need to start the game.",
    monthly: { price: "$0", per: "Free, forever", note: "No credit card." },
    yearly: { price: "$0", per: "Free, forever", note: "No credit card." },
    cta: "Start playing",
    summary: "What's included:",
    features: [
      "Unlimited dopamine rolls",
      "Hyperfixation log + proof of action",
      "Daily quests, XP & 7 levels",
      "1 streak freeze a month",
      "Focus rooms — body doubling",
      "Share card + custom accent colour",
      "Jackpot rewards (base odds)",
    ],
  },
  {
    name: "Power-Up",
    icon: Crown,
    tint: "var(--xp)",
    tagline: "For when you're properly hooked.",
    monthly: { price: "$5", per: "Per month", note: "Cancel anytime." },
    yearly: { price: "$3.25", per: "Per month, billed annually", note: "$39 a year · save 33%" },
    cta: "Power up",
    summary: "Everything in Free, plus:",
    features: [
      "5 streak freezes a month",
      "Boosted jackpot odds",
      "XP multipliers & boosts",
      "Premium profile themes (Nebula, Ember + more)",
      "Full stats, history & insights",
      "Priority access to new features",
    ],
    featured: true,
  },
];

const comparison: { label: string; free: string | boolean; pro: string | boolean }[] = [
  { label: "Dopamine rolls", free: "Unlimited", pro: "Unlimited" },
  { label: "XP, levels & daily quests", free: true, pro: true },
  { label: "Streak freezes / month", free: "1", pro: "5" },
  { label: "Focus rooms — body doubling", free: true, pro: true },
  { label: "Jackpot odds", free: "Base", pro: "Boosted" },
  { label: "XP multipliers & boosts", free: false, pro: true },
  { label: "Hyperfixation log + proof", free: true, pro: true },
  { label: "Share card + custom accent", free: true, pro: true },
  { label: "Premium profile themes", free: false, pro: true },
  { label: "Full stats & insights", free: false, pro: true },
];

function Cell({ value }: { value: string | boolean }) {
  if (value === true) return <Check className="mx-auto" size={16} style={{ color: "var(--energy)" }} strokeWidth={2.5} />;
  if (value === false) return <span className="mx-auto block h-1.5 w-1.5 rounded-full bg-ink-faint opacity-50" />;
  return <span className="text-[14px] text-ink">{value}</span>;
}

export function Pricing() {
  const [billing, setBilling] = useState<Billing>("yearly");

  return (
    <section id="pricing" style={{ background: "var(--bg)" }}>
      <div className="mx-auto max-w-[1100px] px-6 py-24 sm:px-10 sm:py-28">
        <Reveal>
          <div className="flex flex-col items-center text-center">
            <p className="font-mono text-[11px] uppercase tracking-widest mb-4" style={{ color: "var(--xp)" }}>
              Pick your power level
            </p>
            <h2 className="font-display leading-[1.04] tracking-tight" style={{ fontSize: "clamp(32px,5vw,48px)" }}>
              <span className="text-ink">Free to play. </span>
              <span className="text-game-gradient">Pro to power up.</span>
            </h2>
            <p className="mt-4 max-w-[440px] text-[15px] leading-[1.6] text-ink-muted">
              The whole game is free. Power-Up adds freezes, boosts and better odds for when it gets serious.
            </p>

            <div className="mt-9 inline-flex h-11 items-center rounded-full p-1 text-[13px]" style={{ border: "1px solid var(--line)", background: "var(--bg-elevated)" }} role="radiogroup" aria-label="Billing period">
              {(["monthly", "yearly"] as Billing[]).map((b) => (
                <button
                  key={b}
                  type="button"
                  role="radio"
                  aria-checked={billing === b}
                  onClick={() => setBilling(b)}
                  className="press-pop h-9 rounded-full px-5 font-medium capitalize transition-all"
                  style={billing === b ? { background: "var(--energy)", color: "var(--accent-ink)" } : { color: "var(--ink-muted)" }}
                >
                  {b}{b === "yearly" ? " · -33%" : ""}
                </button>
              ))}
            </div>
          </div>
        </Reveal>

        <div className="mx-auto mt-12 grid max-w-[840px] grid-cols-1 gap-5 md:grid-cols-2">
          {tiers.map((tier, idx) => {
            const price = billing === "yearly" ? tier.yearly : tier.monthly;
            const featured = tier.featured;
            const Icon = tier.icon;
            return (
              <Reveal key={tier.name} delay={idx * 90}>
                <article
                  className={`flex flex-col rounded-[var(--radius-xl)] p-8 h-full ${featured ? "anim-neon" : ""}`}
                  style={{ background: "var(--bg-elevated)", border: `1px solid ${featured ? "var(--energy)" : "var(--line)"}` }}
                >
                  <div className="flex items-center gap-3">
                    <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl" style={{ background: "var(--bg)", color: tier.tint, border: "1px solid var(--line)" }}>
                      <Icon size={18} strokeWidth={2.5} />
                    </span>
                    <h3 className="font-display text-[26px] leading-none tracking-tight text-ink">{tier.name}</h3>
                    {featured && (
                      <span className="ml-auto inline-flex h-7 items-center gap-1 rounded-full px-3 text-[11px] font-bold" style={{ background: "var(--xp-soft)", color: "var(--xp)" }}>
                        <Sparkles size={12} /> Popular
                      </span>
                    )}
                  </div>
                  <p className="mt-3 text-[14px] text-ink-muted">{tier.tagline}</p>

                  <div className="mt-6 flex items-end gap-2">
                    <p className="font-display text-[48px] leading-none tracking-tight text-ink">{price.price}</p>
                    <p className="mb-1.5 text-[13px] text-ink-muted">{price.per}</p>
                  </div>

                  <a
                    href="/auth/signup"
                    className="press-pop mt-6 inline-flex h-12 w-full items-center justify-center rounded-[var(--radius-lg)] text-[15px] font-bold transition-all hover:opacity-95"
                    style={featured ? { background: "var(--energy)", color: "var(--accent-ink)" } : { background: "var(--invert-bg)", color: "var(--invert-ink)" }}
                  >
                    {tier.cta}
                  </a>
                  <p className="mt-3 text-center text-[12px] text-ink-faint">
                    {featured ? "30-day full refund if it's not for you." : price.note}
                  </p>

                  <p className="mt-8 text-[13px] font-semibold text-ink">{tier.summary}</p>
                  <ul className="mt-4 space-y-3">
                    {tier.features.map((f) => (
                      <li key={f} className="flex items-start gap-3 text-[14px] leading-[1.5] text-ink">
                        <span className="mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full" style={{ background: featured ? "var(--xp-soft)" : "var(--accent-soft)", color: featured ? "var(--xp)" : "var(--energy)" }}>
                          <Check size={12} strokeWidth={3} />
                        </span>
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                </article>
              </Reveal>
            );
          })}
        </div>

        <Reveal>
          <div className="mx-auto mt-20 max-w-[840px]">
            <h3 className="text-center font-display text-[26px] leading-[1.1] tracking-tight text-ink sm:text-[30px]">
              Compare the two
            </h3>
            <div className="mt-8 overflow-hidden rounded-[var(--radius-lg)]" style={{ border: "1px solid var(--line)" }}>
              <div className="grid grid-cols-[1.6fr_1fr_1fr] items-center px-5 py-4 text-[13px] font-medium" style={{ background: "var(--bg-elevated)" }}>
                <span />
                <span className="text-center text-ink-muted">Free</span>
                <span className="text-center" style={{ color: "var(--xp)" }}>Power-Up</span>
              </div>
              {comparison.map((row) => (
                <div key={row.label} className="grid grid-cols-[1.6fr_1fr_1fr] items-center px-5 py-4 border-t" style={{ borderColor: "var(--line)" }}>
                  <span className="pr-4 text-[14px] leading-[1.4] text-ink">{row.label}</span>
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
