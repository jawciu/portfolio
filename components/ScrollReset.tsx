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
    // scroll). Set both Lenis (smooth-scroll source of truth) and the native
    // window scroll (what ScrollTrigger reads) so they agree immediately.
    getLenis()?.scrollTo(0, { immediate: true });
    window.scrollTo(0, 0);
    // recompute any already-live trigger start/end for the route now at scroll 0
    ScrollTrigger.refresh();
  }, []);
  return null;
}
