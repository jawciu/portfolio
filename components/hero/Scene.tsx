"use client";

import { Canvas } from "@react-three/fiber";
import { Environment, Lightformer } from "@react-three/drei";
import { Suspense, useEffect, useRef } from "react";
import * as THREE from "three";
import { Backdrop } from "./Backdrop";
import { DistortedOrb } from "./DistortedOrb";
import { Effects } from "./Effects";
import { useGPUTier } from "@/lib/useGPUTier";
import { usePrefersReducedMotion } from "@/lib/usePrefersReducedMotion";

export function Scene({ paused = false }: { paused?: boolean }) {
  const tier = useGPUTier();
  const reduced = usePrefersReducedMotion();
  // Shared interaction state, mutated outside React (useFrame reads refs).
  const mouse = useRef(new THREE.Vector2(0.5, 0.5));
  const progress = useRef(0); // hero scroll progress 0..1 over first viewport

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      mouse.current.set(
        e.clientX / window.innerWidth,
        1 - e.clientY / window.innerHeight,
      );
    };
    const onScroll = () => {
      progress.current = Math.min(
        1,
        window.scrollY / Math.max(1, window.innerHeight),
      );
    };
    window.addEventListener("pointermove", onMove);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  return (
    <Canvas
      dpr={tier >= 3 ? [1, 2] : [1, 1.5]}
      gl={{ powerPreference: "high-performance", antialias: false, alpha: false }}
      camera={{ position: [0, 0, 5], fov: 35 }}
      // paused (off-home) -> stop the render loop entirely so the persisted canvas
      // costs nothing while hidden; reduced motion -> render on demand.
      frameloop={paused ? "never" : reduced ? "demand" : "always"}
    >
      <color attach="background" args={["#070709"]} />
      <Suspense fallback={null}>
        {/* On-brand environment so the glass has colour to refract/reflect */}
        <Environment resolution={256}>
          <Lightformer intensity={2.2} color="#ff6a2a" position={[-3, 2, 2]} scale={[6, 6, 1]} />
          <Lightformer intensity={1.6} color="#33e6c0" position={[3, -1, 2]} scale={[6, 6, 1]} />
          <Lightformer intensity={1.8} color="#7a5bff" position={[0, 3, -2]} scale={[8, 4, 1]} />
          <Lightformer intensity={1.2} color="#ff2d6a" position={[2, 2, 3]} scale={[4, 4, 1]} />
        </Environment>
        <Backdrop mouse={mouse} progress={progress} reduced={reduced} />
        <DistortedOrb mouse={mouse} progress={progress} reduced={reduced} />
        {/* GlassRail (left sphere+pill, right accent pill — the elements that
            scrolled with the page) unmounted 2026-06-10 per Caroline. ONLY that:
            Effects/Environment/tiering all stay. Re-import to restore. */}
        <Effects />
      </Suspense>
    </Canvas>
  );
}
