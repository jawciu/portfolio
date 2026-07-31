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

const HOME_CAM = new THREE.Vector3(0, 2.5, 17);
const HOME_TARGET = new THREE.Vector3(0, 0, 0);

// Halo geometry: neighbours gather on a ring of this radius; the camera
// stands back proportionally so every neighbourhood fills the same fraction
// of the frame whether a node has 3 connections or 21.
const haloRadius = (n: number) => Math.min(2.2 + n * 0.09, 3.4);
const flyDistance = (n: number) => Math.max(4.6, haloRadius(n) * 2.55);

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

// vivid Hubble-ish nebula pools: [tint, scale, position]
const NEBULAS: [string, number, [number, number, number]][] = [
  ["#7a2a5a", 26, [7, 3, -9]],
  ["#1f5a7a", 22, [-8, 0, -7]],
  ["#4a2a8a", 24, [0, -6, -10]],
  ["#7a3a1f", 18, [9, -4, -6]],
  ["#2a6a4a", 16, [-5, 5, -8]],
  ["#5a1f3a", 20, [2, 7, -9]],
];

function GalaxyContents({ active, reduced, tier, unfocusSignal }: ContentsProps) {
  const nodes = GALAXY_NODES;
  const layout = useMemo(() => layoutGalaxy(nodes, GALAXY_EDGES), [nodes]);

  const { camera, size } = useThree();
  // drei's OrbitControls type isn't exported cleanly; we only touch .target/.update()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const controlsRef = useRef<any>(null);
  const groupRef = useRef<THREE.Group>(null);
  const dustRef = useRef<THREE.Group>(null);
  const starMatRef = useRef<THREE.ShaderMaterial>(null);
  const bgMatRef = useRef<THREE.ShaderMaterial>(null);
  const dustMatRef = useRef<THREE.ShaderMaterial>(null);

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
  useEffect(() => () => { edgeGeom.dispose(); }, [edgeGeom]);

  const glowTex = useMemo(() => radialTexture(), []);
  useEffect(() => () => { glowTex.dispose(); }, [glowTex]);

  // ── focus targets: dim / boost / edge alpha / gather positions ─────
  const dimTarget = useRef(new Float32Array(nodes.length));
  const boostTarget = useRef(new Float32Array(nodes.length).fill(1));
  const edgeAlphaTarget = useRef(new Float32Array(layout.edgeIndices.length * 2).fill(REST_EDGE_ALPHA));

  useEffect(() => {
    const dims = dimTarget.current;
    const boosts = boostTarget.current;
    const ea = edgeAlphaTarget.current;
    const targetPos = targetPosRef.current;
    if (!targetPos) return;
    targetPos.set(layout.positions); // everyone returns home by default
    if (focused === null) {
      dims.fill(0);
      boosts.fill(1);
      ea.fill(REST_EDGE_ALPHA);
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
        .addScaledVector(v, Math.sin(ang) * rr)
        .addScaledVector(dir, depth);
      targetPos.set([p.x, p.y, p.z], nb * 3);
    });
  }, [focused, layout, nodes, camera]);

  // ── camera fly-in / fly-home ──────────────────────────────────────
  const flyTo = useCallback((idx: number | null) => {
    const controls = controlsRef.current;
    const dur = reduced ? 0 : idx === null ? 1.4 : 1.7;
    gsap.killTweensOf(camera.position);
    if (controls) gsap.killTweensOf(controls.target);
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
    gsap.to(camera.position, { x: camTo.x, y: camTo.y, z: camTo.z, duration: dur, ease: "power2.inOut" });
    if (controls) {
      gsap.to(controls.target, {
        x: targetTo.x, y: targetTo.y, z: targetTo.z, duration: dur, ease: "power2.inOut",
        onUpdate: () => controls.update(),
      });
    }
  }, [camera, layout, reduced]);

  const focus = useCallback((idx: number | null) => {
    setFocused(idx);
    flyTo(idx);
  }, [flyTo]);

  // A user grab always beats the choreography — kill in-flight tweens.
  useEffect(() => {
    const controls = controlsRef.current;
    if (!controls) return;
    const onStart = () => {
      gsap.killTweensOf(camera.position);
      gsap.killTweensOf(controls.target);
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
    if (controlsRef.current) gsap.killTweensOf(controlsRef.current.target);
  }, [camera]);

  // ── per-frame work ────────────────────────────────────────────────
  const driftSpeed = useRef(0);
  useFrame((_, dt) => {
    const t = Math.min(dt, 0.05);
    if (starMatRef.current) starMatRef.current.uniforms.uTime.value += t;
    if (bgMatRef.current) bgMatRef.current.uniforms.uTime.value += t;
    if (dustMatRef.current) dustMatRef.current.uniforms.uTime.value += t;

    // idle drift eases in and out instead of stopping dead
    const driftGoal = !active && focused === null && !reduced ? 0.02 : 0;
    driftSpeed.current += (driftGoal - driftSpeed.current) * Math.min(1, t * 2);
    if (groupRef.current) groupRef.current.rotation.y += driftSpeed.current * t * 60 * 0.0167;
    if (dustRef.current && !reduced) dustRef.current.rotation.y -= t * 0.004;

    const k = reduced ? 1 : Math.min(1, t * 6.5);
    // gather / release: lerp live positions toward targets
    const posAttr = starGeom.getAttribute("position") as THREE.BufferAttribute;
    const live = posAttr.array as Float32Array;
    const targetPos = targetPosRef.current;
    let posMoved = false;
    if (targetPos) {
      for (let i = 0; i < live.length; i++) {
        const d = targetPos[i] - live[i];
        if (Math.abs(d) > 0.0005) { live[i] += d * Math.min(1, reduced ? 1 : t * 3.2); posMoved = true; }
      }
    }
    if (posMoved) {
      posAttr.needsUpdate = true;
      const ePos = edgeGeom.getAttribute("position") as THREE.BufferAttribute;
      const eArr = ePos.array as Float32Array;
      layout.edgeIndices.forEach(([a, b], m) => {
        eArr[m * 6] = live[a * 3]; eArr[m * 6 + 1] = live[a * 3 + 1]; eArr[m * 6 + 2] = live[a * 3 + 2];
        eArr[m * 6 + 3] = live[b * 3]; eArr[m * 6 + 4] = live[b * 3 + 1]; eArr[m * 6 + 5] = live[b * 3 + 2];
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
  });

  // px factor for projection-correct point sizes
  const uPx = useMemo(
    () => size.height / (2 * Math.tan(((camera as THREE.PerspectiveCamera).fov * Math.PI) / 360)),
    [size.height, camera],
  );
  useEffect(() => {
    for (const m of [starMatRef.current, bgMatRef.current, dustMatRef.current]) {
      if (m) m.uniforms.uPx.value = uPx;
    }
  }, [uPx]);

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
        {/* nebula glow pools */}
        {NEBULAS.map(([hex, s, p]) => (
          <sprite key={hex} position={p} scale={[s, s, 1]}>
            <spriteMaterial
              map={glowTex}
              color={hex}
              blending={THREE.AdditiveBlending}
              depthWrite={false}
              opacity={0.55}
            />
          </sprite>
        ))}

        {tier >= 2 && (
          <Sparkles
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

        {/* node stars */}
        <points
          geometry={starGeom}
          frustumCulled={false}
          onPointerMove={(e) => { e.stopPropagation(); if (e.index !== undefined) setHovered(e.index); }}
          onPointerOut={() => setHovered(null)}
          onClick={(e) => {
            e.stopPropagation();
            if (e.index !== undefined) focus(e.index);
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
            the window-chrome bar (z-20) so labels slide under it, not over. */}
        {labelSet.map(({ idx, kind }) => {
          // push the focused label clear of the close-up body (ring included)
          const offsetPx = kind === "focused"
            ? Math.round((orbExtent(nodes[idx]) * uPx) / flyDistance(layout.neighbours[idx].length)) + 26
            : 14;
          return (
            <LabelAnchor key={`${nodes[idx].id}-${kind}`} idx={idx} live={livePos}>
              <Html
                zIndexRange={[15, 0]}
                style={{ pointerEvents: kind === "focused" && nodes[idx].link ? "auto" : "none" }}
              >
                <GalaxyLabel node={nodes[idx]} kind={kind} offsetPx={offsetPx} />
              </Html>
            </LabelAnchor>
          );
        })}
      </group>
    </>
  );
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

function GalaxyLabel({ node, kind, offsetPx }: { node: GalaxyNode; kind: string; offsetPx: number }) {
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
      <p
        className={
          primary
            ? "font-mono text-xs font-bold tracking-[0.08em] text-fg"
            : "font-mono text-[11px] tracking-[0.08em] text-fg/80"
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
          onClick={(e) => e.stopPropagation()}
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
      raycaster={{ params: { Points: { threshold: 0.42 }, Line: { threshold: 0 }, Mesh: {}, LOD: {}, Sprite: {} } }}
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
