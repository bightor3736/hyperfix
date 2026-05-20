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
    <div className="min-h-screen px-4 sm:px-6 lg:px-8 pt-8 pb-12" style={{ background: "#0A0A0A" }}>
      <div className="max-w-xl mx-auto">

        {/* Back */}
        <div className="mb-8">
          <Link
            href="/dashboard/lists"
            className="inline-flex items-center gap-2 font-sans text-sm transition-colors hover:opacity-80"
            style={{ color: "rgba(244,244,244,0.4)" }}
          >
            <ArrowLeft set="light" size={18} primaryColor="currentColor" />
            Your lists
          </Link>
        </div>

        {/* Header */}
        <div className="mb-8">
          <h1
            className="font-display font-bold leading-tight"
            style={{ color: "#F4F4F4", fontSize: "clamp(24px, 4vw, 36px)", letterSpacing: "-0.02em" }}
          >
            New list
          </h1>
          <p className="font-sans text-sm mt-1" style={{ color: "rgba(244,244,244,0.4)" }}>
            Curate your fixations into a collection.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">

          {/* Name */}
          <div className="flex flex-col gap-2">
            <label className="font-sans text-[13px] font-medium" style={{ color: "rgba(244,244,244,0.65)" }}>
              Name <span style={{ color: "#5EEAD4" }}>*</span>
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="My top fixations of 2025"
              className="w-full rounded-xl px-4 py-4 font-sans text-base outline-none transition-all duration-150 placeholder:text-[rgba(244,244,244,0.18)] focus:ring-2 focus:ring-[#5EEAD4]/40"
              style={{
                background: "#111113",
                border: "1px solid rgba(244,244,244,0.1)",
                color: "#F4F4F4",
              }}
              required
              autoFocus
            />
          </div>

          {/* Description */}
          <div className="flex flex-col gap-2">
            <label className="font-sans text-[13px] font-medium" style={{ color: "rgba(244,244,244,0.65)" }}>
              Description{" "}
              <span className="font-mono text-[11px]" style={{ color: "rgba(244,244,244,0.25)" }}>optional</span>
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="What's the vibe of this list?"
              rows={3}
              className="w-full rounded-xl px-4 py-3 font-sans text-sm outline-none transition-all duration-150 placeholder:text-[rgba(244,244,244,0.18)] focus:ring-2 focus:ring-[#5EEAD4]/40 resize-none"
              style={{
                background: "#111113",
                border: "1px solid rgba(244,244,244,0.1)",
                color: "#F4F4F4",
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
                  background: isPublic ? "#5EEAD4" : "rgba(244,244,244,0.1)",
                  border: isPublic ? "1px solid rgba(94,234,212,0.5)" : "1px solid rgba(244,244,244,0.1)",
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
                Public list
              </p>
              <p className="font-sans text-[12px]" style={{ color: "rgba(244,244,244,0.3)" }}>
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
            style={{ background: "#5EEAD4", color: "#0A0A0A" }}
          >
            {pending ? "Creating…" : "Create list →"}
          </button>
        </form>
      </div>
    </div>
  );
}
