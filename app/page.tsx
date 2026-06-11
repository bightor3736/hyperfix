import type { Metadata } from "next";
import { Nav } from "@/components/landing/Nav";
import { Hero } from "@/components/landing/Hero";
import { Rings } from "@/components/landing/Rings";
import { FeatureShowcase } from "@/components/landing/FeatureShowcase";
import { MacSection } from "@/components/landing/MacSection";
import { Pricing } from "@/components/landing/Pricing";
import { FAQ } from "@/components/landing/FAQ";
import { Footer } from "@/components/landing/Footer";
import { SourceCapture } from "@/components/SourceCapture";

export const metadata: Metadata = {
  title: "Hyperfix — start the task you've been avoiding",
  description: "The ADHD app that beats task paralysis. AI breaks down tasks, you do 5 minutes, earn XP for starting. Forgiving streaks. Free.",
  alternates: { canonical: "https://hyperfix.app" },
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    { "@type": "Question", name: "What is Hyperfix?", acceptedAnswer: { "@type": "Answer", text: "An ADHD app that helps you start the tasks you've been avoiding. AI breaks tasks into tiny steps, you do 5 minutes, earn XP for starting." } },
    { "@type": "Question", name: "Is it free?", acceptedAnswer: { "@type": "Answer", text: "Yes — the full core loop is free including AI task breakdowns (5/month), focus timer, XP, levels, streaks, and daily quests." } },
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
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <SourceCapture />
      <Nav />
      <main>
        <Hero />
        <Rings />
        <FeatureShowcase />
        <MacSection />
        <Pricing />
        <FAQ />
      </main>
      <Footer />
    </>
  );
}
