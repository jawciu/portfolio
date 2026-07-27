---
name: template-tokens
description: >
  Rules for naming and structuring the scoped CSS custom properties that theme a
  case study (or any per-instance theme) so the same slot has the same name in
  every study and only the VALUE changes. Read BEFORE adding a token to a
  theme.css, before scaffolding a new case study's theme, before wiring a SHARED
  component to a colour, and before renaming any existing token. Use when Caroline
  mentions tokens, theming, "what colour should this read", a new case study's
  palette, or when a shared component needs to pick up a per-study colour.
---

# Template tokens

A "template token" is a slot the shared kit reads: `--case-study-ink`,
`--case-study-accent`, and so on. Every study defines the same slot; only the
value differs. Get this wrong once and it is expensive to unpick, because the
name spreads into dozens of Tailwind arbitrary values across section files.

## The one rule

**A token's NAME describes its ROLE. Its VALUE describes the study.**

Two failure modes, both of which happened in this repo and both of which cost a
migration to undo:

1. **Naming a template slot after the first study that used it.** cog-adhd was
   built first, so its slots were called `--cog-bg`, `--cog-ink`, `--cog-muted`.
   Wiki then copied the kit wholesale and kept the names, so wiki's theme defined
   `--cog-ink` too. Gateway cloned wiki and inherited it again. By the time
   Vector renamed them to `--case-study-*`, three studies were on the old names
   and ~130 references had to move.
2. **Naming a slot after its colour.** `--green` held `#e15bad` (pink) on wiki
   and `#6a3fd6` (purple) on gateway. A token called `--green` that is pink is
   worse than no token, because it reads as correct.

Before you add a token, ask: *would this name still be true in a study with a
completely different palette?* `--case-study-accent` survives that test.
`--cog-green` fails it twice over.

## Naming scheme

| prefix | meaning | example |
|---|---|---|
| `--case-study-*` | template slot. Every study MUST define it. Shared components and shared `.case-study-*` CSS may read it. | `--case-study-ink` |
| `--<study>-*` | that study's own colour, used only by that study's components. Shared code must NEVER read it. | `--cog-mint`, `--vec-success`, `--eon-magenta` |

The study prefix is correct and good for study-specific values. It is only wrong
on a template slot. `--cog-mint` (cog's thought-bubble green) is fine forever.
`--cog-ink` was not.

Never encode a colour word in a template slot. Use role words: `accent`,
`accent-strong`, `ink`, `ink-soft`, `muted`, `line`, `card`, `bg`, `bg-alt`.

## The current slot set

Every case-study theme defines exactly these. Adding a study means filling in
this list, not inventing names.

```
--case-study-bg            page background
--case-study-bg-alt        lighter / elevated band
--case-study-bg-warm       warm band
--case-study-bg-section    second section tone
--case-study-card          card / panel fill
--case-study-ink           headings + primary text
--case-study-ink-soft      body copy
--case-study-muted         labels / secondary
--case-study-line          hairlines / borders
--case-study-accent        rules, dividers, callout bar
--case-study-accent-strong emphasised label text, hover, pressed
```

`--soft-ink` is separate: it is defined in `app/globals.css` and consumed by
`.case-study-body-md` site-wide, not just on case studies. Themes override it;
do not fold it into the set above.

## Scoping

Values live inside the study's scope class, never at `:root`:

```css
.vector-root {
  --case-study-ink: #f1eaf1;
}
```

The scope class stays per-study (`.cog-root`, `.ww-root`, `.vector-root`) — that
is exactly what stops one study's palette leaking into another after a
client-side nav, since Next keeps route CSS loaded. **Shared CLASS names must be
generic** (`.case-study-container`, not `.cog-container`): an unscoped shared
class named after one study means route order decides who wins, which is how
cog's greens once turned magenta.

## Wiring a shared component to a colour

A shared component (anything in `components/project/*.tsx` rather than a study
folder) may only read `--case-study-*`. Before you wire one:

1. **Check the token has consumers.** `grep -rn 'var(--case-study-foo)' app components`.
   A token that nothing reads is probably dead, and picking it means your
   component is the only thing keeping it alive — and may be reading a different
   colour from the rest of the study. The ScrollRail was built against
   `--case-study-green`, which had **zero** other consumers; on cog it therefore
   rendered `#1e7a4d` while every other rule on the page used `#19a072`.
2. **Check every study defines it**, including scaffolds. A missing token does
   not error, it just makes the declaration invalid, and the colour silently
   falls back.
3. Never hardcode a hex in shared code, and never add a per-study conditional.

## Adding a new study

Copy the slot list above and fill in values. Do not copy another study's
theme.css and rename the scope class — that is precisely how `--cog-*` reached
wiki and gateway. Study-specific extras go under that study's own prefix.

## Renaming tokens safely

This is a pure string rename with no logic, so it has a rare property: **the
rendering must come out pixel-identical.** That is your test.

1. **Baseline.** Full-page screenshots of every affected study at 1440 and 390,
   with animations frozen and after a full scroll-through so lazy content settles.
2. **Rename definitions and consumers together**, longest name first so
   `--cog-ink` never eats `--cog-ink-soft` and `--cog-bg` never eats
   `--cog-bg-alt`. Match with a right-hand boundary: `re.escape(old) + r'(?![\w-])'`.
   Remember consumers live in Tailwind arbitrary values (`text-[var(--cog-ink)]`),
   not just CSS.
3. **Grep to zero.** No old name may survive outside deliberately-excluded dirs.
   Check for self-referential aliases too (`--x: var(--x)`), which a rename over
   an existing bridge will silently create and which are invalid.
4. **Delete dead tokens** — the same grep tells you which have no consumers.
5. **Pixel-diff against the baseline.** Expect zero.

**Run a control before believing a diff.** Capture twice on identical code and
diff those. This repo has an autoplaying promo video on wiki and a live WebGL
hero, so back-to-back captures differ by thousands of pixels on their own. Any
real regression must be judged against that floor, and localised: crop the
differing region and look at it before concluding anything.

If you must migrate in stages, define the new names as the source of truth and
make the OLD names aliases pointing at them, never the reverse. Then both names
resolve at every intermediate step and the site is never broken; delete the alias
block last, once the grep is at zero.
