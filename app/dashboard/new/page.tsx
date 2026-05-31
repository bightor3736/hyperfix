import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { NewFixForm } from "./NewFixForm";
import { ArrowLeft } from "@/components/icons";

export const metadata = { title: "New Fix · Hyperfix" };

const NOISE_URL =
  "url(\"data:image/svg+xml;utf8,<svg viewBox='0 0 240 240' xmlns='http://www.w3.org/2000/svg'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 0.55 0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>\")";

export default async function NewFixPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  let isPro = false;
  let activeFixCount = 0;

  if (user) {
    const [profileResult, fixesResult] = await Promise.all([
      supabase.from("profiles").select("is_pro").eq("id", user.id).single(),
      supabase
        .from("fixes")
        .select("id", { count: "exact", head: true })
        .eq("user_id", user.id)
        .not("status", "in", '("Ended","Dormant")'),
    ]);

    isPro = profileResult.data?.is_pro ?? false;
    activeFixCount = fixesResult.count ?? 0;
  }

  return (
    <div className="min-h-screen px-4 sm:px-6 lg:px-8 pt-8 pb-16 relative" style={{ background: "var(--bg)" }}>
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none mix-blend-overlay"
        style={{ backgroundImage: NOISE_URL, backgroundSize: "240px 240px", opacity: 0.08 }}
      />
      <div className="relative max-w-2xl mx-auto">
        <Link
          href="/dashboard"
          className="motion-link inline-flex items-center gap-2 font-sans text-sm mb-8 transition-colors anim-fadeUp"
          style={{ color: "var(--ink-muted)" }}
        >
          <ArrowLeft set="light" size={18} primaryColor="currentColor" />
          My fixes
        </Link>

        <span
          className="inline-flex items-center font-sans text-xs rounded-full px-3 py-1 mb-5 anim-fadeUp delay-100"
          style={{
            background: "var(--accent-soft)",
            color: "var(--accent)",
            border: "1px solid var(--accent)",
          }}
        >
          new fix
        </span>
        <h1
          className="font-display mb-3 anim-fadeUp delay-200"
          style={{
            color: "var(--ink)",
            fontSize: "clamp(36px, 6vw, 56px)",
            letterSpacing: "-0.02em",
            fontWeight: 600,
            lineHeight: 1.05,
          }}
        >
          What are you
          <br />
          obsessed with?
        </h1>
        <p
          className="font-sans text-base mb-10 anim-fadeUp delay-300"
          style={{ color: "var(--ink-muted)" }}
        >
          Name it. Pick a category. Set the intensity. The counter starts the moment you hit save.
        </p>

        <div className="anim-fadeUp delay-400">
          <NewFixForm isPro={isPro} activeFixCount={activeFixCount} />
        </div>
      </div>
    </div>
  );
}
