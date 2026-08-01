# GALAXY.md — the skills galaxy data (source of truth)

This file feeds the `/skills` galaxy section on the homepage. **Edit the tables, not the code.**
After editing, run `node scripts/sync-galaxy.mjs` (or ask an agent) to regenerate
`lib/galaxyData.ts`. The site never reads this file directly.

How the tables work:

- `show` — `yes` renders the row, `no` keeps it here but out of the galaxy. Never delete a row
  to hide it, flip it to `no` so nothing is lost.
- `id` — lowercase-kebab, referenced by other tables. Don't rename an id without updating the
  rows that point at it (the sync script errors loudly if a reference dangles).
- `connects` — space-separated list of ids this node links to (jobs, projects or other skills).
- `size` — 1 small · 2 medium · 3 hub. Hubs render bigger and brighter.
- `featured` — `yes` on a skill means it starts pre-focused with a visible label at page load
  (the curiosity bait). About 6 are chosen for the landing view: ai-agents, design-systems,
  zero-to-one, visual-craft, brand-identity, product-work.
- One line max per `one-liner`. It shows next to the star when focused. No em dashes.
- `TODO(caro)` marks facts I could not verify in your notes — confirm or edit before merge.

Fact discipline (from the job-search repo, baked in here so it never slips):
97% is "would recommend", never NPS · Synapse was a team of three, Caroline owned backend and
AI architecture · Live Scribe is a PoC, never "shipped" · E.ON voice bots are not her work ·
Live Help, 360 call analytics and Performance insights are IN BUILD, frame as building not shipped.

## Jobs

| show | id         | name              | role                   | dates       | one-liner                                                        |
| ---- | ---------- | ----------------- | ---------------------- | ----------- | ---------------------------------------------------------------- |
| yes  | eon        | E.ON Next         | product designer       | 2025 – now  | AI tools for a support call centre, designed end to end          |
| yes  | cog        | Cog               | founding designer      | 2023 – 2025 | 0→1 ADHD app and online therapy clinic, first design hire        |
| yes  | brainstation | BrainStation    | product design educator | 2023       | top of class, then came back to teach it                         |
| yes  | casablanca | Casablanca Paris  | senior print designer  | 2022 – 2023 | luxury fashion house, print and graphics                         |
| yes  | burberry   | Burberry          | senior print designer  | 2021 – 2022 | led a team of 6 designers                                        |
| yes  | consultancy | Design consultant | self-employed         | 2019 – 2021 | led creative projects for high-profile clients                   |
| yes  | julien-macdonald | Julien Macdonald | knitwear & print designer | 2018 – 2019 | mentored and coordinated a group of interns             |
| yes  | mcqueen    | Alexander McQueen | print designer         | 2019 – 2021 | couture-level craft under pressure                          |
| yes  | mary       | Mary Katrantzou   | textile & print designer | 2014 – 2017 | textiles and graphics for shows and commercial work across 14 seasons |
| yes  | pilotto    | Peter Pilotto     |                        | 2019        | managed garment print production and sampling                    |
| no   | margiela   | Maison Margiela   | print designer         | TODO(caro) dates | TODO(caro): confirm role + dates before showing             |

## Projects

| show | id              | job    | name                    | one-liner                                                              | link                    |
| ---- | --------------- | ------ | ----------------------- | ---------------------------------------------------------------------- | ----------------------- |
| yes  | wiki-whisperer  | eon    | Wiki Whisperer V2       | rebuilt a failed AI assistant into an agent 97% would recommend        | /project/wiki-whisperer |
| yes  | ai-design-system | eon   | AI design system        | one design language for every E.ON Next AI product, built from scratch |                         |
| yes  | performance-tools | eon  | Performance tools       | replaced 12+ Tableau reports with one coaching dashboard               |                         |
| yes  | gateway         | eon    | B2B handovers           | property developer handovers, from spreadsheet debt to a product       |                         |
| yes  | figma-make-kit  | eon    | Figma Make boilerplates | on-brand prototyping kits adopted across product teams                 |                         |
| yes  | live-help       | eon    | Live Help               | live transcription that catches a missed journey step and nudges it back |                         |
| yes  | call-analytics  | eon    | 360 call analytics      | AI call evaluation trained on leaders' past reviews, every call instead of two a month |         |
| yes  | perf-insights   | eon    | Performance insights    | links call metrics to transcripts to spot the trends worth upskilling on |                       |
| yes  | eon-ds          | eon    | E.ON design system      | building and maintaining the core design system                        |                         |
| yes  | cog-clinic      | cog    | Cog Clinic redesign     | research-led booking redesign that earned the first therapy revenue    | /project/cog-adhd       |
| yes  | check-in        | cog    | Check-in history        | weekly symptom overview so users could answer "how was your week?"     |                         |
| yes  | daily-insights  | cog    | Daily insights          | 150+ therapist-written insights with a matching algorithm              |                         |
| yes  | subscription    | cog    | Subscription launch     | designed the free-to-paid transition and first recurring revenue       |                         |
| yes  | self-help       | cog    | CBT self-help modules   | turned the in-person therapy journey into bite-sized illustrated stories            |                         |
| yes  | cog-website     | cog    | cogadhd.com             | designed and built the marketing site in three weeks                   |                         |
| yes  | cog-ds          | cog    | Cog design system       | reusable component library and brand kit                    |                         |
| yes  | vector          |        | Vector                  | AI-native B2B onboarding workspace, designed and built solo            | /project/vector         |
| yes  | synapse         |        | Synapse                 | memory-first journaling agent on a knowledge graph, owned backend and AI orchestration      | https://github.com/jawciu/synapse |
| yes  | portfolio       |        | This site               | hand-built WebGL portfolio, the galaxy you are flying through          | https://github.com/jawciu/portfolio |
| no   | job-search-agent |       | Job-search agent        | an agentic system that scans, digests and finds her next role          |                         |
| no   | cashu           | brainstation | Cashu             | end-to-end personal finance app for 18-25s, tested twice               |                         |

