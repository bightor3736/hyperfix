import type { Metadata } from "next";
import { HeroInspired } from "@/components/landing/HeroInspired";
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
    <div style={{ minHeight: "100vh" }}>
      <SourceCapture />
      <main>
        <HeroInspired />
      </main>
    </div>
  );
}
