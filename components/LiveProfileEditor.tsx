"use client";

import { useRef, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { SocialChips } from "@/components/SocialChips";
import { hexToRgba } from "@/lib/accent";

const TEAL = "#5EEAD4";
const NOISE_URL =
  "url(\"data:image/svg+xml;utf8,<svg viewBox='0 0 240 240' xmlns='http://www.w3.org/2000/svg'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 0.55 0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>\")";

function PencilIcon({ size = 11 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M12 20h9" />
      <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4z" />
    </svg>
  );
}

function CameraIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
      <circle cx="12" cy="13" r="4" />
    </svg>
  );
}

type Props = {
  userId: string;
  displayName: string;
  setDisplayName: (s: string) => void;
  username: string;
  setUsername: (s: string) => void;
  bio: string;
  setBio: (s: string) => void;
  socialLink: string;
  setSocialLink: (s: string) => void;
  avatarUrl: string;
  setAvatarUrl: (s: string) => void;
  bannerUrl: string;
  setBannerUrl: (s: string) => void;
  accent: string;
  isPro: boolean;
};

type EditingField = null | "displayName" | "username" | "bio" | "socialLink";

export function LiveProfileEditor({
  userId,
  displayName,
  setDisplayName,
  username,
  setUsername,
  bio,
  setBio,
  socialLink,
  setSocialLink,
  avatarUrl,
  setAvatarUrl,
  bannerUrl,
  setBannerUrl,
  accent,
  isPro,
}: Props) {
  const avatarInputRef = useRef<HTMLInputElement>(null);
  const bannerInputRef = useRef<HTMLInputElement>(null);
  const [editing, setEditing] = useState<EditingField>(null);
  const [uploading, setUploading] = useState<null | "avatar" | "banner">(null);

  async function uploadFile(file: File, bucket: "avatars" | "banners", kind: "avatar" | "banner") {
    setUploading(kind);
    try {
      const supabase = createClient();
      const ext = file.name.split(".").pop() ?? "jpg";
      const path = `${userId}/${Date.now()}.${ext}`;
      const { error } = await supabase.storage.from(bucket).upload(path, file, { upsert: true });
      if (error) return;
      const { data } = supabase.storage.from(bucket).getPublicUrl(path);
      const publicUrl = data.publicUrl;
      const column = kind === "avatar" ? "avatar_url" : "banner_url";
      await supabase.from("profiles").update({ [column]: publicUrl }).eq("id", userId);
      if (kind === "avatar") setAvatarUrl(publicUrl);
      else setBannerUrl(publicUrl);
    } finally {
      setUploading(null);
    }
  }

  const initials = displayName.slice(0, 2).toUpperCase() || "??";

  return (
    <div>
      <p className="font-sans text-[11px] font-semibold uppercase tracking-widest mb-3" style={{ color: "rgba(244,244,244,0.25)" }}>
        Live preview — click anything to edit
      </p>

      {/* Banner */}
      <div
        className="relative overflow-hidden rounded-3xl group cursor-pointer transition-all"
        style={{
          height: "clamp(220px, 36vw, 320px)",
          ...(bannerUrl
            ? {
                backgroundImage: `url(${bannerUrl})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }
            : {
                background: `radial-gradient(ellipse 90% 100% at 50% 110%, ${accent} 0%, ${hexToRgba(accent, 0.55)} 18%, ${hexToRgba(accent, 0.16)} 38%, ${hexToRgba(accent, 0.04)} 58%, #070708 80%)`,
              }),
          border: "1px solid rgba(255,255,255,0.06)",
        }}
        onClick={() => bannerInputRef.current?.click()}
      >
        <div
          aria-hidden
          className="absolute inset-0 pointer-events-none mix-blend-overlay"
          style={{ backgroundImage: NOISE_URL, backgroundSize: "200px 200px", opacity: 0.45 }}
        />
        <div
          aria-hidden
          className="absolute inset-0 pointer-events-none"
          style={{ background: "linear-gradient(180deg, transparent 0%, transparent 35%, rgba(7,7,8,0.45) 75%, rgba(7,7,8,0.85) 100%)" }}
        />

        {/* "Change banner" hover overlay */}
        <div
          className="absolute top-3 right-3 inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 font-mono text-[10px] uppercase tracking-widest transition-all opacity-100 sm:opacity-0 group-hover:opacity-100"
          style={{
            background: "rgba(7,7,8,0.7)",
            border: "1px solid rgba(94,234,212,0.3)",
            color: TEAL,
            backdropFilter: "blur(8px)",
          }}
        >
          <CameraIcon size={12} />
          {uploading === "banner" ? "uploading…" : bannerUrl ? "change banner" : "upload banner"}
        </div>

        {/* Bottom overlay — avatar + name + username */}
        <div className="absolute inset-x-0 bottom-0 px-5 sm:px-8 pb-5 sm:pb-7 flex items-end gap-4 sm:gap-5">
          {/* Avatar */}
          <div
            className="relative shrink-0 group/avatar cursor-pointer"
            onClick={(e) => {
              e.stopPropagation();
              avatarInputRef.current?.click();
            }}
          >
            {isPro && (
              <div
                className="absolute -inset-2 rounded-full pointer-events-none"
                style={{
                  background: `radial-gradient(circle, ${hexToRgba(accent, 0.5)} 0%, transparent 70%)`,
                  filter: "blur(8px)",
                }}
              />
            )}
            {avatarUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={avatarUrl}
                alt={displayName}
                className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-full object-cover"
                style={{
                  border: `3px solid #070708`,
                  boxShadow: `0 4px 16px rgba(0,0,0,0.6)`,
                }}
              />
            ) : (
              <div
                className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-full flex items-center justify-center font-display font-semibold"
                style={{
                  background: `${accent}22`,
                  border: `3px solid #070708`,
                  boxShadow: `0 4px 16px rgba(0,0,0,0.6)`,
                  color: accent,
                  fontSize: 24,
                }}
              >
                {initials}
              </div>
            )}
            {/* Avatar camera badge */}
            <div
              className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full flex items-center justify-center transition-all opacity-100 group-hover/avatar:scale-110"
              style={{
                background: TEAL,
                color: "#070708",
                border: "2px solid #070708",
                boxShadow: "0 2px 8px rgba(0,0,0,0.5)",
              }}
              aria-label="Change avatar"
            >
              <CameraIcon size={12} />
            </div>
          </div>

          <div className="flex-1 min-w-0" onClick={(e) => e.stopPropagation()}>
            {/* Display name — inline edit */}
            {editing === "displayName" ? (
              <input
                autoFocus
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                onBlur={() => setEditing(null)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === "Escape") setEditing(null);
                }}
                className="font-display bg-transparent border-b outline-none w-full"
                style={{
                  fontSize: "clamp(24px, 5vw, 36px)",
                  fontWeight: 600,
                  color: "#F4F4F4",
                  letterSpacing: "-0.02em",
                  lineHeight: 1,
                  borderColor: TEAL,
                  caretColor: TEAL,
                }}
              />
            ) : (
              <button
                type="button"
                onClick={() => setEditing("displayName")}
                className="group/name relative font-display text-left transition-colors hover:text-[#5EEAD4]"
                style={{
                  fontSize: "clamp(24px, 5vw, 36px)",
                  fontWeight: 600,
                  color: "#F4F4F4",
                  letterSpacing: "-0.02em",
                  lineHeight: 1,
                  textShadow: "0 2px 16px rgba(0,0,0,0.5)",
                }}
              >
                {displayName || <span style={{ color: "rgba(255,255,255,0.4)" }}>your name</span>}
                <span
                  className="ml-2 inline-flex items-center opacity-0 group-hover/name:opacity-100 transition-opacity"
                  style={{ color: TEAL, verticalAlign: "middle" }}
                >
                  <PencilIcon size={12} />
                </span>
              </button>
            )}

            {/* Username — inline edit */}
            {editing === "username" ? (
              <input
                autoFocus
                value={username}
                onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ""))}
                onBlur={() => setEditing(null)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === "Escape") setEditing(null);
                }}
                className="font-mono bg-transparent border-b outline-none mt-1 w-full"
                style={{
                  fontSize: 13,
                  color: TEAL,
                  borderColor: TEAL,
                  caretColor: TEAL,
                }}
              />
            ) : (
              <button
                type="button"
                onClick={() => setEditing("username")}
                className="font-mono mt-1 inline-flex items-center gap-1.5 transition-colors hover:opacity-80 group/handle"
                style={{
                  fontSize: 13,
                  color: isPro ? accent : "rgba(94,234,212,0.7)",
                  textShadow: "0 1px 8px rgba(0,0,0,0.5)",
                }}
              >
                @{username || <span style={{ opacity: 0.5 }}>your-handle</span>}
                <span className="opacity-0 group-hover/handle:opacity-60 transition-opacity">
                  <PencilIcon />
                </span>
              </button>
            )}
          </div>
        </div>
      </div>

      <input
        ref={avatarInputRef}
        type="file"
        accept="image/*"
        className="sr-only"
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) uploadFile(f, "avatars", "avatar");
        }}
      />
      <input
        ref={bannerInputRef}
        type="file"
        accept="image/*"
        className="sr-only"
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) uploadFile(f, "banners", "banner");
        }}
      />

      {/* Bio — inline editable below banner */}
      <div className="mt-5">
        {editing === "bio" ? (
          <textarea
            autoFocus
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            onBlur={() => setEditing(null)}
            onKeyDown={(e) => {
              if (e.key === "Escape") setEditing(null);
            }}
            placeholder="add a short bio…"
            rows={3}
            className="w-full text-sm font-sans rounded-2xl px-4 py-3 outline-none resize-none"
            style={{
              background: "rgba(255,255,255,0.04)",
              border: `1px solid ${TEAL}`,
              color: "rgba(255,255,255,0.85)",
              lineHeight: 1.6,
              caretColor: TEAL,
            }}
            maxLength={200}
          />
        ) : (
          <button
            type="button"
            onClick={() => setEditing("bio")}
            className="group/bio relative w-full text-left rounded-2xl px-4 py-3 transition-all hover:bg-[rgba(255,255,255,0.03)]"
            style={{
              background: bio ? "transparent" : "rgba(255,255,255,0.02)",
              border: bio ? "1px solid transparent" : "1px dashed rgba(255,255,255,0.1)",
            }}
          >
            <p className="text-sm font-sans leading-relaxed" style={{ color: bio ? "rgba(255,255,255,0.7)" : "rgba(255,255,255,0.35)" }}>
              {bio || "add a short bio…"}
            </p>
            <span
              className="absolute top-2 right-3 inline-flex items-center opacity-0 group-hover/bio:opacity-60 transition-opacity"
              style={{ color: TEAL }}
            >
              <PencilIcon />
            </span>
          </button>
        )}
      </div>

      {/* Social link — inline editable */}
      <div className="mt-3">
        {editing === "socialLink" ? (
          <input
            autoFocus
            value={socialLink}
            onChange={(e) => setSocialLink(e.target.value)}
            onBlur={() => setEditing(null)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === "Escape") setEditing(null);
            }}
            placeholder="https://instagram.com/you, https://tiktok.com/@you, …"
            className="w-full text-sm font-sans rounded-2xl px-4 py-3 outline-none"
            style={{
              background: "rgba(255,255,255,0.04)",
              border: `1px solid ${TEAL}`,
              color: "rgba(255,255,255,0.85)",
              caretColor: TEAL,
            }}
          />
        ) : socialLink ? (
          <button
            type="button"
            onClick={() => setEditing("socialLink")}
            className="group/social relative w-full text-left rounded-2xl px-1 py-1 transition-all"
          >
            <SocialChips socialLink={socialLink} />
            <span
              className="absolute top-1 right-2 inline-flex items-center opacity-0 group-hover/social:opacity-60 transition-opacity"
              style={{ color: TEAL }}
            >
              <PencilIcon />
            </span>
          </button>
        ) : (
          <button
            type="button"
            onClick={() => setEditing("socialLink")}
            className="group/social w-full text-left rounded-2xl px-4 py-3 transition-all hover:bg-[rgba(255,255,255,0.03)]"
            style={{
              background: "rgba(255,255,255,0.02)",
              border: "1px dashed rgba(255,255,255,0.1)",
            }}
          >
            <p className="text-sm font-sans" style={{ color: "rgba(255,255,255,0.35)" }}>
              add your socials — instagram, tiktok, youtube, x… (comma-separated)
            </p>
          </button>
        )}
      </div>

      <p className="font-mono text-[10px] mt-4" style={{ color: "rgba(244,244,244,0.25)" }}>
        changes save when you hit save below
      </p>
    </div>
  );
}
