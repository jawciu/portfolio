// layout.ts — deterministic 3D force layout for the skills galaxy.
//
// Runs once on the client (useMemo) over the ~90 nodes from lib/galaxyData.
// Seeded PRNG throughout: the same data always produces the same galaxy, so
// there is nothing to hydration-mismatch and the constellation shapes are
// stable between visits.
//
// Shape strategy: each skill cluster gets an anchor direction on a ring
// around the origin; the career nodes (jobs + projects) live nearer the
// middle so skills naturally arc around the work they connect to; easter
// eggs drift on a wide outer shell. A small spring/repulsion sim then
// untangles everything along the real edges.

import type { GalaxyNode, GalaxyEdge } from "@/lib/galaxyData";

export type LaidOutGalaxy = {
  /** xyz per node, same order as the input nodes array. */
  positions: Float32Array;
  /** node id → index into the nodes array. */
  index: Map<string, number>;
  /** per-node neighbour index lists (from the edges). */
  neighbours: number[][];
  /** edge endpoint indices, same order as the input edges array. */
  edgeIndices: [number, number][];
};

// mulberry32 — tiny seeded PRNG, plenty for scatter.
function prng(seed: number) {
  let a = seed >>> 0;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// Cluster anchor directions. Career sits central-low; the six skill clusters
// ring around it; side quests scatter far out (their anchor pull is weak).
const ANCHORS: Record<string, [number, number, number]> = {
  career: [0, -0.6, 0],
  design: [7.5, 2.2, 1.5],
  research: [-7.5, 2.8, -1.0],
  ai: [1.5, 6.8, -2.5],
  engineering: [-3.5, -5.8, 3.0],
  product: [5.5, -4.2, -3.5],
  leadership: [-6.0, -1.8, -4.5],
  sidequest: [0, 1.5, 0], // weak pull; the wide init shell does the scattering
};

export function layoutGalaxy(nodes: GalaxyNode[], edges: GalaxyEdge[]): LaidOutGalaxy {
  const n = nodes.length;
  const rand = prng(20260731);
  const pos = new Float64Array(n * 3);
  const index = new Map(nodes.map((node, i) => [node.id, i]));

  // ── init: anchor + jittered shell ─────────────────────────────────
  nodes.forEach((node, i) => {
    const anchor = ANCHORS[node.cluster] ?? ANCHORS.career;
    const spread = node.cluster === "sidequest" ? 13 : node.cluster === "career" ? 5.5 : 3.2;
    // random direction (rejection-free: normalise a gaussian-ish triple)
    const dx = rand() * 2 - 1, dy = rand() * 2 - 1, dz = rand() * 2 - 1;
    const len = Math.hypot(dx, dy, dz) || 1;
    const r = node.cluster === "sidequest" ? spread * (0.75 + rand() * 0.5) : spread * Math.cbrt(rand());
    pos[i * 3] = anchor[0] + (dx / len) * r;
    pos[i * 3 + 1] = anchor[1] + (dy / len) * r;
    pos[i * 3 + 2] = anchor[2] + (dz / len) * r;
  });

  const edgeIndices: [number, number][] = edges.map(([a, b]) => {
    const ia = index.get(a), ib = index.get(b);
    if (ia === undefined || ib === undefined) throw new Error(`galaxy edge references unknown id: ${a} → ${b}`);
    return [ia, ib];
  });

  const neighbours: number[][] = Array.from({ length: n }, () => []);
  for (const [a, b] of edgeIndices) {
    neighbours[a].push(b);
    neighbours[b].push(a);
  }

  // ── force sim ─────────────────────────────────────────────────────
  const vel = new Float64Array(n * 3);
  const SPRING = 0.028;      // edge attraction
  const REST = 2.4;          // edge rest length
  const REPEL = 3.4;         // node-node repulsion strength
  const ANCHOR_K = 0.015;    // pull toward cluster anchor
  const CENTER_K = 0.004;    // global centring
  const DAMP = 0.82;

  for (let iter = 0; iter < 320; iter++) {
    // repulsion, all pairs (n≈90 → trivial)
    for (let i = 0; i < n; i++) {
      for (let j = i + 1; j < n; j++) {
        let dx = pos[i * 3] - pos[j * 3];
        let dy = pos[i * 3 + 1] - pos[j * 3 + 1];
        let dz = pos[i * 3 + 2] - pos[j * 3 + 2];
        const d2 = dx * dx + dy * dy + dz * dz + 0.05;
        const f = Math.min(REPEL / d2, 1.2);
        const d = Math.sqrt(d2);
        dx /= d; dy /= d; dz /= d;
        vel[i * 3] += dx * f; vel[i * 3 + 1] += dy * f; vel[i * 3 + 2] += dz * f;
        vel[j * 3] -= dx * f; vel[j * 3 + 1] -= dy * f; vel[j * 3 + 2] -= dz * f;
      }
    }
    // springs
    for (const [a, b] of edgeIndices) {
      let dx = pos[b * 3] - pos[a * 3];
      let dy = pos[b * 3 + 1] - pos[a * 3 + 1];
      let dz = pos[b * 3 + 2] - pos[a * 3 + 2];
      const d = Math.hypot(dx, dy, dz) || 1;
      const f = SPRING * (d - REST);
      dx /= d; dy /= d; dz /= d;
      vel[a * 3] += dx * f; vel[a * 3 + 1] += dy * f; vel[a * 3 + 2] += dz * f;
      vel[b * 3] -= dx * f; vel[b * 3 + 1] -= dy * f; vel[b * 3 + 2] -= dz * f;
    }
    // anchor + centre gravity, integrate
    for (let i = 0; i < n; i++) {
      const node = nodes[i];
      const anchor = ANCHORS[node.cluster] ?? ANCHORS.career;
      const k = node.cluster === "sidequest" ? ANCHOR_K * 0.12 : ANCHOR_K;
      vel[i * 3] += (anchor[0] - pos[i * 3]) * k - pos[i * 3] * CENTER_K;
      vel[i * 3 + 1] += (anchor[1] - pos[i * 3 + 1]) * k - pos[i * 3 + 1] * CENTER_K;
      vel[i * 3 + 2] += (anchor[2] - pos[i * 3 + 2]) * k - pos[i * 3 + 2] * CENTER_K;
      vel[i * 3] *= DAMP; vel[i * 3 + 1] *= DAMP; vel[i * 3 + 2] *= DAMP;
      pos[i * 3] += vel[i * 3]; pos[i * 3 + 1] += vel[i * 3 + 1]; pos[i * 3 + 2] += vel[i * 3 + 2];
    }
  }

  // ── normalise scale so the galaxy always fits the same framing ────
  let maxR = 0;
  for (let i = 0; i < n; i++) {
    maxR = Math.max(maxR, Math.hypot(pos[i * 3], pos[i * 3 + 1], pos[i * 3 + 2]));
  }
  const scale = 11.5 / (maxR || 1);
  const out = new Float32Array(n * 3);
  for (let i = 0; i < n * 3; i++) out[i] = pos[i] * scale;
  // squash height a touch: the window is wide, and un-squashed the tallest
  // skills poked above the frame at the home camera (unclickable at rest)
  for (let i = 0; i < n; i++) out[i * 3 + 1] *= 0.85;

  return { positions: out, index, neighbours, edgeIndices };
}
