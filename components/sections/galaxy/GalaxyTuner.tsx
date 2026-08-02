"use client";

// GalaxyTuner — dev-only panel for tuning the hop choreography live.
// Mutates the shared TUNING object directly; the scene reads those values
// at call/frame time, so the next click uses whatever the sliders say.
// NODE_ENV-gated at the mount site (SkillsGalaxy), never ships.

import { useState } from "react";
import { TUNING, TUNING_DEFAULTS, type GalaxyTuning } from "./tuning";

const FIELDS: { key: keyof GalaxyTuning; label: string; min: number; max: number; step: number }[] = [
  { key: "retractMs", label: "retract (ms)", min: 0, max: 2000, step: 50 },
  { key: "flightMs", label: "flight (ms)", min: 400, max: 4000, step: 100 },
  { key: "sproutAt", label: "sprout at (× flight)", min: 0, max: 1.2, step: 0.05 },
  { key: "extRate", label: "edge speed", min: 1, max: 15, step: 0.5 },
  { key: "gatherRate", label: "gather speed", min: 0.5, max: 10, step: 0.1 },
  { key: "arcLift", label: "arc lift (world)", min: 0, max: 8, step: 0.5 },
  { key: "bridgePulse", label: "bridge pulse (0/1)", min: 0, max: 1, step: 1 },
];

export function GalaxyTuner() {
  const [open, setOpen] = useState(false);
  const [, force] = useState(0);
  return (
    // stopPropagation: panel interactions must not activate the frame,
    // focus stars, or trip the click-outside deactivation
    <div
      className="absolute top-3 left-32 z-30 font-mono text-[10px] text-fg/70"
      onClick={(e) => e.stopPropagation()}
      onPointerDown={(e) => e.stopPropagation()}
    >
      {open ? (
        <div className="w-60 rounded-lg border border-white/15 bg-[rgba(7,7,9,0.85)] p-3 backdrop-blur-sm">
          <div className="mb-2 flex items-center justify-between">
            <span className="tracking-[0.15em]">choreo tuning · dev only</span>
            <button
              type="button"
              className="cursor-pointer text-fg/50 hover:text-fg"
              onClick={() => setOpen(false)}
            >
              ×
            </button>
          </div>
          {FIELDS.map((f) => (
            <label key={f.key} className="mb-2 block">
              <span className="flex justify-between">
                <span>{f.label}</span>
                <span className="text-fg">{TUNING[f.key]}</span>
              </span>
              <input
                type="range"
                min={f.min}
                max={f.max}
                step={f.step}
                value={TUNING[f.key]}
                className="w-full accent-[#c9a2ff]"
                onChange={(e) => {
                  TUNING[f.key] = Number(e.target.value);
                  force((n) => n + 1);
                }}
              />
            </label>
          ))}
          <button
            type="button"
            className="mt-1 cursor-pointer text-fg/50 underline underline-offset-2 hover:text-fg"
            onClick={() => {
              Object.assign(TUNING, TUNING_DEFAULTS);
              force((n) => n + 1);
            }}
          >
            reset defaults
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="cursor-pointer rounded border border-white/15 bg-[rgba(7,7,9,0.7)] px-2 py-1 tracking-[0.15em] hover:text-fg"
        >
          tune
        </button>
      )}
    </div>
  );
}
