"use client";

import { useRef, useMemo, useEffect } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { vertexShader, fragmentShader } from "./shaders";

export function CircuitField() {
  const matRef = useRef<THREE.ShaderMaterial>(null);
  const meshRef = useRef<THREE.Mesh>(null);
  const { viewport, size } = useThree();
  const mouseTarget = useRef(new THREE.Vector2(0.5, 0.5));

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uResolution: { value: new THREE.Vector2(size.width, size.height) },
      uMouse: { value: new THREE.Vector2(0.5, 0.5) },
      uColorA: { value: new THREE.Color("#38d6ff") },
      uColorB: { value: new THREE.Color("#ff3d8b") },
      uColorC: { value: new THREE.Color("#ff9b3d") },
      uMetalWarm: { value: new THREE.Color("#5e421f") },
      uMetalCool: { value: new THREE.Color("#7e94ad") },
      uPcb: { value: new THREE.Color("#08110e") },
    }),
    [size.width, size.height],
  );

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      mouseTarget.current.set(
        e.clientX / window.innerWidth,
        1 - e.clientY / window.innerHeight,
      );
    };
    window.addEventListener("pointermove", onMove);
    return () => window.removeEventListener("pointermove", onMove);
  }, []);

  useFrame((_, dt) => {
    if (!matRef.current) return;
    matRef.current.uniforms.uTime.value += dt;
    // Lerp mouse toward target for smooth parallax
    matRef.current.uniforms.uMouse.value.lerp(mouseTarget.current, 0.05);
  });

  return (
    <mesh ref={meshRef} scale={[viewport.width, viewport.height, 1]}>
      <planeGeometry args={[1, 1]} />
      <shaderMaterial
        ref={matRef}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        toneMapped={false}
      />
    </mesh>
  );
}
