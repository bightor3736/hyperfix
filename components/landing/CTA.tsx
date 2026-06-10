import { Sparkles } from "lucide-react";
import { OAuthButtons } from "./OAuthButtons";
import { Reveal } from "./Reveal";

export function CTA() {
  return (
    <section id="get-started" className="relative overflow-hidden px-5 py-24 sm:px-8 sm:py-32" style={{ background: "var(--bg-soft)" }}>
      {/* faint brutalist grid backdrop — bookends the hero */}
      <div aria-hidden className="pointer-events-none absolute inset-0 grid-bg opacity-50" />

      <div className="relative mx-auto max-w-[760px]">
        <Reveal>
          <div
            className="relative p-8 text-center sm:p-14"
            style={{
              background: "var(--pastel-yellow)",
              borderRadius: 36,
              boxShadow: "var(--shadow-lg)",
            }}
          >
            <span
              className="mb-6 inline-flex items-center gap-1.5 rounded-full px-4 py-1.5 text-[13px] font-bold"
              style={{ background: "var(--bg-elevated)", color: "var(--ink)", boxShadow: "var(--shadow-sm)" }}
            >
              <Sparkles size={14} strokeWidth={2.5} /> Ready to start?
            </span>

            <h2
              className="font-bold leading-[1.05] text-ink"
              style={{ fontSize: "clamp(34px,6vw,56px)", letterSpacing: "-0.02em" }}
            >
              Your brain isn&apos;t broken.
              <br />
              <span style={{ color: "var(--accent)" }}>It just needs the right game.</span>
            </h2>

            <p className="mx-auto mt-7 max-w-[440px] text-[17px] font-medium leading-[1.6] text-ink-muted">
              Takes 60 seconds to sign up. Your first quest is waiting.
            </p>

            <div className="mx-auto mt-8 w-full max-w-[400px]">
              <div
                className="p-4"
                style={{
                  background: "var(--bg-elevated)",
                  borderRadius: 24,
                  boxShadow: "var(--shadow)",
                }}
              >
                <OAuthButtons />
              </div>
              <p className="mt-5 text-[13px] font-bold text-ink-muted">
                Free to start ·{" "}
                <span style={{ color: "var(--accent)" }}>no credit card</span>
              </p>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
