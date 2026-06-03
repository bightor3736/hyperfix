import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { LogoLockup } from "@/components/Logo";
import { CategoryIcon, CATEGORY_COLOR } from "@/components/CategoryIcon";
import { FixReactions } from "@/components/FixReactions";
import { FixComments } from "@/components/FixComments";
import { hexToRgba } from "@/lib/accent";

const NOISE_URL =
  "url(\"data:image/svg+xml;utf8,<svg viewBox='0 0 240 240' xmlns='http://www.w3.org/2000/svg'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 0.55 0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>\")";

interface FixRow {
  id: string;
  user_id: string;
  title: string;
  category: string;
  status: string;
  intensity: number;
  note: string | null;
  eulogy: string | null;
  cover_url: string | null;
  is_public: boolean;
  started_at: string;
  ended_at: string | null;
  profiles: { username: string | null; display_name: string | null; avatar_url: string | null } | null;
}

function dayCount(startedAt: string, endedAt: string | null): number {
  const start = new Date(startedAt);
  const end = endedAt ? new Date(endedAt) : new Date();
  return Math.max(1, Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)));
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const supabase = await createClient();
  const { data } = await supabase.from("fixes").select("title, category, is_public").eq("id", id).maybeSingle();
  if (!data || !data.is_public) return { title: "Fixation · Hyperfix" };
  return {
    title: `${data.title} · Hyperfix`,
    description: `A ${data.category} hyperfixation tracked on Hyperfix.`,
    openGraph: { images: [{ url: `https://hyperfix.app/api/share/${id}`, width: 1200, height: 630 }] },
    twitter: { card: "summary_large_image", images: [`https://hyperfix.app/api/share/${id}`] },
  };
}

