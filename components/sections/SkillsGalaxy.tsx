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
import { PlanetPainter } from "./galaxy/PlanetPainter";
import { useGPUTier } from "@/lib/useGPUTier";
import { usePrefersReducedMotion } from "@/lib/usePrefersReducedMotion";

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
        <div
          ref={frameRef}
          onClick={() => { if (!active) activate(); }}
          className={`relative mt-9 overflow-hidden rounded-2xl border bg-[#070709] transition-[border-color] duration-500 md:mt-12 ${
            active ? "border-white/25" : "border-white/10 cursor-pointer"
          }`}
          style={{ height: "min(78vh, 860px)", minHeight: 460 }}
        >
          {/* section label lives INSIDE the window frame — floating above it
              users didn't connect "/skills" to the galaxy (2026-08-02) */}
          <p
            id="skills-galaxy-label"
            className="pointer-events-none absolute left-5 top-4 z-20 font-mono text-xs tracking-[0.2em] text-fg/70 md:left-7 md:text-sm"
          >
            /skills
          </p>
          {/* control panel — full frame width along the bottom edge.
              Non-clickable hints grouped LEFT (play click-in, chevron-pair
              scroll, △ travel, outward-chevron drag; icons per Caroline's
              design, 2026-08-02), back-to-start button alone on the right.
              Hints are flat grey; ONLY back-to-start is a real button
              (case-study reverse-on-hover). Cross/card layouts rejected as
              too space-hungry; mouse glyphs rejected as obsolete.
              stopPropagation: panel clicks must not focus stars behind it
              or trip the frame's click handling. (no em dashes: house rule) */}
          <div
            className="absolute inset-x-0 bottom-0 z-20 flex items-center justify-between gap-6 border-t border-white/10 bg-[rgba(7,7,9,0.82)] px-5 py-3 font-mono backdrop-blur-md md:px-7"
            onClick={(e) => { e.stopPropagation(); if (!active) activate(); }}
            onPointerDown={(e) => e.stopPropagation()}
          >
            {/* hint-to-hint gaps kept at 21/29px (Caroline's 2/3-ratio pass,
                2026-08-02); click-in renders as a fourth hint (play icon)
                so the non-clickable set reads as one family. On activation
                its wrapper animates to zero width (0fr grid track) so the
                other hints slide left into the space instead of leaving a
                dead gap, and slide back when it returns. The wrapper owns
                its trailing gap (pr, outside the gap container) so nothing
                is left over once collapsed. */}
            <div className="flex items-center">
              <div
                className="grid transition-[grid-template-columns,opacity] duration-500 ease-out motion-reduce:transition-none"
                style={{ gridTemplateColumns: active ? "0fr" : "1fr", opacity: active ? 0 : 1 }}
              >
                <div className="min-w-0 overflow-hidden">
                  <div className="pr-[21px] md:pr-[29px]">
                    <ControlHint glyph={<PlayIcon />} lines={["click in to start"]} />
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-[21px] md:gap-[29px]">
                <ControlHint glyph={<ScrollZoomIcon />} lines={["scroll to zoom"]} />
                <ControlHint glyph={<TriangleIcon />} lines={["click to travel"]} />
                <ControlHint glyph={<DragOrbitIcon />} lines={["drag to orbit"]} />
              </div>
            </div>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                window.dispatchEvent(new CustomEvent("galaxy:recentre"));
              }}
              className="flex cursor-pointer items-center gap-2 whitespace-nowrap rounded-lg border border-fg/80 px-3.5 py-1.5 text-[11px] tracking-[0.12em] text-fg/90 transition-colors hover:border-fg hover:bg-fg hover:text-bg"
            >
              <BackToStartIcon />
              back to start
            </button>
          </div>

          <GalaxyCanvas active={active} visible={visible} reduced={reduced} tier={tier} />

          {/* dev-only choreography tuning + planet paint panels — never ship */}
          {process.env.NODE_ENV !== "production" && <GalaxyTuner />}
          {process.env.NODE_ENV !== "production" && <PlanetPainter />}

          {/* label fade-in lives here so the section stays fully self-contained */}
          {/* only a `from` keyframe: it eases up to each label's own inline
              opacity (neighbours sit at 0.62) instead of forcing 1 */}
          <style>{`@keyframes galaxy-label-in { from { opacity: 0 } }`}</style>
        </div>
      </div>
    </section>
  );
}

