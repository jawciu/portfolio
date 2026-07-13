import {
  Container,
  Kicker,
  Title,
  Body,
  CaseStudyCallout,
  CodeCard,
} from "../ui";
import { Reveal } from "../Reveal";

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
            I designed the AI overview to keep the model away from hallucinated facts.
            Plain JavaScript computes the hard signals (overdue counts, velocity, customer
            engagement) from a small snapshot of the board.
          </Body>
          <Body>
            The model owns the narrative, and the guardrails stop it from inventing.
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
            <span className="tok-str">{'"Initech"'}</span>
            {",\n                  "}
            <span className="tok-fn">{'"daysToTargetGoLive"'}</span>
            {": "}
            <span className="tok-key">{"-121"}</span>
            {" },\n  "}
            <span className="tok-fn">{'"facts"'}</span>
            {": {\n    "}
            <span className="tok-fn">{'"totalTasks"'}</span>
            {": "}
            <span className="tok-key">{"9"}</span>
            {",\n    "}
            <span className="tok-fn">{'"tasksDone"'}</span>
            {": "}
            <span className="tok-key">{"1"}</span>
            {",\n    "}
            <span className="tok-fn">{'"tasksOverdue"'}</span>
            {": [\n      { "}
            <span className="tok-fn">{'"taskId"'}</span>
            {": "}
            <span className="tok-str">{'"IN-4"'}</span>
            {", "}
            <span className="tok-fn">{'"daysOverdue"'}</span>
            {": "}
            <span className="tok-key">{"12"}</span>
            {" },\n      …1 more\n    ],\n    "}
            <span className="tok-fn">{'"health"'}</span>
            {": "}
            <span className="tok-str">{'"Blocked"'}</span>
            {",\n    "}
            <span className="tok-fn">{'"healthReasons"'}</span>
            {": [\n      "}
            <span className="tok-str">{'"3 of 9 tasks blocked"'}</span>
            {",\n      "}
            <span className="tok-str">{'"2 tasks overdue"'}</span>
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
            {"Every call is prompt-cached, pinned to a JSON schema and logged with its exact cost: the whole AI layer runs on under $5 a month."}
          </CaseStudyCallout>
        </Reveal>
      </Container>
    </section>
  );
}
