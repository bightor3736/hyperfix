import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Plus } from "@/components/icons";

type FixListWithCount = {
  id: string;
  name: string;
  description: string | null;
  is_public: boolean;
  created_at: string;
  fix_list_items: { count: number }[];
};

const TEAL = "#5EEAD4";
const CARD_BG = "#0F1011";
const CARD_BORDER = "rgba(255,255,255,0.06)";
const NOISE_URL =
  "url(\"data:image/svg+xml;utf8,<svg viewBox='0 0 240 240' xmlns='http://www.w3.org/2000/svg'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 0.55 0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>\")";

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

export default async function ListsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

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
    <div className="min-h-screen px-4 sm:px-6 lg:px-8 pt-8 pb-12 relative" style={{ background: "#070708" }}>
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none mix-blend-overlay"
        style={{ backgroundImage: NOISE_URL, backgroundSize: "240px 240px", opacity: 0.08 }}
      />
      <div className="relative max-w-5xl mx-auto">
        {/* Hero */}
        <div
          className="relative overflow-hidden rounded-3xl mb-6 p-6 sm:p-10 anim-fadeUp"
          style={{
            background:
              "radial-gradient(ellipse 80% 120% at 50% 130%, #5EEAD4 0%, #2DD4BF 14%, #0E4F47 34%, #08231F 55%, #070708 78%)",
            border: `1px solid ${CARD_BORDER}`,
          }}
        >
          <div
            aria-hidden
            className="absolute inset-0 pointer-events-none mix-blend-overlay"
            style={{ backgroundImage: NOISE_URL, backgroundSize: "200px 200px", opacity: 0.55 }}
          />
          <div
            aria-hidden
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                "linear-gradient(180deg, #070708 0%, rgba(7,7,8,0.45) 30%, transparent 100%)",
            }}
          />
          <div className="relative flex flex-col sm:flex-row sm:items-end justify-between gap-6">
            <div>
              <span
                className="inline-flex items-center font-sans text-xs rounded-full px-3 py-1 mb-5"
                style={{
                  background: "rgba(94,234,212,0.12)",
                  color: TEAL,
                  border: "1px solid rgba(94,234,212,0.25)",
                }}
              >
                your lists
              </span>
              <h1
                className="font-display"
                style={{
                  color: "#FFFFFF",
                  fontSize: "clamp(36px, 6vw, 56px)",
                  lineHeight: 1.02,
                  letterSpacing: "-0.02em",
                  fontWeight: 600,
                }}
              >
                Curate your
                <br />
                fixations.
              </h1>
              <p className="mt-4 font-sans text-base" style={{ color: "rgba(255,255,255,0.72)" }}>
                {lists.length === 0
                  ? "Create your first list to start grouping the obsessions."
                  : `${lists.length} list${lists.length !== 1 ? "s" : ""} · ready to share or keep to yourself.`}
              </p>
            </div>

            <Link
              href="/dashboard/lists/new"
              className="hidden lg:inline-flex items-center gap-2.5 font-sans text-sm font-semibold px-6 py-3.5 transition-all hover:opacity-95 hover:-translate-y-px active:scale-[0.98]"
              style={{
                background: "#FFFFFF",
                color: "#0A0A0A",
                borderRadius: 999,
                boxShadow: "0 1px 0 0 rgba(255,255,255,0.5) inset, 0 12px 36px rgba(0,0,0,0.4)",
              }}
            >
              <Plus set="light" size={16} primaryColor="currentColor" />
              New list
            </Link>
          </div>
        </div>

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

        {lists.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {lists.map((list, i) => {
              const itemCount = list.fix_list_items?.[0]?.count ?? 0;
              const delay = `${Math.min(i, 6) * 60}ms`;
              return (
                <Link
                  key={list.id}
                  href={`/dashboard/lists/${list.id}`}
                  className="motion-card group relative overflow-hidden rounded-3xl p-6 flex flex-col gap-4 anim-fadeUp"
                  style={{
                    background: CARD_BG,
                    border: `1px solid ${CARD_BORDER}`,
                    textDecoration: "none",
                    animationDelay: delay,
                  }}
                >
                  <div
                    aria-hidden
                    className="absolute inset-0 pointer-events-none mix-blend-overlay"
                    style={{ backgroundImage: NOISE_URL, backgroundSize: "240px 240px", opacity: 0.22 }}
                  />
                  <div
                    aria-hidden
                    className="absolute inset-0 pointer-events-none"
                    style={{
                      background: "radial-gradient(ellipse 60% 50% at 50% 110%, rgba(94,234,212,0.08), transparent 70%)",
                    }}
                  />

                  <div className="relative flex items-center gap-2 flex-wrap">
                    <span
                      className="inline-flex items-center font-sans text-[11px] rounded-full px-2.5 py-0.5"
                      style={
                        list.is_public
                          ? {
                              background: "rgba(94,234,212,0.10)",
                              color: TEAL,
                              border: "1px solid rgba(94,234,212,0.22)",
                            }
                          : {
                              background: "rgba(255,255,255,0.05)",
                              border: "1px solid rgba(255,255,255,0.10)",
                              color: "rgba(255,255,255,0.4)",
                            }
                      }
                    >
                      {list.is_public ? "public" : "private"}
                    </span>
                    <span
                      className="inline-flex items-center font-sans text-[11px] rounded-full px-2.5 py-0.5"
                      style={{
                        background: "rgba(255,255,255,0.05)",
                        border: "1px solid rgba(255,255,255,0.08)",
                        color: "rgba(255,255,255,0.4)",
                      }}
                    >
                      {itemCount} fix{itemCount !== 1 ? "es" : ""}
                    </span>
                  </div>

                  <h2
                    className="relative font-display group-hover:text-[#5EEAD4] transition-colors"
                    style={{
                      color: "#FFFFFF",
                      fontSize: 20,
                      fontWeight: 600,
                      letterSpacing: "-0.01em",
                      lineHeight: 1.18,
                    }}
                  >
                    {list.name}
                  </h2>

                  {list.description && (
                    <p
                      className="relative font-sans text-sm leading-relaxed"
                      style={{
                        color: "rgba(255,255,255,0.55)",
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                      }}
                    >
                      {list.description}
                    </p>
                  )}

                  <p className="relative font-sans text-xs mt-auto" style={{ color: "rgba(255,255,255,0.35)" }}>
                    Created {formatDate(list.created_at)}
                  </p>
                </Link>
              );
            })}
          </div>
        ) : (
          <div
            className="relative overflow-hidden rounded-3xl p-12 sm:p-16 text-center anim-fadeUp"
            style={{
              background: CARD_BG,
              border: `1px solid ${CARD_BORDER}`,
            }}
          >
            <div
              aria-hidden
              className="absolute inset-0 pointer-events-none mix-blend-overlay"
              style={{ backgroundImage: NOISE_URL, backgroundSize: "240px 240px", opacity: 0.22 }}
            />
            <div className="relative max-w-md mx-auto">
              <span
                className="inline-flex items-center font-sans text-xs rounded-full px-3 py-1 mb-6"
                style={{
                  background: "rgba(94,234,212,0.10)",
                  color: TEAL,
                  border: "1px solid rgba(94,234,212,0.22)",
                }}
              >
                empty
              </span>
              <h2
                className="font-display"
                style={{
                  color: "#FFFFFF",
                  fontSize: "clamp(24px, 5vw, 32px)",
                  letterSpacing: "-0.02em",
                  fontWeight: 600,
                }}
              >
                No lists yet.
              </h2>
              <p className="mt-3 mb-7 font-sans text-base" style={{ color: "rgba(255,255,255,0.55)" }}>
                Create one to start curating your fixations.
              </p>
              <Link
                href="/dashboard/lists/new"
                className="inline-flex items-center gap-2 font-sans text-sm font-semibold px-6 py-3.5 transition-all hover:opacity-95 hover:-translate-y-px active:scale-[0.98]"
                style={{
                  background: "#FFFFFF",
                  color: "#0A0A0A",
                  borderRadius: 999,
                  boxShadow: "0 8px 28px rgba(94,234,212,0.25)",
                }}
              >
                + New list
              </Link>
            </div>
          </div>
        )}
      </div>

      {/* Mobile FAB */}
      <Link
        href="/dashboard/lists/new"
        className="lg:hidden fixed flex items-center justify-center rounded-full transition-all hover:opacity-95 active:scale-95 anim-glowPulse"
        style={{
          bottom: "calc(5rem + 1rem + env(safe-area-inset-bottom))",
          right: "1rem",
          width: 56,
          height: 56,
          background: TEAL,
          color: "#0A1F1C",
          zIndex: 40,
          boxShadow: "0 4px 28px rgba(94,234,212,0.55)",
        }}
        aria-label="New list"
      >
        <Plus set="bold" size={24} primaryColor="currentColor" />
      </Link>
    </div>
  );
}
