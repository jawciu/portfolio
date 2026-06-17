"use client";

// PROTOTYPE — Variant "shell": projects as a terminal directory listing.
// ↑/↓ (or click) to move the cursor, Enter to open a project inline (cat),
// Esc to collapse. Leans into the site's Linux path-label + telemetry HUD vibe.
import { useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { enriched } from "./projectMeta";

const PROMPT = "caro@portfolio:~/work$";

export function VariantShell() {
  const rows = enriched;
  const [cursor, setCursor] = useState(0);
  const [open, setOpen] = useState<number | null>(0);
  const paneRef = useRef<HTMLDivElement>(null);

  // ↑/↓ + Enter/Esc when the pane has focus. (← / → are owned by the switcher.)
  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") { e.preventDefault(); setCursor((c) => Math.min(rows.length - 1, c + 1)); }
    if (e.key === "ArrowUp") { e.preventDefault(); setCursor((c) => Math.max(0, c - 1)); }
    if (e.key === "Enter") { e.preventDefault(); setOpen((o) => (o === cursor ? null : cursor)); }
    if (e.key === "Escape") { e.preventDefault(); setOpen(null); }
  };

  return (
    <div
      ref={paneRef}
      tabIndex={0}
      onKeyDown={onKeyDown}
      className="mx-auto w-full max-w-4xl select-none overflow-hidden rounded-xl border border-fg/12 bg-black/60 font-mono text-sm outline-none ring-accent-cyan/40 backdrop-blur-sm focus:ring-1"
      role="group"
      aria-label="Projects — terminal listing"
    >
      {/* title bar */}
      <div className="flex items-center gap-2 border-b border-fg/10 bg-fg/[0.03] px-4 py-2.5">
        <span className="h-3 w-3 rounded-full bg-accent-magenta/80" />
        <span className="h-3 w-3 rounded-full bg-accent-amber/80" />
        <span className="h-3 w-3 rounded-full bg-accent-cyan/80" />
        <span className="ml-2 text-xs text-fg-muted">work — zsh — 80×24</span>
      </div>

      <div className="px-4 py-4 md:px-6 md:py-5">
        {/* command line */}
        <div className="flex items-center gap-2 text-fg/80">
          <span className="text-accent-cyan">{PROMPT}</span>
          <span>ls --projects</span>
        </div>
        <p className="mt-1 text-xs text-fg-muted">
          total {rows.length} · use ↑ ↓ to move, ↵ to open, esc to close
        </p>

        {/* listing */}
        <ul className="mt-3">
          {rows.map((p, i) => {
            const active = i === cursor;
            const isOpen = open === i;
            return (
              <li key={p.slug}>
                <button
                  type="button"
                  onMouseEnter={() => setCursor(i)}
                  onClick={() => setOpen((o) => (o === i ? null : i))}
                  className={`flex w-full items-baseline gap-3 rounded px-2 py-1.5 text-left transition-colors ${
                    active ? "bg-accent-cyan/12 text-fg" : "text-fg/70 hover:text-fg"
                  }`}
                >
                  <span className={active ? "text-accent-cyan" : "text-transparent"}>›</span>
                  <span className="text-fg-muted">drwxr-xr-x</span>
                  <span className="hidden text-fg-muted sm:inline">{p.year}</span>
                  <span className="min-w-[7rem] font-semibold text-accent-cyan">
                    {p.slug.split("-")[0]}/
                  </span>
                  <span className="truncate text-fg/80">{p.oneLiner}</span>
                  <span
                    className={`ml-auto hidden shrink-0 text-[10px] uppercase tracking-widest sm:inline ${
                      p.status === "Shipped" ? "text-accent-cyan" : "text-fg-muted"
                    }`}
                  >
                    {p.status}
                  </span>
                </button>

                {/* expanded `cat` view */}
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
                      className="overflow-hidden"
                    >
                      <div className="ml-7 mt-1 border-l border-fg/15 pl-4 pb-3">
                        <div className="text-fg/60">
                          <span className="text-accent-cyan">{PROMPT}</span> cat {p.slug}.md
                        </div>
                        <h3 className="mt-2 font-display text-xl font-bold uppercase leading-tight text-fg md:text-2xl">
                          {p.title}
                        </h3>
                        {p.description && (
                          <p className="mt-2 max-w-xl text-fg-muted">{p.description}</p>
                        )}
                        <dl className="mt-3 grid grid-cols-[5rem_1fr] gap-x-4 gap-y-1 text-xs">
                          <dt className="text-fg/40">ROLE</dt>
                          <dd className="text-fg/80">{p.role}</dd>
                          <dt className="text-fg/40">STACK</dt>
                          <dd className="text-fg/80">{p.stack.join(" · ") || "—"}</dd>
                          {p.tags.length > 0 && (
                            <>
                              <dt className="text-fg/40">PHASES</dt>
                              <dd className="text-fg/80">{p.tags.join(" · ")}</dd>
                            </>
                          )}
                        </dl>
                        <div className="mt-3 inline-flex items-center gap-2 text-accent-cyan">
                          open case study <span className="animate-pulse">▸</span>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </li>
            );
          })}
        </ul>

        {/* live prompt with blinking caret */}
        <div className="mt-3 flex items-center gap-2 px-2 text-fg/80">
          <span className="text-accent-cyan">{PROMPT}</span>
          <span
            className="inline-block h-4 w-2 bg-fg"
            style={{ animation: "hero-caret-blink 1s step-end infinite" }}
          />
        </div>
      </div>
    </div>
  );
}
