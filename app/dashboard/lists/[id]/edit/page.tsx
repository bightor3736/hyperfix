"use client";

import { useState, useEffect, useTransition } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { updateList } from "@/app/actions/lists";
import Link from "next/link";
import { use } from "react";
import { ArrowLeft } from "react-iconly";

export default function EditListPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [isPublic, setIsPublic] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(async ({ data: { user } }) => {
      if (!user) { router.push("/auth/login"); return; }
      const { data, error } = await supabase
        .from("fix_lists")
        .select("name, description, is_public, user_id")
        .eq("id", id)
        .single();
      if (error || !data || data.user_id !== user.id) {
        setNotFound(true);
      } else {
        setName(data.name);
        setDescription(data.description ?? "");
        setIsPublic(data.is_public);
      }
      setLoading(false);
    });
  }, [id, router]);

  function handleSave() {
    if (!name.trim()) return;
    setError(null);
    startTransition(async () => {
      try {
        await updateList(id, name.trim(), description.trim(), isPublic);
        router.push(`/dashboard/lists/${id}`);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Failed to save");
      }
    });
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "#070708" }}>
        <div className="animate-pulse rounded-full h-6 w-6" style={{ background: "rgba(94,234,212,0.3)" }} />
      </div>
    );
  }

  if (notFound) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4" style={{ background: "#070708" }}>
        <p className="font-display text-2xl" style={{ color: "rgba(244,244,244,0.4)" }}>List not found.</p>
        <Link href="/dashboard/lists" className="font-mono text-sm underline" style={{ color: "#5EEAD4" }}>← Back to lists</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen px-4 sm:px-6 lg:px-8 pt-8 pb-16" style={{ background: "#070708" }}>
      <div className="max-w-xl mx-auto">
        <div className="mb-8">
          <Link
            href={`/dashboard/lists/${id}`}
            className="inline-flex items-center gap-2 font-sans text-sm transition-opacity hover:opacity-70"
            style={{ color: "rgba(244,244,244,0.4)" }}
          >
            <ArrowLeft set="light" size={18} primaryColor="currentColor" />
            Back to list
          </Link>
        </div>

        <p className="font-mono text-[11px] uppercase tracking-[0.18em] mb-3" style={{ color: "#5EEAD4" }}>
          list
        </p>
        <h1
          className="font-display mb-8"
          style={{ color: "#F4F4F4", fontSize: "clamp(24px, 4vw, 36px)", letterSpacing: "-0.02em", fontWeight: 600 }}
        >
          Edit list
        </h1>

        <div className="flex flex-col gap-4">
          {/* Name */}
          <div>
            <label className="block font-mono text-[10px] uppercase tracking-widest mb-2" style={{ color: "rgba(244,244,244,0.4)" }}>
              Name *
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="My list name"
              maxLength={80}
              className="w-full rounded-xl px-4 py-3 font-sans text-sm outline-none focus:ring-2 focus:ring-[#5EEAD4]/40 transition-all"
              style={{ background: "#0F1011", border: "1px solid rgba(244,244,244,0.1)", color: "#F4F4F4" }}
            />
          </div>

          {/* Description */}
          <div>
            <label className="block font-mono text-[10px] uppercase tracking-widest mb-2" style={{ color: "rgba(244,244,244,0.4)" }}>
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="What's this list for?"
              rows={3}
              maxLength={300}
              className="w-full rounded-xl px-4 py-3 font-sans text-sm outline-none focus:ring-2 focus:ring-[#5EEAD4]/40 resize-none transition-all"
              style={{ background: "#0F1011", border: "1px solid rgba(244,244,244,0.1)", color: "#F4F4F4" }}
            />
          </div>

          {/* Visibility toggle */}
          <div
            className="rounded-xl p-4 flex items-center justify-between"
            style={{ background: "#0F1011", border: "1px solid rgba(255,255,255,0.06)" }}
          >
            <div>
              <p className="font-sans text-sm font-medium" style={{ color: "#F4F4F4" }}>
                {isPublic ? "Public" : "Private"}
              </p>
              <p className="font-sans text-xs mt-0.5" style={{ color: "rgba(244,244,244,0.35)" }}>
                {isPublic ? "Anyone can see this list" : "Only you can see this list"}
              </p>
            </div>
            <button
              type="button"
              role="switch"
              aria-checked={isPublic}
              onClick={() => setIsPublic((v) => !v)}
              className="relative inline-flex"
            >
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
                    background: isPublic ? "#070708" : "rgba(244,244,244,0.4)",
                    transform: isPublic ? "translateX(22px)" : "translateX(2px)",
                  }}
                />
              </div>
            </button>
          </div>

          {error && (
            <p className="font-sans text-sm rounded-xl px-4 py-3" style={{ background: "rgba(225,29,72,0.08)", border: "1px solid rgba(225,29,72,0.2)", color: "#fda4af" }}>
              {error}
            </p>
          )}

          <div className="flex gap-3 pt-2">
            <Link
              href={`/dashboard/lists/${id}`}
              className="flex-1 py-3 rounded-xl font-sans text-sm font-medium text-center transition-opacity hover:opacity-80"
              style={{ background: "rgba(244,244,244,0.06)", border: "1px solid rgba(244,244,244,0.1)", color: "rgba(244,244,244,0.6)" }}
            >
              Cancel
            </Link>
            <button
              onClick={handleSave}
              disabled={pending || !name.trim()}
              className="flex-1 py-3 rounded-xl font-sans text-sm font-bold transition-all hover:opacity-90 disabled:opacity-50"
              style={{ background: "#5EEAD4", color: "#070708" }}
            >
              {pending ? "Saving…" : "Save changes"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
