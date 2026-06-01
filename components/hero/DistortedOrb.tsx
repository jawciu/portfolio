"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

// Backlit iridescent rim material. Pale core, hot orange->teal->magenta rim
// whose thickness/brightness/saturation vary per sphere (matches the asset's
// receding row, where the front orb has a thick hot halo + near-white core and
// the rear ones are thinner/cooler/dimmer).
const orbVertex = /* glsl */ `
  varying vec3 vN;
  varying vec3 vView;
  void main(){
    vec4 wp = modelMatrix * vec4(position, 1.0);
    vN = normalize(mat3(modelMatrix) * normal);
    vView = normalize(cameraPosition - wp.xyz);
    gl_Position = projectionMatrix * viewMatrix * wp;
  }
`;

const orbFragment = /* glsl */ `
  precision highp float;
  uniform float uRimWidth;   // fresnel power: higher = thinner rim
  uniform float uRimGain;    // HDR rim brightness (push >1 for bloom)
  uniform float uCoreFill;   // 0 = near-black body, 1 = full pale core
  uniform float uBright;
  uniform vec3  uCore;       // core color
  uniform vec3  uRimA;       // inner rim (warm orange)
  uniform vec3  uRimB;       // outer edge (red / magenta)
  varying vec3 vN;
  varying vec3 vView;

  void main(){
    float ndv  = clamp(dot(normalize(vN), normalize(vView)), 0.0, 1.0);
    float edge = 1.0 - ndv;                  // 0 center -> 1 silhouette
    float fres = pow(edge, uRimWidth);       // rim falloff (higher power = thinner)

    // backlit core: bright pale center that darkens toward the rim band
    float core = smoothstep(0.92, 0.22, edge) * uCoreFill;

    // hue ramps RADIALLY: teal/pale core -> hot orange -> red/magenta edge
    vec3 rimCol = mix(uRimA, uRimB, smoothstep(0.45, 0.95, edge));

    vec3 col = uCore * core;
    col += rimCol * fres * uRimGain;          // HDR rim, dominant
    col *= uBright;
    gl_FragColor = vec4(col, 1.0);
  }
`;

type OrbDef = {
  pos: [number, number, number];
  scale: number;
  rimWidth: number;
  rimGain: number;
  bright: number;
  coreFill: number;
  core: THREE.Color;
  rimA: THREE.Color;
  rimB: THREE.Color;
};

// 5 spheres along an arc that recedes to the right (matches the asset). Front
// (right) = big/bright, near-white core + thick molten orange rim; rear (left)
// = near-black body with only a thin red/magenta sliver of rim.
function useOrbDefs(): OrbDef[] {
  return useMemo(() => {
    const C = (h: string) => new THREE.Color(h);
    return [
      { pos: [2.2, 0.0, 0.6], scale: 1.12, rimWidth: 3.5, rimGain: 4.8, bright: 1.5, coreFill: 1.0, core: C("#e6fbff"), rimA: C("#ff7a26"), rimB: C("#ff2410") },
      { pos: [1.0, 0.05, 0.2], scale: 1.0, rimWidth: 3.6, rimGain: 4.2, bright: 1.32, coreFill: 0.9, core: C("#9ff2e2"), rimA: C("#ffa030"), rimB: C("#ff3a18") },
      { pos: [-0.1, 0.0, -0.2], scale: 0.92, rimWidth: 3.7, rimGain: 3.2, bright: 1.05, coreFill: 0.5, core: C("#5fe6d6"), rimA: C("#ff8a3a"), rimB: C("#ff2e6a") },
      { pos: [-1.05, -0.02, -0.6], scale: 0.82, rimWidth: 4.4, rimGain: 2.6, bright: 0.85, coreFill: 0.14, core: C("#4d8a82"), rimA: C("#ff5a5a"), rimB: C("#e02a78") },
      { pos: [-1.9, 0.0, -1.0], scale: 0.74, rimWidth: 5.2, rimGain: 2.1, bright: 0.7, coreFill: 0.07, core: C("#3a2030"), rimA: C("#ff4a6a"), rimB: C("#c01e64") },
    ];
  }, []);
}

function Orb({ def }: { def: OrbDef }) {
  const uniforms = useMemo(
    () => ({
      uRimWidth: { value: def.rimWidth },
      uRimGain: { value: def.rimGain },
      uCoreFill: { value: def.coreFill },
      uBright: { value: def.bright },
      uCore: { value: def.core },
      uRimA: { value: def.rimA },
      uRimB: { value: def.rimB },
    }),
    [def],
  );
  return (
    <mesh position={def.pos} scale={def.scale}>
      <sphereGeometry args={[0.5, 64, 64]} />
      <shaderMaterial
        vertexShader={orbVertex}
        fragmentShader={orbFragment}
        uniforms={uniforms}
        toneMapped={false}
      />
    </mesh>
  );
}

export function DistortedOrb({
  mouse,
  reduced = false,
}: {
  mouse: React.RefObject<THREE.Vector2>;
  reduced?: boolean;
}) {
  const group = useRef<THREE.Group>(null);
  const defs = useOrbDefs();

  useFrame((state) => {
    if (!group.current) return;
    if (reduced) {
      // posed static frame: a flattering carousel angle, no spin
      group.current.rotation.y = 0.5;
      return;
    }
    const t = state.clock.elapsedTime;
    // CAROUSEL: slow rotation about Y so spheres swing fwd/back & reorder depth.
    group.current.rotation.y = t * 0.18;
    // gentle "fan" breathe + cursor tilt parallax
    group.current.rotation.x = 0.06 * Math.sin(t * 0.4) + (mouse.current.y - 0.5) * 0.12;
    group.current.position.x = (mouse.current.x - 0.5) * 0.3;
  });

  // pivot the whole rig to the right side of frame, like the mockup
  return (
    <group position={[1.6, 0, 0]}>
      <group ref={group}>
        {defs.map((def, i) => (
          <Orb key={i} def={def} />
        ))}
      </group>
    </group>
  );
}
