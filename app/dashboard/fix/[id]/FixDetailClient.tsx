"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { FixStatusPill, type FixStatus } from "@/components/FixStatusPill";
import { updateFixStatus, updateFixIntensity, endFix, deleteFix, checkInFix, updateFixPrivacy, editFix, pinFix } from "@/app/actions/fixes";
import { updateFixTags } from "@/app/actions/tags";
import { AddToListButton } from "@/components/AddToListButton";
import { useToast } from "@/components/Toast";
import { TagsInput } from "@/components/TagsInput";
import { CloseSquare, Star } from "react-iconly";
import { FixBannerUpload } from "@/components/FixBannerUpload";
import { FlameIcon, BoltIcon, SparkleIcon, PinIcon } from "@/components/LandingIcons";
import { SkullIcon, TrophyIcon } from "@/components/MilestoneIcons";

type MilestoneIconComponent = (p: { size?: number; className?: string }) => React.JSX.Element;
function getMilestone(days: number): { Icon: MilestoneIconComponent; heading: string; sub: string } | null {
  if (days === 365) return { Icon: TrophyIcon, heading: "One whole year.", sub: "You have been unwell for 365 days. Legendary." };
  if (days === 100) return { Icon: SkullIcon, heading: "100 days deep.", sub: "That's dedication. Or a cry for help. Either way, we respect it." };
  if (days === 30) return { Icon: BoltIcon, heading: "One month in.", sub: "This fix has officially lasted longer than most diets." };
  if (days === 7) return { Icon: FlameIcon, heading: "One week.", sub: "Seven days strong. It's not a phase." };
  return null;
}

const ALL_STATUSES: FixStatus[] = [
  "Day 1", "Obsessing", "On loop", "Fading", "Post-fix", "Ended", "Dormant", "Send help",
];

const INTENSITY_LABELS: Record<number, string> = {
  1:  "barely a thing",
  2:  "it's in the back of my head",
  3:  "thinking about it a normal amount",
  4:  "okay it has its claws in me",
  5:  "i think about it every day",
  6:  "i have reorganised my whole personality",
  7:  "deeply, catastrophically unwell",
  8:  "i cannot be perceived right now",
  9:  "send help. no wait don't. let me stay.",
  10: "this is a medical emergency",
};

const CATEGORIES = [
  "song", "fanfic", "show", "film", "ship", "game",
  "video essay", "podcast", "book", "character", "other",
] as const;

type Props = {
  fixId: string;
  title: string;
  category: string;
  status: FixStatus;
  intensity: number;
  days: number;
  ended: boolean;
  eulogyInitial: string | null;
  hasCheckedInToday?: boolean;
  isPublic?: boolean;
  tagsInitial?: string[];
  isPinned?: boolean;
  isPro?: boolean;
  bannerUrl?: string | null;
  userId?: string;
};

