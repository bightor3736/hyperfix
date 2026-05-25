"use client";

import { useState, useRef, KeyboardEvent } from "react";
import { useToast } from "@/components/Toast";

type Props = {
  conversationId: string;
  onSent?: (msg: {
    id: string;
    conversation_id: string;
    sender_id: string;
    body: string;
    read: boolean;
    created_at: string;
  }) => void;
};

export function MessageInput({ conversationId, onSent }: Props) {
  const [value, setValue] = useState("");
  const [sending, setSending] = useState(false);
  const taRef = useRef<HTMLTextAreaElement>(null);
  const { toast } = useToast();

  async function handleSend() {
    const body = value.trim();
    if (!body || sending) return;
    if (body.length > 2000) {
      toast({ message: "Message too long (max 2000)", type: "error" });
      return;
    }
    setSending(true);
    const prev = value;
    setValue("");
    if (taRef.current) taRef.current.style.height = "auto";
    try {
      const res = await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ conversationId, body }),
      });
      if (!res.ok) {
        setValue(prev);
        toast({ message: "Failed to send", type: "error" });
        return;
      }
      const data = (await res.json()) as {
        message: {
          id: string;
          conversation_id: string;
          sender_id: string;
          body: string;
          read: boolean;
          created_at: string;
        };
      };
      onSent?.(data.message);
    } catch {
      setValue(prev);
      toast({ message: "Failed to send", type: "error" });
    } finally {
      setSending(false);
    }
  }

  function handleKey(e: KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  function handleInput(e: React.ChangeEvent<HTMLTextAreaElement>) {
    setValue(e.target.value);
    const el = e.target;
    el.style.height = "auto";
    el.style.height = Math.min(el.scrollHeight, 160) + "px";
  }

  return (
    <div
      className="flex items-end gap-2 px-3 sm:px-4 py-3 shrink-0"
      style={{
        background: "rgba(7,7,8,0.92)",
        backdropFilter: "blur(20px)",
        borderTop: "1px solid rgba(255,255,255,0.06)",
      }}
    >
      <div
        className="flex-1 rounded-2xl px-3 py-2"
        style={{
          background: "#0F1011",
          border: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        <textarea
          ref={taRef}
          value={value}
          onChange={handleInput}
          onKeyDown={handleKey}
          placeholder="Write a message…"
          rows={1}
          className="w-full bg-transparent resize-none outline-none font-sans text-sm leading-snug"
          style={{
            color: "#F4F4F4",
            maxHeight: 160,
          }}
        />
      </div>
      <button
        onClick={handleSend}
        disabled={sending || value.trim().length === 0}
        className="rounded-full px-4 h-10 font-sans text-sm font-semibold transition-all disabled:opacity-50"
        style={{
          background: "#5EEAD4",
          color: "#0A0A0A",
          border: "1px solid #5EEAD4",
        }}
        aria-label="Send message"
      >
        Send
      </button>
    </div>
  );
}
