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
  title: "Hyperfix — Built for your ADHD brain",
  description:
    "Daily quests. Forgiving streaks. Focus sessions. XP for everything. Hyperfix is the productivity game built for ADHD brains — free to start.",
  keywords: [
    "ADHD productivity app", "ADHD game", "ADHD focus app", "ADHD daily quests",
    "ADHD streak app", "focus sessions ADHD", "ADHD leaderboard", "neurodivergent productivity",
    "ADHD tools", "body doubling app",
  ],
  alternates: { canonical: "https://hyperfix.app" },
  openGraph: {
    title: "Hyperfix — Built for your ADHD brain",
    description: "Daily quests. Forgiving streaks. XP for everything. The productivity game for ADHD brains.",
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
