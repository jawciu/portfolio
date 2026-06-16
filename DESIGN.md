---
version: alpha
name: Holographic Dark
description: >
  Caroline Jaworsky's portfolio. A moody, near-black canvas with a live WebGL
  hero — a watercolour metaball "orb" and a fireball "firewall" — fronted by
  liquid-glass surfaces and terminal-flavoured mono labels.
colors:
  # Surfaces — the page is near-black; bg matches the hero canvas clear colour
  # so the fixed WebGL layer and the DOM plate read as one continuous dark.
  # (settled 2026-06-16; superseded #050507)
  bg: "#070709"
  bg-elev: "#0a0a0d"
  # Foreground
  fg: "#f5f5f5"
  fg-muted: "#8a8a92"
  # Accents — used sparingly, as signal not decoration
  accent-cyan: "#00d4ff"
  accent-magenta: "#ff006e"
  accent-amber: "#ffaa00"
  # Spectrum — the holographic source palette, lifted verbatim from the hero
  # shaders. These are NOT UI colours; they live in the orb/fireball and bleed
  # through glass as diffuse light. Section colour-pools sample from here.
  flame-1: "#FF8858"
  flame-2: "#F56267"
  flame-3: "#E560FA"
  flame-4: "#793CEA"
  flame-5: "#2835A8"
  orb-1: "#ff2f7e"
  orb-2: "#ff8526"
  orb-3: "#ffcf52"
  orb-4: "#3fc4ad"
  orb-5: "#bdeed9"
typography:
  # Iosevka Charon — the signature voice. Headlines, project titles, hero intro.
  hero-display:
    fontFamily: Iosevka Charon
    fontSize: 68px      # clamp(2rem, 5.2vw, 4.25rem)
    fontWeight: "700"
    lineHeight: 1.02
    letterSpacing: -0.02em
  hero-intro:
    fontFamily: Iosevka Charon
    fontSize: 36px      # text-2xl → md:text-4xl
    fontWeight: "900"
    lineHeight: 1.1
  project-title:
    fontFamily: Iosevka Charon
    fontSize: 36px      # text-2xl → md:text-4xl, uppercase
    fontWeight: "700"
    lineHeight: 1.02
    letterSpacing: -0.01em
  # Geist — body copy. The only sans on the page; calm against the noise.
  body-lg:
    fontFamily: Geist
    fontSize: 20px      # text-lg → md:text-xl
    fontWeight: "400"
    lineHeight: 1.625
  # Geist Mono — the "terminal" voice. Labels, role line, telemetry, metadata.
  label-mono:
    fontFamily: Geist Mono
    fontSize: 16px      # text-sm → md:text-base
    fontWeight: "400"
    lineHeight: 1
    letterSpacing: 0.25em
  label-sm:
    fontFamily: Geist Mono
    fontSize: 14px      # text-xs → md:text-sm
    fontWeight: "400"
    lineHeight: 1.5
    letterSpacing: 0.2em
  caption-mono:
    fontFamily: Geist Mono
    fontSize: 11px      # text-[10px] / text-[11px]
    fontWeight: "400"
    lineHeight: 1
    letterSpacing: 0.25em
rounded:
  md: 0.375rem      # rounded-md — mono chips
  card: 1.5rem      # rounded-3xl — showcase glass cards
  sheet: 2.5rem     # rounded-t-[2.5rem] — the About glass sheet's top
  full: 9999px      # orb lenses, dots, square markers
spacing:
  base: 8px
  section-y: 11rem      # py-44 — vertical breathing room between sections
  card-gap: 0.75rem     # gap-3 — separation between showcase glass panels
  content-max: 80rem    # max-w-7xl — main content column
  content-max-wide: 88rem  # 2xl:max-w-[88rem]
