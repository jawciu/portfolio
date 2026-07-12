# Vector case study — full copy

All the copy for `/project/vector`, in page order, with each element's role labelled
so you can reshuffle. Conventions used: first person, British spelling, no em dashes,
no colon/semicolon hinges, no mic-drop closers, plain product language (see the
case-study skill's voice.md).

Element key:
- **EYEBROW** = small all-caps label above a heading (`Kicker`)
- **HEADING** = the big section heading (`Title`); `/` marks the line break
- **BODY** = paragraph copy
- **CALLOUT** = the big left-ruled statement (streams in word by word)
- **CARD** = a boxed insight card (has a small label + a title + body)
- **LABEL >** = the mono inline label used for list items
- **CAPTION** = caption under a screenshot

---

## Page meta (SEO)

- **Title:** Vector - Rethinking time-to-value in B2B SaaS onboarding | Caroline Jaworsky
- **Description:** Product case study: Vector, a shared vendor/customer workspace with an AI layer that cuts time-to-value in B2B SaaS onboarding. Designed and built solo, with grounded, human-in-the-loop AI running live for under $5 a month.

---

## 1. Hero

**HEADING (H1):**
Rethinking time-to-value / in B2B SaaS onboarding

**Brand:** VECTOR · vector.quest

**Role (list):** Product · Design system · Data model · AI orchestration · Build & deploy

**Tools (list):** Next.js 16 · Prisma & Supabase · Claude API · Tailwind v4 · Cursor, Claude Code · Vercel

**Summary:**
Vector helps vendors cut time-to-value and stop first-90-day churn. It's a shared vendor/customer workspace with an AI layer that does the tedious work: drafting follow-ups, turning meeting transcripts into tasks, and surfacing risk before an onboarding goes sideways.

**Setting the stage:**
I noticed an interesting problem, procured tools promise value, then lose momentum at the onboarding stage, where context gets lost and that time-to-value slips. As I was playing with agentic engineering tools and wanted to get better at building, I deciced to build a tool that could help with the problem I saw. 

**CAPTION (hero shot, AI Insights):** AI Insights. A grounded, streamed read on one onboarding.

---

## 2. Problem

**EYEBROW:** Problem space
**HEADING:** Meetings eat the work, / context evaporates

**BODY:**
Onboarding a new B2B tool is mostly follow-through. Half of it is agreed out loud on a call ("we'll send the SOW Friday", "IT still needs to provision SSO"), and then it evaporates the second the call ends.

**BODY:**
The teams who feel this most are small, Seed to Series B, running ten to fifty onboardings at once with a handful of people. They are stuck between two bad options.

**CARD — label:** too heavy
**CARD — title:** Enterprise tools
**CARD — body:** Rocketlane and GuideCX are built for large implementation teams, priced near $30k a year, and take months to roll out. A Seed to Series B team cannot justify any of that.

**CARD — label:** too manual
**CARD — title:** Spreadsheets and PM tools
**CARD — body:** So teams hack onboarding into Notion, Asana or a shared sheet. Nothing tracks health, the customer has no real view, and the follow-up work lives in someone's head.

**CALLOUT:**
Most onboarding tools optimise for the vendor's internal project management. I optimised for the shared experience, and let AI handle the follow-up that usually falls through the cracks.

---

## 3. My role

**EYEBROW:** My role
**HEADING:** One designer, / the whole stack

**LABEL >** product
I set the ICP, scoped the product and made the feature bets, so every screen earned its place instead of chasing a spec.

**LABEL >** design system
I documented Vector's design system as a single source of truth that generates the runtime tokens, then built the primitives on top of it.

**LABEL >** architecture & build
I modelled 16 entities in Prisma, wrote the app on Next.js 16 and Supabase, and shipped it to Vercel.

**LABEL >** AI orchestration
I designed and built the AI layer end to end, from grounded prompts and structured output to streaming, tool use and cost observability.

---

## 4. The product (three pillars)

**EYEBROW:** The product
**HEADING:** Shared board, drafting AI, / predictive health

**BODY:**
The work that slips is rarely the big stuff. It is the follow-ups, the actions agreed in a meeting, the risk building on a board no one has opened today. That is exactly what an LLM is good at, as long as it stays grounded and never acts on its own.

**CALLOUT:**
Vector drafts. A person approves. Nothing is ever sent or changed autonomously, so the AI can be useful long before it has earned full trust.

**CARD — label:** pillar #01
**CARD — title:** A shared workspace
**CARD — body:** One place both sides actually use. The customer clicks a magic link and lands straight on their tasks. No signup, no password, no account to create.

**CARD — label:** pillar #02
**CARD — title:** AI that earns its keep
**CARD — body:** It drafts follow-ups, turns meeting transcripts into tasks, and flags which onboarding needs attention today, always as a draft a person approves.

**CARD — label:** pillar #03
**CARD — title:** Predictive health
**CARD — body:** Every onboarding is scored On track, At risk or Blocked from its real data, and each flag arrives with its reasons, so you know exactly what to fix.

---

## 5. Pillar #01 · Shared workspace

**EYEBROW:** Pillar #01 · Shared workspace
**HEADING:** One board, / both sides see it

**BODY:**
The vendor works each onboarding as a Kanban board. Columns are phases, from Kickoff to Go-Live. Every task carries a status, an owner, dependencies and a Jira-style id like AC-12, so it can be referenced in a comment or an AI draft.

**CAPTION (board shot):** The vendor workspace. Phases as columns, health at a glance.

**CALLOUT:**
The customer clicks a magic link and lands straight on their tasks. No account, no password, no training. Every visit is tracked, so the vendor knows the moment they go quiet.

**CAPTION (portal shot):** The customer portal. Their tasks, their deadlines, a plain-language summary.

**BODY:**
Everything the customer does flows back. A completed task, a new comment and a first portal visit each land in the vendor's notification centre, grouped by person, so five quick edits read as one line instead of five.

**CAPTION (notifications shot):** The notification centre. Customer activity, grouped by actor.

**LABEL >** transactional email
Portal invites, task assignments and comment alerts go out through Resend, so updates reach the customer in their inbox without them needing to check another tool.

**LABEL >** designed for the inbox
The emails are dark-themed and table-based, with the color-scheme meta tags that stop Gmail from recolouring them. Email clients only respect old-school HTML, so that is what I wrote.

**LABEL >** bounces become signals
A signed Resend webhook reports hard bounces, and the contact is flagged on the onboarding, where the AI reads it as a risk. A dead email address surfaces straight away instead of weeks later.

---

## 6. Pillar #02 · The AI

**EYEBROW:** Pillar #02 · The AI
**HEADING:** Follow-ups, meeting actions, / and the morning read

**BODY:**
Vector's AI does three jobs, and every one of them ends in a draft for a person to judge, never an action taken on its own.

**LABEL >** follow-ups
One click on a blocked or overdue task drafts a chase-up email in one of three tones, friendly, firmer or escalation. Each draft is grounded in the task's real history and carries its id in the subject line. A weekly scan does the same for anything that has gone stale, scoped to each task's owner.

**CAPTION (follow-up shot):** Draft follow-up. Three tones, grounded in the task. Vector never sends.

**LABEL >** meeting → tasks
A call ends, and Miniti (the meeting notetaker) fires a webhook with the transcript. A tool-use orchestrator reads it and drafts task creates, status changes and reassignments, each carrying the quote it came from. It reads the board first, so work you already track becomes an update to the existing task instead of a duplicate.

**BODY (tech bit):**
The webhook is my favourite technical bit. It verifies a token, dedupes on the meeting id, and acks in about 200ms, well inside Miniti's 10-second, no-retry timeout. The heavy AI extraction runs after the response, so a slow model can never lose a meeting.

**CAPTION (review queue shot):** The review queue. Meeting-sourced drafts, each with approve, edit and dismiss.

**LABEL >** the overview
The overview runs at two altitudes. Across the whole book of business it is triage, a short read that names which onboardings deserve a closer look today, so you are not scanning ten boards to find the problem. Inside a single onboarding it gets granular, with a headline, focus for today and this week, risks, wins and nudges, every claim anchored to a real task id.

**CAPTION (insights shot):** AI insights. Every claim cites the task it came from.

**CALLOUT:**
Everything the AI drafts lands in a review queue, never the live board. Approve it, edit it first, or reject it. A person is always the last step.

---

## 7. Pillar #03 · Predictive health

**EYEBROW:** Pillar #03 · Predictive health
**HEADING:** On track, at risk or blocked, / with the reasons attached

**BODY:**
Every onboarding is scored On track, At risk or Blocked. The score is pure deterministic JavaScript reading real task data, with no AI involved, and the same input always gives the same answer. The AI reasons over the score, but it never produces it.

**CARD — label:** on track
**CARD — title:** None of the above
**CARD — body:** No blockers, nothing meaningfully overdue, and the current pace clears the go-live date. This is where most onboardings should sit.

**CARD — label:** at risk
**CARD — title:** Overdue, blocked or behind pace
**CARD — body:** Any blocked task, a task a week overdue, three tasks overdue, or a pace problem, where the remaining work divided by the observed completion rate overruns the go-live date.

**CARD — label:** blocked
**CARD — title:** A third of the work is stuck
**CARD — body:** When 30% or more of the tasks are blocked, the whole onboarding is Blocked. A single stuck task can wait for a nudge, but a stuck third means the project itself has stalled.

**CAPTION (workspace shot):** The workspace. Every onboarding scored, its reasons in the risk panel.

**CALLOUT:**
Every flag arrives with its evidence. 3 of 9 tasks blocked, 8 tasks overdue, customer dark for 64 days. When you can see why the flag was raised, you can act on it.

---

## 8. The matching

**EYEBROW:** The matching
**HEADING:** The right board first, / drafts second

**BODY:**
Before Vector drafts anything from a meeting, it has to answer a question I never let the model answer alone. Whose meeting was this? Deterministic code runs four checks, in order of trust.

**LABEL >** attendee domains
Miniti sits on the calendar, so every meeting arrives with its invite list. The strongest signal is an attendee's email domain matching a customer's.

**LABEL >** contact emails
Failing that, each attendee's email is looked up against the contacts of every onboarding. Slower, but precise.

**LABEL >** the title
Then the title is scanned for the significant words of a company name. "Acme weekly sync" matches Acme Co through "Acme", and a stopword filter stops common words like "Co" from matching everything.

**LABEL >** the transcript
The last resort, for meetings titled "Untitled meeting". The summary, topics, notes and full transcript are searched for a customer mention.

**BODY:**
Zero candidates, or more than one, and Vector refuses to pick. The meeting parks in the inbox as "Needs your input". You assign the onboarding with one click, and only then does the drafting run.

**BODY:**
Drafting itself is a two-pass job. Pass one only extracts facts from the transcript, the commitments, reported completions and decisions. Pass two is handed the board's open tasks alongside those facts, and its most important rule is to match before it creates. A commitment that maps to a task you already track becomes an update to it, a reported completion becomes a status change, and only genuinely new work becomes a new task.

**CALLOUT:**
Vector never guesses whose meeting it was. The matching is deterministic code, and when the evidence is thin, the meeting waits for a human to point at the right board.

---

## 9. The AI layer

**EYEBROW:** The AI layer
**HEADING:** Grounded, cheap / and observable

**BODY:**
Underneath all of it, the prompts were the easy part. The real engineering was keeping a language model honest, affordable and inspectable at portfolio scale.

**BODY:**
The design is a three-layer split. Deterministic code owns the numbers, the model owns the narrative, and the prompt refuses to let it invent.

**CODE EMBED (real Vector source, `lib/ai/context.js` — the deterministic snapshot):**
```js
// Layer 1: deterministic code builds a snapshot.
// Claude reads it. It never does the arithmetic.
{
  "onboarding": { "company": "Acme Co",
                  "daysToTargetGoLive": -102 },
  "facts": {
    "totalTasks": 20,
    "tasksDone": 8,
    "tasksOverdue": [
      { "taskId": "AC-3", "daysOverdue": 136 },
      …9 more
    ],
    "health": "At risk",
    "healthReasons": [
      "1 task blocked",
      "10 tasks overdue",
      "Past go-live date with open tasks"
    ]
  }
}
```

**CODE EMBED (real Vector source, `lib/ai/insights.js` — the prompt rules):**
```js
// Layer 3: the system prompt forbids invention.
const RULES = `
  RULES, non-negotiable:

  1. NEVER invent facts. Every claim must cite a
     specific taskId or named field from the snapshot.

  2. risks[]: concrete evidence something will go wrong.
     "Could be a problem later" is NOT a risk.

  3. wins[]: only real events from the last 7 days,
     read from the snapshot. Do NOT invent.
`;
```

**CALLOUT:**
The model never does the arithmetic. It reads numbers the code already computed, and cites the exact task behind every claim it makes.

**CARD — label:** grounded
**CARD — title:** Deterministic maths, narrative AI
**CARD — body:** Plain JavaScript computes the hard signals (overdue counts, velocity, customer engagement) from a 2 to 5 KB snapshot. Claude only reasons over them in words, and the prompt forces every claim to cite a real taskId. It never does arithmetic it can get wrong.

**CARD — label:** cheap
**CARD — title:** Cached, structured, streamed
**CARD — body:** The system prompt is prompt-cached, output is pinned to a JSON schema, and the result streams to the browser through Edge Runtime. Insights are also cached against a hash of the input state, so identical boards do not pay twice.

**CARD — label:** observable
**CARD — title:** Every call, costed
**CARD — body:** Each Claude call is logged with its input, output and cache tokens, its dollar cost, latency and the Anthropic request id. Portfolio-scale usage runs under $5 a month, and the next section shows where all of it surfaces.

---

## 10. Observability

**EYEBROW:** Observability
**HEADING:** Every call logged, / every failure visible

**BODY:**
AI features fail quietly, so Vector ships with its own admin dashboard. Every Claude call is rolled up by feature, with calls, errors, total cost, p95 latency and cache hit rate, and each individual call keeps its full token breakdown, dollar cost, duration and Anthropic request id.

**BODY:**
The pipeline view keeps every meeting event, filterable by processed, ambiguous, stuck or errored. Expanding one shows the extraction, the tool calls and the drafts it produced, next to the full transcript. When something goes wrong, I can see exactly where.

**CAPTION (AI admin shot):** The AI admin. Cost, latency and cache hits by feature, and a log of every call.

**CALLOUT:**
This is the groundwork for the evals on the roadmap. Accuracy scoring only works if every call and every draft is already on record.

---

## 11. Under the hood (architecture)

**EYEBROW:** Under the hood
**HEADING:** Proper foundations, / fascinating to build

**BODY:**
I did not want to build just another AI demo. I wanted to learn how a real SaaS is put together, and that turned out to be the most fascinating part of the project. So Vector is built like one. 16 Prisma models with cascade deletes, cookie-based auth for vendors, custom magic links for customers, and webhooks with idempotency keys.

**BODY:**
I built most of it by pairing with AI coding tools, and that is a skill in itself. I had to know exactly what to ask for, read the output critically, and stay on top of the architecture so it never sprawled.

**LABEL >** the stack
Next.js 16 in plain JavaScript, Tailwind v4 and dnd-kit for the board's drag and drop, deployed on Vercel with a weekly cron driving the stale-task scan.

**LABEL >** the data
Prisma 7 on Supabase Postgres, with a transaction pooler for the app and a session pooler for migrations, because the two jobs need different connection behaviour.

**LABEL >** two kinds of auth
Vendors sign in with Supabase cookie auth. Customers never sign up at all, because the portal runs on custom magic links with expiry, revocation and last-seen tracking.

**LABEL >** one data path
Every read and write goes through a single data layer, so validation and not-found handling stay consistent and the database stays swap-friendly. No component touches the ORM directly.

**LABEL >** a design system that compiles
Vector's design system lives in one documented file that generates the runtime tokens, with a linter that checks contrast and catches broken references. The docs cannot drift from the CSS.

**LABEL >** honest constraints
Streaming runs on Edge Runtime, where Prisma isn't compatible, so those routes talk to Supabase directly. Real projects have these compromises. I learned to make the call and move on.

**CALLOUT:**
I built this to grow my range as a designer who can also ship. Every architectural choice is now something I understand from the inside.

---

## 12. Working with AI

**EYEBROW:** Working with AI
**HEADING:** I made the calls, / it wrote the code

**BODY:**
Vector was built as a pair, me and an AI coding agent, and the split of responsibilities never moved. I owned the product, the decisions and the review. The AI owned the typing.

**LABEL >** plan first, prompt second
I sketched a loose plan for the whole product, then wrote a detailed one for every section before building it. I never asked the AI to just build me this. Instead I said what I wanted to achieve, asked for options with pros and cons, and made the call myself. Every plan ended with "ask me follow-up questions" (a habit I later upgraded into a grill-me skill that interrogates a plan until it holds up). I was not always on top of the syntax, but I always knew what was being built, and why.

**LABEL >** tests are the second pair of eyes
On a solo project nobody reviews your work, so the flows I cannot afford to break are covered by Playwright end-to-end tests, from task ids staying intact to editing an AI draft before approving it. Unit tests join them as the AI layer grows.

**LABEL >** when you hit a wall, write a skill
More than once the AI and I went in circles, and pushing harder on the same prompt never fixed it. Instead I had it research the problem properly and write the findings up as a reusable skill, so every session after starts smarter than the last.

---

## 13. Key takeaways (UNMOUNTED — copy pending from Caroline)

**EYEBROW:** Key takeaways
**HEADING:** What building it / taught me

> The previous three lessons moved to "Working with AI". Caroline is writing fresh
> takeaways copy; the section remounts in page.tsx once it lands.

---

## 14. What's next

**EYEBROW:** What's next
**HEADING:** Earning the next / slice of trust

**BODY:**
The roadmap follows the same rule as the rest of the product. Vector only gets more autonomy as it earns it.

**LABEL >** linear + attio
Sync issue status with Linear both ways, and pull deal context from Attio, using the same orchestrator and review queue the meeting flow already runs on.

**LABEL >** evals before autonomy
Every call is already logged and costed, so the next step is measuring accuracy. Proper evals over follow-ups and meeting actions, scored against what actually gets approved, edited or rejected, and fed back into better prompts. I want to know how accurate the drafts are before any of them run on their own.

**CALLOUT:**
Vector can be useful long before it is fully trusted, because a person is always the one who says yes.

---

## 15. View next project (closing)

**EYEBROW:** View next project
**HEADING (next project's title):** Designing an AI brain / for a support call centre
**BUTTON:** CHECK IT OUT  → links to /project/wiki-whisperer
