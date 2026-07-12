import { Container, Kicker, Title, Body, CaseStudyCallout, InsightCard } from "../ui";
import { Reveal } from "../Reveal";

const PILLARS = [
  [
    "pillar #01",
    "A shared workspace",
    "One place both sides actually use. The customer clicks a magic link and lands straight on their tasks. No signup, no password, no account to create.",
  ],
  [
    "pillar #02",
    "AI that earns its keep",
    "It drafts follow-ups, turns meeting transcripts into tasks, and flags which onboarding needs attention today, always as a draft a person approves.",
  ],
  [
    "pillar #03",
    "Predictive health",
    "Every onboarding is scored On track, At risk or Blocked from its real data, and each flag arrives with its reasons, so you know exactly what to fix.",
  ],
] as const;

export function Product() {
  return (
    <section data-section="Product" className="pt-[120px] pb-0">
      <Container>
        <Reveal>
          <Kicker>The product</Kicker>
          <Title>
            Shared board, drafting AI,
            <br />
            predictive health
          </Title>
        </Reveal>

        <Reveal className="max-w-[760px]">
          <Body>
            The work that slips is rarely the big stuff. It is the follow-ups, the actions
            agreed in a meeting, the risk building on a board no one has opened today.
            That is exactly what an LLM is good at, as long as it stays grounded and never
            acts on its own.
          </Body>
        </Reveal>

        <Reveal className="mt-12">
          <CaseStudyCallout stream>
            {"Vector drafts. A person approves. Nothing is ever sent or changed autonomously, so the AI can be useful long before it has earned full trust."}
          </CaseStudyCallout>
        </Reveal>

        <Reveal
          stagger={0.12}
          className="mt-14 grid auto-rows-fr gap-9 md:grid-cols-3"
        >
          {PILLARS.map(([label, title, body]) => (
            <InsightCard key={label} label={label} title={title} width="auto" height="auto">
              {body}
            </InsightCard>
          ))}
        </Reveal>
      </Container>
    </section>
  );
}
