"use client";

import { useState, useTransition } from "react";
import { createClient } from "@/lib/supabase/client";

const TEAL = "var(--accent)";
const CARD_BG = "var(--bg)";
const CARD_BORDER = "var(--line)";

type Row = {
  id: string;
  slug: string;
  label: string;
  redirect_url: string | null;
  created_at: string;
  clicks: number;
  signups: number;
  pro: number;
};

function conversionRate(clicks: number, signups: number) {
  if (clicks === 0) return "—";
  return `${((signups / clicks) * 100).toFixed(1)}%`;
}

export function AffiliateManager({ initialRows }: { initialRows: Row[] }) {
  const [rows, setRows] = useState<Row[]>(initialRows);
  const [slug, setSlug] = useState("");
  const [label, setLabel] = useState("");
  const [redirectUrl, setRedirectUrl] = useState("/");
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const [copied, setCopied] = useState<string | null>(null);

  const origin = typeof window !== "undefined" ? window.location.origin : "https://hyperfix.app";

  function handleCopy(slug: string) {
    navigator.clipboard.writeText(`${origin}/r/${slug}`);
    setCopied(slug);
    setTimeout(() => setCopied(null), 2000);
  }

  function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!slug.trim() || !label.trim()) return;
    const cleanSlug = slug.trim().toLowerCase().replace(/[^a-z0-9-_]/g, "");
    if (!cleanSlug) { setError("Slug can only contain letters, numbers, hyphens."); return; }

    startTransition(async () => {
      const supabase = createClient();
      const { data, error: err } = await supabase
        .from("aff_links")
        .insert({ slug: cleanSlug, label: label.trim(), redirect_url: redirectUrl.trim() || "/" })
        .select()
        .single();

      if (err) { setError(err.message); return; }
      setRows((prev) => [{ ...data, clicks: 0, signups: 0, pro: 0 }, ...prev]);
      setSlug(""); setLabel(""); setRedirectUrl("/");
    });
  }

  async function handleDelete(id: string, rowSlug: string) {
    const supabase = createClient();
    await supabase.from("aff_links").delete().eq("id", id);
    setRows((prev) => prev.filter((r) => r.id !== id));
  }

  const inputStyle = {
    background: "transparent",
    border: "1px solid var(--line)",
    color: "var(--ink)",
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Create form */}
      <div className="rounded-3xl p-5 sm:p-6" style={{ background: CARD_BG, border: `1px solid ${CARD_BORDER}` }}>
        <p className="font-mono text-[10px] uppercase tracking-widest mb-4" style={{ color: "var(--ink-faint)" }}>
          create new link
        </p>
        <form onSubmit={handleCreate} className="flex flex-col sm:flex-row gap-3">
          <input
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            placeholder="Label (e.g. TikTok creator @sarah)"
            className="flex-1 rounded-xl px-4 py-2.5 font-sans text-sm outline-none focus:ring-2 focus:ring-[var(--accent)]/35 placeholder:text-[var(--ink-faint)]"
            style={inputStyle}
            required
          />
          <input
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            placeholder="slug (e.g. tiktok-sarah)"
            className="w-full sm:w-44 rounded-xl px-4 py-2.5 font-sans text-sm outline-none focus:ring-2 focus:ring-[var(--accent)]/35 placeholder:text-[var(--ink-faint)] font-mono"
            style={inputStyle}
            required
          />
          <input
            value={redirectUrl}
            onChange={(e) => setRedirectUrl(e.target.value)}
            placeholder="Redirect (default: /)"
            className="w-full sm:w-40 rounded-xl px-4 py-2.5 font-sans text-sm outline-none focus:ring-2 focus:ring-[var(--accent)]/35 placeholder:text-[var(--ink-faint)]"
            style={inputStyle}
          />
          <button
            type="submit"
            disabled={pending}
            className="px-5 py-2.5 rounded-xl font-sans text-sm font-semibold transition-all hover:opacity-90 active:scale-95 disabled:opacity-50 whitespace-nowrap"
            style={{ background: TEAL, color: "#0A1F1C" }}
          >
            {pending ? "Creating…" : "Create"}
          </button>
        </form>
        {error && <p className="font-sans text-xs mt-2" style={{ color: "#fda4af" }}>{error}</p>}
      </div>

      {/* Links table */}
      {rows.length === 0 ? (
        <div className="rounded-3xl p-10 text-center" style={{ background: CARD_BG, border: `1px solid ${CARD_BORDER}` }}>
          <p className="font-sans text-sm" style={{ color: "var(--ink-faint)" }}>No links yet. Create one above.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {rows.map((row) => (
            <div
              key={row.id}
              className="rounded-3xl p-5"
              style={{ background: CARD_BG, border: `1px solid ${CARD_BORDER}` }}
            >
              <div className="flex items-start justify-between gap-4 mb-3">
                <div className="flex-1 min-w-0">
                  <p className="font-sans text-sm font-semibold mb-0.5" style={{ color: "var(--ink)" }}>{row.label}</p>
                  <button
                    onClick={() => handleCopy(row.slug)}
                    className="font-mono text-xs transition-colors hover:text-[var(--accent)]"
                    style={{ color: copied === row.slug ? TEAL : "var(--ink-muted)" }}
                  >
                    {origin}/r/{row.slug} {copied === row.slug ? "✓ copied" : "— click to copy"}
                  </button>
                </div>
                <button
                  onClick={() => handleDelete(row.id, row.slug)}
                  className="shrink-0 p-1.5 rounded-lg transition-opacity hover:opacity-70"
                  style={{ color: "var(--ink-faint)" }}
                  aria-label="Delete"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                    <path d="M18 6 6 18M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="grid grid-cols-3 gap-3">
                {[
                  { label: "clicks", value: row.clicks },
                  { label: "signups", value: row.signups },
                  { label: "conversion", value: conversionRate(row.clicks, row.signups) },
                ].map((s) => (
                  <div key={s.label} className="rounded-xl p-3 text-center" style={{ background: "transparent", border: "1px solid var(--line)" }}>
                    <div className="font-display text-xl font-medium tabular-nums" style={{ color: s.label === "signups" && row.signups > 0 ? TEAL : "var(--ink)" }}>
                      {s.value}
                    </div>
                    <div className="font-mono text-[9px] uppercase tracking-widest mt-0.5" style={{ color: "#9A9A9A" }}>
                      {s.label}
                    </div>
                  </div>
                ))}
              </div>

              <p className="font-mono text-[10px] mt-3" style={{ color: "var(--ink-faint)" }}>
                → redirects to {row.redirect_url ?? "/"} · created {new Date(row.created_at).toLocaleDateString()}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
