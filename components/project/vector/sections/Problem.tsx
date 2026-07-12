import { Container, Kicker, Title, Body, CaseStudyCallout, InsightCard } from "../ui";
import { Reveal } from "../Reveal";

const GAP = [
  [
    "too heavy",
    "Enterprise tools",
    "Rocketlane and GuideCX are built for large implementation teams, priced near $30k a year, and take months to roll out. A Seed to Series B team cannot justify any of that.",
  ],
  [
    "too manual",
    "Spreadsheets and PM tools",
    "So teams hack onboarding into Notion, Asana or a shared sheet. Nothing tracks health, the customer has no real view, and the follow-up work lives in someone's head.",
  ],
] as const;

/* First section on the glass plate: pt-[88px] (the glass-seam exception). */
export function Problem() {
  return (
    <section data-section="Problem" className="pt-[88px] pb-0">
      <Container>
        <Reveal>
          <Kicker>Problem space</Kicker>
          <Title>
            Meetings eat the work,
            <br />
            context evaporates
          </Title>
        </Reveal>

        <Reveal className="max-w-[760px] space-y-5">
          <Body>
            Onboarding a new B2B tool is mostly follow-through. Half of it is agreed out
            loud on a call (&quot;we&apos;ll send the SOW Friday&quot;, &quot;IT still
            needs to provision SSO&quot;), and then it evaporates the second the call ends.
          </Body>
          <Body>
            The teams who feel this most are small, Seed to Series B, running ten to fifty
            onboardings at once with a handful of people. They are stuck between two bad
            options.
          </Body>
        </Reveal>

        <Reveal
          stagger={0.12}
          className="mx-auto mt-12 grid max-w-[900px] auto-rows-fr gap-9 md:grid-cols-2"
        >
          {GAP.map(([label, title, body]) => (
            <InsightCard key={label} label={label} title={title} width="auto" height="auto">
              {body}
            </InsightCard>
          ))}
        </Reveal>

        <Reveal className="mt-14">
          <CaseStudyCallout stream>
            {"Most onboarding tools optimise for the vendor's internal project management. I optimised for the shared experience, and let AI handle the follow-up that usually falls through the cracks."}
          </CaseStudyCallout>
        </Reveal>
      </Container>
    </section>
  );
}
