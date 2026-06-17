"use client";

// PROTOTYPE — Variant "bento": every project visible at once as a row of
// panels. Hover/focus a panel and it expands (flex-grow) with a glitch-scan
// while the others collapse to spines. Overview-first; one click to dive in.
import { useState } from "react";
import { enriched } from "./projectMeta";

const ACCENTS = [
  "linear-gradient(140deg,#ff7a2a,#ff006e 55%,#7a3bff)",
  "linear-gradient(140deg,#00d4ff,#7a3bff)",
  "linear-gradient(140deg,#ff006e,#ffaa00)",
  "linear-gradient(140deg,#00d4ff,#00ffa3)",
  "linear-gradient(140deg,#ffaa00,#ff006e)",
];

export function VariantBento() {
  const items = enriched;
  const [hot, setHot] = useState(0);

  return (
    <div className="mx-auto w-full max-w-6xl">
      <p className="mb-5 font-mono text-xs uppercase tracking-[0.25em] text-fg-muted">
        hover to expand · click to open
      </p>

      <div className="flex h-[clamp(360px,46vw,460px)] flex-col gap-2 md:flex-row">
        {items.map((p, i) => {
          const open = i === hot;
          return (
            <button
              key={p.slug}
              type="button"
              onMouseEnter={() => setHot(i)}
              onFocus={() => setHot(i)}
              className="group relative min-h-0 overflow-hidden rounded-2xl border border-fg/10 text-left outline-none transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] focus-visible:ring-1 focus-visible:ring-accent-cyan"
              style={{ flexGrow: open ? 6 : 1, flexBasis: 0 }}
            >
              {/* accent wash */}
              <div
                aria-hidden
                className="absolute inset-0 transition-opacity duration-500"
                style={{ background: ACCENTS[i % ACCENTS.length], opacity: open ? 0.9 : 0.4 }}
              />
              {/* dark scrim so text stays legible */}
              <div
                aria-hidden
                className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-black/10"
              />
              {/* glitch scanlines on the open panel */}
              {open && (
                <div
                  aria-hidden
                  className="pointer-events-none absolute inset-0 opacity-25 mix-blend-overlay"
                  style={{
                    backgroundImage:
                      "repeating-linear-gradient(0deg, rgba(255,255,255,0.6) 0px, rgba(255,255,255,0.6) 1px, transparent 1px, transparent 4px)",
                  }}
                />
              )}

              {/* collapsed spine — vertical label */}
              {!open && (
                <div className="absolute inset-0 flex items-end justify-center p-3">
                  <span
                    className="whitespace-nowrap font-mono text-xs uppercase tracking-[0.3em] text-fg/80"
                    style={{ writingMode: "vertical-rl", transform: "rotate(180deg)" }}
                  >
                    {p.company}
                  </span>
                </div>
              )}

              {/* expanded content */}
              <div
                className={`absolute inset-0 flex flex-col justify-between p-6 transition-opacity duration-300 md:p-8 ${
                  open ? "opacity-100 delay-150" : "pointer-events-none opacity-0"
                }`}
              >
                <div className="flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.2em] text-fg/80">
                  <span>{String(i + 1).padStart(2, "0")}</span>
                  <span>{p.status} · {p.year}</span>
                </div>
                <div>
                  <span className="inline-flex w-fit items-center rounded-md bg-black/40 px-3 py-1.5 font-display text-sm font-bold lowercase text-fg backdrop-blur-sm">
                    {p.company}
                  </span>
                  <h3 className="mt-3 max-w-md font-display text-2xl font-black uppercase leading-[1.02] tracking-tight md:text-4xl">
                    {p.title}
                  </h3>
                  {p.description && (
                    <p className="mt-2 max-w-sm text-sm text-fg/85">{p.description}</p>
                  )}
                  <div className="mt-4 flex flex-wrap gap-2 font-mono text-[10px] uppercase tracking-[0.18em]">
                    {p.stack.map((s) => (
                      <span key={s} className="rounded-full bg-black/35 px-2.5 py-1 text-fg/90 backdrop-blur-sm">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
