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
    title: "Designing agentic RAG to help with cognitive load",
    description:
      "Improved cognitive load by giving users agentic RAG that answers their questions.",
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
  { slug: "project-03", company: "Project 03", title: "Project 03", description: "", tags: [], placeholder: true },
  { slug: "project-04", company: "Project 04", title: "Project 04", description: "", tags: [], placeholder: true },
  { slug: "project-05", company: "Project 05", title: "Project 05", description: "", tags: [], placeholder: true },
];
