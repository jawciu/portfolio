"use client";

import { useRef, useMemo, useEffect } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { vertexShader, fragmentShader } from "./shaders";

// Mirror of the shader's hash + lane-wiring test, so the blob only walks lanes
// that actually carry traces (no jumping across empty space).
const fract = (v: number) => v - Math.floor(v);
function h21(x: number, y: number) {
  let px = fract(x * 123.34);
  let py = fract(y * 456.21);
  const d = px * (px + 45.32) + py * (py + 45.32);
  px += d;
  py += d;
  return fract(px * py);
}
const rowWired = (row: number) => h21(row * 0.123, 7.7) >= 0.32;
const colWired = (col: number) => h21(13.3, col * 0.123) >= 0.32;

export function CircuitField() {
  const matRef = useRef<THREE.ShaderMaterial>(null);
  const meshRef = useRef<THREE.Mesh>(null);
  const { viewport, size } = useThree();
  const mouseTarget = useRef(new THREE.Vector2(0.5, 0.5));
  // Labyrinth-walking light blob (uv space), moves with right-angle turns
  const blob = useRef({ x: 0.7, y: 0.46, tx: 0.7, ty: 0.46 });
  // Eased glitch envelope: swells up + decays smoothly, fired at intervals
  const glitchEnv = useRef({ t: 0, dur: 0, next: 3, val: 0 });

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uResolution: { value: new THREE.Vector2(size.width, size.height) },
      uMouse: { value: new THREE.Vector2(0.5, 0.5) },
      uBlob: { value: new THREE.Vector2(0.7, 0.46) },
      uGlitch: { value: 0 },
      uBg: { value: new THREE.Color("#05070a") },
      uBgFloor: { value: new THREE.Color("#0a0e14") },
      uPipe: { value: new THREE.Color("#11161d") },
      uPipeEdge: { value: new THREE.Color("#1c2530") },
      uGround: { value: new THREE.Color("#0c1118") },
      uCyan: { value: new THREE.Color("#3fe0d0") },
      uHot: { value: new THREE.Color("#eafffb") },
      uMagenta: { value: new THREE.Color("#ff3da6") },
      uViolet: { value: new THREE.Color("#8b5cff") },
      uPink: { value: new THREE.Color("#ff5fc4") },
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
    const u = matRef.current.uniforms;
    u.uTime.value += dt;
    // Lerp mouse toward target for smooth parallax
    u.uMouse.value.lerp(mouseTarget.current, 0.05);

    // Walk the blob: close the X gap first, then the Y gap (right-angle turns),
    // then pick a new lane-snapped target near the cluster.
    const SCALE = 44;
    const aspect = size.height ? size.width / size.height : 1.7;
    const b = blob.current;
    const stepLen = 0.09 * Math.min(dt, 0.05);
    const dx = b.tx - b.x;
    const dy = b.ty - b.y;
    if (Math.abs(dx) > 1e-4) {
      b.x += Math.sign(dx) * Math.min(stepLen, Math.abs(dx));
    } else if (Math.abs(dy) > 1e-4) {
      b.y += Math.sign(dy) * Math.min(stepLen, Math.abs(dy));
    } else {
      // Pick a new lane crossing near the cluster where BOTH lanes are wired,
      // so the legs of the walk run along real traces.
      for (let i = 0; i < 24; i++) {
        const ang = Math.random() * Math.PI * 2;
        const rad = Math.random() * 0.45;
        const col = Math.round((0.66 + (Math.cos(ang) * rad) / aspect) * aspect * SCALE);
        const row = Math.round((0.48 + Math.sin(ang) * rad) * SCALE);
        if (rowWired(row) && colWired(col)) {
          b.tx = col / (aspect * SCALE);
          b.ty = row / SCALE;
          break;
        }
      }
    }
    u.uBlob.value.set(b.x, b.y);

    // Eased glitch envelope — smooth attack + release, calm gaps between
    const g = glitchEnv.current;
    if (g.t > 0) {
      g.t -= dt;
      const p = 1 - g.t / g.dur;
      let e = p < 0.35 ? p / 0.35 : 1 - (p - 0.35) / 0.65;
      e = Math.max(0, e);
      g.val = e * e * (3 - 2 * e);
    } else {
      g.val *= Math.exp(-dt * 5);
      g.next -= dt;
      if (g.next <= 0) {
        g.dur = 1.0 + Math.random() * 1.2; // slow surge (1.0–2.2s)
        g.t = g.dur;
        g.next = 4 + Math.random() * 5; // calm between (4–9s)
      }
    }
    u.uGlitch.value = g.val;
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
