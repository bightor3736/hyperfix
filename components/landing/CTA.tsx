import { OAuthButtons } from "./OAuthButtons";

export function CTA() {
  return (
    <section id="get-started" style={{ background: "var(--bg)" }}>
      <div className="mx-auto max-w-[1200px] px-6 py-24 sm:px-10 sm:py-32">
        <div className="mx-auto max-w-[680px] text-center">
          <h2 className="font-display text-[44px] leading-[1.02] tracking-tight sm:text-[60px]" style={{ color: "var(--ink)" }}>
            Stop telling your friends.
            <br />
            <span style={{ color: "var(--ink-muted)" }}>Tell Hyperfix.</span>
          </h2>
          <p className="mx-auto mt-5 max-w-[420px] text-[15px] leading-[1.6]" style={{ color: "var(--ink-muted)" }}>
            Three minutes to make an account. The counter starts the moment you commit.
          </p>
          <div className="mx-auto mt-8 w-full max-w-[400px]">
            <OAuthButtons />
            <p className="mt-4 text-[12px]" style={{ color: "var(--ink-faint)" }}>
              Free forever ·{" "}
              <span style={{ color: "var(--accent)" }}>no nag screen</span>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
