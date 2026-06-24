// PROTOTYPE — extra metadata so the showcase variants have something rich to
// render (year / role / stack / status / one-liner). Keyed by project slug.
// This is throwaway: once a winning variant is chosen, fold the fields that
// survive into lib/projects.ts and delete this file.
import { projects, type Project } from "@/lib/projects";

export type ProjectMeta = {
  year: string;
  role: string;
  stack: string[];
  status: "Shipped" | "In progress" | "Concept";
  /** short single-line hook for dense list/grid views */
  oneLiner: string;
};

const META: Record<string, ProjectMeta> = {
  "nest-agentic-rag": {
    year: "2026",
    role: "Lead Product Designer",
    stack: ["Figma", "Agentic RAG", "React", "User Research"],
    status: "Shipped",
    oneLiner: "Cut cognitive load with an agent that answers before you ask.",
  },
  "cog-adhd": {
    year: "2025",
    role: "Lead Product Designer",
    stack: ["Figma", "Agentic RAG", "User Research", "Prototyping"],
    status: "Shipped",
    oneLiner: "Cut cognitive load in ADHD therapy with an agent that answers before you ask.",
  },
  // Placeholders — swap real content in as each project is ready.
  "project-03": { year: "2024", role: "Product Designer", stack: ["Figma", "Prototyping"], status: "Concept", oneLiner: "Placeholder — drop in the real story." },
  "project-04": { year: "2023", role: "Product Designer", stack: ["Figma", "Research"], status: "Concept", oneLiner: "Placeholder — drop in the real story." },
  "project-05": { year: "2023", role: "Product Designer", stack: ["Figma", "Branding"], status: "Concept", oneLiner: "Placeholder — drop in the real story." },
};

export type EnrichedProject = Project & ProjectMeta;

export const enriched: EnrichedProject[] = projects.map((p) => ({
  ...p,
  ...(META[p.slug] ?? {
    year: "—",
    role: "Product Designer",
    stack: [],
    status: "Concept" as const,
    oneLiner: p.description || "Placeholder",
  }),
}));
