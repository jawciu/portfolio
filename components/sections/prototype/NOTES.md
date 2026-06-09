# Prototype — alternative project showcase

**Branch:** `project-showcase-experiment`

**Question:** Is there a cooler / edgier / more fun (but still dead-simple and usable)
way to showcase the projects than the current center-focus carousel?

**Shape:** UI prototype, sub-shape A — variants render on the existing `#work`
route, switched via `?variant=` and a floating bottom bar (← / → or arrow keys;
the bar is hidden in production builds). The current carousel is kept as a
baseline to compare against.

## Variants

| `?variant=` | Name | Structure | The hook |
|---|---|---|---|
| `current` | Center carousel (baseline) | one focused card, side cards peek | what exists today |
| `shell` | `~/work` terminal listing | vertical file list, keyboard-driven (↑↓ move, ↵ open, esc close) | a *designer's* portfolio shown as a CLI — leans into the Linux path-label + telemetry HUD already on the site |
| `deck` | Holographic card deck | one big iridescent card, stack peeking behind; **drag/flick** to throw the top card | tactile + physical; iridescent conic border + sheen |
| `bento` | Reflowing spotlight mosaic | all projects visible at once as panels; hover/focus expands one (glitch-scan) while others collapse to spines | overview-first; one move to scan everything |

Try: `/?variant=shell`, `/?variant=deck`, `/?variant=bento` (scroll to the WORK
section, or the bar is always at the bottom).

## VERDICT — _to fill in once Caroline has flipped through_

> Winner: ___
> Why: ___
> Bits to steal from the others: ___  (the useful feedback is usually
> "I want the X from one and the Y from another")

## Cleanup when a winner is chosen

- Fold the winning variant into the `#work` slot in `app/page.tsx` (rewrite it
  properly — it was written under prototype constraints: no tests, minimal
  error handling).
- Move any fields worth keeping from `projectMeta.ts` into `lib/projects.ts`.
- Delete this whole `components/sections/prototype/` folder + the Suspense /
  `ProjectShowcasePrototype` wiring in `app/page.tsx`.
