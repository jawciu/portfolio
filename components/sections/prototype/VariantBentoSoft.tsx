"use client";

// PROTOTYPE — Variant "bento2": the spotlight mosaic. Real projects render via
// the reusable <ProjectCard> (split layout: copy left, product visual + corner
// gradient blob right). Placeholder cells (no content/imagery yet) keep the
// simpler centred layout below; migrate each to <ProjectCard> as it gets a real
// story + visual. Palettes are lifted from the hero shaders.
import { useState } from "react";
import { enriched } from "./projectMeta";
import { Grain } from "./softBits";
import { ProjectCard } from "./ProjectCard";

// [core, mid, outer-glow] per project — hero colours only.
const POOLS: [string, string, string][] = [
  ["#FF8858", "#F56267", "#E560FA"], // fireball head: orange → coral → pink
  ["#E560FA", "#793CEA", "#2835A8"], // fireball tail: pink → purple → blue
  ["#ff8526", "#ff2f7e", "#793CEA"], // orb: hot orange rim → magenta glow
  ["#bdeed9", "#3fc4ad", "#2835A8"], // orb core: mint → jade → deep blue
  ["#ffcf52", "#ff8526", "#ff2f7e"], // orb bands: yellow → orange → magenta
];

// Gaussian-ish falloff: every stop fades to fully transparent well inside the
// cell, so nothing ever meets an edge.
function openWash([c0, c1, c2]: [string, string, string]) {
  return [
    `radial-gradient(40% 48% at 28% 30%, ${c0}59, transparent 65%)`,
    `radial-gradient(48% 55% at 68% 74%, ${c1}4d, transparent 66%)`,
    `radial-gradient(75% 85% at 45% 50%, ${c2}26, transparent 68%)`,
  ].join(", ");
}

function spineWash([c0, c1]: [string, string, string]) {
  return [
    `radial-gradient(35% 74% at 50% 35%, ${c0}80, transparent 70%)`,
    `radial-gradient(44% 90% at 50% 70%, ${c1}66, transparent 72%)`,
  ].join(", ");
}

