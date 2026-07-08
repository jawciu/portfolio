---
name: responsive-design
description: Make portfolio components adapt across viewport AND container sizes without breaking the desktop view — Tailwind v4 breakpoints, container queries, the flexbox min-width:0 shrink rule, the duplicate-and-hide pattern, and the case-study mobile whitespace playbook (spacing rhythm, visual-gap measurement, asset/overhang gotchas). Use when a layout deforms as the screen narrows (text/buttons wrapping "fat", images overflowing), when adding tablet/mobile breakpoints, when an element must shrink to protect a sibling, when tuning mobile spacing/whitespace on a case study, or when Caroline mentions responsive, breakpoints, mobile, tablet, "smaller screen", stacking, wrapping, gaps, or whitespace.
license: Proprietary
metadata:
  project: portfolio
  stack: Tailwind CSS v4 (CSS-first @theme), React 19, Next 16
  target-files: components/sections/prototype/ProjectCard.tsx, components/sections/prototype/VariantBentoSoft.tsx, components/project/CaseStudyButton.tsx
---

# Responsive Design (portfolio)

How to make a component behave at every width **without touching its desktop look**.
The golden rule for this codebase: **add responsive behaviour as overrides, never by
rewriting the working desktop classes.** Desktop is the baseline that already ships;
every change is a guarded override that only fires in a narrower band.

## The mental model: three independent axes

A layout can break for three different reasons. Diagnose which one before reaching for a tool.

1. **Viewport size** — the browser window. Fix with Tailwind breakpoint variants
   (`md:`, `lg:`, `max-md:`). Use when the whole page should re-flow (e.g. a row of
   cards stacks on tablet).
2. **Container size** — the element's own parent box, which can be narrow even on a wide
   screen (a card inside a flex row that collapsed). Fix with **container queries**
   (`@container` + `@md:` / `@max-md:`). Use when the *same component* appears at
   different widths independent of the viewport — this is the right tool for bento cards,
   sidebars, and anything that grows/collapses.
3. **Content vs. space** — an item refuses to shrink below its content and overflows or
   wraps "fat". Fix with the **flexbox `min-w-0` shrink rule** (below). No breakpoint
   needed; it is a continuous, fluid fix.

Most "it breaks when I make the screen smaller" bugs are axis 3 first, then axis 2.
Reach for a hard breakpoint (axis 1) only when the layout should genuinely *change shape*.

## Tailwind v4 mechanics (this project)

Mobile-first, **min-width** semantics. Unprefixed = all sizes; `md:` = "768px **and up**".

| prefix | min-width | | range variant | fires when |
|--------|-----------|-|---------------|------------|
| `sm:`  | 40rem / 640px  | | `max-sm:` | `< 640px` |
| `md:`  | 48rem / 768px  | | `max-md:` | `< 768px` |
| `lg:`  | 64rem / 1024px | | `max-lg:` | `< 1024px` |
| `xl:`  | 80rem / 1280px | | `max-xl:` | `< 1280px` |
| `2xl:` | 96rem / 1536px | | `max-2xl:` | `< 1536px` |

- **Target one band only** by stacking: `md:max-lg:flex` = "only 768–1023px".
- **Mobile (the gap below the smallest custom bp):** style unprefixed, override up.
  Do NOT write `sm:` to mean "on mobile" — `sm:` is ≥640px.
- **One-off width** without editing the theme: `max-[900px]:flex-col`, `min-[475px]:flex-row`.
- **Custom named breakpoint:** add `--breakpoint-tablet: 60rem;` in `app/globals.css` `@theme`
  (then `touch` globals.css — Turbopack serves stale CSS).

### Container queries (the bento-grade tool)

When a component's width is decoupled from the viewport, query the **container**, not the window:

```html
<div class="@container">                  <!-- mark the box to measure -->
  <div class="flex @max-md:flex-col">      <!-- stacks when THIS box < 28rem -->
    ...
  </div>
</div>
```

- Container `@` sizes are their own scale: `@xs` 20rem, `@sm` 24rem, `@md` 28rem, `@lg` 32rem … `@7xl` 80rem.
- Range + named + arbitrary all work like viewport variants:
  `@sm:@max-md:flex-col`, `@container/card` → `@md/card:flex-row`, `@min-[460px]:flex-row`.
