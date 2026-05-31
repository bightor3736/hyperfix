import Link from "next/link";
import { LogoLockup } from "@/components/Logo";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Social Assets · Hyperfix Brand" };

const NOISE_URL =
  "url(\"data:image/svg+xml;utf8,<svg viewBox='0 0 240 240' xmlns='http://www.w3.org/2000/svg'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 0.55 0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>\")";

function AssetCard({
  href,
  label,
  sublabel,
  imgSrc,
  aspect = "square",
}: {
  href: string;
  label: string;
  sublabel: string;
  imgSrc: string;
  aspect?: "square" | "circle";
}) {
  return (
    <div
      className="flex flex-col gap-3 anim-fadeUp"
      style={{ background: "var(--bg)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 24, padding: 20 }}
    >
      {/* Preview */}
      <div
        className="w-full overflow-hidden"
        style={{
          borderRadius: aspect === "circle" ? "50%" : 14,
          aspectRatio: "1 / 1",
          background: "var(--bg)",
          border: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={imgSrc} alt={label} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
      </div>

      {/* Info + download */}
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="font-sans text-sm font-medium" style={{ color: "#F4F4F4" }}>{label}</p>
          <p className="font-mono text-[11px]" style={{ color: "rgba(244,244,244,0.35)" }}>{sublabel}</p>
        </div>
        <a
          href={href}
          download
          className="shrink-0 inline-flex items-center gap-1.5 px-4 py-2 rounded-full font-mono text-[11px] uppercase tracking-widest transition-all hover:opacity-80"
          style={{
            background: "rgba(94,234,212,0.10)",
            border: "1px solid rgba(94,234,212,0.25)",
            color: "#5EEAD4",
          }}
        >
          ↓ Download
        </a>
      </div>
    </div>
  );
}

const SLIDES = [
  { id: "1", label: "Slide 1 — Cover", sublabel: "Gem + wordmark" },
  { id: "2", label: "Slide 2 — Hook", sublabel: '"What are you obsessed with?"' },
  { id: "3", label: "Slide 3 — Fix card", sublabel: "Day counter demo" },
  { id: "4", label: "Slide 4 — Categories", sublabel: "Category tag wall" },
  { id: "5", label: "Slide 5 — CTA", sublabel: '"Mourn it when it ends."' },
];

export default function SocialAssetsPage() {
  return (
    <div className="min-h-screen" style={{ background: "var(--bg)", color: "#F4F4F4" }}>
      <div aria-hidden className="fixed inset-0 pointer-events-none mix-blend-overlay" style={{ backgroundImage: NOISE_URL, backgroundSize: "240px 240px", opacity: 0.07 }} />

      {/* Nav */}
      <nav
        className="sticky top-0 z-40 px-6 sm:px-10 py-5 flex items-center justify-between"
        style={{ background: "rgba(7,7,8,0.85)", backdropFilter: "blur(20px)", borderBottom: "1px solid rgba(255,255,255,0.06)" }}
      >
        <Link href="/" className="transition-transform hover:scale-[1.02]">
          <LogoLockup size="sm" />
        </Link>
        <Link href="/brand" className="font-mono text-xs uppercase tracking-widest transition-opacity hover:opacity-70" style={{ color: "rgba(244,244,244,0.4)" }}>
          ← Brand
        </Link>
      </nav>

      <main className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-12 anim-fadeUp">
          <span
            className="inline-flex items-center font-sans text-xs rounded-full px-3 py-1 mb-5"
            style={{ background: "rgba(94,234,212,0.10)", color: "#5EEAD4", border: "1px solid rgba(94,234,212,0.22)" }}
          >
            social assets
          </span>
          <h1
            className="font-display mb-3"
            style={{ color: "#FFFFFF", fontSize: "clamp(32px, 5vw, 52px)", letterSpacing: "-0.03em", fontWeight: 600, lineHeight: 1.05 }}
          >
            Brand assets for
            <br />
            Instagram & TikTok
          </h1>
          <p className="font-sans text-base" style={{ color: "rgba(255,255,255,0.5)" }}>
            Profile picture and carousel slides. Click download to save as PNG.
          </p>
        </div>

        {/* Profile picture */}
        <section className="mb-14">
          <h2
            className="font-mono text-xs uppercase tracking-widest mb-5"
            style={{ color: "rgba(255,255,255,0.35)" }}
          >
            Profile picture — 1000×1000
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            <AssetCard
              href="/api/brand/pfp"
              label="Profile picture"
              sublabel="1000 × 1000 px"
              imgSrc="/api/brand/pfp"
              aspect="circle"
            />
            {/* Square preview (how it looks before cropping) */}
            <AssetCard
              href="/api/brand/pfp"
              label="Profile picture"
              sublabel="Square crop preview"
              imgSrc="/api/brand/pfp"
              aspect="square"
            />
          </div>
        </section>

        {/* Carousel slides */}
        <section>
          <h2
            className="font-mono text-xs uppercase tracking-widest mb-5"
            style={{ color: "rgba(255,255,255,0.35)" }}
          >
            Carousel slides — 1080×1080 · Instagram / TikTok
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {SLIDES.map((s) => (
              <AssetCard
                key={s.id}
                href={`/api/brand/slide/${s.id}`}
                label={s.label}
                sublabel={s.sublabel}
                imgSrc={`/api/brand/slide/${s.id}`}
                aspect="square"
              />
            ))}
          </div>
        </section>

        {/* Usage note */}
        <div
          className="mt-12 rounded-2xl px-6 py-5"
          style={{ background: "rgba(94,234,212,0.04)", border: "1px solid rgba(94,234,212,0.12)" }}
        >
          <p className="font-sans text-sm" style={{ color: "rgba(255,255,255,0.5)" }}>
            <span style={{ color: "#5EEAD4" }}>Tip:</span> For Instagram, post slides 1–5 as a carousel. For TikTok, use the slideshow feature and upload each in order. Profile picture works on both — Instagram and TikTok crop to a circle.
          </p>
        </div>
      </main>
    </div>
  );
}
