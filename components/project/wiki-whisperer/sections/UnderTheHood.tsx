import { Container, Kicker, Title, Body } from "../ui";
import { Reveal } from "../Reveal";

const PILLARS: [string, string][] = [
  [
    "agentic >",
    "V2 is one of E.ON Next's first autonomous agents: a reasoning-and-acting agent on LangGraph, with an LLM as the brain and retrieval tools as the hands.",
  ],
  [
    "grounded and safe >",
    "It answers only from E.ON Next's own knowledge, using retrieval-augmented generation with a late-retrieval fallback, a continuously resynced knowledge base, and guardrails that block anything off-limits.",
  ],
  [
    "proven, then streamed >",
    "Subject-matter experts validated answers against a golden dataset before release, and a chunking and retrieval rework lifted recall from 82% to 90%. Responses then stream in word by word so the tool feels fast.",
  ],
];

export function UnderTheHood() {
  return (
    <section data-section="UnderTheHood" className="pt-[120px] pb-0">
      <Container>
        <Reveal>
          <Kicker>Under the hood</Kicker>
          <Title>An autonomous agent, not a search box</Title>
        </Reveal>

        <Reveal className="max-w-[760px]">
          <Body>
            I worked closely with the AI platform, backend and frontend squads, and the
            learning and development team who structured the knowledge for retrieval. A
            quick look at what makes the answers good.
          </Body>
        </Reveal>

        <Reveal stagger={0.12} className="mt-12 grid gap-8 md:grid-cols-3">
          {PILLARS.map(([label, body]) => (
            <div key={label} className="border-t-2 border-[var(--green)] pt-4">
              <p className="case-study-label">{label}</p>
              <Body className="mt-3">{body}</Body>
            </div>
          ))}
        </Reveal>
      </Container>
    </section>
  );
}
