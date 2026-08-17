// Carousel data. ARRAY ORDER = display order (cards dispatch by slug in
// VariantBentoSoft, so reordering here is all it takes). Current order is the
// founding-role screen order (2026-08-17): Vector (solo, shipped, full-stack)
// first, then Wiki Whisperer, Cog, Synapse, AI DS. Gateway slots 4th once its
// study ships.
export type Project = {
  slug: string;
  company: string;
  title: string;
  description: string;
  tags: string[];
  /** CSS background for the right-hand imagery panel until a real asset lands. */
  accent?: string;
  /** Path under /public for the project imagery (swap the gradient for <Image>). */
  image?: string;
  placeholder?: boolean;
};

export const projects: Project[] = [
  {
    slug: "project-05",
    company: "vector",
    title: "Rethinking time-to-value\nin B2B SaaS onboarding",
    description:
      "built an ai-native vendor-customer platform that makes onboarding effortless on both sides",
    tags: ["Product", "UX/UI", "AI", "Full-stack"],
  },
  {
    slug: "nest-agentic-rag",
    company: "E.ON Next",
    title: "Designing an AI Brain for a Support Call Centre",
    description:
      "redesigned a knowledge system that cut follow-up contacts for 94% of support agents",
    tags: ["Research", "UX/UI", "Testing", "Launch"],
    accent: "linear-gradient(120deg, #ff7a2a 0%, #ff006e 52%, #7a3bff 100%)",
  },
  {
    slug: "cog-adhd",
    company: "cog adhd",
    title: "Gaps and opportunities in ADHD therapy processes",
    description:
      "drove bookings and engagement through flow optimisation and a check-in history feature",
    tags: ["Research", "UX/UI", "Testing", "Launch"],
    accent: "linear-gradient(120deg, #F2922E 0%, #189E71 100%)",
  },
  {
    slug: "synapse",
    company: "synapse",
    title: "Compounding memory\nwith knowledge graphs\nand agentic RAG",
    description:
      "built a memory-first reflection agent for the london langchain x surrealdb hackathon",
    tags: ["Product", "AI Architecture", "Backend"],
    accent: "linear-gradient(120deg, #C24E86 0%, #6D1B76 100%)",
  },
  {
    slug: "project-04",
    company: "E.ON Next",
    title: "AI design system for\nE.ON Next tech products",
    description:
      "built the brand identity and a reusable component library that gives e.on next's ai products one consistent design language",
    tags: ["Brand", "Design System", "UX/UI"],
  },
];
