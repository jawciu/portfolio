"use client";

import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";

gsap.registerPlugin(ScrollTrigger);

// Module-level handle to the single Lenis instance (created once in the root
// layout). Lets route components reset the smooth-scroll position on client-side
// navigation — see ScrollReset. Null before mount / after unmount.
let lenisInstance: Lenis | null = null;
export const getLenis = () => lenisInstance;

export function SmoothScroll({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Own the scroll position ourselves — don't let the browser restore a saved
    // position on client-side navigation (that restore is part of what made
    // case-study reveals fire on nav). See ScrollReset for the ScrollTrigger side.
    if ("scrollRestoration" in history) history.scrollRestoration = "manual";

    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      // Driven by GSAP's ticker below (single rAF loop). Without this, Lenis also
      // runs its OWN rAF -> two loops fighting over the scroll -> jitter/desync.
      autoRaf: false,
    });
    lenisInstance = lenis;

    const raf = (time: number) => lenis.raf(time * 1000);
    lenis.on("scroll", ScrollTrigger.update);
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);

    // Recompute ScrollTrigger start/end positions once fonts (and the initial
    // load) settle, so reveal triggers fire at the right scroll positions.
    document.fonts?.ready.then(() => ScrollTrigger.refresh());
    const onLoad = () => ScrollTrigger.refresh();
    window.addEventListener("load", onLoad);

    return () => {
      window.removeEventListener("load", onLoad);
      lenis.destroy();
      lenisInstance = null;
      gsap.ticker.remove(raf);
    };
  }, []);

  return <>{children}</>;
}
