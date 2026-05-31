"use client";

import { useState } from "react";

type Billing = "monthly" | "yearly";

const tiers = [
  {
    name: "Free",
    tagline: "For the casually obsessed.",
    monthly: { price: "$0", per: "Free, forever", note: "No credit card." },
    yearly: { price: "$0", per: "Free, forever", note: "No credit card." },
    cta: "Start free",
    summary: "Everything you need to start.",
    features: [
      "Three active fixes at once",
      "One pinned fix on your profile",
      "Daily check-ins and the small graph",
      "Standard share cards",
      "Public profile, followers, reactions",
      "The graveyard, for everything that ends",
    ],
  },
  {
    name: "Pro",
    tagline: "For when it's gotten serious.",
    monthly: { price: "$5", per: "Per month", note: "Cancel anytime." },
    yearly: {
      price: "$3.25",
      per: "Per month, billed annually",
      note: "$39 a year. Save 33%.",
    },
    cta: "Go Pro",
    summary: "Everything in Free, and:",
    features: [
      "Unlimited active fixes",
      "Three pinned fixes on your profile",
      "Custom accent colour and banner",
      "Premium card templates",
      "AI eulogies, when words fail you",
      "Full analytics and graveyard export",
    ],
    featured: true,
  },
];

const comparison: {
  label: string;
  free: string | boolean;
  pro: string | boolean;
}[] = [
  { label: "Active fixes", free: "3", pro: "Unlimited" },
  { label: "Pinned fixes", free: "1", pro: "3" },
  { label: "Daily check-ins, streaks, graph", free: true, pro: true },
  { label: "Public profile, followers, reactions", free: true, pro: true },
  { label: "The graveyard", free: true, pro: true },
  { label: "Share cards", free: "Standard", pro: "Premium" },
  { label: "Custom accent and banner", free: false, pro: true },
  { label: "AI eulogies", free: false, pro: true },
  { label: "Full analytics", free: false, pro: true },
  { label: "Graveyard export", free: false, pro: true },
];

function Check({ className = "" }: { className?: string }) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <path
        d="M4.5 10.5L8.5 14.5L15.5 6.5"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function Cell({ value }: { value: string | boolean }) {
  if (value === true)
    return <Check className="mx-auto text-accent" />;
  if (value === false)
    return (
      <span className="mx-auto block h-1.5 w-1.5 rounded-full bg-ink-faint opacity-50" />
    );
  return <span className="text-[14px] text-ink">{value}</span>;
}

export function Pricing() {
  const [billing, setBilling] = useState<Billing>("yearly");

  return (
    <section id="pricing" className="bg-bg">
      <div className="mx-auto max-w-[1200px] px-6 py-24 sm:px-10 sm:py-28">
        <div className="flex flex-col items-center text-center">
          <h2 className="font-display text-[36px] leading-[1.05] tracking-tight text-ink sm:text-[44px]">
            Plans and pricing
          </h2>
          <p className="mt-4 max-w-[420px] text-[15px] leading-[1.6] text-ink-muted">
            Free covers it. Pro is for when three fixes isn't enough.
          </p>

          <div
            className="mt-9 inline-flex h-10 items-center rounded-full border border-line p-1 text-[13px]"
            role="radiogroup"
            aria-label="Billing period"
          >
            <button
              type="button"
              role="radio"
              aria-checked={billing === "monthly"}
              onClick={() => setBilling("monthly")}
              className={`h-8 rounded-full px-5 ${
                billing === "monthly"
                  ? "bg-invert-bg text-invert-ink"
                  : "text-ink-muted hover:text-ink"
              }`}
            >
              Monthly
            </button>
            <button
              type="button"
              role="radio"
              aria-checked={billing === "yearly"}
              onClick={() => setBilling("yearly")}
              className={`h-8 rounded-full px-5 ${
                billing === "yearly"
                  ? "bg-invert-bg text-invert-ink"
                  : "text-ink-muted hover:text-ink"
              }`}
            >
              Yearly
            </button>
          </div>
        </div>

        <div className="mx-auto mt-12 grid max-w-[900px] grid-cols-1 gap-5 md:grid-cols-2">
          {tiers.map((tier) => {
            const price = billing === "yearly" ? tier.yearly : tier.monthly;
            const featured = tier.featured;
            return (
              <article
                key={tier.name}
                className="flex flex-col rounded-[24px] border border-line bg-bg p-8 sm:p-9"
              >
                <div className="flex items-center gap-3">
                  <h3 className="font-display text-[30px] leading-none tracking-tight text-ink">
                    {tier.name}
                  </h3>
                  {featured && (
                    <span className="inline-flex h-7 items-center rounded-full bg-accent px-3 text-[12px] font-medium text-accent-ink">
                      Recommended
                    </span>
                  )}
                </div>
                <p className="mt-2 text-[14px] text-ink-muted">
                  {tier.tagline}
                </p>

                <div className="mt-7">
                  <p className="font-display text-[52px] leading-none tracking-tight text-ink">
                    {price.price}
                  </p>
                  <p className="mt-2 text-[13px] text-ink-muted">
                    {price.per}
                  </p>
                </div>

                <a
                  href="/auth/signup"
                  className={`mt-7 inline-flex h-11 w-full items-center justify-center rounded-full px-6 text-[14px] font-medium ${
                    featured
                      ? "bg-invert-bg text-invert-ink hover:opacity-90"
                      : "border border-line text-ink hover:border-ink-muted"
                  }`}
                >
                  {tier.cta}
                </a>
                <p className="mt-3 text-center text-[12px] text-ink-faint">
                  {price.note}
                </p>

                <p className="mt-8 text-[13px] font-medium text-ink">
                  {tier.summary}
                </p>
                <ul className="mt-4 space-y-3">
                  {tier.features.map((f) => (
                    <li
                      key={f}
                      className="flex items-start gap-3 text-[14px] leading-[1.5] text-ink"
                    >
                      <Check className="mt-1 flex-shrink-0 text-accent" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </article>
            );
          })}
        </div>

        <div className="mx-auto mt-20 max-w-[900px]">
          <h3 className="text-center font-display text-[26px] leading-[1.1] tracking-tight text-ink sm:text-[30px]">
            Compare the two
          </h3>
          <div className="mt-8 overflow-hidden">
            <div className="grid grid-cols-[1.6fr_1fr_1fr] items-center pb-4 text-[13px] font-medium text-ink-muted">
              <span />
              <span className="text-center text-ink">Free</span>
              <span className="text-center text-ink">Pro</span>
            </div>
            {comparison.map((row) => (
              <div
                key={row.label}
                className="grid grid-cols-[1.6fr_1fr_1fr] items-center border-t border-line py-4"
              >
                <span className="pr-4 text-[14px] leading-[1.4] text-ink">
                  {row.label}
                </span>
                <span className="text-center">
                  <Cell value={row.free} />
                </span>
                <span className="text-center">
                  <Cell value={row.pro} />
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
