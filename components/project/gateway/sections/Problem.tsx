import { Container, Kicker, Title, Body, CaseStudyCallout, PlaceholderShot } from "../ui";
import { Reveal } from "../Reveal";

/* The business problem — handovers arrive as manually submitted Google Sheets;
   information gets lost, handovers drag, and the delay is where debt accrues.
   (The step-up beat — designer left, foreign domain, she volunteered — moved to
   the hero's setting-the-stage block, template layout, 2026-08-05.) */
export function Problem() {
  return (
    <section data-section="Problem" className="py-24">
      <Container>
        <Reveal>
          <Kicker>problem space</Kicker>
          <Title className="mb-10">Handovers lived in a spreadsheet</Title>
        </Reveal>
        <Reveal className="max-w-[680px] space-y-5">
          {/* Caroline's copy, 2026-08-05 */}
          <Body>
            When a new-build home is sold, the property developer hands the
            plot&apos;s energy account over to the new owner. Today that handover
            reaches E.ON Next as a manually submitted spreadsheet.
          </Body>
          <Body>
            Nothing is validated, so submissions arrive with missing fields,
            typos and mismatched details, and the back and forth makes the
            process longer than it needs to be. The delays build up debt on
            accounts and make for a poor first experience for new property
            owners.
          </Body>
        </Reveal>
        <Reveal className="mt-12">
          <CaseStudyCallout stream>
            {/* TODO(caro): baseline number — avg handover cycle time / % needing
                rework / ops hours per handover. Grab it BEFORE launch. */}
            TODO: the one baseline number that makes the debt real.
          </CaseStudyCallout>
        </Reveal>
        <Reveal className="mt-12">
          <PlaceholderShot label="before: the spreadsheet channel (anonymised) — TODO" />
        </Reveal>
      </Container>
    </section>
  );
}
