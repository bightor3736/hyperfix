import type { Metadata } from "next";
import { Hero } from "@/components/landing/Hero";
import { IntroScreen } from "@/components/landing/IntroScreen";
import { Features } from "@/components/landing/Features";
import { Testimonials } from "@/components/landing/Testimonials";
import { Pricing } from "@/components/landing/Pricing";
import { FAQ } from "@/components/landing/FAQ";
import { Footer } from "@/components/landing/Footer";
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
      <main>
        <Hero />
        <Features />
        <Testimonials />
        <Pricing />
        <FAQ />
      </main>
      <Footer />
    </>
  );
}
