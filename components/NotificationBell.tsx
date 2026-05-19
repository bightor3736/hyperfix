"use client";

import { useState, useEffect, useRef, useTransition } from "react";

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
  const [, startTransition] = useTransition();
  const ref = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter((n) => !n.read).length;

  async function loadNotifications() {
    try {
      const res = await fetch("/api/notifications");
      if (!res.ok) return;
      const data = (await res.json()) as { notifications: Notification[] };
      setNotifications(data.notifications);
      setLoaded(true);
    } catch {
      // ignore
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

  function getNotificationText(n: Notification): { text: string; href: string } {
    const actor = n.actor;
    const name = actor?.display_name ?? actor?.username ?? "Someone";

    if (n.type === "reaction") {
      const fixTitle = n.fix?.title ?? "your fix";
      return {
        text: `${name} reacted ${n.emoji ?? ""} to "${fixTitle}"`,
        href: n.fix_id ? `/fix/${n.fix_id}` : "#",
      };
    }

    if (n.type === "follow") {
      return {
        text: `${name} started following you`,
        href: actor?.username ? `/u/${actor.username}` : "#",
      };
    }

    return { text: "New notification", href: "#" };
  }

  return (
    <div ref={ref} className="relative">
      <button
        onClick={handleOpen}
        className="relative flex items-center justify-center w-8 h-8 rounded-full transition-all duration-150 hover:bg-[rgba(244,244,244,0.06)]"
        aria-label="Notifications"
        style={{ color: "rgba(244,244,244,0.5)" }}
      >
        {/* Bell icon */}
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
          <path d="M13.73 21a2 2 0 0 1-3.46 0" />
        </svg>
        {/* Red dot badge */}
        {unreadCount > 0 && (
          <span
            className="absolute top-0.5 right-0.5 flex items-center justify-center rounded-full font-mono font-bold"
            style={{
              background: "#E63946",
              color: "#fff",
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
            background: "#161618",
            border: "1px solid rgba(244,244,244,0.1)",
            boxShadow: "0 8px 32px rgba(0,0,0,0.6)",
          }}
        >
          {/* Header */}
          <div
            className="flex items-center justify-between px-4 py-3"
            style={{ borderBottom: "1px solid rgba(244,244,244,0.07)" }}
          >
            <span className="font-mono text-[11px] uppercase tracking-widest" style={{ color: "rgba(244,244,244,0.5)" }}>
              Notifications
            </span>
            {unreadCount > 0 && (
              <button
                onClick={markAllRead}
                className="font-mono text-[10px] uppercase tracking-widest transition-opacity hover:opacity-80"
                style={{ color: "#A3E635" }}
              >
                Mark all read
              </button>
            )}
          </div>

          {/* List */}
          <div className="max-h-80 overflow-y-auto">
            {!loaded ? (
              <div className="px-4 py-6 text-center">
                <span className="font-mono text-xs" style={{ color: "rgba(244,244,244,0.3)" }}>
                  Loading…
                </span>
              </div>
            ) : notifications.length === 0 ? (
              <div className="px-4 py-8 text-center">
                <p className="font-sans text-sm" style={{ color: "rgba(244,244,244,0.3)" }}>
                  No notifications yet.
                </p>
              </div>
            ) : (
              notifications.map((n) => {
                const { text, href } = getNotificationText(n);
                return (
                  <a
                    key={n.id}
                    href={href}
                    onClick={() => setOpen(false)}
                    className="block px-4 py-3 transition-colors hover:bg-[rgba(244,244,244,0.04)]"
                    style={{
                      background: n.read ? "transparent" : "rgba(163,230,53,0.04)",
                      borderBottom: "1px solid rgba(244,244,244,0.04)",
                    }}
                  >
                    <p className="font-sans text-sm leading-snug" style={{ color: n.read ? "rgba(244,244,244,0.5)" : "#F4F4F4" }}>
                      {text}
                    </p>
                    <p className="font-mono text-[10px] mt-1" style={{ color: "rgba(244,244,244,0.25)" }}>
                      {new Date(n.created_at).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </a>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
}
