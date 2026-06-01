"use client";

import { Canvas } from "@react-three/fiber";
import { Suspense } from "react";
import { FlareField } from "./FlareField";
import { Effects } from "./Effects";

export function Scene() {
  return (
    <Canvas
      dpr={[1, 2]}
      gl={{
        powerPreference: "high-performance",
        antialias: false,
        alpha: false,
      }}
      camera={{ position: [0, 0, 1], fov: 50 }}
      frameloop="always"
    >
      <color attach="background" args={["#070709"]} />
      <Suspense fallback={null}>
        <FlareField />
        <Effects />
      </Suspense>
    </Canvas>
  );
}
