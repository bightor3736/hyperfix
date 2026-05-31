import type { Metadata } from "next";
import { Suspense } from "react";
import { Nav }         from "@/components/landing/Nav";
import { Hero }        from "@/components/landing/Hero";
import { Features }    from "@/components/landing/Features";
import { Graveyard }   from "@/components/landing/Graveyard";
import { FocusRooms }  from "@/components/landing/FocusRooms";
import { Pricing }     from "@/components/landing/Pricing";
import { FAQ }         from "@/components/landing/FAQ";
import { CTA }         from "@/components/landing/CTA";
import { Footer }      from "@/components/landing/Footer";
import ActivityTicker  from "@/components/ActivityTicker";

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
    <>
      {/* Restore theme from localStorage before first paint */}
      <script
        dangerouslySetInnerHTML={{
          __html: `(function(){var t=localStorage.getItem('hyperfix-theme');if(t)document.documentElement.setAttribute('data-theme',t);else if(window.matchMedia('(prefers-color-scheme: dark)').matches)document.documentElement.setAttribute('data-theme','dark');})();`,
        }}
      />
      <div style={{ background: "var(--bg)", color: "var(--ink)", minHeight: "100vh" }}>
        <Nav />
        <main>
          <Hero />
          <Suspense fallback={null}>
            <ActivityTicker />
          </Suspense>
          <Features />
          <Graveyard />
          <FocusRooms />
          <Pricing />
          <FAQ />
          <CTA />
        </main>
        <Footer />
      </div>
    </>
  );
}
