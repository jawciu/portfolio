# Structure — narrative arc & block library

Case studies are assembled from a **library of section blocks**, not a fixed order.
Pick and order the blocks that fit *this* project's material. Below: the arc that the
blocks should roughly trace, then each block (what it's for, which primitives build it,
copy length), then how to map raw material onto blocks.

## The arc (the spine every study should trace)

A case study is a story with a turn. Whatever blocks you pick, they should move through:

1. **Hook / context** — what is this, who's it for, what was your role, what's at stake.
2. **The problem** — the tension worth solving (grounded in research or a real friction).
3. **Understanding** — how you learned: research, interviews, competitive, the current state.
4. **The insight** — the turn. What you discovered that reframed the problem.
5. **The strategy** — the bet. What you decided to build and why.
6. **The making** — execution, constraints, iteration, what failed and got fixed.
7. **The outcome** — results: numbers, testimonials, the shipped thing.
8. **Reflection** — what you'd take to the next project.
9. **Onward** — bridge to the next case study.

Not every project has every beat. A build-led story may compress 2–4 and expand 5–6; a
marketing site may have no "interviews" but a strong audience/positioning beat. Keep the
**turn** (3→4) — a case study without an insight is a feature list.

## Block library

Each block maps to one `sections/<Name>.tsx` component. Every block opens with the
`Kicker` (eyebrow) + `Title` pattern unless noted. Primitives are in `ui.tsx`
(`Container`, `Kicker`, `Title`, `Body`, `CaseStudyCallout`, `InsightCard`,
`TestimonialBubble`, `A`), motion in `Reveal`/`Parallax`/`StreamingQuote`. See build.md.

| Block | Arc beat | What it does | Built from | Copy length |
|---|---|---|---|---|
| **Hero** | 1 | Title + meta (brand, role, timeline, tools) + a one-line outcome teaser + device mockups. The pinned/glass-seam opener. | `case-study-title`, `case-study-hero-label` meta grid, mockup row, `StickyHero` | 1–2 short meta paras; lead with the outcome |
| **My role / approach** | 1 | Your contribution as 3–4 named steps (research → synthesis → strategy → design). Frames the method. | `Reveal stagger` card grid, icons, `case-study-label` step labels | ~2 sentences per card |
| **Interviews / research** | 3 | Who you talked to (persona cards) + the research question. The evidence base. | persona cards, `CaseStudyCallout stream`, thought-bubble clusters | 2–3 sentences/card; one callout goal statement |
| **Competitive / landscape** | 2–3 | The market gap. Categories of existing tools, where the opportunity is. | mirrored image+text rows, logo row, `CaseStudyCallout stream` | 1 summary line + 2–3 sentences/row |
| **Findings / insights** | 4 | The core discoveries. Affinity board + pull-quote post-its + insight cards. THE turn. | full-bleed board image, post-its, `InsightCard` 2×2 | one line/insight in the card body |
| **Quick-win / friction** | 2/4 | A high-impact friction surfaced alongside the core work (a thin transition section). | a single `CaseStudyCallout stream`, no heading | 1 punchy callout |
| **Journey map / current state** | 3 | The current broken process, anchored to a persona. | persona chip (name in `--dark-green`) + journey-map image (full-bleed) | persona quote + scenario/expectation labels |
| **Strategy / vision** | 5 | The product bet — pillars of what you'd build. | `CaseStudyCallout stream` + image clusters w/ `Parallax`, `DesignIdeaTag` labels | 1 vision callout + 2–3 sentences/pillar |
| **Methodology / constraints** | 6 | Pragmatic decisions — what was realistic, what you cut, why. | summary para + `InsightCard` (problem cards) + callout + sketch row | 1 para + card bodies + 1 constraint callout |
| **Challenges / what failed** | 6 | The honest iteration — first attempt, why it didn't work, the user feedback. | body para + quote bubble + `Parallax` screenshot | 1 para + 1 user quote |
| **Solution** | 5–6 | The redesign. Features mapped to the questions/insights, walked through a journey. | persona chip + question prompts + image clusters (`Parallax`) + callout | 1 intro para + short feature blurbs |
| **Results** | 7 | Outcomes — metrics (bolded) + testimonials from both sides + a product clip. | 2 paras w/ bold, `TestimonialBubble` zigzag, `<video>` | 2 short paras; quotes carry the rest |
| **Takeaways** | 8 | 3 lessons, reflective close. | `Reveal stagger` card grid, icons, `case-study-label` | ~2 sentences/card |
| **Next project** | 9 | Bridge to the next study — title + "check it out" button + decorative band. | heading + button + ribbon (no glass) | one title line |

