import type { Metadata } from "next";
import Link from "next/link";
import { LogoLockup } from "@/components/Logo";

export const metadata: Metadata = {
  title: "Studio Slides · Hyperfix",
  robots: { index: false },
};

const SLIDES = [
  { n: 1, label: "Cover",       desc: "somewhere to put all your notes" },
  { n: 2, label: "Intro",       desc: "a private workspace inside each fix" },
  { n: 3, label: "Features",    desc: "what you can do" },
  { n: 4, label: "Just yours",  desc: "no one else sees it" },
  { n: 5, label: "Great for",   desc: "brainrot · fanfic · ships · lore" },
  { n: 6, label: "CTA",         desc: "build your corner · hyperfix.app" },
];

export default function StudioSlidesPage() {
  return (
    <div className="min-h-screen" style={{ background: "#070708", color: "#F4F4F4" }}>
      {/* Nav */}
      <nav
        className="sticky top-0 z-40 px-6 sm:px-10 py-5 flex items-center justify-between"
        style={{ background: "rgba(7,7,8,0.85)", backdropFilter: "blur(20px)", borderBottom: "1px solid rgba(244,244,244,0.07)" }}
      >
        <Link href="/" aria-label="Hyperfix home">
          <LogoLockup size="sm" />
        </Link>
        <span
          className="font-mono text-[10px] uppercase tracking-widest px-3 py-1 rounded-full"
          style={{ background: "rgba(94,234,212,0.1)", color: "#5EEAD4", border: "1px solid rgba(94,234,212,0.25)" }}
        >
          Studio · TikTok slides
        </span>
      </nav>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-10 sm:py-14">
        {/* Header */}
        <div className="mb-10">
          <h1
            className="font-display font-semibold mb-2"
            style={{ fontSize: "clamp(32px, 5vw, 52px)", letterSpacing: "-0.03em", lineHeight: 1.05 }}
          >
            Studio promo slides
          </h1>
          <p className="font-sans text-sm" style={{ color: "rgba(244,244,244,0.45)" }}>
            1080 × 1920 · 9:16 · PNG · right-click or use the button to save each slide
          </p>
        </div>

        {/* Download all */}
        <div className="flex flex-wrap gap-3 mb-10">
          {SLIDES.map(({ n, label }) => (
            <a
              key={n}
              href={`/api/slides/studio/${n}`}
              download={`hyperfix-studio-${String(n).padStart(2, "0")}-${label.toLowerCase().replace(/\s+/g, "-")}.png`}
              className="px-4 py-2 rounded-full font-mono text-[11px] uppercase tracking-widest transition-all hover:opacity-80"
              style={{
                background: "rgba(94,234,212,0.1)",
                border: "1px solid rgba(94,234,212,0.25)",
                color: "#5EEAD4",
              }}
            >
              ↓ Slide {n}
            </a>
          ))}
        </div>

        {/* Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {SLIDES.map(({ n, label, desc }) => (
            <div key={n} className="flex flex-col gap-2">
              {/* Preview */}
              <a
                href={`/api/slides/studio/${n}`}
                download={`hyperfix-studio-${String(n).padStart(2, "0")}-${label.toLowerCase().replace(/\s+/g, "-")}.png`}
                className="group relative block rounded-2xl overflow-hidden"
                style={{ aspectRatio: "9/16", border: "1px solid rgba(244,244,244,0.08)" }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={`/api/slides/studio/${n}`}
                  alt={`Slide ${n}: ${label}`}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
                {/* Hover overlay */}
                <div
                  className="absolute inset-0 flex flex-col items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity"
                  style={{ background: "rgba(0,0,0,0.6)", backdropFilter: "blur(4px)" }}
                >
                  <span className="font-mono text-xs uppercase tracking-widest" style={{ color: "#5EEAD4" }}>
                    ↓ Download
                  </span>
                </div>
              </a>

              {/* Label */}
              <div className="px-1">
                <p className="font-mono text-[10px] uppercase tracking-widest" style={{ color: "#5EEAD4" }}>
                  {String(n).padStart(2, "0")} · {label}
                </p>
                <p className="font-sans text-[11px] mt-0.5 leading-snug" style={{ color: "rgba(244,244,244,0.35)" }}>
                  {desc}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Instructions */}
        <div
          className="mt-12 rounded-2xl p-5 sm:p-6"
          style={{ background: "#111113", border: "1px solid rgba(244,244,244,0.07)" }}
        >
          <p className="font-mono text-[10px] uppercase tracking-widest mb-3" style={{ color: "rgba(244,244,244,0.3)" }}>
            Posting tips
          </p>
          <ul className="flex flex-col gap-2">
            {[
              "Upload all 6 as a photo slideshow on TikTok — set timing to 3–4s per slide",
              "Pick a slow lo-fi or trending ADHD audio — avoid anything too hype",
              "Caption: 'POV: your hyperfixation finally has a proper home 🪦' + #adhd #hyperfixation",
              "Post between 6–10pm local time for best reach",
            ].map((tip, i) => (
              <li key={i} className="flex items-start gap-2.5 font-sans text-sm" style={{ color: "rgba(244,244,244,0.55)" }}>
                <span style={{ color: "#5EEAD4", flexShrink: 0 }}>✦</span>
                {tip}
              </li>
            ))}
          </ul>
        </div>
      </main>
    </div>
  );
}
