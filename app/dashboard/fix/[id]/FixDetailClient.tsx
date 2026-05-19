"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { FixStatusPill, type FixStatus } from "@/components/FixStatusPill";
import { updateFixStatus, updateFixIntensity, endFix, deleteFix, checkInFix, updateFixPrivacy, editFix, pinFix } from "@/app/actions/fixes";
import { updateFixTags } from "@/app/actions/tags";
import { AddToListButton } from "@/components/AddToListButton";
import { useToast } from "@/components/Toast";
import { TagsInput } from "@/components/TagsInput";

const ALL_STATUSES: FixStatus[] = [
  "Day 1", "Obsessing", "On loop", "Fading", "Post-fix", "Ended", "Dormant", "Send help",
];

const INTENSITY_LABELS: Record<number, string> = {
  1: "mild interest", 2: "mild interest",
  3: "it's something", 4: "it's something",
  5: "definitely a thing", 6: "definitely a thing",
  7: "deeply unwell", 8: "deeply unwell",
  9: "send help", 10: "send help",
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
};

export function FixDetailClient({ fixId, title: initialTitle, category: initialCategory, status: initialStatus, intensity: initialIntensity, days, ended: initialEnded, eulogyInitial, hasCheckedInToday: initialCheckedIn = false, isPublic: initialIsPublic = false, tagsInitial = [], isPinned: initialIsPinned = false }: Props) {
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

  // Check-in state
  const [checkedInToday, setCheckedInToday] = useState(initialCheckedIn);
  const [showCheckIn, setShowCheckIn] = useState(false);
  const [checkInIntensity, setCheckInIntensity] = useState(5);
  const [checkInNote, setCheckInNote] = useState("");

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
    "#A3E635";

  const checkInColor =
    checkInIntensity >= 9 ? "#E63946" :
    checkInIntensity >= 7 ? "#FB923C" :
    "#A3E635";

  return (
    <div className="flex flex-col gap-4">

      {/* Daily check-in */}
      {!ended && !checkedInToday && (
        <div>
          <button
            onClick={() => setShowCheckIn((v) => !v)}
            className="px-4 py-2 rounded-full font-sans text-sm font-semibold transition-all hover:opacity-80 active:scale-[0.97]"
            style={{
              background: "transparent",
              border: "1px solid rgba(163,230,53,0.5)",
              color: "#A3E635",
            }}
          >
            Check in today +
          </button>

          {showCheckIn && (
            <div
              className="mt-3 rounded-2xl p-5 flex flex-col gap-4"
              style={{
                background: "#111113",
                border: "1px solid rgba(163,230,53,0.15)",
                animation: "detailsReveal 0.25s cubic-bezier(0.2,0.6,0.2,1) both",
              }}
            >
              <h3 className="font-display font-bold text-base" style={{ color: "#F4F4F4", letterSpacing: "-0.02em" }}>
                How&apos;s this fix today?
              </h3>

              {/* Intensity slider */}
              <div>
                <div className="flex justify-between mb-2">
                  <span className="font-mono text-[10px] uppercase tracking-widest" style={{ color: "rgba(244,244,244,0.4)" }}>
                    Intensity
                  </span>
                  <span className="font-mono text-[10px]" style={{ color: checkInColor }}>
                    {checkInIntensity}/10
                  </span>
                </div>
                <div className="relative py-3">
                  <div className="h-3 rounded-full overflow-hidden" style={{ background: "rgba(244,244,244,0.08)" }}>
                    <div
                      className="h-full rounded-full transition-all duration-100"
                      style={{
                        width: `${(checkInIntensity / 10) * 100}%`,
                        background: `linear-gradient(to right, #A3E635, ${checkInColor})`,
                      }}
                    />
                  </div>
                  <input
                    type="range"
                    min={1}
                    max={10}
                    value={checkInIntensity}
                    onChange={(e) => setCheckInIntensity(parseInt(e.target.value, 10))}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  <div
                    className="absolute top-1/2 -translate-y-1/2 w-5 h-5 rounded-full shadow-lg pointer-events-none transition-all duration-100"
                    style={{
                      left: `calc(${((checkInIntensity - 1) / 9) * 100}% - 10px)`,
                      background: "#F4F4F4",
                      border: `2px solid ${checkInColor}`,
                      boxShadow: `0 0 12px ${checkInColor}80`,
                    }}
                  />
                </div>
              </div>

              {/* Note textarea */}
              <textarea
                value={checkInNote}
                onChange={(e) => setCheckInNote(e.target.value)}
                placeholder="one thought about today…"
                rows={2}
                className="w-full rounded-xl px-4 py-3 font-sans text-sm outline-none transition-all duration-150 placeholder:text-[rgba(244,244,244,0.18)] focus:ring-2 focus:ring-[#A3E635]/30 resize-none"
                style={{
                  background: "#161618",
                  border: "1px solid rgba(244,244,244,0.1)",
                  color: "#F4F4F4",
                }}
              />

              <div className="flex gap-3">
                <button
                  onClick={() => setShowCheckIn(false)}
                  className="px-4 py-2 rounded-xl font-sans text-sm font-medium transition-all hover:opacity-80"
                  style={{
                    background: "rgba(244,244,244,0.06)",
                    border: "1px solid rgba(244,244,244,0.1)",
                    color: "rgba(244,244,244,0.6)",
                  }}
                >
                  Cancel
                </button>
                <button
                  onClick={handleCheckIn}
                  disabled={pending}
                  className="px-5 py-2 rounded-xl font-sans text-sm font-bold transition-all hover:opacity-90 disabled:opacity-60"
                  style={{ background: "#A3E635", color: "#0A0A0A" }}
                >
                  {pending ? "Logging…" : "Log it →"}
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {!ended && checkedInToday && (
        <p className="font-mono text-[11px] uppercase tracking-widest" style={{ color: "rgba(163,230,53,0.5)" }}>
          ✓ Checked in today
        </p>
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
          <span className="ml-2 font-mono text-[10px] self-center" style={{ color: "rgba(244,244,244,0.3)" }}>
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
                background: "#161618",
                border: "1px solid rgba(244,244,244,0.1)",
                boxShadow: "0 8px 32px rgba(0,0,0,0.6)",
              }}
            >
              {ALL_STATUSES.filter((s) => s !== "Ended").map((s) => (
                <button
                  key={s}
                  onClick={() => handleStatusChange(s)}
                  className="flex items-center px-3 py-2 rounded-xl transition-colors text-left"
                  style={{
                    background: s === status ? "rgba(163,230,53,0.08)" : "transparent",
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
          background: "#111113",
          border: "1px solid rgba(244,244,244,0.07)",
        }}
      >
        <div className="flex items-center justify-between mb-3">
          <div>
            <p className="font-sans text-[13px] uppercase tracking-widest font-medium" style={{ color: "rgba(244,244,244,0.3)" }}>
              Intensity
            </p>
            <div className="flex items-baseline gap-2 mt-1">
              <span
                className="font-display font-black leading-none"
                style={{ color: intensityColor, fontSize: 36, letterSpacing: "-0.04em" }}
              >
                {intensity}
              </span>
              <span className="font-sans text-sm" style={{ color: "rgba(244,244,244,0.4)" }}>
                / 10 · {INTENSITY_LABELS[intensity]}
              </span>
            </div>
          </div>
          {!ended && (
            <button
              onClick={() => setShowIntensitySlider((v) => !v)}
              className="px-3 py-1.5 rounded-full font-sans text-xs font-medium transition-all hover:opacity-80"
              style={{
                background: "rgba(163,230,53,0.08)",
                border: "1px solid rgba(163,230,53,0.2)",
                color: "#A3E635",
              }}
            >
              {showIntensitySlider ? "Cancel" : "Update intensity"}
            </button>
          )}
        </div>

        {/* Intensity bar (static) */}
        {!showIntensitySlider && (
          <div className="h-2 rounded-full overflow-hidden" style={{ background: "rgba(244,244,244,0.08)" }}>
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{
                width: `${(intensity / 10) * 100}%`,
                background: `linear-gradient(to right, #A3E635, ${intensityColor})`,
              }}
            />
          </div>
        )}

        {/* Slider (when editing) */}
        {showIntensitySlider && (
          <div className="flex flex-col gap-3">
            <div className="relative py-3">
              <div className="h-3 rounded-full overflow-hidden" style={{ background: "rgba(244,244,244,0.08)" }}>
                <div
                  className="h-full rounded-full transition-all duration-100"
                  style={{
                    width: `${(intensity / 10) * 100}%`,
                    background: `linear-gradient(to right, #A3E635, ${intensityColor})`,
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
                  background: "#F4F4F4",
                  border: `2px solid ${intensityColor}`,
                  boxShadow: `0 0 12px ${intensityColor}80`,
                }}
              />
            </div>
            <button
              onClick={handleIntensitySave}
              disabled={pending}
              className="self-end px-4 py-2 rounded-full font-sans text-sm font-bold transition-all hover:opacity-90 disabled:opacity-60"
              style={{ background: "#A3E635", color: "#0A0A0A" }}
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
      <div className="rounded-2xl p-5" style={{ background: "#111113", border: "1px solid rgba(244,244,244,0.07)" }}>
        <div className="flex items-center justify-between mb-3">
          <p className="font-mono text-[10px] uppercase tracking-widest" style={{ color: "rgba(244,244,244,0.4)" }}>Tags</p>
          {!ended && (
            <button onClick={() => setEditingTags(v => !v)} className="font-mono text-[10px] uppercase tracking-widest px-2.5 py-1 rounded-full transition-all"
              style={{ background: "rgba(163,230,53,0.08)", border: "1px solid rgba(163,230,53,0.2)", color: "#A3E635" }}>
              {editingTags ? "Cancel" : "Edit"}
            </button>
          )}
        </div>
        {editingTags ? (
          <div className="flex flex-col gap-3">
            <TagsInput value={tags} onChange={setTags} />
            <button onClick={() => handleTagsSave(tags)} className="self-end px-4 py-2 rounded-full font-sans text-sm font-bold"
              style={{ background: "#A3E635", color: "#0A0A0A" }}>Save tags</button>
          </div>
        ) : tags.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {tags.map(tag => (
              <span key={tag} className="font-mono text-[11px] uppercase tracking-widest rounded-full px-2.5 py-1"
                style={{ background: "rgba(163,230,53,0.08)", border: "1px solid rgba(163,230,53,0.2)", color: "#A3E635" }}>
                #{tag}
              </span>
            ))}
          </div>
        ) : (
          <p className="font-mono text-[11px] italic" style={{ color: "rgba(244,244,244,0.25)" }}>No tags yet.</p>
        )}
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
                toast({ message: next ? "📌 Pinned to profile" : "Unpinned from profile", type: "success" });
              } catch {
                setIsPinned(!next);
              }
            });
          }}
          className="px-4 py-2 rounded-full font-sans text-sm font-medium transition-all hover:opacity-80"
          style={isPinned
            ? { background: "rgba(163,230,53,0.12)", border: "1px solid rgba(163,230,53,0.3)", color: "#A3E635" }
            : { background: "rgba(244,244,244,0.06)", border: "1px solid rgba(244,244,244,0.12)", color: "rgba(244,244,244,0.6)" }
          }
        >
          {isPinned ? "📌 Pinned" : "Pin to profile"}
        </button>
        <button
          onClick={() => setShowEditModal(true)}
          className="px-4 py-2 rounded-full font-sans text-sm font-medium transition-all hover:opacity-80"
          style={{
            background: "rgba(244,244,244,0.06)",
            border: "1px solid rgba(244,244,244,0.12)",
            color: "rgba(244,244,244,0.6)",
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
          <div className="w-full max-w-md rounded-3xl p-6" style={{ background: "#111113", border: "1px solid rgba(244,244,244,0.1)" }}>
            <h2 className="font-display font-bold text-xl mb-4" style={{ color: "#F4F4F4", letterSpacing: "-0.02em" }}>Edit fix</h2>
            <input
              type="text"
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              className="w-full rounded-xl px-4 py-3 font-sans text-sm outline-none focus:ring-2 focus:ring-[#A3E635]/40 mb-3"
              style={{ background: "#161618", border: "1px solid rgba(244,244,244,0.1)", color: "#F4F4F4" }}
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
                    ? { background: "#A3E635", color: "#0A0A0A" }
                    : { background: "rgba(244,244,244,0.06)", border: "1px solid rgba(244,244,244,0.1)", color: "rgba(244,244,244,0.5)" }
                  }
                >
                  {cat}
                </button>
              ))}
            </div>
            <div className="flex gap-3">
              <button onClick={() => setShowEditModal(false)} className="flex-1 py-2.5 rounded-xl font-sans text-sm font-medium" style={{ background: "rgba(244,244,244,0.06)", border: "1px solid rgba(244,244,244,0.1)", color: "rgba(244,244,244,0.6)" }}>Cancel</button>
              <button onClick={handleEditSave} disabled={pending || !editTitle.trim()} className="flex-1 py-2.5 rounded-xl font-sans text-sm font-bold disabled:opacity-60" style={{ background: "#A3E635", color: "#0A0A0A" }}>
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
              background: "#111113",
              border: "1px solid rgba(244,244,244,0.1)",
            }}
          >
            <h2 className="font-display font-bold text-xl mb-1" style={{ color: "#F4F4F4", letterSpacing: "-0.02em" }}>
              Write a farewell
            </h2>
            <p className="font-sans text-sm mb-4" style={{ color: "rgba(244,244,244,0.4)" }}>
              Optional — say goodbye to this fix.
            </p>
            <textarea
              value={eulogyText}
              onChange={(e) => setEulogyText(e.target.value)}
              placeholder="It was good while it lasted…"
              rows={4}
              className="w-full rounded-xl px-4 py-3 font-display italic text-sm outline-none transition-all duration-150 placeholder:text-[rgba(244,244,244,0.18)] focus:ring-2 focus:ring-[#A3E635]/40 resize-none mb-2"
              style={{
                background: "#161618",
                border: "1px solid rgba(244,244,244,0.1)",
                color: "#F4F4F4",
              }}
            />
            <div className="flex gap-3">
              <button
                onClick={() => setShowEndModal(false)}
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
                onClick={handleEndFix}
                disabled={pending}
                className="flex-1 py-2.5 rounded-xl font-sans text-sm font-bold transition-all hover:opacity-90 disabled:opacity-60"
                style={{ background: "#fcd34d", color: "#0A0A0A" }}
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
          background: "#111113",
          border: "1px solid rgba(244,244,244,0.07)",
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
                      background: "rgba(163,230,53,0.12)",
                      border: "1px solid rgba(163,230,53,0.35)",
                      color: "#A3E635",
                    }
                  : {
                      background: "rgba(244,244,244,0.06)",
                      border: "1px solid rgba(244,244,244,0.12)",
                      color: "rgba(244,244,244,0.4)",
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
                  background: isPublic ? "#A3E635" : "rgba(244,244,244,0.1)",
                  border: isPublic ? "1px solid rgba(163,230,53,0.5)" : "1px solid rgba(244,244,244,0.1)",
                }}
              >
                <div
                  className="w-4 h-4 rounded-full transition-all duration-200 mt-0.5"
                  style={{
                    background: isPublic ? "#0A0A0A" : "rgba(244,244,244,0.4)",
                    transform: isPublic ? "translateX(22px)" : "translateX(2px)",
                  }}
                />
              </div>
            </button>
          </div>
        </div>
        <p className="mt-2 font-sans text-[12px]" style={{ color: "rgba(244,244,244,0.3)" }}>
          Public fixes can be shared and appear on your profile
        </p>
      </div>

      {/* Delete button */}
      <div className="mt-8 pt-6" style={{ borderTop: "1px solid rgba(244,244,244,0.06)" }}>
        {!showDeleteConfirm ? (
          <button
            onClick={() => setShowDeleteConfirm(true)}
            className="font-sans text-sm transition-colors hover:opacity-80"
            style={{ color: "rgba(244,244,244,0.2)" }}
          >
            Delete this fix
          </button>
        ) : (
          <div className="flex flex-col gap-2">
            <p className="font-sans text-sm" style={{ color: "rgba(244,244,244,0.5)" }}>
              Are you sure? This can&apos;t be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="px-4 py-2 rounded-xl font-sans text-sm font-medium transition-all"
                style={{
                  background: "rgba(244,244,244,0.06)",
                  border: "1px solid rgba(244,244,244,0.1)",
                  color: "rgba(244,244,244,0.6)",
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
