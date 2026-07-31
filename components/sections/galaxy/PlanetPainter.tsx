"use client";

// PlanetPainter — dev-only panel for repainting the FOCUSED body live.
// Point at a planet (click it), open "paint" bottom-right, and every colour
// and surface dial applies on the next frame. "copy values" puts the current
// patch on the clipboard so Caroline can hand the numbers over to be baked
// into PLANET_OVERRIDES. NODE_ENV-gated at the mount site, never ships.

import { useEffect, useState } from "react";
import { GALAXY_NODES } from "@/lib/galaxyData";
import { paintableFor } from "./FocusOrb";
import { PAINT, FOCUS_EVENT, setPaint, clearPaint, type PaintPatch } from "./paint";

const COLOUR_FIELDS: { key: keyof PaintPatch; label: string }[] = [
  { key: "a", label: "deep base" },
  { key: "b", label: "lifted base" },
  { key: "c", label: "clouds" },
  { key: "d", label: "dark lanes" },
  { key: "e", label: "mottle" },
  { key: "pole", label: "poles" },
  { key: "rim", label: "rim glow" },
];
const DIAL_FIELDS: { key: keyof PaintPatch; label: string; min: number; max: number; step: number }[] = [
  { key: "eAmt", label: "mottle amount", min: 0, max: 1, step: 0.05 },
  { key: "poleAmt", label: "pole amount", min: 0, max: 1, step: 0.05 },
  { key: "speckle", label: "speckles", min: 0, max: 1, step: 0.05 },
  { key: "rimAmt", label: "rim amount", min: 0, max: 1.5, step: 0.05 },
  { key: "cloud", label: "cloud cover", min: 0, max: 1, step: 0.05 },
  { key: "bandFreq", label: "banding", min: 0, max: 8, step: 0.25 },
  { key: "blotch", label: "blotchiness", min: 0, max: 3, step: 0.1 },
];

export function PlanetPainter() {
  const [open, setOpen] = useState(false);
  const [focusedId, setFocusedId] = useState<string | null>(null);
  const [, force] = useState(0);

  useEffect(() => {
    const fn = (e: Event) => setFocusedId((e as CustomEvent<string | null>).detail);
    window.addEventListener(FOCUS_EVENT, fn);
    return () => window.removeEventListener(FOCUS_EVENT, fn);
  }, []);

  const node = focusedId ? GALAXY_NODES.find((n) => n.id === focusedId) : undefined;
  const base = node ? paintableFor(node) : null;
  const patch: PaintPatch = node ? PAINT[node.id] ?? {} : {};
  const isSun = base?.kind === "sun";

  const set = (key: keyof PaintPatch, value: string | number) => {
    if (!node) return;
    setPaint(node.id, key, value);
    force((n) => n + 1);
  };

  return (
    // stopPropagation: panel interactions must not focus stars or trip the
    // frame's activation / click-outside deactivation
    <div
      className="absolute bottom-3 right-3 z-30 font-mono text-[10px] text-fg/70"
      onClick={(e) => e.stopPropagation()}
      onPointerDown={(e) => e.stopPropagation()}
    >
      {open ? (
        <div className="max-h-[70vh] w-56 overflow-y-auto rounded-lg border border-white/15 bg-[rgba(7,7,9,0.85)] p-3 backdrop-blur-sm">
          <div className="mb-2 flex items-center justify-between">
            <span className="tracking-[0.15em]">planet paint · dev only</span>
            <button type="button" className="cursor-pointer text-fg/50 hover:text-fg" onClick={() => setOpen(false)}>×</button>
          </div>
          {!node || !base ? (
            <p className="text-fg/50">click a star first, then paint it</p>
          ) : (
            <>
              <p className="mb-2 text-fg">{node.name} <span className="text-fg/40">· {base.kind}</span></p>
              {COLOUR_FIELDS.filter((f) => f.key in base.values).map((f) => (
                <label key={f.key} className="mb-1.5 flex items-center justify-between gap-2">
                  <span>{f.label}</span>
                  <input
                    type="color"
                    value={String(patch[f.key] ?? base.values[f.key])}
                    className="h-5 w-10 cursor-pointer border-0 bg-transparent p-0"
                    onChange={(e) => set(f.key, e.target.value)}
                  />
                </label>
              ))}
              {!isSun && DIAL_FIELDS.map((f) => (
                <label key={f.key} className="mb-1.5 block">
                  <span className="flex justify-between">
                    <span>{f.label}</span>
                    <span className="text-fg">{Number(patch[f.key] ?? base.values[f.key]).toFixed(2)}</span>
                  </span>
                  <input
                    type="range"
                    min={f.min}
                    max={f.max}
                    step={f.step}
                    value={Number(patch[f.key] ?? base.values[f.key])}
                    className="w-full accent-[#c9a2ff]"
                    onChange={(e) => set(f.key, Number(e.target.value))}
                  />
                </label>
              ))}
              <div className="mt-2 flex gap-3">
                <button
                  type="button"
                  className="cursor-pointer text-fg/50 underline underline-offset-2 hover:text-fg"
                  onClick={() => {
                    navigator.clipboard?.writeText(JSON.stringify({ id: node.id, ...PAINT[node.id] }, null, 2));
                  }}
                >
                  copy values
                </button>
                <button
                  type="button"
                  className="cursor-pointer text-fg/50 underline underline-offset-2 hover:text-fg"
                  onClick={() => {
                    clearPaint(node.id);
                    force((n) => n + 1);
                  }}
                >
                  reset
                </button>
              </div>
            </>
          )}
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="cursor-pointer rounded border border-white/15 bg-[rgba(7,7,9,0.7)] px-2 py-1 tracking-[0.15em] hover:text-fg"
        >
          paint
        </button>
      )}
    </div>
  );
}