## Skills

Clusters: `design` · `research` · `ai` · `engineering` · `product` · `leadership`

| show | id                | cluster     | name                     | size | featured | connects                                            |
| ---- | ----------------- | ----------- | ------------------------ | ---- | -------- | --------------------------------------------------- |
| yes  | zero-to-one       | design      | 0→1 product design       | 3    | yes      | cog vector gateway eon synapse portfolio user-interviews visual-craft brand-identity founding-autonomy context-switching navigating-ambiguity ownership |
| yes  | design-systems    | design      | design systems           | 3    | yes      | ai-design-system cog-ds vector eon eon-ds cog figma-make-kit |
| yes  | brand-identity    | design      | brand identity           | 2    | yes      | ai-design-system cog-website vector cog burberry casablanca julien-macdonald mcqueen consultancy mary pilotto eon design-systems moodboarding brand-guidelines logo-design |
| yes  | visual-craft      | design      | visual craft             | 2    | yes      | burberry mcqueen casablanca brand-identity cog consultancy mary pilotto eon julien-macdonald brainstation art-direction motion-design print-design |
| yes  | motion-design     | design      | motion design            | 1    |          | ai-design-system portfolio cog eon consultancy       |
| yes  | dense-data-ui     | design      | dense-data UI            | 2    |          | performance-tools gateway vector perf-insights       |
| yes  | accessibility     | design      | accessibility            | 1    |          | eon cog                                              |
| yes  | prototyping       | design      | prototyping              | 1    |          | eon cog figma-make-kit call-analytics live-help      |
| yes  | figma-advanced    | design      | Figma, the deep end      | 2    |          | design-systems eon cog call-analytics figma-make-kit |
| yes  | print-design      | design      | print & textile design   | 2    |          | burberry casablanca julien-macdonald mcqueen consultancy mary pilotto |
| yes  | art-direction     | design      | art direction            | 1    |          | eon cog-website print-design consultancy             |
| yes  | information-arch  | design      | information architecture | 1    |          | cog-website gateway                                  |
| yes  | conversion-design | design      | conversion design        | 1    |          | cog-clinic subscription cog-website                  |
| yes  | moodboarding      | design      | moodboarding             | 1    |          | cog casablanca mary                                  |
| yes  | brand-guidelines  | design      | brand guidelines         | 1    |          | cog-ds ai-design-system                              |
| yes  | logo-design       | design      | logo design              | 1    |          | cog cog-ds consultancy                               |
| yes  | user-interviews   | research    | user interviews          | 2    |          | cog eon cog-clinic call-analytics gateway            |
| yes  | usability-testing | research    | usability testing        | 1    |          | cog-clinic wiki-whisperer call-analytics             |
| yes  | pilot-design      | research    | pilot & experiment design | 2   |          | wiki-whisperer eon                                   |
| yes  | ab-testing        | research    | A/B testing              | 1    |          | cog-clinic                                           |
| yes  | personas-journeys | research    | personas & journey maps  | 1    |          | cog cog-clinic gateway                               |
| yes  | competitive-analysis | research | competitive analysis     | 1    |          | cog vector synapse                                   |
| yes  | field-research    | research    | field research           | 1    |          | eon                                                  |
| yes  | research-ops      | research    | research ops             | 1    |          | eon                                                  |
| yes  | surveys           | research    | surveys                  | 1    |          | eon cog                                              |
| yes  | moderated-research | research   | moderated research       | 1    |          | cog eon cog-clinic                                   |
| yes  | desk-research     | research    | desk research            | 1    |          | cog eon synapse vector                               |
| yes  | ai-agents         | ai          | AI agents                | 3    | yes      | wiki-whisperer vector synapse live-help ai-observability call-analytics context-design agent-harnesses agent-loops tracing building-with-agents tool-design agent-memory plan-first agent-skills |
| yes  | langgraph         | ai          | LangGraph                | 2    |          | wiki-whisperer synapse                               |
| yes  | langchain         | ai          | LangChain                | 1    |          | synapse                                              |
| yes  | rag               | ai          | RAG                      | 2    |          | wiki-whisperer synapse                               |
| yes  | knowledge-graphs  | ai          | knowledge graphs         | 2    |          | synapse portfolio                                    |
| yes  | claude-api        | ai          | Claude API               | 2    |          | vector                                               |
| yes  | prompt-design     | ai          | prompt design            | 2    |          | vector synapse wiki-whisperer live-help call-analytics |
| yes  | evals             | ai          | evals & golden datasets  | 2    |          | wiki-whisperer vector synapse call-analytics                        |
| yes  | guardrails        | ai          | guardrails & grounding   | 1    |          | wiki-whisperer vector                                |
| yes  | human-in-the-loop | ai          | human-in-the-loop design | 2    |          | vector wiki-whisperer live-help                      |
| yes  | ai-observability  | ai          | AI observability         | 2    |          | vector synapse eon wiki-whisperer call-analytics live-help |
| yes  | model-benchmarking | ai         | model benchmarking       | 1    |          | synapse                                              |
| yes  | agent-workflows   | ai          | agent team workflows     | 2    |          | portfolio vector                    |
| yes  | ai-architecture   | ai          | AI architecture          | 2    |          | claude-api rag knowledge-graphs context-design agent-harnesses design-engineering synapse vector wiki-whisperer |
| yes  | front-end         | engineering | front-end engineering    | 2    |          | typescript-react nextjs tailwind webgl-glsl r3f gsap design-engineering vector portfolio |
| yes  | back-end          | engineering | back-end engineering     | 2    |          | postgres-prisma python-fastapi surrealdb webhooks-crons design-engineering vector synapse |
| yes  | typescript-react  | engineering | TypeScript & React       | 2    |          | vector portfolio                                     |
| yes  | nextjs            | engineering | Next.js                  | 2    |          | vector portfolio                                     |
| yes  | tailwind          | engineering | Tailwind                 | 1    |          | vector portfolio                                     |
| yes  | python-fastapi    | engineering | Python & FastAPI         | 1    |          | synapse                                              |
| yes  | postgres-prisma   | engineering | Postgres & Prisma        | 1    |          | vector                                               |
| yes  | surrealdb         | engineering | SurrealDB                | 1    |          | synapse                                              |
| yes  | webgl-glsl        | engineering | WebGL & GLSL             | 2    |          | portfolio                                            |
| yes  | r3f               | engineering | React Three Fiber        | 1    |          | portfolio                                            |
| yes  | gsap              | engineering | GSAP animation           | 1    |          | portfolio                                            |
| yes  | playwright        | engineering | Playwright testing       | 1    |          | vector portfolio                                     |
| yes  | webhooks-crons    | engineering | webhooks & crons         | 1    |          | vector                                               |
| yes  | webflow           | engineering | Webflow                  | 1    |          | cog-website                                          |
| yes  | tokens-in-code    | engineering | design tokens in code    | 1    |          | design-systems tailwind typescript-react vector portfolio |
| yes  | product-work      | product     | product work             | 3    | yes      | usability-testing prototyping product-metrics user-interviews competitive-analysis cog eon success-tracking moderated-research desk-research |
| yes  | success-tracking  | product     | success tracking         | 1    |          | cog eon                                              |
| yes  | product-metrics   | product     | product metrics          | 2    |          | eon cog vector wiki-whisperer perf-insights performance-tools |
| yes  | business-cases    | product     | business cases           | 1    |          | performance-tools                                    |
| yes  | monetisation      | product     | monetisation             | 1    |          | subscription cog-clinic                              |
| yes  | stakeholder-mgmt  | product     | stakeholder management   | 2    |          | eon cog consultancy                                  |
| yes  | roadmapping       | product     | roadmapping              | 1    |          | cog eon vector                                       |
| yes  | icp-research      | product     | ICP & market research    | 1    |          | vector                                               |
| yes  | mentoring         | leadership  | mentoring & teaching     | 2    |          | brainstation burberry eon julien-macdonald           |
| yes  | workshops         | leadership  | workshop facilitation    | 1    |          | eon                                                  |
| yes  | team-leadership   | leadership  | team leadership          | 2    |          | burberry julien-macdonald communication empathy organisation prioritisation mentoring |
| yes  | founding-autonomy | leadership  | no-manager mode          | 2    |          | cog gateway vector consultancy                       |
| yes  | cross-functional  | leadership  | cross-functional glue    | 2    |          | eon cog burberry mary pilotto mcqueen casablanca julien-macdonald communication empathy |
| yes  | context-switching | leadership  | context switching        | 1    |          | cog vector                                           |
| yes  | navigating-ambiguity | leadership | navigating ambiguity   | 1    |          | cog gateway vector                                   |
| yes  | ownership         | leadership  | ownership                | 1    |          | cog vector synapse                                   |
| yes  | design-engineering | engineering | design engineering      | 3    |          | design-systems tokens-in-code portfolio vector figma-make-kit synapse context-design agent-harnesses agent-loops plan-first agent-memory agent-skills building-with-agents |
| yes  | trust-design      | ai          | designing for trust      | 2    |          | wiki-whisperer vector human-in-the-loop guardrails   |
| yes  | ux-writing        | design      | UX writing               | 2    |          | cog wiki-whisperer daily-insights self-help live-help perf-insights performance-tools vector gateway cog-clinic eon |
| yes  | onboarding-design | design      | onboarding design        | 1    |          | cog subscription vector                              |
| yes  | data-viz          | design      | data visualisation       | 1    |          | performance-tools perf-insights vector               |
| yes  | safety-design     | ai          | safety-first AI design   | 1    |          | synapse cog                                          |
| yes  | communication     | leadership  | communication            | 2    |          | stakeholder-mgmt workshops mentoring ux-writing brainstation eon cog consultancy burberry gateway |
| yes  | empathy           | research    | empathy                  | 2    |          | user-interviews usability-testing moderated-research personas-journeys product-work ux-writing accessibility cog eon cog-clinic mentoring stakeholder-mgmt communication workshops |
| yes  | organisation      | leadership  | organisation             | 2    |          | eon cog brainstation casablanca burberry consultancy julien-macdonald mcqueen mary pilotto context-switching stakeholder-mgmt research-ops |
| yes  | prioritisation    | leadership  | prioritisation           | 2    |          | eon cog brainstation casablanca burberry consultancy julien-macdonald mcqueen mary pilotto organisation roadmapping product-work navigating-ambiguity |
| yes  | context-design    | ai          | context design           | 2    |          | prompt-design rag claude-api agent-harnesses vector synapse wiki-whisperer portfolio call-analytics live-help |
| yes  | agent-harnesses   | ai          | agent harnesses          | 2    |          | agent-workflows claude-api tool-design vector portfolio synapse |
| yes  | agent-loops       | ai          | agent loops              | 1    |          | agent-harnesses langgraph human-in-the-loop vector synapse wiki-whisperer |
| yes  | tracing           | ai          | tracing                  | 1    |          | ai-observability evals langgraph vector synapse wiki-whisperer call-analytics |
| yes  | tool-design       | ai          | tool design              | 1    |          | claude-api langgraph vector synapse  |
| yes  | agent-memory      | ai          | agent memory             | 2    |          | synapse knowledge-graphs context-design portfolio vector |
| yes  | plan-first        | ai          | plan before code         | 2    |          | agent-workflows playwright navigating-ambiguity roadmapping vector portfolio synapse |
| yes  | agent-skills      | ai          | writing agent skills     | 1    |          | agent-workflows context-design portfolio vector      |
| yes  | building-with-agents | ai         | building with agents     | 2    |          | agent-workflows plan-first typescript-react vector portfolio synapse |

