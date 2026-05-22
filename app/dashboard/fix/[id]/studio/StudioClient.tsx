"use client";

import { useState } from "react";
import Link from "next/link";
import {
  addStudioBlock,
  updateStudioBlock,
  deleteStudioBlock,
  reorderStudioBlocks,
  type StudioBlock,
  type StudioBlockType,
  type StudioBlockContent,
} from "@/app/actions/studio";

const TEAL = "#5EEAD4";
const PAGE_BG = "#070708";
const CARD_BG = "#0F1011";
const CARD_BORDER = "rgba(255,255,255,0.06)";
const NOISE_URL =
  "url(\"data:image/svg+xml;utf8,<svg viewBox='0 0 240 240' xmlns='http://www.w3.org/2000/svg'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 0.55 0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>\")";

const TYPE_LABELS: Record<StudioBlockType, string> = {
  note: "Note",
  link: "Link",
  image: "Image",
};

const inputStyle: React.CSSProperties = {
  background: "#111113",
  border: "1px solid rgba(244,244,244,0.12)",
  borderRadius: 10,
  padding: "9px 12px",
  color: "#F4F4F4",
  fontSize: 14,
  outline: "none",
  width: "100%",
};

type Props = {
  fixId: string;
  fixTitle: string;
  fixCategory: string;
  dayCount: number;
  ended: boolean;
  initialBlocks: StudioBlock[];
};

function BlockComposer({
  type,
  initial,
  busy,
  onSave,
  onCancel,
}: {
  type: StudioBlockType;
  initial: StudioBlockContent;
  busy: boolean;
  onSave: (content: StudioBlockContent) => void;
  onCancel: () => void;
}) {
  const [text, setText] = useState(initial.text ?? "");
  const [url, setUrl] = useState(initial.url ?? "");
  const [title, setTitle] = useState(initial.title ?? "");
  const [caption, setCaption] = useState(initial.caption ?? "");

  function submit() {
    if (type === "note") onSave({ text });
    else if (type === "link") onSave({ url, title });
    else onSave({ url, caption });
  }

  return (
    <div
      className="rounded-2xl p-4 flex flex-col gap-3"
      style={{ background: "#111113", border: `1px solid rgba(94,234,212,0.25)` }}
    >
      <span className="font-mono text-[10px] uppercase tracking-widest" style={{ color: TEAL }}>
        {TYPE_LABELS[type]}
      </span>

      {type === "note" && (
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value.slice(0, 5000))}
          placeholder="What's on your mind about this fixation…"
          rows={5}
          autoFocus
          style={{ ...inputStyle, resize: "vertical", lineHeight: 1.5 }}
        />
      )}

      {type === "link" && (
        <>
          <input
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://the-rabbit-hole.com"
            autoFocus
            style={inputStyle}
          />
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value.slice(0, 200))}
            placeholder="Label (optional)"
            style={inputStyle}
          />
        </>
      )}

      {type === "image" && (
        <>
          <input
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://image-url.com/pic.jpg"
            autoFocus
            style={inputStyle}
          />
          <input
            type="text"
            value={caption}
            onChange={(e) => setCaption(e.target.value.slice(0, 200))}
            placeholder="Caption (optional)"
            style={inputStyle}
          />
        </>
      )}

      <div className="flex gap-2">
        <button
          onClick={submit}
          disabled={busy}
          className="font-mono text-[11px] uppercase tracking-widest rounded-full px-4 py-1.5 transition-opacity hover:opacity-90 disabled:opacity-50"
          style={{ background: TEAL, color: "#08110F" }}
        >
          {busy ? "Saving…" : "Save"}
        </button>
        <button
          onClick={onCancel}
          disabled={busy}
          className="font-mono text-[11px] uppercase tracking-widest rounded-full px-4 py-1.5 transition-opacity hover:opacity-80 disabled:opacity-50"
          style={{ background: "rgba(244,244,244,0.06)", color: "rgba(244,244,244,0.6)" }}
        >
          Cancel
        </button>
      </div>
    </div>
  );
}

