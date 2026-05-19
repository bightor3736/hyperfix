import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { redirect } from "next/navigation";

type FixListWithCount = {
  id: string;
  name: string;
  description: string | null;
  is_public: boolean;
  created_at: string;
  fix_list_items: { count: number }[];
};

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default async function ListsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login");
  }

  const { data, error } = await supabase
    .from("fix_lists")
    .select("id, name, description, is_public, created_at, fix_list_items(count)")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  const lists = (data ?? []) as FixListWithCount[];

  return (
    <div className="min-h-screen px-4 sm:px-6 lg:px-8 pt-8 pb-12" style={{ background: "#0A0A0A" }}>
      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1
              className="font-display font-bold leading-tight"
              style={{ color: "#F4F4F4", fontSize: "clamp(24px, 4vw, 36px)", letterSpacing: "-0.02em" }}
            >
              Your Lists
            </h1>
            <p className="font-sans text-sm mt-1" style={{ color: "rgba(244,244,244,0.4)" }}>
              {lists.length === 0
                ? "Curate your fixations into collections."
                : `${lists.length} list${lists.length !== 1 ? "s" : ""}`}
            </p>
          </div>

          <Link
            href="/dashboard/lists/new"
            className="hidden lg:flex items-center gap-2 px-4 py-2.5 rounded-full font-sans text-sm font-bold transition-all hover:opacity-90 active:scale-[0.97] shrink-0"
            style={{ background: "#A3E635", color: "#0A0A0A" }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            New list
          </Link>
        </div>

        {/* Error */}
        {error && (
          <div
            className="rounded-2xl px-4 py-3 mb-6 font-sans text-sm"
            style={{
              background: "rgba(225,29,72,0.08)",
              border: "1px solid rgba(225,29,72,0.2)",
              color: "#fda4af",
            }}
          >
            Could not load lists: {error.message}
          </div>
        )}

        {/* Lists grid */}
        {lists.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {lists.map((list) => {
              const itemCount = list.fix_list_items?.[0]?.count ?? 0;
              return (
                <Link
                  key={list.id}
                  href={`/dashboard/lists/${list.id}`}
                  className="group rounded-2xl p-5 flex flex-col gap-3 transition-all hover:border-[rgba(163,230,53,0.2)]"
                  style={{
                    background: "#111113",
                    border: "1px solid rgba(244,244,244,0.07)",
                    textDecoration: "none",
                  }}
                >
                  {/* Top row: badges */}
                  <div className="flex items-center gap-2 flex-wrap">
                    <span
                      className="font-mono text-[9px] uppercase tracking-widest px-2 py-0.5 rounded-full"
                      style={
                        list.is_public
                          ? {
                              background: "rgba(163,230,53,0.08)",
                              border: "1px solid rgba(163,230,53,0.2)",
                              color: "rgba(163,230,53,0.7)",
                            }
                          : {
                              background: "rgba(244,244,244,0.05)",
                              border: "1px solid rgba(244,244,244,0.1)",
                              color: "rgba(244,244,244,0.35)",
                            }
                      }
                    >
                      {list.is_public ? "public" : "private"}
                    </span>
                    <span
                      className="font-mono text-[9px] uppercase tracking-widest px-2 py-0.5 rounded-full"
                      style={{
                        background: "rgba(244,244,244,0.05)",
                        border: "1px solid rgba(244,244,244,0.08)",
                        color: "rgba(244,244,244,0.3)",
                      }}
                    >
                      {itemCount} fix{itemCount !== 1 ? "es" : ""}
                    </span>
                  </div>

                  {/* Name */}
                  <h2
                    className="font-display font-semibold leading-snug group-hover:text-[#A3E635] transition-colors"
                    style={{
                      color: "#F4F4F4",
                      fontSize: 17,
                      letterSpacing: "-0.02em",
                    }}
                  >
                    {list.name}
                  </h2>

                  {/* Description */}
                  {list.description && (
                    <p
                      className="font-sans text-sm leading-relaxed"
                      style={{
                        color: "rgba(244,244,244,0.45)",
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                      }}
                    >
                      {list.description}
                    </p>
                  )}

                  {/* Footer: date */}
                  <p
                    className="font-mono text-[10px] mt-auto pt-1"
                    style={{ color: "rgba(244,244,244,0.25)" }}
                  >
                    Created {formatDate(list.created_at)}
                  </p>
                </Link>
              );
            })}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-24 px-6 text-center">
            <p
              className="font-display italic mb-2"
              style={{ color: "rgba(244,244,244,0.3)", fontSize: 28, letterSpacing: "-0.02em" }}
            >
              No lists yet.
            </p>
            <p className="font-sans text-sm mb-6" style={{ color: "rgba(244,244,244,0.2)" }}>
              Create one to start curating your fixations.
            </p>
            <Link
              href="/dashboard/lists/new"
              className="flex items-center gap-2 px-5 py-2.5 rounded-full font-sans text-sm font-bold transition-all hover:opacity-90 active:scale-[0.97]"
              style={{
                background: "rgba(163,230,53,0.12)",
                border: "1px solid rgba(163,230,53,0.3)",
                color: "#A3E635",
              }}
            >
              + New list
            </Link>
          </div>
        )}
      </div>

      {/* Mobile FAB */}
      <Link
        href="/dashboard/lists/new"
        className="lg:hidden fixed flex items-center justify-center rounded-full transition-all hover:opacity-90 active:scale-95"
        style={{
          bottom: "calc(5rem + 1rem + env(safe-area-inset-bottom))",
          right: "1rem",
          width: 52,
          height: 52,
          background: "#A3E635",
          color: "#0A0A0A",
          zIndex: 40,
          boxShadow: "0 4px 24px rgba(163,230,53,0.35)",
        }}
        aria-label="New list"
      >
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
          <line x1="12" y1="5" x2="12" y2="19" />
          <line x1="5" y1="12" x2="19" y2="12" />
        </svg>
      </Link>
    </div>
  );
}
