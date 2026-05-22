import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { redirect } from "next/navigation";
import type { Metadata } from "next";
import { MarkAllReadButton } from "./MarkAllReadButton";

export const metadata: Metadata = { title: "Notifications · Hyperfix" };

const CARD_BG = "#0F1011";
const CARD_BORDER = "rgba(255,255,255,0.06)";
const TEAL = "#5EEAD4";

type NotifActor = {
  username: string | null;
  display_name: string | null;
  avatar_url: string | null;
};

type Notif = {
  id: string;
  type: string;
  emoji: string | null;
  read: boolean;
  created_at: string;
  fix_id: string | null;
  actor: NotifActor | NotifActor[] | null;
  fix: { title: string } | { title: string }[] | null;
};

function one<T>(v: T | T[] | null): T | null {
  if (Array.isArray(v)) return v[0] ?? null;
  return v;
}

function notifContent(n: Notif): { text: string; href: string | null } | null {
  const actor = one(n.actor);
  const fix = one(n.fix);
  const name = actor?.display_name ?? actor?.username ?? "Someone";
  const fixTitle = fix?.title ?? "your fix";

  if (n.type === "reaction") {
    return {
      text: `${name} reacted ${n.emoji ?? ""} to "${fixTitle}"`,
      href: n.fix_id ? `/fix/${n.fix_id}` : null,
    };
  }
  if (n.type === "follow") {
    return {
      text: `${name} started following you`,
      href: actor?.username ? `/u/${actor.username}` : null,
    };
  }
  if (n.type === "comment") {
    return {
      text: `${name} commented on "${fixTitle}"`,
      href: n.fix_id ? `/fix/${n.fix_id}` : null,
    };
  }
  return null;
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default async function NotificationsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login");
  }

  const { data: rows } = await supabase
    .from("notifications")
    .select(
      `
      id, type, emoji, read, created_at, fix_id,
      actor:profiles!notifications_actor_id_fkey(username, display_name, avatar_url),
      fix:fixes!notifications_fix_id_fkey(title)
    `
    )
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(50);

  const notifications = (rows ?? []) as Notif[];
  const hasUnread = notifications.some((n) => !n.read);

  return (
    <div className="min-h-screen px-4 sm:px-6 lg:px-8 pt-8 pb-12" style={{ background: "#070708" }}>
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-display font-medium" style={{ color: "#F4F4F4" }}>
            Notifications
          </h1>
          <MarkAllReadButton hasUnread={hasUnread} />
        </div>

        {notifications.length === 0 ? (
          <div
            className="rounded-3xl p-12 text-center"
            style={{ background: CARD_BG, border: `1px solid ${CARD_BORDER}` }}
          >
            <p className="font-display text-lg" style={{ color: "rgba(244,244,244,0.5)" }}>
              No notifications yet.
            </p>
            <p className="font-sans text-sm mt-2" style={{ color: "rgba(244,244,244,0.3)" }}>
              Reactions, comments, and new followers will show up here.
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            {notifications.map((n) => {
              const content = notifContent(n);
              if (!content) return null;
              const { text, href } = content;
              const style = {
                background: n.read ? CARD_BG : "rgba(94,234,212,0.05)",
                border: `1px solid ${n.read ? CARD_BORDER : "rgba(94,234,212,0.18)"}`,
              };
              const inner = (
                <>
                  <div className="flex items-center gap-2">
                    {!n.read && (
                      <span
                        className="w-1.5 h-1.5 rounded-full shrink-0"
                        style={{ background: TEAL }}
                      />
                    )}
                    <p
                      className="font-sans text-sm leading-snug"
                      style={{ color: n.read ? "rgba(244,244,244,0.6)" : "#F4F4F4" }}
                    >
                      {text}
                    </p>
                  </div>
                  <p className="font-mono text-[10px] mt-1.5" style={{ color: "rgba(244,244,244,0.25)" }}>
                    {formatDate(n.created_at)}
                  </p>
                </>
              );
              return href ? (
                <Link
                  key={n.id}
                  href={href}
                  className="block rounded-2xl p-4 transition-all hover:border-[rgba(94,234,212,0.3)]"
                  style={style}
                >
                  {inner}
                </Link>
              ) : (
                <div key={n.id} className="rounded-2xl p-4" style={style}>
                  {inner}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
