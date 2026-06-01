import { LogoMark } from "@/components/Logo";
import { Reveal } from "./Reveal";

export function FoundersNote() {
  return (
    <section style={{ background: "var(--bg)" }}>
      <div className="mx-auto max-w-[760px] px-6 py-24 sm:px-10 sm:py-28">
        <Reveal>
          <div
            className="rounded-[var(--radius-xl)] p-8 sm:p-12"
            style={{ background: "var(--bg-elevated)", border: "1px solid var(--line)" }}
          >
            <div className="mb-6 flex items-center gap-2.5">
              <LogoMark size={20} color="var(--energy)" />
              <p className="font-mono text-[11px] uppercase tracking-widest" style={{ color: "var(--energy)" }}>
                Why we built this
              </p>
            </div>

            <div className="space-y-4 text-[16px] leading-[1.7] text-ink">
              <p>
                I have ADHD. I don&apos;t struggle to <em>care</em> — I struggle to <em>start</em>. So I&apos;d
                reach for my phone &ldquo;for a second,&rdquo; and lose an hour. Not because it felt good.
                Because it was the lowest-effort dopamine in reach.
              </p>
              <p>
                Every productivity app I tried wanted me to plan, maintain a routine, and feel bad when I
                broke a streak. None of them met me in the exact moment I&apos;m stuck: bored, understimulated,
                about to scroll.
              </p>
              <p>
                So we built the opposite. One tap when you&apos;re bored, and Hyperfix hands you a real
                dopamine hit that isn&apos;t your phone — then rewards you for taking it. No guilt, no blank
                lists, no streak you can shatter in one bad day. Just a game your brain actually wants to play.
              </p>
            </div>

            <p className="mt-8 font-display text-[18px] text-ink">— the Hyperfix team</p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
