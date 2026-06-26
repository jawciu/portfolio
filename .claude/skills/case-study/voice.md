# Voice: tone, headings, paragraph length, storytelling

How a case study must *read*. Codified from the cog study and Caroline's earlier written
case studies (see "From the originals" at the end).

## North star: every case study sells the impact

These pages exist to prove one thing: that Caroline, as a product designer, brings real
**impact** to products and companies. Read every section as evidence of that. A reader (a
hiring manager, a founder) should finish knowing exactly what changed because she was on the
project.

- **Lead with the outcome, return to it.** The hero SUMMARY states the result up front
  ("resulting in the platform's first successful therapy session bookings"); the RESULTS
  section pays it off with concrete numbers. The story is a loop from promised impact to
  proven impact.
- **Tie every decision to impact.** Frame each move by what it moved: friction removed,
  conversions gained, trust built, time saved, engagement or adoption up. Cause to effect,
  always ("I addressed X by introducing Y, which drove Z").
- **Show business judgement, not just craft.** Research, constraints, and iteration are in
  service of the result. They demonstrate she thinks like a product owner (prioritises under
  constraints, validates with data, ships), not only a maker of screens.
- **Balance user and business impact.** Name both: the user got a clearer journey *and* the
  company got conversions / leads / retention / lower cost. That dual fluency is the pitch.
- **Quantify wherever it's real.** Prefer concrete numbers and deltas. If a number doesn't
  exist, frame the qualitative change plainly. Never invent metrics (see the hard rules).

Impact is the through-line. If a section doesn't advance the "here's the impact I drove"
story, tighten it or cut it.

## Hard rules (non-negotiable)

- **Never use em dashes ( — ). Ever.** Not in any case-study copy, headings, or captions.
  Rewrite with a full stop, a comma, a colon, parentheses, or by restructuring the sentence.
  Caroline's own writing uses commas, full stops, ellipses, and the `>` label device, and
  never an em dash. (En dashes in plain number ranges like "15–40 minutes" are fine.)
- **Never fabricate** findings, quotes, metrics, personas, or testimonials. Ask for the real
  material.
- **British spelling** throughout (optimise, colour, prioritise, analyse, behaviour).

## Stance & person

- **First person, always.** "I focused my redesign…", "I worked with engineers…", "My goal
  was…". No passive voice, no "the team did". She owns the work.
- **Calm, confident, plain.** No hype, no buzzwords, no academic jargon. Plain product
  language: *friction, insight, opportunity, journey, pattern, pain point*. Premium and
  quietly nerdy, never salesy.
