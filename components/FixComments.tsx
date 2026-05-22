"use client";

import { useState } from "react";
import Link from "next/link";
import { addComment, deleteComment } from "@/app/actions/comments";

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
        background: "rgba(94,234,212,0.15)",
        border: "1px solid rgba(94,234,212,0.25)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
        fontSize: 10,
        fontFamily: "var(--font-mono, monospace)",
        color: "#5EEAD4",
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
          style={{ color: "rgba(244,244,244,0.4)" }}
        >
          No comments yet. Be the first.
        </p>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 16, marginBottom: 20 }}>
          {comments.length > visibleCount && (
            <button
              onClick={() => setVisibleCount((c) => c + 20)}
              className="font-mono text-[11px] uppercase tracking-widest self-start transition-opacity hover:opacity-80"
              style={{ color: "#5EEAD4", background: "none", border: "none", cursor: "pointer", padding: 0 }}
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
                        style={{ color: "#5EEAD4" }}
                      >
                        @{username}
                      </Link>
                    ) : (
                      <span className="font-mono text-xs" style={{ color: "rgba(244,244,244,0.3)" }}>
                        @unknown
                      </span>
                    )}
                    <span className="font-mono text-[10px]" style={{ color: "rgba(244,244,244,0.3)" }}>
                      {timeAgo(comment.created_at)}
                    </span>
                  </div>
                  <p
                    className="font-sans text-sm leading-relaxed"
                    style={{ color: "rgba(244,244,244,0.8)", wordBreak: "break-word" }}
                  >
                    {comment.content}
                  </p>
                </div>
                {isOwn && (
                  <button
                    onClick={() => handleDelete(comment.id)}
                    aria-label="Delete comment"
                    style={{
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      padding: "2px 4px",
                      color: hoveredDelete === comment.id
                        ? "rgba(244,244,244,0.6)"
                        : "rgba(244,244,244,0.0)",
                      fontSize: 12,
                      lineHeight: 1,
                      transition: "color 0.15s",
                      flexShrink: 0,
                      marginTop: 1,
                    }}
                  >
                    ✕
                  </button>
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
              background: "#111113",
              border: "1px solid rgba(244,244,244,0.1)",
              borderRadius: "0.75rem",
              minHeight: 72,
              padding: "10px 14px",
              color: "#F4F4F4",
              resize: "vertical",
              outline: "none",
              display: "block",
              marginBottom: 8,
            }}
            onFocus={(e) => {
              e.currentTarget.style.borderColor = "rgba(244,244,244,0.2)";
            }}
            onBlur={(e) => {
              e.currentTarget.style.borderColor = "rgba(244,244,244,0.1)";
            }}
          />
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span
              className="font-mono text-[10px]"
              style={{ color: "rgba(244,244,244,0.3)" }}
            >
              {input.length}/500
            </span>
            <button
              type="submit"
              disabled={!input.trim() || submitting}
              className="font-mono text-[11px] uppercase tracking-widest"
              style={{
                background: input.trim() && !submitting ? "#5EEAD4" : "rgba(94,234,212,0.3)",
                color: "#080808",
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
        <p className="font-sans text-sm" style={{ color: "rgba(244,244,244,0.4)", marginTop: 12 }}>
          <Link
            href="/auth/login"
            style={{ color: "#5EEAD4", textDecoration: "underline" }}
          >
            Log in
          </Link>{" "}
          to comment
        </p>
      )}
    </div>
  );
}
