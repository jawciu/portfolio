import { Container, Kicker, Title, Body } from "../ui";
import { Reveal } from "../Reveal";

const PILLARS: [string, string][] = [
  [
    "agentic",
    "V2 is one of E.ON Next's first autonomous agents: a reasoning-and-acting agent on LangGraph, with an LLM as the brain and retrieval tools as the hands.",
  ],
  [
    "grounded",
    "It answers only from E.ON Next's own knowledge, using RAG, a continuously resynced knowledge base, and guardrails that block anything off-limits.",
  ],
  [
    "proven",
    "Subject-matter experts validated answers against a golden dataset before release, and a chunking and retrieval rework lifted positive recall from 82% to 90%.",
  ],
];

export function UnderTheHood() {
  return (
    <section data-section="UnderTheHood" className="pt-[120px] pb-0">
      <Container>
        <Reveal>
          <Kicker>Under the hood</Kicker>
          <Title>An autonomous, heavily tested agent</Title>
        </Reveal>

        <Reveal className="max-w-[760px]">
          <Body>
            V2 had to undo V1&apos;s scars, so answers were put through rigorous testing with
            subject-matter experts before release. Working alongside the AI platform and the Learning and Development ops team, we validated
            the agent against the real questions specialists face.
          </Body>
        </Reveal>

        <Reveal stagger={0.12} className="mt-12 grid auto-rows-fr gap-8 md:grid-cols-3">
          {PILLARS.map(([label, body]) => (
            <div
              key={label}
              className="flex h-full flex-col rounded-2xl border border-[var(--cog-line)] bg-[var(--cog-card)] px-8 py-7"
            >
              <p className="case-study-label">{label}</p>
              <div className="mt-4 h-px w-full bg-[var(--green)]" />
              <Body className="mt-5 text-[var(--cog-ink-soft)]">{body}</Body>
            </div>
          ))}
        </Reveal>
      </Container>
    </section>
  );
}
