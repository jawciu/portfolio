"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

// ---------------------------------------------------------------------------
// Backlit orb = flat radial ramp on a billboard quad (the asset orbs read as
// backlit discs, not shaded balls). Ramp from centre outward:
//   pale cyan-white core -> green/teal -> hot ORANGE ring -> diffuse RED edge
// that bleeds softly into black. Every band is a wide smoothstep so the whole
// thing is diffuse, never a hard silhouette.
// ---------------------------------------------------------------------------
const orbVertex = /* glsl */ `
  varying vec2 vUv;
  void main(){
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const orbFragment = /* glsl */ `
  precision highp float;
  uniform vec3  uPale;      // bright cyan-white centre
  uniform vec3  uGreen;     // muted teal mid
  uniform vec3  uOrange;    // hot orange rim (the dominant band)
  uniform vec3  uRed;       // dim coral-pink outer halo
  uniform float uPaleR;     // radius the pale core fills before it falls off
  uniform float uTealR;     // teal band centre radius
  uniform float uOrangeR;   // orange band centre radius (the wide hot rim)
  uniform float uRedR;      // red halo centre radius (outermost)
  uniform float uBandS;     // band softness (bigger = mushier watercolour melt)
  uniform float uEdge;      // r where the disc fades to nothing
  uniform float uFeather;   // width of that fade (diffuse edge)
  uniform float uBright;
  uniform float uSeed;      // per-orb noise seed
  uniform float uMaskX;     // PS-style layer mask: reveal vUv.x < uMaskX, hide right of it
  uniform float uMaskFeat;  // softness of the mask's vertical cut edge
  uniform float uTime;
  varying vec2 vUv;

  float hash(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
  float vnoise(vec2 p){
    vec2 i = floor(p), f = fract(p);
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(mix(hash(i), hash(i + vec2(1,0)), u.x),
               mix(hash(i + vec2(0,1)), hash(i + vec2(1,1)), u.x), u.y);
  }
  float gauss(float x, float s){ float t = x / s; return exp(-t * t); }

  void main(){
    vec2 p = vUv - 0.5;
    float rb = length(p) * 2.0;     // clean base radius (for the quad vignette)
    float r = rb;

    // ORGANIC WARP: seamless cartesian noise so the bands melt into slightly
    // irregular ovals (no angular seam, no lava blob).
    float n  = vnoise(p * 3.0 + vec2(uSeed, uTime * 0.1));
    float n2 = vnoise(p * 6.0 - vec2(uTime * 0.08, uSeed));
    r += (n - 0.5) * 0.06 + (n2 - 0.5) * 0.03;

    // WATERCOLOUR BANDS: each colour is a wide gaussian weight centred at its
    // radius, so neighbours bleed through each other with no ring boundaries.
    // Orange is the widest/dominant; red is broad + dim; teal is a soft blend;
    // pale fully owns the centre.
    float wPale   = max(gauss(max(r - uPaleR, 0.0), uBandS * 0.95),
                        1.0 - smoothstep(0.0, uPaleR + uBandS * 0.7, r));
    float wTeal   = gauss(r - uTealR,   uBandS * 1.0) * 1.1;
    float wOrange = gauss(r - uOrangeR, uBandS * 1.0); // clean visible orange band
    float wRed    = gauss(r - uRedR,    uBandS * 1.2) * 1.5; // prominent red rim that glows outward

    float sum = wPale + wTeal + wOrange + wRed + 1e-4;
    vec3 col = (uPale * wPale + uGreen * wTeal + uOrange * wOrange + uRed * wRed) / sum;

    // backlit glow: the orange + saturated red RIM is the bright thing; the core
    // only lifts a touch (so the interior stays in shadow, not a glowing blob).
    col *= uBright * (1.0 + 0.7 * (wOrange / sum) + 0.55 * (wRed / sum) + 0.12 * (wPale / sum));

    // soft alpha: long diffuse fade into black + vignette so the quad never shows
    float a = 1.0 - smoothstep(uEdge, uEdge + uFeather, r);
    a *= 1.0 - smoothstep(0.95, 1.0, rb);
    // PS-style layer mask: clean vertical cut so each orb shows only its left
    // portion (far-left = sliver, far-right = whole disc). The hard right edge
    // is the dark separator between slices — replaces the old occluder bars.
    a *= 1.0 - smoothstep(uMaskX, uMaskX + uMaskFeat, vUv.x);
    a = clamp(a, 0.0, 1.0);

    gl_FragColor = vec4(col, a);
  }
`;

type OrbDef = {
  pos: [number, number, number];
  size: number; // quad size (diameter incl. glow margin)
  pale: THREE.Color;
  green: THREE.Color;
  orange: THREE.Color;
  red: THREE.Color;
  paleR: number; // pale core radius
  tealR: number; // teal band centre
  orangeR: number; // orange rim centre
  redR: number; // red halo centre
  bandS: number; // band softness
  edge: number;
  feather: number;
  bright: number;
  maskX: number; // PS layer-mask reveal (vUv.x cut): small = mostly masked
  maskFeat: number; // softness of that vertical cut
  drift: number; // per-orb drift phase scale
  seed: number; // noise seed so each orb warps differently
};

// All orbs share one colour DNA (red edge -> orange ring -> green -> pale core).
// Left = larger, red/orange-dominant, very diffuse, smaller pale core.
// Right = smaller, lighter (pale core reaches further), thinner red/orange rings.
// Sizes are kept under the viewport height (~3.1 world units) so each orb is a
// discrete glowing disc on black, not a screen-filling wash.
function useOrbDefs(): OrbDef[] {
  return useMemo(() => {
    const C = (h: string) => new THREE.Color(h);
    // BACKLIT, not self-lit: the orange RIM is the brightest thing; the interior
    // sits in shadow as deep jade/teal (left orbs) and only lifts to light cyan
    // in the very centre of the right orbs. Core colour is GREEN, not white.
    const CORE_TEAL = () => C("#4cb89e"); // cool minty interior (left three, lighter not white)
    const CORE_LIGHT = () => C("#d8f3ec"); // near-white cyan-mint centre (right two only)
    const GREEN = () => C("#3fc4ad"); // clean cool jade/seafoam band; overlap w/ orange makes the
    //                                   yellow-green just inside the rim — no neon ring
    const ORANGE = () => C("#fb8c3a"); // hot orange RIM (the bright backlit edge)
    const RED = () => C("#ff2238"); // saturated true red, prominent rim that glows outward
    // Structure (radius fractions, disc edge ~0.9): jade CORE in shadow -> soft
    // jade field -> bright orange RIM -> saturated RED outer rim/halo. Per-orb
    // maskX reveals more of the disc left->right: far-left a dim red sliver,
    // far-right the whole disc + satellite. The mask's hard right edge is the
    // dark separator between slices (replaces the old occluder bars). Brightness
    // ramps up left->right so the row reads with depth, not as equal blobs.
    return [
      // far-left: a dim sliver — almost fully masked, reads as a red/pink edge
      {
        pos: [-1.4, 0.12, -0.2], size: 1.7,
        pale: CORE_TEAL(), green: GREEN(), orange: ORANGE(), red: RED(),
        paleR: 0.14, tealR: 0.42, orangeR: 0.72, redR: 0.88, bandS: 0.3,
        edge: 0.8, feather: 0.34, bright: 0.82, maskX: 0.13, maskFeat: 0.025,
        drift: 1.0, seed: 1.7,
      },
      // left: crescent — jade interior in shadow behind the orange/red rim
      {
        pos: [-0.5, -0.06, -0.05], size: 1.7,
        pale: CORE_TEAL(), green: GREEN(), orange: ORANGE(), red: RED(),
        paleR: 0.22, tealR: 0.48, orangeR: 0.75, redR: 0.9, bandS: 0.26,
        edge: 0.82, feather: 0.3, bright: 0.92, maskX: 0.4, maskFeat: 0.03,
        drift: 0.8, seed: 4.2,
      },
      // middle: most of the disc — jade core, soft jade field, orange + red rim
      {
        pos: [0.45, 0.05, 0.12], size: 1.65,
        pale: CORE_TEAL(), green: GREEN(), orange: ORANGE(), red: RED(),
        paleR: 0.28, tealR: 0.52, orangeR: 0.78, redR: 0.92, bandS: 0.23,
        edge: 0.84, feather: 0.26, bright: 1.0, maskX: 0.62, maskFeat: 0.035,
        drift: 0.65, seed: 8.9,
      },
      // right: nearly whole disc — centre lifts to light cyan, clean jade field
      {
        pos: [1.32, -0.03, 0.26], size: 1.5,
        pale: CORE_LIGHT(), green: GREEN(), orange: ORANGE(), red: RED(),
        paleR: 0.4, tealR: 0.6, orangeR: 0.8, redR: 0.93, bandS: 0.2,
        edge: 0.86, feather: 0.22, bright: 1.06, maskX: 0.9, maskFeat: 0.045,
        drift: 0.5, seed: 13.3,
      },
      // far-right satellite: smallest, fully revealed, light centre, thin rim
      {
        pos: [2.12, 0.0, 0.4], size: 0.64,
        pale: CORE_LIGHT(), green: GREEN(), orange: ORANGE(), red: RED(),
        paleR: 0.5, tealR: 0.7, orangeR: 0.84, redR: 0.95, bandS: 0.16,
        edge: 0.88, feather: 0.18, bright: 1.1, maskX: 1.0, maskFeat: 0.05,
        drift: 0.4, seed: 20.1,
      },
    ];
  }, []);
}

function Orb({ def, group }: { def: OrbDef; group: number }) {
  const ref = useRef<THREE.Mesh>(null);
  const uniforms = useMemo(
    () => ({
      uPale: { value: def.pale },
      uGreen: { value: def.green },
      uOrange: { value: def.orange },
      uRed: { value: def.red },
      uPaleR: { value: def.paleR },
      uTealR: { value: def.tealR },
      uOrangeR: { value: def.orangeR },
      uRedR: { value: def.redR },
      uBandS: { value: def.bandS },
      uEdge: { value: def.edge },
      uFeather: { value: def.feather },
      uBright: { value: def.bright },
      uMaskX: { value: def.maskX },
      uMaskFeat: { value: def.maskFeat },
      uSeed: { value: def.seed },
      uTime: { value: 0 },
    }),
    [def],
  );
  return (
    <mesh ref={ref} position={def.pos} renderOrder={group}>
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

export function DistortedOrb({
  mouse,
  reduced = false,
}: {
  mouse: React.RefObject<THREE.Vector2>;
  reduced?: boolean;
}) {
  const orbs = useRef<THREE.Group>(null);
  const defs = useOrbDefs();

  useFrame((state) => {
    const g = orbs.current;
    if (!g) return;
    if (reduced) {
      g.position.x = 0;
      g.position.y = 0;
      g.children.forEach((c, i) => {
        c.position.x = defs[i].pos[0];
        c.position.y = defs[i].pos[1];
      });
      return;
    }
    const t = state.clock.elapsedTime;
    // whole row breathes left/right + cursor parallax
    g.position.x = Math.sin(t * 0.12) * 0.18 + (mouse.current.x - 0.5) * 0.4;
    g.position.y = (mouse.current.y - 0.5) * 0.15;
    // each orb drifts on its own slow path so the visible slices keep changing
    g.children.forEach((c, i) => {
      const d = defs[i];
      c.position.x = d.pos[0] + Math.sin(t * 0.18 * d.drift + i) * 0.14 * d.drift;
      c.position.y = d.pos[1] + Math.cos(t * 0.15 * d.drift + i * 1.7) * 0.12;
      const mat = (c as THREE.Mesh).material as THREE.ShaderMaterial;
      if (mat.uniforms?.uTime) mat.uniforms.uTime.value = t;
    });
  });

  return (
    <group position={[0.85, 0, 0]}>
      <group ref={orbs}>
        {defs.map((def, i) => (
          <Orb key={i} def={def} group={i} />
        ))}
      </group>
    </group>
  );
}
