"use client";

import dynamic from "next/dynamic";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { HeroPoster } from "./hero/HeroPoster";

// Scene contains <Canvas> — touches window at import time.
// Loaded only on the client, with a CSS poster as the LCP placeholder.
const Scene = dynamic(
  () => import("./hero/Scene").then((m) => ({ default: m.Scene })),
  {
    ssr: false,
    loading: () => <HeroPoster />,
  },
);

/**
 * The WebGL hero, mounted ONCE in the root layout so it persists across client
 * navigations. Previously it lived in the home page and unmounted on every route
 * change — tearing down a heavy scene (Environment cubemap + postprocessing) and
 * losing the GPU context ("THREE.WebGLRenderer: Context Lost"), which stalled the
 * main thread. On a heavy route (the wiki case study) that hang made the scroll-in
 * reveals jump straight to their end state (GSAP catching up after the freeze) and
 * the streaming quotes run ahead on the compositor — so they appeared already-shown.
 *
 * Keeping the canvas alive and just PAUSING + hiding it off-home removes the
 * teardown entirely: no context loss, no main-thread hang, so case-study reveals
 * animate normally whether entered by refresh or client-side nav.
 */
export function PersistentHero() {
  const pathname = usePathname();
  const isHome = pathname === "/";

  // Pause the frameloop on home too, once the hero is fully covered by opaque
  // content. About is the last section it shows through (glass sheet); after
  // About's bottom edge leaves the viewport everything sits on solid bg-bg, so
  // rendering the fullscreen scene + postprocessing behind it is pure GPU waste
  // (it starved weaker machines to single-digit fps at the galaxy section).
  // Hysteresis: pause at bottom <= 0, resume once bottom > 80 — the band is
  // opaque About footer, so the canvas is live again before it can be seen.
  // Off-home `covered` may go stale — irrelevant, paused is true there anyway;
  // re-entering home re-measures on the next frame (one hidden frame at most).
  const [covered, setCovered] = useState(false);
  useEffect(() => {
    if (!isHome) return;
    const onScroll = () => {
      const about = document.getElementById("about");
      if (!about) return;
      const bottom = about.getBoundingClientRect().bottom;
      setCovered((prev) => (bottom <= 0 ? true : bottom > 80 ? false : prev));
    };
    const raf = requestAnimationFrame(onScroll);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [isHome]);

  return (
    <div
      aria-hidden
      // z-0 (below the home page's z-10 content, so the hero shows on home).
      // Off-home we hide it with an INSTANT opacity:0 — no transition. The old
      // 300ms fade was the bug: the z-0 canvas stayed visible ON TOP of the case
      // study for the fade, flashing the home orbs and hiding the reveal
      // animations behind it. Hidden instantly, it can't be caught over content.
      className="fixed inset-0 z-0"
      style={{ opacity: isHome ? 1 : 0, pointerEvents: "none" }}
    >
      <Scene paused={!isHome || covered} />
    </div>
  );
}
