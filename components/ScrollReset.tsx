"use client";

import { useLayoutEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { getLenis } from "./SmoothScroll";

gsap.registerPlugin(ScrollTrigger);

/**
 * Resets the smooth-scroll position to the top BEFORE the page's scroll-in
 * reveals initialise. Render it as the FIRST child of a route's page so its
 * layout effect runs ahead of the sibling Reveal / ScrollTrigger effects.
 *
 * Why: Lenis is created once in the root layout and persists across client-side
 * navigations, so its scroll position carries over. Entering a case study from
 * the home bento (scrolled well down the page) left the new route's `once`
 * reveal triggers evaluating against that stale scroll — they fired on creation
 * and content appeared already-revealed (no animation). A hard refresh starts at
 * scroll 0, so it never showed there. Resetting here (immediate) makes a
 * client-nav entry behave exactly like a fresh load.
 */
export function ScrollReset() {
  useLayoutEffect(() => {
    // Jump to the top synchronously, BEFORE the sibling reveal triggers below are
    // created, so they measure against scroll 0 (not the carried-over home-page
    // scroll). Reset Lenis (smooth-scroll source of truth, persists across routes)
    // AND the native window scroll (what ScrollTrigger reads).
    //
    // Lenis' scrollTo early-returns when `target === targetScroll`, which can
    // leave a still-running smooth animation. If the shared rAF ticker stalls
    // mid-animation (e.g. the home WebGL hero loses its GPU context on nav, as
    // seen in "THREE.WebGLRenderer: Context Lost"), that animation freezes the
    // scroll partway (observed: stuck at ~1656 instead of 0) and the reveals
    // near it fire. So force a HARD, synchronous jump that does not depend on the
    // ticker: nudge to 1px first to bypass the early-return and cancel any
    // in-flight animation, then jump to 0.
    const top = () => {
      const lenis = getLenis();
      if (lenis) {
        lenis.scrollTo(1, { immediate: true, force: true });
        lenis.scrollTo(0, { immediate: true, force: true });
      }
      window.scrollTo(0, 0);
    };
    top();
    // Sync ScrollTrigger's CACHED scroll to 0 now (it doesn't re-read on create),
    // then recompute trigger start/end for the route at the top.
    ScrollTrigger.update();
    ScrollTrigger.refresh();
    // Re-assert next frame in case the persistent smooth-scroll emits a stale
    // position after this commit (which would otherwise trip the once-fire reveals).
    const id = requestAnimationFrame(() => {
      top();
      ScrollTrigger.update();
    });
    return () => cancelAnimationFrame(id);
  }, []);
  return null;
}
