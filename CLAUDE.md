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
  `.case-study-title` (H1, Iosevka, 48px/22px mobile, faux-extrabold via `-webkit-text-stroke`
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

> Latest handoff lives at the top. Older handoffs (2026-06-09 → 2026-06-27) are in
> **`docs/CLAUDE-ARCHIVE.md`**. At the end of a session, append a new entry with: what changed,
> current state (working / broken / in-progress), and explicit next steps for the next agent.

### 2026-07-01 — HANDOFF: wiki case-study reveals don't animate on client-side nav (UNSOLVED). Responsive pass + scroll fixes DONE.
> Caroline is handing to a fresh agent. Read this whole entry before touching the reveal bug — a LOT has been
> tried and ruled out. All work below is committed + pushed to `main` and deployed on Vercel (prod =
> **carolinejaworsky.com**, direct Vercel, auto-deploys from `main`, ~2 min/build). Latest commit `b0d55d9`.

**DONE + shipped this session (working):**
- **Responsive pass** (PR #5, merged): bento stacks below `lg` + shrinks card images (`max-[1520px]`/`max-[1150px]`)
  + dedicated mobile images (`mobileImage` prop on `ProjectCard`); homepage NavBar/About/hero/telemetry;
  wiki + cog case-study mobile fixes. Desktop untouched. See `.claude/skills/responsive-design/SKILL.md`.
- **WebGL hero persisted** across routes: `components/PersistentHero.tsx` (mounted in `app/layout.tsx`), shown
  only on `/`, paused (`frameloop:"never"`) + INSTANT `opacity:0` off-home (z-0, no fade). Deleted old
  `components/Hero.tsx`. This KILLED the `THREE.WebGLRenderer: Context Lost` freeze on nav (it used to unmount
  the canvas every nav → GPU teardown → main-thread hang). Scene takes a `paused` prop now.
- **Scroll-reset on case-study entry**: `components/ScrollReset.tsx` rendered as the FIRST child of BOTH
  `app/project/{wiki-whisperer,cog-adhd}/page.tsx`. Hard-resets scroll to 0 before the reveals init. Uses
  `ScrollTrigger.clearScrollMemory("manual")` (ScrollTrigger restores saved scroll on refresh() by default —
  that was firing reveals), Lenis nudge-to-1px-then-0 (bypass Lenis' `scrollTo` early-return), `window.scrollTo`.
- **`SmoothScroll.tsx`**: added `history.scrollRestoration="manual"`, Lenis `autoRaf:false` (was double-driving
  its own rAF), exposes `getLenis()`. Still sets `gsap.ticker.lagSmoothing(0)`.

**THE UNSOLVED BUG:** entering the **wiki** case study from the homepage bento card (client-side nav) → the
`Reveal` scroll-in animations DON'T play; sections are **"already fully visible"** before they enter view (no
fade/rise/blur). **Streaming (`StreamingQuote`, IntersectionObserver) DOES work.** **cog works perfectly** with
the SAME `Reveal` component. On a hard **REFRESH** of the wiki URL, reveals work fine. So: client-nav-specific
AND wiki-specific.

**Real-browser diagnostic data (from Caroline's console; my headless tests could NEVER reproduce it):**
- Landing on wiki via card: `scrollY=0, played=0` → GOOD, scroll reset works, reveals hidden at landing.
- Scrolling down: `played` climbs slowly (0→2 by y=782) → reveals DO fire progressively, not all-at-once.
- BUT she reports sections are already fully visible with no animation. `reducedMotion:false`. Console: only
  `THREE.Clock` deprecation + preload warnings (both harmless); `Context Lost` is GONE.
- **KEY DATA STILL NOT GATHERED:** the `hidden` count (elements with inline `visibility:hidden`) on wiki
  landing. I only ever got `played` (visibility:inherit). If `hidden` is high (~57, like headless) the reveals
  ARE hiding → it's an animation-JUMP problem; if `hidden`≈0 they never hide → a different bug. GET THIS FIRST.

**RULED OUT:** scroll position (y=0 confirmed) · ScrollTrigger scroll-memory (clearScrollMemory added) · the
WebGL freeze (Context Lost gone) · reduced-motion · Parallax (cog uses MORE and works) · the wiki **ambient
blob layer** (removed it → no change, then restored) · component logic (`Reveal.tsx`, `StreamingQuote.tsx`,
`StickyHero.tsx` are byte-identical wiki vs cog — diffed).

**Remaining wiki-vs-cog structural diff:** wiki's glass plate is `relative isolate z-10` (cog: `relative z-10`,
no `isolate`) in `app/project/wiki-whisperer/page.tsx`. Both have `backdrop-blur-2xl`. Wiki page is longer/heavier.

**Leading hypotheses for next agent:**
1. Reveals FIRE but GSAP JUMPS them to done instantly (no visible animation) after a main-thread hitch —
   worsened by `gsap.ticker.lagSmoothing(0)` in `SmoothScroll.tsx`. Try a real `lagSmoothing` value (default
   `500,33`) so GSAP caps catch-up instead of skipping — but watch Lenis sync.
2. Wiki's `isolate` (last structural diff) — try removing it and test on prod.
3. Rendering-perf: profile the wiki scroll in Caroline's REAL browser (Performance tab) for long tasks/dropped
   frames while a reveal should animate. The reveal animates `filter:blur(6px)`; wiki's backdrop-blur over a
   tall page may make that filter animation skip.

**CRITICAL PROCESS NOTE:** this bug is **NOT reproducible in headless Playwright** — cog AND wiki both animate
correctly headless (even throttled, even with a "used session" that builds scroll memory). Every fix I verified
headless still failed in Caroline's browser. **Do NOT trust headless for this; get real-browser data from
Caroline each iteration** (diagnostic snippet: a `setInterval` logging `scrollY` + counts of `main *` with
inline `visibility:hidden` vs `inherit`). Each fix = deploy to prod + she tests (~2-3 min/cycle).

### 2026-06-28 (later) — New `responsive-design` skill built + approved; bento responsive fix diagnosed, NOT yet applied
- **Status: skill DONE + reviewer-APPROVED; no component code touched** (Caroline said "build the
  skill but stop before touching bento cards"). On `project-showcase-experiment`, uncommitted.
- **Added `.claude/skills/responsive-design/SKILL.md`** — Tailwind v4 responsive guidance: the
  three-axis model (viewport breakpoints / container queries / content-vs-space shrink), the
  flexbox `min-w-0` shrink rule, the duplicate-and-hide a11y pattern, and a worked bento example.
  Process: researched online (Tailwind v4 docs, MDN flex `min-width:0`, container queries, a11y),
  drafted, then ran an **evaluator subagent** twice (NEEDS_REVISION → APPROVED).
- **Root-cause of the bento bug (diagnosed, ready to build next):** in `ProjectCard`/`VariantBentoSoft`,
  (1) synapse's CTA "fat buttons" = each `CaseStudyButton` is `inline-flex` with **no
  `whitespace-nowrap`** so the LABEL wraps internally (the row is already `flex-nowrap`);
  (2) the image doesn't "shrink first" because the copy column is a **percentage** `w-[56%]` so
  both columns shrink in lockstep. **Planned fix:** add `whitespace-nowrap` to `CaseStudyButton`;
  change synapse copy column from `w-[56%]` to a fixed `flex-none basis-[~28rem]`; make the image
  column `flex-1 min-w-0`; add a card-level `@container` + `@max-2xl:flex-col` stack trigger for the
  narrow side-by-side band. Keep desktop (`lg:`+) byte-identical; verify widest layout first.
- **Open intent:** apply the above to the bento cards once Caroline gives the go-ahead.

### 2026-06-28 — Homepage `/highlights` career section + About bio refresh; Caroline signed off ("thank you!")
- **Status: WORKING, all committed + pushed** on `project-showcase-experiment` (commits
  `0eef4ba` then `14343c4`). Nothing in progress, nothing broken.
- **Built `components/sections/Highlights.tsx`** (mounted in `app/page.tsx` on the black plate
  directly under `<About/>`, before `<Toolkit/>`). Data-driven `HIGHLIGHTS` array (edit DATA, not
  markup). 4 chapters in her chosen order: founding designer @ COG · product designer @ E.ON Next
  (AI foregrounded) · educator @ BrainStation · senior print designer @ Burberry · McQueen. DS
  treatment: mono role label (the only colour, one spectrum accent each as signal) + Geist company
  + mono detail; `/highlights` label in the shared column geometry. **Colour sequence (her call):
  green `#3fc4ad` → yellow `#ffcf52` → red `#F56267` → pink `#ff2f7e`.** She dropped an earlier
  colour-pool smudge + lit glow-rule (kept just the coloured role label).
- **Streaming type-on** to match the About bio: each line types in via the shared `StreamingText`,
  cascading top-to-bottom within a card, left-to-right across cards off one `useInView` trigger.
  Gave `StreamingText` optional **`delay` (ms) + `style`** props (backward-compatible; About
  unaffected). Dials at top of `Highlights.tsx`: `CPS 280`, `CARD_GAP 130`, `LINE_GAP 80`.
- **Sizes/spacing (her tuning):** detail line 10px mobile / 11px desktop (mono, `tracking-[0.2em]`,
  `text-fg/70`); company `text-base md:text-lg`; role label `text-[11px] md:text-xs`. FLAGGED: at
  `0.2em` tracking the detail line wraps to 2 lines on mobile (acceptable to her); dial toward
  `0.04em` for single-line.
- **About bio** refreshed to her new copy (4 paragraphs incl. the `☆⋆✦ right now:` break), em
  dashes converted to commas/full stops.
- **NEW GLOBAL RULE:** added to `~/.claude/CLAUDE.md` — never `git commit`/`git push` until she
  says so in the moment; one approval doesn't carry to later changes (staging is fine).
- **Open intent:** none stated.

### Older handoffs
See **`docs/CLAUDE-ARCHIVE.md`** for the full 2026-06-09 → 2026-06-27 session handoffs (case-study
builds, glass reveal, NavBar/Footer, showcase cards, wiki polish, spelling pass, etc.).
