"use client";

import { useEffect, useRef, useState } from "react";

// Fires once when an element scrolls into view — used to kick off the About
// streaming text. IntersectionObserver reads the element's real layout position,
// which Lenis moves via native scrollTop (not a transform), so this stays in sync
// with smooth scroll without the Motion-whileInView/Lenis conflict the
// scroll-choreography skill warns about.
export function useInView<T extends Element>(threshold = 0.3, once = true) {
  const ref = useRef<T>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          if (once) obs.disconnect();
        } else if (!once) {
          setInView(false);
        }
      },
      { threshold },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold, once]);

  return { ref, inView } as const;
}
