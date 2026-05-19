import type { Metadata } from "next";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import WaitlistForm from "@/components/WaitlistForm";
import HyperfixCard from "@/components/HyperfixCard";
import { TiltCard } from "@/components/TiltCard";

export const metadata: Metadata = {
  title: "Signs You're in a Hyperfixation (and How to Know When It's Ending)",
  description:
    "The twelve signs you're in a hyperfixation — from the mild (you looked it up once) to the advanced (you've reorganised your entire sleep schedule around it).",
  alternates: {
    canonical: "https://hyperfix.app/blog/signs-youre-in-a-hyperfixation",
  },
  openGraph: {
    url: "https://hyperfix.app/blog/signs-youre-in-a-hyperfixation",
    title: "Signs You're in a Hyperfixation (and How to Know When It's Ending)",
    description:
      "The twelve signs you're in a hyperfixation — from the mild (you looked it up once) to the advanced (you've reorganised your entire sleep schedule around it).",
    images: [
      {
        url: "/api/og?title=Signs+You%27re+in+a+Hyperfixation&sub=from+%22looked+it+up+once%22+to+%22reorganised+my+sleep%22+%C2%B7+hyperfix.app&accent=Hyperfixation",
        width: 1200,
        height: 630,
      },
    ],
  },
};

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: "https://hyperfix.app" },
    { "@type": "ListItem", position: 2, name: "Blog", item: "https://hyperfix.app/blog" },
    {
      "@type": "ListItem",
      position: 3,
      name: "Signs You're in a Hyperfixation",
      item: "https://hyperfix.app/blog/signs-youre-in-a-hyperfixation",
    },
  ],
};

const articleSchema = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: "Signs You're in a Hyperfixation (and How to Know When It's Ending)",
  description:
    "The twelve signs you're in a hyperfixation — from the mild (you looked it up once) to the advanced (you've reorganised your entire sleep schedule around it).",
  url: "https://hyperfix.app/blog/signs-youre-in-a-hyperfixation",
  datePublished: "2026-05-17",
  publisher: {
    "@type": "Organization",
    name: "Hyperfix",
    url: "https://hyperfix.app",
  },
};

const sections = [
  {
    h: "You looked it up once and now you know everything about it",
    body: "The first sign is the lookup that never ended. You googled one thing. Forty minutes later you had seventeen tabs open, you'd found the subreddit, you were reading a 2019 thread about something tangentially related, and you'd already formed opinions. You know the timeline. You know the discourse. You know things you didn't set out to learn. This is the beginning.",
  },
  {
    h: "You've started recommending it to people who didn't ask",
    body: "You mentioned it in a conversation where it wasn't relevant. You sent someone a link with zero context. You brought it up at dinner. You've texted someone the same link twice because you forgot you already sent it. The evangelism phase is a classic early-stage symptom: the fixation needs to be known. It's doing something important to you and you want witnesses.",
  },
  {
    h: "You have opinions about the discourse around it",
    body: "You're not just in the fandom. You have positions. You know which takes are bad. You know what the arguments are and where you stand on them. You've thought about things that have no practical consequence for your life — casting decisions, interpretation disputes, authorial intent — and you've thought about them more than once and reached the same conclusions both times. This is intermediate-stage hyperfixation.",
  },
  {
    h: "You've reorganised your schedule around it",
    body: "You stayed up late because you were in the middle of something. You pushed a task to later because you wanted to finish a chapter, an episode, a rewatch. You've woken up earlier than usual because you wanted time with it before the day started. Your sleep schedule has an unofficial second organising principle and it isn't work. This is the point where it stops being a hobby and starts being something closer to a commitment.",
  },
  {
    h: "You're using it as emotional regulation",
    body: "Stressed? You know what helps. Anxious? There's a specific chapter for that. Hard day? There's a scene that reliably makes things feel better. The fixation has become a resource — a place to go when the rest of the world is too much. This is one of the most useful things hyperfixation does and also one of the clearest signs you're in one. The object of the fixation isn't just interesting anymore. It's functional.",
  },
  {
    h: "You've written or created something about it",
    body: "A note. A post. A playlist. A thread that got out of hand. Art, fic, an essay, a voice memo at midnight where you talk for seven minutes about a character's motivations. You've produced something. The fixation has moved from consumption to creation, which is the deepest level of engagement: the thing has become something you have to respond to.",
  },
  {
    h: "You know when it's fading",
    body: "The fading is as recognisable as the arrival. The tabs close. The recommendations stop. The schedule reorganises itself back to normal. You pick up something you hadn't touched in weeks. You're not uninterested — you might still love the thing — but you're no longer in it. The world has regained its usual proportions. Something else is becoming interesting. The fix is lifting.",
  },
  {
    h: "How to know it's over",
    body: "The eulogy moment arrives when you realise you haven't thought about it today. Not with sadness, not with relief — just as a fact. It had a run. You were on day 47, or 112, or 8. You were intensity 9 at peak and 4 at the end. You wrote a note at 2 a.m. that made sense at the time. And then it ended, the way they all end, and now there's a gap where the next one will eventually arrive. That gap is normal. Log the one that just finished before the details go.",
  },
];

export default function SignsYoureInAHyperfixationPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />

      <main id="main-content" className="relative z-10 text-ink bg-[#0A0A0A]">
        <Nav />

        <section className="px-6 sm:px-10 pt-16 sm:pt-24 pb-12 border-b border-[rgba(244,244,244,0.07)]">
          <div className="max-w-3xl mx-auto">
            <span className="inline-flex items-center font-mono text-[10px] uppercase tracking-widest rounded-full px-3 py-1 bg-[rgba(244,244,244,0.06)] text-[rgba(244,244,244,0.4)] mb-8">guide · hyperfix</span>
            <h1 className="font-display font-medium text-[2.75rem] sm:text-[4.5rem] leading-[0.92] tracking-crush text-ink text-balance">
              Signs You&apos;re in a Hyperfixation
            </h1>
            <p className="mt-4 font-mono text-[11px] uppercase tracking-widest text-[rgba(244,244,244,0.4)]">
              Published May 2026
            </p>
          </div>
        </section>

        <section className="px-6 sm:px-10 py-16 sm:py-24">
          <div className="max-w-3xl mx-auto">
            <div className="space-y-16">
              {sections.map((sec) => (
                <section key={sec.h}>
                  <h2 className="font-display text-2xl sm:text-3xl leading-tight tracking-tight text-ink mb-5">
                    {sec.h}
                  </h2>
                  <p className="font-sans text-lg text-[rgba(244,244,244,0.5)] leading-relaxed">
                    {sec.body}
                  </p>
                </section>
              ))}
            </div>
          </div>
        </section>

        <section className="px-6 sm:px-10 py-12 border-t border-[rgba(244,244,244,0.07)]">
          <div className="max-w-3xl mx-auto flex flex-col items-center gap-4">
            <p className="font-mono text-[10px] uppercase tracking-widest text-[rgba(244,244,244,0.4)] self-start">
              what it looks like
            </p>
            <TiltCard tiltLimit={10} scale={1.03} effect="gravitate">
              <HyperfixCard
                title="Sabrina Carpenter — Espresso"
                type="song · on loop"
                day={14}
                intensity={9}
                user="@sob.exe"
                tilt=""
                started="Loop count: 847"
                note="the bridge. every time."
                color="bg-paper"
              />
            </TiltCard>
          </div>
        </section>

        <section className="px-6 sm:px-10 py-12 border-t border-[rgba(244,244,244,0.07)]">
          <div className="max-w-3xl mx-auto">
            <p className="font-mono text-[10px] uppercase tracking-widest text-[rgba(244,244,244,0.4)] mb-6">Read next</p>
            <div className="grid sm:grid-cols-2 gap-4">
              <a href="/blog/what-is-hyperfixation" className="block border border-[rgba(244,244,244,0.07)] p-6 hover:border-ink transition-colors">
                <span className="inline-flex items-center font-mono text-[10px] uppercase tracking-widest rounded-full px-3 py-1 bg-[rgba(244,244,244,0.06)] text-[rgba(244,244,244,0.4)] mb-3">explainer</span>
                <p className="font-display text-lg tracking-tight text-ink leading-snug">What Is Hyperfixation? →</p>
              </a>
              <a href="/blog/how-to-track-your-hyperfixations" className="block border border-[rgba(244,244,244,0.07)] p-6 hover:border-ink transition-colors">
                <span className="inline-flex items-center font-mono text-[10px] uppercase tracking-widest rounded-full px-3 py-1 bg-[rgba(244,244,244,0.06)] text-[rgba(244,244,244,0.4)] mb-3">guide</span>
                <p className="font-display text-lg tracking-tight text-ink leading-snug">How to Track Your Hyperfixations →</p>
              </a>
            </div>
          </div>
        </section>

        <section className="px-6 sm:px-10 py-16 sm:py-24 bg-[#111113]">
          <div className="max-w-3xl mx-auto">
            <h2 className="font-display text-3xl sm:text-4xl leading-tight tracking-tightest mb-8 text-balance">
              Log the one you&apos;re in right now.
            </h2>
            <WaitlistForm variant="dark" />
          </div>
        </section>

        <Footer />
      </main>
    </>
  );
}