components:
  glass-sheet:            # the About surface — frosts the hero through it
    backgroundColor: rgba(7, 7, 9, 0.5)
    textColor: "{colors.fg}"
    rounded: "{rounded.sheet}"
    backdropFilter: blur(40px) saturate(1.5)
  glass-card:             # showcase bento cell
    backgroundColor: rgba(255, 255, 255, 0.04)
    textColor: "{colors.fg}"
    rounded: "{rounded.card}"
    borderColor: rgba(255, 255, 255, 0.1)
    backdropFilter: blur(24px) saturate(1.5)
  project-card:           # showcase project card — glass-card + split layout + corner blob
    surface: glass-card           # built on the glass-card stack (rim glint + 115° sheen)
    rounded: "{rounded.card}"
    padding: 2.25rem              # p-9 desktop / p-6 mobile
    splitRatio: "50/50"           # copy column / product-visual column (when an image is present)
    kicker: "{typography.label-sm}"        # mono directory label, e.g. /e.on_next
    titleSize: 28px               # project-title voice (Iosevka, uppercase) sized to two lines
    subtitle: "{typography.caption-mono}"  # lowercase mono, full-fg colour
    tags: "{typography.caption-mono}"      # one line, dot-separated
    blob: "radial-gradient(circle 820px at 98% 112%, <core> 0%, <edge> 48%, <edge>00 80%)"
    blobCollapsedOpacity: 0.95    # the dim vertical spine wisp when the card is collapsed
  label:                  # /about, ~/caro/portfolio/2026, role line
    textColor: rgba(245, 245, 245, 0.7)
    typography: "{typography.label-sm}"
  marker-square:          # the small solid square that prefixes mono labels
    backgroundColor: rgba(245, 245, 245, 0.6)
    size: 8px
  separator:              # the magenta "/" between directory-style words
    textColor: "{colors.accent-magenta}"
---

# Holographic Dark — Portfolio Design System

## Brand & Style

This is the personal portfolio of a product designer who also builds with AI —
the site has to read as both *crafted* and *technical*. The mood is a moody
graphic-designer dark: a near-black canvas with diffuse, light, holographic
imagery floating in it. Nothing is flat or boxy by default; the signature
texture is **soft, dissolving edges** — the watercolour orb, the fireball, and
glass surfaces all melt into the dark rather than sitting on hard rectangles.

Two voices run in counterpoint. The **expressive** voice is Iosevka Charon set
big — headlines and project titles, condensed and confident. The **technical**
voice is Geist Mono in small, wide-tracked uppercase labels — a terminal/HUD
language (`~/caro/portfolio/2026`, live render telemetry, `/about`) that signals
the "AI builder" half without shouting. Body copy is calm Geist, the still point
between them.

The emotional target: premium, a little nocturnal, quietly nerdy. A visitor
should feel they're looking at something hand-tuned, with live light moving
under glass.

## Colors

The palette is **near-black + light foreground + a holographic spectrum that
lives in light, not in fills.** UI chrome is almost entirely monochrome; colour
enters the page as *emitted light* from the WebGL hero and the section
colour-pools, seen through or behind glass.

- **Surfaces (`bg #070709`, `bg-elev #0a0a0d`):** A single near-black. `bg`
  deliberately matches the hero canvas clear colour so the fixed WebGL layer and
  the scrolling DOM plate are seamless — any mismatch shows as a Mach-band seam
  at a section edge.
- **Foreground (`fg #f5f5f5`, `fg-muted #8a8a92`):** Off-white for content;
  muted slate for metadata and de-emphasised labels. Most text is set at an
  alpha of `fg` (e.g. `text-fg/70`, `/85`, `/90`) rather than a second grey.
- **Accents (`cyan`, `magenta`, `amber`):** Used as *signal*, not decoration —
  the magenta `/` directory separator, the selection highlight (cyan). Never
  large fills.
- **Spectrum (`flame-*`, `orb-*`):** The holographic source palette, taken
  verbatim from the hero shaders (fireball flame ramp + DistortedOrb bands).
  These never appear as solid UI colour. They are the colour of the *light* —
  the orb, the fireball, and the diffuse radial pools behind glass cards all
  draw from this set, dying to transparent before any edge becomes a rectangle.

## Typography

Three families, each with a clear job. Never reach past these.

