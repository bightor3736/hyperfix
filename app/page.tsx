import type { Metadata } from "next";
import HyperfixCard from "@/components/HyperfixCard";
import { TiltCard } from "@/components/TiltCard";
import { RevealSection } from "@/components/RevealSection";
import FixCalculator from "@/components/FixCalculator";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import { FixStatusPill, type FixStatus } from "@/components/FixStatusPill";

async function getWaitlistCount(): Promise<number> {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!supabaseUrl || !serviceKey) return 1247;
  try {
    const res = await fetch(`${supabaseUrl}/rest/v1/waitlist?select=id`, {
      headers: {
        apikey: serviceKey,
        Authorization: `Bearer ${serviceKey}`,
        Prefer: "count=exact",
        "Range-Unit": "items",
        Range: "0-0",
      },
      next: { revalidate: 60 },
    });
    const raw = res.headers.get("content-range") ?? "";
    return parseInt(raw.split("/")[1] ?? "0", 10) || 1247;
  } catch {
    return 1247;
  }
}

async function getAvgDays(): Promise<number> {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!supabaseUrl || !serviceKey) return 47;
  try {
    const res = await fetch(
      `${supabaseUrl}/rest/v1/fixes?select=started_at,ended_at&ended_at=not.is.null&is_public=eq.true&limit=500`,
      {
        headers: { apikey: serviceKey, Authorization: `Bearer ${serviceKey}` },
        next: { revalidate: 3600 },
      }
    );
    const fixes: { started_at: string; ended_at: string }[] = await res.json();
    if (!Array.isArray(fixes) || fixes.length === 0) return 47;
    const totalDays = fixes.reduce((sum, f) => {
      return sum + Math.max(1, Math.ceil(
        (new Date(f.ended_at).getTime() - new Date(f.started_at).getTime()) / 86_400_000
      ));
    }, 0);
    return Math.round(totalDays / fixes.length) || 47;
  } catch {
    return 47;
  }
}

export const metadata: Metadata = {
  title: "Hyperfix — what are you unwell about?",
};

// --- DATA -------------------------------------------------------------------

const tickerItems = [
  "@maya · day 47 · the marauders",
  "@luca · day 12 · Sabrina Carpenter — Tears (loop count 219)",
  "@theo · day 3 · that one TikTok about the medieval marketplace",
  "@iris · day 89 · larissa weems x wednesday addams",
  "@kai · day 156 · Genshin Impact lore (has never played the game)",
  "@nour · day 22 · Hamilton (again, the third era)",
  "@sole · day 8 · the bridgerton kitchen scene",
  "@finn · day 412 · one specific Homestuck panel",
  "@vera · day 31 · Heated Rivalry by Rachel Reid",
  "@ren · day 5 · a 4-hour YouTube essay about Roman concrete",
];

const cards = [
  {
    title: "The Marauders fanfic that ruined my life",
    type: "fanfic · ao3",
    day: 47,
    intensity: 9,
    user: "@lupin-loving-loser",
    tilt: "tilt-l",
    started: "Started March 21",
    note: "i should be studying. instead.",
    color: "bg-paper",
  },
  {
    title: "Sabrina Carpenter — 'Tears'",
    type: "song · on loop",
    day: 12,
    intensity: 7,
    user: "@sob.exe",
    tilt: "tilt-r",
    started: "Loop count: 219",
    note: "the bridge undid me",
    color: "bg-paperDeep",
  },
  {
    title: "Larissa Weems × Wednesday Addams",
    type: "ship · netflix",
    day: 89,
    intensity: 10,
    user: "@weemspilled",
    tilt: "tilt-l",
    started: "Started January 17",
    note: "she's literally me",
    color: "bg-paper",
  },
];

const audiences = [
  "have rewatched Pride & Prejudice (2005) thirty-seven times",
  "have a fourteen-tab fic queue open at this moment",
  "memorized the Hamilton soundtrack in a single weekend in 2017",
  "know the lore of a video game you have never played",
  "have built a moodboard for a character with eleven lines of dialogue",
  "have a K-pop bias that is currently rearranging your nervous system",
  "have made your friends mute you in the group chat at least once",
  "have a Notes app entry titled 'thoughts on chapter 17' that is six thousand words long",
];

