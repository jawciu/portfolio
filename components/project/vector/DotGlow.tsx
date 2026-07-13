"use client";

import { useEffect, useRef } from "react";

/* DotGlow — a cursor-following highlight for the Product subsection textures.
   Sits as an absolute overlay on top of the base texture: the SAME 22px pattern
   (dots or grid, matching the room) drawn in the lilac accent, masked to a circle
   around the pointer, so the texture near the cursor lights up and falls off
   radially — the ground itself never shines. Echoes the homepage hero's
   hover-unmask. The highlight LAGS the cursor (lerped in a rAF loop) so it feels
   like dragging a light across the board rather than a hard spotlight. Mouse/pen
   only, pointer-events-none, and it writes CSS vars straight onto the node so
   tracking never re-renders React. */

/* lit versions of the SubSection textures — same geometry, lilac ink */
const LIT_PATTERNS = {
  dots: "radial-gradient(rgba(211,181,255,0.42) 1px, transparent 1.4px)",
  grid: "linear-gradient(rgba(211,181,255,0.26) 1px, transparent 1px), linear-gradient(90deg, rgba(211,181,255,0.26) 1px, transparent 1px)",
} as const;

export function DotGlow({ pattern = "dots" }: { pattern?: keyof typeof LIT_PATTERNS }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    const parent = el?.parentElement;
    if (!el || !parent) return;

    const target = { x: -9999, y: -9999 };
    const pos = { x: -9999, y: -9999 };
    let raf = 0;

    /* drag factor: lower = heavier lag */
    const EASE = 0.08;

    const tick = () => {
      pos.x += (target.x - pos.x) * EASE;
      pos.y += (target.y - pos.y) * EASE;
      el.style.setProperty("--mx", `${pos.x}px`);
      el.style.setProperty("--my", `${pos.y}px`);
      if (Math.abs(target.x - pos.x) > 0.3 || Math.abs(target.y - pos.y) > 0.3) {
        raf = requestAnimationFrame(tick);
      } else {
        raf = 0;
      }
    };

    const move = (e: PointerEvent) => {
      if (e.pointerType === "touch") return;
      const r = parent.getBoundingClientRect();
      target.x = e.clientX - r.left;
      target.y = e.clientY - r.top;
      /* first entry: snap instead of sweeping in from off-screen */
      if (pos.x < -999) {
        pos.x = target.x;
        pos.y = target.y;
      }
      el.style.opacity = "1";
      if (!raf) raf = requestAnimationFrame(tick);
    };
    const leave = () => {
      el.style.opacity = "0";
    };

    parent.addEventListener("pointermove", move);
    parent.addEventListener("pointerleave", leave);
    return () => {
      parent.removeEventListener("pointermove", move);
      parent.removeEventListener("pointerleave", leave);
      cancelAnimationFrame(raf);
    };
  }, []);

  const mask =
    "radial-gradient(280px circle at var(--mx, -9999px) var(--my, -9999px), black 0%, rgba(0,0,0,0.35) 55%, transparent 80%)";

  return (
    <div
      ref={ref}
      aria-hidden
      className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500"
      style={{
        /* ONLY the lit pattern — no surface halo, so the ground never shines,
           just the texture getting lighter near the cursor */
        backgroundImage: LIT_PATTERNS[pattern],
        backgroundSize: "22px 22px",
        maskImage: mask,
        WebkitMaskImage: mask,
      }}
    />
  );
}
