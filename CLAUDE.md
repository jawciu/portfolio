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

Newest first. Record *why*, not just *what*.

- **2026-06-24** — **Case-study template: hero meta labels → `.case-study-hero-label`
  (16px, extra-bold 800).** Caroline wanted the hero meta labels (brand / summary /
  setting the stage / role / time / tools) at 16px extra-bold. `.cog-label` is shared
  across many sections (Findings/Methodology/JourneyMap/…), so I did NOT resize it —
  added a dedicated reusable `.case-study-hero-label` in `theme.css` and swapped only
  the six hero labels in `Hero.tsx`. Geist Mono is a *variable* font (no `weight` pin
  in `layout.tsx`), so `font-weight: 800` is a TRUE extra-bold here — no text-stroke
  trick needed (unlike Iosevka Charon for the title). Saved to DESIGN.md (token +
  prose). Verified 16px/800 on all six via Playwright. **Committed + pushed.**
- **2026-06-24** — **Started the CASE-STUDY TYPE TEMPLATE** (reusable type tokens
  across every case study, beginning with Cog ADHD). Caroline is tuning the case
  study and wants the type decisions (size/boldness of titles + section headers)
  saved so future case studies repeat them. Renamed the cog-specific heading classes
  to generic, reusable ones in `components/project/cog-adhd/theme.css`:
  `.cog-page-title` → **`.case-study-title`** (the page H1) and `.cog-title` →
  **`.case-study-section-header`** (per-section headings; updated all consumers —
  `ui.tsx`'s `Title`, `Hero.tsx`, `NextProject.tsx`). **Title spec (Caroline's
  numbers):** Iosevka, uppercase, **48px desktop / 22px mobile** (`@media max-width
  640px`), **2 lines on desktop** via a manual `<br/>` after "Opportunities" (3 lines
  fine on mobile). **Extra-bold:** Iosevka *Charon* only ships 300/400/500/700 on
  fontsource (probed the CDN — no 600/800/900), so true extra-bold isn't available;
  faked it by stroking the 700 glyphs in the text colour — `-webkit-text-stroke
  0.6px currentColor` desktop / `0.35px` mobile. Section headers keep the
  `clamp(1.5rem→2.1rem)` ramp at 700. **Saved to the template:** added
  `case-study-title` + `case-study-section-header` typography tokens to `DESIGN.md`
  (front matter + a "Case-study template" prose note documenting the faux-extrabold
  rule). Earlier this session I briefly matched the title to the home hero scale
  (68px) — Caroline reverted that; the home hero and case-study title are NOT the
  same size (hero 68 / case-study 48). **Also (Caroline's global rule, added to
  `~/.claude/CLAUDE.md`):** when she asks a *question*, answer it and change nothing;
  only act on explicit instructions. Verified title sizes/line-counts + the
  faux-bold render via Playwright. tsc + eslint clean. **Committed + pushed**
  this session (cog-adhd theme/sections + DESIGN.md + CLAUDE.md only; left the
  other agent's synapse card files alone).
- **2026-06-24** — **Populated showcase card #3 (`/synapse`) via the reusable
  `ProjectCard`** — from the Figma frame (`figma.com/design/1crZakXfGsPCpxdXIrcjHo`,
  node `95-807`). It's **synapse**, a memory-first reflection agent built at the
  London LangChain × SurrealDB hackathon. Wired into `VariantBentoSoft` as the
  `i === 2` branch (mirrors E.ON `i===0` / cog `i===1`). Copy lifted from the Figma:
  kicker `/synapse`, title "Compounding memory with knowledge graphs and agentic
  RAG", subtitle (Geist Mono lowercase) "built a memory-first reflection agent for
  the london langchain x surrealdb hackathon", tags Product · AI Architecture ·
  Backend. **Year `2026`** (Caroline's call — matches the app screenshot's date).
  **Blob = magenta `#C24E86` → purple `#6D1B76`** (core/edge sampled from the Figma
  glow: bottom-right reads `#C04E82` magenta-pink, outer reads deep purple; edge is
  the same `#6D1B76` E.ON uses), with `coreStop:8 / edgeStop:52`. Updated
  `lib/projects.ts` index 2 (was `project-03` placeholder → real `slug:"synapse"`,
  removed `placeholder`) and added the `synapse` key to `projectMeta.ts` (2026,
  Product & AI Engineer, LangChain/SurrealDB/Agentic RAG/Knowledge Graphs, Concept).
  **Assets** (`public/assets/`): `synapse-logo.png` (the flower-mascot favicon, Figma
  node `103:1380` — re-exported @4× then black bg knocked out in Pillow so the white
  mark floats on the dark card) and `synapse-product.png` (the clean 1488×1022 app
  screenshot raw image — "Map your mind" journaling view; used as-is, opaque). Unlike
  E.ON's transparent SVG / cog's two-phone PNG, this is an opaque screenshot, so the
  `imageClassName` gives it **rounded corners + a drop shadow** and bleeds it off the
  RIGHT edge (`right-[-16%] top-1/2 h-[58%] -translate-y-1/2 rounded-2xl object-contain
  shadow-[0_20px_60px_rgba(0,0,0,0.45)]`) — h-58% keeps its width inside the right 50%
  column so it never overlaps the copy (same overflow rule as the cog card). No `href`
  yet (no case study built — like E.ON). Verified via the standalone-Playwright trick
  (1440 + 1600@2×, card open): tsc + eslint clean, 0 console errors, screenshot clears
  the copy and matches the Figma. The 2 remaining cells (`project-04/05`) still use the
  old centred placeholder layout. **UNCOMMITTED** pending Caroline.
- **2026-06-24** — **Shared sticky glass NavBar across all pages**
  (`components/NavBar.tsx`, mounted once in `app/layout.tsx` inside `<Providers>`).
  Caroline: make the home top-bar row a sticky glass navbar shown on every page;
  rename `[ WORK ]` → `[ PROJECTS ]`; it must always link back to the HOME sections
  so you can navigate out of a case study. Left = `~/caro/portfolio/2026` → `/`
  (home/hero); right = `[ PROJECTS ]` → `/#work`, `[ ABOUT ]` → `/#about`.
  **Theme-aware:** `usePathname()` → light routes (`startsWith("/project")`) get
  dark text + cream glass `rgba(245,244,239,0.62)`; everything else (dark site) gets
  light text + dark glass `rgba(7,7,9,0.5)`; both `backdrop-blur-md saturate-150`
  with a hairline bottom border, `transition-colors`. **Smooth nav:** on the home
  page a click handler intercepts same-page anchors (`scrollIntoView`/`scrollTo top`,
  smooth); from another page the Next `<Link>` navigates to `/` + hash natively
  (Lenis has no anchor handler, so cross-page hash lands via native scroll). Removed
  the old inline `<header>` from `app/page.tsx` (now `<NavBar/>`'s job) and the
  case-study's own `Nav` section (deleted `sections/Nav.tsx`, removed the
  `data-cog="Nav"` wrapper); added `pt-14 md:pt-16` to the cog-root `<main>` so the
  confetti hero clears the fixed bar. Verified both themes + cross-page nav via
  Playwright (PROJECTS from the case study → `/#work`), tsc + eslint clean.
- **2026-06-24** — **Started the Cog ADHD CASE STUDY page** (the page that opens
  when you click the `/cog_adhd` showcase card; a *separate* "another cakes" agent
  owns the card itself — don't touch `VariantBentoSoft`/`ProjectCard`). Caroline:
  reconstruct her old Framer case study (`carolinejaworsky/cog-clinic-research-and-
  strategy`) "as close as possible… match the pdf exactly", using a divide-and-
  conquer team of builders + evaluators (Playwright vs the PDF). Source: the Framer
  PDF export + 59 exported assets in `~/Documents/Framer website/Cog clinic research
  assets/`. **DECISIONS (Caroline):** (1) **Route `/project/cog-adhd`** (singular
  "project", per her pick) → `app/project/cog-adhd/page.tsx`. (2) **LIGHT theme,
  match the PDF exactly** — the dark portfolio card opens into a light cream case
  study (each case study keeps its own identity). Scoped via `.cog-root` in
  `components/project/cog-adhd/theme.css` so the light palette NEVER leaks into the
  dark site. (3) **Fonts:** product-visual mockups keep their baked-in fonts (they're
  images); all page copy uses the homepage stack — Iosevka `--font-hero` for titles,
  Geist Mono for mono labels/pull-quotes, Geist body — "won't 100% align, evaluate
  later." **Build structure:** page = 15 section components under
  `components/project/cog-adhd/sections/` (Nav, Hero, MyRole, Interviews, Competitive,
  Findings, BookingDropoff, JourneyMap, Strategy, Methodology, Challenges, Solution,
  Results, Takeaways, NextProject), each owned by one builder (no file conflicts);
  shared read-only primitives in `ui.tsx` (`A()` asset helper, `Container/Kicker/
  Title/Body/Callout/Statement`) + helper classes in `theme.css`. Assets copied to
  `public/projects/cog-adhd/` with clean names (`Image(10).png`→`image-10.png`;
  `_namemap.json` records the map; the big journey map kept its name
  `cog-clinic-current-journey-map.svg`). Build spec (per-section copy + PDF reference
  crop + asset hints) is in the session scratchpad `SPEC.md`. PDF rendered to readable
  bands + a labeled asset catalog via poppler+sharp+playwright (installed poppler).
  **DONE (v1):** 15 builders built all sections in parallel; 15 evaluators scored
  each vs the PDF (most 82–95/100), 2 fixers patched the misses — **Competitive**
  (asset filenames were off-by-one: `image-11.png` is the mood-picker screen, not the
  Agave logo; logos are `image-12..16` = Agave/inflow/HelloSelf/shimmer/bloom) and
  **Methodology** (the 9 hand-drawn wireframes are the composite PNGs
  `image-29/28/30.png`, NOT `image-32..39` which are portraits/illustrations/finished
  dashboards). tsc + eslint clean, 0 console errors. Page renders end-to-end and
  closely matches the PDF. Reachable directly at `/project/cog-adhd`. **CARD WIRED
  (2026-06-24):** added an optional `href` prop to `ProjectCard` — clicking the OPEN
  card `router.push(href)`s (collapsed click still just opens it, preserving the
  hover-to-expand UX; `cursor-pointer` + `aria-label` only when open+href). The Cog
  card (`VariantBentoSoft` i===1) passes `href="/project/cog-adhd"`. Verified via
  Playwright: click open Cog card → navigates. (E.ON card has no href yet — its case
  study isn't built.) Verification
  harness `scripts/_cogshots.mjs` (untracked) screenshots each `[data-cog]` wrapper in
  page.tsx → scratchpad/cog-shots/. Possible polish later: Hero confetti-band crop,
  Solution bubble scatter, exact spacing — evaluate in-browser.
- **2026-06-24** — **Populated showcase card #2 (`/cog_adhd`) via the reusable
  `ProjectCard`** — Caroline: "create another project card… following the component
  we built, but card 2 with different copy/assets" from a Figma frame
  (`figma.com/design/1crZakXfGsPCpxdXIrcjHo`, node `65-1214`). It's an ADHD
  therapy/check-in app. Wired into `VariantBentoSoft` as a new `i === 1` branch
  (mirrors the `i === 0` E.ON branch). Copy from the Figma: kicker `/cog_adhd`,
  title "GAPS AND OPPORTUNITIES IN ADHD THERAPY PROCESSES", tags Research · UX/UI ·
  Testing · Launch. **Brand `cog_adhd` + year `2025`** (Caroline's call — the Figma
  shows neither; app screens reference 2023 & 2025). **Blob = amber `#F2922E` →
  green `#189E71`** (she asked amber→green; green sampled from the app's own chart
  UI — vs E.ON's coral→purple). Updated `lib/projects.ts` index 1 (was the
  `project-02` placeholder → real `slug: "cog-adhd"`, removed `placeholder`) and the
  `projectMeta.ts` key (`cog-adhd`, 2025, Shipped). **Assets** (in `public/assets/`):
  `cog-adhd-logo.png` (the orange-mascot app icon, Figma node `65:2246`) and
  `cog-adhd-product.png` — a transparent two-phone composite I built in Pillow from
  the two "Check in history" screens (Figma `65:1820` + `65:1885`, exported @3×,
  placed at their frame-relative offset 259px), so the glow stays a CSS blob like
  E.ON rather than baked in. Verified in Playwright (1440×900, expanded + collapsed,
  0 console errors); tsc/eslint clean. **FLAG for Caroline:** the Figma's subtitle
  ("improved cognitive load by giving users agentic rag that answers their
  questions") is *identical* to the E.ON card's — looks like placeholder copy left
  in the design; rendered faithfully for now, swap when she has real copy. The 3
  remaining cells (`project-03/04/05`) still use the older centred placeholder layout.
  **Fixes same day (Caroline review):** (1) the phone exports had opaque near-black
  (`#0F0F0F`) filling the rounded-corner triangles + phone-2's bottom-right cutout —
  stripped via an edge **flood-fill** in Pillow (BFS from the border removing
  connected dark pixels, leaving interior black TEXT untouched since it's ringed by
  the cream screen), re-composited (`?v=2`). (2) Product visuals now sit **flush to
  the card's bottom edge** with the **right phone touching the right edge** — added an
  optional `imageClassName` prop to `ProjectCard` (default stays E.ON's centred float)
  and passed `absolute bottom-0 right-0 h-[90%] object-bottom` for cog_adhd; verified
  in Playwright (img box gapRight/gapBottom = 0). **Round 2 (Caroline):** that
  bottom/right-anchored treatment made the phones read too big + the left phone
  crowded the title, and the right phone's bottom-right showed a transparent notch
  (the former black cutout) instead of being clipped by the card. Fix: kept the
  ORIGINAL size/horizontal placement and only changed the vertical anchor →
  `right-[-6%] bottom-0 h-[88%] object-left` (phones bleed off the RIGHT edge, cut
  by the card, now dropped flush to the bottom). And **filled phone-2's bottom-right
  cutout with the screen cream** in Pillow (`?v=3`) so the phone reads solid there —
  the card's `rounded-3xl` corner does the rounding (Caroline: the corner "was
  rounded because it was cut by the card edges and it should stay like this").
  Note: MCP Playwright screenshots kept timing out (5s) on the live-WebGL page;
  captured via a throwaway standalone `@playwright/test` script (real `.hover()` to
  trip React's `onMouseEnter`, then freeze + element screenshot) — keep that trick
  for this page. Caroline also replaced the subtitle copy herself in
  `lib/projects.ts` (real copy now — the earlier "identical to E.ON" flag is closed).
  **Round 3 (Caroline, with the Figma open):** phones STILL too big + overlapping
  the title. Root cause: the img height is `%` of the CARD height, but on the wide
  expanded card (flex-grow 6 ≈ 60% of the row → ~768px wide × 560 tall) an 88%-tall
  image is ~542px WIDE, which overflows the 50% copy column and spills left over the
  text. Fix = shrink to `h-[56%]` so the image width (~357px) stays inside the right
  half → phones sit fully on the right, clear of the copy, ~55% height (matches the
  Figma `node 65-1214`). Final class: `right-[-10%] bottom-0 h-[65%] object-left`
  (Caroline bumped 56%→65% — "slightly bigger"; still clears the copy).
  KEY LESSON for these device cards: pick a height % low enough that
  `height%·cardH·aspect ≤ 50%·cardW`, else the artwork overflows the copy column.
  **Round 4 (Caroline):** "more amber visible in the gradient." The bloom centres at
  the bottom-right corner with amber at `0%` → green by `48%`, so amber barely
  reached the visible card. Added optional `coreStop`/`edgeStop` (radius %) to
  `CardBlob`/`bloom()` — E.ON defaults (`0/48`) reproduce the old ramp exactly.
  FIRST try (`coreStop 30 / edgeStop 64`) was wrong — moving edgeStop GREW the
  bloom's footprint, which Caroline didn't want. Corrected to `coreStop 34` with
  edgeStop left at the default 48, so the amber holds further into the visible inner
  bloom but the green stop + 80% fade (the blob's size/spread) are UNCHANGED.
  Then `coreStop 34` read too HARD (defined amber→green edge); `coreStop 12` softened
  it but pulled the amber back too far. Landed on `coreStop 20 / edgeStop 66`: amber a
  little bigger AND the amber→green blend band much WIDER (20→66) for a soft
  transition (Caroline: "make the transition area bigger, not the amber"). Key insight:
  the `edge00` fade is always at 80% so the blob's OUTER size never changes — widen the
  transition with `edgeStop`, grow amber with `coreStop`; they're independent.
  **Round 5 (Caroline):** "make the green→black more diffused — black should leach to
  green for longer." Added a 3rd optional stop `fadeStop` (default 80 = the old
  hardcoded transparent point) and set cog_adhd to `96`, so the green fades to
  transparent over a longer outer band = softer step. BUT pushing `fadeStop` to 96
  GREW the blob (Caroline: "I wanted the same size, just more dark going in"). Correct
  approach: keep `fadeStop 80` (original outer size) and pull `edgeStop` INWARD (66→50)
  so the green recedes and the green→transparent fade spans a longer band inside the
  same footprint — dark leaches further in, softer step, same size. Final cog_adhd
  blob: `coreStop 30 / edgeStop 50 / fadeStop 80` (Caroline's final nudge). E.ON omits all three → unchanged.
  (Earlier card work through `79f288c` is committed + pushed; this amber tweak is
  uncommitted pending Caroline.)
- **2026-06-16** — **Extracted the E.ON Next showcase card into a reusable
  `ProjectCard` component** (`components/sections/prototype/ProjectCard.tsx`) —
  Caroline: "the /e.on_next card is looking good, make it a component we can reuse
  for other cards (spacing, fonts, gradient blob, etc.)." It owns the whole card:
  collapsed spine wisp ↔ open corner-blob crossfade, the glass stack (rim glint +
  static 115° sheen + grain), and the split expanded layout (year top-left; logo +
  mono kicker `/e.on_next`; Iosevka title sized to two lines; lowercase **mono**
  subtitle at full fg; tags pinned bottom-left; transparent product visual floating
  off the right edge over the blob). Props are explicit (`label`, `logo?`, `image?`,
  `tags?`, `blob {core,edge}`, …) so a new project = one `<ProjectCard>` call. The
  blob recipe is generalised (`circle 820px at 98% 112%`, core→edge→`edge`+`00`
  transparent); the E.ON card passes coral `#C05846` → purple `#6D1B76`. Project 01
  now renders via it (verified pixel-identical). The 4 placeholder cells keep the
  older centred layout inline in `VariantBentoSoft` (no story/visual yet) — migrate
  each to `ProjectCard` when it gets real content. Documented as `project-card` in
  DESIGN.md (front-matter token + Components prose). Product visual swapped earlier
  this session to the transparent SVG (`/assets/eon-next-product.svg`, node 67_2764
  = conversation + "Ask anything" input); removed the now-orphaned
  `e.on.next_product_asset.svg` (conversation-only) and `nest-chat.png` (the baked
  grey PNG that read awful). The card shine is **static** (Caroline cut the moving
  versions — both the scroll-driven diagonal sheen and a conic border-orbit).
- **2026-06-16** — **Added `DESIGN.md` (design-token source of truth) + a `design-md` skill**
  (Caroline's ask: document design decisions in the structure of
  `github.com/google-labs-code/design.md`). `DESIGN.md` at the repo root follows
  that format: YAML front matter = machine-readable tokens (`colors` incl. the
  near-black surfaces, fg, accents, and the `flame-*`/`orb-*` holographic
  spectrum lifted from the shaders; `typography` for the 3 live families;
  `rounded`; `spacing`; `components` for glass-sheet/glass-card/labels), then the
  canonical markdown sections (Brand & Style → Colors → Typography → Layout →
  Elevation & Depth → Shapes → Components → Do's & Don'ts) holding the rationale
  + guardrails. Tokens were read from the actual code (`globals.css @theme`,
  `layout.tsx` fonts, `VariantBentoSoft`/About class lists) so doc = build. The
  `.claude/skills/design-md/` skill tells agents to READ DESIGN.md before any
  visual work and UPDATE it when a decision changes a token/rule (vs CLAUDE.md =
  the narrative of *how* we got there); it documents the format rules + the
  token⇄codebase mapping. NOTE recorded in the doc: Bricolage Grotesque
  (`font-display`) is loaded but DORMANT — only in archived/commented showcase
  variants — so the live system is 3 fonts (Iosevka/Geist/Geist Mono).
  **`bg` `#070709` is now FINAL** (Caroline confirmed 2026-06-16 — resolves the
  2026-06-10 "TESTING/verdict pending" unification); "testing" framing stripped
  from `globals.css` + DESIGN.md.
- **2026-06-15** — **Glass pass on bento2 cards + Toolkit turned into a glass dock**
  (Caroline: make bento2 cards glassy + make the toolkit icons glass like an OS dock).
  No reference image was actually attached — used the project's own glass language
  (About recipe: frost + specular sheen + rim glint). **bento2** (`VariantBentoSoft`):
  each cell is now a distinct frosted glass card (`rounded-3xl`, `overflow-hidden`,
  `backdrop-blur-xl`, translucent gradient, hairline rim glint + 115° sheen + white/10
  border) with the colour pool glowing BEHIND/through it (pools moved from `-inset-4`
  bleed to contained `inset-0`; gap-0 → gap-2/3 so cards read as separate panels). The
  grow/spine hover interaction is unchanged. NOTE: this reverses bento2's original
  "no boxes/borders" concept on purpose — she now wants visible glass cards.
  **Toolkit** rewritten as a glass dock STRIP (`components/sections/Toolkit.tsx`):
  full-bleed glass band (translucent gradient + `backdrop-blur`, lit top + dimmer
  bottom hairline = the two "glass edges") carrying a `Marquee` (reverse = travels
  left→right, NO pauseOnHover, 70s — slow) of squircle icon tiles, each with a glossy
  top-sheen coating + inset rim light. NO hover effect (Caroline cut it). The strip's
  bg, edges AND icons all dissolve into the dark at both screen ends via ONE horizontal
  `maskImage` on the wrapper. **Loop-gap fix:** with only ~15 icons one marquee copy is
  narrower than wide viewports → the row "started halfway"/left a gap; fixed by
  rendering `LOOP = [...APPS, ...APPS, ...APPS]` so one copy always exceeds the
  viewport. Label `/toolkit` (one slash, lowercase, matched to `/about`:
  `text-xs md:text-sm tracking-[0.2em] text-fg/70`). Tiles use plain `<img>` (so SVG +
  png/webp/jpeg all work without next.config). Icons in `public/assets/toolkit/`. Set
  now design→build→AI: figma, illustrator, PS, miro, asana, obsidian, cursor, **github,
  vercel, supabase** (added 2026-06-15 from `cdn.simpleicons.org` — bare brand glyphs,
  `contain:true` = object-contain + padding on the dark tile, vs object-cover for full
  app-icon art), iterm, claude, claude code, midjourney, whispr flow (`images.png`).
  Some source art is low-quality; Caroline will swap better versions later. Decided WITH
  her: keep dev tools (Vercel/Supabase/GitHub) under "toolkit" not "tech stack" — the
  blend signals design+build range for the product-engineer applications she's targeting.
  Later same day: +7 "product-journey" tools inserted between asana and the dev cluster
  (NotebookLM, Mixpanel `contain`, Marvin, Spline, ChatGPT, Miniti, Google AI Studio
  `contain`) → 22 icons total. Caroline grouped them as product-journey, not dev.
  **Quality note:** NotebookLM / Marvin / Spline source art has WHITE backgrounds → they
  render as bright tiles in the dark dock (flagged; she'll swap transparent/dark versions).
  Unused extras still in root `assets/`: `surreal.svg` (SurrealDB?) + `images.jpeg` —
  not added, awaiting her word. Then +Framer (design cluster) +Raycast (dev cluster),
  both `cdn.simpleicons.org` glyphs (`contain`, framer white, raycast brand-red) → 24
  icons. (Discussed more: she'll look at Rive; skipped Linear — her work uses Jira; and
  v0 — she "Claude Codes everything" now.) Then +SurrealDB (`surreal.svg` from assets →
  `surrealdb.svg`, full squircle app icon = object-cover) +Opik (LLM eval; simpleicons
  has none — pulled the wordmark SVG from the comet-ml/opik GitHub readme, cropped it to
  just the orange→red icon mark: stripped white rect + wordmark paths, viewBox
  `36 35 290 290`, `contain`). → 26 icons.
- **2026-06-15** — **Icon glass reworked to Apple liquid-glass (`Toolkit.tsx`).** Per
  Caroline + her macOS-dock ref: each tile now has (1) a soft face sheen (radial, upper-
  left) and (2) a RIM shine = a `conic-gradient` (`RIM_SHINE`) with two bright arcs at
  OPPOSITE corners (~135° bottom-right, ~315° top-left) so the top and bottom edges are
  each half-lit, in opposite halves. The rim is a masked border ring (`RING_MASK` =
  content-box/border-box mask-composite exclude → only the 1.5px padding band shows) with
  the conic as an oversized child rotated by `transform: rotate(var(--shine))`. **Scroll-
  driven:** one rAF-throttled scroll handler in Toolkit sets `--shine` (= `scrollY*0.16`
  deg) on the section; all rims inherit it (cheap — one var, GPU rotate; reduced-motion
  bails). Verified the var moves (233°→314° over a scroll) and the highlights sweep.
  Dial knobs: `RIM_SHINE` stops/peaks (0.55/0.7), `RING_MASK` padding (ring thickness),
  the `*0.16` scroll→deg factor.
  **Card width** (Caroline wanted bigger cards / less side whitespace on laptops): was
  `max-w-6xl` (1152px); now `max-w-7xl` (1280px) → `2xl:max-w-[88rem]` (1408px ≥1536px
  viewports), height clamp `400→560px`.
- **2026-06-15** — **Project showcase locked to bento2** (`VariantBentoSoft`, the
  "Diffused grain mosaic") to iterate on it. Caroline picked it as the direction.
  `ProjectShowcasePrototype.tsx` now just `return <VariantBentoSoft />` — the variant
  switcher, `?variant=` URL routing, and the other 5 variants (current carousel, shell,
  shell2, deck, bento) are **commented out, NOT deleted** (restore by uncommenting). The
  floating switcher bar is gone from `#work`. Other variant files + `PrototypeSwitcher`
  untouched on disk. Next: iterate on bento2 + the apps view. tsc/eslint clean.
- **2026-06-10** — **GlassRail (and ONLY GlassRail) unmounted from the hero.** What
  Caroline actually wanted gone was the two glass elements that scroll with the page:
  the left sphere+tall-pill pair and the right accent pill — i.e. exactly `<GlassRail>`.
  Removed just that import/mount from `Scene.tsx`; `Effects`, `Environment`, GPU
  tiering, TelemetryRail and reduced motion are ALL still in place and wanted.
  (Context: an earlier broader slim-down — glass + postprocessing + tier fallbacks —
  was fully reverted same session at her "omg no!"; don't remove those without asking.)
  `GlassRail.tsx` kept on disk unimported; `mapping.md` records the removal. Verified:
  tsc clean, 0 console errors, hero mid-scroll screenshot shows no glass, bloom intact.
  Possible later cleanup if this sticks: `GlassRail.tsx` + its `public/assets`
  textures (iridescent-sphere/pill-1/pill-2) + the `Environment` block (its only
  consumer was the glass).

- **2026-06-10** — **TESTING: `--color-bg` unified to `#070709`** (the hero canvas clear
  colour / `uBg`) so the hero base and the page plate are the same near-black — Caroline
  asked to try it; verdict pending. Changed: `globals.css` token (was `#050507`), plus the
  hardcoded `rgba(5,5,7,…)` → `rgba(7,7,9,…)` in About's sheet gradient + portrait vignette
  (they must always match the token or a seam line appears at About's bottom edge). To
  revert: flip those three spots back. `--color-bg-elev #0a0a0d` untouched.
  **Gotcha discovered:** editing the `@theme` block in `globals.css` did NOT hot-reload —
  the browser kept serving `--color-bg: #050507` while About's inline-style gradient updated
  to `#070709`, creating a 2-point luminance step (Caroline saw a harsh line) at the About →
  Toolkit junction. Fix was just `touch app/globals.css` to force the Tailwind recompile.
  After ANY token edit, verify with `getComputedStyle(document.documentElement)
  .getPropertyValue('--color-bg')` in the browser — don't trust the source file.
- **2026-06-10** — **ProjectsMarquee bands removed from the page; Toolkit moved into their
  slot** (Caroline's call). `page.tsx` order is now About → Toolkit → `#work` showcase, all
  on the opaque `bg-bg` plate. `ProjectsMarquee.tsx` is kept on disk but unimported — delete
  it if the direction sticks. Toolkit tiles are still numbered placeholders awaiting real
  program icons; its `// toolkit` label predates the `/about`-style directory language.
- **2026-06-10** — **About bio replaced with Caroline's own copy** (4 paragraphs, decorative
  unicode sprinkles ˚⊹✧♡❀☆⋆✦✿, lowercase sentence starts — ALL intentional, don't "fix").
  `BIO` in `About.tsx` is now a template literal with `\n\n` breaks; paragraph breaks
  survive via `whitespace-pre-line` on the StreamingText className (StreamingText renders
  plain text into one `<p>`, so without it newlines collapse). Stream verified end-to-end.
- **2026-06-10** — **Glass projects band tried, then REVERTED — Caroline prefers the black
  plate.** She'd seen a straight line scrolling into the marquee (the orb glow through the
  About glass cut dead by the opaque `bg-bg` wrapper's top edge — confirmed via Playwright
  screenshot). Experiment: marquee moved out of `bg-bg`, About's gradient ending translucent
  (0.66), the band continuing the frost and easing to solid. It worked (no line), but
  Caroline judged the original black background better and asked to go back — current state
  is the ORIGINAL layering: `ProjectsMarquee` inside the `bg-bg` div, no glass on the band.
  Caroline then still wanted the sharp EDGE itself gone (just blurred, black plate kept).
  Three-part fix, each verified by screenshot + a pixel-row luminance scan (rows now fade
  monotonically to rgb(5,5,7), zero step): (1) About's gradient eases into solid with
  closely-spaced stops, landing at 97% (`0.66 @55% → 0.82 @72% → 0.93 @84% → 0.98 @92% →
  #050507 @97%`) — a linear ramp ending at the edge reads as a Mach band against the orb
  glow; (2) the diagonal sheen overlay (mix-blend-screen, ~4% white at bottom-right) was
  silently ending in a hard cut at the section edge — THE main visible line — now masked
  out vertically (`black 78% → transparent 96%`); (3) `-mt-px` on the `bg-bg` div — at
  fractional DPRs a sub-pixel gap opened between the sections and the bright fixed canvas
  shone through as a warm hairline.
  Same session, **"directory" type language extended** (kept): marquee text is lowercase
  `projects` with a magenta `/` separator (was `PROJECTS ✳`); About's label is `/about`
  (was `// ABOUT`), styled identically to the top-left `~/caro/portfolio/2026` path label.
  All the small mono labels were bumped to `text-xs md:text-sm` (12/14px — Caroline found
  11/12px too small; path label + `/about` must stay the SAME size, per Caroline), and the
  hero role line ("Product Designer • AI Builder") to `text-sm md:text-base` (14/16px).

- **2026-06-10** — **Scroll-driven liquid-glass motion on the About portrait** (Caroline:
  "shine that moves when you scroll"; researched Apple Liquid Glass first — its signature
  is specular highlights that MOVE with device motion, so scroll stands in for tilt).
  V1 was a straight diagonal streak sweeping the photo — Caroline redirected with a glass
  sphere reference: reflections must be **curved arcs hugging the rim, light AND dark,
  following the circle**. Final build (`ARCS` const in `About.tsx`): three annular bands —
  each a `closest-side` radial ring gradient cut to an arc by a conic-gradient mask,
  `blur(3px)` — (1) broad crown highlight across the top (0.13 white, wide), (2) crisp
  bright arc lower-right (0.30 white, thin, hugging 84–96% radius), (3) shadow arc
  lower-left (0.50 black). They're SIBLINGS of the masked disc (the dissolve would dim
  rim-radius content to ~0.2–0.3 alpha — same reason the glass ring lives outside), and
  scroll ROTATES each at a different rate/direction via scrubbed ScrollTriggers
  (`useGSAP`, scope = section ref, `scrub: 0.6`) — reflections slide around the rim like
  the sphere is turning. Reduced-motion-safe via `gsap.matchMedia`. Rim glint stays
  light-right/shadow-left (`from 180deg`). **Round 2 (Apple Podcasts Liquid Glass icon
  ref + Icon Composer research — "crisp specular highlights preserve contrast at the
  edges", lit from above):** dropped the lower-left shadow arc (too much), shrank the
  crown (~44° core span), and gave both remaining arcs ASYMMETRIC edges — long soft ramp
  from the inside (light dispersing into glass) to a peak, then a hard cut at the outer
  radius (the crisp specular line). No blur filter on arcs — softness lives in the
  gradient stops; a blur would kill the crisp outer line. **Motion-visibility fix**
  (Caroline couldn't see it; transforms verified changing — the rotation was just spread
  over the section's whole viewport transit, so little played while the disc was
  on-screen): ranges widened to crown -75→75, lower-right 95→-50, ring -60→60 (commit
  `eccbf3c`). If still too subtle/strong, these ranges are the dial. Polish round: outer
  edges of both arcs softened a touch (fade ~doubled — still the "sharp" edge, just not
  knife-cut), and ONE glint hotspot added — a small bright oval nested INSIDE the
  lower-right arc layer (so it orbits with it on scroll, no extra animation), offset
  right of the arc's centre (~105° around the rim). Caroline explicitly wanted a single
  glint, bottom arc only, off-centre — tried top + both first.
- **2026-06-09** — **Real portrait in About** (`public/assets/portrait.png`, from
  `~/Downloads/portfolio ideas/me.png`): a circular cut-out PNG with transparent corners,
  so the old rounded-square card + border was dropped. Caroline then asked to drop the
  radial pool behind it too (read as a "square placeholder"), and to make the photo itself
  **look glass**: it now sits under a circular glass lens — diagonal sheen
  (`mix-blend-screen`), glare arc near the top-left rim, hairline ring + top glint, and an
  inset bottom shadow so the disc reads curved. Same specular language as the About sheet.
  Plus a **blur vignette**: a second blurred copy of the image (`blur(20px)`) masked to the
  rim with a radial `maskImage` (transparent ≤32%, opaque ≥76% — Caroline asked for the
  melt spread further inward), and a **dark vignette** on top (radial, transparent 52% →
  rgba(5,5,7,0.55) at the rim) to seat the disc into the dark page. Then "clear ring"
  feedback → removed the hairline ring/glint layer entirely and masked the WHOLE disc with
  a 4-stop radial alpha fade (black 42% → 0.62 @64% → 0.22 @82% → transparent 95%), so the
  photo dissolves into the page with no clipped edge — orb-style. Final pass (after commit
  `95467ce`): **true orb edges** — photo inset with `p-7` inside its box and the
  `overflow-hidden rounded-full` clip removed (the PNG's own transparency is the circle),
  so the rim copy's blur SMEARS content outward past the photo edge into the margin before
  the outer mask dissolves it; disc nudged left (`md:-ml-10`). Caroline's final calibration
  after a too-blurry detour: photo stays sharp, blur is rim-only — `blur(24px)` masked
  `transparent 60% → black 88%` (closest-side). Lesson: she wants "no sharp edge", not
  "dreamy soft-focus" — keep the subject crisp. Then a **glass edge** on top: a crisp ~2px
  glassmorphism ring (conic gradient so it reads lit — 0.60 white peak top-left, ~0.1–0.2
  around) rendered as a SIBLING of the masked disc at `inset-7 rounded-full` — outside the
  dissolve mask so the fade can't eat it. First attempt was a 7px feathered band → "why so
  thick?"; she wanted a thin crisp glass-design border, no blur. Final: hairline ~1px
  (annulus stops 99.0→99.3→99.8→100%) with strong glint contrast — 0.90 white peak
  top-left vs 0.02–0.10 base around the rest. Key insight: alpha fade alone reads as a
  soft ring; orbs need the content itself bleeding outward, which requires unclipped room
  around the image. Second key gotcha: radial gradients/masks default to **farthest-corner**
  sizing, so square overlay layers (sheen/glare/vignette) kept partial opacity into the
  box corners and ghosted a *square* around the disc — fixed by sizing the container mask
  and vignette with `circle closest-side` (nothing can render outside the inscribed
  circle).
- **2026-06-09** — **Fixed the long-standing `disableNormalPass` error** in
  `hero/Effects.tsx`: `@react-three/postprocessing` v3 removed the NormalPass entirely, so
  the prop no longer exists — deleted it (no behaviour change; the normal pass never ran).
  `tsc --noEmit` is now fully clean. The scary runtime crash Caroline saw alongside it
  (`EffectComposer.addPass → null.alpha`) was a transient dev/HMR lost-WebGL-context
  artifact — gone on fresh load, 0 console errors.
- **2026-06-09** — **Glass shine pass** (Caroline: glass felt matte). Replaced the flat 1px
  `border-t` + inset shadow with a three-layer specular story in `About.tsx`: (1) gradient
  rim hairline that peaks bright (0.55 white) at ~18% from the left — a glint, not a line;
  (2) a soft light pool bleeding ~11rem down from under the glint (radial, 0.10 white);
  (3) a 115° diagonal sheen sweep across the whole sheet (`mix-blend-screen`, 0.085 → 0
  → 0.04) — the Apple-glass move. All `aria-hidden` overlay divs clipped by the section's
  rounded corners.
- **2026-06-09** — **About is now a glass sheet** (Caroline: the solid black plate after the
  hero was "too harsh" — wants Apple-glass so the orbs show through). Dropped `bg-bg` from
  the below-hero plate wrapper in `page.tsx`; `About.tsx` got the glass: `backdrop-blur-2xl
  backdrop-saturate-150`, translucent gradient `rgba(5,5,7,0.38) → 0.66 → #050507` (lands
  on solid bg so the opaque sections below join with no seam — they sit in their own
  `bg-bg` wrapper), `rounded-t-[2.5rem]` + `border-t border-fg/15` + inset top highlight
  for the sheet look. The fixed hero canvas (z-0) frosts through; verified bio text stays
  legible over the brightest orb glow. Sections after About (marquee/work/toolkit) remain
  fully opaque on purpose.
- **2026-06-09** — **bento2 reworked to true hero language** (round 3, per Caroline: "each
  folder has very soft diffused edges, no hard lines — like the orbs/fireball edges — and
  only hero fonts + hero colours"). Killed every box: no borders, no panel rects, no
  scrims, no box-shadows. Each folder is now radial colour pools that die to transparent
  *inside* the cell (gaussian-ish stops at ~65–68%), so the panel's rectangular extent is
  never readable — collapsed folders are narrow floating wisps (reads like the fireball
  chain), the open one blooms into 2–3 offset blobs. Type: `font-hero` (Iosevka) for
  company/title/description — title styled like the hero H1, company like the "Hi I'm
  Caroline," intro line, meta rows like the hero role line (square + bullet, mono).
  Palettes lifted verbatim from the hero shaders: fireball flameRamp (#FF8858 #F56267
  #E560FA #793CEA #2835A8) + DistortedOrb consts (#ff2f7e #ff8526 #ffcf52 #3fc4ad
  #bdeed9). Key learning: first pass had pools sized ~55–110% of the cell which read as
  hazy rectangles/bars — shrinking to ~30–48% with dark breathing room is what makes the
  blob-in-dark orb feel.
- **2026-06-09** — Round-2 showcase remixes from Caroline's feedback (she loves bento +
  shell; committed round 1 as `627699e` and pushed): **bento2** "Diffused grain mosaic" —
  bento read too *sharp* against the diffuse hero, so hard linear gradients became soft
  radial colour pools dying into dark, plus film grain, hairline borders, glow (not
  scanlines) on the open panel. **shell2** "Soft shell + pixel sprites" — the CLI had tag
  soup and could confuse non-terminal visitors, so: airy rows, human names (no
  `drwxr-xr-x`), ONE quiet meta line, and her idea of a per-project "image" à la Claude
  Code's boot logo → a deterministic slug-seeded **pixel sprite** (mirrored like a space
  invader, sharp grid + blurred glow copy = pixel-y AND diffused). Shared helpers in
  `prototype/softBits.tsx` (Grain overlay, PixelSprite; sprites are deterministic so
  SSR/client match). Both verified rendering, 0 console errors.
- **2026-06-09** — On branch `project-showcase-experiment`, prototyped **3 alternative
  ways to showcase the projects** (Caroline wanted something edgier/funner but still
  dead-simple). UI prototype, sub-shape A: variants render on the existing `#work` route
  via `?variant=`, flipped by a floating dev-only switcher bar (← / → keys). Kept the
  current carousel as `?variant=current` baseline. Variants (all on-brand, structurally
  distinct): **shell** (`~/work` terminal directory listing, ↑↓/↵/esc — a designer's work
  as a CLI, plays off the existing path-label + telemetry HUD), **deck** (holographic
  draggable card stack, drag/flick to throw the top card), **bento** (reflowing spotlight
  mosaic — all projects visible, hover expands one with a glitch-scan). Lives in
  `components/sections/prototype/` (throwaway; `NOTES.md` there has the verdict template +
  cleanup steps). Extra per-project metadata (year/role/stack/status) in
  `prototype/projectMeta.ts` so variants aren't empty — fold survivors into
  `lib/projects.ts` when one wins. Verified all 4 render, 0 console errors. **Awaiting
  Caroline's pick** before folding the winner in and deleting the rest.
- **2026-06-09** — Scaffolded the four below-the-hero sections from the Figma comp
  (`figma.com/design/1crZakXfGsPCpxdXIrcjHo`, node 2-2): **About** (placeholder portrait left + fast
  streaming bio right, triggered by `useInView`), **ProjectsMarquee** (filled + outline "PROJECTS" strips),
  **ProjectCarousel** (center-focus, hover-zones step one project at a time, click/dots/arrow-key nav), and
  **Toolkit** (icon-tile marquee). Built a reusable `Marquee` primitive for both loops. Decisions:
  (a) both marquee rows scroll right-to-left per Caroline's spec — flip via `reverse` prop (opposite
  directions is the common alt). (b) Only the Nest card is real (`lib/projects.ts` index 0); the rest are
  `placeholder: true` → "Project NN". Imagery + portrait + real toolkit icons are gradient/text placeholders
  awaiting assets (clear swap-points commented in each file). (c) Post-hero sections live on a
  `relative z-10 bg-bg` plate so the fixed WebGL canvas (Hero, z-0) doesn't bleed through.
- **2026-06-09** — Installed the official **Playwright MCP** server (`@playwright/mcp`) at user scope for
  later interactive usability/a11y audits. Needs a Claude Code restart to surface the browser tools.
- **2026-06-09** — Established this `CLAUDE.md` as the persistent project brain + adopted the
  `session-journal` workflow (ongoing logging + end-of-session handoffs). Reason: Caroline wants new agent
  sessions to pick up seamlessly without her re-explaining context.
- **2026-06-09** — Replaced the right-edge vertical label (`Portfolio // 2026 // Selected_Works`) with a
  **telemetry strip** (`components/TelemetryRail.tsx`): `WEBGL2 · TIER n · DPR n · n FPS` (font `text-fg/70`,
  matched to the top-left `~/caro/portfolio/2026` path label).
  Every token is a real fact about the visitor's session — WebGL context, their detect-gpu `useGPUTier`,
  effective DPR (mirrors Scene's `[1,2]`/`[1,1.5]` clamp), and **raw live FPS** (Caroline chose raw over
  capped — she wants the number visibly changing). FPS is counted per ~⅓s window and written straight to the
  DOM via a ref (NO setState 60×/sec — same rule as the parallax). Reduced motion → render loop is on-demand,
  so it swaps to `STATIC`. WebGL/DPR use `useSyncExternalStore` (SSR-safe, no setState-in-effect, matches
  `usePrefersReducedMotion`). Reason: the old label was dead wayfinding (header nav already orients); the HUD
  is on-brand and audience-layered — casual visitors see cool mono chrome, technical ones clock it's live.
- **2026-06-09** — Fireball **nose + parallax separation + orb smoothing**: (a) nose (disc0) forced fully
  shown (`vis = 1` for i==0) so it's the only un-cut shape; its blue leading-edge **rim is kept** (Caroline
  wanted it) — on a guaranteed full circle it reads as a rim around a ball, not a left "cut". (b)
  **Separated** the fireball hover-reveal from the orb parallax: gated `hoverReveal` by a vertical `zone =
  1 - smoothstep(0.58, 0.82, 1.0 - uMouse.y)` so it only reacts in the UPPER screen (fireball) and holds
  baseline when the cursor is over the orb row (lower screen). (c) **Smoothed the orb cursor** in
  `DistortedOrb.tsx` — a shared `smoothMouse` ref lerped `0.25`/frame, passed to the orbs instead of the raw
  ref (which jumped between irregular `pointermove` events = stutter/glitch). Kept snappy so it doesn't feel
  laggy; independent of the fireball's own `uMouse` smoothing, so the two parallaxes stay fully separate.
- **2026-06-09** — Firewall **head unified into caps** (fixes the disc1↔disc2 blend lens + layering):
  reworked the head pass so ALL discs (0,1,2) use the same flat-LEFT reveal cut and are drawn FRONT-to-BACK
  (`i = p`: nose = bottom, disc2 = top) — each cap sits over the previous, which pokes out on the left, just
  like the chain. Removed disc0/disc1's old flat-RIGHT cut (the two facing flat edges were what stacked
  additive glow into a magenta blend lens between the 2nd & 3rd circles). disc0 (t=0) stays a full round
  nose; disc1 is now a flat-left cap that opens on hover; tightened `sf` for i==1 `0.72→0.44` so the nose
  tucks under disc1. Reason: Caroline wanted the 2nd↔3rd overlap to read like the clean 3rd↔4th ("one under
  the other"), disc1 to get the hover-reveal, and the nose layered beneath disc1 with a straight left edge.
- **2026-06-09** — Fireball **hover-reveal** (mirrors the orbs): wired `uMouse` into the firewall reveal
  `cut` in `backdropFragment` so the cursor moving toward the fireball (screen LEFT) unmasks more of each
  circle — `hoverReveal = max(0.5 - uMouse.x, 0.0) * 0.40`, subtracted from the cut coefficient (disc2 +
  chain 3–6 left cut; disc1's right cut slides out; disc0 nose stays full). One-sided so it only ever
  exposes MORE than baseline (discs grow into each other, never gap). Bumped `Backdrop.tsx` mouse lerp
  `0.05→0.12` so the reveal tracks the cursor responsively. Reason: Caroline clarified the orbs' "parallax"
  is really a mouse-driven unmask, and wanted the same hover-to-reveal on the fireball (NOT positional
  drift — the earlier `par` magnitude bump was reverted to the original `0.03`).
- **Firewall tuning** (commits through `da30e07`) — rebuilt the firewall backdrop as masked discs matching
  the reference; iterated head spacing, per-shape sizing, full-circle nose, removed chain crease lines so
  caps blend at overlaps. See `git log` + `orb-firewall-tuning` skill.
- **Tech stack** (2026-05-26) — Next.js + R3F + GSAP + Motion + Lenis. See `research/`.

---

## Session Log / Handoff

> Latest handoff lives at the top. At the end of a session, append a new entry with: what changed, current
> state (working / broken / in-progress), and explicit next steps for the next agent. Capture stated intent
> ("tomorrow we do X") and long absences here too.

### 2026-06-24 (eve) — Built showcase card #3 (/synapse) + tuned its product image
- **Done this session:**
  1. **Two earlier commits**: `4db7d79` added the `fadeStop` blob knob + softened the
     cog_adhd green→black; `1cb0b2c` tuned NavBar link hover states (dim default →
     brighten/darken on hover). Both **committed + pushed**.
  2. **Built the `/synapse` showcase card** (project #3) via the reusable `ProjectCard`
     — copy/assets/colours from the Figma frame (node `95-807`). It's the LangChain ×
     SurrealDB hackathon reflection agent. See the full Decision Log entry. **Committed +
     pushed** as `ee6405f` (lib/projects.ts, projectMeta.ts, VariantBentoSoft.tsx,
     synapse-logo.png, synapse-product.png).
  3. **Iterated the synapse product visual** with Caroline (several rounds): swapped to
     her tighter "Map your mind" crop, then sized/positioned it — final
     `right-[-12%] top-[55%] h-[53%]`, cut off at the card's right edge (matches the
     Figma). She also nudged the blob colours to `core #C24F83 / edge #734A8E`.
     **Committed + pushed** as `8832486`.
- **State: WORKING.** tsc + eslint clean, 0 console errors throughout. Card verified
  open via the standalone-Playwright trick at each step.
- **Gotcha:** on this live-WebGL page `page.goto(..., {waitUntil:'networkidle'})` TIMES
  OUT (the canvas never goes idle). Use `waitUntil:'domcontentloaded'` + a fixed
  `waitForTimeout`. MCP Playwright also times out (5s) — use a throwaway
  `playwright` script run from the PROJECT ROOT (so it resolves the dep), real
  `.hover()` to open the card, then freeze transitions + element-screenshot.
- **Untracked, left out of git on purpose:** `assets/synapse-product-imagery.png`
  (Caroline's source crop — the live asset lives in `public/assets/`). Commit it only
  if she asks.
- **Next steps:** (1) cards `project-04` / `project-05` (index 3/4) are still the old
  centred placeholder layout — migrate each to `<ProjectCard>` when it has real content
  + a product visual. (2) Possible synapse polish: cut amount on the right / blob mix —
  eyeball in browser.
- **Open intent:** none stated for next session.

### 2026-06-24 — Cog ADHD case study page + shared NavBar (this agent)
- **Done this session** (alongside a separate "another cakes" agent tuning the
  `/cog_adhd` CARD — see the entry below this one):
  1. **Built the Cog ADHD case study** at `/project/cog-adhd` — a faithful LIGHT-theme
     rebuild of Caroline's old Framer "Cog Clinic — Research & Strategy" page, via a
     divide-and-conquer agent team (15 builders one-per-section; 15 evaluators
     Playwright-comparing each section to the PDF; 2 fixers). Details in the two
     Decision Log entries dated 2026-06-24. **COMMITTED + PUSHED** (commit `1332537`).
  2. **Wired the card → page**: added an optional `href` to `ProjectCard`; the Cog card
     passes `/project/cog-adhd`. (Already in HEAD via the other agent's commit sweep.)
  3. **Shared sticky glass NavBar** (`components/NavBar.tsx`, mounted in
     `app/layout.tsx`) — WORK→PROJECTS, links back to home sections from any page,
     theme-aware (dark site / light case study), transparent-at-top → frosts on scroll,
     hover tuned (dark: dim default→bright; light: keep tone→darken). See its Decision
     Log entry.
- **State: WORKING.** tsc + eslint clean, 0 console errors. Both navbar themes + the
  card→page navigation verified via Playwright. Case study renders end-to-end, close to
  the PDF.
- **UNCOMMITTED (shared working tree — careful, some is the OTHER agent's in-flight
  work):** `M NavBar.tsx` (MY latest hover/transparency tweaks — mine, safe to commit),
  `M CLAUDE.md` (journal). The `M DESIGN.md` / `M ProjectCard.tsx` / `M VariantBentoSoft.tsx`
  are the other cakes' card blob-tuning — **leave for them**. A ready-to-use **NavBar
  commit message is in the chat** (Caroline asked for it, said don't commit yet).
- **Next steps:**
  1. **Commit the NavBar work** when Caroline's ready (NavBar.tsx + already-applied
     layout/page edits; message in chat). Don't sweep the card files (other agent's).
  2. **Polish the case study** — the stated next focus. Flagged candidates: Hero
     confetti-band crop, Solution bubble scatter, spacing/rhythm. Re-screenshot via a
     `[data-cog]` Playwright harness (temp `scripts/_cogshots.mjs` was deleted —
     recreate from the Decision Log notes or use the Playwright MCP). PDF bands + asset
     catalog + `SPEC.md` are in the session scratchpad `cog-pdf/`.
- **Open intent:** Caroline wants to keep iterating on the Cog case study page next session.

### 2026-06-24 — cog_adhd showcase card (project 02) build + polish
- **Done:** Built the second `/cog_adhd` showcase card via the reusable `ProjectCard`
  (full story in the Decision Log, 2026-06-24 entries). This session: cleaned the
  two-phone product art (stripped black corners, filled phone-2's bottom-right);
  positioning `right-[-10%] bottom-0 h-[65%] object-left` (phones on the right,
  ~65% tall, clear of the copy, right phone cut by the card edge); real subtitle
  copy; and a long iteration on the amber→green corner blob — added `coreStop`/
  `edgeStop`/`fadeStop` knobs to `bloom()`/`CardBlob` in `ProjectCard.tsx`.
- **State (WORKING):** tsc + lint clean. The initial card + cleaned asset are
  **committed & pushed** (`79f288c` on `project-showcase-experiment`). **Uncommitted**
  in the working tree: the gradient-knob work — `ProjectCard.tsx` (the 3 stops) +
  `VariantBentoSoft.tsx` (cog_adhd `blob={{ core:#F2922E, edge:#189E71, coreStop:30,
  edgeStop:50, fadeStop:80 }}`) + `DESIGN.md`/`CLAUDE.md` doc updates. Caroline last
  nudged `coreStop` to 30 herself and was happy with the look.
- **Next steps:** (1) **Commit & push the gradient work** when Caroline confirms —
  stage only `ProjectCard.tsx VariantBentoSoft.tsx DESIGN.md CLAUDE.md` (NOT
  `components/NavBar.tsx` or the `app/project/` `components/project/` `public/projects/`
  trees — those belong to the *separate* case-study-page agent; leave them out).
  (2) The other 3 cells (`project-03/04/05`) are still the old centred placeholder
  layout — migrate each to `<ProjectCard>` when it gets real content + a product visual.
- **Gotcha for next agent:** MCP Playwright screenshots time out (5s) on this
  live-WebGL page. Capture via a throwaway `@playwright/test` script in the project
  root (real `.hover()` to trip React's `onMouseEnter`, then inject
  `*{transition:none}` + hide the `<canvas>`, then element-screenshot). Two agents are
  on this branch — `git add` specific files only, never `-A`.
- **Open intent:** none stated for next session.

### 2026-06-09 — CLAUDE.md bootstrap
- **Done:** Created this file; documented stack, architecture, tokens, skills, commands. Set up the
  `session-journal` global skill + global `~/.claude/CLAUDE.md` so every project session maintains its own
  CLAUDE.md automatically.
- **State:** On branch `firewall-prev`. Below-hero sections now scaffolded (About / ProjectsMarquee /
  ProjectCarousel / Toolkit) and rendering — lint/typecheck clean for the new files (a pre-existing
  `setState`-in-effect lint warning in `HeroCopy.tsx` and a `disableNormalPass` type error in
  `hero/Effects.tsx` are untouched/unrelated). Nothing committed yet.
- **Next (design iteration):** drop in the real assets — portrait (`About.tsx`), per-project imagery +
  remaining real project cards (`lib/projects.ts`), program icons (`Toolkit.tsx`); tune carousel `SPREAD`
  /`SIDE_SCALE` and marquee speeds/directions. Then case-study routes under `#work`.
- **Open intent:** none recorded yet.