export default async function PublicFixPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: fix } = await supabase
    .from("fixes")
    .select("id, user_id, title, category, status, intensity, note, eulogy, cover_url, is_public, started_at, ended_at, profiles(username, display_name, avatar_url)")
    .eq("id", id)
    .maybeSingle();

  if (!fix) notFound();
  const f = fix as unknown as FixRow;

  const { data: { user } } = await supabase.auth.getUser();
  const isOwner = user?.id === f.user_id;
  // Private fixes are owner-only.
  if (!f.is_public && !isOwner) notFound();

  // Reactions — count by type, and flag the viewer's own.
  const { data: reactionRows } = await supabase
    .from("fix_reactions")
    .select("emoji, user_id")
    .eq("fix_id", id);
  const counts: Record<string, number> = {};
  const userReactions: string[] = [];
  for (const r of reactionRows ?? []) {
    counts[r.emoji] = (counts[r.emoji] ?? 0) + 1;
    if (user && r.user_id === user.id) userReactions.push(r.emoji);
  }

  // Comments — oldest first.
  const { data: comments } = await supabase
    .from("fix_comments")
    .select("id, user_id, content, created_at, profiles(username, display_name, avatar_url)")
    .eq("fix_id", id)
    .order("created_at", { ascending: true });

  const ended = f.ended_at !== null;
  const days = dayCount(f.started_at, f.ended_at);
  const catColor = CATEGORY_COLOR[f.category.toLowerCase()] || "var(--accent)";
  const ownerName = f.profiles?.display_name || f.profiles?.username || "someone";

  return (
    <div className="min-h-screen relative" style={{ background: "var(--bg)", color: "var(--ink)" }}>
      <div aria-hidden className="absolute inset-0 pointer-events-none mix-blend-overlay" style={{ backgroundImage: NOISE_URL, backgroundSize: "240px 240px", opacity: 0.08 }} />

      <nav className="sticky top-0 z-40 px-5 sm:px-8 py-4 flex items-center justify-between" style={{ background: "rgba(7,7,8,0.78)", backdropFilter: "blur(20px)", borderBottom: "1px solid var(--line)" }}>
        <Link href="/" aria-label="Hyperfix home" className="transition-transform hover:scale-[1.02]"><LogoLockup size="sm" /></Link>
        <Link href={user ? "/dashboard" : "/auth/login"} className="font-mono text-[11px] uppercase tracking-widest px-4 py-2 rounded-full transition-all hover:opacity-80" style={{ background: "var(--line)", border: "1px solid var(--line)", color: "var(--ink-muted)" }}>
          {user ? "my fixes" : "log in"}
        </Link>
      </nav>

      <main className="relative max-w-2xl mx-auto px-5 sm:px-8 pt-10 sm:pt-14 pb-24">
        {/* Cover */}
        {f.cover_url && (
          <div className="relative overflow-hidden rounded-2xl mb-7 anim-fadeUp" style={{ height: "clamp(140px, 24vw, 220px)", backgroundImage: `url(${f.cover_url})`, backgroundSize: "cover", backgroundPosition: "center" }}>
            <div aria-hidden className="absolute inset-0" style={{ background: "linear-gradient(180deg, transparent 40%, rgba(7,7,8,0.7) 100%)" }} />
          </div>
        )}

        {/* Header */}
        <header className="anim-fadeUp mb-8">
          <div className="flex items-center gap-2 mb-3">
            <span className="shrink-0 inline-flex" style={{ color: catColor }}><CategoryIcon category={f.category} size={18} /></span>
            <span className="font-mono text-[11px] uppercase tracking-widest" style={{ color: "var(--ink-muted)" }}>{f.category}</span>
            {ended && <span className="font-mono text-[10px] uppercase tracking-widest rounded px-1.5 py-0.5" style={{ background: "var(--line)", color: "var(--ink-faint)" }}>ended</span>}
          </div>
          <h1 className="font-display" style={{ fontSize: "clamp(30px, 5.5vw, 46px)", fontWeight: 600, letterSpacing: "-0.03em", lineHeight: 1.05, color: "var(--ink)" }}>{f.title}</h1>

          {/* Owner + day count */}
          <div className="flex items-center justify-between gap-4 mt-5">
            <Link href={`/u/${f.profiles?.username ?? ""}`} className="flex items-center gap-2.5 group min-w-0">
              {f.profiles?.avatar_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={f.profiles.avatar_url} alt={ownerName} className="w-8 h-8 rounded-full object-cover shrink-0" style={{ border: "1px solid var(--line)" }} />
              ) : (
                <div className="w-8 h-8 rounded-full flex items-center justify-center text-[12px] font-bold shrink-0" style={{ background: hexToRgba("#5EEAD4", 0.14), color: "var(--accent)" }}>{ownerName.slice(0, 1).toUpperCase()}</div>
              )}
              <span className="font-sans text-[14px] truncate group-hover:text-[var(--accent)] transition-colors" style={{ color: "var(--ink-muted)" }}>{ownerName}</span>
            </Link>
            <div className="text-right shrink-0">
              <p className="font-display tabular-nums" style={{ fontSize: 30, fontWeight: 600, color: catColor, lineHeight: 1, letterSpacing: "-0.03em" }}>{days}</p>
              <p className="font-mono text-[9px] uppercase tracking-widest mt-1" style={{ color: "var(--ink-faint)" }}>days {ended ? "lasted" : "in"}</p>
            </div>
          </div>

          {/* Intensity */}
          <div className="flex items-center gap-2 mt-5">
            <div className="flex gap-0.5">
              {Array.from({ length: 10 }).map((_, i) => (
                <div key={i} className="w-2 h-3.5 rounded-sm" style={{ background: i < f.intensity ? catColor : "var(--line)" }} />
              ))}
            </div>
            <span className="font-mono text-[11px]" style={{ color: "var(--ink-muted)" }}>intensity {f.intensity}/10</span>
          </div>
        </header>

        {/* Note / eulogy */}
        {(f.note || (ended && f.eulogy)) && (
          <section className="mb-9 anim-fadeUp">
            {ended && f.eulogy ? (
              <blockquote className="font-display italic" style={{ fontSize: 18, lineHeight: 1.6, color: "var(--ink-muted)", borderLeft: `2px solid ${catColor}`, paddingLeft: 16 }}>
                {f.eulogy}
              </blockquote>
            ) : (
              <p className="font-sans" style={{ fontSize: 15, lineHeight: 1.7, color: "var(--ink-muted)" }}>{f.note}</p>
            )}
          </section>
        )}

        {/* Reactions */}
        <section className="mb-10 anim-fadeUp">
          <p className="font-mono text-[10px] uppercase tracking-widest mb-3" style={{ color: "var(--ink-muted)" }}>reactions</p>
          <FixReactions fixId={f.id} initialReactions={counts} userReactions={userReactions} />
        </section>

        {/* Comments */}
        <section className="anim-fadeUp">
          <p className="font-mono text-[10px] uppercase tracking-widest mb-4" style={{ color: "var(--ink-muted)" }}>comments</p>
          <FixComments fixId={f.id} initialComments={(comments ?? []) as never} currentUserId={user?.id ?? null} />
        </section>
      </main>

      {!user && (
        <div className="fixed bottom-0 inset-x-0 z-50 px-4" style={{ paddingBottom: "max(16px, env(safe-area-inset-bottom))" }}>
          <div className="max-w-lg mx-auto flex items-center justify-between gap-4 rounded-2xl px-5 py-4" style={{ background: "rgba(10,10,10,0.92)", backdropFilter: "blur(20px)", border: "1px solid var(--accent)", boxShadow: "0 8px 40px rgba(0,0,0,0.6)" }}>
            <div className="min-w-0">
              <p className="font-sans text-sm font-semibold truncate" style={{ color: "var(--ink)" }}>Track your own hyperfixations</p>
              <p className="font-mono text-[11px]" style={{ color: "var(--ink-muted)" }}>free · 30 seconds</p>
            </div>
            <Link href={`/auth/signup?next=/fix/${f.id}`} className="shrink-0 px-5 py-2.5 rounded-full font-sans text-sm font-semibold transition-all hover:opacity-90 active:scale-[0.98]" style={{ background: "var(--accent)", color: "var(--bg)" }}>Join free →</Link>
          </div>
        </div>
      )}
    </div>
  );
}
