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
  /** short project name shown on the collapsed bento spine, distinct from the
      company — so multiple projects under one brand (e.g. E.ON Next) read apart */
  name: string;
};

const META: Record<string, ProjectMeta> = {
  "nest-agentic-rag": {
    year: "2026",
    role: "Lead Product Designer",
    stack: ["Figma", "Agentic RAG", "React", "User Research"],
    status: "Shipped",
    oneLiner: "Cut cognitive load with an agent that answers before you ask.",
    name: "Wiki Whisperer",
  },
  "cog-adhd": {
    year: "2025",
    role: "Lead Product Designer",
    stack: ["Figma", "Agentic RAG", "User Research", "Prototyping"],
    status: "Shipped",
    oneLiner: "Cut cognitive load in ADHD therapy with an agent that answers before you ask.",
    name: "mental health support",
  },
  "synapse": {
    year: "2026",
    role: "Product & AI Engineer",
    stack: ["LangChain", "SurrealDB", "Agentic RAG", "Knowledge Graphs"],
    status: "Concept",
    oneLiner: "A memory-first reflection agent built at the LangChain x SurrealDB hackathon.",
    name: "building ai agents",
  },
  // Placeholders — open-card design coming soon.
  "project-04": { year: "2026", role: "Product Designer", stack: ["Figma", "Research"], status: "Concept", oneLiner: "Placeholder — drop in the real story.", name: "AI design system" },
  "project-05": { year: "2026", role: "Design + Build (solo)", stack: ["Next.js", "Claude API", "Prisma", "Supabase"], status: "Shipped", oneLiner: "An AI-native onboarding platform, designed and built end to end.", name: "AI onboarding platform" },
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
    name: p.title,
  }),
}));
