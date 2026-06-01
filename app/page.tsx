import type { Metadata } from "next";
import { Nav }       from "@/components/landing/Nav";
import { Hero }      from "@/components/landing/Hero";
import { SocialProof } from "@/components/landing/SocialProof";
import { Journey }   from "@/components/landing/Journey";
import { Features }  from "@/components/landing/Features";
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
    "Track your hyperfixations. Earn XP for real actions. Beat the walls your brain puts up. A personal ADHD accountability app with game mechanics — not competitive, just yours.",
  keywords: [
    "ADHD app", "hyperfixation tracker", "ADHD accountability", "ADHD dopamine",
    "ADHD focus app", "ADHD productivity", "hyperfixation app", "understimulation ADHD",
    "neurodivergent app", "ADHD game", "anti doomscroll",
  ],
  alternates: { canonical: "https://hyperfix.app" },
  openGraph: {
    title: "Hyperfix — ADHD accountability that actually works",
    description: "Track your hyperfixations. Earn XP for real actions. Beat task paralysis. A personal ADHD app with game mechanics — no leaderboards, just your own journey.",
    url: "https://hyperfix.app",
    type: "website",
  },
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
      <SourceCapture />
      <Nav />
      <main>
        <Hero />
        <SocialProof />
        <Journey />
        <Features />
        <ProfileShowcase />
        <Testimonials />
        <Pricing />
        <FAQ />
        <FoundersNote />
        <CTA />
      </main>
      <Footer />
      <StickyMobileCTA />
    </div>
  );
}
