import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { redirect } from "next/navigation";
import type { Metadata } from "next";
import type { ComponentType } from "react";
import { MarkAllReadButton } from "./MarkAllReadButton";
import {
  HeartIcon,
  ChatIcon,
  SparkleIcon,
  FlameIcon,
  PinIcon,
} from "@/components/LandingIcons";
import { legacyEmojiToType, getReactionMeta } from "@/lib/reactions";

export const metadata: Metadata = { title: "Notifications · Hyperfix" };

const CARD_BG = "var(--bg)";
const CARD_BORDER = "var(--line)";
const TEAL = "var(--accent)";

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

type Rendered = {
  Icon: ComponentType<{ size?: number; className?: string }>;
  iconColor: string;
  text: React.ReactNode;
  href: string | null;
};

function renderNotif(n: Notif): Rendered | null {
  const actor = one(n.actor);
  const fix = one(n.fix);
  const name = actor?.display_name ?? actor?.username ?? "Someone";
  const fixTitle = fix?.title ?? "your fix";

  if (n.type === "reaction") {
    const type = n.emoji ? legacyEmojiToType(n.emoji) : null;
    const meta = type ? getReactionMeta(type) : null;
    return {
      Icon: HeartIcon,
      iconColor: "#0a0a0a",
      text: (
        <>
          <span style={{ color: "var(--ink)" }}>{name}</span>
          <span style={{ color: "var(--ink-muted)" }}> reacted </span>
          {meta && (
            <span
              className="inline-flex items-center gap-1 align-middle rounded-full px-1.5 py-0.5 mx-0.5"
              style={{
                background: "var(--line)",
                border: "1px solid var(--line)",
                color: "var(--ink)",
                fontSize: 11,
              }}
            >
              <meta.Icon size={11} />
              {meta.label}
            </span>
          )}
          <span style={{ color: "var(--ink-muted)" }}> to </span>
          <span style={{ color: "var(--ink)" }}>&ldquo;{fixTitle}&rdquo;</span>
        </>
      ),
      href: n.fix_id ? `/fix/${n.fix_id}` : null,
    };
  }
  if (n.type === "follow") {
    return {
      Icon: PinIcon,
      iconColor: "#0a0a0a",
      text: (
        <>
          <span style={{ color: "var(--ink)" }}>{name}</span>
          <span style={{ color: "var(--ink-muted)" }}> started following you</span>
        </>
      ),
      href: actor?.username ? `/u/${actor.username}` : null,
    };
  }
  if (n.type === "comment") {
    return {
      Icon: ChatIcon,
      iconColor: "#0a0a0a",
      text: (
        <>
          <span style={{ color: "var(--ink)" }}>{name}</span>
          <span style={{ color: "var(--ink-muted)" }}> commented on </span>
          <span style={{ color: "var(--ink)" }}>&ldquo;{fixTitle}&rdquo;</span>
        </>
      ),
      href: n.fix_id ? `/fix/${n.fix_id}` : null,
    };
  }
  if (n.type === "milestone") {
    return {
      Icon: SparkleIcon,
      iconColor: TEAL,
      text: (
        <span style={{ color: "var(--ink)" }}>
          You hit a milestone on <span style={{ color: "var(--ink)" }}>&ldquo;{fixTitle}&rdquo;</span>
        </span>
      ),
      href: n.fix_id ? `/dashboard/fix/${n.fix_id}` : null,
    };
  }
  if (n.type === "streak") {
    return {
      Icon: FlameIcon,
      iconColor: "#0a0a0a",
      text: (
        <span style={{ color: "var(--ink)" }}>
          Your streak on <span>&ldquo;{fixTitle}&rdquo;</span> is still going. Don&apos;t break the chain.
        </span>
      ),
      href: n.fix_id ? `/dashboard/fix/${n.fix_id}` : null,
    };
  }
  if (n.type === "message") {
    return {
      Icon: ChatIcon,
      iconColor: "var(--accent)",
      text: (
        <>
          <span style={{ color: "var(--ink)" }}>{name}</span>
          <span style={{ color: "var(--ink-muted)" }}> sent you a message</span>
        </>
      ),
      href: "/dashboard/messages",
    };
  }
  return null;
}

function startOfDay(d: Date): number {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x.getTime();
}

function bucketFor(dateStr: string): "today" | "yesterday" | "week" | "earlier" {
  const today = startOfDay(new Date());
  const ts = startOfDay(new Date(dateStr));
  const dayMs = 86_400_000;
  if (ts === today) return "today";
  if (ts === today - dayMs) return "yesterday";
  if (ts >= today - 6 * dayMs) return "week";
  return "earlier";
}

