# CLAUDE.md — Portfolio

Personal portfolio site for **Caroline Jaworsky** (product designer, AI builder). Moody graphic-designer
vibe: dark background, light/holographic diffused imagery. Built for a job hunt.

> This file is the shared brain for every agent session. Keep it current: log progress and important
> decisions as they happen, and leave handoff notes at the end of each session (see **Session Log** at the
> bottom). The behaviour is defined by the global `session-journal` skill.

## Stack

- **Next.js 16** (App Router) · **React 19** · **TypeScript 5**
- **React Three Fiber** (`@react-three/fiber` 9, `drei` 10, `postprocessing` 3) — WebGL hero
- **GSAP 3** (`@gsap/react`) — animation; **Motion 12** — component transitions
- **Lenis 1.3** — smooth scroll
- **Tailwind CSS 4** (CSS-first `@theme` config in `app/globals.css`)
- **Playwright** — used only as a screenshot harness (see Commands), not for tests yet
- **detect-gpu** — GPU tiering for mobile WebGL fallbacks

## Commands

```bash
npm run dev      # next dev — http://localhost:3000
npm run build    # next build
npm run start    # serve production build
npm run lint     # eslint

# Screenshot iteration loop (hero/orb/firewall review). Dev server must be running.
node scripts/shoot.mjs [label]      # captures hero at several scroll positions → screenshots/<label>/
node scripts/shoot-seq.mjs [label]  # sequence capture
node scripts/shoot-clip.mjs [label] # clip capture
```

## Architecture

```
app/
  layout.tsx      # fonts (Iosevka Charon local + Bricolage/Geist/Geist Mono), <Providers>, metadata/SEO
  page.tsx        # home: <Hero> + darkening plate + header/nav + hero copy + #work section
  providers.tsx   # wraps children in <SmoothScroll> (Lenis)
  globals.css     # Tailwind 4 @theme — design tokens (colors + font vars), hero caret keyframes
  fonts/          # self-hosted Iosevka Charon woff2 (400/700) — the hero typeface
components/
  Hero.tsx        # hero entry
  HeroCopy.tsx    # lower-left headline with type-on intro
  TelemetryRail.tsx # right-edge live "render telemetry" HUD (WEBGL2 · TIER · DPR · raw FPS)
  SmoothScroll.tsx# Lenis wrapper
  Marquee.tsx     # reusable seamless infinite marquee (2 copies + -50% keyframe)
  hero/
    Scene.tsx       # R3F canvas + scene graph
    DistortedOrb.tsx# the "watercolour metaball" orb (gaussian colour bands, value noise, smooth-union)
    Backdrop.tsx    # the Firewall / fireball backdrop (sibling of the orb, same primitives)
    Effects.tsx     # postprocessing pipeline (bloom / chromatic aberration / glitch)
    GlassRail.tsx   # UNMOUNTED 2026-06-10 — the scroll-drifting glass pills Caroline cut (only this; Effects/Env stay)
    HeroPoster.tsx  # static poster fallback
    heroShaders.ts  # GLSL for the hero
  sections/         # below-the-hero page sections (scaffolded 2026-06-09)
    About.tsx         # photo (placeholder) left + StreamingText bio right, fires on scroll-in
    StreamingText.tsx # rAF char-stream reveal (cps-paced, reduced-motion safe)
    ProjectsMarquee.tsx # giant "PROJECTS ✳" strips — filled row + outline row
    ProjectCarousel.tsx # center-focus carousel; hover-zones step ±1, click/dots/arrows
    Toolkit.tsx       # marquee of placeholder program-icon tiles
lib/
  useGPUTier.ts            # detect-gpu wrapper for fallbacks
  usePrefersReducedMotion.ts
  useInView.ts             # one-shot IntersectionObserver (triggers About stream)
  projects.ts              # typed carousel data: 1 real (Nest) + 4 placeholders
scripts/          # Playwright screenshot harnesses (shoot*.mjs)
research/         # tech-stack research notes
mapping.md        # hero scene map AS BUILT (fireball/orbs/glass) — rewritten 2026-06-10
screenshots/      # iteration-loop output (gitignored output dir per label)
```

## Design tokens (`app/globals.css` `@theme`)

- Background: `--color-bg #050507`, `--color-bg-elev #0a0a0d`
- Foreground: `--color-fg #f5f5f5`, `--color-fg-muted #8a8a92`
- Accents: `--color-accent-cyan #00d4ff`, `--color-accent-magenta #ff006e`, `--color-accent-amber #ffaa00`
- Fonts (CSS vars): `--font-hero` (Iosevka Charon, headline), `--font-display` (Bricolage Grotesque),
  `--font-body` (Geist), `--font-mono` (Geist Mono)