## Easter eggs

Rendered as ordinary small stars scattered between the clusters. Found by the curious.

| show | id             | name                | one-liner                                                    | connects          |
| ---- | -------------- | ------------------- | ------------------------------------------------------------ | ----------------- |
| yes  | golf           | determination       | played golf for the Polish national team                     | team-leadership   |
| yes  | frisbee        | competitive streak  | way too competitive at ultimate frisbee                      | golf              |
| yes  | handstand      | current side quest  | trying to land a handstand                                   |                   |
| yes  | polish         | dwujęzyczna         | native Polish speaker, born in Łódź                          |                   |
| yes  | book-a-month   | paper input         | one product book a month, Inspired started it                |                   |
| yes  | christmas-ds   | holiday shipping    | built Cog's design system over Christmas, for fun            | cog-ds            |
| yes  | praise-ai      | be nice to robots   | discovered that praising the AI makes it work better         | ai-agents         |
| yes  | commit-streak  | momentum            | 208 commits in 7 weeks on the site you are looking at        | portfolio         |
| yes  | communities    | good company        | member of AI Pilled and Claude Code Curious                  | agent-workflows   |
| yes  | wispr          | voice input         | talks to her tools all day, a daily Wispr Flow user          |                   |
| no   | scriggly       | Scriggly            | Cog's mascot approves of this galaxy                         | cog               |
