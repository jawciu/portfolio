# Gateway case study — scaffold notes (2026-07-22)

Scaffold only: structure + draft copy, every section marked `TODO(caro)`. The page lives at
`/project/gateway`, is `robots: noindex`, and is deliberately NOT linked from the homepage
carousel or nav until Caroline calls it final. Support kit cloned from wiki-whisperer
(same E.ON light palette), accent slots switched to E.ON purple pending her pick.

## The framing (agreed in the job-search session, 2026-07-22)

- **Spine = the business/systems story**: handovers arrive as manually submitted Google
  Sheets → information lost → handovers drag → debt. Gateway turns that back-channel into
  a product. This is the dense-data B2B piece the portfolio is missing (3 AI studies
  already: wiki, vector, + synapse link).
- **Setting the stage carries the step-up story**: previous designer left, business
  pressure, foreign domain (developer space vs her contact-centre patch), she volunteered.
- **One AI section only** ("How I got up to speed, and where AI didn't help"): AI
  compresses input (Miro synthesis, domain Q&A, design audit) → widens the middle
  (ideation + pros/cons) → NO AI at the decision point (she picked the direction, hand
  wireframes in Figma because early ops/backend conversations go better over statics) →
  AI accelerates output (functioning prototype for testing, notetaker → research repo).
  Echoes Vector's "I made every call myself" on purpose. Do not let process outgrow the
  product sections.
- **Status section stays honest**: "in build", impact as hypothesis + baseline, real
  numbers after launch.

## Open facts to confirm before any copy is final

1. ~~**CSV vs "SVG"**~~ RESOLVED 2026-08-05: it is a CSV upload ("SVG" was a slip of
   the tongue).
2. **Baseline numbers** — LARGELY RESOLVED 2026-08-06, Caroline's project records. In use:
   10% of SNC debt book tied to handover customers · ~£2m locked in disputes · 2,000
   incomplete submissions/yr · 26 critical mismatches/yr · welcome packs up to 6 weeks
   late · 53% of handovers are single plots. On the bench (unused, available): £35m
   system balances verified daily · 45 disputes/day, team of 9 · 14-person validation
   team · 95,000 legacy tasks cleaned · 196 cases bulk-reactivated · 3,676-plot example
   portfolio. Still wanted post-launch: cycle time + rework deltas. NOTE: "several
   million" handover debt has NO specific figure — never write "several million".
3. **AI notetaker name** — "Marvin"? And whether E.ON is OK naming internal research
   tooling + the global research repo publicly.
4. **Rounds of research/testing** — how many interview rounds, with whom.
5. ~~**Status model**~~ RESOLVED 2026-08-06 from the real dashboard shot: Not Metered →
   Meter Installed → Handover Received → Handover Complete.
6. **Anonymisation** — bulk screens may contain real developer/plot data. Also OPEN:
   testing + stakeholder quotes are in (Testing.tsx, Status.tsx) anonymised to roles —
   Caroline to rule whether tester companies
   and internal names can be shown. Hero dashboard shot appears to be demo data
   (Plot 4 / Ellesmere) — confirm.
7. ~~**Title thesis**~~ RESOLVED 2026-08-05: Caroline chose "Turning a manual legacy
   process into a self-serve product" (sentence case in source, per her
   no-Title-Case rule).

## Shot list (replaces the PlaceholderShot frames)

- ~~Hero~~ DONE 2026-08-06: real plot dashboard (`handovers-enter.png`)
- Before: the old spreadsheet channel (anonymised)
- Flow: empty state + autofilled state (side by side)
- Handovers Hub with statuses
- Bulk table with missing/mismatched highlighting (the money shot — anonymise)
- Role-gated view (financials hidden)
- ~~MyRole icons~~ DONE 2026-08-06: Caroline's four icons (research / design /
  prototyping / delivery) in `public/projects/gateway/`

## Copy rules

Caroline's voice skill applies (job-search repo: `.claude/skills/caroline-voice/`):
no em dashes, no punchline fragments, one aphorism max, numbers over adjectives,
British spelling. She writes or approves every final line; drafts here are placeholders.
