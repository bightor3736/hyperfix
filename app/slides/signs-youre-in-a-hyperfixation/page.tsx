import type { Metadata } from "next";
import { LogoWordmark } from "@/components/Logo";

export const metadata: Metadata = {
  title: "Slides — signs you're in a hyperfixation",
  robots: { index: false, follow: false },
};

const signs = [
  {
    n: "01",
    h: "You looked it up once.",
    sub: "now you know everything about it. seventeen tabs, the subreddit, the 2019 thread. you have opinions you didn't ask for.",
  },
  {
    n: "02",
    h: "You're recommending it to people who didn't ask.",
    sub: "you brought it up at dinner. you sent the link with no context. you texted the same person twice because you forgot. the evangelism phase.",
  },
  {
    n: "03",
    h: "You have opinions about the discourse.",
    sub: "casting decisions. interpretation disputes. authorial intent. you've thought about it more than once and reached the same conclusion twice.",
  },
  {
    n: "04",
    h: "You've reorganised your schedule around it.",
    sub: "stayed up late. woke up early. pushed work to later because you wanted one more chapter. it isn't a hobby anymore.",
  },
  {
    n: "05",
    h: "You're using it as emotional regulation.",
    sub: "stressed? you know what helps. anxious? there's a chapter for that. it isn't just interesting anymore. it's functional.",
  },
  {
    n: "06",
    h: "You've created something about it.",
    sub: "a note. a thread. a playlist. a voice memo at midnight where you talk for seven minutes about a character's motivations.",
  },
  {
    n: "07",
    h: "You know when it's fading.",
    sub: "the tabs close. the schedule resets. you pick up something you hadn't touched in weeks. the fix is lifting. log it before the details go.",
  },
];

/* Each slide renders at 1080×1350 (Instagram portrait / TikTok slideshow). */
function Slide({ children, bg = "bg-paper" }: { children: React.ReactNode; bg?: string }) {
  return (
    <div
      className={`relative ${bg} text-ink overflow-hidden mx-auto`}
      style={{ width: 1080, height: 1350 }}
    >
      {children}
    </div>
  );
}

function SlideFooter({ index, total }: { index: number; total: number }) {
  return (
    <div className="absolute bottom-12 left-12 right-12 flex items-end justify-between">
      <div>
        <LogoWordmark size="md" />
        <p className="font-mono text-[14px] uppercase tracking-widest text-muted mt-2">
          hyperfix.app
        </p>
      </div>
      <p className="font-mono text-[14px] uppercase tracking-widest text-muted tabular">
        {String(index).padStart(2, "0")} / {String(total).padStart(2, "0")}
      </p>
    </div>
  );
}

export default function SlidesPage() {
  const total = signs.length + 2; // cover + signs + CTA

  return (
    <main className="min-h-screen bg-paperDeep py-16 px-4">
      <div className="max-w-3xl mx-auto mb-12 text-center">
        <span className="stamp mb-6 inline-block">slides · hidden page</span>
        <h1 className="font-display text-4xl text-ink mb-4">
          signs you're in a hyperfixation
        </h1>
        <p className="font-mono text-[11px] uppercase tracking-widest text-muted">
          1080 × 1350 · instagram carousel · tiktok slideshow
        </p>
        <p className="font-sans text-inkSoft mt-4 text-sm leading-snug max-w-md mx-auto">
          screenshot each slide (cmd/ctrl + shift + s in dev tools, or
          right-click → capture node screenshot) and post as a carousel.
        </p>
      </div>

      <div className="flex flex-col gap-8 items-center">
        {/* SLIDE 01 — COVER */}
        <Slide bg="bg-paper">
          <div className="absolute inset-0 p-20 flex flex-col justify-between">
            <div>
              <span
                className="stamp"
                style={{ fontSize: "20px", padding: "10px 20px" }}
              >
                a hyperfixation tracker · 2026
              </span>
            </div>
            <div>
              <h2 className="font-display font-medium leading-[0.88] tracking-crush text-ink text-balance"
                  style={{ fontSize: "168px" }}>
                signs
                <br />
                <span className="italic text-accent">you're in</span>
                <br />
                a hyperfix.
              </h2>
              <p className="font-mono uppercase tracking-widest text-muted mt-12"
                 style={{ fontSize: "20px", letterSpacing: "0.2em" }}>
                swipe →
              </p>
            </div>
          </div>
          <SlideFooter index={1} total={total} />
        </Slide>

        {/* SLIDES 02-08 — SIGNS */}
        {signs.map((sign, i) => (
          <Slide key={sign.n} bg={i % 2 === 0 ? "bg-paper" : "bg-paperDeep"}>
            {/* watermark number */}
            <span
              aria-hidden
              className="absolute font-display font-bold leading-none text-accent/[0.06] select-none pointer-events-none tabular"
              style={{
                fontSize: "780px",
                top: "-100px",
                right: "-60px",
                fontStyle: "italic",
              }}
            >
              {sign.n}
            </span>

            <div className="absolute inset-0 p-20 flex flex-col justify-between relative z-10">
              <div>
                <span
                  className="font-mono uppercase tracking-widest text-accent"
                  style={{ fontSize: "22px", letterSpacing: "0.22em" }}
                >
                  sign · {sign.n}
                </span>
              </div>

              <div>
                <h2
                  className="font-display font-medium leading-[0.95] tracking-tightest text-ink text-balance mb-10"
                  style={{ fontSize: "104px" }}
                >
                  {sign.h.split(/\b(hyperfix|fix|obsession|unwell)\b/i).map((part, idx) =>
                    /^(hyperfix|fix|obsession|unwell)$/i.test(part) ? (
                      <span key={idx} className="italic text-accent">
                        {part}
                      </span>
                    ) : (
                      part
                    )
                  )}
                </h2>
                <p
                  className="font-display italic text-inkSoft leading-snug max-w-[820px]"
                  style={{ fontSize: "32px" }}
                >
                  {sign.sub}
                </p>
              </div>
            </div>
            <SlideFooter index={i + 2} total={total} />
          </Slide>
        ))}

        {/* SLIDE FINAL — CTA */}
        <Slide bg="bg-ink">
          <div className="absolute inset-0 p-20 flex flex-col justify-between text-paper">
            <div>
              <span
                className="stamp border-paper text-paper"
                style={{ fontSize: "20px", padding: "10px 20px" }}
              >
                join the waitlist
              </span>
            </div>

            <div>
              <h2
                className="font-display font-medium leading-[0.9] tracking-crush text-balance"
                style={{ fontSize: "160px" }}
              >
                log your
                <br />
                <span className="italic text-accent">obsession.</span>
              </h2>
              <p
                className="font-sans text-paper/70 leading-snug mt-12 max-w-[700px]"
                style={{ fontSize: "30px" }}
              >
                count the days. share the card. mourn it when it ends.
              </p>
              <p
                className="font-mono uppercase tracking-widest text-accent mt-14"
                style={{ fontSize: "26px", letterSpacing: "0.2em" }}
              >
                hyperfix.app →
              </p>
            </div>
          </div>
          <div className="absolute bottom-12 left-12 right-12 flex items-end justify-between">
            <div className="font-display font-medium tracking-crush text-paper"
                 style={{ fontSize: "42px" }}>
              hyper<span className="italic text-accent">fix</span>
            </div>
            <p className="font-mono uppercase tracking-widest text-paper/40 tabular"
               style={{ fontSize: "14px" }}>
              {String(total).padStart(2, "0")} / {String(total).padStart(2, "0")}
            </p>
          </div>
        </Slide>
      </div>
    </main>
  );
}
