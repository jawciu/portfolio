---
name: glass-design
description: Build liquid-glass / glassmorphism surfaces for the portfolio — frosted sheets over the WebGL hero, circular glass-lens images with dissolving orb edges, rim reflection arcs with glints, and scroll-driven specular motion (GSAP). Use when making anything look like glass, adding shine/reflections/vignettes, frosting content over the hero canvas, or when Caroline mentions glass, shine, glints, reflections, or Apple Liquid Glass.
license: Proprietary
metadata:
  project: portfolio
  applied-in: components/sections/About.tsx, app/page.tsx
---

# Glass Design — the portfolio glass playbook

Everything here was built and calibrated on the About section (glass sheet +
portrait lens), 2026-06-09/10. Live reference implementation:
`components/sections/About.tsx`. Exact CSS recipes: [REFERENCE.md](REFERENCE.md).

## The five principles (research + what survived Caroline's review)

1. **Glass is specular, not just blurred.** `backdrop-blur` alone reads matte.
   Real glass needs a light story: a rim glint (NOT a uniform border — a
   gradient that peaks where light hits), a light pool bleeding from the rim,
   and a diagonal sheen. Apple's Liquid Glass signature is that these
   highlights **move with motion** — on the web, scroll stands in for tilt.
2. **Highlights have asymmetric edges.** Apple Icon Composer: "crisp specular
   highlights preserve contrast at the edges". Every reflection band gets a
   long soft ramp on the inside (light dispersing into the glass) and a much
   tighter falloff at the outer radius. Never put a uniform CSS `blur()` on a
   reflection — softness lives in the gradient stops, blur kills the crisp edge.
3. **`circle closest-side`, always.** Radial gradients and masks default to
   `farthest-corner`, which keeps partial opacity into the square corners of
   the element's box → ghost squares around circular work. Size every radial
   gradient/mask on circular surfaces with `circle closest-side`.
4. **Dissolved edges need content smear, not just alpha fade.** An alpha-fade
   rim still reads as a soft *ring*. For orb-style edges the image content
   must bleed outward: inset the image (padding), drop the `overflow-hidden`
   clip, and let a blurred copy smear past the image edge before the outer
   mask dissolves it. (Masks clip child overflow, so layers can't escape.)
5. **Calibrate restrained.** Caroline's reviewed taste: subject stays sharp
   (blur is rim-only), borders are hairline (~1px) with strong light/dark
   contrast around the circumference, ONE glint (off-centre, on an arc — not
   dead-centre), shadow arcs are easy to overdo. "No sharp edge" ≠ soft focus.

## Recipes (full CSS in REFERENCE.md)

- **Glass sheet over the hero** — frosted plate whose gradient lands on solid
  `bg` so opaque sections join seamlessly; rim glint + pool + 115° sheen.
- **Glass lens image** — circular cut-out PNG: blur vignette, dark vignette,
  whole-disc dissolve mask, hairline conic ring (sibling, outside the mask).
- **Rim reflection arcs** — annular radial band × conic-gradient arc mask;
  light and dark variants; glint hotspot nested inside an arc layer.
- **Scroll motion** — scrubbed ScrollTriggers (`useGSAP` + `gsap.matchMedia`
  reduced-motion guard) ROTATE arc layers at different rates/directions.
  Gotcha: rotation over the section's full transit is invisible while the
  element is on screen — use wide ranges (±75°+) or tighter trigger ranges.

## Iteration loop

Screenshot with the Playwright MCP tools against http://localhost:3000, crop
to the glass element with `sips`, and judge: Is there any traceable square or
ring? Does the subject stay sharp? Does the highlight read as light, not as a
border? Then check motion by screenshotting two scroll positions — the
reflections must land in visibly different angular positions.
