import type { Metadata } from "next";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Privacy Policy — Hyperfix",
  description: "What Hyperfix collects, how we use it, and how to delete it.",
  alternates: { canonical: "https://hyperfix.app/privacy" },
  robots: { index: true, follow: false },
};

const sections = [
  {
    h: "What we collect",
    body: "When you create an account we store your email address, chosen username, and any content you add (fix titles, notes, eulogies). We also store timestamps and basic usage data (e.g. when a fix was created or ended). We don't collect your real name, location, or IP address beyond what Supabase logs for security.",
  },
  {
    h: "How we use it",
    body: "Your email is used to send account-related emails (confirmations, password resets) and, if you opt in, product updates and notification digests. We'll never email you more than once a week and every email has a one-click unsubscribe. We don't use your email for advertising.",
  },
  {
    h: "What we don't do",
    body: "We don't sell your data. We don't share it with third parties for advertising. We don't use your fixes, notes, or any personal content to train AI models. We use Vercel Analytics (privacy-friendly, no cookies, no fingerprinting) to understand general usage patterns.",
  },
  {
    h: "Where it's stored",
    body: "Your account data is stored in Supabase (supabase.com). Supabase hosts in the EU by default. Their privacy policy is at supabase.com/privacy. Payments (Pro tier) are handled by Stripe — we never see or store your card details.",
  },
  {
    h: "Public vs private",
    body: "Fixes you mark as public are visible to other logged-in users on the Explore page and on your public profile. Fixes you mark as private are only visible to you. You can change the visibility of any fix at any time.",
  },
  {
    h: "How to delete your data",
    body: "You can delete your account from Settings → Account → Delete account. This permanently removes your profile and all associated fixes. If you need help, email privacy@hyperfix.app and we'll action it within 48 hours.",
  },
  {
    h: "Cookies",
    body: "We use a single functional session cookie to keep you logged in. No tracking cookies, no ad pixels, no third-party cookies. Vercel Analytics is cookieless.",
  },
  {
    h: "Changes to this policy",
    body: "If we change what we collect or how we use it, we'll update this page, note the date, and email you if the change is material.",
  },
];

export default function PrivacyPage() {
  return (
    <main id="main-content" className="relative z-10 text-ink" style={{ background: "var(--bg)" }}>
      <Nav />

      <section className="px-6 sm:px-10 pt-16 sm:pt-20 pb-6 border-b" style={{ borderColor: "var(--line)" }}>
        <div className="max-w-3xl mx-auto">
          <p className="font-mono text-[10px] uppercase tracking-widest mb-4" style={{ color: "var(--accent)" }}>
            legal
          </p>
          <h1 className="font-display" style={{ color: "var(--ink)", fontSize: "clamp(32px, 5vw, 52px)", lineHeight: 1.02, letterSpacing: "-0.02em", fontWeight: 600 }}>
            Privacy Policy
          </h1>
          <p className="mt-5 font-mono text-[11px] uppercase tracking-widest tabular-nums" style={{ color: "var(--ink-muted)" }}>
            Effective: May 2026
          </p>
        </div>
      </section>

      <section className="px-6 sm:px-10 py-16 sm:py-20">
        <div className="max-w-3xl mx-auto divide-y divide-[var(--line)]">
          {sections.map((s) => (
            <div key={s.h} className="py-8 grid sm:grid-cols-3 gap-4 sm:gap-10">
              <h2 className="font-display text-lg tracking-tight text-ink sm:pt-1">
                {s.h}
              </h2>
              <p className="sm:col-span-2 font-sans text-base text-[var(--ink-muted)] leading-relaxed">
                {s.body}
              </p>
            </div>
          ))}
        </div>
      </section>

      <Footer />
    </main>
  );
}
