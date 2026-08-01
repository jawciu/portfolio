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

import { useEffect, useMemo, useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import type { GalaxyNode } from "@/lib/galaxyData";
import { PAINT, PAINT_EVENT } from "./paint";

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
  uniform vec3 uFlare;     // rim flare tint (defaults to uB)
  uniform float uGran;     // granulation cell size — low = big lazy cells
  uniform float uTurb;     // weight of the fine boiling detail
  uniform float uFlareAmt; // rim flare strength
  uniform float uGlow;     // overall exposure
  uniform float uSoft;     // granulation contrast damper: >1 creamier, 1 = baseline
  varying vec3 vN; varying vec3 vP; varying vec3 vView;
  void main() {
    float g = fbm(vP * uGran + vec3(0.0, uTime * 0.06, uTime * 0.04));
    float g2 = fbm(vP * uGran * 2.571 - uTime * 0.05);
    // softness damps the granulation AROUND ITS MEAN (fbm median ≈ 0.47), so
    // texture flattens without shifting exposure or average hue — glow stays
    // the only brightness dial. At uSoft == 1 both lines reduce EXACTLY to
    // the original expressions.
    float k = 1.0 / uSoft;
    float m = 0.47 * (0.6 + 0.35 * uTurb);
    vec3 col = mix(uA, uB, clamp((g * 1.5 - 0.7) * k + 0.7, 0.0, 1.0));
    col *= 0.75 + m + (0.6 * g + 0.35 * g2 * uTurb - m) * k;
    float fres = pow(1.0 - max(dot(normalize(vN), vView), 0.0), 2.0);
    col += uFlare * fres * uFlareAmt;
    gl_FragColor = vec4(col * uGlow, 1.0);
  }
`;

const PLANET_FRAG = NOISE + /* glsl */ `
  uniform float uTime;
  uniform vec3 uA;
  uniform vec3 uB;
  uniform vec3 uC;
  uniform vec3 uD;
  uniform float uBandFreq; // high = gas-giant latitude bands, low = no banding
  uniform float uBlotch;   // high = continent/crater blotches dominate
  uniform float uCloud;    // how much of the uC swirl layer covers the surface
  // optional fifth register + dressing — all default to 0 / uB so every
  // pre-existing four-tone style renders exactly as before
  uniform vec3 uE;         // secondary mottle colour (Io olive, Cog mint)
  uniform float uEAmt;     // 0..1 coverage of the uE mottle layer
  uniform vec3 uPole;      // polar shading tint
  uniform float uPoleAmt;  // 0..1 strength of polar shading
  uniform float uSpeckle;  // 0..1 density of small dark flecks
  uniform vec3 uRim;       // atmosphere rim tint (defaults to uB)
  uniform float uRimAmt;   // fresnel rim strength (default 0.25)
  uniform float uSoft;     // edge-width multiplier: <1 crisper, >1 dreamier, 1 = baseline
  varying vec3 vN; varying vec3 vP; varying vec3 vView;
  // smoothstep with its window scaled around the midpoint by uSoft — the one
  // knob that makes every surface register sharper or blurrier together.
  // At uSoft == 1 this is EXACTLY smoothstep(lo, hi, x): all pre-existing
  // styles render pixel-identical (verified against a frozen baseline).
  float sedge(float lo, float hi, float x) {
    float m = 0.5 * (lo + hi);
    float w = 0.5 * (hi - lo) * uSoft;
    return smoothstep(m - w, m + w, x);
  }
  void main() {
    float warp = fbm(vP * 3.0 + uTime * 0.02) * 0.7;
    // register 1: base terrain / belts between the deep (uA) and lifted (uB) tones
    float band = fbm(vec3(vP.y * uBandFreq + warp, vP.x * uBlotch, vP.z * uBlotch));
    // contrast push relaxes as the surface softens (sqrt so it moves gently)
    band = clamp((band - 0.5) * 1.7 / sqrt(uSoft) + 0.5, 0.0, 1.0);
    vec3 col = mix(uA, uB, band);
    // NOTE on the thresholds below: fbm() here sums 4 octaves of value noise,
    // so it does NOT span 0..1 — measured over 60k points on the sphere it runs
    // 0.13..0.79 with a median of 0.47. The original smoothstep ceilings (0.82,
    // 0.9, 0.95) sat ABOVE anything the noise ever produces, so these layers
    // only ever rendered at a fraction of their strength and their dials felt
    // dead. Every range is now placed inside the real distribution.
    // register 2: dark lanes / maria / storm belts (uD) at a different scale
    float lane = fbm(vP * (2.0 + uBlotch * 1.5) - 5.1 + warp * 0.4);
    col = mix(col, uD, sedge(0.50, 0.62, lane) * 0.65);
    // register 2b: secondary mottle (uE) — its own scale + offset so the
    // patches never align with the uD lanes; sits UNDER the cloud layer
    float mott = fbm(vP * 3.6 - 11.4 + warp * 0.6);
    col = mix(col, uE, sedge(0.46, 0.60, mott) * uEAmt);
    // register 3: cloud / swirl layer (uC)
    float swirl = fbm(vP * 5.0 + 3.7 + warp * 0.5);
    col = mix(col, uC, sedge(0.58 - 0.22 * uCloud, 0.70 - 0.12 * uCloud, swirl));
    // polar shading with a noisy edge so the caps read painted, not stamped
    float pol = smoothstep(0.5, 0.92, abs(vP.y) + (warp - 0.35) * 0.2);
    col = mix(col, uPole, pol * uPoleAmt);
    // small dark flecks (volcanic pits / islets) — darken whatever is there.
    // Frequency 26 put the flecks under a pixel and the 0.8 threshold almost
    // never fired: measured, the dial moved the render LESS than frame noise.
    // Coarser cells + an earlier threshold make it a control you can see.
    float spk = noise(vP * 13.0 + 4.7);
    col = mix(col, col * 0.28, sedge(0.58, 0.88, spk) * uSpeckle);
    // fine grain so no region reads as one flat hue — fades as the surface
    // softens (grit IS sharpness at this frequency), grows when crisped
    col *= 0.82 + (0.36 / (0.6 + 0.4 * uSoft)) * fbm(vP * 11.0 + 7.3);
    float light = 0.34 + 0.62 * max(dot(normalize(vN), normalize(vec3(0.6, 0.5, 0.8))), 0.0);
    col *= light;
    float fres = pow(1.0 - max(dot(normalize(vN), vView), 0.0), 2.5);
    col += uRim * fres * uRimAmt;
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
  uniform vec3 uCol;   // lighter ring dust
  uniform vec3 uColB;  // darker rock tone
  uniform float uInner;
  uniform float uOuter;
  varying vec3 vLocal;
  float h1(float p) { return fract(sin(p * 127.1) * 43758.5453); }
  float n1(float x) {
    float i = floor(x); float f = fract(x);
    f = f * f * (3.0 - 2.0 * f);
    return mix(h1(i), h1(i + 1.0), f);
  }
  void main() {
    float r = length(vLocal.xy);
    float t = clamp((r - uInner) / (uOuter - uInner), 0.0, 1.0);
    // layered 1D noise → bands of genuinely different widths and weights
    // (the old fixed-frequency sin made every ringlet identical)
    float wide = n1(t * 7.0 + 3.1);
    float mid = n1(t * 23.0 + 9.7);
    float fine = n1(t * 90.0 + 31.0);
    float density = smoothstep(0.18, 0.72, wide * 0.55 + mid * 0.3 + fine * 0.15);
    // true divisions (Cassini-like): one broad, one narrow
    float gap1 = 1.0 - 0.9 * smoothstep(0.50, 0.545, t) * (1.0 - smoothstep(0.575, 0.62, t));
    float gap2 = 1.0 - 0.6 * smoothstep(0.80, 0.825, t) * (1.0 - smoothstep(0.84, 0.865, t));
    float a = density * gap1 * gap2
      * smoothstep(0.0, 0.06, t) * (1.0 - smoothstep(0.86, 1.0, t));
    // band-to-band colour variation between dust and rock tones
    vec3 col = mix(uColB, uCol, wide);
    col *= 0.75 + 0.35 * mid;
    gl_FragColor = vec4(col, a * 0.85);
  }
`;

// deep / bright / accent per cluster — sun close-ups match the distant tint
const PALETTES: Record<string, [string, string, string]> = {
  design: ["#a83a2a", "#ffb28a", "#ffd166"],
  research: ["#24407a", "#8ab4ff", "#dce8ff"],
  ai: ["#5a2ba8", "#c9a2ff", "#ff8ab8"],
  engineering: ["#1a4a7a", "#7de3ff", "#b0fff2"],
  product: ["#7a4a10", "#ffd166", "#ffedc2"],
  leadership: ["#7a2444", "#ff8ab8", "#ffd2e1"],
  sidequest: ["#4a5a50", "#a8c4b0", "#d6ffe3"],
  career: ["#2b3fae", "#a9c6ff", "#7de3ff"],
};

// The planetary zoo (from Caroline's reference sheet). Four tones per world
// (deep base / lifted base / cloud accent / dark lane) so surfaces read as
// nuanced registers of one family, not one texture re-hued. `ring` is a
// probability: Saturn-likes always ring, some worlds sometimes, some never.
// Jobs are GAS GIANTS, projects are TERRESTRIAL worlds — picked by id hash
// so each node keeps its planet forever.
type PlanetStyle = {
  a: string; b: string; c: string; d: string;
  bandFreq: number; blotch: number; cloud: number; ring: number;
  // optional fifth-register dressing — omit and the world renders exactly
  // as the classic four-tone shader (all extras default to off)
  e?: string;       // secondary mottle colour
  eAmt?: number;    // 0..1 coverage of the mottle layer
  pole?: string;    // polar shading tint
  poleAmt?: number; // 0..1 polar strength
  speckle?: number; // 0..1 density of small dark flecks
  rim?: string;     // atmosphere rim tint (defaults to b)
  rimAmt?: number;  // fresnel rim strength (defaults to 0.25)
  soft?: number;    // surface edge softness: <1 crisper, >1 blurrier (default 1)
  // ring tones — omit for the default neutral rock/ice dust lerped toward the
  // body hue; set both to give a world deliberately coloured rings
  ringA?: string;   // lighter dust band tone
  ringB?: string;   // darker rock band tone
};
const GIANTS: PlanetStyle[] = [
  { a: "#6b4a2a", b: "#d9c4a0", c: "#e8e0d0", d: "#8f8fa0", bandFreq: 6, blotch: 0.7, cloud: 0.3, ring: 0.5 },  // Jupiter: belt browns, cream zones, grey-blue storms
  { a: "#8f7040", b: "#ddc89f", c: "#efe6cf", d: "#a89060", bandFreq: 4.5, blotch: 0.7, cloud: 0.25, ring: 1 }, // Saturn creams, always ringed
  { a: "#5f4fa8", b: "#c4b8e0", c: "#efe8d9", d: "#3d3270", bandFreq: 3.5, blotch: 0.8, cloud: 0.4, ring: 1 },  // lavender pastel, always ringed
  { a: "#101c66", b: "#3d4fc0", c: "#7f95e8", d: "#0a1240", bandFreq: 4, blotch: 0.6, cloud: 0.15, ring: 0 },   // Neptune: deep blues, faint light bands
];
// Muted 2026-07-31 (Caroline: "some of the planet colours are too crazy") —
// pea green, generic Io and the ice marble pulled toward naturalistic NASA
// reference tones. Each world keeps its identity, just desaturated.
const TERRESTRIALS: PlanetStyle[] = [
  { a: "#4a180e", b: "#b04a2c", c: "#e5e2da", d: "#26100a", bandFreq: 0.6, blotch: 2.4, cloud: 0.55, ring: 0 },  // rust world: char, lava, white cloud veils
  { a: "#152c4d", b: "#6f9dbb", c: "#c9a49c", d: "#081830", bandFreq: 0.7, blotch: 2.2, cloud: 0.5, ring: 0.5 }, // ice marble: slate blues, dusty rose streaks
  { a: "#14523a", b: "#6bb894", c: "#e8ece2", d: "#0d3324", bandFreq: 0.8, blotch: 2.0, cloud: 0.5, ring: 0.5 }, // jade ocean: green depths, white weather
  { a: "#46512c", b: "#93a468", c: "#e0e4d4", d: "#2f381d", bandFreq: 0.7, blotch: 2.0, cloud: 0.45, ring: 0 },  // sage swirl: earthy olive greens
  { a: "#6f6134", b: "#d0c493", c: "#8a5c38", d: "#43391c", bandFreq: 0.9, blotch: 2.2, cloud: 0.35, ring: 0 },  // Io: soft sulphur creams, burnt patches
];
const MOON: PlanetStyle = { a: "#2e2e34", b: "#8f8f96", c: "#c4c4cc", d: "#1c1c22", bandFreq: 0.5, blotch: 2.6, cloud: 0.3, ring: 0 };

// The "Julien Macdonald vibe" — Caroline's live repaint of the Saturn giant
// (2026-08-01): magenta-plum base under the cream Saturn bands, clay dark
// lanes, a warm cream rim and rust ring rock. Always ringed, like its base.
// NOTE: `e` is set with no `eAmt`, so the mottle colour never renders — that
// is exactly the surface she painted and approved, so it is baked as-is.
const JULIEN_STYLE: PlanetStyle = {
  a: "#721d53", b: "#dec7a1", c: "#efe6cf", d: "#a86f61",
  bandFreq: 4.5, blotch: 0.7, cloud: 0.25, ring: 1,
  e: "#c48154",
  rim: "#f8e9e2",
  ringB: "#b15d39",
};

// Skills normally render as suns. These five are drawn as PLANETS instead —
// Caroline wants the Julien Macdonald look on them (see PLANET_OVERRIDES
// below). They are deliberate clones of one style and can each be repainted
// individually later with the live PlanetPainter.
const PLANET_SKILLS = new Set<string>([
  "usability-testing",
  "product-work",
  "zero-to-one",
  "context-switching",
  "organisation",
]);

// Hand-tuned worlds for specific nodes (Caroline's reference photos) —
// checked before the hash pick so these ids never reroll their planet.
const PLANET_OVERRIDES: Record<string, PlanetStyle> = {
  // vector — NASA's Io: pale cream-yellow base, large white plains, olive
  // mottled patches, rust-orange blotches, lavender-grey poles, dark speckles
  // repainted 2026-08-01: violet base under peach terrain and orchid clouds.
  // rimAmt raised 0.18 → 0.65 on her "add a rim pls" (she painted the rim
  // COLOUR but the strength dial was never moved off the old near-off value)
  vector: {
    a: "#622ab7", b: "#e8b2a1", c: "#ddade1", d: "#b4622f",
    e: "#6d743e", eAmt: 0.6,
    pole: "#a09ab0", poleAmt: 0.55,
    speckle: 0.55,
    bandFreq: 0.6, blotch: 2.4, cloud: 0.75, ring: 0,
    rim: "#ccc8ea", rimAmt: 0.65,
  },
  // cog — teal-green marble built around the case study accent #19A072:
  // deep teal ocean, mid-green landmass bands, mint streaks, white cloud
  // swirls, soft pale atmospheric rim
  // cog — Caroline repainted the marble copper 2026-07-31 (structure kept from
  // the teal build: same registers, new base + rim tones)
  cog: {
    a: "#a96232", b: "#d7ab93", c: "#eef7f2", d: "#073028",
    e: "#8fdec2", eAmt: 0.55,
    bandFreq: 2.5, blotch: 1.6, cloud: 0.55, ring: 0,
    rim: "#f2e3d9", rimAmt: 0.65,
  },
  // Painted live by Caroline 2026-07-31 (values copied out of PlanetPainter,
  // merged over each node's previously-hashed base style so the fields she
  // never touched keep the surface she was looking at).
  // eon — deep ocean blue with a dusty pink cloud deck, over the Jupiter giant
  // repainted 2026-08-01: violet base, dusty rose bands, warm cream cloud deck
  eon: {
    a: "#603fab", b: "#caa0b1", c: "#f0daad", d: "#7c7c9c",
    e: "#f0dfc2", eAmt: 0.4,
    poleAmt: 0.45, // no pole colour: shades toward black, as painted
    speckle: 0.45,
    bandFreq: 6, blotch: 0.7, cloud: 0.45, ring: 0.5,
    rim: "#ecb1b1", rimAmt: 0.65,
  },
  // ai design system — navy base with a clay-pink terrain, over the rust world
  "ai-design-system": {
    a: "#0e2249", b: "#c19486", c: "#e5e2da", d: "#26100a",
    bandFreq: 0.6, blotch: 2.4, cloud: 0.55, ring: 0,
    rim: "#df8b72",
  },
  // cog clinic — muted sea-green, over the sage world
  "cog-clinic": {
    a: "#2d5349", b: "#88a59e", c: "#e0e4d4", d: "#2f381d",
    bandFreq: 0.7, blotch: 2.0, cloud: 0.45, ring: 0,
  },
  // wiki whisperer — deep indigo with violet weather, over the jade world.
  // Ringed, with deliberately lilac rings rather than the default neutral dust.
  "wiki-whisperer": {
    a: "#0e1462", b: "#b79edb", c: "#eae3ed", d: "#0e1735",
    e: "#d08ddd", pole: "#270e35",
    bandFreq: 0.8, blotch: 2.0, cloud: 0.5, ring: 1,
    rim: "#b66bb8",
    ringA: "#e0c6ef", ringB: "#6a4a86",
  },
  // burberry — trench camel over the Saturn giant, gold ring rock, no rim
  burberry: {
    a: "#93622a", b: "#bbad9b", c: "#efe6cf", d: "#a89060",
    eAmt: 0, speckle: 0, rimAmt: 0,
    bandFreq: 4.5, blotch: 0.7, cloud: 0.1, ring: 1,
    ringB: "#eebb63",
  },
  // julien macdonald — Caroline's repaint of the Saturn giant, 2026-08-01
  "julien-macdonald": JULIEN_STYLE,
  // The five skills she asked to wear the same look (see PLANET_SKILLS).
  // Identical on purpose; repaint any of them individually later.
  "usability-testing": JULIEN_STYLE,
  "product-work": JULIEN_STYLE,
  "zero-to-one": JULIEN_STYLE,
  "context-switching": JULIEN_STYLE,
  organisation: JULIEN_STYLE,
};

// Suns burn with two fbm tones from their cluster palette plus a handful of
// surface dials. SUN_BASE reproduces the original hardcoded sun exactly, so a
// star with no override renders byte-identical to before these dials existed.
type SunStyle = {
  a: string; b: string;
  gran: number;      // granulation cell size (3.5 = the classic boil)
  turb: number;      // weight of the fine detail register
  flare?: string;    // rim flare tint (defaults to b)
  flareAmt: number;  // rim flare strength
  glow: number;      // exposure
  soft: number;      // granulation contrast damper: >1 creamier (1 = baseline)
  ring: number;      // 0/1 — suns are bare unless a style asks for rings
  ringA?: string; ringB?: string;
};
const SUN_BASE: Omit<SunStyle, "a" | "b"> = { gran: 3.5, turb: 1, flareAmt: 0.9, glow: 1.35, soft: 1, ring: 0 };

// Caroline's call (2026-08-01): every planet defaults to a soft, dreamy
// surface — the crisp look the threshold fix revealed read as too sharp.
// An explicit `soft` on a style (or a painter patch) still wins.
const DEFAULT_PLANET_SOFT = 3;

// Per-id sun overrides (painted live, same panel as the planets).
const SUN_OVERRIDES: Record<string, Partial<SunStyle>> = {
  // (product-work's green sun was removed 2026-08-01 — it renders as a
  // Julien Macdonald planet now, so a sun override would never be read)
  // visual craft — the one skill star Caroline wants wearing rings
  "visual-craft": { ring: 1, ringA: "#f2c9a4", ringB: "#8a4a2c" },
  // painted live 2026-08-01
  "team-leadership": { a: "#792a2a", b: "#dda6b4" },
  "design-systems": { a: "#126d46", b: "#9fb7c1", flare: "#a7a871", gran: 7.75, turb: 1.45, flareAmt: 1 },
  "ai-agents": { a: "#204683", b: "#baabcf", flare: "#a77ae6", gran: 2.75, turb: 0.8, flareAmt: 1.75 },
  "design-engineering": { a: "#201a7a", b: "#8a9eb7", flare: "#764c4c", gran: 4.25 },
  "cross-functional": { a: "#e1dbdd", b: "#d25189", flare: "#e0d4cd", gran: 1.75, turb: 1.6 },
  "prioritisation": { a: "#f5c7d8", b: "#ff8a8a", flare: "#ff0066", glow: 1.45, flareAmt: 1.85, turb: 1.75, gran: 4 },
  // no "a": keeps the leadership cluster's deep tone underneath
  "navigating-ambiguity": { b: "#d095ad", gran: 9.25 },
  "context-design": { a: "#982ba6", b: "#c3af83", gran: 2, turb: 0.8, flareAmt: 1.5, flare: "#ffaca3" },
  "tool-design": { a: "#12229b", b: "#b493e1", gran: 9.25, glow: 1.7 },
  "tokens-in-code": { a: "#341a7a", b: "#85c0d1", flare: "#92c5d3", glow: 1, gran: 2.75 },
  "building-with-agents": { a: "#21103c", b: "#b38fe5", flare: "#bc7bae", gran: 5.5, turb: 1.65, flareAmt: 1.25, glow: 0.95 },
};

/** A sun's tones + dials: cluster palette, then any per-id override. */
export function sunStyle(node: GalaxyNode): SunStyle {
  const p = PALETTES[node.cluster] ?? PALETTES.career;
  return { a: p[0], b: p[1], ...SUN_BASE, ...SUN_OVERRIDES[node.id] };
}

/** Ring dust + rock tones: a style can name them, otherwise they're neutral
 *  rock/ice lerped a little toward the body's lifted base. */
function ringTones(style: { ringA?: string; ringB?: string } | null | undefined, bHex: string): [string, string] {
  const b = new THREE.Color(bHex);
  return [
    style?.ringA ?? `#${new THREE.Color("#c9c0b0").lerp(b, 0.35).getHexString()}`,
    style?.ringB ?? `#${new THREE.Color("#6f6352").lerp(b, 0.2).getHexString()}`,
  ];
}

