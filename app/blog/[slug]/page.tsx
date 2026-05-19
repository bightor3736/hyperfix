import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import { getPostBySlug, posts } from "@/lib/blog";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  return posts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return {};
  return {
    title: `${post.title} — Hyperfix Blog`,
    description: post.excerpt,
    alternates: { canonical: `https://hyperfix.app/blog/${post.slug}` },
    openGraph: {
      title: post.title,
      description: post.excerpt,
      url: `https://hyperfix.app/blog/${post.slug}`,
      images: [
        {
          url: `/api/og?title=${encodeURIComponent(post.title)}&sub=${encodeURIComponent(post.category + " · hyperfix.app")}&accent=Blog`,
          width: 1200,
          height: 630,
        },
      ],
    },
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) notFound();

  const paragraphs = post.content
    .split(/\n\n+/)
    .map((p) => p.trim())
    .filter(Boolean);

  const formattedDate = new Date(post.date).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <div className="min-h-screen" style={{ background: "#0A0A0A" }}>
      <Nav />
      <main id="main-content" className="px-6 sm:px-8 py-12 sm:py-20">
        <div className="max-w-2xl mx-auto">
          {/* Back */}
          <a
            href="/blog"
            className="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-widest mb-12 transition-colors hover:text-accent"
            style={{ color: "rgba(244,244,244,0.4)" }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6" />
            </svg>
            Blog
          </a>

          {/* Meta */}
          <div className="flex items-center gap-3 mb-6">
            <span
              className="font-mono text-[10px] uppercase tracking-widest rounded-full px-3 py-1"
              style={{
                background: "rgba(163,230,53,0.1)",
                color: "#A3E635",
                border: "1px solid rgba(163,230,53,0.2)",
              }}
            >
              {post.category}
            </span>
            <span className="font-mono text-[10px]" style={{ color: "rgba(244,244,244,0.3)" }}>
              {post.readTime} read · {formattedDate}
            </span>
          </div>

          {/* Title */}
          <h1
            className="font-display font-bold mb-10 leading-tight"
            style={{
              color: "#F4F4F4",
              fontSize: "clamp(2rem, 5vw, 3.2rem)",
              letterSpacing: "-0.02em",
            }}
          >
            {post.title}
          </h1>

          {/* Content */}
          <div className="flex flex-col gap-6">
            {paragraphs.map((para, i) => {
              // Handle bold headers (lines starting with **)
              if (para.startsWith("**") && para.endsWith("**")) {
                return (
                  <h2
                    key={i}
                    className="font-display font-bold text-xl mt-4"
                    style={{ color: "#F4F4F4", letterSpacing: "-0.01em" }}
                  >
                    {para.replace(/\*\*/g, "")}
                  </h2>
                );
              }
              // Handle inline bold
              const parts = para.split(/(\*\*[^*]+\*\*)/g);
              return (
                <p
                  key={i}
                  className="font-sans text-base sm:text-lg leading-relaxed"
                  style={{ color: "rgba(244,244,244,0.7)" }}
                >
                  {parts.map((part, j) => {
                    if (part.startsWith("**") && part.endsWith("**")) {
                      return (
                        <strong key={j} style={{ color: "#F4F4F4", fontWeight: 600 }}>
                          {part.replace(/\*\*/g, "")}
                        </strong>
                      );
                    }
                    return part;
                  })}
                </p>
              );
            })}
          </div>

          {/* CTA */}
          <div
            className="mt-16 rounded-2xl p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6"
            style={{
              background: "#111113",
              border: "1px solid rgba(244,244,244,0.07)",
            }}
          >
            <div>
              <p className="font-display font-bold text-xl mb-1" style={{ color: "#F4F4F4", letterSpacing: "-0.01em" }}>
                Track your current hyperfixation →
              </p>
              <p className="font-sans text-sm" style={{ color: "rgba(244,244,244,0.45)" }}>
                Log it, count the days, and build your graveyard.
              </p>
            </div>
            <a
              href="/auth/signup"
              className="shrink-0 px-6 py-3 rounded-full font-sans text-sm font-semibold transition-all hover:opacity-90 active:scale-[0.98]"
              style={{ background: "#A3E635", color: "#0A0A0A" }}
            >
              Join free
            </a>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
