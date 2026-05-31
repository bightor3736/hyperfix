"use client";

import { useEffect, useRef, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { MessageInput } from "@/components/MessageInput";
import type { ConversationProfile } from "@/lib/conversations";

type Message = {
  id: string;
  conversation_id: string;
  sender_id: string;
  body: string;
  read: boolean;
  created_at: string;
};

type Props = {
  conversationId: string;
  currentUserId: string;
  otherProfile: ConversationProfile;
  meProfile: ConversationProfile;
  initialMessages: Message[];
};

function formatTime(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

function Avatar({
  profile,
  size = 28,
}: {
  profile: ConversationProfile;
  size?: number;
}) {
  const name = profile.display_name ?? profile.username ?? "?";
  return (
    <div
      className="rounded-full shrink-0 flex items-center justify-center overflow-hidden"
      style={{
        width: size,
        height: size,
        background: profile.avatar_url
          ? "transparent"
          : "var(--accent)",
        border: "1px solid var(--accent)",
        color: "var(--accent)",
      }}
    >
      {profile.avatar_url ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={profile.avatar_url}
          alt={name}
          className="w-full h-full object-cover"
        />
      ) : (
        <span className="font-display text-[11px] font-semibold">
          {name[0]?.toUpperCase() || "?"}
        </span>
      )}
    </div>
  );
}

export function MessageThread({
  conversationId,
  currentUserId,
  otherProfile,
  meProfile,
  initialMessages,
}: Props) {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollTop = el.scrollHeight;
  }, [messages.length]);

  // Realtime subscription
  useEffect(() => {
    const supabase = createClient();
    const channel = supabase
      .channel(`messages:${conversationId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
          filter: `conversation_id=eq.${conversationId}`,
        },
        (payload) => {
          const m = payload.new as Message;
          setMessages((prev) => {
            if (prev.some((x) => x.id === m.id)) return prev;
            return [...prev, m];
          });
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [conversationId]);

  function handleSent(msg: Message) {
    setMessages((prev) => {
      if (prev.some((x) => x.id === msg.id)) return prev;
      return [...prev, msg];
    });
  }

  return (
    <>
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto px-3 sm:px-5 py-5"
      >
        {messages.length === 0 ? (
          <div className="h-full flex items-center justify-center">
            <p
              className="font-sans text-sm"
              style={{ color: "var(--ink-muted)" }}
            >
              Say hi to start the conversation.
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-3 max-w-2xl mx-auto">
            {messages.map((m, i) => {
              const mine = m.sender_id === currentUserId;
              const prev = messages[i - 1];
              const showAvatar =
                !prev || prev.sender_id !== m.sender_id;
              const profile = mine ? meProfile : otherProfile;
              return (
                <div
                  key={m.id}
                  className={`flex gap-2 ${
                    mine ? "justify-end" : "justify-start"
                  }`}
                >
                  {!mine && (
                    <div className="w-7 shrink-0">
                      {showAvatar && <Avatar profile={profile} size={28} />}
                    </div>
                  )}
                  <div
                    className={`group max-w-[78%] sm:max-w-[70%] flex flex-col ${
                      mine ? "items-end" : "items-start"
                    }`}
                  >
                    <div
                      title={formatTime(m.created_at)}
                      className="rounded-2xl px-3.5 py-2 font-sans text-sm leading-snug whitespace-pre-wrap break-words"
                      style={
                        mine
                          ? {
                              background: "var(--accent)",
                              color: "var(--bg)",
                              border: "1px solid var(--accent)",
                            }
                          : {
                              background: "var(--bg)",
                              color: "var(--ink)",
                              border: "1px solid var(--line)",
                            }
                      }
                    >
                      {m.body}
                    </div>
                    <span
                      className="font-mono text-[10px] mt-1 opacity-0 group-hover:opacity-100 transition-opacity"
                      style={{ color: "var(--ink-faint)" }}
                    >
                      {formatTime(m.created_at)}
                    </span>
                  </div>
                  {mine && (
                    <div className="w-7 shrink-0">
                      {showAvatar && <Avatar profile={profile} size={28} />}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
      <MessageInput conversationId={conversationId} onSent={handleSent} />
    </>
  );
}