function hashId(id: string) {
  let h = 0;
  for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) | 0;
  return Math.abs(h);
}

export function orbKind(node: GalaxyNode) {
  // a handful of skills are drawn as planets rather than suns (PLANET_SKILLS)
  if (node.type === "skill" && PLANET_SKILLS.has(node.id)) return "planet";
  return node.type === "skill" ? "sun" : node.type === "egg" ? "moon" : "planet";
}
export function orbRadius(node: GalaxyNode) {
  const kind = orbKind(node);
  return kind === "sun" ? 0.62 : kind === "moon" ? 0.34 : 0.58;
}
export function planetStyle(node: GalaxyNode): PlanetStyle {
  if (node.type === "egg") return MOON;
  const override = PLANET_OVERRIDES[node.id];
  if (override) return override;
  if (node.type === "job") return GIANTS[hashId(node.id) % GIANTS.length];
  // "pl" salt: with the current roster this deals every terrestrial style
  // to at least 3 projects (the bare id starved rust worlds entirely)
  return TERRESTRIALS[hashId(node.id + "pl") % TERRESTRIALS.length];
}
export function orbRinged(node: GalaxyNode) {
  if (orbKind(node) === "sun") return sunStyle(node).ring > 0;
  if (orbKind(node) !== "planet") return false;
  // style.ring is a probability; a second hash bit decides the "maybe" cases
  return (hashId(node.id + "ring") % 100) / 100 < planetStyle(node).ring;
}
/** Widest visible world-space radius of the close-up body (ring included) —
 *  the scene uses it to push the focused label clear of the artwork. */
