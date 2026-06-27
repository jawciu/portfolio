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

- **2026-06-27 (later 4)** — **Bento: +88px below cards before footer + saturated collapsed
  gradients.** (1) Added **+88px bottom space** under the showcase before the global footer:
  `#work` section in `app/page.tsx` now `py-12 pb-[136px] md:py-20 md:pb-[168px]` (the `pb`
  overrides `py`'s bottom; 48/80 base + 88). (2) **Made the collapsed-card gradients more
  visible/saturated** so each closed card reads as a DISTINCT project (Caroline's ask).
  Boosted alpha + reach on BOTH collapsed-blob functions, then **dialed back to a middle
  ground** (first pass `f2`/`e6` read too strong): `spine()` in `ProjectCard.tsx` (the 3
  real cards) core `99`→`cc` / edge `88`→`b3`, radii/transparent stops widened
  (`35% 74%…70%`, `44% 90%…72%`); `spineWash()` in `VariantBentoSoft.tsx` (placeholders
  04/05) `40`→`80` / `33`→`66`, same widened geometry. The blob sits behind the
  `backdrop-blur-xl backdrop-saturate-150` glass, so it reads as a soft diffused colour
  field, now clearly per-project (cog amber→green, synapse magenta→purple, E.ON-04
  teal/green, vector-05 orange→magenta). Open-state `bloom()` untouched. tsc + eslint clean,
  0 console errors. **Uncommitted.**
- **2026-06-27 (later 3)** — **Bento collapsed-card spines now carry a short PROJECT NAME
  (distinct from the company), + cards 04/05 set up as "coming soon".** Caroline: the
  closed bento cards only showed the company (E.ON Next / cog adhd), but she may have
  **multiple projects under one brand** (e.g. two E.ON Next), so each closed card needs a
  short project name too. Added a **`name`** field to `ProjectMeta` (`projectMeta.ts`,
  flows through `enriched`; fallback = `p.title`): Wiki Whisperer (E.ON Next) / mental
  health support (cog) / building ai agents (synapse) / AI design system (project-04) / AI
  native onboarding platform (project-05). **`lib/projects.ts`**: project-04 company →
  **E.ON Next**, project-05 → **vector** (titles set to the names; both stay
  `placeholder: true`). **`ProjectCard.tsx`**: new optional **`collapsedTitle`** prop;
  passed `p.name` for the 3 real cards in `VariantBentoSoft`. **KEY layout fix (don't
  regress):** rendering company + name + year as ONE vertical run **overflowed the card
  height and clipped** ("E.ON NEXT"→"ON NEXT", "COMING SOON"→"COMING SOO"). Fixed by
  splitting the collapsed spine into **TWO vertical columns** — `writing-mode: vertical-rl`
  on the wrapper makes `block` children flow as columns right-to-left, so column 1 (bright
  `text-sm/base`) = `company · year`, column 2 (dimmer `text-xs/sm text-fg/70`, `mt-2.5`
  gap) = the project name. Each column is short enough to never overflow. **Both columns
  centered** along the card's vertical via **`text-center`** on the wrapper (in vertical-rl,
  text-align runs vertical, so this centres each row in the card height). Same two-column
  structure on the **placeholder cells** (04/05). **Cards 04/05 show year `2026`** (not
  "coming soon" — Caroline's call; the "coming soon" treatment will live on their OPEN
  cards, designs coming from her). Both stay `placeholder: true`. tsc + eslint clean;
  verified at 1440@2× (0 console errors) — all four spines read cleanly, centered, no
  clipping. **Uncommitted.**
- **2026-06-27** — **Shared `CaseStudyButton` component + wiki Rollout character / What's
  Next swap / hide Takeaways / cog "View next project" reuse.** (1) **New reusable
  `components/project/CaseStudyButton.tsx`** (`"use client"`) — the squarish thin-border,
  bold mono-uppercase, hover-fill CTA. Takes a **`color` prop** (per-case-study accent; set
  via an inline `--csb` CSS var so `border-/text-/hover:bg-[var(--csb)]` all follow it) and
  renders a Next `<Link>` when `href` is set else a `<button>` (pass `onClick`). Both the
  wiki **`WatchVideoButton`** (color `#b52fa5`, keeps its scroll-to-top + restart-video
  onClick) and the wiki + cog **`NextProject` "CHECK IT OUT"** buttons now use it.
  (2) **Wiki Rollout**: added the **leaf mascot** (`assets/Idle/wiki-leaf-character.png` →
  `public/projects/wiki-whisperer/wiki-character.png`, `w-[220px]`) above the watch-video
  button in the right column. (3) **Wiki What's Next**: swapped to **illustration LEFT,
  copy RIGHT**. (4) **Hid the wiki Takeaways section** ("do it later") — commented out the
  import + `<Takeaways/>` in `app/project/wiki-whisperer/page.tsx` (easy to restore).
  (5) **Cog `NextProject` reworked to match the wiki structure** (Kicker eyebrow "View next
  project" + h3 + `CaseStudyButton`), button colour = **`#006b4b` (cog `--dark-green`)**.
  **NOTE/flag:** this REPLACED cog's old confetti-ribbon + purple-stripe band (the
  decorative `image-44.svg` swooshes + dashes are gone) — tell Caroline in case she wants
  that flourish kept. (6) **Wiki `NextProject`**: added a **`SoftBlob` on the right** (the
  section is now `relative isolate overflow-hidden`). tsc + eslint clean, 0 console errors
  on both pages; verified all sections via the standalone-Playwright trick. **Uncommitted.**
- **2026-06-27 (later 2)** — **Tinted-band lightened + bg-boundary breathing space + case-study
  skill updated.** (1) Wiki NextProject tint **2× lighter**: `#f8f1ff` → **`#fcf8ff`** (barely
  visible, ambient blob still reads on it). (2) **Fixed the hard bg-colour boundary with no
  breathing space** (Caroline flagged in BOTH studies): the section ABOVE a background change was
  `pb-0`, so its content butted against the colour-change line. Added **`pb-[120px]`** to the
  section above each boundary — wiki **`WhatsNext`** (above the tinted NextProject) and cog
  **`Takeaways`** (its `--cog-bg-section` tint meets the cream NextProject). Same 240px-with-
  colour-change-at-midpoint convention as the BookingDropoff→JourneyMap boundary. (3) **Captured
  the whole session's patterns into the `case-study` skill** (`build.md`) so it's not re-explained:
  added recipes for the **`Stats`** component (font-bold, fixed-width items + consistent
  `lg:gap-x-[88px]` gutter, `py-11`), the shared **`CaseStudyButton`** (color prop, Link/button,
  watch-video scroll+restart variant), the **closing "View next project"** structure (+ optional
  tinted band), the **SoftBlob containment rule** (keep the box inside `overflow-hidden` so it's
  not cut), and the **bg-colour-boundary → `pb-[120px]` on the section above** rule (+ whisper-
  subtle tints). Plus gotchas: JSX comment can't follow `return (`; `CaseStudyButton` is shared not
  per-study; copy only gets shorter. tsc + eslint clean; both boundaries verified. **Uncommitted.**
- **2026-06-27 (later)** — **Wiki Rollout / What's Next / NextProject polish.** (1) Rollout:
  **watch-video button moved UNDER the copy** (left column, `items-start`); the leaf mascot
  sits alone on the right. (2) What's Next: **copy made more concise** ("Next are the bigger
  improvements flagged in the research: a Kraken integration for account-specific answers,
  and image support.") and the **gap tightened** — grid `lg:grid-cols-2` → `lg:grid-cols-[auto_1fr]`
  (`lg:gap-12`) so the copy sits close to the illustration instead of starting at the 50%
  line. (3) Wiki NextProject: gave it a **subtle lilac tint `bg-[#f8f1ff]`** so the band
  stands out as distinct, and **fixed the SoftBlob being clipped** — it was `right-[-8%]
  top-1/2` (extending above the section, so `overflow-hidden` cut a hard top edge). Now
  `bottom-[2%] right-[2%] h-[330px] w-[560px]` — fully contained (SoftBlob fades within its
  box, so no visible edge) and sitting low so it reads as part of the band. cog NextProject
  unchanged (no blob/tint there). tsc + eslint clean, 0 console errors, 0 h-overflow.
  **Uncommitted.**
- **2026-06-27** — **Wiki: "watch video" restarts the hero promo + What's Next → 2-col
  (image + 2 steps).** (1) The Rollout **"watch video" button now restarts the hero video
  from 0**: gave the hero `<video>` `id="hero-promo"` (`Hero.tsx`) and the button
  (`WatchVideoButton.tsx`) sets `currentTime = 0` + `play()` after scrolling to top
  (verified: 5s → 0 then resumes). (2) **`WhatsNext.tsx`** retitled to **"Account specific
  information / and image support"**, trimmed the `NEXT` list from 4 to **2** (kept Kraken
  integration + see-not-just-read), and laid out as a **two-column row — `impact.svg` on
  the LEFT, the two steps on the RIGHT** (was a 4-up grid with the image centred below).
  tsc + eslint clean, 0 console errors. **Uncommitted.**
- **2026-06-27** — **Wiki Rollout: shorter copy + "watch video" scroll-to-top button.**
  Trimmed `Rollout.tsx` to **2 paragraphs** (Caroline's copy: the V1-burn perception
  problem → led the one-minute feature-showcase video) and **replaced the dashed video
  placeholder with a "▶ watch video" button**. The promo video lives in the HERO (top of
  the page), so the button scrolls back up to it. Lenis's instance isn't exposed
  (`SmoothScroll` keeps it local), so the button is a small client component
  **`components/project/wiki-whisperer/WatchVideoButton.tsx`** using
  `window.scrollTo({ top: 0, behavior: "smooth" })` — verified it takes scrollY ~9922 → 0,
  0 console errors. Styled to match the case-study pill button (`NextProject`'s rounded-full
  green/`--green` border + hover-fill, `.case-study-label` text). tsc + eslint clean.
  **Uncommitted.**
