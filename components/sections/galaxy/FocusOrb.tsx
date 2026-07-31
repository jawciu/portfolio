"use client";

// FocusOrb — the celestial body that fades in at a focused node.
//
// The zoomed-out graph draws every node as a shader point-sprite; when the
// camera flies into one, this component gives it an actual rotating sphere
// so orbiting the focus reads as circling a real body:
//   skill / egg → a boiling sun (fbm granulation + rim flare, egg = small moon)
//   job / project → a banded planet, roughly half of them ringed (hash of id)
// Palettes derive from the node's cluster so the close-up matches the tint
// its star already had from a distance. Planets deliberately glow less than
// suns (Caroline: "planets emit light, probably not as much — don't worry
// about consistency").

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import type { GalaxyNode } from "@/lib/galaxyData";

const NOISE = /* glsl */ `
  float hash(vec3 p) {
    p = fract(p * 0.3183099 + .1);
    p *= 17.0;
    return fract(p.x * p.y * p.z * (p.x + p.y + p.z));
  }
  float noise(vec3 x) {
    vec3 i = floor(x); vec3 f = fract(x);
    f = f * f * (3. - 2. * f);
    return mix(
      mix(mix(hash(i), hash(i + vec3(1,0,0)), f.x),
          mix(hash(i + vec3(0,1,0)), hash(i + vec3(1,1,0)), f.x), f.y),
      mix(mix(hash(i + vec3(0,0,1)), hash(i + vec3(1,0,1)), f.x),
          mix(hash(i + vec3(0,1,1)), hash(i + vec3(1,1,1)), f.x), f.y), f.z);
  }
  float fbm(vec3 p) {
    float v = 0.0; float a = 0.5;
    for (int k = 0; k < 4; k++) { v += a * noise(p); p *= 2.02; a *= 0.5; }
    return v;
  }
`;

const ORB_VERT = /* glsl */ `
  varying vec3 vN;
  varying vec3 vP;
  varying vec3 vView;
  void main() {
    vN = normalize(normalMatrix * normal);
    vP = normalize(position);
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    vView = normalize(-mv.xyz);
    gl_Position = projectionMatrix * mv;
  }
`;

const SUN_FRAG = NOISE + /* glsl */ `
  uniform float uTime;
  uniform vec3 uA;
  uniform vec3 uB;
  varying vec3 vN; varying vec3 vP; varying vec3 vView;
  void main() {
    float g = fbm(vP * 3.5 + vec3(0.0, uTime * 0.06, uTime * 0.04));
    float g2 = fbm(vP * 9.0 - uTime * 0.05);
    vec3 col = mix(uA, uB, clamp(g * 1.5, 0.0, 1.0));
    col *= 0.75 + 0.6 * g + 0.35 * g2;
    float fres = pow(1.0 - max(dot(normalize(vN), vView), 0.0), 2.0);
    col += uB * fres * 0.9;
    gl_FragColor = vec4(col * 1.35, 1.0);
  }
`;

const PLANET_FRAG = NOISE + /* glsl */ `
  uniform float uTime;
  uniform vec3 uA;
  uniform vec3 uB;
  uniform vec3 uC;
  varying vec3 vN; varying vec3 vP; varying vec3 vView;
  void main() {
    float warp = fbm(vP * 3.0 + uTime * 0.02) * 0.7;
    float band = fbm(vec3(vP.y * 5.0 + warp, vP.x * 0.7, vP.z * 0.7));
    vec3 col = mix(uA, uB, band);
    col = mix(col, uC, smoothstep(0.55, 0.95, fbm(vP * 6.0 + 3.7)));
    float light = 0.4 + 0.75 * max(dot(normalize(vN), normalize(vec3(0.6, 0.5, 0.8))), 0.0);
    col *= light;
    float fres = pow(1.0 - max(dot(normalize(vN), vView), 0.0), 2.5);
    col += uB * fres * 0.45;
    gl_FragColor = vec4(col, 1.0);
  }
`;

const RING_VERT = /* glsl */ `
  varying vec3 vLocal;
  void main() {
    vLocal = position;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const RING_FRAG = /* glsl */ `
  uniform vec3 uCol;
  uniform float uInner;
  uniform float uOuter;
  varying vec3 vLocal;
  void main() {
    float r = length(vLocal.xy);
    float t = clamp((r - uInner) / (uOuter - uInner), 0.0, 1.0);
    float bands = 0.45 + 0.35 * sin(t * 55.0) + 0.2 * fract(sin(t * 137.13) * 43758.55);
    float a = bands * smoothstep(0.0, 0.1, t) * (1.0 - smoothstep(0.82, 1.0, t));
    gl_FragColor = vec4(uCol, a * 0.75);
  }
