// GENERATED from GALAXY.md by scripts/sync-galaxy.mjs — DO NOT EDIT BY HAND.
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

export const GALAXY_NODES: GalaxyNode[] = [
  {
    "id": "eon",
    "type": "job",
    "name": "E.ON Next",
    "cluster": "career",
    "line": "AI tools for a support call centre, designed end to end",
    "meta": "product designer · 2025 – now",
    "size": 2
  },
  {
    "id": "cog",
    "type": "job",
    "name": "Cog",
    "cluster": "career",
    "line": "0→1 ADHD app and online therapy clinic, first design hire",
    "meta": "founding designer · 2023 – 2025",
    "size": 2
  },
  {
    "id": "brainstation",
    "type": "job",
    "name": "BrainStation",
    "cluster": "career",
    "line": "top of class, then came back to teach it",
    "meta": "product design educator · 2023",
    "size": 2
  },
  {
    "id": "casablanca",
    "type": "job",
    "name": "Casablanca Paris",
    "cluster": "career",
    "line": "luxury fashion house, print and graphics",
    "meta": "senior print designer · 2022 – 2023",
    "size": 2
  },
  {
    "id": "burberry",
    "type": "job",
    "name": "Burberry",
    "cluster": "career",
    "line": "led a team of 6 designers",
    "meta": "senior print designer · 2021 – 2022",
    "size": 2
  },
  {
    "id": "consultancy",
    "type": "job",
    "name": "Design consultant",
    "cluster": "career",
    "line": "led creative projects for high-profile clients",
    "meta": "self-employed · 2019 – 2021",
    "size": 2
  },
  {
    "id": "julien-macdonald",
    "type": "job",
    "name": "Julien Macdonald",
    "cluster": "career",
    "line": "mentored and coordinated a group of interns",
    "meta": "knitwear & print designer · 2018 – 2019",
    "size": 2
  },
  {
    "id": "mcqueen",
    "type": "job",
    "name": "Alexander McQueen",
    "cluster": "career",
    "line": "couture-level craft under pressure",
    "meta": "print designer · 2019 – 2021",
    "size": 2
  },
  {
    "id": "mary",
    "type": "job",
    "name": "Mary Katrantzou",
    "cluster": "career",
    "line": "textiles and graphics for shows and commercial work across 14 seasons",
    "meta": "textile & print designer · 2014 – 2017",
    "size": 2
  },
  {
    "id": "pilotto",
    "type": "job",
    "name": "Peter Pilotto",
    "cluster": "career",
    "line": "managed garment print production and sampling",
    "meta": "2019",
    "size": 2
  },
  {
    "id": "wiki-whisperer",
    "type": "project",
    "name": "Wiki Whisperer V2",
    "cluster": "career",
    "line": "rebuilt a failed AI assistant into an agent 97% would recommend",
    "size": 2,
    "link": "/project/wiki-whisperer"
  },
  {
    "id": "ai-design-system",
    "type": "project",
    "name": "AI design system",
    "cluster": "career",
    "line": "one design language for every E.ON Next AI product, built from scratch",
    "size": 1
  },
  {
    "id": "performance-tools",
    "type": "project",
    "name": "Performance tools",
    "cluster": "career",
    "line": "replaced 12+ Tableau reports with one coaching dashboard",
    "size": 1
  },
  {
    "id": "gateway",
    "type": "project",
    "name": "B2B handovers",
    "cluster": "career",
    "line": "property developer handovers, from spreadsheet debt to a product",
    "size": 1
  },
  {
    "id": "figma-make-kit",
    "type": "project",
    "name": "Figma Make boilerplates",
    "cluster": "career",
    "line": "on-brand prototyping kits adopted across product teams",
    "size": 1
  },
  {
    "id": "live-help",
    "type": "project",
    "name": "Live Help",
    "cluster": "career",
    "line": "live transcription that catches a missed journey step and nudges it back, in build",
    "size": 1
  },
  {
    "id": "call-analytics",
    "type": "project",
    "name": "360 call analytics",
    "cluster": "career",
    "line": "AI call evaluation trained on leaders' past reviews, every call instead of two a month",
    "size": 1
  },
  {
    "id": "perf-insights",
    "type": "project",
    "name": "Performance insights",
    "cluster": "career",
    "line": "links call metrics to transcripts to spot the trends worth upskilling on",
    "size": 1
  },
  {
    "id": "eon-ds",
    "type": "project",
    "name": "E.ON design system",
    "cluster": "career",
    "line": "building and maintaining the core design system",
    "size": 1
  },
  {
    "id": "cog-clinic",
    "type": "project",
    "name": "Cog Clinic redesign",
    "cluster": "career",
    "line": "research-led booking redesign that earned the first therapy revenue",
    "size": 2,
    "link": "/project/cog-adhd"
  },
  {
    "id": "check-in",
    "type": "project",
    "name": "Check-in history",
    "cluster": "career",
    "line": "weekly symptom overview so users could answer \"how was your week?\"",
    "size": 1
  },
  {
    "id": "daily-insights",
    "type": "project",
    "name": "Daily insights",
    "cluster": "career",
    "line": "150+ therapist-written insights with a matching algorithm",
    "size": 1
  },
  {
    "id": "subscription",
    "type": "project",
    "name": "Subscription launch",
    "cluster": "career",
    "line": "designed the free-to-paid transition and first recurring revenue",
    "size": 1
  },
  {
    "id": "self-help",
    "type": "project",
    "name": "CBT self-help modules",
    "cluster": "career",
    "line": "turned the in-person therapy journey into bite-sized illustrated stories",
    "size": 1
  },
  {
    "id": "cog-website",
    "type": "project",
    "name": "cogadhd.com",
    "cluster": "career",
    "line": "designed and built the marketing site in three weeks",
    "size": 1
  },
  {
    "id": "cog-ds",
    "type": "project",
    "name": "Cog design system",
    "cluster": "career",
    "line": "reusable component library and brand kit",
    "size": 1
  },
  {
    "id": "vector",
    "type": "project",
    "name": "Vector",
    "cluster": "career",
    "line": "AI-native B2B onboarding workspace, designed and built solo",
    "size": 2,
    "link": "/project/vector"
  },
  {
    "id": "synapse",
    "type": "project",
    "name": "Synapse",
    "cluster": "career",
    "line": "memory-first journaling agent on a knowledge graph, owned backend and AI orchestration",
    "size": 2,
    "link": "https://github.com/jawciu/synapse"
  },
  {
    "id": "portfolio",
    "type": "project",
    "name": "This site",
    "cluster": "career",
    "line": "hand-built WebGL portfolio, the galaxy you are flying through",
    "size": 2,
    "link": "https://github.com/jawciu/portfolio"
  },
  {
    "id": "zero-to-one",
    "type": "skill",
    "name": "0→1 product design",
    "cluster": "design",
    "size": 3,
    "featured": true
  },
  {
    "id": "design-systems",
    "type": "skill",
    "name": "design systems",
    "cluster": "design",
    "size": 3,
    "featured": true
  },
  {
    "id": "brand-identity",
    "type": "skill",
    "name": "brand identity",
    "cluster": "design",
    "size": 2,
    "featured": true
  },
  {
    "id": "visual-craft",
    "type": "skill",
    "name": "visual craft",
    "cluster": "design",
    "size": 2,
    "featured": true
  },
  {
    "id": "motion-design",
    "type": "skill",
    "name": "motion design",
    "cluster": "design",
    "size": 1
  },
  {
    "id": "dense-data-ui",
    "type": "skill",
    "name": "dense-data UI",
    "cluster": "design",
    "size": 2
  },
  {
    "id": "accessibility",
    "type": "skill",
    "name": "accessibility",
    "cluster": "design",
    "size": 1
  },
  {
    "id": "prototyping",
    "type": "skill",
    "name": "prototyping",
    "cluster": "design",
    "size": 1
  },
  {
    "id": "figma-advanced",
    "type": "skill",
    "name": "Figma, the deep end",
    "cluster": "design",
    "size": 2
  },
  {
    "id": "print-design",
    "type": "skill",
    "name": "print & textile design",
    "cluster": "design",
    "size": 2
  },
  {
    "id": "art-direction",
    "type": "skill",
    "name": "art direction",
    "cluster": "design",
    "size": 1
  },
  {
    "id": "information-arch",
    "type": "skill",
    "name": "information architecture",
    "cluster": "design",
    "size": 1
  },
  {
    "id": "conversion-design",
    "type": "skill",
    "name": "conversion design",
    "cluster": "design",
    "size": 1
  },
  {
    "id": "moodboarding",
    "type": "skill",
    "name": "moodboarding",
    "cluster": "design",
    "size": 1
  },
  {
    "id": "brand-guidelines",
    "type": "skill",
    "name": "brand guidelines",
    "cluster": "design",
    "size": 1
  },
  {
    "id": "logo-design",
    "type": "skill",
    "name": "logo design",
    "cluster": "design",
    "size": 1
  },
  {
    "id": "user-interviews",
    "type": "skill",
    "name": "user interviews",
    "cluster": "research",
    "size": 2
  },
  {
    "id": "usability-testing",
    "type": "skill",
    "name": "usability testing",
    "cluster": "research",
    "size": 1
  },
  {
    "id": "pilot-design",
    "type": "skill",
    "name": "pilot & experiment design",
    "cluster": "research",
    "size": 2
  },
  {
    "id": "ab-testing",
    "type": "skill",
    "name": "A/B testing",
    "cluster": "research",
    "size": 1
  },
  {
    "id": "personas-journeys",
    "type": "skill",
    "name": "personas & journey maps",
    "cluster": "research",
    "size": 1
  },
  {
    "id": "competitive-analysis",
    "type": "skill",
    "name": "competitive analysis",
    "cluster": "research",
    "size": 1
  },
  {
    "id": "field-research",
    "type": "skill",
    "name": "field research",
    "cluster": "research",
    "size": 1
  },
  {
    "id": "research-ops",
    "type": "skill",
    "name": "research ops",
    "cluster": "research",
    "size": 1
  },
  {
    "id": "surveys",
    "type": "skill",
    "name": "surveys",
    "cluster": "research",
    "size": 1
  },
  {
    "id": "moderated-research",
    "type": "skill",
    "name": "moderated research",
    "cluster": "research",
    "size": 1
  },
  {
    "id": "desk-research",
    "type": "skill",
    "name": "desk research",
    "cluster": "research",
    "size": 1
  },
  {
    "id": "ai-agents",
    "type": "skill",
    "name": "AI agents",
    "cluster": "ai",
    "size": 3,
    "featured": true
  },
  {
    "id": "langgraph",
    "type": "skill",
    "name": "LangGraph",
    "cluster": "ai",
    "size": 2
  },
  {
    "id": "langchain",
    "type": "skill",
    "name": "LangChain",
    "cluster": "ai",
    "size": 1
  },
  {
    "id": "rag",
    "type": "skill",
    "name": "RAG",
    "cluster": "ai",
    "size": 2
  },
  {
    "id": "knowledge-graphs",
    "type": "skill",
    "name": "knowledge graphs",
    "cluster": "ai",
    "size": 2
  },
  {
    "id": "claude-api",
    "type": "skill",
    "name": "Claude API",
    "cluster": "ai",
    "size": 2
  },
  {
    "id": "prompt-design",
    "type": "skill",
    "name": "prompt design",
    "cluster": "ai",
    "size": 2
  },
  {
    "id": "evals",
    "type": "skill",
    "name": "evals & golden datasets",
    "cluster": "ai",
    "size": 2
  },
  {
    "id": "guardrails",
    "type": "skill",
    "name": "guardrails & grounding",
    "cluster": "ai",
    "size": 1
  },
  {
    "id": "human-in-the-loop",
    "type": "skill",
    "name": "human-in-the-loop design",
    "cluster": "ai",
    "size": 2
  },
  {
    "id": "ai-observability",
    "type": "skill",
    "name": "AI observability",
    "cluster": "ai",
    "size": 2
  },
  {
    "id": "model-benchmarking",
    "type": "skill",
    "name": "model benchmarking",
    "cluster": "ai",
    "size": 1
  },
  {
    "id": "agent-workflows",
    "type": "skill",
    "name": "agent team workflows",
    "cluster": "ai",
    "size": 2
  },
  {
    "id": "typescript-react",
    "type": "skill",
    "name": "TypeScript & React",
    "cluster": "engineering",
    "size": 2
  },
  {
    "id": "nextjs",
    "type": "skill",
    "name": "Next.js",
    "cluster": "engineering",
    "size": 2
  },
  {
    "id": "tailwind",
    "type": "skill",
    "name": "Tailwind",
    "cluster": "engineering",
    "size": 1
  },
  {
    "id": "python-fastapi",
    "type": "skill",
    "name": "Python & FastAPI",
    "cluster": "engineering",
    "size": 1
  },
  {
    "id": "postgres-prisma",
    "type": "skill",
    "name": "Postgres & Prisma",
    "cluster": "engineering",
    "size": 1
  },
  {
    "id": "surrealdb",
    "type": "skill",
    "name": "SurrealDB",
    "cluster": "engineering",
    "size": 1
  },
  {
    "id": "webgl-glsl",
    "type": "skill",
    "name": "WebGL & GLSL",
    "cluster": "engineering",
    "size": 2
  },
  {
    "id": "r3f",
    "type": "skill",
    "name": "React Three Fiber",
    "cluster": "engineering",
    "size": 1
  },
  {
    "id": "gsap",
    "type": "skill",
    "name": "GSAP animation",
    "cluster": "engineering",
    "size": 1
  },
  {
    "id": "playwright",
    "type": "skill",
    "name": "Playwright testing",
    "cluster": "engineering",
    "size": 1
  },
  {
    "id": "webhooks-crons",
    "type": "skill",
    "name": "webhooks & crons",
    "cluster": "engineering",
    "size": 1
  },
  {
    "id": "webflow",
    "type": "skill",
    "name": "Webflow",
    "cluster": "engineering",
    "size": 1
  },
  {
    "id": "tokens-in-code",
    "type": "skill",
    "name": "design tokens in code",
    "cluster": "engineering",
    "size": 1
  },
  {
    "id": "product-work",
    "type": "skill",
    "name": "product work",
    "cluster": "product",
    "size": 3,
    "featured": true
  },
  {
    "id": "success-tracking",
    "type": "skill",
    "name": "success tracking",
    "cluster": "product",
    "size": 1
  },
  {
    "id": "product-metrics",
    "type": "skill",
    "name": "product metrics",
    "cluster": "product",
    "size": 2
  },
  {
    "id": "business-cases",
    "type": "skill",
    "name": "business cases",
    "cluster": "product",
    "size": 1
  },
  {
    "id": "monetisation",
    "type": "skill",
    "name": "monetisation",
    "cluster": "product",
    "size": 1
  },
  {
    "id": "stakeholder-mgmt",
    "type": "skill",
    "name": "stakeholder management",
    "cluster": "product",
    "size": 2
  },
  {
    "id": "roadmapping",
    "type": "skill",
    "name": "roadmapping",
    "cluster": "product",
    "size": 1
  },
  {
    "id": "icp-research",
    "type": "skill",
    "name": "ICP & market research",
    "cluster": "product",
    "size": 1
  },
  {
    "id": "mentoring",
    "type": "skill",
    "name": "mentoring & teaching",
    "cluster": "leadership",
    "size": 2
  },
  {
    "id": "workshops",
    "type": "skill",
    "name": "workshop facilitation",
    "cluster": "leadership",
    "size": 1
  },
  {
    "id": "team-leadership",
    "type": "skill",
    "name": "team leadership",
    "cluster": "leadership",
    "size": 2
  },
  {
    "id": "founding-autonomy",
    "type": "skill",
    "name": "no-manager mode",
    "cluster": "leadership",
    "size": 2
  },
  {
    "id": "cross-functional",
    "type": "skill",
    "name": "cross-functional glue",
    "cluster": "leadership",
    "size": 2
  },
  {
    "id": "context-switching",
    "type": "skill",
    "name": "context switching",
    "cluster": "leadership",
    "size": 1
  },
  {
    "id": "navigating-ambiguity",
    "type": "skill",
    "name": "navigating ambiguity",
    "cluster": "leadership",
    "size": 1
  },
  {
    "id": "ownership",
    "type": "skill",
    "name": "ownership",
    "cluster": "leadership",
    "size": 1
  },
  {
    "id": "design-engineering",
    "type": "skill",
    "name": "design engineering",
    "cluster": "engineering",
    "size": 3
  },
  {
    "id": "trust-design",
    "type": "skill",
    "name": "designing for trust",
    "cluster": "ai",
    "size": 2
  },
  {
    "id": "ux-writing",
    "type": "skill",
    "name": "UX writing",
    "cluster": "design",
    "size": 2
  },
  {
    "id": "onboarding-design",
    "type": "skill",
    "name": "onboarding design",
    "cluster": "design",
    "size": 1
  },
  {
    "id": "data-viz",
    "type": "skill",
    "name": "data visualisation",
    "cluster": "design",
    "size": 1
  },
  {
    "id": "safety-design",
    "type": "skill",
    "name": "safety-first AI design",
    "cluster": "ai",
    "size": 1
  },
  {
    "id": "communication",
    "type": "skill",
    "name": "communication",
    "cluster": "leadership",
    "size": 2
  },
  {
    "id": "empathy",
    "type": "skill",
    "name": "empathy",
    "cluster": "research",
    "size": 2
  },
  {
    "id": "organisation",
    "type": "skill",
    "name": "organisation",
    "cluster": "leadership",
    "size": 2
  },
  {
    "id": "prioritisation",
    "type": "skill",
    "name": "prioritisation",
    "cluster": "leadership",
    "size": 2
  },
  {
    "id": "context-design",
    "type": "skill",
    "name": "context design",
    "cluster": "ai",
    "size": 2
  },
  {
    "id": "agent-harnesses",
    "type": "skill",
    "name": "agent harnesses",
    "cluster": "ai",
    "size": 2
  },
  {
    "id": "agent-loops",
    "type": "skill",
    "name": "agent loops",
    "cluster": "ai",
    "size": 1
  },
  {
    "id": "tracing",
    "type": "skill",
    "name": "tracing",
    "cluster": "ai",
    "size": 1
  },
  {
    "id": "tool-design",
    "type": "skill",
    "name": "tool design",
    "cluster": "ai",
    "size": 1
  },
  {
    "id": "agent-memory",
    "type": "skill",
    "name": "agent memory",
    "cluster": "ai",
    "size": 2
  },
  {
    "id": "plan-first",
    "type": "skill",
    "name": "plan before code",
    "cluster": "ai",
    "size": 2
  },
  {
    "id": "agent-skills",
    "type": "skill",
    "name": "writing agent skills",
    "cluster": "ai",
    "size": 1
  },
  {
    "id": "building-with-agents",
    "type": "skill",
    "name": "building with agents",
    "cluster": "ai",
    "size": 2
  },
  {
    "id": "golf",
    "type": "egg",
    "name": "determination",
    "cluster": "sidequest",
    "line": "played golf for the Polish national team",
    "size": 1
  },
  {
    "id": "frisbee",
    "type": "egg",
    "name": "competitive streak",
    "cluster": "sidequest",
    "line": "way too competitive at ultimate frisbee",
    "size": 1
  },
  {
    "id": "handstand",
    "type": "egg",
    "name": "current side quest",
    "cluster": "sidequest",
    "line": "trying to land a handstand",
    "size": 1
  },
  {
    "id": "polish",
    "type": "egg",
    "name": "dwujęzyczna",
    "cluster": "sidequest",
    "line": "native Polish speaker, born in Łódź",
    "size": 1
  },
  {
    "id": "book-a-month",
    "type": "egg",
    "name": "paper input",
    "cluster": "sidequest",
    "line": "one product book a month, Inspired started it",
    "size": 1
  },
  {
    "id": "christmas-ds",
    "type": "egg",
    "name": "holiday shipping",
    "cluster": "sidequest",
    "line": "built Cog's design system over Christmas, for fun",
    "size": 1
  },
  {
    "id": "praise-ai",
    "type": "egg",
    "name": "be nice to robots",
    "cluster": "sidequest",
    "line": "discovered that praising the AI makes it work better",
    "size": 1
  },
  {
    "id": "commit-streak",
    "type": "egg",
    "name": "momentum",
    "cluster": "sidequest",
    "line": "208 commits in 7 weeks on the site you are looking at",
    "size": 1
  },
  {
    "id": "communities",
    "type": "egg",
    "name": "good company",
    "cluster": "sidequest",
    "line": "member of AI Pilled and Claude Code Curious",
    "size": 1
  },
  {
    "id": "wispr",
    "type": "egg",
    "name": "voice input",
    "cluster": "sidequest",
    "line": "talks to her tools all day, a daily Wispr Flow user",
    "size": 1
  }
];

