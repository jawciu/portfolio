import type { ReactNode } from "react";
import { Container, Kicker, Title, Body, InsightCard } from "../ui";
import { Reveal } from "../Reveal";

// num = concept + index (caps eyebrow), buzz = the AI buzzwords (prominent line,
// mostly lowercase; acronyms / proper nouns keep their case)
const PILLARS: { num: string; buzz: string; body: ReactNode }[] = [
  {
    num: "agentic #01",
    buzz: "LLM · tools · LangGraph",
    body: (
      <>
        One of E.ON Next&apos;s first autonomous agents: a reasoning-and-acting loop on LangGraph,
        where an LLM plans each step and calls retrieval tools.
      </>
    ),
  },
  {
    num: "grounded #02",
    buzz: "RAG · guardrails",
    body: (
      <>
        It answers only from E.ON Next&apos;s own knowledge, using RAG over a continuously resynced
        knowledge base, with guardrails that block anything off-limits.
      </>
    ),
  },
  {
    num: "proven #03",
    buzz: "golden dataset · evals",
    body: (
      <>
        Subject-matter experts validated answers against a golden dataset before release, and a
        chunking and retrieval rework lifted positive recall from 82% to 90%.
      </>
    ),
  },
];

export function UnderTheHood() {
  return (
    <section data-section="UnderTheHood" className="pt-[120px] pb-0 max-sm:pt-20">
      <Container>
        <Reveal>
          <Kicker>Under the hood</Kicker>
          <Title>
            Production-grade,
            <br />
            eval-driven retrieval AI
          </Title>
        </Reveal>

        <Reveal className="max-w-[760px]">
          <Body>
            V2 had to undo V1&apos;s scars, so answers were put through rigorous testing with
            subject-matter experts before release. Working alongside the AI platform and the Learning and Development ops team, we validated
            the agent against the real questions specialists face.
          </Body>
        </Reveal>

        <Reveal stagger={0.12} className="mt-12 grid auto-rows-fr gap-8 md:grid-cols-3">
          {PILLARS.map(({ num, buzz, body }) => (
            <InsightCard
              key={num}
              label={num}
              // override case-study-label's forced lowercase so LLM/RAG/LangGraph keep their case
              title={<span style={{ textTransform: "none" }}>{buzz}</span>}
              width="auto"
              height="auto"
            >
              {body}
            </InsightCard>
          ))}
        </Reveal>
      </Container>
    </section>
  );
}
