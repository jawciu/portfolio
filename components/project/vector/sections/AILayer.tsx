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
    <section data-section="AILayer" className="pt-[200px] max-sm:pt-[100px] pb-0">
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
            <span className="tok-com">
              {"// Layer 3: verbatim, rules 2-3 and 6-10 elided.\n"}
            </span>
            <span className="tok-key">{"const"}</span>
            {" "}
            <span className="tok-fn">{"ONBOARDING_RULES"}</span>
            {" = "}
            <span className="tok-str">{"`"}</span>
            <span className="tok-str">
              {"\nRULES — non-negotiable:\n"}
              {"1. NEVER invent facts. Every claim must reference\n"}
              {"   a specific taskId or named field from the\n"}
              {"   snapshot.\n"}
            </span>
            <span className="tok-com">{"   ⋮\n"}</span>
            <span className="tok-str">
              {"4. \\`risks[]\\` (max 3): each item is concrete\n"}
              {'   evidence something will go wrong, with severity.\n'}
              {'   "Could become a problem later" without evidence\n'}
              {"   is NOT a risk.\n"}
            </span>
            <span className="tok-com">{"   ⋮\n"}</span>
            <span className="tok-str">
              {"5. \\`wins[]\\` (max 2): each item is a real event\n"}
              {"   from the snapshot's \\`recentWins[]\\` field\n"}
              {"   (last 7 days). Do NOT invent.\n"}
            </span>
            <span className="tok-com">{"   ⋮\n"}</span>
            <span className="tok-str">{"`"}</span>
            {";"}
          </CodeCard>
        </Reveal>

        {/* max-sm:mt = gap above the callout ÷2 on phones (desktop mt-28 = 112px) */}
        <Reveal className="mt-28 max-sm:mt-[56px] max-w-[860px]">
          <CaseStudyCallout stream>
            {"Every call is prompt-cached, pinned to a JSON schema and logged with its cost, and an unchanged board never pays twice."}
          </CaseStudyCallout>
        </Reveal>
      </Container>
    </section>
  );
}