### Block selection by project shape

- **Research-led UX study** (cog): use most blocks, keep the full research→insight→solution→results spine.
- **Product / build study**: compress research (My role + a short problem block), expand
  Strategy + Methodology + Challenges + Solution; keep Results strong. Drop Competitive /
  Journey Map if there's no material for them.
- **Marketing / brand site**: swap Interviews/Findings for an **audience & positioning**
  beat (who are the two audiences, what each needs); Strategy = the messaging/structure
  bet; Solution = the page/system you shipped; Results = engagement/conversion.

When in doubt, fewer strong sections beat many thin ones. Every section must earn its place
in the arc — if it doesn't move the story, cut it.

## Mapping raw material → blocks (intake checklist)

Run this against whatever Caroline hands over, then propose the outline:

- **The teaser metric / outcome** → Hero meta + Results. (If missing, ask.)
- **Who it was for / your role / timeline / tools** → Hero meta + My role.
- **Interview notes, user quotes** → Interviews + Findings post-its + Challenges quote.
- **Competitor screenshots / market notes** → Competitive.
- **Persona** → Journey map + Solution chip.
- **The "aha" / what reframed it** → Findings insight cards (THE turn — make it explicit).
- **Constraints (tech, time, scope cuts)** → Methodology.
- **First-iteration screenshots + what testing showed** → Challenges.
- **Final mockups / shipped screens / a screen recording** → Solution + Results.
- **Lessons** → Takeaways.
- **The next project** → Next project bridge.

Anything load-bearing that's missing — the metric, the key insight, the persona, real
quotes — **ask for it**. Don't fabricate research, numbers, or testimonials.

## Real arcs from Caroline's studies (use as shape references)

Three confirmed shapes from her actual written studies — match these when building the
matching project. Eyebrows shown in `CAPS`, the heading idea after the dash.

**A. Booking-conversions study** (research-light, experiment-led product story):
`SETTING THE STAGE` → `MY ROLE` (analysis · research · ideation · design, each a `>` label) →
`PROBLEM SPACE` — *Drop-Off in the Conversion Funnel* (statement stack ending on "my goal
was…") → `EXISTING DESIGN` — *Understanding User Hesitations* (UX/UI inconsistencies `>`,
inaccessibility `>`, then a hypothesis line) → `METHODOLOGY` — *Research. Ideate. Collaborate.*
(two ellipsis verb-lists) → `CHALLENGES` — including social proof (constraint→workaround + an
`@`-attributed testimonial) → `SOLUTION` — *Seamless and Engaging User Experience* (5 `>`
feature labels) → `RESULTS` — *Experiment unlocks first-time Conversions* (big numbers
4 / 76 / 36) → `KEY LEARNINGS` — *Critical Thinking in a Fast-Paced Environment* → `WHAT'S
NEXT` — *Optimising Paid Conversions* → View next project.

**B. Marketing-website study** (the *marketing shape* in structure.md, confirmed):
`SETTING THE STAGE` → `MY ROLE` (strategy · structure · brand · build, `>` labels) →
`STRATEGY` — *Designing for a Dual Audience* (B2C / B2B framing) → `OBJECTIVES` — *Defining
success* (goal #01/#02/#03) → `METHODOLOGY` — *Deep dive into our audience* (personas) →
`CONTENT STRATEGY` — *Individual User Journey* then *Resonating with Business Stakeholders*
(4 labelled cards each) → `VISUAL DESIGN` — *Maintaining the Brand* (`@`-attributed quote +
brand `>` labels) → `SCALABLE DESIGN` — *Integrating Blogs…* (#01/#02/#03 + a "using
Webflow's CMS…" ellipsis list) → `EXECUTION` — *Building with Webflow* (4 labelled deliverables
+ an honest "first large-scale Webflow project" line) → `CHALLENGES` — *Establishing tracking
systems* → `LOOKING FORWARD` — *Measuring Success* (goal+metrics per objective) → `KEY
TAKEAWAYS` — *Designing for Strategy and Marketing* → View next project.

**C. Research/strategy study** = the built cog page (`/project/cog-adhd`) — the full
research→insight→solution→results spine in the table above.

Note the cross-study constants: every study opens `SETTING THE STAGE` + a `MY ROLE` four-step
(`>` labels), and closes with a reflective `KEY LEARNINGS/TAKEAWAYS` + a forward-looking
`WHAT'S NEXT / LOOKING FORWARD` + the *View next project* bridge. Keep that frame; vary the
middle to fit the material.
