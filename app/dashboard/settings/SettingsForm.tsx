"use client";

import { useState, useRef, useEffect, useCallback, useTransition } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

type Profile = {
  id: string;
  display_name: string | null;
  username: string | null;
  bio: string | null;
  avatar_url: string | null;
  is_public: boolean | null;
  is_pro?: boolean | null;
  referral_code?: string | null;
  referral_count?: number | null;
  notification_prefs?: Record<string, boolean> | null;
} | null;

type Props = {
  profile: Profile;
  userEmail: string;
  userId: string;
};

export function SettingsForm({ profile, userEmail, userId }: Props) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  // Form state
  const [displayName, setDisplayName] = useState(profile?.display_name ?? "");
  const [username, setUsername] = useState(profile?.username ?? "");
  const [bio, setBio] = useState(profile?.bio ?? "");
  const [isPublic, setIsPublic] = useState(profile?.is_public ?? false);
  const [avatarUrl, setAvatarUrl] = useState(profile?.avatar_url ?? "");

  // Notification prefs
  const notifPrefs = profile?.notification_prefs ?? {};
  const [notifStreak, setNotifStreak] = useState<boolean>(notifPrefs.streak_reminders !== false);
  const [notifMilestones, setNotifMilestones] = useState<boolean>(notifPrefs.milestones !== false);
  const [notifDigest, setNotifDigest] = useState<boolean>(notifPrefs.weekly_digest !== false);

  // UI state
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [usernameStatus, setUsernameStatus] = useState<"idle" | "checking" | "available" | "taken" | "invalid">("idle");
  const [toast, setToast] = useState<string | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const usernameTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

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
          is_public: isPublic,
          notification_prefs: { streak_reminders: notifStreak, milestones: notifMilestones, weekly_digest: notifDigest },
        };

        const { error } = await supabase
          .from("profiles")
          .update(updates)
          .eq("id", userId);

        if (error) {
          setSaveError(error.message);
          return;
        }

        setToast("Saved ✓");
        setTimeout(() => setToast(null), 2000);
        router.refresh();
      } catch (err) {
        setSaveError(err instanceof Error ? err.message : "Failed to save.");
      }
    });
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
    if (usernameStatus === "available") return <span style={{ color: "#A855F7" }}>✓ Available</span>;
    if (usernameStatus === "taken") return <span style={{ color: "#fda4af" }}>✗ Taken</span>;
    if (usernameStatus === "invalid") return <span style={{ color: "#fda4af" }}>3–20 chars, letters/numbers/underscore only</span>;
    return null;
  };

  return (
    <div className="flex flex-col gap-10">
      {/* ── Profile section ── */}
      <section>
        <SectionHeading>Profile</SectionHeading>

        {/* Avatar */}
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
                  background: "rgba(168,85,247,0.12)",
                  border: "2px solid rgba(168,85,247,0.3)",
                  color: "#A855F7",
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
                  <span className="font-mono text-[10px]" style={{ color: "#A855F7" }}>
                    {uploadProgress}%
                  </span>
                </div>
                <div className="h-1 rounded-full overflow-hidden" style={{ background: "rgba(244,244,244,0.08)" }}>
                  <div
                    className="h-full rounded-full transition-all duration-200"
                    style={{ width: `${uploadProgress}%`, background: "#A855F7" }}
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

        {/* Fields */}
        <div className="flex flex-col gap-5">
          <FieldGroup label="Display name">
            <input
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="Your name"
              className="w-full rounded-xl px-4 py-3 font-sans text-sm outline-none transition-all duration-150 placeholder:text-[rgba(244,244,244,0.18)] focus:ring-2 focus:ring-[#A855F7]/40"
              style={inputStyle}
            />
          </FieldGroup>

          <FieldGroup label="Username" hint={usernameHint()}>
            <input
              type="text"
              value={username}
              onChange={handleUsernameChange}
              placeholder="your_handle"
              className="w-full rounded-xl px-4 py-3 font-sans text-sm outline-none transition-all duration-150 placeholder:text-[rgba(244,244,244,0.18)] focus:ring-2 focus:ring-[#A855F7]/40"
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
              className="w-full rounded-xl px-4 py-3 font-sans text-sm outline-none transition-all duration-150 placeholder:text-[rgba(244,244,244,0.18)] focus:ring-2 focus:ring-[#A855F7]/40 resize-none"
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
                background: isPublic ? "#A855F7" : "rgba(244,244,244,0.1)",
                border: isPublic ? "1px solid rgba(168,85,247,0.5)" : "1px solid rgba(244,244,244,0.1)",
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
                background: "rgba(168,85,247,0.2)",
                color: "#A855F7",
                border: "1px solid rgba(168,85,247,0.3)",
              }}
            >
              PRO
            </span>
          ) : (
            <a
              href="/pricing"
              className="self-start sm:self-auto px-4 py-2 rounded-full font-sans text-sm font-semibold transition-all hover:opacity-90 active:scale-[0.97]"
              style={{ background: "#A855F7", color: "#0A0A0A" }}
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
                <span className="font-mono text-sm font-bold" style={{ color: "#A855F7" }}>
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
      <button
        type="button"
        onClick={handleSave}
        disabled={pending}
        className="w-full py-4 rounded-2xl font-sans text-base font-bold transition-all hover:opacity-90 active:scale-[0.98] disabled:opacity-60"
        style={{ background: "#A855F7", color: "#0A0A0A" }}
      >
        {pending ? "Saving…" : "Save changes"}
      </button>

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
            background: "rgba(168,85,247,0.15)",
            border: "1px solid rgba(168,85,247,0.4)",
            color: "#A855F7",
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
            background: checked ? "#A855F7" : "rgba(244,244,244,0.1)",
            border: checked ? "1px solid rgba(168,85,247,0.5)" : "1px solid rgba(244,244,244,0.1)",
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
            background: copied ? "rgba(168,85,247,0.15)" : "rgba(244,244,244,0.07)",
            border: copied ? "1px solid rgba(168,85,247,0.3)" : "1px solid rgba(244,244,244,0.12)",
            color: copied ? "#A855F7" : "rgba(244,244,244,0.7)",
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
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>
            More
          </button>
        )}
      </div>
    </div>
  );
}
