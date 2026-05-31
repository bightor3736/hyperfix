"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createList } from "@/app/actions/lists";
import { ArrowLeft } from "react-iconly";

export default function NewListPage() {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [isPublic, setIsPublic] = useState(true);
  const [error, setError] = useState<string | null>(null);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!name.trim()) {
      setError("Please enter a name for your list.");
      return;
    }

    startTransition(async () => {
      const result = await createList(name, description, isPublic);
      if ("error" in result) {
        setError(result.error);
        return;
      }
      router.push(`/dashboard/lists/${result.id}`);
    });
  }

  return (
    <div className="min-h-screen px-4 sm:px-6 lg:px-8 pt-8 pb-12" style={{ background: "var(--bg)" }}>
      <div className="max-w-xl mx-auto">

        {/* Back */}
        <div className="mb-8">
          <Link
            href="/dashboard/lists"
            className="inline-flex items-center gap-2 font-sans text-sm transition-colors hover:opacity-80"
            style={{ color: "var(--ink-muted)" }}
          >
            <ArrowLeft set="light" size={18} primaryColor="currentColor" />
            Your lists
          </Link>
        </div>

        {/* Header */}
        <div className="mb-8">
          <p className="font-mono text-[11px] uppercase tracking-[0.18em] mb-3" style={{ color: "var(--accent)" }}>
            new list
          </p>
          <h1
            className="font-display leading-tight"
            style={{ color: "var(--ink)", fontSize: "clamp(24px, 4vw, 36px)", letterSpacing: "-0.02em", fontWeight: 600 }}
          >
            Curate a collection
          </h1>
          <p className="font-sans text-sm mt-1" style={{ color: "var(--ink-muted)" }}>
            Curate your fixations into a collection.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">

          {/* Name */}
          <div className="flex flex-col gap-2">
            <label className="font-sans text-[13px] font-medium" style={{ color: "var(--ink-muted)" }}>
              Name <span style={{ color: "var(--accent)" }}>*</span>
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="My top fixations of 2025"
              className="w-full rounded-xl px-4 py-4 font-sans text-base outline-none transition-all duration-150 placeholder:text-[var(--line)] focus:ring-2 focus:ring-[var(--accent)]/40"
              style={{
                background: "var(--bg)",
                border: "1px solid var(--line)",
                color: "var(--ink)",
              }}
              required
              autoFocus
            />
          </div>

          {/* Description */}
          <div className="flex flex-col gap-2">
            <label className="font-sans text-[13px] font-medium" style={{ color: "var(--ink-muted)" }}>
              Description{" "}
              <span className="font-mono text-[11px]" style={{ color: "var(--ink-faint)" }}>optional</span>
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="What's the vibe of this list?"
              rows={3}
              className="w-full rounded-xl px-4 py-3 font-sans text-sm outline-none transition-all duration-150 placeholder:text-[var(--line)] focus:ring-2 focus:ring-[var(--accent)]/40 resize-none"
              style={{
                background: "var(--bg)",
                border: "1px solid var(--line)",
                color: "var(--ink)",
              }}
            />
          </div>

          {/* Public toggle */}
          <label className="flex items-center gap-3 cursor-pointer">
            <div className="relative shrink-0">
              <input
                type="checkbox"
                checked={isPublic}
                onChange={(e) => setIsPublic(e.target.checked)}
                className="sr-only"
              />
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
            </div>
            <div>
              <p className="font-sans text-sm font-medium" style={{ color: "var(--ink)" }}>
                Public list
              </p>
              <p className="font-sans text-[12px]" style={{ color: "var(--ink-faint)" }}>
                Anyone can view this list on your profile
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
            style={{ background: "var(--accent)", color: "var(--bg)" }}
          >
            {pending ? "Creating…" : "Create list →"}
          </button>
        </form>
      </div>
    </div>
  );
}
