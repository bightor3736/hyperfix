import type { Metadata } from "next";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import { posts } from "@/lib/blog";
import { RevealSection } from "@/components/RevealSection";

export const metadata: Metadata = {
  title: "Hyperfix Blog — on hyperfixation, obsession, and the things that run your life",
  description:
    "Guides, explainers, and honest writing about hyperfixation, ADHD, and why tracking your obsessions matters.",
  alternates: {
    canonical: "https://hyperfix.app/blog",
    types: {
      "application/rss+xml": "https://hyperfix.app/blog/feed.xml",
    },
  },
  openGraph: {
    url: "https://hyperfix.app/blog",
    title: "The Hyperfix Blog",
    description: "Guides, explainers, and honest writing about hyperfixation, ADHD, and why tracking your obsessions matters.",
    images: [
      {
        url: "/api/og?title=The+Hyperfix+Blog&sub=on+hyperfixation%2C+obsession%2C+and+counting+%C2%B7+hyperfix.app&accent=Blog",
        width: 1200,
        height: 630,
      },
    ],
  },
};

const TEAL = "#5EEAD4";
const CARD_BG = "#0F1011";
const CARD_BORDER = "rgba(255,255,255,0.06)";
const NOISE_URL =
  "url(\"data:image/svg+xml;utf8,<svg viewBox='0 0 240 240' xmlns='http://www.w3.org/2000/svg'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 0.55 0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>\")";

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: "https://hyperfix.app" },
    { "@type": "ListItem", position: 2, name: "Blog", item: "https://hyperfix.app/blog" },
  ],
};

const articles = [
  {
    href: "/blog/what-is-hyperfixation",
    stamp: "explainer",
    title: "What Is Hyperfixation?",
    desc: "The word the ADHD and autistic communities gave to something that had been happening, unnamed, for a long time. A definition, a history, and why it matters that we have language for it now.",
  },
  {
    href: "/blog/adhd-hyperfixation",
    stamp: "deep dive",
    title: "ADHD Hyperfixation: Why Your Brain Does This",
    desc: "Hyperfixation and ADHD. Why the dopamine economy of your brain makes specific things suddenly, overwhelmingly important. What's actually happening up there.",
  },
  {
    href: "/blog/how-to-track-your-hyperfixations",
    stamp: "guide",
    title: "How to Track Your Hyperfixations (and Why You Should)",
    desc: "A practical guide to logging hyperfixations — what to track, how to count the days, and why a record of your obsessions is more useful than you'd think.",
  },
  {
    href: "/blog/signs-youre-in-a-hyperfixation",
    stamp: "guide",
    title: "Signs You're in a Hyperfixation",
    desc: "From the mild (you looked it up once) to the advanced (you've reorganised your entire sleep schedule around it). The twelve signs, in order of severity.",
  },
  {
    href: "/blog/how-to-explain-hyperfixation",
    stamp: "guide",
    title: "How to Explain Hyperfixation to Someone Who Doesn't Have It",
    desc: "How do you explain to someone why you've been talking about the same fanfic for three months? A practical guide for the conversation you've been avoiding.",
  },
  {
    href: "/blog/hyperfixation-ending",
    stamp: "guide",
    title: "How to Survive the End of a Hyperfixation",
    desc: "The post-fix crash is real. That hollow, directionless feeling when something that consumed you for sixty days just stops. What it is, why it happens, and how to move through it.",
  },
  {
    href: "/blog/hyperfixation-vs-obsession",
    stamp: "explainer",
    title: "Hyperfixation vs. Obsession — What's the Difference?",
    desc: "These words get conflated constantly. Here's what they actually mean, why the distinction matters, and how to know which one you're dealing with.",
  },
];

function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <span
      className="inline-flex items-center font-sans text-xs rounded-full px-3 py-1 mb-5"
      style={{
        background: "rgba(94,234,212,0.10)",
        color: TEAL,
        border: "1px solid rgba(94,234,212,0.22)",
      }}
    >
      {children}
    </span>
  );
}

