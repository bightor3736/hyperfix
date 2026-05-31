import { createClient } from "@/lib/supabase/server";
import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { CardEditor } from "@/components/CardEditor";
import { LogoLockup } from "@/components/Logo";

const TEAL = "var(--accent)";
const CARD_BORDER = "var(--line)";

export default async function CustomizeCardPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/auth/login");

  // Query without card_style first (it may not exist if the migration hasn't been run yet)
  const { data: fix } = await supabase
    .from("fixes")
    .select("id, user_id, title, banner_url")
    .eq("id", id)
    .single();

  if (!fix || fix.user_id !== user.id) notFound();

  // Try to load card_style separately — non-fatal if the column doesn't exist
  let cardStyle: "paper" | "dark" | "minimal" | "photo" | null = null;
  try {
    const { data: styleRow } = await supabase
      .from("fixes")
      .select("card_style")
      .eq("id", id)
      .single();
    if (styleRow && "card_style" in styleRow) {
      cardStyle = (styleRow.card_style as "paper" | "dark" | "minimal" | "photo" | null) ?? null;
    }
  } catch {
    cardStyle = null;
  }

  return (
    <div className="min-h-screen" style={{ background: "var(--bg)", color: "var(--ink)" }}>
      <nav
        className="sticky top-0 z-40 px-6 sm:px-10 py-5 flex items-center justify-between"
        style={{
          background: "rgba(7,7,8,0.78)",
          backdropFilter: "blur(20px)",
          borderBottom: `1px solid ${CARD_BORDER}`,
        }}
      >
        <Link href="/" aria-label="Hyperfix home" className="transition-transform hover:scale-[1.02]">
          <LogoLockup size="sm" />
        </Link>
        <Link
          href={`/dashboard/fix/${id}`}
          className="font-sans text-sm transition-colors"
          style={{ color: "var(--ink-muted)" }}
        >
          ← back to fix
        </Link>
      </nav>

      <main className="relative max-w-5xl mx-auto px-4 sm:px-6 pt-8 pb-16">
        <div className="mb-8">
          <p className="font-mono text-[10px] uppercase tracking-widest mb-2" style={{ color: TEAL }}>
            customize your share card
          </p>
          <h1
            className="font-display"
            style={{
              fontSize: "clamp(32px, 5vw, 48px)",
              fontWeight: 600,
              letterSpacing: "-0.02em",
              lineHeight: 1.02,
              color: "var(--ink)",
            }}
          >
            {fix.title}
          </h1>
          <p className="font-sans text-sm mt-2 max-w-xl" style={{ color: "var(--ink-muted)" }}>
            Pick a template, drop in a banner image, download the 1080×1920 PNG. Post it to Stories.
          </p>
        </div>

        <CardEditor
          fixId={id}
          userId={user.id}
          initialBannerUrl={fix.banner_url ?? null}
          initialCardStyle={cardStyle}
          fixTitle={fix.title}
        />
      </main>
    </div>
  );
}
