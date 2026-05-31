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
  title: "Hyperfix — A journal for your obsession",
  description:
    "Log the hyperfixation. Count the days. Mourn it when it ends. Built for ADHD and neurodivergent brains — free forever.",
  keywords: [
    "hyperfixation tracker", "ADHD hyperfixation", "neurodivergent tracker",
    "special interest tracker", "ADHD app", "hyperfixation journal",
    "ADHD obsession log", "track obsessions",
  ],
  alternates: { canonical: "https://hyperfix.app" },
  openGraph: {
    title: "Hyperfix — A journal for your obsession",
    description: "Log it. Count the days. Mourn it when it ends.",
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
