import { createClient } from "@/lib/supabase/server";
import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { MessageThread } from "@/components/MessageThread";
import type { ConversationProfile } from "@/lib/conversations";

export const metadata: Metadata = { title: "Conversation · Hyperfix" };

type Conversation = {
  id: string;
  user_a: string;
  user_b: string;
};

export type ThreadMessage = {
  id: string;
  conversation_id: string;
  sender_id: string;
  body: string;
  read: boolean;
  created_at: string;
};

export default async function MessageThreadPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/auth/login");

  const { data: convoRaw } = await supabase
    .from("conversations")
    .select("id, user_a, user_b")
    .eq("id", id)
    .maybeSingle();
  const convo = convoRaw as Conversation | null;

  if (!convo) notFound();
  if (convo.user_a !== user.id && convo.user_b !== user.id) notFound();

  const otherId = convo.user_a === user.id ? convo.user_b : convo.user_a;

  const { data: otherProfileRaw } = await supabase
    .from("profiles")
    .select("id, username, display_name, avatar_url")
    .eq("id", otherId)
    .maybeSingle();
  const otherProfile = (otherProfileRaw as ConversationProfile | null) ?? {
    id: otherId,
    username: null,
    display_name: null,
    avatar_url: null,
  };

  const { data: meProfileRaw } = await supabase
    .from("profiles")
    .select("id, username, display_name, avatar_url")
    .eq("id", user.id)
    .maybeSingle();
  const meProfile = (meProfileRaw as ConversationProfile | null) ?? {
    id: user.id,
    username: null,
    display_name: null,
    avatar_url: null,
  };

  // Load last 100 messages
  const { data: msgsRaw } = await supabase
    .from("messages")
    .select("id, conversation_id, sender_id, body, read, created_at")
    .eq("conversation_id", convo.id)
    .order("created_at", { ascending: false })
    .limit(100);
  const messages = ((msgsRaw ?? []) as ThreadMessage[]).slice().reverse();

  // Mark unread inbound messages as read
  await supabase
    .from("messages")
    .update({ read: true })
    .eq("conversation_id", convo.id)
    .eq("read", false)
    .neq("sender_id", user.id);

  const name =
    otherProfile.display_name ?? otherProfile.username ?? "Unknown";

  return (
    <div
      className="flex flex-col h-[calc(100vh-0px)] lg:h-screen"
      style={{ background: "var(--bg)", color: "var(--ink)" }}
    >
      {/* Header */}
      <div
        className="flex items-center gap-3 px-4 sm:px-6 py-3.5 shrink-0"
        style={{
          background: "rgba(7,7,8,0.78)",
          backdropFilter: "blur(20px)",
          borderBottom: "1px solid var(--line)",
        }}
      >
        <Link
          href="/dashboard/messages"
          className="p-2 rounded-lg transition-colors hover:bg-[transparent]"
          aria-label="Back to inbox"
          style={{ color: "var(--ink-muted)" }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </Link>
        <div
          className="w-9 h-9 rounded-full shrink-0 flex items-center justify-center overflow-hidden"
          style={{
            background: otherProfile.avatar_url
              ? "transparent"
              : "var(--accent)",
            border: "1px solid var(--accent)",
            color: "var(--accent)",
          }}
        >
          {otherProfile.avatar_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={otherProfile.avatar_url}
              alt={name}
              className="w-full h-full object-cover"
            />
          ) : (
            <span className="font-display text-xs">
              {name[0]?.toUpperCase() || "?"}
            </span>
          )}
        </div>
        <div className="flex-1 min-w-0">
          {otherProfile.username ? (
            <Link
              href={`/u/${otherProfile.username}`}
              className="block group"
            >
              <p
                className="font-display text-sm font-medium truncate group-hover:text-[var(--accent)] transition-colors"
                style={{ color: "var(--ink)" }}
              >
                {name}
              </p>
              <p
                className="font-mono text-[11px] truncate"
                style={{ color: "var(--ink-muted)" }}
              >
                @{otherProfile.username}
              </p>
            </Link>
          ) : (
            <p
              className="font-display text-sm font-medium truncate"
              style={{ color: "var(--ink)" }}
            >
              {name}
            </p>
          )}
        </div>
      </div>

      <MessageThread
        conversationId={convo.id}
        currentUserId={user.id}
        otherProfile={otherProfile}
        meProfile={meProfile}
        initialMessages={messages}
      />
    </div>
  );
}