export default function BlogIndexPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      <Nav />
      <div
        className="min-h-screen px-4 sm:px-6 lg:px-8 pt-8 pb-16 relative"
        style={{ background: "#070708" }}
      >
        <div
          aria-hidden
          className="absolute inset-0 pointer-events-none mix-blend-overlay"
          style={{ backgroundImage: NOISE_URL, backgroundSize: "240px 240px", opacity: 0.08 }}
        />

        <main id="main-content" className="relative max-w-5xl mx-auto">
          {/* Hero card */}
          <div
            className="relative overflow-hidden rounded-3xl p-6 sm:p-10 mb-6 anim-fadeUp"
            style={{
              background:
                "radial-gradient(ellipse 80% 120% at 50% 130%, #5EEAD4 0%, #2DD4BF 14%, #0E4F47 34%, #08231F 55%, #070708 78%)",
              border: `1px solid ${CARD_BORDER}`,
            }}
          >
            <div
              aria-hidden
              className="absolute inset-0 pointer-events-none mix-blend-overlay"
              style={{ backgroundImage: NOISE_URL, backgroundSize: "200px 200px", opacity: 0.55 }}
            />
            <div
              aria-hidden
              className="absolute inset-0 pointer-events-none"
              style={{
                background:
                  "linear-gradient(180deg, #070708 0%, rgba(7,7,8,0.45) 30%, transparent 100%)",
              }}
            />
            <div className="relative">
              <Eyebrow>blog</Eyebrow>
              <h1
                className="font-display anim-fadeUp delay-100"
                style={{
                  color: "#FFFFFF",
                  fontSize: "clamp(36px, 6vw, 56px)",
                  lineHeight: 1.05,
                  letterSpacing: "-0.02em",
                  fontWeight: 600,
                }}
              >
                On obsession, counting,
                <br />
                and the things that ran your life.
              </h1>
              <p
                className="mt-6 font-sans text-base sm:text-lg max-w-xl anim-fadeUp delay-200"
                style={{ color: "rgba(255,255,255,0.72)" }}
              >
                Guides and honest writing for people who can&apos;t shut up about their current thing.
              </p>
              <a
                href="/blog/feed.xml"
                className="mt-6 inline-flex items-center gap-2 font-sans text-xs anim-fadeUp delay-300 transition-colors"
                style={{ color: TEAL }}
              >
                <span aria-hidden="true">◉</span> RSS feed
              </a>
            </div>
          </div>

          {/* Latest posts */}
          {posts.length > 0 && (
            <RevealSection>
              <div className="mb-2">
                <Eyebrow>latest</Eyebrow>
              </div>
              <div className="grid sm:grid-cols-2 gap-4 mb-10">
                {posts.map((post, i) => {
                  const formattedDate = new Date(post.date).toLocaleDateString("en-GB", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  });
                  const delay = `${Math.min(i, 6) * 60}ms`;
                  return (
                    <a
                      key={post.slug}
                      href={`/blog/${post.slug}`}
                      className="motion-card group relative overflow-hidden rounded-3xl p-6 sm:p-8 anim-fadeUp"
                      style={{
                        background: CARD_BG,
                        border: `1px solid ${CARD_BORDER}`,
                        textDecoration: "none",
                        animationDelay: delay,
                      }}
                    >
                      <div
                        aria-hidden
                        className="absolute inset-0 pointer-events-none mix-blend-overlay"
                        style={{
                          backgroundImage: NOISE_URL,
                          backgroundSize: "240px 240px",
                          opacity: 0.22,
                        }}
                      />
                      <div className="relative">
                        <span
                          className="inline-flex items-center font-sans text-xs rounded-full px-3 py-1 mb-4"
                          style={{
                            background: "rgba(94,234,212,0.10)",
                            color: TEAL,
                            border: "1px solid rgba(94,234,212,0.22)",
                          }}
                        >
                          {post.category}
                        </span>
                        <h2
                          className="font-display group-hover:text-[#5EEAD4] transition-colors mb-3"
                          style={{
                            color: "#FFFFFF",
                            fontSize: 22,
                            fontWeight: 600,
                            letterSpacing: "-0.01em",
                            lineHeight: 1.18,
                          }}
                        >
                          {post.title}
                        </h2>
                        <p
                          className="font-sans text-sm leading-relaxed mb-5"
                          style={{ color: "rgba(255,255,255,0.6)" }}
                        >
                          {post.excerpt}
                        </p>
                        <p
                          className="font-sans text-xs"
                          style={{ color: "rgba(255,255,255,0.35)" }}
                        >
                          {post.readTime} read · {formattedDate}
                        </p>
                      </div>
                    </a>
                  );
                })}
              </div>
            </RevealSection>
          )}

          {/* More reading */}
          <RevealSection>
            <div className="mb-2">
              <Eyebrow>more reading</Eyebrow>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {articles.map((article, i) => {
                const delay = `${Math.min(i, 6) * 60}ms`;
                return (
                  <a
                    key={article.href}
                    href={article.href}
                    className="motion-card group relative overflow-hidden rounded-3xl p-6 sm:p-8 flex flex-col gap-4 anim-fadeUp"
                    style={{
                      background: CARD_BG,
                      border: `1px solid ${CARD_BORDER}`,
                      textDecoration: "none",
                      animationDelay: delay,
                    }}
                  >
                    <div
                      aria-hidden
                      className="absolute inset-0 pointer-events-none mix-blend-overlay"
                      style={{
                        backgroundImage: NOISE_URL,
                        backgroundSize: "240px 240px",
                        opacity: 0.22,
                      }}
                    />
                    <div className="relative flex flex-col gap-4 flex-1">
                      <span
                        className="inline-flex items-center font-sans text-xs rounded-full px-3 py-1 self-start"
                        style={{
                          background: "rgba(94,234,212,0.10)",
                          color: TEAL,
                          border: "1px solid rgba(94,234,212,0.22)",
                        }}
                      >
                        {article.stamp}
                      </span>
                      <h2
                        className="font-display group-hover:text-[#5EEAD4] transition-colors"
                        style={{
                          color: "#FFFFFF",
                          fontSize: 20,
                          fontWeight: 600,
                          letterSpacing: "-0.01em",
                          lineHeight: 1.18,
                        }}
                      >
                        {article.title}
                      </h2>
                      <p
                        className="font-sans text-sm leading-relaxed flex-1"
                        style={{ color: "rgba(255,255,255,0.6)" }}
                      >
                        {article.desc}
                      </p>
                      <span
                        className="font-sans text-sm self-start"
                        style={{ color: TEAL }}
                      >
                        Read →
                      </span>
                    </div>
                  </a>
                );
              })}
            </div>
          </RevealSection>
        </main>
      </div>
      <Footer />
    </>
  );
}
