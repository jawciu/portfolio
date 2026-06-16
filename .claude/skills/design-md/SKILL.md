---
name: design-md
description: >
  Maintain DESIGN.md — the portfolio's machine-readable design system (YAML
  design tokens + human-readable rationale, in the design.md format). Read it
  BEFORE any visual/styling work so colours, type, spacing, glass, and motion
  stay consistent; UPDATE it whenever a design decision changes a token or a
  rule. Use whenever touching colours, fonts, spacing, radii, glass surfaces,
  components, or the overall look — or when Caroline asks about the design
  system, tokens, or "how should this look."
---

# DESIGN.md Skill — Portfolio Design System

`DESIGN.md` (project root) is the source of truth for this portfolio's visual
identity. It follows the [design.md](https://github.com/google-labs-code/design.md)
format: **YAML front matter** holds machine-readable design tokens; the
**markdown body** holds the human-readable rationale and guardrails. Tokens are
normative; prose explains how to apply them.

This skill is the companion to the visual skills (`glass-design`,
`orb-firewall-tuning`, `glsl-shader-effects`, `scroll-choreography`). They tell
you *how* to build an effect; DESIGN.md tells you *what values and rules* it must
obey. Read both.

## When to read DESIGN.md

Read it (at least the front matter + the relevant section) BEFORE you:

- pick a colour, font, size, weight, radius, or spacing value;
- build or restyle any surface, card, label, or component;
- judge whether something is "on-brand";
- answer a question about the design system or a token's value.

Prefer a token or a documented rule over an ad-hoc value. If the value you need
isn't a token, that's a signal to either reuse an existing one or add a new token
(and log why).

## When to update DESIGN.md

Update it WHENEVER a design decision changes the system — in the SAME change, not
later:

- a token value changes (a colour, a font, a size, a radius, a spacing step);
- a new token is introduced, or one is retired;
- a rule in **Do's and Don'ts**, **Elevation & Depth**, or a section's prose no
  longer matches what's built;
- a new component pattern becomes part of the language.

Do NOT log one-off experiments or per-component tweaks that don't generalise —
those belong in the `CLAUDE.md` Decision Log. DESIGN.md captures the *system*;
CLAUDE.md captures the *narrative of how we got here*. When a decision touches
both (e.g. "unified `bg` to `#070709`"), update the token in DESIGN.md AND log
the why in CLAUDE.md.

## Format rules (keep the file valid)

The front matter is parsed; keep it well-formed:

- Front matter is delimited by a line that is exactly `---` at the top and
  bottom. Body sections use `##` headings.
- **Section order is canonical:** Overview (Brand & Style) → Colors → Typography
  → Layout → Elevation & Depth → Shapes → Components → Do's and Don'ts. Omit a
  section if irrelevant, but don't reorder. Never have two headings with the same
  name.
- **Token groups:** `colors` (`map<name, CSS color>`), `typography`
  (`map<name, {fontFamily, fontSize, fontWeight, lineHeight, letterSpacing}>`),
  `rounded` (`map<level, dimension>`), `spacing` (`map<level, dimension|number>`),
  `components` (`map<name, map<prop, value|reference>>`).
- **Dimensions** carry a unit: `px`, `em`, or `rem`. `lineHeight` may be a
  unitless multiplier.
- **References** use `{path.to.token}` (e.g. `{colors.accent-magenta}`,
  `{typography.label-sm}`). Component props may reference composite tokens
  (a whole typography level); other groups reference primitives only.
- **Component variants** (hover/active/etc.) are sibling keys:
  `glass-card`, `glass-card-hover`.
- Quote hex colours (`"#070709"`) and numeric font weights (`"700"`).

## How tokens map to this codebase

DESIGN.md is the spec; here's where each group actually lives, so doc and code
stay in sync:

- **colors** ⇄ `app/globals.css` `@theme` (`--color-bg`, `--color-fg`,
  `--color-accent-*`). Tailwind utilities are `bg-bg`, `text-fg`,
  `text-fg-muted`, `text-accent-magenta`, … — use those, never raw hex in JSX.
  The `flame-*` / `orb-*` spectrum tokens live in the hero shaders
  (`components/hero/heroShaders.ts`, `DistortedOrb.tsx`, `Backdrop.tsx`), not in
  CSS — they're the colour of *light*, not UI fills.
- **typography** ⇄ font CSS-vars wired in `app/layout.tsx`
  (`--font-hero` Iosevka Charon, `--font-display` Bricolage, `--font-body`
  Geist, `--font-mono` Geist Mono); utilities `font-hero/-body/-mono`. Sizes are
  Tailwind text utilities at the documented breakpoints.
- **rounded / spacing** ⇄ Tailwind utilities (`rounded-3xl`, `gap-3`,
  `max-w-7xl`, `py-44`).
- **components** ⇄ the React components under `components/` (About glass sheet,
  `VariantBentoSoft` cards, `Toolkit` dock, mono labels in `app/page.tsx`).

After editing the `@theme` block in `globals.css`, remember it does NOT
hot-reload: `touch app/globals.css` and verify the computed value in-browser
(`getComputedStyle(document.documentElement).getPropertyValue('--color-bg')`)
before trusting it. If you change a token in code, change it in DESIGN.md too.

## Workflow

1. **Before styling:** read DESIGN.md front matter + the section you're touching.
   Pull the exact token/value. If none fits, decide: reuse, or add a token.
2. **Build** using the token (Tailwind utility / CSS var), honouring the section
   prose and Do's & Don'ts.
3. **After a systemic change:** update the affected token(s) and any stale prose
   in DESIGN.md in the same change; if it's a narrative decision, also log the
   why in `CLAUDE.md`.
4. **Sanity-check** the canonical section order and front-matter validity before
   finishing.
