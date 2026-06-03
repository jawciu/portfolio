"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

// ---------------------------------------------------------------------------
// Backlit orb = radial colour ramp on a billboard quad. Ramp OUTSIDE -> IN:
//   diffuse MAGENTA glow -> hot ORANGE rim -> warm YELLOW -> jade GREEN -> mint core.
// Wide gaussian bands => soft watercolour melt with a very diffuse outer edge.
//
// LEFT THREE orbs: each is a big disc revealed by a one-sided cut (uMaskX) to a
// thin LEFT-edge crescent. The cut is fixed on screen; the disc slides behind it
// (uShift) so the crescent waxes/wanes in place — and orb 1 even slides fully past
// its cut and vanishes, then returns.
//
// RIGHT PAIR: a single metaball quad (see mergedFragment) where two discs share
// one smooth-union field, so their magenta/yellow/green bands fuse into one
// continuous shape (a neck), instead of two discs stacked on top of each other.
// ---------------------------------------------------------------------------
const orbVertex = /* glsl */ `
  varying vec2 vUv;
  void main(){
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

// Shared GLSL helpers + band evaluation (kept identical between the two shaders so
// the single orbs and the merged pair read as the same material).
const glslCommon = /* glsl */ `
  float hash(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
  float vnoise(vec2 p){
    vec2 i = floor(p), f = fract(p);
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(mix(hash(i), hash(i + vec2(1,0)), u.x),
               mix(hash(i + vec2(0,1)), hash(i + vec2(1,1)), u.x), u.y);
  }
  float gauss(float x, float s){ float t = x / s; return exp(-t * t); }

  uniform vec3  uMag;
  uniform vec3  uOrange;
  uniform vec3  uYellow;
  uniform vec3  uGreen;
  uniform vec3  uPale;
  uniform float uMagR;
  uniform float uOrangeR;
  uniform float uYellowR;
  uniform float uGreenR;
  uniform float uPaleR;
  uniform float uBandS;
  uniform float uEdge;
  uniform float uFeather;
  uniform float uBright;

  // Map a radius r (0 at the core, ~uEdge at the disc edge) to the watercolour ramp.
  vec3 bandColour(float r, out float alpha){
    float wMag    = gauss(r - uMagR,    uBandS * 1.5) * 1.2;
    float wOrange = gauss(r - uOrangeR, uBandS * 1.0);
    float wYellow = gauss(r - uYellowR, uBandS * 1.05);
    float wGreen  = gauss(r - uGreenR,  uBandS * 1.15);
    float wPale   = max(gauss(max(r - uPaleR, 0.0), uBandS * 1.05),
                        1.0 - smoothstep(0.0, uPaleR + uBandS * 0.9, r));
    float sum = wMag + wOrange + wYellow + wGreen + wPale + 1e-4;
    vec3 col = (uMag * wMag + uOrange * wOrange + uYellow * wYellow +
                uGreen * wGreen + uPale * wPale) / sum;
    col *= uBright * (1.0 + 0.6 * (wOrange / sum) + 0.36 * (wMag / sum)
                          + 0.2 * (wYellow / sum) + 0.12 * (wPale / sum));
    alpha = 1.0 - smoothstep(uEdge, uEdge + uFeather, r);
    return col;
  }
`;

const orbFragment = /* glsl */ `
  precision highp float;
  uniform float uSeed;
  uniform float uMaskX;     // one-sided cut: reveal vUv.x < uMaskX (clean separator on the right)
  uniform float uMaskFeat;
  uniform vec2  uShift;     // slides the disc behind the fixed cut (wax/wane in place)
  uniform float uTime;
  varying vec2 vUv;
  ${glslCommon}

  void main(){
    float qr   = length(vUv - 0.5) * 2.0;
    float mask = 1.0 - smoothstep(uMaskX, uMaskX + uMaskFeat, vUv.x);
    float vig  = 1.0 - smoothstep(0.94, 1.12, qr);

    vec2 p = (vUv - 0.5) + uShift;
    float r = length(p) * 2.0;
    float n  = vnoise(p * 3.0 + vec2(uSeed, uTime * 0.1));
    float n2 = vnoise(p * 6.0 - vec2(uTime * 0.08, uSeed));
    r += (n - 0.5) * 0.05 + (n2 - 0.5) * 0.025;

    float a;
    vec3 col = bandColour(r, a);
    a *= vig * mask;
    a = clamp(a, 0.0, 1.0);
    gl_FragColor = vec4(col, a);
  }
`;

// Merged pair: TWO disc fields joined by a polynomial smooth-min so the iso-contours
// (and therefore every colour band) wrap continuously around both — a real metaball
// neck. The bands are tuned with a thinner warm rim + wider green so the centres read
// as green/light-green rather than an intense white.
const mergedFragment = /* glsl */ `
  precision highp float;
  uniform float uSeed;
  uniform vec2  uCenterA;   // disc centres in centred-uv space
  uniform vec2  uCenterB;
  uniform float uRadA;      // body radii (uv)
  uniform float uRadB;
  uniform float uK;         // smooth-union amount (neck thickness)
  uniform vec2  uShift;     // gentle shared bob
  uniform float uTime;
  varying vec2 vUv;
  ${glslCommon}

  float smin(float a, float b, float k){
    float h = clamp(0.5 + 0.5 * (b - a) / k, 0.0, 1.0);
    return mix(b, a, h) - k * h * (1.0 - h);
  }

  void main(){
    float qr  = length(vUv - 0.5) * 2.0;
    float vig = 1.0 - smoothstep(0.94, 1.12, qr);

    vec2 p = (vUv - 0.5) + uShift;
    // distance to each centre, normalised so the body edge maps to r = uEdge
    float dA = length(p - uCenterA) / uRadA * uEdge;
    float dB = length(p - uCenterB) / uRadB * uEdge;
    float r  = smin(dA, dB, uK);
    float n  = vnoise(p * 3.0 + vec2(uSeed, uTime * 0.1));
    r += (n - 0.5) * 0.04;

    float a;
    vec3 col = bandColour(r, a);
    a *= vig;
    a = clamp(a, 0.0, 1.0);
    gl_FragColor = vec4(col, a);
  }
`;

// ---------------------------------------------------------------------------
// Shared colours.
const MAG = new THREE.Color("#ff2f7e"); // diffuse magenta outer glow
const ORANGE = new THREE.Color("#ff8526"); // hot orange rim (brightest band)
const YELLOW = new THREE.Color("#ffcf52"); // warm yellow between orange and jade
const GREEN = new THREE.Color("#3fc4ad"); // clean jade / seafoam transition
const CORE_MINT = new THREE.Color("#54c2a8"); // minty core for the left slivers

// Band radii for the LEFT slivers (we mostly see their outer rim).
const R = {
  magR: 0.515,
  orangeR: 0.41,
  yellowR: 0.333,
  greenR: 0.246,
  paleR: 0.088,
  bandS: 0.12,
  edge: 0.54,
  feather: 0.26,
};

// Band radii for the MERGED pair: warm rim squeezed into a THIN band near the edge,
// green pulled way in to fill most of the interior, with a generous light-GREEN core
// (deliberately not white — the white centre read too intense).
const RM = {
  magR: 0.6,
  orangeR: 0.55,
  yellowR: 0.49,
  greenR: 0.33,
  paleR: 0.14,
  bandS: 0.125,
  edge: 0.62,
  feather: 0.27,
};
const CORE_LIGHT = new THREE.Color("#bdeed9"); // light mint-GREEN centre (no harsh white)

type OrbDef = {
  pos: [number, number, number];
  size: number;
  maskX: number; // one-sided cut (small => thin sliver of a big disc)
  maskFeat: number;
  bright: number;
  amp: number; // horizontal wax/wane amplitude
  ampY: number; // gentle vertical bob
  bias: number; // base x offset (negative => disc spends more time slid past its cut = hidden)
  speed: number;
  phase: number;
  seed: number;
};

// The three left orbs: biggest -> smallest, each revealed only as a thin crescent
// and oscillating. Positions are chosen so that even at each orb's WIDEST wax its
// left edge stays ~0.08 short of the orb on its left (almost touching, never merging).
// Orb 1 carries a negative bias + larger amp so it thins to nothing and returns.
const LEFT_ORBS: OrbDef[] = [
  {
    // Stays a THIN sliver at all times: small amp so even its widest point is a
    // slither, with a negative bias so it thins to nothing and returns. It never
    // opens into a big crescent.
    pos: [1.0, 0.05, 0], size: 4.0, maskX: 0.28, maskFeat: 0.02,
    bright: 0.85, amp: 0.035, ampY: 0.018, bias: -0.03, speed: 0.3, phase: 0.0, seed: 1.7,
  },
  {
    pos: [1.2465, -0.04, 0], size: 3.05, maskX: 0.36, maskFeat: 0.024,
    bright: 0.95, amp: 0.06, ampY: 0.018, bias: 0.0, speed: 0.34, phase: 2.1, seed: 4.2,
  },
  {
    pos: [1.617, 0.05, 0], size: 2.2, maskX: 0.44, maskFeat: 0.03,
    bright: 1.02, amp: 0.056, ampY: 0.016, bias: 0.0, speed: 0.31, phase: 4.0, seed: 8.9,
  },
];

function leftUniforms(def: OrbDef) {
  return {
    uMag: { value: MAG }, uOrange: { value: ORANGE }, uYellow: { value: YELLOW },
    uGreen: { value: GREEN }, uPale: { value: CORE_MINT },
    uMagR: { value: R.magR }, uOrangeR: { value: R.orangeR }, uYellowR: { value: R.yellowR },
    uGreenR: { value: R.greenR }, uPaleR: { value: R.paleR }, uBandS: { value: R.bandS },
    uEdge: { value: R.edge }, uFeather: { value: R.feather }, uBright: { value: def.bright },
    uSeed: { value: def.seed }, uMaskX: { value: def.maskX }, uMaskFeat: { value: def.maskFeat },
    uShift: { value: new THREE.Vector2(def.bias, 0) }, uTime: { value: 0 },
  };
}

function Orb({
  def, order, mouse, reduced,
}: {
  def: OrbDef;
  order: number;
  mouse: React.RefObject<THREE.Vector2>;
  reduced: boolean;
}) {
  const ref = useRef<THREE.Mesh>(null);
  const uniforms = useMemo(() => leftUniforms(def), [def]);

  useFrame((state) => {
    const u = (ref.current?.material as THREE.ShaderMaterial | undefined)?.uniforms;
    if (!u) return;
    if (reduced) {
      (u.uShift.value as THREE.Vector2).set(def.bias, 0);
      return;
    }
    const t = state.clock.elapsedTime;
    const mx = (mouse.current.x - 0.5) * 0.05;
    const my = (mouse.current.y - 0.5) * 0.03;
    (u.uShift.value as THREE.Vector2).set(
      def.bias + Math.sin(t * def.speed + def.phase) * def.amp + mx,
      Math.cos(t * def.speed * 0.8 + def.phase) * def.ampY + my,
    );
    u.uTime.value = t;
  });

  return (
    <mesh ref={ref} position={def.pos} renderOrder={order}>
      <planeGeometry args={[def.size, def.size]} />
      <shaderMaterial
        vertexShader={orbVertex}
        fragmentShader={orbFragment}
        uniforms={uniforms}
        transparent
        depthTest={false}
        depthWrite={false}
        blending={THREE.NormalBlending}
        toneMapped={false}
      />
    </mesh>
  );
}

// The merging pair (orbs 4 & 5). A single quad; the smooth-union joins the near-whole
// orb (A) and its smaller satellite (B) into one continuous shape running off the
// right screen edge.
function MergedOrbs({
  mouse, reduced, order,
}: {
  mouse: React.RefObject<THREE.Vector2>;
  reduced: boolean;
  order: number;
}) {
  const ref = useRef<THREE.Mesh>(null);
  const uniforms = useMemo(
    () => ({
      uMag: { value: MAG }, uOrange: { value: ORANGE }, uYellow: { value: YELLOW },
      uGreen: { value: GREEN }, uPale: { value: CORE_LIGHT },
      uMagR: { value: RM.magR }, uOrangeR: { value: RM.orangeR }, uYellowR: { value: RM.yellowR },
      uGreenR: { value: RM.greenR }, uPaleR: { value: RM.paleR }, uBandS: { value: RM.bandS },
      uEdge: { value: RM.edge }, uFeather: { value: RM.feather }, uBright: { value: 1.0 },
      uSeed: { value: 30.0 },
      uCenterA: { value: new THREE.Vector2(-0.06, 0.0) },
      uCenterB: { value: new THREE.Vector2(0.14, 0.04) },
      uRadA: { value: 0.26 }, uRadB: { value: 0.16 }, uK: { value: 0.24 },
      uShift: { value: new THREE.Vector2(0, 0) }, uTime: { value: 0 },
    }),
    [],
  );

  useFrame((state) => {
    const u = (ref.current?.material as THREE.ShaderMaterial | undefined)?.uniforms;
    if (!u) return;
    if (reduced) {
      (u.uShift.value as THREE.Vector2).set(0, 0);
      return;
    }
    const t = state.clock.elapsedTime;
    const mx = (mouse.current.x - 0.5) * 0.04;
    const my = (mouse.current.y - 0.5) * 0.025;
    // The satellite slides toward / away from the main orb so the pair MERGES MORE
    // (neck thickens, nearly one blob) then MERGES LESS (neck thins, more distinct)
    // — never fully separating. The neck softness breathes in sync.
    const sep = 0.14 + Math.sin(t * 0.28) * 0.05; // satellite distance oscillates (closer avg => more solid neck)
    (u.uCenterB.value as THREE.Vector2).set(sep, 0.04 + Math.cos(t * 0.21) * 0.02);
    u.uK.value = 0.26 - Math.sin(t * 0.28) * 0.07; // closer => thicker neck; breathes more
    // gentle shared bob on top
    (u.uShift.value as THREE.Vector2).set(
      Math.sin(t * 0.2) * 0.015 + mx,
      Math.cos(t * 0.17) * 0.012 + my,
    );
    u.uTime.value = t;
  });

  return (
    <mesh ref={ref} position={[2.117, -0.01, 0]} renderOrder={order}>
      <planeGeometry args={[1.6, 1.6]} />
      <shaderMaterial
        vertexShader={orbVertex}
        fragmentShader={mergedFragment}
        uniforms={uniforms}
        transparent
        depthTest={false}
        depthWrite={false}
        blending={THREE.NormalBlending}
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
  return (
    <group position={[-0.12, 0, 0]}>
      {LEFT_ORBS.map((def, i) => (
        <Orb key={i} def={def} order={i} mouse={mouse} reduced={reduced} />
      ))}
      <MergedOrbs mouse={mouse} reduced={reduced} order={3} />
    </group>
  );
}
