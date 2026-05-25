"use client";
import { useTransition } from "react";

type Props = {
  label?: string;
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
};

export function ProCheckoutButton({ label = "Get Pro", className, style, children }: Props) {
  const [pending, startTransition] = useTransition();
  function handleClick() {
    startTransition(async () => {
      try {
        const res = await fetch("/api/stripe/checkout", { method: "POST" });
        const data = await res.json();
        if (res.ok && data.url) {
          window.location.href = data.url;
        } else if (res.status === 401) {
          window.location.href = "/auth/login?next=/pricing";
        } else if (res.status === 503) {
          // Stripe not configured yet — graceful fallback
          window.location.href = "/pricing";
        } else {
          alert(data.error ?? "Could not start checkout. Try again.");
        }
      } catch {
        window.location.href = "/pricing";
      }
    });
  }
  return (
    <button
      onClick={handleClick}
      disabled={pending}
      className={className}
      style={style}
    >
      {pending ? "Loading…" : (children ?? label)}
    </button>
  );
}
