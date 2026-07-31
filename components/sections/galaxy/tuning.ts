// tuning.ts — live-tweakable choreography knobs for the skills galaxy.
//
// The scene reads these at call time (timers) or per frame (rates), so the
// dev-only GalaxyTuner panel can mutate them and the very next interaction
// uses the new values. Once Caroline settles on numbers, bake them in here
// as the new defaults (the panel never ships: it is NODE_ENV-gated).

export type GalaxyTuning = {
  /** phase 1 — how long the old planet's edges get to reel in (camera parked) */
  retractMs: number;
  /** phase 2 — camera flight duration between planets */
  flightMs: number;
  /** phase 3 — when the new edges sprout, as a fraction of the flight (0 = at launch, 1 = on landing) */
  sproutAt: number;
  /** exponential rate for edge grow/shrink — higher = snappier */
  extRate: number;
  /** exponential rate for stars gathering/releasing — higher = snappier */
  gatherRate: number;
  /** world-units height of the mid-flight camera lift (0 = straight line) */
  arcLift: number;
  /** 1 = a glow rides the A↔B bridge during a hop flight, 0 = off */
  bridgePulse: number;
};

export const TUNING_DEFAULTS: GalaxyTuning = {
  retractMs: 600,
  flightMs: 1700,
  sproutAt: 0.66,
  extRate: 13,
  gatherRate: 3.2,
  arcLift: 2.5,
  bridgePulse: 1,
};

export const TUNING: GalaxyTuning = { ...TUNING_DEFAULTS };
