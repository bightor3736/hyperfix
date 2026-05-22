import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { redirect } from "next/navigation";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Analytics · Hyperfix",
};

const TEAL = "#5EEAD4";

type FixRow = {
  id: string;
  title: string;
  category: string;
  started_at: string;
  ended_at: string | null;
};

type EntryRow = {
  fix_id: string;
  date: string;
  intensity: number;
};

function dayKey(d: Date): string {
  return d.toISOString().split("T")[0];
}

function computeStreak(dates: Set<string>): number {
  const today = new Date();
  let cursor = new Date(today);
  // Allow the streak to count from today or yesterday
  if (!dates.has(dayKey(cursor))) {
    cursor = new Date(today.getTime() - 86_400_000);
    if (!dates.has(dayKey(cursor))) return 0;
  }
  let streak = 0;
  while (dates.has(dayKey(cursor))) {
    streak++;
    cursor = new Date(cursor.getTime() - 86_400_000);
  }
  return streak;
}

function longestStreak(dates: string[]): number {
  const sorted = [...new Set(dates)].sort();
  let best = 0;
  let run = 0;
  let prev: number | null = null;
  for (const d of sorted) {
    const t = new Date(d).getTime();
    if (prev !== null && t - prev === 86_400_000) {
      run++;
    } else {
      run = 1;
    }
    prev = t;
    if (run > best) best = run;
  }
  return best;
}

function UpgradeWall() {
  return (
    <div className="max-w-2xl mx-auto px-6 py-20 text-center">
      <div
        className="rounded-3xl p-10"
        style={{ background: "#111113", border: `1px solid ${TEAL}33` }}
      >
        <p className="font-mono text-[10px] uppercase tracking-widest mb-4" style={{ color: TEAL }}>
          Pro feature
        </p>
        <h1 className="font-display text-2xl font-medium mb-3" style={{ color: "#F4F4F4" }}>
          Private analytics
        </h1>
        <p className="font-sans text-sm mb-7 leading-relaxed" style={{ color: "rgba(244,244,244,0.5)" }}>
          See your streak history, intensity trends, and category breakdown — a private
          dashboard only you can see. Available on the Pro plan.
        </p>
        <Link
          href="/pricing"
          className="inline-block px-6 py-3 rounded-full font-sans text-sm font-bold transition-all hover:opacity-90"
          style={{ background: TEAL, color: "#0A0A0A" }}
        >
          Upgrade to Pro →
        </Link>
      </div>
    </div>
  );
}

function StatCard({ label, value, sub }: { label: string; value: string | number; sub?: string }) {
  return (
    <div className="rounded-2xl p-5" style={{ background: "#111113", border: "1px solid rgba(244,244,244,0.07)" }}>
      <div className="font-display text-3xl font-medium tabular-nums" style={{ color: "#F4F4F4" }}>
        {value}
      </div>
      <div className="font-mono text-[10px] uppercase tracking-widest mt-1" style={{ color: "#9A9A9A" }}>
        {label}
      </div>
      {sub && (
        <div className="font-sans text-[11px] mt-1.5" style={{ color: "rgba(244,244,244,0.3)" }}>
          {sub}
        </div>
      )}
    </div>
  );
}

