"use client";

import { useState } from "react";
import Link from "next/link";
import { addComment, deleteComment, updateComment } from "@/app/actions/comments";

type Comment = {
  id: string;
  user_id: string;
  content: string;
  created_at: string;
  profiles: {
    username: string | null;
    display_name: string | null;
    avatar_url: string | null;
  } | null;
};

type Props = {
  fixId: string;
  initialComments: Comment[];
  currentUserId: string | null;
};

function timeAgo(dateStr: string): string {
  const now = Date.now();
  const then = new Date(dateStr).getTime();
  const diffMs = now - then;
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHour = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHour / 24);

  if (diffSec < 60) return "just now";
  if (diffMin < 60) return `${diffMin}m`;
  if (diffHour < 24) return `${diffHour}h`;
  return `${diffDay}d`;
}

function Avatar({
  username,
  avatarUrl,
}: {
  username: string | null;
  avatarUrl: string | null;
}) {
  const initials = username ? username.slice(0, 2).toUpperCase() : "??";

  if (avatarUrl) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={avatarUrl}
        alt={username ?? "user"}
        style={{
          width: 28,
          height: 28,
          borderRadius: "50%",
          objectFit: "cover",
          flexShrink: 0,
        }}
      />
    );
  }

  return (
    <div
      style={{
        width: 28,
        height: 28,
        borderRadius: "50%",
        background: "var(--accent)",
        border: "1px solid var(--accent)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
        fontSize: 10,
        fontFamily: "var(--font-mono, monospace)",
        color: "var(--accent)",
        letterSpacing: "0.05em",
      }}
    >
      {initials}
    </div>
  );
}

