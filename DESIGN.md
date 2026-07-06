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
  # Case-study template colours — the light sub-theme (scoped to .cog-root /
  # components/project/<slug>/theme.css). Reusable across every case study.
  cs-bg: "#f5f4ef"            # page cream (--cog-bg)
  cs-bg-section: "#f7f7f4"    # shared section bg from "current therapy process" onward (--cog-bg-section)
  cs-green: "#19a072"         # TEMPLATE green — dividers / rules / callout left-rule (--green)
  cs-dark-green: "#006b4b"    # TEMPLATE dark green — emphasised labels e.g. persona name (--dark-green)
  cs-soft-ink: "#4a4a4a"      # soft body-copy ink (--soft-ink)
  cs-card-border: "#f1f0ea"   # InsightCard hairline border
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
  # Case-study template — reusable across EVERY case-study page (a light sub-theme,
  # scoped to the `.case-study-*` classes in components/project/<slug>/theme.css).
  # Iosevka, uppercase. Charon ships no 800/900, so "extra bold" is faked by
  # stroking the 700 glyphs in the text colour (text-stroke). Manual line breaks.
  case-study-title:            # the page H1 at the top of a case study
    fontFamily: Iosevka Charon
    fontSize: 48px      # desktop; 32px at ≤640px (raised from 22px 2026-07-06)
    fontWeight: "700"   # + -webkit-text-stroke 0.6px (0.35px mobile) = faux extra-bold
    lineHeight: 1.08
    letterSpacing: -0.02em
  case-study-eyebrows-heading: # small eyebrow ABOVE each section heading (INTERVIEWS, …)
    fontFamily: Geist        # sans (was Geist Mono)
    fontSize: 13px
    fontWeight: "700"   # bolder than the old 600
    letterSpacing: 0.18em
    textTransform: uppercase   # always all-caps regardless of markup casing
    color: var(--cog-ink)   # same ink as the heading; reads as one stacked unit
    marginBottom: 0.75rem   # BAKES the consistent eyebrow→heading gap (12px) into the template
  case-study-section-heading:  # each section's heading (MY ROLE, INTERVIEWS, …)
    fontFamily: Iosevka Charon
    fontSize: 36px      # clamp(1.75rem, 1rem + 2vw, 2.25rem); 28px floor (raised from 24px 2026-07-06, Caroline: bigger on phones)
    fontWeight: "700"   # + -webkit-text-stroke 0.6px (0.4px ≤640px) = SAME faux extra-bold as the title
    lineHeight: 1.08
    letterSpacing: -0.01em   # max 2 lines via manual <br/> in the markup
    marginBottom: 3rem  # BAKES the consistent heading→content gap (48px) into the template
  case-study-hero-label:       # mono labels in the hero meta block (brand / role / …)
    fontFamily: Geist Mono
    fontSize: 16px
    fontWeight: "800"   # true extra-bold — Geist Mono is a variable font (no stroke)
    letterSpacing: 0.02em
  case-study-label:            # bold inline content label (MY ROLE steps: research / synthesis / …)
    fontFamily: Geist Mono
    fontSize: 16px      # same size + weight as case-study-hero-label
    fontWeight: "800"
    letterSpacing: 0.02em
    textTransform: lowercase   # ALWAYS lower-case, no caps
    color: var(--cog-ink)
  case-study-body-md:          # default reading size for case-study body copy
    fontFamily: Geist
    fontSize: 16px
    lineHeight: 1.4
    color: var(--soft-ink)   # #4a4a4a — soft body ink (template token)
  case-study-callout:          # left-ruled statement / pull-quote
    fontFamily: Geist Mono
    fontSize: 28px      # 22px at ≤640px (mobile)
    lineHeight: 1.2
    color: var(--soft-ink)   # #4a4a4a — light ink
    borderLeft: 2px solid #19a072   # green rule
  case-study-quote:            # italic quotes / question prompts (.case-study-quote)
    fontFamily: Geist
    fontStyle: italic
    fontSize: 15px
    lineHeight: 1.5
    color: var(--cog-ink)
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
  label-inset: 0.5rem   # pl-2 — directory section labels' nudge inside the column
  # Case-study section rhythm — TOP-ONLY padding so each heading gets exactly this
  # much of its OWN background above it (every section: pt-[120px] pb-0). The gap
  # before EVERY section heading is therefore a uniform 120px. Two exceptions below.
  cs-section-gap: 120px
  cs-section-gap-tight: 88px     # ONLY the MyRole heading (glass-plate top → heading); see exceptions
  cs-hero-screens-below: 120px   # gap below the hero device mockups (Hero Container pb)
  cs-bg-change-gap: 120px        # added on BOTH sides at the cream→section bg change (BookingDropoff pb + JourneyMap pt = 240px total)
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
  insight-card:           # reusable case-study card (Findings insights, Methodology problems)
    component: InsightCard        # components/project/<slug>/ui.tsx
    size: "420×320px default"     # optional width/height props (e.g. 380×260 for Methodology) — inline style, max-w-full
    rounded: 1rem                 # rounded-2xl
    backgroundColor: "#fafafa"
    borderColor: "{colors.cs-card-border}"   # #f1f0ea hairline
    padding: 2.25rem              # px-9 py-8
    label: "{typography.case-study-hero-label}"  # mono ALL-CAPS 15px bold (e.g. INSIGHT #01 / PROBLEM #01)
    title: "{typography.case-study-label}"       # Geist Mono 16px/800 lowercase
    divider: "1px solid {colors.cs-green}"       # green #19a072 rule under the title
    body: "{typography.case-study-body-md}"
  testimonial-bubble:     # reusable case-study quote cloud (Results testimonials)
    component: TestimonialBubble  # components/project/<slug>/ui.tsx
    art: "cloud PNG asset, tail bottom-left or -right; width prop in px (aspect ratio preserved)"
    flip: "bool — mirrors the art (-scale-x-100) so the tail sits on the opposite side; text is never mirrored"
    quote: { fontFamily: Geist, fontSize: 15px, style: italic, color: "{colors.cs-ink}" }
    attribution: { fontFamily: Geist, fontSize: 14px, align: right, color: "{colors.cs-muted}" }
    textBox: "absolute inset-0, justify-center, px-[10%] pt-[2%] pb-[10%] — keeps copy in the body, above the tail"
    layout: "scatter several into a staggered zigzag (two flex columns, one offset down with pt-*); center the paired visual with items-center on the row"
  case-study-glass-seam:  # ties a case study to the homepage — content plate RISES over a pinned hero
    heroPin: "sticky, top = -(heroHeight - viewportHeight)"  # measured in StickyHero.tsx; the hero (taller than the viewport) scrolls up until the device mockups are FULLY visible, THEN pins, so the plate rises over it only after the assets are seen
    overlap: 0                    # plate sits just below the hero (no -mt) so it enters the instant the hero pins, then rises on scroll
    dwellSpace: "h-[34vh] spacer INSIDE StickyHero, AFTER <Hero />"  # transparent (shows the page bg) cream/near-white room below the mockups; lifts them off the screen bottom so the glass rises THROUGH this empty space FIRST, holding the mockups in full view while it climbs toward them. DO NOT use a separate transparent buffer AFTER the hero — that leaves the screen FROZEN (hero pinned + glass not yet entered) which reads as "end of page". Put the dwell space INSIDE the pinned hero so the motion stays continuous. Tune the height = how long the visuals dwell before the glass covers.
    rounded: "{rounded.sheet}"    # rounded-t-[2.5rem], echoes the About sheet
    backdropFilter: blur(40px) saturate(1.5)   # backdrop-blur-2xl backdrop-saturate-150
    shadow: "0 -24px 60px -20px rgba(40,34,20,0.18)"  # soft shadow UNDER the plate's top edge — floating-glass depth
    background: "linear-gradient(180deg, rgba(206,201,186,0.62) 0px, rgba(222,217,204,0.7) 60px, rgba(238,235,227,0.9) 125px, rgba(245,244,239,0.98) 165px, #f5f4ef 185px)"  # frosted top tinted DARKER than cream (visible glass edge), FAST fade to solid cream (~185px) so copy never reads over frost
    rimGlint: "linear-gradient(90deg, transparent, rgba(255,255,255,0.85) 22%, rgba(255,255,255,0.35) 50%, rgba(255,255,255,0.7) 78%, transparent)"  # soft bright hairline along the top edge
    spacingException: "120px below the hero device screens (Hero Container pb); 88px from the glass-plate top to the MyRole heading (MyRole pt-[88px], the one tighter section)"
  footer:                 # global site footer — dark plate closing every route (home + case studies)
    backgroundColor: "{colors.bg}"     # always dark, even on light case studies (mounted outside .cog-root)
    borderTop: rgba(245, 245, 245, 0.1)
    heading: "Let's Connect"           # font-mono uppercase bold, 36px desktop / text-2xl mobile
    body: "{typography.case-study-body-md}"  # --soft-ink overridden to rgba(245,245,245,0.72) for the dark surface
    reachLabel: { fontFamily: Geist, fontSize: 16px, fontWeight: "700" }
    icons: linkedin + email           # white marks (LinkedIn "in" knocked out via evenodd), no bg/border, hover:bg-fg/10
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

