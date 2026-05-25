import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { redirect } from "next/navigation";
import type { Metadata } from "next";
import { StreakHeatmap } from "@/components/StreakHeatmap";
import { CategoryIcon, CATEGORY_COLOR, categoryLabel } from "@/components/CategoryIcon";
import { FlameIcon, BookIcon, SparkleIcon } from "@/components/LandingIcons";
import { TrophyIcon } from "@/components/MilestoneIcons";
import { ProCheckoutButton } from "@/components/ProCheckoutButton";

export const metadata: Metadata = {
  title: "Analytics · Hyperfix",
};

const BG = "#070708";
const CARD = "#0F1011";
const BORDER = "rgba(255,255,255,0.06)";
const TEAL = "#5EEAD4";
const MUTED = "rgba(244,244,244,0.45)";
const DIM = "rgba(244,244,244,0.3)";

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
    if (prev !== null && t - prev === 86_400_000) run++;
    else run = 1;
    prev = t;
    if (run > best) best = run;
  }
  return best;
}

function daysBetween(a: Date, b: Date): number {
  return Math.max(0, Math.round((b.getTime() - a.getTime()) / 86_400_000));
}

// ---------- presentational pieces ----------

function Eyebrow({ children, color = TEAL }: { children: React.ReactNode; color?: string }) {
  return (
    <p className="font-mono text-[10px] uppercase tracking-[0.18em]" style={{ color }}>
      {children}
    </p>
  );
}

function StatCard({
  label,
  value,
  sub,
  icon,
  accent = false,
}: {
  label: string;
  value: string | number;
  sub?: string;
  icon: React.ReactNode;
  accent?: boolean;
}) {
  return (
    <div
      className="rounded-3xl p-5 sm:p-6 flex flex-col gap-5"
      style={{ background: CARD, border: `1px solid ${BORDER}` }}
    >
      <div style={{ color: accent ? TEAL : "rgba(244,244,244,0.55)" }}>{icon}</div>
      <div>
        <div
          className="font-display font-medium tabular-nums leading-none"
          style={{
            color: accent ? TEAL : "#F4F4F4",
            fontSize: "clamp(28px, 4vw, 40px)",
          }}
        >
          {value}
        </div>
        <div className="font-mono text-[10px] uppercase tracking-[0.18em] mt-3" style={{ color: "#9A9A9A" }}>
          {label}
        </div>
        {sub && (
          <div className="font-sans text-[12px] mt-1.5" style={{ color: DIM }}>
            {sub}
          </div>
        )}
      </div>
    </div>
  );
}

// ---------- Intensity SVG chart ----------