export function FixDetailClient({ fixId, title: initialTitle, category: initialCategory, status: initialStatus, intensity: initialIntensity, days, ended: initialEnded, eulogyInitial, hasCheckedInToday: initialCheckedIn = false, isPublic: initialIsPublic = false, tagsInitial = [], isPinned: initialIsPinned = false, isPro = false, bannerUrl: initialBannerUrl = null, userId = "" }: Props) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const { toast } = useToast();

  const [status, setStatus] = useState<FixStatus>(initialStatus);
  const [intensity, setIntensity] = useState(initialIntensity);
  const [ended, setEnded] = useState(initialEnded);
  const [eulogyText, setEulogyText] = useState(eulogyInitial || "");

  const [showStatusDropdown, setShowStatusDropdown] = useState(false);
  const [showIntensitySlider, setShowIntensitySlider] = useState(false);
  const [showEndModal, setShowEndModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Edit state
  const [editTitle, setEditTitle] = useState(initialTitle);
  const [editCategory, setEditCategory] = useState(initialCategory);

  // Privacy state
  const [isPublic, setIsPublic] = useState(initialIsPublic);

  // Tags state
  const [tags, setTags] = useState<string[]>(tagsInitial);
  const [editingTags, setEditingTags] = useState(false);

  // Pin state
  const [isPinned, setIsPinned] = useState(initialIsPinned);

  // Banner state
  const [bannerUrl, setBannerUrl] = useState<string | null>(initialBannerUrl);

  // Check-in state
  const [checkedInToday, setCheckedInToday] = useState(initialCheckedIn);
  const [showCheckIn, setShowCheckIn] = useState(false);
  const [checkInIntensity, setCheckInIntensity] = useState(5);
  const [checkInNote, setCheckInNote] = useState("");

  // AI eulogy generation state
  const [generatingEulogy, setGeneratingEulogy] = useState(false);

  // Milestone banner
  const [milestoneDismissed, setMilestoneDismissed] = useState(false);
  const milestone = !ended ? getMilestone(days) : null;

  function handleStatusChange(newStatus: FixStatus) {
    setShowStatusDropdown(false);
    if (newStatus === status) return;
    const prevStatus = status;
    setStatus(newStatus);
    startTransition(async () => {
      try {
        await updateFixStatus(fixId, newStatus);
      } catch (err) {
        setStatus(prevStatus);
        setError(err instanceof Error ? err.message : "Failed to update status");
      }
    });
  }

  function handleIntensitySave() {
    setShowIntensitySlider(false);
    startTransition(async () => {
      try {
        await updateFixIntensity(fixId, intensity);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to update intensity");
      }
    });
  }

  function handleEndFix() {
    startTransition(async () => {
      try {
        await endFix(fixId, eulogyText);
        setEnded(true);
        setStatus("Ended");
        setShowEndModal(false);
        router.refresh();
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to end fix");
      }
    });
  }

  function handleEditSave() {
    if (!editTitle.trim()) return;
    setShowEditModal(false);
    startTransition(async () => {
      try {
        await editFix(fixId, editTitle.trim(), editCategory);
        router.refresh();
        toast({ message: "Fix updated", type: "success" });
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to update fix");
      }
    });
  }

  function handleDelete() {
    startTransition(async () => {
      try {
        await deleteFix(fixId);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to delete fix");
        setShowDeleteConfirm(false);
      }
    });
  }

  function handlePrivacyToggle() {
    const next = !isPublic;
    setIsPublic(next);
    startTransition(async () => {
      try {
        await updateFixPrivacy(fixId, next);
        toast({ message: next ? "Fix is now public" : "Fix is now private", type: "success" });
      } catch (err) {
        setIsPublic(!next);
        setError(err instanceof Error ? err.message : "Failed to update privacy");
      }
    });
  }

  async function handleGenerateEulogy() {
    setGeneratingEulogy(true);
    setEulogyText("");
    try {
      const res = await fetch("/api/eulogy/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fixId }),
      });
      if (!res.ok || !res.body) throw new Error("Failed to generate");
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let text = "";
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        text += decoder.decode(value, { stream: true });
        setEulogyText(text);
      }
    } catch {
      setError("Could not generate eulogy — try writing your own.");
    } finally {
      setGeneratingEulogy(false);
    }
  }

  function handleCheckIn() {
    startTransition(async () => {
      try {
        await checkInFix(fixId, checkInIntensity, checkInNote);
        setCheckedInToday(true);
        setShowCheckIn(false);
        setCheckInNote("");
        setCheckInIntensity(5);
        toast({ message: "Checked in ✓", type: "success" });
        router.refresh();
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to check in");
      }
    });
  }

  function handleTagsSave(newTags: string[]) {
    setTags(newTags);
    setEditingTags(false);
    startTransition(async () => {
      try {
        await updateFixTags(fixId, newTags);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to update tags");
      }
    });
  }

  const intensityColor =
    intensity >= 9 ? "#E63946" :
    intensity >= 7 ? "#FB923C" :
    "var(--accent)";

  const checkInColor =
    checkInIntensity >= 9 ? "#E63946" :
    checkInIntensity >= 7 ? "#FB923C" :
    "var(--accent)";

  return (
    <div className="flex flex-col gap-4">

      {/* Milestone banner */}
      {milestone && !milestoneDismissed && (
        <div
          className="rounded-2xl px-5 py-4 flex items-start gap-4 relative"
          style={{
            background: "var(--accent-soft)",
            border: "1px solid var(--accent-soft)",
            boxShadow: "0 0 32px var(--accent-soft)",
          }}
        >
          <span style={{ color: "var(--accent)", display: "inline-flex" }} aria-hidden>
            <milestone.Icon size={28} />
          </span>
          <div className="flex-1 min-w-0">
            <p className="font-display font-bold text-base" style={{ color: "var(--ink)", letterSpacing: "-0.02em" }}>
              {milestone.heading}
            </p>
            <p className="font-sans text-sm mt-0.5" style={{ color: "var(--ink-muted)" }}>
              {milestone.sub}
            </p>
          </div>
          <button
            onClick={() => setMilestoneDismissed(true)}
            className="shrink-0 p-1 rounded-lg transition-opacity hover:opacity-60"
            style={{ color: "var(--ink-faint)" }}
            aria-label="Dismiss"
          >
            <CloseSquare set="light" size={15} primaryColor="currentColor" />
          </button>
        </div>
      )}

      {/* Daily check-in trigger */}
      {!ended && !checkedInToday && (
        <div>
          <button
            onClick={() => setShowCheckIn(true)}
            className="inline-flex items-center gap-2 w-full sm:w-auto justify-center px-6 py-3 rounded-full font-sans text-sm font-bold transition-all hover:opacity-90 active:scale-[0.97]"
            style={{ background: "var(--accent)", color: "var(--bg)" }}
          >
            <SparkleIcon size={14} />
            Check in today
          </button>
        </div>
      )}

      {/* Full-screen check-in modal (Suntera-style) */}
      {showCheckIn && (
        <div
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4"
          style={{ background: "rgba(10,10,10,0.95)", backdropFilter: "blur(20px)" }}
        >
          <style>{`
            @keyframes checkInSlideUp {
              from { opacity: 0; transform: translateY(32px) scale(0.97); }
              to   { opacity: 1; transform: translateY(0)    scale(1); }
            }
          `}</style>
          <div
            className="w-full max-w-sm rounded-3xl overflow-hidden relative flex flex-col"
            style={{
              background: "#0D0D0F",
              border: "1px solid var(--line)",
              boxShadow: `0 32px 80px rgba(0,0,0,0.8), 0 0 60px ${checkInColor}18`,
              animation: "checkInSlideUp 0.3s cubic-bezier(0.2,0.8,0.2,1) both",
            }}
          >
            {/* Character stage — vivid colored top section */}
            <div
              className="relative flex flex-col items-center justify-end pt-8 pb-4"
              style={{
                background: checkInIntensity >= 9
                  ? "linear-gradient(180deg, #2D0A0D 0%, #1A0507 100%)"
                  : checkInIntensity >= 7
                    ? "linear-gradient(180deg, #2D1500 0%, #1A0C00 100%)"
                    : "linear-gradient(180deg, #180D2E 0%, #0E0818 100%)",
                minHeight: 240,
              }}
            >
              {/* Color glow spot behind mascot */}
              <div className="absolute inset-0 pointer-events-none" style={{
                background: `radial-gradient(ellipse 80% 80% at 50% 60%, ${checkInColor}40, transparent 65%)`,
              }} />
              {/* Close */}
              <button
                onClick={() => setShowCheckIn(false)}
                className="absolute top-4 right-4 p-2 rounded-full transition-opacity hover:opacity-60"
                style={{ background: "var(--line)", color: "var(--ink-muted)" }}
                aria-label="Cancel"
              >
                <CloseSquare set="light" size={15} primaryColor="currentColor" />
              </button>

              {/* Intensity orb — the hero */}
              <div
                className="relative flex items-center justify-center"
                style={{
                  width: 180,
                  height: 180,
                  borderRadius: 999,
                  background: `radial-gradient(circle at 35% 30%, ${checkInColor}, ${checkInColor}33 65%, transparent 80%)`,
                  boxShadow: `0 0 80px ${checkInColor}55, inset 0 0 60px ${checkInColor}33`,
                  animation: "floatY 4s ease-in-out infinite",
                }}
              >
                <span
                  className="font-display"
                  style={{
                    fontSize: 80,
                    fontWeight: 600,
                    color: "var(--bg)",
                    letterSpacing: "-0.04em",
                    textShadow: "0 2px 12px var(--ink-muted)",
                  }}
                >
                  {checkInIntensity}
                </span>
              </div>
            </div>

            {/* Content below character */}
            <div className="px-6 pt-4 pb-7 flex flex-col gap-5">
              {/* Headline */}
              <div className="text-center">
                <h2
                  className="font-display font-black leading-none uppercase"
                  style={{ color: "var(--ink)", fontSize: "clamp(26px, 7vw, 36px)", letterSpacing: "-0.02em" }}
                >
                  how bad is it
                  <br />
                  <span style={{ color: checkInColor }}>today?</span>
                </h2>
                <p className="font-mono text-[10px] mt-2 uppercase tracking-widest" style={{ color: "var(--ink-faint)" }}>
                  {new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}
                </p>
              </div>

              {/* Intensity chips — 1-10 grid */}
              <div>
                <div className="grid grid-cols-5 gap-2">
                  {[1,2,3,4,5,6,7,8,9,10].map((n) => {
                    const chipColor = n >= 9 ? "#E63946" : n >= 7 ? "#FB923C" : "var(--accent)";
                    const selected = n === checkInIntensity;
                    return (
                      <button
                        key={n}
                        onClick={() => setCheckInIntensity(n)}
                        className="py-3 rounded-2xl font-display font-black text-sm transition-all active:scale-95"
                        style={{
                          background: selected ? chipColor : "var(--line)",
                          color: selected ? "var(--bg)" : "var(--ink-muted)",
                          border: selected ? "none" : "1px solid var(--line)",
                          boxShadow: selected ? `0 0 20px ${chipColor}55` : "none",
                        }}
                      >
                        {n}
                      </button>
                    );
                  })}
                </div>
                <p
                  className="font-sans text-xs text-center mt-2 transition-all duration-150"
                  style={{ color: checkInColor }}
                >
                  {INTENSITY_LABELS[checkInIntensity]}
                </p>
              </div>

              {/* Note */}
              <textarea
                value={checkInNote}
                onChange={(e) => setCheckInNote(e.target.value)}
                placeholder="one thought about today…"
                rows={2}
                className="w-full rounded-2xl px-4 py-3 font-sans text-sm outline-none resize-none transition-colors"
                style={{
                  background: "var(--line)",
                  border: "1px solid var(--line)",
                  color: "var(--ink)",
                }}
              />

              {/* Submit */}
              <button
                onClick={handleCheckIn}
                disabled={pending}
                className="w-full py-4 rounded-2xl font-display font-black text-base uppercase tracking-wide transition-all hover:opacity-90 active:scale-[0.98] disabled:opacity-60"
                style={{ background: checkInColor, color: "var(--bg)", letterSpacing: "-0.01em" }}
              >
                {pending ? "Logging…" : "Log it →"}
              </button>
            </div>
          </div>
        </div>
      )}

      {!ended && checkedInToday && (
        <div
          className="rounded-2xl px-4 py-3 flex items-center gap-3"
          style={{
            background: "var(--accent-soft)",
            border: "1px solid var(--accent)",
          }}
        >
          <span style={{ fontSize: 16 }}>✓</span>
          <p className="font-mono text-[11px] uppercase tracking-widest" style={{ color: "var(--accent)" }}>
            Checked in today
          </p>
        </div>
      )}

      {/* Status pill (clickable) */}
      <div className="relative inline-flex">
        <button
          onClick={() => !ended && setShowStatusDropdown((v) => !v)}
          className="transition-transform hover:scale-105 active:scale-[0.97]"
          disabled={ended}
          title={ended ? "Fix has ended" : "Change status"}
        >
          <FixStatusPill status={status} size="lg" />
        </button>
        {!ended && (
          <span className="ml-2 font-mono text-[10px] self-center" style={{ color: "var(--ink-faint)" }}>
            tap to change
          </span>
        )}

        {/* Status dropdown */}
        {showStatusDropdown && (
          <>
            <div className="fixed inset-0 z-10" onClick={() => setShowStatusDropdown(false)} />
            <div
              className="absolute top-full left-0 mt-2 rounded-2xl p-2 z-20 flex flex-col gap-1 min-w-[180px]"
              style={{
                background: "var(--bg)",
                border: "1px solid var(--line)",
                boxShadow: "0 8px 32px rgba(0,0,0,0.6)",
              }}
            >
              {ALL_STATUSES.filter((s) => s !== "Ended").map((s) => (
                <button
                  key={s}
                  onClick={() => handleStatusChange(s)}
                  className="flex items-center px-3 py-2 rounded-xl transition-colors text-left"
                  style={{
                    background: s === status ? "var(--accent-soft)" : "transparent",
                  }}
                >
                  <FixStatusPill status={s} size="sm" />
                </button>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Intensity section */}
      <div
        className="rounded-2xl p-5"
        style={{
          background: intensity >= 9 ? "rgba(230,57,70,0.04)" : "var(--bg)",
          border: intensity >= 9
            ? "1px solid rgba(230,57,70,0.25)"
            : intensity >= 7
            ? "1px solid rgba(251,146,60,0.15)"
            : "1px solid var(--line)",
          boxShadow: intensity >= 9 ? "0 0 24px rgba(230,57,70,0.1)" : "none",
        }}
      >
        <div className="flex items-center justify-between mb-3">
          <div>
            <p className="font-sans text-[13px] uppercase tracking-widest font-medium" style={{ color: "var(--ink-faint)" }}>
              Intensity
            </p>
            <div className="flex items-baseline gap-2 mt-1">
              <span
                className="font-display font-black leading-none"
                style={{ color: intensityColor, fontSize: 36, letterSpacing: "-0.04em" }}
              >
                {intensity}
              </span>
              <span className="font-sans text-sm" style={{ color: "var(--ink-muted)" }}>
                / 10 · {INTENSITY_LABELS[intensity]}
              </span>
            </div>
          </div>
          {!ended && (
            <button
              onClick={() => setShowIntensitySlider((v) => !v)}
              className="px-3 py-1.5 rounded-full font-sans text-xs font-medium transition-all hover:opacity-80"
              style={{
                background: "var(--accent-soft)",
                border: "1px solid var(--accent)",
                color: "var(--accent)",
              }}
            >
              {showIntensitySlider ? "Cancel" : "Update intensity"}
            </button>
          )}
        </div>

        {/* Intensity bar (static) */}
        {!showIntensitySlider && (
          <div className="h-2 rounded-full overflow-hidden" style={{ background: "var(--line)" }}>
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{
                width: `${(intensity / 10) * 100}%`,
                background: `linear-gradient(to right, var(--accent), ${intensityColor})`,
              }}
            />
          </div>
        )}

        {/* Slider (when editing) */}
        {showIntensitySlider && (
          <div className="flex flex-col gap-3">
            <div className="relative py-3">
              <div className="h-3 rounded-full overflow-hidden" style={{ background: "var(--line)" }}>
                <div
                  className="h-full rounded-full transition-all duration-100"
                  style={{
                    width: `${(intensity / 10) * 100}%`,
                    background: `linear-gradient(to right, var(--accent), ${intensityColor})`,
                  }}
                />
              </div>
              <input
                type="range"
                min={1}
                max={10}
                value={intensity}
                onChange={(e) => setIntensity(parseInt(e.target.value, 10))}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              <div
                className="absolute top-1/2 -translate-y-1/2 w-5 h-5 rounded-full shadow-lg pointer-events-none transition-all duration-100"
                style={{
                  left: `calc(${((intensity - 1) / 9) * 100}% - 10px)`,
                  background: "var(--ink)",
                  border: `2px solid ${intensityColor}`,
                  boxShadow: `0 0 12px ${intensityColor}80`,
                }}
              />
            </div>
            <button
              onClick={handleIntensitySave}
              disabled={pending}
              className="self-end px-4 py-2 rounded-full font-sans text-sm font-bold transition-all hover:opacity-90 disabled:opacity-60"
              style={{ background: "var(--accent)", color: "var(--bg)" }}
            >
              {pending ? "Saving…" : "Save"}
            </button>
          </div>
        )}
      </div>

      {/* Error */}
      {error && (
        <p
          className="font-sans text-sm rounded-xl px-4 py-3"
          style={{
            background: "rgba(225,29,72,0.08)",
            border: "1px solid rgba(225,29,72,0.2)",
            color: "#fda4af",
          }}
        >
          {error}
          <button onClick={() => setError(null)} className="ml-2 underline">Dismiss</button>
        </p>
      )}

      {/* Tags */}
      <div className="rounded-2xl p-5" style={{ background: "var(--bg)", border: "1px solid var(--line)" }}>
        <div className="flex items-center justify-between mb-3">
          <p className="font-mono text-[10px] uppercase tracking-widest" style={{ color: "var(--ink-muted)" }}>Tags</p>
          {!ended && (
            <button onClick={() => setEditingTags(v => !v)} className="font-mono text-[10px] uppercase tracking-widest px-2.5 py-1 rounded-full transition-all"
              style={{ background: "var(--accent-soft)", border: "1px solid var(--accent)", color: "var(--accent)" }}>
              {editingTags ? "Cancel" : "Edit"}
            </button>
          )}
        </div>
        {editingTags ? (
          <div className="flex flex-col gap-3">
            <TagsInput value={tags} onChange={setTags} />
            <button onClick={() => handleTagsSave(tags)} className="self-end px-4 py-2 rounded-full font-sans text-sm font-bold"
              style={{ background: "var(--accent)", color: "var(--bg)" }}>Save tags</button>
          </div>
        ) : tags.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {tags.map(tag => (
              <span key={tag} className="font-mono text-[11px] uppercase tracking-widest rounded-full px-2.5 py-1"
                style={{ background: "var(--accent-soft)", border: "1px solid var(--accent)", color: "var(--accent)" }}>
                #{tag}
              </span>
            ))}
          </div>
        ) : (
          <p className="font-mono text-[11px] italic" style={{ color: "var(--ink-faint)" }}>No tags yet.</p>
        )}
      </div>

      {/* Banner */}
      <div className="mt-5 pt-5" style={{ borderTop: "1px solid var(--line)" }}>
        <FixBannerUpload
          userId={userId}
          fixId={fixId}
          bannerUrl={bannerUrl}
          onChange={(url) => {
            setBannerUrl(url);
            router.refresh();
          }}
        />
      </div>

      {/* Action buttons row */}
      <div className="flex flex-wrap gap-2">
        <AddToListButton fixId={fixId} />
        <button
          onClick={() => {
            const next = !isPinned;
            setIsPinned(next);
            startTransition(async () => {
              try {
                await pinFix(next ? fixId : null);
                toast({ message: next ? "Pinned to profile" : "Unpinned from profile", type: "success" });
              } catch {
                setIsPinned(!next);
              }
            });
          }}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full font-sans text-sm font-medium transition-all hover:opacity-80"
          style={isPinned
            ? { background: "var(--accent-soft)", border: "1px solid var(--accent-soft)", color: "var(--accent)" }
            : { background: "var(--line)", border: "1px solid var(--line)", color: "var(--ink-muted)" }
          }
        >
          <PinIcon size={14} />
          {isPinned ? "Pinned" : "Pin to profile"}
        </button>
        <button
          onClick={() => setShowEditModal(true)}
          className="px-4 py-2 rounded-full font-sans text-sm font-medium transition-all hover:opacity-80"
          style={{
            background: "var(--line)",
            border: "1px solid var(--line)",
            color: "var(--ink-muted)",
          }}
        >
          Edit title
        </button>
        {!ended && (
          <button
            onClick={() => setShowEndModal(true)}
            className="px-4 py-2 rounded-full font-sans text-sm font-medium transition-all hover:opacity-80"
            style={{
              background: "rgba(234,179,8,0.08)",
              border: "1px solid rgba(234,179,8,0.2)",
              color: "#fcd34d",
            }}
          >
            Mark as ended
          </button>
        )}
      </div>

      {/* Edit modal */}
      {showEditModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: "rgba(0,0,0,0.7)" }}>
          <div className="w-full max-w-md rounded-3xl p-6" style={{ background: "var(--bg)", border: "1px solid var(--line)" }}>
            <h2 className="font-display font-bold text-xl mb-4" style={{ color: "var(--ink)", letterSpacing: "-0.02em" }}>Edit fix</h2>
            <input
              type="text"
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              className="w-full rounded-xl px-4 py-3 font-sans text-sm outline-none focus:ring-2 focus:ring-[var(--accent)]/40 mb-3"
              style={{ background: "var(--bg)", border: "1px solid var(--line)", color: "var(--ink)" }}
              placeholder="Title"
            />
            <div className="flex flex-wrap gap-2 mb-4">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setEditCategory(cat)}
                  className="px-3 py-1 rounded-full font-mono text-[10px] uppercase tracking-widest transition-all"
                  style={editCategory === cat
                    ? { background: "var(--accent)", color: "var(--bg)" }
                    : { background: "var(--line)", border: "1px solid var(--line)", color: "var(--ink-muted)" }
                  }
                >
                  {cat}
                </button>
              ))}
            </div>
            <div className="flex gap-3">
              <button onClick={() => setShowEditModal(false)} className="flex-1 py-2.5 rounded-xl font-sans text-sm font-medium" style={{ background: "var(--line)", border: "1px solid var(--line)", color: "var(--ink-muted)" }}>Cancel</button>
              <button onClick={handleEditSave} disabled={pending || !editTitle.trim()} className="flex-1 py-2.5 rounded-xl font-sans text-sm font-bold disabled:opacity-60" style={{ background: "var(--accent)", color: "var(--bg)" }}>
                {pending ? "Saving…" : "Save"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* End fix modal */}
      {showEndModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: "rgba(0,0,0,0.7)" }}>
          <div
            className="w-full max-w-md rounded-3xl p-6"
            style={{
              background: "var(--bg)",
              border: "1px solid var(--line)",
            }}
          >
            <h2 className="font-display font-bold text-xl mb-1" style={{ color: "var(--ink)", letterSpacing: "-0.02em" }}>
              Write a farewell
            </h2>
            <p className="font-sans text-sm mb-4" style={{ color: "var(--ink-muted)" }}>
              Optional — say goodbye to this fix.
            </p>
            <div className="relative mb-2">
              <textarea
                value={eulogyText}
                onChange={(e) => setEulogyText(e.target.value)}
                placeholder="It was good while it lasted…"
                rows={4}
                className="w-full rounded-xl px-4 py-3 font-display italic text-sm outline-none transition-all duration-150 placeholder:text-[var(--line)] focus:ring-2 focus:ring-[var(--accent)]/40 resize-none"
                style={{
                  background: "var(--bg)",
                  border: "1px solid var(--line)",
                  color: "var(--ink)",
                }}
              />
              {generatingEulogy && (
                <div className="absolute bottom-3 right-3 flex items-center gap-1.5">
                  <span className="font-mono text-[9px] uppercase tracking-widest animate-pulse" style={{ color: "var(--accent)" }}>
                    writing…
                  </span>
                </div>
              )}
            </div>
            {isPro ? (
              <button
                type="button"
                onClick={handleGenerateEulogy}
                disabled={generatingEulogy || pending}
                className="w-full mb-3 py-2 rounded-xl font-sans text-sm font-medium transition-all hover:opacity-80 disabled:opacity-50 flex items-center justify-center gap-2"
                style={{
                  background: "var(--accent-soft)",
                  border: "1px solid var(--accent)",
                  color: "var(--accent)",
                }}
              >
                <Star set="bold" size={15} primaryColor="currentColor" />
                {generatingEulogy ? "Generating…" : "Write it for me with AI"}
              </button>
            ) : (
              <a
                href="/dashboard/settings"
                className="w-full mb-3 py-2 rounded-xl font-sans text-sm font-medium transition-all hover:opacity-80 flex items-center justify-center gap-2"
                style={{
                  background: "var(--accent-soft)",
                  border: "1px dashed var(--accent)",
                  color: "var(--accent)",
                  textDecoration: "none",
                }}
              >
                <Star set="light" size={15} primaryColor="currentColor" />
                AI eulogy — Pro only · upgrade →
              </a>
            )}
            <div className="flex gap-3">
              <button
                onClick={() => setShowEndModal(false)}
                className="flex-1 py-2.5 rounded-xl font-sans text-sm font-medium transition-all hover:opacity-80"
                style={{
                  background: "var(--line)",
                  border: "1px solid var(--line)",
                  color: "var(--ink-muted)",
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleEndFix}
                disabled={pending}
                className="flex-1 py-2.5 rounded-xl font-sans text-sm font-bold transition-all hover:opacity-90 disabled:opacity-60"
                style={{ background: "#fcd34d", color: "var(--bg)" }}
              >
                {pending ? "Ending…" : "End this fix"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Privacy toggle */}
      <div
        className="rounded-2xl p-5"
        style={{
          background: "var(--bg)",
          border: "1px solid var(--line)",
        }}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* Public/Private pill */}
            <span
              className="px-2.5 py-1 rounded-full font-mono text-[10px] uppercase tracking-widest"
              style={
                isPublic
                  ? {
                      background: "var(--accent-soft)",
                      border: "1px solid rgba(111,138,99,0.25)",
                      color: "var(--accent)",
                    }
                  : {
                      background: "var(--line)",
                      border: "1px solid var(--line)",
                      color: "var(--ink-muted)",
                    }
              }
            >
              {isPublic ? "Public" : "Private"}
            </span>
            {/* Toggle switch */}
            <button
              type="button"
              role="switch"
              aria-checked={isPublic}
              onClick={handlePrivacyToggle}
              disabled={pending}
              className="relative inline-flex transition-opacity disabled:opacity-50"
              aria-label="Toggle fix privacy"
            >
              <div
                className="w-10 h-6 rounded-full transition-all duration-200"
                style={{
                  background: isPublic ? "var(--accent)" : "var(--line)",
                  border: isPublic ? "1px solid var(--accent)" : "1px solid var(--line)",
                }}
              >
                <div
                  className="w-4 h-4 rounded-full transition-all duration-200 mt-0.5"
                  style={{
                    background: isPublic ? "var(--bg)" : "var(--ink-muted)",
                    transform: isPublic ? "translateX(22px)" : "translateX(2px)",
                  }}
                />
              </div>
            </button>
          </div>
        </div>
        <p className="mt-2 font-sans text-[12px]" style={{ color: "var(--ink-faint)" }}>
          Public fixes can be shared and appear on your profile
        </p>
      </div>

      {/* Delete button */}
      <div className="mt-8 pt-6" style={{ borderTop: "1px solid var(--line)" }}>
        {!showDeleteConfirm ? (
          <button
            onClick={() => setShowDeleteConfirm(true)}
            className="font-sans text-sm transition-colors hover:opacity-80"
            style={{ color: "var(--ink-faint)" }}
          >
            Delete this fix
          </button>
        ) : (
          <div className="flex flex-col gap-2">
            <p className="font-sans text-sm" style={{ color: "var(--ink-muted)" }}>
              Are you sure? This can&apos;t be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="px-4 py-2 rounded-xl font-sans text-sm font-medium transition-all"
                style={{
                  background: "var(--line)",
                  border: "1px solid var(--line)",
                  color: "var(--ink-muted)",
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={pending}
                className="px-4 py-2 rounded-xl font-sans text-sm font-bold transition-all hover:opacity-90 disabled:opacity-60"
                style={{ background: "rgba(225,29,72,0.15)", border: "1px solid rgba(225,29,72,0.3)", color: "#fda4af" }}
              >
                {pending ? "Deleting…" : "Yes, delete"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
