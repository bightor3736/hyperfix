import type { Metadata } from "next";
import { Nav } from "@/components/landing/Nav";
import { Hero } from "@/components/landing/Hero";
import { SearchChanged } from "@/components/landing/SearchChanged";
import { Mission } from "@/components/landing/Mission";
import { Solution } from "@/components/landing/Solution";
import { CTASection } from "@/components/landing/CTASection";
import { Footer } from "@/components/landing/Footer";
import { SourceCapture } from "@/components/SourceCapture";

export const metadata: Metadata = {
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
        <SearchChanged />
        <Mission />
        <Solution />
        <CTASection />
      </main>
      <Footer />
    </>
  );
}