- Use the Tailwind utility names (`bg-bg`, `text-fg`, `text-fg-muted`, `font-hero`, …), not raw hex.

## Project skills (`.claude/skills/`)

Read the matching skill BEFORE working in its area:

- **design-md** — read/maintain `DESIGN.md` (the design-token + rationale source of truth); read before
  ANY visual/styling work, update when a decision changes a token or rule
- **orb-firewall-tuning** — tune the orb + firewall visuals; the screenshot iteration loop
- **glass-design** — liquid-glass surfaces: frosted sheets over the hero, glass-lens images
  with dissolving orb edges, rim reflection arcs + glints, scroll-driven specular motion
- **glsl-shader-effects** — authoring GLSL for the holographic/glitch aesthetic
- **r3f-hero-scene** — R3F scene scaffolding, SSR/dynamic loading, postprocessing, mobile fallbacks
- **scroll-choreography** — GSAP ScrollTrigger, Lenis, Motion transitions, scroll-driven uniforms
- **portfolio-architecture** — routes, MDX case studies, SEO/OG, asset organization, structure

## Conventions

- Dark theme only; reference the moodboard direction (holographic / glitchy / circuit-board, moody dark).
- Hero visuals are iterated via the **screenshot loop** against `public/assets/distorted-orb.png`, reviewed
  through "3d bro" + "creative director" personas (see `orb-firewall-tuning` skill).
- Branch per workstream (current: `firewall-prev`). Commit/push only when Caroline asks.

### When to launch Playwright (visual verification)

Don't reflexively screenshot every change — assess whether the visual outcome is
uncertain enough to need eyes. Always run `tsc`/`lint` regardless; Playwright is
only for *seeing* the result. Clean up temp screenshots after.