**Case-study template** (`case-study-title`, `case-study-section-heading`): case
studies are a light sub-theme but keep the same display voice — Iosevka, uppercase.
The page H1 is **48px desktop / 32px mobile** (≤640px); section headings use the
`clamp(1.75rem→2.25rem)` ramp (**36px** desktop, 28px floor). Both are set at weight
700 and pushed to "extra bold" by stroking the glyphs in the text colour
(`-webkit-text-stroke`: title 0.6px / 0.35px mobile, section heading 0.6px / 0.4px
mobile — the SAME faux-bold treatment) — Charon ships no 800/900 cut, so this is how
we get a heavier display weight without swapping the typeface. Both the title and
section headings break to a **max of 2 lines via manual `<br/>`** in the markup (3 is
fine on mobile). The small all-caps **eyebrow** above each section heading
(`case-study-eyebrows-heading`: **Geist** sans, **13px, weight 700**, letter-spacing
0.18em, `text-transform: uppercase`) is coloured with the heading ink `--cog-ink` (NOT
the green accent) so eyebrow + heading read as one stacked unit; it carries a
**`margin-bottom: 0.75rem` (12px)** that BAKES the eyebrow→heading gap into the
template — sections must NOT add their own top margin to the heading, so every gap
stays consistent. The section heading mirrors this with a **`margin-bottom: 3rem`
(48px)** that BAKES the heading→content gap into the template: it collapses with the
following block's top margin (so the gap is a uniform **48px** below every section
heading, regardless of each section's own `mt-*`). Two caveats: (1) sections must not
add a *larger* top margin to their first block (it would win the collapse); (2) when
the class is reused mid-component next to a NON-collapsing sibling (e.g. an
`inline-flex` button, which doesn't margin-collapse), neutralise the baked gap with
`mb-0!` so it doesn't add 48px there (see `NextProject`'s inner h3).
For **Interviews** specifically, the persona mascots overhang the card top by ~32px,
so its card grid uses `mt-20` (80px) to keep a *visible* 48px clear below the heading.
The hero meta labels (brand / summary / setting the stage / role /
time / tools) use `case-study-hero-label` — **16px, weight 800** (a *true* extra-bold
here, since Geist Mono is a variable font, unlike Charon). For **bold inline content
labels** (the MY ROLE steps — research / synthesis / strategy / design) use
`case-study-label` — same Geist Mono 16px/800 as the hero label but **always
lower-case** (`text-transform: lowercase`). All body copy uses `case-study-body-md` —
**Geist, 16px, line-height 1.4**, coloured with the `--soft-ink` template token
(`#4a4a4a`). It's self-contained: don't stack Tailwind `text-*`/`leading-*`/colour
utilities on it (that was the old `cog-body`+`text-sm` clash that silently rendered
15px — `cog-body` has since been DELETED) — apply the class alone so nothing overrides
it. **`case-study-body-md` + `--soft-ink` now live in `app/globals.css` (site-wide
template tokens), not just the cog theme** — so the homepage footer reuses them too.
To re-theme the text on a *dark* surface, override the `--soft-ink` token in that
scope (e.g. the footer sets `--soft-ink: rgba(245,245,245,0.72)`) rather than stacking
a colour utility, keeping the class self-contained. Left-ruled **statements / pull-quotes** use
`case-study-callout` (component `CaseStudyCallout`) — **Geist Mono, 28px / line-height 1.2**
(22px ≤640px), light `--soft-ink`, with a **2px green rule** (`#19a072`) on the left. Like the
other type tokens it's self-contained (apply alone). The older `cog-callout`/`cog-statement`
stay for the dark near-black mono quotes used elsewhere. Italic **quotes and question
prompts** use `case-study-quote` — **Geist italic, 15px / line-height 1.5**, `--cog-ink`
(the affinity-board post-its and the Solution question prompts share it). Genuinely-small captions (thought-bubble text, legends) use explicit `text-[13px]`
/`text-sm` utilities directly (Geist is inherited from `.cog-root`). These live in each case
study's `theme.css` as `.case-study-*` classes so they're reused verbatim across
every case-study page.

