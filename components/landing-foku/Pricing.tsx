"use client";

import { useState } from "react";

const plans = [
  {
    name: "Free",
    price: "$0",
    period: "forever",
    description: "Everything you need to track your obsessions.",
    features: [
      "Unlimited fixes",
      "Day counter",
      "Intensity tracking",
      "The graveyard",
      "Basic stats",
    ],
    cta: "Get started",
    ctaHref: "/auth/signup",
    highlighted: false,
  },
  {
    name: "Pro",
    price: "$5",
    period: "/month",
    description: "For the truly obsessed.",
    features: [
      "Everything in Free",
      "Unlimited history",
      "Advanced analytics",
      "Custom categories",
      "Export data",
      "Priority support",
    ],
    cta: "Start free trial",
    ctaHref: "/auth/signup?plan=pro",
    highlighted: true,
  },
];

const comparison = [
  { feature: "Unlimited fixes", free: true, pro: true },
  { feature: "Day counter", free: true, pro: true },
  { feature: "Intensity tracking", free: true, pro: true },
  { feature: "The graveyard", free: true, pro: true },
  { feature: "Basic stats", free: true, pro: true },
  { feature: "Unlimited history", free: false, pro: true },
  { feature: "Advanced analytics", free: false, pro: true },
  { feature: "Custom categories", free: false, pro: true },
  { feature: "Export data", free: false, pro: true },
  { feature: "Priority support", free: false, pro: true },
];

export function PricingFoku() {
  const [showComparison, setShowComparison] = useState(false);

  return (
    <section id="pricing" className="py-20 sm:py-28 px-6" style={{ background: "#ffffff" }}>
      <div className="max-w-4xl mx-auto">
        {/* Heading */}
        <div className="text-center mb-14">
          <h2
            className="font-light tracking-tight mb-4"
            style={{ color: "#1A1A2E", fontSize: "clamp(28px, 5vw, 40px)" }}
          >
            Simple pricing
          </h2>
          <p className="text-lg" style={{ color: "#6B7280" }}>
            Start free. Upgrade when you&apos;re ready.
          </p>
        </div>

        {/* Plan cards */}
        <div className="grid sm:grid-cols-2 gap-6 mb-12">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className="rounded-3xl p-8 transition-all hover:-translate-y-1"
              style={{
                background: plan.highlighted ? "#5B8DEF" : "#EEF4FF",
                color: plan.highlighted ? "#ffffff" : "#1A1A2E",
                boxShadow: plan.highlighted ? "0 12px 40px rgba(91, 141, 239, 0.3)" : "none",
              }}
            >
              <h3
                className="font-semibold text-lg mb-2"
                style={{ color: plan.highlighted ? "#ffffff" : "#1A1A2E" }}
              >
                {plan.name}
              </h3>

              <div className="flex items-baseline gap-1 mb-2">
                <span className="font-bold text-4xl">{plan.price}</span>
                <span
                  className="text-sm"
                  style={{ color: plan.highlighted ? "rgba(255,255,255,0.8)" : "#6B7280" }}
                >
                  {plan.period}
                </span>
              </div>

              <p
                className="text-sm mb-6"
                style={{ color: plan.highlighted ? "rgba(255,255,255,0.8)" : "#6B7280" }}
              >
                {plan.description}
              </p>

              <ul className="space-y-3 mb-8">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-3 text-sm">
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    {feature}
                  </li>
                ))}
              </ul>

              <a
                href={plan.ctaHref}
                className="block w-full text-center font-medium py-3 rounded-full transition-all hover:opacity-90 hover:-translate-y-0.5"
                style={{
                  background: plan.highlighted ? "#ffffff" : "#1A1A2E",
                  color: plan.highlighted ? "#5B8DEF" : "#ffffff",
                }}
              >
                {plan.cta}
              </a>
            </div>
          ))}
        </div>

        {/* Comparison toggle */}
        <div className="text-center">
          <button
            onClick={() => setShowComparison(!showComparison)}
            className="inline-flex items-center gap-2 text-sm font-medium transition-opacity hover:opacity-70"
            style={{ color: "#5B8DEF" }}
          >
            {showComparison ? "Hide" : "Show"} full comparison
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className={`transition-transform ${showComparison ? "rotate-180" : ""}`}
            >
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </button>
        </div>

        {/* Comparison table */}
        {showComparison && (
          <div className="mt-10 rounded-3xl overflow-hidden" style={{ background: "#EEF4FF" }}>
            <table className="w-full">
              <thead>
                <tr style={{ borderBottom: "1px solid rgba(91, 141, 239, 0.2)" }}>
                  <th className="text-left p-4 font-medium text-sm" style={{ color: "#1A1A2E" }}>
                    Feature
                  </th>
                  <th className="text-center p-4 font-medium text-sm" style={{ color: "#1A1A2E" }}>
                    Free
                  </th>
                  <th className="text-center p-4 font-medium text-sm" style={{ color: "#5B8DEF" }}>
                    Pro
                  </th>
                </tr>
              </thead>
              <tbody>
                {comparison.map((row, i) => (
                  <tr
                    key={row.feature}
                    style={{
                      borderBottom:
                        i < comparison.length - 1 ? "1px solid rgba(91, 141, 239, 0.1)" : "none",
                    }}
                  >
                    <td className="p-4 text-sm" style={{ color: "#4B5563" }}>
                      {row.feature}
                    </td>
                    <td className="p-4 text-center">
                      {row.free ? (
                        <svg
                          width="20"
                          height="20"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="#5B8DEF"
                          strokeWidth="2.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="inline"
                        >
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                      ) : (
                        <span style={{ color: "#9CA3AF" }}>—</span>
                      )}
                    </td>
                    <td className="p-4 text-center">
                      {row.pro ? (
                        <svg
                          width="20"
                          height="20"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="#5B8DEF"
                          strokeWidth="2.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="inline"
                        >
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                      ) : (
                        <span style={{ color: "#9CA3AF" }}>—</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </section>
  );
}
