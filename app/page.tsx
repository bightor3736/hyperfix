import type { Metadata } from "next";
import { NavFoku } from "@/components/landing-foku/Nav";
import { HeroFoku } from "@/components/landing-foku/Hero";
import { FeaturesFoku } from "@/components/landing-foku/Features";
import { GraveyardFoku } from "@/components/landing-foku/Graveyard";
import { PricingFoku } from "@/components/landing-foku/Pricing";
import { FAQFoku } from "@/components/landing-foku/FAQ";
import { FooterFoku } from "@/components/landing-foku/Footer";
import { SourceCapture } from "@/components/SourceCapture";

export const metadata: Metadata = {
  title: "Hyperfix — A journal for your obsessions",
  description:
    "Track your hyperfixations. Log it. Count the days. Mourn it when it ends. A warm, playful app for ADHD and neurodivergent brains — free to start.",
  keywords: [
    "hyperfixation tracker", "ADHD app", "neurodivergent app", "hyperfixation journal",
    "ADHD journal", "obsession tracker", "interest tracker", "ADHD productivity",
  ],
  alternates: { canonical: "https://hyperfix.app" },
  openGraph: {
    title: "Hyperfix — A journal for your obsessions",
    description: "Track your hyperfixations. Log it. Count the days. Mourn it when it ends.",
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
      name: "What is a hyperfixation?",
      acceptedAnswer: { "@type": "Answer", text: "A hyperfixation is an intense, all-consuming interest in a specific topic, hobby, show, game, or anything else that captures your attention. Common in ADHD and neurodivergent brains, hyperfixations come on strong and can fade just as quickly." },
    },
    {
      "@type": "Question",
      name: "Why would I track my hyperfixations?",
      acceptedAnswer: { "@type": "Answer", text: "Tracking helps you understand your patterns, remember what you loved, and create a personal archive of your interests. It's also oddly satisfying to watch the day counter go up." },
    },
    {
      "@type": "Question",
      name: "What happens when a hyperfixation ends?",
      acceptedAnswer: { "@type": "Answer", text: "You send it to the Graveyard — a dedicated space to honor past obsessions. Write a eulogy, remember the good times, and move on to the next one." },
    },
    {
      "@type": "Question",
      name: "Is this app only for people with ADHD?",
      acceptedAnswer: { "@type": "Answer", text: "Nope! While it's designed with ADHD brains in mind, anyone who experiences intense interests can benefit. If you've ever stayed up until 3am researching something random, this app is for you." },
    },
    {
      "@type": "Question",
      name: "Is it free?",
      acceptedAnswer: { "@type": "Answer", text: "Yes — the full core experience is free. Track unlimited fixes, count the days, share with friends. Pro adds advanced features like unlimited history and custom categories." },
    },
    {
      "@type": "Question",
      name: "Is my data private?",
      acceptedAnswer: { "@type": "Answer", text: "By default, your fixes are private. You can choose to make individual fixes or your profile public if you want to share. We never sell your data or use it for advertising." },
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
    <div className="landing-foku">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <SourceCapture />
      <NavFoku />
      <main>
        <HeroFoku />
        <FeaturesFoku />
        <GraveyardFoku />
        <PricingFoku />
        <FAQFoku />
      </main>
      <FooterFoku />
    </div>
  );
}
