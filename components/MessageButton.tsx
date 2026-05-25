"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/Toast";

type Props = {
  targetUserId: string;
};

export function MessageButton({ targetUserId }: Props) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const { toast } = useToast();

  function handleClick() {
    startTransition(async () => {
      try {
        const res = await fetch("/api/conversations/start", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ otherUserId: targetUserId }),
        });
        if (!res.ok) {
          toast({ message: "Couldn't open conversation", type: "error" });
          return;
        }
        const data = (await res.json()) as { conversationId: string };
        router.push(`/dashboard/messages/${data.conversationId}`);
      } catch {
        toast({ message: "Couldn't open conversation", type: "error" });
      }
    });
  }

  return (
    <button
      onClick={handleClick}
      disabled={pending}
      className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full font-sans text-sm font-semibold transition-all duration-150 disabled:opacity-60"
      style={{
        background: "transparent",
        border: "1px solid rgba(244,244,244,0.15)",
        color: "rgba(244,244,244,0.85)",
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLButtonElement).style.borderColor =
          "rgba(94,234,212,0.5)";
        (e.currentTarget as HTMLButtonElement).style.color = "#5EEAD4";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLButtonElement).style.borderColor =
          "rgba(244,244,244,0.15)";
        (e.currentTarget as HTMLButtonElement).style.color =
          "rgba(244,244,244,0.85)";
      }}
      aria-label="Send message"
    >
      <svg
        width="13"
        height="13"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M3 7l9 6 9-6" />
        <rect x="3" y="5" width="18" height="14" rx="2" />
      </svg>
      Message
    </button>
  );
}
