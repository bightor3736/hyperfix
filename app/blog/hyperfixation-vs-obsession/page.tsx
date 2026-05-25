import type { Metadata } from "next";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import WaitlistForm from "@/components/WaitlistForm";
import HyperfixCard from "@/components/HyperfixCard";
import { TiltCard } from "@/components/TiltCard";

export const metadata: Metadata = {
  title: "Hyperfixation vs. Obsession — What's Actually the Difference?",
  description:
    "These words get conflated constantly. Here's what obsession actually means (clinically), what hyperfixation actually means, and why the distinction matters for how you treat yourself.",
  alternates: {
    canonical: "https://hyperfix.app/blog/hyperfixation-vs-obsession",
  },
  openGraph: {
    url: "https://hyperfix.app/blog/hyperfixation-vs-obsession",
    title: "Hyperfixation vs. Obsession — What's Actually the Difference?",
    description:
      "These words get conflated constantly. Here's what obsession actually means (clinically), what hyperfixation actually means, and why the distinction matters for how you treat yourself.",
    images: [
      {
        url: "/api/og?title=Hyperfixation+vs.+Obsession&sub=what%27s+actually+the+difference+%C2%B7+hyperfix.app&accent=Blog",
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
      name: "Hyperfixation vs. Obsession",
      item: "https://hyperfix.app/blog/hyperfixation-vs-obsession",
    },
  ],
};

const articleSchema = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: "Hyperfixation vs. Obsession — What's Actually the Difference?",
  description:
    "These words get conflated constantly. Here's what obsession actually means (clinically), what hyperfixation actually means, and why the distinction matters for how you treat yourself.",
  url: "https://hyperfix.app/blog/hyperfixation-vs-obsession",
  datePublished: "2026-05-17",
  publisher: {
    "@type": "Organization",
    name: "Hyperfix",
    url: "https://hyperfix.app",
  },
};

