import type { Metadata } from "next";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Unsubscribe · Hyperfix",
  description: "Manage your Hyperfix email preferences.",
  robots: { index: false, follow: false },
};

export default async function UnsubscribePage({
  searchParams,
}: {
  searchParams: Promise<{ done?: string; error?: string }>;
}) {
  const { done, error } = await searchParams;

  return (
    <>
      <Nav />
      <main className="min-h-screen flex items-center justify-center px-6 py-24" style={{ background: "#0A0A0A" }}>
        <div className="max-w-md w-full text-center">
          <span
            className="inline-flex items-center font-mono text-[10px] uppercase tracking-widest rounded-full px-3 py-1 mb-8"
            style={{ background: "rgba(244,244,244,0.07)", color: "rgba(244,244,244,0.4)", border: "1px solid rgba(244,244,244,0.1)" }}
          >
            email preferences
          </span>

          <h1
            className="font-display font-bold leading-none mb-6"
            style={{ color: "#F4F4F4", fontSize: "clamp(36px, 6vw, 56px)", letterSpacing: "-0.03em" }}
          >
            unsubscribe
          </h1>

          {done === "1" ? (
            <div
              className="rounded-2xl px-6 py-5 mb-8 text-left"
              style={{ background: "rgba(168,85,247,0.07)", border: "1px solid rgba(168,85,247,0.2)" }}
            >
              <p className="font-mono text-[11px] uppercase tracking-widest mb-1" style={{ color: "#A855F7" }}>done</p>
              <p className="font-sans text-sm" style={{ color: "rgba(244,244,244,0.6)" }}>
                You've been removed from our email list. If you signed up with an account, you can manage notification preferences in settings.
              </p>
            </div>
          ) : (
            <>
              {error === "invalid" && (
                <p className="font-mono text-[11px] uppercase tracking-widest mb-6" style={{ color: "#ef4444" }}>
                  that doesn't look like a valid email — try again.
                </p>
              )}

              <p className="font-sans text-base leading-relaxed mb-10" style={{ color: "rgba(244,244,244,0.5)" }}>
                Enter your email below and we'll remove you from all marketing and notification emails within 48 hours.
              </p>

              <p className="font-sans text-sm mb-10" style={{ color: "rgba(244,244,244,0.35)" }}>
                If you have an account, you can also manage notification settings in{" "}
                <a
                  href="/dashboard/settings"
                  className="underline transition-colors hover:text-[rgba(244,244,244,0.7)]"
                  style={{ color: "rgba(244,244,244,0.45)" }}
                >
                  Dashboard → Settings
                </a>
                .
              </p>

              <UnsubscribeForm />
            </>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}

function UnsubscribeForm() {
  return (
    <form
      action="/api/unsubscribe"
      method="POST"
      className="flex flex-col gap-3 max-w-sm mx-auto"
    >
      <input
        type="email"
        name="email"
        required
        placeholder="your@email.com"
        className="w-full px-4 py-3.5 font-mono text-sm focus:outline-none focus:ring-1 transition-colors"
        style={{
          background: "#1C1C1E",
          border: "1px solid rgba(244,244,244,0.1)",
          borderRadius: 12,
          color: "rgba(244,244,244,0.9)",
        }}
      />
      <button
        type="submit"
        className="w-full px-6 py-3.5 font-mono text-[11px] uppercase tracking-widest font-bold transition-all hover:opacity-90 active:scale-[0.98]"
        style={{
          background: "rgba(244,244,244,0.08)",
          border: "1px solid rgba(244,244,244,0.15)",
          borderRadius: 999,
          color: "rgba(244,244,244,0.7)",
        }}
      >
        remove me from all emails
      </button>
    </form>
  );
}
