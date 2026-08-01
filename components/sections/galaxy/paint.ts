// paint.ts — live colour overrides for the focused planet (dev-only play).
//
// The PlanetPainter panel writes patches here keyed by node id and fires
// PAINT_EVENT; FocusOrb merges the patch over the node's base style on the
// next render. Nothing persists: when Caroline lands on colours she likes,
// she copies the values out of the panel and they get baked into
// PLANET_OVERRIDES / the style tables in FocusOrb.tsx.

export type PaintPatch = Partial<{
  a: string; b: string; c: string; d: string;
  e: string; pole: string; rim: string;
  ringA: string; ringB: string;
  eAmt: number; poleAmt: number; speckle: number; rimAmt: number;
  cloud: number; bandFreq: number; blotch: number; soft: number;
  // suns
  flare: string;
  gran: number; turb: number; flareAmt: number; glow: number;
}>;

export const PAINT: Record<string, PaintPatch> = {};

/** window event fired after every PAINT mutation */
export const PAINT_EVENT = "galaxy:paint";

export function setPaint(id: string, key: keyof PaintPatch, value: string | number) {
  PAINT[id] = { ...PAINT[id], [key]: value } as PaintPatch;
  window.dispatchEvent(new CustomEvent(PAINT_EVENT));
}

export function clearPaint(id: string) {
  delete PAINT[id];
  window.dispatchEvent(new CustomEvent(PAINT_EVENT));
}
/** window CustomEvent<string | null> fired when the focused node changes */
export const FOCUS_EVENT = "galaxy:focus";