**InsightCard** (`components/project/<slug>/ui.tsx`, component `<InsightCard label title>…children>`)
is the reusable insight/problem card — a light `#fafafa` card, `rounded-2xl`, `cs-card-border`
(`#f1f0ea`) hairline, `px-9 py-8`, **420×320 by default** with optional `width`/`height`
props (e.g. **380×260** in Methodology; applied via inline `style` since Tailwind can't
build arbitrary px from runtime values, with `max-w-full` kept as a class). Inside: a mono
**ALL-CAPS** label (Geist Mono 15px bold — `INSIGHT #01` / `PROBLEM #01`), a `case-study-label`
title, a **green `cs-green` (`#19a072`) divider**, then `case-study-body-md` copy. Lay cards out
in a centred `flex flex-wrap justify-center gap-9`; a row of three 380px cards needs a wider band
than the 1080 column (`max-w-[1280px] px-6`) to stay single-row.

**Persona name** (journey-map / solution persona, e.g. "Katherine Bell") is Geist **bold** in
`cs-dark-green` (`#006b4b`); its role line and quote sit beneath, the quote `italic`.

**TestimonialBubble** (`components/project/<slug>/ui.tsx`, `<TestimonialBubble asset quote who
width flip />`) is the reusable quote cloud — a cloud PNG with the **italic** quote (Geist 15px,
`cs-ink`) and a **muted, right-aligned** attribution (Geist 14px, `cs-muted`) centred in the body
**above the tail** (`px-[10%] pt-[2%] pb-[10%]`). `width` is explicit px (aspect ratio preserved);
`flip` mirrors the art (`-scale-x-100`) so the tail points the other way (text stays unmirrored).
Scatter several into a **staggered zigzag** — two flex columns, one dropped with `pt-*` — and
**vertically centre a paired visual** (e.g. the Results phone clip) against the cluster with
`items-center` on the grid row (the cluster's bbox centre = the visual's centre). The bubble assets
ship with **mixed tail sides**, so check each PNG before deciding `flip`. A reused screen-recording
clip is a plain `<video autoPlay loop muted playsInline>` (no device frame needed if it's baked in).

## Layout & Spacing

A single centred content column over a full-bleed dark canvas.

- **Rhythm:** 8px base. Sections breathe with large vertical padding
  (`~11rem`); the hero is full-viewport with the live canvas fixed behind.
- **Column:** `max-w-7xl` (80rem), widening to `88rem` on very large screens.
- **Full-bleed image row (crop, don't shrink):** for a wide artwork row that should
  fill the screen on big displays (e.g. Methodology's exploratory sketches), use a
  centred `flex` capped at `max-w-[1800px]` with the children at a **fixed px width +
  `flex-none`** above a breakpoint and `overflow-hidden` on the row — so as the
  viewport narrows the frames hold size and the outer ones get **cropped by the edges**
  rather than scaling down. Below the breakpoint (`min-[1200px]:` off) switch the
  children to `flex-1` so they start shrinking to stay usable.
- **Section labels share the column:** the directory-style section labels
  (`/about`, `/toolkit`, `/projects`) all sit in the *same* content-column
  geometry — a full-bleed `px-8 md:px-12` box → centred `max-w-7xl` (→ `88rem` at
  `2xl`) → `label-inset` (`pl-2`) — so they share one left edge and line up
  vertically down the page at every width. Each label stays above its own content
  (e.g. `/projects` flush with the project cards). Don't give one a different
  `max-w` or breakpoint, or the column drifts and the labels stop aligning.
- **Stacking:** The WebGL hero is a *fixed* layer at `z-0`. All DOM sections sit
  on a `relative z-10` plate above it. Glass surfaces (About) let the fixed
  canvas frost through; opaque sections sit on a `bg-bg` plate. Mind the seam:
  use `-mt-px` where an opaque plate meets the bright canvas to kill sub-pixel
  hairlines at fractional DPR.
- **Showcase:** the project bento is a flex row of glass cards with a small
  `gap-3` so cards read as separate panels, one expanding on hover/focus.

**Case-study section rhythm.** Every case-study section gets a uniform **120px
before its heading**, implemented as **top-only padding** (each `<section>` is
`pt-[120px] pb-0`; NextProject's heading Container is `pt-[120px]`). Top-only (not a
symmetric `py-[44px]` split) is deliberate: each heading gets exactly 120px of its
*own* background above it — the gap is precise and independent of the neighbour — and
the `pb-0` boundaries are invisible because adjacent section backgrounds are
near-identical (cream `cs-bg` `#f5f4ef` vs `cs-bg-section` `#f7f7f4`). The dial is the
single `pt-[120px]` per section file (13 spots). **Two intentional exceptions:**
(1) **MyRole / glass seam** — the hero device mockups get **120px below** them (Hero
Container `pb-[120px]`), and MyRole alone uses **`pt-[88px]`** (glass-plate top →
heading) so its heading clears the frosted glass top without feeling far; (2) **the
cream→section background change** (BookingDropoff → JourneyMap) gets **120px on BOTH
sides** (BookingDropoff `pb-[120px]` + JourneyMap `pt-[120px]` = **240px** total) for
extra breathing room where the colour shifts. Every other boundary stays at 120px.

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
  Next card uses coral `#C05846` → purple `#6D1B76`; the cog_adhd card uses amber
  `#F2922E` → green `#189E71` (the warm-to-green echoes that app's own UI). Optional
  `coreStop`/`edgeStop` (radius %) tune how far the warm core holds before the edge
  takes over — cog_adhd uses `coreStop 20 / edgeStop 66`: amber holds to ~20% then
  blends across a WIDE 20→66 band for a soft amber→green transition. The blob's outer
  silhouette is unchanged (the `edge00` fade always completes at 80%); widen the
  transition by raising `edgeStop`, grow the amber by raising `coreStop`. A third
  optional stop, `fadeStop` (default 80), is where the green finishes fading to
  transparent — keep it at 80 to hold the blob's outer size; to make the green→black
  step softer WITHOUT growing the blob, pull `edgeStop` inward (the green→transparent
  fade then spans a longer band inside the same 80% footprint, so the dark leaches in
  further). cog_adhd uses `coreStop 30 / edgeStop 50 / fadeStop 80`. Omit all three
  and the original `0 / 48 / 80` ramp applies (E.ON).
- **Copy column:** `year` in the top-left corner; a centred block (nudged a touch
  above middle) of optional brand logo + mono kicker (`/e.on_next`), the
  `project-title` (Iosevka, uppercase, sized to land in two lines), and a lowercase
  **mono** subtitle at full `fg`; tags pinned bottom-left as one dot-separated mono
  line. The subtitle is the one place mono carries a sentence — kept short.
- **Product visual:** transparent artwork (e.g. a frosted UI panel) floating over
  the blob, bleeding slightly off the right edge — no frame, border, or shadow, so
  the gradient reads straight through it. Positioning is overridable per card via
  `imageClassName` (default: centred float off the right edge; the cog_adhd card uses
  a bottom/right-anchored variant so the two phone shots sit flush to the bottom edge
  with the right phone touching the card's right edge).
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