- **2026-06-27** — **Wiki Early Impact reordered; onboarding copy → label+body; measure
  illustration moved to What's Next.** Several iterative passes on `Impact.tsx`, final
  state: (1) the "Some teams closed their support channels…" CaseStudyCallout sits **ABOVE
  the stats**; (2) the **stats**; (3) a **two-column row** — LEFT is the onboarding beat as
  a **`.case-study-label` "In the new-starter academy >" + `Body` md** ("V2 compressed the
  learning curve and reduced the number of senior advisor needed on the floor."), RIGHT is
  the **@Academy Skills Lead `TestimonialBubble`**. (Intermediate tries that Caroline then
  redirected: the onboarding line was briefly a 2nd callout below the stats, and the LEFT
  column briefly held the `impact.svg` illustration at 340 then 170px — both reverted.) The
  **`impact.svg`** (rising-arrow-over-a-ruler graphic; copied `assets/impact.svg` →
  `public/projects/wiki-whisperer/impact.svg`) now lives in **`WhatsNext.tsx`**, centred
  below the next-steps grid at `w-[170px]`. Import bookkeeping: `Impact` dropped `A`, uses
  `Body`; `WhatsNext` added `A`. tsc + eslint clean, 0 console errors; verified both
  sections via the standalone-Playwright trick. **Uncommitted.**
- **2026-06-27** — **Wiki Early Impact reworked + reusable `Stats` template primitive.**
  Caroline's edits to the **Impact** section (`components/project/wiki-whisperer/sections/
  Impact.tsx`): (1) **stats restyled to match the User pilots (`Measuring`) section** —
  centred big numbers in `#b52fa5` (Geist) with a caption beneath, dropping the earlier
  Userpilot-style metric cards / progress bars she didn't want; (2) **removed the V1
  comparison deltas** (`+17% on V1` etc); (3) the **@Academy Skills Lead quote → a
  `TestimonialBubble` (bubble-1.png) on the RIGHT**, with the onboarding label+body in the
  **left column** (two-column `lg:grid-cols-2`, `items-center`); (4) **removed** the 3
  placeholder telemetry boxes (CHI / repeat contacts / complaint resolution) and the "The
  operational telemetry above is directional…" line. Kept the "closed their support
  channels" CaseStudyCallout. **Extracted a reusable `Stats` component into `ui.tsx`**
  (template primitive, like `InsightCard`/`TestimonialBubble`): `items={[{n, caption}]}`
  (caption = string or `<br/>`-split nodes), centred numbers **`font-bold`** (NOT
  extrabold — Caroline wanted them a touch lighter), **44px top/bottom breathing room**
  (`py-11`). **Refactored the `Measuring` (User pilots) section onto the same component**
  so both stat rows share one source of truth and the bold weight matches (was its own
  inline `font-extrabold` flex row). **SPACING GOTCHA (important):** first used a
  stretch-grid (`grid-cols-2 lg:grid-cols-4` / `grid-cols-3`) that filled `max-w-[920px]`
  — but equal columns filling a fixed width make **3 items look far apart and 4 items look
  bunched** (Caroline flagged: user-pilots too spread, impact too tight). FIX: switched to
  a **centred `flex flex-wrap` of fixed-width items** (`w-[150px] md:w-[190px]`) with a
  **real, consistent gutter** (`gap-x-12 lg:gap-x-[88px]`, i.e. 48px → 88px on large), so
  the distance between any two stats reads the same regardless of count (wraps to a grid on
  small screens). Also added **+44px to the Feedback section gap** between the quick-UX
  (speed/pin/search) breakout row and the flag-form breakout row (`mt-12` → `mt-[92px]` =
  48 + 44; verified the inter-block gap = 92px). tsc + eslint clean; verified both stat
  rows + the Feedback gap via the standalone-Playwright trick. **Uncommitted.** *(Note:
  Caroline has also been hand-editing `Feedback.tsx` — trimmed copy + commented out the old
  "deeper piece" Container; left her edits intact.)*
- **2026-06-26** — **Wiki hero: promo video + gradient-glow shadow + lighter seam.** Wired
  the E.ON Next promo animation into the hero as the product visual (replaces the
  device-screens placeholder): `public/projects/wiki-whisperer/promo.mp4` (the "Scriggly"
  hype clip, **29MB, now tracked in git** — Caroline OK'd), a plain `<video autoPlay loop
  muted playsInline className="block h-auto w-full">` (1920×1080) in a rounded bordered card.
  Its "shadow" is a soft **pink→lavender gradient glow** behind the card (`#FFF0F0 → #F7EBFF`,
  `linear-gradient(135deg…)` on an absolutely-positioned blurred sibling, since box-shadow
  can't be a gradient); tuned **less diffused** (`blur-lg`, tight offsets) per Caroline.
  Also **lightened the glass-seam frost** (gradient top stops → fainter lavender, lower
  alpha) because the `#F7EBFF` band read as a visible "stripe" by the MyRole heading; it's
  now a subtle clean transition. The making-of story stays in the Rollout section (its video
  placeholder is still there — Caroline to decide: still / replay / drop). tsc + eslint clean,
  0 console errors. Committed + pushed.
- **2026-06-26** — **Wiki case study: theme-scope collision FIX + glass/bg tint polish.**
  **BUG (important gotcha):** the wiki `theme.css` scoped its `--cog-*` tokens to the SAME
  `.cog-root` class as the cog study. Next.js keeps a route's CSS loaded after client-side
  nav, so once a visitor had opened both case studies, the later stylesheet's `.cog-root`
  overrode the other's — **cog's green accents went magenta and its cream bg went white**
  (Caroline caught it). FIX: the wiki study now scopes to **`.ww-root`** (theme.css vars
  block + `<main className="ww-root">`); token names stay `--cog-*` so the copied `ui.tsx`
  is unchanged. Verified via Playwright: cog `.cog-root` = green `#19a072` / cream `#f5f4ef`
  both fresh AND after client-nav from wiki; wiki `.ww-root` = magenta `#e5007d` / white
  `#fefcff`; no leak. The shared `.case-study-*`/`.cog-container`/`.cs-word` classes are
  still duplicated across theme files but are identical (resolve vars from whichever `-root`
  wraps them), so they don't conflict — only the scoped vars block must be unique. **Updated
  `build.md`** to forbid reusing `.cog-root` and explain why (the old advice "keep `.cog-root`,
  it doesn't leak" was WRONG); flagged a future refactor to hoist the shared classes into one
  global stylesheet. **VISUAL TWEAKS (Caroline):** (1) glass seam frost retinted from a
  greige "purple haze" to a clean **`#F7EBFF`** lavender; (2) bg tints changed from lilac
  `#f7f5fb` to **`#FEFCFF` (cool near-white, main) + `#FFFAFA` (warm near-white)** as a
  whisper-subtle two-zone (top sections plate-default, Wins→NextProject get
  `bg-[var(--cog-bg-section)]`); glass gradient final stop updated to `#fefcff`. **Copy
  (Caroline's edits):** hero de-jargoned — title now "Designing an AI Brain for a Support
  Call Centre", brand shows "E.ON NEXT", summary drops "on live calls", setting-the-stage
  reworded; MyRole + Problem reworded. **AGREED:** the promo video moves to the HERO (replaces
  the device-screens placeholder) in the visual pass, with the making-of story kept in
  Rollout. Committed + pushed.
- **2026-06-26** — **Built the Wiki Whisperer V2 case study (`/project/wiki-whisperer`)
  using the `case-study` skill — first study produced by the skill.** E.ON Next project:
  an **agentic RAG** ("second AI brain") that helps generalist energy specialists answer
  complex customer queries on live calls; V2 redesign rebuilt trust after V1 (a rigid-
  prompting RAG with a 25% negative-feedback rate). Caroline's role: Research · UX/UI ·
  Testing · Launch. **Source material** (in `assets/` + her notes): 2 rendered PDFs
  (interview insights, pilot telemetry) + 3 exported decks (Ops presentation, 2nd pilot,
  tech review) + chunking eval + her data-science notes. The `.deck` files are binary
  Figma bundles (unreadable); Caroline re-exported them as PDFs into `assets/`. Read the
  Ops deck via `pdftoppm` → JPEGs (the PDF inflates >100MB on direct extract). **Impact
  framing (locked with Caroline):** lead qualitative + adoption + measurement rigour;
  quantitative as **directional, tests still running** (do NOT claim proven uplift). Key
  honest finding: the rigorous **treatment-vs-control analysis (led by a data scientist,
  Caroline supported)** showed no statistically significant lift; the glossy "9 of 11 /
  high-vs-low" telemetry (Tom Harris) has selection bias, so it's used only as directional
  colour. Real headline numbers used: **89.4% adoption**, survey deltas (96.9% would
  recommend +17% vs V1, 93.8% prevent follow-ups +33.7%, 90.6% rely less on Wiki/Slack
  +40%), teams **closing support channels**, onboarding/bootcamp ramp (FTE signal). **Hard
  rules applied:** NO em dashes; British spelling; **all names/emails anonymised** (agents
  = `@Energy Specialist`, leadership = `@Academy Skills Lead`; the Ops feedback-panel
  screenshot has real names → must be redacted in the visual pass). **Build:** own light
  **E.ON Next theme** (`components/project/wiki-whisperer/theme.css` — aubergine ink
  `#2a1a45`, magenta accent `#e5007d` mapped to the `--green` slot, lilac-white bg; scope
  class kept as `.cog-root` per build.md, just retinted). Copied the kit (ui/Reveal/
  Parallax/StreamingQuote/StickyHero), repointed `A()` to `/projects/wiki-whisperer/`.
  **13 sections** (Hero, MyRole, Problem, Redesign, UnderTheHood, Measuring, Wins, Impact,
  Feedback, Rollout, WhatsNext, Takeaways, NextProject) assembled in `page.tsx` with the
  glass seam (gradient retinted lilac). Wired the existing **E.ON Next showcase card**
  (`VariantBentoSoft` i===0) → `href="/project/wiki-whisperer"`. tsc + eslint clean;
  verified via standalone Playwright (0 console errors, nothing stuck hidden, glass seam +
  Reveal working). **STILL PLACEHOLDERS (visual pass):** product screens (pull from the
  Figma file), the 1-min promo **mp4**, the directional telemetry charts (extract from the
  Pilot Analysis PDF — earlier `pdftoppm` to `public/` silently failed, retry), the
  **anonymised** feedback-flag-form screenshot, and palette/spacing polish. The "trust
  before anything" hero callout wording is mine (Caroline to confirm). **UNCOMMITTED.**
- **2026-06-26** — **Created the `case-study` project skill** (`.claude/skills/case-study/`)
  so new case studies repeat cog's structure/voice/build from raw material. Caroline has 3
  more case studies to add and wanted a skill encoding her tone of voice, heading structure,
  paragraph length, storytelling + the reusable build template, so she can hand over raw
  assets + unorganised copy and get a structured page. **Decisions locked with her (via
  AskUserQuestion):** (1) **flexible block library**, not one rigid arc — assemble section
  archetypes to fit each project's *shape* (research UX / product-build / marketing), cog
  being the canonical example; (2) **own visual identity per study** — each gets its own
  scoped `theme.css` PALETTE, but reuses the same `.case-study-*` type system, `ui.tsx`
  primitives, `Reveal/Parallax/StreamingQuote` motion, layout rhythm, and the glass seam
  (the template is structural; colour is per-project); (3) **voice mined from cog + her
  earlier written case studies** — she's sending her old Framer case studies next to enrich
  the voice rules. **Files:** `SKILL.md` (intake→outline→write→scaffold→wire→verify
  workflow), `structure.md` (the arc + a 14-block library table mapping each block to its
  arc beat / primitives / copy length, + block-selection-by-project-shape + a raw-material→
  block intake checklist), `build.md` (exact scaffold: copy the kit, retint theme palette
  only, assets via `A()`, the `pt-[120px]` section frame + baked-gap rules, `page.tsx`
  glass-seam assembly, showcase-card wiring, the standalone-Playwright verify trick + cog
  gotchas), `voice.md` (first-person/plain/outcome-first stance, 1–3-sentence paragraphs,
  eyebrow=topic/heading=takeaway, the 3 quote registers, storytelling rules, a voice
  checklist). Built from a full read of cog's `page.tsx`/`ui.tsx`/`theme.css`/motion kit +
  DESIGN.md. **Hard rules in the skill:** never fabricate findings/quotes/metrics/personas
  (ask for the real material); don't restyle the shared type tokens per project (palette
  only); don't force a non-research project into the research arc. **VOICE PASS DONE
  (same session):** Caroline pasted her real written studies (the **booking-conversions**
  study + the **marketing-website** study), her About/intro/footer copy, and ~7 LinkedIn
  posts. Replaced `voice.md`'s ENRICH stub with a rich **"From the originals"** section
  capturing her **signature micro-devices** — ellipsis verb-lists (`…researched …analysed
  …focused`), `>`-suffixed lowercase labels, statement stacks ending on a "my goal was…"
  line, numbered `goal #01`, bare big-number results, `@`-attributed quotes, bold key
  phrases — plus her opening move (`SETTING THE STAGE` + one-line mission), closing move
  (`KEY LEARNINGS` + `WHAT'S NEXT` + View-next bridge), eyebrow vocabulary, favoured
  vocab (British spelling), and the LinkedIn carryover (warm/curious/self-aware) WITH a
  do-not-copy list (emojis/hashtags/@shoutouts/sparkles out of case-study body). Also added
  to `structure.md` the **three real arcs** (booking-conversions / marketing-website /
  research-strategy=cog) as shape references, noting the cross-study frame (`SETTING THE
  STAGE` + 4-step `MY ROLE` open; `KEY LEARNINGS`/`WHAT'S NEXT`/View-next close). **The 2
  pasted studies are likely 2 of the 3 new pages to build** (booking conversions +
  marketing website; 3rd TBD, maybe synapse). **THREE REFINEMENTS (same session, Caroline):**
  (1) **NO EM DASHES, EVER** in case-study copy — added as a hard rule in `voice.md` + the
  voice checklist + `SKILL.md` non-negotiables, and saved as a global **feedback memory**
  (`no_em_dashes.md`) since it's a durable writing preference (rewrite with full stop / comma
  / colon / parentheses; en dashes in number ranges are fine). (2) **Impact is the north
  star** — added a "every case study sells the impact" section to `voice.md` (lead with the
  outcome, tie every decision to user AND business impact, show product judgement not just
  craft) + checklist item + `SKILL.md` non-negotiable. Goal: showcase how Caroline as a
  product designer drives impact for products/companies. (3) **The 4 signature elements are
  REQUIRED on every page** — added an explicit "Required signature elements" section to
  `build.md` (Reveal scroll-in, Parallax drift, StreamingQuote/CaseStudyCallout word-reveal,
  and the glass hero overlay/seam) + `SKILL.md` non-negotiable. All new skill prose written
  em-dash-free. **NEXT:** build the 3 new studies from her assets using the skill.
  Uncommitted (new skill files + CLAUDE.md + memory only).
- **2026-06-26** — **Fun motion round 2: parallax + word-streaming quotes on the EXISTING
  sections** (Caroline's redirect — see next bullet). After the all-sections `Reveal`
  (committed), I first tried an experimental NEW section — `InteractiveWeek`, a playable
  weekly-check-in chart that demonstrates the product. **Caroline removed it** — she didn't
  want a new *section*, she wanted the existing content animated "a bit more fun" (parallax
  / streaming). The `InteractiveWeek.tsx` file + its `page.tsx` mount were deleted (page.tsx
  is back to its committed state; nothing of it remains). *(If ever wanted again: it was a
  cream InsightCard-style card, 7 GSAP-grown day-bars of Katherine's invented focus data,
  hover/tap/arrow-key readout with a count-up score, pre-selecting the hardest day; fully
  a11y + reduced-motion safe.)* **Pivoted to two reusable primitives:**
  **(1) `Parallax.tsx`** — wraps an image/cluster, scroll-scrubbed vertical drift
  (`fromTo y:+speed→-speed`, `ease:none`, `scrub:true`, `start top bottom`/`end bottom
  top`), reduced-motion gated via `gsap.matchMedia`. Applied to: Challenges phone
  (`speed 42`), Strategy's two CardStack clusters (`40` / `-32`), and Results' two
  testimonial COLUMNS (`22` / `-18`). RULE: never put Parallax + Reveal on the SAME element
  (both write `y`) — Parallax goes on the inner img/cluster, Reveal on the outer block.
  **Results overlap fix (Caroline):** per-bubble Parallax made the zigzag bubbles drift
  INTO each other; fixed by wrapping each COLUMN in ONE Parallax (rigid unit → internal gaps
  never change; the two columns are separate x-bands so they can't cross). **(2)
  `StreamingQuote.tsx`** — types a quote CHARACTER-by-character as it scrolls in (each char
  fades opacity ONLY, staggered by inline per-char `transition-delay` ~`0.01s`/char ≈ 100
  cps) — Caroline wanted "less blur, more like the homepage typing." NO blur, NO transform
  (chars stay inline → normal wrapping, no reflow). *(was word-by-word opacity+translateY+
  blur(4px); she found it too floaty/blurry.)* DOM-driven, NO React state: chars render
  visible (SSR/no-JS/reduced all show full text), then post-mount the effect sets
  `data-stream="armed"` (instant hide, off-screen so no flash) and an IntersectionObserver
  flips it to `"play"`. CSS lives in `theme.css` (`.cs-char` + `[data-stream="armed"|
  "play"]`, fade `0.12s`). Renders `<p>` or `<blockquote>` (concrete branches, not
  polymorphic — ElementType blew up the TS union / tripped the refs lint). sr-only full
  text + aria-hidden animated copy. **Reduced-motion GOTCHA (fixed):** React's hydration
  commit runs the effect once with the server snapshot `reduced=false` (arming) BEFORE
  re-rendering to the real `true`, so chars got stuck hidden — fixed by having the `reduced`
  branch DELETE `data-stream` (un-arm) rather than early-return. **IO GOTCHA (fixed):** a
  negative bottom `rootMargin` left the 5 bottom-of-page quotes (Solution callout + 4
  Results testimonials) stuck hidden — they can't scroll above a bottom inset — so switched
  to an `intersectionRatio >= 0.25` threshold trigger. Applied streaming to **14 quotes**:
  the 6 `CaseStudyCallout` pull-quotes (new `stream` prop on the ui.tsx primitive; their
  wrapping `<Reveal>` → plain `<div>` so the text types instead of a block-fade), the 4
  Results `TestimonialBubble`s (streamed inside the ui.tsx primitive), the 3 Findings
  post-its (`as="blockquote"`), and the 1 Challenges speech bubble. tsc + eslint clean.
  Verified via Playwright: streaming CSS served (`.cs-char`, `.cs-word` gone), all 14 quotes
  / 1966 chars reach `data-stream="play"` + opacity 1 with 0 stuck (normal), 0 hidden / 0 armed
  (reduced-motion), 0 console errors; screenshots of Challenges/Findings/Results/Competitive
  confirm no reflow in the centred bubbles + parallax float reads well. **UNCOMMITTED** —
  the "try something fun" round for Caroline to react to (intensity dials: Parallax `speed`,
  StreamingQuote `step`, the `.cs-word` transition duration in theme.css). The all-sections
  `Reveal` before it is already committed + pushed.
- **2026-06-26** — **Cog case-study scroll motion: `Reveal` primitive + applied to the
  first 4 sections (a "play" / direction-finding slice).** Caroline asked to experiment
  with scroll/loading animations. Built **`components/project/cog-adhd/Reveal.tsx`** — a
  client wrapper that animates content in on scroll via GSAP ScrollTrigger (the stack
  already registered globally in `SmoothScroll`). **Motion concept = "coming into
  focus"**: content resolves from soft→crisp — `autoAlpha 0→1` + `y 28px→0` + `filter
  blur(6px)→0`, `duration 1`, `ease expo.out`, plays `once`, `start "top 85%"`. Justified
  (not generic fade-up): ties to the site's diffused-glass aesthetic + the hero glass
  reveal. Two modes: default animates the wrapper as one block; **`stagger`** animates the
  wrapper's DIRECT children in sequence (so pass the grid/flex classes to `<Reveal>` itself
  and its cells cascade — a cluster *assembles* instead of popping). Reduced-motion safe
  (`gsap.matchMedia('(prefers-reduced-motion: no-preference)')` → does nothing, content
  sits natural) and runs in useGSAP's layout effect so off-screen content hides before
  paint (no flash). Also added a global **`document.fonts.ready` + window `load` →
  `ScrollTrigger.refresh()`** in `SmoothScroll.tsx` so trigger positions are correct after
  fonts/images settle. **Applied to a contiguous top slice — MyRole, Interviews,
  Competitive, Findings** (headings stagger eyebrow→title 0.08; card grids / screenshot
  rows / thought-bubbles / post-its / insight cards stagger 0.06–0.14) so the language is
  *feel-able* while scrolling before rolling out to the other 9 sections. tsc + eslint
  clean. Verified via standalone Playwright (run the script from the PROJECT ROOT so
  `playwright` resolves — scratchpad path fails `ERR_MODULE_NOT_FOUND`): scrolled the whole
  page → 0 console errors, NO content stuck hidden (the only sub-1.0 opacities are the
  intentional `opacity-80` competitor logos); reduced-motion context → below-fold content
  visible immediately, 0 errors. **Dials:** `y` / `blur` / `stagger` / `start` props per
  call; `expo.out` + `duration 1` in `Reveal.tsx` for global feel. Caroline approved the
  slice → **rolled `Reveal` out to ALL 13 sections** (BookingDropoff/JourneyMap/Strategy/
  Methodology/Challenges/Solution/Results/Takeaways/NextProject added — same recipe:
  heading eyebrow→title stagger 0.08, content grids/rows/clusters stagger 0.1–0.15, single
  blocks as one Reveal). Re-verified full page: 0 console errors, 0 stuck/hidden across all
  13. **Committed + pushed.** Next: a more experimental/ambitious interactive moment
  (Caroline's ask) — researching web-interactivity ideas.
- **2026-06-26** — **Uniform 120px gap before every case-study section heading.** Caroline
  wanted the space between sections (after one, before the next heading) to be consistent;
  tried **88px**, then bumped to **120px** (88 read too tight). All 12 content sections shared the SAME `py-16 md:py-24` (so the gap was
  already uniform, but ~192px = 96 bottom + 96 top desktop). Switched every section from
  symmetric `py-16 md:py-24` → **top-only `pt-[88px] pb-0`** (+ NextProject's heading
  Container `pt-16 md:pt-24` → `pt-[88px]`). RATIONALE for top-only (not symmetric
  `py-[44px]`): (a) each heading gets exactly 88px of its OWN background above it → the
  metric she cares about is precise and independent of the neighbour; (b) the first
  section (MyRole) keeps ~88px below the glass plate (was 96), so its heading still clears
  the frosted top — `py-[44px]` would've dropped it to 44 into the busy frost; (c) the
  `pb-0` boundaries are invisible because adjacent section bgs are near-identical (cream
  `#f5f4ef` vs section `#f7f7f4`). Verified via Playwright: gap before EVERY heading
  Interviews→NextProject = **120px** exactly (MyRole's ~660 is measured off the tall
  Hero/glass-reveal — the special first-section-under-glass case, not a section gap);
  boundary with a full-bleed bottom (Methodology sketches → Challenges) reads clean, no
  cramping. tsc + eslint clean. **Uncommitted** pending Caroline. *Dial: the single
  `pt-[120px]` per section is the knob — change once per file (13 spots) to retune.*
  **EXCEPTION (the MyRole / glass-seam region, Caroline 2026-06-26):** the 120 felt tight
  there, so it's split — **120px BELOW the hero device screens** (Hero `Container`
  `pb-10 md:pb-12` → `pb-[120px]`) and **88px from the glass-plate top to the MyRole
  heading** (MyRole `pt-[120px]` → `pt-[88px]`). So MyRole alone uses `pt-[88px]`; every
  other section stays `pt-[120px]`. Verified: belowScreens=120, glassTop→MyRoleHeading=88.
  **EXCEPTION 2 (the cream→section bg change, Caroline 2026-06-26):** at the
  **BookingDropoff → JourneyMap** boundary the page background changes (cream `--cog-bg`
  → `--cog-bg-section`), so she wanted MORE space there — 120px on BOTH sides. Added
  **`pb-[120px]` to BookingDropoff** (was `pb-0`); JourneyMap keeps its `pt-[120px]`. So
  the content-to-heading gap at that one boundary = **240px** (120 cream + 120 section,
  colour change at the midpoint). Verified contentToHeading=240. All OTHER boundaries
  remain 120px (top-only).
- **2026-06-26** — **Solution section: persona alignment, product-cluster spacing +
  batch-booking callout.** Follow-up tweaks: **(1)** persona "Katherine Bell" + "Therapy
  Client" → **left-aligned** (`items-start text-left`, was centred); **(2)** "Katherine
  Bell" → **Geist bold** `text-base` (was `cog-label` mono); **(3) Cluster 1** (Overview
  `image-38` + Daily `image-37`) made smaller + spread apart so both read clearly —
  container `max-w-[420px]→[460px]`, image-38 `78%→60%`, image-37 `60%→48%` (overlap
  dropped from ~18% to ~8%, Overview chart now fully visible); **(4) Cluster 2** right
  card (`image-39`) moved up + right to `right-[-8%] top-[-16%]` (was `right-0 top-[14%]`
  — sits above and past the journal card's top-right, per her ref; overflows upward into
  the inter-cluster gap, no collision);
  **(5)** batch-booking statement → **`<CaseStudyCallout>`** (green left rule; was
  `<Statement>`/`cog-statement`). tsc + eslint clean; verified via Playwright against her
  2 cluster screenshots. **Uncommitted** pending Caroline.
- **2026-06-26** — **Solution section: persona photo, question prompts + product-image
  treatment.** Caroline's asks (match her Framer screenshot): **(1)** Katherine persona
  photo → **`image-32.svg`** (circular portrait + orange ring + arc lines, no tan square;
  was `image-20.svg`), sized `w-[140px] h-auto` (dropped the forced `92×92` square).
  **(2)** the 4 question-prompt icons → **`image-33/34/35/36.svg`** (green-cloud + orange
  question-mark / magnifying-glass / lightbulb / sun composites, 145×91; were
  `image-22/1/2/4`), sized `w-[140px] h-auto`. **(3)** the 4 question texts now use the
  **`.case-study-quote`** class (italic Geist 15px ink — "same styling as quotes"; was
  bespoke `font-mono 12px italic muted`). **(4)** the 4 product mockup images
  (`image-38/37/40/39`) gained the shared app-image treatment
  **`rounded-[20px] border border-[#E3E2DA] shadow-[1px_1px_10px_2px_rgba(212,210,210,0.25)]`**
  — copied verbatim from `Strategy.tsx`'s app screenshots above (replaced the old
  `drop-shadow-sm` on the two overlapping cards). Assets `image-33..36.svg` were already
  in `public/projects/cog-adhd/`, byte-identical to her `Image(33..36).svg` sources. tsc
  + eslint clean; verified via Playwright against her screenshot — close match.
  **Uncommitted** pending Caroline.
- **2026-06-25** — **Methodology: problem cards → `InsightCard`, Firebase note →
  `CaseStudyCallout`.** Reused the shared **`<InsightCard>`** (from `ui.tsx`) for the 3
  "PROBLEM #01–03" cards (label `Problem #${n}`, `.case-study-label` title, green divider,
  body) at a slightly smaller **380×260** (InsightCard gained optional `width`/`height`
  props — default 420×320, applied via inline `style` since Tailwind can't generate
  arbitrary px from runtime values; `max-w-full` kept as a class) — was bespoke
  `--cog-bg-alt` panels. Swapped the long Firebase paragraph
  ("Early on, I worked with engineers…") from `<Callout>` (`.cog-callout`, dark mono) →
  **`<CaseStudyCallout>`** (`.case-study-callout` — Geist Mono 28px, green `#19a072` left
  rule), wrapped in `mt-16`. **LAYOUT NOTE:** InsightCard is fixed **420px**, so 3 cards
  don't fit the ~1080 content column → they **wrap 2-on-top + 1-below** (centred
  `flex flex-wrap justify-center gap-9`, like Findings). FLAGGED to Caroline as a choice:
  keep 2+1, or widen the band for a true 3-across (cards would extend past the text
  column). tsc + eslint clean; verified via Playwright. **Uncommitted** pending Caroline.