export default async function AnalyticsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/auth/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("is_pro")
    .eq("id", user.id)
    .single();

  if (!profile?.is_pro) {
    return (
      <div className="min-h-screen" style={{ background: "#0A0A0A" }}>
        <UpgradeWall />
      </div>
    );
  }

  const { data: fixesData } = await supabase
    .from("fixes")
    .select("id, title, category, started_at, ended_at")
    .eq("user_id", user.id);
  const fixes = (fixesData ?? []) as FixRow[];

  const { data: entriesData } = await supabase
    .from("fix_entries")
    .select("fix_id, date, intensity")
    .eq("user_id", user.id)
    .order("date", { ascending: false });
  const entries = (entriesData ?? []) as EntryRow[];

  const allDates = entries.map((e) => e.date);
  const dateSet = new Set(allDates);
  const currentStreak = computeStreak(dateSet);
  const bestStreak = longestStreak(allDates);

  // Check-ins in the last 30 days
  const thirtyAgo = Date.now() - 30 * 86_400_000;
  const last30Count = entries.filter((e) => new Date(e.date).getTime() >= thirtyAgo).length;

  // Intensity per day, last 14 days
  const days: { key: string; label: string }[] = [];
  for (let i = 13; i >= 0; i--) {
    const d = new Date(Date.now() - i * 86_400_000);
    days.push({ key: dayKey(d), label: d.toLocaleDateString("en-US", { weekday: "narrow" }) });
  }
  const intensityByDay = days.map((day) => {
    const dayEntries = entries.filter((e) => e.date === day.key);
    const avg =
      dayEntries.length > 0
        ? dayEntries.reduce((s, e) => s + e.intensity, 0) / dayEntries.length
        : 0;
    return { ...day, avg, count: dayEntries.length };
  });
  const maxAvg = Math.max(1, ...intensityByDay.map((d) => d.avg));

  // Category breakdown
  const catCounts: Record<string, number> = {};
  for (const f of fixes) catCounts[f.category] = (catCounts[f.category] ?? 0) + 1;
  const categories = Object.entries(catCounts).sort((a, b) => b[1] - a[1]);
  const maxCat = Math.max(1, ...categories.map((c) => c[1]));

  // Most consistent fix (most check-ins)
  const entriesByFix: Record<string, number> = {};
  for (const e of entries) entriesByFix[e.fix_id] = (entriesByFix[e.fix_id] ?? 0) + 1;
  const consistent = fixes
    .map((f) => ({ fix: f, count: entriesByFix[f.id] ?? 0 }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);
  const maxFixCount = Math.max(1, ...consistent.map((c) => c.count));

  return (
    <div className="min-h-screen" style={{ background: "#0A0A0A", color: "#F4F4F4" }}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <div className="flex items-center gap-3 mb-1">
          <h1 className="font-display text-2xl font-medium">Analytics</h1>
          <span
            className="font-mono text-[9px] rounded px-1.5 py-0.5"
            style={{ background: `${TEAL}2E`, color: TEAL, border: `1px solid ${TEAL}59` }}
          >
            PRO
          </span>
        </div>
        <p className="font-sans text-sm mb-8" style={{ color: "rgba(244,244,244,0.4)" }}>
          A private look at your obsession patterns. Only you can see this.
        </p>

        {/* Top stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
          <StatCard label="current streak" value={currentStreak} sub={currentStreak === 1 ? "day" : "days"} />
          <StatCard label="longest streak" value={bestStreak} sub={bestStreak === 1 ? "day" : "days"} />
          <StatCard label="total check-ins" value={entries.length} />
          <StatCard label="last 30 days" value={last30Count} sub="check-ins" />
        </div>

        {/* Intensity trend */}
        <div className="rounded-2xl p-5 sm:p-6 mb-6" style={{ background: "#111113", border: "1px solid rgba(244,244,244,0.07)" }}>
          <h2 className="font-mono text-[10px] uppercase tracking-widest mb-5" style={{ color: "#9A9A9A" }}>
            Avg intensity · last 14 days
          </h2>
          <div className="flex items-end justify-between gap-1.5" style={{ height: 120 }}>
            {intensityByDay.map((d, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end">
                <div
                  className="w-full rounded-t"
                  style={{
                    height: `${Math.max(2, (d.avg / maxAvg) * 100)}%`,
                    background: d.count > 0 ? TEAL : "rgba(244,244,244,0.07)",
                    opacity: d.count > 0 ? 0.85 : 1,
                  }}
                  title={d.count > 0 ? `${d.avg.toFixed(1)}/10` : "no check-in"}
                />
                <span className="font-mono text-[9px]" style={{ color: "rgba(244,244,244,0.3)" }}>
                  {d.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Category breakdown */}
        <div className="rounded-2xl p-5 sm:p-6 mb-6" style={{ background: "#111113", border: "1px solid rgba(244,244,244,0.07)" }}>
          <h2 className="font-mono text-[10px] uppercase tracking-widest mb-5" style={{ color: "#9A9A9A" }}>
            Fixes by category
          </h2>
          {categories.length === 0 ? (
            <p className="font-sans text-sm" style={{ color: "rgba(244,244,244,0.3)" }}>
              No fixes yet.
            </p>
          ) : (
            <div className="flex flex-col gap-3">
              {categories.map(([cat, count]) => (
                <div key={cat} className="flex items-center gap-3">
                  <span className="font-sans text-xs w-28 shrink-0 truncate" style={{ color: "rgba(244,244,244,0.6)" }}>
                    {cat}
                  </span>
                  <div className="flex-1 h-2 rounded-full overflow-hidden" style={{ background: "rgba(244,244,244,0.06)" }}>
                    <div className="h-full rounded-full" style={{ width: `${(count / maxCat) * 100}%`, background: TEAL }} />
                  </div>
                  <span className="font-mono text-xs tabular-nums w-6 text-right" style={{ color: "#9A9A9A" }}>
                    {count}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Most consistent */}
        <div className="rounded-2xl p-5 sm:p-6" style={{ background: "#111113", border: "1px solid rgba(244,244,244,0.07)" }}>
          <h2 className="font-mono text-[10px] uppercase tracking-widest mb-5" style={{ color: "#9A9A9A" }}>
            Most tracked fixes
          </h2>
          {consistent.length === 0 || consistent[0].count === 0 ? (
            <p className="font-sans text-sm" style={{ color: "rgba(244,244,244,0.3)" }}>
              No check-ins yet — log a day to see this.
            </p>
          ) : (
            <div className="flex flex-col gap-3">
              {consistent.filter((c) => c.count > 0).map(({ fix, count }) => (
                <Link key={fix.id} href={`/dashboard/fix/${fix.id}`} className="flex items-center gap-3 group">
                  <span
                    className="font-sans text-xs w-28 shrink-0 truncate transition-colors group-hover:text-[#5EEAD4]"
                    style={{ color: "rgba(244,244,244,0.6)" }}
                  >
                    {fix.title}
                  </span>
                  <div className="flex-1 h-2 rounded-full overflow-hidden" style={{ background: "rgba(244,244,244,0.06)" }}>
                    <div className="h-full rounded-full" style={{ width: `${(count / maxFixCount) * 100}%`, background: TEAL }} />
                  </div>
                  <span className="font-mono text-xs tabular-nums w-12 text-right" style={{ color: "#9A9A9A" }}>
                    {count}
                  </span>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
