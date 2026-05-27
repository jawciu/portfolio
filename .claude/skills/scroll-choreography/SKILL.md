---
name: scroll-choreography
description: Build scroll-driven animations and page choreography for the portfolio — GSAP ScrollTrigger timelines, Lenis smooth scroll, Motion (Framer Motion) component transitions, driving R3F uniforms from scroll position, pinned hero sections, text reveals with SplitText. Use whenever wiring scroll-linked motion, page transitions, section reveals, parallax, or syncing DOM animations with WebGL.
license: Proprietary
metadata:
  project: portfolio
  stack: gsap-3.13 + motion + lenis
---

# Scroll Choreography — the portfolio motion playbook

Reference stack: **Lenis** smooths native scroll → **GSAP ScrollTrigger** drives master timelines (DOM + R3F uniforms) → **Motion** handles component-level transitions and exits. This is the same combo used by Olivier Larose, Darkroom, and most modern award sites.

GSAP became fully free for commercial use in April 2025 (Webflow acquisition) — SplitText, MorphSVG, Flip, ScrambleText all included. No license workarounds needed.

## One-time setup

Install:
```bash
pnpm add gsap lenis motion
```

Register GSAP plugins once in your app root (client component):

```tsx
// app/providers.tsx (or a SmoothScrollProvider component)
'use client'
import { useEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { SplitText } from 'gsap/SplitText'
import { Flip } from 'gsap/Flip'
import Lenis from 'lenis'

gsap.registerPlugin(ScrollTrigger, SplitText, Flip)

export function SmoothScroll({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    })

    lenis.on('scroll', ScrollTrigger.update)
    gsap.ticker.add((time) => lenis.raf(time * 1000))
    gsap.ticker.lagSmoothing(0)

    return () => {
      lenis.destroy()
      gsap.ticker.remove(lenis.raf)
    }
  }, [])

  return <>{children}</>
}
```

Wrap `app/layout.tsx`'s body content in `<SmoothScroll>`.

## Pattern 1 — Pinned hero with scroll-scrubbed timeline

This is the workhorse: hero stays full-viewport, scrolling advances a `progress` value that drives both DOM and WebGL.

```tsx
'use client'
import { useEffect, useRef } from 'react'
import gsap from 'gsap'

export function HeroChoreography({ progress }: { progress: { current: number } }) {
  const root = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: root.current,
          start: 'top top',
          end: '+=200%',
          scrub: 1,
          pin: true,
          anticipatePin: 1,
        },
      })

      // drive shared progress for R3F
      tl.to(progress, { current: 1, duration: 1, ease: 'none' }, 0)

      // DOM layers
      tl.to('.hero-title', { y: -120, opacity: 0, duration: 0.4 }, 0)
      tl.from('.hero-subtitle', { y: 80, opacity: 0, duration: 0.4 }, 0.3)
      tl.to('.hero-grain', { opacity: 0.15, duration: 1 }, 0)
    }, root)

    return () => ctx.revert()
  }, [progress])

  return <div ref={root} id="hero">{/* hero markup */}</div>
}
```

The `progress` ref is shared with the R3F scene (passed in via props or context); the scene reads `progress.current` inside `useFrame` and mutates uniforms. See the `r3f-hero-scene` skill for the receiving end.

## Pattern 2 — Section reveal (intersection-style)

For content sections (case studies, about), use ScrollTrigger without pinning:

```tsx
useEffect(() => {
  const ctx = gsap.context(() => {
    gsap.utils.toArray<HTMLElement>('.reveal').forEach((el) => {
      gsap.from(el, {
        y: 60,
        opacity: 0,
        duration: 0.9,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: el,
          start: 'top 80%',
          toggleActions: 'play none none none',
        },
      })
    })
  }, root)
  return () => ctx.revert()
}, [])
```

For Next.js App Router, prefer this pattern over Motion's `whileInView` when the reveal needs to be synchronized with smooth-scrolled position. Motion's intersection observer reads native scroll, which Lenis intercepts.

## Pattern 3 — Text reveal with SplitText

```tsx
import gsap from 'gsap'
import { SplitText } from 'gsap/SplitText'

useEffect(() => {
  // wait for fonts so SplitText splits at correct positions
  document.fonts.ready.then(() => {
    const split = new SplitText('.headline', { type: 'lines,words' })
    gsap.from(split.words, {
      y: 100,
      opacity: 0,
      duration: 1,
      stagger: 0.02,
      ease: 'power4.out',
      scrollTrigger: { trigger: '.headline', start: 'top 75%' },
    })
    return () => split.revert()
  })
}, [])
```

**Critical:** always `await document.fonts.ready` before SplitText. Otherwise it splits using fallback font metrics, then re-wraps when the real font loads, breaking your animation.

## Pattern 4 — Component transitions (Motion)

Use Motion for things ScrollTrigger isn't right for: hover/focus, page enters/exits, layout transitions, drag/gesture.

```tsx
import { motion, AnimatePresence } from 'motion/react'

<AnimatePresence mode="wait">
  {selectedProject && (
    <motion.div
      key={selectedProject.slug}
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -40 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
    >
      ...
    </motion.div>
  )}
</AnimatePresence>
```

For Next.js App Router page transitions, use Motion's `<AnimatePresence mode="wait">` + a custom layout that keys on `pathname`. Or use the new View Transitions API integration (`motion/react` supports it).

## Pattern 5 — Flip transitions (image grid → detail)

When a thumbnail expands into a case-study hero:

```tsx
import { Flip } from 'gsap/Flip'

function openProject(thumb: HTMLElement, detail: HTMLElement) {
  const state = Flip.getState(thumb)
  // ... swap DOM so detail is now in thumb's position
  Flip.from(state, {
    targets: detail,
    duration: 0.8,
    ease: 'power3.inOut',
    absolute: true,
    scale: true,
  })
}
```

This is the polished "shared element transition" that recruiters notice on case-study clicks.

## React 19 + StrictMode gotchas

- In dev, StrictMode runs effects twice → ScrollTriggers can register twice. Always use `gsap.context()` and `ctx.revert()` in cleanup.
- Don't put `gsap.registerPlugin` in a component effect; call it at module scope (in the providers file).
- `useGSAP` hook from `@gsap/react` (free) handles context + cleanup automatically — use it if you find yourself writing the same setup repeatedly:
  ```tsx
  import { useGSAP } from '@gsap/react'
  useGSAP(() => {
    gsap.from('.x', { y: 100 })
  }, { scope: rootRef })
  ```

## Performance

- `will-change: transform` on pinned/animated elements before the animation starts; remove after. GSAP can do this with `force3D: true`.
- Avoid animating `width`/`height`/`top`/`left` — animate `transform` and `opacity`. Use `Flip` for layout-affecting changes.
- `ScrollTrigger.refresh()` after the page settles (fonts, images) — do it on `load` or call it in a `useEffect` with `setTimeout(refresh, 300)`. Otherwise start/end positions are computed too early.
- `markers: true` while developing — visible debug markers for trigger boundaries.

## Don't

- Don't combine Motion's `whileInView` with Lenis. Use ScrollTrigger for everything scroll-linked.
- Don't put ScrollTrigger setup in server components or run it server-side.
- Don't forget `gsap.ticker.lagSmoothing(0)` — without it, when the tab is backgrounded then refocused, Lenis spikes scroll position.
- Don't mix `scroll-behavior: smooth` CSS with Lenis — they fight. Set `scroll-behavior: auto`.
- Don't use anchor links (`<a href="#section">`) without telling Lenis: use `lenis.scrollTo('#section')` instead.
