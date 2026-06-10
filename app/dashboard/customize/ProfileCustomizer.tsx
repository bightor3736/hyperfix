"use client";

import { useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { ACCENT_PRESETS, DEFAULT_ACCENT, isValidAccent, hexToRgba } from "@/lib/accent";
import { PROFILE_THEMES, getProfileTheme } from "@/lib/profile-themes";
import { SocialChips } from "@/components/SocialChips";
import { Check, Lock, Loader2, ExternalLink, Sparkles } from "lucide-react";

interface ProfileRow {
  id: string;
  username: string | null;
  display_name: string | null;
  avatar_url: string | null;
  bio: string | null;
  banner_url: string | null;
  is_pro: boolean | null;
  accent_color: string | null;
  social_link: string | null;
  pronouns: string | null;
  status_emoji: string | null;
  status_text: string | null;
  socials: Record<string, string> | null;
  profile_theme: string | null;
}

const SOCIAL_FIELDS: { key: string; label: string; placeholder: string }[] = [
  { key: "instagram", label: "Instagram", placeholder: "https://instagram.com/you" },
  { key: "tiktok", label: "TikTok", placeholder: "https://tiktok.com/@you" },
  { key: "twitter", label: "X / Twitter", placeholder: "https://x.com/you" },
  { key: "youtube", label: "YouTube", placeholder: "https://youtube.com/@you" },
  { key: "github", label: "GitHub", placeholder: "https://github.com/you" },
  { key: "discord", label: "Discord", placeholder: "https://discord.gg/invite" },
  { key: "website", label: "Website", placeholder: "https://yoursite.com" },
];

const STATUS_EMOJIS = ["🎯", "🔥", "🧠", "☕", "🎧", "🌙", "✨", "📚", "💤", "🚀", "🐢", "🫠"];

function Card({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-2xl p-5 mb-4" style={{ background: "var(--bg-elevated)", border: "1px solid var(--line)" }}>
      {children}
    </div>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return <p className="font-mono text-[11px] uppercase tracking-widest mb-3" style={{ color: "var(--ink-faint)" }}>{children}</p>;
}

export function ProfileCustomizer({ profile }: { profile: ProfileRow | null }) {
  const isPro = !!profile?.is_pro;
  const [accent, setAccent] = useState(isValidAccent(profile?.accent_color) ? profile!.accent_color! : DEFAULT_ACCENT);
  const [themeId, setThemeId] = useState(profile?.profile_theme ?? "aurora");
  const [statusEmoji, setStatusEmoji] = useState(profile?.status_emoji ?? "");
  const [statusText, setStatusText] = useState(profile?.status_text ?? "");
  const [pronouns, setPronouns] = useState(profile?.pronouns ?? "");
  const [socials, setSocials] = useState<Record<string, string>>(profile?.socials ?? {});
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const displayName = profile?.display_name || profile?.username || "You";
  const theme = getProfileTheme(themeId);
  const themeBg = (theme.pro && !isPro ? getProfileTheme("aurora") : theme).background(accent);

  const socialList = [profile?.social_link ?? "", ...Object.values(socials).filter(Boolean)].filter(Boolean).join(",");

  async function save() {
    if (!profile) return;
    setSaving(true);
    setError(null);
    try {
      // Don't let a free user save a Pro-only theme.
      const safeTheme = theme.pro && !isPro ? "aurora" : themeId;
      const cleanSocials = Object.fromEntries(Object.entries(socials).filter(([, v]) => v && v.trim()));
      const supabase = createClient();
      const { error: err } = await supabase
        .from("profiles")
        .update({
          accent_color: accent,
          profile_theme: safeTheme,
          status_emoji: statusEmoji.trim() || null,
          status_text: statusText.trim() || null,
          pronouns: pronouns.trim() || null,
          socials: cleanSocials,
        })
        .eq("id", profile.id);
      if (err) { setError(err.message); return; }
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch {
      setError("Couldn't save. Try again.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div>
      {/* Live preview */}
      <div className="rounded-2xl overflow-hidden mb-5" style={{ border: "1px solid var(--line)" }}>
        <div className="relative px-6 pt-10 pb-6 flex flex-col items-center text-center" style={{ background: themeBg }}>
          {profile?.banner_url && (
            <div className="absolute inset-x-0 top-0 h-20" style={{ backgroundImage: `url(${profile.banner_url})`, backgroundSize: "cover", backgroundPosition: "center", opacity: 0.55, maskImage: "linear-gradient(180deg, #000, transparent)" }} />
          )}
          <div className="relative">
            {profile?.avatar_url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={profile.avatar_url} alt={displayName} className="w-20 h-20 rounded-full object-cover" style={{ border: "2px solid var(--bg)" }} />
            ) : (
              <div className="w-20 h-20 rounded-full flex items-center justify-center font-display font-semibold" style={{ background: hexToRgba(accent, 0.16), color: accent, border: `1px solid ${hexToRgba(accent, 0.3)}`, fontSize: 26 }}>
                {displayName.slice(0, 2).toUpperCase()}
              </div>
            )}
          </div>
          <h2 className="font-display mt-3" style={{ fontSize: 26, fontWeight: 600, color: "var(--ink)", letterSpacing: "-0.02em" }}>{displayName}</h2>
          <p className="font-mono text-[12px] mt-1 inline-flex items-center gap-2" style={{ color: "var(--ink-muted)" }}>
            @{profile?.username ?? "you"}
            {pronouns && <span className="rounded-full px-1.5 py-0.5 text-[10px]" style={{ background: "var(--line)" }}>{pronouns}</span>}
          </p>
          {(statusEmoji || statusText) && (
            <div className="inline-flex items-center gap-2 rounded-full px-3 py-1.5 mt-3" style={{ background: hexToRgba(accent, 0.10), border: `1px solid ${hexToRgba(accent, 0.22)}` }}>
              {statusEmoji && <span className="text-[14px] leading-none">{statusEmoji}</span>}
              {statusText && <span className="font-sans text-[12px]" style={{ color: "var(--ink-muted)" }}>{statusText}</span>}
            </div>
          )}
          {socialList && <div className="mt-4"><SocialChips socialLink={socialList} /></div>}
        </div>
      </div>

      {/* Theme */}
      <Card>
        <SectionLabel>Theme</SectionLabel>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          {PROFILE_THEMES.map((t) => {
            const locked = t.pro && !isPro;
            const active = themeId === t.id;
            return (
              <button
                key={t.id}
                onClick={() => { if (!locked) setThemeId(t.id); }}
                className="relative rounded-xl overflow-hidden h-16 transition-all"
                style={{ background: t.background(accent), border: `2px solid ${active ? accent : "var(--line)"}`, opacity: locked ? 0.55 : 1 }}
              >
                <span className="absolute bottom-1 left-1.5 font-sans text-[11px] font-semibold" style={{ color: "var(--ink)", textShadow: "0 1px 4px rgba(0,0,0,0.7)" }}>{t.name}</span>
                {active && <span className="absolute top-1 right-1"><Check size={14} style={{ color: accent }} /></span>}
                {locked && <span className="absolute top-1 right-1"><Lock size={12} style={{ color: "var(--ink-muted)" }} /></span>}
                {t.pro && <span className="absolute top-1 left-1.5 inline-flex items-center gap-0.5 font-mono text-[8px] uppercase tracking-widest" style={{ color: hexToRgba(accent, 0.9) }}><Sparkles size={8} /> pro</span>}
              </button>
            );
          })}
        </div>
      </Card>

      {/* Accent */}
      <Card>
        <SectionLabel>Accent colour</SectionLabel>
        <div className="flex flex-wrap items-center gap-2.5">
          {ACCENT_PRESETS.map((p) => (
            <button
              key={p.hex}
              onClick={() => setAccent(p.hex)}
              aria-label={p.name}
              className="w-8 h-8 rounded-full transition-transform hover:scale-110"
              style={{ background: p.hex, border: accent.toUpperCase() === p.hex.toUpperCase() ? "1px solid var(--line)" : "2px solid transparent", boxShadow: `0 0 12px ${hexToRgba(p.hex, 0.5)}` }}
            />
          ))}
          <label className="inline-flex items-center gap-2 ml-1 cursor-pointer">
            <input type="color" value={accent} onChange={(e) => setAccent(e.target.value.toUpperCase())} className="w-8 h-8 rounded-full cursor-pointer bg-transparent" style={{ border: "1px solid var(--line)" }} />
            <span className="font-mono text-[11px]" style={{ color: "var(--ink-muted)" }}>{accent}</span>
          </label>
        </div>
      </Card>

      {/* Status */}
      <Card>
        <SectionLabel>Status</SectionLabel>
        <div className="flex flex-wrap gap-1.5 mb-3">
          {STATUS_EMOJIS.map((e) => (
            <button key={e} onClick={() => setStatusEmoji(statusEmoji === e ? "" : e)} className="w-9 h-9 rounded-lg text-[18px] transition-all" style={{ background: statusEmoji === e ? hexToRgba(accent, 0.16) : "var(--line)", border: `1px solid ${statusEmoji === e ? hexToRgba(accent, 0.4) : "transparent"}` }}>{e}</button>
          ))}
        </div>
        <input
          value={statusText}
          onChange={(e) => setStatusText(e.target.value.slice(0, 60))}
          placeholder="what are you up to?"
          className="w-full rounded-xl px-3.5 py-2.5 font-sans text-[14px] outline-none"
          style={{ background: "var(--bg)", border: "1px solid var(--line)", color: "var(--ink)" }}
        />
      </Card>

      {/* Pronouns */}
      <Card>
        <SectionLabel>Pronouns</SectionLabel>
        <div className="flex flex-wrap gap-1.5 mb-3">
          {["she/her", "he/him", "they/them", "she/they", "he/they", "any"].map((p) => (
            <button key={p} onClick={() => setPronouns(pronouns === p ? "" : p)} className="px-3 py-1.5 rounded-full font-sans text-[12px] font-medium transition-all" style={{ background: pronouns === p ? hexToRgba(accent, 0.16) : "var(--line)", color: pronouns === p ? accent : "var(--ink-muted)", border: `1px solid ${pronouns === p ? hexToRgba(accent, 0.4) : "transparent"}` }}>{p}</button>
          ))}
        </div>
        <input
          value={pronouns}
          onChange={(e) => setPronouns(e.target.value.slice(0, 24))}
          placeholder="custom pronouns…"
          className="w-full rounded-xl px-3.5 py-2.5 font-sans text-[14px] outline-none"
          style={{ background: "var(--bg)", border: "1px solid var(--line)", color: "var(--ink)" }}
        />
      </Card>

      {/* Socials */}
      <Card>
        <SectionLabel>Connections</SectionLabel>
        <div className="flex flex-col gap-2">
          {SOCIAL_FIELDS.map((f) => (
            <div key={f.key} className="flex items-center gap-3">
              <span className="font-sans text-[12px] font-medium w-20 shrink-0" style={{ color: "var(--ink-muted)" }}>{f.label}</span>
              <input
                value={socials[f.key] ?? ""}
                onChange={(e) => setSocials((s) => ({ ...s, [f.key]: e.target.value }))}
                placeholder={f.placeholder}
                className="flex-1 rounded-lg px-3 py-2 font-sans text-[13px] outline-none"
                style={{ background: "var(--bg)", border: "1px solid var(--line)", color: "var(--ink)" }}
              />
            </div>
          ))}
        </div>
      </Card>

      {error && <p className="font-sans text-[13px] mb-3" style={{ color: "#fca5a5" }}>{error}</p>}

      <div className="flex items-center gap-3 sticky bottom-4 z-10">
        <button
          onClick={save}
          disabled={saving}
          className="press-pop flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl font-sans text-[15px] font-bold transition-all disabled:opacity-60"
          style={{ background: saved ? "#5eead4" : "var(--invert-bg)", color: saved ? "#0f0d40" : "var(--invert-ink)", boxShadow: "0 8px 32px rgba(0,0,0,0.35)" }}
        >
          {saving ? <Loader2 size={16} className="animate-spin" /> : saved ? <Check size={16} strokeWidth={2.5} /> : null}
          {saving ? "Saving…" : saved ? "Saved" : "Save profile"}
        </button>
        {profile?.username && (
          <Link
            href={`/u/${profile.username}`}
            target="_blank"
            className="press-pop inline-flex items-center gap-2 px-4 py-3 rounded-2xl font-sans text-[14px] font-semibold"
            style={{ background: "var(--bg-elevated)", border: "1px solid var(--line)", color: "var(--ink)" }}
          >
            <ExternalLink size={15} /> View
          </Link>
        )}
      </div>

      {!isPro && (
        <p className="font-sans text-[12px] text-center mt-4" style={{ color: "var(--ink-faint)" }}>
          Premium themes (Nebula, Ember) and animated effects unlock with Pro.
        </p>
      )}
    </div>
  );
}
