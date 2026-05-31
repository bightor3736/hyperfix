import { Wordmark } from "./Wordmark";
import { ThemeToggle } from "./ThemeToggle";

const columns = [
  {
    title: "Product",
    links: [
      { label: "Features",  href: "#features" },
      { label: "Pricing",   href: "#pricing" },
      { label: "Graveyard", href: "#graveyard" },
      { label: "Wrapped",   href: "/wrapped" },
    ],
  },
  {
    title: "Community",
    links: [
      { label: "Explore",     href: "/explore" },
      { label: "Focus Rooms", href: "/room" },
      { label: "Field notes", href: "#blog" },
    ],
  },
  {
    title: "Support",
    links: [
      { label: "Help",    href: "#help" },
      { label: "Privacy", href: "#privacy" },
      { label: "Terms",   href: "#terms" },
    ],
  },
  {
    title: "Try it",
    links: [
      { label: "Sign up", href: "/join" },
      { label: "Log in",  href: "/auth/login" },
      { label: "iOS",     href: "#ios" },
      { label: "Android", href: "#android" },
    ],
  },
];

// Footer is always dark regardless of active theme
const footerStyle = {
  "--ink":        "#f3eee0",
  "--ink-muted":  "#9a9488",
  "--ink-faint":  "#6b6557",
  "--line":       "#262523",
  "--invert-bg":  "#f3eee0",
  "--invert-ink": "#0a0a0a",
  background: "#0a0a0a",
} as React.CSSProperties;

export function Footer() {
  return (
    <footer style={footerStyle}>
      <div className="mx-auto max-w-[1200px] px-6 pb-12 pt-20 sm:px-10">
        <div className="grid grid-cols-2 gap-y-12 sm:grid-cols-3 md:grid-cols-5 md:gap-x-10">
          <div className="col-span-2 sm:col-span-3 md:col-span-1">
            <Wordmark />
            <p className="mt-4 max-w-[260px] text-[13px] leading-relaxed" style={{ color: "var(--ink-muted)" }}>
              A diary for the thing that rearranged your brain.
            </p>
            <div className="mt-6">
              <ThemeToggle />
            </div>
          </div>

          {columns.map((col) => (
            <div key={col.title}>
              <h4 className="text-[13px] font-medium" style={{ color: "var(--ink)" }}>{col.title}</h4>
              <ul className="mt-4 space-y-2.5">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <a href={link.href} className="text-[13px] transition-colors hover:opacity-80" style={{ color: "var(--ink-muted)" }}>
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-16 flex flex-col gap-4 pt-7 sm:flex-row sm:items-center sm:justify-between" style={{ borderTop: "1px solid var(--line)" }}>
          <p className="text-[12px]" style={{ color: "var(--ink-faint)" }}>© 2026 Hyperfix</p>
          <div className="flex items-center gap-5 text-[12px]" style={{ color: "var(--ink-faint)" }}>
            <a href="https://twitter.com/hyperfixapp" className="hover:opacity-80 transition-opacity">Twitter</a>
            <a href="#tiktok" className="hover:opacity-80 transition-opacity">TikTok</a>
            <a href="#instagram" className="hover:opacity-80 transition-opacity">Instagram</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
