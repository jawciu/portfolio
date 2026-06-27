"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger);

/**
 * CountUp — rolls a stat from 0 up to its final value when it scrolls into view.
 *
 * Pass the SAME display string the stat would otherwise show (e.g. "89.4%", "14",
 * "1,200"); the prefix / numeric value / suffix and the decimal-place + thousands
 * formatting are parsed from it, so the rolling value always matches the final
 * format. SSR / no-JS / reduced-motion render the final value immediately; otherwise
 * it resets to 0 before paint and eases up to the target once on scroll-in.
 */
export function CountUp({
  value,
  className = "",
  duration = 1.6,
}: {
  value: string;
  className?: string;
  duration?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);

  // split "prefix 1,234.5 suffix" → prefix, numeric core, suffix
  const m = value.match(/^(\D*)([\d.,]+)(.*)$/);
  const prefix = m?.[1] ?? "";
  const core = m?.[2] ?? "";
  const suffix = m?.[3] ?? "";
  const target = parseFloat(core.replace(/,/g, ""));
  const decimals = core.includes(".") ? core.split(".")[1].length : 0;
  const grouped = core.includes(",");

  const format = (v: number) => {
    const s = grouped
      ? v.toLocaleString("en-US", {
          minimumFractionDigits: decimals,
          maximumFractionDigits: decimals,
        })
      : v.toFixed(decimals);
    return `${prefix}${s}${suffix}`;
  };

  useGSAP(
    () => {
      const el = ref.current;
      if (!el || !Number.isFinite(target)) return;
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const o = { v: 0 };
        el.textContent = format(0); // reset before paint so it starts from 0
        gsap.to(o, {
          v: target,
          duration,
          ease: "power2.out",
          onUpdate: () => {
            el.textContent = format(o.v);
          },
          scrollTrigger: { trigger: el, start: "top 85%", once: true },
        });
      });
      return () => mm.revert();
    },
    { scope: ref }
  );

  // initial / SSR / reduced-motion text = the final value
  return (
    <span ref={ref} className={className}>
      {Number.isFinite(target) ? format(target) : value}
    </span>
  );
}
