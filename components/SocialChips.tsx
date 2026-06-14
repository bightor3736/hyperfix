// Auto-detect platform from URL and render small chips inline.
// Accepts a comma-separated list of URLs from profile.social_link.

import { XIcon } from "@/components/LandingIcons";

const TEAL = "var(--accent)";

type Platform = {
  name: string;
  match: RegExp;
  Icon: () => React.JSX.Element;
};

function InstagramIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" y1="6.5" x2="17.5" y2="6.5" />
    </svg>
  );
}
function TikTokIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M21 8.46c-1.94 0-3.79-.77-5.17-2.15-1.38-1.38-2.16-3.24-2.16-5.18V1H10.5v15.34c0 1.51-1.22 2.74-2.74 2.74-1.51 0-2.74-1.22-2.74-2.74 0-1.51 1.22-2.74 2.74-2.74.34 0 .68.06.99.18v-3.32c-.33-.05-.66-.07-.99-.07-3.34 0-6.05 2.71-6.05 6.05S4.42 22.34 7.76 22.34s6.05-2.71 6.05-6.05V9.69c1.49.92 3.27 1.46 5.19 1.46v-3.31c0 .62 0 .62 0 .62z" />
    </svg>
  );
}
function YouTubeIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.6 12 3.6 12 3.6s-7.5 0-9.4.5a3 3 0 0 0-2.1 2.1A31 31 0 0 0 0 12a31 31 0 0 0 .5 5.8 3 3 0 0 0 2.1 2.1c1.9.5 9.4.5 9.4.5s7.5 0 9.4-.5a3 3 0 0 0 2.1-2.1A31 31 0 0 0 24 12a31 31 0 0 0-.5-5.8zM9.6 15.6V8.4l6.2 3.6z" />
    </svg>
  );
}
function SpotifyIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141 4.36-1.319 9.78-.659 13.5 1.621.361.181.481.78.241 1.2zm.119-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.42 1.56-.299.421-1.02.599-1.559.3z" />
    </svg>
  );
}
function GitHubIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M12 .5C5.37.5 0 5.87 0 12.5c0 5.3 3.44 9.8 8.21 11.39.6.11.82-.26.82-.58v-2.03c-3.34.73-4.04-1.61-4.04-1.61-.55-1.39-1.34-1.76-1.34-1.76-1.09-.75.08-.74.08-.74 1.2.09 1.84 1.24 1.84 1.24 1.07 1.84 2.81 1.31 3.5 1 .11-.78.42-1.31.76-1.61-2.67-.3-5.47-1.34-5.47-5.95 0-1.31.47-2.39 1.24-3.23-.13-.3-.54-1.52.12-3.17 0 0 1.01-.32 3.3 1.23a11.5 11.5 0 0 1 6 0c2.29-1.55 3.3-1.23 3.3-1.23.66 1.65.25 2.87.12 3.17.77.84 1.23 1.92 1.23 3.23 0 4.62-2.81 5.64-5.49 5.94.43.37.81 1.1.81 2.22v3.29c0 .32.22.7.83.58A12.01 12.01 0 0 0 24 12.5C24 5.87 18.63.5 12 .5z" />
    </svg>
  );
}
function DiscordIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M20.32 4.37A19.8 19.8 0 0 0 15.45 3a13.9 13.9 0 0 0-.62 1.27 18.3 18.3 0 0 0-5.66 0A13.9 13.9 0 0 0 8.55 3a19.8 19.8 0 0 0-4.87 1.37C1.07 8.06.35 11.65.71 15.19a19.9 19.9 0 0 0 6.07 3.07c.49-.67.93-1.38 1.3-2.13-.71-.27-1.39-.6-2.04-.99.17-.13.34-.26.5-.4a14.2 14.2 0 0 0 12.13 0c.16.14.33.27.5.4-.65.39-1.33.72-2.04.99.37.75.81 1.46 1.3 2.13a19.9 19.9 0 0 0 6.07-3.07c.42-4.1-.72-7.66-3.27-10.82zM8.02 13.03c-1.18 0-2.15-1.09-2.15-2.42 0-1.34.95-2.43 2.15-2.43 1.2 0 2.17 1.1 2.15 2.43 0 1.33-.95 2.42-2.15 2.42zm7.96 0c-1.18 0-2.15-1.09-2.15-2.42 0-1.34.95-2.43 2.15-2.43 1.2 0 2.17 1.1 2.15 2.43 0 1.33-.95 2.42-2.15 2.42z" />
    </svg>
  );
}
function GlobeIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <circle cx="12" cy="12" r="10" />
      <line x1="2" y1="12" x2="22" y2="12" />
      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
    </svg>
  );
}