export const GALAXY_EDGES: GalaxyEdge[] = [["wiki-whisperer","eon"],["ai-design-system","eon"],["performance-tools","eon"],["gateway","eon"],["figma-make-kit","eon"],["live-help","eon"],["call-analytics","eon"],["perf-insights","eon"],["eon-ds","eon"],["cog-clinic","cog"],["check-in","cog"],["daily-insights","cog"],["subscription","cog"],["self-help","cog"],["cog-website","cog"],["cog-ds","cog"],["zero-to-one","cog"],["zero-to-one","vector"],["zero-to-one","gateway"],["zero-to-one","eon"],["zero-to-one","synapse"],["zero-to-one","portfolio"],["zero-to-one","user-interviews"],["zero-to-one","visual-craft"],["zero-to-one","brand-identity"],["zero-to-one","founding-autonomy"],["zero-to-one","context-switching"],["zero-to-one","navigating-ambiguity"],["zero-to-one","ownership"],["design-systems","ai-design-system"],["design-systems","cog-ds"],["design-systems","vector"],["design-systems","eon"],["design-systems","eon-ds"],["design-systems","cog"],["design-systems","figma-make-kit"],["brand-identity","ai-design-system"],["brand-identity","cog-website"],["brand-identity","vector"],["brand-identity","cog"],["brand-identity","burberry"],["brand-identity","casablanca"],["brand-identity","julien-macdonald"],["brand-identity","mcqueen"],["brand-identity","consultancy"],["brand-identity","mary"],["brand-identity","pilotto"],["brand-identity","eon"],["brand-identity","design-systems"],["brand-identity","moodboarding"],["brand-identity","brand-guidelines"],["brand-identity","logo-design"],["visual-craft","burberry"],["visual-craft","mcqueen"],["visual-craft","casablanca"],["visual-craft","brand-identity"],["visual-craft","cog"],["visual-craft","consultancy"],["visual-craft","mary"],["visual-craft","pilotto"],["visual-craft","eon"],["visual-craft","julien-macdonald"],["visual-craft","brainstation"],["visual-craft","art-direction"],["visual-craft","motion-design"],["visual-craft","print-design"],["motion-design","ai-design-system"],["motion-design","portfolio"],["motion-design","cog"],["motion-design","eon"],["motion-design","consultancy"],["dense-data-ui","performance-tools"],["dense-data-ui","gateway"],["dense-data-ui","vector"],["dense-data-ui","perf-insights"],["accessibility","eon"],["accessibility","cog"],["prototyping","eon"],["prototyping","cog"],["prototyping","figma-make-kit"],["prototyping","call-analytics"],["prototyping","live-help"],["figma-advanced","design-systems"],["figma-advanced","eon"],["figma-advanced","cog"],["figma-advanced","call-analytics"],["figma-advanced","figma-make-kit"],["print-design","burberry"],["print-design","casablanca"],["print-design","julien-macdonald"],["print-design","mcqueen"],["print-design","consultancy"],["print-design","mary"],["print-design","pilotto"],["art-direction","eon"],["art-direction","cog-website"],["art-direction","print-design"],["art-direction","consultancy"],["information-arch","cog-website"],["information-arch","gateway"],["conversion-design","cog-clinic"],["conversion-design","subscription"],["conversion-design","cog-website"],["moodboarding","cog"],["moodboarding","casablanca"],["moodboarding","mary"],["brand-guidelines","cog-ds"],["brand-guidelines","ai-design-system"],["logo-design","cog"],["logo-design","cog-ds"],["logo-design","consultancy"],["user-interviews","cog"],["user-interviews","eon"],["user-interviews","cog-clinic"],["user-interviews","call-analytics"],["user-interviews","gateway"],["usability-testing","cog-clinic"],["usability-testing","wiki-whisperer"],["usability-testing","call-analytics"],["pilot-design","wiki-whisperer"],["pilot-design","eon"],["ab-testing","cog-clinic"],["personas-journeys","cog"],["personas-journeys","cog-clinic"],["personas-journeys","gateway"],["competitive-analysis","cog"],["competitive-analysis","vector"],["competitive-analysis","synapse"],["field-research","eon"],["research-ops","eon"],["surveys","eon"],["surveys","cog"],["moderated-research","cog"],["moderated-research","eon"],["moderated-research","cog-clinic"],["desk-research","cog"],["desk-research","eon"],["desk-research","synapse"],["desk-research","vector"],["ai-agents","wiki-whisperer"],["ai-agents","vector"],["ai-agents","synapse"],["ai-agents","live-help"],["ai-agents","ai-observability"],["ai-agents","call-analytics"],["ai-agents","context-design"],["ai-agents","agent-harnesses"],["ai-agents","agent-loops"],["ai-agents","tracing"],["ai-agents","building-with-agents"],["ai-agents","tool-design"],["ai-agents","agent-memory"],["ai-agents","plan-first"],["ai-agents","agent-skills"],["langgraph","wiki-whisperer"],["langgraph","synapse"],["langchain","synapse"],["rag","wiki-whisperer"],["rag","synapse"],["knowledge-graphs","synapse"],["knowledge-graphs","portfolio"],["claude-api","vector"],["prompt-design","vector"],["prompt-design","synapse"],["prompt-design","wiki-whisperer"],["prompt-design","live-help"],["prompt-design","call-analytics"],["evals","wiki-whisperer"],["evals","vector"],["evals","synapse"],["evals","call-analytics"],["guardrails","wiki-whisperer"],["guardrails","vector"],["human-in-the-loop","vector"],["human-in-the-loop","wiki-whisperer"],["human-in-the-loop","live-help"],["ai-observability","vector"],["ai-observability","synapse"],["ai-observability","eon"],["ai-observability","wiki-whisperer"],["ai-observability","call-analytics"],["ai-observability","live-help"],["model-benchmarking","synapse"],["agent-workflows","portfolio"],["agent-workflows","vector"],["typescript-react","vector"],["typescript-react","portfolio"],["nextjs","vector"],["nextjs","portfolio"],["tailwind","vector"],["tailwind","portfolio"],["python-fastapi","synapse"],["postgres-prisma","vector"],["surrealdb","synapse"],["webgl-glsl","portfolio"],["r3f","portfolio"],["gsap","portfolio"],["playwright","vector"],["playwright","portfolio"],["webhooks-crons","vector"],["webflow","cog-website"],["tokens-in-code","design-systems"],["tokens-in-code","tailwind"],["tokens-in-code","typescript-react"],["tokens-in-code","vector"],["tokens-in-code","portfolio"],["product-work","usability-testing"],["product-work","prototyping"],["product-work","product-metrics"],["product-work","user-interviews"],["product-work","competitive-analysis"],["product-work","cog"],["product-work","eon"],["product-work","success-tracking"],["product-work","moderated-research"],["product-work","desk-research"],["success-tracking","cog"],["success-tracking","eon"],["product-metrics","eon"],["product-metrics","cog"],["product-metrics","vector"],["product-metrics","wiki-whisperer"],["product-metrics","perf-insights"],["product-metrics","performance-tools"],["business-cases","performance-tools"],["monetisation","subscription"],["monetisation","cog-clinic"],["stakeholder-mgmt","eon"],["stakeholder-mgmt","cog"],["stakeholder-mgmt","consultancy"],["roadmapping","cog"],["roadmapping","eon"],["roadmapping","vector"],["icp-research","vector"],["mentoring","brainstation"],["mentoring","burberry"],["mentoring","eon"],["mentoring","julien-macdonald"],["workshops","eon"],["team-leadership","burberry"],["team-leadership","julien-macdonald"],["team-leadership","communication"],["team-leadership","empathy"],["team-leadership","organisation"],["team-leadership","prioritisation"],["team-leadership","mentoring"],["founding-autonomy","cog"],["founding-autonomy","gateway"],["founding-autonomy","vector"],["founding-autonomy","consultancy"],["cross-functional","eon"],["cross-functional","cog"],["cross-functional","burberry"],["cross-functional","mary"],["cross-functional","pilotto"],["cross-functional","mcqueen"],["cross-functional","casablanca"],["cross-functional","julien-macdonald"],["cross-functional","communication"],["cross-functional","empathy"],["context-switching","cog"],["context-switching","vector"],["navigating-ambiguity","cog"],["navigating-ambiguity","gateway"],["navigating-ambiguity","vector"],["ownership","cog"],["ownership","vector"],["ownership","synapse"],["design-engineering","design-systems"],["design-engineering","tokens-in-code"],["design-engineering","typescript-react"],["design-engineering","tailwind"],["design-engineering","portfolio"],["design-engineering","vector"],["design-engineering","figma-make-kit"],["design-engineering","synapse"],["design-engineering","context-design"],["design-engineering","agent-harnesses"],["design-engineering","agent-loops"],["design-engineering","plan-first"],["design-engineering","agent-memory"],["design-engineering","agent-skills"],["design-engineering","building-with-agents"],["trust-design","wiki-whisperer"],["trust-design","vector"],["trust-design","human-in-the-loop"],["trust-design","guardrails"],["ux-writing","cog"],["ux-writing","wiki-whisperer"],["ux-writing","daily-insights"],["ux-writing","self-help"],["ux-writing","live-help"],["ux-writing","perf-insights"],["ux-writing","performance-tools"],["ux-writing","vector"],["ux-writing","gateway"],["ux-writing","cog-clinic"],["ux-writing","eon"],["onboarding-design","cog"],["onboarding-design","subscription"],["onboarding-design","vector"],["data-viz","performance-tools"],["data-viz","perf-insights"],["data-viz","vector"],["safety-design","synapse"],["safety-design","cog"],["communication","stakeholder-mgmt"],["communication","workshops"],["communication","mentoring"],["communication","ux-writing"],["communication","brainstation"],["communication","eon"],["communication","cog"],["communication","consultancy"],["communication","burberry"],["communication","gateway"],["empathy","user-interviews"],["empathy","usability-testing"],["empathy","moderated-research"],["empathy","personas-journeys"],["empathy","product-work"],["empathy","ux-writing"],["empathy","accessibility"],["empathy","cog"],["empathy","eon"],["empathy","cog-clinic"],["empathy","mentoring"],["empathy","stakeholder-mgmt"],["empathy","communication"],["empathy","workshops"],["organisation","eon"],["organisation","cog"],["organisation","brainstation"],["organisation","casablanca"],["organisation","burberry"],["organisation","consultancy"],["organisation","julien-macdonald"],["organisation","mcqueen"],["organisation","mary"],["organisation","pilotto"],["organisation","context-switching"],["organisation","stakeholder-mgmt"],["organisation","research-ops"],["prioritisation","eon"],["prioritisation","cog"],["prioritisation","brainstation"],["prioritisation","casablanca"],["prioritisation","burberry"],["prioritisation","consultancy"],["prioritisation","julien-macdonald"],["prioritisation","mcqueen"],["prioritisation","mary"],["prioritisation","pilotto"],["prioritisation","organisation"],["prioritisation","roadmapping"],["prioritisation","product-work"],["prioritisation","navigating-ambiguity"],["context-design","prompt-design"],["context-design","rag"],["context-design","claude-api"],["context-design","agent-harnesses"],["context-design","vector"],["context-design","synapse"],["context-design","wiki-whisperer"],["context-design","portfolio"],["agent-harnesses","agent-workflows"],["agent-harnesses","claude-api"],["agent-harnesses","tool-design"],["agent-harnesses","vector"],["agent-harnesses","portfolio"],["agent-harnesses","synapse"],["agent-loops","agent-harnesses"],["agent-loops","langgraph"],["agent-loops","human-in-the-loop"],["agent-loops","vector"],["agent-loops","synapse"],["agent-loops","wiki-whisperer"],["tracing","ai-observability"],["tracing","evals"],["tracing","langgraph"],["tracing","vector"],["tracing","synapse"],["tracing","wiki-whisperer"],["tracing","call-analytics"],["tool-design","claude-api"],["tool-design","langgraph"],["tool-design","vector"],["tool-design","synapse"],["agent-memory","synapse"],["agent-memory","knowledge-graphs"],["agent-memory","context-design"],["agent-memory","portfolio"],["agent-memory","vector"],["plan-first","agent-workflows"],["plan-first","playwright"],["plan-first","navigating-ambiguity"],["plan-first","roadmapping"],["plan-first","vector"],["plan-first","portfolio"],["plan-first","synapse"],["agent-skills","agent-workflows"],["agent-skills","context-design"],["agent-skills","portfolio"],["agent-skills","vector"],["building-with-agents","agent-workflows"],["building-with-agents","plan-first"],["building-with-agents","typescript-react"],["building-with-agents","vector"],["building-with-agents","portfolio"],["building-with-agents","synapse"],["golf","team-leadership"],["frisbee","golf"],["christmas-ds","cog-ds"],["praise-ai","ai-agents"],["commit-streak","portfolio"],["communities","agent-workflows"]];
