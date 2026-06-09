---
name: orb-firewall-tuning
description: Tune the hero's "watercolour metaball" visuals — the DistortedOrb row and the backdrop Firewall/fireball. They are siblings built from the same primitives (gaussian colour bands, value noise, polynomial smooth-union, masked reveals). Use whenever adjusting orb colour/shape/motion, or editing the firewall head/chain/creases/palette, or running the screenshot iteration loop to review either.
license: Proprietary
metadata:
  project: portfolio
  files: components/hero/DistortedOrb.tsx, components/hero/heroShaders.ts
---

# Orb & Firewall Tuning

The hero has two procedural visuals that LOOK different but are built from the **same
four primitives**. Learn them once, tune either.

| | **Orbs** | **Firewall / fireball** |
|---|---|---|
| File | `components/hero/DistortedOrb.tsx` | `components/hero/heroShaders.ts` (`backdropFragment`) |
| Render | billboard quads, 3D meshes (`renderOrder` 0–3) | one full-screen plane behind everything |
| Count | 3 left slivers + 1 merged pair quad | 7 discs (3 head + 4 chain) in one fragment loop |
| Palette | magenta→orange→yellow→green→mint | orange→coral→pink→purple→blue (`flameRamp`) |
| Motion | per-orb sine wax/wane + hide pulse + merge breathe | gentle `breathe` swell + `fbm` edge wobble |
| Colour method | radial `bandColour()` (gaussian peaks per radius) | `flameRamp()` (5-stop linear ramp by position) |

## The four shared primitives

These appear in both files (intentionally duplicated so each reads as one material).

1. **Value noise** — `hash` + `vnoise` (orbs) / `hash21` + `vnoise` + `fbm` (firewall).
   Two octaves, time-advanced, used to wobble the *edge* so it reads as a soft cloud,
   not a hard circle. Orbs: `r += (n-0.5)*0.05 + (n2-0.5)*0.025`. Firewall:
   `d += wob * 0.10` (head) / `* 0.04` (caps).

2. **Smooth-union `smin(a,b,k)`** — identical polynomial in both. Fuses two distance
   fields into ONE continuous shape with a neck. `k` = neck thickness: bigger `k` =
   fatter fusion, `k→0` = the two pinch apart. The merged-orb pair animates `k`
   (`0.42 - sepAmt*0.37`); the firewall uses overlapping masked discs instead of `smin`
   to chain, but the primitive is right there if you want true fusion in the chain.

3. **Soft edge via `smoothstep` / `gauss`** — nothing has a hard rim. Orbs fade alpha
   with `1.0 - smoothstep(uEdge, uEdge+uFeather, r)`. Firewall fades the body with
   `1.0 - smoothstep(0.52, 1.22, d)` and adds a separate `glow = exp(-d*d*0.95)` halo.
   **Widen the smoothstep span → softer, more diffuse; narrow it → crisper.**

4. **One-sided masked reveal** — show only part of a disc so it reads as a crescent/cap.
   Orbs: `mask = 1.0 - smoothstep(uMaskX, uMaskX+uMaskFeat, vUv.x)` (fixed cut, disc
   slides behind it via `uShift`). Firewall: `cut = c.x + r*(-1.20 + 2.15*pow(t,0.62))`
   then `vis = smoothstep(cut, cut+0.014, P.x)` — **one reveal curve drives the whole
   chain**, giving disc0 a full circle, disc1 ~¾, disc2 ~half, caps less than half.

## Firewall anatomy (`backdropFragment`, the part you'll tweak)

Coordinate space: `P = vec2(uv.x*aspect, 1.0 - uv.y)` → origin top-left, y-down, 1 unit
= viewport height. Head sits at `head = vec2(0.150, 0.195)`. Everything lives inside the
`{ const int N = 7; ... }` block.

**Layout loop (lines ~92–106):** builds `cx[]` (centre x) and `cr[]` (radius) for 7 discs.
- Radii: caps grow `mix(0.090, 0.140, t)`; head lobes are explicit stepped sizes
  `0.044 → 0.074 → 0.108` (nose → biggest). All scaled by `breathe`.
- Spacing factor `sf`: `0.60` for the head trio, `mix(0.38,0.52,…)` for caps (tighter cadence).
- `xacc += (prevR + r) * sf` walks centres left→right.

**Three draw passes:**
1. **Head** (lines ~110–133): discs 2,1,0 back-to-front so the full nose lands on top.
   Warm colour by horizontal position (`headT = hx*0.24`), orange core → coral rim.
2. **Cap chain** (lines ~136–167): discs 3–6 left→right so the right cap is on top.
   `capColorT = 0.5 + 0.5*pow(ct,1.5)` stretches the purple band so blue only arrives at
   the final sliver. `bright` lifts the purple stop; `tail` dims progressively to near-black.
3. **Dark creases** (lines ~174–187): soft shadow at each section boundary — curved notch
   on head lobe rims, straight notch at each cap's cut edge. This is what makes lobes read
   as stacked discs.