const faqs = [
  {
    q: "What is a hyperfixation tracker?",
    a: "A hyperfixation tracker is a journal for whatever you're currently obsessed with — a song on loop, a fanfic you keep re-reading, a film you've rewatched too many times to admit. Hyperfix lets you log the obsession, count the days it's lasted, and save an end-of-fix eulogy when it finally fades. Think of it as Letterboxd for the things that are quietly running your life.",
  },
  {
    q: "How is Hyperfix different from a journal or Notion template?",
    a: "Notion templates are private spreadsheets. Hyperfix is built around the moment of obsession itself — day counters, intensity meters, and shareable cards designed to be screenshotted. Where a journal lives in a drawer, Hyperfix lives in your group chat. It's the difference between writing in a diary and showing your diary to one specific friend.",
  },
  {
    q: "Is this a hyperfixation tracker for ADHD?",
    a: "Hyperfix isn't a medical tool, and we don't pathologize hyperfixation. That said: the AuDHD and ADHD communities reclaimed this word, and a huge share of our early users come from there. If your brain regularly attaches itself to one specific thing for weeks at a time, Hyperfix gives it a home. We're not trying to fix you. We're trying to count.",
  },
  {
    q: "Is there an app?",
    a: "Hyperfix is web-first. The site works on every phone, every browser, no installs, no App Store. A native app will follow once enough people are using the web version daily that push notifications would meaningfully add to the experience. Today, that's not yet true. Today, the share card is the product.",
  },
  {
    q: "Will my hyperfixes be public?",
    a: "Up to you. Every fix has a privacy toggle. Public fixes live on your profile and can be shared as cards. Private fixes are visible only to you. You can also make a fix friends-only — visible to people you've added but not to the open web. Plenty of our users keep their most unhinged ones private. That's allowed.",
  },
  {
    q: "What can I track on Hyperfix?",
    a: "Anything. Songs, films, fanfics, TV shows, books, characters, ships, video essays, YouTube channels, podcasts, video games, real people whose Wikipedia page you read at 3 a.m., niche historical events, recipes you've made every night for a month. If you cannot shut up about it, it counts.",
  },
  {
    q: "Is there a Hyperfix Wrapped?",
    a: "Yes. At the end of each year Hyperfix generates a personal recap — your longest hyperfix, your most intense one, the era you can never get back. It's designed to be screenshot-shareable, the way Spotify Wrapped is, but for the things you'd never tell Spotify about.",
  },
  {
    q: "How much does it cost?",
    a: "Free to log your obsessions and share cards. A Pro tier (small monthly price, TBA) unlocks unlimited fixes, premium card templates, your own custom URL, private mode, and the eulogy generator. We will never sell your data, and we don't train AI on your content.",
  },
  {
    q: "When does Hyperfix launch?",
    a: "It's live. Sign up free at hyperfix.app — no waitlist, no invite code. A Pro tier is coming soon with unlimited fixes, premium cards, and more. Early members get a permanent discount when it launches.",
  },
];

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map((f) => ({
    "@type": "Question",
    name: f.q,
    acceptedAnswer: { "@type": "Answer", text: f.a },
  })),
};

