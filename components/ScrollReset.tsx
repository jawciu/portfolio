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
    // THE root cause of reveals firing on client-side nav: ScrollTrigger.refresh()
    // RESTORES saved scroll positions by default. Lenis persists across routes, so
    // on a client nav that restore puts the scroller back at the carried-over
    // position — the once-fire reveal triggers then evaluate as already-passed and
    // fire on creation (no animation). A hard refresh has no saved memory, so it
    // never showed there — which is why this only reproduced in a real, previously
    // scrolled browser. clearScrollMemory("manual") clears ScrollTrigger's saved
    // positions AND sets history.scrollRestoration = "manual" so the browser won't
    // restore either. (GSAP docs recommend exactly this for frameworks with
    // unconventional routing, e.g. Next's App Router.)
    ScrollTrigger.clearScrollMemory("manual");

    // Then jump to the top synchronously, BEFORE the sibling reveal triggers below
    // are created, so they measure against scroll 0. Lenis' scrollTo early-returns
    // when target === targetScroll, so nudge to 1px first to force the reset.
    const top = () => {
      const lenis = getLenis();
      if (lenis) {
        lenis.scrollTo(1, { immediate: true, force: true });
        lenis.scrollTo(0, { immediate: true, force: true });
      }
      window.scrollTo(0, 0);
    };
    top();
    // Recompute trigger start/end for the route at the top. Safe now: memory is
    // cleared, so refresh() no longer restores a stale scroll.
    ScrollTrigger.refresh();
    // Re-assert next frame in case the persistent smooth-scroll re-emits a position
    // after this commit.
    const id = requestAnimationFrame(() => {
      top();
      ScrollTrigger.update();
    });
    return () => cancelAnimationFrame(id);
  }, []);
  return null;
}