- **2026-06-25** — **JourneyMap (CURRENT THERAPY PROCESS) restyled + widened to match
  her design.** Caroline's asks: **(1) section bg → `#F7F7F4`** (was `--cog-bg` cream
  `#f5f4ef` — slightly lighter; inline `bg-[#f7f7f4]`). **(2) Katherine persona image →
  `image-20.svg`** (the photo-in-orange-ring-on-tan-slanted-square composite, 274×238;
  already in `public/projects/cog-adhd/`, byte-identical to her source `Image(20).svg`)
  — replaced the old plain round chip `image-2.svg`; rendered at `w-[240px] h-auto`,
  **NOT circle-cropped** (the composite IS the framing). *(First tried `image-32.svg`, a
  similar but tighter-cropped composite; she swapped it to `image-20.svg`.)* **(3)
  "Katherine Bell" → bigger + bold + new `--dark-green` token (`#006B4B`)** added to
  `theme.css` `.cog-root` — rendered as Geist sans `text-xl font-bold` (was the small
  `cog-label` mono in `--cog-green`). **(4) quote** under the name now **italic + indented right** (`pl-8 italic`).
  **(5) "scenario" / "expectations" labels → `.case-study-label`** (Geist Mono 16px/800,
  lowercase — was `cog-label`/muted; consistent with the lowercase template convention,
  even though her old Framer ref shows caps). **(6) width:** wrapped EVERYTHING below the
  section heading (persona grid + the journey-map SVG) in a centred
  **`mx-auto w-[85%] min-[1700px]:w-[75%]`** — so the content is **75% of viewport above
  1700px, 85% at ≤1700px** (the heading stays in the normal `Container`). Journey-map img
  keeps `overflow-x-auto` + `min-w-[900px]` for small screens. Verified via Playwright:
  bg `#f7f7f4`, wrapper measures **75.0% @1920 / 85.0% @1440**, persona block matches her
  screenshot. tsc + eslint clean. **Uncommitted** pending Caroline.
