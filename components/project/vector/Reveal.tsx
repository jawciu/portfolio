"use client";

import { useRef, type ReactNode } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger);

/**
 * Reveal — the Cog case study's scroll-in motion primitive.
 *
 * Motion concept: "coming into focus". The case study is about research turning
 * vague needs into clarity, so content resolves from soft → crisp as it enters:
 * a small rise + a subtle de-blur + fade, settling on an expo ease. Echoes the
 * site's diffused-glass aesthetic + the hero's glass reveal.
 *
 * Two modes:
 *  - default: animates the wrapper as one block (wrap a heading, a callout…).
 *  - `stagger`: animates the wrapper's DIRECT children in sequence — so pass the
 *    grid/flex classes to Reveal itself and let its cells be the children, and
 *    the cluster assembles rather than popping in as a block.
 *
 * Reduced-motion safe (does nothing → content sits in its natural state) and
 * runs in a layout effect via useGSAP, so off-screen content is hidden before
 * paint (no flash). Plays once.
 */
type RevealProps = {
  children: ReactNode;
  className?: string;
  /** rise distance in px (default 28) */
  y?: number;
  /** initial blur in px — the "coming into focus" cue (default 6; pass 0 to disable) */
  blur?: number;
  /** stagger the wrapper's direct children. `true` = 0.09s, or pass seconds. */
  stagger?: number | boolean;
  /** extra delay in seconds */
  delay?: number;
  /** ScrollTrigger start (default "top 85%") */
  start?: string;
};

export function Reveal({
  children,
  className = "",
  y = 28,
  blur = 6,
  stagger = false,
  delay = 0,
  start = "top 85%",
}: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const targets: gsap.TweenTarget = stagger
          ? gsap.utils.toArray(el.children)
          : el;
        const each = typeof stagger === "number" ? stagger : stagger ? 0.09 : 0;

        gsap.from(targets, {
          autoAlpha: 0,
          y,
          filter: blur ? `blur(${blur}px)` : "none",
          duration: 1,
          ease: "expo.out",
          delay,
          stagger: each,
          scrollTrigger: { trigger: el, start, once: true },
        });
      });

      return () => mm.revert();
    },
    { scope: ref }
  );

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
