import { AIWorkflow, Container, Kicker, Title, Body, CaseStudyCallout, PlaceholderShot } from "../ui";
import { Reveal } from "../Reveal";

/* Starting the project: the avenues story (handovers vs disputes), sized up
   through interviews, decided in the callout. Copy approved by Caroline
   2026-08-05. Keep this section about WHAT was learned; HOW AI accelerated it
   lives in WorkingWithAI. */
export function Research() {
  return (
    <section data-section="Research" className="py-24">
      <Container>
        <Reveal>
          <Kicker>starting the project</Kicker>
          <Title className="mb-10">Hit the ground running</Title>
        </Reveal>
        <Reveal className="max-w-[680px] space-y-5">
          <Body>
            Gateway&apos;s scope was wider when I joined. Handovers were one
            avenue, disputes another, and no decision yet on where to start. I
            got up to speed on both, then took both problem spaces into my
            interviews with internal ops and property developers, so I could
            size them up and pick.
          </Body>
          <Body>
            I started designs for each. Disputes kept raising questions. It
            needed more supporting features to succeed, and it asked developers
            to dispute our way (mandatory fields, a photo of the meter read)
            when the current way was simpler for them. Handovers was where we
            could build value quickly.
          </Body>
        </Reveal>
        <Reveal className="mt-12">
          <CaseStudyCallout stream>
            {/* TODO(caro): confirm the timeframe ("a couple of weeks"?) */}
            I evaluated every possible avenue and prioritised where design could
            prove value fastest. Within a couple of weeks I convinced ops to
            build around handovers.
          </CaseStudyCallout>
        </Reveal>
        <Reveal className="mt-12">
          <PlaceholderShot label="the inherited Miro boards, gloriously cluttered (anonymise) — TODO" />
        </Reveal>
        {/* How AI helped the ramp-up (Caroline, 2026-08-05). NOTE: overlaps with
            WorkingWithAI's "AI compresses input" card — trim there if it reads
            twice. */}
        <Reveal className="mt-12">
          <AIWorkflow>
            With AI in Miro I synthesised the sticky notes, then loaded all the
            interview transcripts into NotebookLM and queried it for everything
            I needed to know.
          </AIWorkflow>
        </Reveal>
      </Container>
    </section>
  );
}
