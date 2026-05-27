---
name: r3f-hero-scene
description: Scaffold a React Three Fiber hero scene for a Next.js 15 App Router site — correct dynamic SSR loading, postprocessing pipeline (Bloom + ChromaticAberration + Glitch), GSAP-driven uniforms, mobile GPU fallbacks. Use whenever building or modifying a WebGL hero canvas in this portfolio, adding 3D scenes, integrating postprocessing effects, or debugging R3F performance / hydration issues.
license: Proprietary
metadata:
  project: portfolio
  stack: nextjs-15 + r3f-v9 + drei + postprocessing
---

# R3F Hero Scene — patterns for this portfolio

The portfolio aesthetic is dark background + light/holographic/glitchy imagery. Hero scenes should feel moody and graphic, not clean-PBR. Always favor depth, light, grain, and iridescence over realism.

## Critical rules (these cause real bugs)

1. **Never render `<Canvas>` in a server component.** Three.js touches `window` at import time. Always:
   ```tsx
   // app/page.tsx (server component)
   import dynamic from 'next/dynamic'
   const Hero = dynamic(() => import('@/components/Hero'), {
     ssr: false,
     loading: () => <HeroPoster />,
   })
   ```
   `HeroPoster` is a static image that doubles as LCP element.

2. **Wrap any `useGLTF` / `useTexture` consumer in `<Suspense>`.** They throw promises.

3. **Never `setState` inside `useFrame`.** Mutate refs directly:
   ```tsx
   useFrame((_, dt) => {
     materialRef.current.uniforms.uTime.value += dt
   })
   ```

4. **No `Math.random()` or `Date.now()` in scene setup** — causes hydration mismatch even with `ssr: false` if you ever toggle it. Seed deterministically or compute inside `useEffect`.

5. **`dpr={[1, 2]}`** on `<Canvas>` — clamp at 2 even on retina. Otherwise iPhone Pros render at 3× and tank framerate.

6. **Color space:** `texture.colorSpace = THREE.SRGBColorSpace` for albedo; `THREE.NoColorSpace` for data textures (normal, roughness, noise, masks). Three.js r152+ default change makes this a common cause of washed-out output.

## Standard hero scaffold

```
components/
├── Hero.tsx              # exports default — the dynamically-imported entry
├── hero/
│   ├── Scene.tsx         # <Canvas> + lights + camera + scene contents
│   ├── Effects.tsx       # <EffectComposer> wrapper, GPU-gated
│   ├── CircuitField.tsx  # the main visual — shader plane
│   ├── HeroPoster.tsx    # static fallback image (LCP)
│   └── shaders/
│       ├── circuit.vert.glsl
│       └── circuit.frag.glsl
```

## Canvas template

```tsx
// components/Hero.tsx
'use client'
import { Canvas } from '@react-three/fiber'
import { Suspense } from 'react'
import { Scene } from './hero/Scene'
import { Effects } from './hero/Effects'

export default function Hero() {
  return (
    <Canvas
      dpr={[1, 2]}
      gl={{ powerPreference: 'high-performance', antialias: false, alpha: false }}
      camera={{ position: [0, 0, 4], fov: 35 }}
      frameloop="always"
    >
      <color attach="background" args={['#050507']} />
      <Suspense fallback={null}>
        <Scene />
        <Effects />
      </Suspense>
    </Canvas>
  )
}
```

Note: `antialias: false` because the postprocessing `SMAA` pass (or just bloom blur) handles edges and is cheaper than MSAA when you're already running effects.

## Postprocessing template (the moody recipe)

```tsx
// components/hero/Effects.tsx
'use client'
import { EffectComposer, Bloom, ChromaticAberration, Noise, Glitch } from '@react-three/postprocessing'
import { BlendFunction, GlitchMode } from 'postprocessing'
import { useGPUTier } from '@/lib/useGPUTier'

export function Effects() {
  const tier = useGPUTier()
  if (tier < 2) return null            // mobile / low-end: bail

  return (
    <EffectComposer multisampling={0} disableNormalPass>
      <Bloom luminanceThreshold={0.6} luminanceSmoothing={0.2} intensity={0.9} mipmapBlur />
      <ChromaticAberration offset={[0.0015, 0.0015]} radialModulation modulationOffset={0.4} />
      {tier >= 3 && (
        <Glitch
          delay={[6, 12]}
          duration={[0.1, 0.25]}
          strength={[0.05, 0.2]}
          mode={GlitchMode.SPORADIC}
          active
          ratio={0.85}
        />
      )}
      <Noise opacity={0.06} premultiply blendFunction={BlendFunction.OVERLAY} />
    </EffectComposer>
  )
}
```

