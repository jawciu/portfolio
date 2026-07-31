"use client";

// GalaxyScene — the R3F canvas inside the skills-galaxy window frame.
//
// Zoomed out: the ~90-node knowledge graph from lib/galaxyData as a star
// field — shader point-sprites (gaussian core + diffraction spikes +
// twinkle), faint additive constellation lines, vivid nebula pools, two
// layers of decorative stardust. Authored data stays as readable objects;
// everything per-frame lives in flat Float32Array buffers.
//
// Zoomed in (click a star): the camera flies to the node, its neighbours
// GATHER into a camera-facing halo around it (live position buffer tweens
// toward halo slots, edges re-drawn from the live positions each frame), a
// FocusOrb sphere blooms over the point star (suns for skills, planets for
// jobs/projects — some ringed — moons for easter eggs) and labels appear
// for the whole neighbourhood. Everything else dims. Click empty space or
// Esc and the halo dissolves back into the constellation.
//
// Interaction contract with SkillsGalaxy.tsx (the section wrapper):
// - `active` gates OrbitControls only; hover + click-to-focus always work.
// - `visible=false` (section off-screen) stops the frameloop upstream.
// - A user grab (controls "start") kills any in-flight camera tween so the
//   hand always wins over the choreography.

import { useMemo, useRef, useState, useEffect, useCallback } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls, Html, Sparkles, useCursor } from "@react-three/drei";
import * as THREE from "three";
import gsap from "gsap";
import { GALAXY_NODES, GALAXY_EDGES, type GalaxyNode } from "@/lib/galaxyData";
import { layoutGalaxy } from "./layout";
import { FocusOrb, orbExtent } from "./FocusOrb";
import { TUNING } from "./tuning";

const HOME_CAM = new THREE.Vector3(0, 2, 18.5);
const HOME_TARGET = new THREE.Vector3(0, 0, 0);

// Halo geometry: neighbours gather on a ring of this radius; the camera
// stands back proportionally so every neighbourhood fills the same fraction
// of the frame whether a node has 3 connections or 21.
const haloRadius = (n: number) => Math.min(2.2 + n * 0.09, 3.4);
const flyDistance = (n: number) => Math.max(4.6, haloRadius(n) * 2.55);

// Hop sequencing (Caroline's brief): retract COMPLETELY at the old planet,
// only then fly, then sprout on approach. No overlap between the phases.
// All timings/rates live in ./tuning.ts and are adjustable at runtime via
// the dev-only GalaxyTuner panel — read them at call time, never cache.

// Saturated per-cluster tints — the shader mixes them into white, so these
// read as "white-ish but holographic" points that bloom into colour up close.
const CLUSTER_TINT: Record<string, string> = {
  design: "#ffb28a",
  research: "#8ab4ff",
  ai: "#c9a2ff",
  engineering: "#7de3ff",
  product: "#ffd166",
  leadership: "#ff8ab8",
  sidequest: "#8affc1",
  career: "#a9c6ff",
};
const JOB_TINT = "#ffd9a0"; // jobs glow warmer than projects

const STAR_VERT = /* glsl */ `
  attribute float aSize;
  attribute vec3 aTint;
  attribute float aPhase;
  attribute float aDim;
  attribute float aBoost;
  uniform float uPx;
  varying vec3 vTint;
  varying float vPhase;
  varying float vDim;
  void main() {
    vTint = aTint;
    vPhase = aPhase;
    vDim = aDim;
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    gl_PointSize = aSize * aBoost * uPx / -mv.z;
    gl_Position = projectionMatrix * mv;
  }
`;

const STAR_FRAG = /* glsl */ `
  uniform float uTime;
  uniform float uTwinkle;
  uniform float uTintMix;
  varying vec3 vTint;
  varying float vPhase;
  varying float vDim;
  void main() {
    vec2 uv = gl_PointCoord * 2.0 - 1.0;
    float d = length(uv);
    if (d > 1.0) discard;
    float core = exp(-d * d * 7.0);
    // 4-point diffraction spikes
    float spike = max(0.0, 1.0 - abs(uv.x) * 6.0) * max(0.0, 1.0 - abs(uv.y) * 1.5)
                + max(0.0, 1.0 - abs(uv.y) * 6.0) * max(0.0, 1.0 - abs(uv.x) * 1.5);
    float tw = 1.0 + uTwinkle * 0.22 * sin(uTime * (1.1 + vPhase * 1.9) + vPhase * 40.0);
    float i = (core + spike * 0.42) * tw;
    vec3 col = mix(vec3(1.0), vTint, uTintMix);
    gl_FragColor = vec4(col * i, i * (1.0 - vDim * 0.85));
  }
`;

const EDGE_VERT = /* glsl */ `
  attribute float aAlpha;
  varying float vAlpha;
  void main() {
    vAlpha = aAlpha;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const EDGE_FRAG = /* glsl */ `
  varying float vAlpha;
  void main() {
    gl_FragColor = vec4(0.62, 0.78, 0.95, vAlpha);
  }
