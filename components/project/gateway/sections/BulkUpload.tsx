import { Container, Kicker, Title, Body, CaseStudyCallout, PlaceholderShot } from "../ui";
import { Reveal } from "../Reveal";

/* Product block 3 — bulk handovers for bigger developers. Two beats (Caroline's
   facts, 2026-08-05): the designed batch flow (pick plots -> prefilled table in
   Gateway), and the interim meet-them-halfway upload (their existing spreadsheet,
   validated + highlighted, no autofill) built with a front-end developer for
   the people who would struggle with the change. The star block for
   design-engineer readers.
   Upload format CONFIRMED as CSV (Caroline, 2026-08-05 — earlier "SVG"
   mentions were slips of the tongue). */
export function BulkUpload() {
  return (
    <section data-section="BulkUpload" className="py-24">
      <Container>
        <Reveal>
          <Kicker>the product · 03</Kicker>
          <Title className="mb-10">Bulk handovers that validate themselves</Title>
        </Reveal>
        <Reveal className="max-w-[680px] space-y-5">
          <Body>
            Bigger developers hand over in weekly batches, so I designed for the
            batch. They pick the plots they want to hand over from a table, and
            Gateway builds a familiar spreadsheet-style table that arrives
            prefilled. They add only the missing information and submit.
          </Body>
          <Body>
            For the teams not ready to change, a front-end developer and I
            teamed up on an interim bridge. They keep filling the spreadsheet
            they use today, upload it to Gateway as a CSV, and Gateway
            highlights every missing field and mismatched detail before
            submission. No autofill, no new habits.
          </Body>
          <Body>
            It&apos;s not a solution we want to keep. It meets them where they
            are while the table flow earns their trust.
          </Body>
        </Reveal>
        <Reveal className="mt-12">
          <CaseStudyCallout stream>
            Catch the bad data at the door, not in month three.
          </CaseStudyCallout>
        </Reveal>
        <Reveal className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-2">
          <PlaceholderShot label="batch flow — pick plots, prefilled table (TODO, anonymise)" />
          <PlaceholderShot label="interim upload — missing + mismatched highlighting (TODO, anonymise)" />
        </Reveal>
      </Container>
    </section>
  );
}
