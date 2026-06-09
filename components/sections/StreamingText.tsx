"use client";

import { useEffect, useState } from "react";
import { usePrefersReducedMotion } from "@/lib/usePrefersReducedMotion";

// Reveals text as if it's being streamed in, fast. Driven by requestAnimationFrame
// against elapsed time (chars-per-second) rather than a per-char setTimeout, so the
// pace is framerate-independent and stays smooth. Starts when `active` flips true
// (wired to useInView in About). Reduced motion -> full text immediately.
export function StreamingText({
  text,
  active,
  cps = 300,
  className = "",
}: {
  text: string;
  active: boolean;
  cps?: number;
  className?: string;
}) {
  const reduced = usePrefersReducedMotion();
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!active || reduced) return;
    let raf = 0;
    let start = 0;
    const tick = (t: number) => {
      if (!start) start = t;
      const n = Math.min(text.length, Math.floor(((t - start) / 1000) * cps));
      setCount(n);
      if (n < text.length) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [active, reduced, text, cps]);

  // Reduced motion (or any non-animated path) shows the full text without a
  // synchronous setState in the effect.
  const total = reduced ? text.length : count;
  const done = total >= text.length;

  return (
    <p className={className}>
      {/* Full text for assistive tech; the streamed copy is decorative. */}
      <span className="sr-only">{text}</span>
      <span aria-hidden>{text.slice(0, total)}</span>
      {active && !reduced && !done && (
        <span
          aria-hidden
          className="ml-[0.06em] inline-block h-[0.95em] w-[0.07em] -mb-[0.08em] bg-fg/80 align-baseline"
        />
      )}
    </p>
  );
}
