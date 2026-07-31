"use client";

// SkillsGalaxy — homepage section: the skills knowledge graph as a galaxy,
// enclosed in a window frame between /highlights and /toolkit.
//
// Deliberately self-contained (own data via lib/galaxyData, own canvas, no
// coupling to neighbouring sections) so it can be lifted to another spot or
// its own route by moving the single <SkillsGalaxy /> mount.
//
// The window frame is the scroll-hijack gate: full OrbitControls (wheel zoom
// included) only engage after a click inside the frame. While active, Lenis
// is stopped so the wheel belongs to the galaxy; Esc, clicking outside, or
// scrolling the section away hands the page back. The canvas frameloop stops
// whenever the section is off-screen — the WebGL hero at the top of the page
// keeps its GPU budget.

import dynamic from "next/dynamic";
import { useCallback, useEffect, useRef, useState } from "react";
import { getLenis } from "@/components/SmoothScroll";
import { GalaxyTuner } from "./galaxy/GalaxyTuner";
import { useGPUTier } from "@/lib/useGPUTier";
import { usePrefersReducedMotion } from "@/lib/usePrefersReducedMotion";
import { GALAXY_NODES, GALAXY_EDGES } from "@/lib/galaxyData";

const GalaxyCanvas = dynamic(() => import("./galaxy/GalaxyScene"), {
  ssr: false,
  loading: () => (
    <div className="flex h-full w-full items-center justify-center">
      <p className="font-mono text-[11px] tracking-[0.2em] text-fg/40">initialising starfield…</p>
    </div>
  ),
});

export function SkillsGalaxy() {
  const frameRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(false);
  const [visible, setVisible] = useState(false);
  const reduced = usePrefersReducedMotion();
  const tier = useGPUTier();

  const deactivate = useCallback(() => {
    setActive(false);
    getLenis()?.start();
  }, []);

  const activate = useCallback(() => {
    setActive(true);
    getLenis()?.stop();
  }, []);

  // Label clicks stop native propagation (they'd corrupt R3F's pointer math),
  // so they signal activation explicitly instead of bubbling to the frame.
  useEffect(() => {
    const fn = () => activate();
    window.addEventListener("galaxy:activate", fn);
    return () => window.removeEventListener("galaxy:activate", fn);
  }, [activate]);

  // Esc, click outside the frame, or a wheel outside it → release the page.
  useEffect(() => {
    if (!active) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") deactivate(); };
    const onPointerDown = (e: PointerEvent) => {
      if (frameRef.current && !frameRef.current.contains(e.target as Node)) deactivate();
    };
    const onWheel = (e: WheelEvent) => {
      if (frameRef.current && !frameRef.current.contains(e.target as Node)) deactivate();
    };
    window.addEventListener("keydown", onKey);
    window.addEventListener("pointerdown", onPointerDown);
    window.addEventListener("wheel", onWheel, { passive: true });
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("wheel", onWheel);
    };
  }, [active, deactivate]);

  // Pause the frameloop off-screen; also drop activation when scrolled away.
  useEffect(() => {
    const el = frameRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        setVisible(entry.isIntersecting);
        if (!entry.isIntersecting) deactivate();
      },
      { threshold: 0.05 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [deactivate]);

  // Never leave the page scroll-locked if the section unmounts mid-activation.
  useEffect(() => () => { getLenis()?.start(); }, []);

  return (
    <section
      aria-labelledby="skills-galaxy-label"
      className="px-8 pb-16 md:px-12 md:pb-28"
    >
      <div className="mx-auto w-full max-w-7xl 2xl:max-w-[88rem]">
        <p
          id="skills-galaxy-label"
          className="pl-2 font-mono text-xs md:text-sm tracking-[0.2em] text-fg/70"
        >
          /skills
        </p>

        <div
          ref={frameRef}
          onClick={() => { if (!active) activate(); }}
          className={`relative mt-9 overflow-hidden rounded-2xl border bg-[#070709] transition-[border-color,box-shadow] duration-500 md:mt-12 ${
            active
              ? "border-white/25 shadow-[0_0_60px_-12px_rgba(188,215,255,0.25)]"
              : "border-white/10 cursor-pointer"
          }`}
          style={{ height: "min(78vh, 860px)", minHeight: 460 }}
        >
          {/* window chrome */}
          <div className="pointer-events-none absolute inset-x-0 top-0 z-20 flex items-center justify-between border-b border-white/[0.06] bg-[rgba(7,7,9,0.6)] px-4 py-2.5 backdrop-blur-sm">
            <p className="font-mono text-[10px] tracking-[0.18em] text-fg/45 md:text-[11px]">
              ~/skills-galaxy · {GALAXY_NODES.length} stars · {GALAXY_EDGES.length} links
            </p>
            <p className="font-mono text-[10px] tracking-[0.18em] text-fg/45 md:text-[11px]">
              {active ? "drag to orbit · scroll to zoom · esc to exit" : "click a star to explore"}
            </p>
          </div>

          <GalaxyCanvas active={active} visible={visible} reduced={reduced} tier={tier} />

          {/* dev-only choreography tuning panel — never ships */}
          {process.env.NODE_ENV !== "production" && <GalaxyTuner />}

          {/* label fade-in lives here so the section stays fully self-contained */}
          {/* only a `from` keyframe: it eases up to each label's own inline
              opacity (neighbours sit at 0.62) instead of forcing 1 */}
          <style>{`@keyframes galaxy-label-in { from { opacity: 0 } }`}</style>
        </div>
      </div>
    </section>
  );
}
