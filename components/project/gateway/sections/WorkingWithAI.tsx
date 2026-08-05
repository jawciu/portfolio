import { Container, Kicker, Title, Body, InsightCard, CaseStudyCallout } from "../ui";
import { Reveal } from "../Reveal";

/* "How I got up to speed (and where AI didn't help)" — the AI-in-my-process
   section, Vector-Collaboration's sibling for the embedded-designer day job.
   Shape: AI compresses input → widens the middle → no AI at the decision point
   → AI accelerates output. Keep it ONE section; the case study's spine stays
   the business/systems story.
   TODO(caro): confirm the AI notetaker's name (Marvin?) + that E.ON is OK with
   naming internal research tooling publicly. */
const BEATS = [
  {
    label: "compress the input",
    title: "Ramping up fast",
    body: "TODO(caro): AI summarised the dense Miro insight boards, answered my domain questions, and helped me audit the previous designs quickly. Then a week of calls to verify. Add the ramp-up number if you have one.",
  },
  {
    label: "widen the middle",
    title: "More options, faster",
    body: "TODO(caro): generated and stress-tested directions for the handover form, pros and cons per option.",
  },
  {
    label: "no AI here",
    title: "The decision stayed mine",
    body: "TODO(caro): I evaluated the options and picked the direction myself, and wireframed the main screens by hand in Figma. Early backend and ops conversations go better over a static screen: the discussion stays on the concept.",
  },
  {
    label: "accelerate the output",
    title: "Prototype and repo",
    body: "TODO(caro): once concepts landed, an AI-built functioning prototype for user testing; an AI notetaker in developer interviews fed insights straight into the global research repo.",
  },
];

export function WorkingWithAI() {
  return (
    <section data-section="WorkingWithAI" className="py-24">
      <Container>
        <Reveal>
          <Kicker>working with AI</Kicker>
          <Title className="mb-10">
            How I got up to speed (and where AI didn&apos;t help)
          </Title>
        </Reveal>
        <Reveal className="max-w-[680px] space-y-5">
          <Body>
            {/* TODO(caro): framing line. Draft: */}
            A foreign domain, business pressure and no handover from the previous
            designer. This is where AI fits my week, and where it deliberately
            doesn&apos;t.
          </Body>
        </Reveal>
        <Reveal
          stagger={0.1}
          className="mt-12 grid grid-cols-1 justify-items-center gap-8 md:grid-cols-2"
        >
          {BEATS.map((b) => (
            <InsightCard key={b.label} width="auto" height="auto" label={b.label} title={b.title}>
              {b.body}
            </InsightCard>
          ))}
        </Reveal>
        <Reveal className="mt-12">
          <CaseStudyCallout stream>
            {/* Same principle as Vector's "I made every call myself" — keep the echo. */}
            AI compressed the ramp-up. The design calls stayed mine.
          </CaseStudyCallout>
        </Reveal>
      </Container>
    </section>
  );
}
