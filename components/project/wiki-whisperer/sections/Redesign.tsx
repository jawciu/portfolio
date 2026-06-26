import { Container, Kicker, Title, Body, CaseStudyCallout, InsightCard } from "../ui";
import { Reveal } from "../Reveal";

const FEATURES: [string, string, string][] = [
  [
    "principle #01",
    "conversational partner",
    "Multi-turn, natural dialogue replaced exact-phrase prompting, so agents can untangle complex, layered cases in real time.",
  ],
  [
    "principle #02",
    "familiar by design",
    "Built on E.ON Next's design system, the interface followed patterns agents already know from Gemini and ChatGPT, so V2 added no new mental model.",
  ],
  [
    "principle #03",
    "structured and sourced",
    "Long paragraphs became scannable sections, bullets and step-by-step guides, each linked to source acticles so agents can trust what they read.",
  ],
  [
    "principle #04",
    "creative on demand",
    "Beyond answers, specialists can ask for tables, learning documents and more, using the Wiki in ways V1 never allowed.",
  ],
];

export function Redesign() {
  return (
    <section data-section="Redesign" className="pt-[120px] pb-0">
      <Container>
        <Reveal>
          <Kicker>THE REDESIGN</Kicker>
          <Title>building trust, usability and flexibilityy</Title>
        </Reveal>

        <Reveal className="max-w-[760px]">
          <Body>
            V2 had to undo V1&apos;s scars. I designed for trust and low effort first, so
            an answer is fast to believe and easy to act on while still talking to a
            customer.
          </Body>
        </Reveal>

        <Reveal
          stagger={0.12}
          className="mx-auto mt-12 grid max-w-[900px] auto-rows-fr gap-9 md:grid-cols-2"
        >
          {FEATURES.map(([label, title, body]) => (
            <InsightCard key={label} label={label} title={title} width="auto" height="auto">
              {body}
            </InsightCard>
          ))}
        </Reveal>

        {/* product visual — placeholder until the Figma screens land */}
        <Reveal className="mt-14 flex h-[360px] w-full items-center justify-center rounded-2xl border border-dashed border-[var(--cog-line)] bg-[var(--cog-bg-alt)]">
          <span className="case-study-label text-[var(--cog-muted)]">
            v2 answer layout (structured + sourced)
          </span>
        </Reveal>

        <Reveal className="mt-12 max-w-[860px]">
          <CaseStudyCallout stream>
            An answer is only useful if the specialist trusts it enough to say it out loud. So I designed for trust before anything else.
          </CaseStudyCallout>
        </Reveal>
      </Container>
    </section>
  );
}
