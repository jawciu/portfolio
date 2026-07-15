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

### 2026-07-14 (later 4) — Promo video V2 swap, GH file-size push fix, assets/ gitignored, vector copy tweak. ALL PUSHED.
- **Wiki promo video V2**: replaced `public/projects/wiki-whisperer/promo.mp4` with
  `~/Downloads/Wiki_Whisperer_V2_promo.mp4` (same 1920×1080, 71s, 34.8MB) — no code change, the
  hero's reserved 16:9 box is unaffected. Shipped in `43e4ca7`.
- **Caroline's push was rejected by GitHub, NOT a pull problem**: Cursor's "try running Pull first"
  dialog was a misdiagnosis — the real error (Show Command Output) was GH001: two Wiki V2 PDFs in
  `assets/` over the hard 100MB limit, swept in by Cursor's stage-all commit. Fixed by amending to
  drop them, untracking ALL of root `assets/` (`git rm -r --cached`), and gitignoring `/assets`
  (see the new Decision Log digest entry). Verified every code-referenced `/assets/...` path
  resolves to a tracked `public/` file — the site never read from root `assets/`.
- **Vector copy** (`Product.tsx` Automated follow-ups): "Mimicking each user's voice is its own
  project." → "Adapting the writing to each user's voice is on the roadmap." (too informal for
  the paragraph). Pushed as `bfc9030` on main.
- **Branch hygiene**: fast-forwarded `vector-case-study` (+ its worktree) to main's tip and pushed,
  so branch == worktree == main == `358c1ff` (which also includes the parallel session's Vercel
  Analytics commit). Working tree clean everywhere except THIS CLAUDE.md (mine + the later-3
  entry below, both uncommitted).
- **State: everything working and deployed.** No open intent from this session.

### 2026-07-14 (later 3) — VECTOR SHIPPED: branch synced, merged to main, deployed.
- **The Vector case study is LIVE**: `vector-case-study` was synced (main's 30 commits merged in;
  only CLAUDE.md conflicted — session logs union-merged with a seam note), verified (tsc, lint
  [only the known pre-existing HeroCopy error], full `next build`, all 4 routes 200), pushed,
  then **fast-forward merged into main (`fc5953b`) and pushed** → Vercel deploy. The bento
  card's `MY CASE STUDY → /project/vector` action was already on the branch, so page + button
  shipped atomically.
- **The portfolio-vector worktree is now merged into main** — future vector tweaks can happen in
  either checkout; keep using the worktree only if parallel work needs isolating again.
- **Deploy VERIFIED live:** www.carolinejaworsky.com/project/vector → 200 with content, hairline
  icon assets serving (apex URL 308-redirects to www — normal).
- **OPEN INTENT — next session:** (1) Caroline still needs to do the on-device pass: the live
  page on her iPhone + the homepage→vector-card client-side nav (the two historically
  device-only failure modes); expect feedback from that. (2) Housekeeping pending her call:
  `MyRole.tsx` + `MyRoleOutline.tsx` are HIDDEN (commented in page.tsx) not deleted, and the
  old filled/outline icon assets are still in public/projects/vector — delete once she's sure
  the hairline set is final. Only uncommitted change in the main checkout: this CLAUDE.md entry.

