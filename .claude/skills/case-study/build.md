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

- `--cog-bg` / `--cog-bg-section` — the page surface(s). Light, low-chroma.
- `--cog-ink` / `--cog-ink-soft` / `--soft-ink` / `--cog-muted` — text. Usually keep.
- `--green` / `--dark-green` — the divider/rule/accent. Retint to the project's accent;
  these drive `InsightCard` dividers + the `.case-study-callout` left rule.
- The decorative tokens (`--cog-mint`, `--cog-orange`, `--cog-purple`, post-its…) — set
  to this project's palette or drop the ones you don't use.

Keep the scope class as `.cog-root` OR rename it to `.cs-root` and update the page wrapper +
every `var()` consumer — simplest is to keep `.cog-root` (it's just a scope name, it doesn't
leak). The light theme is scoped here so it never touches the dark site.

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
   once). Wrap **every** section's heading block, and its content clusters, in `<Reveal>`.
   Use the default for a single block; use `stagger` (pass the grid/flex classes to `Reveal`
   itself) so a card grid or row **assembles** instead of popping. Dials: `y`, `blur`,
   `stagger`, `start`, `delay`.

2. **Parallax** (`Parallax.tsx`) — scroll-scrubbed vertical drift on imagery for depth: an
   element travels `+speed → −speed` as it transits the viewport. Apply to the inner
   `<img>`/cluster, and give neighbouring images different `speed` values and signs for a
   playful float (cog uses values like 40 / −32 / 42). Never put Parallax and Reveal on the
   **same** element (the transforms fight): Reveal on the outer block, Parallax on the inner
   image.

3. **StreamingQuote** (`StreamingQuote.tsx`) and **`CaseStudyCallout stream`** — word-by-word
   reveal: each word settles into its final position then fades + rises + de-blurs in
   sequence (safe inside fixed/centred bubbles, no reflow). Use it on the author **pivot
   callouts** (`<CaseStudyCallout stream>…</CaseStudyCallout>`) and on **user/testimonial
   quotes** (the affinity post-its and `TestimonialBubble` already wrap their quote in it).

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
