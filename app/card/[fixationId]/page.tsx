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
        style={{ background: "var(--bg)" }}
      >
        {/* Card preview */}
        <div
          className="relative rounded-2xl overflow-hidden mb-8"
          style={{
            width: "min(360px, 90vw)",
            aspectRatio: "9/16",
            border: "1px solid var(--line)",
            boxShadow: "0 32px 80px rgba(0,0,0,0.45)",
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
          className="font-mono text-[10px] uppercase tracking-widest mb-3 text-center"
          style={{ color: "var(--accent)" }}
        >
          {fix.category}
        </p>
        <h1
          className="font-display text-2xl text-center mb-2"
          style={{ color: "var(--ink)", letterSpacing: "-0.02em", fontWeight: 600, maxWidth: 400 }}
        >
          {fix.title}
        </h1>
        <p className="font-mono text-xs text-center mb-8 tabular-nums" style={{ color: "var(--ink-muted)" }}>
          day {days} · intensity {fix.intensity}/10
        </p>

        {/* CTA */}
        <div className="flex flex-col items-center gap-3 w-full" style={{ maxWidth: 320 }}>
          <Link
            href="/"
            className="w-full flex items-center justify-center gap-2 rounded-full py-3.5 font-sans text-sm font-semibold transition-all duration-200 hover:opacity-95 hover:-translate-y-px active:scale-[0.98]"
            style={{
              background: "var(--ink)",
              color: "var(--bg)",
              textDecoration: "none",
              boxShadow: "0 1px 0 0 var(--ink-muted) inset, 0 8px 28px var(--accent)",
            }}
          >
            Track your own fixation →
          </Link>
          <a
            href={imageUrl}
            download={`hyperfix-${fix.title.slice(0, 32).replace(/\s+/g, "-").toLowerCase()}.png`}
            className="w-full flex items-center justify-center gap-2 rounded-full py-3 font-sans text-sm transition-all duration-150"
            style={{
              background: "transparent",
              border: "1px solid var(--line)",
              color: "var(--ink-muted)",
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
          style={{ color: "var(--ink-faint)", textDecoration: "none" }}
        >
          hyperfix.app
        </Link>
      </main>
    </>
  );
}
