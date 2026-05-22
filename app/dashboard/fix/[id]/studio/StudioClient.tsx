"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
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
  slideshow: "Slideshow",
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
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Slideshow state
  type Slide = { url: string; caption: string; uploading: boolean; err: string | null };
  const [slides, setSlides] = useState<Slide[]>(
    initial.images
      ? initial.images.map((img) => ({ url: img.url, caption: img.caption ?? "", uploading: false, err: null }))
      : []
  );
  const slideFileRef = useRef<HTMLInputElement>(null);

  async function handleSlideUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      setSlides((prev) => [...prev, { url: "", caption: "", uploading: false, err: "Image must be under 5MB." }]);
      return;
    }
    const placeholderIdx = slides.length;
    setSlides((prev) => [...prev, { url: "", caption: "", uploading: true, err: null }]);
    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setSlides((prev) => prev.map((s, i) => i === placeholderIdx ? { ...s, uploading: false, err: "Not signed in." } : s));
        return;
      }
      const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
      const path = `${user.id}/${crypto.randomUUID()}.${ext}`;
      const { error: upErr } = await supabase.storage.from("studio").upload(path, file, { cacheControl: "3600", upsert: false });
      if (upErr) {
        setSlides((prev) => prev.map((s, i) => i === placeholderIdx ? { ...s, uploading: false, err: upErr.message } : s));
        return;
      }
      const { data } = supabase.storage.from("studio").getPublicUrl(path);
      setSlides((prev) => prev.map((s, i) => i === placeholderIdx ? { ...s, url: data.publicUrl, uploading: false } : s));
    } catch (err) {
      setSlides((prev) => prev.map((s, i) => i === placeholderIdx ? { ...s, uploading: false, err: err instanceof Error ? err.message : "Upload failed" } : s));
    }
  }

  async function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      setUploadError("Image must be under 5MB.");
      return;
    }
    setUploading(true);
    setUploadError(null);
    try {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        setUploadError("You must be signed in to upload.");
        return;
      }
      const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
      const path = `${user.id}/${crypto.randomUUID()}.${ext}`;
      const { error: upErr } = await supabase.storage
        .from("studio")
        .upload(path, file, { cacheControl: "3600", upsert: false });
      if (upErr) {
        setUploadError(upErr.message);
        return;
      }
      const { data } = supabase.storage.from("studio").getPublicUrl(path);
      setUrl(data.publicUrl);
    } catch (err) {
      setUploadError(err instanceof Error ? err.message : "Upload failed.");
    } finally {
      setUploading(false);
    }
  }

  function submit() {
    if (type === "note") onSave({ text });
    else if (type === "link") onSave({ url, title });
    else if (type === "image") onSave({ url, caption });
    else onSave({ images: slides.filter((s) => s.url).map((s) => ({ url: s.url, caption: s.caption || undefined })) });
  }

  const slidesUploading = slides.some((s) => s.uploading);

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

      {type === "slideshow" && (
        <>
          <input
            ref={slideFileRef}
            type="file"
            accept="image/*"
            onChange={handleSlideUpload}
            className="hidden"
          />
          {slides.length > 0 && (
            <div className="flex flex-col gap-2">
              {slides.map((slide, i) => (
                <div
                  key={i}
                  className="flex items-start gap-2 rounded-xl p-2"
                  style={{ background: "rgba(244,244,244,0.04)", border: "1px solid rgba(244,244,244,0.08)" }}
                >
                  <div
                    className="w-16 h-12 rounded-lg shrink-0 flex items-center justify-center overflow-hidden"
                    style={{ background: "rgba(244,244,244,0.06)" }}
                  >
                    {slide.uploading ? (
                      <span className="font-mono text-[10px]" style={{ color: "rgba(244,244,244,0.35)" }}>…</span>
                    ) : slide.url ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={slide.url} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <span className="font-mono text-[10px]" style={{ color: "#fda4af" }}>!</span>
                    )}
                  </div>
                  <div className="flex-1 min-w-0 flex flex-col gap-1">
                    {slide.err ? (
                      <p className="font-sans text-xs" style={{ color: "#fda4af" }}>{slide.err}</p>
                    ) : (
                      <input
                        type="text"
                        value={slide.caption}
                        onChange={(e) => setSlides((prev) => prev.map((s, j) => j === i ? { ...s, caption: e.target.value.slice(0, 200) } : s))}
                        placeholder={`Caption ${i + 1} (optional)`}
                        style={{ ...inputStyle, fontSize: 12, padding: "5px 8px" }}
                      />
                    )}
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => setSlides((prev) => { if (i === 0) return prev; const n = [...prev]; [n[i-1], n[i]] = [n[i], n[i-1]]; return n; })}
                        disabled={i === 0}
                        className="font-mono text-[10px] px-1.5 py-0.5 rounded disabled:opacity-25"
                        style={{ background: "rgba(244,244,244,0.06)", color: "rgba(244,244,244,0.5)" }}
                      >↑</button>
                      <button
                        type="button"
                        onClick={() => setSlides((prev) => { if (i === prev.length - 1) return prev; const n = [...prev]; [n[i], n[i+1]] = [n[i+1], n[i]]; return n; })}
                        disabled={i === slides.length - 1}
                        className="font-mono text-[10px] px-1.5 py-0.5 rounded disabled:opacity-25"
                        style={{ background: "rgba(244,244,244,0.06)", color: "rgba(244,244,244,0.5)" }}
                      >↓</button>
                      <button
                        type="button"
                        onClick={() => setSlides((prev) => prev.filter((_, j) => j !== i))}
                        className="font-mono text-[10px] px-1.5 py-0.5 rounded"
                        style={{ background: "rgba(230,57,70,0.12)", color: "#fda4af" }}
                      >✕</button>
                    </div>
                  </div>
                  <span
                    className="font-mono text-[10px] shrink-0 mt-1"
                    style={{ color: "rgba(244,244,244,0.2)" }}
                  >
                    {i + 1}
                  </span>
                </div>
              ))}
            </div>
          )}
          {slides.length < 20 && (
            <button
              type="button"
              onClick={() => slideFileRef.current?.click()}
              disabled={slidesUploading}
              className="font-mono text-[11px] uppercase tracking-widest rounded-xl px-4 py-3 transition-opacity hover:opacity-90 disabled:opacity-50"
              style={{
                background: "rgba(94,234,212,0.08)",
                border: "1px dashed rgba(94,234,212,0.35)",
                color: TEAL,
              }}
            >
              {slidesUploading ? "Uploading…" : slides.length === 0 ? "+ Add first image" : "+ Add another image"}
            </button>
          )}
          {slides.length > 0 && (
            <p className="font-mono text-[10px]" style={{ color: "rgba(244,244,244,0.25)" }}>
              {slides.filter((s) => s.url).length} / 20 images · drag to reorder
            </p>
          )}
        </>
      )}

      {type === "image" && (
        <>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileUpload}
            className="hidden"
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="font-mono text-[11px] uppercase tracking-widest rounded-xl px-4 py-3 transition-opacity hover:opacity-90 disabled:opacity-50"
            style={{
              background: "rgba(94,234,212,0.08)",
              border: "1px dashed rgba(94,234,212,0.35)",
              color: TEAL,
            }}
          >
            {uploading ? "Uploading…" : url ? "Replace image" : "Upload an image"}
          </button>
          {url && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={url}
              alt="preview"
              className="rounded-xl w-full object-cover"
              style={{ maxHeight: 240, border: "1px solid rgba(244,244,244,0.08)" }}
            />
          )}
          {uploadError && (
            <p className="font-sans text-xs" style={{ color: "#fda4af" }}>
              {uploadError}
            </p>
          )}
          <input
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="…or paste an image URL"
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
          disabled={busy || uploading || slidesUploading}
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
  dragging,
  dragOver,
  onEdit,
  onDelete,
  onMove,
  onDragStart,
  onDragEnter,
  onDragEnd,
  onDrop,
}: {
  block: StudioBlock;
  isFirst: boolean;
  isLast: boolean;
  dragging: boolean;
  dragOver: boolean;
  onEdit: () => void;
  onDelete: () => void;
  onMove: (dir: -1 | 1) => void;
  onDragStart: () => void;
  onDragEnter: () => void;
  onDragEnd: () => void;
  onDrop: () => void;
}) {
  const c = block.content;
  const [armed, setArmed] = useState(false);

  return (
    <div
      draggable={armed}
      onDragStart={onDragStart}
      onDragEnter={onDragEnter}
      onDragOver={(e) => e.preventDefault()}
      onDrop={(e) => {
        e.preventDefault();
        onDrop();
      }}
      onDragEnd={() => {
        setArmed(false);
        onDragEnd();
      }}
      className="group relative rounded-2xl p-5 transition-[border-color,opacity]"
      style={{
        background: CARD_BG,
        border: `1px solid ${dragOver ? "rgba(94,234,212,0.55)" : CARD_BORDER}`,
        opacity: dragging ? 0.4 : 1,
      }}
    >
      {/* Controls */}
      <div className="absolute top-3 right-3 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <span
          onPointerDown={() => setArmed(true)}
          onPointerUp={() => setArmed(false)}
          aria-label="Drag to reorder"
          title="Drag to reorder"
          className="font-mono text-xs rounded px-1.5 py-0.5 cursor-grab active:cursor-grabbing select-none"
          style={{ background: "rgba(244,244,244,0.06)", color: "rgba(244,244,244,0.6)" }}
        >
          ⠿
        </span>
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

      {block.type === "slideshow" && c.images && c.images.length > 0 && (
        <SlideshowViewer images={c.images} />
      )}
    </div>
  );
}

