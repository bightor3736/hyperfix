import { OAuthButtons } from "./OAuthButtons";

export function CTA() {
  return (
    <section id="get-started" className="relative overflow-hidden" style={{ background: "var(--bg)" }}>
      {/* Soft tri-pastel wash — mirrors the hero, bookending the page */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "linear-gradient(to bottom, transparent 0%, rgba(167,139,250,0.06) 30%, rgba(96,165,250,0.07) 60%, rgba(45,212,191,0.12) 100%)",
        }}
      />
      <div className="relative mx-auto max-w-[1200px] px-6 py-24 sm:px-10 sm:py-32">
        <div className="mx-auto max-w-[680px] text-center">
          <p className="font-mono text-[11px] uppercase tracking-widest mb-5" style={{ color: "var(--accent)" }}>
            Ready to start?
          </p>
          <h2
            className="font-display leading-[1.02] tracking-tight text-ink"
            style={{ fontSize: "clamp(36px,6vw,60px)" }}
          >
            Your brain isn&apos;t broken.
            <br />
            <span style={{ color: "var(--accent)" }}>It just needs the right game.</span>
          </h2>
          <p className="mx-auto mt-5 max-w-[420px] text-[15px] leading-[1.6] text-ink-muted">
            Takes 60 seconds to sign up. Your first quest is waiting.
          </p>

          <div className="mx-auto mt-8 w-full max-w-[400px]">
            <OAuthButtons />
            <p className="mt-4 text-[12px] text-ink-faint">
              Free to start ·{" "}
              <span style={{ color: "var(--accent)" }}>no credit card</span>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