function IntensityChart({
  points,
}: {
  points: { key: string; avg: number; count: number }[];
}) {
  const W = 720;
  const H = 200;
  const PADX = 16;
  const PADY = 24;
  const innerW = W - PADX * 2;
  const innerH = H - PADY * 2;
  const n = points.length;
  const xFor = (i: number) => PADX + (n <= 1 ? innerW / 2 : (i * innerW) / (n - 1));
  const yFor = (v: number) => PADY + innerH - (Math.max(0, Math.min(10, v)) / 10) * innerH;

  const active = points.filter((p) => p.count > 0);
  const maxP = active.reduce<{ p: typeof points[number]; i: number } | null>(
    (acc, p, i) => (acc == null || p.avg > acc.p.avg ? { p, i: points.indexOf(p) } : acc),
    null,
  );
  const minP = active.reduce<{ p: typeof points[number]; i: number } | null>(
    (acc, p) => {
      const i = points.indexOf(p);
      return acc == null || p.avg < acc.p.avg ? { p, i } : acc;
    },
    null,
  );

  // smooth-ish polyline via cubic bezier averages
  let path = "";
  for (let i = 0; i < n; i++) {
    const x = xFor(i);
    const y = yFor(points[i].avg);
    if (i === 0) path += `M ${x.toFixed(1)} ${y.toFixed(1)}`;
    else {
      const px = xFor(i - 1);
      const py = yFor(points[i - 1].avg);
      const cx = (px + x) / 2;
      path += ` C ${cx.toFixed(1)} ${py.toFixed(1)}, ${cx.toFixed(1)} ${y.toFixed(1)}, ${x.toFixed(1)} ${y.toFixed(1)}`;
    }
  }
  // area fill path
  let area = path + ` L ${xFor(n - 1).toFixed(1)} ${(H - PADY).toFixed(1)} L ${xFor(0).toFixed(1)} ${(H - PADY).toFixed(1)} Z`;

  return (
    <svg viewBox={`0 0 ${W} ${H}`} width="100%" height={H} style={{ display: "block" }}>
      <defs>
        <linearGradient id="intensityFill" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor={TEAL} stopOpacity="0.22" />
          <stop offset="100%" stopColor={TEAL} stopOpacity="0" />
        </linearGradient>
      </defs>
      {/* gridlines */}
      {[0, 2.5, 5, 7.5, 10].map((v) => (
        <line
          key={v}
          x1={PADX}
          x2={W - PADX}
          y1={yFor(v)}
          y2={yFor(v)}
          stroke="rgba(255,255,255,0.05)"
          strokeWidth="1"
        />
      ))}
      <path d={area} fill="url(#intensityFill)" />
      <path d={path} stroke={TEAL} strokeWidth="1.6" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      {points.map((p, i) =>
        p.count > 0 ? (
          <circle key={i} cx={xFor(i)} cy={yFor(p.avg)} r="2.4" fill={BG} stroke={TEAL} strokeWidth="1.4" />
        ) : null,
      )}
      {maxP && (
        <g>
          <circle cx={xFor(maxP.i)} cy={yFor(maxP.p.avg)} r="4" fill={TEAL} />
          <text
            x={xFor(maxP.i)}
            y={yFor(maxP.p.avg) - 10}
            textAnchor="middle"
            fontFamily="JetBrains Mono, monospace"
            fontSize="10"
            fill={TEAL}
          >
            {maxP.p.avg.toFixed(1)}
          </text>
        </g>
      )}
      {minP && minP.i !== (maxP?.i ?? -1) && (
        <g>
          <circle cx={xFor(minP.i)} cy={yFor(minP.p.avg)} r="3" fill="rgba(255,255,255,0.5)" />
          <text
            x={xFor(minP.i)}
            y={yFor(minP.p.avg) + 14}
            textAnchor="middle"
            fontFamily="JetBrains Mono, monospace"
            fontSize="10"
            fill="rgba(255,255,255,0.45)"
          >
            {minP.p.avg.toFixed(1)}
          </text>
        </g>
      )}
    </svg>
  );
}

// ---------- The real analytics block ----------

type AnalyticsData = {
  currentStreak: number;
  bestStreak: number;
  totalFixes: number;
  avgRunDays: number;
  entriesDates: string[];
  intensity30: { key: string; avg: number; count: number }[];
  intensityMax: number;
  intensityMin: number;
  categories: [string, number][];
  longestFixes: { fix: FixRow; days: number }[];
  shortest: number;
  longest: number;
  topCategory: string | null;
};

function TopStatsGrid({ data }: { data: AnalyticsData }) {
  const { currentStreak, bestStreak, totalFixes, avgRunDays: avg } = data;
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
      <StatCard
        icon={<FlameIcon size={22} />}
        label="current run"
        value={currentStreak}
        sub={currentStreak > 0 ? "checked in today" : "starts now"}
        accent
      />
      <StatCard
        icon={<TrophyIcon size={22} />}
        label="longest run"
        value={bestStreak}
        sub="personal best"
      />
      <StatCard
        icon={<BookIcon size={22} />}
        label="total fixes"
        value={totalFixes}
      />
      <StatCard
        icon={<SparkleIcon size={22} />}
        label="avg run length"
        value={avg > 0 ? `${avg.toFixed(1)}` : "0"}
        sub="days across all fixes"
      />
    </div>
  );
}

