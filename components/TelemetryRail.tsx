"use client";

import { useEffect, useRef, useSyncExternalStore } from "react";
import { useGPUTier } from "@/lib/useGPUTier";
import { usePrefersReducedMotion } from "@/lib/usePrefersReducedMotion";

// Read a stable client-only fact (no server equivalent) without a setState-in-effect or
// a hydration mismatch: server renders `server`, client renders getClient(). subscribe is
// a no-op because the value never changes after mount.
const noopSubscribe = () => () => {};
function useClientSnapshot(getClient: () => string, server: string) {
  return useSyncExternalStore(noopSubscribe, getClient, () => server);
}

// Right-edge telemetry strip — a spec-sticker / render-engine debug overlay. Every
// token is a REAL fact about what's rendering for THIS visitor, so the text adapts to
// whoever's looking: a casual viewer reads cool mono HUD chrome, a technical one clocks
// that it's live. Facts: the WebGL context, the visitor's detect-gpu TIER + effective
// DPR, and a raw live FPS read straight from the browser's frame loop.
//
// Perf rule (same as the parallax): the FPS number is written to the DOM via a ref, NOT
// pushed through React state — a setState 60x/sec would tank the framerate AND flicker
// illegibly. Here the performance-correct choice and the readable choice are the same.

// Raw FPS, uncapped, counted over a short window and written to `ref.textContent`.
// Returns the ref to attach to the live <span>. Does nothing when disabled (reduced
// motion -> the render loop is on-demand, so a frame count would be meaningless).
function useFps(enabled: boolean) {
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    if (!enabled) return;
    let raf = 0;
    let frames = 0;
    let acc = performance.now();
    const tick = (now: number) => {
      frames++;
      if (now - acc >= 333) {
        // ~3 updates/sec: visibly ticking, raw, no smoothing across windows, no cap
        const fps = Math.round((frames * 1000) / (now - acc));
        if (ref.current) ref.current.textContent = String(fps);
        frames = 0;
        acc = now;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [enabled]);
  return ref;
}

function Sep() {
  return <span className="text-fg/30"> · </span>;
}

export function TelemetryRail() {
  const tier = useGPUTier();
  const reduced = usePrefersReducedMotion();

  const webgl = useClientSnapshot(
    () => (document.createElement("canvas").getContext("webgl2") ? "WEBGL2" : "WEBGL1"),
    "WEBGL2",
  );
  // Effective DPR mirrors the Scene's clamp: range [1,2] on tier>=3, else [1,1.5].
  const dpr = useClientSnapshot(() => {
    const cap = tier >= 3 ? 2 : 1.5;
    const eff = Math.min(window.devicePixelRatio || 1, cap);
    return Number.isInteger(eff) ? String(eff) : eff.toFixed(1);
  }, "2");

  const fpsRef = useFps(!reduced);

  return (
    <div
      aria-hidden
      className="fixed right-3 top-1/2 z-30 -translate-y-1/2 font-mono text-[10px] md:text-xs tracking-[0.35em] uppercase text-fg/70 pointer-events-none select-none max-md:hidden"
      style={{ writingMode: "vertical-rl" }}
    >
      {webgl}
      <Sep />
      TIER {tier}
      <Sep />
      DPR {dpr}
      <Sep />
      {reduced ? (
        "STATIC"
      ) : (
        <>
          <span ref={fpsRef}>-</span> FPS
        </>
      )}
    </div>
  );
}
