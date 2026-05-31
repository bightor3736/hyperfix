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

export function SocialChips({ socialLink }: { socialLink: string | null | undefined }) {
  if (!socialLink) return null;
  const urls = socialLink
    .split(/[,\n]/)
    .map((s) => parseUrl(s))
    .filter((s): s is string => !!s)
    .slice(0, 4);

  if (urls.length === 0) return null;

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
              background: "rgba(7,7,8,0.6)",
              border: "1px solid var(--accent)",
              color: TEAL,
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
