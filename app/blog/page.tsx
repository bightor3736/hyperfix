import type { Metadata } from "next";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import { posts } from "@/lib/blog";

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

      <main id="main-content" className="relative z-10 text-ink bg-[#0A0A0A]">
        <Nav />

        <section className="px-6 sm:px-10 pt-16 sm:pt-24 pb-16 border-b border-[rgba(244,244,244,0.07)]">
          <div className="max-w-5xl mx-auto">
            <span className="inline-flex items-center font-mono text-[10px] uppercase tracking-widest rounded-full px-3 py-1 bg-[rgba(244,244,244,0.06)] text-[rgba(244,244,244,0.4)] mb-8">the blog · hyperfix</span>
            <h1 className="font-display font-medium text-[3rem] sm:text-[5rem] leading-[0.9] tracking-crush text-ink text-balance">
              On obsession,
              <br />
              <span className="italic text-accent">counting,</span>
              <br />
              and the things
              <br />
              that ran your life.
            </h1>
            <p className="mt-8 font-sans text-lg sm:text-xl text-[rgba(244,244,244,0.5)] max-w-xl leading-snug">
              Guides and honest writing for people who can&apos;t shut up about their current thing.
            </p>
            <a
              href="/blog/feed.xml"
              className="mt-6 inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-widest text-[rgba(244,244,244,0.4)] hover:text-accent transition-colors"
            >
              <span aria-hidden="true">◉</span> RSS feed
            </a>
          </div>
        </section>

        {/* New dynamic posts */}
        <section className="px-6 sm:px-10 pt-12 pb-8">
          <div className="max-w-5xl mx-auto">
            <p className="font-mono text-[10px] uppercase tracking-widest mb-6" style={{ color: "rgba(244,244,244,0.35)" }}>
              Latest
            </p>
            <div className="grid sm:grid-cols-2 gap-4 mb-16">
              {posts.map((post) => {
                const formattedDate = new Date(post.date).toLocaleDateString("en-GB", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                });
                return (
                  <a
                    key={post.slug}
                    href={`/blog/${post.slug}`}
                    className="group block rounded-2xl p-6 transition-all duration-150 hover:border-[rgba(94,234,212,0.3)]"
                    style={{
                      background: "#111113",
                      border: "1px solid rgba(244,244,244,0.07)",
                    }}
                  >
                    <span
                      className="inline-block font-mono text-[10px] uppercase tracking-widest rounded-full px-3 py-1 mb-4"
                      style={{
                        background: "rgba(94,234,212,0.1)",
                        color: "#5EEAD4",
                        border: "1px solid rgba(94,234,212,0.15)",
                      }}
                    >
                      {post.category}
                    </span>
                    <h2
                      className="font-display font-bold text-xl leading-tight mb-3 group-hover:text-accent transition-colors"
                      style={{ color: "#F4F4F4", letterSpacing: "-0.01em" }}
                    >
                      {post.title}
                    </h2>
                    <p
                      className="font-sans text-sm leading-relaxed mb-5"
                      style={{ color: "rgba(244,244,244,0.5)" }}
                    >
                      {post.excerpt}
                    </p>
                    <p className="font-mono text-[10px]" style={{ color: "rgba(244,244,244,0.25)" }}>
                      {post.readTime} read · {formattedDate}
                    </p>
                  </a>
                );
              })}
            </div>

            <p className="font-mono text-[10px] uppercase tracking-widest mb-6" style={{ color: "rgba(244,244,244,0.35)" }}>
              More reading
            </p>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {articles.map((article) => (
                <article
                  key={article.href}
                  className="border border-[rgba(244,244,244,0.07)] p-8 flex flex-col gap-5 hover:border-accent transition-colors group"
                >
                  <span className="inline-flex items-center font-mono text-[10px] uppercase tracking-widest rounded-full px-3 py-1 bg-[rgba(244,244,244,0.06)] text-[rgba(244,244,244,0.4)] self-start">{article.stamp}</span>
                  <h2 className="font-display text-2xl leading-tight tracking-tight text-ink group-hover:text-accent transition-colors">
                    <a href={article.href}>{article.title}</a>
                  </h2>
                  <p className="font-sans text-base text-[rgba(244,244,244,0.5)] leading-relaxed flex-1">
                    {article.desc}
                  </p>
                  <a
                    href={article.href}
                    className="font-mono text-[11px] uppercase tracking-widest text-accent hover:text-ink transition-colors self-start"
                  >
                    Read →
                  </a>
                </article>
              ))}
            </div>
          </div>
        </section>

        <Footer />
      </main>
    </>
  );
}
