# Hero Rebuild — Element Mapping & Build Spec

Agreed plan for rebuilding the hero so the color-distorted shapes, layout, and motion
match Caroline's mockup (`Screenshot_2026-05-30_at_23.04.21`). Source assets live in
`.cursor/projects/Users-caro-Code-portfolio/assets/`.

---

## Glossary — Asset → Element

| Element | Source asset | What it is |
|---|---|---|
| **Flame chain** | `3D_Models_Pin_2` | Top-left warm→violet→blue chain of blobs (the "echo / pulse") |
| **Distorted orb** | `3D_Models_Pin_1` | The real-3D row: chrome sphere necking into a backlit orb + receding rim-slices |
| **Iridescent sphere** | `Silvaday_Pin_4` | Standalone rainbow glass ball (left rail) |
| **Rainbow pills** | `Silvaday_Pin_2`, `Silvaday_Pin_3` | Two vertical iridescent glass capsules (left rail + bottom-right accent) |

---

## Approach

Hybrid:
- **Real 3D** where the magic is — distorted orb, glass sphere, glass pills.
- **Procedural 2D** where it's cheaper/better — flame chain.
- **Assets as look/color reference**, not flat textures — except as the iridescent
  **core** seen inside the glass elements.
- Text / nav / vertical label stay as the **existing DOM overlay**; the canvas is purely
  the visual behind them. Existing left-weighted darkening plate keeps the headline legible.

---

## Elements & Behaviour

### Flame chain — procedural 2D metaballs (fragment shader)
- Blobs are **born** at the warm head (left) → travel right, **shrink and cool**
  (warm → violet → blue) → **merge/split** via metaball necks → **dissolve** at the tip.
- Idle **breathe** (slow swell/shrink) + **noise wobble** (organic, non-mechanical).
- **Head pulses brightest** (the "source").
- Driver: **time** + cursor parallax.

### Distorted orb — REAL 3D (centerpiece)
- **5 spheres** on a gentle arc, shared iridescent **backlit-rim** material, perspective camera.
- Motion = **carousel**: arc rotates slowly around a vertical axis; spheres swing
  forward/back and **reorder in depth**; front pair **necks** like a metaball.
- **Per-sphere variation**: different brightness/exposure, saturation, and **thickness of
  the red-yellow glow ring** (front = thick hot-orange halo + near-white core; rear =
  thinner, cooler, dimmer, fading to a faint pink sliver).
- Driver: **time** + cursor tilt.

### Iridescent sphere — REAL 3D glass (true refraction)
- Floating glass orb on the left rail. **No merge** with the pill (dropped by choice).
- Drifts **vertically on scroll**; **thin-film iridescence** hue-shifts as it moves.
- Driver: **scroll** + time.

### Rainbow pills — REAL 3D glass (true refraction)
- **Clear glass shell + animated iridescent core** inside.
- True **see-through refraction** of the scene behind; inner core carries the `Silvaday`
  rainbow and **warps/morphs on scroll** (colors slide, stretch, bleed into new colors).
- Vertical drift on scroll; thin-film sheen.
- Placement: **left rail** (below the sphere) + a **bottom-right** accent pill.
- Driver: **scroll** + time.

---

## Camera & Interaction
- **Perspective** camera so the carousel depth reads.
- **Cursor parallax** across all layers (different rates = depth) + soft cursor-follow glow.
  Tuned subtle.

## Scroll Model (Option B — fixed reacts, then leaves)
- Fixed canvas reacts to the **first viewport** of scroll (pills drift + color-morph,
  orb tilts), then the whole canvas **gently fades / parallaxes away** as you pass the hero.
- **No scroll-hijacking / no pin.** Wired via Lenis + GSAP ScrollTrigger driving uniforms.

## Lighting
- Add a synthetic **`Environment`** (gradient HDRI built from the scene's own palette) so
  the glass has something on-brand to refract/reflect.

## Post-processing
- **Tune Bloom** — glow on rims/energy only, not the near-black substrate.
- **Keep chromatic aberration** — whisper-low, for holographic edge shimmer.
- **Drop scanlines.**
- **Drop glitch.**
- **Keep grain + vignette.**
- Net: clean & dreamy, matching the mockup.

## Fallbacks & Guardrails
- **Mobile / low GPU:** simplify later — cut transmission (most expensive pass), drop
  postprocessing, lower DPR, fall back toward the static poster. Gated via existing
  `useGPUTier`.
- **Reduced motion:** freeze to a posed static frame; gentlest scroll response only.
- **Hygiene:** deterministic seeding (no hydration mismatch), `useFrame` uniform discipline
  (no setState in frame loop), correct color space on the core texture (sRGB).

---

## Build Order
1. Scaffold the layered scene (perspective camera, environment, fixed-canvas + scroll wiring).
2. **Distorted orb** (real 3D carousel + per-sphere rim material) — the centerpiece.
3. **Flame chain** (procedural 2D metaball pulse).
4. **Glass sphere + pills** (transmission + animated core + scroll morph).
5. Post-processing tune + cursor parallax.
6. Reduced-motion + mobile fallback pass.

---

## Stack Notes (from `research/tech-stack-recommendation.md`)
- R3F v9 + drei (`MeshTransmissionMaterial`, `MeshPhysicalMaterial.iridescence`,
  `Environment`) + `@react-three/postprocessing`.
- GSAP 3.13 ScrollTrigger + Lenis for scroll-driven uniforms.
- Existing: `dynamic(..., { ssr:false })` + `HeroPoster` LCP placeholder, `useGPUTier`.