`;

type ContentsProps = {
  active: boolean;
  reduced: boolean;
  tier: number;
  /** Increments when the canvas registers a click on empty space. */
  unfocusSignal: number;
};

function radialTexture() {
  const c = document.createElement("canvas");
  c.width = c.height = 256;
  const ctx = c.getContext("2d")!;
  const g = ctx.createRadialGradient(128, 128, 0, 128, 128, 128);
  g.addColorStop(0, "rgba(255,255,255,0.9)");
  g.addColorStop(0.4, "rgba(255,255,255,0.25)");
  g.addColorStop(1, "rgba(255,255,255,0)");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 256, 256);
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

// Nebula gas: each cloud is a swarm of big soft splats scattered through a
// stretched, randomly-oriented 3D volume — lumpy and irregular instead of a
// flat radial-gradient sticker, and it genuinely parallaxes when the galaxy
// rotates. In-splat fbm breaks the circular falloff into wisps.
//
// Hues are the HERO's mood, toned right down — muted purples (Caroline's
// #554FF0/#302D89), dusty pinks, corals, sage and peach, never the raw
// saturated spectrum ("not shouty").
// [core hue, edge hue, centre, spread (ellipsoid radii), amp scale]
// Three separate patches (top / centre-right / lower-left) + free-floating
// wisps between them, each cloud stretched along its OWN random axis — no
// shared drift direction, so no readable line, just weather.
const NEBULA_DEFS: [string, string, [number, number, number], [number, number, number], number][] = [
  // patch 1 — top, cool blues and violets
  ["#554ff0", "#302d89", [-5, 4.5, -9], [6, 2.6, 3.6], 0.75],    // soft violet-indigo
  ["#8f6ad9", "#3d2c8f", [-1, 5.5, -8], [5.5, 2.4, 3], 0.7],     // muted violet
  ["#453fc0", "#282470", [-8.5, 2.5, -10], [5, 2.2, 2.8], 0.55], // faint purple tail
  // patch 2 — centre-right, pinks and corals
  ["#d9769a", "#8f3d5f", [4, 1, -8], [6.5, 2.6, 3.4], 0.7],      // dusty pink
  ["#e59a76", "#a05648", [7.5, 3.5, -9], [5.5, 2.4, 3], 0.65],   // faded coral
  ["#b8879a", "#5f3d4a", [8.5, -1.5, -8], [5, 2.4, 2.8], 0.55],  // mauve fringe
  // patch 3 — lower-left, greens into peach
  ["#8fc9a8", "#3d6b8f", [-6, -3, -7], [6.5, 2.6, 3.2], 0.7],    // sage mint
  ["#e5b878", "#a06848", [-9, -4.5, -6.5], [5, 2.2, 2.8], 0.65], // warm peach
  // free-floating wisps in the gaps
  ["#8a6a4a", "#403020", [0, -0.5, -10], [9, 4, 4.5], 0.4],      // broad warm dust haze
  ["#7a85c0", "#302d89", [2, -5.5, -8.5], [5.5, 2.4, 3], 0.5],   // dusty periwinkle, lower right
  ["#a88ad9", "#4a2c8f", [9, 5.5, -10], [4.5, 2, 2.6], 0.5],     // lilac, upper right
  ["#c96a8f", "#7a3d56", [-3, -1, -8], [4.5, 2.2, 2.6], 0.45],   // rose, centre-left
  ["#554ff0", "#302d89", [4, 7, -9], [4.5, 2, 2.5], 0.45],       // violet, top
  // white star-forming glows, one per patch
  ["#ffffff", "#d9d0e5", [-3, 4.5, -8], [2.6, 1.4, 1.8], 0.35],
  ["#ffffff", "#bdeed9", [6, 1, -7.5], [3, 1.4, 2], 0.4],
  ["#ffffff", "#e5d9c9", [-7.5, -3.5, -7], [2.4, 1.3, 1.6], 0.3],
];

const NEBULA_VERT = /* glsl */ `
  attribute float aSize;
  attribute vec3 aTint;
  attribute float aPhase;
  attribute float aAmp;
  uniform float uPx;
  varying vec3 vTint;
  varying float vPhase;
  varying float vAmp;
  void main() {
    vTint = aTint;
    vPhase = aPhase;
    vAmp = aAmp;
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    // clamp: gas splats are background — never let a close fly-by blow one
    // up past the hardware point-size limits into a screen-filling wall
    gl_PointSize = min(aSize * uPx / -mv.z, 460.0);
    gl_Position = projectionMatrix * mv;
  }