The `Noise` pass at low opacity in OVERLAY mode adds the gritty grain that matches the Rufus du Sol / poster aesthetic. Without it, the scene looks too clean / CGI.

## Mobile GPU tiering

```tsx
// lib/useGPUTier.ts
'use client'
import { useEffect, useState } from 'react'
import { getGPUTier } from 'detect-gpu'

export function useGPUTier() {
  const [tier, setTier] = useState(3)        // optimistic
  useEffect(() => { getGPUTier().then(r => setTier(r.tier)) }, [])
  return tier
}
```

Tier 0–1 → no postprocessing, lower particle counts, swap to a simpler shader variant.

## Driving uniforms from GSAP

GSAP timelines pin the hero and drive a `uProgress` ref. Pass that ref into the shader plane as a `useFrame` lerp target:

```tsx
const progress = useRef(0)
// in scene-level effect:
useEffect(() => {
  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: '#hero',
      start: 'top top',
      end: '+=200%',
      scrub: 1,
      pin: true,
    },
  })
  tl.to(progress, { current: 1, duration: 1, ease: 'none' })
}, [])

// in CircuitField:
useFrame(() => {
  matRef.current.uniforms.uProgress.value = progress.current
})
```

Lenis + ScrollTrigger sync (do this once at app root):

```tsx
// app/providers.tsx
const lenis = new Lenis({ duration: 1.2, smoothWheel: true })
gsap.ticker.add((time) => lenis.raf(time * 1000))
lenis.on('scroll', ScrollTrigger.update)
gsap.ticker.lagSmoothing(0)
```

## Performance defaults

- `frameloop="demand"` on any secondary scene (about page, case study). Use `invalidate()` to redraw on interaction. Reserve `"always"` for the hero.
- Bake heavy lighting into an HDRI via `<Environment files="/hdri/studio.hdr" />`. Don't use real `<directionalLight>` + shadows in this portfolio — too heavy for the moody look anyway.
- One material per draw call: use `InstancedMesh` for repeated geometry.
- glTF assets: always pre-optimized with `gltf-transform`. See [references/asset-pipeline.md](references/asset-pipeline.md).

## When the hero is a 2D shader (no mesh)

For pure shader heroes (circuit field, plasma, etc), use a fullscreen plane rather than `<ScreenQuad>`:

```tsx
<mesh>
  <planeGeometry args={[viewport.width, viewport.height]} />
  <shaderMaterial ref={matRef} vertexShader={vert} fragmentShader={frag} uniforms={uniforms} />
</mesh>
```

Use drei's `shaderMaterial` helper for typed uniforms + HMR.

## Don't do these

- Don't import from `three/examples/jsm/...` directly — use `three-stdlib` or drei wrappers, much smaller bundle.
- Don't enable shadows. The aesthetic doesn't call for them and they cost 30%+ frame budget.
- Don't use `MeshStandardMaterial` for the hero. Either `shaderMaterial` (custom) or `MeshTransmissionMaterial` / `MeshPhysicalMaterial` with `iridescence` for chrome/holographic surfaces.
- Don't put `useFrame` callbacks at component-tree leaves if they all do the same thing — collapse into one `useFrame` at the scene root.

## Reference files

- [references/asset-pipeline.md](references/asset-pipeline.md) — glTF / Draco / KTX2 optimization
- See `/research/tech-stack-recommendation.md` for the full reasoning behind these choices
- Companion skills: `glsl-shader-effects` (writing the shaders), `scroll-choreography` (GSAP + Lenis details), `portfolio-architecture` (file/route layout)