const PLATFORMS: Platform[] = [
  { name: "Instagram", match: /instagram\.com/i, Icon: InstagramIcon },
  { name: "TikTok", match: /tiktok\.com/i, Icon: TikTokIcon },
  { name: "YouTube", match: /(youtube\.com|youtu\.be)/i, Icon: YouTubeIcon },
  { name: "X", match: /(twitter\.com|x\.com)/i, Icon: () => <XIcon size={14} /> },
  { name: "Spotify", match: /spotify\.com/i, Icon: SpotifyIcon },
  { name: "GitHub", match: /github\.com/i, Icon: GitHubIcon },
  { name: "Discord", match: /(discord\.gg|discord\.com|discordapp)/i, Icon: DiscordIcon },
];

function detectPlatform(url: string): { name: string; Icon: () => React.JSX.Element } {
  for (const p of PLATFORMS) {
    if (p.match.test(url)) return { name: p.name, Icon: p.Icon };
  }
  return { name: "Site", Icon: GlobeIcon };
}

function parseUrl(s: string): string | null {
  const trimmed = s.trim();
  if (!trimmed) return null;
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  return `https://${trimmed}`;
}

export function SocialChips({
  socialLink,
  variant = "chips",
  dark = false,
}: {
  socialLink: string | null | undefined;
  variant?: "chips" | "icons";
  dark?: boolean;
}) {
  if (!socialLink) return null;
  const urls = socialLink
    .split(/[,\n]/)
    .map((s) => parseUrl(s))
    .filter((s): s is string => !!s)
    .slice(0, 8);

  if (urls.length === 0) return null;

  // Reference-style icon row — plain icons in a divided row.
  if (variant === "icons") {
    const borderCol = dark ? "rgba(255,255,255,0.12)" : "#edeff2";
    const iconCol = dark ? "rgba(255,255,255,0.55)" : "#5b6470";
    const hoverBg = dark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.03)";
    return (
      <div className="flex w-full items-stretch overflow-hidden rounded-2xl" style={{ border: `1px solid ${borderCol}` }}>
        {urls.map((url, i) => {
          const { name, Icon } = detectPlatform(url);
          return (
            <a
              key={url}
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-1 items-center justify-center py-3.5 transition-colors"
              style={{ borderLeft: i > 0 ? `1px solid ${borderCol}` : undefined, color: iconCol, backgroundColor: "transparent" }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.backgroundColor = hoverBg; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.backgroundColor = "transparent"; }}
              aria-label={name}
            >
              <Icon />
            </a>
          );
        })}
      </div>
    );
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      {urls.map((url) => {
        const { name, Icon } = detectPlatform(url);
        return (
          <a
            key={url}
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 font-mono text-[10px] uppercase tracking-widest transition-all hover:opacity-80"
            style={{
              background: "var(--accent-soft)",
              border: "1px solid var(--accent)",
              color: "#E1431F",
              backdropFilter: "blur(8px)",
            }}
            aria-label={name}
          >
            <Icon />
            <span>{name}</span>
          </a>
        );
      })}
    </div>
  );
}
