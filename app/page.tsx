import type { Metadata } from "next";
import { Nav }       from "@/components/landing/Nav";
import { Hero }      from "@/components/landing/Hero";
import { SocialProof } from "@/components/landing/SocialProof";
import { Modules }   from "@/components/landing/Modules";
import { FocusRooms } from "@/components/landing/FocusRooms";
import { ProfileShowcase } from "@/components/landing/ProfileShowcase";
import { Testimonials } from "@/components/landing/Testimonials";
import { Pricing }   from "@/components/landing/Pricing";
import { FAQ }       from "@/components/landing/FAQ";
import { FoundersNote } from "@/components/landing/FoundersNote";
import { CTA }       from "@/components/landing/CTA";
import { Footer }    from "@/components/landing/Footer";
import { StickyMobileCTA } from "@/components/landing/StickyMobileCTA";
import { SourceCapture } from "@/components/SourceCapture";

export const metadata: Metadata = {
  title: "Hyperfix — ADHD accountability that actually works",
  description:
    "Track your hyperfixations. Earn real XP. Beat task paralysis. A warm, forgiving ADHD accountability app with game mechanics, streak freezes, focus rooms, and a profile worth showing off — free to start.",
  keywords: [
    "ADHD app", "hyperfixation tracker", "ADHD accountability", "ADHD dopamine",
    "ADHD focus app", "ADHD productivity", "hyperfixation app", "understimulation ADHD",
    "neurodivergent app", "ADHD game", "anti doomscroll", "body doubling app",
    "focus room ADHD", "ADHD streak app", "ADHD task paralysis", "dopamine menu ADHD",
  ],
  alternates: { canonical: "https://hyperfix.app" },
  openGraph: {
    title: "Hyperfix — ADHD accountability that actually works",
    description: "Track your hyperfixations. Earn XP for real actions. Beat task paralysis. Focus rooms, streak freezes, and a profile worth showing off — no leaderboards, just your own journey.",
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
      acceptedAnswer: { "@type": "Answer", text: "A personal ADHD accountability app with game mechanics. You track your hyperfixations, earn XP for real actions, and beat the tasks your brain keeps avoiding — all at your own pace. Not a competition, not a habit tracker. Just you and your streak." },
    },
    {
      "@type": "Question",
      name: "What does 'proof of action' mean?",
      acceptedAnswer: { "@type": "Answer", text: "Instead of just tapping 'done' and lying to yourself, you run a timer for the activity's duration — or write one sentence about what you actually did. XP only drops when you've shown a receipt. It prevents checkbox farming and makes the XP feel earned." },
    },
    {
      "@type": "Question",
      name: "Is this just another habit tracker?",
      acceptedAnswer: { "@type": "Answer", text: "No. Habit trackers punish you the moment you break a chain. Hyperfix rewards showing up at all — variable XP, jackpots, streak freezes for bad days. And it doesn't care about consistency — it cares that you did something real today." },
    },
    {
      "@type": "Question",
      name: "What are streak freezes?",
      acceptedAnswer: { "@type": "Answer", text: "Miss-day insurance. Skip a day and a freeze is used automatically so your streak survives. Free players get one a month; Power-Up gets five. Because ADHD brains have hard weeks, and one bad week shouldn't erase everything." },
    },
    {
      "@type": "Question",
      name: "Is it free?",
      acceptedAnswer: { "@type": "Answer", text: "Yes — the full core experience is free. Unlimited dopamine hits, hyperfixation log, XP, levels, streaks, quests, focus rooms and your stats card. Power-Up adds more streak freezes, boosted jackpot odds, XP multipliers, and premium profile themes." },
    },
    {
      "@type": "Question",
      name: "Will this actually help my ADHD?",
      acceptedAnswer: { "@type": "Answer", text: "It's built around what ADHD brains actually respond to: instant feedback, variable rewards, low-friction starts, and forgiving systems. It won't fix everything — but it makes starting easier, keeps your hyperfixations organized, and rewards you for real effort instead of punishing imperfection." },
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
        <SocialProof />
        <Modules />
        <FocusRooms />
        <ProfileShowcase />
        <Testimonials />
        <FoundersNote />
        <Pricing />
        <FAQ />
        <CTA />
      </main>
      <Footer />
      <StickyMobileCTA />
    </div>
  );
}
