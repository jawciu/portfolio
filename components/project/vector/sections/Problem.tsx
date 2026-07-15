import { Container, Kicker, Title, Body, CaseStudyCallout, InsightCard } from "../ui";
import { Reveal } from "../Reveal";

const GAP = [
  [
    "too heavy",
    "Enterprise tools",
    "Rocketlane and GuideCX are built for large implementation teams, they are expensive, and take months to roll out.",
  ],
  [
    "too manual",
    "Hacked PM tool",
    "Teams hack onboarding into Notion, Linear or Asana. Nothing tracks health, the customer has no real view, and the follow-up work is lost.",
  ],
] as const;

/* First section on the glass plate: pt-[88px] (the glass-seam exception). */
export function Problem() {
  return (
    <section data-section="Problem" className="pt-[140px] max-sm:pt-[140px] pb-0">
      <Container>
        <Reveal>
          <Kicker>Problem space</Kicker>
          <Title>
            Follow-up falls
            <br />
            through the cracks
          </Title>
        </Reveal>

        <Reveal className="max-w-[760px] space-y-5">
          <Body>
            Onboarding a new B2B tool is follow-through. Most of it is agreed on calls and action points often get muddled and lost. The teams who feel this most are start-ups and scale ups that are stuck between two bad
            options.
          </Body>
        </Reveal>

        <Reveal
          stagger={0.12}
          className="mx-auto mt-[72px] grid max-w-[900px] auto-rows-fr gap-9 md:grid-cols-2"
        >
          {GAP.map(([label, title, body]) => (
            <InsightCard key={label} label={label} title={title} width="auto" height="auto">
              {body}
            </InsightCard>
          ))}
        </Reveal>

        <Reveal className="mt-[84px] max-w-[860px]">
          <CaseStudyCallout stream>
            {"Most onboarding tools optimise for the vendor's internal project management. I optimised for the shared experience, and let AI handle the follow-up that usually falls through the cracks."}
          </CaseStudyCallout>
        </Reveal>
      </Container>
    </section>
  );
}
