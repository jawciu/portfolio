# Decisions

Why this codebase is built the way it is. ADR-lite — short context + decision + alternatives + rationale per choice. Update when you make a structural call.

Deeper research that informed the initial picks: [`research/tech-stack-recommendation.md`](research/tech-stack-recommendation.md).

---

## 1. Framework — Next.js 16 (App Router)

**Context.** A designer portfolio that wants (a) a heavy real-time WebGL hero, (b) several case-study pages that Google and LinkedIn can crawl, (c) per-project social-share images, (d) a single codebase that's pleasant to iterate on.

**Decision.** Next.js 16 with the App Router, on Vercel.

**Alternatives considered.**
- **Plain HTML/CSS/vanilla JS** — simplest, no build step. Great for a single-page site; falls apart once you have multiple case studies that share a layout and want SEO.
- **Astro 5** — ships near-zero JS by default and treats MDX as first-class. The WebGL hero would still ship a chunky React island, and routing/state for the few interactive bits is weaker than Next.
- **Vite + React (SPA)** — fastest DX for pure WebGL work; weakest SEO without a separate prerender step.

**Why Next.**
- The hero is React Three Fiber → we're in React anyway. Going vanilla means dropping R3F or still pulling React in.
- Server-rendered HTML means recruiters' Google searches actually find case studies; LinkedIn pulls the right OG image.
- App Router's `generateMetadata` + `/api/og` (edge runtime) give per-project social-share images for free.
- `next/image` auto-generates AVIF/WebP at multiple sizes, which matters once case studies have image galleries.
- `next/dynamic` with `ssr: false` cleanly isolates client-only WebGL (Three.js touches `window`).
- MDX support for case studies (planned — not yet wired).

**Trade-off.** Bigger dep tree, build step, framework opinions. Acceptable for the case-study scale.

---

## 2. Language — TypeScript 5

**Decision.** TypeScript everywhere. Strict mode (Next default config).

**Why.** Three.js and R3F have rich typed APIs that catch real bugs (missing uniforms, wrong vector arities). Designer-portfolio velocity is fine with TS — the overhead is small for a codebase this size, and refactors are safer.

---

## 3. UI library — React 19

**Decision.** React 19, pulled in as Next's React.

**Why.** R3F v9 supports React 19. Server Components let case-study data fetching live in RSC while interactive bits stay client-side without ceremony.

---

## 4. Styling — Tailwind CSS 4 (with `@theme` tokens)

**Decision.** Tailwind 4 utilities, with design tokens defined via `@theme` in `app/globals.css`.

**Alternatives considered.**
- **CSS Modules / vanilla CSS** — fine but slower to iterate when designing with the browser open.
- **Styled-components / Emotion** — runtime cost, no longer the dominant choice.
- **shadcn-style component libraries** — overkill for a portfolio that's mostly bespoke.

**Why Tailwind.** Fast iteration on layout/typography, design tokens as CSS variables, scales with the project, no runtime cost. The `@theme` block keeps the moody palette + font variables in one place.

---

## 5. 3D / WebGL — React Three Fiber + drei + postprocessing

**Decision.**
- **Three.js** as the renderer
- **@react-three/fiber** (R3F) v9 for declarative scenes inside React
- **@react-three/drei** for utilities (`shaderMaterial`, `Environment`, etc.)
- **@react-three/postprocessing** (`pmndrs/postprocessing`) for Bloom / ChromaticAberration / Scanline / Noise / Vignette / Glitch

**Alternatives considered.**
- **Raw Three.js** — maximum control, smallest abstraction tax; fights React's lifecycle when embedded.
- **OGL** — lightweight (~25kb), elegant API. Steep learning curve, no React renderer, smaller community.
- **Babylon.js** / **PlayCanvas** — game-engine ergonomics, overkill for a hero shader.

**Why R3F + drei + postprocessing.**
- Declarative composition of WebGL inside React; scroll/mouse state can drive uniforms via refs without manual sync.
- `@react-three/postprocessing` provides a tested effect stack (the moody phosphor look = `Bloom + ChromaticAberration + Scanline + Noise + Vignette + Glitch`).
- Huge community / abundance of recipes (Codrops, Three.js Journey).

---

## 6. Shaders — inline GLSL template literals

**Decision.** Author shaders as `/* glsl */` tagged template strings inside `components/hero/shaders.ts`.

**Alternatives considered.**
- **`glslify` + `glslify-loader`** with vendored **LYGIA** snippets — what the original tech-stack research recommends. Cleaner for big shader projects (modular `#pragma glslify: …` imports).

