"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LogoLockup } from "@/components/Logo";
import { Target, Flag, Smile, Pill, HeartCrack, Users, Zap, CalendarClock, Check } from "lucide-react";

const NOISE_URL =
  "url(\"data:image/svg+xml;utf8,<svg viewBox='0 0 240 240' xmlns='http://www.w3.org/2000/svg'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 0.55 0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>\")";

const GOALS: { key: string; label: string; icon: typeof Target }[] = [
  { key: "focus",          label: "Actually focus",        icon: Target },
  { key: "follow_through", label: "Follow through",        icon: Flag },
  { key: "mood",           label: "Track my mood",         icon: Smile },
  { key: "meds",           label: "Stay on my meds",       icon: Pill },
  { key: "rejection",      label: "Handle rejection (RSD)", icon: HeartCrack },
  { key: "accountability", label: "Stay accountable",      icon: Users },
  { key: "dopamine",       label: "Better dopamine",       icon: Zap },
  { key: "routine",        label: "Build a routine",       icon: CalendarClock },
];

export default function OnboardingGoalsPage() {
  const router = useRouter();
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [submitting, setSubmitting] = useState(false);

  function toggle(key: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  }

  async function finish() {
    setSubmitting(true);
    try {
      await fetch("/api/onboarding/goals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ goals: [...selected] }),
      }).catch(() => { /* non-fatal — don't block the user */ });
    } finally {
      router.push("/dashboard?welcome=1");
    }
  }

  return (
    <div className="min-h-screen flex flex-col" style={{ background: "var(--bg)", color: "var(--ink)" }}>
      <div aria-hidden className="fixed inset-0 pointer-events-none mix-blend-overlay" style={{ backgroundImage: NOISE_URL, backgroundSize: "240px 240px", opacity: 0.08 }} />
      <div aria-hidden className="fixed top-0 left-1/2 -translate-x-1/2 pointer-events-none" style={{ width: 560, height: 320, background: "radial-gradient(ellipse at 50% 0%, rgba(255,255,255,0.07) 0%, transparent 70%)" }} />

      <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-6 py-12">
        <a href="/" className="mb-10 inline-block transition-transform hover:scale-[1.02]">
          <LogoLockup size="sm" />
        </a>

        <div
          className="w-full max-w-[440px] p-8 anim-fadeUp"
          style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 16, boxShadow: "0 32px 80px rgba(0,0,0,0.45)" }}
        >
          {/* Step indicator */}
          <div className="flex items-center gap-2 mb-7">
            <div className="h-1 w-8 rounded-full" style={{ background: "#ffffff" }} />
            <div className="h-1 w-8 rounded-full" style={{ background: "#ffffff" }} />
            <div className="h-1 w-8 rounded-full" style={{ background: "#ffffff" }} />
            <span className="ml-auto font-mono text-[10px] uppercase tracking-widest" style={{ color: "rgba(255,255,255,0.35)" }}>step 3 of 3</span>
          </div>

          <span
            className="inline-flex items-center uppercase mb-4"
            style={{ fontSize: 11, fontWeight: 600, letterSpacing: "3px", color: "rgba(255,255,255,0.35)" }}
          >
            last step
          </span>
          <h1 className="font-display mb-1" style={{ color: "var(--ink)", fontSize: "clamp(24px, 5vw, 30px)", fontWeight: 600, letterSpacing: "-0.02em", lineHeight: 1.1 }}>
            What do you want help with?
          </h1>
          <p className="font-sans text-sm mb-6" style={{ color: "var(--ink-muted)" }}>
            Pick whatever resonates. We&apos;ll point you at the right tools. (Optional — you can skip.)
          </p>

          {/* Goal grid */}
          <div className="grid grid-cols-2 gap-2.5 mb-6">
            {GOALS.map(({ key, label, icon: Icon }) => {
              const on = selected.has(key);
              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => toggle(key)}
                  className="relative flex items-center gap-2.5 px-3.5 py-3 rounded-2xl text-left transition-all active:scale-[0.98]"
                  style={{
                    background: on ? "rgba(255,255,255,0.08)" : "transparent",
                    border: `1px solid ${on ? "rgba(255,255,255,0.45)" : "rgba(255,255,255,0.08)"}`,
                  }}
                >
                  <Icon size={16} strokeWidth={2} style={{ color: on ? "#ffffff" : "rgba(255,255,255,0.55)", flexShrink: 0 }} />
                  <span className="font-sans text-[13px] font-medium leading-tight" style={{ color: on ? "#ffffff" : "rgba(255,255,255,0.75)" }}>{label}</span>
                  {on && (
                    <span className="absolute top-1.5 right-1.5 flex items-center justify-center rounded-full" style={{ width: 16, height: 16, background: "#ffffff" }}>
                      <Check size={10} strokeWidth={3} style={{ color: "#000000" }} />
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          <button
            type="button"
            onClick={finish}
            disabled={submitting}
            className="w-full py-3 rounded-full font-sans text-sm font-semibold transition-all duration-200 hover:opacity-95 hover:-translate-y-px active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-70"
            style={{ background: "#ffffff", color: "#000000", fontWeight: 600 }}
          >
            {submitting ? "Setting up…" : selected.size > 0 ? `Let's go → (${selected.size})` : "Let's go →"}
          </button>

          <button
            type="button"
            onClick={finish}
            disabled={submitting}
            className="w-full mt-3 font-sans text-xs transition-colors hover:opacity-80 disabled:opacity-50"
            style={{ color: "var(--ink-faint)" }}
          >
            Skip for now
          </button>
        </div>
      </div>
    </div>
  );
}