export function orbExtent(node: GalaxyNode) {
  const r = orbRadius(node);
  return orbRinged(node) ? r * 2.35 : r * 1.25;
}

/** The PlanetPainter panel's view of a node: its kind and the pre-paint base
 *  values for every editable field (suns expose only their two fbm colours). */
export function paintableFor(node: GalaxyNode): { kind: string; values: Record<string, string | number> } {
  const kind = orbKind(node);
  if (kind === "sun") {
    const s = sunStyle(node);
    const [ringA, ringB] = ringTones(s, s.b);
    return {
      kind,
      values: {
        a: s.a, b: s.b, flare: s.flare ?? s.b,
        gran: s.gran, turb: s.turb, flareAmt: s.flareAmt, glow: s.glow, soft: s.soft,
        ...(orbRinged(node) ? { ringA, ringB } : {}),
      },
    };
  }
  const s = planetStyle(node);
  const [ringA, ringB] = ringTones(s, s.b);
  return {
    kind,
    values: {
      a: s.a, b: s.b, c: s.c, d: s.d,
      // mottle falls back to the DARK LANE tone, not the lifted base: mixing
      // the base into itself is why "mottle amount" felt like a dead dial on
      // any world that never named a mottle colour
      e: s.e ?? s.d, eAmt: s.eAmt ?? 0,
      // pole defaults to BLACK, matching the shader's uPole fallback — the
      // panel used to preview s.d here and lied about what you'd render
      pole: s.pole ?? "#000000", poleAmt: s.poleAmt ?? 0,
      speckle: s.speckle ?? 0,
      rim: s.rim ?? s.b, rimAmt: s.rimAmt ?? 0.25,
      cloud: s.cloud, bandFreq: s.bandFreq, blotch: s.blotch,
      soft: s.soft ?? DEFAULT_PLANET_SOFT,
      // ring tones only exist as controls on worlds that actually have rings
      ...(orbRinged(node) ? { ringA, ringB } : {}),
    },
  };
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

  // live paint: the dev-only PlanetPainter mutates PAINT and fires
  // PAINT_EVENT; bumping paintTick re-derives style/colours from the merge
  const [paintTick, setPaintTick] = useState(0);
  useEffect(() => {
    const fn = () => setPaintTick((n) => n + 1);
    window.addEventListener(PAINT_EVENT, fn);
    return () => window.removeEventListener(PAINT_EVENT, fn);
  }, []);

  const style = useMemo(() => {
    if (kind === "sun") return null;
    return { ...planetStyle(node), ...PAINT[node.id] };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- paintTick re-reads the mutable PAINT store
  }, [node, kind, paintTick]);

  const sun = useMemo(() => {
    if (kind !== "sun") return null;
    return { ...sunStyle(node), ...PAINT[node.id] };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- paintTick re-reads the mutable PAINT store
  }, [node, kind, paintTick]);

  const [colA, colB, colC, colD] = useMemo(() => {
    const p: [string, string, string, string] = style
      ? [style.a, style.b, style.c, style.d]
      : [sun!.a, sun!.b, (PALETTES[node.cluster] ?? PALETTES.career)[2], "#000000"];
    return p.map((h) => new THREE.Color(h)) as [THREE.Color, THREE.Color, THREE.Color, THREE.Color];
  }, [node, style, sun]);

  const uniforms = useMemo(() => {
    if (sun) {
      const u: Record<string, THREE.IUniform> = {
        uTime: { value: 0 },
        uA: { value: colA },
        uB: { value: colB },
        uFlare: { value: sun.flare ? new THREE.Color(sun.flare) : colB },
        uGran: { value: sun.gran },
        uTurb: { value: sun.turb },
        uFlareAmt: { value: sun.flareAmt },
        uGlow: { value: sun.glow },
        uSoft: { value: sun.soft },
      };
      return u;
    }
    const u: Record<string, THREE.IUniform> = {
      uTime: { value: 0 },
      uA: { value: colA },
      uB: { value: colB },
      uC: { value: colC },
      uD: { value: colD },
      uBandFreq: { value: style?.bandFreq ?? 0 },
      uBlotch: { value: style?.blotch ?? 0 },
      uCloud: { value: style?.cloud ?? 0 },
      // fifth-register dressing — every world without a mottle colour also has
      // eAmt 0, so the dark-lane fallback changes nothing already baked
      uE: { value: new THREE.Color(style?.e ?? style?.d ?? "#ffffff") },
      uEAmt: { value: style?.eAmt ?? 0 },
      uPole: { value: new THREE.Color(style?.pole ?? "#000000") },
      uPoleAmt: { value: style?.poleAmt ?? 0 },
      uSpeckle: { value: style?.speckle ?? 0 },
      uRim: { value: style?.rim ? new THREE.Color(style.rim) : colB },
      uRimAmt: { value: style?.rimAmt ?? 0.25 },
      uSoft: { value: style?.soft ?? DEFAULT_PLANET_SOFT },
    };
    return u;
  }, [colA, colB, colC, colD, style, sun]);
  const ringUniforms = useMemo(
    () => {
      // default: neutral rock/ice dust with only a hint of the body's hue, the
      // darker tone giving the noise bands something to alternate with. A style
      // (or the painter) can name ringA/ringB for deliberately coloured rings.
      const [ringA, ringB] = ringTones(style ?? sun, `#${colB.getHexString()}`);
      return {
        uCol: { value: new THREE.Color(ringA) },
        uColB: { value: new THREE.Color(ringB) },
        uInner: { value: radius * 1.35 },
        uOuter: { value: radius * 2.3 },
      };
    },
    [colB, radius, style, sun],
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

      {/* corona — suns flare, planets keep a faint atmosphere halo.
          raycast disabled: this quad is huge and was swallowing clicks
          aimed at halo stars near the focused body. */}
      <sprite
        raycast={() => null}
        scale={[radius * (kind === "sun" ? 6 : 3.2), radius * (kind === "sun" ? 6 : 3.2), 1]}
      >
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
