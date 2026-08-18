import { AIWorkflow, Container, Kicker, Title, Body, CaseStudyCallout, PlaceholderShot } from "../ui";
import { Reveal } from "../Reveal";

/* Starting the project: the avenues story (handovers vs disputes), sized up
   through interviews, decided in the callout. Copy shortened to Caroline's
   own rewrite 2026-08-18 (replaces the 2026-08-05 version; numbers paragraph
   cut). Keep this section about WHAT was learned; HOW AI accelerated it
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
            avenue, disputes another, and no decision on where to start. I got
            up to speed on both problem spaces, then took them into my
            interviews with internal ops and property developers so I could
            size them up.
          </Body>
          <Body>
            I started ideating for each. Disputes kept raising questions. They
            needed more supporting features to succeed. Handovers was where
            monetary value was locked.
          </Body>
        </Reveal>
        <Reveal className="mt-12">
          <CaseStudyCallout stream>
            I evaluated all directions and prioritised where design could bring
            value fastest. Within a couple of weeks I convinced ops to build
            around handovers first.
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
            Miro AI helped me synthesise the boards&apos; content and get up to
            speed with research. Loading all the interview transcripts into
            NotebookLM and querying it filled in the gaps. And Figma Make
            allowed for generating quick ideas that could be refined or
            discarded.
          </AIWorkflow>
        </Reveal>
      </Container>
    </section>
  );
}
