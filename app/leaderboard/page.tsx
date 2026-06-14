import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { ArrowLeft, Crown, Medal } from "lucide-react";
import { LogoLockup } from "@/components/Logo";
import { levelForPoints } from "@/lib/gamification/levels";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Leaderboard · Hyperfix",
  description: "The most committed hyperfixators on Hyperfix. How unwell are you?",
};

type Row = {
  id: string;
  username: string | null;
  display_name: string | null;
  avatar_url: string | null;
  total_points: number;
};

export default async function LeaderboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data } = await supabase
    .from("profiles")
    .select("id, username, display_name, avatar_url, total_points")
    .eq("leaderboard_opt_out", false)
    .gt("total_points", 0)
    .order("total_points", { ascending: false })
    .limit(100);

  const rows: Row[] = (data ?? []) as Row[];
  const myRank = user ? rows.findIndex((r) => r.id === user.id) : -1;

  return (
    <div className="min-h-screen bg-bg">
      <div className="max-w-2xl mx-auto px-5 sm:px-8 pt-8 pb-20">
        {/* Top bar */}
        <div className="flex items-center justify-between mb-8">
          <Link href="/dashboard" className="inline-block">
            <LogoLockup size="sm" />
          </Link>
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-widest text-ink-muted hover:text-ink transition-colors"
          >
            <ArrowLeft size={12} strokeWidth={1.5} />
            Dashboard
          </Link>
        </div>

        {/* Header */}
        <header className="mb-8 anim-fadeUp">
          <p
            className="uppercase mb-2"
            style={{ fontSize: 11, fontWeight: 600, letterSpacing: "3px", color: "var(--ink-faint)" }}
          >
            global ranking
          </p>
          <h1
            className="font-display text-ink leading-none tracking-tight"
            style={{ fontSize: "clamp(34px,6vw,52px)" }}
          >
            The Unwell Index.
          </h1>
          <p className="mt-3 text-[15px] text-ink-muted">
            Ranked by total XP. Earned by showing up, logging, and refusing to
            let go.
          </p>
        </header>

        {/* Your rank callout */}
        {myRank >= 0 && (
          <div
            className="mb-6 p-4 flex items-center justify-between anim-fadeUp delay-100"
            style={{ background: "var(--bg-white)", border: "1px solid var(--line)", borderRadius: 16 }}
          >
            <span
              className="uppercase"
              style={{ fontSize: 11, fontWeight: 600, letterSpacing: "3px", color: "var(--ink-faint)" }}
            >
              your rank
            </span>
            <span className="font-display text-2xl text-ink tabular-nums">
              #{myRank + 1}
            </span>
          </div>
        )}

        {/* List */}
        <div className="space-y-2 anim-fadeUp delay-200">
          {rows.length === 0 && (
            <div
              className="p-10 text-center"
              style={{ background: "var(--bg-white)", border: "1px solid var(--line)", borderRadius: 16 }}
            >
              <p className="text-ink-muted">
                No one&apos;s on the board yet. Be the first — go check in.
              </p>
            </div>
          )}

          {rows.map((row, i) => {
            const rank = i + 1;
            const isMe = user && row.id === user.id;
            const { level } = levelForPoints(row.total_points);
            const name = row.display_name || row.username || "anonymous";
            const medalColor =
              rank === 1 ? "#FFD700" : rank === 2 ? "rgba(24,20,16,0.70)" : "var(--ink-faint)";

            return (
              <Link
                key={row.id}
                href={row.username ? `/u/${row.username}` : "/leaderboard"}
                className="flex items-center gap-4 p-3.5 transition-all hover:-translate-y-0.5"
                style={{
                  background: "var(--bg-white)",
                  border: isMe ? "1px solid var(--ink-faint)" : "1px solid var(--line)",
                  borderRadius: 16,
                }}
              >
                {/* Rank */}
                <div className="w-8 shrink-0 flex items-center justify-center">
                  {rank <= 3 ? (
                    rank === 1 ? (
                      <Crown size={20} strokeWidth={1.5} style={{ color: medalColor }} />
                    ) : (
                      <Medal size={18} strokeWidth={1.5} style={{ color: medalColor }} />
                    )
                  ) : (
                    <span className="font-mono text-sm text-ink-faint tabular-nums">
                      {rank}
                    </span>
                  )}
                </div>

                {/* Avatar */}
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold shrink-0 overflow-hidden"
                  style={{
                    background: row.avatar_url ? "transparent" : "var(--fill)",
                    border: "1px solid var(--line)",
                    color: "rgba(24,20,16,0.70)",
                  }}
                >
                  {row.avatar_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={row.avatar_url} alt={name} className="w-full h-full object-cover" />
                  ) : (
                    name[0]?.toUpperCase() || "?"
                  )}
                </div>

                {/* Name + level */}
                <div className="min-w-0 flex-1">
                  <p className="font-sans text-sm font-medium text-ink truncate">
                    {name}
                    {isMe && (
                      <span
                        className="ml-2 uppercase"
                        style={{ fontSize: 9, fontWeight: 600, letterSpacing: "2px", color: "var(--ink-muted)" }}
                      >
                        you
                      </span>
                    )}
                  </p>
                  <p className="font-mono text-[10px] uppercase tracking-widest text-ink-faint truncate">
                    {level.name}
                  </p>
                </div>

                {/* Points */}
                <div className="text-right shrink-0">
                  <p className="font-display text-lg tabular-nums leading-none" style={{ color: "var(--xp)" }}>
                    {row.total_points.toLocaleString()}
                  </p>
                  <p className="font-mono text-[9px] uppercase tracking-widest text-ink-faint mt-0.5">
                    XP
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