// ---- control panel glyphs — Caroline's icon designs (2026-08-02) ----------

// A hint: small icon beside a two-line label, flat light grey and
// chrome-free so it reads as legend, not as a button. All icons are drawn
// 1:1 (viewBox = rendered px) with the SAME 1.25 stroke — resizing one via
// viewBox scaling would silently fatten or thin its stroke.

const ICON_STROKE = 1.25;

function ControlHint({ glyph, lines }: { glyph: React.ReactNode; lines: string[] }) {
  return (
    <div className="flex items-center gap-2">
      {glyph}
      <p className="text-left text-[11px] leading-[1.4] tracking-[0.1em] text-fg/65">
        {lines.map((l) => (
          <span key={l} className="block whitespace-nowrap">{l}</span>
        ))}
      </p>
    </div>
  );
}

// Two chevrons up over two chevrons down: the scroll gesture.
function ScrollZoomIcon() {
  return (
    <svg width="15" height="16" viewBox="0 0 15 16" aria-hidden="true" className="shrink-0 text-fg/55">
      <path d="M1 4.1 L3.6 1.5 L6.2 4.1" fill="none" stroke="currentColor" strokeWidth={ICON_STROKE} strokeLinecap="round" strokeLinejoin="round" />
      <path d="M8.8 4.1 L11.4 1.5 L14 4.1" fill="none" stroke="currentColor" strokeWidth={ICON_STROKE} strokeLinecap="round" strokeLinejoin="round" />
      <path d="M1 11.9 L3.6 14.5 L6.2 11.9" fill="none" stroke="currentColor" strokeWidth={ICON_STROKE} strokeLinecap="round" strokeLinejoin="round" />
      <path d="M8.8 11.9 L11.4 14.5 L14 11.9" fill="none" stroke="currentColor" strokeWidth={ICON_STROKE} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// Outline play triangle: the "click in to start" cue, idle only.
function PlayIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true" className="shrink-0 text-fg/55">
      <path d="M3.2 2.2 L11.8 7 L3.2 11.8 Z" fill="none" stroke="currentColor" strokeWidth={ICON_STROKE} strokeLinejoin="round" />
    </svg>
  );
}

function TriangleIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true" className="shrink-0 text-fg/55">
      <path d="M7 2.4 L12.6 11.6 L1.4 11.6 Z" fill="none" stroke="currentColor" strokeWidth={ICON_STROKE} strokeLinejoin="round" />
    </svg>
  );
}

// Four outward chevrons around an empty hub: drag in any direction.
function DragOrbitIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true" className="shrink-0 text-fg/55">
      <path d="M5.7 3.3 L8 1 L10.3 3.3" fill="none" stroke="currentColor" strokeWidth={ICON_STROKE} strokeLinecap="round" strokeLinejoin="round" />
      <path d="M5.7 12.7 L8 15 L10.3 12.7" fill="none" stroke="currentColor" strokeWidth={ICON_STROKE} strokeLinecap="round" strokeLinejoin="round" />
      <path d="M3.3 5.7 L1 8 L3.3 10.3" fill="none" stroke="currentColor" strokeWidth={ICON_STROKE} strokeLinecap="round" strokeLinejoin="round" />
      <path d="M12.7 5.7 L15 8 L12.7 10.3" fill="none" stroke="currentColor" strokeWidth={ICON_STROKE} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// Clockwise refresh arrow, no enclosing circle: the button border is the
// chrome. Inherits currentColor so it inverts with the reverse-on-hover.
function BackToStartIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 13 13" aria-hidden="true" className="shrink-0">
      <path d="M9.4 4.2 A 4.1 4.1 0 1 0 10.1 8.1" fill="none" stroke="currentColor" strokeWidth={ICON_STROKE} strokeLinecap="round" />
      <path d="M7.3 4.1 L9.6 4.3 L10.3 2.1" fill="none" stroke="currentColor" strokeWidth={ICON_STROKE} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