function SlideshowViewer({ images }: { images: Array<{ url: string; caption?: string }> }) {
  const [idx, setIdx] = useState(0);
  const current = images[Math.min(idx, images.length - 1)];
  const prev = () => setIdx((i) => (i > 0 ? i - 1 : images.length - 1));
  const next = () => setIdx((i) => (i < images.length - 1 ? i + 1 : 0));

  return (
    <div className="mt-2 select-none">
      {/* Main image */}
      <div className="relative rounded-xl overflow-hidden" style={{ background: "rgba(244,244,244,0.04)" }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          key={idx}
          src={current.url}
          alt={current.caption || `slide ${idx + 1}`}
          className="w-full object-contain rounded-xl"
          style={{ maxHeight: 420, border: "1px solid rgba(244,244,244,0.08)" }}
        />

        {/* Prev / Next */}
        {images.length > 1 && (
          <>
            <button
              onClick={prev}
              aria-label="Previous image"
              className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full flex items-center justify-center transition-all hover:opacity-100 opacity-70"
              style={{ background: "rgba(7,7,8,0.72)", border: "1px solid rgba(244,244,244,0.15)", color: "#F4F4F4", backdropFilter: "blur(8px)" }}
            >
              ‹
            </button>
            <button
              onClick={next}
              aria-label="Next image"
              className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full flex items-center justify-center transition-all hover:opacity-100 opacity-70"
              style={{ background: "rgba(7,7,8,0.72)", border: "1px solid rgba(244,244,244,0.15)", color: "#F4F4F4", backdropFilter: "blur(8px)" }}
            >
              ›
            </button>

            {/* Counter */}
            <span
              className="absolute bottom-2 right-2 font-mono text-[10px] px-2 py-0.5 rounded-full"
              style={{ background: "rgba(7,7,8,0.72)", color: "rgba(244,244,244,0.6)", backdropFilter: "blur(8px)" }}
            >
              {idx + 1} / {images.length}
            </span>
          </>
        )}
      </div>

      {/* Caption */}
      {current.caption && (
        <p className="font-sans text-xs mt-2" style={{ color: "rgba(244,244,244,0.4)" }}>
          {current.caption}
        </p>
      )}

      {/* Dot indicators */}
      {images.length > 1 && (
        <div className="flex items-center justify-center gap-1.5 mt-3">
          {images.map((_, i) => (
            <button
              key={i}
              onClick={() => setIdx(i)}
              aria-label={`Go to image ${i + 1}`}
              className="rounded-full transition-all"
              style={{
                width: i === idx ? 18 : 6,
                height: 6,
                background: i === idx ? TEAL : "rgba(244,244,244,0.2)",
              }}
            />
          ))}
        </div>
      )}

      {/* Thumbnail strip for larger slideshows */}
      {images.length > 3 && (
        <div className="flex gap-1.5 mt-3 overflow-x-auto pb-1">
          {images.map((img, i) => (
            <button
              key={i}
              onClick={() => setIdx(i)}
              className="shrink-0 rounded-lg overflow-hidden transition-all"
              style={{
                width: 48,
                height: 36,
                border: `1.5px solid ${i === idx ? TEAL : "transparent"}`,
                opacity: i === idx ? 1 : 0.5,
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={img.url} alt="" className="w-full h-full object-cover" />
            </button>
          ))}
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
  const [dragId, setDragId] = useState<string | null>(null);
  const [dragOverId, setDragOverId] = useState<string | null>(null);

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

  function handleDragEnd() {
    setDragId(null);
    setDragOverId(null);
  }

  async function handleDrop(targetId: string) {
    const sourceId = dragId;
    handleDragEnd();
    if (!sourceId || sourceId === targetId) return;

    const from = blocks.findIndex((b) => b.id === sourceId);
    const to = blocks.findIndex((b) => b.id === targetId);
    if (from < 0 || to < 0) return;

    const snapshot = blocks;
    const next = [...blocks];
    const [moved] = next.splice(from, 1);
    next.splice(to, 0, moved);
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
          {(["note", "link", "image", "slideshow"] as const).map((t) => (
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
                  dragging={dragId === block.id}
                  dragOver={dragOverId === block.id && dragId !== block.id}
                  onEdit={() => {
                    setEditingId(block.id);
                    setAdding(null);
                    setError(null);
                  }}
                  onDelete={() => handleDelete(block.id)}
                  onMove={(dir) => handleMove(block.id, dir)}
                  onDragStart={() => setDragId(block.id)}
                  onDragEnter={() => setDragOverId(block.id)}
                  onDragEnd={handleDragEnd}
                  onDrop={() => handleDrop(block.id)}
                />
              )
            )}
          </div>
        )}
      </main>
    </div>
  );
}
