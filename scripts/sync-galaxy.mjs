// sync-galaxy.mjs — regenerate lib/galaxyData.ts from GALAXY.md.
//
//   node scripts/sync-galaxy.mjs
//
// GALAXY.md is the human-edited source of truth (markdown tables); the site
// only ever imports the generated lib/galaxyData.ts. This script parses the
// four tables (Jobs / Projects / Skills / Easter eggs), validates every
// cross-reference, and errors loudly on a dangling id so a typo in the md
// can never ship as a broken edge.

import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const md = readFileSync(join(root, "GALAXY.md"), "utf8");

// ── markdown table parsing ──────────────────────────────────────────
// Returns rows of the first table found under the `## <heading>` line,
// as objects keyed by lowercased header cell.
function parseTable(heading) {
  const lines = md.split("\n");
  const start = lines.findIndex((l) => l.trim() === `## ${heading}`);
  if (start === -1) throw new Error(`GALAXY.md: missing section "## ${heading}"`);
  let i = start + 1;
  while (i < lines.length && !lines[i].trim().startsWith("|")) {
    if (lines[i].trim().startsWith("## ")) throw new Error(`GALAXY.md: no table under "## ${heading}"`);
    i++;
  }
  const rows = [];
  let headers = null;
  for (; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line.startsWith("|")) break;
    const cells = line.slice(1, line.endsWith("|") ? -1 : undefined).split("|").map((c) => c.trim());
    if (cells.every((c) => /^:?-+:?$/.test(c))) continue; // separator row
    if (!headers) headers = cells.map((c) => c.toLowerCase());
    else rows.push(Object.fromEntries(headers.map((h, k) => [h, cells[k] ?? ""])));
  }
  return rows;
}

const jobs = parseTable("Jobs").filter((r) => r.show === "yes");
const projects = parseTable("Projects").filter((r) => r.show === "yes");
const skills = parseTable("Skills").filter((r) => r.show === "yes");
const eggs = parseTable("Easter eggs").filter((r) => r.show === "yes");

// ── build nodes + edges ─────────────────────────────────────────────
const nodes = [];
const edges = [];

for (const j of jobs) {
  nodes.push({
    id: j.id, type: "job", name: j.name, cluster: "career",
    line: j["one-liner"], meta: [j.role, j.dates].filter(Boolean).join(" · "), size: 2,
  });
}
for (const p of projects) {
  nodes.push({
    id: p.id, type: "project", name: p.name, cluster: "career",
    line: p["one-liner"], size: p.link ? 2 : 1,
    ...(p.link ? { link: p.link } : {}),
  });
  if (p.job) edges.push([p.id, p.job]);
}
for (const s of skills) {
  nodes.push({
    id: s.id, type: "skill", name: s.name, cluster: s.cluster,
    size: Number(s.size) || 1, ...(s.featured === "yes" ? { featured: true } : {}),
  });
  for (const t of s.connects.split(/\s+/).filter(Boolean)) edges.push([s.id, t]);
}
for (const e of eggs) {
  nodes.push({
    id: e.id, type: "egg", name: e.name, cluster: "sidequest",
    line: e["one-liner"], size: 1,
  });
  for (const t of e.connects.split(/\s+/).filter(Boolean)) edges.push([e.id, t]);
}

// ── validate ────────────────────────────────────────────────────────
const ids = new Set(nodes.map((n) => n.id));
if (ids.size !== nodes.length) {
  const seen = new Set();
  const dup = nodes.map((n) => n.id).find((id) => (seen.has(id) ? true : (seen.add(id), false)));
  throw new Error(`GALAXY.md: duplicate id "${dup}"`);
}
for (const [a, b] of edges) {
  for (const id of [a, b]) {
    if (!ids.has(id)) throw new Error(`GALAXY.md: edge ${a} → ${b} references unknown or hidden id "${id}"`);
  }
}
const clusters = new Set(["design", "research", "ai", "engineering", "product", "leadership"]);
for (const s of skills) {
  if (!clusters.has(s.cluster)) throw new Error(`GALAXY.md: skill "${s.id}" has unknown cluster "${s.cluster}"`);
}

// ── emit ────────────────────────────────────────────────────────────
const banner = `// GENERATED from GALAXY.md by scripts/sync-galaxy.mjs — DO NOT EDIT BY HAND.
// Edit the tables in GALAXY.md, then run: node scripts/sync-galaxy.mjs

export type GalaxyNodeType = "job" | "project" | "skill" | "egg";

export type GalaxyNode = {
  id: string;
  type: GalaxyNodeType;
  /** Star label. */
  name: string;
  /** Constellation the star belongs to (skill clusters, "career", "sidequest"). */
  cluster: string;
  /** 1 small · 2 medium · 3 hub. */
  size: number;
  /** One line shown beside the star when focused. */
  line?: string;
  /** Secondary line for jobs (role · dates). */
  meta?: string;
  /** Route or URL the focused card can link to. */
  link?: string;
  /** Pre-focused with a visible label at page load. */
  featured?: boolean;
};

/** [sourceId, targetId] pairs. */
export type GalaxyEdge = [string, string];
`;

const body = `
export const GALAXY_NODES: GalaxyNode[] = ${JSON.stringify(nodes, null, 2)};

export const GALAXY_EDGES: GalaxyEdge[] = ${JSON.stringify(edges)};
`;

writeFileSync(join(root, "lib", "galaxyData.ts"), banner + body);
console.log(`galaxyData.ts written: ${nodes.length} nodes, ${edges.length} edges`);
