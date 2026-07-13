"use client";

import { useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger);

/* CircuitTrace — a thin lilac trace that draws itself down the left edge of a
   Product subsection as you scroll, lighting a node as the tip passes each
   block (elements marked data-trace-node). The circuit-board running-light from
   the moodboard, at case-study scale.

   Drop it inside a `relative` room wrapper; it measures its PARENT for height
   and node positions (remeasured on every ScrollTrigger refresh, so late-settling
   layout is fine). md+ only, reduced-motion → fully drawn with all nodes lit. */
export function CircuitTrace() {
  const ref = useRef<HTMLDivElement>(null);
  const [nodes, setNodes] = useState<number[]>([]);

  useGSAP(
    () => {
      const rail = ref.current;
      const room = rail?.parentElement;
      if (!rail || !room) return;

      const measure = () => {
        const top = room.getBoundingClientRect().top;
        setNodes(
          Array.from(room.querySelectorAll<HTMLElement>("[data-trace-node]")).map((n) => {
            const r = n.getBoundingClientRect();
            return r.top - top + r.height / 2;
          })
        );
      };
      measure();
      ScrollTrigger.addEventListener("refresh", measure);

      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference) and (min-width: 768px)", () => {
        const line = rail.querySelector<HTMLElement>("[data-trace-line]");
        const tip = rail.querySelector<HTMLElement>("[data-trace-tip]");
        if (!line || !tip) return;

        const apply = (progress: number) => {
          const h = room.offsetHeight;
          const tipY = progress * h;
          gsap.set(line, { scaleY: progress });
          gsap.set(tip, {
            y: tipY,
            autoAlpha: progress > 0.001 && progress < 0.999 ? 1 : 0,
          });
          rail.querySelectorAll<HTMLElement>("[data-trace-dot]").forEach((d) => {
            d.dataset.lit = tipY >= parseFloat(d.dataset.y || "0") ? "true" : "false";
          });
        };

        gsap.set(line, { scaleY: 0, transformOrigin: "top" });
        const st = ScrollTrigger.create({
          trigger: room,
          start: "top 70%",
          end: "bottom 70%",
          scrub: true,
          onUpdate: (self) => apply(self.progress),
        });
        apply(st.progress);

        return () => st.kill();
      });

      return () => {
        ScrollTrigger.removeEventListener("refresh", measure);
        mm.revert();
      };
    },
    { scope: ref }
  );

  return (
    <div
      ref={ref}
      aria-hidden
      className="pointer-events-none absolute inset-y-0 left-8 hidden w-px md:block"
    >
      {/* unlit track */}
      <div className="absolute inset-0 w-px bg-[var(--case-study-line)]" />
      {/* the drawn (lit) trace — the AI gradient, lilac fading to peach at the
          tip (the gradient scales with the line, so the leading edge is always
          the peachy end) */}
      <div
        data-trace-line
        className="absolute inset-0 w-px bg-[linear-gradient(to_bottom,var(--ai-from),var(--ai-to))] opacity-80"
      />
      {/* running-light tip — peach, to match the gradient's leading end */}
      <div
        data-trace-tip
        className="absolute -top-[2.5px] -left-[2px] size-[5px] rounded-full bg-[#ffb59a] opacity-0 shadow-[0_0_10px_2px_rgba(255,156,125,0.55)]"
      />
      {/* one node per block */}
      {nodes.map((y) => (
        <div
          key={y}
          data-trace-dot
          data-y={y}
          data-lit="true"
          style={{ top: y - 3.5 }}
          className="absolute -left-[3px] size-[7px] rounded-full border border-[var(--case-study-line)] bg-[var(--case-study-bg)] transition-all duration-500 data-[lit=true]:border-[#c098ff] data-[lit=true]:bg-[#c098ff] data-[lit=true]:shadow-[0_0_12px_rgba(192,152,255,0.6)]"
        />
      ))}
    </div>
  );
}
