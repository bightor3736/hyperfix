import type { Metadata } from "next";
import { Nav } from "@/components/landing/Nav";
import { Hero } from "@/components/landing/Hero";
import { SearchChanged } from "@/components/landing/SearchChanged";
import { Mission } from "@/components/landing/Mission";
import { Solution } from "@/components/landing/Solution";
import { CTASection } from "@/components/landing/CTASection";
import { Footer } from "@/components/landing/Footer";
import { IntroScreen } from "@/components/landing/IntroScreen";
import { SourceCapture } from "@/components/SourceCapture";

export const metadata: Metadata = {
  title: "Hyperfix — start the task you've been avoiding",
  description: "The ADHD app that beats task paralysis. AI breaks down tasks, you do 5 minutes, earn XP for starting. Forgiving streaks. Free.",
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
      <IntroScreen />
      <Nav />
      <main id="main-content">
        <Hero />
        <SearchChanged />
        <Mission />
        <Solution />
        <CTASection />
      </main>
      <Footer />
    </>
  );
}
