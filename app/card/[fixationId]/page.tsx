import { createClient } from "@supabase/supabase-js";
import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";

const SITE = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ?? "https://hyperfix.app";

function dayCount(startedAt: string, endedAt: string | null): number {
  const start = new Date(startedAt);
  const end = endedAt ? new Date(endedAt) : new Date();
  return Math.max(1, Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)));
}

async function getFix(id: string) {
  const admin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
  const { data } = await admin
    .from("fixes")
    .select("id, title, category, intensity, started_at, ended_at, is_public")
    .eq("id", id)
    .eq("is_public", true)
    .single();
  return data;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ fixationId: string }>;
}): Promise<Metadata> {
  const { fixationId } = await params;
  const fix = await getFix(fixationId);
  if (!fix) {
    return { title: "Fixation not found — Hyperfix" };
  }
  const days = dayCount(fix.started_at, fix.ended_at);
  const title = `Day ${days} of ${fix.title} — Hyperfix`;
  const description = `intensity ${fix.intensity}/10 · tracked on hyperfix.app`;
  const image = `${SITE}/api/share/${fixationId}`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: [{ url: image, width: 1080, height: 1920 }],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
    },
  };
}

export default async function CardPage({
  params,
}: {
  params: Promise<{ fixationId: string }>;
}) {
  const { fixationId } = await params;
  const fix = await getFix(fixationId);
  if (!fix) notFound();

  const days = dayCount(fix.started_at, fix.ended_at);
  const imageUrl = `/api/share/${fixationId}`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: `Day ${days} of ${fix.title}`,
    description: `intensity ${fix.intensity}/10 · ${fix.category}`,
    image: `${SITE}${imageUrl}`,
    url: `${SITE}/card/${fixationId}`,
    publisher: { "@type": "Organization", name: "Hyperfix", url: SITE },
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <main
        className="min-h-screen flex flex-col items-center justify-center px-4 py-12"
        style={{ background: "#070708" }}
      >
        {/* Card preview */}
        <div
          className="relative rounded-2xl overflow-hidden shadow-2xl mb-8"
          style={{
            width: "min(360px, 90vw)",
            aspectRatio: "9/16",
            border: "1px solid rgba(244,244,244,0.1)",
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={imageUrl}
            alt={`Day ${days} of ${fix.title}`}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Meta text */}
        <p
          className="font-mono text-xs uppercase tracking-widest mb-2 text-center"
          style={{ color: "rgba(244,244,244,0.35)" }}
        >
          {fix.category}
        </p>
        <h1
          className="font-display text-2xl font-semibold text-center mb-1"
          style={{ color: "#F4F4F4", letterSpacing: "-0.02em", maxWidth: 400 }}
        >
          {fix.title}
        </h1>
        <p className="font-sans text-sm text-center mb-8" style={{ color: "rgba(244,244,244,0.45)" }}>
          day {days} · intensity {fix.intensity}/10
        </p>

        {/* CTA */}
        <div className="flex flex-col items-center gap-3 w-full" style={{ maxWidth: 320 }}>
          <Link
            href="/"
            className="w-full flex items-center justify-center gap-2 rounded-2xl py-3.5 font-mono text-sm font-bold transition-all duration-150"
            style={{
              background: "#D72638",
              color: "#fff",
              textDecoration: "none",
            }}
          >
            Track your own fixation →
          </Link>
          <a
            href={imageUrl}
            download={`hyperfix-${fix.title.slice(0, 32).replace(/\s+/g, "-").toLowerCase()}.png`}
            className="w-full flex items-center justify-center gap-2 rounded-2xl py-3 font-mono text-sm transition-all duration-150"
            style={{
              background: "rgba(244,244,244,0.05)",
              border: "1px solid rgba(244,244,244,0.12)",
              color: "rgba(244,244,244,0.6)",
              textDecoration: "none",
            }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
            Download card
          </a>
        </div>

        {/* Logo */}
        <Link
          href="/"
          className="mt-10 font-mono text-xs"
          style={{ color: "rgba(244,244,244,0.25)", textDecoration: "none" }}
        >
          hyperfix.app
        </Link>
      </main>
    </>
  );
}
