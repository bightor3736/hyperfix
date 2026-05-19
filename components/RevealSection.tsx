"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

export function RevealSection({
  children,
  className = "",
  delay = 0,
  threshold = 0.12,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  threshold?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setMounted(true);
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setVisible(true), delay);
          observer.disconnect();
        }
      },
      { threshold }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [delay, threshold]);

  return (
    <div
      ref={ref}
      className={cn(
        "transition-all duration-700 ease-out",
        mounted && !visible && "opacity-0 translate-y-5",
        mounted && visible && "opacity-100 translate-y-0",
        className
      )}
    >
      {children}
    </div>
  );
}
