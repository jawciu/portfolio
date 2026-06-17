"use client";

// PROTOTYPE — shared bits for the "soft" variant remixes (shell2 / bento2):
// a film-grain overlay and a deterministic pixel sprite (CLI-boot-logo vibe).
// Throwaway with the rest of the prototype folder.

// SVG film grain as a data URI — overlay with low opacity + blend for the
// diffused/grainy hero feel. fractalNoise so it reads organic, not static-y.
export const GRAIN_URI =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")";

export function Grain({ opacity = 0.07 }: { opacity?: number }) {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 mix-blend-overlay"
      style={{ backgroundImage: GRAIN_URI, opacity }}
    />
  );
}

// --- deterministic pixel sprite ---------------------------------------------
// Hash the slug → seed a tiny PRNG → fill a GRID×GRID half, mirror it.
// Deterministic so SSR + client render the same sprite (no hydration drama).

function fnv1a(s: string) {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function mulberry32(seed: number) {
  let a = seed;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const GRID = 9; // odd → a center column, reads more "creature"

export function spriteCells(slug: string): boolean[] {
  const rnd = mulberry32(fnv1a(slug));
  const half = Math.ceil(GRID / 2);
  const cells: boolean[] = new Array(GRID * GRID).fill(false);
  for (let y = 0; y < GRID; y++) {
    for (let x = 0; x < half; x++) {
      const on = rnd() > 0.52;
      cells[y * GRID + x] = on;
      cells[y * GRID + (GRID - 1 - x)] = on; // mirror → symmetric sprite
    }
  }
  return cells;
}

// Per-project two-tone palettes, cycled by index — same family as the hero.
export const SPRITE_PALETTES: [string, string][] = [
  ["#00d4ff", "#ff006e"],
  ["#ff7a2a", "#ff006e"],
  ["#7a3bff", "#00d4ff"],
  ["#00ffa3", "#00d4ff"],
  ["#ffaa00", "#ff006e"],
];

export function PixelSprite({
  slug,
  palette,
  size = 72,
  glow = true,
}: {
  slug: string;
  palette: [string, string];
  size?: number;
  glow?: boolean;
}) {
  const cells = spriteCells(slug);
  const rnd = mulberry32(fnv1a(slug + "::tone"));
  // Precompute each cell's colour so the sharp grid and its blurred glow copy
  // are identical (a shared live PRNG would drift between the two renders).
  const tones = cells.map((on) => (on ? (rnd() > 0.35 ? palette[0] : palette[1]) : null));
  const grid = (blur: boolean) => (
    <div
      aria-hidden={blur}
      className={blur ? "absolute inset-0" : "relative"}
      style={{
        display: "grid",
        gridTemplateColumns: `repeat(${GRID}, 1fr)`,
        width: size,
        height: size,
        ...(blur
          ? { filter: "blur(10px) saturate(1.6)", opacity: 0.9, transform: "scale(1.35)" }
          : {}),
      }}
    >
      {tones.map((tone, i) => (
        <div key={i} style={{ background: tone ?? "transparent" }} />
      ))}
    </div>
  );
  return (
    <div className="relative shrink-0" style={{ width: size, height: size }}>
      {glow && grid(true)}
      {grid(false)}
    </div>
  );
}
