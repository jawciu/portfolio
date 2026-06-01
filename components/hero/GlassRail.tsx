"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { MeshTransmissionMaterial, useTexture } from "@react-three/drei";
import * as THREE from "three";

// Iridescent CORE seen through the glass shell. Samples the Silvaday pill/sphere
// artwork as a vertical gradient and domain-warps it on scroll, so the colours
// slide / stretch / bleed as you scroll. Distorted again by the glass on top.
const coreVertex = /* glsl */ `
  varying vec2 vUv;
  void main(){
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;
const coreFragment = /* glsl */ `
  precision highp float;
  uniform sampler2D uTex;
  uniform float uTime;
  uniform float uScroll;
  uniform float uSat;
  varying vec2 vUv;

  vec3 sat(vec3 c, float s){
    float l = dot(c, vec3(0.299,0.587,0.114));
    return clamp(mix(vec3(l), c, s), 0.0, 4.0);
  }
  void main(){
    // scroll slides the gradient; time + scroll warp the bands so they churn
    float warp = sin(vUv.y*7.0 + uTime*0.4) * 0.025
               + sin(vUv.x*5.0 - uTime*0.3) * 0.02
               + uScroll * 0.30;
    vec2 st = vec2(
      0.5 + (vUv.x - 0.5)*0.7 + 0.06*sin(uTime*0.25 + uScroll*6.2831),
      fract(vUv.y + warp)
    );
    vec3 c = texture2D(uTex, st).rgb;
    c = sat(pow(c, vec3(0.82)), uSat) * 2.7;  // saturate + lift so it reads vividly through glass
    gl_FragColor = vec4(c, 1.0);
  }
`;

type Shape = "sphere" | "pill";

function GlassShape({
  shape,
  texUrl,
  position,
  radius,
  length = 1,
  progress,
  driftBase,
  vivid = false,
  saturation = 1.45,
  reduced = false,
  lowQuality = false,
}: {
  shape: Shape;
  texUrl: string;
  position: [number, number, number];
  radius: number;
  length?: number;
  progress: React.RefObject<number>;
  driftBase: number;
  vivid?: boolean;
  saturation?: number;
  reduced?: boolean;
  lowQuality?: boolean;
}) {
  const group = useRef<THREE.Group>(null);
  const coreMat = useRef<THREE.ShaderMaterial>(null);
  // Configure colour space / wrapping in onLoad (mutating the hook result in
  // render or an effect is disallowed by react-hooks/immutability).
  const tex = useTexture(texUrl, (t) => {
    const tx = (Array.isArray(t) ? t[0] : t) as THREE.Texture;
    tx.colorSpace = THREE.SRGBColorSpace;
    tx.wrapS = tx.wrapT = THREE.RepeatWrapping;
  });

  const coreUniforms = useMemo(
    () => ({
      uTex: { value: tex },
      uTime: { value: 0 },
      uScroll: { value: 0 },
      uSat: { value: saturation },
    }),
    [tex, saturation],
  );

  useFrame((state, dt) => {
    if (!group.current) return;
    const p = progress.current;
    // scroll-driven drift up + rotate (kept even in reduced motion — gentlest
    // scroll response only); idle float is dropped when reduced.
    const idle = reduced ? 0 : 0.05 * Math.sin(state.clock.elapsedTime * 0.5);
    group.current.position.y = driftBase + p * 1.6 + idle;
    group.current.rotation.z = p * 0.25;
    if (coreMat.current) {
      if (!reduced) coreMat.current.uniforms.uTime.value += dt;
      coreMat.current.uniforms.uScroll.value = p;
    }
  });

  return (
    <group ref={group} position={position}>
      {/* inner iridescent core (slightly smaller so the shell wraps it) */}
      <mesh scale={0.96}>
        {shape === "sphere" ? (
          <sphereGeometry args={[radius, 48, 48]} />
        ) : (
          <capsuleGeometry args={[radius, length, 16, 32]} />
        )}
        <shaderMaterial
          ref={coreMat}
          vertexShader={coreVertex}
          fragmentShader={coreFragment}
          uniforms={coreUniforms}
          toneMapped={false}
        />
      </mesh>

      {/* Glass shell. VIVID = de-frosted, low-transmission so the rainbow core
          dominates (for left-rail elements that only have black behind them to
          refract). Otherwise full see-through transmission (for elements sitting
          in front of the colourful orb carousel). */}
      <mesh>
        {shape === "sphere" ? (
          <sphereGeometry args={[radius, 48, 48]} />
        ) : (
          <capsuleGeometry args={[radius, length, 16, 32]} />
        )}
        {vivid ? (
          /* thin clear coat — transmission=1 shows the bright core right behind
             the surface (NOT the black scene), so the rainbow reads vividly even
             with nothing colourful behind the element */
          <MeshTransmissionMaterial
            samples={lowQuality ? 4 : 8}
            resolution={lowQuality ? 256 : 1024}
            transmission={1}
            thickness={radius * 0.3}
            roughness={0.04}
            ior={1.33}
            chromaticAberration={0.1}
            anisotropicBlur={0}
            distortion={0.05}
            distortionScale={0.15}
            temporalDistortion={0.04}
            iridescence={0.2}
            iridescenceIOR={1.3}
            iridescenceThicknessRange={[200, 360]}
          />
        ) : (
          <MeshTransmissionMaterial
            samples={lowQuality ? 4 : 6}
            resolution={lowQuality ? 256 : 512}
            transmission={1}
            thickness={radius * 1.1}
            roughness={0.07}
            ior={1.4}
            chromaticAberration={0.3}
            anisotropicBlur={0.15}
            distortion={0.15}
            distortionScale={0.3}
            temporalDistortion={0.08}
            iridescence={0.6}
            iridescenceIOR={1.5}
            iridescenceThicknessRange={[120, 420]}
            backside
          />
        )}
      </mesh>
    </group>
  );
}

export function GlassRail({
  progress,
  reduced = false,
  lowQuality = false,
}: {
  progress: React.RefObject<number>;
  reduced?: boolean;
  lowQuality?: boolean;
}) {
  const shared = { progress, reduced, lowQuality };
  return (
    <group>
      {/* iridescent sphere — left rail, sits above the tall pill (vivid: black behind) */}
      <GlassShape
        {...shared}
        shape="sphere"
        texUrl="/assets/iridescent-sphere.png"
        position={[-1.95, 0, 0.8]}
        radius={0.28}
        driftBase={0.2}
        vivid
        saturation={1.85}
      />
      {/* tall pill — left rail, directly below the sphere (vivid: black behind) */}
      <GlassShape
        {...shared}
        shape="pill"
        texUrl="/assets/pill-1.png"
        position={[-1.95, 0, 0.8]}
        radius={0.17}
        length={1.05}
        driftBase={-0.62}
        vivid
      />
      {/* accent pill — bottom right, see-through (sits near the orb carousel) */}
      <GlassShape
        {...shared}
        shape="pill"
        texUrl="/assets/pill-2.png"
        position={[2.1, 0, 0.8]}
        radius={0.18}
        length={1.15}
        driftBase={-1.1}
      />
    </group>
  );
}
