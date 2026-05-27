# Designer Portfolio Tech Stack Recommendation (2026)

For a moody, animation- and WebGL-heavy product-designer portfolio. Opinionated picks, with version numbers and reasoning.

---

## TL;DR — The Stack

- **Framework:** Next.js 15 (App Router) on Vercel
- **3D:** React Three Fiber (R3F) v9 + `@react-three/drei` + `@react-three/postprocessing`. Raw GLSL via `glslify` + LYGIA snippets. Three.js r170+ under the hood.
- **Animation:** GSAP 3.13 (now MIT-style free, including ScrollTrigger, SplitText, Flip) for timeline/scroll work. Motion (formerly Framer Motion) for React component-level transitions. Lenis for smooth scroll.
- **Authoring:** MDX for case studies via Contentlayer 2 or `next-mdx-remote`.
- **Assets:** glTF + Draco mesh compression + KTX2/Basis textures, optimized via `gltf-transform`.
- **Hosting:** Vercel for DX, or Cloudflare Pages if you expect high traffic.

---

## 1. Meta-framework

| Framework | 3D/anim friendliness | MDX case studies | SEO | Build speed | Hosting fit |
|---|---|---|---|---|---|
| **Next.js 15 (App Router)** | Excellent once you wrap `<Canvas>` in `dynamic(..., { ssr: false })`. Turbopack dev is fast. | Native MDX support + `@next/mdx`, Contentlayer. | Best-in-class metadata API, OG image generation. | Turbopack dev ~instant; prod builds slower than Astro. | Vercel optimal; Cloudflare via OpenNext. |
| **Astro 5** | Good for islands-style use, but R3F-heavy hero scenes lose Astro's "zero JS" advantage. | Excellent — `.mdx` files are first-class with content collections. | Excellent (static HTML). | Fastest builds. | Anywhere static; great on Cloudflare. |
| **Vite + React (SPA)** | Best DX for pure WebGL/R3F — no SSR friction, fastest HMR. | Manual setup (vite-plugin-mdx). | Weakest — needs SSG plugin or pre-rendering. | Fastest dev. | Cloudflare Pages, Netlify, any static host. |
| **TanStack Start / Remix** | Fine, but smaller R3F community/recipes. | Manual MDX. | Good. | Decent. | Vercel/Netlify/Cloudflare. |

**Pick: Next.js 15 App Router on Vercel.**

A designer portfolio needs (a) heavy WebGL on the landing and (b) crawlable, SEO-friendly case-study pages with MDX. Next 15's App Router does both — render the marketing/case-study shell server-side for SEO and OG images, then load the WebGL hero via `next/dynamic` with `ssr: false`. Astro is tempting, but once you commit to R3F + scroll-driven 3D, the "zero JS" thesis evaporates.

---

## 2. 3D / WebGL stack

**Pick: React Three Fiber (R3F) v9 + drei + @react-three/postprocessing, on top of Three.js r170+.**

### The contenders

- **Three.js (raw):** Maximum control, smallest abstraction tax. But you'll fight React's lifecycle if you embed it in a React app.
- **R3F + drei + postprocessing:** Declarative, composable, the de-facto React-native way. drei gives you `Environment`, `useGLTF`, `Float`, `MeshTransmissionMaterial`, `shaderMaterial`; `@react-three/postprocessing` wraps `pmndrs/postprocessing` with `<EffectComposer><Bloom/><ChromaticAberration/><Glitch/></EffectComposer>` — exactly what you want.
- **OGL:** Lightweight (~25kb). Lusion-style. Steep slope; no React renderer.
- **Babylon.js:** Overkill. Bigger bundle, less idiomatic React.
- **PlayCanvas:** Editor-first, wrong tool here.
- **TresJS:** Vue equivalent. Skip.

### For the holographic/glitchy CPU hero

R3F + postprocessing because:
1. **Composability with React:** scroll-linked state drives `useFrame` uniforms directly.
2. **Postprocessing pipeline:** `Bloom` (luminanceThreshold ~0.6) + `ChromaticAberration` (offset `[0.002, 0.002]`) + `Glitch` (mode `SPORADIC`) + `Noise` in `OVERLAY` blend is the canonical recipe.
3. **Custom shaders:** drei's `shaderMaterial` lets you author raw GLSL with hot-reload. Pipe LYGIA in via `glslify`.
4. **Mobile escape hatches:** `detect-gpu` for downgrade — disable postprocessing, lower DPR (`dpr={[1, 1.5]}`).