**Why inline (for now).**
- Next 16 uses Turbopack in dev. Wiring a `raw-loader` / `glslify-loader` works with webpack but is bumpier with Turbopack.
- The hero shader is a single file; the modularity payoff isn't there yet.
- Inline strings give immediate HMR with no loader config.

**When to revisit.** If the shader count grows past ~3 files, or we need LYGIA/snoise/SDF primitives heavily, switch to `glslify`.

---

## 7. Animation — GSAP 3, Lenis, Motion (installed; light usage so far)

**Decisions.**
- **GSAP 3.13** for scroll-driven timelines (becomes free for commercial use as of April 2025; SplitText / Flip / ScrollTrigger all included).
- **Lenis** for smooth scroll (`darkroomengineering/lenis`), wired to GSAP's ticker so ScrollTrigger reads the smoothed scroll.
- **Motion** (ex-Framer Motion) for declarative component / layout transitions.

**Why this combo.** It's the modern portfolio formula behind Olivier Larose, Darkroom, et al. Lenis smooths, GSAP drives master timelines (DOM + R3F uniforms), Motion handles in-app component transitions.

**Current state.** Lenis is on; GSAP/Motion are installed but mostly unused. Active branch leans on direct shader uniforms for animation. Will wire up when adding case-study scroll choreography.

---

## 8. Smooth scroll — Lenis (Darkroom)

**Decision.** Lenis, registered once at the app root, ticked from `gsap.ticker`, with `ScrollTrigger.update` bound to its `scroll` event.

**Alternatives.** Locomotive Scroll (deprecated direction); native `scroll-behavior: smooth` (too rigid).

**Why.** Smooth scroll on native scroll position (so `window.scrollY` still works — we use that for the hero's scroll parallax), and it's what every modern award-site uses.

---

## 9. Fonts — Bricolage Grotesque, Geist, Geist Mono (via `next/font`)

**Decision.** Self-hosted via `next/font/google`, exposed as CSS variables `--font-display`, `--font-body`, `--font-mono`, surfaced as Tailwind utility classes via the `@theme` block.

**Why next/font.** Zero layout shift, no third-party font requests, automatic subsetting, variable fonts supported.

---

## 10. GPU tier detection — `detect-gpu`

**Decision.** Wrap WebGL postprocessing in a tier check (`tier < 2` → no effects; `tier ≥ 3` → enable expensive ones like Glitch).

**Why.** Integrated-GPU laptops and old mobile phones brown out under bloom + chromatic + scanline + glitch. `detect-gpu` returns a tier 0–3 we can branch on.

---

## 11. Hosting — Vercel (planned)

**Decision (planned).** Deploy to Vercel.

**Why.** First-party Next.js host (best DX, edge runtime for OG images), free for personal projects within reason, automatic preview deploys per branch. Cloudflare Pages is an option if traffic ever balloons (unlimited bandwidth via OpenNext).

**Status.** Not yet deployed. Still iterating locally.

---

## 12. Package manager — npm

**Decision.** npm (the default that came with the machine).

**Alternative.** pnpm is generally faster + saner disk usage, but wasn't installed locally. Not worth a tooling install for a single-developer project.

---

## 13. Source control — `jawciu/portfolio` (private), feature branches

**Decision.** GitHub repo on the `jawciu` account, private. Work happens on `feature/*` branches; `main` stays stable.

**Why private.** Job-hunting; recruiters see the live site, not the repo. Easy to flip public later.

---

## 14. Agent skills — local `.claude/skills/`

**Decision.** Custom skills (`r3f-hero-scene`, `glsl-shader-effects`, `scroll-choreography`, `portfolio-architecture`) live in this repo at `.claude/skills/`, not in the global skills folder.

**Why.** They're specific to this project's stack and aesthetic. Avoids polluting global skill discovery in unrelated projects.

---

## Decisions not yet made

- **MDX setup** — `next-mdx-remote` vs `velite`. Will pick when we start the first case study.
- **Domain & metadata** — Caroline owns a custom domain (URL not yet wired into `metadataBase`).
- **Analytics** — none yet. Plausible / Vercel Analytics likely candidates.
- **Image pipeline for case-study photos** — Vercel-handled `next/image` is probably enough; revisit if we need an external CDN.
- **Real PR/merge strategy** — currently only `main` + one feature branch. Decide on squash-merge vs straight when more branches exist.
