import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { NewFixForm } from "./NewFixForm";

export const metadata = {
  title: "New Fix · Hyperfix",
};

export default async function NewFixPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

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
    <div className="min-h-screen px-4 sm:px-6 lg:px-8 pt-8 pb-16" style={{ background: "#0A0A0A" }}>
      <div className="max-w-2xl mx-auto">
        {/* Back */}
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 font-sans text-sm mb-8 transition-colors hover:text-accent"
          style={{ color: "rgba(244,244,244,0.4)" }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6" />
          </svg>
          My fixes
        </Link>

        {/* Header */}
        <h1
          className="font-display font-bold mb-2"
          style={{ color: "#F4F4F4", fontSize: "clamp(28px, 5vw, 42px)", letterSpacing: "-0.03em" }}
        >
          Log a new fix
        </h1>
        <p className="font-sans text-sm mb-10" style={{ color: "rgba(244,244,244,0.4)" }}>
          What are you unwell about?
        </p>

        <NewFixForm isPro={isPro} activeFixCount={activeFixCount} />
      </div>
    </div>
  );
}
