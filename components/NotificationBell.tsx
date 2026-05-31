"use client";

import { useState, useEffect, useRef, useTransition } from "react";
import { Notification } from "react-iconly";

type NotificationActor = {
  username: string | null;
  display_name: string | null;
  avatar_url: string | null;
};

type NotificationFix = {
  title: string;
} | null;

type Notification = {
  id: string;
  type: string;
  emoji: string | null;
  read: boolean;
  created_at: string;
  fix_id: string | null;
  actor: NotificationActor | null;
  fix: NotificationFix;
};

export function NotificationBell() {
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [loadError, setLoadError] = useState(false);
  const [, startTransition] = useTransition();
  const ref = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter((n) => !n.read).length;

  async function loadNotifications() {
    try {
      const res = await fetch("/api/notifications");
      if (!res.ok) {
        setLoadError(true);
        return;
      }
      const data = (await res.json()) as { notifications: Notification[] };
      setNotifications(data.notifications);
      setLoadError(false);
      setLoaded(true);
    } catch {
      setLoadError(true);
    }
  }

  function handleOpen() {
    setOpen((v) => !v);
    if (!loaded) loadNotifications();
  }

  function markAllRead() {
    startTransition(async () => {
      await fetch("/api/notifications", { method: "PATCH" });
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    });
  }

  // Close on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  // Load on mount, then poll every 60s for unread count
  useEffect(() => {
    loadNotifications();
    const interval = setInterval(loadNotifications, 60_000);
    return () => clearInterval(interval);
  }, []);

  function getNotificationText(n: Notification): { text: string; href: string | null } | null {
    const actor = n.actor;
    const name = actor?.display_name ?? actor?.username ?? "Someone";

    if (n.type === "reaction") {
      const fixTitle = n.fix?.title ?? "your fix";
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
      const fixTitle = n.fix?.title ?? "your fix";
      return {
        text: `${name} commented on "${fixTitle}"`,
        href: n.fix_id ? `/fix/${n.fix_id}` : null,
      };
    }

    if (n.type === "message") {
      return {
        text: `${name} sent you a message`,
        href: "/dashboard/messages",
      };
    }

    if (n.type === "milestone") {
      const fixTitle = n.fix?.title ?? "your fix";
      return {
        text: `You hit a milestone on "${fixTitle}"`,
        href: n.fix_id ? `/dashboard/fix/${n.fix_id}` : null,
      };
    }

    if (n.type === "streak") {
      const fixTitle = n.fix?.title ?? "your fix";
      return {
        text: `Your streak on "${fixTitle}" is still going`,
        href: n.fix_id ? `/dashboard/fix/${n.fix_id}` : null,
      };
    }

    return null;
  }

  return (
    <div ref={ref} className="relative">
      <button
        onClick={handleOpen}
        className="relative flex items-center justify-center w-8 h-8 rounded-full transition-all duration-150 hover:bg-[var(--line)]"
        aria-label="Notifications"
        style={{ color: "var(--ink-muted)" }}
      >
        <Notification set={unreadCount > 0 ? "bold" : "light"} size={18} primaryColor="currentColor" />
        {/* Red dot badge */}
        {unreadCount > 0 && (
          <span
            className="absolute top-0.5 right-0.5 flex items-center justify-center rounded-full font-mono font-bold"
            style={{
              background: "#E63946",
              color: "var(--ink)",
              fontSize: 8,
              minWidth: 14,
              height: 14,
              padding: "0 3px",
            }}
          >
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown */}
      {open && (
        <div
          className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-80 rounded-2xl overflow-hidden z-50"
          style={{
            background: "var(--bg)",
            border: "1px solid var(--line)",
            boxShadow: "0 8px 32px rgba(0,0,0,0.6)",
          }}
        >
          {/* Header */}
          <div
            className="flex items-center justify-between px-4 py-3"
            style={{ borderBottom: "1px solid var(--line)" }}
          >
            <span className="font-mono text-[11px] uppercase tracking-widest" style={{ color: "var(--ink-muted)" }}>
              Notifications
            </span>
            {unreadCount > 0 && (
              <button
                onClick={markAllRead}
                className="font-mono text-[10px] uppercase tracking-widest transition-opacity hover:opacity-80"
                style={{ color: "var(--accent)" }}
              >
                Mark all read
              </button>
            )}
          </div>

          {/* List */}
          <div className="max-h-80 overflow-y-auto">
            {!loaded && loadError ? (
              <div className="px-4 py-6 text-center">
                <p className="font-sans text-sm mb-2" style={{ color: "var(--ink-muted)" }}>
                  Couldn&apos;t load notifications.
                </p>
                <button
                  onClick={loadNotifications}
                  className="font-mono text-[10px] uppercase tracking-widest transition-opacity hover:opacity-80"
                  style={{ color: "var(--accent)" }}
                >
                  Retry
                </button>
              </div>
            ) : !loaded ? (
              <div className="px-4 py-6 text-center">
                <span className="font-mono text-xs" style={{ color: "var(--ink-faint)" }}>
                  Loading…
                </span>
              </div>
            ) : notifications.length === 0 ? (
              <div className="px-4 py-8 text-center">
                <p className="font-sans text-sm" style={{ color: "var(--ink-faint)" }}>
                  No notifications yet.
                </p>
              </div>
            ) : (
              notifications.map((n) => {
                const result = getNotificationText(n);
                if (!result) return null;
                const { text, href } = result;
                const sharedStyle = {
                  background: n.read ? "transparent" : "var(--accent-soft)",
                  borderBottom: "1px solid transparent",
                };
                const inner = (
                  <>
                    <p className="font-sans text-sm leading-snug" style={{ color: n.read ? "var(--ink-muted)" : "var(--ink)" }}>
                      {text}
                    </p>
                    <p className="font-mono text-[10px] mt-1" style={{ color: "var(--ink-faint)" }}>
                      {new Date(n.created_at).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </>
                );
                return href ? (
                  <a
                    key={n.id}
                    href={href}
                    onClick={() => setOpen(false)}
                    className="block px-4 py-3 transition-colors hover:bg-[transparent]"
                    style={sharedStyle}
                  >
                    {inner}
                  </a>
                ) : (
                  <div
                    key={n.id}
                    className="px-4 py-3"
                    style={sharedStyle}
                  >
                    {inner}
                  </div>
                );
              })
            )}
          </div>

          {/* Footer */}
          <a
            href="/dashboard/notifications"
            onClick={() => setOpen(false)}
            className="block px-4 py-3 text-center font-mono text-[10px] uppercase tracking-widest transition-opacity hover:opacity-80"
            style={{ borderTop: "1px solid var(--line)", color: "var(--accent)" }}
          >
            See all notifications
          </a>
        </div>
      )}
    </div>
  );
}
