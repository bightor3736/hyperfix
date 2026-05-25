import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { getInbox, formatRelativeTime } from "@/lib/conversations";

export const metadata: Metadata = { title: "Messages · Hyperfix" };

const CARD_BG = "#0F1011";
const CARD_BORDER = "rgba(255,255,255,0.06)";
const TEAL = "#5EEAD4";

export default async function MessagesInboxPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/auth/login");

  const rows = await getInbox(supabase, user.id);

  return (
    <div className="px-4 sm:px-8 py-8 sm:py-10 max-w-3xl mx-auto" style={{ color: "#F4F4F4" }}>
      <div className="mb-8">
        <p
          className="font-mono text-[10px] uppercase tracking-widest mb-2"
          style={{ color: TEAL }}
        >
          Messages
        </p>
        <h1
          className="font-display"
          style={{
            fontSize: "clamp(32px, 5vw, 44px)",
            fontWeight: 600,
            letterSpacing: "-0.02em",
            lineHeight: 1,
          }}
        >
          Inbox.
        </h1>
      </div>

      {rows.length === 0 ? (
        <div
          className="rounded-3xl p-10 text-center"
          style={{ background: CARD_BG, border: `1px solid ${CARD_BORDER}` }}
        >
          <div className="flex justify-center mb-4" style={{ color: "rgba(244,244,244,0.4)" }}>
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 7l9 6 9-6" />
              <rect x="3" y="5" width="18" height="14" rx="2" />
            </svg>
          </div>
          <p
            className="font-display text-lg mb-2"
            style={{ color: "rgba(244,244,244,0.6)" }}
          >
            No messages yet.
          </p>
          <p
            className="font-sans text-sm max-w-sm mx-auto"
            style={{ color: "rgba(244,244,244,0.4)" }}
          >
            Follow people on their public profile and click &ldquo;Message&rdquo; to start a conversation.
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {rows.map((row) => {
            const other = row.other_user;
            const name =
              other.display_name ?? other.username ?? "Unknown";
            const handle = other.username ? `@${other.username}` : "";
            const lm = row.last_message;
            const unread =
              !!lm && !lm.read && lm.sender_id !== user.id;
            return (
              <Link
                key={row.conversation_id}
                href={`/dashboard/messages/${row.conversation_id}`}
                className="group flex items-center gap-4 rounded-2xl p-4 transition-all hover:-translate-y-0.5"
                style={{
                  background: CARD_BG,
                  border: `1px solid ${CARD_BORDER}`,
                }}
              >
                <div
                  className="w-11 h-11 rounded-full shrink-0 flex items-center justify-center overflow-hidden"
                  style={{
                    background: other.avatar_url
                      ? "transparent"
                      : "rgba(94,234,212,0.15)",
                    border: "1px solid rgba(94,234,212,0.2)",
                    color: TEAL,
                  }}
                >
                  {other.avatar_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={other.avatar_url}
                      alt={name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="font-display text-sm font-semibold">
                      {name[0]?.toUpperCase() || "?"}
                    </span>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-baseline gap-2">
                    <p
                      className="font-display text-sm font-medium truncate"
                      style={{ color: "#F4F4F4" }}
                    >
                      {name}
                    </p>
                    {handle && (
                      <p
                        className="font-mono text-[11px] truncate"
                        style={{ color: "rgba(244,244,244,0.4)" }}
                      >
                        {handle}
                      </p>
                    )}
                  </div>
                  <p
                    className="font-sans text-[13px] truncate mt-0.5"
                    style={{
                      color: unread
                        ? "rgba(244,244,244,0.85)"
                        : "rgba(244,244,244,0.45)",
                      fontWeight: unread ? 500 : 400,
                    }}
                  >
                    {lm
                      ? lm.sender_id === user.id
                        ? `You: ${lm.body}`
                        : lm.body
                      : "No messages yet."}
                  </p>
                </div>
                <div className="flex flex-col items-end gap-1.5 shrink-0">
                  <span
                    className="font-mono text-[10px]"
                    style={{ color: "rgba(244,244,244,0.35)" }}
                  >
                    {formatRelativeTime(row.last_message_at)}
                  </span>
                  {unread && (
                    <span
                      aria-label="unread"
                      className="block w-2 h-2 rounded-full"
                      style={{ background: TEAL }}
                    />
                  )}
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