- **2026-06-25** — **Findings insight cards rebuilt to match Caroline's design.** The 4
  "INSIGHT #01–04" cards in the **Findings** section ("Gaps in connection, lack of
  structure and resources") didn't match her Framer design. Per her spec: (1) card
  **background `#FAFAFA`** (was transparent) on `rounded-2xl` + a **`#F1F0EA` hairline
  border** (inline, NOT `--cog-line` — scoped to these cards so the site-wide token is
  untouched); (2) **fixed size 420×320** (`h-[320px] w-[420px] max-w-full`, `px-9 py-8`), laid out as
  a centred `flex flex-wrap justify-center gap-9` 2×2 (was a `md:grid-cols-2`); (3) the
  **"INSIGHT #0n" label → Geist Mono, all caps, bold** (`font-mono`, 15px, `uppercase`,
  `--cog-ink` — was `cog-label`/muted, not uppercased); (4) **card title →
  `.case-study-label`** (Geist Mono 16px/800, lowercase) with `leading-[1.25]`; card 03's
  title carries a manual `<br/>` so it wraps at "dips" to match her design; (5)
  **divider → green `#19A072`** via a NEW reusable token **`--green: #19a072`** added to
  `theme.css` `.cog-root` (same hex the `.case-study-callout` rule already hardcodes —
  now a named template token; divider is `h-px bg-[var(--green)]`). Body copy stays
  `.case-study-body-md` with soft ink. **Extracted the card into a reusable `InsightCard`
  component in `ui.tsx`** (`label` / `title` / `children` body) so `Findings.tsx` just
  maps the data through it — a template primitive for future case studies. tsc clean for
  these files (the pre-existing
  `Statement`-undefined error in the other agent's in-flight `BookingDropoff.tsx` is
  unrelated), eslint clean; verified via standalone Playwright at 1280@2× against her
  screenshot — close match. **Uncommitted** pending Caroline.
- **2026-06-25** — **Cog case study: Competitive layout reflow + `.case-study-callout`,
  and Findings affinity board → full-bleed cropped with overlapping post-its.** Three
  asks (all match her Framer screenshots): **(1) Competitive** — the small 120px
  side-by-side screenshots became **two full rows** in `Competitive.tsx`: row 1 = two
  BIG self-help screenshots (`image-11`+`image-10`) on the LEFT, text on the RIGHT;
  row 2 = text on the LEFT, two BIG therapy-platform screenshots (`image-17`+`image-18`)
  on the RIGHT (each row a vertically-centred `md:grid-cols-2`; image pairs are a `flex`
  of two `w-1/2 max-w-[220px] object-contain`, justified start/end; row-2 uses
  `md:order-1/2` to keep text-left/images-right). Dropped the `rounded-xl border` (the
  reference shows clean borderless screens). **(2)** the gap line ("This gap in
  therapy-support tools…") swapped from `<Callout>` (`.cog-callout`) → **`<CaseStudyCallout>`**
  (`.case-study-callout` — Geist Mono 28px, green left rule), the reusable template token.
  **(3) Findings** affinity board (`image-19`) is now **full-bleed** (`w-full`, dropped
  the old `max-w-[1400px]` + `border`/`rounded`) and **cropped in height** via
  `h-[clamp(240px,34vw,400px)] object-cover object-top`; the three quote **post-its are
  pulled UP over the board's lower edge** (`-mt-20 md:-mt-28`, inside a `Container` so
  they stay centred). Post-its restyled to the original: **square** (`aspect-square`,
  removed `rounded-2xl`), **slight shadow** (`shadow-[0_8px_24px_rgba(0,0,0,0.12)]`),
  **NEW post-it colours** — added `--cog-postit-mint:#afddc9` + `--cog-postit-orange:#ffbd87`
  tokens to `theme.css` (kept the global `--cog-mint/--cog-orange` untouched since those
  drive mascots/journey headers); quote is **italic Geist** dark ink (was mono; orange
  post-it text was white → now dark ink since the new peach is light), attribution
  **bottom-right** grey. tsc + eslint clean; verified both sections via standalone
  Playwright at 1440@2× against her screenshots. **Uncommitted** pending Caroline.
  *(Dev-server note: a wedged Turbopack `.next` cache hung the cog-page compile for
  minutes — `rm -rf .next` + restart fixed it instantly.)*
- **2026-06-25** — **Glass seam: reveal the device mockups in full BEFORE the glass
  rises (measured sticky-top pin) + confirmed it's separate from the home glass.**
  Caroline on the pinned glass reveal: she likes the movement ("nice one!") but **"you
  never see the phone and tablets in full"** — the cog hero is ~1196px (TALLER than the
  viewport), so pinning it at `sticky top-0` showed its top (confetti/title/meta) and
  hid the device mockups (at the hero's bottom) below the fold; the rising plate then
  covered them before they were ever seen. **Fix:** new client component
  `components/project/cog-adhd/StickyHero.tsx` pins the hero at a **measured `top:
  -(heroHeight - viewportHeight)`** (ResizeObserver + resize listener, clamped to ≤0):
  the hero scrolls UP first so the mockups slide into FULL view, and only then does it
  stick (showing the mockups) while the glass plate rises over it. Also dropped the
  plate's `-mt-[160px]` overlap so the plate sits just below the hero — it enters only
  AFTER the mockups are fully shown. **GOTCHA (dead end):** first tried `sticky bottom-0`
  — does NOT pin here, because bottom-sticky only holds an element exiting through the
  *bottom*; our top-anchored hero exits through the *top*, so it just scrolled away
  (verified via probe: heroTop 0→-150→-900, never stuck). The measured negative-`top`
  sticky is the right mechanism (verified: hero scrolls to -296 as the tablet bottom
  comes from 1148→852 into full view, then PINS at -296 while plateTop climbs
  900→746→546→296 = glass rising; overflowX 0 throughout). **Separation confirmed (her
  Q):** home glass = `components/sections/About.tsx` (only on `/`); case-study glass =
  inline in `app/project/cog-adhd/page.tsx` (only on `/project/cog-adhd`) wrapping its
  own Hero. Neither imports the other (the page only *mentions* About in a comment) —
  different routes, no shared DOM/component/backdrop, cannot affect each other. Updated
  `case-study-glass-seam` in DESIGN.md (heroPin → measured sticky-top, overlap → 0). tsc
  + eslint clean; verified pin + reveal + 0 overflow + screenshots at 3 depths.
  **Uncommitted** pending Caroline. *Note:* planned via plan-mode (greedy-chasing-
  fountain.md) — approved approach was `sticky bottom-0`, corrected to measured sticky-
  top during impl because bottom-0 didn't pin.
- **2026-06-25** — **Interviews bubbles v3 — text VISUALLY centred per bubble (by eye).**
  Caroline: the centroid/lobe math can't work — the cloud TAILS add to the bounding box
  so true-centre still LOOKS off; each bubble must be nudged by eye until the text looks
  centred in the puff. Did exactly that: a screenshot loop (isolated throwaway route
  `app/bubtest`, since deleted, to dodge the heavy `/project/cog-adhd` route) capturing
  all 5 bubbles into one composite grid via Playwright + sharp, then nudged each
  per-bubble `box` 1–4% at a time over 2 rounds. Key insight: the text is **left-aligned
  + ragged-right**, so it optically leans LEFT, and the green clouds' dots sit
  bottom-LEFT — both pull the *perceived* centre, so most boxes needed shifting RIGHT and
  DOWN of the pixel centre. I got close over 2 rounds, then **Caroline fine-tuned the
  final values herself** (she has the line map). Final per-bubble boxes (in
  Interviews.tsx): stack `left-[16] right-[16] top-[10] bottom-[21]`, stack-1 `left-[13]
  right-[19] top-[10] bottom-[23]`, stack-2 `left-[28] right-[17] top-[16] bottom-[26]`,
  stack-3 `left-[23] right-[18] top-[23] bottom-[23]`, stack-4 `left-[26] right-[21]
  top-[11] bottom-[25]`. Caroline confirmed "perf". tsc + eslint clean. **Committed.**
  *Lesson for future cloud text: don't compute it — screenshot + nudge by eye, the tails
  + ragged-left text fool any centroid. The per-bubble `box` lines are the dial.*
- **2026-06-25** — **Interviews bubbles v2 + callout 28→ (kept 28).** Follow-up fixes
  after Caroline's review: **(1)** callout already at 28px (kept). **(2)** All 5 bubbles
  now render at **one size** (`w-[300px]`, was per-row 350/290). **(3)** The 3 green
  bubbles were all reusing `stack-4.png` — wrong. Mapped the distinct source clouds:
  bubble 2 (successful therapy) → **`stack-1.png`** (Stack(1), single tail dot), bubble 3
  (challenges) → **`stack-2.png`** (Stack(2)), bubble 5 (current process) → `stack-4.png`
  (Stack(4)). All 5 assets already existed in `public/projects/cog-adhd/`. **(4)** Text
  centring: replaced the by-tail formula with a **per-bubble `box`** tuned to each cloud's
  REAL lobe centre, computed objectively with sharp (alpha centroid over the body band
  y∈[6%,66%], excluding tail dots): stack **49%**, stack-1 **43%**, stack-2 **53%**,
  stack-3 **50%**, stack-4 **49%** (x-centres; all y-centre ~44 via `top-[12%]
  bottom-[24%]`). Bubble 4 (`stack-3`, "needs") was the one Caroline flagged — its lobe
  centre is **50%**, but I'd biased it to 43% (wrong way); now centred. Processes is 4
  lines (she okayed that). Verified via a throwaway **isolated route** (`app/bubtest`,
  since deleted) because the full `/project/cog-adhd` route briefly **wedged Turbopack on
  compile** during a dev-server restart (transient — recovered, served 200 after; the
  heavy route pulls in Hero + the other agent's in-flight `StickyHero`/`page.tsx`). Final
  cx measured 49/43/53/50/49, all bubbles 300px, 3 distinct greens confirmed on the real
  page. tsc + eslint clean. **Uncommitted** pending Caroline (prior bubble v1 is already
  committed in `7723eff`).
- **2026-06-25** — **Interviews: 48px card gap, new `.case-study-callout` template,
  speech bubbles rebuilt into 2 tidy rows.** Three of Caroline's asks: **(1)** persona
  cards "a bit closer — 48px gap": swapped the grid for **flex** (`mt-20 flex flex-col
  items-center gap-6 sm:flex-row sm:justify-center sm:gap-12`) so the three 260px cards
  sit with a literal **48px** (`gap-12`) gutter instead of the wide grid-column slack.
  **(2)** NEW reusable **`.case-study-callout`** template class + `CaseStudyCallout`
  component (in `ui.tsx`) for left-ruled statements — **Geist Mono, 28px / line-height
  1.2** (Caroline dropped 32→28), light `--soft-ink` (#4a4a4a), **2px green rule
  `#19a072`** on the left (22px on ≤640px so it doesn't overflow). Applied to the "My goal was to gain a deeper
  understanding…" callout (was the dark near-black `Callout`/`.cog-callout`). Left
  `.cog-callout`/`Callout` UNTOUCHED — it's used in 4 other sections (Findings/Strategy/
  Competitive/Methodology). **(3)** Rebuilt the **thought-bubble cluster** (was a
  flex-wrap mess of per-bubble `translate`/`mt` hacks that overlapped) into **two clean
  rows, no overlap**: row 1 = purple (processes) · green (successful therapy); row 2 =
  green (challenges) · purple (needs) · green (current process) — matches Caroline's
  reference. Each cloud renders via a small `Bubble` helper that puts the question in a
  **narrow centred column over the main lobe**, biased away from the cloud's trailing
  dots (purple `stack.png`/`stack-3.png` = tail bottom-RIGHT → box `left-[16%]
  right-[24%]`, x-centre ~46%; green `stack-4.png` = tail bottom-LEFT → `left-[24%]
  right-[16%]`, x-centre ~54%; both `top-[12%] bottom-[24%]`, y-centre ~44%), text
  **left-aligned** (`text-left`) at 15px. **KEY tuning gotcha:** the span fills the box
  width (text wraps to the box), so the box must be NARROW (~60% of the bubble) AND
  centred on the lobe — a wide box made the text hug the left edge edge-to-edge (her
  first "still fucked up" screenshot); over-biasing pushed green text too far right
  (56%). Landed on a ~60%-wide box, gentle ±5% tail bias. Row 1 bubbles `w-[300px]
  md:w-[350px]`, row 2 `w-[260px] md:w-[290px]`. Saved `.case-study-callout` to DESIGN.md
  (token + prose). tsc + eslint clean; verified via Playwright (card gap 48px; callout
  Geist-Mono/28px/1.2/#4a4a4a/#19a072-rule; 5 bubbles in 2 rows, text centred over lobes,
  no overlap). **Uncommitted** pending Caroline. *Note:* "light ink" read as `--soft-ink`
  #4a4a4a — easy to lighten if she wants it greyer.
- **2026-06-25** — **Case-study template: BAKED the heading→content gap (48px) +
  Interviews persona cards reworked.** Caroline: (1) the heading→cards gap (she
  pointed at Interviews/HOLISTIC INSIGHTS) is too small — make it **48px and
  consistent across ALL sections**; (2) the Interviews persona labels → `.case-study-label`,
  card body to **3 lines**, cards **less wide** (match her original screenshot). **(1)**
  Mirrored the eyebrow→heading pattern: added **`margin-bottom: 3rem` (48px)** to
  `.case-study-section-heading` in `theme.css`, so the gap is now baked template-wide
  and **collapses** with each section's existing content top-margin → a uniform 48px
  below every heading with only ONE edit (most sections had `mt-6/8/10/12` ≤ 48, so
  they collapse to 48 untouched). Fixed the 2 sections whose content margin EXCEEDED 48
  on `md` (would win the collapse): dropped `md:mt-16` from **Takeaways** + **Findings**
  (now rely on the baked 48). **Caveat discovered + fixed:** the class is reused
  mid-component in **NextProject** next to an `inline-flex` button (which does NOT
  margin-collapse), so the baked 48 floated its button 48px lower — neutralised with
  **`mb-0!`** on that one h3 (Tailwind important beats the class, since `.case-study-*`
  loads after Tailwind). **(2)** Interviews: labels `cog-label text-[15px]` →
  **`.case-study-label`** (Geist Mono 16px/800, lowercase → "therapy clients" etc.);
  body `mt-2 text-[13px]` → `mt-3` (the dead `text-[13px]` removed — `.case-study-body-md`
  already wins at 16px); cards `max-w-[260px] mx-auto` → body wraps to **3 lines**.
  Because the mascots **overhang the card top by ~32px**, the Interviews card grid uses
  **`mt-20` (80px)** so the *visible* clear gap below the heading is still 48px (others
  have no overhang, so `mt`-collapse to the card top = 48px = the visible gap). Saved
  to DESIGN.md (section-heading `marginBottom` token + the bake/collapse/`mb-0!`/overhang
  caveats). tsc + eslint clean; verified via Playwright — every section heading→content
  gap = 48px (Interviews 49px visible to mascots / 80px to box), 3-line body, 260px
  cards, label 16px/800/lowercase, NextProject button gap restored to 28px. **Touched
  only my files** (theme.css + Interviews/Takeaways/Findings/NextProject sections +
  DESIGN.md) — left other agent's section alone. **Uncommitted** pending Caroline.
- **2026-06-25** — **Case-study GLASS SEAM — ties the case study to the homepage
  (PINNED reveal with movement).** Caroline wants the case study to echo home, where
  `About` (a frosted glass sheet) glides up over the fixed WebGL hero. Wrapped
  everything after the Hero (MyRole→NextProject, 13 sections) in a **cream glass plate**
  in `app/project/cog-adhd/page.tsx` — `relative z-10 -mt-[160px]`, `rounded-t-[2.5rem]`,
  `backdrop-blur-2xl backdrop-saturate-150` (`blur(40px)`), a top rim-glint hairline,
  a soft top shadow (floating-glass depth), and a gradient whose frosted top is tinted
  **darker** than the cream → lands on solid `#f5f4ef` FAST (~185px). **IMPORTANT
  REVERSAL:** I first built the *static* "glass seam" (hero scrolls normally, plate just
  overlaps its bottom) — Caroline had picked that over a pinned reveal when I asked, BUT
  on seeing it **rejected it: "noo i don't like it should be more like homepage, this
  has no movement."** So the hero is now **`sticky top-0 z-0`** (pins like home's fixed
  hero) and the plate scrolls UP over it = real movement (verified: heroTop stays 0
  while plateTop goes 1036→786→536 as you scroll). She also asked to **darken the glass
  at the overlap so it's more visible** → frosted top tint changed from light cream to a
  greige `rgba(206,201,186,0.62)`. **GOTCHA:** sticky breaks if an ancestor has
  `overflow-x-hidden` (makes the ancestor a scroll container, so sticky pins to it, not
  the viewport) — so I **removed `overflow-x-hidden` from `<main>`** and re-verified
  `overflowX === 0` at 1440 (no h-scroll without it). The case-study hero ≈ one viewport
  tall (after the earlier `pb-16/24 → pb-10/12` padding trim) so all of it
  (confetti/title/meta/devices) shows at rest, then the cream rises over it bottom-up.
  **Dials:** `-mt-[160px]` (overlap), gradient stops (darkness + fade speed),
  `backdrop-blur-2xl` (frost), the `shadow-[…]` (depth). Saved as `case-study-glass-seam`
  in DESIGN.md. tsc + eslint clean; verified pinning + movement + 0 overflow + screenshots
  at 3 scroll depths. **Uncommitted** pending Caroline.
- **2026-06-25** — **Footer promoted to GLOBAL + icon rework.** Caroline: use the
  footer across all case studies, drop the name, and restyle the icons. Changes:
  (1) **Mounted `<Footer />` in `app/layout.tsx`** (after `{children}`, inside
  `<Providers>`, beside `<NavBar />`) and **removed it from `app/page.tsx`** — so the
  one dark footer now closes EVERY route (home + case studies). It sits outside the
  case-study `.cog-root` scope, so it stays dark on the light cog page (no leak).
  (2) **Removed "Caroline Jaworsky"** from the footer; the connect block is now a
  single left-aligned column (dropped the 2-col `justify-between`). (3) **LinkedIn
  icon:** removed the white badge background — the **mark itself is now white with the
  "in" knocked out** (`fillRule/clipRule="evenodd"` on the Simple-Icons-style path,
  which has rounded corners baked in). (4) **Email icon:** removed the border ring.
  (5) **Both icons** now share a subtle **hover highlight** (`hover:bg-fg/10` on the
  44px rounded-md hit box) instead of opacity/border changes. (6) **Removed the cog
  case study's OWN footer** — `components/project/cog-adhd/sections/NextProject.tsx`
  had an inline purple `<footer>` (name + Let's Connect + old white-badge icons) that
  now duplicated the global one; deleted just that `<footer>` block (kept the "View
  Next Project" band). **Caroline explicitly authorised touching that file** (the
  other agent's area, but she okayed it via the duplicate-footer prompt). Verified:
  `tsc` + eslint clean, **1 footer per page** (home + cog), 0 console errors, icon
  fill computes to `rgb(245,245,245)` (true white — the grey look in a zoomed crop was
  just AA), LinkedIn `target=_blank`/correct href. **Uncommitted** pending Caroline.
- **2026-06-25** — **New `.case-study-label` token + eyebrow → Geist caps + Interviews
  persona images fixed.** Three asks: (1) **`.case-study-label`** — a NEW reusable
  template class (Caroline asked for the name so she can reference it later) for bold
  inline content labels. Same size + weight as `.case-study-hero-label` (Geist Mono,
  **16px, weight 800**) but **`text-transform: lowercase`** so it's ALWAYS lower-case
  regardless of markup casing. Applied to the **MY ROLE** step labels
  (research / synthesis / strategy / design — were `.cog-label` 12px/700 + utilities;
  the `>` chevron stays). (2) **Eyebrow font swap** — `.case-study-eyebrows-heading`
  changed from **Geist Mono → Geist (sans)** and given `text-transform: uppercase`
  (Caroline: "try eyebrow in geist all caps"). Everything else (13px, weight 700, ink,
  0.18em tracking, 12px margin-bottom gap) unchanged. (3) **Interviews persona images
  were mis-assigned** — re-mapped per Caroline: therapy clients `image-6→image-7`,
  therapists `image-7→image-8`, clinic staff `image-8→image-9` (the new
  `Image(9).svg`). Note: `image-9.svg` was ALREADY in `public/projects/cog-adhd/` and
  byte-identical to her source `~/Documents/Framer website/Cog clinic research
  assets/Image(9).svg`, so no copy was needed — just referenced it. `image-6.svg` is
  now unused. Simplified the persona alts to neutral "Mascot representing {role}" to
  avoid a visual-description mismatch after the swap. Saved `.case-study-label` + the
  eyebrow font change to DESIGN.md (front-matter tokens + prose). tsc + eslint clean;
  verified via Playwright (label 16px/800/lowercase/Geist-Mono ×4; eyebrow
  13px/700/uppercase/Geist; personas → image-7/8/9) + eyeballed MyRole + Interviews via
  the standalone-Playwright trick. **Uncommitted** pending Caroline.
- **2026-06-25** — **Homepage FOOTER built** (`components/Footer.tsx`, mounted at the
  bottom of `app/page.tsx` inside the dark `bg-bg` plate, after `#work`). Caroline's
  asks: (1) **bg = homepage bg** (`bg-bg` #070709, hairline `border-t border-fg/10`);
  **"Let's Connect" = 36px desktop** (`text-2xl md:text-[36px]`, font-mono uppercase
  bold — echoes the homepage HUD/label language; flag-able to Iosevka if she prefers).
  (2) the joy paragraph uses **`.case-study-body-md`** (16px / lh 1.4 / Geist). (3)
  **"Reach me here" → Geist 16px bold** (`font-body text-base font-bold`, was mono 11px
  in the cog footer). (4) **LinkedIn + email icons matched to her reference** — LinkedIn
  is the Simple-Icons mark filled white in a `rounded-md` badge (the glyph IS a rounded
  square + "in", so white-on-bg reads as the dark "in"); email is an outlined envelope
  in a matching bordered square. **Links:** LinkedIn → `https://www.linkedin.com/in/
  carolinejaworsky/` `target="_blank"`; email → `mailto:jaworskycaroline@gmail.com`.
  **KEY decision — promoted the template tokens site-wide:** `.case-study-body-md` and
  `--soft-ink` previously lived ONLY in the cog `theme.css` (imported just on the case-
  study page), so they didn't exist on the homepage. Copied them into `app/globals.css`
  (`:root --soft-ink: #4a4a4a` + the class) so they're genuine site-wide template tokens
  — an identical mirror of the cog copy (harmless duplicate; I deliberately did NOT edit
  the in-flight cog `theme.css`, which the other agent has modified). The footer is dark,
  so instead of stacking a colour utility on the class (which DESIGN.md forbids — it must
  stay self-contained), the `<footer>` **overrides `--soft-ink` in its own scope** to
  `rgba(245,245,245,0.72)` → the body reads light without touching the class. **GOTCHA
  (re-confirmed):** Turbopack serves STALE compiled CSS after a `globals.css` edit and a
  bare `touch` did NOT bust it — only a real *content* change forced the recompile (the
  new class was absent from the served stylesheet until then). After any globals.css
  edit, verify the rule is actually in `document.styleSheets`, not just the source file.
  Verified via standalone Playwright: heading 36px/700/Geist-Mono, body 16px/22.4px-lh
  /`rgba(245,245,245,0.72)`/Geist, "Reach me here" 16px/700/Geist, LinkedIn `target=
  _blank` + correct href, footer bg `rgb(7,7,9)`, 0 console errors; screenshot matches
  her reference. tsc + eslint clean. Saved to DESIGN.md (the body-md token note now
  records it's global + the dark-scope `--soft-ink` override pattern). **Did NOT touch**
  the cog case-study footer (`sections/NextProject.tsx`) — separate, other agent's area.
  **Uncommitted** pending Caroline.
- **2026-06-25** — **Case-study type template hardened: section-heading + eyebrow
  renamed/reusable, unified eyebrow→heading gap, 36px headings, body-md everywhere
  (cog-body deleted).** Five of Caroline's asks: (1) **`.case-study-section-header` →
  `.case-study-section-heading`** (her preferred name; renamed across theme.css +
  `ui.tsx` `Title` + `NextProject.tsx`). (2) **Eyebrow `.cog-kicker` →
  `.case-study-eyebrows-heading`** (her name), and made **bolder: weight 600 → 700**.
  (3) **Unified the eyebrow→heading gap** — it was per-section (`mt-3`/`mt-4`/none, so
  Findings/Strategy/Methodology had a 0 gap that read too tight). Baked a single
  **`margin-bottom: 0.75rem` (12px, = the Interviews/HOLISTIC spacing)** onto the
  eyebrow class and stripped the `mt-*` off every `<Title>` that follows a `<Kicker>`
  (Results/Takeaways/Competitive/Interviews/Challenges/Solution). Verified all **9
  eyebrow→heading gaps == 12px**. Rule: sections must NOT add their own heading top
  margin. (4) **Stripped the two heading SIZE overrides** (JourneyMap `md:text-3xl`,
  BookingDropoff `clamp(1.25→1.6rem)`) so every section heading is uniform, and bumped
  the token from the old **33.6px (`2.1rem`, "random") → 36px** (`clamp(1.5rem, 1rem +
  2vw, 2.25rem)`, 24px floor). (5) **`.case-study-body-md` is now used for ALL body
  copy** — changed `ui.tsx`'s `Body` component to render it (migrated **41 paragraphs**
  16px/1.4/soft-ink), migrated the Hero meta table (role/time/tools), and for the three
  genuinely-small captions (Interviews thought-bubbles, Results italic caption,
  JourneyMap legend) DROPPED `cog-body` so they render their intended **13px/14px**
  (they carry explicit `text-[13px]`/`text-sm` + colour and inherit Geist from
  `.cog-root`) instead of the botched 15px. With no consumers left, **`.cog-body` was
  deleted** from theme.css — the root cause of the silent-15px-override is gone. KEY
  GOTCHA confirmed: `.case-study-*` classes (in theme.css, loaded AFTER Tailwind) BEAT
  Tailwind utilities, so these classes are self-contained — never stack `text-*`/
  `leading-*`/colour utilities on them. Saved all to DESIGN.md (renamed tokens, 36px,
  eyebrow weight/gap, body-md-everywhere + cog-body-deleted note). tsc + eslint clean;
  every value verified via Playwright (heading 36px/0.6px-stroke, eyebrow 13px/700/ink,
  gaps 12px, body 16px/1.4, captions 13px) + eyeballed Interviews/Findings via the
  standalone-Playwright trick (MCP screenshots still time out on this live page).
  **Uncommitted** pending Caroline. *Possible follow-up:* body line-height is **1.4**
  across all 41 paragraphs — fine on short insight paragraphs; eyeball the longer ones
  in-browser and loosen toward 1.5–1.6 if any read tight.
- **2026-06-25** — **Cog Hero confetti + case-study heading/eyebrow template
  tuning.** Three of Caroline's asks: (1) **Confetti band flush to the top edge,
  no background, 80% opacity.** The orange-streamer SVG (`image-5.svg`, transparent —
  `fill="none"`, no bg rect) previously sat on a warm `bg-[var(--cog-bg-warm)]` band
  *below* the navbar (the `pt-14 md:pt-16` on the cog-root `<main>` cleared the fixed
  bar). Caroline wanted it tucked flush under the navbar: removed that top padding so
  the confetti starts at viewport y=0, dropped the warm bg (now transparent — the
  cream page shows through the streamers), and added `opacity-80`. Works because the
  NavBar is `bg-transparent` at the top (only frosts on scroll), so the dark nav text
  overlays the streamers cleanly. Verified `confettiTop=0`, opacity 0.8, parent bg
  transparent. (2) **Section headings → SAME faux extra-bold as the page title.**
  Added `-webkit-text-stroke: 0.6px currentColor` to `.case-study-section-header`
  (+ 0.4px ≤640px), mirroring `.case-study-title` — Charon has no 800/900 cut so we
  stroke the 700 glyphs. **Size is unchanged: 33.6px desktop** (`clamp(1.5rem,
  1.1rem+1.6vw, 2.1rem)`, 24px floor). Also enforced **max 2 lines via manual
  `<br/>`**: added breaks to **Interviews** ("HOLISTIC INSIGHTS" / "THROUGH 360°
  INTERVIEWS WITH…" — and removed its `max-w-[20ch]` so line 2 fits) and **JourneyMap**
  ("CURRENT THERAPY PROCESS -" / "CLIENT JOURNEY MAP"); the other long headings already
  had breaks. **FLAGGED to Caroline:** two sections still override the heading size
  smaller — **JourneyMap** (`md:text-3xl` = 30px) and **BookingDropoff**
  (`clamp(1.25rem→1.6rem)` ≈ 20–25.6px) — so headings aren't 100% uniform in size;
  awaiting her call on unifying them to 33.6px. (3) **Eyebrows** (`.cog-kicker` —
  INTERVIEWS / COMPETITIVE ANALYSIS / …) recoloured from the green accent
  `--cog-green` → heading ink `--cog-ink`, and bumped **11px → 13px** (+2px) so the
  eyebrow + heading read as one stacked unit. Saved all three to DESIGN.md (section-
  header stroke + 2-line rule + eyebrow token). tsc + eslint clean; verified every
  value via Playwright (header 33.6px/0.6px-stroke/ink, eyebrow 13px/ink, both target
  headings = 2 lines). **Uncommitted** pending Caroline.
- **2026-06-25** — **Case-study template: body copy → `.case-study-body-md`
  (16px / line-height 1.4 / `--soft-ink`); killed the silent `cog-body`+`text-sm`
  override.** Caroline noticed the Hero summary paragraph ("As the Founding
  Designer…") was rendering at 15px even though the markup said `text-sm` (14px) —
  `.cog-body` (15px, in `theme.css`) and Tailwind's `.text-sm` are equal-specificity
  single-class selectors, so source order won and `.cog-body` quietly clobbered the
  utility. She wanted it tidied (no fighting rules), bumped to **16px / line-height
  1.4**, and the colour pulled into a **named token `--soft-ink`** (`#4a4a4a`, the
  same value as the existing `--cog-ink-soft` but a clean, non-`cog`-prefixed
  *template* token for reuse across case studies). Added the reusable
  **`.case-study-body-md`** class to `components/project/cog-adhd/theme.css`
  (Geist `--font-body`, 16px, line-height 1.4, `var(--soft-ink)`) — it's
  **self-contained**: the rule is to apply it ALONE, never stack `text-*`/`leading-*`
  /colour utilities on it (that stacking is exactly what caused the override). Swapped
  the two Hero meta paragraphs (`summary` + `setting the stage`) from
  `<Body className="… text-sm leading-relaxed">` to `<p className="case-study-body-md
  mt-2">`, and dropped the now-unused `Body` import from `Hero.tsx`. Scope kept tight:
  did NOT touch the role/time/tools mini-table (intentionally small) or the many other
  `.cog-body`/`<Body>` usages across the page — `.cog-body` stays as the generic body;
  `.case-study-body-md` is the new template default to migrate sections onto over time.
  Saved both to DESIGN.md (front-matter `case-study-body-md` token + `--soft-ink`, and
  a prose note documenting the don't-stack-utilities rule). Verified via Playwright:
  computed 16px / 22.4px line-height (=1.40) / `rgb(74,74,74)` / Geist, classes
  `case-study-body-md mt-2` (no override). tsc + eslint clean. **Uncommitted**
  pending Caroline.
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

### 2026-06-27 — Wiki case-study polish pass (Early Impact / Rollout / What's Next / NextProject) + reusable components + glass footer
- **Status: WORKING. Almost all committed + pushed** on `project-showcase-experiment`. Long
  iterative visual session with Caroline. The Decision Log (top of this file) has the blow-by-blow.
- **Shipped this session (per-section detail is in the Decision Log entries dated 2026-06-27):**
  1. **Early Impact** (`Impact.tsx`) — stats restyled to match the **User pilots** big-number
     look, V1-comparison deltas removed, callout reordered above the stats, onboarding beat as a
     `case-study-label` + `Body` next to the @Academy Skills Lead `TestimonialBubble`.
  2. **Reusable `Stats` component** (per-study `ui.tsx`) — centred big numbers, **font-bold**,
     fixed-width items with a consistent `lg:gap-x-[88px]` gutter, `py-11`; `Measuring` (User
     pilots) refactored onto it so both stat rows match.
  3. **Shared `CaseStudyButton`** (`components/project/CaseStudyButton.tsx`). NOTE: Caroline
     then simplified it to **one fixed colour** (`--color-bg`, reverse-on-hover) and dropped the
     per-study `color` prop (commit `6e5d314`) — the `build.md` skill still describes a `color`
     prop; update it if that divergence matters.
  4. **Rollout** — shorter copy, the **leaf mascot** (`wiki-character.png`), and a
     **`WatchVideoButton`** that scrolls to the hero and **restarts the promo from 0** (hero
     `<video id="hero-promo">`).
  5. **What's Next** — retitled, concise copy; Caroline reworked the visual to a **cropped
     opportunity table that bleeds off the screen-left edge** with a right-edge mask fade
     (`opportunities-table-crop.png`), copy on the right.
  6. **NextProject** — wiki version is a **frosted lilac glass panel** (`rounded-t-[2.5rem]`,
     `backdrop-blur-2xl`, rim glint, soft shadow, `bg-[#fcf8ff]` whisper-tint) with **two
     `Parallax` blobs** (more visible) and **`-mt-[64px]`** so the What's Next table **tucks
     under the rounded glass corner** (fixes the straight-cut corner). cog NextProject reworked
     to the same eyebrow+heading+CTA structure.
  7. **bg-colour boundary rule** — section above a tint gets `pb-[120px]` (cog `Takeaways`);
     captured in the `case-study` skill `build.md` along with `Stats`, `CaseStudyButton`, the
     closing-section recipe, and the **SoftBlob containment rule** (keep the box inside
     `overflow-hidden` so it isn't cut).
  8. **Hid the wiki `Takeaways`** section for now (commented out in `page.tsx`; restore later).
  9. **Global footer glassy edge** (`Footer.tsx`) — an **uneven** lit bevel (overlapping
     elliptical highlights, brightest ~17%/72%) + the **bento card's shiny rim line**, reading
     as glass without rising over anything. **Bug fixed:** the homepage footer copy looked grey
     because the homepage's `fixed inset-0 z-[5]` darkening plate painted over the `z-auto`
     footer — gave the footer **`z-10`** so it sits above the plate (wiki had no such plate, so
     it was already fine).
- **Commits:** `65814ca` (the Impact/Rollout/What's-Next/NextProject pass + Stats + initial
  CaseStudyButton + breathing space + skill update), `6e5d314` (Caroline: CTA single fixed
  colour), `d7af042` (Caroline: bento card spine names + cards 04/05). Final commit this session
  = the **footer glass + What's Next table** work (Footer.tsx + WhatsNext.tsx + the crop image).
- **UNCOMMITTED at handoff:** just the footer-glass + WhatsNext changes being committed now.
  **Intentionally NOT committed:** the big source decks/PDFs + source SVGs in `assets/` (87–120MB
  each), and the orphaned **`public/projects/wiki-whisperer/opportunities-table.png`** (the
  non-crop version — WhatsNext now uses `-crop`; left untracked, delete or keep as Caroline likes).
- **Gotchas reaffirmed:** a `{/* */}` JSX comment can't follow `return (`; MCP/`networkidle`
  screenshots time out on these live pages → use the standalone-Playwright trick from the
  project root; a white rim line exactly on a light/dark boundary is invisible (push the
  highlight a few px into the dark); shared tree → `git add` specific files, never `-A`.
- **Open / next steps:** continue the wiki visual pass; re-enable + build the **Key Takeaways**
  section when ready; decide on the orphan `opportunities-table.png`; if the `CaseStudyButton`
  fixed-colour decision sticks, update the `build.md` skill note (currently says `color` prop).
- **Open intent:** none stated for next session.

### 2026-06-26 (eve) — Built the `case-study` skill + the Wiki Whisperer V2 case study; SHORT BREAK (Caroline back in ~30 min)
- **Status: WORKING, ALL COMMITTED + PUSHED.** Branch `project-showcase-experiment`, HEAD
  `7746bc9`. Caroline paused (~30 min, heat + machine crashing) and shut the computer; nothing
  is at risk. Only untracked = the 3 source decks in `assets/` (intentional).
- **Done this session:** (1) created the reusable **`case-study` skill** (`.claude/skills/
  case-study/` — SKILL/structure/voice/build), mined her voice from cog + her real Framer
  studies; (2) built the **Wiki Whisperer V2 case study** at **`/project/wiki-whisperer`**
  (E.ON Next, agentic RAG) end-to-end — 13 sections, own **light `.ww-root` theme**
  (aubergine ink + magenta accent, `#FEFCFF`/`#FFFAFA` bg, `#F7EBFF` glass), hero matches cog
  meta layout, glass seam, Reveal/StreamingQuote motion; wired the E.ON Next showcase card →
  the page. See the detailed Decision Log entries above. **Impact framed honestly** (lead
  qual + adoption + rigour; quant directional, tests still running; control analysis was the
  data scientist's, Caroline supported). All names anonymised; no em dashes; British spelling.
- **Live assets in:** hero **promo video** (`promo.mp4`, 29MB tracked) on a pink→lavender
  gradient glow; **Problem section** V2 chat screenshot (`problem-chat.png`, cog image
  treatment + 24px inner padding, two-column).
- **NEXT (visual pass — pick up here):** (a) **Redesign** section — pull the real V2 screens
  from the Figma file (`figma.com/design/YuUbDFCAHnXIu9n53egFKV`); (b) **Early impact** —
  wire the telemetry charts (extract from `assets/Wiki Whisperer V2 Pilot Analysis.pdf`; the
  earlier `pdftoppm` to `public/` silently failed, retry); (c) **User-led refinement** —
  the feedback flag-form screenshot, **MUST anonymise** the real names/email in the Ops-deck
  version; (d) **Rollout** — decide the leftover video placeholder (still / replay / drop).
- **Gotchas for resume:** dev server must be running for visual checks; MCP screenshots time
  out on these live pages, so use the **standalone-Playwright trick from the PROJECT ROOT**
  (write `_x.mjs` in repo root, `node` it, `rm` it). Each case study MUST use its own theme
  scope class (wiki = `.ww-root`) — sharing `.cog-root` leaks across studies (fixed this
  session; `build.md` updated).

### 2026-06-26 — Cog Results section rebuilt + Methodology/Interviews tweaks + template extraction; committed the whole shared tree (this agent)
- **Done this session (branch `project-showcase-experiment`):**
  1. **Results section** (`sections/Results.tsx`) — major rework to match Caroline's
     Framer design: (a) intro copy split into **2 paragraphs at `max-w-[600px]`**;
     (b) the 4 mint **testimonial speech bubbles** rebuilt — explicit per-bubble sizes
     (Caroline's final: 280/300/320/340px), a **staggered zigzag** (two flex columns,
     left column dropped with `pt-50`), quote **italic** ink + **muted right-aligned**
     attribution centred in the body above the tail; (c) the phone on the right is now
     the **`Video.mp4`** screen-recording (copied to `public/projects/cog-adhd/
     results-phone.mp4`, plays via `<video autoPlay loop muted playsInline>`); the
     clip already has a device frame baked in. Phone + bubble cluster are **vertically
     centred** via `items-center` on the grid (verified: video centre 858 = bubble
     bbox centre 858, symmetric ±68px).
     - **GOTCHA — bubble assets have MIXED tail sides:** `stack-5` tail bottom-RIGHT,
       `stack-6/7/8` tail bottom-LEFT. So `flip` (which mirrors the art via
       `-scale-x-100`) is set per-bubble by eye — top-right and bottom-right are
       flipped. Always open each PNG before deciding `flip`.
  2. **Methodology sketches** (`sections/Methodology.tsx`) — the exploratory-sketch row
     is now **full-bleed + crops, doesn't shrink**: centred `flex max-w-[1800px]
     overflow-hidden`, frames fixed `w-[568px] flex-none` above 1200px (outer ones
     cropped by the screen edges as it narrows), `flex-1` below 1200px so they start
     scaling. Touch the screen edges at ~1800px.
  3. **Interviews persona cards** (`sections/Interviews.tsx`) — border swapped from
     `--cog-line` to the InsightCard hairline **`#f1f0ea`** (template consistency).
  4. **TEMPLATE EXTRACTION** — pulled the bubble into a reusable **`TestimonialBubble`**
     primitive in `components/project/cog-adhd/ui.tsx` (`asset/quote/who/width/flip`
     props; `A()` applied internally). Results now imports it. Documented it + the
     full-bleed-crop image-row pattern + the items-center centring tip in **DESIGN.md**
     (front-matter `testimonial-bubble` component + Components/Layout prose).
- **COMMITTED + PUSHED the entire shared working tree** (Caroline explicitly asked,
  grouped into a few commits) — this swept in the OTHER agents' in-flight work too:
  the section vertical-rhythm change (`pt-[120px] pb-0 bg-[var(--cog-bg-section)]`
  across most sections), Strategy/Solution/Challenges/BookingDropoff/Takeaways/MyRole/
  Hero/JourneyMap/Findings/Competitive/NextProject restyles, `theme.css` tokens, the
  ProjectCard/VariantBentoSoft (synapse) tweaks, and the synapse asset. See the commits
  below. tsc + eslint clean before pushing.
- **State: WORKING, committed + pushed.** Results verified via the standalone-Playwright
  trick at 1440 (0 console errors). Nothing in progress, nothing broken.
- **Open intent — TOMORROW:** work on the **"View Next Project" section**
  (`components/project/cog-adhd/sections/NextProject.tsx`) BEFORE starting any new case
  studies. (It currently holds the "View Next Project" band; the global footer already
  lives in `app/layout.tsx`.)
- **Note for next agent:** `results-phone.mp4` is a **2.2 MB binary now tracked in git**
  under `public/` — Caroline was told; leave it unless she asks to git-ignore it.

### 2026-06-25 — Cog case-study: hero/template polish + homepage-style GLASS REVEAL (this agent)
- **Context:** worked the `/project/cog-adhd` case study all session, ALONGSIDE a second
  ("another cakes") agent doing overlapping case-study-template work in the SAME working
  tree. They committed `fbbbccd` (global Footer) + `7723eff` (48px gaps, `.case-study-
  callout`, Interviews rework) — those swept in my DESIGN.md/CLAUDE.md doc edits too.
  **Shared tree → only ever `git add` specific files, never `-A`.**
- **Done this session (all on branch `project-showcase-experiment`):**
  1. **Hero polish** (`sections/Hero.tsx`): confetti now flush to the top edge + 80%
     opacity + no warm bg (and removed the `<main>` `pt-14/16` so it tucks under the
     transparent navbar); logo+`COG ADHD` label 2×; device row matched-height + ×1.2
     (`w-[20.3%]/max-w-[210px]` phones, `w-[53.5%]/max-w-[552px]` tablet — width ratio =
     aspect ratio so heights auto-match); meta/summary → `case-study-body-md`.
  2. **Type template** (mostly in theme.css, much now committed by the other agent):
     `.case-study-body-md` used for ALL body copy (Body component + `cog-body` DELETED);
     new `.case-study-label` (16px/800 Geist Mono, ALWAYS lowercase — the MY ROLE steps);
     section headings → 36px + faux-bold stroke, renamed `.case-study-section-heading`;
     eyebrow renamed `.case-study-eyebrows-heading`, now **Geist (sans) all-caps**, 13px/700,
     with a baked 12px margin-bottom gap; **Interviews persona images fixed** → image-7
     (clients) / image-8 (therapists) / image-9 (clinic staff).
  3. **GLASS REVEAL** (the headline feature — `app/project/cog-adhd/page.tsx` +
     new `components/project/cog-adhd/StickyHero.tsx`): everything after the hero rides a
     frosted **cream glass plate** that rises UP over the hero (mirrors home's About-over-
     hero). `StickyHero` pins the hero at a **measured `top: -(heroHeight - viewportHeight)`**
     (ResizeObserver) so the taller-than-viewport hero scrolls until the device mockups are
     **fully seen**, THEN pins while the plate rises over it. Plate = rounded-t-[2.5rem],
     backdrop-blur-2xl, DARKER greige frosted top (visible edge), rim glint + depth shadow,
     fast fade to solid `#f5f4ef`. Then added a **`h-[45vh]` buffer** between hero and plate
     so the glass rises LATER ("scroll more → glass appears"). Saved as
     `case-study-glass-seam` in DESIGN.md.
- **State: WORKING, committed + pushed.** My commits: `cee5b1a` (glass reveal + hero
  polish) and `fb25a61` (the 45vh buffer). tsc + eslint clean. The hero polish + earlier
  template bits were verified via the standalone-Playwright trick throughout (MCP
  screenshots TIME OUT on this live page — use a throwaway `playwright` script from the
  project root: `domcontentloaded` + `waitForTimeout`, freeze transitions, element-shoot).
- **Gotchas / dead ends:** (a) `sticky bottom-0` does NOT pin a top-anchored hero (it only
  holds elements leaving via the bottom) — measured negative-`top` sticky is the right
  mechanism. (b) `overflow-x-hidden` on an ancestor BREAKS sticky — removed it from `<main>`
  (re-checked: 0 h-overflow without it). (c) The shared `Interviews.tsx` briefly broke the
  build mid-session (other agent's `<Bubble>` refactor) — resolved by them.
- **Open / next steps:**
  1. **Glass-reveal timing** — Caroline's last ask was "glass goes over a bit later, viewer
     first sees MY ROLE then glass." The 45vh buffer delays the glass, BUT during the buffer
     you see the held *mockups*, then glass + MY ROLE rise TOGETHER (MY ROLE lives on the
     plate, so its heading and the glass leading edge are physically attached — MY ROLE can't
     appear strictly *before* the glass in this model). **Flagged this to her; awaiting her
     call** — either tune the buffer height, or (if she wants MY ROLE truly before any glass)
     design a different effect. Buffer dial: `h-[45vh]` in `page.tsx`.
  2. Other glass dials: `StickyHero` pin offset, the plate gradient (darkness + fade speed),
     `backdrop-blur-2xl`, the depth `shadow-[…]`.
  3. **Uncommitted in the shared tree** (NOT mine — leave for the other agent): `MyRole/
     BookingDropoff/Challenges/Competitive/JourneyMap/Results/Solution.tsx`, `ProjectCard.tsx`,
     `VariantBentoSoft.tsx`, and untracked `assets/synapse-product-imagery.png`.
- **Open intent:** none stated for next session; Caroline switched windows mid-flow.

### 2026-06-24 (late) — Case-study TYPE TEMPLATE kicked off (this agent)
- **Done this session:** Started a reusable case-study type template, tuned on the
  Cog ADHD page (`components/project/cog-adhd/`). Two commits, both **pushed** to
  `project-showcase-experiment`:
  1. `df234b3` — renamed cog-specific heading classes to generic reusable ones:
     `.cog-page-title` → **`.case-study-title`** (page H1) and `.cog-title` →
     **`.case-study-section-header`**. Title = Iosevka, uppercase, **48px desktop /
     22px mobile** (`@media max-width:640px`), manual `<br/>` after "Opportunities"
     (2 lines desktop, 3 ok mobile), **extra-bold via `-webkit-text-stroke`** (0.6px
     desktop / 0.35px mobile) because Charon ships no 800/900 cut.
  2. `b3fea07` — hero meta labels (brand/summary/setting the stage/role/time/tools)
     → new **`.case-study-hero-label`** (16px, **true** weight-800 — Geist Mono is a
     variable font). Left the shared `.cog-label` (used across many sections) alone.
  Both saved to `DESIGN.md` (typography tokens + "Case-study template" prose) and
  logged in the Decision Log.
- **Also:** added a global rule to `~/.claude/CLAUDE.md` — when Caroline asks a
  QUESTION, answer it and change nothing; only act on explicit instructions.
- **State: WORKING + pushed.** tsc + eslint clean, all sizes/weights verified via
  Playwright. Nothing in progress, no broken state.
- **Shared working tree note:** the "another cakes" agent's synapse card work was
  uncommitted while I worked — I deliberately staged ONLY my own files
  (cog-adhd theme/sections + DESIGN.md + CLAUDE.md). `git add` specific files only
  on this branch.
- **Next steps (open):** continue the case-study template top-down — likely next:
  body copy / `.cog-body`, section headers in context, callouts/statements, spacing
  rhythm. Fold each agreed decision into the `.case-study-*` classes + DESIGN.md.
- **Open intent:** keep iterating on the Cog case study + growing the case-study
  template next session.

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