export function FixComments({ fixId, initialComments, currentUserId }: Props) {
  const [comments, setComments] = useState<Comment[]>(initialComments);
  const [input, setInput] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [hoveredDelete, setHoveredDelete] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [visibleCount, setVisibleCount] = useState(10);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editInput, setEditInput] = useState("");
  const [savingEdit, setSavingEdit] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!input.trim() || submitting) return;

    const content = input.trim();
    setSubmitting(true);
    setInput("");
    setActionError(null);

    // Optimistic add
    const tempId = `temp-${Date.now()}`;
    const optimistic: Comment = {
      id: tempId,
      user_id: currentUserId ?? "",
      content,
      created_at: new Date().toISOString(),
      profiles: null,
    };
    setComments((prev) => [...prev, optimistic]);

    const result = await addComment(fixId, content);

    if ("error" in result) {
      // Revert on error
      setComments((prev) => prev.filter((c) => c.id !== tempId));
      setInput(content);
      setActionError(result.error || "Couldn't post comment. Try again.");
    } else {
      // Replace optimistic with real data
      setComments((prev) =>
        prev.map((c) => (c.id === tempId ? result : c))
      );
    }

    setSubmitting(false);
  }

  function handleStartEdit(comment: Comment) {
    setActionError(null);
    setEditingId(comment.id);
    setEditInput(comment.content);
  }

  function handleCancelEdit() {
    setEditingId(null);
    setEditInput("");
  }

  async function handleSaveEdit(commentId: string) {
    const content = editInput.trim();
    if (!content || savingEdit) return;

    setSavingEdit(true);
    setActionError(null);
    const result = await updateComment(commentId, content);
    setSavingEdit(false);

    if ("error" in result) {
      setActionError(result.error || "Couldn't update comment. Try again.");
      return;
    }
    setComments((prev) =>
      prev.map((c) => (c.id === commentId ? { ...c, content } : c))
    );
    setEditingId(null);
    setEditInput("");
  }

  async function handleDelete(commentId: string) {
    setActionError(null);
    const index = comments.findIndex((c) => c.id === commentId);
    const removed = comments[index];
    if (!removed) return;

    // Optimistic remove
    setComments((prev) => prev.filter((c) => c.id !== commentId));

    const result = await deleteComment(commentId);
    if (result && "error" in result) {
      // Restore at original position
      setComments((prev) => {
        const next = [...prev];
        next.splice(Math.min(index, next.length), 0, removed);
        return next;
      });
      setActionError(result.error || "Couldn't delete comment. Try again.");
    }
  }

  return (
    <div>
      {/* Comment list */}
      {comments.length === 0 ? (
        <p
          className="font-sans text-sm italic"
          style={{ color: "var(--ink-muted)" }}
        >
          No comments yet. Be the first.
        </p>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 16, marginBottom: 20 }}>
          {comments.length > visibleCount && (
            <button
              onClick={() => setVisibleCount((c) => c + 20)}
              className="font-mono text-[11px] uppercase tracking-widest self-start transition-opacity hover:opacity-80"
              style={{ color: "var(--accent)", background: "none", border: "none", cursor: "pointer", padding: 0 }}
            >
              Show {comments.length - visibleCount} earlier{" "}
              {comments.length - visibleCount === 1 ? "comment" : "comments"}
            </button>
          )}
          {comments.slice(-visibleCount).map((comment) => {
            const username = comment.profiles?.username ?? null;
            const avatarUrl = comment.profiles?.avatar_url ?? null;
            const isOwn = currentUserId && comment.user_id === currentUserId;

            return (
              <div
                key={comment.id}
                style={{ display: "flex", gap: 10, alignItems: "flex-start" }}
                onMouseEnter={() => isOwn && setHoveredDelete(comment.id)}
                onMouseLeave={() => setHoveredDelete(null)}
              >
                <Avatar username={username} avatarUrl={avatarUrl} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", alignItems: "baseline", gap: 8, marginBottom: 3 }}>
                    {username ? (
                      <Link
                        href={`/u/${username}`}
                        className="font-mono text-xs hover:underline"
                        style={{ color: "var(--accent)" }}
                      >
                        @{username}
                      </Link>
                    ) : (
                      <span className="font-mono text-xs" style={{ color: "var(--ink-faint)" }}>
                        @unknown
                      </span>
                    )}
                    <span className="font-mono text-[10px]" style={{ color: "var(--ink-faint)" }}>
                      {timeAgo(comment.created_at)}
                    </span>
                  </div>
                  {editingId === comment.id ? (
                    <div>
                      <textarea
                        value={editInput}
                        onChange={(e) => setEditInput(e.target.value.slice(0, 500))}
                        rows={3}
                        autoFocus
                        className="font-sans text-sm w-full"
                        style={{
                          background: "var(--bg)",
                          border: "1px solid var(--ink-faint)",
                          borderRadius: "0.75rem",
                          padding: "8px 12px",
                          color: "var(--ink)",
                          resize: "vertical",
                          outline: "none",
                          display: "block",
                          marginBottom: 6,
                        }}
                      />
                      <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                        <button
                          onClick={() => handleSaveEdit(comment.id)}
                          disabled={!editInput.trim() || savingEdit}
                          className="font-mono text-[10px] uppercase tracking-widest"
                          style={{
                            background: editInput.trim() && !savingEdit ? "var(--accent)" : "var(--accent-soft)",
                            color: "var(--bg)",
                            border: "none",
                            borderRadius: "9999px",
                            padding: "4px 12px",
                            cursor: editInput.trim() && !savingEdit ? "pointer" : "not-allowed",
                          }}
                        >
                          {savingEdit ? "Saving…" : "Save"}
                        </button>
                        <button
                          onClick={handleCancelEdit}
                          className="font-mono text-[10px] uppercase tracking-widest"
                          style={{
                            background: "none",
                            border: "none",
                            cursor: "pointer",
                            color: "var(--ink-muted)",
                          }}
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <p
                      className="font-sans text-sm leading-relaxed"
                      style={{ color: "var(--ink)", wordBreak: "break-word" }}
                    >
                      {comment.content}
                    </p>
                  )}
                </div>
                {isOwn && editingId !== comment.id && (
                  <div
                    style={{
                      display: "flex",
                      gap: 4,
                      flexShrink: 0,
                      marginTop: 1,
                      opacity: hoveredDelete === comment.id ? 1 : 0,
                      transition: "opacity 0.15s",
                    }}
                  >
                    <button
                      onClick={() => handleStartEdit(comment)}
                      aria-label="Edit comment"
                      style={{
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                        padding: "2px 4px",
                        color: "var(--ink-muted)",
                        fontSize: 11,
                        lineHeight: 1,
                      }}
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(comment.id)}
                      aria-label="Delete comment"
                      style={{
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                        padding: "2px 4px",
                        color: "var(--ink-muted)",
                        fontSize: 12,
                        lineHeight: 1,
                      }}
                    >
                      ✕
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {actionError && (
        <p
          className="font-sans text-xs mb-3"
          style={{ color: "#fda4af" }}
          role="alert"
        >
          {actionError}
        </p>
      )}

      {/* Input area */}
      {currentUserId ? (
        <form onSubmit={handleSubmit} style={{ marginTop: comments.length > 0 ? 8 : 16 }}>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value.slice(0, 500))}
            placeholder="Add a comment…"
            rows={3}
            className="font-sans text-sm w-full"
            style={{
              background: "var(--bg)",
              border: "1px solid var(--line)",
              borderRadius: "0.75rem",
              minHeight: 72,
              padding: "10px 14px",
              color: "var(--ink)",
              resize: "vertical",
              outline: "none",
              display: "block",
              marginBottom: 8,
            }}
            onFocus={(e) => {
              e.currentTarget.style.borderColor = "var(--ink-faint)";
            }}
            onBlur={(e) => {
              e.currentTarget.style.borderColor = "var(--line)";
            }}
          />
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span
              className="font-mono text-[10px]"
              style={{ color: "var(--ink-faint)" }}
            >
              {input.length}/500
            </span>
            <button
              type="submit"
              disabled={!input.trim() || submitting}
              className="font-mono text-[11px] uppercase tracking-widest"
              style={{
                background: input.trim() && !submitting ? "var(--accent)" : "var(--accent-soft)",
                color: "var(--bg)",
                border: "none",
                borderRadius: "9999px",
                padding: "6px 16px",
                cursor: input.trim() && !submitting ? "pointer" : "not-allowed",
                transition: "background 0.15s",
              }}
            >
              {submitting ? "Posting…" : "Post"}
            </button>
          </div>
        </form>
      ) : (
        <p className="font-sans text-sm" style={{ color: "var(--ink-muted)", marginTop: 12 }}>
          <Link
            href="/auth/login"
            style={{ color: "var(--accent)", textDecoration: "underline" }}
          >
            Log in
          </Link>{" "}
          to comment
        </p>
      )}
    </div>
  );
}
