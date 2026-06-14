import type { Metadata } from "next";
import { Nav } from "@/components/landing/Nav";
import { Hero } from "@/components/landing/Hero";
import { HowItWorks } from "@/components/landing/HowItWorks";
import { Features } from "@/components/landing/Features";
import { Mission } from "@/components/landing/Mission";
import { CTASection } from "@/components/landing/CTASection";
import { Footer } from "@/components/landing/Footer";
import { SourceCapture } from "@/components/SourceCapture";

export const metadata: Metadata = {
  title: "Hyperfix — start small, that counts",
  description:
    "The ADHD app that rewards you for starting, not finishing. Name a task, do five minutes, earn XP. Forgiving streaks, no guilt, no leaderboards. Free.",
  alternates: { canonical: "https://hyperfix.app" },
};

export default async function Page({ searchParams }: { searchParams: Promise<{ code?: string }> }) {
  const params = await searchParams;
  if (params.code) {
    const { OAuthCallback } = await import("@/components/OAuthCallback");
    return <OAuthCallback code={params.code} />;
  }
  return (
    <>
      <SourceCapture />
      <Nav />
      <main id="main-content">
        <Hero />
        <HowItWorks />
        <Features />
        <Mission />
        <CTASection />
      </main>
      <Footer />
    </>
  );
}
