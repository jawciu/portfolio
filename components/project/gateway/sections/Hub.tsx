import { Container, Kicker, Title, Body, PlaceholderShot } from "../ui";
import { Reveal } from "../Reveal";

/* Product block 2 — the Handovers Hub: every handover's status in one place. */
export function Hub() {
  return (
    <section data-section="Hub" className="py-24">
      <Container>
        <Reveal>
          <Kicker>the product · 02</Kicker>
          <Title className="mb-10">The Handovers Hub</Title>
        </Reveal>
        <Reveal className="max-w-[680px] space-y-5">
          <Body>
            {/* TODO(caro): draft — sharpen with the real status model: */}
            Every handover and its status, visible in one place. When developers
            can see where things stand, they stop chasing, and operations stop
            answering the same question by email.
          </Body>
        </Reveal>
        <Reveal className="mt-12">
          <PlaceholderShot label="Handovers Hub — statuses (TODO)" />
        </Reveal>
      </Container>
    </section>
  );
}
