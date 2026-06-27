// Carousel data. Index 0 is the one finished card (Nest); the rest are
// scaffolding placeholders to flesh out in later design passes — drop in a
// company, copy, tags and an `image` when each is ready and remove `placeholder`.
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
    slug: "nest-agentic-rag",
    company: "E.ON Next",
    title: "Designing an AI Brain for a Support Call Centre",
    description:
      "redesigned an agentic rag that energy specialists trust to answer complex customer queries, reaching 89.4% adoption",
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
    title: "Compounding memory with knowledge graphs and agentic RAG",
    description:
      "built a memory-first reflection agent for the london langchain x surrealdb hackathon",
    tags: ["Product", "AI Architecture", "Backend"],
    accent: "linear-gradient(120deg, #C24E86 0%, #6D1B76 100%)",
  },
  { slug: "project-04", company: "E.ON Next", title: "AI design system", description: "", tags: [], placeholder: true },
  { slug: "project-05", company: "vector", title: "AI onboarding platform", description: "", tags: [], placeholder: true },
];
