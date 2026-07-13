import {
  Container,
  Kicker,
  Title,
  Body,
  CaseStudyCallout,
  InsightCard,
  CodeCard,
} from "../ui";
import { Reveal } from "../Reveal";

const PRINCIPLES = [
  [
    "grounded",
    "Deterministic maths, narrative AI",
    "Plain JavaScript computes the hard signals (overdue counts, velocity, customer engagement) from a 2 to 5 KB snapshot. Claude only reasons over them in words, and the prompt forces every claim to cite a real taskId. It never does arithmetic it can get wrong.",
  ],
  [
    "efficient",
    "Cached, structured, streamed",
    "The system prompt is prompt-cached, output is pinned to a JSON schema, and the result streams to the browser through Edge Runtime. Insights are also cached against a hash of the input state, so identical boards do not pay twice.",
  ],
  [
    "observable",
    "Every call, costed",
    "Each Claude call is logged with its input, output and cache tokens, its dollar cost, latency and the Anthropic request id. Portfolio-scale usage runs under $5 a month, and the next section shows where all of it surfaces.",
  ],
] as const;

export function AILayer() {
  return (
    <section data-section="AILayer" className="pt-[120px] pb-0">
      <Container>
        <Reveal>
          <Kicker>The AI layer</Kicker>
          <Title>
            Grounded, efficient
            <br />
            and observable
          </Title>
        </Reveal>

        <Reveal className="max-w-[760px] space-y-5">
          <Body>
            The real engineering was keeping a language model honest and inspectable at
            portfolio scale.
          </Body>
          <Body>
            The design is a three-layer split. Deterministic code owns the numbers, the
            model owns the narrative, and the prompt refuses to let it invent.
          </Body>
        </Reveal>

        <Reveal className="mt-12 grid gap-8 lg:grid-cols-2">
          <CodeCard file="lib/ai/context.js">
            <span className="tok-com">
              {"// Layer 1: deterministic code builds a snapshot.\n"}
            </span>
            <span className="tok-com">
              {"// Claude reads it. It never does the arithmetic.\n"}
            </span>
            {"{\n  "}
            <span className="tok-fn">{'"onboarding"'}</span>
            {": { "}
            <span className="tok-fn">{'"company"'}</span>
            {": "}
            <span className="tok-str">{'"Acme Co"'}</span>
            {",\n                  "}
            <span className="tok-fn">{'"daysToTargetGoLive"'}</span>
            {": "}
            <span className="tok-key">{"-102"}</span>
            {" },\n  "}
            <span className="tok-fn">{'"facts"'}</span>
            {": {\n    "}
            <span className="tok-fn">{'"totalTasks"'}</span>
            {": "}
            <span className="tok-key">{"20"}</span>
            {",\n    "}
            <span className="tok-fn">{'"tasksDone"'}</span>
            {": "}
            <span className="tok-key">{"8"}</span>
            {",\n    "}
            <span className="tok-fn">{'"tasksOverdue"'}</span>
            {": [\n      { "}
            <span className="tok-fn">{'"taskId"'}</span>
            {": "}
            <span className="tok-str">{'"AC-3"'}</span>
            {", "}
            <span className="tok-fn">{'"daysOverdue"'}</span>
            {": "}
            <span className="tok-key">{"136"}</span>
            {" },\n      …9 more\n    ],\n    "}
            <span className="tok-fn">{'"health"'}</span>
            {": "}
            <span className="tok-str">{'"At risk"'}</span>
            {",\n    "}
            <span className="tok-fn">{'"healthReasons"'}</span>
            {": [\n      "}
            <span className="tok-str">{'"1 task blocked"'}</span>
            {",\n      "}
            <span className="tok-str">{'"10 tasks overdue"'}</span>
            {",\n      "}
            <span className="tok-str">{'"Past go-live date with open tasks"'}</span>
            {"\n    ]\n  }\n}"}
          </CodeCard>

          <CodeCard file="lib/ai/insights.js">
            <span className="tok-com">{"// Layer 3: the system prompt forbids invention.\n"}</span>
            <span className="tok-key">{"const"}</span>
            {" "}
            <span className="tok-fn">{"RULES"}</span>
            {" = "}
            <span className="tok-str">{"`"}</span>
            <span className="tok-str">
              {"\n  RULES, non-negotiable:\n\n"}
              {"  1. NEVER invent facts. Every claim must cite a\n"}
              {"     specific taskId or named field from the snapshot.\n\n"}
              {'  2. risks[]: concrete evidence something will go wrong.\n'}
              {'     “Could be a problem later” is NOT a risk.\n\n'}
              {"  3. wins[]: only real events from the last 7 days,\n"}
              {"     read from the snapshot. Do NOT invent.\n"}
            </span>
            <span className="tok-str">{"`"}</span>
            {";"}
          </CodeCard>
        </Reveal>

        <Reveal className="mt-14 max-w-[860px]">
          <CaseStudyCallout stream>
            {"The model never does the arithmetic. It reads numbers the code already computed, and cites the exact task behind every claim it makes."}
          </CaseStudyCallout>
        </Reveal>

        <Reveal
          stagger={0.12}
          className="mt-14 grid auto-rows-fr gap-9 md:grid-cols-3"
        >
          {PRINCIPLES.map(([label, title, body]) => (
            <InsightCard key={label} label={label} title={title} width="auto" height="auto">
              {body}
            </InsightCard>
          ))}
        </Reveal>
      </Container>
    </section>
  );
}
