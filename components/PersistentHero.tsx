"use client";

import dynamic from "next/dynamic";
import { usePathname } from "next/navigation";
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
  return (
    <div
      aria-hidden
      className="fixed inset-0 z-0 transition-opacity duration-300"
      style={{ opacity: isHome ? 1 : 0, pointerEvents: "none" }}
    >
      <Scene paused={!isHome} />
    </div>
  );
}
