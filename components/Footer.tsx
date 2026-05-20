import { LogoLockup } from "@/components/Logo";

const NOISE_URL =
  "url(\"data:image/svg+xml;utf8,<svg viewBox='0 0 240 240' xmlns='http://www.w3.org/2000/svg'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 0.55 0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>\")";

const trackerLinks = [
  { href: "/hyperfixation-tracker", label: "hyperfixation tracker" },
  { href: "/fanfic-tracker", label: "fanfic tracker" },
  { href: "/booktok-tracker", label: "booktok tracker" },
  { href: "/book-tracker", label: "book tracker" },
  { href: "/kpop-tracker", label: "k-pop tracker" },
  { href: "/anime-tracker", label: "anime tracker" },
  { href: "/rewatch-tracker", label: "rewatch tracker" },
];

const vsLinks = [
  { href: "/vs/notion", label: "vs notion" },
  { href: "/vs/letterboxd", label: "vs letterboxd" },
  { href: "/vs/shelf", label: "vs shelf" },
  { href: "/vs/goodreads", label: "vs goodreads" },
  { href: "/vs/obsidian", label: "vs obsidian" },
  { href: "/vs/spreadsheet", label: "vs spreadsheet" },
  { href: "/vs/airtable", label: "vs airtable" },
  { href: "/vs/daylio", label: "vs daylio" },
  { href: "/vs/spotify", label: "vs spotify" },
  { href: "/vs/discord", label: "vs discord" },
];

const blogLinks = [
  { href: "/blog/what-is-hyperfixation", label: "what is hyperfixation" },
  { href: "/blog/adhd-hyperfixation", label: "adhd hyperfixation" },
  { href: "/blog/how-to-track-your-hyperfixations", label: "how to track" },
  { href: "/blog/signs-youre-in-a-hyperfixation", label: "signs of a hyperfixation" },
  { href: "/blog/how-to-explain-hyperfixation", label: "how to explain it" },
  { href: "/blog/hyperfixation-ending", label: "hyperfixation ending" },
  { href: "/blog/hyperfixation-vs-obsession", label: "hyperfixation vs obsession" },
];

function ColumnHeading({ children }: { children: React.ReactNode }) {
  return (
    <span
      className="inline-flex items-center font-sans text-xs rounded-full px-3 py-1 mb-5"
      style={{
        background: "rgba(94,234,212,0.10)",
        color: "#5EEAD4",
        border: "1px solid rgba(94,234,212,0.22)",
      }}
    >
      {children}
    </span>
  );
}

function FooterLink({ href, label }: { href: string; label: string }) {
  return (
    <li>
      <a
        href={href}
        className="motion-link font-sans text-sm transition-colors"
        style={{ color: "rgba(255,255,255,0.55)" }}
      >
        {label}
      </a>
    </li>
  );
}

export default function Footer() {
  return (
    <footer className="px-6 sm:px-10 pt-10 pb-8" style={{ background: "#070708" }}>
      <div
        className="relative overflow-hidden max-w-6xl mx-auto rounded-3xl p-8 sm:p-12 mb-6"
        style={{
          background: "#0F1011",
          border: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        <div
          aria-hidden
          className="absolute inset-0 pointer-events-none mix-blend-overlay"
          style={{ backgroundImage: NOISE_URL, backgroundSize: "240px 240px", opacity: 0.18 }}
        />
        {/* Subtle teal radial corner */}
        <div
          aria-hidden
          className="absolute pointer-events-none"
          style={{
            top: "-30%",
            right: "-20%",
            width: "60%",
            height: "120%",
            background: "radial-gradient(circle, rgba(94,234,212,0.10) 0%, transparent 65%)",
          }}
        />

        <div className="relative grid sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-10">
          <div>
            <a href="/" className="inline-block mb-4 transition-transform hover:scale-[1.02]">
              <LogoLockup size="sm" />
            </a>
            <p className="font-sans text-sm leading-relaxed max-w-xs" style={{ color: "rgba(255,255,255,0.55)" }}>
              A journal for the things that are quietly running your life.
            </p>
            <div className="mt-6">
              <a
                href="/auth/signup"
                className="inline-flex items-center gap-2 font-sans text-sm font-semibold px-5 py-3 transition-all duration-200 hover:opacity-95 hover:-translate-y-px active:scale-[0.98]"
                style={{
                  background: "#FFFFFF",
                  color: "#0A0A0A",
                  borderRadius: 999,
                  boxShadow: "0 4px 16px rgba(94,234,212,0.20)",
                }}
              >
                Get started →
              </a>
            </div>
          </div>

          <div>
            <ColumnHeading>Trackers</ColumnHeading>
            <ul className="space-y-2.5">
              {trackerLinks.map((l) => (
                <FooterLink key={l.href} {...l} />
              ))}
            </ul>
          </div>

          <div>
            <ColumnHeading>Compare</ColumnHeading>
            <ul className="space-y-2.5">
              {vsLinks.map((l) => (
                <FooterLink key={l.href} {...l} />
              ))}
            </ul>
          </div>

          <div>
            <ColumnHeading>Read</ColumnHeading>
            <ul className="space-y-2.5">
              {blogLinks.map((l) => (
                <FooterLink key={l.href} {...l} />
              ))}
              <FooterLink href="/pricing" label="pricing" />
              <FooterLink href="/manifesto" label="manifesto" />
              <FooterLink href="/privacy" label="privacy" />
              <FooterLink href="/tos" label="terms" />
            </ul>
          </div>
        </div>

        <div
          className="relative pt-6 flex items-center justify-between flex-wrap gap-4"
          style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}
        >
          <div className="flex items-center gap-4">
            <a
              href="https://tiktok.com/@hyperfix.app"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Hyperfix on TikTok"
              className="transition-colors hover:text-[#5EEAD4]"
              style={{ color: "rgba(255,255,255,0.4)" }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.28 6.28 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.18 8.18 0 0 0 4.78 1.52V6.78a4.85 4.85 0 0 1-1.01-.09z" />
              </svg>
            </a>
            <a
              href="https://instagram.com/hyperfix.app"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Hyperfix on Instagram"
              className="transition-colors hover:text-[#5EEAD4]"
              style={{ color: "rgba(255,255,255,0.4)" }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                <circle cx="12" cy="12" r="4" />
                <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" stroke="none" />
              </svg>
            </a>
          </div>
          <div className="flex items-center gap-4 font-sans text-xs flex-wrap" style={{ color: "rgba(255,255,255,0.35)" }}>
            <span>© 2026 hyperfix</span>
            <span>·</span>
            <span>we do not train ai on your obsessions</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
