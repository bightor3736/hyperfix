import { ActivityTickerClient } from "./ActivityTickerClient";

export type TickerItem = {
  id: string;
  type: "started" | "checked_in";
  title: string;
  initial: string;
  timeAgo: string;
};

type FixRow = {
  id: string;
  title: string | null;
  created_at: string;
  profiles?: { username: string | null } | null;
};

type FixEntryRow = {
  fix_id: string;
  created_at: string;
  fixes?: {
    title: string | null;
    is_public: boolean | null;
    profiles?: { username: string | null } | null;
  } | null;
};

function timeAgo(iso: string): string {
  const then = new Date(iso).getTime();
  const now = Date.now();
  const diffSec = Math.max(0, Math.floor((now - then) / 1000));
  if (diffSec < 60) return `${diffSec}s ago`;
  const m = Math.floor(diffSec / 60);
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  const d = Math.floor(h / 24);
  return `${d}d ago`;
}

function firstLetter(username: string | null | undefined): string {
  if (!username) return "?";
  const ch = username.trim().charAt(0);
  return (ch || "?").toUpperCase();
}

async function fetchTickerItems(): Promise<TickerItem[]> {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!supabaseUrl || !serviceKey) return [];

  const headers = {
    apikey: serviceKey,
    Authorization: `Bearer ${serviceKey}`,
  };

  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
  const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();

  try {
    const [fixesRes, entriesRes] = await Promise.all([
      fetch(
        `${supabaseUrl}/rest/v1/fixes?select=id,title,created_at,profiles(username)&is_public=eq.true&created_at=gte.${sevenDaysAgo}&order=created_at.desc&limit=20`,
        { headers, next: { revalidate: 60 } },
      ),
      fetch(
        `${supabaseUrl}/rest/v1/fix_entries?select=fix_id,created_at,fixes(title,is_public,profiles(username))&created_at=gte.${oneDayAgo}&order=created_at.desc&limit=20`,
        { headers, next: { revalidate: 60 } },
      ),
    ]);

    const fixes: FixRow[] = fixesRes.ok ? await fixesRes.json() : [];
    const entries: FixEntryRow[] = entriesRes.ok ? await entriesRes.json() : [];

    const items: TickerItem[] = [];
    const seen = new Set<string>();

    for (const f of fixes) {
      if (!f.title || seen.has(f.id)) continue;
      seen.add(f.id);
      items.push({
        id: `started-${f.id}`,
        type: "started",
        title: f.title,
        initial: firstLetter(f.profiles?.username),
        timeAgo: timeAgo(f.created_at),
      });
    }

    for (const e of entries) {
      if (!e.fixes || e.fixes.is_public !== true) continue;
      if (!e.fixes.title) continue;
      const key = `checked-${e.fix_id}`;
      if (seen.has(key)) continue;
      seen.add(key);
      items.push({
        id: key,
        type: "checked_in",
        title: e.fixes.title,
        initial: firstLetter(e.fixes.profiles?.username),
        timeAgo: timeAgo(e.created_at),
      });
    }

    items.sort((a, b) => {
      const aMs = parseTimeAgoToMs(a.timeAgo);
      const bMs = parseTimeAgoToMs(b.timeAgo);
      return aMs - bMs;
    });

    return items.slice(0, 20);
  } catch {
    return [];
  }
}

function parseTimeAgoToMs(s: string): number {
  const m = s.match(/^(\d+)([smhd])/);
  if (!m) return Number.MAX_SAFE_INTEGER;
  const n = parseInt(m[1], 10);
  switch (m[2]) {
    case "s":
      return n * 1000;
    case "m":
      return n * 60 * 1000;
    case "h":
      return n * 60 * 60 * 1000;
    case "d":
      return n * 24 * 60 * 60 * 1000;
  }
  return Number.MAX_SAFE_INTEGER;
}

export default async function ActivityTicker() {
  const items = await fetchTickerItems();
  if (items.length === 0) return null;
  return <ActivityTickerClient items={items} />;
}
