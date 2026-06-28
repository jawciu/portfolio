---
name: responsive-design
description: Make portfolio components adapt across viewport AND container sizes without breaking the desktop view — Tailwind v4 breakpoints, container queries, the flexbox min-width:0 shrink rule, and the duplicate-and-hide pattern. Use when a layout deforms as the screen narrows (text/buttons wrapping "fat", images overflowing), when adding tablet/mobile breakpoints, when an element must shrink to protect a sibling, or when Caroline mentions responsive, breakpoints, mobile, tablet, "smaller screen", stacking, or wrapping.
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
