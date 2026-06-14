"use client";
import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";

// Tasteful dark fallback shown before the video loads, while it loads,
// or permanently if the source fails. Prevents a black/empty box.
const FALLBACK_BG =
  "radial-gradient(130% 130% at 50% 0%, #1c1c1c 0%, #0a0a0a 55%, #000 100%)";

type Props = {
  src: string;
  /** Load immediately instead of waiting to scroll near the viewport (use for the hero). */
  eager?: boolean;
  /** Absolutely fill the parent (background video) instead of using an intrinsic aspect ratio. */
  fill?: boolean;
  /** CSS aspect-ratio for non-fill videos, e.g. "1 / 1" or "3 / 1". */
  aspectRatio?: string;
  ariaLabel: string;
  className?: string;
  style?: React.CSSProperties;
  radius?: number;
};

export function LandingVideo({
  src,
  eager = false,
  fill = false,
  aspectRatio,
  ariaLabel,
  className,
  style,
  radius = 16,
}: Props) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();
  const [inView, setInView] = useState(eager);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    if (eager || inView) return;
    const el = wrapRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          setInView(true);
          io.disconnect();
        }
      },
      { rootMargin: "300px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [eager, inView]);

  const shouldLoad = (eager || inView) && !failed;

  const wrapperStyle: React.CSSProperties = fill
    ? {
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        overflow: "hidden",
        background: FALLBACK_BG,
        ...style,
      }
    : {
        position: "relative",
        width: "100%",
        aspectRatio,
        overflow: "hidden",
        borderRadius: radius,
        background: FALLBACK_BG,
        ...style,
      };

  return (
    <div ref={wrapRef} className={className} style={wrapperStyle}>
      {shouldLoad && (
        <video
          src={src}
          // Reduced-motion users get a static first frame instead of looping motion.
          autoPlay={!reduceMotion}
          muted
          loop
          playsInline
          preload={eager ? "auto" : "metadata"}
          aria-label={ariaLabel}
          onError={() => setFailed(true)}
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
        />
      )}
    </div>
  );
}
