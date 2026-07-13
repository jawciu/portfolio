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

        {/* TEMPORARY comparison set — verbatim-leaning versions of the two cards
            above. Caroline picks one pair, the other gets deleted. */}
        <p className="mt-16 font-[family-name:var(--font-mono)] text-[13px] tracking-[0.15em] text-[var(--case-study-muted)]">
          option b: closer to the real source (temporary, compare and pick)
        </p>
        <Reveal className="mt-6 grid gap-8 lg:grid-cols-2">
          <CodeCard file="lib/ai/context.js">
            <span className="tok-com">
              {"// Layer 1: the snapshot, as built. Elisions marked.\n"}
            </span>
            {"{\n  "}
            <span className="tok-fn">{'"today"'}</span>
            {": "}
            <span className="tok-str">{'"2026-07-13"'}</span>
            {",\n  "}
            <span className="tok-fn">{'"onboarding"'}</span>
            {": {\n    "}
            <span className="tok-fn">{'"company"'}</span>
            {": "}
            <span className="tok-str">{'"Initech"'}</span>
            {",\n    "}
            <span className="tok-fn">{'"owner"'}</span>
            {": "}
            <span className="tok-str">{'"Tom Okafor"'}</span>
            {",\n    "}
            <span className="tok-fn">{'"status"'}</span>
            {": "}
            <span className="tok-str">{'"Active"'}</span>
            {",\n    "}
            <span className="tok-fn">{'"targetGoLive"'}</span>
            {": "}
            <span className="tok-str">{'"2026-03-14T00:00:00.000Z"'}</span>
            {",\n    "}
            <span className="tok-fn">{'"daysToTargetGoLive"'}</span>
            {": "}
            <span className="tok-key">{"-121"}</span>
            {"\n  },\n  "}
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
            {",\n        "}
            <span className="tok-fn">{'"title"'}</span>
            {": "}
            <span className="tok-str">{'"VPN access for vendor team"'}</span>
            {",\n        "}
            <span className="tok-fn">{'"daysOverdue"'}</span>
            {": "}
            <span className="tok-key">{"12"}</span>
            {", "}
            <span className="tok-fn">{'"status"'}</span>
            {": "}
            <span className="tok-str">{'"Blocked"'}</span>
            {" },\n"}
            <span className="tok-com">{"      …1 more\n"}</span>
            {"    ],\n    "}
            <span className="tok-fn">{'"tasksBlocked"'}</span>
            {": [\n      { "}
            <span className="tok-fn">{'"taskId"'}</span>
            {": "}
            <span className="tok-str">{'"IN-2"'}</span>
            {",\n        "}
            <span className="tok-fn">{'"title"'}</span>
            {": "}
            <span className="tok-str">{'"Data privacy impact assessment"'}</span>
            {" },\n"}
            <span className="tok-com">{"      …2 more\n"}</span>
            {"    ],\n    "}
            <span className="tok-fn">{'"velocity7d"'}</span>
            {": "}
            <span className="tok-key">{"1"}</span>
            {",\n"}
            <span className="tok-com">{"    ⋮ customerLastSeenPortalAt, bouncedContacts…\n"}</span>
            {"    "}
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
            {"\n    ]\n  },\n"}
            <span className="tok-com">{"  ⋮ phases, contacts, recentWins\n"}</span>
            {"}"}
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

        <Reveal className="mt-14 max-w-[860px]">
          <CaseStudyCallout stream>
            {"Every call is prompt-cached, pinned to a JSON schema and logged with its cost, and an unchanged board never pays twice."}
          </CaseStudyCallout>
        </Reveal>
      </Container>
    </section>
  );
}