function AnalyticsLockedBlock({ data, hasData }: { data: AnalyticsData; hasData: boolean }) {
  const {
    entriesDates,
    intensity30,
    categories,
    longestFixes,
    shortest,
    longest,
    avgRunDays: avg,
    topCategory,
  } = data;

  return (
    <div className="flex flex-col gap-6">
      {/* Section 3: Heatmap */}
      <div
        className="rounded-3xl p-6 sm:p-8"
        style={{ background: CARD, border: `1px solid ${BORDER}` }}
      >
        <Eyebrow color="#9A9A9A">Last 12 weeks</Eyebrow>
        <h2 className="font-display text-xl font-medium mt-1.5 mb-6" style={{ color: "#F4F4F4" }}>
          Activity
        </h2>
        <div className="overflow-x-auto">
          <StreakHeatmap dates={entriesDates} />
        </div>
      </div>

      {/* Section 4: Intensity over time */}
      <div
        className="rounded-3xl p-6 sm:p-8"
        style={{ background: CARD, border: `1px solid ${BORDER}` }}
      >
        <Eyebrow color="#9A9A9A">Last 30 days</Eyebrow>
        <h2 className="font-display text-xl font-medium mt-1.5 mb-6" style={{ color: "#F4F4F4" }}>
          Intensity over time
        </h2>
        {hasData ? (
          <IntensityChart points={intensity30} />
        ) : (
          <p className="font-sans text-sm" style={{ color: DIM }}>
            Log a few days to see your intensity curve.
          </p>
        )}
        <div className="flex items-center justify-between mt-4">
          <span className="font-mono text-[10px] tracking-widest uppercase" style={{ color: DIM }}>
            0 – 10 scale
          </span>
          <span className="font-mono text-[10px] tracking-widest uppercase" style={{ color: DIM }}>
            30d ago → today
          </span>
        </div>
      </div>

      {/* Section 5: Category breakdown */}
      <div
        className="rounded-3xl p-6 sm:p-8"
        style={{ background: CARD, border: `1px solid ${BORDER}` }}
      >
        <Eyebrow color="#9A9A9A">Distribution</Eyebrow>
        <h2 className="font-display text-xl font-medium mt-1.5 mb-6" style={{ color: "#F4F4F4" }}>
          By category
        </h2>
        {categories.length === 0 ? (
          <p className="font-sans text-sm" style={{ color: DIM }}>
            No fixes yet.
          </p>
        ) : (
          <div className="flex flex-col gap-4">
            {categories.map(([cat, count]) => {
              const color = CATEGORY_COLOR[cat.toLowerCase()] ?? "#9A9A9A";
              const maxCat = Math.max(1, ...categories.map((c) => c[1]));
              return (
                <div key={cat} className="flex items-center gap-3 sm:gap-4">
                  <span
                    className="shrink-0 inline-flex items-center justify-center rounded-xl"
                    style={{
                      width: 36,
                      height: 36,
                      background: `${color}1A`,
                      border: `1px solid ${color}33`,
                      color,
                    }}
                  >
                    <CategoryIcon category={cat} size={18} color={color} />
                  </span>
                  <span
                    className="font-sans text-sm w-24 sm:w-32 shrink-0 truncate"
                    style={{ color: "rgba(244,244,244,0.75)" }}
                  >
                    {categoryLabel(cat)}
                  </span>
                  <div
                    className="flex-1 h-2.5 rounded-full overflow-hidden"
                    style={{ background: "rgba(255,255,255,0.04)" }}
                  >
                    <div
                      className="h-full rounded-full"
                      style={{
                        width: `${(count / maxCat) * 100}%`,
                        background: color,
                        boxShadow: `0 0 12px ${color}66`,
                      }}
                    />
                  </div>
                  <span
                    className="font-mono text-xs tabular-nums w-8 text-right"
                    style={{ color: "rgba(244,244,244,0.6)" }}
                  >
                    {count}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Section 6: Longest fixes */}
      <div
        className="rounded-3xl p-6 sm:p-8"
        style={{ background: CARD, border: `1px solid ${BORDER}` }}
      >
        <Eyebrow color="#9A9A9A">Top 5</Eyebrow>
        <h2 className="font-display text-xl font-medium mt-1.5 mb-6" style={{ color: "#F4F4F4" }}>
          Longest-running fixes
        </h2>
        {longestFixes.length === 0 ? (
          <p className="font-sans text-sm" style={{ color: DIM }}>
            No fixes to rank yet.
          </p>
        ) : (
          <div className="flex flex-col">
            {longestFixes.map(({ fix, days }, i) => {
              const color = CATEGORY_COLOR[fix.category.toLowerCase()] ?? "#9A9A9A";
              const startedAgo = daysBetween(new Date(fix.started_at), new Date());
              return (
                <Link
                  key={fix.id}
                  href={`/dashboard/fix/${fix.id}`}
                  className="flex items-center gap-4 py-4 group transition-colors"
                  style={{
                    borderTop: i === 0 ? "none" : `1px solid ${BORDER}`,
                  }}
                >
                  <span
                    className="shrink-0 inline-flex items-center justify-center rounded-xl"
                    style={{
                      width: 40,
                      height: 40,
                      background: `${color}1A`,
                      border: `1px solid ${color}33`,
                      color,
                    }}
                  >
                    <CategoryIcon category={fix.category} size={20} color={color} />
                  </span>
                  <div className="min-w-0 flex-1">
                    <div
                      className="font-sans text-[15px] truncate transition-colors group-hover:text-[#5EEAD4]"
                      style={{ color: "#F4F4F4" }}
                    >
                      {fix.title}
                    </div>
                    <div className="font-mono text-[10px] uppercase tracking-widest mt-1" style={{ color: DIM }}>
                      started {startedAgo} {startedAgo === 1 ? "day" : "days"} ago
                    </div>
                  </div>
                  <div className="text-right">
                    <div
                      className="font-display text-2xl font-medium tabular-nums leading-none"
                      style={{ color: TEAL }}
                    >
                      {days}
                    </div>
                    <div className="font-mono text-[10px] uppercase tracking-widest mt-1" style={{ color: DIM }}>
                      {days === 1 ? "day" : "days"}
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>

      {/* Section 7: Cycle insight */}
      <div
        className="rounded-3xl p-6 sm:p-8"
        style={{ background: CARD, border: `1px solid ${BORDER}` }}
      >
        <Eyebrow color={TEAL}>Pattern</Eyebrow>
        <h2 className="font-display text-xl font-medium mt-1.5 mb-4" style={{ color: "#F4F4F4" }}>
          Your cycle
        </h2>
        <p
          className="font-sans leading-relaxed"
          style={{ color: "rgba(244,244,244,0.75)", fontSize: "clamp(15px, 1.6vw, 17px)" }}
        >
          On average, your obsessions last{" "}
          <span className="tabular-nums font-medium" style={{ color: TEAL }}>
            {avg.toFixed(1)} days
          </span>
          . Your shortest was{" "}
          <span className="tabular-nums font-medium" style={{ color: "#F4F4F4" }}>
            {shortest} {shortest === 1 ? "day" : "days"}
          </span>
          , your longest{" "}
          <span className="tabular-nums font-medium" style={{ color: "#F4F4F4" }}>
            {longest} {longest === 1 ? "day" : "days"}
          </span>
          .
          {topCategory && (
            <>
              {" "}
              <span style={{ color: MUTED }}>
                {categoryLabel(topCategory)} dominates — it&apos;s where your attention keeps landing.
              </span>
            </>
          )}
        </p>
      </div>
    </div>
  );
}

// ---------- Pro upsell card (centered over blur) ----------

function ProUpsellCard() {
  return (
    <div className="px-4 max-w-md w-full pointer-events-auto">
      <div
        className="rounded-3xl p-8 sm:p-10 text-center"
        style={{
          background: CARD,
          border: `1px solid ${TEAL}40`,
          boxShadow: `0 24px 80px rgba(0,0,0,0.7), 0 0 0 1px ${TEAL}1A, 0 0 60px ${TEAL}1A`,
          backdropFilter: "blur(8px)",
        }}
      >
        <div className="inline-flex items-center justify-center mb-5" style={{ color: TEAL }}>
          <SparkleIcon size={28} />
        </div>
        <Eyebrow>Hyperfix Pro</Eyebrow>
        <h3
          className="font-display font-medium mt-2 mb-3"
          style={{ color: "#F4F4F4", fontSize: "clamp(22px, 3vw, 28px)" }}
        >
          Unlock the full picture
        </h3>
        <p
          className="font-sans text-sm leading-relaxed mb-7"
          style={{ color: MUTED }}
        >
          See your activity heatmap, intensity trends over time, category
          breakdowns, your longest-running fixes, and the pattern your
          obsessions actually follow — all private, all yours.
        </p>
        <ProCheckoutButton
          label="Get Pro"
          className="inline-block w-full px-6 py-3.5 rounded-full font-sans text-sm font-bold transition-all hover:opacity-90 active:scale-[0.98]"
          style={{ background: TEAL, color: "#070708" }}
        />
        <Link
          href="/dashboard"
          className="block mt-4 font-sans text-[12px] hover:opacity-80 transition-opacity"
          style={{ color: DIM }}
        >
          or continue with free analytics
        </Link>
      </div>
    </div>
  );
}

// ---------- Demo data for the blurred preview ----------

function buildDemoData(): AnalyticsData {
  const dates: string[] = [];
  // A plausible-looking 12 week streak pattern
  for (let i = 0; i < 84; i++) {
    const d = new Date(Date.now() - i * 86_400_000);
    // ~70% density, weighted recent
    const p = i < 14 ? 0.88 : i < 40 ? 0.65 : 0.45;
    if (Math.sin(i * 1.3) * 0.3 + Math.random() * 0 + 0.5 < p) dates.push(dayKey(d));
  }
  // Deterministic instead of random:
  const detDates: string[] = [];
  const pattern = [1, 1, 1, 0, 1, 1, 1, 1, 0, 1, 1, 0, 1, 1];
  for (let i = 0; i < 84; i++) {
    if (pattern[i % pattern.length]) {
      const d = new Date(Date.now() - i * 86_400_000);
      detDates.push(dayKey(d));
    }
  }

  const intensity30: { key: string; avg: number; count: number }[] = [];
  const curve = [5.2, 5.8, 6.4, 7.1, 7.6, 7.9, 8.3, 8.1, 7.8, 8.5, 9.0, 8.7, 8.2, 7.6, 7.1, 6.8, 7.2, 7.9, 8.4, 8.8, 9.1, 8.6, 8.0, 7.5, 7.8, 8.2, 8.6, 8.9, 8.4, 7.9];
  for (let i = 29; i >= 0; i--) {
    const d = new Date(Date.now() - i * 86_400_000);
    intensity30.push({ key: dayKey(d), avg: curve[29 - i], count: 1 });
  }

  return {
    currentStreak: 14,
    bestStreak: 32,
    totalFixes: 17,
    avgRunDays: 18.3,
    entriesDates: detDates,
    intensity30,
    intensityMax: 9.1,
    intensityMin: 5.2,
    categories: [
      ["show", 6],
      ["song", 4],
      ["character", 3],
      ["book", 2],
      ["ship", 2],
    ],
    longestFixes: [
      { fix: { id: "1", title: "Severance season 2", category: "show", started_at: new Date(Date.now() - 47 * 86_400_000).toISOString(), ended_at: null }, days: 47 },
      { fix: { id: "2", title: "Mitski – Working for the Knife", category: "song", started_at: new Date(Date.now() - 41 * 86_400_000).toISOString(), ended_at: null }, days: 41 },
      { fix: { id: "3", title: "Spencer Reid", category: "character", started_at: new Date(Date.now() - 33 * 86_400_000).toISOString(), ended_at: null }, days: 33 },
      { fix: { id: "4", title: "Piranesi by Susanna Clarke", category: "book", started_at: new Date(Date.now() - 28 * 86_400_000).toISOString(), ended_at: null }, days: 28 },
      { fix: { id: "5", title: "Wenclair", category: "ship", started_at: new Date(Date.now() - 22 * 86_400_000).toISOString(), ended_at: null }, days: 22 },
    ],
    shortest: 4,
    longest: 47,
    topCategory: "show",
  };
}

// ---------- Page ----------

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

  const isPro = !!profile?.is_pro;

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

  // Derive real stats (used for free users' top strip + Pro users' everything)
  const allDates = entries.map((e) => e.date);
  const dateSet = new Set(allDates);
  const currentStreak = computeStreak(dateSet);
  const bestStreak = longestStreak(allDates);

  // Run-length per fix (days between started_at and ended_at or today)
  const now = new Date();
  const fixRunDays = fixes.map((f) => {
    const start = new Date(f.started_at);
    const end = f.ended_at ? new Date(f.ended_at) : now;
    return { fix: f, days: Math.max(1, daysBetween(start, end)) };
  });
  const totalFixes = fixes.length;
  const avgRunDays =
    fixRunDays.length === 0
      ? 0
      : fixRunDays.reduce((s, r) => s + r.days, 0) / fixRunDays.length;
  const shortest = fixRunDays.length ? Math.min(...fixRunDays.map((r) => r.days)) : 0;
  const longest = fixRunDays.length ? Math.max(...fixRunDays.map((r) => r.days)) : 0;
  const longestFixes = [...fixRunDays].sort((a, b) => b.days - a.days).slice(0, 5);

  // Intensity over the last 30 days
  const intensity30: { key: string; avg: number; count: number }[] = [];
  for (let i = 29; i >= 0; i--) {
    const d = new Date(Date.now() - i * 86_400_000);
    const k = dayKey(d);
    const dayEntries = entries.filter((e) => e.date === k);
    const avg =
      dayEntries.length > 0
        ? dayEntries.reduce((s, e) => s + e.intensity, 0) / dayEntries.length
        : 0;
    intensity30.push({ key: k, avg, count: dayEntries.length });
  }
  const active = intensity30.filter((p) => p.count > 0);
  const intensityMax = active.length ? Math.max(...active.map((p) => p.avg)) : 0;
  const intensityMin = active.length ? Math.min(...active.map((p) => p.avg)) : 0;
  const hasIntensity = active.length > 0;

  // Categories
  const catCounts: Record<string, number> = {};
  for (const f of fixes) catCounts[f.category] = (catCounts[f.category] ?? 0) + 1;
  const categories = Object.entries(catCounts).sort((a, b) => b[1] - a[1]) as [string, number][];
  const topCategory = categories[0]?.[0] ?? null;

  const realData: AnalyticsData = {
    currentStreak,
    bestStreak,
    totalFixes,
    avgRunDays,
    entriesDates: allDates,
    intensity30,
    intensityMax,
    intensityMin,
    categories,
    longestFixes,
    shortest,
    longest,
    topCategory,
  };

  const demoData = buildDemoData();

  return (
    <div className="min-h-screen" style={{ background: BG, color: "#F4F4F4" }}>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10 sm:py-16">
        {/* Header */}
        <div className="mb-12 sm:mb-16">
          <Eyebrow>Analytics</Eyebrow>
          <h1
            className="font-display font-medium mt-3"
            style={{
              color: "#F4F4F4",
              fontSize: "clamp(32px, 5.5vw, 48px)",
              letterSpacing: "-0.02em",
              lineHeight: 1.05,
            }}
          >
            Your pattern.
          </h1>
          <p
            className="font-sans mt-4 max-w-xl"
            style={{ color: MUTED, fontSize: "clamp(15px, 1.6vw, 17px)", lineHeight: 1.5 }}
          >
            How your obsessions actually behave — by the numbers.
          </p>
        </div>

        {isPro ? (
          <AnalyticsBlock data={realData} hasData={hasIntensity} />
        ) : (
          <div className="relative">
            <div
              aria-hidden
              className="pointer-events-none select-none"
              style={{ filter: "blur(6px)" }}
            >
              <AnalyticsBlock data={demoData} hasData={true} />
            </div>
            <div
              className="absolute inset-0 flex items-center justify-center"
              style={{
                background:
                  "linear-gradient(to bottom, rgba(7,7,8,0.4) 0%, rgba(7,7,8,0.75) 40%, rgba(7,7,8,0.95) 100%)",
              }}
            >
              <div className="sticky top-24 w-full flex justify-center">
                <ProUpsellCard />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
