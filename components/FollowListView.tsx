import Link from "next/link";
import { LogoLockup } from "@/components/Logo";

const NOISE_URL =
  "url(\"data:image/svg+xml;utf8,<svg viewBox='0 0 240 240' xmlns='http://www.w3.org/2000/svg'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 0.55 0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>\")";

export type FollowProfile = {
  username: string | null;
  display_name: string | null;
  avatar_url: string | null;
  bio: string | null;
};

function Initials({ name }: { name: string }) {
  const parts = name.trim().split(/\s+/);
  const letters =
    parts.length >= 2
      ? (parts[0][0] ?? "") + (parts[parts.length - 1][0] ?? "")
      : (name[0] ?? "");
  return (
    <div
      className="w-11 h-11 rounded-full flex items-center justify-center text-sm font-display font-medium shrink-0"
      style={{ background: "var(--accent)", color: "var(--accent)", border: "1px solid var(--accent-soft)" }}
    >
      {letters.toUpperCase()}
    </div>
  );
}

export function FollowListView({
  username,
  mode,
  profiles,
}: {
  username: string;
  mode: "followers" | "following";
  profiles: FollowProfile[];
}) {
  const title = mode === "followers" ? "Followers" : "Following";
  const emptyText =
    mode === "followers"
      ? "No followers yet."
      : "Not following anyone yet.";

  return (
    <div className="min-h-screen relative" style={{ background: "var(--bg)", color: "var(--ink)" }}>
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none mix-blend-overlay"
        style={{ backgroundImage: NOISE_URL, backgroundSize: "240px 240px", opacity: 0.08 }}
      />

      <nav
        className="sticky top-0 z-40 px-6 sm:px-10 py-5 flex items-center justify-between"
        style={{
          background: "rgba(7,7,8,0.78)",
          backdropFilter: "blur(20px)",
          borderBottom: "1px solid var(--line)",
        }}
      >
        <Link href="/" aria-label="Hyperfix home" className="transition-transform hover:scale-[1.02]">
          <LogoLockup size="sm" />
        </Link>
        <Link
          href={`/u/${username}`}
          className="motion-link font-sans text-sm transition-colors"
          style={{ color: "var(--ink-muted)" }}
        >
          ← @{username}
        </Link>
      </nav>

      <main className="relative max-w-2xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <div className="flex items-baseline gap-3 mb-6">
          <h1 className="text-2xl font-display font-medium">{title}</h1>
          <span className="font-mono text-sm" style={{ color: "var(--ink-muted)" }}>
            {profiles.length}
          </span>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          {(["followers", "following"] as const).map((tab) => (
            <Link
              key={tab}
              href={`/u/${username}/${tab}`}
              className="font-mono text-[11px] uppercase tracking-widest rounded-full px-3.5 py-1.5 transition-colors"
              style={
                tab === mode
                  ? { background: "var(--accent-soft)", border: "1px solid var(--accent-soft)", color: "var(--accent)" }
                  : { background: "transparent", border: "1px solid var(--line)", color: "var(--ink-muted)" }
              }
            >
              {tab}
            </Link>
          ))}
        </div>

        {profiles.length === 0 ? (
          <div
            className="rounded-2xl p-10 text-center"
            style={{ background: "var(--bg)", border: "1px solid var(--line)" }}
          >
            <p className="font-display text-lg" style={{ color: "var(--ink-muted)" }}>
              {emptyText}
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            {profiles.map((p) => {
              const name = p.display_name ?? p.username ?? "Anonymous";
              const inner = (
                <>
                  {p.avatar_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={p.avatar_url}
                      alt={name}
                      className="w-11 h-11 rounded-full object-cover shrink-0"
                      style={{ border: "1px solid var(--line)" }}
                    />
                  ) : (
                    <Initials name={name} />
                  )}
                  <div className="min-w-0 flex-1">
                    <p className="font-display font-medium text-base truncate group-hover:text-[var(--accent)] transition-colors">
                      {name}
                    </p>
                    {p.username && (
                      <p className="font-mono text-xs truncate" style={{ color: "#9A9A9A" }}>
                        @{p.username}
                      </p>
                    )}
                    {p.bio && (
                      <p className="font-sans text-xs mt-1 truncate" style={{ color: "var(--ink-muted)" }}>
                        {p.bio}
                      </p>
                    )}
                  </div>
                </>
              );
              return p.username ? (
                <Link
                  key={p.username}
                  href={`/u/${p.username}`}
                  className="group flex items-center gap-3 rounded-2xl p-4 transition-all hover:border-accent"
                  style={{ background: "var(--bg)", border: "1px solid var(--line)" }}
                >
                  {inner}
                </Link>
              ) : (
                <div
                  key={name}
                  className="flex items-center gap-3 rounded-2xl p-4"
                  style={{ background: "var(--bg)", border: "1px solid var(--line)" }}
                >
                  {inner}
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
