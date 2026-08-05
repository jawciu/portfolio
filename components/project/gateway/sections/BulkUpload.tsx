import { Container, Kicker, Title, Body, CaseStudyCallout, PlaceholderShot } from "../ui";
import { Reveal } from "../Reveal";

/* Product block 3 — bulk handovers for bigger developers: file upload transformed
   into a validated table with missing / mismatched fields highlighted BEFORE
   processing. The star block for design-engineer readers.
   TODO(caro): CONFIRM the upload format — you said "SVG" twice; assuming CSV. */
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
            {/* TODO(caro): draft: */}
            Bigger developers hand over in bulk. They upload a CSV and Gateway
            transforms it into a handover table, highlighting what&apos;s missing or
            mismatched before anything reaches processing, so problems surface at
            submission, not months later.
          </Body>
        </Reveal>
        <Reveal className="mt-12">
          <CaseStudyCallout stream>
            {/* TODO(caro): callout draft: */}
            Catch the bad data at the door, not in month three.
          </CaseStudyCallout>
        </Reveal>
        <Reveal className="mt-12">
          <PlaceholderShot label="bulk table — mismatch + missing-field highlighting (TODO, anonymise)" />
        </Reveal>
      </Container>
    </section>
  );
}
