export const dynamic = "force-static";
export const revalidate = 3600;

const SITE = "https://hyperfix.app";

const posts = [
  {
    slug: "hyperfixation-vs-obsession",
    title: "Hyperfixation vs. Obsession — What's Actually the Difference?",
    description: "These words get conflated constantly. Here's what they actually mean and why the distinction matters.",
    date: "2026-05-17",
  },
  {
    slug: "hyperfixation-ending",
    title: "How to Survive the End of a Hyperfixation",
    description: "The post-fix crash is real. What it is, why it happens, and how to move through it.",
    date: "2026-05-17",
  },
  {
    slug: "how-to-explain-hyperfixation",
    title: "How to Explain Your Hyperfixation to People Who Don't Get It",
    description: "A practical guide for the conversation you're always having.",
    date: "2026-05-10",
  },
  {
    slug: "signs-youre-in-a-hyperfixation",
    title: "8 Signs You're in a Hyperfixation (Not Just Interested)",
    description: "The difference between liking something and being owned by it.",
    date: "2026-05-10",
  },
  {
    slug: "how-to-track-your-hyperfixations",
    title: "How to Track Your Hyperfixations (and Why You Should)",
    description: "What to log, how to log it, and what you learn when you do.",
    date: "2026-05-03",
  },
  {
    slug: "adhd-hyperfixation",
    title: "ADHD Hyperfixation: Why Your Brain Does This",
    description: "The neuroscience, the experience, and why it's not a flaw.",
    date: "2026-05-03",
  },
  {
    slug: "what-is-hyperfixation",
    title: "What Is Hyperfixation?",
    description: "Definition, history, and why the word has taken over the internet.",
    date: "2026-04-26",
  },
];

function escapeXml(str: string) {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export async function GET() {
  const items = posts
    .map(
      (p) => `
    <item>
      <title>${escapeXml(p.title)}</title>
      <link>${SITE}/blog/${p.slug}</link>
      <guid isPermaLink="true">${SITE}/blog/${p.slug}</guid>
      <description>${escapeXml(p.description)}</description>
      <pubDate>${new Date(p.date).toUTCString()}</pubDate>
    </item>`
    )
    .join("");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Hyperfix Blog</title>
    <link>${SITE}/blog</link>
    <description>Writing about hyperfixation, ADHD, fandom, and the things that are currently running your life.</description>
    <language>en</language>
    <atom:link href="${SITE}/blog/feed.xml" rel="self" type="application/rss+xml"/>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    ${items}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600, stale-while-revalidate=86400",
    },
  });
}
