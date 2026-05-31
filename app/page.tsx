import type { Metadata } from "next";
import { Nav }       from "@/components/landing/Nav";
import { Hero }      from "@/components/landing/Hero";
import { Features }  from "@/components/landing/Features";
import { Graveyard } from "@/components/landing/Graveyard";
import { Pricing }   from "@/components/landing/Pricing";
import { FAQ }       from "@/components/landing/FAQ";
import { CTA }       from "@/components/landing/CTA";
import { Footer }    from "@/components/landing/Footer";

export const metadata: Metadata = {
  title: "Hyperfix — Your daily dopamine, on tap",
  description:
    "One tap when you're bored and Hyperfix hands you a real dopamine hit that isn't your phone. Earn XP, build a streak, level up. The anti-doomscroll game for ADHD brains — free to start.",
  keywords: [
    "ADHD dopamine app", "dopamine menu app", "anti doomscroll app", "ADHD game",
    "ADHD focus app", "ADHD productivity app", "ADHD streak app", "understimulation ADHD",
    "neurodivergent productivity", "body doubling app",
  ],
  alternates: { canonical: "https://hyperfix.app" },
  openGraph: {
    title: "Hyperfix — Your daily dopamine, on tap",
    description: "The anti-doomscroll game for ADHD brains. One tap → a real dopamine hit that isn't your phone. Earn XP, build a streak, level up.",
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
    <div style={{ background: "var(--bg)", color: "var(--ink)", minHeight: "100vh" }}>
      <Nav />
      <main>
        <Hero />
        <Features />
        <Graveyard />
        <Pricing />
        <FAQ />
        <CTA />
      </main>
      <Footer />
    </div>
  );
}