export function VariantBentoSoft() {
  const items = enriched;
  const [hot, setHot] = useState(0);

  return (
    <div className="mx-auto w-full max-w-7xl 2xl:max-w-[88rem]">
      {/* directory-style section label, matched to /about & /toolkit */}
      <div className="mb-5 pl-2 font-mono text-xs md:text-sm tracking-[0.2em] text-fg/70">
        /projects
      </div>

      {/* lg+ = the horizontal accordion (fixed height, flex-row). Below lg the cards
          stack into a natural-height column (no fixed height) — each ProjectCard
          renders its in-flow stacked layout. */}
      <div className="flex flex-col gap-3 lg:h-[clamp(400px,48vw,560px)] lg:flex-row lg:gap-3">
        {items.map((p, i) => {
          const open = i === hot;
          const onActivate = () => setHot(i);

          // Project 01 (E.ON Next) — the real, reusable card.
          if (i === 0) {
            return (
              <ProjectCard
                key={p.slug}
                open={open}
                onActivate={onActivate}
                collapsedLabel={p.company}
                collapsedTitle={p.name}
                year={p.year}
                label="/e.on_next"
                logo={{ src: "/assets/e_on_next.png", alt: "E.ON Next" }}
                title={p.title}
                subtitle={p.description}
                tags={p.tags}
                actions={[{ label: "MY CASE STUDY", href: "/project/wiki-whisperer" }]}
                image={{
                  src: "/assets/eon-next-product.svg?v=3",
                  alt: "Wiki Whisperer agentic-RAG chat answering an energy query",
                }}
                mobileImage={{
                  src: "/assets/wiki-chatbot.svg",
                  alt: "Wiki Whisperer agentic-RAG chat answering an energy query",
                }}
                blob={{ core: "#C05846", edge: "#6D1B76" }}
              />
            );
          }

          // Project 02 (cog_adhd) — reusable card; amber→green blob, two-phone visual.
          if (i === 1) {
            return (
              <ProjectCard
                key={p.slug}
                open={open}
                onActivate={onActivate}
                collapsedLabel={p.company}
                collapsedTitle={p.name}
                year={p.year}
                label="/cog_adhd"
                logo={{ src: "/assets/cog-adhd-logo.png", alt: "cog_adhd" }}
                title={p.title}
                subtitle={p.description}
                tags={p.tags}
                image={{
                  src: "/assets/cog-adhd-product.png?v=3",
                  alt: "cog_adhd check-in history, weekly ADHD scores and daily highs/lows",
                }}
                mobileImage={{
                  src: "/assets/cog-mobile.png",
                  alt: "cog_adhd check-in history, weekly ADHD scores and daily highs/lows",
                }}
                imageClassName="pointer-events-none absolute right-[-10%] bottom-0 h-[65%] max-[1520px]:h-[55%] max-[1150px]:h-[44%] w-auto max-w-none object-contain object-left"
                blob={{ core: "#F2922E", edge: "#189E71", coreStop: 30, edgeStop: 50, fadeStop: 80 }}
                actions={[{ label: "MY CASE STUDY", href: "/project/cog-adhd" }]}
              />
            );
          }

          // Project 03 (synapse) — reusable card; purple→magenta blob, app screenshot.
          if (i === 2) {
            return (
              <ProjectCard
                key={p.slug}
                open={open}
                onActivate={onActivate}
                collapsedLabel={p.company}
                collapsedTitle={p.name}
                year={p.year}
                label="/synapse"
                logo={{ src: "/assets/synapse-logo.png", alt: "synapse" }}
                title={p.title}
                subtitle={p.description}
                tags={p.tags}
                image={{
                  src: "/assets/synapse-product.png?v=3",
                  alt: "synapse reflection agent, map your mind journaling view",
                }}
                mobileImage={{
                  src: "/assets/synapse-mobile.png",
                  alt: "synapse reflection agent, map your mind journaling view",
                }}
                imageClassName="pointer-events-none absolute right-[-12%] top-[55%] h-[53%] max-[1520px]:h-[44%] max-[1150px]:h-[36%] w-auto max-w-none -translate-y-1/2 rounded-2xl object-contain shadow-[0_20px_60px_rgba(0,0,0,0.45)]"
                blob={{ core: "#8FB7EA", edge: "#13564B", coreStop: 8, edgeStop: 52 }}
                actions={[
                  {
                    label: "MY BLOG POST",
                    href: "https://surrealdb.com/blog/building-compounding-memory-with-knowledge-graphs-and-agentic-rag",
                  },
                  { label: "TRY IT", href: "https://synapse-ks93.onrender.com/" },
                  { label: "SOURCE CODE", href: "https://github.com/jawciu/synapse" },
                ]}
              />
            );
          }

          // Project 04 (vector) — reusable card layout; source + live-product CTAs.
          if (i === 3) {
            return (
              <ProjectCard
                key={p.slug}
                open={open}
                onActivate={onActivate}
                collapsedLabel={p.company}
                collapsedTitle={p.name}
                year={p.year}
                label="/vector"
                title={p.title}
                subtitle={p.description}
                tags={p.tags}
                image={{
                  src: "/assets/vector-product.png",
                  alt: "vector, AI turning a meeting into a draft onboarding task",
                }}
                imageClassName="pointer-events-none absolute right-[-15%] top-[calc(50%+32px)] h-[50%] max-[1520px]:h-[42%] max-[1150px]:h-[34%] w-auto max-w-none -translate-y-1/2 rounded-2xl bg-[#18181f] p-5 object-contain shadow-[0_20px_60px_rgba(0,0,0,0.45)]"
                blob={{ core: "#f96a3f", edge: "#9059ee", fadeStop: 72 }}
                actions={[
                  { label: "MY CASE STUDY", href: "/project/vector" },
                  { label: "SOURCE CODE", href: "https://github.com/jawciu/vector" },
                  { label: "TRY IT", href: "https://vector.quest/" },
                ]}
              />
            );
          }

          // Project 05 (AI design system, E.ON Next) — reusable card layout.
          // Wiki Whisperer blob colours; case study still to come.
          if (i === 4) {
            return (
              <ProjectCard
                key={p.slug}
                open={open}
                onActivate={onActivate}
                collapsedLabel={p.company}
                collapsedTitle={p.name}
                year={p.year}
                label="/ai_design_system"
                logo={{ src: "/assets/e_on_next.png", alt: "E.ON Next" }}
                title={p.title}
                subtitle={p.description}
                tags={p.tags}
                blob={{ core: "#C05846", edge: "#6D1B76" }}
                note="case study coming soon"
              />
            );
          }

          // Placeholder cells — centred layout, pool blob. Swap to <ProjectCard>
          // once the project has a real story + product visual.
          const pool = POOLS[i % POOLS.length];
          return (
            <button
              key={p.slug}
              type="button"
              onMouseEnter={onActivate}
              onFocus={onActivate}
              className="group relative min-h-0 overflow-hidden rounded-3xl text-left outline-none transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]"
              style={{ flexGrow: open ? 6 : 1, flexBasis: 0 }}
            >
              <div
                aria-hidden
                className="absolute inset-0 transition-opacity duration-700"
                style={{ background: openWash(pool), opacity: open ? 1 : 0 }}
              />
              <div
                aria-hidden
                className="absolute inset-0 transition-opacity duration-700"
                style={{ background: spineWash(pool), opacity: open ? 0 : 0.95 }}
              />

              {/* glass surface + specular story (matches <ProjectCard>) */}
              <div
                aria-hidden
                className="absolute inset-0 rounded-3xl border border-white/10 backdrop-blur-xl backdrop-saturate-150"
                style={{
                  background:
                    "linear-gradient(155deg, rgba(255,255,255,0.06) 0%, rgba(10,10,13,0.18) 30%, rgba(10,10,13,0.34) 100%)",
                  boxShadow: "inset 0 1px 0 rgba(255,255,255,0.18)",
                }}
              />
              <div
                aria-hidden
                className="pointer-events-none absolute inset-x-0 top-0 h-px"
                style={{
                  background:
                    "linear-gradient(90deg, rgba(245,245,245,0.05), rgba(255,255,255,0.55) 22%, rgba(245,245,245,0.12) 55%, rgba(245,245,245,0.04))",
                }}
              />
              <div
                aria-hidden
                className="pointer-events-none absolute inset-0 mix-blend-screen"
                style={{
                  background:
                    "linear-gradient(115deg, rgba(255,255,255,0.10) 0%, rgba(255,255,255,0.03) 18%, transparent 34%, transparent 74%, rgba(255,255,255,0.05) 100%)",
                }}
              />
              <Grain opacity={0.06} />

              {!open && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div
                    className="whitespace-nowrap text-center font-mono uppercase tracking-[0.3em]"
                    style={{ writingMode: "vertical-rl", transform: "rotate(180deg)" }}
                  >
                    <span className="block text-sm text-fg md:text-base">
                      {p.company}
                      <span className="text-fg/55"> · {p.year}</span>
                    </span>
                    <span className="mt-2.5 block text-xs text-fg/70 md:text-sm">
                      {p.name}
                    </span>
                  </div>
                </div>
              )}

              <div
                className={`absolute inset-0 flex flex-col justify-between p-6 transition-opacity md:p-9 ${
                  open
                    ? "opacity-100 delay-200 duration-500"
                    : "pointer-events-none opacity-0 duration-200"
                }`}
              >
                <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-fg/60">
                  {p.year}
                </p>
                <div>
                  <p className="font-hero text-xl font-black lowercase text-fg/90">
                    {p.company},
                  </p>
                  <h3 className="mt-2 max-w-lg font-hero text-2xl font-bold uppercase leading-[1.02] tracking-tight text-fg md:text-4xl">
                    {p.title}
                  </h3>
                  {p.description && (
                    <p className="mt-4 max-w-sm font-hero text-sm leading-relaxed text-fg/70 md:text-base">
                      {p.description}
                    </p>
                  )}
                  <p className="mt-6 flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.25em] text-fg/60">
                    <span aria-hidden className="inline-block h-2 w-2 bg-fg/70" />
                    {p.role}
                    <span aria-hidden className="text-fg/30">•</span>
                    {p.year}
                  </p>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