### Shader authoring

- Raw GLSL + `glslify` for `#pragma glslify: snoise = require(glsl-noise/simplex/3d)` style imports.
- LYGIA ([lygia.xyz](https://lygia.xyz/generative)) is the modern superset — `fbm`, `curl`, `voronoi`, `psrdnoise`, `lighting/pbrIridescence`. Vendor specific files; don't pull the whole tree.

---

## 3. Animation libraries

**Modern combo: GSAP 3.13 + Motion + Lenis. Theatre.js only if you need a visual timeline editor.**

- **GSAP 3.13** — Webflow acquired GreenSock and made all of GSAP (SplitText, MorphSVG, ScrollTrigger, Flip, ScrambleText) **100% free for commercial use** as of April 2025. Use for: scroll-driven master timelines, text reveals, DOM-to-DOM transitions (Flip), pinned hero scenes. Drives R3F via mutating uniforms inside `gsap.to(material.uniforms.uProgress, ...)`.
- **Motion v11+** (`motion/react`, ex-Framer Motion). For declarative component animations, layout transitions, gesture, view transitions.
- **Anime.js** — redundant with GSAP. Skip.
- **Theatre.js** — visual keyframe editor with `@theatre/r3f`. Worth it for complex orchestrated 3D camera moves.
- **Lenis** (`darkroomengineering/lenis`) — smooth scroll. Pair with `gsap.ticker.add((time) => lenis.raf(time*1000))` and `lenis.on('scroll', ScrollTrigger.update)`.

The combo: Lenis smooths scroll, GSAP ScrollTrigger drives master timeline that mutates DOM + R3F uniforms, Motion handles component transitions. That's the modern portfolio formula.

---

## 4. Shader & effect patterns

| Effect | Approach |
|---|---|
| **Holographic / iridescent material** | Thin-film interference via view-angle dot into gradient ramp. Or LYGIA `lighting/pbrIridescence`. Three.js `MeshPhysicalMaterial` has `iridescence` since r132. |
| **Chromatic aberration / RGB shift** | `<ChromaticAberration offset={[0.003, 0.003]} radialModulation modulationOffset={0.5}/>` from `@react-three/postprocessing`. |
| **Glitch / digital distortion** | `<Glitch delay={[3, 5]} duration={[0.2, 0.5]} strength={[0.3, 1]} mode={GlitchMode.SPORADIC}/>`. Combine with custom blocky-displacement shader pass. |
| **Particle systems** | `THREE.Points` + `InstancedBufferGeometry` for tens of thousands. >100k → GPGPU via `GPUComputationRenderer`. |
| **SDFs for organic shapes** | Ray-march in fragment shader on fullscreen quad. LYGIA `sdf/*` + boolean ops + smooth-min. Keep step count <64 on mobile. |
| **Noise (simplex/FBM/curl)** | LYGIA `generative/snoise`, `generative/fbm`, `generative/curl`. FBM for clouds/iridescence, curl for fluid particles. |
| **Circuit-board running light** | Two layers: (1) Voronoi/grid mask for traces; (2) fragment shader scrolls 1D gradient along `fract(uv.x - time*speed)` with glow LUT. Add `<Bloom>`. |

**Refs:**
- [LYGIA](https://github.com/patriciogonzalezvivo/lygia)
- [glsl-noise](https://github.com/hughsk/glsl-noise)
- [Codrops](https://tympanus.net/codrops/)
- [Three.js Journey](https://threejs-journey.com/) (Bruno Simon)
- [Akella YouTube](https://www.youtube.com/@akella)

---

## 5. Portfolio inspiration

| Site | URL | Stack | Borrow |
|---|---|---|---|
| **Bruno Simon** | bruno-simon.com | Three.js + Rapier + Howler | Drivable 3D nav, spatial audio |
| **Henry Heffernan** | henryheffernan.com | R3F + AWS | OS-as-portfolio metaphor |
| **Lusion** | lusion.co | Custom WebGL/OGL | `readPixels` tricks, ray-marched panels |
| **Active Theory** | activetheory.net | Custom engine, heavy GLSL | Cinematic transitions, audio-reactive |
| **Darkroom (Studio Freight)** | darkroom.co | Lenis + Hamo + Tempus + Satus | Smooth scroll + restraint; steal Lenis directly |
| **Hello Monday** | hellomonday.com | R3F + GSAP | Character-driven heroes, scroll choreography |
| **Resn** | resn.co.nz | WebGL + Unity-in-browser | Bold loaders, audio-first storytelling |
| **Olivier Larose** | blog.olivierlarose.com | **Next.js + Motion + Lenis + GSAP** | Closest 1:1 to our stack — free template tutorials |
| **Lando Norris (OFF+BRAND)** | landonorris.com | Webflow + WebGL | Editorial moodboard + 3D type composites |
| **Messenger app** | messenger.app | Pure WebGL | Tiny self-contained art-directed planet |

**Product-designer-specific** (less WebGL, more case-study craft): Brian Lovin, Rauno Freiberg ([rauno.me](https://rauno.me)), Emil Kowalski (emilkowal.ski), Paco Coursey ([paco.me](https://paco.me)).

---

## 6. Performance & DX

**Images:** `next/image` with AVIF, `placeholder="blur"`, `plaiceholder` for Base64/blurhash.

**3D assets:** Always `gltf-transform optimize input.glb output.glb --texture-compress webp`. Pipeline: weld → simplify → quantize → Draco → KTX2. Load via `useGLTF` + `DRACOLoader` + `KTX2Loader`. KTX2 stays GPU-compressed (~10x VRAM savings).

**Hydration / LCP:**
- `next/dynamic(() => import('./Hero'), { ssr: false, loading: () => <Poster/> })`
- Render static poster as LCP
- Mount Canvas after `requestIdleCallback`
- R3F `frameloop="demand"` on idle scenes
- `dpr={[1, 2]}`, downshift via `detect-gpu`

**Hosting:** Vercel for DX (designer-portfolio traffic). Cloudflare Pages if viral spikes expected (unlimited bandwidth, 300+ POPs).

---

## 7. Pitfalls

1. **R3F + Next SSR:** always `dynamic(..., { ssr: false })`. Three.js touches `window` immediately.
2. **Hydration mismatch:** no `Math.random()` / `Date.now()` in scene setup; seed deterministically.
3. **GSAP + Lenis sync:** forget `gsap.ticker.add` + `lenis.on('scroll', ScrollTrigger.update)` and pinning jitters.
4. **GSAP license:** now fully free for commercial use (April 2025 Webflow acquisition). Historical paid-plugin fears are obsolete.
5. **Mobile GPU:** iOS Safari throttles hard. Gate postprocessing behind `detect-gpu` tier; have an "essential" rendering mode.
6. **`useFrame` discipline:** mutate `ref.current.uniforms.uTime.value` directly; no `setState` inside useFrame.
7. **R3F v9 / React 19:** R3F v9 supports React 19; older needs React 18. Lock versions.
8. **Color space:** Three.js r152+ defaults changed. `texture.colorSpace = THREE.SRGBColorSpace` for albedo; `NoColorSpace` for data textures (normal/roughness/noise).
9. **`Suspense` + `useGLTF`:** wrap scene in `<Suspense fallback={null}>`. `useGLTF` throws a promise.
10. **Bundle bloat:** importing from `three/examples/jsm/...` pulls 100kb+. Use `three-stdlib` or tree-shake specific imports.
11. **SplitText font flash:** `document.fonts.ready` before splitting, or `font-display: optional`.
12. **Lenis + native features:** anchor links, scroll-restoration, `position: sticky` need conscious handling.

---

## Closing recommendation

**Next.js 15 App Router → R3F v9 + drei + react-postprocessing → GSAP 3.13 + Motion + Lenis → MDX for case studies → glTF/Draco/KTX2 → Vercel.**

For the **holographic CPU / circuit-board running-light hero**: a procedural circuit pattern (Voronoi + thresholded SDF lines) on a plane with a scrolling glow LUT, lit by `Environment` HDRi for iridescent reflections on a chromed CPU mesh, with `<Bloom intensity={0.8}/>` + `<ChromaticAberration offset={[0.002, 0.002]}/>` + intermittent `<Glitch>` triggered on section transitions. GSAP timeline pins the hero and drives a `uProgress` uniform from 0→1 over scroll length.
