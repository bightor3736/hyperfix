import type { Metadata } from "next";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import { posts } from "@/lib/blog";
import { RevealSection } from "@/components/RevealSection";
import { BookIcon } from "@/components/LandingIcons";

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

export default function BlogIndexPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      <Nav />
      <div
        className="min-h-screen px-4 sm:px-6 lg:px-8 pt-8 pb-16"
        style={{ background: "#070708" }}
      >
        <main id="main-content" className="relative max-w-5xl mx-auto">
          {/* Clean vvault header */}
          <header className="pt-8 sm:pt-12 pb-10 sm:pb-14 anim-fadeUp">
            <div className="flex items-center gap-2 mb-6">
              <BookIcon size={14} className="opacity-60" />
              <span
                className="font-mono text-[11px] uppercase tracking-[0.18em]"
                style={{ color: "rgba(255,255,255,0.5)" }}
              >
                Journal · Hyperfix
              </span>
            </div>
            <h1
              className="font-display"
              style={{
                color: "#FFFFFF",
                fontSize: "clamp(32px, 5.5vw, 48px)",
                lineHeight: 1.05,
                letterSpacing: "-0.02em",
                fontWeight: 500,
              }}
            >
              Field notes on obsession.
            </h1>
            <p
              className="mt-4 font-sans text-base sm:text-lg max-w-xl"
              style={{ color: "rgba(255,255,255,0.6)" }}
            >
              Guides and honest writing for people who can&apos;t shut up about their current thing.
            </p>
            <a
              href="/blog/feed.xml"
              className="mt-6 inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.18em] transition-colors"
              style={{ color: TEAL }}
            >
              RSS feed →
            </a>
          </header>

          {/* Latest posts */}
          {posts.length > 0 && (
            <RevealSection>
              <div className="mb-4">
                <span
                  className="font-mono text-[11px] uppercase tracking-[0.18em]"
                  style={{ color: "rgba(255,255,255,0.4)" }}
                >
                  Latest
                </span>
              </div>
              <div className="grid sm:grid-cols-2 gap-4 mb-12">
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
                      className="group block rounded-2xl p-6 sm:p-7 transition-all duration-200 hover:-translate-y-0.5 anim-fadeUp"
                      style={{
                        background: CARD_BG,
                        border: `1px solid ${CARD_BORDER}`,
                        textDecoration: "none",
                        animationDelay: delay,
                      }}
                    >
                      <span
                        className="inline-flex items-center font-mono text-[10px] uppercase tracking-[0.18em] rounded-full px-2.5 py-1 mb-4"
                        style={{
                          background: "rgba(94,234,212,0.08)",
                          color: TEAL,
                          border: "1px solid rgba(94,234,212,0.18)",
                        }}
                      >
                        {post.category}
                      </span>
                      <h2
                        className="font-display group-hover:text-[#5EEAD4] transition-colors mb-3"
                        style={{
                          color: "#FFFFFF",
                          fontSize: 22,
                          fontWeight: 500,
                          letterSpacing: "-0.01em",
                          lineHeight: 1.2,
                        }}
                      >
                        {post.title}
                      </h2>
                      <p
                        className="font-sans text-sm leading-relaxed mb-5"
                        style={{
                          color: "rgba(255,255,255,0.55)",
                          display: "-webkit-box",
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: "vertical",
                          overflow: "hidden",
                        }}
                      >
                        {post.excerpt}
                      </p>
                      <p
                        className="font-mono text-[11px] tabular-nums"
                        style={{ color: "rgba(255,255,255,0.35)" }}
                      >
                        {post.readTime} read · {formattedDate}
                      </p>
                    </a>
                  );
                })}
              </div>
            </RevealSection>
          )}

          {/* More reading */}
          <RevealSection>
            <div className="mb-4">
              <span
                className="font-mono text-[11px] uppercase tracking-[0.18em]"
                style={{ color: "rgba(255,255,255,0.4)" }}
              >
                More reading
              </span>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {articles.map((article, i) => {
                const delay = `${Math.min(i, 6) * 60}ms`;
                return (
                  <a
                    key={article.href}
                    href={article.href}
                    className="group flex flex-col gap-4 rounded-2xl p-6 sm:p-7 transition-all duration-200 hover:-translate-y-0.5 anim-fadeUp"
                    style={{
                      background: CARD_BG,
                      border: `1px solid ${CARD_BORDER}`,
                      textDecoration: "none",
                      animationDelay: delay,
                    }}
                  >
                    <span
                      className="inline-flex items-center font-mono text-[10px] uppercase tracking-[0.18em] rounded-full px-2.5 py-1 self-start"
                      style={{
                        background: "rgba(94,234,212,0.08)",
                        color: TEAL,
                        border: "1px solid rgba(94,234,212,0.18)",
                      }}
                    >
                      {article.stamp}
                    </span>
                    <h2
                      className="font-display group-hover:text-[#5EEAD4] transition-colors"
                      style={{
                        color: "#FFFFFF",
                        fontSize: 20,
                        fontWeight: 500,
                        letterSpacing: "-0.01em",
                        lineHeight: 1.2,
                      }}
                    >
                      {article.title}
                    </h2>
                    <p
                      className="font-sans text-sm leading-relaxed flex-1"
                      style={{
                        color: "rgba(255,255,255,0.55)",
                        display: "-webkit-box",
                        WebkitLineClamp: 3,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                      }}
                    >
                      {article.desc}
                    </p>
                    <span
                      className="font-mono text-[11px] uppercase tracking-[0.18em] self-start"
                      style={{ color: TEAL }}
                    >
                      Read →
                    </span>
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
