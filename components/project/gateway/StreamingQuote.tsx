"use client";

import { useEffect, useRef, type Ref } from "react";
import { usePrefersReducedMotion } from "@/lib/usePrefersReducedMotion";

/**
 * StreamingQuote — types a quote in character-by-character as it scrolls into
 * view (like the homepage's streaming text). Unlike a real typewriter (char-
 * APPEND, which reflows), every character occupies its FINAL position and just
 * fades in sequence (CSS opacity, staggered by per-char transition-delay), so
 * there's no blur and no reflow — safe inside fixed / centred speech bubbles and
 * post-its.
 *
 * DOM-driven so there's no React state: the chars render VISIBLE (so SSR / no-JS
 * and reduced-motion all show the full quote), then — only after mount — the
 * effect arms them (instant hide, off-screen so no flash) and an
 * IntersectionObserver flips `data-stream` to "play" to run the cascade. Styling
 * lives in theme.css (`[data-stream] .cs-char`). The full text is announced once
 * (sr-only); the animated copy is aria-hidden.
 */
export function StreamingQuote({
  children,
  className = "",
  as = "p",
  /** seconds between consecutive characters (~100 cps at 0.01) */
  step = 0.01,
}: {
  children: string;
  className?: string;
  as?: "p" | "blockquote";
  step?: number;
}) {
  const ref = useRef<HTMLElement | null>(null);
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    // Reduced motion (or the hydration commit resolving to it) → ensure the words
    // are shown and never armed.
    if (reduced) {
      delete el.dataset.stream;
      return;
    }
    // Arm post-mount (SSR / no-JS already showed the words); quotes sit below the
    // fold, so the instant hide never flashes.
    el.dataset.stream = "armed";
    // Trigger on a visibility ratio (not a negative bottom rootMargin) so quotes
    // near the very END of the page — which can never scroll above a bottom inset
    // — still fire once they're a quarter in view.
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.intersectionRatio >= 0.25) {
          el.dataset.stream = "play";
          io.disconnect();
        }
      },
      { threshold: [0, 0.25, 0.5] }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [reduced]);

  const chars = [...children];
  const inner = (
    <>
      {/* full quote for assistive tech; the streamed copy is decorative */}
      <span className="sr-only">{children}</span>
      <span aria-hidden>
        {chars.map((ch, i) => (
          <span
            key={i}
            className="cs-char"
            style={{ transitionDelay: `${i * step}s` }}
          >
            {ch}
          </span>
        ))}
      </span>
    </>
  );

  return as === "blockquote" ? (
    <blockquote ref={ref as Ref<HTMLQuoteElement>} className={className}>
      {inner}
    </blockquote>
  ) : (
    <p ref={ref as Ref<HTMLParagraphElement>} className={className}>
      {inner}
    </p>
  );
}
