"use client";

import { useRef, type ReactNode } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger);

/**
 * Parallax — scroll-scrubbed vertical drift for imagery.
 *
 * Wrap an image/cluster; it travels from +speed → −speed as it transits the
 * viewport, so it drifts at a slightly different rate than the text around it
 * (depth). Give neighbouring elements different `speed` values (and signs) for a
 * playful float. Reduced-motion → no transform. Apply to elements NOT also driven
 * by Reveal's entrance (use it on the inner <img>, Reveal on the outer block) so
 * the two transforms don't fight.
 */
export function Parallax({
  children,
  className = "",
  /** px of travel; positive drifts up (feels faster), negative drifts down (lags) */
  speed = 50,
  /** set false to disable the drift on phones (<640px) — the offset otherwise
      distorts the carefully-tuned mobile whitespace around the image */
  mobile = true,
}: {
  children: ReactNode;
  className?: string;
  speed?: number;
  mobile?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;
      const mm = gsap.matchMedia();
      const query = mobile
        ? "(prefers-reduced-motion: no-preference)"
        : "(prefers-reduced-motion: no-preference) and (min-width: 640px)";
      mm.add(query, () => {
        gsap.fromTo(
          el,
          { y: speed },
          {
            y: -speed,
            ease: "none",
            scrollTrigger: {
              trigger: el,
              start: "top bottom",
              end: "bottom top",
              scrub: true,
            },
          }
        );
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
