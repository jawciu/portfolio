"use client";

import { useRef, type ReactNode } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger);

/* TabHead — a Product-block sub-heading that behaves like the active tab in the
   Vector app: mono, resting grayish, lighting to full ink while its block sits
   in the reading band. Only what you're scrolled into has prominence.
   Reduced-motion → always lit. */
export function TabHead({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLHeadingElement>(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const st = ScrollTrigger.create({
          trigger: el.closest("[data-trace-node]") ?? el,
          start: "top 70%",
          end: "bottom 25%",
          onToggle: (self) => {
            el.dataset.lit = String(self.isActive);
          },
        });
        el.dataset.lit = String(st.isActive);
        return () => st.kill();
      });
      return () => mm.revert();
    },
    { scope: ref }
  );

  return (
    <h3
      ref={ref}
      data-lit="true"
      className="inline-block font-[family-name:var(--font-mono)] text-[24px] font-extrabold tracking-[0.04em] text-[var(--case-study-muted)] transition-colors duration-500 data-[lit=true]:text-[var(--case-study-ink)]"
    >
      {children}
    </h3>
  );
}