`;

// deep / bright / accent per cluster — close-up palette matches the distant tint
const PALETTES: Record<string, [string, string, string]> = {
  design: ["#a83a2a", "#ffb28a", "#ffd166"],
  research: ["#24407a", "#8ab4ff", "#dce8ff"],
  ai: ["#5a2ba8", "#c9a2ff", "#ff8ab8"],
  engineering: ["#1a4a7a", "#7de3ff", "#b0fff2"],
  product: ["#7a4a10", "#ffd166", "#ffedc2"],
  leadership: ["#7a2444", "#ff8ab8", "#ffd2e1"],
  sidequest: ["#4a5a50", "#a8c4b0", "#d6ffe3"], // moon rock, mossy
  career: ["#2b3fae", "#a9c6ff", "#7de3ff"],
};
const JOB_PALETTE: [string, string, string] = ["#8a6a30", "#ffd9a0", "#e8c8a0"]; // Saturn creams

function hashId(id: string) {
  let h = 0;
  for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) | 0;
  return Math.abs(h);
}

export function orbKind(node: GalaxyNode) {
  return node.type === "skill" ? "sun" : node.type === "egg" ? "moon" : "planet";
}
export function orbRadius(node: GalaxyNode) {
  const kind = orbKind(node);
  return kind === "sun" ? 0.62 : kind === "moon" ? 0.34 : 0.58;
}
export function orbRinged(node: GalaxyNode) {
  return orbKind(node) === "planet" && hashId(node.id) % 2 === 0;
}
/** Widest visible world-space radius of the close-up body (ring included) —
 *  the scene uses it to push the focused label clear of the artwork. */
export function orbExtent(node: GalaxyNode) {
  const r = orbRadius(node);
  return orbRinged(node) ? r * 2.35 : r * 1.25;
}

export type FocusOrbProps = {
  node: GalaxyNode;
  reduced: boolean;
  /** shared soft radial-gradient texture (for the corona sprite) */
  glowTex: THREE.Texture;
};

export function FocusOrb({ node, reduced, glowTex }: FocusOrbProps) {
  const groupRef = useRef<THREE.Group>(null);
  const matRef = useRef<THREE.ShaderMaterial>(null);
  const scaleRef = useRef(0.001);

  const kind = orbKind(node);
  const radius = orbRadius(node);
  const ringed = orbRinged(node);

  const [colA, colB, colC] = useMemo(() => {
    const p = node.type === "job" ? JOB_PALETTE : PALETTES[node.cluster] ?? PALETTES.career;
    return p.map((h) => new THREE.Color(h)) as [THREE.Color, THREE.Color, THREE.Color];
  }, [node]);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uA: { value: colA },
      uB: { value: colB },
      uC: { value: colC },
    }),
    [colA, colB, colC],
  );
  const ringUniforms = useMemo(
    () => ({
      uCol: { value: colB.clone().lerp(new THREE.Color("#ffffff"), 0.2) },
      uInner: { value: radius * 1.35 },
      uOuter: { value: radius * 2.3 },
    }),
    [colB, radius],
  );

  useFrame((_, dt) => {
    const t = Math.min(dt, 0.05);
    if (!reduced && matRef.current) matRef.current.uniforms.uTime.value += t;
    const g = groupRef.current;
    if (g) {
      // ease-in scale so the body blooms out of the point star
      scaleRef.current += (1 - scaleRef.current) * Math.min(1, t * (reduced ? 60 : 4.5));
      g.scale.setScalar(scaleRef.current);
      if (!reduced) g.rotation.y += t * 0.12;
    }
  });

  return (
    // Clicks on the body must not read as "missed" (which would unfocus).
    <group ref={groupRef} onClick={(e) => e.stopPropagation()}>
      <mesh>
        <sphereGeometry args={[radius, 48, 48]} />
        <shaderMaterial
          ref={matRef}
          vertexShader={ORB_VERT}
          fragmentShader={kind === "planet" || kind === "moon" ? PLANET_FRAG : SUN_FRAG}
          uniforms={uniforms}
        />
      </mesh>

      {ringed && (
        <mesh rotation={[Math.PI / 2 - 0.35, 0, 0.25]}>
          <ringGeometry args={[radius * 1.35, radius * 2.3, 96]} />
          <shaderMaterial
            vertexShader={RING_VERT}
            fragmentShader={RING_FRAG}
            uniforms={ringUniforms}
            transparent
            side={THREE.DoubleSide}
            depthWrite={false}
          />
        </mesh>
      )}

      {/* corona — suns flare, planets keep a faint atmosphere halo */}
      <sprite scale={[radius * (kind === "sun" ? 6 : 3.2), radius * (kind === "sun" ? 6 : 3.2), 1]}>
        <spriteMaterial
          map={glowTex}
          color={colB}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          opacity={kind === "sun" ? 0.55 : 0.22}
        />
      </sprite>
    </group>
  );
}
