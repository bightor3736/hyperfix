import { ArrowRight } from "lucide-react";

/**
 * Hyperfix hero — inspired by the Whenevr template's design language:
 * Inter (tight semibold) headlines with a Source-Serif italic accent word,
 * a fresh green accent, a soft light-grey canvas, a colourful gradient bloom,
 * an avatar "available now" pill, and a scrolling feature marquee.
 * Fully self-contained: CSS-only entrance + marquee animations.
 */

const GREEN = "#1dcc5d";
const INK = "#161413";
const GREY = "#76726f";
const CANVAS = "#f1f0ee";

const TAGS = [
  "Hyperfixation log", "Dopamine menu", "Beat the Wall", "Proof of action",
  "Forgiving streaks", "XP & levels", "Daily quests", "Streak freezes",
  "Daily check-ins", "Pattern insights", "Wall breaker", "Proof timer",
];

const fontInter = "var(--font-inter), Inter, sans-serif";
const fontSerif = "var(--font-serif), 'Source Serif 4', Georgia, serif";
const fontMono = "var(--font-mono), monospace";

export function HeroInspired() {
  return (
    <section className="relative overflow-hidden" style={{ background: CANVAS, color: INK }}>
      {/* colourful gradient bloom — Whenevr's signature, tuned green */}
      <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
        <div
          className="anim-floatY absolute -right-[10%] -top-[18%] h-[680px] w-[680px] rounded-full blur-[90px] opacity-80"
          style={{
            background:
              "conic-gradient(from 210deg at 50% 50%, #1dcc5d, #38bdf8, #818cf8, #c084fc, #34d399, #1dcc5d)",
          }}
        />
        <div
          className="absolute -right-[4%] top-[2%] h-[420px] w-[420px] rounded-full blur-[60px] opacity-60"
          style={{ background: "radial-gradient(circle, rgba(29,204,93,0.55), transparent 70%)" }}
        />
      </div>

      <Nav />

      <div className="relative mx-auto flex max-w-[920px] flex-col items-center px-6 pb-24 pt-16 text-center sm:pt-20 lg:pt-24">
        {/* eyebrow */}
        <div
          className="anim-fadeUp mb-7 inline-flex items-center gap-2 rounded-full px-3.5 py-1.5"
          style={{ background: "#ffffff", border: "1px solid rgba(0,0,0,0.07)", boxShadow: "0 1px 2px rgba(0,0,0,0.04)" }}
        >
          <span className="anim-pulseDot h-1.5 w-1.5 rounded-full" style={{ background: GREEN, color: GREEN }} />
          <span className="text-[13px] font-medium" style={{ fontFamily: fontInter, color: GREY }}>
            Built for brains that run on dopamine
          </span>
        </div>

        {/* headline */}
        <h1
          className="anim-fadeUp delay-100"
          style={{ fontFamily: fontInter, fontWeight: 600, letterSpacing: "-0.045em", lineHeight: 1.0, fontSize: "clamp(46px,7.4vw,88px)", color: INK }}
        >
          Your daily dopamine,
          <br />
          <span style={{ fontFamily: fontSerif, fontStyle: "italic", fontWeight: 500, color: GREEN }}>
            on tap.
          </span>
        </h1>

        {/* subcopy */}
        <p
          className="anim-fadeUp delay-200 mt-7 max-w-[560px] text-[18px] leading-[1.6]"
          style={{ fontFamily: fontInter, color: GREY }}
        >
          Track your hyperfixations, earn XP for things you actually did, and beat the
          tasks you keep avoiding. No leaderboards, no guilt — just your own momentum.
        </p>

        {/* CTAs */}
        <div className="anim-fadeUp delay-300 mt-9 flex flex-col items-center gap-4 sm:flex-row">
          <a
            href="/auth/signup"
            className="press-pop inline-flex h-[52px] items-center rounded-full px-7 text-[15px] font-semibold transition-transform hover:-translate-y-0.5"
            style={{ fontFamily: fontInter, background: GREEN, color: "#04130a", boxShadow: "0 8px 24px -8px rgba(29,204,93,0.6)" }}
          >
            Start free
          </a>
          <AvailablePill />
        </div>

        <p className="anim-fadeUp delay-400 mt-5 text-[13px]" style={{ fontFamily: fontMono, color: "#9a9794" }}>
          Free to start · no card · live in 60 seconds
        </p>
      </div>

      {/* feature marquee */}
      <div className="anim-fadeUp delay-500 relative pb-16">
        <p className="mb-5 text-center text-[12px] uppercase tracking-[0.18em]" style={{ fontFamily: fontMono, color: "#9a9794" }}>
          Everything in one calm place
        </p>
        <Marquee />
      </div>
    </section>
  );
}

function Nav() {
  return (
    <header className="relative z-20 mx-auto flex max-w-[1180px] items-center justify-between px-6 pt-6">
      <span className="text-[22px] font-semibold tracking-tight" style={{ fontFamily: fontInter, color: INK }}>
        hyperfix<span style={{ color: GREEN }}>.</span>
      </span>
      <nav className="hidden items-center gap-8 md:flex" style={{ fontFamily: fontInter }}>
        {["Features", "Pricing", "FAQ"].map((l) => (
          <a key={l} href={`#${l.toLowerCase()}`} className="text-[14px] font-medium transition-opacity hover:opacity-60" style={{ color: GREY }}>
            {l}
          </a>
        ))}
      </nav>
      <a
        href="/auth/signup"
        className="press-pop inline-flex h-10 items-center rounded-full px-5 text-[14px] font-semibold transition-transform hover:-translate-y-0.5"
        style={{ fontFamily: fontInter, background: INK, color: "#fff" }}
      >
        Start free
      </a>
    </header>
  );
}

function AvailablePill() {
  const avatars = ["#34d399", "#818cf8", "#fbbf24"];
  return (
    <div
      className="inline-flex items-center gap-3 rounded-full py-1.5 pl-2 pr-4"
      style={{ background: "#ffffff", border: "1px solid rgba(0,0,0,0.07)", boxShadow: "0 1px 2px rgba(0,0,0,0.04)" }}
    >
      <div className="flex -space-x-2">
        {avatars.map((c, i) => (
          <span key={i} className="h-6 w-6 rounded-full" style={{ background: `linear-gradient(135deg, ${c}, #ffffff55)`, border: "2px solid #fff" }} />
        ))}
      </div>
      <span className="flex items-center gap-1.5 text-[13px] font-medium" style={{ fontFamily: fontInter, color: INK }}>
        <span className="anim-pulseDot h-1.5 w-1.5 rounded-full" style={{ background: GREEN, color: GREEN }} />
        Join the early crew
      </span>
    </div>
  );
}

function Marquee() {
  const row = [...TAGS, ...TAGS]; // duplicated for a seamless CSS loop
  return (
    <div className="relative overflow-hidden" style={{ maskImage: "linear-gradient(90deg, transparent, #000 8%, #000 92%, transparent)", WebkitMaskImage: "linear-gradient(90deg, transparent, #000 8%, #000 92%, transparent)" }}>
      <ul className="flex w-max gap-3" style={{ animation: "marquee 38s linear infinite", fontFamily: fontInter }}>
        {row.map((t, i) => (
          <li
            key={i}
            className="whitespace-nowrap rounded-full px-4 py-2 text-[14px] font-medium"
            style={{ background: "#ffffff", border: "1px solid rgba(0,0,0,0.07)", color: INK }}
          >
            {t}
          </li>
        ))}
      </ul>
    </div>
  );
}