- **Gotcha 1:** the `@container` element does not size to its own query — put `@container` on the
  parent and the responsive `@` utilities on the *children*. A child cannot query itself.
- **Gotcha 2 (containment):** `@container` sets `container-type: inline-size`, which makes the
  element compute its own inline-size while *ignoring its children*. So never put `@container`
  on a shrink-to-fit / content-sized box (an inline-block, a bare flex item with no basis) — it
  will collapse to zero width. Put it on a box whose width comes from its parent/layout.
  (`inline-size` containment does NOT establish a containing block for `absolute` children, so
  it's safe to keep absolutely-positioned artwork inside an `@container`.)

## The flexbox shrink rule (the "fat buttons" fix)

**Symptom:** in a horizontal flex (copy | image), narrowing the row makes a button row or
heading wrap to two lines and grow tall, while the image keeps its size.

**Cause:** every flex item has an implicit `min-width: auto`, so it **will not shrink below
its `min-content`** (the widest unbreakable button/word). The fixed-width copy column hits
that floor and forces its contents to wrap instead of shrinking the row.

**Fix — decide which sibling absorbs the shrink** (the labels below are illustrative of the
*roles*, not a prescription — assign "absorb" to whichever sibling should give up width; in the
bento case it's the image, and the copy column is the one we protect):

```
absorbs shrink   →  flex-1 min-w-0           (grows/shrinks, allowed below min-content)
protected child  →  flex-none basis-[length]  (fixed basis, keeps room for its content)
must stay 1 line →  whitespace-nowrap on the element whose text would otherwise wrap
```

- `min-w-0` on a flex child is the single most important class — it lifts the `min-content`
  floor so the child can actually shrink below its content width. Without it, `flex-1` still
  *grows* and distributes free space fine; what it can't do is shrink past the item's
  `min-content` (the widest unbreakable button/word) — so the item overflows or wraps instead.
- To make the **image** give up space so the **copy/buttons** keep theirs: the copy side must
  have a **fixed-length basis** wide enough to hold the buttons (`flex-none basis-[28rem]` /
  `w-[28rem]`), and the image side `flex-1 min-w-0` so it absorbs all the negative space.
  A **percentage** width (`w-[56%]`) does NOT do this — a `%` basis shrinks in lockstep with
  the row, so both columns narrow together and the image never "shrinks first". Convert the
  `%` to a fixed length; that single change is what makes the image surrender width first.
- `flex-none` already sets `flex-shrink: 0`. So if a `w-[56%] flex-none` column still shrinks,
  it is NOT a missing shrink-lock — it is the *percentage* flex-basis. Don't reach for another
  `flex-none`; change the basis to a length.
- Buttons that must stay one line: row already needs `flex-nowrap` (stops the *row* wrapping),
  but that does NOT stop each button's **label** wrapping internally and growing the button
  tall. The label itself needs `whitespace-nowrap` on the button element. (Our `CaseStudyButton`
  has no `whitespace-nowrap` today — pass it via `className` or add it to the base classes.)

## The duplicate-and-hide pattern

Sometimes one markup can't serve two layouts (e.g. an element that's a sibling on desktop but
a child on mobile). Render **both**, show one per band:

```html
<div class="hidden md:flex">…desktop version…</div>
<div class="flex md:hidden">…mobile version…</div>
```

- `hidden` = `display:none`, which **also removes the element from the accessibility tree** —
  so the hidden copy is correctly invisible to screen readers. This is the preferred toggle.
- Do **not** leave both visible to AT: if you ever use `visibility`/opacity instead of
  `hidden`, add `aria-hidden="true"` to the inactive copy.
- Keep duplicated copy in sync (same text/links) — it's real duplicated DOM. Prefer driving
  both from one data object so they can't drift.
- Use sparingly: a single element re-flowed with breakpoint utilities is always more
  maintainable than two copies. Duplicate only when the DOM *structure* must differ.

## Quality floor (every responsive change)

- **Never regress desktop.** The unprefixed / `lg:` classes that ship today must render
  identically after your change. Verify the widest layout first, then narrow.
- Test at: 1280 (desktop), 1024 (lg edge), 768 (tablet/md edge), 390 (mobile). The edges are
  where layouts break.
- Respect `prefers-reduced-motion` and keep focus rings visible at every width.
- After editing `app/globals.css` `@theme`, `touch` it and confirm the computed var.

## Verify (matches CLAUDE.md trick)

MCP/`networkidle` Playwright times out on the live-WebGL pages. Use a throwaway standalone
`playwright` script from the **project root**, `waitUntil:'domcontentloaded'` +
`waitForTimeout`, set an explicit `viewport`, hover to open a card, element-screenshot at each
test width, then delete the script. Always run `tsc`/`lint` regardless.

## Case-study mobile whitespace playbook

Distilled from two full rounds of phone-by-phone tuning on the cog + wiki studies
(2026-07-07/08). Build a NEW case study to these rules and the mobile pass should be
right first time. Everything here is `max-sm:` guarded — desktop stays byte-identical.

### The spacing rhythm (phones, <640px)

| where | value |
|---|---|
| section boundary (end of one section → next section's kicker) | **120px**, exactly — no per-section extras |
| around every product image / mockup cluster (copy→image, image→copy) | **48px** visual |
| heading (kicker+title block) → first content below it | the title's **baked 48px** `margin-bottom` alone — don't add `mt` on top |
| callout air | **symmetric**: gap below a `CaseStudyCallout` = gap above it (measure the above gap, match it) |
| two consecutive paragraphs that should read as one thought | **24px** |
| boundary where the bg colour changes | still 120 — split as pb 60 + pt 60 so the seam sits centred |

- Content **order** on phones: copy first, then its images (CSS `order`, never duplicate markup);
  logo rows sit directly under the section header.
- **Uniform sizes**: elements that scatter at varied sizes on desktop (testimonial bubbles
  280–340px) collapse to ONE size on phones — the smallest, if all copy still fits.
- Paired images span the container together: `max-sm:w-[calc(50%-8px)]` each + `gap-4`.
- Overlapping mockup collages: cap the cluster ~**310px** wide (`max-sm:max-w-[310px]`), matching
  how the CardStack `--cs` clusters render on a 390px screen.
- Cards (`InsightCard` etc.) **hug their content** on phones: no fixed height/min-height below
  `sm`, full desktop padding kept (36/32px — Caroline rejected reduced mobile padding).

### The icon + label + body centring pattern (MyRole / Takeaways)

For grid items that are a small graphic over a labelled paragraph (MyRole's role cards,
Takeaways), the phone treatment is: **the icon centres, the text block centres AS AN ELEMENT,
but label and body stay left-aligned to each other** — never `text-center` the copy.

```tsx
<div>                                                {/* one grid item */}
  <div className="flex h-20 items-end max-sm:justify-center">  {/* icon centres */}
    <img … className="h-20 w-auto" />
  </div>
  <div className="max-sm:mx-auto max-sm:max-w-[85%]">          {/* BLOCK centres */}
    <h3 className="case-study-label mt-4">{label}</h3>          {/* text stays left */}
    <Body className="mt-3">{body}</Body>
  </div>
</div>
```

The `max-w-[85%]` inset is what makes the centring read — tune it by eye. Same idea applies to
standalone persona chips / prompt cells: centre the element (`max-sm:items-center` on its flex
wrapper or `max-sm:mx-auto` on the block), keep multi-line copy left-aligned. Only single short
lines (a name + role caption under a portrait) may also take `max-sm:text-center`.

### CSS gaps LIE on phones — measure the VISUAL gap

Three things make a rendered gap differ from the CSS margin; all three bit us:

1. **Baked transparent padding** in PNG art (thought-bubble clouds): a 0px CSS gap rendered as
   ~40–80px of air. Negative margins are legitimate here — size them from measurement.
2. **Absolute children overhanging their container** (an overlapped card at `top:-16%` sticks out
   both above AND below the box): the margin you set is eaten by the overhang, or worse, content
   collides. Rule: `margin = target visual gap + measured overhang`. Comment the arithmetic in
   the code (`/* mt-[108px] ≈ 48px visual past the 59px overhang */`) or the next agent will
   "fix" it back.
3. **Parallax drift**: a scrubbed `y:±speed` offset makes every gap around that element
   non-deterministic (±40px by scroll position). `Parallax` now takes **`mobile={false}`**
   (gates the tween behind `min-width:640px`) — use it on phones for anything whose surrounding
   whitespace you are tuning. Phones barely read parallax anyway.

**How to measure** (numbers first, eyes second — the two-stage audit):
- *Box gaps*: throwaway Playwright script at 390×844, `getBoundingClientRect()` deltas between
  the real elements (run from the **project root** so `playwright` resolves — ESM resolves from
  the script's location, so the temp file must live inside the project; delete it after).
- *Ink gaps* (when assets have transparent padding): fullPage screenshot → **sharp row-scan** for
  runs of background-only rows (tolerance ±8 per channel vs the section bg). Do NOT trust the
  alpha-bbox of the source PNG — irregular art (cloud lobes) has its extremes away from where the
  eye reads the gap.
- Then a screenshot **walk** (every ~800px of scroll) reviewed by eye — transparent padding,
  overhangs and colliding absolutes only show up visually.

### Reordering blocks on phones: flex Container + `order`

To resequence section-level blocks mobile-only: `<Container className="max-sm:flex max-sm:flex-col">`
+ `max-sm:order-N` on each child. **Gotcha:** flex items establish an independent formatting
context, so a child's margin no longer collapses with its wrapper's — an inner `mt-6` now ADDS
to the item's own `mt` instead of collapsing into it. Set the item's `max-sm:mt-*` to
`target − inner margin`, and re-measure every gap in the section after the switch (block-flow
collapsing was silently shaping several of them).

### Breakpoint-gating values that live in inline styles

Inline `style={{ width }}` / `{{ minHeight }}` can't be overridden by a breakpoint class. Move
the value into a CSS custom property and consume it from a gated utility:

```tsx
<figure style={{ "--tb-w": `${width}px` } as CSSProperties}
        className="w-[var(--tb-w)] max-sm:w-[280px]" />   // uniform on phones
<div style={{ width, "--ic-h": `${height}px` } as CSSProperties}
     className="sm:min-h-[var(--ic-h)]" />                 // hugs content below sm
```

Related: a grid with `auto-rows-fr` (equal-height card rows) is meaningless in a 1-column stack
and pads every card to the tallest — add `max-sm:auto-rows-auto`.

## Worked example: the bento cards (ProjectCard)

`VariantBentoSoft` is `flex flex-col gap-2 md:flex-row` — already stacks below `md`. The open
card splits the copy column `w-[56%] flex-none` against the image column `relative flex-1`
(whose `<img>` is **absolutely positioned**); synapse has a 3-button row that is *already*
`flex flex-nowrap`.

Trace the bug to the exact line before "fixing" it — the obvious fix here is a no-op:

- **"Fat buttons" is NOT row-wrapping.** The row is already `flex-nowrap`, so buttons never
  drop to a second line. Each `CaseStudyButton` is `inline-flex items-center` with **no
  `whitespace-nowrap`**, so when the column squeezes, the *label text* ("MY BLOG POST",
  "SOURCE CODE") wraps inside the button and it grows tall. **Fix:** add `whitespace-nowrap`
  to `CaseStudyButton` (base class or via `className`).
- **The image does NOT "shrink first" today.** The copy column is `w-[56%]` — a **percentage**
  basis — so it narrows in lockstep with the card; both columns shrink together. Adding
  `min-w-0` to the image column changes nothing, because its `<img>` is `absolute` and imposes
  no `min-content` floor. **Fix:** convert the copy column to a **fixed-length basis** sized to
  hold the (now nowrap) buttons — e.g. `flex-none basis-[28rem]` — and make the image column
  `flex-1 min-w-0`. Now the image surrenders width first and the buttons keep their shape.
- **Stack point.** Below `md` the row already stacks. For the *narrow side-by-side* band, prefer
  a card-level container query: wrap the card inner in `@container` and switch the split to a
  stack with a concrete trigger, e.g. `@max-2xl:flex-col` on the inner split (≈ when the card
  box drops under 96rem). Pick the exact `@`-size by measuring where the buttons would still
  collide *after* the basis fix; don't leave it vague. Keep desktop (`lg:`+) byte-identical and
  verify the widest layout first.
