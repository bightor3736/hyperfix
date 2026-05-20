import { LogoLockup } from "@/components/Logo";

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

export default function Footer() {
  return (
    <footer className="px-6 sm:px-10 pt-10 pb-8 bg-[#0A0A0A]">
      <div
        className="max-w-6xl mx-auto rounded-[24px] border border-[rgba(244,244,244,0.07)] bg-[#111113] p-8 sm:p-10 mb-6"
      >
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-10">
          <div>
            <a href="/" className="inline-block mb-3">
              <LogoLockup />
            </a>
            <p className="font-mono text-[11px] uppercase tracking-widest text-[rgba(244,244,244,0.4)] max-w-xs">
              a tracker for the things that are running your life
            </p>
            <div className="mt-6">
              <a
                href="/#waitlist"
                className="font-mono text-[11px] uppercase tracking-widest px-5 py-2.5 rounded-full bg-accent text-[#0A0A0A] font-bold hover:bg-accent/90 transition-colors inline-block"
              >
                join waitlist →
              </a>
            </div>
          </div>

          <div>
            <p className="inline-flex items-center font-mono text-[10px] uppercase tracking-widest text-[rgba(244,244,244,0.4)] bg-[rgba(244,244,244,0.06)] rounded-full px-3 py-1 mb-5">
              Trackers
            </p>
            <ul className="space-y-2">
              {trackerLinks.map((l) => (
                <li key={l.href}>
                  <a
                    href={l.href}
                    className="font-mono text-[11px] uppercase tracking-widest text-[rgba(244,244,244,0.5)] hover:text-accent transition-colors"
                  >
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="inline-flex items-center font-mono text-[10px] uppercase tracking-widest text-[rgba(244,244,244,0.4)] bg-[rgba(244,244,244,0.06)] rounded-full px-3 py-1 mb-5">
              Compare
            </p>
            <ul className="space-y-2">
              {vsLinks.map((l) => (
                <li key={l.href}>
                  <a
                    href={l.href}
                    className="font-mono text-[11px] uppercase tracking-widest text-[rgba(244,244,244,0.5)] hover:text-accent transition-colors"
                  >
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="inline-flex items-center font-mono text-[10px] uppercase tracking-widest text-[rgba(244,244,244,0.4)] bg-[rgba(244,244,244,0.06)] rounded-full px-3 py-1 mb-5">
              Blog
            </p>
            <ul className="space-y-2">
              {blogLinks.map((l) => (
                <li key={l.href}>
                  <a
                    href={l.href}
                    className="font-mono text-[11px] uppercase tracking-widest text-[rgba(244,244,244,0.5)] hover:text-accent transition-colors"
                  >
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
            <a
              href="/pricing"
              className="font-mono text-[11px] uppercase tracking-widest text-[rgba(244,244,244,0.5)] hover:text-accent transition-colors block mt-6"
            >
              pricing
            </a>
            <a
              href="/manifesto"
              className="font-mono text-[11px] uppercase tracking-widest text-[rgba(244,244,244,0.5)] hover:text-accent transition-colors block mt-2"
            >
              manifesto
            </a>
            <a
              href="/privacy"
              className="font-mono text-[11px] uppercase tracking-widest text-[rgba(244,244,244,0.5)] hover:text-accent transition-colors block mt-2"
            >
              privacy
            </a>
            <a
              href="/tos"
              className="font-mono text-[11px] uppercase tracking-widest text-[rgba(244,244,244,0.5)] hover:text-accent transition-colors block mt-2"
            >
              terms
            </a>
          </div>
        </div>

        <div className="pt-6 border-t border-[rgba(244,244,244,0.07)] flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-4">
            <a
              href="https://tiktok.com/@hyperfix.app"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Hyperfix on TikTok"
              className="text-[rgba(244,244,244,0.3)] hover:text-accent transition-colors"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.28 6.28 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.18 8.18 0 0 0 4.78 1.52V6.78a4.85 4.85 0 0 1-1.01-.09z"/>
              </svg>
            </a>
            <a
              href="https://instagram.com/hyperfix.app"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Hyperfix on Instagram"
              className="text-[rgba(244,244,244,0.3)] hover:text-accent transition-colors"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                <circle cx="12" cy="12" r="4"/>
                <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" stroke="none"/>
              </svg>
            </a>
          </div>
          <div className="flex items-center gap-4 font-mono text-[10px] uppercase tracking-widest text-[rgba(244,244,244,0.25)] flex-wrap">
            <span>© 2026 hyperfix</span>
            <span>we do not train ai on your obsessions</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
