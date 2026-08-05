import { Container, Kicker, Title, Body, CaseStudyCallout, PlaceholderShot } from "../ui";
import { Reveal } from "../Reveal";

/* Product block 1 — the single handover flow with autofill from backend data. */
export function HandoverFlow() {
  return (
    <section data-section="HandoverFlow" className="py-24">
      <Container>
        <Reveal>
          <Kicker>the product · 01</Kicker>
          <Title className="mb-10">One handover flow</Title>
        </Reveal>
        <Reveal className="max-w-[680px] space-y-5">
          <Body>
            {/* TODO(caro): describe the flow. Draft: */}
            A single guided flow replaces the spreadsheet. It can autofill by
            pulling back information E.ON Next already holds on the developer&apos;s
            accounts, so developers only type what&apos;s genuinely new.
          </Body>
        </Reveal>
        <Reveal className="mt-12">
          <CaseStudyCallout stream>
            Never ask a developer for data the company already holds.
          </CaseStudyCallout>
        </Reveal>
        <Reveal className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-2">
          <PlaceholderShot label="flow: empty state — TODO" />
          <PlaceholderShot label="flow: autofilled state — TODO" />
        </Reveal>
      </Container>
    </section>
  );
}