function relTime(dateStr: string): string {
  const d = new Date(dateStr);
  const diff = Date.now() - d.getTime();
  const m = Math.floor(diff / 60_000);
  if (m < 1) return "just now";
  if (m < 60) return `${m}m`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h`;
  const days = Math.floor(h / 24);
  if (days < 7) return `${days}d`;
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

const BUCKET_LABEL: Record<string, string> = {
  today: "Today",
  yesterday: "Yesterday",
  week: "This week",
  earlier: "Earlier",
};
const BUCKET_ORDER: Array<"today" | "yesterday" | "week" | "earlier"> = [
  "today",
  "yesterday",
  "week",
  "earlier",
];

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
    `,
    )
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(50);

  const notifications = (rows ?? []) as Notif[];
  const hasUnread = notifications.some((n) => !n.read);

  // Group by day bucket
  const grouped: Record<string, Notif[]> = {
    today: [],
    yesterday: [],
    week: [],
    earlier: [],
  };
  for (const n of notifications) {
    grouped[bucketFor(n.created_at)].push(n);
  }
  const useGrouping = notifications.length > 6;

  const renderRow = (n: Notif) => {
    const r = renderNotif(n);
    if (!r) return null;
    const { Icon, iconColor, text, href } = r;
    const inner = (
      <div className="flex items-start gap-3">
        {/* Unread dot rail */}
        <div className="flex flex-col items-center pt-1.5 shrink-0" style={{ width: 8 }}>
          {!n.read ? (
            <span
              className="block w-1.5 h-1.5 rounded-full"
              style={{ background: TEAL }}
              aria-label="unread"
            />
          ) : (
            <span className="block w-1.5 h-1.5" />
          )}
        </div>
        {/* Icon */}
        <div
          className="shrink-0 rounded-full flex items-center justify-center"
          style={{
            width: 32,
            height: 32,
            background: `${iconColor}14`,
            border: `1px solid ${iconColor}26`,
            color: iconColor,
            opacity: n.read ? 0.7 : 1,
          }}
        >
          <Icon size={14} />
        </div>
        {/* Text + time */}
        <div className="flex-1 min-w-0">
          <p
            className="font-sans text-[14px] leading-snug"
            style={{ opacity: n.read ? 0.7 : 1 }}
          >
            {text}
          </p>
          <p
            className="font-mono text-[10px] uppercase tracking-widest mt-1.5 tabular-nums"
            style={{ color: "var(--ink-faint)" }}
          >
            {relTime(n.created_at)}
          </p>
        </div>
      </div>
    );
    const baseClass =
      "block rounded-2xl px-4 py-3.5 transition-colors hover:bg-[transparent]";
    return href ? (
      <Link key={n.id} href={href} className={baseClass}>
        {inner}
      </Link>
    ) : (
      <div key={n.id} className={baseClass.replace("hover:bg-[transparent]", "")}>
        {inner}
      </div>
    );
  };

  return (
    <div className="min-h-screen pb-16" style={{ background: "var(--bg)" }}>
      {/* Dark hero */}
      <header className="relative overflow-hidden" style={{ background: ["radial-gradient(ellipse 80% 140% at 110% 65%, rgba(139,92,246,0.60) 0%, transparent 55%)", "radial-gradient(ellipse 50% 80% at 85% -5%, rgba(99,102,241,0.45) 0%, transparent 50%)", "linear-gradient(145deg, #1e1880 0%, #0f0d40 100%)"].join(", "), padding: "clamp(28px,4.5vw,44px) clamp(20px,5vw,44px) 56px" }}>
        <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E\")", backgroundSize: "200px 200px", opacity: 0.7 }} />
        <div className="relative z-10 flex items-end justify-between gap-4 flex-wrap">
          <div>
            <p className="font-mono text-[11px] uppercase tracking-[0.18em] mb-2" style={{ color: "rgba(167,139,250,0.8)" }}>Notifications</p>
            <h1 style={{ fontFamily: "var(--font-landing-sans), Inter, sans-serif", fontWeight: 700, letterSpacing: "-0.05em", fontSize: "clamp(32px,5vw,48px)", lineHeight: 1, color: "#fff" }}>
              What&apos;s been <span style={{ fontFamily: "var(--font-landing-serif), 'Source Serif 4', serif", fontStyle: "italic" }}>happening</span>.
            </h1>
            <p className="mt-3 font-sans text-[15px]" style={{ color: "rgba(255,255,255,0.55)" }}>
              Reactions, follows, comments — all the signs you&apos;re not alone in this.
            </p>
          </div>
          <MarkAllReadButton hasUnread={hasUnread} />
        </div>
      </header>

      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8" style={{ marginTop: -24 }}>

        {notifications.length === 0 ? (
          <div
            className="rounded-3xl p-12 text-center anim-fadeUp"
            style={{ background: CARD_BG, border: `1px solid ${CARD_BORDER}` }}
          >
            <h2
              className="font-display"
              style={{
                color: "var(--ink)",
                fontSize: "clamp(22px, 3vw, 28px)",
                letterSpacing: "-0.02em",
                fontWeight: 600,
                lineHeight: 1.1,
              }}
            >
              All caught up.
            </h2>
            <p
              className="mt-3 font-sans text-sm max-w-sm mx-auto"
              style={{ color: "var(--ink-muted)" }}
            >
              When people react, follow, or comment, you&apos;ll see it here.
            </p>
          </div>
        ) : (
          <div
            className="rounded-3xl overflow-hidden anim-fadeUp"
            style={{ background: CARD_BG, border: `1px solid ${CARD_BORDER}` }}
          >
            {useGrouping ? (
              <div className="flex flex-col py-2">
                {BUCKET_ORDER.map((bucket) => {
                  const items = grouped[bucket];
                  if (!items || items.length === 0) return null;
                  return (
                    <div key={bucket}>
                      <div className="px-5 pt-4 pb-2">
                        <p
                          className="font-mono text-[10px] uppercase tracking-widest"
                          style={{ color: "var(--ink-muted)" }}
                        >
                          {BUCKET_LABEL[bucket]}
                        </p>
                      </div>
                      <div className="flex flex-col px-2 pb-2">
                        {items.map(renderRow)}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="flex flex-col p-2">{notifications.map(renderRow)}</div>
            )}
          </div>
        )}
      </div>
    </div>
  );

}
