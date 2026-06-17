"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { motion } from "motion/react";
import { projects, type Project } from "@/lib/projects";

// How far each off-center card sits, as a % of card width, and how much it shrinks.
// Tune these two to taste during design iteration.
const SPREAD = 60;
const SIDE_SCALE = 0.8;
// While a hover-zone is held, advance one project on this cadence.
const STEP_MS = 650;

export function ProjectCarousel() {
  const [active, setActive] = useState(0);
  const n = projects.length;
  const clamp = useCallback((i: number) => Math.max(0, Math.min(n - 1, i)), [n]);
  const step = useCallback((dir: number) => setActive((a) => clamp(a + dir)), [clamp]);

  // Hover-to-scrub: stepping once immediately on enter (responsive), then on an
  // interval while the cursor stays in the side zone.
  const hold = useRef<ReturnType<typeof setInterval> | null>(null);
  const stopHold = useCallback(() => {
    if (hold.current) {
      clearInterval(hold.current);
      hold.current = null;
    }
  }, []);
  const startHold = useCallback(
    (dir: number) => {
      step(dir);
      stopHold();
      hold.current = setInterval(() => step(dir), STEP_MS);
    },
    [step, stopHold],
  );
  useEffect(() => stopHold, [stopHold]);

  // Keyboard nav when the carousel region has focus.
  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowLeft") step(-1);
    if (e.key === "ArrowRight") step(1);
  };

  return (
    <div
      className="relative w-full select-none outline-none"
      role="group"
      aria-roledescription="carousel"
      aria-label="Selected projects"
      tabIndex={0}
      onKeyDown={onKeyDown}
    >
      {/* Stage */}
      <div className="relative h-[clamp(360px,52vw,560px)] overflow-hidden">
        {projects.map((p, i) => {
          const offset = i - active;
          const abs = Math.abs(offset);
          const hidden = abs > 1;
          return (
            <motion.article
              key={p.slug}
              className="absolute left-1/2 top-1/2 w-[min(90vw,920px)]"
              initial={false}
              animate={{
                x: `calc(-50% + ${offset * SPREAD}%)`,
                y: "-50%",
                scale: offset === 0 ? 1 : SIDE_SCALE,
                opacity: hidden ? 0 : offset === 0 ? 1 : 0.55,
                filter: offset === 0 ? "blur(0px)" : "blur(1px)",
              }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              style={{ zIndex: 10 - abs, pointerEvents: hidden ? "none" : "auto" }}
            >
              <Card
                project={p}
                focused={offset === 0}
                onClick={() => offset !== 0 && setActive(i)}
              />
            </motion.article>
          );
        })}

        {/* Hover zones — sit above the side cards, below the centre card's content. */}
        <button
          type="button"
          aria-label="Previous project"
          disabled={active === 0}
          onMouseEnter={() => startHold(-1)}
          onMouseLeave={stopHold}
          onClick={() => step(-1)}
          className="absolute inset-y-0 left-0 z-20 w-[18%] cursor-w-resize disabled:cursor-default"
        />
        <button
          type="button"
          aria-label="Next project"
          disabled={active === n - 1}
          onMouseEnter={() => startHold(1)}
          onMouseLeave={stopHold}
          onClick={() => step(1)}
          className="absolute inset-y-0 right-0 z-20 w-[18%] cursor-e-resize disabled:cursor-default"
        />
      </div>

      {/* Progress dots */}
      <div className="mt-8 flex justify-center gap-2">
        {projects.map((p, i) => (
          <button
            key={p.slug}
            type="button"
            aria-label={`Go to ${p.company}`}
            aria-current={i === active}
            onClick={() => setActive(i)}
            className={`h-1.5 rounded-full transition-all ${
              i === active ? "w-7 bg-fg" : "w-1.5 bg-fg/30 hover:bg-fg/60"
            }`}
          />
        ))}
      </div>
    </div>
  );
}

function Card({
  project,
  focused,
  onClick,
}: {
  project: Project;
  focused: boolean;
  onClick: () => void;
}) {
  if (project.placeholder) {
    return (
      <div
        onClick={onClick}
        className="grid h-[clamp(340px,48vw,520px)] place-items-center rounded-3xl border border-fg/10 bg-bg-elev"
        style={{ cursor: focused ? "default" : "pointer" }}
      >
        <span className="font-mono text-sm uppercase tracking-[0.3em] text-fg-muted">
          {project.company}
        </span>
      </div>
    );
  }

  return (
    <div
      onClick={onClick}
      className="grid h-[clamp(340px,48vw,520px)] grid-cols-1 overflow-hidden rounded-3xl border border-fg/10 bg-bg-elev md:grid-cols-2"
      style={{ cursor: focused ? "default" : "pointer" }}
    >
      {/* Left — logo + copy */}
      <div className="flex flex-col justify-between p-7 md:p-10">
        <span className="inline-flex w-fit items-center rounded-md bg-accent-magenta px-3 py-1.5 font-display text-sm font-bold lowercase text-fg">
          {project.company}
        </span>
        <div>
          <h3 className="font-display text-2xl font-bold uppercase leading-[1.05] tracking-tight md:text-3xl">
            {project.title}
          </h3>
          <p className="mt-4 max-w-md text-fg-muted">{project.description}</p>
          <div className="mt-6 flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-xs uppercase tracking-[0.2em] text-fg/70">
            {project.tags.map((t, i) => (
              <span key={t} className="flex items-center gap-3">
                {i > 0 && <span className="text-fg/30">·</span>}
                {t}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Right — imagery. Gradient placeholder until the real screenshot lands;
          swap the inner block for an <Image src={project.image} />. */}
      <div className="relative hidden md:block" style={{ background: project.accent }}>
        <div className="absolute inset-6 rounded-xl bg-fg/10 backdrop-blur-sm" />
        <div className="absolute inset-0 grid place-items-center font-mono text-xs uppercase tracking-[0.3em] text-fg/50">
          [ imagery ]
        </div>
      </div>
    </div>
  );
}
