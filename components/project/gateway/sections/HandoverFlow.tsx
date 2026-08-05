import { Container, Kicker, Title, Body, CaseStudyCallout, PlaceholderShot } from "../ui";
import { Reveal } from "../Reveal";

/* Product block 1 — the single handover flow with autofill from backend data,
   plus the autofill toggle born from testing (small devs wanted it, big devs
   distrusted the held data — Caroline's facts, 2026-08-05). */
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
            A single guided flow replaces the spreadsheet. It can autofill by
            pulling back information E.ON Next already holds on each plot, so
            developers only type what&apos;s genuinely new.
          </Body>
          <Body>
            Autofill is a choice, not a default. Testing showed trust in the
            held data varies by developer, so a toggle turns it on or off.
          </Body>
        </Reveal>
        <Reveal className="mt-12">
          <CaseStudyCallout stream>
            Autofill where the data is trusted, a toggle where it isn&apos;t.
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
