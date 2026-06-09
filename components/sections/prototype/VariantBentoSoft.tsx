"use client";

// PROTOTYPE — Variant "bento2": the spotlight mosaic with NO hard lines.
// Each "folder" is a soft colour pool that dies into the dark the way the
// orbs/fireball edges do — no borders, no panel rects, no scrims, no
// box-shadows. Type is hero-only: Iosevka (font-hero) + Geist Mono.
// Palettes are lifted straight from the hero shaders (DistortedOrb consts +
// the fireball flameRamp).
import { useState } from "react";
import { enriched } from "./projectMeta";
import { Grain } from "./softBits";

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
// Tight pools + lots of dark around them — the panel's rectangular extent
// should never be readable, only the blobs (like the orbs floating in dark).
function openWash([c0, c1, c2]: [string, string, string]) {
  return [
    `radial-gradient(40% 48% at 28% 30%, ${c0}59, transparent 65%)`,
    `radial-gradient(48% 55% at 68% 74%, ${c1}4d, transparent 66%)`,
    `radial-gradient(75% 85% at 45% 50%, ${c2}26, transparent 68%)`,
  ].join(", ");
}

function spineWash([c0, c1]: [string, string, string]) {
  return [
    `radial-gradient(30% 70% at 50% 35%, ${c0}40, transparent 66%)`,
    `radial-gradient(38% 85% at 50% 70%, ${c1}33, transparent 68%)`,
  ].join(", ");
}

export function VariantBentoSoft() {
  const items = enriched;
  const [hot, setHot] = useState(0);

  return (
    <div className="mx-auto w-full max-w-6xl">
      <p className="mb-5 flex items-center gap-3 font-mono text-xs uppercase tracking-[0.25em] text-fg-muted">
        <span aria-hidden className="inline-block h-2 w-2 bg-fg/60" />
        hover to expand · click to open
      </p>

      <div className="flex h-[clamp(380px,46vw,480px)] flex-col gap-0 md:flex-row">
        {items.map((p, i) => {
          const open = i === hot;
          const pool = POOLS[i % POOLS.length];
          return (
            <button
              key={p.slug}
              type="button"
              onMouseEnter={() => setHot(i)}
              onFocus={() => setHot(i)}
              className="group relative min-h-0 text-left outline-none transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]"
              style={{ flexGrow: open ? 6 : 1, flexBasis: 0 }}
            >
              {/* the colour pool — crossfade between spine wisp and open bloom */}
              <div
                aria-hidden
                className="absolute -inset-4 transition-opacity duration-700"
                style={{ background: openWash(pool), opacity: open ? 1 : 0 }}
              />
              <div
                aria-hidden
                className="absolute -inset-4 transition-opacity duration-700"
                style={{
                  background: spineWash(pool),
                  opacity: open ? 0 : undefined,
                }}
              />
              <Grain opacity={0.06} />

              {/* collapsed — vertical label floating in the wisp */}
              {!open && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <span
                    className="whitespace-nowrap font-mono text-xs uppercase tracking-[0.35em] text-fg/55 transition-colors duration-300 group-hover:text-fg/90"
                    style={{ writingMode: "vertical-rl", transform: "rotate(180deg)" }}
                  >
                    {p.company} · {p.year}
                  </span>
                </div>
              )}

              {/* expanded — hero type only */}
              <div
                className={`absolute inset-0 flex flex-col justify-between p-6 transition-opacity duration-500 md:p-9 ${
                  open ? "opacity-100 delay-200" : "pointer-events-none opacity-0"
                }`}
              >
                <div className="flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.25em] text-fg/60">
                  <span>{String(i + 1).padStart(2, "0")}</span>
                  <span>{p.status} · {p.year}</span>
                </div>
                <div>
                  {/* company — like the "Hi I'm Caroline," intro line */}
                  <p className="font-hero text-xl font-black lowercase text-fg/90">
                    {p.company},
                  </p>
                  {/* title — same voice as the hero headline */}
                  <h3 className="mt-2 max-w-lg font-hero text-2xl font-bold uppercase leading-[1.02] tracking-tight text-fg md:text-4xl">
                    {p.title}
                  </h3>
                  {p.description && (
                    <p className="mt-4 max-w-sm font-hero text-sm leading-relaxed text-fg/70 md:text-base">
                      {p.description}
                    </p>
                  )}
                  {/* meta — styled like the hero role line (square + mono) */}
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
