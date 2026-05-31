import { createClient } from "@/lib/supabase/server";
import { createClient as createAdmin } from "@supabase/supabase-js";
import { redirect } from "next/navigation";
import Link from "next/link";
import { AffiliateManager } from "./AffiliateManager";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Affiliates · Hyperfix" };

const TEAL = "var(--accent)";

function adminSupabase() {
  return createAdmin(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

export default async function AffiliatesPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/auth/login");

  const adminEmail = process.env.ADMIN_EMAIL;
  if (!adminEmail || user.email !== adminEmail) redirect("/dashboard");

  const admin = adminSupabase();

  const { data: links } = await admin
    .from("aff_links")
    .select("id, slug, label, redirect_url, created_at")
    .order("created_at", { ascending: false });

  const { data: events } = await admin
    .from("aff_events")
    .select("slug, event");

  const counts: Record<string, { clicks: number; signups: number; pro: number }> = {};
  for (const e of events ?? []) {
    if (!counts[e.slug]) counts[e.slug] = { clicks: 0, signups: 0, pro: 0 };
    if (e.event === "click") counts[e.slug].clicks++;
    if (e.event === "signup") counts[e.slug].signups++;
    if (e.event === "pro") counts[e.slug].pro++;
  }

  const rows = (links ?? []).map((l: { id: string; slug: string; label: string; redirect_url: string | null; created_at: string }) => ({
    ...l,
    ...(counts[l.slug] ?? { clicks: 0, signups: 0, pro: 0 }),
  }));

  const totalClicks = Object.values(counts).reduce((s, c) => s + c.clicks, 0);
  const totalSignups = Object.values(counts).reduce((s, c) => s + c.signups, 0);

  return (
    <div className="min-h-screen" style={{ background: "var(--bg)", color: "var(--ink)" }}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12">

        <div className="mb-2">
          <Link href="/dashboard" className="font-mono text-xs hover:text-[var(--accent)] transition-colors" style={{ color: "var(--ink-faint)" }}>
            ← dashboard
          </Link>
        </div>

        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-display text-3xl font-semibold mb-1" style={{ letterSpacing: "-0.03em" }}>Affiliates</h1>
            <p className="font-sans text-sm" style={{ color: "var(--ink-muted)" }}>
              Track every link, click, and signup.
            </p>
          </div>
        </div>

        {/* Summary */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-8">
          {[
            { label: "total links", value: rows.length },
            { label: "total clicks", value: totalClicks },
            { label: "total signups", value: totalSignups },
          ].map((s) => (
            <div key={s.label} className="rounded-2xl p-5" style={{ background: "var(--bg)", border: "1px solid var(--line)" }}>
              <div className="font-display text-3xl font-medium mb-1" style={{ color: "var(--ink)" }}>{s.value}</div>
              <div className="font-mono text-[10px] uppercase tracking-widest" style={{ color: "#9A9A9A" }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Manager (create + table) */}
        <AffiliateManager initialRows={rows} />
      </div>
    </div>
  );
}
