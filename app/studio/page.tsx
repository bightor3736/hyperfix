import type { Metadata } from "next";
import Footer from "@/components/Footer";
import { LogoLockup } from "@/components/Logo";
import { RevealSection } from "@/components/RevealSection";

export const metadata: Metadata = {
  title: "Hyperfix Studio — Your Obsession's Private Workspace",
  description:
    "Studio is the private scratchpad built into every Hyperfix fixation. Notes, links, images — everything that feeds the obsession, in one place.",
};

// ---- DESIGN TOKENS ---------------------------------------------------------

const TEAL = "#5EEAD4";
const TEAL_DEEP = "#2DD4BF";
const TEAL_DARK_BG = "rgba(94,234,212,0.10)";
const TEAL_DARK_BORDER = "rgba(94,234,212,0.22)";
const CARD_BG = "#0F1011";
const CARD_BORDER = "rgba(255,255,255,0.06)";
const PAGE_BG = "#070708";

const NOISE_URL =
  "url(\"data:image/svg+xml;utf8,<svg viewBox='0 0 240 240' xmlns='http://www.w3.org/2000/svg'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 0.55 0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>\")";

// ---- PRIMITIVES ------------------------------------------------------------

function GrainOverlay({ opacity = 0.18 }: { opacity?: number }) {
  return (
    <div
      aria-hidden
      className="absolute inset-0 pointer-events-none mix-blend-overlay"
      style={{ backgroundImage: NOISE_URL, backgroundSize: "240px 240px", opacity }}
    />
  );
}

function EyebrowPill({ children }: { children: React.ReactNode }) {
  return (
    <span
      className="inline-flex items-center font-sans text-sm rounded-full px-4 py-1.5"
      style={{
        background: TEAL_DARK_BG,
        color: TEAL,
        border: `1px solid ${TEAL_DARK_BORDER}`,
        boxShadow: "0 0 24px rgba(94,234,212,0.10)",
      }}
    >
      {children}
    </span>
  );
}

function IconTile({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="flex items-center justify-center rounded-2xl"
      style={{
        width: 52,
        height: 52,
        background: TEAL_DARK_BG,
        border: `1px solid ${TEAL_DARK_BORDER}`,
        color: TEAL,
        boxShadow: "0 0 28px rgba(94,234,212,0.22), inset 0 0 18px rgba(94,234,212,0.08)",
      }}
    >
      {children}
    </div>
  );
}

// ---- DATA ------------------------------------------------------------------

