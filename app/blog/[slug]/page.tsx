import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import { getPostBySlug, posts } from "@/lib/blog";

type Props = {
  params: Promise<{ slug: string }>;
};

const TEAL = "#5EEAD4";
const CARD_BG = "#0F1011";
const CARD_BORDER = "rgba(255,255,255,0.06)";
const NOISE_URL =
  "url(\"data:image/svg+xml;utf8,<svg viewBox='0 0 240 240' xmlns='http://www.w3.org/2000/svg'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 0.55 0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>\")";

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
        className="min-h-screen px-4 sm:px-6 lg:px-8 pt-8 pb-16 relative"
        style={{ background: "#070708" }}
      >
        <div
          aria-hidden
          className="absolute inset-0 pointer-events-none mix-blend-overlay"
          style={{ backgroundImage: NOISE_URL, backgroundSize: "240px 240px", opacity: 0.08 }}
        />

        <main id="main-content" className="relative max-w-3xl mx-auto">
          {/* Back link */}
          <a
            href="/blog"
            className="inline-flex items-center gap-2 font-sans text-sm mb-6 transition-colors anim-fadeUp"
            style={{ color: "rgba(255,255,255,0.5)" }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6" />
            </svg>
            Blog
          </a>

          {/* Hero card */}
          <div
            className="relative overflow-hidden rounded-3xl p-6 sm:p-10 mb-8 anim-fadeUp"
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
              <div className="flex items-center gap-3 mb-5 flex-wrap">
                <span
                  className="inline-flex items-center font-sans text-xs rounded-full px-3 py-1"
                  style={{
                    background: "rgba(94,234,212,0.10)",
                    color: TEAL,
                    border: "1px solid rgba(94,234,212,0.22)",
                  }}
                >
                  {post.category}
                </span>
                <span className="font-sans text-xs" style={{ color: "rgba(255,255,255,0.55)" }}>
                  {post.readTime} read · {formattedDate}
                </span>
              </div>
              <h1
                className="font-display anim-fadeUp delay-100"
                style={{
                  color: "#FFFFFF",
                  fontSize: "clamp(32px, 5.5vw, 52px)",
                  lineHeight: 1.05,
                  letterSpacing: "-0.02em",
                  fontWeight: 600,
                }}
              >
                {post.title}
              </h1>
            </div>
          </div>

          {/* Content card */}
          <article
            className="motion-card relative overflow-hidden rounded-3xl p-6 sm:p-10 mb-8 anim-fadeUp delay-100"
            style={{ background: CARD_BG, border: `1px solid ${CARD_BORDER}` }}
          >
            <div
              aria-hidden
              className="absolute inset-0 pointer-events-none mix-blend-overlay"
              style={{ backgroundImage: NOISE_URL, backgroundSize: "240px 240px", opacity: 0.18 }}
            />
            <div className="relative flex flex-col gap-6">
              {paragraphs.map((para, i) => {
                if (para.startsWith("**") && para.endsWith("**")) {
                  return (
                    <h2
                      key={i}
                      className="font-display mt-4"
                      style={{
                        color: "#FFFFFF",
                        fontSize: 22,
                        fontWeight: 600,
                        letterSpacing: "-0.01em",
                        lineHeight: 1.2,
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
                    className="font-sans text-base sm:text-lg leading-relaxed"
                    style={{ color: "rgba(255,255,255,0.72)" }}
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

          {/* CTA card */}
          <div
            className="motion-card relative overflow-hidden rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 anim-fadeUp delay-200"
            style={{ background: CARD_BG, border: `1px solid ${CARD_BORDER}` }}
          >
            <div
              aria-hidden
              className="absolute inset-0 pointer-events-none mix-blend-overlay"
              style={{ backgroundImage: NOISE_URL, backgroundSize: "240px 240px", opacity: 0.22 }}
            />
            <div className="relative">
              <p
                className="font-display mb-1"
                style={{
                  color: "#FFFFFF",
                  fontSize: 20,
                  fontWeight: 600,
                  letterSpacing: "-0.01em",
                }}
              >
                Track your current hyperfixation →
              </p>
              <p className="font-sans text-sm" style={{ color: "rgba(255,255,255,0.6)" }}>
                Log it, count the days, and build your graveyard.
              </p>
            </div>
            <a
              href="/auth/signup"
              className="relative shrink-0 inline-flex items-center gap-2 font-sans text-sm font-semibold px-6 py-3.5 transition-all duration-200 hover:opacity-95 hover:-translate-y-px active:scale-[0.98]"
              style={{
                background: "#FFFFFF",
                color: "#0A0A0A",
                borderRadius: 999,
                boxShadow:
                  "0 1px 0 0 rgba(255,255,255,0.5) inset, 0 12px 36px rgba(0,0,0,0.4), 0 0 40px rgba(94,234,212,0.25)",
              }}
            >
              Join free
            </a>
          </div>
        </main>
      </div>
      <Footer />
    </>
  );
}
