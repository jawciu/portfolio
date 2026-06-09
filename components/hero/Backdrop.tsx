"use client";

import { useRef, useMemo } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { backdropVertex, backdropFragment } from "./heroShaders";

const BACK_Z = -3; // sits behind the orb/glass

// Full-frustum plane carrying the flame-chain + substrate shader. Resizes to
// exactly fill the perspective frustum at BACK_Z so the 2D field always covers
// the viewport regardless of aspect.
export function Backdrop({
  mouse,
  progress,
  reduced = false,
}: {
  mouse: React.RefObject<THREE.Vector2>;
  progress: React.RefObject<number>;
  reduced?: boolean;
}) {
  const mesh = useRef<THREE.Mesh>(null);
  const matRef = useRef<THREE.ShaderMaterial>(null);
  const { size, camera } = useThree();

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uResolution: { value: new THREE.Vector2(size.width, size.height) },
      uMouse: { value: new THREE.Vector2(0.5, 0.5) },
      uBg: { value: new THREE.Color("#070709") },
      uFade: { value: 1 },
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  useFrame((state, dt) => {
    if (!matRef.current || !mesh.current) return;
    const u = matRef.current.uniforms;
    // reduced motion: hold a posed frame (no time advance), keep scroll fade
    if (!reduced) {
      u.uTime.value += dt;
      u.uMouse.value.lerp(mouse.current, 0.12); // snappier so the hover-reveal tracks the cursor
    }
    u.uResolution.value.set(size.width, size.height);
    u.uFade.value = THREE.MathUtils.clamp(1 - progress.current * 1.1, 0, 1);

    // fit plane to frustum at BACK_Z
    const cam = camera as THREE.PerspectiveCamera;
    const dist = cam.position.z - BACK_Z;
    const h = 2 * Math.tan((cam.fov * Math.PI) / 360) * dist;
    const w = h * (size.width / size.height);
    mesh.current.scale.set(w, h, 1);
  });

  return (
    <mesh ref={mesh} position={[0, 0, BACK_Z]} renderOrder={-1}>
      <planeGeometry args={[1, 1]} />
      <shaderMaterial
        ref={matRef}
        vertexShader={backdropVertex}
        fragmentShader={backdropFragment}
        uniforms={uniforms}
        depthWrite={false}
        toneMapped={false}
      />
    </mesh>
  );
}
