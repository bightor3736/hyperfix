"use client";

import { useRouter } from "next/navigation";
import { useRef } from "react";

export function SearchInput({ defaultValue }: { defaultValue: string }) {
  const router = useRouter();
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const value = e.target.value;
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      const params = new URLSearchParams();
      if (value.trim()) params.set("q", value.trim());
      router.push(`/search${value.trim() ? `?${params.toString()}` : ""}`);
    }, 300);
  }

  return (
    <input
      type="text"
      defaultValue={defaultValue}
      onChange={handleChange}
      autoFocus
      placeholder="search fixes, people…"
      className="w-full font-display"
      style={{
        background: "transparent",
        border: "none",
        borderBottom: "2px solid rgba(244,244,244,0.12)",
        outline: "none",
        fontSize: "clamp(24px, 5vw, 48px)",
        color: "#F4F4F4",
        padding: "12px 0",
        letterSpacing: "-0.02em",
        caretColor: "#A3E635",
        transition: "border-color 0.15s",
      }}
      onFocus={(e) => {
        (e.target as HTMLInputElement).style.borderBottomColor = "#A3E635";
      }}
      onBlur={(e) => {
        (e.target as HTMLInputElement).style.borderBottomColor = "rgba(244,244,244,0.12)";
      }}
    />
  );
}