export default function HyperfixationVsObsessionPage() {
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

      <main id="main-content" className="relative z-10 text-ink bg-[#070708]">
        <Nav />

        <section className="px-6 sm:px-10 pt-16 sm:pt-24 pb-12 border-b border-[rgba(244,244,244,0.07)]">
          <div className="max-w-3xl mx-auto">
            <span className="inline-flex items-center font-mono text-[10px] uppercase tracking-widest rounded-full px-3 py-1 bg-[rgba(244,244,244,0.06)] text-[rgba(244,244,244,0.4)] mb-8">explainer · hyperfix</span>
            <h1 className="font-display font-medium text-ink" style={{ fontSize: "clamp(32px, 5.5vw, 48px)", lineHeight: 1.05, letterSpacing: "-0.02em" }}>
              Hyperfixation vs. Obsession
            </h1>
            <p className="mt-6 font-sans text-lg sm:text-xl text-[rgba(244,244,244,0.5)] leading-snug max-w-2xl">
              These words get used interchangeably, but they don&apos;t mean the same thing. One is
              a feature of OCD — unwanted, intrusive, distressing. The other is what happens when
              your ADHD or autistic brain locks onto something it loves. The difference matters more
              than you&apos;d think.
            </p>
            <p className="mt-4 font-mono text-[11px] uppercase tracking-widest text-[rgba(244,244,244,0.4)]">
              Published May 2026
            </p>
          </div>
        </section>

        <section className="px-6 sm:px-10 py-16 sm:py-24">
          <div className="max-w-3xl mx-auto">
            <div className="space-y-16">

              <section>
                <h2 className="font-display text-2xl sm:text-3xl leading-tight tracking-tight text-ink mb-5">
                  The words aren&apos;t synonyms
                </h2>
                <p className="font-sans text-base sm:text-[17px] text-[rgba(255,255,255,0.72)] leading-[1.75]">
                  If you&apos;ve ever described yourself as &ldquo;obsessed&rdquo; with a show, a
                  game, a band, a fictional character — you probably meant hyperfixated. And if
                  you&apos;ve ever been told your hyperfixation sounds like an obsession, the person
                  saying it probably meant something closer to a hobby. The words have drifted in
                  casual use until they&apos;re nearly interchangeable. But they don&apos;t mean the
                  same thing, and collapsing them together creates real problems — both for
                  understanding your own brain and for knowing when something might actually need
                  attention.
                </p>
              </section>

              <section>
                <h2 className="font-display text-2xl sm:text-3xl leading-tight tracking-tight text-ink mb-5">
                  What obsession actually means (clinically)
                </h2>
                <p className="font-sans text-base sm:text-[17px] text-[rgba(255,255,255,0.72)] leading-[1.75]">
                  In clinical psychology, obsession has a specific meaning. It&apos;s a feature of
                  OCD: an intrusive, unwanted thought, image, or urge that arrives uninvited and
                  won&apos;t leave. The key word is unwanted. Obsessions in the OCD sense are
                  ego-dystonic — they feel foreign to who you are, inconsistent with your values,
                  distressing to experience. You don&apos;t choose them. They don&apos;t feel good.
                  They cause significant anxiety, and the compulsions that follow are attempts to
                  neutralise that anxiety. Someone with OCD isn&apos;t &ldquo;really into&rdquo; the
                  content of their obsessions — they&apos;re trapped by it. That&apos;s a
                  meaningfully different experience from staying up until 3am reading fic about your
                  favourite character.
                </p>
              </section>

              <section>
                <h2 className="font-display text-2xl sm:text-3xl leading-tight tracking-tight text-ink mb-5">
                  What hyperfixation actually means
                </h2>
                <p className="font-sans text-base sm:text-[17px] text-[rgba(255,255,255,0.72)] leading-[1.75]">
                  Hyperfixation is associated with ADHD and autism — sometimes both, sometimes one,
                  sometimes neither but neurodivergent-adjacent in ways that don&apos;t have neat
                  labels yet. It&apos;s an intense, sustained focus on a specific interest or topic
                  that can feel absorbing, pleasurable, and hard to redirect. The focus isn&apos;t
                  forced on you — it arrives, and you welcome it, at least at first. It shapes your
                  schedule, your conversations, your emotional state. It runs until it doesn&apos;t,
                  and then it ends. Unlike OCD obsessions, hyperfixation is typically ego-syntonic:
                  it feels like you, it feels good, it feels like something you&apos;re actively
                  choosing to do even when you know, rationally, that you should probably stop and
                  eat.
                </p>
              </section>

              <section>
                <h2 className="font-display text-2xl sm:text-3xl leading-tight tracking-tight text-ink mb-5">
                  The key difference: ego-dystonic vs. ego-syntonic
                </h2>
                <p className="font-sans text-base sm:text-[17px] text-[rgba(255,255,255,0.72)] leading-[1.75]">
                  This is the hinge the whole distinction turns on. Ego-dystonic means the
                  experience feels alien, unwanted, inconsistent with your sense of self.
                  Ego-syntonic means it feels like an expression of who you are — wanted, chosen,
                  part of you. OCD obsessions are ego-dystonic. Hyperfixations are ego-syntonic. If
                  you&apos;re in a fixation on a show, you&apos;re not distressed that you
                  can&apos;t stop thinking about the show — you&apos;re delighted that you
                  can&apos;t stop thinking about the show, even if you&apos;re also slightly annoyed
                  that you have other responsibilities. If you were genuinely distressed by unwanted,
                  intrusive thoughts you couldn&apos;t control, and felt compelled to do things to
                  make them stop, that&apos;s a different experience — and it has a different name.
                </p>
              </section>

              <section>
                <h2 className="font-display text-2xl sm:text-3xl leading-tight tracking-tight text-ink mb-5">
                  When to get help
                </h2>
                <p className="font-sans text-base sm:text-[17px] text-[rgba(255,255,255,0.72)] leading-[1.75]">
                  This article isn&apos;t telling you whether you have OCD. It&apos;s not qualified
                  to. But here&apos;s a useful heuristic: if your intense thoughts feel wanted and
                  pleasurable (even when they&apos;re also inconvenient), that&apos;s more likely
                  the hyperfixation zone. If they feel unwanted, intrusive, distressing — like
                  something happening to you rather than something you&apos;re doing — that&apos;s
                  worth talking to someone about. OCD is treatable. It responds well to a specific
                  therapy called ERP (exposure and response prevention). If you&apos;re experiencing
                  intrusive thoughts that are causing significant distress and you&apos;re not
                  already working with someone, that&apos;s worth pursuing. The distinction between
                  the two things matters exactly because they require different responses.
                </p>
              </section>

              <section>
                <h2 className="font-display text-2xl sm:text-3xl leading-tight tracking-tight text-ink mb-5">
                  Why it matters what you call it
                </h2>
                <p className="font-sans text-base sm:text-[17px] text-[rgba(255,255,255,0.72)] leading-[1.75]">
                  Language shapes how you treat yourself. If you call a hyperfixation an obsession,
                  you might try to suppress it, feel guilty for having it, or worry that something
                  is wrong with you. If you call an OCD obsession a hyperfixation, you might dismiss
                  it, try to just &ldquo;lean in,&rdquo; or miss the signal that what you&apos;re
                  experiencing is treatable distress and not just enthusiasm. Getting the word right
                  doesn&apos;t require a diagnosis. It just requires being honest about whether the
                  intensity you&apos;re feeling is something you&apos;re choosing or something
                  that&apos;s happening to you. That difference — chosen vs. imposed — is where the
                  two things genuinely part ways.
                </p>
              </section>

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
                title="Stardew Valley"
                type="game · cozy"
                day={44}
                intensity={8}
                user="@stardew.spiral"
                tilt=""
                started="Started January"
                note="married Harvey. no regrets."
                color="bg-paper"
              />
            </TiltCard>
          </div>
        </section>

        <section className="px-6 sm:px-10 py-12 border-t border-[rgba(244,244,244,0.07)]">
          <div className="max-w-3xl mx-auto">
            <p className="font-mono text-[10px] uppercase tracking-widest text-[rgba(244,244,244,0.4)] mb-6">
              Read next
            </p>
            <div className="grid sm:grid-cols-3 gap-4">
              <a
                href="/blog/what-is-hyperfixation"
                className="block rounded-2xl border border-[rgba(255,255,255,0.06)] bg-[#0F1011] p-6 transition-all duration-200 hover:-translate-y-0.5 hover:border-[rgba(94,234,212,0.3)]"
              >
                <span className="inline-flex items-center font-mono text-[10px] uppercase tracking-widest rounded-full px-3 py-1 bg-[rgba(244,244,244,0.06)] text-[rgba(244,244,244,0.4)] mb-3">explainer</span>
                <p className="font-display text-lg tracking-tight text-ink leading-snug">
                  What Is Hyperfixation? &rarr;
                </p>
              </a>
              <a
                href="/blog/adhd-hyperfixation"
                className="block rounded-2xl border border-[rgba(255,255,255,0.06)] bg-[#0F1011] p-6 transition-all duration-200 hover:-translate-y-0.5 hover:border-[rgba(94,234,212,0.3)]"
              >
                <span className="inline-flex items-center font-mono text-[10px] uppercase tracking-widest rounded-full px-3 py-1 bg-[rgba(244,244,244,0.06)] text-[rgba(244,244,244,0.4)] mb-3">deep dive</span>
                <p className="font-display text-lg tracking-tight text-ink leading-snug">
                  ADHD Hyperfixation: Why Your Brain Does This &rarr;
                </p>
              </a>
              <a
                href="/blog/hyperfixation-ending"
                className="block rounded-2xl border border-[rgba(255,255,255,0.06)] bg-[#0F1011] p-6 transition-all duration-200 hover:-translate-y-0.5 hover:border-[rgba(94,234,212,0.3)]"
              >
                <span className="inline-flex items-center font-mono text-[10px] uppercase tracking-widest rounded-full px-3 py-1 bg-[rgba(244,244,244,0.06)] text-[rgba(244,244,244,0.4)] mb-3">guide</span>
                <p className="font-display text-lg tracking-tight text-ink leading-snug">
                  Surviving the End of a Hyperfixation &rarr;
                </p>
              </a>
            </div>
          </div>
        </section>

        <section className="px-6 sm:px-10 py-16 sm:py-24 bg-[#0F1011]">
          <div className="max-w-3xl mx-auto">
            <h2 className="font-display text-3xl sm:text-4xl leading-tight tracking-tightest mb-8">
              Track what you&apos;re choosing right now.
            </h2>
            <WaitlistForm variant="dark" />
          </div>
        </section>

        <Footer />
      </main>
    </>
  );
}
