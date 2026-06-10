# Glass design — exact recipes

All values are the calibrated finals from `components/sections/About.tsx`
(commits `64087cd` → `2146aca`). Copy, then tune the named dials.

## 1. Glass sheet over the fixed hero canvas

The hero `<Canvas>` is `fixed inset-0 z-0`, so any section above it can frost
it with `backdrop-filter`. The sheet's own background must END on solid `bg`
so the opaque sections below join with no seam (they sit in a `bg-bg` wrapper).

```tsx
<section
  className="relative overflow-hidden rounded-t-[2.5rem] backdrop-blur-2xl backdrop-saturate-150"
  style={{
    background:
      "linear-gradient(180deg, rgba(5,5,7,0.38) 0%, rgba(5,5,7,0.66) 55%, #050507 100%)",
  }}
>
```

Dials: first stop alpha = how see-through (lower = clearer glass);
`backdrop-blur-2xl` = frost strength. `backdrop-saturate-150` keeps colours
juicy through the frost (Apple does this too).

### Specular story (three layers, all `aria-hidden` overlays)

```tsx
{/* rim glint — peaks ~18% from the left, NOT a uniform line */}
<div className="pointer-events-none absolute inset-x-0 top-0 h-px" style={{
  background:
    "linear-gradient(90deg, rgba(245,245,245,0.06), rgba(255,255,255,0.55) 18%, rgba(245,245,245,0.18) 42%, rgba(245,245,245,0.08) 70%, rgba(245,245,245,0.03))",
}} />
{/* light pool bleeding down from under the glint */}
<div className="pointer-events-none absolute inset-x-0 top-0 h-44" style={{
  background: "radial-gradient(42% 100% at 18% 0%, rgba(255,255,255,0.10), transparent 70%)",
}} />
{/* diagonal sheen sweep */}
<div className="pointer-events-none absolute inset-0 mix-blend-screen" style={{
  background:
    "linear-gradient(115deg, rgba(255,255,255,0.085) 0%, rgba(255,255,255,0.035) 16%, transparent 30%, transparent 72%, rgba(255,255,255,0.04) 100%)",
}} />
```

## 2. Glass lens image (circular cut-out PNG)

Layer order inside `relative aspect-square` wrapper:

1. **Masked disc container** — holds photo + vignettes; NO `overflow-hidden`
   (the PNG's transparency is the circle; clipping would block edge smear):

```tsx
<div className="relative h-full w-full" style={{
  maskImage:
    "radial-gradient(circle closest-side at 50% 50%, black 40%, rgba(0,0,0,0.6) 62%, rgba(0,0,0,0.2) 84%, transparent 99%)",
}}>
```

2. **Sharp photo** — `<Image fill className="object-contain p-7" />`. The
   `p-7` inset gives the rim blur room to smear outward (key to orb edges).
3. **Blur-vignette copy** — same `<Image>`, `alt=""`, plus:

```tsx
style={{
  filter: "blur(24px) saturate(1.2)",
  maskImage: "radial-gradient(circle closest-side at 50% 50%, transparent 60%, black 88%)",
}}
```

   Dials: blur px; `transparent 60%` = where the melt starts (lower = creeps
   toward the face — Caroline rejected 22–32%; subject must stay sharp).
4. **Dark vignette** — `radial-gradient(circle closest-side at 50% 50%, transparent 52%, rgba(5,5,7,0.55) 100%)`.
5. **Sheen** (115° linear, screen blend) — same as sheet.

### Hairline glass ring — SIBLING of the masked container

The dissolve mask dims rim-radius content to ~0.2 alpha, so the ring (and the
arcs, below) must live OUTSIDE it. Ring = conic gradient × annulus mask:

```tsx
<div className="pointer-events-none absolute inset-7 rounded-full" style={{
  background:
    "conic-gradient(from 180deg, rgba(255,255,255,0.10), rgba(255,255,255,0.02) 30%, rgba(255,255,255,0.90) 62%, rgba(255,255,255,0.04) 85%, rgba(255,255,255,0.10))",
  maskImage:
    "radial-gradient(circle closest-side at 50% 50%, transparent 99.0%, black 99.3%, black 99.8%, transparent 100%)",
}} />
```

`inset-7` matches the photo's `p-7` so the ring sits on the photo edge.
Annulus stops = thickness (~1px here). Conic peak position: peak angle =
`from` + fraction×360 (from 180deg @62% → ≈43°, upper-right = light right,
shadow left). High peak/base contrast (0.90 vs 0.02–0.10) = "reflection, not
border".

## 3. Rim reflection arcs (glass-sphere style)

Annular radial band cut to an arc by a conic mask. ASYMMETRIC edges: soft
inner ramp, tight outer cut (~2.5–3.5% fade — "defined, not knife-cut").

```tsx
const ARCS = [
  { // crown highlight, top
    band: "radial-gradient(circle closest-side at 50% 50%, transparent 62%, rgba(255,255,255,0.05) 76%, rgba(255,255,255,0.17) 89%, rgba(255,255,255,0.22) 92%, transparent 95.5%)",
    sweep: "conic-gradient(from 300deg, transparent 0deg, black 38deg, black 82deg, transparent 120deg, transparent 360deg)",
    fromDeg: -75, toDeg: 75,
  },
  { // crisp arc, lower-right, carries the glint
    band: "radial-gradient(circle closest-side at 50% 50%, transparent 76%, rgba(255,255,255,0.06) 85%, rgba(255,255,255,0.28) 93%, rgba(255,255,255,0.34) 95%, transparent 97.5%)",
    sweep: "conic-gradient(from 75deg, transparent 0deg, black 22deg, black 60deg, transparent 82deg, transparent 360deg)",
    fromDeg: 95, toDeg: -50,
    glint: { left: "91.5%", top: "61%", w: "11%", h: "4.5%", rot: 105, peak: 0.75 },
  },
];
```

- Render at `inset-7 rounded-full` as siblings of the masked disc. NO `filter:
  blur()` on arcs.
- Dark/shadow arcs work the same with `rgba(5,5,7,…)` — but were cut here as
  "too much"; prefer light-only unless asked.
- **Glint** = small bright ellipse NESTED inside an arc layer → it orbits with
  the arc for free. Off-centre placement (right of arc centre). Position on
  the rim at angle θ: `left = 50 + 43·sin(θ) %`, `top = 50 − 43·cos(θ) %`,
  `rotate(θ)` keeps it tangent. One glint only.

## 4. Scroll-driven motion

```tsx
useGSAP(() => {
  const mm = gsap.matchMedia();
  mm.add("(prefers-reduced-motion: no-preference)", () => {
    const st = { trigger: ref.current, start: "top bottom", end: "bottom top", scrub: 0.6 };
    ARCS.forEach((a, i) =>
      gsap.fromTo(arcRefs.current[i], { rotate: a.fromDeg },
        { rotate: a.toDeg, ease: "none", scrollTrigger: st }));
    gsap.fromTo(ringRef.current, { rotate: -60 }, { rotate: 60, ease: "none", scrollTrigger: st });
  });
}, { scope: ref });
```

- Counter-rotate layers (one +, one −, different magnitudes) for depth.
- **Visibility gotcha**: `top bottom → bottom top` spreads rotation over the
  full transit, most of it while the element is off-screen. ±30° was
  invisible; ±75° (crown), 95→−50 (arc), ±60 (ring) reads clearly. Verify by
  screenshotting two scroll positions — angular positions must differ visibly.
- `willChange: "transform"` on every animated layer.

## 5. Square-ghosting checklist (when a circle shows a phantom square)

1. Any radial gradient/mask without `closest-side`? → fix sizing.
2. Any square overlay (sheen/glare/vignette) NOT inside a closest-side-masked
   container? → mask it or clip it circularly.
3. `box-shadow` glows follow the box, not the content — avoid on soft circles.

## Research sources (2026-06-10)

- Apple Newsroom Liquid Glass announcement; Icon Composer docs ("crisp
  specular highlights preserve contrast at the edges"; vertical light from
  above; refraction + reflection mixed).
- imadrahmoune.com/liquid-glass — shader breakdown (normals from SDF edges).
- LogRocket / dev.to CSS recreations — rim stroke + inner glow recipe; all
  static, which is why scroll-driven motion is the differentiator here.