### 2026-07-14 (later 2) — WhatsNext remounted + rebuilt as three PINS. UNCOMMITTED.
- **Remounted** (import + mount restored in page.tsx) and redesigned per Caroline: the two text
  blocks read as boring. Now **three dropped map pins** (her call: "like stops in a timeline but
  NOT a timeline", equal weight, no order): **Linear · Attio · evals**. Iterated v1 hairline
  teardrop → v2 gradient lollipop → v3 grey circle + coloured stem → v4 teardrop + coloured
  outline → grey outline + dot behind tip → **v6 (FINAL, from her Matching screenshot): the
  MATCHING RAIL layout** — grey icon circles as stops (48px, card fill + `--case-study-line`
  hairline, white marks inside) joined by **DOTTED gradient rails** (lilac `#c098ff` → RAMP-mid
  pink `#e09abe` → peach `#ff9c7d`; solid gradient span shown through a repeating radial-dot CSS
  mask — `railStyle()`, both orientations). Phone = Matching's stacked pattern: stops left,
  vertical dotted rails, copy right. Then `>` label + short Body per stop.
- **Her follow-ups (same session):** stop order now **AI accuracy → Linear → Attio** (she renamed
  "evals before autonomy" to "ai accuracy" herself); column gaps +50% (`md:pr-12`, phone `pb-18`);
  **heading replaced** — "Earning the next slice of trust" (written for the trust/autonomy angle)
  → **"Measured accuracy, connected tools"** (her pick from four options, goal-list shape).
- **Logos inline as SVG paths** (not `<img>`, so the iOS-Safari bake rule doesn't apply), filled
  WHITE on the gradient: Linear from Simple Icons CDN; Attio's official double-slash mark is NOT
  on Simple Icons (issue #12295 open) — path pulled from a GitHub mirror (onecli/onecli). Evals
  pin = a drawn target, all-white strokes at 1.8 width so it's as "white-heavy" as the brand marks
  (her ask).
- **Copy grounded in the vector repo's plans** (PLAN.md ll.525-534 + EVALS_PLAN.md): Attio = deal
  context (contacts, notes, deal detail) already lives in the CRM, pull it in so onboarding
  doesn't start blank; Linear = two-way sync so tasks are never entered twice; evals = pipelines/
  observability/30-case golden dataset BUILT, next is running them and iterating prompts —
  "the agent earns autonomy when the numbers say it can" (her honesty framing: built, not done).
- Verified 1440 + 390 via standalone Playwright (script run FROM WORKTREE ROOT — the scratchpad
  path can't resolve the playwright dep); tsc + lint clean.

### 2026-07-14 (later) — Product band tightens on ultra-wide screens. UNCOMMITTED.
- **Caroline's ask:** the 90%-wide ProductBlock rows get too spacey past 1624px. Band now steps
  90% → 80% (≥1624px) → 70% (≥1888px) → 60% (≥2000px, her "200px" read as 2000). Nothing below
  1624 changes.
- **60% tier is `w-[max(60%,1280px)]`, not bare 60%:** the widest rows (424 copy + 828 shot +
  24 gap = 1276px) spill 76px past a bare 60% band at 2000px (measured), reading off-centre until
  ~2130px. The max() floor keeps every row on the same band edge; band eases 64%→60% over
  2000→2133px.
- **TAILWIND v4 GOTCHA (cost a debug round):** `md:w-[90%] min-[1624px]:w-[80%]` does NOT work —
  v4 emits the whole arbitrary `min-[...]` variant group BEFORE the named-breakpoint (`md:`) block
  in the stylesheet, so the `md:` rule wins at every width regardless of viewport. Fix: put ALL
  tiers in the same group — `min-[768px]:w-[90%] min-[1624px]:w-[80%] min-[1888px]:w-[70%]`
  (min-[768px] ≡ md; within the min-[] group rules sort ascending by value, so later tiers win).
- Verified via measurement probe at 1500/1623/1624/1887/1888/1920 (90/90/80/80/70/70 exact) +
  eyeballed Customer portal / AI overview / Predictive health blocks at 1700 and 1920 — clean.
  Probe gotcha: Playwright `newPage` takes `viewport:`, not `viewportSize:` (silently ignores the
  latter → everything measures at default 1280).
- Only `Product.tsx` touched (the band ternary + comments). tsc + lint clean.
- **Round 2 (same session): shots ×0.8 in the 768–1407px band** (Caroline's ask: images rode over
  the copy below 1408 — that's exactly where the widest rows' fixed content, 424 copy + 24 gap +
  828 shot = 1276px, outgrows the 90% band). The inline `style={{maxWidth}}` caps (shot + column)
  moved to CSS vars (`--pb-shot`/`--pb-col`) consumed by tiered utilities: base = full (phones
  unchanged), `min-[768px]:` ×0.8, `min-[1408px]:` full — min-[] variants throughout (the named/
  arbitrary mixing gotcha above). Verified numerically at 900–1600px: shots 0.8× ≤1407, full ≥1408,
  desktop byte-identical; copy overlap GONE from ~1234px up; eyeballed 1300px, reads clean.
- ~~KNOWN REMAINDER: companions rode over copy below ~1230px~~ → **RESOLVED by round 3** (below).
- **Round 3 (same session), Caroline's design: copy hugs 1230→1070, stack at 1070.** The Product
  rows' full responsive ladder is now: **≤1069 stacked** (mobile layout, full-size shots) →
  **1070–1229 copy column hugs** `w-[clamp(264px,calc(100vw-806px),424px)]` (424 at 1230, ceding
  1:1 with the viewport; shots ×0.8) → **1230–1407 copy 424 + shots ×0.8** → **1408+ full size**,
  then the wide-screen band steps (80/70/60%). Implementation: ALL row-layout gates in
  ProductBlock + COMPANION_POS + per-block copyClassName/shotClassName moved `md:` →
  `min-[1070px]:` (stack point promoted; min-[] group keeps ordering consistent).
- **Also required (found by eyeball at 1000px):** `CircuitTrace` (hidden md:block, left-8) and the
  vertical room label rode THROUGH the px-6 full-width copy in the new 768–1069 stacked band —
  both re-gated `md:` → `min-[1070px]:`, and the horizontal mobile label now shows to 1070
  (`min-[1070px]:hidden`). SubSection room spacing (`md:mt-28`, container pt) left at md — no
  collision, purely spacing.
- **Verified:** 11-width sweep 900→1440 — stacked ≤1069, copy 264/294/344/423/424 at
  1070/1100/1150/1229/1230, shots 0.8×<1408, full ≥1408, **zero copy↔visual overlap at every
  width**; eyeballed 1100 (all companion rows) + 1000 (stacked, spine gone). tsc + lint clean.
  Desktop ≥1408 and phones <768 byte-identical throughout.
- **Round 5 (same session): stacked clusters STAGGER like desktop** (Caroline sent desktop refs:
  health snippet offset LEFT of the table, miniti pipeline offset left + tucked UNDER, cron
  snippet offset RIGHT of the draft, flow routing card RIGHT of the panel — the flat left-aligned
  stack was wrong). Mechanism: companion rows widen the stacked column cap by a **140px stagger
  budget** (`max-w-[calc(var(--pb-shot)+140px)]`), the shot slides to its desktop side
  (`COMPANION_STACK_SHOT` map, `max-[1069px]:ml/mr-auto`) and the companion takes the opposite
  side (`max-[1069px]:ml-auto` on flow/cron in COMPANION_POS). miniti's z-0 + the shot's z-[5]
  are now UNGATED so the tuck-under reads at all widths (phones included — deliberate). On
  phones the container < shot width, so the budget never bites and the stagger degrades to ~0.
  Verified: all four clusters mirror their desktop refs at 800px; 11-width overlap sweep still
  zero everywhere; cron row at 1440 unchanged.
- **Round 4 (same session): stacked visuals centre as a CLUSTER.** Below 1070 the visual column
  now caps at the SHOT width (`max-w-[var(--pb-shot)]`, not the widened `--pb-col` — that width
  is dead space reserved for row-mode corner-anchoring) and centres via `mx-auto`
  (`min-[1070px]:mx-0` restores row mode). Shot + companion move as ONE centred unit, keeping
  their left-anchored offset and `-mt-10` overlap to each other — Caroline: centre the group,
  never the pieces relative to each other. Verified: centring error 0px at 390/800/1000/1069,
  row mode untouched at 1070/1440; eyeballed notifications + health clusters at 800. Phones
  unchanged (container width < shot width there, so the cap never bit).

### 2026-07-14 — MyRole icon variants ×2 (OUTLINE + HAIRLINE), mounted as stacked comparison duplicates. UNCOMMITTED.
- **Round 2 (same session):** linework thinned on the outline set at Caroline's ask (glyphs
  5.6→3.6, cards 3→2, palette dots scaled to match — hierarchy preserved).
- **Round 3 (same session):** Caroline asked for a variant matching Collaboration's "Working
  with AI" diagrams. New `*-hairline.svg` set (product/design-system/built/ai-orchestration):
  uniform 1.3px strokes, translucent accents lifted verbatim from Collaboration.tsx
  (lilac rgba(192,152,255,0.45), mint rgba(157,255,244,0.4), neutral rgba(241,234,241,0.3)
  card/connector lines), and the ONLY solid elements are small r=2 colour dots at 0.9 opacity
  (bulb rays → mint dots, paint wells → the fleet-diagram dot palette #c098ff/#e99ddb/#9dfff4/
  #ff9c7d, plug sparks → peach dots, node junction → pink dot). Section `MyRoleHairline.tsx`
  mounted under MyRoleOutline — page now shows MyRole → MyRoleOutline → MyRoleHairline for a
  three-way compare. Delete the two losers (sections + assets) once she picks.
- **Round 5 (same session) — HAIRLINE PICKED (with tweaks); MyRole + MyRoleOutline HIDDEN, not
  deleted** (imports + mounts commented in page.tsx, same pattern as WhatsNext; components +
  assets stay on disk). Colour pass on the hairline set, ALL accents now FULL-OPACITY hexes (the
  translucent rgba versions read dimmed, her call): product = orange #FF9C7D bulb + mint dots ·
  design-system = lilac #C098FF palette + ALL-ORANGE paint dots · built = ORANGE plug + MINT
  spark dots (swapped) · ai-orchestration = orange LEFT square, lilac RIGHT squares, pink centre
  dot DELETED (connectors stay neutral rgba(241,234,241,0.35)). Verified: probe shows
  filled/outline gone + hairline mounted; tsc + lint clean.
- **Desktop spacing pass, 9 changes (2026-07-14, same session, Caroline's list — all applied
  as padding/margin bumps, computed values verified in-browser):** Problem pt 120→240 (MyRole→
  Problem gap 2x) · Product pt 120→156 (+30% after the Problem callout) · AILayer callout mt-14→
  mt-28 (2x above "Every call is prompt-cached…") · Observability pt 120→144 (+20% below that
  callout) · Observability dotted-room pb 120→168 (+40% below the Usage/Pipeline assets) ·
  Architecture pb 100→150 (+50% after the stack logos) · Collaboration pt 100→120 (+20% above
  the Working-with-AI kicker) + pb 100→170 (+70% below the checked cards) · WhatsNext pt
  100→130 (+30% plain dark above What's next). NOTE: the old symmetric "texture edge mid-gap"
  100/100 splits around Collaboration are deliberately gone. Icon drop-shadow also halved this
  round (0.33/0.2). MyRole hairline icon shadows + these spacings all UNCOMMITTED.
- **Collaboration got the DotGlow hover (2026-07-14, same session):** the cursor-following
  lit-texture effect (Product/Observability's `DotGlow`) was missing on Working with AI's check —
  added `<DotGlow pattern="grid" />` as first child of the (now `relative`) section, Container
  made `relative` so cards paint above the overlay. Same 22px grid geometry, so the lit pattern
  aligns perfectly. Verified with a real hover at 1440.
- **NextProject blob move TRIED AND REVERTED (2026-07-14, same session):** the "darken the
  closing plate by moving its SoftBlob up into WhatsNext" idea looked bad in situ ("upsy looks
  shit") — blob restored verbatim to NextProject (Parallax speed 130, bottom-[0%] right-[1%],
  opacity-50 blur-[64px]); WhatsNext back to its untouched state. Don't re-try this without
  a new design idea. Also that round: ai-orchestration icon = ALL-lilac squares + orange
  connectors (?v=3).
- **Round 6 (same session):** icon `<img>`s got a CSS `drop-shadow` (two stacked:
  0 18px 30px 0.65 + 0 6px 12px 0.4 — echoes CARD_FRAME's shadow; CSS-side filter, NOT in-SVG,
  so iOS-safe) — the trapezoid plates were already the exact CARD_FRAME tokens, the missing
  shadow was why they read flatter than real cards. Also: the "ai orchestration still faint"
  report was Caroline's Safari serving a STALE CACHED round-4 SVG (her screenshot showed the old
  translucent squares + pink dot; disk + fresh browsers had the new art) — src bumped to
  `ai-orchestration-hairline.svg?v=2` to cache-bust; connectors also went solid mint #9DFFF4
  this round. Bump ?v again if a stale asset recurs.
- **Round 4 (same session, her tweaks to the hairline set):** trapezoid cards now FILLED with the
  Working-with-AI card surface (fill `#1d1c24` + hairline stroke `#25232d` — CARD_FRAME's exact
  tokens) so they read as the same elevated plates the diagrams live in · glyph linework doubled
  1.3→2.6 (card border stays 1.3, like the real cards' 1px hairline) · bulb back to ORANGE
  (rgba(255,156,125,0.5)), ray dots stay mint.
- **Caroline's ask:** the MyRole hat icons (filled lilac/pink cards + chunky glyphs, the wiki/cog
  style) don't sit right on Vector's dark theme — redraw them as OUTLINES in the Vector palette
  (lilac `#C098FF`, orange/peach `#FF9C7D`, plus mint `#9DFFF4`), and duplicate the section so she
  can compare side by side. Original section NOT touched.
- **New assets** in `public/projects/vector/`: `product-outline.svg`, `design-system-outline.svg`,
  `built-outline.svg`, `ai-orchestration-outline.svg`. Same tilted-card composition as the filled
  set but stroke-only: card quad = 3px outline in one colour, glyph = 5.6px strokes (matches the
  original bulb's stroke weight) in a second, small accents (rays / paint dots / sparks /
  connectors) in mint or peach as the third. Colour rotation: product lilac-card/orange-bulb/
  mint-rays · design-system orange-card/lilac-palette/mint-dots · build lilac-card/mint-plug/
  orange-sparks · AI orchestration orange-card/lilac-nodes/mint-links. Product reuses the original
  SVG's stroke path verbatim (recoloured, rays split out); palette is a scaled lucide-palette path;
  plug + node diagram redrawn from scratch. Plain paths only — safe for the iOS Safari SVG-in-img
  rule (no masks/filters/patterns).
- **Comparison mount:** `sections/MyRoleOutline.tsx` (exact copy of MyRole, only icons/alts differ,
  `data-section="MyRoleOutline"`), mounted in page.tsx directly under `<MyRole/>` with a TEMP
  comment. **Once Caroline picks a winner: delete the losing section + its icon assets.**
- tsc + eslint clean; verified via Playwright on the running dev server (port 3000 serves THIS
  worktree) at 1440 + 390 — both sections render, outline set reads cohesively at 72px.
- NOTE: pre-existing uncommitted `M Hero.tsx` in the tree was left alone.

### 2026-07-13 (later 3) — WhatsNext HIDDEN (not deleted) + hero texture settled on DOTS ONLY. COMMITTED+PUSHED.
- **WhatsNext unmounted** from page.tsx (import + mount commented, same pattern as Takeaways) —
  Caroline is still working on its content and wanted to push without it visible. The component
  and its copy stay on disk untouched; remount = uncomment two spots in page.tsx.
- **Hero texture final: dots only** (Product's TEXTURES.dots values) + the light/dark radial
  patches, continuous across hero + dwell to the glass seam. The check, dots-on-crossings, and
  20px blurred-bloom variants were all tried and REVERTED ("awful") — don't resurrect them.
  Lesson kept for reference: a repeating background glow clips at its own tile; >tile radii need
  staggered larger tiles.
- Also this round: follow-ups draft inset 150px (was 100); +100px between tasks/follow-ups blocks
  (padded wrapper, margins collapse); review-queue callout ±54px (md-gated padding); Collaboration
  got the dots texture + Caroline's own pt-[200px] & Architecture pb-[100px] split-gap edits (a
  JSX-comment-in-return syntax error from that edit was fixed); Observability copy apostrophe
  escaped for lint.

### 2026-07-13 (later 2) — Caroline's 8-item desktop polish batch. UNCOMMITTED.
- **MARGIN-COLLAPSE DISCOVERY (matters for every heading→content gap):** the section heading's
  baked 48px margin-bottom and the next block's `mt-*` are ADJACENT margins — CSS collapses them
  to the LARGER, they never add. "heading mb 48 + mt-12 = 96" is wrong; it measures 48. For a true
  96 gap use `mt-24` (96 wins the collapse). Fixed Collaboration cards (mt-12→mt-24, measured 96)
  and Architecture callout (mt-16→mt-24, measured 96). Padding never collapses — use pt when a gap
  must be additive (see health callout below).
- **Glass-plate shadow** (page.tsx): lilac glow `rgba(192,152,255,0.18)` → real dark shadow
  `0_-32px_70px_-16px rgba(0,0,0,0.85)` (her ask: "shadow, not glow"). NOTE: NextProject.tsx still
  carries the old lilac shadow on its own plate — not asked, left alone, flag if she wants parity.
- **Hero check runs to the glass now:** the 22px grid moved OFF the Hero section onto a wrapper in
  page.tsx around `<Hero/>` + the 34vh dwell spacer, so one continuous pattern reaches the seam
  (before: cut at the section edge, plain bg below). Plus TEXTURE: 4 soft radial patches (white
  0.035–0.045 / black 0.34–0.4) layered UNDER the grid lines make the check read lighter/darker in
  areas. Patches are viewport-relative (100% 100% backgroundSize entries).
- **Product row dials** (all in Product.tsx, verified by screenshot at 1440):
  · Notifications: columnWidth 560→780 — shot slides far left toward the copy (smaller copy gap
    EXPLICITLY ok), routing card stays pinned right; overlap now a sliver.
  · Follow-ups (flipped row): NEW columnWidth 760 + ProductBlock now hugs the shot to the RIGHT on
    flipped rows (`flip ? ml-auto : mr-auto`) — draft sits ~115px from the copy ("way smaller" ✓);
    cron snippet now at the draft's bottom-RIGHT corner (`right-[-6%] bottom-[-56px]`, her round-2
    call; it covers the draft's Comment button corner — flagged, she's seen the layout). NOTE it
    started at left-[-10%] which could overshoot the screen edge — don't return it past left-0.
  · Health room: SubSection got `className`/`bodyClassName` props for per-room spacing; health uses
    `pb-[190px]!` + `md:mt-40!` (breathing above/below). Snippet moved to bottom-LEFT of the table,
    hanging 200px below (`left-[-24%] bottom-[-200px]`) so the table reads. Callout Container
    `pt-[144px]`: 156 rhythm + 144 − 200 hang = measured 100px visual gap to the callout.
  · Miniti flow SLIMMED: labels only (call ends / pass 1 / pass 2 / review queue), title just
    "miniti → vector", no file names or captions; card 290px wide. Round 2: tucked UNDER the
    actions shot (companion `md:z-0`, ProductBlock's shot wrapper `md:z-[5]` — sits between z-0
    and the default z-10 companions) at `left-[calc(-34%_-_20px)] bottom-[-76px]`.
- **Round 3 (same session):** ProductBlock gained `shotClassName`/`copyClassName` per-block
  escape hatches. Follow-ups draft inset `md:mr-[100px]` from its hugged edge (cron snippet
  anchors to the COLUMN corner so it stayed put on screen — that's WHY the inset is on the shot,
  not the column width). Health copy `md:translate-y-[100px]` = centred on the table+snippet
  GROUP (items-center only sees the in-flow shot; the absolute companion doesn't count).
  Collaboration section got the dots texture (same values as Product's TEXTURES.dots — keep in
  sync).
- tsc + lint clean (pre-existing unused-import warning in Observability only). Numeric proof:
  collab 96 / arch 96 / health-callout 100. Screenshots at 1440 of seam, hero texture, and all
  four product rows.

### 2026-07-13 (later) — Matching rebuilt as a horizontal timeline. UNCOMMITTED.
- **Caroline's ask:** turn the four signal InsightCards + the fallback paragraph into ONE
  horizontal timeline, the fallback text as the fifth stop (not named "signal"), copy tightened
  (especially signal #03's).
- **Built in `Matching.tsx`:** five stops on one rail. Dots + rail segments ramp through Vector's
  AI gradient, lilac → peach, interpolated per stop (`RAMP` array in the file) — the four signals
  are filled dots, the fifth stop lands on peach as a HOLLOW ring (the AI stops, a human steps in).
  Labels stay `signal #01…#04`; the fifth is **`no signal` / "Needs your input"**. InsightCards gone
  from this section; layout is open (mono label + `.case-study-label` title + Body per stop).
- **Responsive:** ≥lg it's the horizontal 5-col grid; below lg it turns into a VERTICAL timeline
  (dots left, gradient rail connecting them, copy right, 48px between stops) — five columns don't
  fit at md. Both orientations are separate `lg:`-gated rail elements (a 1px gradient can't flip
  direction by breakpoint without custom CSS).
- **Copy trimmed** per her note, #03 the most: now "The title is scanned for the significant words
  of a company name: 'Acme weekly sync' matches Acme Co through 'Acme', never through 'Co'."
  `VECTOR-COPY.md` §8 stops synced (its extra two-pass BODY + CALLOUT left untouched — pending
  copy, built nowhere).
- **Asset slot kept as a comment:** the incoming "Needs your input" ambiguous-matching shot now
  goes BELOW the timeline, full container width.
- tsc + lint clean; standalone-Playwright verified at 1440 (rail + ramp + alignment ✓) and 390
  (vertical rail ✓, spacing rhythm ✓).

### 2026-07-13 — AILayer shortened (Caroline's call: it repeated itself). UNCOMMITTED.
- **AILayer.tsx cut to: intro (her new 2-para copy) → the two CodeCards → ONE streamed callout.**
  The old callout ("never does the arithmetic") and the whole grounded/efficient/observable
  InsightCard grid are GONE — all three repeated the intro. The callout now carries the only
  non-repeated substance in one sentence: prompt-cached + JSON-schema-pinned + per-call cost
  logging + "$5 a month". Section title "Grounded, efficient and observable" kept (intro pays
  off grounded; callout pays off the other two).
- **Snapshot CodeCard example: Acme Co → Initech** — Caroline archived Acme in the live demo.
  Initech per seed: 9 tasks, 1 done, 3 blocked → health "Blocked" (30%+ rule), go-live
  2026-03-14 → daysToTargetGoLive -121 as of today. daysOverdue 12 is plausible-not-live;
  pin against the real board/logs if she wants exactness.
- **Round 2 (same session): NO price claims.** Caroline: the "$5 a month" figure depends on
  client/onboarding count, so never quote a cost anywhere in the study (Observability's
  "dollar cost" as a logged FIELD name is fine). Callout now: "Every call is prompt-cached,
  pinned to a JSON schema and logged with its cost, and an unchanged board never pays twice."
  Also **CodeCard bg #14141a → #18181E** (her spec) in ui.tsx — affects the Product.tsx
  CodeCard too, not just AILayer's pair.
- **Round 4: Observability reworked** (she called the old one "a bit horseshit": too much text,
  boring usage table, over-simplified pipeline). New shape: 1-sentence intro → **TrackedBoard**
  (the tracked dimensions as BIG mono type, 24/34px, two rows with tiny eyebrows "rolled up by
  feature" / "kept for every call"; `<wbr/>` after each separator is the ONLY break point —
  zero width so desktop stays single-line, phones wrap between terms at 19px; "tokens
  in/out/cached" compacted so row 2 fits 1440 on one line) → short pipeline para → enriched
  PipelineView. **Usage-table ShotRow REMOVED** (`admin-usage-features.png` now unused → add to
  the leftovers pile). PipelineView trace now mirrors the real admin's disclosure anatomy: ▾ on
  open sections, nested ▸ collapsed rows "raw extraction JSON" / "raw tool calls JSON" / "full
  transcript · 20 utterances". Whole section wrapped in a Product-style **dots room** (same 22px
  texture + border-y hairlines + DotGlow; DOTS const has a keep-in-sync comment). Also killed
  the LAST price claim: page metadata "for under $5 a month" trimmed ($0.036 in the pipeline
  trace kept — it's demo data showing cost tracking, not a running-cost claim). tsc+lint clean;
  verified 1440+390, 0px horizontal overflow both.
- **Round 5: TrackedBoard KILLED (she hated the big-type rows) → `UsageView` card.** The
  usage data is back as a table but REBUILT as a designed card in PipelineView's family (she
  loves that treatment): same CARD_FRAME + mono mini-label ("usage by feature / admin · last
  30 days"), REAL columns and feature kinds from the actual admin (`app/admin/ai/page.js`:
  kind/calls/errors/total cost/p95/cache hit; kinds insight_onboarding, insight_portfolio,
  miniti_extraction, miniti_orchestrator, scan_stale_followup), fictional demo numbers. The
  insight_onboarding row is EXPANDED (▾) to "one call, kept in full": tokens in/cache-read/out,
  $0.0041 · 2.9s, request id — the per-call receipt lives INSIDE the rollup, same disclosure
  language as the pipeline card. Cards alternate: usage left, pipeline right (ml-auto), both
  Parallax. Phones: errors + p95 columns `max-sm:hidden`. Verified 1440+390, 0 overflow, tsc+
  lint clean. Table rows need `<Fragment key>` (fragments in a map can't take keys as `<>`).
- **Round 6: copy above, cards overlap.** Both Observability paragraphs now sit together
  above the cluster; the two cards form one overlapping collage on md+ (`md:-mt-16` +
  `relative z-10` on the pipeline Reveal → pipeline covers the usage card's bottom-right;
  scan_stale row still peeks left). BOTH cards share ONE `Parallax speed={-18}` wrapper —
  two separate Parallaxes would counter-drift and make the overlap non-deterministic (the
  cog-tracker lesson). Phones: normal stack (`mt-8`), no overlap. Verified 1440+390.
- **Round 8: NextProject seam = shadow not glow, blobs toned down.** The plate's
  `shadow-[0_-24px_60px_-20px_rgba(192,152,255,0.18)]` lilac glow swapped for the main glass
  seam's dark recipe `0_-32px_70px_-16px_rgba(0,0,0,0.85)` (same as above MyRole). Of the two
  opacity-90 SoftBlobs, the smaller (bottom-16% right-24%, speed -90) was DELETED and the
  remaining one dropped to opacity-50. Verified: seam reads as depth, single subtle glow.
- **Round 7b: Collaboration texture → CHECK (grid) + border-y hairlines.** Her follow-up:
  swapped the dots for Product's `grid` TEXTURES recipe (matches the "ai admin" room —
  thematically right for "Working with AI") and added `border-y border-[rgba(241,234,241,0.14)]`
  on the section so the hairlines land exactly at the texture edges, the Product SubSection
  move. NextProject keeps DOTS (glass plate, has its own rim glint; she didn't ask).
  Verified both edges at 1440.
- **Round 7: Collaboration dots-room boundaries split 100/100 + NextProject dots.** The
  "Working with AI" dots texture used to start flush against Under-the-hood's last line (all
  200px of air lived INSIDE the texture via pt-[200px], and pb-0 meant the texture stopped
  dead before WhatsNext's 120). Now: Architecture `pb-[100px]` + Collaboration `pt-[100px]`,
  Collaboration `pb-[100px]` + WhatsNext `pt-[100px]` (was pt-[120px]) — the texture edge sits
  EXACTLY mid-gap on both sides (all four measured 100 via DOM ruler). NextProject's dark
  glass plate got the same 22px dots recipe (style on the section, under the SoftBlobs).
  Rule to keep: a textured section owns HALF its boundary gap; the plain neighbour owns the
  other half.
- **PROCESS RULE (learned the hard way): NEVER blind-kill port 3000.** Caroline usually has
  her OWN dev server running there; `next dev` from an agent just exits ("Another next dev
  server is already running") and the page you screenshot is HERS. My `lsof -ti:3000 | xargs
  kill` cleanup killed her server mid-session (she saw it as a crash). Before killing:
  check the PID is one YOU started (from your own dev.log); if the server was already up,
  just use it and kill nothing.
- **Round 3 RESOLVED — mix and match (her pick):** context.js keeps the PARAPHRASED snapshot
  card (compact, real field names, seed-true Initech values); insights.js now uses the
  VERBATIM ONBOARDING_RULES excerpt (real const name, real rule numbers 1/4/5 with dim ⋮
  elisions for 2-3 and 6-10, the source's em dash + \\` escapes intact, only hard-wrapped).
  The comparison pair + "option b" label were built, screenshotted at 1440 (both wrap clean),
  then the losers deleted. Rationale: the rules card CLAIMS to quote the prompt so it must be
  exact; the snapshot card is illustrative data so compact wins. daysOverdue 12 still
  plausible-not-live (pin from her real board if she wants exactness).
- tsc + lint clean (a transient stale-buildinfo 'tags' error in Product.tsx self-resolved;
  file never contained "tags"). Playwright skipped for rounds 1-2: removal + text swap, layout
  clear from code.

### 2026-07-13 — IN PROGRESS: Product spice-up round (textures, trace, companions) + Observability/Architecture/Collaboration reworks. UNCOMMITTED.
- **All in the vector worktree.** Product section: 3 "rooms" (SubSection: hairline `rgba(241,234,241,0.14)`,
  vertical `/label` beside the CircuitTrace on md+, textures dots/GRID at 22px), scroll-drawn
  lilac→peach CircuitTrace with per-block nodes, DotGlow cursor-lag highlight (dots-only, no halo,
  EASE 0.08), heading lives INSIDE room 1 (texture starts above it; gap to first block `mb-[78px]!`
  on the heading Container — Tailwind v4 space-y margins live on the PREVIOUS sibling's bottom).
  Hero got the grid texture. TabHead (scroll-lit headings) + tag badges were tried and CUT on
  Caroline's call (TabHead.tsx kept on disk, unmounted).
- **Companions** (corner-pinned cards, md:absolute; mobile in-flow): notifications = NotificationFlow
  (emitActivity() hub diagram, REAL routing from vector lib/db.js; asset 392 + columnWidth 560, card
  bottom-right) · health = lib/health.js snippet (REAL code, bottom-right, dropped low) · follow-ups
  = lib/ai/scan-stale.js snippet (REAL, bottom-left) · meetings = MinitiFlow 2-pass pipeline card
  (bottom-left into the gap). All bands now 90. CARD_FRAME (the framed-Shot surface) exported from
  ui.tsx, shared by every hand-built card. Snippets verified against github.com/jawciu/vector clone
  + local ~/Code/onboarding — they are REAL lines, re-check source before editing them.
- **Observability:** giant admin-usage ShotRow → cropped `admin-usage-features.png` (sharp crop,
  added to SHOT_DIMS) + PipelineView card (recreation of the app's admin Pipeline tab — the live
  tab is auth-gated so it could not be screenshotted; fictional demo data consistent with other shots).
- **Architecture:** 6 prose decisions → 1-line intro + 10-tile mono-ink logo wall
  (public/projects/vector/stack/, simple-icons at f1eaf1; playwright.svg is the OFFICIAL logo
  hand-recoloured to ink duotone) + honest-constraints para + existing callout.
- **Collaboration:** added 3 workflow diagram cards (the pair builder×evaluator / the team
  designer·developer·CEO→decision / the fleet parallel worktrees→main) from Caroline's described
  agentic patterns; METHOD grid kept. Section header unchanged (she wants alternatives proposed first).

### 2026-07-12 — SESSION HANDOFF (Caroline signed off). Product rebuilt as subsectioned walk. UNCOMMITTED WORK IN TREE.
- **WHERE THIS LIVES:** all of today's work is in the `portfolio-vector` WORKTREE
  (`/Users/caro/Code/portfolio-vector`, branch `vector-case-study`, invisible from the main
  checkout). Pushed through `88c937a`; prod (main) untouched. Dev server: background-run servers
  get reaped in agent sessions — have Caroline run `! cd /Users/caro/Code/portfolio-vector && npm
  run dev` herself. Its `node_modules` is a REAL install (was a symlink; Turbopack refuses
  symlinks out of root). `package-lock.json` has a stray fsevents diff from that install —
  intentionally never committed; `git checkout package-lock.json` to clear.
- **UNCOMMITTED (working, verified, tsc+lint clean — commit when Caroline says):**
  Product.tsx (SubSection wrapper: full-bleed hairlines exactly at texture edges, homepage-style
  `/label`, dot texture 22px/5.5% alpha on shared board + ai admin, plain on predictive health;
  order now board → magic-link callout → portal → notifications ‖ health → evidence callout ‖
  AI overview → meetings → follow-ups → review-queue callout; per-subsection L/R alternation) ·
  Matching.tsx (title "Whose meeting was this?", 4 signals as `signal #01–04` InsightCards 2×2,
  refusal para restored in a 2-col row with an EMPTY ASSET SLOT) · AILayer.tsx (title + card
  "cheap"→"efficient", intro cut: no "prompts were the easy part", no "affordable").
- **OPEN INTENT — next session:** (1) Caroline is sending an "ambiguous meeting matching /
  Needs your input" asset → drop into the commented slot in Matching.tsx (`matching-v2.png`,
  add to SHOT_DIMS in ui.tsx, use `bare` if corners transparent). (2) Dial dot texture by eye
  in browser (opacity 0.055 / 22px grid are the knobs). (3) Decide the leftovers: 7 unused old
  assets (~2.9 MB: workspace/board/portal/notifications/insights/ai-drafts/followup.png), dead
  `.cog-label/.cog-callout/.cog-statement` classes + unused `Callout`/`Statement` components,
  and the "I'm still testing retrieval accuracy" line (cut from the review callout — voice
  guide loves it; candidate home: AILayer/Observability/Takeaways).
- **Key decisions (why):** pillar cards + Workspace + AIFeatures + Health sections ALL folded
  into one Product walk — each block now states the DECISION not the feature (phases-over-
  statuses, notification grouping, email curation, two overview altitudes, owner-only
  follow-ups, one-tone-for-now, AI-out-of-scoring). Product shots render FRAMELESS (`bare` on
  Shot) because the v2 crops bake their own chrome — EXCEPTION portal-v2 (opaque, keeps frame);
  this deliberately contradicts the digest's product-visual hard rule for this study. Vector's
  tokens renamed `--cog-*` → `--case-study-*` and `.cog-container` → `.case-study-container`
  (unscoped class was shared with cog's theme.css — route order decided the winner). Vector
  container is 1200px (not the 1080 grid). Callouts capped `max-w-[860px]` at call sites like
  wiki. Page bg `#14141a` — ALSO hardcoded in page.tsx's glass-seam gradient; move both or seam
  lines appear. `Shot` needs every asset in `SHOT_DIMS` (ui.tsx) or reveals go stale on
  client-nav (the wiki bug). Voice guide (case-study/voice.md) got a workout — "cheap" claims,
  colon hinges, negation pivots and mic-drops were all cut on Caroline's instinct; check drafts
  against it BEFORE showing her.

### 2026-07-09 — Matching moved up, NEW Observability section (AI admin showcased), Collaboration section, Takeaways unmounted
- **Status: DONE, staged not committed.** Verified live (0 errors, 0 stuck, all 1484 stream words
  play, punctuation sweep clean). New order: … Health → **Matching** → AILayer → **Observability**
  → Architecture (retitled **"Proper foundations, / fascinating to build"**, was "Boring
  architecture, on purpose" which Caroline disliked; intro now carries her "fascinating" energy) →
  **Collaboration** ("Working with AI" / "I made the calls, / it wrote the code" — the three
  plan/tests/skills cards moved here from Takeaways, plus a short pairing intro) → WhatsNext.
- **NEW `Observability.tsx`**: the AI admin story (per-feature cost/errors/p95/cache-hit rollup,
  every call's token breakdown + request id, pipeline view filterable by processed/ambiguous/
  stuck/errored with expandable extraction → tool calls → drafts). New asset
  **`admin-usage.png`** captured from the live app's /admin/ai Usage tab at DPR 2, sidebar cropped
  (e2e login, no data staging needed). AILayer's "observable" card trimmed to avoid duplicating it;
  AILayer intro no longer says "That is the product story" (Matching now sits before it).
- **Takeaways UNMOUNTED** from page.tsx (TODO comment in both page.tsx and Takeaways.tsx):
  Caroline is writing fresh "Key takeaways" copy. Remount after Collaboration when it lands.
- `VECTOR-COPY.md` restructured + renumbered (15 sections; §13 marked "copy pending").
- **Open intent: Caroline to provide new Key takeaways copy** (she went to yoga mid-brief). Drop it
  into Takeaways.tsx LESSONS and remount in page.tsx after `Collaboration`.

### 2026-07-08 (later) — De-AI voice pass over the whole vector study + voice.md hard rules
- **Status: DONE, staged not committed.** Verified live (0 console errors, all streams play) and a
  rendered-DOM punctuation sweep confirms 0 appositive colons, 0 semicolons, 0 em dashes in copy.
- Caroline audited the tone ("is it mine or AI at times?... I don't use many :"). Fixed her four
  flagged patterns page-wide, **triads explicitly kept** (her call): (1) killed ~24 "X: Y" colon
  hinges + 3 semicolons, (2) flattened aphoristic mic-drops ("no vibes", "An amber you can
  interrogate…", "earned rather than assumed", "Old-school HTML, on purpose", "…a stuck third is a
  stalled project"), (3) reduced "never X. It was Y" pivots (kept the load-bearing "review queue,
  never the live board"), (4) stripped extended metaphors (tape, real bones, rope, swamp, fire,
  seams, "half the calendar"). Also caught + fixed an em dash in the hero caption. Health heading
  is now "On track, at risk or blocked, / with the reasons attached" (was "Never just amber…").
- Both lines she flagged verbatim rewritten in Under the hood; What's next intro/callout rebuilt
  without the rope metaphor.
- **voice.md updated with 5 new hard rules** (almost-no colons/semicolons, no mic-drops, ration the
  negation pivot, no extended metaphors, triads are fine) so future studies start in her register.
- `VECTOR-COPY.md` regenerated to mirror the final copy exactly.

### 2026-07-08 — Round 2 tweaks: Matching section, Results removed, takeaways/what's-next rewritten
- **Status: DONE, staged not committed.** Verified again (0 console errors, 0 stuck reveals, all
  streams play, 0 h-overflow); `tsc` + vector-scoped lint clean.
- **NEW section `Matching.tsx`** (after AILayer): "The right board first, / drafts second". The four
  deterministic match signals from `lib/integrations/miniti.js` (attendee domains from the calendar
  invite → contact emails → title words → transcript mention), the ambiguous "Needs your input"
  assign-then-draft flow, and the two-pass orchestrator highlight (pass 2 reads the board's open
  tasks, "match before you create" — verified in `lib/ai/orchestrator.js`).
- **Pillar #02 tweaks:** meeting → tasks now teases the board-scan ("becomes an update, not a
  duplicate"); "the overview" rewritten around the two altitudes (portfolio triage vs granular
  per-onboarding read).
- **Results section REMOVED** (Caroline: "very fabricated") — `Results.tsx` deleted, stat row gone
  with it. `Stats`/`CountUp` primitives kept in ui.tsx (unused, harmless).
- **Under the hood expanded** 3 → 6 labels: + the stack (Next.js 16 plain JS, Tailwind v4, dnd-kit,
  Vercel cron), + the data (Prisma 7 on Supabase Postgres, transaction vs session pooler), + two
  kinds of auth (Supabase cookies vs magic links).
- **Takeaways replaced** per her brief: plan first, prompt second · tests are the second pair of
  eyes (TRUE: vector repo has Playwright e2e — `e2e/ai-drafts.spec.js`, `e2e/task-ids.spec.js`;
  unit tests framed as upcoming) · when you hit a wall, write a skill.
- **What's next:** "confidence-gated auto-execute" → "evals before autonomy" (evals over follow-ups
  and actions scored against approve/edit/reject, feeding the prompts).
- `VECTOR-COPY.md` synced (Matching = §9, Results gone, later numbering unchanged).
- **Open intent:** Caroline reviewing in browser; may want the old auto-execute / Results copy back
  — both recoverable from git history of the staged tree.

### 2026-07-07 — Vector storytelling restructure: product pillars get their own sections
- **Status: DONE, staged not committed.** Page verified with the standalone-Playwright pass
  (0 console errors, 0 stuck reveals, all streams played, 0 horizontal overflow). `tsc` + lint clean
  (the 2 lint problems are pre-existing in `HeroCopy.tsx` / wiki `Redesign.tsx`).
- **New arc** (Caroline's brief: product first, then tech): Problem → My role → **The product**
  (renamed from Strategy; heading now "Shared board, drafting AI, / predictive health"; keeps the
  callout + 3 pillar cards, stays high level) → **Pillar #01 · Shared workspace** (board + portal +
  notification centre shots, Resend `>` label trio incl. the bounce-webhook-becomes-AI-risk loop) →
  **Pillar #02 · The AI** (follow-ups / meeting → tasks with the Miniti webhook tech bit / the
  overview, each with a shot) → **Pillar #03 · Predictive health** (3 state cards with the real
  computeHealth rules, workspace shot) → **The AI layer** (tech deep-dive: now TWO paired CodeCards,
  the deterministic JSON snapshot from `lib/ai/context.js` beside the RULES prompt; "what ships"
  grid removed, absorbed by Pillar #02) → Architecture → Results…
- **Files:** `sections/Bet.tsx` deleted; `Product.tsx` rewritten (pillars); NEW `Workspace.tsx`,
  `AIFeatures.tsx`, `Health.tsx`; `AILayer.tsx` reworked; `ui.tsx` gained a shared `ShotRow`
  (Reveal → Parallax → Shot); `page.tsx` reordered + 6th ambient SoftBlob; **`VECTOR-COPY.md`
  rewritten to match** (13 sections, new numbering).
- **New assets** (`public/projects/vector/`): `portal.png`, `notifications.png`, `workspace.png`,
  `followup.png` — real screenshots captured from the live onboarding app (port 3001) at
  **deviceScaleFactor 2** (3284px, matching the existing shots). Demo data was staged for the
  captures (Globex made On track, temp contacts Maya/Sam with magic links, real portal actions to
  generate grouped notifications) and **fully reverted afterwards** from a before-state dump; the
  e2e-account sidebar was cropped out of the three vendor shots. The snapshot JSON in the AILayer
  CodeCard uses real Acme values queried from the DB (daysToTargetGoLive -102, AC-3 136d overdue).
- **Open intent:** Caroline to review the new sections in the browser; retake any shot she dislikes
  (the capture recipe is repeatable). Wins panel in `workspace.png` cites the staged completions —
  if she wants a "quieter" wins panel, recapture after the portfolio insight cache regenerates.

### 2026-07-01 — Built the **Vector** case study (DARK theme) on an isolated worktree/branch
- **Status: DONE, staged not committed** (Caroline hasn't said commit). Lives in a **separate git
  worktree** `../portfolio-vector` on branch **`vector-case-study`** (branched off `main` @ c77c3bf),
  so it does NOT touch other agents' trees. `tsc` + `eslint` clean; Playwright motion pass green
  (0 console errors, 0 stuck-hidden, all 6 streams reach `play`, reduced-motion safe).
- **What it is:** `/project/vector` — a build-led AI product case study for Caroline's personal
  project Vector (AI-native B2B onboarding platform, github.com/jawciu/vector, live at vector.quest).
  Framed honestly for a personal project: impact = *what she shipped/engineered/proved*, NO invented
  adoption metrics. Leans hard into the AI engineering (she's job-hunting AI roles).
- **NEW DIRECTION — first DARK case study.** Caroline chose "dark, true to Vector" over the
  cog/wiki light template. Own scope class **`.vector-root`** (never reuse), palette lifted from
  Vector's real DS: bg `#18181e`, elevated `#1d1c24`, text `#f1eaf1`, single accent = Vector action
  lilac **`#c098ff`** (the `--green`/callout-rule/divider/number slot), plus the lilac→peach AI
  gradient (`--ai-from`/`--ai-to`). All shared `.case-study-*` type tokens kept byte-identical; only
  palette + light/dark polarity differ. Glass seam, blobs, NextProject panel all retinted dark.
- **Signature element:** a `CodeCard` primitive (in `ui.tsx`) that embeds **real Vector source**
  (the grounding system-prompt rule from `lib/ai/insights.js`) with an AI-gradient rim + Vector
  sparkle header + mono syntax tinting. Also added `Sparkle` + `Shot` primitives. Screenshots
  (insights/board/ai-drafts) copied from the vector repo `docs/` into `public/projects/vector/`.
- **Sections (11):** Hero · Problem · MyRole (one designer, whole stack) · Bet (AI drafts, human
  approves) · **AILayer** (grounded/cheap/observable + code embed) · Architecture (built solo,
  learnings) · Product (3 shots) · Results (stats: 4 caps / <$5 mo / 16 models / 1 designer) ·
  Takeaways · WhatsNext · NextProject → cross-links to wiki-whisperer.
- **Wiring:** bento Vector card (`VariantBentoSoft.tsx` i===3) gained a `MY CASE STUDY` →
  `/project/vector` action (kept SOURCE CODE + TRY IT); `projectMeta.ts` project-05 de-placeholdered
  (Shipped, real stack/role/oneLiner).
- **To run the worktree:** it needs its own `npm install` (a symlinked node_modules breaks Turbopack;
  dev works via `next dev --webpack`). **Open intent:** review the copy/visuals, then commit/merge
  when Caroline's happy. No real portal screenshot exists (portal described in copy only).
> **Merge note (2026-07-14):** entries below this line are from main's parallel
> cog/wiki mobile sessions, union-merged when main was synced into `vector-case-study`.

### 2026-07-08 — Cog mobile whitespace round 2 (Caroline's 13-item phone list). PUSHED `22db709`.
- **All 13 items applied, `max-sm:` guarded, desktop verified pixel-identical at 1440** (tsc+lint
  clean; 390px walk + numeric gap ruler both re-run). Files: Hero/Interviews/Competitive/Challenges/
  Solution/Results/Strategy/Takeaways sections + `ui.tsx` + `Parallax.tsx`.
- **Highlights of how:** Hero phones now `max-sm:w-[calc(50%-4px)]` (pair spans the tablet's width) ·
  Interviews callout air symmetric 64/64 (cluster `max-sm:mt-16`) · bubble gaps 2-3/3-4 pulled
  `-mt-3`/`-mt-3.5` (30% of MEASURED whitespace bands 39/48px — measured by fullPage screenshot
  row-scan, the alpha-bbox approach lies because cloud lobes aren't where the eye reads the gap) ·
  Competitive reordered on phones via `max-sm:flex max-sm:flex-col` on Container + `order-*`
  (header → logos → both intro paras → screenshots); NOTE: flex items don't margin-collapse with
  children, so inner `mt-6` ADDS to item margins — compensate (para1 got `mt-4` not `mt-10`) ·
  40px above/below every product image in Competitive/Strategy/Solution ("market research" rhythm,
  = old 32 × 1.2) · InsightCard (INSIGHT + PROBLEM cards) padding ×0.6 on phones (`max-sm:px-[22px]
  py-[19px]` in ui.tsx) · **`Parallax` got a `mobile={false}` prop** (adds `min-width:640px` to the
  matchMedia) — used on BOTH Strategy stacks (asked) AND the Challenges tracker phone (not asked but
  required: the drift made item 8's 120px boundary non-deterministic — FLAG to Caroline) ·
  Challenges `max-sm:pb-10` removed → boundary exactly 120 · Solution clusters `max-sm:max-w-[310px]`
  (Strategy-stack size); cluster-2's Highs card overhangs 49px above / 59px BELOW its box, so
  neighbours use mt-12/mt-[100px] to land 40px VISUAL · TestimonialBubble width now a CSS var +
  `max-sm:w-[280px]` cap → all Results bubbles uniform at the smallest size (all 4 quotes fit, checked)
  · video gap doubled (`max-sm:mt-10` + gap-10) · Takeaways heading→grid 112→90 (`mt-[90px]`),
  section pb 60→78 (paragraph→plate gap ×1.3).
- **Measurement recipe that worked:** DOM gap-ruler for box gaps + sharp row-scan of a fullPage
  390px screenshot for INK gaps (background-tolerance ±8 vs #f5f4ef) — needed wherever assets bake
  transparent padding or absolute children overhang their container.
- **Round 3:** cog card padding back to the FULL `px-9 py-8` at every width (matches wiki — she
  prefers that look; hug-height kept). Wiki cards now hug vertically on phones too: the empty
  bottoms came from `auto-rows-fr` on the Redesign/UnderTheHood grids (equal rows are meaningless
  in a 1-col stack) → `max-sm:auto-rows-auto`; desktop rows measured still equal. Also deleted the
  commented-out Body paragraph in wiki Redesign.tsx + its orphan import (was the lint warning).
- **Round 2 (same session, her tweaks):** hero phone gap 8→16 (`max-sm:gap-4`, phones
  `calc(50%-8px)`) · bubble 3-4 pull-up −14→−22 (45% of the 48px band) · InsightCard mobile:
  `max-sm:p-6` (24px) + cards HUG height on phones — minHeight moved off inline style to
  `sm:min-h-[var(--ic-h)]` (desktop verified byte-identical: 420×320/380×260, pad 32/36) ·
  the 40px image rhythm ramped to 48px across Competitive/Strategy/Solution (Strategy's base
  `gap-12`/`mt-12` already = 48 so its round-1 max-sm overrides were DELETED as redundant;
  Solution callout `max-sm:mt-[108px]` = 48 visual past the 59px Highs-card overhang) ·
  Takeaways heading→grid mt removed entirely — the heading's baked 48px mb alone now matches
  MyRole's heading→icon rhythm.

### 2026-07-07 — SESSION HANDOFF (Caroline signed off for dinner)
- **OPEN INTENT — READ FIRST: next session Caroline has WHITESPACE NOTES to give** — she's
  reviewing the mobile spacing on her phone tonight and will come back with specific gaps to
  adjust. Expect a list in the same style as today (per-spot, mobile-only). Everything is
  `max-sm:`-guarded overrides; keep it that way (global rule: mobile changes must never affect
  desktop).
- **State: everything WORKING and PUSHED** through `aab9928` (prod = carolinejaworsky.com,
  auto-deploys from main, ~2 min). Working tree clean except this CLAUDE.md entry + pre-existing
  untracked assets/. Nothing broken, nothing in flight.
- **Today's arc (details in the entries below):** wiki + cog mobile polish (type sizes, ordering,
  spacing rhythm, full-bleed table, home ⌂), the iOS Safari SVG bake (blank-outs + blur — root rule:
  SVGs used via <img> must avoid masks/filters/pattern-image fills), the AutoplayVideo component
  (remember: iOS Low Power Mode blocks ALL autoplay — Caroline's phone was in LPM when she reported
  the Results video "not playing"; retest charged), and the two-stage whitespace audit method.
- **Also flagged, undecided:** cog Hero→MyRole reads 495px on mobile (glass-seam dwell choreography,
  34vh in-hero spacer). Left intentionally; if Caroline wants it tighter, shrink the dwell
  `max-sm` only in `app/project/cog-adhd/page.tsx` (`h-[34vh]` spacer inside StickyHero).

### 2026-07-07 (later 4) — Cog mobile whitespace pass. PUSHED `aab9928` (mega-batch was `b2fd984`).
- **Method (Caroline's call):** numeric gap-ruler script first, then a 31-frame Playwright visual
  walkthrough at 390px — the visual pass caught what numbers couldn't: the Interviews **thought-bubble
  cloud PNGs bake in big transparent margins**, so a 24px CSS gap read as 150-170px. Gap zeroed
  `max-sm` (asset padding alone gives ~80px visual air).
- Boundaries normalised to ~120px on phones: Takeaways→NextProject halved (240→120, double padding,
  same fix as BookingDropoff→JourneyMap); Challenges→Solution topped up (78→~118, `max-sm:pb-10`);
  Strategy vision-stack overflow (box is ~32px shorter than its cards) left 8px before row-2 copy →
  row 2 `max-sm:mt-24`.
- **Left alone deliberately:** Hero→MyRole 495px (glass-seam dwell choreography — flagged, Caroline
  hasn't asked); Findings→Booking "157px" (false positive: empty interior of fixed-height cards);
  Challenges→Solution slight variance (parallax drift ±40px is inherent).
- **Audit recipe for next time:** measure text/img bounding-box gaps per section + BOUNDARY rows,
  then scroll-walk screenshots every 800px and review by eye — assets with transparent padding and
  absolute overhangs only show up visually.

### 2026-07-07 (later 3) — Cog mobile mega-batch (7 fixes). PUSHED `b2fd984`.
- **NextProject squiggle** `max-sm:w-[230%]` (bigger, chopped by section overflow-hidden).
- **Takeaways**: MyRole centring pattern (icon `max-sm:justify-center`, label+body in
  `max-sm:mx-auto max-sm:max-w-[85%]`).
- **Results video**: new `AutoplayVideo.tsx` client component (IntersectionObserver `.play()`
  nudge + pause off-screen; bare `autoPlay` can silently fail on Safari). NOTE: Caroline's phone
  was in **Low Power Mode** (yellow battery, 10-13%) — iOS blocks ALL autoplay in LPM, no API can
  override; retest charged. Video verified playing headless.
- **Solution**: persona chip + prompt cells centred on phones; BOTH clusters reordered `max-sm`
  via CSS order → copy first then mockups (weekly/two-tab text → imgs → symptom/journal text → imgs).
- **Challenges**: bubble first (`max-sm:order-1`), tracker phone `max-sm:max-w-[250px]` (was 360).
- **Methodology sketches**: one horizontal row on phones (dropped `max-sm:flex-col`), each frame
  `max-sm:w-[48%]` → centre frame full, outer two chopped by overflow-hidden.
- **Strategy row 2**: copy above the journal card stack on phones (CSS order).
- All `max-sm:` guarded; desktop untouched. tsc+lint clean; verified via mobile screenshots.
- **Round 2 (same session):** Takeaways grid `max-sm:mt-8` (heading air) · Solution cluster-2
  collage `max-sm:mt-16` (the symptom card's `-16%` overhang ate the 40px grid gap → overlap) +
  callout `max-sm:mt-28` · JourneyMap Katherine photo `max-sm:mx-auto max-sm:w-[180px]` ·
  Challenges bubble `max-sm:max-w-[320px]` + quote `max-sm:text-[13px]` · Competitive row-1 copy
  above the screenshots (`max-sm:order-*`).

### 2026-07-07 (later 2) — Wiki table-under-curve + cog mobile fixes. PUSHED (`0901892`→`6801809` incl. hero SVG bake + logos).
- **Wiki WhatsNext:** dropped `max-lg:pb-24` (added when TEXT was last; the full-bleed table is last
  now) so the table sits flush and NextProject's `-mt-[64px]` curved plate rides over its bottom edge
  — Caroline's ask. The once-covered paragraph ends safely above the table.
- **Cog JourneyMap:** the map was a `min-w-[900px]` h-scroller that read as cut-off on phones →
  `max-md:min-w-0` so it fits the 85% container width on mobile. Desktop identical.
- **Cog Competitive:** the 4 app screenshots had unequal heights (per-pair `w-1/2 max-w-[220px]`,
  differing aspects) → now `h-[280px] md:h-[420px] w-auto` — SAME height everywhere (desktop change
  EXPLICITLY requested). Logos: one horizontal row on phones (`max-sm:flex justify-between`,
  `max-sm:h-4 flex-1 min-w-0`), grid/flex unchanged ≥sm.
- **Cog Interviews personas:** stacked cards overlapped (mascots overhang `-mt-14` = 56px > the
  24px gap) → base gap `gap-6 → gap-20` (only effective <640; `sm:gap-12` unchanged).
- Verified via mobile screenshots (curve over table ✓ map fits ✓ logo row ✓ equal shots ✓ card gap ✓)
  + desktop Competitive (equal heights, new look approved-pending).

### 2026-07-07 (later) — Wiki mobile round 4 + type-size Q&A. PUSHED `cb13ea9`, verified live.
- **Q&A for Caroline (from code):** body 16px all widths · callout 28→22(≤640)→18px(≤480) ·
  fuchsia Stats numbers 44px mobile / 66px md+ · bubble quote 15px (academy bubble 11px ≤sm).
- **Fixes (all `max-sm:` guarded):** callout spacing ×⅔ on phones (Problem/Redesign 104→70 + 24→16,
  Measuring 64→44, Impact 56→36 both sides of the callout) · Redesign screenshot wrappers
  `max-sm:rounded-[10px]` (20px clipped the in-image logo) · **WhatsNext table on mobile** — the
  desktop image is an absolute off-left bleed `hidden lg:block`, phones had NO image; added an
  in-flow `lg:hidden` copy in the standard 16px+hairline frame · Hero tools **Miro → LangGraph**.
- **Vercel gotcha:** the `6b9f68f` push never triggered a build (GitHub had it; prod didn't —
  diagnosed by curling prod for the new asset + grepping live HTML). Any next push deploys HEAD;
  `cb13ea9` carried both. If it recurs, check the Vercel dashboard for the skipped build.

### 2026-07-07 — iOS Safari SVG blank-outs: root-caused + hardened (SVG→PNG for risky assets). PUSHED `a7037a8` + `6b9f68f` (flag-form blur, same family).
- **Symptom (Caroline's iPhone, prod):** parts of wiki images randomly blank — masked icon glyphs
  missing (background cards showed), pin/search panel content missing (frames showed), feedback.svg
  a giant blank. **Restarting Safari fixed it** → NOT a code regression from the mobile batch.
- **Root cause:** iOS Safari rasterizes SVG-in-`<img>` under a strict GPU/memory budget; under
  memory pressure it silently drops the EXPENSIVE subtrees — `mask-type:luminance`, `feGaussianBlur`
  filters, `<pattern>` fills referencing embedded `data:image` bitmaps. Diagnostic tell:
  **research.svg (plain paths, no mask) was the ONLY MyRole icon that never broke.** Desktop
  browsers (and desktop WebKit via Playwright — tested) have no such budget, so it never reproduces
  off-device. Yesterday's resize just nudged rasterization sizes over the budget; flaky by session.
- **Fix: bake risky SVGs to PNG via sharp** (`sharp(svg, { density: 72*scale }).png()` — sharp ships
  with Next). Wiki: design/testing/launch (3x), pin/search/feedback (2x) — research.svg + flag-form.svg
  kept as SVG (plain paths / 1 filter, survived on-device). Cog (same hazard class, found by audit):
  journey-map, image-20/22/23/24/26/27/32 (all `<pattern>`+`data:image`) → 2x PNG. PNGs are all
  SMALLER than the SVGs (feedback 604K→295K, journey-map 1.1M→604K). SVG sources kept on disk.
- **Refs swapped** in wiki MyRole/Feedback + cog JourneyMap/Strategy/Solution. tsc+lint clean;
  pixel-identical renders verified at 390px (wiki MyRole/panels/feedback + cog journey/strategy).
- **RULE for future assets:** SVGs used via `<img>` must avoid luminance masks / filters /
  pattern-image fills — iOS Safari drops them under memory pressure. Screenshot-like art → PNG;
  SVG only for plain-path vector art.

### 2026-07-06 (later 3) — Wiki mobile fixes (Feedback order, bubble overflow, cut paragraph) + mobile home dot. PUSHED `14167f9`.
- **Feedback section mobile order** (`Feedback.tsx`): was header → images → speed/pin/search. Fixed
  with **CSS `order`** (`max-sm:order-2` on the images Reveal — grid respects order), NOT the
  duplicate-and-hide Caroline suggested (single markup, desktop provably untouched). Images now sit
  BELOW the copy, side by side at **1/3 width each** (`max-sm:w-1/3`, container `max-sm:justify-center`;
  removed `max-sm:flex-col`).
- **Academy bubble overflow** (`ui.tsx` + `Impact.tsx`): `TestimonialBubble` art scales down but the
  15px quote text doesn't → the long academy quote spilled out of the bubble on phones. Added
  `quoteClassName` prop; the academy bubble passes `max-sm:text-[11px] max-sm:leading-snug`.
  Other bubbles untouched.
- **WhatsNext last paragraph cut** (`WhatsNext.tsx`): `NextProject` overlaps upward by `-mt-[64px]`
  (glass seam echo); on stacked layouts the flush-bottom copy got covered. Fix: `max-lg:pb-24` on
  the section (lg+ has `lg:min-h` room, unchanged).
- **Mobile home link** (`NavBar.tsx`): the `~/caro/...` path label is `max-sm:hidden`, leaving no
  route home on phones. Added a mobile-only (`sm:hidden`) home Link, left side. First tried the
  favicon orb; Caroline swapped it for **⌂ U+2302 HOUSE** in `font-mono text-sm` (matches the nav
  links' cap height — the glyph draws small in Geist Mono, so text-xs looked undersized), taking
  the shared `pathColor`/`hover` so it flips with the light/dark theme.
- **Verified:** tsc + eslint clean; mobile shots (order ✓ bubble text inside ✓ paragraph clear of the
  plate ✓ dot ✓) + desktop Feedback/navbar unchanged.

### 2026-07-06 (later 2) — Case-study mobile type + MyRole centring. PUSHED `87abb90`.
- **Section headings 28px on phones:** `.case-study-section-heading` clamp floor 1.5rem → **1.75rem**
  in BOTH theme.css files (desktop still 36px; floor holds below ~600px). DESIGN.md updated.
- **H1 32px on phones:** `.case-study-title` mobile (≤640px) 22px → **32px** in both themes.
  DESIGN.md + digest updated.
- **No more unconditional forced breaks in H1s:** Caroline wanted max-width breaks, but MEASURED
  widths prove it impossible (wiki line2 536px > line1+next-word 488px; cog 534 > 510 — any width
  fitting line 2 moves the break). Her pick from options: **responsive break** — keep `<br>` but
  `className="max-sm:hidden"`, plus an explicit `{" "}` before it (JSX drops the newline between
  text and element; without the space mobile renders "Brainfor"). Desktop pixel-identical; mobile
  flows naturally at 32px. Same pattern as the homepage headline.
- **MyRole mobile centring (both studies):** icon `flex h-[72px] justify-center sm:justify-start`
  (cog had it; wiki brought to parity); label+Body wrapped in `max-sm:mx-auto max-sm:max-w-[85%]`
  — the text block centres AS AN ELEMENT while label + copy stay left-aligned to each other.
  sm+ grid untouched. Tune the 85% by eye if she wants more/less inset.
- **Verified:** tsc + eslint clean; 390px + 1440px shots of both studies (desktop breaks identical,
  mobile flows, MyRole centred).

### 2026-07-06 (later) — Mobile polish round 2 (fireball crop-in, card tags/gaps, cog corners, section gaps). PUSHED `9873240`.
- Round 1 committed as `285b415` (main, NOT pushed). Caroline's workflow now: keep committing to
  main, push everything at once when she says. Round 2 changes (all guarded, desktop untouched):
- **Fireball crop-in (mobile ONLY, her explicit choice):** `uCometShift` uniform in
  `heroShaders.ts` (`P.x += uCometShift` right after P) slides the whole comet LEFT so the nose
  gets a slight chop by the screen edge. `Backdrop.tsx`: `MOBILE_COMET_SHIFT = 0.13` below 768px,
  exactly `0` on desktop (bit-identical). Knobs at top of Backdrop.tsx.
- **Card tags fix (stacked layout):** the `■ RESEARCH · UX/UI …` row in `ProjectCard.tsx` was
  `flex flex-wrap` — the joined tags string is ONE anonymous flex item, so on overflow the whole
  text wrapped BELOW the square (square stranded alone). Now normal inline flow: square stays on
  line 1, individual tags wrap word-by-word. (lg+ absolute tags row untouched.)
- **Cog mobile image corners:** `mobileImage` prop gained optional `flushBottom` —
  `rounded-b-none` on the stacked-image wrapper. Set on cog only (its artwork is bottom-cropped
  phones; rounded bottom corners read as a mistake). Other cards keep full `rounded-2xl`.
- **Bento card gaps on phones:** `VariantBentoSoft` stacked column `gap-3` → `max-md:gap-6`.
- **Section gaps halved below md:** Highlights `pb-20→pb-10`; Toolkit `py-24→py-12`; `#work`
  `py-12→pt-6` (desktop `md:pt-20` == old `md:py-20` top, bottom still `md:pb-[168px]`).
- **Verified:** tsc + eslint clean; 390px shots (chop ✓ tags inline ✓ sharp cog corners ✓ bigger
  card gaps ✓ tighter section gaps ✓); 1440px hero (nose NOT chopped, desktop identical).

### 2026-07-06 — Mobile polish round 1 (hero orb row 2x smaller, headline wrap, highlights 1x4). COMMITTED `285b415` (main, not pushed).
- **NEW GLOBAL RULE (added to `~/.claude/CLAUDE.md`):** mobile/responsive changes must NEVER affect
  desktop — always guarded overrides (`max-md:`, width-gated uniform), never rewrites of shipping
  desktop classes/values. Verify widest layout first.
- **Orb row 2x smaller on mobile:** Caroline wanted the BOTTOM orbs (the `DistortedOrb` watercolour
  crescents) halved — NOT the top fireball (I first shrank the Backdrop comet via a `uCometScale`
  shader uniform; she said the fireball was fine before → REVERTED that entirely, `git checkout` of
  `Backdrop.tsx` + `heroShaders.ts` back to HEAD). Final fix: `DistortedOrb.tsx` group gets
  `scale={orbScale}` where `orbScale = canvasWidth < 768 ? MOBILE_ORB_SCALE : 1` via
  `useThree(s => s.size.width)` (reactive on resize). Knobs `MOBILE_ORB_SCALE = 0.5` /
  `MOBILE_MAX_WIDTH = 768` at top of file. Desktop passes exactly 1 = identical. Result: crescents
  sit compactly at the bottom edge on phones instead of flooding up behind the headline.
- **Hero headline mobile wrap:** `HeroCopy.tsx` h1 got `max-md:whitespace-normal` — desktop keeps the
  authored `\n` break after "into" (pre-line); below md the `\n` collapses to a space so it wraps
  naturally ("I TURN EARLY CONCEPTS / INTO LAUNCH-READY / PRODUCTS"), no more stranded INTO.
- **Highlights 1x4 on phones:** `Highlights.tsx` grid `grid-cols-2` → `grid-cols-1 sm:grid-cols-2`
  (md:grid-cols-4 untouched). Bonus: stacked cards give the 0.2em-tracked detail line room — now
  single-line on mobile (the previously-flagged wrap).
- **Verified:** tsc clean; eslint clean except the PRE-EXISTING `set-state-in-effect` in HeroCopy
  (untouched, noted since 2026-06-09). Playwright at 390×844 (all three confirmed) + 1440×900
  (desktop identical). **State: working, UNCOMMITTED** (HeroCopy, Backdrop, heroShaders, Highlights).

### 2026-07-01 (later) — SOLVED (root cause found + fixed): wiki reveals-on-client-nav = unsized hero video
> **2026-07-06: CONFIRMED FIXED by Caroline on prod** (commit `2914006` deployed to carolinejaworsky.com —
> reveals animate correctly on client-nav from the bento card). Bug closed.
- **Root cause (finally):** the wiki hero's promo video (`components/project/wiki-whisperer/sections/Hero.tsx`,
  `public/projects/wiki-whisperer/promo.mp4` = **29 MB, 1920×1080**) was rendered with **no reserved box**
  (`className="block h-auto w-full"`, no width/height/aspect). Until its metadata loads (LATE on a real
  network), the `<video>` is a ~150px placeholder; on load it pops to full 16:9 height. Measured shift:
  **document grows ~930px**. That growth is at the TOP of the page, so it moves every section below it AFTER
  the `Reveal` ScrollTriggers have cached their `"top 85%"` start pixels. On a hard **refresh**,
  `SmoothScroll`'s `document.fonts.ready`/`window load` fire a `ScrollTrigger.refresh()` that recomputes the
  starts once the video settled — so refresh worked. On a **client-side nav** neither re-fires (they're
  registered once in the persistent root layout), and `ScrollReset` refreshes BEFORE the triggers exist +
  BEFORE the video grows (its rAF re-assert uses `update()`, not `refresh()`). So the cached starts stayed
  stale-too-early and every reveal's `gsap.from` completed **off-screen, below the fold** → sections looked
  "already revealed, no animation". Matches Caroline's exact real-browser data ("played climbs 0→2 by y=782
  yet sections look pre-revealed" = the first 1–2 whose start is near scroll 0 still animate; the rest fired
  unseen). **cog works** because its hero is aspect-sized SVG (stable at first paint) — no late shift.
  **Streaming (`StreamingQuote`) survives** because it uses a live `IntersectionObserver` (no cached pixel
  start). **Why nobody reproduced it headless:** on localhost the video loads instantly, so the box never
  goes stale — the bug is *network-timing* dependent, not code-logic dependent.
- **How it was found:** launched a 5-lens multi-agent workflow (GSAP internals / React-Next lifecycle /
  sticky-geometry / web research / differential) → adversarial refute pass → synthesis. The differential +
  research lenses converged on the unsized video. Independently verified locally: (1) reveals ARM (57 hidden)
  and animate fine in dev, prod, and even under 8× CPU throttle → not a logic/position bug in automation;
  (2) **deterministic proof** via a Playwright probe that route-DELAYS `promo.mp4`: old build → video 150→1080,
  **doc grows 930px**; fixed build → video **579→579, doc grows 0px**.
- **THE FIX (applied, NOT committed):** in `Hero.tsx` gave the `<video>` `width={1920} height={1080}` +
  `aspect-video` (kept `h-auto w-full`). Reserves the 16:9 box at first paint → **zero layout shift** when the
  video loads → cached ScrollTrigger starts can never go stale → reveals fire in view on client-nav, no
  refresh needed. Kept Hero a **server component** (dropped an `onLoadedMetadata` refresh idea that would have
  forced `"use client"`). tsc + eslint clean; no visual regression (the video always rendered at this size
  once loaded — now the box is just correct from frame 1, which also kills the CLS jump).
- **State: fix applied + verified locally, UNCOMMITTED** (`M Hero.tsx` only). Per Caroline's rule, not
  committed/pushed. **Next step:** Caroline verifies on a Vercel deploy (real network is where it repro'd).
  A copy-paste console diagnostic (armed-hidden count + snap-vs-animate verdict, survives the client-nav) was
  handed to her in chat if she wants to confirm before/after.
- **Open intent (2026-07-06):** Caroline went to work mid-review — she'll catch up later. IMPORTANT for
  next agent: the bug does NOT reproduce in dev/localhost (video loads instantly there); tell her to test
  either (a) after commit+push+Vercel deploy (the real test), or (b) locally with DevTools Network throttling
  set to "Slow 4G" during the home → wiki-card client-nav. Waiting on her go-ahead to commit `Hero.tsx`.
- **If any residual reveal still misbehaves (belt-and-braces, NOT yet applied):** 2 wiki `<img>` also lack
  explicit width; and the general gap is "no `ScrollTrigger.refresh()` fires after content settles on a
  client-side nav." Optional hardening = add a deferred per-route `refresh()` in `ScrollReset` after
  images/fonts settle. Deferred unless needed (video was the 930px dominant cause; don't thrash).

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
