import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import { getPostBySlug, posts } from "@/lib/blog";
import { ArrowLeft } from "@/components/icons";

type Props = {
  params: Promise<{ slug: string }>;
};

const TEAL = "#5EEAD4";
const CARD_BG = "#0F1011";
const CARD_BORDER = "rgba(255,255,255,0.06)";

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
    <>
      <Nav />
      <div
        className="min-h-screen px-4 sm:px-6 lg:px-8 pt-8 pb-16"
        style={{ background: "#070708" }}
      >
        <main id="main-content" className="relative max-w-3xl mx-auto">
          {/* Back link */}
          <a
            href="/blog"
            className="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.18em] mb-10 transition-colors anim-fadeUp"
            style={{ color: "rgba(255,255,255,0.5)" }}
          >
            <ArrowLeft set="light" size={14} primaryColor="currentColor" />
            Blog
          </a>

          {/* Clean article header */}
          <header className="mb-12 anim-fadeUp">
            <div className="flex items-center gap-2 mb-6 flex-wrap">
              <span
                className="inline-flex items-center font-mono text-[10px] uppercase tracking-[0.18em] rounded-full px-2.5 py-1"
                style={{
                  background: "rgba(94,234,212,0.08)",
                  color: TEAL,
                  border: "1px solid rgba(94,234,212,0.18)",
                }}
              >
                {post.category}
              </span>
              <span
                className="font-mono text-[11px] tabular-nums"
                style={{ color: "rgba(255,255,255,0.45)" }}
              >
                {formattedDate} · {post.readTime} read
              </span>
            </div>
            <h1
              className="font-display anim-fadeUp delay-100"
              style={{
                color: "#FFFFFF",
                fontSize: "clamp(32px, 5.5vw, 48px)",
                lineHeight: 1.05,
                letterSpacing: "-0.02em",
                fontWeight: 500,
              }}
            >
              {post.title}
            </h1>
            {post.excerpt && (
              <p
                className="mt-5 font-sans text-base sm:text-lg max-w-2xl anim-fadeUp delay-200"
                style={{ color: "rgba(255,255,255,0.6)", lineHeight: 1.6 }}
              >
                {post.excerpt}
              </p>
            )}
          </header>

          {/* Prose body */}
          <article className="anim-fadeUp delay-100">
            <div className="flex flex-col gap-6">
              {paragraphs.map((para, i) => {
                if (para.startsWith("**") && para.endsWith("**")) {
                  return (
                    <h2
                      key={i}
                      className="font-display mt-6"
                      style={{
                        color: "#FFFFFF",
                        fontSize: 24,
                        fontWeight: 500,
                        letterSpacing: "-0.01em",
                        lineHeight: 1.25,
                      }}
                    >
                      {para.replace(/\*\*/g, "")}
                    </h2>
                  );
                }
                const parts = para.split(/(\*\*[^*]+\*\*)/g);
                return (
                  <p
                    key={i}
                    className="font-sans text-base sm:text-[17px]"
                    style={{ color: "rgba(255,255,255,0.72)", lineHeight: 1.75 }}
                  >
                    {parts.map((part, j) => {
                      if (part.startsWith("**") && part.endsWith("**")) {
                        return (
                          <strong key={j} style={{ color: "#FFFFFF", fontWeight: 600 }}>
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
          </article>

          {/* Clean CTA */}
          <div
            className="mt-16 rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 anim-fadeUp delay-200"
            style={{ background: CARD_BG, border: `1px solid ${CARD_BORDER}` }}
          >
            <div>
              <p
                className="font-display mb-1"
                style={{
                  color: "#FFFFFF",
                  fontSize: 20,
                  fontWeight: 500,
                  letterSpacing: "-0.01em",
                }}
              >
                Track your current hyperfixation.
              </p>
              <p className="font-sans text-sm" style={{ color: "rgba(255,255,255,0.55)" }}>
                Log it, count the days, build your graveyard.
              </p>
            </div>
            <a
              href="/auth/signup"
              className="shrink-0 inline-flex items-center gap-2 font-sans text-sm font-medium px-5 py-2.5 transition-all duration-200 hover:-translate-y-px active:scale-[0.98]"
              style={{
                background: TEAL,
                color: "#0A0A0A",
                borderRadius: 999,
              }}
            >
              Join free →
            </a>
          </div>
        </main>
      </div>
      <Footer />
    </>
  );
}