function BlockView({
  block,
  isFirst,
  isLast,
  onEdit,
  onDelete,
  onMove,
}: {
  block: StudioBlock;
  isFirst: boolean;
  isLast: boolean;
  onEdit: () => void;
  onDelete: () => void;
  onMove: (dir: -1 | 1) => void;
}) {
  const c = block.content;

  return (
    <div
      className="group relative rounded-2xl p-5"
      style={{ background: CARD_BG, border: `1px solid ${CARD_BORDER}` }}
    >
      {/* Controls */}
      <div className="absolute top-3 right-3 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          onClick={() => onMove(-1)}
          disabled={isFirst}
          aria-label="Move up"
          className="font-mono text-xs rounded px-1.5 py-0.5 disabled:opacity-25"
          style={{ background: "rgba(244,244,244,0.06)", color: "rgba(244,244,244,0.6)" }}
        >
          ↑
        </button>
        <button
          onClick={() => onMove(1)}
          disabled={isLast}
          aria-label="Move down"
          className="font-mono text-xs rounded px-1.5 py-0.5 disabled:opacity-25"
          style={{ background: "rgba(244,244,244,0.06)", color: "rgba(244,244,244,0.6)" }}
        >
          ↓
        </button>
        <button
          onClick={onEdit}
          aria-label="Edit block"
          className="font-mono text-[10px] uppercase tracking-widest rounded px-2 py-0.5"
          style={{ background: "rgba(244,244,244,0.06)", color: "rgba(244,244,244,0.6)" }}
        >
          Edit
        </button>
        <button
          onClick={onDelete}
          aria-label="Delete block"
          className="font-mono text-xs rounded px-1.5 py-0.5"
          style={{ background: "rgba(230,57,70,0.12)", color: "#fda4af" }}
        >
          ✕
        </button>
      </div>

      <span
        className="font-mono text-[9px] uppercase tracking-widest"
        style={{ color: "rgba(244,244,244,0.3)" }}
      >
        {TYPE_LABELS[block.type]}
      </span>

      {block.type === "note" && (
        <p
          className="font-sans text-sm mt-2 leading-relaxed"
          style={{ color: "rgba(244,244,244,0.85)", whiteSpace: "pre-wrap", wordBreak: "break-word" }}
        >
          {c.text}
        </p>
      )}

      {block.type === "link" && (
        <a
          href={c.url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 mt-2 transition-colors hover:text-[#5EEAD4]"
          style={{ color: "#F4F4F4" }}
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
            <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
          </svg>
          <span className="font-sans text-sm min-w-0">
            <span className="block font-medium truncate">{c.title || c.url}</span>
            {c.title && (
              <span className="block font-mono text-[11px] truncate" style={{ color: "rgba(244,244,244,0.35)" }}>
                {c.url}
              </span>
            )}
          </span>
        </a>
      )}

      {block.type === "image" && (
        <div className="mt-2">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={c.url}
            alt={c.caption || "studio image"}
            className="rounded-xl w-full object-cover"
            style={{ maxHeight: 420, border: "1px solid rgba(244,244,244,0.08)" }}
          />
          {c.caption && (
            <p className="font-sans text-xs mt-2" style={{ color: "rgba(244,244,244,0.4)" }}>
              {c.caption}
            </p>
          )}
        </div>
      )}
    </div>
  );
}

export function StudioClient({
  fixId,
  fixTitle,
  fixCategory,
  dayCount,
  ended,
  initialBlocks,
}: Props) {
  const [blocks, setBlocks] = useState<StudioBlock[]>(initialBlocks);
  const [adding, setAdding] = useState<StudioBlockType | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleAdd(type: StudioBlockType, content: StudioBlockContent) {
    setBusy(true);
    setError(null);
    const result = await addStudioBlock(fixId, type, content);
    setBusy(false);
    if ("error" in result) {
      setError(result.error);
      return;
    }
    setBlocks((prev) => [...prev, result]);
    setAdding(null);
  }

  async function handleUpdate(
    id: string,
    type: StudioBlockType,
    content: StudioBlockContent
  ) {
    setBusy(true);
    setError(null);
    const result = await updateStudioBlock(id, type, content);
    setBusy(false);
    if ("error" in result) {
      setError(result.error);
      return;
    }
    setBlocks((prev) =>
      prev.map((b) => (b.id === id ? { ...b, content } : b))
    );
    setEditingId(null);
  }

  async function handleDelete(id: string) {
    const snapshot = blocks;
    setBlocks((prev) => prev.filter((b) => b.id !== id));
    setError(null);
    const result = await deleteStudioBlock(id);
    if ("error" in result) {
      setBlocks(snapshot);
      setError(result.error);
    }
  }

  async function handleMove(id: string, dir: -1 | 1) {
    const index = blocks.findIndex((b) => b.id === id);
    const target = index + dir;
    if (index < 0 || target < 0 || target >= blocks.length) return;

    const snapshot = blocks;
    const next = [...blocks];
    [next[index], next[target]] = [next[target], next[index]];
    setBlocks(next);
    setError(null);

    const result = await reorderStudioBlocks(fixId, next.map((b) => b.id));
    if ("error" in result) {
      setBlocks(snapshot);
      setError(result.error);
    }
  }

  return (
    <div className="min-h-screen relative" style={{ background: PAGE_BG, color: "#F4F4F4" }}>
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none mix-blend-overlay"
        style={{ backgroundImage: NOISE_URL, backgroundSize: "240px 240px", opacity: 0.08 }}
      />

      {/* Nav */}
      <nav
        className="sticky top-0 z-40 px-5 sm:px-8 py-4 flex items-center justify-between"
        style={{
          background: "rgba(7,7,8,0.82)",
          backdropFilter: "blur(20px)",
          borderBottom: `1px solid ${CARD_BORDER}`,
        }}
      >
        <span className="flex items-center gap-2">
          <span
            className="font-display font-semibold text-sm tracking-tight"
            style={{ color: "#F4F4F4" }}
          >
            HYPERFIX
          </span>
          <span
            className="font-mono text-[9px] uppercase tracking-[0.2em] rounded px-1.5 py-0.5"
            style={{ background: "rgba(94,234,212,0.14)", color: TEAL, border: "1px solid rgba(94,234,212,0.3)" }}
          >
            Studio
          </span>
        </span>
        <Link
          href={`/dashboard/fix/${fixId}`}
          className="font-sans text-sm transition-colors hover:text-[#5EEAD4]"
          style={{ color: "rgba(255,255,255,0.6)" }}
        >
          ← Back to fix
        </Link>
      </nav>

      <main className="relative max-w-2xl mx-auto px-4 sm:px-6 py-8 sm:py-10">
        {/* Hero */}
        <div
          className="relative overflow-hidden rounded-3xl mb-6 p-6 sm:p-8"
          style={{
            background:
              "radial-gradient(ellipse 90% 130% at 50% 130%, #5EEAD4 0%, #2DD4BF 14%, #0E4F47 34%, #08231F 55%, #070708 78%)",
            border: `1px solid ${CARD_BORDER}`,
          }}
        >
          <div
            aria-hidden
            className="absolute inset-0 pointer-events-none mix-blend-overlay"
            style={{ backgroundImage: NOISE_URL, backgroundSize: "200px 200px", opacity: 0.5 }}
          />
          <div
            aria-hidden
            className="absolute inset-0 pointer-events-none"
            style={{ background: "linear-gradient(180deg, #070708 0%, rgba(7,7,8,0.4) 35%, transparent 100%)" }}
          />
          <div className="relative">
            <div className="flex items-center gap-2 mb-3">
              <span
                className="font-mono text-[10px] uppercase tracking-widest rounded-full px-2.5 py-1"
                style={{ background: "rgba(94,234,212,0.12)", color: TEAL, border: "1px solid rgba(94,234,212,0.25)" }}
              >
                {fixCategory}
              </span>
              <span className="font-mono text-xs" style={{ color: "rgba(255,255,255,0.55)" }}>
                {ended ? `lasted ${dayCount}d` : `day ${dayCount}`}
              </span>
            </div>
            <h1
              className="font-display"
              style={{
                color: "#FFFFFF",
                fontSize: "clamp(26px, 5vw, 40px)",
                lineHeight: 1.05,
                letterSpacing: "-0.02em",
                fontWeight: 600,
              }}
            >
              {fixTitle}
            </h1>
            <p className="mt-2 font-sans text-sm" style={{ color: "rgba(255,255,255,0.6)" }}>
              Your workspace for this fixation — notes, links, and images, all in one place.
            </p>
          </div>
        </div>

        {/* Add toolbar */}
        <div className="flex flex-wrap gap-2 mb-5">
          {(["note", "link", "image"] as const).map((t) => (
            <button
              key={t}
              onClick={() => {
                setAdding(t);
                setEditingId(null);
                setError(null);
              }}
              className="font-mono text-[11px] uppercase tracking-widest rounded-full px-4 py-2 transition-all hover:opacity-90"
              style={{
                background: adding === t ? "rgba(94,234,212,0.16)" : "rgba(244,244,244,0.05)",
                border: `1px solid ${adding === t ? "rgba(94,234,212,0.35)" : "rgba(244,244,244,0.1)"}`,
                color: adding === t ? TEAL : "rgba(244,244,244,0.65)",
              }}
            >
              + {TYPE_LABELS[t]}
            </button>
          ))}
        </div>

        {error && (
          <p
            className="font-sans text-sm rounded-xl px-4 py-3 mb-4"
            style={{ background: "rgba(230,57,70,0.08)", border: "1px solid rgba(230,57,70,0.2)", color: "#fda4af" }}
          >
            {error}
          </p>
        )}

        {/* Add composer */}
        {adding && (
          <div className="mb-4">
            <BlockComposer
              type={adding}
              initial={{}}
              busy={busy}
              onSave={(content) => handleAdd(adding, content)}
              onCancel={() => setAdding(null)}
            />
          </div>
        )}

        {/* Blocks */}
        {blocks.length === 0 && !adding ? (
          <div
            className="rounded-3xl p-12 text-center"
            style={{ background: CARD_BG, border: `1px solid ${CARD_BORDER}` }}
          >
            <p className="font-display text-lg" style={{ color: "rgba(244,244,244,0.55)" }}>
              Blank canvas.
            </p>
            <p className="font-sans text-sm mt-2" style={{ color: "rgba(244,244,244,0.35)" }}>
              Drop in a note, a link, or an image to start building out this rabbit hole.
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {blocks.map((block, i) =>
              editingId === block.id ? (
                <BlockComposer
                  key={block.id}
                  type={block.type}
                  initial={block.content}
                  busy={busy}
                  onSave={(content) => handleUpdate(block.id, block.type, content)}
                  onCancel={() => setEditingId(null)}
                />
              ) : (
                <BlockView
                  key={block.id}
                  block={block}
                  isFirst={i === 0}
                  isLast={i === blocks.length - 1}
                  onEdit={() => {
                    setEditingId(block.id);
                    setAdding(null);
                    setError(null);
                  }}
                  onDelete={() => handleDelete(block.id)}
                  onMove={(dir) => handleMove(block.id, dir)}
                />
              )
            )}
          </div>
        )}
      </main>
    </div>
  );
}
