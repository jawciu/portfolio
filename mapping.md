# Hero Scene Map — fireball, orbs, glass (as built)

What's actually on the hero canvas and where each piece lives. This replaces the original
pre-build spec (the "real-3D carousel" plan — the build went procedural instead). For
*tuning recipes* (palette knobs, reveal curves, band radii) read
`.claude/skills/orb-firewall-tuning/SKILL.md`; this doc is the composition map.

Review loop: `node scripts/shoot.mjs <label>` (dev server running) → PNGs in
`screenshots/<label>/`. Look references: `public/assets/flame-chain.png` (fireball),
`public/assets/distorted-orb.png` (orbs).

---

## Scene graph (`components/hero/Scene.tsx`)

Fixed full-viewport `<Canvas>` (z-0 behind the DOM), perspective camera at `z=5`, fov 35.
DPR clamped `[1,2]` (tier ≥ 3) or `[1,1.5]`. Background `#070709`.

| Layer (back → front) | Component | Render | Position |
|---|---|---|---|
| Fireball + substrate | `Backdrop.tsx` → `heroShaders.ts` | one frustum-filling plane, `renderOrder -1` | `z=-3`, auto-scaled to fill frustum |
| Orb row | `DistortedOrb.tsx` | 4 billboard quads, `renderOrder 0–3` | group at `y=-1.15`, rises on scroll |
| Glass sphere + pill | `GlassRail.tsx` | real 3D transmission meshes | left rail |
| Postprocessing | `Effects.tsx` | EffectComposer | — |
| `Environment` | drei Lightformers (orange/mint/violet/pink) | 256px env map for the glass | — |

Shared interaction state (refs, never setState — mutated in `useFrame`):

- `mouse` — pointer 0..1, y flipped. The orbs smooth it themselves (lerp 0.25/frame);
  the fireball smooths its own copy (lerp 0.12/frame). Two independent parallaxes.
- `progress` — `scrollY / innerHeight` clamped 0..1 (first viewport only). Drives the
  orb-row rise, the backdrop fade (`uFade = 1 - progress*1.1`), and the glass drift/warp.

---

## Fireball (`heroShaders.ts` → `backdropFragment`)

A comet of **7 masked discs** in one fragment loop, drawn into the backdrop colour
(no alpha — everything is `col` math over `uBg`). Coordinate space: origin top-left,
y-down, 1 unit = viewport height; head at `(0.150, 0.195)`.

- **Head (discs 0–2)** — drawn nose-first so each later disc sits ON TOP and the earlier
  one pokes out left. Disc 0 is the only full circle (the round nose, `r=0.044`, with a
  cool blue rim); disc 1 (`0.074`) ≈ ¾ cap; disc 2 (`0.098`) ≈ half. Warm orange→coral
  colour by horizontal position.
- **Chain (discs 3–6)** — caps drawn left→right (right on top), radii growing
  `0.108 → 0.140`. One shared reveal curve `cut = c.x + r*(-1.20 + 2.15*pow(t,0.62))`
  thins every cap progressively to a sliver. Purple band stretched
  (`capColorT = 0.5 + 0.5*pow(ct,1.5)`) so blue only arrives at the last sliver; `tail`
  dims to near-black down the chain. **No creases** — overlaps blend by reveal order.
- **Palette** — `flameRamp`, 5 stops in LINEAR RGB (pre-converted from sRGB hex —
  convert before pasting new stops or they wash out): `#FF8858 → #F56267 → #E560FA →
  #793CEA → #2835A8`.
- **Halos** — magenta-pink annulus around the head + broad deep-blue wrap along the chain.
- **Motion** — `breathe = 1 + 0.030*sin(t*0.6)` swell, shared `fbm` edge wobble
  (`*0.10` head / `*0.04` caps), tiny per-disc y bob.
- **Hover reveal** — cursor toward screen LEFT opens every cap a little more
  (`hoverReveal = max(0.5-mouse.x,0)*0.40`), **gated to the upper screen**
  (`zone = 1-smoothstep(0.58,0.82,mY)`) so cursor over the orb row doesn't drive it.
  One-sided: discs only ever grow into each other, never gap.
- Plus: faint warm bloom hugging the head, cool fill bottom-right, vignette + animated
  grain, `uFade` scroll fade-out.

## Orb row (`DistortedOrb.tsx`)

Five apparent orbs, actually **4 quads** sharing one material language: a radial
gaussian band ramp `bandColour()` — magenta glow → orange rim → yellow → jade → mint
core — over a value-noise-wobbled radius, alpha-feathered (`uEdge`/`uFeather`).

- **Left three (quads 0–2)** — each a big disc revealed as a thin crescent by a fixed
  one-sided cut (`uMaskX`); the disc slides behind the cut (`uShift`) so the sliver
  waxes/wanes in place. Per-orb `amp/speed/phase/bias` in the `LEFT_ORBS` array.
  **Orb 1 vanishes**: a gaussian "hide pulse" (32s cycle) slides it fully past its cut
  for ~0.5s, ramp-rate-matched to its neighbours. **Choreography**: orb 2 shares the 32s
  period, phased so its widest wax meets orb 1 just as it fades.
- **Merged pair (quad 3, rightmost)** — one quad, two disc fields fused by polynomial
  `smin`; every colour band wraps the combined iso-contour (true metaball neck).
  Breathes between full merge (concentric for a beat, `uK=0.42`) and full separation
  (`uK→0.05`, satellite slides right off-screen) on a `sin(t*0.28)` cycle. Core is light
  mint `#bdeed9`, not white, with its own band radii (`RM`).
- **Palette** (plain sRGB `THREE.Color`, no linear conversion): `#ff2f7e` magenta,
  `#ff8526` orange, `#ffcf52` yellow, `#3fc4ad` jade, cores `#54c2a8` / `#bdeed9`.
- **Scroll** — the whole group rests at `y=-1.15` (only top halves visible above the
  fold) and rises `+1.5` to centred as `progress` 0→1.
- **Parallax** — smoothed cursor adds small `uShift` offsets (`0.08/0.05` left orbs,
  `0.047/0.029` merged pair). It's a mouse-driven *unmask*, not positional drift.

## Glass rail (`GlassRail.tsx`)

Left-rail glass sphere + vertical pill (real 3D): `MeshTransmissionMaterial` shell over
an **iridescent core** — a shader plane sampling the Silvaday artwork as a vertical
gradient, domain-warped by time + scroll so colours slide/stretch/bleed, then refracted
again by the shell. Scroll also drifts the shapes vertically. `lowQuality` (tier < 3)
drops transmission samples/resolution instead of removing the glass.

## Postprocessing (`Effects.tsx`)

Tier ≥ 2 only: Bloom (threshold 0.55 — the orbs' `toneMapped={false}` brights are what
bloom), whisper chromatic aberration, overlay grain 0.045, vignette. No scanlines, no
glitch (dropped on purpose — photographic mood).

## Fallbacks

- **Reduced motion** — canvas `frameloop="demand"`; fireball holds a posed frame (no
  time advance, scroll fade still works); orbs pin to their `bias` pose; TelemetryRail
  shows `STATIC`.
- **GPU tier** — `useGPUTier`: postprocessing bails < 2, DPR + transmission quality drop
  < 3. `HeroPoster.tsx` is the static LCP fallback while the canvas loads.
