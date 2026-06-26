"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

/**
 * Pins the case-study hero like home's fixed WebGL hero — but the hero is TALLER
 * than the viewport, so pinning it at top:0 would hide its bottom (the phone/tablet
 * mockups). Instead we pin it at `top: -(heroHeight - viewportHeight)`: the hero
 * scrolls UP just enough to bring the mockups into FULL view, then sticks showing
 * them, and the glass content plate below rises up over it. The offset is measured
 * (and re-measured on resize) because it depends on the live viewport height.
 *
 * When the hero is SHORTER than the viewport (very tall windows) the offset clamps
 * to 0 → a plain sticky-top pin, since everything already fits.
 */
export function StickyHero({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const [top, setTop] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const recalc = () => setTop(Math.min(0, window.innerHeight - el.offsetHeight));
    recalc();
    const ro = new ResizeObserver(recalc);
    ro.observe(el);
    window.addEventListener("resize", recalc);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", recalc);
    };
  }, []);

  return (
    <div ref={ref} data-cog="Hero" className="sticky z-0" style={{ top }}>
      {children}
    </div>
  );
}
