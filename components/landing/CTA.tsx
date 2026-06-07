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
              background: "var(--yellow)",
              border: "3.5px solid var(--ink)",
              borderRadius: 8,
              boxShadow: "10px 10px 0 0 var(--ink)",
            }}
          >
            <span
              className="brutal-tag mb-6"
              style={{ background: "var(--bg-elevated)", color: "var(--ink)" }}
            >
              <Sparkles size={13} strokeWidth={3} /> Ready to start?
            </span>

            <h2
              className="font-bold leading-[0.95] text-ink"
              style={{ fontSize: "clamp(34px,6vw,60px)", letterSpacing: "-0.03em" }}
            >
              Your brain isn&apos;t broken.
              <br />
              <span
                className="mt-3 inline-block px-3"
                style={{
                  background: "var(--accent)",
                  color: "var(--accent-ink)",
                  border: "3.5px solid var(--ink)",
                  boxShadow: "7px 7px 0 0 var(--ink)",
                  transform: "rotate(-1.5deg)",
                }}
              >
                It just needs the right game.
              </span>
            </h2>

            <p className="mx-auto mt-7 max-w-[440px] text-[17px] font-medium leading-[1.5] text-ink-muted">
              Takes 60 seconds to sign up. Your first quest is waiting.
            </p>

            <div className="mx-auto mt-8 w-full max-w-[400px]">
              <div
                className="p-4"
                style={{
                  background: "var(--bg-elevated)",
                  border: "3px solid var(--ink)",
                  borderRadius: 8,
                  boxShadow: "4px 4px 0 0 var(--ink)",
                }}
              >
                <OAuthButtons />
              </div>
              <p className="mt-5 font-mono text-[12px] font-bold uppercase tracking-widest text-ink">
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
