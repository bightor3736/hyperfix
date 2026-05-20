import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { redirect } from "next/navigation";
import { LogoDark } from "@/components/Logo";
import { FixReactions } from "@/components/FixReactions";
import { ShareButton } from "@/components/ShareButton";
import { FixComments } from "@/components/FixComments";
import type { Metadata } from "next";

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
    .select("id, title, category, status, intensity, note, eulogy, started_at, ended_at, is_public, user_id")
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

  return (
    <div className="min-h-screen" style={{ background: "#080808", color: "#F4F4F4" }}>
      {/* Nav */}
      <nav className="border-b" style={{ borderColor: "rgba(244,244,244,0.07)" }}>
        <div className="max-w-3xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" aria-label="Hyperfix home">
            <LogoDark size="sm" />
          </Link>
          <ShareButton fixId={id} isPublic={typedFix.is_public} />
        </div>
      </nav>

      <main id="main-content" className="max-w-3xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        {/* Category + status row */}
        <div className="flex items-center gap-3 mb-6 flex-wrap">
          <span
            className="text-[10px] font-mono uppercase tracking-widest rounded-full px-3 py-1.5"
            style={{
              background: "rgba(94,234,212,0.1)",
              border: "1px solid rgba(94,234,212,0.25)",
              color: "#5EEAD4",
            }}
          >
            {typedFix.category}
          </span>
          <span
            className="text-[10px] font-mono uppercase tracking-widest rounded-full px-3 py-1.5"
            style={{
              background: "rgba(244,244,244,0.06)",
              border: "1px solid rgba(244,244,244,0.12)",
              color: "rgba(244,244,244,0.6)",
            }}
          >
            {typedFix.status}
          </span>
        </div>

        {/* Title */}
        <h1
          className="font-display font-medium leading-tight mb-4"
          style={{ fontSize: "clamp(26px, 6vw, 40px)" }}
        >
          {typedFix.title}
        </h1>

        {/* Days + intensity */}
        <div className="flex flex-wrap items-center gap-6 mb-8">
          <div>
            <span className="font-display font-medium" style={{ color: "#5EEAD4", fontSize: "clamp(36px, 10vw, 56px)" }}>
              {days}
            </span>
            <span className="text-lg font-mono ml-2" style={{ color: "#9A9A9A" }}>
              {days === 1 ? "day" : "days"}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-mono uppercase tracking-widest mb-2" style={{ color: "#9A9A9A" }}>
              intensity
            </p>
            <IntensityBar intensity={typedFix.intensity} />
          </div>
        </div>

        {/* Reactions */}
        <div className="mb-8">
          <FixReactions
            fixId={id}
            initialReactions={reactionCounts}
            userReactions={userReactions}
          />
        </div>

        {/* Community stats */}
        {((titleCount ?? 0) > 0 || (categoryCount ?? 0) > 0) && (
          <div className="mb-8 flex flex-col gap-3">
            {(titleCount ?? 0) > 0 && (
              <div
                className="rounded-xl px-5 py-4 flex items-center gap-3"
                style={{
                  background: "rgba(94,234,212,0.08)",
                  border: "1px solid rgba(94,234,212,0.25)",
                }}
              >
                <span style={{ fontSize: 22 }}>🔥</span>
                <p
                  className="font-display font-medium"
                  style={{ color: "#5EEAD4", fontSize: 17, lineHeight: 1.3 }}
                >
                  {titleCount} other {titleCount === 1 ? "person is" : "people are"} also unwell about this
                </p>
              </div>
            )}
            {(categoryCount ?? 0) > 0 && (
              <p
                className="font-mono text-xs"
                style={{ color: "rgba(244,244,244,0.35)", paddingLeft: 2 }}
              >
                {categoryCount} {categoryCount === 1 ? "person is" : "people are"} currently tracking {typedFix.category}
              </p>
            )}
          </div>
        )}

        {/* Note */}
        {typedFix.note && (
          <div
            className="rounded-xl p-6 mb-6"
            style={{ background: "#111113", border: "1px solid rgba(244,244,244,0.07)" }}
          >
            <p className="text-xs font-mono uppercase tracking-widest mb-3" style={{ color: "#9A9A9A" }}>
              note
            </p>
            <p className="text-sm leading-relaxed" style={{ color: "rgba(244,244,244,0.8)" }}>
              {typedFix.note}
            </p>
          </div>
        )}

        {/* Eulogy — only if ended */}
        {typedFix.eulogy && typedFix.ended_at && (
          <div
            className="rounded-xl p-6 mb-6"
            style={{
              background: "#111113",
              border: "1px solid rgba(94,234,212,0.15)",
            }}
          >
            <p
              className="text-xs font-mono uppercase tracking-widest mb-3"
              style={{ color: "#5EEAD4" }}
            >
              eulogy
            </p>
            <p
              className="text-sm leading-relaxed font-display italic"
              style={{ color: "rgba(244,244,244,0.8)" }}
            >
              {typedFix.eulogy}
            </p>
          </div>
        )}

        {/* Comments */}
        <div className="mb-8">
          <h2
            className="font-mono text-xs uppercase tracking-widest mb-4"
            style={{ color: "#9A9A9A" }}
          >
            Comments
          </h2>
          <FixComments
            fixId={id}
            initialComments={comments}
            currentUserId={user?.id ?? null}
          />
        </div>

        {/* CTA */}
        {typedProfile.username && (
          <div
            className="rounded-xl p-6 flex items-center justify-between gap-4"
            style={{ background: "#111113", border: "1px solid rgba(244,244,244,0.07)" }}
          >
            <div>
              <p className="text-sm font-medium mb-0.5">
                Follow{" "}
                <span style={{ color: "#5EEAD4" }}>@{typedProfile.username}</span> on Hyperfix
              </p>
              <p className="text-xs" style={{ color: "#9A9A9A" }}>
                Track your own hyperfixations
              </p>
            </div>
            <Link
              href={`/u/${typedProfile.username}`}
              className="shrink-0 px-4 py-2 rounded-lg text-sm font-mono font-medium transition-opacity hover:opacity-90"
              style={{ background: "#5EEAD4", color: "#080808" }}
            >
              View profile →
            </Link>
          </div>
        )}
      </main>
    </div>
  );
}
