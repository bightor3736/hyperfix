import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { notFound } from "next/navigation";
import { deleteList, removeFixFromList } from "@/app/actions/lists";
import { ArrowLeft, Edit, Delete, CloseSquare } from "@/components/icons";

type FixInList = {
  id: string;
  title: string;
  category: string;
  status: string;
  started_at: string;
  ended_at: string | null;
};

type ListItem = {
  id: string;
  fix_id: string;
  note: string | null;
  sort_order: number;
  added_at: string;
  fixes: FixInList | null;
};

type FixList = {
  id: string;
  user_id: string;
  name: string;
  description: string | null;
  is_public: boolean;
  created_at: string;
  updated_at: string;
  fix_list_items: ListItem[];
};

function getDayCount(startedAt: string, endedAt: string | null): number {
  const start = new Date(startedAt);
  const end = endedAt ? new Date(endedAt) : new Date();
  const diff = end.getTime() - start.getTime();
  return Math.max(1, Math.ceil(diff / (1000 * 60 * 60 * 24)));
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

const CATEGORY_COLORS: Record<string, string> = {
  song: "var(--accent)",
  fanfic: "#F472B6",
  show: "#60A5FA",
  film: "#818CF8",
  ship: "#FB7185",
  game: "#34D399",
  "video essay": "#FBBF24",
  podcast: "#A7F3D0",
  book: "#F97316",
  character: "var(--accent)",
  other: "var(--ink-muted)",
};

function getCategoryColor(category: string): string {
  return CATEGORY_COLORS[category.toLowerCase()] ?? "var(--ink-muted)";
}

export default async function ListDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data, error } = await supabase
    .from("fix_lists")
    .select("*, fix_list_items(*, fixes(id, title, category, status, started_at, ended_at))")
    .eq("id", id)
    .single();

  if (error || !data) {
    notFound();
  }

  const list = data as FixList;

  // If private and not the owner, 404
  if (!list.is_public && list.user_id !== user?.id) {
    notFound();
  }

  const isOwner = user?.id === list.user_id;

  const items = (list.fix_list_items ?? []).sort(
    (a, b) => a.sort_order - b.sort_order
  );

  return (
    <div className="min-h-screen px-4 sm:px-6 lg:px-8 pt-8 pb-12" style={{ background: "var(--bg)" }}>
      <div className="max-w-3xl mx-auto">

        {/* Back */}
        <div className="mb-8">
          <Link
            href="/dashboard/lists"
            className="inline-flex items-center gap-2 font-sans text-sm transition-colors hover:opacity-80"
            style={{ color: "var(--ink-muted)" }}
          >
            <ArrowLeft set="light" size={18} primaryColor="currentColor" />
            Your lists
          </Link>
        </div>

        {/* Header */}
        <div className="flex items-start justify-between gap-4 mb-6">
          <div className="flex-1 min-w-0">
            {/* Visibility badge */}
            <div className="flex items-center gap-2 mb-3 flex-wrap">
              <span
                className="font-mono text-[9px] uppercase tracking-widest px-2 py-0.5 rounded-full"
                style={
                  list.is_public
                    ? {
                        background: "var(--accent-soft)",
                        border: "1px solid var(--accent)",
                        color: "var(--accent)",
                      }
                    : {
                        background: "var(--line)",
                        border: "1px solid var(--line)",
                        color: "var(--ink-faint)",
                      }
                }
              >
                {list.is_public ? "public" : "private"}
              </span>
              <span
                className="font-mono text-[9px] uppercase tracking-widest px-2 py-0.5 rounded-full"
                style={{
                  background: "var(--line)",
                  border: "1px solid var(--line)",
                  color: "var(--ink-faint)",
                }}
              >
                {items.length} fix{items.length !== 1 ? "es" : ""}
              </span>
            </div>

            <p
              className="font-mono text-[11px] uppercase tracking-[0.18em] mb-2"
              style={{ color: "var(--accent)" }}
            >
              list
            </p>
            <h1
              className="font-display leading-tight"
              style={{ color: "var(--ink)", fontSize: "clamp(22px, 4vw, 34px)", letterSpacing: "-0.02em", fontWeight: 600 }}
            >
              {list.name}
            </h1>

            {list.description && (
              <p
                className="font-sans text-sm mt-2 leading-relaxed"
                style={{ color: "var(--ink-muted)" }}
              >
                {list.description}
              </p>
            )}

            <p
              className="font-mono text-[10px] mt-3"
              style={{ color: "var(--ink-faint)" }}
            >
              Created {formatDate(list.created_at)}
              {list.updated_at !== list.created_at && (
                <> · Updated {formatDate(list.updated_at)}</>
              )}
            </p>
          </div>

          {/* Owner actions */}
          {isOwner && (
            <div className="flex items-center gap-2 shrink-0">
              <Link
                href={`/dashboard/lists/${id}/edit`}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl font-sans text-sm font-medium transition-all hover:opacity-80"
                style={{
                  background: "var(--line)",
                  border: "1px solid var(--line)",
                  color: "var(--ink-muted)",
                }}
              >
                <Edit set="light" size={15} primaryColor="currentColor" />
                Edit
              </Link>

              <form
                action={async () => {
                  "use server";
                  await deleteList(id);
                }}
              >
                <button
                  type="submit"
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl font-sans text-sm font-medium transition-all hover:opacity-80"
                  style={{
                    background: "rgba(225,29,72,0.08)",
                    border: "1px solid rgba(225,29,72,0.2)",
                    color: "#fda4af",
                  }}
                >
                  <Delete set="light" size={15} primaryColor="currentColor" />
                  Delete
                </button>
              </form>
            </div>
          )}
        </div>

        {/* Divider */}
        <div style={{ borderTop: "1px solid var(--line)", marginBottom: 24 }} />

        {/* Fix items */}
        {items.length > 0 ? (
          <div className="flex flex-col gap-3">
            {items.map((item) => {
              const fix = item.fixes;
              if (!fix) return null;

              const days = getDayCount(fix.started_at, fix.ended_at);
              const catColor = getCategoryColor(fix.category);
              const isEnded = fix.status === "Ended";

              return (
                <div
                  key={item.id}
                  className="rounded-2xl p-4 flex items-start gap-4"
                  style={{
                    background: "var(--bg)",
                    border: "1px solid var(--line)",
                  }}
                >
                  {/* Fix info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2 flex-wrap">
                      <span
                        className="font-mono text-[9px] uppercase tracking-widest px-2 py-0.5 rounded-full"
                        style={{
                          background: `${catColor}18`,
                          border: `1px solid ${catColor}30`,
                          color: catColor,
                        }}
                      >
                        {fix.category}
                      </span>
                      {isEnded && (
                        <span
                          className="font-mono text-[9px] uppercase tracking-widest px-2 py-0.5 rounded-full"
                          style={{
                            background: "var(--line)",
                            border: "1px solid var(--line)",
                            color: "var(--ink-faint)",
                          }}
                        >
                          ended
                        </span>
                      )}
                    </div>

                    <Link
                      href={`/dashboard/fix/${fix.id}`}
                      className="font-display font-semibold leading-snug hover:text-[var(--accent)] transition-colors block"
                      style={{
                        color: isEnded ? "var(--ink-muted)" : "var(--ink)",
                        fontSize: 16,
                        letterSpacing: "-0.01em",
                      }}
                    >
                      {fix.title}
                    </Link>

                    {item.note && (
                      <p
                        className="font-sans text-[12px] mt-1 leading-relaxed"
                        style={{ color: "var(--ink-muted)" }}
                      >
                        {item.note}
                      </p>
                    )}

                    <p
                      className="font-mono text-[10px] mt-2"
                      style={{ color: "var(--ink-faint)" }}
                    >
                      <span style={{ color: isEnded ? "var(--ink-faint)" : "var(--accent)" }}>
                        {days}d
                      </span>
                      {" · "}added {formatDate(item.added_at)}
                    </p>
                  </div>

                  {/* Remove button (owner only) */}
                  {isOwner && (
                    <form
                      action={async () => {
                        "use server";
                        await removeFixFromList(id, fix.id);
                      }}
                    >
                      <button
                        type="submit"
                        className="shrink-0 w-8 h-8 flex items-center justify-center rounded-lg transition-all hover:opacity-80"
                        style={{
                          background: "transparent",
                          border: "1px solid var(--line)",
                          color: "var(--ink-faint)",
                        }}
                        aria-label={`Remove ${fix.title} from list`}
                      >
                        <CloseSquare set="light" size={13} primaryColor="currentColor" />
                      </button>
                    </form>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 px-6 text-center">
            <p
              className="font-display italic mb-2"
              style={{ color: "var(--ink-faint)", fontSize: 24, letterSpacing: "-0.02em" }}
            >
              Empty list.
            </p>
            <p className="font-sans text-sm mb-6" style={{ color: "var(--ink-faint)" }}>
              {isOwner
                ? "Add fixes to this list from any fix's detail page."
                : "This list has no fixes yet."}
            </p>
            {isOwner && (
              <Link
                href="/dashboard"
                className="flex items-center gap-2 px-5 py-2.5 rounded-full font-sans text-sm font-bold transition-all hover:opacity-90 active:scale-[0.97]"
                style={{
                  background: "var(--accent-soft)",
                  border: "1px solid var(--accent-soft)",
                  color: "var(--accent)",
                }}
              >
                Browse fixes →
              </Link>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
