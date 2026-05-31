import { createClient } from "@/lib/supabase/server";
import { createClient as createAdmin } from "@supabase/supabase-js";
import { redirect } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Traffic · Hyperfix" };

const TEAL = "var(--accent)";
const CARD_BG = "var(--bg)";
const CARD_BORDER = "var(--line)";

function adminSupabase() {
  return createAdmin(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

function dayKey(d: Date) {
  return d.toISOString().split("T")[0];
}

function formatDay(key: string) {
  return new Date(key).toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export default async function TrafficPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/auth/login");

  const adminEmail = process.env.ADMIN_EMAIL;
  if (!adminEmail || user.email !== adminEmail) redirect("/dashboard");

  const admin = adminSupabase();

  // All users with created_at
  const { data: users } = await admin
    .from("profiles")
    .select("id, created_at")
    .order("created_at", { ascending: false });

  // All fixes ever created
  const { data: fixes } = await admin
    .from("fixes")
    .select("id, created_at")
    .order("created_at", { ascending: false });

  // All aff_events
  const { data: affEvents } = await admin
    .from("aff_events")
    .select("slug, event, created_at")
    .order("created_at", { ascending: false });

  // All aff_links for labels
  const { data: affLinks } = await admin
    .from("aff_links")
    .select("slug, label");

  const slugToLabel: Record<string, string> = {};
  for (const l of affLinks ?? []) slugToLabel[l.slug] = l.label;

  const allUsers = users ?? [];
  const allFixes = fixes ?? [];
  const allEvents = affEvents ?? [];

  // Totals
  const totalUsers = allUsers.length;
  const totalFixes = allFixes.length;

  const now = Date.now();
  const day7 = new Date(now - 7 * 86_400_000).toISOString();
  const day30 = new Date(now - 30 * 86_400_000).toISOString();

  const newLast7 = allUsers.filter((u) => u.created_at >= day7).length;
  const newLast30 = allUsers.filter((u) => u.created_at >= day30).length;

  // Signups per day — last 30 days
  const days: string[] = [];
  for (let i = 29; i >= 0; i--) {
    days.push(dayKey(new Date(now - i * 86_400_000)));
  }

  const signupsByDay: Record<string, number> = {};
  for (const d of days) signupsByDay[d] = 0;
  for (const u of allUsers) {
    const d = u.created_at?.split("T")[0];
    if (d && signupsByDay[d] !== undefined) signupsByDay[d]++;
  }

  const fixesByDay: Record<string, number> = {};
  for (const d of days) fixesByDay[d] = 0;
  for (const f of allFixes) {
    const d = f.created_at?.split("T")[0];
    if (d && fixesByDay[d] !== undefined) fixesByDay[d]++;
  }

  const maxSignups = Math.max(1, ...Object.values(signupsByDay));
  const maxFixes = Math.max(1, ...Object.values(fixesByDay));

  // Affiliate breakdown
  const affBySlug: Record<string, { clicks: number; signups: number }> = {};
  for (const e of allEvents) {
    if (!affBySlug[e.slug]) affBySlug[e.slug] = { clicks: 0, signups: 0 };
    if (e.event === "click") affBySlug[e.slug].clicks++;
    if (e.event === "signup") affBySlug[e.slug].signups++;
  }
  const affRows = Object.entries(affBySlug)
    .map(([slug, counts]) => ({ slug, label: slugToLabel[slug] ?? slug, ...counts }))
    .sort((a, b) => b.clicks - a.clicks);

  // Top signup days
  const topDays = [...days]
    .map((d) => ({ d, count: signupsByDay[d] }))
    .filter((x) => x.count > 0)
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  return (
    <div className="min-h-screen" style={{ background: "var(--bg)", color: "var(--ink)" }}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12">

        <div className="mb-2">
          <Link href="/dashboard" className="font-mono text-xs hover:text-[var(--accent)] transition-colors" style={{ color: "var(--ink-faint)" }}>
            ← dashboard
          </Link>
        </div>
        <div className="flex items-center justify-between mb-8 flex-wrap gap-3">
          <div>
            <h1 className="font-display text-3xl mb-1" style={{ letterSpacing: "-0.03em" }}>Traffic</h1>
            <p className="font-sans text-sm" style={{ color: "var(--ink-muted)" }}>Real numbers. No fluff.</p>
          </div>
          <a
            href="https://vercel.com"
            target="_blank"
            rel="noopener noreferrer"
            className="font-mono text-xs px-3 py-1.5 rounded-full transition-all hover:opacity-80"
            style={{ background: CARD_BG, border: `1px solid ${CARD_BORDER}`, color: "var(--ink-muted)" }}
          >
            Vercel Analytics →
          </a>
        </div>

        {/* Top stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
          {[
            { label: "total users", value: totalUsers },
            { label: "new this week", value: newLast7, highlight: newLast7 > 0 },
            { label: "new this month", value: newLast30 },
            { label: "total fixes", value: totalFixes },
          ].map((s) => (
            <div key={s.label} className="rounded-2xl p-5" style={{ background: CARD_BG, border: `1px solid ${CARD_BORDER}` }}>
              <div
                className="font-display text-3xl font-medium tabular-nums mb-1"
                style={{ color: s.highlight ? TEAL : "var(--ink)" }}
              >
                {s.value}
              </div>
              <div className="font-mono text-[10px] uppercase tracking-widest" style={{ color: "#9A9A9A" }}>
                {s.label}
              </div>
            </div>
          ))}
        </div>

        {/* Signups chart — 30 days */}
        <div className="rounded-3xl p-5 sm:p-6 mb-6" style={{ background: CARD_BG, border: `1px solid ${CARD_BORDER}` }}>
          <div className="flex items-center justify-between mb-5">
            <p className="font-mono text-[10px] uppercase tracking-widest" style={{ color: "var(--ink-faint)" }}>
              signups · last 30 days
            </p>
            <span className="font-mono text-xs" style={{ color: TEAL }}>{newLast30} total</span>
          </div>
          <div className="flex items-end gap-1" style={{ height: 80 }}>
            {days.map((d) => {
              const count = signupsByDay[d];
              const pct = Math.max(2, (count / maxSignups) * 100);
              return (
                <div key={d} className="flex-1 flex flex-col items-center gap-1 h-full justify-end" title={`${formatDay(d)}: ${count} signups`}>
                  <div
                    className="w-full rounded-t transition-all"
                    style={{
                      height: `${pct}%`,
                      background: count > 0 ? TEAL : "var(--line)",
                      opacity: count > 0 ? 0.85 : 1,
                    }}
                  />
                </div>
              );
            })}
          </div>
          <div className="flex justify-between mt-2">
            <span className="font-mono text-[9px]" style={{ color: "var(--ink-faint)" }}>{formatDay(days[0])}</span>
            <span className="font-mono text-[9px]" style={{ color: "var(--ink-faint)" }}>{formatDay(days[days.length - 1])}</span>
          </div>
        </div>

        {/* Fixes created chart */}
        <div className="rounded-3xl p-5 sm:p-6 mb-6" style={{ background: CARD_BG, border: `1px solid ${CARD_BORDER}` }}>
          <div className="flex items-center justify-between mb-5">
            <p className="font-mono text-[10px] uppercase tracking-widest" style={{ color: "var(--ink-faint)" }}>
              fixes created · last 30 days
            </p>
          </div>
          <div className="flex items-end gap-1" style={{ height: 60 }}>
            {days.map((d) => {
              const count = fixesByDay[d];
              const pct = Math.max(2, (count / maxFixes) * 100);
              return (
                <div key={d} className="flex-1 h-full flex items-end" title={`${formatDay(d)}: ${count} fixes`}>
                  <div
                    className="w-full rounded-t"
                    style={{
                      height: `${pct}%`,
                      background: count > 0 ? "rgba(111,138,99,0.3)" : "transparent",
                    }}
                  />
                </div>
              );
            })}
          </div>
        </div>

        {/* Top signup days */}
        {topDays.length > 0 && (
          <div className="rounded-3xl p-5 sm:p-6 mb-6" style={{ background: CARD_BG, border: `1px solid ${CARD_BORDER}` }}>
            <p className="font-mono text-[10px] uppercase tracking-widest mb-4" style={{ color: "var(--ink-faint)" }}>
              best days (last 30)
            </p>
            <div className="flex flex-col gap-2">
              {topDays.map(({ d, count }) => (
                <div key={d} className="flex items-center gap-3">
                  <span className="font-mono text-xs w-20 shrink-0" style={{ color: "var(--ink-muted)" }}>{formatDay(d)}</span>
                  <div className="flex-1 h-2 rounded-full overflow-hidden" style={{ background: "var(--line)" }}>
                    <div className="h-full rounded-full" style={{ width: `${(count / topDays[0].count) * 100}%`, background: TEAL }} />
                  </div>
                  <span className="font-mono text-xs tabular-nums w-6 text-right" style={{ color: TEAL }}>{count}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Affiliate traffic */}
        {affRows.length > 0 && (
          <div className="rounded-3xl p-5 sm:p-6 mb-6" style={{ background: CARD_BG, border: `1px solid ${CARD_BORDER}` }}>
            <div className="flex items-center justify-between mb-4">
              <p className="font-mono text-[10px] uppercase tracking-widest" style={{ color: "var(--ink-faint)" }}>
                traffic by affiliate link
              </p>
              <Link href="/dashboard/affiliates" className="font-mono text-[10px] transition-colors hover:text-[var(--accent)]" style={{ color: "var(--ink-faint)" }}>
                manage →
              </Link>
            </div>
            <div className="flex flex-col gap-3">
              {affRows.map((row) => (
                <div key={row.slug} className="flex items-center gap-4">
                  <div className="flex-1 min-w-0">
                    <p className="font-sans text-sm truncate" style={{ color: "var(--ink-muted)" }}>{row.label}</p>
                    <p className="font-mono text-[10px]" style={{ color: "var(--ink-faint)" }}>/r/{row.slug}</p>
                  </div>
                  <div className="flex gap-4 shrink-0 text-right">
                    <div>
                      <div className="font-display text-lg tabular-nums" style={{ color: "var(--ink)" }}>{row.clicks}</div>
                      <div className="font-mono text-[9px] uppercase" style={{ color: "#9A9A9A" }}>clicks</div>
                    </div>
                    <div>
                      <div className="font-display text-lg tabular-nums" style={{ color: row.signups > 0 ? TEAL : "var(--ink)" }}>{row.signups}</div>
                      <div className="font-mono text-[9px] uppercase" style={{ color: "#9A9A9A" }}>signups</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Link to Vercel for page-level data */}
        <div className="rounded-3xl p-5 text-center" style={{ background: "var(--accent-soft)", border: "1px solid var(--accent-soft)" }}>
          <p className="font-sans text-sm mb-2" style={{ color: "var(--ink-muted)" }}>
            For page views, bounce rate, countries, and devices —
          </p>
          <a
            href="https://vercel.com"
            target="_blank"
            rel="noopener noreferrer"
            className="font-mono text-sm font-semibold transition-colors hover:opacity-80"
            style={{ color: TEAL }}
          >
            Vercel Analytics dashboard →
          </a>
        </div>

      </div>
    </div>
  );
}