- **Iosevka Charon (`hero-display`, `hero-intro`, `project-title`)** — the
  brand's face. Self-hosted (400/700). Set large, uppercase or condensed, tight
  tracking. This is the only display type; project titles inherit the hero
  headline's exact voice so the page feels authored by one hand.
- **Geist (`body-lg`)** — the body sans. Calm, neutral, `leading-relaxed`. The
  About bio is its main home. Keep it Geist — mono was tried here and read too
  code-y for prose.
- **Geist Mono (`label-mono`, `label-sm`, `caption-mono`)** — the technical
  voice. Always small, uppercase, wide letter-spacing (`0.2em`–`0.25em`).
  Carries every label, the role line, the path label, telemetry, and project
  metadata. Two label sizes must stay matched: the top-left path label and the
  `/about` section label are deliberately the *same* size.

Bricolage Grotesque (`font-display`) is loaded but currently dormant — it only
appears in archived/commented showcase variants. Treat the live system as three
families.

## Layout & Spacing

A single centred content column over a full-bleed dark canvas.

- **Rhythm:** 8px base. Sections breathe with large vertical padding
  (`~11rem`); the hero is full-viewport with the live canvas fixed behind.
- **Column:** `max-w-7xl` (80rem), widening to `88rem` on very large screens.
- **Stacking:** The WebGL hero is a *fixed* layer at `z-0`. All DOM sections sit
  on a `relative z-10` plate above it. Glass surfaces (About) let the fixed
  canvas frost through; opaque sections sit on a `bg-bg` plate. Mind the seam:
  use `-mt-px` where an opaque plate meets the bright canvas to kill sub-pixel
  hairlines at fractional DPR.
- **Showcase:** the project bento is a flex row of glass cards with a small
  `gap-3` so cards read as separate panels, one expanding on hover/focus.

## Elevation & Depth

Depth comes from **glass and light**, not drop-shadows. There is essentially no
box-shadow vocabulary; hierarchy is built from blur, translucency, and emitted
light.

- **The glass stack:** a surface is a translucent gradient fill + `backdrop-blur`
  (sheets ~40px, cards ~24px) + `backdrop-saturate-150`, over the live hero or a
  section's colour-pool. The pool glows *through/behind* the glass.
- **Edge as light, not line:** every glass surface is defined by a *specular
  story*, not a border — a bright hairline rim that peaks as a glint (not an even
  line), a soft light pool bleeding down from it, and a ~115° diagonal sheen
  sweep (`mix-blend-screen`). Borders, where present, are `white/10` hairlines.
- **Dissolving edges (signature):** imagery (the portrait, section pools) must
  *melt* into the dark — radial alpha masks (`circle closest-side`) fade content
  to transparent before any rectangular extent is readable. Keep the *subject*
  crisp; blur the *rim* only. "No sharp edge" ≠ "soft-focus."
- **Live specular motion:** glints and rim arcs move on scroll (scroll stands in
  for device tilt, à la Apple Liquid Glass) — GSAP-scrubbed rotations on the
  portrait arcs, a CSS-var rotation on the toolkit dock rims. Always
  reduced-motion-safe.

## Shapes

Soft, never sharp — but not bubbly. Radii are large and deliberate.

- **Cards:** `rounded-3xl` (1.5rem) for showcase panels.
- **Sheets:** the About glass sheet curves its top at `2.5rem`.
- **Circles (`full`):** the portrait lens, toolkit dock tiles (squircles),
  carousel dots, and the small solid square markers that prefix mono labels.
- **Chips:** `rounded-md` for mono tag chips.
- Above all, the dominant "shape" is the **edgeless blob** — orb/fireball/pool
  forms with no readable boundary at all. Prefer dissolving a shape to bordering
  it.

## Components

### Glass surfaces (`glass-sheet`, `glass-card`)

The core building block. A translucent gradient + backdrop blur/saturate, with a
specular rim (glint hairline → light pool → diagonal sheen). The About section is
a single sheet that frosts the hero; showcase cards are discrete glass panels
with the colour-pool glowing behind. Verify body text stays legible over the
*brightest* part of the orb glow.

### Project card (`project-card`)

