import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

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

export default async function TagPage({ params }: Props) {
  const { tag } = await params;

  if (!tag) {
    notFound();
  }

  const supabase = await createClient();

  const { data: fixes } = await supabase
    .from("fixes")
    .select("id, title, category, status, intensity, started_at, ended_at, profiles(username, display_name, avatar_url)")
    .eq("is_public", true)
    .is("ended_at", null)
    .contains("tags", [tag])
    .order("created_at", { ascending: false })
    .limit(48);

  const results = fixes ?? [];

  return (
    <div className="min-h-screen px-4 sm:px-6 lg:px-8 pt-8 pb-16" style={{ background: "#0A0A0A" }}>
      <div className="max-w-2xl mx-auto">

        {/* Nav */}
        <nav className="flex items-center justify-between mb-12">
          <Link
            href="/"
            className="font-display font-bold text-lg"
            style={{ color: "#F4F4F4", letterSpacing: "-0.03em" }}
          >
            Hyperfix
          </Link>
          <Link
            href="/explore"
            className="font-mono text-[11px] uppercase tracking-widest transition-opacity hover:opacity-70"
            style={{ color: "rgba(244,244,244,0.5)" }}
          >
            Explore →
          </Link>
        </nav>

        {/* Header */}
        <div className="mb-10">
          <h1
            className="font-display font-black leading-tight mb-2"
            style={{
              color: "#5EEAD4",
              fontSize: "clamp(40px, 8vw, 72px)",
              letterSpacing: "-0.04em",
            }}
          >
            #{tag}
          </h1>
          <p className="font-mono text-[12px] uppercase tracking-widest" style={{ color: "rgba(244,244,244,0.4)" }}>
            {results.length} fix{results.length !== 1 ? "es" : ""} tagged #{tag}
          </p>
        </div>

        {/* Fix cards */}
        {results.length === 0 ? (
          <div
            className="rounded-2xl p-8 text-center"
            style={{ background: "#111113", border: "1px solid rgba(244,244,244,0.07)" }}
          >
            <p className="font-mono text-[12px] uppercase tracking-widest" style={{ color: "rgba(244,244,244,0.25)" }}>
              Nothing tagged #{tag} yet.
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {results.map((fix) => {
              const profile = Array.isArray(fix.profiles) ? fix.profiles[0] : fix.profiles;
              const days = getDayCount(fix.started_at);
              return (
                <Link
                  key={fix.id}
                  href={`/fix/${fix.id}`}
                  className="block rounded-2xl p-5 transition-all hover:scale-[1.01]"
                  style={{
                    background: "#111113",
                    border: "1px solid rgba(244,244,244,0.07)",
                  }}
                >
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <h2
                      className="font-display font-bold text-lg leading-tight"
                      style={{ color: "#F4F4F4", letterSpacing: "-0.02em" }}
                    >
                      {fix.title}
                    </h2>
                    <span
                      className="font-mono text-[10px] uppercase tracking-widest px-2.5 py-1 rounded-full shrink-0"
                      style={{
                        background: "rgba(244,244,244,0.06)",
                        border: "1px solid rgba(244,244,244,0.1)",
                        color: "rgba(244,244,244,0.45)",
                      }}
                    >
                      {fix.category}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span
                      className="font-mono text-[11px]"
                      style={{ color: "rgba(244,244,244,0.35)" }}
                    >
                      Day {days}
                    </span>
                    {profile && (
                      <>
                        <span style={{ color: "rgba(244,244,244,0.2)" }}>·</span>
                        <span
                          className="font-mono text-[11px]"
                          style={{ color: "rgba(244,244,244,0.35)" }}
                        >
                          {profile.display_name ?? profile.username}
                        </span>
                      </>
                    )}
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