Plus two halos at the end: magenta-pink annulus around the head, broad deep-blue wrap
around the whole chain.

## Tuning recipes (firewall)

| Want to change | Knob | Where |
|---|---|---|
| Overall palette | the 5 `cN` linear-RGB stops in `flameRamp` | lines ~56–60 |
| Where blue kicks in | the `pow(ct, 1.5)` exponent in `capColorT` (higher = blue later) | ~150 |
| Head vs chain size | `cr` values: head `0.044/0.074/0.108`, caps `mix(0.090,0.140,t)` | ~96–100 |
| Disc spacing/overlap | `sf` (lower = more overlap/fusion) | ~101 |
| Reveal (full→sliver) | the `-1.20 + 2.15*pow(t,0.62)` cut curve | ~117, ~145, ~182 |
| Edge softness | the `smoothstep(0.52,1.22,d)` body span + `wob` multiplier | ~159, ~116/142 |
| Crease depth | the `0.40` / `0.38` multipliers | ~178, ~186 |
| Breathe / liveliness | `breathe = 1.0 + 0.030*sin(uTime*0.6)`, `wob` fbm scale | ~88–89 |
| Tail darkness | `tail = mix(1.0, 0.18, …)` (lower 2nd arg = darker tip) | ~158 |

> **Linear-RGB gotcha:** `flameRamp` stops are pre-converted from sRGB hex to linear so the
> renderer's sRGB output lands exactly on the source hex (`#FF8858` etc.). If you pick a new
> colour, convert the hex to **linear** before pasting, or it'll wash out pale. The hex each
> stop targets is in the trailing comment.

## Tuning recipes (orbs)

- **Colours:** `MAG / ORANGE / YELLOW / GREEN / CORE_MINT` (left) and `CORE_LIGHT` (merged),
  lines ~147–151, 178. These are plain `THREE.Color` (sRGB hex) — no linear conversion needed,
  unlike the firewall.
- **Band positions:** `R` (left slivers) and `RM` (merged pair) objects (~154–177). Each is a
  set of radii where a colour peaks; `bandS` = band width (bleed), `edge`/`feather` = silhouette
  + softness.
- **Per-orb shape/motion:** the `LEFT_ORBS` array (~204–228). `maskX` = how thin the crescent,
  `amp`/`speed`/`phase`/`bias` = wax/wane, `hideCycle/hideWidth/hideDepth` = the full-vanish pulse
  (orb 1 only — and the comment explains how its ramp rate is matched to the others).
- **Merge breathe:** `MergedOrbs` useFrame (~327–356). `sepAmt` drives `uCenterA/B` apart and
  animates `uK`. The orbs choreograph: orb 2's widest wax (~t=13) meets orb 1 as it fades.

## Screenshot iteration loop (how we review)

Dev server must be running (`pnpm dev`, port 3000). Then from repo root:

```bash
node scripts/shoot.mjs <label>          # 5 composition shots: top, top+1.8s, scroll 25/50/85%
node scripts/shoot-seq.mjs <label> [intervalMs] [count]   # time series at top (default 8 @ 2.9s) — catch motion extremes
node scripts/shoot-clip.mjs <label> <x> <y> <w> <h> <stepMs> <count>  # cropped close-up time series
```

Output lands in `screenshots/<label>/`. All run at 1440×900 @2x via Playwright chromium.
Workflow: make a change → `shoot` → **Read the PNGs** → compare against the look reference
(`public/assets/flame-chain.png` for the firewall, `public/assets/distorted-orb.png` for the orbs)
→ iterate. Use `shoot-seq` when the issue is *motion* (does it breathe too fast? does the sliver
vanish cleanly?) and `shoot-clip` to zoom on the head or a crease.

Reviewing as personas helps (see the `hero_orb_workflow` memory): a "3d bro" pass for the
technical render (banding, aliasing, edge softness, bloom blowout) and a "creative director"
pass for composition, palette balance, and motion pacing.

## Gotchas

- **Never `setState` in `useFrame`.** Mouse/scroll come in as refs; mutate uniform `.value`
  in place. Adding React state here will trash framerate.
- **Reduced motion:** both components branch on `reduced` to a posed frame. Any new animation
  must have a frozen fallback or you break the prefers-reduced-motion path.
- **GPU tier:** postprocessing (`Effects.tsx`) bails below tier 2; DPR is clamped in `Scene.tsx`.
  Don't assume bloom is present when judging a screenshot on a low tier.
- **`toneMapped={false}` + additive-ish bright multipliers** are why the rims glow under Bloom
  (threshold 0.55). If you crank `uBright`/`bright` you may blow out the bloom — check a shot.
- The firewall is **drawn into the backdrop colour** (`col = mix(col, base, …)`), not alpha-
  composited like the orbs. There's no transparency to lean on — everything is `col` math over `uBg`.
