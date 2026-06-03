"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

// ---------------------------------------------------------------------------
// Backlit orb = flat radial ramp on a billboard quad. Colour ramp, OUTSIDE -> IN:
//   diffuse MAGENTA glow -> hot ORANGE rim -> warm YELLOW -> jade GREEN -> mint core.
// Every band is a wide gaussian so the whole thing is a soft watercolour melt with
// a very diffuse outer edge (no hard silhouette).
//
// Each orb carries a Photoshop-style vertical layer-mask (uMaskX) that reveals only
// its LEFT portion. The MASK lives on the quad's fixed uv, so the visible window
// stays put on screen; the orb CONTENT is shifted within it (uShift) so each orb
// gently waxes/wanes in place instead of the whole slice floating around.
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
  uniform vec3  uMag;       // diffuse magenta outer glow (outermost)
  uniform vec3  uOrange;    // hot orange rim (the bright backlit edge)
  uniform vec3  uYellow;    // warm yellow, just inside the orange
  uniform vec3  uGreen;     // jade / seafoam transition
  uniform vec3  uPale;      // mint core (light cyan in the right orbs)
  uniform float uMagR;      // magenta halo centre radius (outermost)
  uniform float uOrangeR;   // orange rim centre radius
  uniform float uYellowR;   // yellow band centre radius
  uniform float uGreenR;    // jade band centre radius
  uniform float uPaleR;     // mint core radius
  uniform float uBandS;     // band softness (bigger = mushier watercolour melt)
  uniform float uEdge;      // r where the disc fades to nothing
  uniform float uFeather;   // width of that fade (diffuse edge)
  uniform float uBright;
  uniform float uSeed;      // per-orb noise seed
  uniform float uMaskX;     // PS-style layer mask: reveal vUv.x < uMaskX (clean cut on the right)
  uniform float uMaskFeat;  // softness of that vertical cut
  uniform vec2  uShift;     // offset of the orb CONTENT within the fixed mask window
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
    // Mask + quad vignette use the FIXED quad uv so the cut never moves on screen.
    // One-sided cut: reveal the disc's LEFT part up to uMaskX. The disc's own
    // rounded left edge supplies the curved rim, so each panel reads as the EDGE
    // OF AN ORB (a "D" crescent), and the clean cut on the right is the dark
    // separator. The orb body to the right of the cut stays masked off.
    float qr   = length(vUv - 0.5) * 2.0;
    float mask = 1.0 - smoothstep(uMaskX, uMaskX + uMaskFeat, vUv.x);
    // vignette sits far out (the disc closes by qr~0.92 at most) purely as
    // quad-corner insurance — it never clips the diffuse edge, so the soft
    // falloff is constant at every shift position.
    float vig  = 1.0 - smoothstep(0.94, 1.12, qr);

    // The orb CONTENT slides horizontally behind the fixed cut (uShift), so the
    // visible crescent waxes and wanes in place — sliver, then fuller, then back.
    vec2 p = (vUv - 0.5) + uShift;
    float r = length(p) * 2.0;

    // ORGANIC WARP: seamless cartesian noise so the bands melt into slightly
    // irregular ovals (no angular seam, no lava blob).
    float n  = vnoise(p * 3.0 + vec2(uSeed, uTime * 0.1));
    float n2 = vnoise(p * 6.0 - vec2(uTime * 0.08, uSeed));
    r += (n - 0.5) * 0.05 + (n2 - 0.5) * 0.025;

    // WATERCOLOUR BANDS: each colour is a wide gaussian centred at its radius so
    // neighbours bleed through with no ring boundaries. Magenta is broad + diffuse
    // (the outer glow); orange is the defined bright rim; mint fully owns the centre.
    float wMag    = gauss(r - uMagR,    uBandS * 1.5) * 1.2;   // wide diffuse halo
    float wOrange = gauss(r - uOrangeR, uBandS * 1.0);         // defined bright rim
    float wYellow = gauss(r - uYellowR, uBandS * 1.05);        // bridges orange->jade
    float wGreen  = gauss(r - uGreenR,  uBandS * 1.15) * 0.92; // soft jade, not a ring
    float wPale   = max(gauss(max(r - uPaleR, 0.0), uBandS * 1.05),
                        1.0 - smoothstep(0.0, uPaleR + uBandS * 0.9, r));

    float sum = wMag + wOrange + wYellow + wGreen + wPale + 1e-4;
    vec3 col = (uMag * wMag + uOrange * wOrange + uYellow * wYellow +
                uGreen * wGreen + uPale * wPale) / sum;

    // backlit glow: the orange rim is brightest, magenta halo glows softly, the
    // mint core lifts only a touch so the interior stays luminous but not blown out.
    col *= uBright * (1.0 + 0.62 * (wOrange / sum) + 0.38 * (wMag / sum)
                          + 0.22 * (wYellow / sum) + 0.16 * (wPale / sum));

    // very diffuse soft edge + fixed-window mask & vignette
    float a = 1.0 - smoothstep(uEdge, uEdge + uFeather, r);
    a *= vig * mask;
    a = clamp(a, 0.0, 1.0);

    gl_FragColor = vec4(col, a);
  }