const blockTypes = [
  {
    label: "Notes",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="16" y1="13" x2="8" y2="13" />
        <line x1="16" y1="17" x2="8" y2="17" />
      </svg>
    ),
    headline: "Think out loud. Then save it.",
    body: "Notes aren't about structure. They're about the thing that hit you at 2am that you absolutely cannot lose. A theory, a lyric breakdown, a 400-word rant, a single sentence. No format required.",
    preview: (
      <div className="space-y-2">
        {[
          "ok so the symbolism in episode 7 isn't subtle at ALL and i need everyone to",
          "theory: the whole arc is about avoidance and the fandom has been sleeping on",
          "the way they filmed that scene from below to show vulnerability... i'm not okay",
        ].map((line, i) => (
          <div key={i} className="rounded-xl px-4 py-3 font-sans text-sm leading-relaxed"
            style={{ background: "rgba(255,255,255,0.04)", border: `1px solid ${CARD_BORDER}`, color: "rgba(255,255,255,0.68)" }}>
            {line}
          </div>
        ))}
      </div>
    ),
  },
  {
    label: "Links",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
        <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
      </svg>
    ),
    headline: "Save the rabbit hole.",
    body: "Paste any URL. The essay that explains everything. The wiki page you've read six times. The playlist. The thread. The site that only exists in one person's archive. Give them a title, keep them forever.",
    preview: (
      <div className="space-y-2">
        {[
          { title: "The Definitive 3hr Video Essay", url: "youtube.com" },
          { title: "Deleted scene compilation (restored)", url: "archive.org" },
          { title: "Original showrunner interview (2018)", url: "medium.com" },
        ].map((link, i) => (
          <div key={i} className="rounded-xl px-4 py-3 flex items-center gap-3"
            style={{ background: "rgba(255,255,255,0.04)", border: `1px solid ${CARD_BORDER}` }}>
            <div className="shrink-0 flex items-center justify-center rounded-lg"
              style={{ width: 34, height: 34, background: TEAL_DARK_BG, border: `1px solid ${TEAL_DARK_BORDER}`, color: TEAL }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
                <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
              </svg>
            </div>
            <div className="min-w-0">
              <p className="font-sans text-sm font-medium truncate" style={{ color: "rgba(255,255,255,0.85)" }}>{link.title}</p>
              <p className="font-mono text-xs" style={{ color: "rgba(255,255,255,0.3)" }}>{link.url}</p>
            </div>
          </div>
        ))}
      </div>
    ),
  },
  {
    label: "Images",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
        <circle cx="8.5" cy="8.5" r="1.5" />
        <polyline points="21 15 16 10 5 21" />
      </svg>
    ),
    headline: "Your visual evidence board.",
    body: "Paste an image URL. Add a caption. Drag to reorder. Build the mood board, the meme archive, the screenshot collection, the fan art folder — whatever you need it to be.",
    preview: (
      <div className="grid grid-cols-2 gap-2">
        {[
          "the look on their face. i think about it.",
          "reference shot: episode 3 hallway",
          "the color palette shift in season 2",
          "officially cannot be doing this",
        ].map((caption, i) => (
          <div key={i} className="rounded-xl overflow-hidden"
            style={{ border: `1px solid ${CARD_BORDER}` }}>
            <div className="flex items-center justify-center"
              style={{
                height: 60,
                background: `linear-gradient(135deg, rgba(94,234,212,${0.05 + i * 0.03}) 0%, rgba(94,234,212,0.02) 100%)`,
                color: TEAL,
              }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                <circle cx="8.5" cy="8.5" r="1.5" />
                <polyline points="21 15 16 10 5 21" />
              </svg>
            </div>
            <p className="px-3 py-2 font-sans text-xs leading-snug"
              style={{ color: "rgba(255,255,255,0.45)" }}>{caption}</p>
          </div>
        ))}
      </div>
    ),
  },
];

const studioQuotes = [
  {
    quote: "i used to have seventeen browser tabs open about this show at all times. now i just have studio and it's the same number of thoughts but in one place.",
    name: "@lore.spiral",
    fix: "arcane · day 201",
  },
  {
    quote: "the notes block alone is worth it. it's the only place my hyperfixation brain can dump things fast enough to actually keep up with itself.",
    name: "@chronic.fixation",
    fix: "welcome to night vale · day 88",
  },
  {
    quote: "i put my entire fic outline in a studio note and it's the most organized i've ever been while also being completely unwell about fictional characters",
    name: "@fic.unhinged",
    fix: "the untamed · day 340",
  },
];

const howItWorksSteps = [
  {
    num: "01",
    title: "Open Studio from any fix",
    body: "Every fixation has a Studio button. Tap it from your fix dashboard to open the workspace.",
  },
  {
    num: "02",
    title: "Add blocks freely",
    body: "Hit the + button to add a note, link, or image. No limit. No format. Just add what matters.",
  },
  {
    num: "03",
    title: "Drag to arrange",
    body: "Use the up/down arrows to order your blocks exactly how you want them. Your workspace, your rules.",
  },
  {
    num: "04",
    title: "Edit or delete anytime",
    body: "Hover any block to edit or remove it. Nothing is permanent until you decide it is. The studio is always yours.",
  },
];

// ---- PAGE ------------------------------------------------------------------

