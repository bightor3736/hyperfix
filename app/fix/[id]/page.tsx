import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { redirect } from "next/navigation";
import { LogoLockup } from "@/components/Logo";
import { FixReactions } from "@/components/FixReactions";
import { ShareButton } from "@/components/ShareButton";
import { FixComments } from "@/components/FixComments";
import type { Metadata } from "next";

const TEAL = "#5EEAD4";
const CARD_BG = "#0F1011";
const CARD_BORDER = "rgba(255,255,255,0.06)";
const NOISE_URL =
  "url(\"data:image/svg+xml;utf8,<svg viewBox='0 0 240 240' xmlns='http://www.w3.org/2000/svg'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 0.55 0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>\")";

interface Fix {
  id: string;
  title: string;
  category: string;
  status: string;
  intensity: number;
  note: string | null;
  eulogy: string | null;
  started_at: string;
  ended_at: string | null;
  is_public: boolean;
  user_id: string;
  tags: string[] | null;
}

type StudioBlockRow = {
  id: string;
  type: "note" | "link" | "image";
  content: { text?: string; url?: string; title?: string; caption?: string };
  sort_order: number;
};

function StudioBlockReadonly({ block }: { block: StudioBlockRow }) {
  const c = block.content;
  return (
    <div
      className="relative overflow-hidden rounded-2xl p-5"
      style={{ background: CARD_BG, border: `1px solid ${CARD_BORDER}` }}
    >
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none mix-blend-overlay"
        style={{ backgroundImage: NOISE_URL, backgroundSize: "240px 240px", opacity: 0.18 }}
      />
      <div className="relative">
        {block.type === "note" && (
          <p
            className="font-sans text-sm leading-relaxed"
            style={{ color: "rgba(244,244,244,0.85)", whiteSpace: "pre-wrap", wordBreak: "break-word" }}
          >
            {c.text}
          </p>
        )}
        {block.type === "link" && c.url && (
          <a
            href={c.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 transition-colors hover:text-[#5EEAD4]"
            style={{ color: "#F4F4F4" }}
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
              <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
            </svg>
            <span className="font-sans text-sm min-w-0">
              <span className="block font-medium truncate">{c.title || c.url}</span>
              {c.title && (
                <span className="block font-mono text-[11px] truncate" style={{ color: "rgba(244,244,244,0.35)" }}>
                  {c.url}
                </span>
              )}
            </span>
          </a>
        )}
        {block.type === "image" && c.url && (
          <div>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={c.url}
              alt={c.caption || "studio image"}
              className="rounded-xl w-full object-cover"
              style={{ maxHeight: 420, border: "1px solid rgba(244,244,244,0.08)" }}
            />
            {c.caption && (
              <p className="font-sans text-xs mt-2" style={{ color: "rgba(244,244,244,0.4)" }}>
                {c.caption}
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

interface Profile {
  username: string | null;
  display_name: string | null;
}

interface CommentProfile {
  username: string | null;
  display_name: string | null;
  avatar_url: string | null;
}

interface Comment {
  id: string;
  user_id: string;
  content: string;
  created_at: string;
  profiles: CommentProfile | null;
}

function dayCount(startedAt: string, endedAt: string | null): number {
  const start = new Date(startedAt);
  const end = endedAt ? new Date(endedAt) : new Date();
  return Math.max(1, Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)));
}

function IntensityBar({ intensity }: { intensity: number }) {
  return (
    <div className="flex items-center gap-2">
      <div className="flex gap-0.5">
        {Array.from({ length: 10 }).map((_, i) => (
          <div
            key={i}
            className="w-2 h-4 rounded-sm"
            style={{
              background: i < intensity ? "#5EEAD4" : "rgba(244,244,244,0.08)",
            }}
          />
        ))}
      </div>
      <span className="text-sm font-mono" style={{ color: "#9A9A9A" }}>
        {intensity}/10
      </span>
    </div>
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const SITE_URL = "https://hyperfix.app";
  const supabase = await createClient();

  const { data: fix } = await supabase
    .from("fixes")
    .select("title, category, status, started_at, ended_at, user_id")
    .eq("id", id)
    .eq("is_public", true)
    .single();

  if (!fix) {
    return { title: "Fix not found · Hyperfix" };
  }

  const typedFix = fix as { title: string; category: string; status: string; started_at: string; ended_at: string | null; user_id: string };

  const { data: profile } = await supabase
    .from("profiles")
    .select("username, display_name")
    .eq("id", typedFix.user_id)
    .single();

  const typedProfile = (profile ?? {}) as { username: string | null; display_name: string | null };
  const profileName = typedProfile.display_name ?? typedProfile.username ?? "someone";
  const days = dayCount(typedFix.started_at, typedFix.ended_at);

  const titleStr = `${typedFix.title} · ${profileName} · Hyperfix`;
  const description = `Day ${days} of ${typedFix.title} — tracked on Hyperfix`;
  const ogImage = `${SITE_URL}/api/card/${id}`;

  return {
    title: titleStr,
    description,
    openGraph: {
      title: titleStr,
      description,
      images: [{ url: ogImage, width: 1200, height: 630 }],
    },
    twitter: {
      card: "summary_large_image",
      title: titleStr,
      description,
      images: [ogImage],
    },
  };
}

export default async function PublicFixPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: fix, error } = await supabase
    .from("fixes")
    .select("id, title, category, status, intensity, note, eulogy, started_at, ended_at, is_public, user_id, tags")
    .eq("id", id)
    .single();

  if (error || !fix || !(fix as Fix).is_public) {
    redirect("/");
  }

  const typedFix = fix as Fix;
  const days = dayCount(typedFix.started_at, typedFix.ended_at);

  const { data: profile } = await supabase
    .from("profiles")
    .select("username, display_name")
    .eq("id", typedFix.user_id)
    .single();

  const typedProfile = (profile ?? {}) as Profile;

  // Fetch reaction counts
  const { data: reactions } = await supabase
    .from("fix_reactions")
    .select("emoji")
    .eq("fix_id", id);

  const reactionCounts: Record<string, number> = {};
  for (const r of reactions ?? []) {
    reactionCounts[r.emoji] = (reactionCounts[r.emoji] ?? 0) + 1;
  }

  // Fetch current user's reactions
  let userReactions: string[] = [];
  if (user) {
    const { data: myReactions } = await supabase
      .from("fix_reactions")
      .select("emoji")
      .eq("fix_id", id)
      .eq("user_id", user.id);
    userReactions = (myReactions ?? []).map((r) => r.emoji);
  }

  // Community counts
  const { count: categoryCount } = await supabase
    .from("fixes")
    .select("id", { count: "exact", head: true })
    .eq("category", typedFix.category)
    .eq("is_public", true)
    .is("ended_at", null)
    .neq("id", id);

  const { count: titleCount } = await supabase
    .from("fixes")
    .select("id", { count: "exact", head: true })
    .eq("title", typedFix.title)
    .eq("is_public", true)
    .is("ended_at", null)
    .neq("id", id);

  // Fetch comments
  const { data: rawComments } = await supabase
    .from("fix_comments")
    .select("id, user_id, content, created_at, profiles(username, display_name, avatar_url)")
    .eq("fix_id", id)
    .order("created_at", { ascending: true })
    .limit(100);

  const comments = ((rawComments ?? []) as unknown as Array<{
    id: string;
    user_id: string;
    content: string;
    created_at: string;
    profiles: Array<CommentProfile> | CommentProfile | null;
  }>).map((c) => ({
    id: c.id,
    user_id: c.user_id,
    content: c.content,
    created_at: c.created_at,
    profiles: Array.isArray(c.profiles) ? (c.profiles[0] ?? null) : c.profiles,
  })) as Comment[];

  // Studio blocks — RLS allows public read when the fix is public
  const { data: studioData } = await supabase
    .from("fix_studio_blocks")
    .select("id, type, content, sort_order")
    .eq("fix_id", id)
    .order("sort_order", { ascending: true });
  const studioBlocks = (studioData ?? []) as StudioBlockRow[];

  return (
    <div className="min-h-screen relative" style={{ background: "#070708", color: "#F4F4F4" }}>
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none mix-blend-overlay"
        style={{ backgroundImage: NOISE_URL, backgroundSize: "240px 240px", opacity: 0.08 }}
      />

      {/* Glass sticky nav */}
      <nav
        className="sticky top-0 z-40 px-6 sm:px-10 py-5 flex items-center justify-between"
        style={{
          background: "rgba(7,7,8,0.78)",
          backdropFilter: "blur(20px)",
          borderBottom: `1px solid ${CARD_BORDER}`,
        }}
      >
        <Link href="/" aria-label="Hyperfix home" className="transition-transform hover:scale-[1.02]">
          <LogoLockup size="sm" />
        </Link>
        <div className="flex items-center gap-4">
          {typedProfile.username && (
            <Link
              href={`/u/${typedProfile.username}`}
              className="font-sans text-sm transition-colors"
              style={{ color: "rgba(255,255,255,0.55)" }}
            >
              ← @{typedProfile.username}
            </Link>
          )}
          <ShareButton fixId={id} isPublic={typedFix.is_public} />
        </div>
      </nav>

      <main id="main-content" className="relative max-w-3xl mx-auto px-4 sm:px-6 pt-8 pb-16">
        {/* Bloom hero card */}
        <div
          className="relative overflow-hidden rounded-3xl mb-8 p-6 sm:p-10 anim-fadeUp"
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
            style={{ background: "linear-gradient(180deg, #070708 0%, rgba(7,7,8,0.45) 30%, transparent 100%)" }}
          />
          <div className="relative">
            {/* Category + status row */}
            <div className="flex items-center gap-2 mb-5 flex-wrap">
              <span
                className="inline-flex items-center font-sans text-xs rounded-full px-3 py-1"
                style={{
                  background: "rgba(94,234,212,0.12)",
                  color: TEAL,
                  border: "1px solid rgba(94,234,212,0.25)",
                }}
              >
                {typedFix.category}
              </span>
              <span
                className="inline-flex items-center font-sans text-xs rounded-full px-3 py-1"
                style={{
                  background: "rgba(244,244,244,0.07)",
                  border: "1px solid rgba(244,244,244,0.12)",
                  color: "rgba(244,244,244,0.6)",
                }}
              >
                {typedFix.status}
              </span>
            </div>

            {/* Title */}
            <h1
              className="font-display leading-tight mb-6"
              style={{
                color: "#FFFFFF",
                fontSize: "clamp(28px, 6vw, 44px)",
                fontWeight: 600,
                letterSpacing: "-0.02em",
                lineHeight: 1.08,
              }}
            >
              {typedFix.title}
            </h1>

            {/* Days + intensity */}
            <div className="flex flex-wrap items-end gap-8">
              <div>
                <span
                  className="font-display tabular-nums"
                  style={{ color: TEAL, fontSize: "clamp(52px, 12vw, 72px)", fontWeight: 600, letterSpacing: "-0.04em", lineHeight: 1 }}
                >
                  {days}
                </span>
                <span className="font-sans text-sm ml-2" style={{ color: "rgba(255,255,255,0.5)" }}>
                  {days === 1 ? "day" : "days"}
                </span>
              </div>
              <div className="flex-1 min-w-[160px] pb-1">
                <p className="font-sans text-[10px] uppercase tracking-widest mb-2" style={{ color: "rgba(255,255,255,0.4)" }}>
                  intensity
                </p>
                <IntensityBar intensity={typedFix.intensity} />
              </div>
            </div>
          </div>
        </div>

        {/* Reactions */}
        <div className="mb-8 anim-fadeUp" style={{ animationDelay: "80ms" }}>
          <FixReactions
            fixId={id}
            initialReactions={reactionCounts}
            userReactions={userReactions}
          />
        </div>

        {/* Community stats */}
        {((titleCount ?? 0) > 0 || (categoryCount ?? 0) > 0) && (
          <div className="mb-8 flex flex-col gap-3 anim-fadeUp" style={{ animationDelay: "120ms" }}>
            {(titleCount ?? 0) > 0 && (
              <div
                className="relative overflow-hidden rounded-2xl px-5 py-4 flex items-center gap-3"
                style={{
                  background: CARD_BG,
                  border: "1px solid rgba(94,234,212,0.18)",
                }}
              >
                <div
                  aria-hidden
                  className="absolute inset-0 pointer-events-none mix-blend-overlay"
                  style={{ backgroundImage: NOISE_URL, backgroundSize: "240px 240px", opacity: 0.18 }}
                />
                <span style={{ fontSize: 20 }}>🔥</span>
                <p
                  className="relative font-display"
                  style={{ color: TEAL, fontSize: 16, fontWeight: 600, lineHeight: 1.3 }}
                >
                  {titleCount} other {titleCount === 1 ? "person is" : "people are"} also unwell about this
                </p>
              </div>
            )}
            {(categoryCount ?? 0) > 0 && (
              <p className="font-sans text-xs" style={{ color: "rgba(255,255,255,0.35)", paddingLeft: 2 }}>
                {categoryCount} {categoryCount === 1 ? "person is" : "people are"} currently tracking {typedFix.category}
              </p>
            )}
          </div>
        )}

        {/* Note */}
        {typedFix.note && (
          <div
            className="relative overflow-hidden rounded-2xl p-6 mb-5 anim-fadeUp motion-card"
            style={{ background: CARD_BG, border: `1px solid ${CARD_BORDER}`, animationDelay: "140ms" }}
          >
            <div
              aria-hidden
              className="absolute inset-0 pointer-events-none mix-blend-overlay"
              style={{ backgroundImage: NOISE_URL, backgroundSize: "240px 240px", opacity: 0.18 }}
            />
            <p className="relative font-sans text-[10px] uppercase tracking-widest mb-3" style={{ color: "rgba(255,255,255,0.35)" }}>
              note
            </p>
            <p className="relative font-sans text-sm leading-relaxed" style={{ color: "rgba(244,244,244,0.8)" }}>
              {typedFix.note}
            </p>
          </div>
        )}

        {/* Eulogy */}
        {typedFix.eulogy && typedFix.ended_at && (
          <div
            className="relative overflow-hidden rounded-2xl p-6 mb-5 anim-fadeUp motion-card"
            style={{
              background: CARD_BG,
              border: "1px solid rgba(94,234,212,0.15)",
              animationDelay: "160ms",
            }}
          >
            <div
              aria-hidden
              className="absolute inset-0 pointer-events-none mix-blend-overlay"
              style={{ backgroundImage: NOISE_URL, backgroundSize: "240px 240px", opacity: 0.18 }}
            />
            <p className="relative font-sans text-[10px] uppercase tracking-widest mb-3" style={{ color: TEAL }}>
              eulogy
            </p>
            <p
              className="relative font-display italic"
              style={{ color: "rgba(244,244,244,0.8)", fontSize: 15, lineHeight: 1.55 }}
            >
              {typedFix.eulogy}
            </p>
          </div>
        )}

        {/* Tags */}
        {typedFix.tags && typedFix.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-5 anim-fadeUp" style={{ animationDelay: "175ms" }}>
            {typedFix.tags.map((tag) => (
              <span
                key={tag}
                className="font-mono text-[11px] uppercase tracking-widest rounded-full px-3 py-1"
                style={{
                  background: "rgba(94,234,212,0.08)",
                  border: "1px solid rgba(94,234,212,0.18)",
                  color: "#5EEAD4",
                }}
              >
                #{tag}
              </span>
            ))}
          </div>
        )}

        {/* Studio */}
        {studioBlocks.length > 0 && (
          <div className="mb-8 anim-fadeUp" style={{ animationDelay: "185ms" }}>
            <div className="flex items-center gap-2 mb-3">
              <p className="font-sans text-[10px] uppercase tracking-widest" style={{ color: TEAL }}>
                studio
              </p>
              <span className="h-px flex-1" style={{ background: "rgba(94,234,212,0.15)" }} />
            </div>
            <div className="flex flex-col gap-3">
              {studioBlocks.map((block) => (
                <StudioBlockReadonly key={block.id} block={block} />
              ))}
            </div>
          </div>
        )}

        {/* Comments */}
        <div
          className="relative overflow-hidden rounded-2xl p-6 mb-6 anim-fadeUp"
          style={{ background: CARD_BG, border: `1px solid ${CARD_BORDER}`, animationDelay: "180ms" }}
        >
          <div
            aria-hidden
            className="absolute inset-0 pointer-events-none mix-blend-overlay"
            style={{ backgroundImage: NOISE_URL, backgroundSize: "240px 240px", opacity: 0.18 }}
          />
          <h2
            className="relative font-sans text-[10px] uppercase tracking-widest mb-5"
            style={{ color: "rgba(255,255,255,0.4)" }}
          >
            Comments
          </h2>
          <div className="relative">
            <FixComments
              fixId={id}
              initialComments={comments}
              currentUserId={user?.id ?? null}
            />
          </div>
        </div>

        {/* CTA */}
        {typedProfile.username && (
          <div
            className="relative overflow-hidden rounded-2xl p-6 flex items-center justify-between gap-4 anim-fadeUp"
            style={{ background: CARD_BG, border: `1px solid ${CARD_BORDER}`, animationDelay: "200ms" }}
          >
            <div
              aria-hidden
              className="absolute inset-0 pointer-events-none mix-blend-overlay"
              style={{ backgroundImage: NOISE_URL, backgroundSize: "240px 240px", opacity: 0.18 }}
            />
            <div className="relative">
              <p className="font-sans text-sm font-medium mb-0.5" style={{ color: "#F4F4F4" }}>
                Follow{" "}
                <span style={{ color: TEAL }}>@{typedProfile.username}</span> on Hyperfix
              </p>
              <p className="font-sans text-xs" style={{ color: "rgba(255,255,255,0.4)" }}>
                Track your own hyperfixations
              </p>
            </div>
            <Link
              href={`/u/${typedProfile.username}`}
              className="relative shrink-0 px-5 py-2.5 rounded-full font-sans text-sm font-semibold transition-all hover:opacity-90 hover:-translate-y-px"
              style={{
                background: "#FFFFFF",
                color: "#070708",
                boxShadow: "0 0 0 1px rgba(255,255,255,0.15), 0 4px 16px rgba(94,234,212,0.25)",
              }}
            >
              View profile →
            </Link>
          </div>
        )}
      </main>
    </div>
  );
}