`;

type OrbDef = {
  pos: [number, number, number];
  size: number; // quad size (the orb's true diameter — varies big->small, left->right)
  pale: THREE.Color; // mint core
  maskX: number; // one-sided cut: reveal vUv.x < maskX (small = thin sliver of the orb)
  maskFeat: number; // softness of that vertical cut
  bright: number;
  drift: number; // amplitude of the in-place wax/wane (how much the orb slides behind its cut)
  seed: number; // noise seed so each orb warps differently
};

// Shared colour DNA + radial structure for every orb (ramp OUTSIDE -> IN):
//   magenta glow -> orange rim -> yellow -> jade -> mint core.
// Radii are normalised to the quad; per-orb we only vary size, mask reveal,
// brightness and the core tint. The mask does the "how much of the disc shows"
// work (left = sliver of magenta/orange, right = whole disc).
const MAG = new THREE.Color("#ff2f7e"); // diffuse magenta outer glow
const ORANGE = new THREE.Color("#ff8526"); // hot orange rim (brightest band)
const YELLOW = new THREE.Color("#ffcf52"); // warm yellow between orange and jade
const GREEN = new THREE.Color("#3fc4ad"); // clean jade / seafoam transition
// All radii are deliberately SMALL relative to the quad (which spans r up to ~1.4
// at the corners). The whole disc + its long diffuse fade closes out by r ~= 0.68,
// so even at the maximum in-mask shift the soft edge never reaches the quad
// boundary — i.e. the diffusion stays soft at ALL shift positions (no sharp clip).
const R = {
  magR: 0.515, // outermost, wide + diffuse
  orangeR: 0.41,
  yellowR: 0.333,
  greenR: 0.246,
  paleR: 0.088,
  bandS: 0.12, // wide => smooth watercolour melt, no concentric "bullseye" rings
  edge: 0.54, // solid disc body fades from here...
  feather: 0.26, // ...over this width => long diffuse magenta edge. Body+fade closes
  //              by r~0.80 (qr<0.92 even at full shift) so it never hits the quad edge.
};

function useOrbDefs(): OrbDef[] {
  return useMemo(() => {
    const C = (h: string) => new THREE.Color(h);
    const CORE_MINT = () => C("#54c2a8"); // minty core (left three, not white)
    const CORE_LIGHT = () => C("#eafaf5"); // near-white cyan-mint centre (right two)
    // Five orbs marching left->right, each masked to reveal progressively more:
    // sliver -> crescent -> half -> most -> whole disc. Brightness ramps up to the
    // right so the row reads with depth. Sized so the row spans a bit more than
    // half the viewport width on the right side.
    // Five orbs of DIFFERENT sizes — biggest on the left, smallest on the right.
    // Each is masked by a one-sided cut revealing its rounded LEFT edge. Because the
    // disc now occupies a small fraction of its quad, sizes are larger numbers than
    // before (the quad is mostly transparent margin). Layout: orbs 1-3 stand apart
    // with clean dark gaps; orbs 4-5 are the merging pair (a near-whole disc + a
    // small satellite necking off its right), running off the right screen edge.
    return [
      // 1 — far-left: BIGGEST orb, cut to a thin magenta/orange rim sliver
      {
        pos: [1.08, 0.05, 0], size: 4.0,
        pale: CORE_MINT(), maskX: 0.33, maskFeat: 0.02,
        bright: 0.85, drift: 0.8, seed: 1.7,
      },
      // 2 — large orb, left crescent: orange rim + yellow + jade
      {
        pos: [1.354, -0.04, 0], size: 3.05,
        pale: CORE_MINT(), maskX: 0.43, maskFeat: 0.024,
        bright: 0.95, drift: 0.95, seed: 4.2,
      },
      // 3 — medium orb, ~half disc: full ramp into the jade core
      {
        pos: [1.864, 0.05, 0], size: 2.2,
        pale: CORE_MINT(), maskX: 0.55, maskFeat: 0.03,
        bright: 1.02, drift: 0.85, seed: 8.9,
      },
      // 4 — small near-WHOLE orb (the merging pair's main body), light cyan centre
      {
        pos: [2.469, -0.02, 0], size: 1.35,
        pale: CORE_LIGHT(), maskX: 0.92, maskFeat: 0.04,
        bright: 1.08, drift: 0.4, seed: 13.3,
      },
      // 5 — far-right: SMALLEST orb, a satellite necking off #4, cut by screen edge
      {
        pos: [2.869, 0.0, 0], size: 0.86,
        pale: CORE_LIGHT(), maskX: 0.95, maskFeat: 0.05,
        bright: 1.12, drift: 0.3, seed: 20.1,
      },
    ];
  }, []);
}

function Orb({ def, group }: { def: OrbDef; group: number }) {
  const ref = useRef<THREE.Mesh>(null);
  const uniforms = useMemo(
    () => ({
      uMag: { value: MAG },
      uOrange: { value: ORANGE },
      uYellow: { value: YELLOW },
      uGreen: { value: GREEN },
      uPale: { value: def.pale },
      uMagR: { value: R.magR },
      uOrangeR: { value: R.orangeR },
      uYellowR: { value: R.yellowR },
      uGreenR: { value: R.greenR },
      uPaleR: { value: R.paleR },
      uBandS: { value: R.bandS },
      uEdge: { value: R.edge },
      uFeather: { value: R.feather },
      uBright: { value: def.bright },
      uSeed: { value: def.seed },
      uMaskX: { value: def.maskX },
      uMaskFeat: { value: def.maskFeat },
      uShift: { value: new THREE.Vector2(0, 0) },
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
    const t = state.clock.elapsedTime;
    // The mesh positions (and therefore the mask windows) stay FIXED. We only
    // animate uShift — the orb content drifts inside its window so each orb gently
    // disappears/reappears in place. Cursor adds a tiny parallax to the content.
    g.children.forEach((c, i) => {
      const d = defs[i];
      const mat = (c as THREE.Mesh).material as THREE.ShaderMaterial;
      const u = mat.uniforms;
      if (!u?.uShift) return;
      if (reduced) {
        (u.uShift.value as THREE.Vector2).set(0, 0);
        return;
      }
      const mx = (mouse.current.x - 0.5) * 0.05;
      const my = (mouse.current.y - 0.5) * 0.03;
      // Slide the orb horizontally behind its fixed cut so the visible crescent
      // clearly waxes and wanes — sometimes a sliver, then fuller, then back. The
      // x amplitude is the dominant motion (that's what changes the reveal).
      (u.uShift.value as THREE.Vector2).set(
        Math.sin(t * 0.32 * d.drift + i * 1.7) * 0.055 * d.drift + mx,
        Math.cos(t * 0.22 * d.drift + i) * 0.022 * d.drift + my,
      );
      u.uTime.value = t;
    });
  });

  return (
    <group position={[-0.25, 0, 0]}>
      <group ref={orbs}>
        {defs.map((def, i) => (
          <Orb key={i} def={def} group={i} />
        ))}
      </group>
    </group>
  );
}