export default function StudioMarketingPage() {
  return (
    <>
      <main id="main-content" className="relative z-10 text-ink" style={{ background: PAGE_BG }}>
        {/* NAV */}
        <nav
          className="sticky top-0 z-50 flex items-center justify-between px-6 sm:px-10 py-5"
          style={{
            background: "rgba(7,7,8,0.78)",
            backdropFilter: "blur(20px)",
            borderBottom: `1px solid ${CARD_BORDER}`,
          }}
        >
          <a href="/" className="shrink-0">
            <LogoLockup size="sm" />
          </a>
          <div className="flex items-center gap-5">
            <a href="/" className="font-sans text-sm transition-opacity hover:opacity-80 hidden sm:block" style={{ color: "rgba(255,255,255,0.55)" }}>
              ← Hyperfix
            </a>
            <a
              href="/join"
              className="font-sans text-sm font-semibold px-5 py-2.5 transition-all hover:opacity-90 active:scale-[0.98]"
              style={{ background: "#FFFFFF", color: "#0A0A0A", borderRadius: 999 }}
            >
              Get started
            </a>
          </div>
        </nav>

        {/* HERO */}
        <section className="relative overflow-hidden px-6 sm:px-10 pt-20 sm:pt-28 pb-24 sm:pb-32">
          <div
            aria-hidden
            className="absolute pointer-events-none anim-bloom"
            style={{
              inset: 0,
              background: "radial-gradient(ellipse 80% 70% at 50% 100%, #5EEAD4 0%, #2DD4BF 18%, #0E4F47 38%, #08231F 58%, #070708 78%)",
              opacity: 0.95,
              zIndex: 0,
              transformOrigin: "50% 100%",
            }}
          />
          <div
            aria-hidden
            className="absolute inset-0 pointer-events-none"
            style={{ backgroundImage: NOISE_URL, backgroundSize: "200px 200px", opacity: 0.55, mixBlendMode: "overlay", zIndex: 1 }}
          />
          <div
            aria-hidden
            className="absolute pointer-events-none"
            style={{
              top: 0, left: 0, right: 0, height: "55%",
              background: "linear-gradient(180deg, #070708 0%, rgba(7,7,8,0.85) 35%, transparent 100%)",
              zIndex: 2,
            }}
          />

          <div className="relative max-w-4xl mx-auto text-center" style={{ zIndex: 10 }}>
            <div className="anim-fadeUp delay-100 mb-6">
              <span
                className="inline-flex items-center gap-2 font-mono text-xs tracking-widest uppercase px-4 py-2 rounded-full"
                style={{ background: TEAL_DARK_BG, color: TEAL, border: `1px solid ${TEAL_DARK_BORDER}` }}
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                  <polyline points="14 2 14 8 20 8" />
                </svg>
                Hyperfix Studio
              </span>
            </div>

            <h1
              className="font-display text-ink anim-fadeUp delay-200"
              style={{
                fontSize: "clamp(44px, 8.5vw, 92px)",
                lineHeight: 1.02,
                letterSpacing: "-0.02em",
                fontWeight: 600,
              }}
            >
              Your Obsession
              <br />
              Has a Workspace.
            </h1>

            <p
              className="mt-7 mx-auto font-sans text-base sm:text-lg max-w-xl leading-relaxed anim-fadeUp delay-400"
              style={{ color: "rgba(255,255,255,0.72)" }}
            >
              Studio is a private scratchpad attached to every fixation. Notes, links,
              images — everything that lives in twelve browser tabs and three Discord
              threads, finally in one place.
            </p>

            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 anim-fadeUp delay-600">
              <a
                href="/join"
                className="inline-flex items-center gap-3 font-sans text-base font-semibold px-7 py-4 transition-all duration-200 hover:opacity-95 hover:-translate-y-px hover:scale-[1.02] active:scale-[0.98]"
                style={{
                  background: "#FFFFFF",
                  color: "#0A0A0A",
                  borderRadius: 999,
                  boxShadow: "0 1px 0 0 rgba(255,255,255,0.5) inset, 0 12px 36px rgba(0,0,0,0.4), 0 0 60px rgba(94,234,212,0.25)",
                }}
              >
                Get Started Free
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14M13 5l7 7-7 7" />
                </svg>
              </a>
              <a
                href="/#studio"
                className="font-sans text-sm transition-opacity hover:opacity-70"
                style={{ color: "rgba(255,255,255,0.55)" }}
              >
                See it on the main page →
              </a>
            </div>

            <p className="mt-7 font-sans text-sm anim-fadeUp delay-700" style={{ color: "rgba(255,255,255,0.4)" }}>
              included with every fix · no extra setup
            </p>
          </div>
        </section>

        {/* WORKSPACE PREVIEW */}
        <section className="relative px-6 sm:px-10 pb-16 sm:pb-24">
          <GrainOverlay opacity={0.05} />
          <div className="relative max-w-3xl mx-auto">
            <RevealSection>
              <div
                className="relative overflow-hidden rounded-3xl"
                style={{
                  background: CARD_BG,
                  border: `1px solid ${TEAL_DARK_BORDER}`,
                  boxShadow: "0 40px 120px rgba(0,0,0,0.6), 0 0 80px rgba(94,234,212,0.10)",
                }}
              >
                <GrainOverlay opacity={0.2} />
                {/* Studio nav bar */}
                <div
                  className="relative flex items-center justify-between px-6 py-4"
                  style={{ borderBottom: `1px solid ${CARD_BORDER}` }}
                >
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-xs tracking-widest uppercase" style={{ color: TEAL }}>HYPERFIX · Studio</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-sans text-xs" style={{ color: "rgba(255,255,255,0.35)" }}>Hozier Discography</span>
                    <span
                      className="font-mono text-xs px-2.5 py-1 rounded-full"
                      style={{ background: TEAL_DARK_BG, color: TEAL, border: `1px solid ${TEAL_DARK_BORDER}` }}
                    >
                      Day 44
                    </span>
                  </div>
                </div>

                {/* Blocks */}
                <div className="relative p-6 space-y-3">
                  {/* Note */}
                  <div
                    className="rounded-2xl p-5"
                    style={{ background: "rgba(255,255,255,0.03)", border: `1px solid ${CARD_BORDER}` }}
                  >
                    <div className="flex items-center gap-2 mb-3">
                      <span className="font-mono text-xs uppercase tracking-widest" style={{ color: "rgba(255,255,255,0.28)" }}>Note</span>
                    </div>
                    <p className="font-sans text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.75)" }}>
                      the way &ldquo;work song&rdquo; and &ldquo;from eden&rdquo; are thematically mirrors of each other and nobody
                      is talking about it. the biblical imagery in both just. ok. i need a moment.
                    </p>
                  </div>
                  {/* Link */}
                  <div
                    className="rounded-2xl p-5 flex items-center gap-4"
                    style={{ background: "rgba(255,255,255,0.03)", border: `1px solid ${CARD_BORDER}` }}
                  >
                    <div
                      className="shrink-0 flex items-center justify-center rounded-xl"
                      style={{ width: 44, height: 44, background: TEAL_DARK_BG, border: `1px solid ${TEAL_DARK_BORDER}`, color: TEAL }}
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
                        <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
                      </svg>
                    </div>
                    <div className="min-w-0">
                      <p className="font-sans text-sm font-medium" style={{ color: "rgba(255,255,255,0.85)" }}>
                        Hozier: Every Album Ranked & Explained (3hr Deep Dive)
                      </p>
                      <p className="font-mono text-xs mt-0.5" style={{ color: "rgba(255,255,255,0.3)" }}>youtube.com</p>
                    </div>
                  </div>
                  {/* Image */}
                  <div
                    className="rounded-2xl overflow-hidden"
                    style={{ border: `1px solid ${CARD_BORDER}` }}
                  >
                    <div
                      className="flex items-center justify-center"
                      style={{
                        height: 100,
                        background: `linear-gradient(135deg, ${TEAL_DARK_BG} 0%, rgba(94,234,212,0.03) 100%)`,
                        color: TEAL,
                      }}
                    >
                      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                        <circle cx="8.5" cy="8.5" r="1.5" />
                        <polyline points="21 15 16 10 5 21" />
                      </svg>
                    </div>
                    <div className="px-5 py-3" style={{ borderTop: `1px solid ${CARD_BORDER}` }}>
                      <p className="font-sans text-xs" style={{ color: "rgba(255,255,255,0.4)" }}>setlist night 3 — the look on his face during unreal unearth. i was not okay.</p>
                    </div>
                  </div>

                  {/* Add button hint */}
                  <div className="pt-1 flex items-center gap-3">
                    <div
                      className="flex items-center gap-2 font-sans text-sm px-4 py-2.5 rounded-full"
                      style={{
                        background: "rgba(255,255,255,0.04)",
                        border: `1px solid ${CARD_BORDER}`,
                        color: "rgba(255,255,255,0.35)",
                      }}
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="12" y1="5" x2="12" y2="19" />
                        <line x1="5" y1="12" x2="19" y2="12" />
                      </svg>
                      Add block
                    </div>
                  </div>
                </div>
              </div>
            </RevealSection>
          </div>
        </section>

        {/* BLOCK TYPES */}
        <section className="relative px-6 sm:px-10 py-24 sm:py-32" style={{ borderTop: `1px solid ${CARD_BORDER}` }}>
          <GrainOverlay opacity={0.07} />
          <div className="relative max-w-5xl mx-auto">
            <RevealSection>
              <EyebrowPill>Block Types</EyebrowPill>
            </RevealSection>
            <RevealSection delay={100}>
              <h2
                className="mt-7 font-display text-ink max-w-2xl"
                style={{ fontSize: "clamp(34px, 5vw, 56px)", lineHeight: 1.06, letterSpacing: "-0.02em", fontWeight: 600 }}
              >
                Three Types.
                <br />
                Infinite Combinations.
              </h2>
            </RevealSection>
            <RevealSection delay={200}>
              <p className="mt-5 max-w-xl font-sans text-base sm:text-lg leading-relaxed" style={{ color: "rgba(255,255,255,0.6)" }}>
                Studio keeps it simple: notes for thinking, links for saving, images for
                seeing. Mix them in whatever order makes sense for the obsession.
              </p>
            </RevealSection>

            <div className="mt-14 space-y-6">
              {blockTypes.map((bt, i) => (
                <RevealSection key={bt.label} delay={300 + i * 140}>
                  <div
                    className="motion-card relative overflow-hidden rounded-3xl"
                    style={{ background: CARD_BG, border: `1px solid ${CARD_BORDER}` }}
                  >
                    <GrainOverlay opacity={0.2} />
                    <div className="relative grid sm:grid-cols-2">
                      {/* Text side */}
                      <div className="p-7 sm:p-10 flex flex-col justify-center">
                        <div className="flex items-center gap-3">
                          <IconTile>{bt.icon}</IconTile>
                          <span
                            className="font-mono text-xs uppercase tracking-widest"
                            style={{ color: "rgba(255,255,255,0.35)" }}
                          >
                            {bt.label}
                          </span>
                        </div>
                        <h3
                          className="mt-7 font-display text-ink"
                          style={{ fontSize: "clamp(22px, 2.8vw, 30px)", letterSpacing: "-0.01em", fontWeight: 600 }}
                        >
                          {bt.headline}
                        </h3>
                        <p className="mt-3 font-sans text-base leading-relaxed" style={{ color: "rgba(255,255,255,0.6)" }}>
                          {bt.body}
                        </p>
                      </div>
                      {/* Preview side */}
                      <div className="px-7 pb-7 sm:p-10 sm:flex sm:items-center sm:border-l sm:border-t-0 border-t"
                        style={{ borderColor: CARD_BORDER }}
                      >
                        <div className="w-full">{bt.preview}</div>
                      </div>
                    </div>
                  </div>
                </RevealSection>
              ))}
            </div>
          </div>
        </section>

        {/* HOW IT WORKS */}
        <section className="relative px-6 sm:px-10 py-24 sm:py-32" style={{ borderTop: `1px solid ${CARD_BORDER}` }}>
          <GrainOverlay opacity={0.07} />
          <div className="relative max-w-5xl mx-auto">
            <RevealSection>
              <EyebrowPill>How It Works</EyebrowPill>
            </RevealSection>
            <RevealSection delay={100}>
              <h2
                className="mt-7 font-display text-ink max-w-xl"
                style={{ fontSize: "clamp(34px, 5vw, 56px)", lineHeight: 1.06, letterSpacing: "-0.02em", fontWeight: 600 }}
              >
                Four Steps.
                <br />
                Instant Workspace.
              </h2>
            </RevealSection>

            <div className="mt-14 grid sm:grid-cols-2 gap-4 sm:gap-5">
              {howItWorksSteps.map((step, i) => (
                <RevealSection key={step.num} delay={200 + i * 100}>
                  <div
                    className="motion-card relative overflow-hidden rounded-3xl p-7 sm:p-9 h-full"
                    style={{ background: CARD_BG, border: `1px solid ${CARD_BORDER}`, minHeight: 200 }}
                  >
                    <GrainOverlay opacity={0.2} />
                    <div className="relative">
                      <p
                        className="font-display"
                        style={{ fontSize: "clamp(48px, 6vw, 64px)", fontWeight: 700, letterSpacing: "-0.03em", color: "rgba(94,234,212,0.12)", lineHeight: 1 }}
                      >
                        {step.num}
                      </p>
                      <h3
                        className="mt-3 font-display text-ink"
                        style={{ fontSize: "clamp(18px, 2vw, 22px)", letterSpacing: "-0.01em", fontWeight: 600 }}
                      >
                        {step.title}
                      </h3>
                      <p className="mt-2 font-sans text-[15px] leading-relaxed" style={{ color: "rgba(255,255,255,0.6)" }}>
                        {step.body}
                      </p>
                    </div>
                  </div>
                </RevealSection>
              ))}
            </div>
          </div>
        </section>

        {/* QUOTES */}
        <section className="relative px-6 sm:px-10 py-24 sm:py-32" style={{ borderTop: `1px solid ${CARD_BORDER}` }}>
          <GrainOverlay opacity={0.07} />
          <div className="relative max-w-5xl mx-auto">
            <RevealSection>
              <EyebrowPill>What People Say</EyebrowPill>
            </RevealSection>
            <RevealSection delay={100}>
              <h2
                className="mt-7 font-display text-ink max-w-2xl"
                style={{ fontSize: "clamp(34px, 5vw, 56px)", lineHeight: 1.06, letterSpacing: "-0.02em", fontWeight: 600 }}
              >
                The Tab Hoarders
                <br />
                Found a Home.
              </h2>
            </RevealSection>

            <div className="mt-14 grid sm:grid-cols-3 gap-4 sm:gap-5">
              {studioQuotes.map((q, i) => (
                <RevealSection key={q.name} delay={200 + i * 100}>
                  <div
                    className="motion-card relative overflow-hidden rounded-3xl p-7 h-full"
                    style={{ background: CARD_BG, border: `1px solid ${CARD_BORDER}` }}
                  >
                    <GrainOverlay opacity={0.2} />
                    <div className="relative flex flex-col h-full">
                      <div className="flex gap-1 mb-5">
                        {Array.from({ length: 5 }).map((_, j) => (
                          <span key={j} className="inline-flex items-center justify-center"
                            style={{ width: 20, height: 20, background: TEAL, color: "#0A0A0A", borderRadius: 3, fontSize: 12 }}>
                            ★
                          </span>
                        ))}
                      </div>
                      <p className="font-sans text-[15px] leading-relaxed flex-1" style={{ color: "rgba(255,255,255,0.78)" }}>
                        &ldquo;{q.quote}&rdquo;
                      </p>
                      <div className="mt-6 pt-5" style={{ borderTop: `1px solid ${CARD_BORDER}` }}>
                        <p className="font-display text-ink" style={{ fontSize: 15, fontWeight: 600 }}>{q.name}</p>
                        <p className="font-sans text-sm mt-0.5" style={{ color: "rgba(255,255,255,0.4)" }}>{q.fix}</p>
                      </div>
                    </div>
                  </div>
                </RevealSection>
              ))}
            </div>
          </div>
        </section>

        {/* FINAL CTA */}
        <section className="relative px-6 sm:px-10 pt-12 pb-24 sm:pb-32" style={{ borderTop: `1px solid ${CARD_BORDER}` }}>
          <div
            className="relative overflow-hidden rounded-3xl mx-auto max-w-5xl px-6 sm:px-10 py-24 sm:py-36 text-center"
            style={{ background: "#0A0A0B" }}
          >
            <div
              aria-hidden
              className="absolute inset-0 pointer-events-none anim-bloom"
              style={{
                background: "radial-gradient(ellipse 90% 100% at 50% 100%, #5EEAD4 0%, #2DD4BF 20%, #0E4F47 45%, #08231F 70%, #0A0A0B 100%)",
                transformOrigin: "50% 100%",
              }}
            />
            <div
              aria-hidden
              className="absolute inset-0 pointer-events-none"
              style={{ backgroundImage: NOISE_URL, backgroundSize: "200px 200px", opacity: 0.55, mixBlendMode: "overlay" }}
            />
            <div className="relative">
              <RevealSection>
                <span
                  className="inline-flex items-center gap-2 font-mono text-xs tracking-widest uppercase px-4 py-2 rounded-full mb-8"
                  style={{ background: TEAL_DARK_BG, color: TEAL, border: `1px solid ${TEAL_DARK_BORDER}` }}
                >
                  Hyperfix Studio
                </span>
              </RevealSection>
              <RevealSection delay={100}>
                <h2
                  className="font-display text-ink mx-auto max-w-3xl"
                  style={{ fontSize: "clamp(40px, 6.5vw, 76px)", lineHeight: 1.03, letterSpacing: "-0.02em", fontWeight: 600 }}
                >
                  Start Building
                  <br />
                  Your Workspace.
                </h2>
              </RevealSection>
              <RevealSection delay={220}>
                <p className="mt-7 mx-auto max-w-xl font-sans text-base sm:text-lg leading-relaxed" style={{ color: "rgba(255,255,255,0.78)" }}>
                  Studio opens automatically when you log your first fix. No setup. No
                  settings. Just you and the obsession.
                </p>
              </RevealSection>
              <RevealSection delay={360}>
                <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
                  <a
                    href="/join"
                    className="inline-flex items-center gap-3 font-sans text-base font-semibold px-7 py-4 transition-all duration-200 hover:opacity-95 hover:-translate-y-px hover:scale-[1.02] active:scale-[0.98]"
                    style={{
                      background: "#FFFFFF",
                      color: "#0A0A0A",
                      borderRadius: 999,
                      boxShadow: "0 1px 0 0 rgba(255,255,255,0.5) inset, 0 12px 36px rgba(0,0,0,0.4), 0 0 60px rgba(94,234,212,0.30)",
                    }}
                  >
                    Create Your First Fix
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M5 12h14M13 5l7 7-7 7" />
                    </svg>
                  </a>
                  <a
                    href="/"
                    className="font-sans text-sm transition-opacity hover:opacity-70"
                    style={{ color: "rgba(255,255,255,0.55)" }}
                  >
                    Back to Hyperfix →
                  </a>
                </div>
              </RevealSection>
            </div>
          </div>
        </section>

        <Footer />
      </main>
    </>
  );
}
