"use client";

// PROTOTYPE — Variant "shell2": the terminal listing, diffused. Same bones as
// VariantShell (↑↓ move, ↵ open, esc close) but: airy spacing, no unix-perms
// noise, human-readable names, and each project gets a pixel sprite (the
// CLI-boot-logo touch) with a blurred glow copy — pixel-y AND diffused.
import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { enriched } from "./projectMeta";
import { Grain, PixelSprite, SPRITE_PALETTES } from "./softBits";

export function VariantShellSoft() {
  const rows = enriched;
  const [cursor, setCursor] = useState(0);
  const [open, setOpen] = useState<number | null>(0);

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") { e.preventDefault(); setCursor((c) => Math.min(rows.length - 1, c + 1)); }
    if (e.key === "ArrowUp") { e.preventDefault(); setCursor((c) => Math.max(0, c - 1)); }
    if (e.key === "Enter") { e.preventDefault(); setOpen((o) => (o === cursor ? null : cursor)); }
    if (e.key === "Escape") { e.preventDefault(); setOpen(null); }
  };

  return (
    <div
      tabIndex={0}
      onKeyDown={onKeyDown}
      role="group"
      aria-label="Projects — terminal listing"
      className="relative mx-auto w-full max-w-3xl select-none overflow-hidden rounded-3xl border border-fg/8 font-mono outline-none ring-accent-cyan/30 focus:ring-1"
    >
      {/* diffused pane background — soft colour pools, like the hero */}
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(90% 60% at 15% 0%, rgba(0,212,255,0.10), transparent 60%), radial-gradient(80% 60% at 95% 100%, rgba(255,0,110,0.09), transparent 60%), rgba(10,10,13,0.7)",
        }}
      />
      <Grain opacity={0.08} />

      <div className="relative px-6 py-7 md:px-10 md:py-9">
        {/* minimal prompt — no fake unix chrome */}
        <div className="flex items-baseline gap-3 text-sm">
          <span className="text-accent-cyan">~/work</span>
          <span className="text-fg/50">❯</span>
          <span className="text-fg/90">ls</span>
        </div>
        <p className="mt-2 text-[11px] tracking-[0.15em] text-fg-muted">
          ↑ ↓ move · ↵ open · esc close
        </p>

        <ul className="mt-6">
          {rows.map((p, i) => {
            const active = i === cursor;
            const isOpen = open === i;
            const palette = SPRITE_PALETTES[i % SPRITE_PALETTES.length];
            return (
              <li key={p.slug} className="border-t border-fg/8 last:border-b">
                <button
                  type="button"
                  onMouseEnter={() => setCursor(i)}
                  onClick={() => setOpen((o) => (o === i ? null : i))}
                  className="relative flex w-full items-center gap-5 px-3 py-4 text-left md:gap-6 md:px-4"
                >
                  {/* soft spotlight under the active row */}
                  {active && (
                    <div
                      aria-hidden
                      className="absolute inset-0 transition-opacity"
                      style={{
                        background:
                          "radial-gradient(70% 120% at 20% 50%, rgba(0,212,255,0.10), transparent 70%)",
                      }}
                    />
                  )}
                  <PixelSprite slug={p.slug} palette={palette} size={36} glow={active} />
                  <span
                    className={`font-display text-lg font-bold tracking-tight transition-colors md:text-xl ${
                      active ? "text-fg" : "text-fg/60"
                    }`}
                  >
                    {p.company}
                  </span>
                  <span className="ml-auto flex items-center gap-4 text-[11px] tracking-[0.2em] text-fg-muted">
                    <span className="hidden sm:inline">{p.year}</span>
                    <span className={p.status === "Shipped" ? "text-accent-cyan" : ""}>
                      {p.status.toUpperCase()}
                    </span>
                    <span className={`transition-transform ${isOpen ? "rotate-90" : ""} ${active ? "text-fg" : "text-fg/30"}`}>
                      ❯
                    </span>
                  </span>
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
                      className="overflow-hidden"
                    >
                      <div className="flex flex-col gap-6 px-3 pb-8 pt-2 md:flex-row md:items-start md:gap-10 md:px-4">
                        {/* the "image": big glowing sprite on a soft pool */}
                        <div className="relative grid h-40 w-40 shrink-0 place-items-center md:h-48 md:w-48">
                          <div
                            aria-hidden
                            className="absolute inset-0 rounded-2xl"
                            style={{
                              background: `radial-gradient(60% 60% at 50% 50%, ${palette[0]}22, transparent 75%)`,
                            }}
                          />
                          <PixelSprite slug={p.slug} palette={palette} size={104} />
                        </div>

                        <div className="max-w-xl pt-1">
                          <h3 className="font-display text-2xl font-bold uppercase leading-[1.05] tracking-tight text-fg md:text-3xl">
                            {p.title}
                          </h3>
                          {p.description && (
                            <p className="mt-4 font-body text-base leading-relaxed text-fg-muted">
                              {p.description}
                            </p>
                          )}
                          {/* one quiet meta line — no tag soup */}
                          <p className="mt-6 text-[11px] tracking-[0.2em] text-fg/50">
                            {p.role.toUpperCase()} · {p.year}
                          </p>
                          <div className="mt-5 inline-flex items-center gap-2 text-sm text-accent-cyan">
                            open case study <span className="animate-pulse">▸</span>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </li>
            );
          })}
        </ul>

        <div className="mt-6 flex items-baseline gap-3 text-sm">
          <span className="text-accent-cyan">~/work</span>
          <span className="text-fg/50">❯</span>
          <span
            className="inline-block h-4 w-2 self-center bg-fg"
            style={{ animation: "hero-caret-blink 1s step-end infinite" }}
          />
        </div>
      </div>
    </div>
  );
}