`;

const NEBULA_FRAG = /* glsl */ `
  uniform float uTime;
  uniform float uFade;
  varying vec3 vTint;
  varying float vPhase;
  varying float vAmp;
  float hash2(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
  float noise2(vec2 x) {
    vec2 i = floor(x); vec2 f = fract(x);
    f = f * f * (3.0 - 2.0 * f);
    return mix(mix(hash2(i), hash2(i + vec2(1, 0)), f.x),
               mix(hash2(i + vec2(0, 1)), hash2(i + vec2(1, 1)), f.x), f.y);
  }
  float fbm2(vec2 p) {
    float v = 0.0; float a = 0.5;
    for (int k = 0; k < 3; k++) { v += a * noise2(p); p *= 2.03; a *= 0.5; }
    return v;
  }
  void main() {
    vec2 uv = gl_PointCoord * 2.0 - 1.0;
    float d = length(uv);
    if (d > 1.0) discard;
    float fall = exp(-d * d * 3.0);
    // slow internal drift so the gas breathes; phase decorrelates the splats
    float n = fbm2(uv * 2.2 + vPhase * 17.0 + vec2(uTime * 0.012, -uTime * 0.009));
    float a = fall * (0.3 + 0.7 * n) * vAmp * uFade;
    gl_FragColor = vec4(vTint * (0.55 + 0.45 * n), a);
  }
`;

function GalaxyContents({ active, reduced, tier, unfocusSignal }: ContentsProps) {
  const nodes = GALAXY_NODES;
  const layout = useMemo(() => layoutGalaxy(nodes, GALAXY_EDGES), [nodes]);

  const { camera, size, gl } = useThree();
  // stable store getter, used only by the dev probe (frameloop readout)
  const getThree = useThree((s) => s.get);
  // drei's OrbitControls type isn't exported cleanly; we only touch .target/.update()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const controlsRef = useRef<any>(null);
  const groupRef = useRef<THREE.Group>(null);
  const dustRef = useRef<THREE.Group>(null);
  const starMatRef = useRef<THREE.ShaderMaterial>(null);
  const bgMatRef = useRef<THREE.ShaderMaterial>(null);
  const dustMatRef = useRef<THREE.ShaderMaterial>(null);
  const nebulaMatRef = useRef<THREE.ShaderMaterial>(null);

  const [hovered, setHovered] = useState<number | null>(null);
  const [focused, setFocused] = useState<number | null>(null);
  useCursor(hovered !== null);

  // ── live positions — the graph breathes: neighbours gather on focus ──
  // The star geometry's position attribute IS the live buffer (mutated in
  // useFrame + needsUpdate, so stars, raycasts and edges all move together);
  // targetPos holds where each star wants to be (base layout or halo slot).
  const targetPosRef = useRef<Float32Array | null>(null);
  useEffect(() => {
    targetPosRef.current = layout.positions.slice();
  }, [layout]);

  // ── node star buffers ─────────────────────────────────────────────
  const starGeom = useMemo(() => {
    const n = nodes.length;
    const sizes = new Float32Array(n);
    const tints = new Float32Array(n * 3);
    const phases = new Float32Array(n);
    const dims = new Float32Array(n);
    const boosts = new Float32Array(n).fill(1);
    const col = new THREE.Color();
    nodes.forEach((node, i) => {
      const base = node.size >= 3 ? 0.6 : node.size >= 2 ? 0.4 : 0.27;
      sizes[i] = base + (node.featured ? 0.07 : 0);
      col.set(node.type === "job" ? JOB_TINT : CLUSTER_TINT[node.cluster] ?? "#ffffff");
      tints.set([col.r, col.g, col.b], i * 3);
      phases[i] = (i * 0.618033988749895) % 1; // golden-ratio spread, deterministic
    });
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(layout.positions.slice(), 3));
    g.setAttribute("aSize", new THREE.BufferAttribute(sizes, 1));
    g.setAttribute("aTint", new THREE.BufferAttribute(tints, 3));
    g.setAttribute("aPhase", new THREE.BufferAttribute(phases, 1));
    g.setAttribute("aDim", new THREE.BufferAttribute(dims, 1));
    g.setAttribute("aBoost", new THREE.BufferAttribute(boosts, 1));
    return g;
  }, [nodes, layout]);

  // the mutable per-frame position buffer (drives stars, edges and labels)
  const livePos = (starGeom.getAttribute("position") as THREE.BufferAttribute).array as Float32Array;

  // ── decorative background stars (never raycast) ───────────────────
  const bgGeom = useMemo(() => {
    const count = tier < 2 ? 260 : 700;
    const rand = (s => () => ((s = (s * 16807) % 2147483647), s / 2147483647))(48271);
    const pos = new Float32Array(count * 3);
    const sizes = new Float32Array(count);
    const tints = new Float32Array(count * 3);
    const phases = new Float32Array(count);
    const dims = new Float32Array(count);
    const boosts = new Float32Array(count).fill(1);
    const palette = ["#ffffff", "#cfe0ff", "#ffe9c4", "#7de3ff", "#ff8ab8", "#ffd166"].map(h => new THREE.Color(h));
    for (let i = 0; i < count; i++) {
      const r = 26 + rand() * 30;
      const theta = rand() * Math.PI * 2;
      const z = rand() * 2 - 1;
      const s = Math.sqrt(1 - z * z);
      pos.set([r * s * Math.cos(theta), r * z * 0.7, r * s * Math.sin(theta)], i * 3);
      sizes[i] = 0.1 + rand() * 0.16;
      // skew toward the white end so colour stays an accent, not confetti
      const c = palette[Math.floor(Math.pow(rand(), 1.6) * palette.length)];
      tints.set([c.r, c.g, c.b], i * 3);
      phases[i] = rand();
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    g.setAttribute("aSize", new THREE.BufferAttribute(sizes, 1));
    g.setAttribute("aTint", new THREE.BufferAttribute(tints, 3));
    g.setAttribute("aPhase", new THREE.BufferAttribute(phases, 1));
    g.setAttribute("aDim", new THREE.BufferAttribute(dims, 1));
    g.setAttribute("aBoost", new THREE.BufferAttribute(boosts, 1));
    return g;
  }, [tier]);

  // ── stardust — a fine, colourful drift inside the constellation ────
  const dustGeom = useMemo(() => {
    const count = tier < 2 ? 400 : 1100;
    const rand = (s => () => ((s = (s * 16807) % 2147483647), s / 2147483647))(1979);
    const pos = new Float32Array(count * 3);
    const sizes = new Float32Array(count);
    const tints = new Float32Array(count * 3);
    const phases = new Float32Array(count);
    const dims = new Float32Array(count);
    const boosts = new Float32Array(count).fill(1);
    const palette = ["#ff8ab8", "#7de3ff", "#c9a2ff", "#ffd166", "#8affc1", "#ffffff"].map(h => new THREE.Color(h));
    for (let i = 0; i < count; i++) {
      const r = 3 + Math.pow(rand(), 0.7) * 17;
      const theta = rand() * Math.PI * 2;
      const z = rand() * 2 - 1;
      const s = Math.sqrt(1 - z * z);
      pos.set([r * s * Math.cos(theta), r * z * 0.55, r * s * Math.sin(theta)], i * 3);
      sizes[i] = 0.05 + rand() * 0.11;
      const c = palette[Math.floor(rand() * palette.length)];
      tints.set([c.r, c.g, c.b], i * 3);
      phases[i] = rand();
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    g.setAttribute("aSize", new THREE.BufferAttribute(sizes, 1));
    g.setAttribute("aTint", new THREE.BufferAttribute(tints, 3));
    g.setAttribute("aPhase", new THREE.BufferAttribute(phases, 1));
    g.setAttribute("aDim", new THREE.BufferAttribute(dims, 1));
    g.setAttribute("aBoost", new THREE.BufferAttribute(boosts, 1));
    return g;
  }, [tier]);

  // ── nebula gas point clouds ───────────────────────────────────────
  const nebulaGeom = useMemo(() => {
    const perCloud = tier < 2 ? 34 : 64;
    const count = NEBULA_DEFS.length * perCloud;
    const rand = (s => () => ((s = (s * 16807) % 2147483647), s / 2147483647))(777);
    const gauss = () => (rand() + rand() + rand()) / 1.5 - 1; // rough gaussian, [-1,1]
    const pos = new Float32Array(count * 3);
    const sizes = new Float32Array(count);
    const tints = new Float32Array(count * 3);
    const phases = new Float32Array(count);
    const amps = new Float32Array(count);
    const core = new THREE.Color();
    const edge = new THREE.Color();
    const mixed = new THREE.Color();
    let w = 0;
    for (const [hexCore, hexEdge, centre, spread, ampScale] of NEBULA_DEFS) {
      core.set(hexCore);
      edge.set(hexEdge);
      // fully random major axis per cloud — a shared direction kept reading
      // as a ruled line no matter how much jitter it wore
      const a = new THREE.Vector3(rand() * 2 - 1, rand() * 2 - 1, rand() * 2 - 1).normalize();
      const b = new THREE.Vector3(rand() * 2 - 1, rand() * 2 - 1, rand() * 2 - 1)
        .projectOnPlane(a).normalize();
      const c = new THREE.Vector3().crossVectors(a, b);
      for (let i = 0; i < perCloud; i++) {
        const gx = gauss(), gy = gauss(), gz = gauss();
        const p = new THREE.Vector3(centre[0], centre[1], centre[2])
          .addScaledVector(a, gx * spread[0])
          .addScaledVector(b, gy * spread[1])
          .addScaledVector(c, gz * spread[2]);
        pos.set([p.x, p.y, p.z], w * 3);
        const size = 2.8 + rand() * 4.6;
        sizes[w] = size;
        // brighter core hue in the middle, darker edge hue at the fringes
        const t = Math.min(1, Math.hypot(gx, gy, gz) / 1.5);
        mixed.copy(core).lerp(edge, t * (0.7 + rand() * 0.3));
        tints.set([mixed.r, mixed.g, mixed.b], w * 3);
        phases[w] = rand();
        amps[w] = (0.11 + rand() * 0.1) * (3.0 / size) * ampScale; // big splats run fainter
        w++;
      }
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    g.setAttribute("aSize", new THREE.BufferAttribute(sizes, 1));
    g.setAttribute("aTint", new THREE.BufferAttribute(tints, 3));
    g.setAttribute("aPhase", new THREE.BufferAttribute(phases, 1));
    g.setAttribute("aAmp", new THREE.BufferAttribute(amps, 1));
    return g;
  }, [tier]);

  // ── edges — positions rebuilt from livePos whenever the graph moves ─
  const REST_EDGE_ALPHA = 0.13;
  const edgeGeom = useMemo(() => {
    const m = layout.edgeIndices.length;
    const pos = new Float32Array(m * 6);
    const alphas = new Float32Array(m * 2).fill(REST_EDGE_ALPHA);
    layout.edgeIndices.forEach(([a, b], k) => {
      pos.set(layout.positions.slice(a * 3, a * 3 + 3), k * 6);
      pos.set(layout.positions.slice(b * 3, b * 3 + 3), k * 6 + 3);
    });
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    g.setAttribute("aAlpha", new THREE.BufferAttribute(alphas, 1));
    return g;
  }, [layout]);

  useEffect(() => () => { starGeom.dispose(); }, [starGeom]);
  useEffect(() => () => { bgGeom.dispose(); }, [bgGeom]);
  useEffect(() => () => { dustGeom.dispose(); }, [dustGeom]);
  useEffect(() => () => { nebulaGeom.dispose(); }, [nebulaGeom]);
  useEffect(() => () => { edgeGeom.dispose(); }, [edgeGeom]);

  const glowTex = useMemo(() => radialTexture(), []);
  useEffect(() => () => { glowTex.dispose(); }, [glowTex]);

  // ── focus targets: dim / boost / edge alpha / gather positions ─────
  const dimTarget = useRef(new Float32Array(nodes.length));
  const boostTarget = useRef(new Float32Array(nodes.length).fill(1));
  const edgeAlphaTarget = useRef(new Float32Array(layout.edgeIndices.length * 2).fill(REST_EDGE_ALPHA));

  // ── focus-hop edge choreography (Caroline's relay brief) ───────────
  // Hopping focus A→B: A's edges RETRACT into A (ext → 0, anchored at A),
  // the A↔B bridge stays lit for the flight, and B's edges SPROUT from B
  // (ext 0 → 1) in the final third of the flight. ext scales an edge's far
  // endpoint toward its anchor; 1 = full length (the resting web).
  const edgeExt = useRef(new Float32Array(layout.edgeIndices.length).fill(1));
  const edgeExtTarget = useRef(new Float32Array(layout.edgeIndices.length).fill(1));
  /** which endpoint the edge grows from / shrinks into: 0 none, 1 = a, 2 = b */
  const edgeAnchor = useRef(new Int8Array(layout.edgeIndices.length));
  /** 1 = keep this retracting edge bright until it has shrunk away */
  const retractHold = useRef(new Uint8Array(layout.edgeIndices.length));
  const sproutTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  /** set by beginRetract; consumed by the focus effect when the hop lands */
  const hopPending = useRef<{ sproutIdx: number[]; retractIdx: number[] } | null>(null);
  const prevFocused = useRef<number | null>(null);
  useEffect(() => () => {
    if (sproutTimer.current) clearTimeout(sproutTimer.current);
  }, []);

  useEffect(() => {
    const dims = dimTarget.current;
    const boosts = boostTarget.current;
    const ea = edgeAlphaTarget.current;
    const targetPos = targetPosRef.current;
    if (!targetPos) return;
    const prev = prevFocused.current;
    prevFocused.current = focused;
    if (sproutTimer.current) { clearTimeout(sproutTimer.current); sproutTimer.current = null; }
    targetPos.set(layout.positions); // everyone returns home by default
    if (focused === null) {
      dims.fill(0);
      boosts.fill(1);
      ea.fill(REST_EDGE_ALPHA);
      edgeExtTarget.current.fill(1);
      retractHold.current.fill(0);
      return;
    }
    const nbs = layout.neighbours[focused];
    const nbSet = new Set(nbs);
    dims.fill(0.82);
    boosts.fill(1);
    dims[focused] = 0;
    // suns keep a big flaring point behind the sphere; planets glow less
    const focusedType = nodes[focused].type;
    boosts[focused] = focusedType === "skill" || focusedType === "egg" ? 2.4 : 0.4;
    for (const nb of nbs) { dims[nb] = 0.08; boosts[nb] = 1.35; }
    layout.edgeIndices.forEach(([a, b], k) => {
      const alpha = a === focused || b === focused ? 0.7
        : nbSet.has(a) && nbSet.has(b) ? 0.2
        : 0.03;
      ea[k * 2] = ea[k * 2 + 1] = alpha;
    });

    // Landing a hop: the retract (phase 1) already ran imperatively in
    // beginRetract while `focused` still pointed at the old star — this
    // effect fires at flight time (phase 2), so only the sprout remains.
    if (hopPending.current && prev !== null && prev !== focused) {
      const { sproutIdx, retractIdx } = hopPending.current;
      hopPending.current = null;
      const extT = edgeExtTarget.current;
      sproutTimer.current = setTimeout(() => {
        for (const k of sproutIdx) extT[k] = 1;
        // the retracted threads quietly rejoin the (dimmed) resting web
        for (const k of retractIdx) extT[k] = 1;
        sproutTimer.current = null;
      }, reduced ? 0 : TUNING.flightMs * TUNING.sproutAt);
    }

    // gather the neighbourhood into a camera-facing halo around the star
    const c = new THREE.Vector3(
      layout.positions[focused * 3],
      layout.positions[focused * 3 + 1],
      layout.positions[focused * 3 + 2],
    );
    const camLocal = groupRef.current
      ? groupRef.current.worldToLocal(camera.position.clone())
      : camera.position.clone();
    const dir = c.clone().sub(camLocal).normalize();
    const up = Math.abs(dir.y) > 0.94 ? new THREE.Vector3(1, 0, 0) : new THREE.Vector3(0, 1, 0);
    const u = new THREE.Vector3().crossVectors(dir, up).normalize();
    const v = new THREE.Vector3().crossVectors(dir, u).normalize();
    const rc = haloRadius(nbs.length);
    nbs.forEach((nb, k) => {
      const ang = (k / nbs.length) * Math.PI * 2 + 0.4;
      const rr = rc * (0.85 + 0.3 * ((nb * 0.377) % 1));
      const depth = (((nb * 0.618) % 1) - 0.5) * 1.4;
      const p = c.clone()
        .addScaledVector(u, Math.cos(ang) * rr)
        // the window is wide: squash the halo's vertical axis or the
        // bottom-of-ring members project below the frame (unclickable)
        .addScaledVector(v, Math.sin(ang) * rr * 0.72)
        .addScaledVector(dir, depth);
      targetPos.set([p.x, p.y, p.z], nb * 3);
    });
  }, [focused, layout, nodes, camera, reduced, starGeom]);

  // ── camera fly-in / fly-home ──────────────────────────────────────
  // The flight is a progress tween, not a straight position tween: the
  // camera position is lerp(start, end, t) plus a lift of arcLift·sin(πt)
  // along a fixed direction, so it pulls up and back mid-flight and
  // descends onto the destination like a map app's fly-to. The lift
  // direction is computed ONCE at launch (away from the galaxy centre,
  // blended toward world-up) — the flight normal is not used because it
  // flips sign when a path grazes the centre line, kinking the arc.
  const flightProg = useRef({ t: 0 });
  /** hop endpoints for the bridge pulse; null whenever there is no hop flight */
  const hopRef = useRef<{ a: number; b: number; bridged: boolean } | null>(null);
  const pulseRef = useRef<THREE.Sprite>(null);

  const flyTo = useCallback((idx: number | null, hopFrom?: number) => {
    const controls = controlsRef.current;
    const dur = reduced ? 0 : idx === null ? 1.4 : TUNING.flightMs / 1000;
    gsap.killTweensOf(camera.position);
    gsap.killTweensOf(flightProg.current);
    if (controls) gsap.killTweensOf(controls.target);
    hopRef.current = idx !== null && hopFrom !== undefined
      ? { a: hopFrom, b: idx, bridged: layout.neighbours[hopFrom].includes(idx) }
      : null;
    let camTo: THREE.Vector3;
    let targetTo: THREE.Vector3;
    if (idx === null) {
      camTo = HOME_CAM;
      targetTo = HOME_TARGET;
    } else {
      targetTo = new THREE.Vector3(
        layout.positions[idx * 3],
        layout.positions[idx * 3 + 1],
        layout.positions[idx * 3 + 2],
      );
      groupRef.current?.localToWorld(targetTo);
      // approach along the current viewing direction so the fly-in feels continuous;
      // stand further back the more neighbours will gather around the star
      const dist = flyDistance(layout.neighbours[idx].length);
      const dir = camera.position.clone().sub(controls ? controls.target : HOME_TARGET).normalize();
      camTo = targetTo.clone().add(dir.multiplyScalar(dist));
    }
    if (reduced) {
      // reduced motion: straight and instant, no arc, no pulse
      gsap.to(camera.position, { x: camTo.x, y: camTo.y, z: camTo.z, duration: dur, ease: "power2.inOut" });
    } else {
      const from = camera.position.clone();
      const to = camTo.clone();
      const lift = from.clone().add(to).multiplyScalar(0.5); // = mid-point − galaxy centre (origin)
      if (lift.lengthSq() < 1e-4) lift.set(0, 1, 0);
      lift.normalize().multiplyScalar(0.75).add(new THREE.Vector3(0, 0.6, 0)).normalize();
      // fly-home already pulls a long way back on its own — a full arc on
      // top of that overshoots, so it gets a gentler one
      const liftAmt = TUNING.arcLift * (idx === null ? 0.35 : 1);
      const p = flightProg.current;
      p.t = 0;
      gsap.to(p, {
        t: 1,
        duration: dur,
        // power3.inOut, not power2: the slower attack keeps the camera
        // visually parked through the retract/flight overlap (see focus())
        ease: "power3.inOut",
        onUpdate: () => {
          camera.position.lerpVectors(from, to, p.t)
            .addScaledVector(lift, liftAmt * Math.sin(Math.PI * p.t));
        },
        onComplete: () => { hopRef.current = null; },
      });
    }
    if (controls) {
      gsap.to(controls.target, {
        x: targetTo.x, y: targetTo.y, z: targetTo.z, duration: dur,
        ease: reduced ? "power2.inOut" : "power3.inOut",
        onUpdate: () => controls.update(),
      });
    }
  }, [camera, layout, reduced]);

  // Phase 1 of a hop, run imperatively AT CLICK TIME while `focused` still
  // points at the old star: freeze its halo where it stands and reel every
  // edge back in (bright), collapse the new star's dim web edges so they can
  // sprout later. NOTHING else changes — no camera, no labels, no dims, no
  // orb swap — so the retract plays out alone (Caroline's brief).
  const beginRetract = useCallback((prev: number, next: number) => {
    const targetPos = targetPosRef.current;
    if (!targetPos) return;
    const live = (starGeom.getAttribute("position") as THREE.BufferAttribute).array as Float32Array;
    const ext = edgeExt.current;
    const extT = edgeExtTarget.current;
    const anch = edgeAnchor.current;
    const hold = retractHold.current;
    const ea = edgeAlphaTarget.current;
    for (const nb of layout.neighbours[prev]) {
      if (nb === next) continue;
      targetPos.set([live[nb * 3], live[nb * 3 + 1], live[nb * 3 + 2]], nb * 3);
    }
    const sproutIdx: number[] = [];
    const retractIdx: number[] = [];
    layout.edgeIndices.forEach(([a, b], k) => {
      const touchesPrev = a === prev || b === prev;
      const touchesNew = a === next || b === next;
      if (touchesPrev && touchesNew) { extT[k] = 1; hold[k] = 0; return; } // the bridge stays
      if (touchesPrev) {
        // reel into the star we are leaving, staying bright while it shrinks
        anch[k] = a === prev ? 1 : 2;
        extT[k] = 0;
        hold[k] = 1;
        ea[k * 2] = ea[k * 2 + 1] = 0.5;
        retractIdx.push(k);
      } else if (touchesNew) {
        // collapse instantly (invisible at web alpha), sprout on approach
        anch[k] = a === next ? 1 : 2;
        ext[k] = 0;
        extT[k] = 0;
        sproutIdx.push(k);
      }
    });
    hopPending.current = { sproutIdx, retractIdx };
  }, [layout, starGeom]);

  // Hops run phase 1 to completion BEFORE anything else happens: the whole
  // focus switch (camera, labels, dims, orb, gather) is what gets delayed,
  // not just the flight. focusedRef mirrors state so the callback can detect
  // a hop without re-creating itself.
  const focusedRef = useRef<number | null>(null);
  const flightTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const focus = useCallback((idx: number | null) => {
    const prevIdx = focusedRef.current;
    const isHop = prevIdx !== null && idx !== null && idx !== prevIdx;
    focusedRef.current = idx;
    if (flightTimer.current) { clearTimeout(flightTimer.current); flightTimer.current = null; }
    if (isHop && !reduced) {
      beginRetract(prevIdx, idx);
      // Phase blend: the flight launches at 85% of the retract rather than
      // after it. Overlap + the flight's power3.inOut attack was chosen over
      // either alone: the overlap kills the dead stop between the phases,
      // and power3's near-flat opening (≈0.1% progress across the 15%
      // window at the default timings) hides the overlap completely, so the
      // retract still reads as finishing before the camera moves.
      flightTimer.current = setTimeout(() => {
        flightTimer.current = null;
        setFocused(idx);
        flyTo(idx, prevIdx);
      }, TUNING.retractMs * 0.85);
    } else {
      setFocused(idx);
      flyTo(idx);
    }
  }, [flyTo, reduced, beginRetract]);
  useEffect(() => () => {
    if (flightTimer.current) clearTimeout(flightTimer.current);
  }, []);

  // A user grab always beats the choreography — kill in-flight tweens.
  useEffect(() => {
    const controls = controlsRef.current;
    if (!controls) return;
    const onStart = () => {
      gsap.killTweensOf(camera.position);
      gsap.killTweensOf(controls.target);
      // the arc drives the camera through a progress object — kill that too,
      // and drop the hop so the bridge pulse dies with the flight
      gsap.killTweensOf(flightProg.current);
      hopRef.current = null;
    };
    controls.addEventListener("start", onStart);
    return () => controls.removeEventListener("start", onStart);
  }, [camera, active]);

  // Section deactivated (esc / click-out / scrolled away) → return home.
  const wasActive = useRef(active);
  useEffect(() => {
    if (wasActive.current && !active) focus(null);
    wasActive.current = active;
  }, [active, focus]);

  // Click on empty space (canvas onPointerMissed) → fly home.
  const lastUnfocus = useRef(unfocusSignal);
  useEffect(() => {
    if (unfocusSignal !== lastUnfocus.current) {
      lastUnfocus.current = unfocusSignal;
      focus(null);
    }
  }, [unfocusSignal, focus]);

  useEffect(() => () => {
    gsap.killTweensOf(camera.position);
    gsap.killTweensOf(flightProg.current);
    if (controlsRef.current) gsap.killTweensOf(controlsRef.current.target);
  }, [camera]);

  // ── per-frame work ────────────────────────────────────────────────
  const driftSpeed = useRef(0);
  /** dev probe only: lets headless checks see whether the loop is ticking */
  const frameCount = useRef(0);
  useFrame((_, dt) => {
    frameCount.current++;
    const t = Math.min(dt, 0.05); // clamped: shader time + rotations only
    // exponential smoothing on REAL dt — converges identically at any framerate
    // (the evaluator measured the old dt-clamped lerps running ~10x slow at 4.5fps)
    const kPos = reduced ? 1 : 1 - Math.exp(-TUNING.gatherRate * dt);
    if (starMatRef.current) starMatRef.current.uniforms.uTime.value += t;
    if (bgMatRef.current) bgMatRef.current.uniforms.uTime.value += t;
    if (dustMatRef.current) dustMatRef.current.uniforms.uTime.value += t;
    if (nebulaMatRef.current) {
      const u = nebulaMatRef.current.uniforms;
      if (!reduced) u.uTime.value += t;
      // gas backs off while a neighbourhood is focused so labels stay legible
      const fadeGoal = focused !== null ? 0.35 : 1;
      u.uFade.value += (fadeGoal - u.uFade.value) * (1 - Math.exp(-3 * dt));
    }

    // idle drift eases in and out instead of stopping dead
    const driftGoal = !active && focused === null && !reduced ? 0.02 : 0;
    driftSpeed.current += (driftGoal - driftSpeed.current) * (1 - Math.exp(-2 * dt));
    if (groupRef.current) groupRef.current.rotation.y += driftSpeed.current * t * 60 * 0.0167;
    if (dustRef.current && !reduced) dustRef.current.rotation.y -= t * 0.004;

    const k = reduced ? 1 : 1 - Math.exp(-6.5 * dt);
    // gather / release: lerp live positions toward targets
    const posAttr = starGeom.getAttribute("position") as THREE.BufferAttribute;
    const live = posAttr.array as Float32Array;
    const targetPos = targetPosRef.current;
    let posMoved = false;
    if (targetPos) {
      for (let i = 0; i < live.length; i++) {
        const d = targetPos[i] - live[i];
        if (Math.abs(d) > 0.0005) { live[i] += d * kPos; posMoved = true; }
      }
    }
    // retract / sprout: lerp edge extensions toward targets
    const ext = edgeExt.current;
    const extT = edgeExtTarget.current;
    const anch = edgeAnchor.current;
    const hold = retractHold.current;
    const kExt = reduced ? 1 : 1 - Math.exp(-TUNING.extRate * dt);
    let extMoved = false;
    for (let i = 0; i < ext.length; i++) {
      const d = extT[i] - ext[i];
      if (Math.abs(d) > 0.002) { ext[i] += d * kExt; extMoved = true; }
      // a retracting edge stays bright until it has shrunk away, then dims
      if (hold[i] && ext[i] <= 0.05) {
        hold[i] = 0;
        edgeAlphaTarget.current[i * 2] = edgeAlphaTarget.current[i * 2 + 1] = 0.03;
      }
    }
    if (posMoved || extMoved) {
      posAttr.needsUpdate = true;
      const ePos = edgeGeom.getAttribute("position") as THREE.BufferAttribute;
      const eArr = ePos.array as Float32Array;
      layout.edgeIndices.forEach(([a, b], m) => {
        let ax = live[a * 3], ay = live[a * 3 + 1], az = live[a * 3 + 2];
        let bx = live[b * 3], by = live[b * 3 + 1], bz = live[b * 3 + 2];
        const e = ext[m];
        if (e < 0.999) {
          if (anch[m] === 2) {
            // b is the anchor: the a-side endpoint pulls toward b
            ax = bx + (ax - bx) * e; ay = by + (ay - by) * e; az = bz + (az - bz) * e;
          } else {
            bx = ax + (bx - ax) * e; by = ay + (by - ay) * e; bz = az + (bz - az) * e;
          }
        }
        eArr[m * 6] = ax; eArr[m * 6 + 1] = ay; eArr[m * 6 + 2] = az;
        eArr[m * 6 + 3] = bx; eArr[m * 6 + 4] = by; eArr[m * 6 + 5] = bz;
      });
      ePos.needsUpdate = true;
    }
    // dim / boost / edge-alpha lerps
    const dimAttr = starGeom.getAttribute("aDim") as THREE.BufferAttribute;
    const dims = dimAttr.array as Float32Array;
    let moved = false;
    for (let i = 0; i < dims.length; i++) {
      const d = dimTarget.current[i] - dims[i];
      if (Math.abs(d) > 0.001) { dims[i] += d * k; moved = true; }
    }
    if (moved) dimAttr.needsUpdate = true;
    const boostAttr = starGeom.getAttribute("aBoost") as THREE.BufferAttribute;
    const boosts = boostAttr.array as Float32Array;
    let bMoved = false;
    for (let i = 0; i < boosts.length; i++) {
      const d = boostTarget.current[i] - boosts[i];
      if (Math.abs(d) > 0.001) { boosts[i] += d * k; bMoved = true; }
    }
    if (bMoved) boostAttr.needsUpdate = true;
    const eAttr = edgeGeom.getAttribute("aAlpha") as THREE.BufferAttribute;
    const eArr = eAttr.array as Float32Array;
    let eMoved = false;
    for (let i = 0; i < eArr.length; i++) {
      const d = edgeAlphaTarget.current[i] - eArr[i];
      if (Math.abs(d) > 0.001) { eArr[i] += d * k; eMoved = true; }
    }
    if (eMoved) eAttr.needsUpdate = true;

    // bridge pulse: a small glow rides the A→B bridge in step with the
    // flight. Endpoints are read live so it tracks the (rotating, breathing)
    // group; sin(πt) opacity hides the pop at either end of the run.
    const pulse = pulseRef.current;
    if (pulse) {
      const hop = hopRef.current;
      const pt = flightProg.current.t;
      const show = hop !== null && hop.bridged && !reduced
        && TUNING.bridgePulse >= 0.5 && pt > 0.001 && pt < 0.999;
      pulse.visible = show;
      if (show && hop) {
        pulse.position.set(
          live[hop.a * 3] + (live[hop.b * 3] - live[hop.a * 3]) * pt,
          live[hop.a * 3 + 1] + (live[hop.b * 3 + 1] - live[hop.a * 3 + 1]) * pt,
          live[hop.a * 3 + 2] + (live[hop.b * 3 + 2] - live[hop.a * 3 + 2]) * pt,
        );
        (pulse.material as THREE.SpriteMaterial).opacity = Math.sin(Math.PI * pt);
      }
    }
  });

  // px factor for projection-correct point sizes
  const uPx = useMemo(
    () => size.height / (2 * Math.tan(((camera as THREE.PerspectiveCamera).fov * Math.PI) / 360)),
    [size.height, camera],
  );
  useEffect(() => {
    for (const m of [starMatRef.current, bgMatRef.current, dustMatRef.current, nebulaMatRef.current]) {
      if (m) m.uniforms.uPx.value = uPx;
    }
  }, [uPx]);

  // DEV-ONLY test probe: lets automated checks project every star to CSS px
  // and read the current focus without poking R3F internals. Stripped from
  // production builds by the NODE_ENV gate.
  useEffect(() => {
    if (process.env.NODE_ENV === "production") return;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const w = window as any;
    w.__galaxyProbe = () => {
      const rect = gl.domElement.getBoundingClientRect();
      const v = new THREE.Vector3();
      const live = (starGeom.getAttribute("position") as THREE.BufferAttribute).array as Float32Array;
      return nodes.map((n, i) => {
        v.set(live[i * 3], live[i * 3 + 1], live[i * 3 + 2]);
        groupRef.current?.localToWorld(v);
        v.project(camera);
        return {
          id: n.id,
          name: n.name,
          type: n.type,
          x: rect.x + ((v.x + 1) / 2) * rect.width,
          y: rect.y + ((1 - v.y) / 2) * rect.height,
          inFront: v.z < 1,
          // group-local position: lets tests verify freezes/gathers without
          // camera motion contaminating the measurement
          lx: live[i * 3], ly: live[i * 3 + 1], lz: live[i * 3 + 2],
        };
      });
    };
    w.__galaxyFocused = focused === null ? null : nodes[focused].id;
    w.__galaxyEdges = () => ({
      ext: Array.from(edgeExt.current),
      extT: Array.from(edgeExtTarget.current),
      hold: Array.from(retractHold.current),
    });
    w.__galaxyFlight = () => ({
      t: flightProg.current.t,
      hop: hopRef.current ? { ...hopRef.current } : null,
      cam: camera.position.toArray(),
      pulseVisible: pulseRef.current?.visible ?? false,
      pulsePos: pulseRef.current ? pulseRef.current.position.toArray() : null,
      frames: frameCount.current,
      frameloop: getThree().frameloop,
    });
    return () => {
      delete w.__galaxyProbe; delete w.__galaxyFocused; delete w.__galaxyEdges; delete w.__galaxyFlight;
    };
  }, [nodes, camera, gl, starGeom, focused, getThree]);

  // ── labels ────────────────────────────────────────────────────────
  const labelSet = useMemo(() => {
    const out: { idx: number; kind: "focused" | "neighbour" | "featured" | "hover" }[] = [];
    if (focused !== null) {
      out.push({ idx: focused, kind: "focused" });
      for (const nb of layout.neighbours[focused]) out.push({ idx: nb, kind: "neighbour" });
      if (hovered !== null && hovered !== focused && !layout.neighbours[focused].includes(hovered)) {
        out.push({ idx: hovered, kind: "hover" });
      }
    } else {
      nodes.forEach((n, i) => { if (n.featured) out.push({ idx: i, kind: "featured" }); });
      if (hovered !== null && !nodes[hovered].featured) out.push({ idx: hovered, kind: "hover" });
    }
    return out;
  }, [focused, hovered, nodes, layout]);

  const focusedNode = focused !== null ? nodes[focused] : null;

  return (
    <>
      <OrbitControls
        ref={controlsRef}
        enabled={active}
        enableDamping
        dampingFactor={0.06}
        rotateSpeed={0.7}
        zoomSpeed={0.65}
        enablePan={false}
        minDistance={1.6}
        maxDistance={40}
        makeDefault
      />

      <group ref={groupRef}>
        {/* nebula gas — rotates and parallaxes with the galaxy, dims on focus */}
        <points geometry={nebulaGeom} raycast={() => null} frustumCulled={false}>
          <shaderMaterial
            ref={nebulaMatRef}
            vertexShader={NEBULA_VERT}
            fragmentShader={NEBULA_FRAG}
            transparent
            depthWrite={false}
            blending={THREE.AdditiveBlending}
            uniforms={{ uTime: { value: 0 }, uFade: { value: 1 }, uPx: { value: 800 } }}
          />
        </points>

        {tier >= 2 && (
          <Sparkles
            raycast={() => null}
            count={reduced ? 0 : 140}
            scale={[26, 16, 26]}
            size={1.6}
            speed={reduced ? 0 : 0.25}
            opacity={0.3}
            color="#bcd7ff"
          />
        )}

        {/* stardust — does nothing, is stardust */}
        <group ref={dustRef}>
          <points geometry={dustGeom} raycast={() => null} frustumCulled={false}>
            <shaderMaterial
              ref={dustMatRef}
              vertexShader={STAR_VERT}
              fragmentShader={STAR_FRAG}
              transparent
              depthWrite={false}
              blending={THREE.AdditiveBlending}
              uniforms={{
                uTime: { value: 0 },
                uTwinkle: { value: reduced ? 0 : 0.5 },
                uTintMix: { value: 0.9 },
                uPx: { value: 800 },
              }}
            />
          </points>
        </group>

        {/* edges */}
        <lineSegments geometry={edgeGeom} frustumCulled={false}>
          <shaderMaterial
            vertexShader={EDGE_VERT}
            fragmentShader={EDGE_FRAG}
            transparent
            depthWrite={false}
            blending={THREE.AdditiveBlending}
          />
        </lineSegments>

        {/* bridge pulse — a light travelling the A↔B edge during a hop
            flight; positioned + shown per frame in useFrame, never raycast */}
        <sprite ref={pulseRef} visible={false} scale={0.42} raycast={() => null}>
          <spriteMaterial
            map={glowTex}
            color="#c9a2ff"
            transparent
            opacity={0}
            depthWrite={false}
            blending={THREE.AdditiveBlending}
          />
        </sprite>

        {/* node stars */}
        <points
          geometry={starGeom}
          frustumCulled={false}
          onPointerMove={(e) => { e.stopPropagation(); const i = pickIndex(e.intersections); if (i !== null) setHovered(i); }}
          onPointerOut={() => setHovered(null)}
          onClick={(e) => {
            e.stopPropagation();
            const i = pickIndex(e.intersections);
            if (i !== null) focus(i);
          }}
        >
          <shaderMaterial
            ref={starMatRef}
            vertexShader={STAR_VERT}
            fragmentShader={STAR_FRAG}
            transparent
            depthWrite={false}
            blending={THREE.AdditiveBlending}
            uniforms={{
              uTime: { value: 0 },
              uTwinkle: { value: reduced ? 0 : 1 },
              uTintMix: { value: 0.55 },
              uPx: { value: 800 },
            }}
          />
        </points>

        {/* background dust stars — decoration only, no raycast */}
        <points geometry={bgGeom} raycast={() => null} frustumCulled={false}>
          <shaderMaterial
            ref={bgMatRef}
            vertexShader={STAR_VERT}
            fragmentShader={STAR_FRAG}
            transparent
            depthWrite={false}
            blending={THREE.AdditiveBlending}
            uniforms={{
              uTime: { value: 0 },
              uTwinkle: { value: reduced ? 0 : 0.6 },
              uTintMix: { value: 0.6 },
              uPx: { value: 800 },
            }}
          />
        </points>

        {/* the close-up body at the focused star */}
        {focused !== null && focusedNode && (
          <group position={[
            layout.positions[focused * 3],
            layout.positions[focused * 3 + 1],
            layout.positions[focused * 3 + 2],
          ]}>
            <FocusOrb node={focusedNode} reduced={reduced} glowTex={glowTex} />
          </group>
        )}

        {/* labels — DOM text pinned to (moving) stars. zIndexRange stays below
            the window-chrome bar (z-20) so labels slide under it, not over.
            Labels are CLICK TARGETS (the evaluator's top finding: users click
            the visible name, and that click used to miss the tiny star) —
            except hover labels, which chase the cursor and would flicker. */}
        {labelSet.map(({ idx, kind }) => {
          // push the focused label clear of the close-up body (ring included)
          const offsetPx = kind === "focused"
            ? Math.round((orbExtent(nodes[idx]) * uPx) / flyDistance(layout.neighbours[idx].length)) + 26
            : 14;
          return (
            <LabelAnchor key={`${nodes[idx].id}-${kind}`} idx={idx} live={livePos}>
              {/* the Html WRAPPER must stay pointer-transparent: its layout box
                  sits exactly on the star (the text is only transform-shifted),
                  and a pointer-active wrapper makes R3F read offsetX against
                  the wrapper → the ray shoots to the canvas corner. Only the
                  text itself opts back in, inside GalaxyLabel. */}
              <Html zIndexRange={[15, 0]} style={{ pointerEvents: "none" }}>
                <GalaxyLabel
                  node={nodes[idx]}
                  kind={kind}
                  offsetPx={offsetPx}
                  onSelect={kind === "focused" || kind === "hover" ? undefined : () => focus(idx)}
                />
              </Html>
            </LabelAnchor>
          );
        })}
      </group>
    </>
  );
}

// Points raycasts sort by distance ALONG the ray, so a nearer star can steal
// a click aimed squarely at a star behind it. Pick the hit whose centre is
// closest to the pointer ray instead — that's the star the user is pointing at.
function pickIndex(intersections: THREE.Intersection[]): number | null {
  let best: number | null = null;
  let bestD = Infinity;
  for (const hit of intersections) {
    if (hit.index === undefined) continue;
    // angular distance: world offset from the ray scaled by how far away the
    // hit is — a depth-biased compare let near stars steal far stars' clicks
    const d = (hit.distanceToRay ?? 0) / Math.max(hit.distance, 0.0001);
    if (d < bestD) { bestD = d; best = hit.index; }
  }
  return best;
}

// Tracks a (possibly gathering) star: copies its live position onto a group
// every frame so the Html label rides along without React re-renders.
function LabelAnchor({ idx, live, children }: { idx: number; live: Float32Array; children: React.ReactNode }) {
  const ref = useRef<THREE.Group>(null);
  useFrame(() => {
    ref.current?.position.set(live[idx * 3], live[idx * 3 + 1], live[idx * 3 + 2]);
  });
  return (
    <group ref={ref} position={[live[idx * 3], live[idx * 3 + 1], live[idx * 3 + 2]]}>
      {children}
    </group>
  );
}

function GalaxyLabel({ node, kind, offsetPx, onSelect }: {
  node: GalaxyNode; kind: string; offsetPx: number; onSelect?: () => void;
}) {
  const primary = kind === "focused";
  return (
    <div
      className="select-none"
      style={{
        // the focused star blooms into a sphere — push its label clear of the body
        transform: `translate(${offsetPx}px, -50%)`,
        whiteSpace: "nowrap",
        opacity: kind === "neighbour" ? 0.62 : 1,
        animation: "galaxy-label-in 0.45s ease both",
      }}
    >
      {/* clicks must NOT reach R3F's container listener (it would misread
          offsetX against this element and fire a bogus pointer-missed), so
          the native event is stopped here; window activation is signalled
          explicitly instead of relying on bubbling. */}
      <p
        onClick={onSelect ? (ev) => {
          ev.stopPropagation();
          ev.nativeEvent.stopPropagation();
          window.dispatchEvent(new CustomEvent("galaxy:activate"));
          onSelect();
        } : undefined}
        onPointerDown={onSelect ? (ev) => { ev.stopPropagation(); ev.nativeEvent.stopPropagation(); } : undefined}
        role={onSelect ? "button" : undefined}
        style={onSelect ? { pointerEvents: "auto" } : undefined}
        className={
          (primary
            ? "font-mono text-xs font-bold tracking-[0.08em] text-fg"
            : "font-mono text-[11px] tracking-[0.08em] text-fg/80") +
          (onSelect ? " cursor-pointer hover:text-fg" : "")
        }
      >
        {node.name}
      </p>
      {primary && node.meta && (
        <p className="font-mono text-[10px] tracking-[0.06em] text-fg-muted">{node.meta}</p>
      )}
      {primary && node.line && (
        <p
          className="mt-0.5 font-body text-[11px] leading-snug text-fg-muted"
          style={{ whiteSpace: "normal", width: 220 }}
        >
          {node.line}
        </p>
      )}
      {primary && node.link && (
        <a
          href={node.link}
          onClick={(e) => { e.stopPropagation(); e.nativeEvent.stopPropagation(); }}
          onPointerDown={(e) => { e.stopPropagation(); e.nativeEvent.stopPropagation(); }}
          style={{ pointerEvents: "auto" }}
          className="mt-1 inline-block font-mono text-[10px] tracking-[0.12em] text-fg/70 underline underline-offset-4 hover:text-fg"
          {...(node.link.startsWith("http") ? { target: "_blank", rel: "noreferrer" } : {})}
        >
          {node.link.startsWith("http") ? "view source ↗" : "open case study →"}
        </a>
      )}
    </div>
  );
}

export type GalaxyCanvasProps = {
  active: boolean;
  visible: boolean;
  reduced: boolean;
  tier: number;
};

export default function GalaxyCanvas({ active, visible, reduced, tier }: GalaxyCanvasProps) {
  const missGuard = useRef<[number, number] | null>(null);
  return (
    <Canvas
      dpr={[1, tier < 2 ? 1.5 : 2]}
      gl={{ powerPreference: "high-performance", antialias: false, alpha: false }}
      camera={{ position: HOME_CAM.toArray(), fov: 45 }}
      frameloop={visible ? "always" : "never"}
      raycaster={{ params: { Points: { threshold: 0.6 }, Line: { threshold: 0 }, Mesh: {}, LOD: {}, Sprite: {} } }}
      onPointerDown={(e) => { missGuard.current = [e.clientX, e.clientY]; }}
      onPointerMissed={(e) => {
        // an orbit drag ends with a "missed click" — only unfocus real clicks
        const d = missGuard.current;
        if (d && Math.hypot(e.clientX - d[0], e.clientY - d[1]) > 8) return;
        window.dispatchEvent(new CustomEvent("galaxy:unfocus"));
      }}
      aria-label="Interactive galaxy of Caroline's skills, jobs and projects"
      role="img"
    >
      <color attach="background" args={["#070709"]} />
      <GalaxyContentsWithUnfocus active={active} reduced={reduced} tier={tier} />
    </Canvas>
  );
}

// Bridges the canvas-level "missed click" (dispatched as a window event by
// onPointerMissed above) into the scene's focus state without lifting the
// whole focus state out of the R3F tree.
function GalaxyContentsWithUnfocus(props: Omit<ContentsProps, "unfocusSignal">) {
  const [unfocusSignal, setUnfocusSignal] = useState(0);
  useEffect(() => {
    const fn = () => setUnfocusSignal((s) => s + 1);
    window.addEventListener("galaxy:unfocus", fn);
    return () => window.removeEventListener("galaxy:unfocus", fn);
  }, []);
  return <GalaxyContents {...props} unfocusSignal={unfocusSignal} />;
}
