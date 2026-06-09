"use client";

// PROTOTYPE — Variant "deck": a holographic, draggable card stack. The top
// card is focused; the rest peek behind it. Drag/flick the top card past a
// threshold to throw it and reveal the next. Buttons + dots as fallbacks.
import { useState } from "react";
import { motion, type PanInfo } from "motion/react";
import { enriched } from "./projectMeta";

const VISIBLE = 3; // how many cards peek in the stack behind the top one

export function VariantDeck() {
  const cards = enriched;
  const n = cards.length;
  const [active, setActive] = useState(0);
  const next = () => setActive((a) => (a + 1) % n);
  const prev = () => setActive((a) => (a - 1 + n) % n);

  const onDragEnd = (_e: unknown, info: PanInfo) => {
    if (info.offset.x < -90 || info.velocity.x < -500) next();
    else if (info.offset.x > 90 || info.velocity.x > 500) prev();
  };

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col items-center">
      <p className="mb-6 font-mono text-xs uppercase tracking-[0.25em] text-fg-muted">
        drag · flick · or use the arrows ↓
      </p>

      <div className="relative h-[clamp(380px,52vw,520px)] w-full">
        {cards.map((p, i) => {
          // position in the stack relative to the active card (wraps)
          const pos = (i - active + n) % n;
          if (pos >= VISIBLE && pos !== n - 1) {
            // keep the just-thrown card (pos n-1) mounted for the exit feel
            return null;
          }
          const isTop = pos === 0;
          const depth = Math.min(pos, VISIBLE - 1);

          return (
            <motion.div
              key={p.slug}
              className="absolute inset-x-0 mx-auto w-[min(88vw,560px)] cursor-grab active:cursor-grabbing"
              style={{ zIndex: n - pos }}
              drag={isTop ? "x" : false}
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.55}
              onDragEnd={isTop ? onDragEnd : undefined}
              initial={false}
              animate={{
                y: depth * 22,
                scale: 1 - depth * 0.06,
                opacity: pos === n - 1 ? 0 : 1 - depth * 0.12,
                rotate: isTop ? 0 : (i % 2 ? 1.5 : -1.5) * depth,
              }}
              transition={{ type: "spring", stiffness: 320, damping: 34 }}
              whileTap={isTop ? { scale: 0.99 } : undefined}
            >
              <HoloCard project={p} top={isTop} index={i} total={n} />
            </motion.div>
          );
        })}
      </div>

      {/* controls */}
      <div className="mt-7 flex items-center gap-5">
        <button
          type="button"
          onClick={prev}
          aria-label="Previous project"
          className="grid h-10 w-10 place-items-center rounded-full border border-fg/20 font-mono text-fg hover:border-accent-cyan hover:text-accent-cyan"
        >
          ←
        </button>
        <div className="flex gap-2">
          {cards.map((p, i) => (
            <button
              key={p.slug}
              type="button"
              aria-label={`Go to ${p.company}`}
              onClick={() => setActive(i)}
              className={`h-1.5 rounded-full transition-all ${
                i === active ? "w-7 bg-accent-cyan" : "w-1.5 bg-fg/25 hover:bg-fg/50"
              }`}
            />
          ))}
        </div>
        <button
          type="button"
          onClick={next}
          aria-label="Next project"
          className="grid h-10 w-10 place-items-center rounded-full border border-fg/20 font-mono text-fg hover:border-accent-cyan hover:text-accent-cyan"
        >
          →
        </button>
      </div>
    </div>
  );
}

function HoloCard({
  project: p,
  top,
  index,
  total,
}: {
  project: (typeof enriched)[number];
  top: boolean;
  index: number;
  total: number;
}) {
  return (
    <div className="relative h-[clamp(360px,48vw,500px)] overflow-hidden rounded-[1.75rem] p-[1.5px]">
      {/* iridescent conic border */}
      <div
        aria-hidden
        className="absolute inset-0 rounded-[1.75rem] opacity-80"
        style={{
          background:
            "conic-gradient(from 140deg, #00d4ff, #ff006e, #ffaa00, #7a3bff, #00d4ff)",
        }}
      />
      <div className="relative flex h-full flex-col justify-between overflow-hidden rounded-[1.65rem] bg-bg-elev p-7 md:p-9">
        {/* holographic sheen */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-30 mix-blend-screen"
          style={{
            background:
              "radial-gradient(120% 80% at 0% 0%, rgba(0,212,255,0.5), transparent 50%), radial-gradient(120% 80% at 100% 100%, rgba(255,0,110,0.45), transparent 50%)",
          }}
        />
        {/* header */}
        <div className="relative flex items-start justify-between font-mono text-xs uppercase tracking-[0.2em] text-fg-muted">
          <span>
            {String(index + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
          </span>
          <span className={p.status === "Shipped" ? "text-accent-cyan" : ""}>
            {p.status} · {p.year}
          </span>
        </div>

        {/* body */}
        <div className="relative">
          <span className="inline-flex w-fit items-center rounded-md bg-accent-magenta px-3 py-1.5 font-display text-sm font-bold lowercase text-fg">
            {p.company}
          </span>
          <h3 className="mt-4 font-display text-2xl font-black uppercase leading-[1.02] tracking-tight md:text-4xl">
            {p.title}
          </h3>
          {p.description && (
            <p className="mt-3 max-w-md text-fg-muted">{p.description}</p>
          )}
          <div className="mt-5 flex flex-wrap gap-2 font-mono text-[10px] uppercase tracking-[0.18em]">
            {p.stack.map((s) => (
              <span key={s} className="rounded-full border border-fg/20 px-2.5 py-1 text-fg/70">
                {s}
              </span>
            ))}
          </div>
        </div>

        {top && (
          <div className="relative font-mono text-[10px] uppercase tracking-[0.25em] text-fg/40">
            drag to explore →
          </div>
        )}
      </div>
    </div>
  );
}