The reusable showcase card (`components/sections/prototype/ProjectCard.tsx`) — one
flex cell in the bento row, built on the `glass-card` stack. It has two states and,
when expanded, one split layout, so every real project reads as one authored piece:

- **Collapsed:** a narrow cell showing a dim, centred **vertical spine** of the
  card's blob colours (`blobCollapsedOpacity` 0.95) with a rotated mono label
  (`company · year`). On hover/focus it expands (`flex-grow`, 700ms ease-out).
- **Expanded — split layout:** copy on the **left**, an optional product visual on
  the **right**, over a **corner gradient blob**. The blob is one big blurred circle
  whose centre sits just *outside* the bottom-right corner, so only a quarter blooms
  in — a warm `<core>` diffusing to a cool `<edge>` and then to transparent before
  any rectangle reads (same "dissolving edge" rule as the hero). Each card supplies
  its own `{core, edge}` pair; draw them from the spectrum where possible. The E.ON
  Next card uses coral `#C05846` → purple `#6D1B76`.
- **Copy column:** `year` in the top-left corner; a centred block (nudged a touch
  above middle) of optional brand logo + mono kicker (`/e.on_next`), the
  `project-title` (Iosevka, uppercase, sized to land in two lines), and a lowercase
  **mono** subtitle at full `fg`; tags pinned bottom-left as one dot-separated mono
  line. The subtitle is the one place mono carries a sentence — kept short.
- **Product visual:** transparent artwork (e.g. a frosted UI panel) floating over
  the blob, bleeding slightly off the right edge — no frame, border, or shadow, so
  the gradient reads straight through it.
- The card's shine is **static** here (rim glint + diagonal sheen) — the scroll-
  driven specular motion lives on the toolkit dock and the About portrait, not the
  cards.

Placeholder cells (projects without a story/visual yet) use a simpler centred
layout on the same glass + pool blob; migrate each to `ProjectCard` as it gets real
content and a product visual.

### Mono labels (`label`, `caption-mono`)

Small Geist Mono, uppercase, wide-tracked, usually prefixed by an 8px solid
`marker-square` or routed with a magenta `/` `separator` (directory language:
`~/caro/portfolio/2026`, `/about`, `/toolkit`, `/e.on_next`). This is the HUD
voice — telemetry, years, roles, tags all live here.

### Toolkit dock

A full-bleed glass strip carrying a slow marquee of squircle program icons —
an OS-dock metaphor. Apple liquid-glass tiles: face sheen + a conic rim shine
whose two bright arcs sweep on scroll. The strip and its icons dissolve into the
dark at both screen ends via one horizontal mask.

### Hero (orb + fireball)

The watercolour metaball orb row and the fireball "firewall" backdrop are
siblings built from the same primitives (gaussian colour bands, value noise,
polynomial smooth-union, masked reveals). They react to the cursor as a
mouse-driven *unmask* (reveal more of each form), not positional drift. Tuned via
the screenshot iteration loop. See the `orb-firewall-tuning` skill.

## Do's and Don'ts

- **Do** keep colour in the *light* (orb, fireball, pools seen through glass) and
  keep UI chrome monochrome. Accents are signal, never decoration.
- **Do** dissolve edges — fade imagery and pools to transparent with radial masks
  before any rectangle is readable. Keep the subject crisp, blur the rim only.
- **Do** define glass by its specular story (glint + pool + sheen), not by a
  visible border.
- **Do** match `bg` to the hero canvas clear colour, and watch every section
  junction for seams (Mach bands, sub-pixel hairlines).
- **Do** keep the three font jobs separate: Iosevka = display, Geist = body,
  Geist Mono = labels/HUD.
- **Don't** put body copy in mono, or labels in anything but mono.
- **Don't** add drop-shadows to build depth — use blur, translucency, and light.
- **Don't** introduce a new accent colour or a fourth font without a decision
  logged in `CLAUDE.md`.
- **Don't** let any motion run without a `prefers-reduced-motion` fallback.
- **Don't** trust the `globals.css` source after editing the `@theme` block — it
  doesn't hot-reload; `touch` it and verify the computed `--color-bg` in-browser.