// --- PAGE -------------------------------------------------------------------

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ code?: string; error?: string }>;
}) {
  const params = await searchParams;

  // Supabase OAuth lands here if /auth/callback isn't in the allowed redirect list.
  // Handle client-side so the PKCE code_verifier (stored in browser) is accessible.
  if (params.code) {
    const { OAuthCallback } = await import("@/components/OAuthCallback");
    return <OAuthCallback code={params.code} />;
  }

  const [waitlistCount, avgDays] = await Promise.all([
    getWaitlistCount(),
    getAvgDays(),
  ]);
  const countRes = { count: waitlistCount };
  const statsRes = { avgDays };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <main id="main-content" className="relative z-10 text-ink">

        {/* TICKER ------------------------------------------------------- */}
        <div
          className="overflow-hidden ticker-wrap"
          style={{ background: "#111113", borderBottom: "1px solid rgba(244,244,244,0.07)" }}
        >
          <div className="flex whitespace-nowrap py-2.5 marquee">
            {[...tickerItems, ...tickerItems].map((item, i) => (
              <span
                key={i}
                className="font-mono text-[11px] uppercase tracking-widest text-[rgba(244,244,244,0.4)] px-6 shrink-0"
              >
                {item}
                <span className="ml-6 text-accent">●</span>
              </span>
            ))}
          </div>
        </div>

        <Nav />

        {/* HERO --------------------------------------------------------- */}
        <section className="px-6 sm:px-10 pt-12 sm:pt-20 pb-20 sm:pb-32 overflow-hidden relative">
          <div className="max-w-7xl mx-auto grid lg:grid-cols-12 gap-12 lg:gap-16 items-end relative">
            <div className="lg:col-span-7 reveal">
              <span
                className="inline-flex items-center font-mono text-[10px] uppercase tracking-widest rounded-full px-3 py-1 mb-8"
                style={{ background: "rgba(244,244,244,0.06)", color: "rgba(244,244,244,0.4)" }}
              >
                a hyperfixation tracker · web · 2026
              </span>
              <h1 className="display font-display font-medium text-[3.5rem] sm:text-[5rem] lg:text-[6.5rem] leading-[0.92] tracking-crush text-ink text-balance">
                What are you
                <br />
                <span className="italic text-accent">unwell</span> about?
              </h1>
              <p className="mt-8 font-sans text-lg sm:text-xl text-inkSoft max-w-xl leading-snug">
                Hyperfix is a journal for your current obsession — the song on
                loop, the fic you&apos;ve re-read six times, the character who has
                rearranged your brain. Log it. Count the days. Mourn it when it
                ends.
              </p>

              {/* Stat pills */}
              <div className="flex flex-wrap gap-3 mt-8">
                <span
                  className="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-widest rounded-full px-4 py-2"
                  style={{ background: "#111113", border: "1px solid rgba(244,244,244,0.07)", color: "rgba(244,244,244,0.7)" }}
                >
                  <span className="text-accent font-bold tabular">{countRes.count.toLocaleString()}</span> members
                </span>
                <span
                  className="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-widest rounded-full px-4 py-2"
                  style={{ background: "#111113", border: "1px solid rgba(244,244,244,0.07)", color: "rgba(244,244,244,0.7)" }}
                >
                  <span className="text-accent font-bold tabular">{statsRes.avgDays}</span> avg days per fix
                </span>
              </div>

              <div className="flex flex-wrap gap-3 mt-8">
                <a
                  href="/join"
                  className="inline-flex items-center font-mono text-[12px] uppercase tracking-widest px-7 py-4 font-bold transition-all hover:opacity-90 active:scale-[0.98]"
                  style={{ background: "#A3E635", color: "#0A0A0A", borderRadius: 999 }}
                >
                  Start tracking free →
                </a>
                <a
                  href="/auth/login"
                  className="inline-flex items-center font-mono text-[12px] uppercase tracking-widest px-7 py-4 font-medium transition-all hover:opacity-80"
                  style={{ background: "rgba(244,244,244,0.06)", color: "rgba(244,244,244,0.7)", borderRadius: 999, border: "1px solid rgba(244,244,244,0.1)" }}
                >
                  Sign in
                </a>
              </div>
            </div>

            {/* HERO CARD */}
            <div className="lg:col-span-5 reveal" style={{ animationDelay: "0.15s" }}>
              <div className="relative">
                <div className="absolute inset-0 translate-x-5 translate-y-4 rotate-[5deg] pointer-events-none opacity-20 scale-[0.96] -z-10">
                  <HyperfixCard {...cards[1]} tilt="" />
                </div>
                <div className="relative z-10">
                  <TiltCard tiltLimit={10} scale={1.03} effect="gravitate">
                    <HyperfixCard {...cards[0]} tilt="" />
                  </TiltCard>
                </div>
                <p className="mt-6 font-display italic text-muted text-sm text-center max-w-xs mx-auto">
                  ↑ a typical entry. yours will be worse.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* THE PROBLEM -------------------------------------------------- */}
        <section className="px-6 sm:px-10 py-20 sm:py-32" style={{ background: "#0A0A0A" }}>
          <div className="max-w-5xl mx-auto">
            <span
              className="inline-flex items-center font-mono text-[10px] uppercase tracking-widest rounded-full px-3 py-1 mb-8"
              style={{ background: "rgba(244,244,244,0.06)", color: "rgba(244,244,244,0.4)" }}
            >
              the diagnosis
            </span>
            <h2 className="font-display text-4xl sm:text-6xl lg:text-7xl leading-[0.98] tracking-tightest text-ink">
              You don&apos;t have a personality.
              <br />
              <span className="italic text-accent">You have hyperfixations.</span>
            </h2>
            <div className="mt-12 grid md:grid-cols-2 gap-6 max-w-4xl">
              <div
                className="rounded-3xl p-6 sm:p-8"
                style={{ background: "#1C1C1E", border: "1px solid rgba(244,244,244,0.07)" }}
              >
                <p className="font-sans text-lg leading-snug text-[rgba(244,244,244,0.7)]">
                  You&apos;ve rewatched the same scene two hundred times. You&apos;ve
                  memorized fic chapter 17 by heart. Your group chat has muted you.
                </p>
              </div>
              <div
                className="rounded-3xl p-6 sm:p-8"
                style={{ background: "#1C1C1E", border: "1px solid rgba(244,244,244,0.07)" }}
              >
                <p className="font-sans text-lg leading-snug text-[rgba(244,244,244,0.7)]">
                  Somewhere in your Notes app there is a six-thousand-word rant
                  about a fictional sixteenth-century duel. You deserve a place to
                  put all this.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* HOW IT WORKS ------------------------------------------------- */}
        <section className="px-6 sm:px-10 py-20 sm:py-32" style={{ background: "#0A0A0A" }}>
          <div className="max-w-4xl mx-auto">
            <div className="mb-10">
              <h2 className="font-display text-4xl sm:text-6xl leading-[0.98] tracking-tightest text-ink">
                Three steps.
                <br />
                <span className="italic">No one will judge you.</span>
              </h2>
              <p className="mt-3 font-mono text-[11px] uppercase tracking-widest text-[rgba(244,244,244,0.35)]">
                except your friends, slightly
              </p>
            </div>

            <div
              className="rounded-[24px] overflow-hidden"
              style={{ background: "#111113", border: "1px solid rgba(244,244,244,0.07)" }}
            >
              {[
                {
                  n: "01",
                  h: "Log it.",
                  p: "Add your current hyperfix. A song, a fic, a character, a video essay you have rewatched twice today. Anything you cannot shut up about. One line of input is enough.",
                },
                {
                  n: "02",
                  h: "Count it.",
                  p: "Watch your day-counter tick. The longer it lasts, the more unwell you become. Make it public if you're brave. Watch your friends discover what you've been hiding.",
                },
                {
                  n: "03",
                  h: "Mourn it.",
                  p: "When the fix finally ends, Hyperfix writes the eulogy. Save it. Share it. Build a graveyard of your past selves and the things that ran your life for seventy-two days.",
                },
              ].map((step, i) => (
                <RevealSection key={step.n} delay={i * 120}>
                  <div
                    className="flex items-start gap-5 px-6 sm:px-8 py-6"
                    style={i < 2 ? { borderBottom: "1px solid rgba(244,244,244,0.07)" } : {}}
                  >
                    <span
                      className="font-mono text-[11px] font-bold shrink-0 mt-0.5"
                      style={{
                        background: "#A3E635",
                        color: "#0A0A0A",
                        borderRadius: 999,
                        padding: "4px 11px",
                        letterSpacing: "0.06em",
                      }}
                    >
                      {step.n}
                    </span>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-display text-2xl sm:text-3xl leading-tight tracking-tight text-ink mb-2">
                        {step.h}
                      </h3>
                      <p className="font-sans text-base text-[rgba(244,244,244,0.55)] leading-relaxed">
                        {step.p}
                      </p>
                    </div>
                  </div>
                </RevealSection>
              ))}
            </div>
          </div>
        </section>

        {/* FIX LIFECYCLE ------------------------------------------------ */}
        <section className="px-6 sm:px-10 py-20 sm:py-32" style={{ background: "#0A0A0A", borderTop: "1px solid rgba(244,244,244,0.07)" }}>
          <div className="max-w-5xl mx-auto">
            <RevealSection>
              <span
                className="inline-flex items-center font-mono text-[10px] uppercase tracking-widest rounded-full px-3 py-1 mb-8"
                style={{ background: "rgba(244,244,244,0.06)", color: "rgba(244,244,244,0.4)" }}
              >
                fix lifecycle
              </span>
              <h2 className="font-display text-4xl sm:text-6xl leading-[0.98] tracking-tightest mb-4 text-ink">
                Every fix has a stage.
                <br />
                <span className="italic text-accent">Yours is showing.</span>
              </h2>
              <p className="font-sans text-base text-[rgba(244,244,244,0.45)] max-w-xl mt-3 mb-12 leading-relaxed">
                Hyperfix tracks exactly where you are in the spiral — from the first
                intrusive thought to the full eulogy.
              </p>
            </RevealSection>

            <div
              className="rounded-[24px] overflow-hidden"
              style={{ background: "#111113", border: "1px solid rgba(244,244,244,0.07)" }}
            >
              {(
                [
                  {
                    status: "Day 1" as FixStatus,
                    headline: "It found you.",
                    body: "You stumbled in. One song. One scene. One paragraph. You don't know yet that this is the beginning.",
                  },
                  {
                    status: "Obsessing" as FixStatus,
                    headline: "You're in it.",
                    body: "Your friends have noticed. Your screen time is unhinged. You are fine. You are completely fine. You have tabs.",
                  },
                  {
                    status: "On loop" as FixStatus,
                    headline: "Repeat. Repeat. Repeat.",
                    body: "The same fic chapter. The same scene. The same thirty-second clip. You have played it 400 times and it still hits the same.",
                  },
                  {
                    status: "Fading" as FixStatus,
                    headline: "Something is different.",
                    body: "You opened the fic and closed it. The song is still good but not like that. You're scared to admit it's ending.",
                  },
                  {
                    status: "Post-fix" as FixStatus,
                    headline: "The comedown.",
                    body: "It's over and you feel it. Nothing is as interesting. You're sitting with the specific grief of not being unwell about something anymore.",
                  },
                  {
                    status: "Ended" as FixStatus,
                    headline: "Logged. Mourned. Archived.",
                    body: "The fix ends. The eulogy is written. It goes in the graveyard where you can visit it forever and feel a little something.",
                  },
                  {
                    status: "Dormant" as FixStatus,
                    headline: "Paused — not dead.",
                    body: "You're not actively fixating but you haven't let go. One episode. One read. It could reignite at any moment and you know it.",
                  },
                  {
                    status: "Send help" as FixStatus,
                    headline: "This one has you.",
                    body: "Intensity: 10. Day count: triple digits. You have built a shrine. Someone has asked if you're okay with a tone that suggested the answer should be no.",
                  },
                ] as { status: FixStatus; headline: string; body: string }[]
              ).map((row, i, arr) => (
                <RevealSection key={row.status} delay={i * 60}>
                  <div
                    className="flex items-start gap-5 px-6 sm:px-8 py-5 sm:py-6"
                    style={i < arr.length - 1 ? { borderBottom: "1px solid rgba(244,244,244,0.06)" } : {}}
                  >
                    <div className="shrink-0 mt-0.5 w-[110px] flex justify-start">
                      <FixStatusPill status={row.status} size="sm" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-display text-base sm:text-lg leading-snug tracking-tight text-[rgba(244,244,244,0.85)] mb-0.5">
                        {row.headline}
                      </p>
                      <p className="font-sans text-sm text-[rgba(244,244,244,0.4)] leading-relaxed">
                        {row.body}
                      </p>
                    </div>
                  </div>
                </RevealSection>
              ))}
            </div>

            {/* Pill cloud */}
            <RevealSection delay={100}>
              <div className="mt-10 flex flex-wrap gap-2.5">
                {(["Day 1", "Obsessing", "On loop", "Fading", "Post-fix", "Ended", "Dormant", "Send help"] as FixStatus[]).map((s) => (
                  <FixStatusPill key={s} status={s} size="lg" />
                ))}
              </div>
            </RevealSection>
          </div>
        </section>

        {/* CARD GALLERY ------------------------------------------------- */}
        <section className="px-6 sm:px-10 py-20 sm:py-32 relative" style={{ background: "#0A0A0A" }}>
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <span
                className="inline-flex items-center font-mono text-[10px] uppercase tracking-widest rounded-full px-3 py-1 mb-6"
                style={{ background: "rgba(244,244,244,0.06)", color: "rgba(244,244,244,0.4)" }}
              >
                share cards
              </span>
              <h2 className="font-display text-4xl sm:text-6xl leading-[0.95] tracking-tightest max-w-3xl mx-auto text-ink">
                Every fix gets a card.
                <br />
                <span className="italic text-accent">
                  Every card gets screenshotted.
                </span>
              </h2>
              <p className="mt-6 font-sans text-lg text-[rgba(244,244,244,0.5)] max-w-xl mx-auto">
                Drop them in your group chat. Post them to Instagram Stories.
                Send them to the one friend who already knows. The card is the
                whole product.
              </p>
            </div>

            <div className="relative">
              <div className="lg:hidden absolute left-0 top-0 bottom-4 w-10 bg-gradient-to-r from-[#0A0A0A] to-transparent z-10 pointer-events-none" />
              <div className="lg:hidden absolute right-0 top-0 bottom-4 w-10 bg-gradient-to-l from-[#0A0A0A] to-transparent z-10 pointer-events-none" />
              <div className="flex gap-8 overflow-x-auto snap-x snap-mandatory scrollbar-hide pb-4 -mx-6 px-6 lg:mx-0 lg:px-0 lg:flex-wrap lg:justify-center lg:overflow-x-visible lg:pb-0">
                {cards.map((card, i) => (
                  <div key={i} className="snap-center shrink-0 lg:shrink-0">
                    <TiltCard tiltLimit={12} scale={1.04} effect="gravitate">
                      <HyperfixCard {...card} tilt="" />
                    </TiltCard>
                  </div>
                ))}
              </div>
            </div>
            <p className="mt-6 text-center font-mono text-[10px] uppercase tracking-widest text-[rgba(244,244,244,0.25)] lg:hidden">
              ← swipe →
            </p>
          </div>
        </section>

        {/* FIX CALCULATOR ----------------------------------------------- */}
        <section className="px-6 sm:px-10 py-20 sm:py-32" style={{ background: "#0A0A0A", borderTop: "1px solid rgba(244,244,244,0.07)" }}>
          <div className="max-w-6xl mx-auto">
            <RevealSection>
              <span
                className="inline-flex items-center font-mono text-[10px] uppercase tracking-widest rounded-full px-3 py-1 mb-6"
                style={{ background: "rgba(244,244,244,0.06)", color: "rgba(244,244,244,0.4)" }}
              >
                try it
              </span>
              <h2 className="font-display text-4xl sm:text-6xl leading-[0.98] tracking-tightest mb-4 text-balance text-ink">
                What are you
                <br />
                <span className="italic text-accent">unwell about?</span>
              </h2>
              <p className="font-display italic text-[rgba(244,244,244,0.4)] text-lg mb-14 max-w-xl">
                Build your card. See what it looks like when it&apos;s real.
              </p>
            </RevealSection>
            <FixCalculator />
          </div>
        </section>

        {/* AUDIENCE ----------------------------------------------------- */}
        <section className="px-6 sm:px-10 py-20 sm:py-32" style={{ background: "#0A0A0A" }}>
          <div className="max-w-4xl mx-auto">
            <h2 className="font-display text-4xl sm:text-6xl lg:text-7xl leading-[0.95] tracking-tightest mb-10 text-ink">
              For the ones who
            </h2>
            <div
              className="rounded-[24px] overflow-hidden"
              style={{ background: "#111113", border: "1px solid rgba(244,244,244,0.07)" }}
            >
              {audiences.map((line, i) => (
                <div
                  key={i}
                  className="flex items-center gap-5 px-6 sm:px-8 py-5"
                  style={i < audiences.length - 1 ? { borderBottom: "1px solid rgba(244,244,244,0.07)" } : {}}
                >
                  <span
                    className="font-mono text-[10px] font-bold shrink-0 tabular"
                    style={{
                      background: "#A3E635",
                      color: "#0A0A0A",
                      borderRadius: 999,
                      padding: "3px 10px",
                      letterSpacing: "0.06em",
                    }}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="font-display text-xl sm:text-2xl lg:text-3xl leading-snug tracking-tight italic text-ink">
                    {line}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* SOCIAL PROOF ------------------------------------------------- */}
        <section className="px-6 sm:px-10 py-20 sm:py-28" style={{ background: "#0A0A0A" }}>
          <div className="max-w-6xl mx-auto">
            <span
              className="inline-flex items-center font-mono text-[10px] uppercase tracking-widest rounded-full px-3 py-1 mb-10"
              style={{ background: "rgba(244,244,244,0.06)", color: "rgba(244,244,244,0.4)" }}
            >
              what people are saying
            </span>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                {
                  quote: "i have been waiting for this app since 2019 when i had to explain to my therapist why i made a spreadsheet about a fictional war",
                  user: "@parchment.spiral",
                  fix: "the marauders era · day 312",
                  from: "group chat",
                },
                {
                  quote: "finally something that understands the difference between liking something and being OWNED by something",
                  user: "@kai.unwell",
                  fix: "genshin impact lore · day 89",
                  from: "early member",
                },
                {
                  quote: "i literally told my partner 'hyperfix is coming out and that's why i'm like this' and they said 'that explains so much'",
                  user: "@theosobs",
                  fix: "hozier discography · day 44",
                  from: "twitter dm",
                },
                {
                  quote: "the day counter is the feature i didn't know i needed. yes it has been 156 days. yes i am fine. stop asking.",
                  user: "@nour.fixated",
                  fix: "a court of thorns and roses · day 156",
                  from: "early member",
                },
                {
                  quote: "the share card concept alone. the SHARE CARD CONCEPT. someone finally gets it.",
                  user: "@sole.screaming",
                  fix: "bridgerton season 3 · day 28",
                  from: "instagram story",
                },
                {
                  quote: "i joined the waitlist and showed my friend and she said 'this is literally made for you' which is both correct and slightly concerning",
                  user: "@vera.in.flames",
                  fix: "heated rivalry by rachel reid · day 61",
                  from: "group chat",
                },
              ].map((t, i) => (
                <RevealSection key={t.user} delay={i * 80}>
                  <div
                    className="p-6 flex flex-col gap-0 relative overflow-hidden rounded-[20px]"
                    style={{
                      background: "#1C1C1E",
                      border: "1px solid rgba(244,244,244,0.07)",
                      borderLeft: "3px solid rgba(163,230,53,0.4)",
                    }}
                  >
                    <p className="font-mono text-[9px] uppercase tracking-widest text-[rgba(244,244,244,0.25)] mb-4">
                      ← {t.from}
                    </p>
                    <p className="font-display italic text-[rgba(244,244,244,0.8)] text-[15px] leading-snug flex-1 mb-5">
                      &ldquo;{t.quote}&rdquo;
                    </p>
                    <div className="pt-3" style={{ borderTop: "1px solid rgba(244,244,244,0.07)" }}>
                      <p className="font-mono text-[10px] uppercase tracking-widest text-accent">{t.user}</p>
                      <p className="font-mono text-[10px] uppercase tracking-widest text-[rgba(244,244,244,0.35)] mt-0.5">{t.fix}</p>
                    </div>
                  </div>
                </RevealSection>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ ---------------------------------------------------------- */}
        <section className="px-6 sm:px-10 py-20 sm:py-32" style={{ background: "#0A0A0A" }}>
          <div className="max-w-4xl mx-auto">
            <div className="mb-10">
              <span
                className="inline-flex items-center font-mono text-[10px] uppercase tracking-widest rounded-full px-3 py-1 mb-6"
                style={{ background: "rgba(244,244,244,0.06)", color: "rgba(244,244,244,0.4)" }}
              >
                frequently · asked · questions
              </span>
              <h2 className="font-display text-4xl sm:text-6xl leading-[0.98] tracking-tightest text-ink">
                The interview.
              </h2>
            </div>
            <div
              className="rounded-[24px] overflow-hidden"
              style={{ background: "#111113", border: "1px solid rgba(244,244,244,0.07)" }}
            >
              {faqs.map((faq, i) => (
                <details
                  key={i}
                  className="group [&_summary::-webkit-details-marker]:hidden"
                  style={i < faqs.length - 1 ? { borderBottom: "1px solid rgba(244,244,244,0.07)" } : {}}
                >
                  <summary className="flex items-center justify-between gap-6 cursor-pointer list-none px-6 sm:px-8 py-6">
                    <div className="flex items-center gap-4 min-w-0">
                      <span
                        className="font-mono text-[10px] font-bold shrink-0 tabular"
                        style={{
                          background: "#A3E635",
                          color: "#0A0A0A",
                          borderRadius: 999,
                          padding: "3px 10px",
                          letterSpacing: "0.06em",
                        }}
                      >
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <h3 className="font-display text-lg sm:text-xl tracking-tight leading-snug text-ink">
                        {faq.q}
                      </h3>
                    </div>
                    <span
                      aria-hidden="true"
                      className="font-mono text-2xl text-[rgba(244,244,244,0.4)] group-open:rotate-45 transition-transform shrink-0"
                    >
                      +
                    </span>
                  </summary>
                  <p className="px-6 sm:px-8 pb-6 font-sans text-base sm:text-lg text-[rgba(244,244,244,0.55)] leading-relaxed max-w-2xl">
                    {faq.a}
                  </p>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* DIG DEEPER --------------------------------------------------- */}
        <section className="px-6 sm:px-10 py-16 sm:py-20" style={{ background: "#0A0A0A", borderTop: "1px solid rgba(244,244,244,0.07)" }}>
          <div className="max-w-6xl mx-auto">
            <span
              className="inline-flex items-center font-mono text-[10px] uppercase tracking-widest rounded-full px-3 py-1 mb-8"
              style={{ background: "rgba(244,244,244,0.06)", color: "rgba(244,244,244,0.4)" }}
            >
              read more
            </span>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {[
                { href: "/hyperfixation-tracker", label: "Hyperfixation Tracker", desc: "What it is, how it works, who it's for.", badge: "tracker" },
                { href: "/kpop-tracker", label: "K-Pop Tracker", desc: "Bias eras, comeback spirals, bias wreckers.", badge: "tracker" },
                { href: "/anime-tracker", label: "Anime Tracker", desc: "Ships, characters, series that consumed you.", badge: "tracker" },
                { href: "/blog/what-is-hyperfixation", label: "What Is Hyperfixation?", desc: "Definition, history, why the word matters.", badge: "blog" },
                { href: "/blog/adhd-hyperfixation", label: "ADHD Hyperfixation", desc: "Why your brain does this.", badge: "blog" },
                { href: "/manifesto", label: "The Manifesto", desc: "Why this exists. Read if you're unwell.", badge: "read" },
              ].map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  className="group flex flex-col gap-3 p-5 rounded-[20px] transition-all hover:border-accent/40"
                  style={{ background: "#111113", border: "1px solid rgba(244,244,244,0.07)" }}
                >
                  <span
                    className="self-start font-mono text-[9px] uppercase tracking-widest rounded-full px-2.5 py-0.5"
                    style={{ background: "rgba(244,244,244,0.06)", color: "rgba(244,244,244,0.35)" }}
                  >
                    {item.badge}
                  </span>
                  <h3 className="font-display text-base tracking-tight text-ink group-hover:text-accent transition-colors leading-snug">
                    {item.label} →
                  </h3>
                  <p className="font-mono text-[10px] uppercase tracking-widest text-[rgba(244,244,244,0.35)] leading-relaxed">
                    {item.desc}
                  </p>
                </a>
              ))}
            </div>
          </div>
        </section>

        {/* FINAL CTA ---------------------------------------------------- */}
        <section className="px-6 sm:px-10 py-24 sm:py-40" style={{ background: "#111113", borderTop: "1px solid rgba(244,244,244,0.07)" }}>
          <div className="max-w-5xl mx-auto text-center">
            <span
              className="inline-flex items-center font-mono text-[10px] uppercase tracking-widest rounded-full px-3 py-1 mb-8"
              style={{ background: "rgba(244,244,244,0.06)", color: "rgba(244,244,244,0.4)" }}
            >
              the closing argument
            </span>
            <h2 className="font-display text-5xl sm:text-7xl lg:text-8xl leading-[0.92] tracking-crush text-ink">
              Your obsession
              <br />
              <span className="italic">currently lives</span>
              <br />
              <span className="text-accent">in fourteen places.</span>
            </h2>
            <p className="mt-10 font-sans text-lg sm:text-xl text-[rgba(244,244,244,0.55)] max-w-2xl mx-auto leading-snug">
              Group chats. A note titled <em>thoughts</em>. A spreadsheet you
              made at 2 a.m. Your Twitter likes. The corner of your brain that
              should be doing taxes. Put it somewhere it belongs.
            </p>

            <div className="mt-12 flex flex-wrap justify-center gap-3">
              <a
                href="/join"
                className="font-mono text-[12px] uppercase tracking-widest px-8 py-4 font-bold transition-all hover:opacity-90 active:scale-[0.98]"
                style={{ background: "#A3E635", color: "#0A0A0A", borderRadius: 999 }}
              >
                Start tracking free →
              </a>
              <a
                href="/auth/login"
                className="font-mono text-[12px] uppercase tracking-widest px-8 py-4 font-medium transition-all hover:opacity-80"
                style={{ background: "rgba(244,244,244,0.06)", color: "rgba(244,244,244,0.6)", borderRadius: 999, border: "1px solid rgba(244,244,244,0.1)" }}
              >
                Sign in
              </a>
            </div>
            <p className="mt-6 font-mono text-[11px] uppercase tracking-widest text-[rgba(244,244,244,0.3)]">
              free forever · no credit card
            </p>
          </div>
        </section>

        <Footer />
      </main>
    </>
  );
}
