import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { CategoryIcon, CATEGORY_COLOR } from "@/components/CategoryIcon";

type Props = {
  params: Promise<{ tag: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { tag } = await params;
  return {
    title: `#${tag} · Hyperfix`,
  };
}

function getDayCount(startedAt: string): number {
  const start = new Date(startedAt);
  const now = new Date();
  const diff = now.getTime() - start.getTime();
  return Math.max(1, Math.ceil(diff / (1000 * 60 * 60 * 24)));
}

const TEAL = "#5EEAD4";
const CARD_BG = "#0F1011";
const CARD_BORDER = "rgba(255,255,255,0.06)";

export default async function TagPage({ params }: Props) {
  const { tag } = await params;

  if (!tag) {
    notFound();
  }

  const supabase = await createClient();

  const { data: fixes } = await supabase
    .from("fixes")
    .select("id, title, category, status, intensity, started_at, ended_at, banner_url, profiles(username, display_name, avatar_url)")
    .eq("is_public", true)
    .is("ended_at", null)
    .contains("tags", [tag])
    .order("created_at", { ascending: false })
    .limit(48);

  const results = fixes ?? [];

  return (
    <div className="min-h-screen px-4 sm:px-6 lg:px-8 pt-8 pb-16" style={{ background: "#070708" }}>
      <div className="max-w-5xl mx-auto">
        {/* Nav */}
        <nav className="flex items-center justify-between mb-12">
          <Link
            href="/"
            className="font-display text-lg"
            style={{ color: "#F4F4F4", letterSpacing: "-0.02em", fontWeight: 500 }}
          >
            Hyperfix
          </Link>
          <Link
            href="/explore"
            className="font-mono text-[11px] uppercase tracking-[0.18em] transition-opacity hover:opacity-70"
            style={{ color: "rgba(244,244,244,0.5)" }}
          >
            Explore →
          </Link>
        </nav>

        {/* Clean header */}
        <header className="mb-10">
          <span
            className="font-mono text-[11px] uppercase tracking-[0.18em]"
            style={{ color: "rgba(255,255,255,0.5)" }}
          >
            Tag
          </span>
          <h1
            className="font-display mt-3 mb-3"
            style={{
              color: "#FFFFFF",
              fontSize: "clamp(32px, 5.5vw, 48px)",
              lineHeight: 1.05,
              letterSpacing: "-0.02em",
              fontWeight: 500,
            }}
          >
            #{tag}
          </h1>
          <p
            className="font-sans text-base"
            style={{ color: "rgba(255,255,255,0.55)" }}
          >
            {results.length} public hyperfixation{results.length !== 1 ? "s" : ""} tagged with this.
          </p>
        </header>

        {/* Grid or empty */}
        {results.length === 0 ? (
          <div
            className="rounded-2xl p-12 text-center"
            style={{ background: CARD_BG, border: `1px solid ${CARD_BORDER}` }}
          >
            <p
              className="font-display text-lg mb-2"
              style={{ color: "rgba(255,255,255,0.7)", letterSpacing: "-0.01em" }}
            >
              Nothing tagged with #{tag} yet.
            </p>
            <Link
              href="/dashboard/new"
              className="inline-block mt-4 font-mono text-[11px] uppercase tracking-[0.18em] transition-colors"
              style={{ color: TEAL }}
            >
              Be the first →
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {results.map((fix) => {
              const days = getDayCount(fix.started_at);
              const catColor = CATEGORY_COLOR[fix.category.toLowerCase()] || TEAL;
              const banner = (fix as { banner_url?: string | null }).banner_url;
              return (
                <Link
                  key={fix.id}
                  href={`/fix/${fix.id}`}
                  className="group block rounded-2xl overflow-hidden transition-all duration-200 hover:-translate-y-1"
                  style={{
                    background: CARD_BG,
                    border: `1px solid ${CARD_BORDER}`,
                  }}
                >
                  {/* Cover */}
                  <div
                    className="relative w-full aspect-square"
                    style={{
                      backgroundImage: banner ? `url(${banner})` : undefined,
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                      background: banner
                        ? undefined
                        : `linear-gradient(135deg, ${catColor}40 0%, ${catColor}10 60%, #0F1011 100%)`,
                    }}
                  >
                    <div
                      aria-hidden
                      className="absolute inset-0 pointer-events-none"
                      style={{
                        background:
                          "linear-gradient(180deg, transparent 0%, transparent 50%, rgba(15,16,17,0.92) 100%)",
                      }}
                    />
                    {/* Day count */}
                    <div
                      className="absolute top-3 left-3 inline-flex items-baseline gap-0.5 rounded-md px-2 py-1"
                      style={{
                        background: "rgba(15,16,17,0.7)",
                        border: "1px solid rgba(244,244,244,0.08)",
                        backdropFilter: "blur(8px)",
                      }}
                    >
                      <span
                        className="font-display tabular-nums"
                        style={{
                          fontSize: 18,
                          fontWeight: 700,
                          color: "#F4F4F4",
                          lineHeight: 1,
                          letterSpacing: "-0.02em",
                        }}
                      >
                        {days}
                      </span>
                      <span
                        className="font-mono text-[9px] uppercase tracking-widest"
                        style={{ color: "rgba(244,244,244,0.55)" }}
                      >
                        d
                      </span>
                    </div>
                    {/* Category chip */}
                    <div className="absolute bottom-3 left-3 right-3">
                      <span
                        className="inline-flex items-center gap-1 font-mono text-[9px] uppercase tracking-widest rounded-full px-2 py-0.5"
                        style={{
                          background: `${catColor}22`,
                          border: `1px solid ${catColor}44`,
                          color: catColor,
                          backdropFilter: "blur(8px)",
                        }}
                      >
                        <CategoryIcon category={fix.category} size={9} />
                        {fix.category}
                      </span>
                    </div>
                  </div>
                  {/* Title */}
                  <div className="p-4">
                    <h2
                      className="font-display group-hover:text-[#5EEAD4] transition-colors"
                      style={{
                        fontSize: 14,
                        fontWeight: 500,
                        color: "#F4F4F4",
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                        letterSpacing: "-0.01em",
                        lineHeight: 1.3,
                      }}
                    >
                      {fix.title}
                    </h2>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