**Launch Playwright when:**
- Caroline gives a **screenshot / design to match** — render the result and compare against it.
- A **batch of design requests**, or any **substantive visual/layout work** (new component, glass/gradient/blob, spacing, alignment, responsive behaviour, motion).
- The outcome is **hard to predict from the code** — positioning, overflow, clipping, z-order, colour/contrast, things that "look right in code" but may not render right.
- Fixing a **visual bug** she reported (confirm it's actually fixed).

**Skip Playwright when:**
- **Copy/text edits** — headings, labels, body text, renames.
- **Single obvious tweaks** whose result is clear from the code (e.g. a font-size bump, a one-token colour change) — she'll eyeball it in her own browser.
- **Logic/refactor with no visual change**, or doc/config edits.
- She **explicitly says not to** ("don't run playwright") — that always overrides.

When unsure, lean on the size of the change: one-line/trivial → skip; multi-part
or spatial → verify. State briefly that you're skipping verification so she knows
it's a deliberate call.

---

## Decision Log

> **History note (2026-06-28):** this log grew past the 150k CLAUDE.md context limit, so the full
> blow-by-blow history (73 dated entries, every pixel value and dead-end) was archived to
> **`docs/CLAUDE-ARCHIVE.md`** — read it when you need the deep detail behind any decision below.
> What stays here is a condensed, topical digest of the still-relevant patterns plus the latest
> session handoffs. Going forward: add new decisions here, and periodically sweep settled detail
> into the archive so this file stays small.

### Key patterns & decisions (digest)

**Git / working style**
- **Commit/push ONLY when Caroline asks in the moment** (global rule); staging is fine. Multiple
  agents share this working tree — `git add` specific files, **never `-A`**.
- **Root `assets/` is gitignored raw material (2026-07-14)** — source PDFs/SVGs/exports, never
  served (the site loads from `public/assets/` only). It got swept into a commit by Cursor's
  stage-all, and two 100MB+ Wiki V2 PDFs made GitHub reject the push (the editor's "pull first"
  dialog was a misdiagnosis). Untracked via `git rm -r --cached assets` + `/assets` in
  `.gitignore`; files stay on disk. Never commit from `assets/` — copy what the site needs into
  `public/` first.
- When Caroline asks a *question*, answer it and change nothing; act only on explicit instructions.
- **No em dashes ever** in copy written for her; British spelling throughout.

**Case studies** (skill: `case-study`)
- Each study = route `app/project/<slug>/page.tsx` + its own scoped theme `theme.css` using a
  **unique scope class** `.<slug>-root` (e.g. `.cog-root`, `.ww-root`). **NEVER reuse `.cog-root`
  across studies** — Next keeps route CSS loaded after client nav, so a shared scope class leaks
  (cog's greens went magenta once both pages were visited). Copy the kit (`ui.tsx` primitives,
  `Reveal`/`Parallax`/`StreamingQuote`/`StickyHero`), retint the PALETTE only.
- Built so far: **cog-adhd** (`/project/cog-adhd`, light cream/green) and **wiki-whisperer**
  (`/project/wiki-whisperer`, light/magenta, E.ON Next). Wiki impact framed honestly (lead
  qual + adoption; quant directional, tests still running); all names anonymised.
- **Type template** (classes in each `theme.css`, load AFTER Tailwind so they BEAT utilities —
  apply ALONE, never stack `text-*`/`leading-*`/colour utilities on them):
  `.case-study-title` (H1, Iosevka, 48px/32px mobile, faux-extrabold via `-webkit-text-stroke`
  since Charon has no 800 cut), `.case-study-section-heading` (36px, stroke, baked 48px
  margin-bottom; use `mb-0!` if a button follows since margins don't collapse on inline-flex),
  `.case-study-eyebrows-heading` (Geist sans, uppercase, 13px/700, baked 12px gap to heading),
  `.case-study-label` (Geist Mono 16px/800, always lowercase), `.case-study-hero-label`
  (Geist Mono 16px/800), `.case-study-body-md` (Geist 16px/1.4, `--soft-ink #4a4a4a`),
  `.case-study-callout` (Geist Mono 28px, accent left rule). `--soft-ink` + `.case-study-body-md`
  also mirrored into `app/globals.css` for site-wide use.
- **Required signature motion on every study:** `Reveal` (scroll-in on every element except the
  Hero — heading block + each content block; shared `Stats`/`TestimonialBubble`/`InsightCard`
  self-wrap so don't double-wrap), `Parallax` drift, `StreamingQuote`/`CaseStudyCallout stream`
  word-reveal, and the glass seam. Acceptance: 0 console errors, 0 stuck-hidden, all `.cs-char`
  reach `data-stream="play"`, reduced-motion pass.
- **Hero load-in (2026-07-15, shared `components/project/HeroIntro.tsx`):** heroes are NOT
  Reveal-wrapped (in view at scroll 0), they play a load-time intro instead — `HeroStream`
  (fast char stream, same `.cs-char` contract as StreamingQuote but time-driven on mount;
  children must be a PLAIN STRING, `\n` renders `<br/>` via `breakClassName`) + `HeroFade`
  (quick image fade via a `display:contents` wrapper). BOTH drive hide/reveal with INLINE
  styles, never the theme.css `[data-stream]` rules: the effect runs during hydration and in
  dev the route CSS can land AFTER it (armed rule matches nothing → text pops in at once).
  Element children are unsupported by design — walking element trees across the RSC boundary
  hydration-mismatches (server/client see different node shapes). Also needs the forced-reflow
  (`getBoundingClientRect`) between hide and play or the browser coalesces them into one recalc.
- **Glass seam** (`case-study-glass-seam`): `StickyHero` pins the hero at a **measured negative
  `top`** (`-(heroHeight - viewportHeight)`, ResizeObserver) so the taller-than-viewport hero
  scrolls until the device mockups are fully seen, THEN pins while a cream frosted glass plate
  (`rounded-t-[2.5rem]`, `backdrop-blur-2xl`, rim glint, depth shadow) rises over it — mirrors the
  home About-over-hero. Use an **in-hero `h-[34vh]` dwell spacer** below `<Hero/>` so the glass
  climbs through empty cream first; do NOT use a separate post-hero buffer (reads as a frozen
  "is this the end?" stop). `sticky bottom-0` does NOT pin here; `overflow-x-hidden` on an ancestor
  BREAKS sticky (removed from `<main>`).
- **Shared primitives:** `Stats` (centred bold numbers, fixed-width items + consistent
  `lg:gap-x-[88px]` gutter, `py-11`, with `CountUp` GSAP roll-up), `TestimonialBubble`
  (`asset/quote/who/width/flip` — bubble assets have MIXED tail sides, set `flip` per-bubble by
  eye), `InsightCard`, `CaseStudyButton` (now single fixed colour `--color-bg` reverse-on-hover;
  `tone`/`size` props exist), `SoftBlob` (keep its box inside `overflow-hidden` so it isn't cut).
- **Product-visual HARD RULE:** every product image shares the same radius/hairline/soft shadow.
  Flat/square assets (raster screenshots, frameless SVGs) get `rounded-[16px] border-[1.5px]
  border-[#F7EBFF]` — but crop transparent viewBox padding FIRST (CSS rounds empty space if the
  panel doesn't fill the img box; fix shadow/margin in the SVG, e.g. crop viewBox / stroke the
  real device path). Pre-framed assets get the border as an in-SVG stroked perimeter path.
- **Boundary breathing space:** section above a bg-colour change gets `pb-[120px]`.

**Homepage**
- **Bento showcase** = `VariantBentoSoft` (locked as the direction; other prototype variants
  commented out, not deleted) using the reusable **`ProjectCard`** — collapsed spine wisp ↔ open
  corner-blob crossfade, glass stack, split expanded layout. `actions?: {label,href}[]` prop for
  multi-CTA cards (root becomes `<div>` since buttons can't nest in a button); `href` for
  single-link. Collapsed spine carries a short `name` (project) distinct from `company`, in two
  `writing-mode: vertical-rl` columns. Blob recipe `bloom()`/`spine()` with `core/edge/coreStop/
  edgeStop/fadeStop` knobs. 5 cards: wiki → `/project/wiki-whisperer`, cog → `/project/cog-adhd`,
  synapse (3 CTAs: blog/try/source), AI design system (no CTA yet), vector (SOURCE CODE + TRY IT).
- **Sections** order on the black plate: hero → About (glass sheet over the WebGL hero) → Highlights
  → Toolkit → `#work`. **`Highlights.tsx`** = data-driven `HIGHLIGHTS` array, 4 career chapters,
  mono role label as the only colour (one spectrum accent each: green/yellow/red/pink), streams in
  via `StreamingText` (`delay`+`style` props added). **Toolkit** = glass dock marquee of tool icons.
  **About** = glass sheet, scroll-driven liquid-glass specular arcs on the circular portrait.
- **NavBar** + **Footer** are global (mounted in `app/layout.tsx`). NavBar is theme-aware
  (dark site / light case study), transparent-at-top → frosts on scroll, links back to home
  sections from any page. Footer is dark on all routes, `z-10` so it sits above the homepage's
  `fixed inset-0 z-[5]` darkening plate; has GitHub/LinkedIn/email links + repo path label.

**Hero / WebGL** (skills: `orb-firewall-tuning`, `r3f-hero-scene`, `glsl-shader-effects`)
- The "watercolour metaball" orb row + the Firewall/fireball backdrop are siblings built from the
  same primitives. Hover-reveal (mouse-driven unmask), not positional drift. `GlassRail` is
  UNMOUNTED (kept on disk); `Effects`/`Environment`/GPU tiering/`TelemetryRail`/reduced-motion all
  stay. **`--color-bg` is FINAL at `#070709`** — if you change it, also update the hardcoded
  `rgba(7,7,9,…)` in About's sheet gradient + portrait vignette or a seam line appears. After any
  `globals.css` `@theme` edit, `touch` it (Turbopack serves stale CSS) and verify the computed var.

**Design system** (skill: `design-md`) — `DESIGN.md` at root is the token + rationale source of
truth (design.md format). Read before any visual work; update when a decision changes a token/rule.

**Verify trick** — MCP/`networkidle` Playwright screenshots TIME OUT on the live-WebGL pages. Use a
throwaway standalone `playwright` script run from the **PROJECT ROOT** (so the dep resolves):
`waitUntil: 'domcontentloaded'` + `waitForTimeout`, freeze transitions, real `.hover()` to open
cards, element-screenshot. Delete the temp script after.

---

## Session Log / Handoff

> Latest handoff at the top. **Everything up to 2026-07-30 is in `docs/CLAUDE-ARCHIVE.md`** (full
> blow-by-blow: vector build + polish rounds, mobile passes, iOS Safari SVG bake, the wiki
> client-nav reveal bug, scroll rail, token rename, gateway scaffold). Read it when you need the
> detail behind anything below. At the end of a session append a new entry here with: what changed,
> current state (working / broken / in-progress), explicit next steps. Sweep settled entries into
> the archive periodically so this file stays short.

### 2026-08-02 — galaxy nav: gamepad "controls" card (bottom-right). UNCOMMITTED on `skills-galaxy`.

- Caroline asked for gaming-controls-inspired navigation hints (more noticeable + more fun). Her
  calls, in order: subtle HUD tone (not retro arcade); reactive glyphs (lighting up on input)
  vetoed as likely clunky; a first pass with mouse pictograms + a drawn-mouse diagram was
  REJECTED ("people don't use the mouse anymore", most visitors on trackpads) in favour of a
  single card in the bottom-right corner with the instructions arranged like a controller cross.
- `SkillsGalaxy.tsx`: old right-edge text rail GONE. Went through three rounds with her
  (bottom glyph strip with mouse pictograms → bottom-right gamepad card with PS-button cross →
  final). FINAL: a full-frame-width bottom panel (border-t hairline, blurred dark bg) inside
  the frame. Left: pulsing "▶ click in to start" (galaxy-start-pulse keyframe, off under
  reduced motion, `invisible` while active so the row doesn't reflow). Right: exactly FOUR
  controls with icons SHE DESIGNED (recreated from her two mockups, 2026-08-02): each a small
  icon BESIDE a two-line left-aligned label — chevron pair up/down "scroll / to zoom"
  (`ScrollZoomIcon`), △ "click / to travel" (`TriangleIcon`), four outward chevrons, empty
  hub, "drag / to orbit" (`DragOrbitIcon`), and "back to start" as a SLIM case-study-style
  button (rounded-lg border, one line, bare refresh arrow `BackToStartIcon`, reverse-on-hover
  `hover:bg-fg hover:text-bg`, dispatches galaxy:recentre). Hints are flat light grey
  (`text-fg/55` icons, `fg/65` labels), chrome-free so they don't look clickable. ALL icons
  drawn 1:1 (viewBox = rendered px) sharing `ICON_STROKE` 1.25 — resizing via viewBox scaling
  would silently fatten/thin a stroke, redraw instead. Cut along the way on her orders:
  mouse glyphs (obsolete, trackpads), the cross/d-pad layout (too much space), "click another
  · travel", "click empty · zoom out", the esc·exit pill, the collapsible card + `[ ? ]` chip
  and its `helpOpen` state. Panel is pointer-events-auto + stopPropagation so clicks never hit
  stars behind it; panel click while idle activates.
- Dev-only chips both live in the TOP corners now (tune `top-3 left-3`, paint `top-3 right-3`,
  panels hang downward) — the full-width bottom panel owns the frame's bottom edge.
- Verified via Playwright on :3001 (idle / start-pill activate / star focus / collapse):
  0 console errors, active-state pill swap works. tsc + lint clean. Known nit: halo labels
  don't know the card exists, so a neighbour label near bottom-right (e.g. E.ON on Live Help's
  halo) can slip under the card edge; the label resolver treats only the focused block + hover
  as obstacles today.

### 2026-08-01 (afternoon) — label resolver, julien style, umbrellas, softness dial. COMMITTED on `skills-galaxy`, NOT pushed.

- **Label de-collision resolver SHIPPED** (`GalaxyScene.tsx`): per-frame screen-space greedy sweep.
  Rects predicted from the mono font (7.5px/char at 11px = 6.6 advance + 0.08em tracking — the
  bare advance alone left the widest labels 13% short). Focused block + hover are immovable
  obstacles; neighbours push apart vertically, tight cap 28px with a 44px rescue tier for
  crowded pockets; offsets damped `1-exp(-10dt)` with 1.5px hysteresis, written straight to a
  wrapper div inside the drei Html (composes with drei's transform; pointer-events inherits
  `none` so label clicks still work). Verified on real DOM rects: **0 overlapping pairs** on
  vector (46 labels), cog (41), eon (40) and rest state. Also fixed: the focused point-flare
  boost now keys off `orbKind`, not raw node type (skills-as-planets were keeping sun flare).
- **Graph: 130 stars / 441 links.** Umbrella skills front-end / back-end / ai-architecture wired
  (design-engineering dropped direct tailwind+typescript-react); live-help one-liner lost
  ", in build" — ⚠ the fact-discipline header still lists Live Help as in-build, Caroline owes
  a ruling. Agent judgement calls pending her blessing: tracing NOT in ai-architecture;
  cog-website/webflow/playwright NOT in front-end.
- **JULIEN_STYLE + PLANET_SKILLS** (`FocusOrb.tsx`): her repaint of the Saturn giant, applied to
  julien-macdonald + five skills rendered as planets (usability-testing, product-work,
  zero-to-one, context-switching, organisation — identical clones by design). product-work's
  green sun override removed (superseded). OPEN: the look repeats — 3 more jobs hash to the
  near-identical cream Saturn base (casablanca, consultancy, pilotto); she's choosing between
  varying the clones / retinting those Saturns / both.
- **`soft` dial** (all bodies): planets scale every register's edge width (sedge() in
  PLANET_FRAG); suns damp granulation contrast around its mean so texture flattens WITHOUT
  shifting exposure (glow stays the only brightness dial). Range 0.25 crisp → 5 dreamy,
  **1 = pixel-identical baseline (verified 0.00 diff against a frozen capture)**.
  **Every body defaults to soft 3** (Caroline's calls, 2026-08-01 — planets first after the
  threshold fix's full crispness reached her browser via the stale-tab gremlin and read as too
  sharp; suns brought to 3 later the same day). An explicit `soft` on a style or painter patch
  wins over the default.

**HAND-PAINTED REGISTRY — keep this current.** Caroline hand-tunes bodies via the painter and
the values get baked; she needs to know later which bodies are hers vs hash-derived. When baking
a patch, add the id here (and keep the dated comment in FocusOrb).
- Planets: eon (v3 pink-rose) · cog (green, v3) · cog-clinic (v2 mint/gold clouds) ·
  ai-design-system (v2 indigo/mint) · wiki-whisperer (v2 periwinkle/violet) · vector (v2
  apricot/orchid) · burberry (v2 orange/lemon) · julien-macdonald (v2 striped teal/plum, own
  entry now — JULIEN_STYLE const is used by context-switching ONLY) · zero-to-one (v2
  blush/electric-blue) · product-work (v2 magenta/gold) · usability-testing (pure-band stripes) ·
  organisation (diverged: teal/white stripes) · gateway · call-analytics (v2) · perf-insights ·
  eon-ds (EON_DS_STYLE gold/amber, cloned to the nextjs skill-as-planet) · cog-website · cog-ds ·
  mary · casablanca · consultancy · brainstation · mcqueen · pilotto (the six jobs, 2026-08-01 pm)
- Suns: team-leadership · design-systems (v2 green/gold flare) · ai-agents (v3 teal/periwinkle) ·
  design-engineering · cross-functional · prioritisation · navigating-ambiguity · context-design ·
  tool-design · tokens-in-code · building-with-agents · agent-workflows (soft only — her patch was
  labelled "agent team workflows" but carried building-with-agents' id; applied to the labelled
  node) · plan-first · roadmapping · dense-data-ui · user-interviews (v2) · ux-writing ·
  information-arch · figma-advanced · brand-identity · webflow · art-direction · empathy ·
  prototyping · success-tracking · visual-craft (v2 full repaint + rings) · mentoring ·
  print-design · logo-design · communication ·
  ~~product-work~~ ~~nextjs~~ (both render as planets now)
- Everything else renders from cluster palettes / hashed style tables — not hand-touched.

### 2026-08-01 — HANDOFF: galaxy labels, dead shader dials, graph expansion. All COMMITTED on `skills-galaxy` (`c11ea5c`), NOT pushed.

**Caroline switched model mid-session; this entry is the resume point.** Everything below is
committed and verified. Dev server was left running on **:3001** (never touch 3000).

**Shipped today, in three commits (`ef710fa`, `c11ea5c`, plus `6c89a5a` for the CLAUDE.md tidy):**
- **Two real bugs found and fixed by measurement, not by eye** (see the fbm note in the galaxy
  entry's hard-won rules): the mottle / dark-lane / cloud registers were keyed to `smoothstep`
  ceilings the noise never reaches, so those dials were dead; and speckles were sub-pixel. Both
  retuned to the measured distribution. **This changed the texture of every already-approved
  planet** (same palettes, much more definition). Caroline has seen it and is happy, but if she
  ever says a world looks busier than she remembers, this is why.
- **Suns are now paintable like planets**: `SunStyle` + `SUN_BASE` (defaults reproduce the old
  hardcoded sun byte-for-byte) with flare colour, granulation, turbulence, flare amount,
  brightness, and optional rings. `SUN_OVERRIDES` holds the per-id bakes. visual-craft is the
  one ringed star.
- **Palettes baked** (all painted live by her, merged over each node's hashed base): eon, cog,
  cog-clinic, ai-design-system, wiki-whisperer, burberry, vector (+ rim strength raised 0.18 →
  0.65 on her "add a rim" note), and suns product-work, team-leadership, design-systems,
  ai-agents, design-engineering, cross-functional.
- **Focused label restructured**: the separate "open case study →" line is GONE; the focused
  NAME is now the link (↗ icon, underline on hover, opens in a new tab). Sizes: name 14px bold,
  meta 11px, one-liner 11px, both capped at 200px, meta split onto two lines by splitting the
  sync's `"role · dates"` string in the component. Colours: name #f5f5f5, meta + one-liner
  `fg/85`, neighbours `fg/70` (the `/skills` grey, up from an effective 0.50 alpha).
- **Accessibility pass on the label colours** (she asked): everything now clears AA on the flat
  backdrop AND over bright nebula. Method worth reusing: measure the CANVAS background
  percentiles from a screenshot (median 7/255 but p90 is 47), then compute contrast against the
  bright case, not the dark one. Still open: at the p99 background (star cores, ~164/255) NO
  label colour passes, because brighter text is closer to the bright thing behind it. **The fix
  for that is a dark text-halo (text-shadow), proposed and not yet built.**
- **Graph 114 → 127 nodes, 273 → 416 edges** (an Opus subagent did this half): new soft skills
  (communication, empathy, organisation, prioritisation) and agent-craft skills (context-design,
  agent-harnesses, agent-loops, tracing, tool-design, agent-memory, plan-first, agent-skills,
  building-with-agents), ai-agents 5 → 17 connections, design-engineering expanded from her
  LinkedIn "I design teams out of Claude" post, ux-writing and cross-functional broadened.
  Her review calls: BrainStation dropped from cross-functional · ux-writing inferences kept ·
  "vibe coding" renamed **building with agents** · empathy stays in the `research` cluster but
  now also links into leadership.
- **`scripts/sync-galaxy.mjs` now DEDUPES EDGES.** It only ever checked duplicate node ids, so
  declaring a pair from both sides (A connects to B *and* B connects to A) silently emitted two
  edges, which gave a node the same neighbour twice and threw duplicate-key React errors in the
  console. It now collapses unordered pairs and warns which it folded. It caught two more the
  moment the next edit landed, so leave it in.

**OPEN / NEXT, in priority order**
1. **Label de-collision** — still the top job, and now more visible: the focused block grew
   (14px name + two 200px paragraphs) and dense halos are brighter. Likely needs a reserved zone
   around the focused block that neighbours route around, not just per-label nudging.
2. **The dark text-halo** for labels over star cores (see accessibility above).
3. Caroline may keep painting: the panel's "copy values" emits ONLY the fields she moved, so
   always merge a patch over the node's existing base style, and remember a colour whose amount
   dial is 0 renders as nothing.
4. Everything from the previous handoff still stands: her tuner numbers to bake, the `TODO(caro)`
   facts in GALAXY.md, the mobile pass, the missing sr-only alternative.

### 2026-07-31 (eve) — HANDOFF: CLAUDE.md tidied + Caroline's painted planet palettes baked

- **CLAUDE.md swept**: 1,777 → ~330 lines. Every 2026-06-28 → 2026-07-30 handoff moved verbatim
  into `docs/CLAUDE-ARCHIVE.md` (nothing deleted), and the branch-state table below is new.
- **Planet palettes baked** from her live PlanetPainter session (see the galaxy entry's "Painted
  palettes" block for the details and the two baking gotchas). Touched `FocusOrb.tsx`,
  `PlanetPainter.tsx`, `paint.ts`. Verified live on :3001: all 6 nodes focus correctly, colours
  match her paint, wiki's rings read lilac, ring pickers appear only on ringed worlds, 0 console
  errors, tsc + lint clean.
- **State: working, committed on `skills-galaxy`** (not pushed, not merged). Caroline signed off
  for the night straight after the commit, so nothing was left half-applied.
- **Pick up here:** she may want more paint rounds (wiki's mottle/pole amounts are still 0, so
  those two colours are invisible until dialled; E.ON's blue is mostly hidden behind the pink at
  default banding). Otherwise the galaxy's open list below is unchanged, with label de-collision
  still top.

### Branch state (unmerged work, all off `main`)

| Branch | What | State | Blocking / next |
| --- | --- | --- | --- |
| `skills-galaxy` | Interactive knowledge-graph galaxy section (see below) | Working, committed through `c11ea5c`. NOT pushed, NOT merged | Label de-collision, label text-halo, mobile pass, Caroline's tuner numbers |
| `scroll-progress` | Right-edge case-study progress rail, ported to all 4 studies | Working, uncommitted. Pre-merge cleanup done | ONE decision: cog's Methodology "exploratory sketches" row deliberately bleeds past the rail at 1440 and the label is unreadable over the artwork. Options: frosted plate behind the rail / right padding on that one row / accept |
| `token-cleanup` | `--cog-*` / `--green` → `--case-study-*` template slots + new `template-tokens` skill | Committed, not pushed/merged | Caroline's review. Only intended pixel change: cog's rail `#1e7a4d` → `#19a072` |
| (untracked, no branch) | Gateway case study scaffold (`app/project/gateway/`, `components/project/gateway/`) | Builds + prerenders, all copy is DRAFT `TODO(caro)`, `noindex`, unlinked | Read `components/project/gateway/OUTLINE.md` first: 7 open facts + shot list. Still on legacy `--cog-*` tokens with a 3-line bridge for the rail |

### 2026-07-31 — SKILLS GALAXY (branch `skills-galaxy`)

**What it is:** Caroline's skills matrix as an interactive knowledge-graph galaxy, a homepage
section between Highlights and Toolkit (`components/sections/SkillsGalaxy.tsx`), window-framed R3F
canvas, 127 stars (jobs / projects / skills / easter eggs) and 416 links. Click a star: camera flies
in, neighbours gather into a labelled halo, the node renders as a sun (skills), planet (jobs = gas
giants, projects = terrestrials, per-id overrides: vector = Io, cog = green marble) or moon (eggs).
Hops A→B run strict phases: edges reel into A (halo frozen, nothing else moves) → arced camera
flight with a light pulse on the bridge → B's edges sprout on approach.

**How to work on it**
- Data: `GALAXY.md` tables → `node scripts/sync-galaxy.mjs` → `lib/galaxyData.ts`. Never hand-edit
  the TS; the sync validates every cross-reference. `show` flags hide rows without deleting them.
- Visual/choreo knobs: `galaxy/tuning.ts` (mutable `TUNING`, read live) + a dev-only slider panel
  (`GalaxyTuner`, "tune" chip bottom-left). Dev-only planet painter on the "paint" chip bottom-right
  (`galaxy/PlanetPainter.tsx` + `paint.ts`) → "copy values" gives a patch to bake into
  `PLANET_OVERRIDES`. Both are `NODE_ENV`-gated and never ship.
- Dev-only window hooks for tests: `__galaxyProbe()` (per-node screen px + local xyz),
  `__galaxyFocused`, `__galaxyEdges()`, `__galaxyFlight()`.
- Verify with a standalone Playwright script run **from the repo root**, `domcontentloaded`, section
  locator `[aria-labelledby='skills-galaxy-label']`. Headless gotchas: launch Chromium with
  `--use-angle=metal --enable-gpu` (SwiftShader dies on "too many active WebGL contexts");
  screenshots lag 1-2s behind animation, so judge choreography by hook numbers, not frames; scope
  `getByText` to the section (Highlights above has clashing text like "E.ON Next").

**Hard-won rules (don't relearn these)**
- Lerps must be exponential on real dt (`1 - exp(-rate*dt)`) or they run ~10x slow at low fps.
- Star picking sorts by **angular** distance (`distanceToRay / distance`), not depth, or nearer
  stars steal clicks.
- drei `Html` label wrappers stay `pointerEvents:none`; only the inner element opts in. Making the
  wrapper interactive makes R3F read offsetX against it → rays shoot to the canvas corner. Label
  clicks `stopPropagation` natively and dispatch `galaxy:activate`.
- `react-hooks/immutability` forbids mutating a `useMemo` result: reach the live buffer through the
  geometry (`getAttribute("position").array`), and keep `PAINT` mutations inside `paint.ts` helpers.
- Halo vertical axis is squashed ×0.72 so members can't project below the wide window frame.
- **`fbm()` in FocusOrb does NOT span 0..1.** Four octaves of value noise measured over 60k points
  on the sphere run **0.13 – 0.79, median 0.47**. The original `smoothstep` ceilings (0.82 / 0.9 /
  0.95) sat above anything the noise ever produces, so the dark-lane, mottle and cloud registers
  only ever rendered at a fraction of strength and their dials read as dead. Any new threshold must
  sit inside that measured range. Verify a dial by freezing the body (Playwright
  `reducedMotion: "reduce"` DOES work and stops the rotation, contrary to the round-9 note) and
  diffing pixels: noise floor is ~0.28, so a working dial should move 3+.

**State:** working. tsc / lint / build clean. Committed through `684f1e3` (last round: graph
expansion proposal for her veto, featured-star de-overlap, rebuilt ring bands, the planet painter,
"view source" links removed from focused labels). Not pushed, not merged. Caroline reviews live on
:3001 (`npm run dev -- --port 3001`; **never touch port 3000**, it's usually hers).

**Painted palettes (2026-07-31, uncommitted)** — Caroline's live paint baked into
`PLANET_OVERRIDES`: eon (blue + dusty pink giant), cog (recoloured copper, was teal), cog-clinic
(sea green), ai-design-system (navy + clay), wiki-whisperer (indigo + violet, lilac rings). Suns
now have their own `SUN_OVERRIDES` map (product-work = green/teal) since `PLANET_OVERRIDES` is only
read for planets. Ring tones are a style field (`ringA`/`ringB`) with the old neutral-dust lerp as
the default, and the painter shows "ring dust" / "ring rock" pickers **only on ringed worlds**.
Two things to know when baking painter output: the panel emits ONLY the fields she touched, so
merge them over the node's existing hashed base style; and a colour whose amount dial is still 0
(wiki's mottle + poles) renders as nothing until she dials the amount up.

**Open / next, in priority order**
1. **Label de-collision** in dense halos (cog has ~30 edges, labels overlap).
2. Caroline dials the tuner knobs (arcLift default 2.5, bridgePulse, timings) live → bake her
   numbers into `TUNING_DEFAULTS`. Known dial: arcLift is absolute, so short hops get proportionally
   more lift; cap by flight distance if it reads floaty.
3. `TODO(caro)` facts still in GALAXY.md: Peter Pilotto has no role (label shows just "2019");
   margiela row hidden pending role/dates.
4. Mobile pass never done (renders at 390 but untuned); iPhone on-device test pending.
5. Before merge: sr-only text alternative for the canvas is still missing; a stray React "useEffect
   changed size between renders" error was flagged somewhere on the homepage, source never found.
6. Not linked from nav or homepage copy yet.

### Older handoffs

See **`docs/CLAUDE-ARCHIVE.md`** for every session 2026-06-09 → 2026-07-30.
