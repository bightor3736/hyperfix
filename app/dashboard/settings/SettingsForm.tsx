"use client";

import { useState, useRef, useEffect, useCallback, useTransition } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Send } from "react-iconly";
import { ACCENT_PRESETS, DEFAULT_ACCENT, resolveAccent } from "@/lib/accent";
import { ProUpsellModal } from "@/components/ProUpsell";
import { LiveProfileEditor } from "@/components/LiveProfileEditor";
import { PushToggle } from "@/components/PushToggle";
import { useToast } from "@/components/Toast";

type Profile = {
  id: string;
  display_name: string | null;
  username: string | null;
  bio: string | null;
  avatar_url: string | null;
  banner_url?: string | null;
  accent_color?: string | null;
  is_public: boolean | null;
  is_pro?: boolean | null;
  referral_code?: string | null;
  referral_count?: number | null;
  notification_prefs?: Record<string, boolean> | null;
  social_link?: string | null;
} | null;

type Props = {
  profile: Profile;
  userEmail: string;
  userId: string;
};

export function SettingsForm({ profile, userEmail, userId }: Props) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const { toast: showToast } = useToast();

  // Form state
  const [displayName, setDisplayName] = useState(profile?.display_name ?? "");
  const [username, setUsername] = useState(profile?.username ?? "");
  const [bio, setBio] = useState(profile?.bio ?? "");
  const [socialLink, setSocialLink] = useState(profile?.social_link ?? "");
  const [isPublic, setIsPublic] = useState(profile?.is_public ?? false);
  const [avatarUrl, setAvatarUrl] = useState(profile?.avatar_url ?? "");

  // Notification prefs
  const notifPrefs = profile?.notification_prefs ?? {};
  const [notifStreak, setNotifStreak] = useState<boolean>(notifPrefs.streak_reminders !== false);
  const [notifMilestones, setNotifMilestones] = useState<boolean>(notifPrefs.milestones !== false);
  const [notifDigest, setNotifDigest] = useState<boolean>(notifPrefs.weekly_digest !== false);
  const [notifComments, setNotifComments] = useState<boolean>(notifPrefs.social_comments !== false);
  const [notifReactions, setNotifReactions] = useState<boolean>(notifPrefs.social_reactions !== false);
  const [notifFollows, setNotifFollows] = useState<boolean>(notifPrefs.social_follows !== false);

  const [bannerUrl, setBannerUrl] = useState(profile?.banner_url ?? "");
  const [bannerUploadProgress, setBannerUploadProgress] = useState<number | null>(null);
  const [bannerUploadError, setBannerUploadError] = useState<string | null>(null);
  const [accentColor, setAccentColor] = useState(profile?.accent_color ?? DEFAULT_ACCENT);
  const [exporting, setExporting] = useState(false);

  const isPro = !!profile?.is_pro;
  const [proModal, setProModal] = useState<string | null>(null);
  const openPro = (feature: string) => setProModal(feature);

  // UI state
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [usernameStatus, setUsernameStatus] = useState<"idle" | "checking" | "available" | "taken" | "invalid">("idle");
  const [toast, setToast] = useState<string | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);

  // Password change
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [passwordSuccess, setPasswordSuccess] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const bannerFileInputRef = useRef<HTMLInputElement>(null);
  const usernameTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const isDirty =
    displayName !== (profile?.display_name ?? "") ||
    username !== (profile?.username ?? "") ||
    bio !== (profile?.bio ?? "") ||
    socialLink !== (profile?.social_link ?? "") ||
    isPublic !== (profile?.is_public ?? false) ||
    accentColor !== (profile?.accent_color ?? DEFAULT_ACCENT) ||
    notifStreak !== (notifPrefs.streak_reminders !== false) ||
    notifMilestones !== (notifPrefs.milestones !== false) ||
    notifDigest !== (notifPrefs.weekly_digest !== false) ||
    notifComments !== (notifPrefs.social_comments !== false) ||
    notifReactions !== (notifPrefs.social_reactions !== false) ||
    notifFollows !== (notifPrefs.social_follows !== false);

  useEffect(() => {
    if (!isDirty) return;
    const handler = (e: BeforeUnloadEvent) => {
      e.preventDefault();
    };
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [isDirty]);

  // Username validation
  const validateUsernameFormat = (u: string) => /^[a-zA-Z0-9_]{3,20}$/.test(u);

  const checkUsername = useCallback(async (u: string) => {
    if (!u || u === profile?.username) {
      setUsernameStatus("idle");
      return;
    }
    if (!validateUsernameFormat(u)) {
      setUsernameStatus("invalid");
      return;
    }
    setUsernameStatus("checking");
    try {
      const res = await fetch(`/api/username/check?u=${encodeURIComponent(u)}`);
      const json = await res.json();
      setUsernameStatus(json.available ? "available" : "taken");
    } catch {
      setUsernameStatus("idle");
    }
  }, [profile?.username]);

  function handleUsernameChange(e: React.ChangeEvent<HTMLInputElement>) {
    const val = e.target.value;
    setUsername(val);
    if (usernameTimerRef.current) clearTimeout(usernameTimerRef.current);
    usernameTimerRef.current = setTimeout(() => checkUsername(val), 400);
  }

  useEffect(() => {
    return () => {
      if (usernameTimerRef.current) clearTimeout(usernameTimerRef.current);
    };
  }, []);

  // Avatar upload
  async function handleAvatarChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadError(null);
    setUploadProgress(0);

    try {
      const supabase = createClient();
      const ext = file.name.split(".").pop() ?? "jpg";
      const path = `${userId}/${Date.now()}.${ext}`;

      // Simulate progress with small intervals since Supabase JS doesn't expose XHR progress
      const progressInterval = setInterval(() => {
        setUploadProgress((p) => {
          if (p === null || p >= 85) { clearInterval(progressInterval); return p; }
          return p + 15;
        });
      }, 150);

      const { error: uploadErr } = await supabase.storage
        .from("avatars")
        .upload(path, file, { upsert: true });

      clearInterval(progressInterval);

      if (uploadErr) {
        setUploadProgress(null);
        setUploadError("Upload failed. The avatars bucket may not exist yet.");
        return;
      }

      setUploadProgress(100);

      const { data: urlData } = supabase.storage.from("avatars").getPublicUrl(path);
      const publicUrl = urlData.publicUrl;

      const { error: updateErr } = await supabase
        .from("profiles")
        .update({ avatar_url: publicUrl })
        .eq("id", userId);

      if (updateErr) {
        setUploadError("Uploaded but failed to save URL.");
      } else {
        setAvatarUrl(publicUrl);
      }

      setTimeout(() => setUploadProgress(null), 1000);
    } catch {
      setUploadProgress(null);
      setUploadError("Upload failed.");
    }
  }

  // Banner upload (Pro only)
  async function handleBannerChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setBannerUploadError(null);
    setBannerUploadProgress(0);

    try {
      const supabase = createClient();
      const ext = file.name.split(".").pop() ?? "jpg";
      const path = `${userId}/${Date.now()}.${ext}`;

      const progressInterval = setInterval(() => {
        setBannerUploadProgress((p) => {
          if (p === null || p >= 85) { clearInterval(progressInterval); return p; }
          return p + 15;
        });
      }, 150);

      const { error: uploadErr } = await supabase.storage
        .from("banners")
        .upload(path, file, { upsert: true });

      clearInterval(progressInterval);

      if (uploadErr) {
        setBannerUploadProgress(null);
        setBannerUploadError("Upload failed. The banners bucket may not exist yet.");
        return;
      }

      setBannerUploadProgress(100);

      const { data: urlData } = supabase.storage.from("banners").getPublicUrl(path);
      const publicUrl = urlData.publicUrl;

      const { error: updateErr } = await supabase
        .from("profiles")
        .update({ banner_url: publicUrl })
        .eq("id", userId);

      if (updateErr) {
        setBannerUploadError("Uploaded but failed to save URL.");
      } else {
        setBannerUrl(publicUrl);
      }

      setTimeout(() => setBannerUploadProgress(null), 1000);
    } catch {
      setBannerUploadProgress(null);
      setBannerUploadError("Upload failed.");
    }
  }

  // Save settings
  function handleSave() {
    setSaveError(null);
    startTransition(async () => {
      try {
        const supabase = createClient();

        const updates: Record<string, unknown> = {
          display_name: displayName.trim() || null,
          username: username.trim() || null,
          bio: bio.trim() || null,
          social_link: socialLink.trim() || null,
          is_public: isPublic,
          ...(profile?.is_pro ? { accent_color: accentColor } : {}),
          notification_prefs: {
            streak_reminders: notifStreak,
            milestones: notifMilestones,
            weekly_digest: notifDigest,
            social_comments: notifComments,
            social_reactions: notifReactions,
            social_follows: notifFollows,
          },
        };

        const { error } = await supabase
          .from("profiles")
          .update(updates)
          .eq("id", userId);

        if (error) {
          setSaveError(error.message);
          return;
        }

        showToast({ message: "Saved.", type: "success" });
        router.refresh();
      } catch (err) {
        setSaveError(err instanceof Error ? err.message : "Failed to save.");
      }
    });
  }

  // Change password
  function handleChangePassword() {
    setPasswordError(null);
    setPasswordSuccess(false);

    if (newPassword.length < 8) {
      setPasswordError("Password must be at least 8 characters.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordError("Passwords don't match.");
      return;
    }

    startTransition(async () => {
      const supabase = createClient();
      const { error } = await supabase.auth.updateUser({ password: newPassword });
      if (error) {
        setPasswordError(error.message);
        return;
      }
      setNewPassword("");
      setConfirmPassword("");
      setPasswordSuccess(true);
      setTimeout(() => setPasswordSuccess(false), 3000);
    });
  }

  // Export data (Pro)
  async function handleExport() {
    if (!isPro) {
      openPro("Data export");
      return;
    }
    setExporting(true);
    try {
      const res = await fetch("/api/account/export");
      if (!res.ok) {
        const json = await res.json().catch(() => ({}));
        setToast(json.error ?? "Export failed.");
        setTimeout(() => setToast(null), 3000);
        return;
      }
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `hyperfix-export-${new Date().toISOString().split("T")[0]}.json`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch {
      setToast("Export failed.");
      setTimeout(() => setToast(null), 3000);
    } finally {
      setExporting(false);
    }
  }

  // Sign out
  function handleSignOut() {
    startTransition(async () => {
      const supabase = createClient();
      await supabase.auth.signOut();
      router.push("/");
    });
  }

  // Delete account
  function handleDeleteAccount() {
    setDeleteError(null);
    startTransition(async () => {
      try {
        const res = await fetch("/api/account/delete", { method: "POST" });
        if (!res.ok) {
          const json = await res.json().catch(() => ({}));
          setDeleteError(json.error ?? "Failed to delete account.");
          return;
        }
        const supabase = createClient();
        await supabase.auth.signOut();
        router.push("/");
      } catch {
        setDeleteError("Failed to delete account.");
      }
    });
  }

  // Initials fallback
  const initials = (
    profile?.display_name ||
    profile?.username ||
    userEmail.split("@")[0] ||
    "?"
  ).slice(0, 2).toUpperCase();

  const usernameHint = () => {
    if (usernameStatus === "checking") return <span style={{ color: "rgba(244,244,244,0.4)" }}>Checking…</span>;
    if (usernameStatus === "available") return <span style={{ color: "#5EEAD4" }}>✓ Available</span>;
    if (usernameStatus === "taken") return <span style={{ color: "#fda4af" }}>✗ Taken</span>;
    if (usernameStatus === "invalid") return <span style={{ color: "#fda4af" }}>3–20 chars, letters/numbers/underscore only</span>;
    return null;
  };

  return (
    <div className="flex flex-col gap-10">
      {/* ── Live profile preview ── */}
      <section>
        <SectionHeading>Profile</SectionHeading>
        <LiveProfileEditor
          userId={userId}
          displayName={displayName}
          setDisplayName={setDisplayName}
          username={username}
          setUsername={setUsername}
          bio={bio}
          setBio={setBio}
          socialLink={socialLink}
          setSocialLink={setSocialLink}
          avatarUrl={avatarUrl}
          setAvatarUrl={setAvatarUrl}
          bannerUrl={bannerUrl}
          setBannerUrl={setBannerUrl}
          accent={resolveAccent(isPro, accentColor)}
          isPro={isPro}
        />
      </section>

      {/* ── Theme & accent ── */}
      <section>
        <SectionHeading>Theme</SectionHeading>

        {/* Avatar — hidden legacy (kept for compat, edited via LiveProfileEditor above) */}
        <div className="hidden">
        <div className="flex flex-col items-center gap-4 mb-8 sm:flex-row sm:items-start">
          {/* Circle */}
          <div className="relative shrink-0">
            {avatarUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={avatarUrl}
                alt="Avatar"
                className="w-20 h-20 rounded-full object-cover"
                style={{ border: "2px solid rgba(244,244,244,0.1)" }}
              />
            ) : (
              <div
                className="w-20 h-20 rounded-full flex items-center justify-center font-display font-bold text-xl select-none"
                style={{
                  background: "rgba(94,234,212,0.12)",
                  border: "2px solid rgba(94,234,212,0.3)",
                  color: "#5EEAD4",
                  letterSpacing: "-0.02em",
                }}
              >
                {initials}
              </div>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="px-4 py-2 rounded-full font-sans text-sm font-medium transition-all hover:opacity-80"
              style={{
                background: "rgba(244,244,244,0.07)",
                border: "1px solid rgba(244,244,244,0.12)",
                color: "rgba(244,244,244,0.7)",
              }}
            >
              Upload photo
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="sr-only"
              onChange={handleAvatarChange}
            />

            {uploadProgress !== null && (
              <div className="w-40">
                <div className="flex justify-between mb-1">
                  <span className="font-mono text-[10px]" style={{ color: "rgba(244,244,244,0.4)" }}>
                    Uploading…
                  </span>
                  <span className="font-mono text-[10px]" style={{ color: "#5EEAD4" }}>
                    {uploadProgress}%
                  </span>
                </div>
                <div className="h-1 rounded-full overflow-hidden" style={{ background: "rgba(244,244,244,0.08)" }}>
                  <div
                    className="h-full rounded-full transition-all duration-200"
                    style={{ width: `${uploadProgress}%`, background: "#5EEAD4" }}
                  />
                </div>
              </div>
            )}

            {uploadError && (
              <p className="font-sans text-[12px]" style={{ color: "#fda4af" }}>
                {uploadError}
              </p>
            )}
          </div>
        </div>

        {/* Banner */}
        <div className="mb-8">
            <div className="flex items-center gap-1.5 mb-3">
              <span className="font-sans text-[11px] font-semibold uppercase tracking-widest" style={{ color: "rgba(244,244,244,0.25)" }}>
                Profile banner
              </span>
            </div>
            <div
              className="relative rounded-2xl overflow-hidden mb-3 flex items-end"
              style={{
                height: 120,
                background: bannerUrl ? undefined : "rgba(94,234,212,0.05)",
                backgroundImage: bannerUrl ? `url(${bannerUrl})` : undefined,
                backgroundSize: "cover",
                backgroundPosition: "center",
                border: "1px solid rgba(94,234,212,0.15)",
              }}
            >
              {!bannerUrl && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <p className="font-mono text-xs" style={{ color: "rgba(94,234,212,0.35)" }}>No banner set</p>
                </div>
              )}
              <div className="absolute bottom-3 right-3 flex gap-2">
                <button
                  type="button"
                  onClick={() => bannerFileInputRef.current?.click()}
                  className="px-3 py-1.5 rounded-full font-sans text-xs font-medium transition-all hover:opacity-80"
                  style={{
                    background: "rgba(7,7,8,0.85)",
                    border: "1px solid rgba(94,234,212,0.3)",
                    color: "#5EEAD4",
                    backdropFilter: "blur(8px)",
                  }}
                >
                  {bannerUrl ? "Change" : "Upload banner"}
                </button>
                {bannerUrl && (
                  <button
                    type="button"
                    onClick={async () => {
                      const supabase = createClient();
                      await supabase.from("profiles").update({ banner_url: null }).eq("id", userId);
                      setBannerUrl("");
                    }}
                    className="px-3 py-1.5 rounded-full font-sans text-xs font-medium transition-all hover:opacity-80"
                    style={{
                      background: "rgba(7,7,8,0.85)",
                      border: "1px solid rgba(244,244,244,0.15)",
                      color: "rgba(244,244,244,0.5)",
                      backdropFilter: "blur(8px)",
                    }}
                  >
                    Remove
                  </button>
                )}
              </div>
            </div>
            <input
              ref={bannerFileInputRef}
              type="file"
              accept="image/*"
              className="sr-only"
              onChange={handleBannerChange}
            />
            {bannerUploadProgress !== null && (
              <div className="w-48 mb-2">
                <div className="flex justify-between mb-1">
                  <span className="font-mono text-[10px]" style={{ color: "rgba(244,244,244,0.4)" }}>Uploading…</span>
                  <span className="font-mono text-[10px]" style={{ color: "#5EEAD4" }}>{bannerUploadProgress}%</span>
                </div>
                <div className="h-1 rounded-full overflow-hidden" style={{ background: "rgba(244,244,244,0.08)" }}>
                  <div
                    className="h-full rounded-full transition-all duration-200"
                    style={{ width: `${bannerUploadProgress}%`, background: "#5EEAD4" }}
                  />
                </div>
              </div>
            )}
            {bannerUploadError && (
              <p className="font-sans text-[12px]" style={{ color: "#fda4af" }}>{bannerUploadError}</p>
            )}
            <p className="font-mono text-[10px]" style={{ color: "rgba(244,244,244,0.2)" }}>
              Recommended: 1500×500px · JPG or PNG · max 5MB
            </p>
        </div>
        </div>

        {/* Accent color (Pro) */}
        <div className="mb-8">
            <button
              type="button"
              onClick={isPro ? undefined : () => openPro("Custom accent color")}
              className="flex items-center gap-1.5 mb-3"
              style={{ cursor: isPro ? "default" : "pointer" }}
            >
              <span className="font-sans text-[11px] font-semibold uppercase tracking-widest" style={{ color: "rgba(244,244,244,0.25)" }}>
                Profile accent
              </span>
              <ProTag />
            </button>
            <div className="flex items-center gap-2.5 flex-wrap">
              {ACCENT_PRESETS.map((preset) => {
                const selected = isPro && accentColor.toLowerCase() === preset.hex.toLowerCase();
                return (
                  <button
                    key={preset.hex}
                    type="button"
                    onClick={() => (isPro ? setAccentColor(preset.hex) : openPro("Custom accent color"))}
                    title={preset.name}
                    aria-label={`Accent color ${preset.name}`}
                    className="relative rounded-full transition-all"
                    style={{
                      width: 34,
                      height: 34,
                      background: preset.hex,
                      boxShadow: selected ? `0 0 0 2px #111113, 0 0 0 4px ${preset.hex}` : "none",
                    }}
                  >
                    {selected && (
                      <span
                        className="absolute inset-0 flex items-center justify-center font-bold text-sm"
                        style={{ color: "#0A0A0A" }}
                      >
                        ✓
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
            <p className="font-mono text-[10px] mt-3" style={{ color: "rgba(244,244,244,0.2)" }}>
              Tints your public profile hero, badge, and share card.
            </p>
        </div>

        {/* Fields */}
        <div className="flex flex-col gap-5">
          <FieldGroup label="Display name">
            <input
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="Your name"
              className="w-full rounded-xl px-4 py-3 font-sans text-sm outline-none transition-all duration-150 placeholder:text-[rgba(244,244,244,0.18)] focus:ring-2 focus:ring-[#5EEAD4]/40"
              style={inputStyle}
            />
          </FieldGroup>

          <FieldGroup label="Username" hint={usernameHint()}>
            <input
              type="text"
              value={username}
              onChange={handleUsernameChange}
              placeholder="your_handle"
              className="w-full rounded-xl px-4 py-3 font-sans text-sm outline-none transition-all duration-150 placeholder:text-[rgba(244,244,244,0.18)] focus:ring-2 focus:ring-[#5EEAD4]/40"
              style={inputStyle}
            />
          </FieldGroup>

          <FieldGroup
            label="Bio"
            hint={
              <span style={{ color: bio.length > 150 ? "#fda4af" : "rgba(244,244,244,0.3)" }}>
                {bio.length}/160
              </span>
            }
          >
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value.slice(0, 160))}
              placeholder="A sentence about yourself"
              rows={3}
              maxLength={160}
              className="w-full rounded-xl px-4 py-3 font-sans text-sm outline-none transition-all duration-150 placeholder:text-[rgba(244,244,244,0.18)] focus:ring-2 focus:ring-[#5EEAD4]/40 resize-none"
              style={inputStyle}
            />
          </FieldGroup>

          <FieldGroup label="Link" hint="TikTok, Instagram, Twitter — one link shown on your profile">
            <input
              type="url"
              value={socialLink}
              onChange={(e) => setSocialLink(e.target.value)}
              placeholder="https://tiktok.com/@you"
              className="w-full rounded-xl px-4 py-3 font-sans text-sm outline-none transition-all duration-150 placeholder:text-[rgba(244,244,244,0.18)] focus:ring-2 focus:ring-[#5EEAD4]/40"
              style={inputStyle}
            />
          </FieldGroup>
        </div>
      </section>

      {/* ── Privacy section ── */}
      <section>
        <SectionHeading>Privacy</SectionHeading>

        <label className="flex items-center justify-between gap-4 cursor-pointer p-4 rounded-2xl" style={cardStyle}>
          <div>
            <p className="font-sans text-sm font-medium" style={{ color: "#F4F4F4" }}>
              Public profile
            </p>
            <p className="font-sans text-[12px] mt-0.5" style={{ color: "rgba(244,244,244,0.35)" }}>
              Anyone can view your profile and public fixes
            </p>
          </div>

          {/* Toggle */}
          <div className="relative shrink-0">
            <input
              type="checkbox"
              checked={isPublic}
              onChange={(e) => setIsPublic(e.target.checked)}
              className="sr-only"
            />
            <div
              className="w-11 h-6 rounded-full transition-all duration-200"
              style={{
                background: isPublic ? "#5EEAD4" : "rgba(244,244,244,0.1)",
                border: isPublic ? "1px solid rgba(94,234,212,0.5)" : "1px solid rgba(244,244,244,0.1)",
              }}
            >
              <div
                className="w-4 h-4 rounded-full mt-[3px] transition-all duration-200"
                style={{
                  background: isPublic ? "#0A0A0A" : "rgba(244,244,244,0.4)",
                  transform: isPublic ? "translateX(23px)" : "translateX(3px)",
                }}
              />
            </div>
          </div>
        </label>
      </section>

      {/* ── Notifications section ── */}
      <section>
        <SectionHeading>Notifications</SectionHeading>

        {/* Push notifications (browser/PWA) */}
        <PushToggle />

        <div className="flex flex-col gap-3">
          <NotifToggle
            label="Streak reminders"
            description="remind me if I haven't checked in and have a streak going"
            checked={notifStreak}
            onChange={setNotifStreak}
          />
          <NotifToggle
            label="Milestone emails"
            description="celebrate when a fix hits 7, 30, 100, or 365 days"
            checked={notifMilestones}
            onChange={setNotifMilestones}
          />
          <NotifToggle
            label="Weekly digest"
            description="Sunday summary of my active fixes"
            checked={notifDigest}
            onChange={setNotifDigest}
          />
        </div>

        <p className="font-sans text-[11px] font-semibold uppercase tracking-widest mt-7 mb-3" style={{ color: "rgba(244,244,244,0.25)" }}>
          Activity on my fixes
        </p>
        <div className="flex flex-col gap-3">
          <NotifToggle
            label="Comments"
            description="notify me when someone comments on my fix"
            checked={notifComments}
            onChange={setNotifComments}
          />
          <NotifToggle
            label="Reactions"
            description="notify me when someone reacts to my fix"
            checked={notifReactions}
            onChange={setNotifReactions}
          />
          <NotifToggle
            label="New followers"
            description="notify me when someone follows me"
            checked={notifFollows}
            onChange={setNotifFollows}
          />
        </div>
      </section>

      {/* ── Account section ── */}
      <section>
        <SectionHeading>Account</SectionHeading>

        <div className="flex flex-col gap-4">
          {/* Email (read-only) */}
          <FieldGroup label="Email">
            <div
              className="w-full rounded-xl px-4 py-3 font-sans text-sm"
              style={{ ...inputStyle, opacity: 0.6, cursor: "not-allowed" }}
            >
              {userEmail}
            </div>
          </FieldGroup>

          {/* Change password */}
          <div className="flex flex-col gap-3 p-4 rounded-2xl" style={cardStyle}>
            <p className="font-sans text-sm font-medium" style={{ color: "#F4F4F4" }}>
              Change password
            </p>
            <FieldGroup label="New password">
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Min. 8 characters"
                autoComplete="new-password"
                className="w-full rounded-xl px-4 py-3 font-sans text-sm outline-none transition-all duration-150 placeholder:text-[rgba(244,244,244,0.18)] focus:ring-2 focus:ring-[#5EEAD4]/40"
                style={inputStyle}
              />
            </FieldGroup>
            <FieldGroup label="Confirm new password">
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Repeat new password"
                autoComplete="new-password"
                className="w-full rounded-xl px-4 py-3 font-sans text-sm outline-none transition-all duration-150 placeholder:text-[rgba(244,244,244,0.18)] focus:ring-2 focus:ring-[#5EEAD4]/40"
                style={inputStyle}
              />
            </FieldGroup>
            {passwordError && (
              <p className="font-sans text-[12px]" style={{ color: "#fda4af" }}>
                {passwordError}
              </p>
            )}
            {passwordSuccess && (
              <p className="font-sans text-[12px]" style={{ color: "#5EEAD4" }}>
                ✓ Password updated
              </p>
            )}
            <button
              type="button"
              onClick={handleChangePassword}
              disabled={pending || !newPassword || !confirmPassword}
              className="self-start px-5 py-2.5 rounded-full font-sans text-sm font-medium transition-all hover:opacity-80 disabled:opacity-40"
              style={{
                background: "rgba(244,244,244,0.07)",
                border: "1px solid rgba(244,244,244,0.12)",
                color: "rgba(244,244,244,0.7)",
              }}
            >
              {pending ? "Updating…" : "Update password"}
            </button>
          </div>

          {/* Export data (Pro) */}
          <div className="flex flex-col gap-2 p-4 rounded-2xl" style={cardStyle}>
            <div className="flex items-center gap-1.5">
              <p className="font-sans text-sm font-medium" style={{ color: "#F4F4F4" }}>
                Export your data
              </p>
              <ProTag />
            </div>
            <p className="font-sans text-[12px]" style={{ color: "rgba(244,244,244,0.35)" }}>
              Download all your fixes, check-ins, and comments as a JSON file.
            </p>
            <button
              type="button"
              onClick={handleExport}
              disabled={exporting}
              className="self-start mt-1 px-5 py-2.5 rounded-full font-sans text-sm font-medium transition-all hover:opacity-80 disabled:opacity-50"
              style={{
                background: "rgba(94,234,212,0.1)",
                border: "1px solid rgba(94,234,212,0.25)",
                color: "#5EEAD4",
              }}
            >
              {exporting ? "Preparing…" : "Download export"}
            </button>
          </div>

          {/* Sign out */}
          <button
            type="button"
            onClick={handleSignOut}
            disabled={pending}
            className="self-start px-5 py-2.5 rounded-full font-sans text-sm font-medium transition-all hover:opacity-80 disabled:opacity-50"
            style={{
              background: "rgba(244,244,244,0.07)",
              border: "1px solid rgba(244,244,244,0.12)",
              color: "rgba(244,244,244,0.7)",
            }}
          >
            Sign out
          </button>

          {/* Delete account */}
          <button
            type="button"
            onClick={() => setShowDeleteModal(true)}
            className="self-start px-5 py-2.5 rounded-full font-sans text-sm font-medium transition-all hover:opacity-80 opacity-50 hover:opacity-70"
            style={{
              background: "rgba(225,29,72,0.08)",
              border: "1px solid rgba(225,29,72,0.2)",
              color: "#fda4af",
            }}
          >
            Delete account
          </button>
        </div>
      </section>

      {/* ── Pro section ── */}
      <section>
        <SectionHeading>Plan</SectionHeading>
        <div
          className="p-4 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3"
          style={cardStyle}
        >
          <div>
            <p className="font-sans text-sm font-medium" style={{ color: "#F4F4F4" }}>
              {profile?.is_pro ? "Pro" : "Free plan"}
            </p>
            <p className="font-sans text-[12px] mt-0.5" style={{ color: "rgba(244,244,244,0.35)" }}>
              {profile?.is_pro
                ? "You have access to all Pro features."
                : "Upgrade to unlock unlimited fixes and more."}
            </p>
          </div>
          {profile?.is_pro ? (
            <span
              className="font-mono text-[9px] self-start sm:self-auto rounded px-2 py-1"
              style={{
                background: "rgba(94,234,212,0.2)",
                color: "#5EEAD4",
                border: "1px solid rgba(94,234,212,0.3)",
              }}
            >
              PRO
            </span>
          ) : (
            <a
              href="/pricing"
              className="self-start sm:self-auto px-4 py-2 rounded-full font-sans text-sm font-semibold transition-all hover:opacity-90 active:scale-[0.97]"
              style={{ background: "#5EEAD4", color: "#0A0A0A" }}
            >
              Upgrade to Pro →
            </a>
          )}
        </div>
      </section>

      {/* ── Referral section ── */}
      <section>
        <SectionHeading>Refer a friend</SectionHeading>
        <div className="flex flex-col gap-4 p-4 rounded-2xl" style={cardStyle}>
          {profile?.referral_code ? (
            <>
              <div>
                <p className="font-sans text-[13px] font-medium mb-2" style={{ color: "rgba(244,244,244,0.6)" }}>
                  Your invite link
                </p>
                <ReferralCopyButton referralCode={profile.referral_code} />
              </div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-sm font-bold" style={{ color: "#5EEAD4" }}>
                  {profile.referral_count ?? 0}
                </span>
                <span className="font-sans text-[13px]" style={{ color: "rgba(244,244,244,0.45)" }}>
                  {(profile.referral_count ?? 0) === 1 ? "friend joined" : "friends joined"}
                </span>
              </div>
              <p className="font-mono text-[11px]" style={{ color: "rgba(244,244,244,0.25)" }}>
                Refer 3 friends → earn Pro access at launch
              </p>
            </>
          ) : (
            <p className="font-sans text-sm" style={{ color: "rgba(244,244,244,0.4)" }}>
              Your referral code will appear here once your account is fully set up.
            </p>
          )}
        </div>
      </section>

      {/* Save error */}
      {saveError && (
        <p
          className="font-sans text-sm rounded-xl px-4 py-3"
          style={{
            background: "rgba(225,29,72,0.08)",
            border: "1px solid rgba(225,29,72,0.2)",
            color: "#fda4af",
          }}
        >
          {saveError}
        </p>
      )}

      {/* Save button */}
      {isDirty && !pending && (
        <p
          className="font-mono text-[10px] uppercase tracking-widest text-center"
          style={{ color: "rgba(94,234,212,0.6)" }}
        >
          Unsaved changes
        </p>
      )}
      <button
        type="button"
        onClick={handleSave}
        disabled={pending}
        className="w-full py-4 rounded-2xl font-sans text-base font-bold transition-all hover:opacity-90 active:scale-[0.98] disabled:opacity-60"
        style={{ background: "#5EEAD4", color: "#0A0A0A" }}
      >
        {pending ? "Saving…" : "Save changes"}
      </button>

      {/* Pro upsell modal */}
      <ProUpsellModal
        open={!!proModal}
        feature={proModal ?? undefined}
        onClose={() => setProModal(null)}
      />

      {/* ── Delete modal ── */}
      {showDeleteModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: "rgba(0,0,0,0.75)" }}
        >
          <div
            className="w-full max-w-md rounded-3xl p-6"
            style={{
              background: "#111113",
              border: "1px solid rgba(244,244,244,0.1)",
            }}
          >
            <h2
              className="font-display font-bold text-xl mb-2"
              style={{ color: "#F4F4F4", letterSpacing: "-0.02em" }}
            >
              Delete your account?
            </h2>
            <p className="font-sans text-sm mb-5" style={{ color: "rgba(244,244,244,0.45)" }}>
              This will permanently delete your account and all your fixes. There&apos;s no going back.
            </p>

            {deleteError && (
              <p
                className="font-sans text-sm rounded-xl px-3 py-2 mb-4"
                style={{
                  background: "rgba(225,29,72,0.08)",
                  border: "1px solid rgba(225,29,72,0.2)",
                  color: "#fda4af",
                }}
              >
                {deleteError}
              </p>
            )}

            <div className="flex gap-3">
              <button
                onClick={() => { setShowDeleteModal(false); setDeleteError(null); }}
                className="flex-1 py-2.5 rounded-xl font-sans text-sm font-medium transition-all hover:opacity-80"
                style={{
                  background: "rgba(244,244,244,0.06)",
                  border: "1px solid rgba(244,244,244,0.1)",
                  color: "rgba(244,244,244,0.6)",
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteAccount}
                disabled={pending}
                className="flex-1 py-2.5 rounded-xl font-sans text-sm font-bold transition-all hover:opacity-90 disabled:opacity-60"
                style={{
                  background: "rgba(225,29,72,0.15)",
                  border: "1px solid rgba(225,29,72,0.3)",
                  color: "#fda4af",
                }}
              >
                {pending ? "Deleting…" : "Yes, delete everything"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Toast ── */}
      {toast && (
        <div
          className="fixed bottom-6 left-1/2 -translate-x-1/2 px-5 py-3 rounded-2xl font-sans text-sm font-bold z-50 pointer-events-none"
          style={{
            background: "rgba(94,234,212,0.15)",
            border: "1px solid rgba(94,234,212,0.4)",
            color: "#5EEAD4",
            boxShadow: "0 4px 24px rgba(0,0,0,0.5)",
          }}
        >
          {toast}
        </div>
      )}
    </div>
  );
}

/* ── helpers ── */

const inputStyle: React.CSSProperties = {
  background: "#111113",
  border: "1px solid rgba(244,244,244,0.1)",
  color: "#F4F4F4",
};

const cardStyle: React.CSSProperties = {
  background: "#111113",
  border: "1px solid rgba(244,244,244,0.07)",
};

function ProTag() {
  return (
    <span
      className="font-mono text-[8px] rounded px-1 py-0.5 leading-none"
      style={{
        background: "rgba(94,234,212,0.16)",
        color: "#5EEAD4",
        border: "1px solid rgba(94,234,212,0.3)",
      }}
    >
      PRO
    </span>
  );
}

function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <h2
      className="font-sans text-[11px] font-semibold uppercase tracking-widest mb-5"
      style={{ color: "rgba(244,244,244,0.35)" }}
    >
      {children}
    </h2>
  );
}

function FieldGroup({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center justify-between">
        <label className="font-sans text-[13px] font-medium" style={{ color: "rgba(244,244,244,0.6)" }}>
          {label}
        </label>
        {hint && <span className="font-mono text-[11px]">{hint}</span>}
      </div>
      {children}
    </div>
  );
}

function NotifToggle({
  label,
  description,
  checked,
  onChange,
}: {
  label: string;
  description: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <label className="flex items-center justify-between gap-4 cursor-pointer p-4 rounded-2xl" style={cardStyle}>
      <div>
        <p className="font-sans text-sm font-medium" style={{ color: "#F4F4F4" }}>{label}</p>
        <p className="font-sans text-[12px] mt-0.5" style={{ color: "rgba(244,244,244,0.35)" }}>{description}</p>
      </div>
      <div className="relative shrink-0">
        <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} className="sr-only" />
        <div
          className="w-11 h-6 rounded-full transition-all duration-200"
          style={{
            background: checked ? "#5EEAD4" : "rgba(244,244,244,0.1)",
            border: checked ? "1px solid rgba(94,234,212,0.5)" : "1px solid rgba(244,244,244,0.1)",
          }}
        >
          <div
            className="w-4 h-4 rounded-full mt-[3px] transition-all duration-200"
            style={{
              background: checked ? "#0A0A0A" : "rgba(244,244,244,0.4)",
              transform: checked ? "translateX(23px)" : "translateX(3px)",
            }}
          />
        </div>
      </div>
    </label>
  );
}

function ReferralCopyButton({ referralCode }: { referralCode: string }) {
  const [copied, setCopied] = useState(false);
  const origin = typeof window !== "undefined" ? window.location.origin : "https://hyperfix.app";
  const link = `${origin}/join?ref=${referralCode}`;
  const shareText = `track your hyperfixations on hyperfix — count the days, build your graveyard 🪦`;

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(link);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback
    }
  }

  function shareOnTwitter() {
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(link)}`;
    window.open(url, "_blank", "noopener,noreferrer");
  }

  function shareNative() {
    if (navigator.share) {
      navigator.share({ title: "Hyperfix", text: shareText, url: link }).catch(() => {});
    }
  }

  const hasNativeShare = typeof navigator !== "undefined" && !!navigator.share;

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-2">
        <div
          className="flex-1 rounded-xl px-3 py-2 font-mono text-xs truncate"
          style={{
            background: "rgba(244,244,244,0.04)",
            border: "1px solid rgba(244,244,244,0.1)",
            color: "rgba(244,244,244,0.5)",
          }}
        >
          {link}
        </div>
        <button
          type="button"
          onClick={handleCopy}
          className="shrink-0 px-3 py-2 rounded-xl font-sans text-xs font-medium transition-all hover:opacity-80"
          style={{
            background: copied ? "rgba(94,234,212,0.15)" : "rgba(244,244,244,0.07)",
            border: copied ? "1px solid rgba(94,234,212,0.3)" : "1px solid rgba(244,244,244,0.12)",
            color: copied ? "#5EEAD4" : "rgba(244,244,244,0.7)",
          }}
        >
          {copied ? "Copied ✓" : "Copy"}
        </button>
      </div>
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={shareOnTwitter}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-mono text-[11px] uppercase tracking-widest transition-all hover:opacity-80"
          style={{
            background: "rgba(244,244,244,0.06)",
            border: "1px solid rgba(244,244,244,0.1)",
            color: "rgba(244,244,244,0.5)",
          }}
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.736-8.849L1.254 2.25H8.08l4.261 5.632 5.903-5.632Zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
          Share
        </button>
        {hasNativeShare && (
          <button
            type="button"
            onClick={shareNative}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-mono text-[11px] uppercase tracking-widest transition-all hover:opacity-80"
            style={{
              background: "rgba(244,244,244,0.06)",
              border: "1px solid rgba(244,244,244,0.1)",
              color: "rgba(244,244,244,0.5)",
            }}
          >
            <Send set="light" size={13} primaryColor="currentColor" />
            More
          </button>
        )}
      </div>
    </div>
  );
}
