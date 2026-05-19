"use client";

import { useState, useTransition } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter, useSearchParams } from "next/navigation";
import { TagsInput } from "@/components/TagsInput";

const CATEGORIES = [
  "song", "fanfic", "show", "film", "ship", "game",
  "video essay", "podcast", "book", "character", "other",
] as const;

type Category = typeof CATEGORIES[number];

const INTENSITY_LABELS: Record<number, string> = {
  1: "mild interest",
  2: "mild interest",
  3: "it's something",
  4: "it's something",
  5: "definitely a thing",
  6: "definitely a thing",
  7: "deeply unwell",
  8: "deeply unwell",
  9: "send help",
  10: "send help",
};

type NewFixFormProps = {
  isPro?: boolean;
  activeFixCount?: number;
};

export function NewFixForm({ isPro = false, activeFixCount = 0 }: NewFixFormProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const showWelcome = searchParams.get("welcome") === "1";
  const [pending, startTransition] = useTransition();

  const [welcomeDismissed, setWelcomeDismissed] = useState(false);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState<Category | null>(null);
  const [intensity, setIntensity] = useState(5);
  const [note, setNote] = useState("");
  const [isPublic, setIsPublic] = useState(false);
  const [tags, setTags] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!title.trim()) {
      setError("Please enter a title.");
      return;
    }

    if (!isPro && activeFixCount >= 3) {
      setError("You've hit the free limit. End an active fix or upgrade to Pro.");
      return;
    }

    startTransition(async () => {
      try {
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          router.push("/auth/login");
          return;
        }

        const { data, error: insertError } = await supabase
          .from("fixes")
          .insert({
            user_id: user.id,
            title: title.trim(),
            category: category || "other",
            status: "Day 1",
            intensity,
            note: note.trim() || null,
            is_public: isPublic,
            started_at: new Date().toISOString(),
            tags,
          })
          .select("id")
          .single();

        if (insertError) {
          setError(`Failed to save: ${insertError.message}`);
          return;
        }

        router.push(`/dashboard/fix/${data.id}`);
        router.refresh();
      } catch (err) {
        setError(err instanceof Error ? err.message : "Something went wrong.");
      }
    });
  }

  const intensityLabel = INTENSITY_LABELS[intensity] || "definitely a thing";
  const intensityColor =
    intensity >= 9 ? "#E63946" :
    intensity >= 7 ? "#FB923C" :
    "#A3E635";

  return (
    <div className="flex flex-col gap-8">
      {/* Welcome banner */}
      {showWelcome && !welcomeDismissed && (
        <div
          className="relative rounded-xl p-4"
          style={{
            background: "rgba(163,230,53,0.08)",
            border: "1px solid rgba(163,230,53,0.2)",
          }}
        >
          <button
            type="button"
            onClick={() => setWelcomeDismissed(true)}
            className="absolute top-3 right-3 p-1 rounded-lg transition-colors hover:opacity-70"
            style={{ color: "rgba(163,230,53,0.6)" }}
            aria-label="Dismiss welcome banner"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
          <p className="font-sans text-sm pr-6" style={{ color: "rgba(163,230,53,0.9)" }}>
            Welcome to Hyperfix 👋 Log your first fix below — what are you unwell about right now?
          </p>
        </div>
      )}

      {/* Pro limit banner */}
      {!isPro && activeFixCount >= 3 && (
        <div
          className="rounded-xl px-4 py-3 flex items-center justify-between gap-4"
          style={{
            background: "rgba(251,146,60,0.08)",
            border: "1px solid rgba(251,146,60,0.25)",
          }}
        >
          <p className="font-sans text-sm" style={{ color: "rgba(251,146,60,0.9)" }}>
            You&apos;ve hit the free limit (3 active fixes). End one or upgrade to Pro for unlimited.
          </p>
          <a
            href="/pricing"
            className="font-sans text-sm font-semibold shrink-0 transition-opacity hover:opacity-80"
            style={{ color: "#FB923C" }}
          >
            Upgrade →
          </a>
        </div>
      )}

    {/* Quick templates */}
    <div className="flex flex-col gap-3">
      <p className="font-mono text-[10px] uppercase tracking-widest" style={{ color: "rgba(244,244,244,0.3)" }}>Quick start</p>
      <div className="flex flex-wrap gap-2">
        {[
          { label: "🎵 Song on loop", cat: "song" as Category, placeholder: "which song?" },
          { label: "📖 Fanfic", cat: "fanfic" as Category, placeholder: "which fic?" },
          { label: "📺 Show", cat: "show" as Category, placeholder: "which show?" },
          { label: "🎮 Game", cat: "game" as Category, placeholder: "which game?" },
          { label: "🚢 Ship", cat: "ship" as Category, placeholder: "who?" },
          { label: "🎬 Film", cat: "film" as Category, placeholder: "which film?" },
        ].map((t) => (
          <button
            key={t.label}
            type="button"
            onClick={() => { setCategory(t.cat); setTitle(""); }}
            className="px-3 py-1.5 rounded-full font-sans text-sm transition-all hover:opacity-90"
            style={category === t.cat
              ? { background: "#A3E635", color: "#0A0A0A", fontWeight: 600 }
              : { background: "rgba(244,244,244,0.06)", border: "1px solid rgba(244,244,244,0.1)", color: "rgba(244,244,244,0.6)" }
            }
          >
            {t.label}
          </button>
        ))}
      </div>
    </div>

    <form onSubmit={handleSubmit} className="flex flex-col gap-8">

      {/* Title */}
      <div className="flex flex-col gap-2">
        <label className="font-sans text-[13px] font-medium" style={{ color: "rgba(244,244,244,0.65)" }}>
          Title <span style={{ color: "#A3E635" }}>*</span>
        </label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="What are you unwell about?"
          className="w-full rounded-xl px-4 py-4 font-sans text-lg outline-none transition-all duration-150 placeholder:text-[rgba(244,244,244,0.18)] focus:ring-2 focus:ring-[#A3E635]/40"
          style={{
            background: "#111113",
            border: "1px solid rgba(244,244,244,0.1)",
            color: "#F4F4F4",
            letterSpacing: "-0.01em",
          }}
          required
          autoFocus
        />
      </div>

      {/* Category */}
      <div className="flex flex-col gap-3">
        <label className="font-sans text-[13px] font-medium" style={{ color: "rgba(244,244,244,0.65)" }}>
          Category
        </label>
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map((cat) => {
            const isSelected = category === cat;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => setCategory(cat)}
                className="px-3 py-1.5 rounded-full font-mono text-[11px] uppercase tracking-widest transition-all duration-150 hover:scale-105 active:scale-[0.97]"
                style={{
                  background: isSelected ? "rgba(163,230,53,0.15)" : "rgba(244,244,244,0.05)",
                  border: isSelected ? "1px solid rgba(163,230,53,0.4)" : "1px solid rgba(244,244,244,0.1)",
                  color: isSelected ? "#A3E635" : "rgba(244,244,244,0.5)",
                }}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </div>

      {/* Intensity slider */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <label className="font-sans text-[13px] font-medium" style={{ color: "rgba(244,244,244,0.65)" }}>
            Intensity
          </label>
          <div className="flex items-center gap-2">
            <span
              className="font-display font-black leading-none"
              style={{ color: intensityColor, fontSize: 28, letterSpacing: "-0.04em" }}
            >
              {intensity}
            </span>
            <span
              className="font-mono text-[10px] uppercase tracking-widest px-2 py-1 rounded-full"
              style={{
                background: `${intensityColor}18`,
                border: `1px solid ${intensityColor}40`,
                color: intensityColor,
              }}
            >
              {intensityLabel}
            </span>
          </div>
        </div>

        {/* Slider track */}
        <div className="relative py-3">
          <div
            className="h-3 rounded-full relative overflow-hidden"
            style={{ background: "rgba(244,244,244,0.08)" }}
          >
            <div
              className="h-full rounded-full transition-all duration-150"
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
            style={{ margin: 0 }}
          />
          {/* Thumb overlay */}
          <div
            className="absolute top-1/2 -translate-y-1/2 w-5 h-5 rounded-full shadow-lg transition-all duration-150 pointer-events-none"
            style={{
              left: `calc(${((intensity - 1) / 9) * 100}% - 10px)`,
              background: "#F4F4F4",
              boxShadow: `0 0 12px ${intensityColor}80, 0 2px 6px rgba(0,0,0,0.4)`,
              border: `2px solid ${intensityColor}`,
            }}
          />
        </div>

        {/* Scale labels */}
        <div className="flex justify-between">
          <span className="font-mono text-[9px]" style={{ color: "rgba(244,244,244,0.25)" }}>1 · mild</span>
          <span className="font-mono text-[9px]" style={{ color: "rgba(244,244,244,0.25)" }}>10 · send help</span>
        </div>
      </div>

      {/* Note */}
      <div className="flex flex-col gap-2">
        <label className="font-sans text-[13px] font-medium" style={{ color: "rgba(244,244,244,0.65)" }}>
          Note{" "}
          <span className="font-mono text-[11px]" style={{ color: "rgba(244,244,244,0.25)" }}>optional</span>
        </label>
        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="One sentence about why you're in it"
          rows={3}
          className="w-full rounded-xl px-4 py-3 font-sans text-sm outline-none transition-all duration-150 placeholder:text-[rgba(244,244,244,0.18)] focus:ring-2 focus:ring-[#A3E635]/40 resize-none"
          style={{
            background: "#111113",
            border: "1px solid rgba(244,244,244,0.1)",
            color: "#F4F4F4",
          }}
        />
      </div>

      {/* Tags */}
      <div className="flex flex-col gap-2">
        <label className="font-mono text-[10px] uppercase tracking-widest" style={{ color: "rgba(244,244,244,0.4)" }}>
          Tags
        </label>
        <TagsInput value={tags} onChange={setTags} />
        <p className="font-mono text-[10px]" style={{ color: "rgba(244,244,244,0.25)" }}>
          Up to 5 tags. Press enter to add.
        </p>
      </div>

      {/* Public toggle */}
      <label className="flex items-center gap-3 cursor-pointer group">
        <div className="relative">
          <input
            type="checkbox"
            checked={isPublic}
            onChange={(e) => setIsPublic(e.target.checked)}
            className="sr-only"
          />
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
        </div>
        <div>
          <p className="font-sans text-sm font-medium" style={{ color: "#F4F4F4" }}>
            Share publicly
          </p>
          <p className="font-sans text-[12px]" style={{ color: "rgba(244,244,244,0.3)" }}>
            Others can see this fix on your profile
          </p>
        </div>
      </label>

      {/* Error */}
      {error && (
        <p
          className="font-sans text-sm rounded-xl px-4 py-3"
          style={{
            background: "rgba(225,29,72,0.1)",
            border: "1px solid rgba(225,29,72,0.25)",
            color: "#fda4af",
          }}
        >
          {error}
        </p>
      )}

      {/* Submit */}
      <button
        type="submit"
        disabled={pending}
        className="w-full py-4 rounded-2xl font-sans text-base font-bold transition-all hover:opacity-90 active:scale-[0.98] disabled:opacity-60"
        style={{ background: "#A3E635", color: "#0A0A0A" }}
      >
        {pending ? "Saving…" : "Start tracking →"}
      </button>
    </form>
    </div>
  );
}
