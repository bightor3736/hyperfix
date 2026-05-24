import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Your Pattern · Hyperfix",
};

const TEAL = "#5EEAD4";
const CARD_BG = "#0F1011";
const CARD_BORDER = "rgba(255,255,255,0.06)";

const CATEGORY_COLORS: Record<string, string> = {
  song: "#F59E0B",
  fanfic: "#EC4899",
  show: "#8B5CF6",
  film: "#3B82F6",
  ship: "#EF4444",
  game: "#10B981",
  book: "#F97316",
  other: "#6B7280",
};

function categoryColor(cat: string) {
  return CATEGORY_COLORS[cat.toLowerCase()] ?? "#6B7280";
}

function daysBetween(start: string, end?: string | null) {
  const s = new Date(start).getTime();
  const e = end ? new Date(end).getTime() : Date.now();
  return Math.max(1, Math.ceil((e - s) / 86_400_000));
}

function formatDate(d: string) {
  return new Date(d).toLocaleDateString("en-US", { month: "short", year: "numeric" });
}

type Fix = {
  id: string;
  title: string;
  category: string;
  intensity: number;
  started_at: string;
  ended_at: string | null;
};

export default async function PatternPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/auth/login");

  const { data: allFixes } = await supabase
    .from("fixes")
    .select("id, title, category, intensity, started_at, ended_at")
    .eq("user_id", user.id)
    .order("started_at", { ascending: true });

  const fixes = (allFixes ?? []) as Fix[];
  const activeFixes = fixes.filter((f) => !f.ended_at);
  const endedFixes = fixes.filter((f) => !!f.ended_at);

  // Average duration of ended fixations
  const avgDuration = endedFixes.length > 0
    ? Math.round(endedFixes.reduce((s, f) => s + daysBetween(f.started_at, f.ended_at), 0) / endedFixes.length)
    : null;

  // Most common category
  const catCounts: Record<string, number> = {};
  for (const f of fixes) catCounts[f.category] = (catCounts[f.category] ?? 0) + 1;
  const topCategory = Object.entries(catCounts).sort((a, b) => b[1] - a[1])[0]?.[0] ?? null;

  // Longest fixation ever
  const longest = fixes.reduce<Fix | null>((best, f) => {
    if (!best) return f;
    return daysBetween(f.started_at, f.ended_at) > daysBetween(best.started_at, best.ended_at) ? f : best;
  }, null);

  // Average intensity
  const avgIntensity = fixes.length > 0
    ? (fixes.reduce((s, f) => s + f.intensity, 0) / fixes.length).toFixed(1)
    : null;

  // Timeline: all fixes sorted by start date, most recent first for display
  const timeline = [...fixes].reverse();

  // Max days for timeline bar scaling
  const maxDays = Math.max(1, ...fixes.map((f) => daysBetween(f.started_at, f.ended_at)));

  return (
    <div className="min-h-screen" style={{ background: "#070708", color: "#F4F4F4" }}>
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 sm:py-12">

        {/* Header */}
        <div className="mb-2">
          <Link href="/dashboard" className="font-mono text-xs hover:text-[#5EEAD4] transition-colors" style={{ color: "rgba(255,255,255,0.3)" }}>
            ← dashboard
          </Link>
        </div>
        <h1 className="font-display text-3xl font-semibold mb-1" style={{ letterSpacing: "-0.03em" }}>your pattern</h1>
        <p className="font-sans text-sm mb-8" style={{ color: "rgba(255,255,255,0.4)" }}>
          this is how your brain cycles. not random — yours.
        </p>

        {fixes.length === 0 ? (
          <div className="rounded-3xl p-10 text-center" style={{ background: CARD_BG, border: `1px solid ${CARD_BORDER}` }}>
            <p className="font-display text-xl mb-2" style={{ color: "rgba(255,255,255,0.4)" }}>no fixations logged yet.</p>
            <p className="font-sans text-sm mb-6" style={{ color: "rgba(255,255,255,0.25)" }}>start tracking and come back here to see your pattern.</p>
            <Link href="/dashboard/new" className="font-sans text-sm font-semibold px-5 py-2.5 rounded-full transition-all hover:opacity-90" style={{ background: TEAL, color: "#0A1F1C" }}>
              Log your first fixation
            </Link>
          </div>
        ) : (
          <>
            {/* Stats row */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
              {[
                { label: "total fixations", value: fixes.length },
                { label: "still active", value: activeFixes.length },
                { label: avgDuration ? "avg duration" : "ended", value: avgDuration ? `${avgDuration}d` : endedFixes.length },
                { label: "avg intensity", value: avgIntensity ? `${avgIntensity}/10` : "—" },
              ].map((s) => (
                <div key={s.label} className="rounded-2xl p-4 sm:p-5" style={{ background: CARD_BG, border: `1px solid ${CARD_BORDER}` }}>
                  <div className="font-display text-2xl sm:text-3xl font-medium tabular-nums mb-1" style={{ color: "#F4F4F4" }}>
                    {s.value}
                  </div>
                  <div className="font-mono text-[10px] uppercase tracking-widest" style={{ color: "#9A9A9A" }}>
                    {s.label}
                  </div>
                </div>
              ))}
            </div>

            {/* Insight cards */}
            <div className="grid sm:grid-cols-2 gap-3 mb-8">
              {topCategory && (
                <div className="rounded-3xl p-5" style={{ background: CARD_BG, border: `1px solid ${CARD_BORDER}` }}>
                  <p className="font-mono text-[10px] uppercase tracking-widest mb-2" style={{ color: "rgba(255,255,255,0.3)" }}>
                    your main obsession type
                  </p>
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ background: categoryColor(topCategory) }} />
                    <p className="font-display text-xl font-semibold" style={{ letterSpacing: "-0.02em" }}>{topCategory}</p>
                    <span className="font-mono text-xs" style={{ color: "rgba(255,255,255,0.3)" }}>{catCounts[topCategory]}×</span>
                  </div>
                </div>
              )}
              {longest && (
                <div className="rounded-3xl p-5" style={{ background: CARD_BG, border: `1px solid ${CARD_BORDER}` }}>
                  <p className="font-mono text-[10px] uppercase tracking-widest mb-2" style={{ color: "rgba(255,255,255,0.3)" }}>
                    longest fixation ever
                  </p>
                  <p className="font-display text-base font-semibold leading-snug mb-1 line-clamp-1" style={{ letterSpacing: "-0.01em" }}>
                    {longest.title}
                  </p>
                  <p className="font-mono text-sm" style={{ color: TEAL }}>
                    {daysBetween(longest.started_at, longest.ended_at)} days
                  </p>
                </div>
              )}
              {avgDuration && (
                <div className="rounded-3xl p-5 sm:col-span-2" style={{ background: "rgba(94,234,212,0.04)", border: "1px solid rgba(94,234,212,0.14)" }}>
                  <p className="font-mono text-[10px] uppercase tracking-widest mb-2" style={{ color: "rgba(94,234,212,0.5)" }}>
                    your cycle insight
                  </p>
                  <p className="font-sans text-sm" style={{ color: "rgba(255,255,255,0.7)", lineHeight: 1.6 }}>
                    Your fixations last an average of <span style={{ color: TEAL, fontWeight: 600 }}>{avgDuration} days</span>.
                    {avgDuration < 14 && " Short, intense phases — your brain moves fast."}
                    {avgDuration >= 14 && avgDuration < 45 && " A couple of weeks deep is your sweet spot."}
                    {avgDuration >= 45 && " You go long. When you're in, you're really in."}
                    {" "}That's not inconsistency — that's your pattern.
                  </p>
                </div>
              )}
            </div>

            {/* Category breakdown */}
            {Object.keys(catCounts).length > 1 && (
              <div className="rounded-3xl p-5 sm:p-6 mb-6" style={{ background: CARD_BG, border: `1px solid ${CARD_BORDER}` }}>
                <p className="font-mono text-[10px] uppercase tracking-widest mb-5" style={{ color: "rgba(255,255,255,0.3)" }}>
                  obsession breakdown
                </p>
                <div className="flex flex-col gap-3">
                  {Object.entries(catCounts).sort((a, b) => b[1] - a[1]).map(([cat, count]) => {
                    const max = Math.max(...Object.values(catCounts));
                    const color = categoryColor(cat);
                    return (
                      <div key={cat} className="flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: color }} />
                        <span className="font-sans text-xs w-20 shrink-0 capitalize" style={{ color: "rgba(255,255,255,0.55)" }}>{cat}</span>
                        <div className="flex-1 h-2 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.06)" }}>
                          <div className="h-full rounded-full transition-all" style={{ width: `${(count / max) * 100}%`, background: color }} />
                        </div>
                        <span className="font-mono text-xs tabular-nums w-5 text-right" style={{ color: "#9A9A9A" }}>{count}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Timeline */}
            <div className="rounded-3xl p-5 sm:p-6 mb-6" style={{ background: CARD_BG, border: `1px solid ${CARD_BORDER}` }}>
              <p className="font-mono text-[10px] uppercase tracking-widest mb-6" style={{ color: "rgba(255,255,255,0.3)" }}>
                fixation timeline
              </p>
              <div className="flex flex-col gap-4">
                {timeline.map((fix) => {
                  const days = daysBetween(fix.started_at, fix.ended_at);
                  const color = categoryColor(fix.category);
                  const barWidth = Math.max(4, (days / maxDays) * 100);
                  const isActive = !fix.ended_at;
                  return (
                    <Link key={fix.id} href={`/dashboard/fix/${fix.id}`} className="group flex items-start gap-4 hover:opacity-80 transition-opacity">
                      <div className="flex-shrink-0 text-right w-20">
                        <p className="font-mono text-[10px]" style={{ color: "rgba(255,255,255,0.3)" }}>
                          {formatDate(fix.started_at)}
                        </p>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1.5">
                          <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: color, boxShadow: isActive ? `0 0 6px ${color}` : "none" }} />
                          <p className="font-sans text-sm font-medium truncate group-hover:text-[#5EEAD4] transition-colors" style={{ color: "rgba(255,255,255,0.85)" }}>
                            {fix.title}
                          </p>
                          {isActive && (
                            <span className="font-mono text-[9px] px-1.5 py-0.5 rounded-full flex-shrink-0" style={{ background: "rgba(94,234,212,0.1)", color: TEAL, border: "1px solid rgba(94,234,212,0.2)" }}>
                              active
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.05)" }}>
                            <div
                              className="h-full rounded-full"
                              style={{
                                width: `${barWidth}%`,
                                background: isActive ? `linear-gradient(to right, ${color}88, ${color})` : color,
                                opacity: isActive ? 1 : 0.6,
                              }}
                            />
                          </div>
                          <span className="font-mono text-[10px] tabular-nums flex-shrink-0" style={{ color: "rgba(255,255,255,0.3)" }}>
                            {days}d
                          </span>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>

            {endedFixes.length > 0 && (
              <div className="text-center">
                <Link
                  href="/dashboard/graveyard"
                  className="font-sans text-sm transition-colors hover:text-[#5EEAD4]"
                  style={{ color: "rgba(255,255,255,0.3)" }}
                >
                  🪦 view the graveyard →
                </Link>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