- **Outcome-first, non-defensive.** State the problem, what you did, what happened. Admit
  what failed without apology — failure is framed as iteration ("user testing showed this
  layout was overwhelming. So I…"). Learning, not excuses.
- **Frame problems as opportunities.** The recurring move: name a gap, then turn it forward.
  *"This gap in therapy-support tools indicated a unique opportunity to develop features
  that actively support the therapeutic journey."*

## Sentence & paragraph length

- **Sentences:** short to medium — ~12–18 words on average. Longer (20–25) only when
  explaining a tradeoff or constraint, then back to short.
- **Paragraphs:** SHORT. 1–3 sentences. A "paragraph" is usually 2 sentences. Never a wall
  of text — the page breathes; copy is a caption to the visuals, not an essay.
- **Per section:** an intro/summary of 1–2 short paragraphs, then the rest carried by
  cards, callouts, quotes, and images. Card bodies are 1–3 sentences. Feature blurbs are
  one sentence each. If a section's prose runs past ~4 short paragraphs, it's too long —
  push content into cards/callouts or split it.

## Headings & eyebrows

Every section leads with the **eyebrow → heading** pair (the `Kicker` + `Title` primitives):

- **Eyebrow** (`case-study-eyebrows-heading`): a short ALL-CAPS label naming the section's
  job — `MY ROLE`, `INTERVIEWS`, `COMPETITIVE ANALYSIS`, `KEY RESEARCH FINDINGS`,
  `STRATEGY`, `METHODOLOGY`, `CHALLENGES`, `SOLUTION`, `RESULTS`, `KEY TAKEAWAYS`. One to
  three words. It's the file-tab; the heading is the sentence.
- **Heading** (`case-study-section-heading`): a short declarative *finding or claim*, not a
  generic label. It says what's true, in her words:
  - "Gaps in connection, lack of structure and resources"
  - "Space for opportunity in the therapy aiding tools"
  - "Transforming therapy with AI and data-driven solutions"
  - "Testing shows information overload"
  - "Small changes, measurable results"
  - "Design is complex and context-driven"
  - Max **2 lines** (manual `<br/>` for the break). Set in Iosevka uppercase via the token.
- **Page title** (`case-study-title`): the project's thesis as a phrase, not a name —
  e.g. "Gaps and Opportunities in ADHD Therapy Processes". 2 lines desktop.

Pattern: **eyebrow = topic, heading = the takeaway.** Don't waste the heading on "Research"
when it can say what the research *found*.

## Pull-quotes, callouts & user quotes

Three distinct registers — use the right one:

- **`CaseStudyCallout` (green left rule, big mono)** — the author's *pivot statements*: the
  goal, the gap-to-opportunity turn, the strategy question, a constraint. One per section,
  max. Pass `stream` to reveal it word-by-word. e.g. *"The issues I uncovered revealed many
  opportunities for improvement. I began to imagine, what could a big picture product vision
  for Cog clinic look like?"*
- **User quotes** (`case-study-quote`, italic; post-its, speech/`TestimonialBubble`) —
  verbatim research/testimonial voices, attributed lightly (`@Cog clinic customer`,
  `@Cog clinic therapist`). These are *evidence* — real words, never invented.
- **Feature/insight bodies** (`case-study-body-md` inside `InsightCard`) — the plain
  explanation of one finding or feature in 1–3 sentences.

Quotes and callouts carry the emotional beats so the prose can stay lean.

## Storytelling rules

1. **One turn per study.** Build to a single clear insight that reframes the problem, then
   pay it off in the solution. Make the turn explicit (it's the Findings/insight block).
2. **Show the work, then the result.** Process earns the outcome — don't jump to the shiny
   final screen without the research/constraint/iteration that justifies it.
3. **Tie features to insights.** Every solution element should trace back to a finding or a
   user question. "I addressed X by introducing Y" — cause and effect, visible.
4. **Be honest about constraints & failure.** The Firebase tradeoff, the overwhelming first
   layout — these make it credible. Keep them, framed as decisions and learning.
5. **End reflective, not boastful.** Takeaways are lessons for next time, in the same calm
   first person.

## Voice checklist (run on every draft)

- [ ] First person throughout; no passive voice.
- [ ] Paragraphs are 1–3 short sentences; no walls of text.
- [ ] Each heading states a finding/claim, not a generic label; ≤2 lines.
- [ ] There's exactly one clear insight (the turn), paid off in the solution.
- [ ] Features/decisions trace back to insights or user needs.
- [ ] At most one author callout per section; user quotes are real and attributed.
- [ ] Constraints and at least one honest "what didn't work" are present.
- [ ] No hype, buzzwords, fabricated numbers, or invented quotes.
- [ ] Outcome/metric appears early (hero teaser) and lands in Results.
- [ ] Every section advances the impact story; both user AND business impact are named.
- [ ] NO em dashes anywhere (use full stops / commas / colons / parentheses instead).
- [ ] British spelling throughout.

---

## From the originals

Codified from Caroline's real written studies — the booking-conversions study ("How Design
Drove Therapy Booking Conversions"), the marketing-site study ("Design and implementation of
Cog's marketing website"), her About/intro/footer copy, and her LinkedIn voice. The rules
above hold; this adds what's distinctive to *her*.

### Signature micro-devices (use these — they're her rhythm)

1. **Ellipsis verb-lists.** Her go-to for listing actions: a lead-in line ending in "I…" or
   "using X…", then a stack where each item is `…<past-tense verb>` + a short complement.
   - *"Before coming up with solutions I… **…researched** industry standards and best
     practices  **…analysed** various therapist profiles  **…focused** on details that build
     trust and confidence in booking."*
   - *"to find a user centric solution under time constraints, I: **…drafted** a proto
     persona…  **…created** several rounds of sketches…  **…accounted** for short attention
     spans…"*
   - *"using Webflow's CMS… **…enabled**…  **…empowered**…  **…allowed**…"*
   Use for process/method/approach blocks. The verb is bold/labelled; the complement is one
   short phrase.

2. **`>`-suffixed inline labels.** Bold lowercase step/feature labels end with " >", then 1–3
   short sentences: `analysis >`, `research >`, `ideation >`, `design >`, `enhanced
   navigation >`, `focused content >`, `improved accessibility >`, `strategic CTA's >`,
   `brand identity >`, `following foundations >`. (Maps to `case-study-label`, which is
   already lowercase.) This is the MY ROLE and feature-list pattern.

3. **Statement stacks.** A section body is sometimes a stack of standalone declarative
   sentences (each its own line, not a paragraph) that build an argument, ending on a "my
   goal was…" line that turns observation into intent:
   - *"Analytics showed that users were engaging with the Clinic… but not signing up… / ADHD
     community feedback made it clear that people were actively seeking support… / This meant
     the issue wasn't demand or affordability, but rather friction in the user experience. /
     My goal was to uncover why users hesitated to book and create a solution…"*

4. **Numbered goals/insights.** Small number eyebrow + short title + one-sentence body:
   `goal #01 / brand awareness`, `#01 / Blog posts were already a strong traffic driver…`.

5. **Big-number results.** Results are bare big numerals with a plain 3-line caption, no hype:
   `4 — free sessions booked on day one`, `76 — free sessions booked in two months`,
   `36 — paid sessions booked in two months`. Precise, factual, proud-without-bragging.

6. **`@`-attributed quotes.** Pull quotes credited with an `@`: `@Client testimonial`,
   `@Cog clinic customer`, `@Sprout Social, Seeds Design System`. Italic, attribution muted.

7. **Bold key phrases in prose** (About/intro especially): *"**Founding Designer at a small
   startup**, driving end-to-end product design across **discovery, user research, and
   delivery**… leading **0-to-1 launches** that increased adoption…"*. Bold the load-bearing
   nouns, not whole sentences.

### Opening move

A punchy thesis title — a result or a question, not the project name ("How Design Drove
Therapy Booking Conversions", "Designing for a Dual Audience"). Then the hero meta block —
**BRAND · SUMMARY · ROLE · DURATION · TOOLS** — and a **`SETTING THE STAGE`** paragraph that
gives the stakes and lands on a one-line mission:
> *"Despite a mission to make therapy accessible for the 2.6 million+ people in the UK with
> ADHD, Cog Clinic was struggling. Users weren't booking sessions, not even the free ones. My
> role was to understand why and fix it."*

The SUMMARY states the outcome up front: *"resulting in the platform's first successful
therapy session bookings and conversion of users into paying customers."*

### Closing move

**Key learnings / Key takeaways** — a reflective first-person lesson, then 3 short labelled
points; followed by **What's Next / Looking Forward** (forward actions or how success is
measured), then a **View Next Project** bridge naming the next study. Example learning:
> *"In fast-paced startups, decision-making often happens with incomplete data… Instead of
> waiting for perfect conditions, I focused on data-driven insights, quick iteration, and
> strategic experiment to validate solutions and drive measurable impact."*

### Eyebrow vocabulary (the small ALL-CAPS labels she actually uses)

`SETTING THE STAGE` · `MY ROLE` · `PROBLEM SPACE` · `EXISTING DESIGN` · `METHODOLOGY` ·
`OBJECTIVES` · `STRATEGY` · `CONTENT STRATEGY` · `VISUAL DESIGN` · `SCALABLE DESIGN` ·
`CHALLENGES` · `EXECUTION` · `SOLUTION` · `RESULTS` · `KEY LEARNINGS` / `KEY TAKEAWAYS` ·
`WHAT'S NEXT` / `LOOKING FORWARD`. Pick the ones that fit the project's blocks.

### Honesty & constraints (keep these — they're credible)

She names constraints and the workaround in the same breath:
> *"Knowing social proof impacts decision-making, I wanted to include it, but engineers
> indicated that an in-app rating system would have to wait for a later iteration. So, I
> found a workaround."*

### Vocabulary she favours

*friction, drop-off, conversion, trust, social proof, data-driven, iterate, impact, seamless,
engaging, strategic, feasibility, user-centric, benchmark, align, uncover, refine, elevate,
guide, highlight, condense, pitfalls.* Plain product language; cause→effect ("I addressed X
by introducing Y"). She uses British spelling (*optimise, colour, prioritise, analyse*).

### LinkedIn carryover — what's *her* vs what to drop

Her natural voice (from posts) is **warm, curious, energetic, self-aware, and generous**
(credits collaborators; comfortable being a designer-who-builds-with-AI; gently playful —
*"The perfectionist in me is still recovering"*). That warmth and curiosity can lightly
colour **About** and **Takeaways**. **Do NOT carry into case-study body:** emojis, hashtags,
@-shoutouts to people, or the decorative sparkle unicode (✨🫧) — case-study prose stays
measured. (Sparkles are fine *only* in the About bio, per the existing site decision.)

### Verbatim voice samples (the target sound)

- *"My role was to understand why and fix it."* — terse mission line.
- *"This meant the issue wasn't demand or affordability, but rather friction in the user
  experience."* — the analytical turn.
- *"As we began exploring a B2B offering, it became clear the site needed a strategic
  redesign to speak to two distinct audiences and support the company's growth."* — context.
- *"I adapt fast and focus on solutions that drive impact, leading 0-to-1 launches that
  increased adoption, engagement, and product growth."* — intro/About confidence.
- *"This was my first large-scale project in Webflow, so I was learning and adapting as I
  built the website. It was really fun and challenging to develop these technical skills and
  deliver results under tight deadlines."* — honest, warm, growth-minded.

> The two studies above (booking conversions + marketing website) are likely 2 of the 3 new
> pages to build — they're the richest source for matching her structure when we build them.
