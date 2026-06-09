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
    GlassRail.tsx   # left-rail glass (sphere + pill)
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
mapping.md        # firewall reference shape/composition mapping notes
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

- **orb-firewall-tuning** — tune the orb + firewall visuals; the screenshot iteration loop
- **glsl-shader-effects** — authoring GLSL for the holographic/glitch aesthetic
- **r3f-hero-scene** — R3F scene scaffolding, SSR/dynamic loading, postprocessing, mobile fallbacks
- **scroll-choreography** — GSAP ScrollTrigger, Lenis, Motion transitions, scroll-driven uniforms
- **portfolio-architecture** — routes, MDX case studies, SEO/OG, asset organization, structure

## Conventions

- Dark theme only; reference the moodboard direction (holographic / glitchy / circuit-board, moody dark).
- Hero visuals are iterated via the **screenshot loop** against `public/assets/distorted-orb.png`, reviewed
  through "3d bro" + "creative director" personas (see `orb-firewall-tuning` skill).
- Branch per workstream (current: `firewall-prev`). Commit/push only when Caroline asks.

---

## Decision Log

Newest first. Record *why*, not just *what*.

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
