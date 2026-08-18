import { A, Container, Kicker, Title, Body, CaseStudyCallout } from "../ui";
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
        <Reveal className="mt-12 max-w-[820px]">
          <CaseStudyCallout stream>
            I evaluated both directions and prioritised where design could bring
            value fastest. Within a couple of weeks I convinced ops to build
            around handovers first.
          </CaseStudyCallout>
        </Reveal>
        <Reveal className="mt-12">
          {/* the two directions as product cards (Caroline's asset, 2026-08-18):
              Handover and Dispute side by side — the fork the callout resolves. */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={A("handover-dispute-cards.png")}
            alt="Two Gateway cards side by side: Handover, with a start-handover button, and Dispute, promising a resolution within 10 working days"
            width={3600}
            height={432}
            className="block h-auto w-full rounded-[16px] border-[1.5px] border-[#F2E6E1]"
          />
        </Reveal>
        {/* The AI-workflows content moved to its own section, sections/
            AIWorkflows.tsx (Caroline 2026-08-18) — mounted right after this
            one in page.tsx. Miro-boards placeholder shot cut same day. */}
      </Container>
    </section>
  );
}
