---
name: case-study
description: >
  Build a portfolio case-study page from raw, unorganised material (assets + rough
  copy). Encodes Caroline's narrative structure, tone of voice, heading & paragraph
  conventions, and the reusable build template (route under /project/<slug>, scoped
  theme.css, ui.tsx primitives, Reveal/Parallax/StreamingQuote motion, the glass
  seam). Use when creating or scaffolding a case study, adding a /project/<slug>
  page, turning raw project notes + assets into a structured case study, or editing
  an existing case-study page's structure, copy, or layout.
---

# Case study

Turns a pile of raw material — screenshots, mockups, rough notes, half-written copy —
into a finished case-study page that matches the portfolio's voice and build system.

The reference implementation is **Cog ADHD** (`/project/cog-adhd`). Read its files when
you need a concrete example of any pattern — it is the canonical, working case study.

**Mobile:** before building any section, read the **"Case-study mobile whitespace playbook"**
in `.claude/skills/responsive-design/SKILL.md` — it encodes the phone spacing rhythm (120px
boundaries, 48px image air, hug-height cards, copy-before-images order) and the measurement
gotchas (baked asset padding, overhangs, parallax) learned tuning cog + wiki. Building to it
from the start avoids a whole round of phone-by-phone fixes.

## Before you start

Read these in order, then read the cog reference:

1. **[voice.md](voice.md)** — tone of voice, heading structure, paragraph length, the
   storytelling rules. This is how the copy must read.
2. **[structure.md](structure.md)** — the narrative arc + the *block library*: section
   archetypes you assemble per project (we use a flexible kit, not one fixed order).
3. **[build.md](build.md)** — the exact technical scaffold: route, scoped theme, the
   `ui.tsx` primitives, motion, the glass seam, assets, wiring the showcase card, verify.

Reference files to skim from the cog study (don't reinvent these — reuse them):
`components/project/cog-adhd/{ui.tsx,theme.css,Reveal.tsx,Parallax.tsx,StreamingQuote.tsx,StickyHero.tsx}`
and a couple of `sections/*.tsx` (e.g. `Findings.tsx`, `Solution.tsx`).

Also read **`DESIGN.md`** (the `case-study-*` tokens + the design-md skill) before any
visual work, and **update it** when a decision changes a token or rule.

## Workflow: raw material → page

1. **Intake & interview.** Take Caroline's raw assets + copy. Identify the project's
   *shape* (research-led UX study? product/build story? marketing site?) and its spine:
   problem → what you did → insight → solution → outcome. If anything load-bearing is
   missing (the metric, the key insight, who it was for), ask before inventing — never
   fabricate research findings, quotes, or numbers.
2. **Outline the arc.** Using [structure.md](structure.md), pick and ORDER the section
   blocks that fit *this* project's material. Present the outline (section list + one-line
   role each) and confirm before building. Not every study needs all 13 cog sections.
3. **Write the copy.** Draft each section's copy to [voice.md](voice.md): her first-person
   voice, heading + eyebrow pattern, paragraph length, where pull-quotes/callouts land.
4. **Scaffold the build.** Follow [build.md](build.md): new route + scoped `theme.css`
   (own palette — see below), copy the primitive kit, drop assets in
   `public/projects/<slug>/`, build one section component per block, assemble `page.tsx`.
5. **Wire it in.** Add the showcase-card `href` + `projectMeta`, set page `metadata`.
6. **Verify.** `tsc` + `lint` always; Playwright for substantive visual/layout work
   (use the standalone-Playwright trick — MCP screenshots time out on these live pages;
   run the script from the project root). Clean up temp screenshots.

## Key decisions (locked with Caroline)

- **Flexible block library**, not one rigid arc — assemble sections to fit the material.
- **Own visual identity per study** — each gets its own `theme.css` palette (bg + accents
  matched to that project's brand), but reuses the same *type system, primitives, layout,
  motion, and glass seam*. The shared template is structural; the colour is per-project.
- **Voice is captured from cog + Caroline's earlier written case studies** — keep
  [voice.md](voice.md) current as we learn her voice across more studies.

## Non-negotiables (see voice.md / build.md for detail)

- **Impact is the north star.** Every case study must showcase how Caroline, as a product
  designer, drives real impact for products and companies. Lead with the outcome, tie every
  decision to what it moved (user *and* business), pay it off in Results.
- **Never use em dashes ( — ) in any case-study copy.** Use full stops, commas, colons, or
  parentheses. (En dashes in number ranges like "15–40 min" are fine.)
- **All four signature elements are required** on every page: `Reveal`, `Parallax`,
  `StreamingQuote`/`CaseStudyCallout stream`, and the glass hero overlay (the seam).

## Don't

- Don't invent findings, quotes, metrics, or personas. Ask for the real material.
- Don't restyle the shared type tokens (`.case-study-*`) per project. Palette only.
- Don't force a non-research project into the research arc. Pick fitting blocks.
- Don't ship motion without a reduced-motion fallback (the primitives already handle it).
