import type { Metadata } from "next";
import { Nav }       from "@/components/landing/Nav";
import { Hero }      from "@/components/landing/Hero";
import { HowItWorks } from "@/components/landing/HowItWorks";

import { ProfileShowcase } from "@/components/landing/ProfileShowcase";
import { Pricing }   from "@/components/landing/Pricing";
import { FAQ }       from "@/components/landing/FAQ";
import { CTA }       from "@/components/landing/CTA";
import { Footer }    from "@/components/landing/Footer";
import { StickyMobileCTA } from "@/components/landing/StickyMobileCTA";
import { SourceCapture } from "@/components/SourceCapture";

export const metadata: Metadata = {
  title: "Hyperfix — start the task you've been avoiding",
  description:
    "The ADHD app that beats task paralysis. Name the thing you're avoiding, do just 5 minutes, and earn XP for starting — not for being perfect. Forgiving streaks, no shame, free to start.",
  keywords: [
    "ADHD app", "task paralysis", "ADHD task initiation", "can't start tasks",
    "ADHD focus app", "ADHD productivity", "how to start a task with ADHD", "ADHD procrastination",
    "neurodivergent app", "ADHD motivation", "beat the wall ADHD", "ADHD getting started",
    "ADHD streak app", "5 minute rule", "ADHD focus timer",
  ],
  alternates: { canonical: "https://hyperfix.app" },
  openGraph: {
    title: "Hyperfix — start the task you've been avoiding",
    description: "Trick your ADHD brain into starting. Name it, do 5 minutes, get rewarded for starting. Forgiving streaks, no shame — free to start.",
    url: "https://hyperfix.app",
    type: "website",
  },
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "What actually is Hyperfix?",
      acceptedAnswer: { "@type": "Answer", text: "An ADHD app that gets you over the starting line on the task you've been avoiding. Name the thing, shrink it to the smallest first move, do just 5 minutes — and earn XP for starting, not for being perfect. Built for task paralysis, not for tracking." },
    },
    {
      "@type": "Question",
      name: "Why does it reward starting instead of finishing?",
      acceptedAnswer: { "@type": "Answer", text: "Because for ADHD brains, starting is the hard part — task initiation is the actual wall. If the win is 'I began', you get a real hit of success every time, which is exactly what makes you come back. Finishing takes care of itself once you've crossed the line." },
    },
    {
      "@type": "Question",
      name: "What's the '5-minute' thing?",
      acceptedAnswer: { "@type": "Answer", text: "The deal: commit to just a few minutes, and you're allowed to quit after. Most of the time you won't want to — momentum takes over. It works because it drops the barrier from 'finish this huge thing' to 'do 5 minutes', which is what gets a stuck brain moving." },
    },
    {
      "@type": "Question",
      name: "What are streak freezes?",
      acceptedAnswer: { "@type": "Answer", text: "Miss-day insurance. Skip a day and a freeze is used automatically so your streak survives. Free players get one a month; Power-Up gets five. ADHD brains have hard weeks — one bad week shouldn't erase everything, and you'll never get a shaming 'streak lost'." },
    },
    {
      "@type": "Question",
      name: "Is it free?",
      acceptedAnswer: { "@type": "Answer", text: "Yes — the full core loop is free. Unlimited tasks, the focus timer, XP, levels, streaks, daily quests, and your shareable card. Power-Up adds a 1.5× XP multiplier, five streak freezes a month, and premium profile themes." },
    },
    {
      "@type": "Question",
      name: "Will this actually help my ADHD?",
      acceptedAnswer: { "@type": "Answer", text: "It's built around what ADHD brains respond to: instant feedback, tiny low-friction starts, rewards for showing up, and forgiving systems that never punish a bad day. It won't fix everything — but it makes starting the thing you're dreading genuinely easier." },
    },
  ],
};

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ code?: string }>;
}) {
  const params = await searchParams;

  if (params.code) {
    const { OAuthCallback } = await import("@/components/OAuthCallback");
    return <OAuthCallback code={params.code} />;
  }

  return (
    <div className="landing-game" style={{ background: "var(--bg)", color: "var(--ink)", minHeight: "100vh" }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <SourceCapture />
      <Nav />
      <main>
        <Hero />
        <HowItWorks />

        <ProfileShowcase />
        <Pricing />
        <FAQ />
        <CTA />
      </main>
      <Footer />
      <StickyMobileCTA />
    </div>
  );
}
