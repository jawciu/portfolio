# Build — scaffolding a new case-study page

The exact, reproducible steps to stand up a new case study. The cog study
(`/project/cog-adhd`) is the working reference for every file mentioned here — copy from
it, don't reinvent. `<slug>` = the new project's kebab-case id (e.g. `eon-next`).

## File map

```
app/project/<slug>/page.tsx                  # route — assembles the page (StickyHero + glass seam)
components/project/<slug>/
  theme.css                                  # scoped light sub-theme — THE ONLY per-project palette edit
  ui.tsx                                      # primitives (A() points at this slug's assets)
  Reveal.tsx  Parallax.tsx  StreamingQuote.tsx  StickyHero.tsx   # motion kit (copied verbatim)
  sections/<Block>.tsx                        # one component per chosen block
public/projects/<slug>/                       # all of this study's assets (A() resolves here)
```

## Steps

### 1. Copy the kit
Duplicate the cog folder's reusable kit into `components/project/<slug>/`:
`theme.css`, `ui.tsx`, `Reveal.tsx`, `Parallax.tsx`, `StreamingQuote.tsx`, `StickyHero.tsx`.
These are structural and slug-agnostic except `ui.tsx`'s `A()` helper and `theme.css`'s
palette. (If kit duplication ever gets annoying across studies, hoist
`Reveal/Parallax/StreamingQuote/StickyHero` to a shared `components/project/_shared/` —
but keep `theme.css` + `ui.tsx` per-slug. Don't do this refactor mid-build.)

In `ui.tsx`, point the asset helper at the new slug:
```ts
export const A = (file: string) => `/projects/<slug>/${file}`;
```

### 2. Re-theme `theme.css` (palette only — never the type tokens)
Keep the whole `.cog-root` class name and EVERY `.case-study-*` type rule **byte-identical**
(the type system is the shared template). Change ONLY the colour custom-properties at the
top to match this project's brand:

- `--cog-bg` / `--cog-bg-section` — the page surface(s). **Keep them near-white and very
  low-chroma.** Caroline retinted the wiki study from lilac-tinted surfaces (`#f7f5fb` /
  `#f2eefb`) to near-whites (`#fefcff` cool + `#fffafa` warm). Don't tint backgrounds
  strongly; let the accent carry the colour. A whisper-subtle two-zone (a cool near-white
  default + a warm near-white for later sections) reads better than one lilac wash.
- `--cog-ink` / `--cog-ink-soft` / `--soft-ink` / `--cog-muted` — text. Usually keep.
- `--green` / `--dark-green` — the divider/rule/accent. Retint to the project's accent;
  these drive `InsightCard` dividers + the `.case-study-callout` left rule. **Soften an
  over-saturated brand colour** rather than using it raw: the wiki accent went from the raw
  E.ON magenta `#e5007d` to a gentler pink `#e15bad`. Set BOTH `--green` and `--cog-green`.
- The decorative tokens (`--cog-mint`, `--cog-orange`, `--cog-purple`, post-its…) — set
  to this project's palette or drop the ones you don't use.

**Give each study its OWN unique scope class — never reuse `.cog-root`.** This is a real
trap: the `--cog-*` tokens are scoped to the wrapper class, and Next.js keeps a route's CSS
loaded after you client-side navigate away. If two case studies both scope to `.cog-root`,
then once a visitor has loaded both pages, the later stylesheet's `.cog-root { --green … }`
overrides the other's, and one study's accents/background silently change to the other's
(e.g. cog's green went magenta after the wiki study shipped). So pick a per-slug class
(`.ww-root`, `.cog-root`, `.<slug>-root`), set it in `theme.css` (the vars/base block only)
AND on the page's `<main className="…-root">`. The token NAMES can stay `--cog-*` (just
defined under the new scope) so the copied `ui.tsx` keeps working. The light theme is still
scoped so it never touches the dark site.

> Note: the shared template classes (`.case-study-*`, `.cog-container`, `.cs-word`) are
> currently duplicated verbatim in every project's `theme.css`. They're identical, so they
> don't conflict (they resolve their `var()`s from whichever `-root` scope wraps them). Only
> the scoped vars block must be unique. A cleaner future refactor would hoist those shared
> classes into ONE global stylesheet and leave each `theme.css` with just its scoped tokens.

### 3. Assets
Drop everything in `public/projects/<slug>/` with clean lowercase names. Reference via
`A("name.ext")` everywhere — never hardcode the path. Transparent PNG/SVG for anything that
floats over the page; the bubble/cloud art ships with mixed tail sides, so open each before
choosing `TestimonialBubble flip`.

### 4. Build sections (one component per block)
Each section is a plain component exported by name, following this frame (from `Findings.tsx`):

```tsx
import { Container, Kicker, Title, Body /* + InsightCard, CaseStudyCallout, A… */ } from "../ui";
import { Reveal } from "../Reveal";

export function <Block>() {
  return (
    <section data-section="<Block>" className="pt-[120px] pb-0">
      <Container>
        <Reveal stagger={0.08}>
          <Kicker>EYEBROW TEXT</Kicker>
          <Title>Heading line one<br />line two</Title>   {/* max 2 lines via manual <br/> */}
        </Reveal>
        {/* content — wrap blocks/grids in <Reveal> (stagger for card grids) */}
      </Container>
    </section>
  );
}
```

Rules baked into the template (don't fight them — see DESIGN.md):
- **Rhythm:** every section is `pt-[120px] pb-0` (the 120px-before-heading gap is uniform
  and top-only). Exceptions: the first section after the glass uses `pt-[88px]`; at a
  background-colour change add `pb-[120px]` to the section above (→ 240px there).
- **Heading→content gap is baked** (`.case-study-section-heading` has `margin-bottom:3rem`).
  Don't add a larger top margin to the first content block (it would win the collapse); use
  `mb-0!` if you reuse the heading class next to a non-collapsing sibling (e.g. a button).
- **Type classes are self-contained** — apply `.case-study-body-md` / `-callout` / `-quote`
  ALONE; never stack Tailwind `text-*`/`leading-*`/colour utilities on them.
- **Motion:** `Reveal` on the outer block (entrance: fade + rise + de-blur), `Parallax` on
  the inner `<img>` (scroll drift) — never both on the same element. `CaseStudyCallout
  stream` / `StreamingQuote` for word-by-word reveals on statements & quotes. All are
  reduced-motion safe already.
- **Full-bleed image rows** (crop, don't shrink): break out of `Container`, centred `flex`
  capped at `max-w-[1800px]`, children fixed-px `flex-none` above a breakpoint with
  `overflow-hidden` so the outer ones crop as the viewport narrows.

### 4b. Reusable layout patterns (build these in, don't hand-wait for the edit)

These are the concrete recipes behind the structure.md "layout defaults". Copy them verbatim.

**Product screenshot — the app-image card treatment** (white card, hairline, soft shadow):
```tsx
<div className="rounded-[20px] border border-[#E3E2DA] bg-white p-6 shadow-[1px_1px_10px_2px_rgba(212,210,210,0.25)]">
  {/* eslint-disable-next-line @next/next/no-img-element */}
  <img src={A("screenshot.png")} alt="…" className="block w-full" />
</div>
```
Use it on the left/right of a two-column content section: `grid items-center gap-10 md:grid-cols-2 md:gap-14`.

> **HARD RULE — every product visual uses this exact radius + hairline + soft shadow.**
> `rounded-[20px]` · a 1px hairline border in the study's lightest tint (cog `#E3E2DA`, wiki
> `#F7EBFF`) · `shadow-[1px_1px_10px_2px_rgba(212,210,210,0.25)]`. NEVER invent a one-off
> treatment — no `rounded-2xl`/`rounded-xl`, no strong/dark drop shadows
> (e.g. `shadow-[0_24px_60px...]`, big aubergine glows), no thick or coloured borders. This
> applies to *all* images, SVGs, videos and overlapping/cropped panels alike — when panels
> overlap, each one still carries the same treatment. If raw art ships with a baked-in dark
> shadow, crop it out and let this treatment supply the shadow. Caroline has corrected this
> more than once, so default to it without being asked.
>
> **Flat / square assets (raster screenshots, exported SVGs with no frame) MUST get rounded
> corners + the lilac hairline border too.** Add `rounded-[16px] border-[1.5px]
> border-[#F7EBFF]` (wiki tint) to the `<img>`. First crop any transparent padding out of the
> SVG `viewBox` so the panel fills the box edge-to-edge — otherwise CSS `rounded-*` clips empty
> margin and the visible corners stay square. For assets that already bake their own frame
> (e.g. a device mockup with a rounded panel + tooltip overhang), add the border *inside* the
> SVG as a stroked perimeter path so it hugs the real shape, never the bounding box.

**Feature/principle block — numbered `InsightCard`s, pure white, equal height:**
```tsx
<Reveal stagger={0.12} className="mx-auto mt-12 grid max-w-[900px] auto-rows-fr gap-9 md:grid-cols-2">
  {FEATURES.map(([label, title, body]) => (
    <InsightCard key={label} label={label} title={title} width="auto" height="auto">
      {body}
    </InsightCard>
  ))}
</Reveal>
```
`auto-rows-fr` + `height="auto"` makes all cards equal to the tallest (no fixed 320px box);
`width="auto"` lets them fill the grid column. The `InsightCard` background should be pure
white (`--cog-card`) and the border the study's hairline (`--cog-line`).

**Gradient "shadow" glow** (box-shadow can't be a gradient) — a blurred absolutely-positioned
sibling behind a hero card/video:
```tsx
<div className="relative mt-14">
  <div aria-hidden className="pointer-events-none absolute -bottom-4 left-5 right-5 top-8 rounded-[1.75rem] blur-lg"
       style={{ background: "linear-gradient(135deg, #FFF0F0, #F7EBFF)" }} />
  <div className="relative w-full overflow-hidden rounded-2xl border border-[var(--cog-line)]">{/* video/img */}</div>
</div>
```

**Stat row — the `Stats` component** (centred big numbers + caption; lead the impact with
these). Lives in each study's `ui.tsx` (it imports the study's `Reveal`). Spec, learned over
many rounds with Caroline, so build it exactly:
```tsx
export function Stats({ items, className = "" }: { items: { n: string; caption: ReactNode }[]; className?: string }) {
  return (
    <Reveal stagger={0.1}
      className={`mx-auto flex max-w-full flex-wrap justify-center gap-x-12 gap-y-12 py-11 lg:gap-x-[88px] ${className}`}>
      {items.map((s, i) => (
        <div key={`${s.n}-${i}`} className="flex w-[150px] flex-col items-center text-center md:w-[190px]">
          <p className="font-[family-name:var(--font-body)] text-[44px] font-bold leading-none text-[#b52fa5] md:text-[66px]">{s.n}</p>
          <p className="case-study-body-md mt-3">{s.caption}</p>
        </div>
      ))}
    </Reveal>
  );
}
```
Rules baked in (each one a correction she made): numbers are **Geist `font-bold`** (NOT
extrabold) in the study's number accent; **fixed-width items + a real, consistent gutter**
(`flex` of `w-[190px]` blocks, `gap-x-12` → `lg:gap-x-[88px]`) so spacing reads the same whether
there are 3 or 4 — a stretch-grid makes 3 look far apart and 4 look bunched; **44px top/bottom
breathing room** (`py-11`); wraps to a grid on small screens. `caption` accepts a string or
`<br/>`-split nodes. Use the **same component** for every stat row on the page so weight + spacing
match. Retint `#b52fa5` to the study's number colour.

**CTA button — the shared `CaseStudyButton`** (`components/project/CaseStudyButton.tsx`, reused
across studies). Squarish thin border (`border` not `border-2` — match the nav-bracket line
weight), bold mono uppercase label. **ONE fixed colour in every instance** — border + text are
the home background (`--color-bg`); on hover it reverses (fills with that colour, text flips
light). Renders a `Link` when `href` is set else a `<button>` (pass `onClick`):
```tsx
<CaseStudyButton href="/project/<next-slug>">CHECK IT OUT</CaseStudyButton>
// button variant (e.g. a "watch video" that scrolls to the hero promo + restarts it):
<CaseStudyButton onClick={() => { window.scrollTo({ top: 0, behavior: "smooth" });
  const v = document.getElementById("hero-promo"); if (v instanceof HTMLVideoElement) { v.currentTime = 0; void v.play(); } }}>
  <svg width="13" height="13" viewBox="0 0 12 12" fill="currentColor" aria-hidden="true"><path d="M2 1.5v9l8-4.5z" /></svg> WATCH VIDEO
</CaseStudyButton>
```
> Caroline trialled a per-study `color` prop (per-study accents) and then **dropped it for one
> uniform colour** across all studies — do NOT reintroduce a `color` prop. Video CTAs keep the
> ▶ play glyph; non-video CTAs are text-only.

Use it for **every** CTA (the closing "check it out", any in-page "watch video"). It mirrors the
homepage nav's `[ PROJECTS ]` mono/tracking feel but is bordered + bold so it stands out. If a
section's promo video lives in the hero, give that `<video>` `id="hero-promo"` and use the
button variant above to scroll back + replay from 0.

**Closing "View next project" — REQUIRED on every case study, identical structure.** It is a
**frosted glass panel** echoing the hero glass seam: `rounded-t-[2.5rem]` + `backdrop-blur-2xl
backdrop-saturate-150`, a whisper-subtle tint, a top **rim-glint hairline**, a soft upward
shadow, and **two parallax `SoftBlob`s** drifting low on the right (eyebrow + heading +
`CaseStudyButton` on the left):
```tsx
<section data-section="NextProject"
  className="relative isolate overflow-hidden rounded-t-[2.5rem] bg-[<tint>] pt-[120px] pb-[160px] backdrop-blur-2xl backdrop-saturate-150 shadow-[0_-24px_60px_-20px_<shadow>]">
  {/* rim glint (white — reads on any light tint) */}
  <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-px rounded-t-[2.5rem]"
       style={{ background: "linear-gradient(90deg, rgba(255,255,255,0), rgba(255,255,255,0.85) 22%, rgba(255,255,255,0.35) 50%, rgba(255,255,255,0.7) 78%, rgba(255,255,255,0))" }} />
  <Parallax speed={130} className="absolute bottom-[0%] right-[1%] -z-10 h-[380px] w-[620px]">
    <SoftBlob className="inset-0 h-full w-full opacity-100 blur-[56px]" /></Parallax>
  <Parallax speed={-90} className="absolute bottom-[16%] right-[24%] -z-10 h-[300px] w-[460px]">
    <SoftBlob className="inset-0 h-full w-full opacity-100 blur-[56px]" /></Parallax>
  <Container><Reveal>
    <Kicker>View next project</Kicker>
    <div className="flex flex-col items-start gap-6">
      <h3 className="case-study-section-heading mb-0!">Next project title<br />second line</h3>
      <CaseStudyButton href="#">CHECK IT OUT</CaseStudyButton>
    </div>
  </Reveal></Container>
</section>
```
The glass frame (rounded-t, backdrop-blur, **rim glint**) and the CTA are **identical** across
studies; only the palette + the decorative fill differ. Per study:
- **`<tint>`** — a whisper-subtle near-white in the study's surface hue (wiki lilac `#fcf8ff`,
  cog warm cream `#faf9f5`).
- **`<shadow>`** — the upward shadow tinted to a study accent (wiki `rgba(120,80,160,0.16)`,
  cog `rgba(24,158,113,0.16)` — the MyRole card green).
- **Decorative fill** — per study, either the **two parallax `SoftBlob`s** shown above (wiki —
  each study has its own retinted `SoftBlob`, see the blob rule) OR a **study decorative image**
  bled behind the copy (cog uses its confetti ribbon `image-44.svg`, `absolute bottom-0 ... -z-10
  opacity-90`). Pick whatever suits the study's visual language.
- **Title + link → the REAL next case study.** The `<h3>` is the *next* project's own title
  (cog → wiki's "Designing an AI brain / for a support call centre"; wiki → cog's "Gaps and
  opportunities / in ADHD therapy") and `CaseStudyButton href` is that study's route
  (`/project/<slug>`). The studies cross-link; never leave `href="#"`.

Note `mb-0!` on the h3 (the baked heading margin would otherwise float the button).

> **Tuck the section above UNDER the rounded glass corner.** If the previous section has a
> visual bleeding to its bottom edge (e.g. an image flush to the boundary), the glass panel's
> rounded-top corner will reveal that image's *straight* cut edge — looks broken. Pull the glass
> panel up over it with a **negative top margin** (`-mt-[64px]`): later sibling in DOM, so it
> paints on top, and with `backdrop-blur` the image **frosts under the curve** instead of being
> cut. (If you do this, the section above can stay `pb-0` — the overlap replaces the bg-boundary
> breathing space.)

**Ambient `SoftBlob`** (per-study, copy + retint) — soft decorative wash. **Containment rule:**
a blob inside an `overflow-hidden` section is clipped to a hard rectangle if its box extends past
the section edge. Keep the blob's **box fully inside** the section (positive insets, e.g.
`bottom-[2%] right-[2%]`, sized to fit) — SoftBlob fades to transparent well within its box, so a
contained box shows no edge. Anchor it **low** if it should read as part of a closing band. Never
rely on a negative inset + the clip to "crop" it; that is exactly the hard cut Caroline rejects.

> **Make decorative blobs visible, and parallax them.** Caroline wants section blobs clearly
> read, not barely-there: override `SoftBlob`'s defaults with `opacity-100` and a crisper
> `blur-[56px]`, and use **two overlapping** blobs for a richer wash. Then give each blob a
> **scroll parallax** so they drift at a different rate than the copy (the homepage feel): wrap
> the positioned box in `<Parallax>` and put the blob inside as `inset-0 h-full w-full`, with
> **different speeds and opposite signs** per blob (e.g. `speed={40}` / `speed={-26}`):
> ```tsx
> <Parallax speed={40} className="absolute bottom-[0%] right-[1%] -z-10 h-[380px] w-[620px]">
>   <SoftBlob className="inset-0 h-full w-full opacity-100 blur-[56px]" />
> </Parallax>
> ```
> (The `Parallax` div is the positioned box; its transform moves the absolute blob inside it.)

> **Background-colour boundary → the section ABOVE needs `pb-[120px]`.** Sections default to
> top-only padding (`pt-[120px] pb-0`), which is invisible when adjacent backgrounds match. But
> when a section has its **own background** (a tinted band, e.g. the closing `NextProject`, or any
> `bg-[var(--cog-bg-section)]` section), the colour-change line lands right under the previous
> section's content with no breathing room. Give the **section above the boundary** `pb-[120px]`
> (its own content clears the line; combined with the next section's `pt-[120px]` that's ~240px of
> gap with the colour change at the midpoint). Do this on BOTH sides of every bg change. Tints
> must be **whisper-subtle** (near-white, e.g. wiki `#fcf8ff`) — visible enough to read as a
> distinct band but light enough that ambient blobs still show on top.

### 5. Assemble `page.tsx`
Mirror cog's `app/project/cog-adhd/page.tsx`:
- `import "../../../components/project/<slug>/theme.css";` first.
- `export const metadata` — SEO title `"<Project> — <hook> | Caroline Jaworsky"` + description.
- `<main className="cog-root min-h-screen w-full">` wrapping:
  - `<StickyHero><Hero /></StickyHero>` (pinned hero),
  - a transparent `<div aria-hidden className="h-[45vh]" />` buffer,
  - the **glass-seam plate** (`relative z-10 rounded-t-[2.5rem] backdrop-blur-2xl
    backdrop-saturate-150` + the cream gradient + rim-glint hairline — copy the exact
    style block; retint the gradient if the study's surface isn't cream),
  - each section wrapped in `<div data-section|data-cog="<Block>"><Block /></div>`.

The glass seam ties every case study to the homepage's About-over-hero move. See the
`case-study-glass-seam` entry in DESIGN.md for the gradient/shadow recipe and the
StickyHero measured-pin rationale.

### 6. Wire the showcase card
The project's bento card lives in `components/sections/prototype/VariantBentoSoft.tsx`
(via the reusable `ProjectCard`). Give that card the `href="/project/<slug>"` so it opens
the page, and fill `lib/projects.ts` + `components/sections/prototype/projectMeta.ts` with
the real slug/year/role/tools (drop the `placeholder` flag). See the cog/synapse card
entries in CLAUDE.md for the exact shape.

### 7. Verify
- **Always:** `npm run lint` and `tsc --noEmit` (or `npx tsc --noEmit`) — must be clean.
- **Visual:** for substantive layout/visual work, use the **standalone-Playwright trick**
  (MCP screenshots and `networkidle` TIME OUT on these live-canvas pages):
  - run a throwaway `@playwright/test`/`playwright` script **from the project root** (so
    the dep resolves — a scratchpad path fails `ERR_MODULE_NOT_FOUND`),
  - `page.goto(url, { waitUntil: "domcontentloaded" })` + a fixed `waitForTimeout`,
  - inject `* { transition: none !important }` and freeze/animations if needed, then
    element-screenshot the `[data-section]` wrappers,
  - scroll the whole page and assert **0 console errors** and nothing stuck hidden (the
    only sub-1.0 opacities should be intentional, e.g. dimmed logos).
  - Clean up temp screenshots after.

## Required signature elements (every case study has all four)

These are not optional flourishes. They are what makes a page read as one of Caroline's case
studies and tie it to the homepage's motion language. Copy them from the cog folder and wire
them in on every study. All four are already reduced-motion safe.

1. **Reveal** (`Reveal.tsx`) — the scroll-in "coming into focus" entrance: content fades +
   rises + de-blurs as it enters (`autoAlpha 0→1`, `y 28→0`, `blur 6→0`, `expo.out`, plays
   once). **Hard rule — every element animates in:** in **every** section wrap the heading
   block in its own `<Reveal>` and wrap **each** content block (intro line, every grid/row,
   every standalone image, every callout) in a `<Reveal>` too. No content sits un-revealed —
   if it renders on screen, it enters on scroll. Use the default for a single block; use
   `stagger` (pass the grid/flex classes to `Reveal` itself) so a card grid or row
   **assembles** instead of popping. Shared primitives that contain content — `Stats`,
   `TestimonialBubble`, `InsightCard` clusters — already wrap themselves in `Reveal`, so don't
   double-wrap them. **The ONE exception is the Hero**: it is pinned and visible immediately,
   so it has no `Reveal` (true in both cog and wiki). Dials: `y`, `blur`, `stagger`, `start`,
   `delay`.

2. **Parallax** (`Parallax.tsx`) — scroll-scrubbed vertical drift on imagery for depth: an
   element travels `+speed → −speed` as it transits the viewport. Apply to the inner
   `<img>`/cluster, and give neighbouring images different `speed` values and signs for a
   playful float (cog uses values like 40 / −32 / 42). Never put Parallax and Reveal on the
   **same** element (the transforms fight): Reveal on the outer block, Parallax on the inner
   image.

3. **StreamingQuote** (`StreamingQuote.tsx`) and **`CaseStudyCallout stream`** — word-by-word
   reveal: each word settles into its final position then fades + rises + de-blurs in
   sequence (safe inside fixed/centred bubbles, no reflow). **Hard rule — every quote
   streams:** put `stream` on **every** `<CaseStudyCallout>` (the author pivot callouts), and
   render every user/testimonial quote through `TestimonialBubble` or a `StreamingQuote`
   (`as="blockquote"`) so it streams too — `TestimonialBubble` and the affinity post-its
   already wrap their quote in it. No pull-quote or testimonial appears as plain static text.

**Motion acceptance check (run before calling a study done).** Scroll the whole page via the
standalone-Playwright trick, then assert in the browser: (a) **0 console errors**; (b) **0
stuck-hidden elements** — nothing with `visibility:hidden`/`opacity≈0` left behind after you
scroll past it (a stuck `Reveal`); (c) **every `.cs-char` reaches `data-stream="play"`**, none
left `armed` (a stuck `StreamingQuote`). Re-run once in a `prefers-reduced-motion` context and
confirm all content is visible immediately with 0 errors. This is exactly how cog and wiki were
validated.

4. **Glass hero overlay** (the seam: `StickyHero.tsx` + the plate in `page.tsx`) — the
   signature opener. The hero is pinned (`StickyHero` measures `top: -(heroHeight −
   viewportHeight)` so the device mockups scroll into full view, then it sticks); a
   transparent `h-[45vh]` buffer delays the reveal; then a frosted `rounded-t-[2.5rem]`
   glass plate (`backdrop-blur-2xl backdrop-saturate-150`, the cream gradient that lands on
   solid surface by ~185px, plus the white rim-glint hairline) **rises up over the pinned
   hero** as the visitor scrolls. This mirrors how the homepage's About sheet glides over the
   WebGL hero, tying the case study to the site. Required on every study; retint the gradient
   to the study's surface colour if it is not cream. Full recipe + rationale: the
   `case-study-glass-seam` entry in DESIGN.md.

## Gotchas (learned on cog)

- A wedged Turbopack `.next` cache can hang the page compile for minutes — `rm -rf .next`
  + restart the dev server fixes it instantly.
- `sticky` breaks if an ancestor has `overflow-x-hidden` (it becomes the scroll container).
  Keep the case-study `<main>` free of it; re-check 0 horizontal overflow without it.
- Editing the `@theme`/CSS doesn't always hot-reload — `touch` the file and verify the
  computed value in-browser, don't trust the source.
- Two agents often share this working tree — `git add` specific files, never `-A`. Commit
  only when Caroline asks.
- A `{/* … */}` JSX comment **cannot** be the first thing after `return (` (it parses as a
  stray expression beside the element). Put layout-rationale notes as a `//` comment **above**
  the `return`, or inside the JSX once there's a parent element.
- `CaseStudyButton` is **shared** (`components/project/CaseStudyButton.tsx`), not per-study —
  import it from `../../CaseStudyButton` (sections) / `../CaseStudyButton` (study root). It takes
  **no colour prop** (one fixed colour across studies). `Stats` and `SoftBlob` are per-study
  (copy into the study folder + retint).
- A frosted glass panel needs **content behind it to frost** to read at all. A `backdrop-blur`
  over a flat solid surface does ~nothing — rely on the rim glint + rounded corner + tint, OR
  position it over the ambient blobs / an overlapping image (see the closing-section tuck rule).
- Glass edge against a **light-over-dark boundary**: a white rim line placed exactly on the
  seam is invisible. Push the highlight a few px **into the dark** side so it reads as a lit
  bevel. For a natural look make it **uneven** (overlapping elliptical highlights at a few
  x-spots), not a flat full-width band.
- Caroline iterates copy + spacing fast and reacts to screenshots. Default to: lead with impact,
  keep paragraphs short, prefer label (`thing >`) + `Body` over long prose, and when she says
  "concise it" the copy may only get **shorter, never longer**. Verify each layout change with the
  standalone-Playwright trick rather than guessing.
