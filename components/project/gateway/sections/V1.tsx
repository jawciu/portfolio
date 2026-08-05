import { Container, Kicker, Title, Body, PlaceholderShot } from "../ui";
import { Reveal } from "../Reveal";

/* V1 — the first designs, before testing reshaped them. Deliberately static:
   Caroline picked the direction herself and hand-wireframed the main screens in
   Figma, because early backend and ops conversations go better over statics.
   TODO(caro): which V1 screens to show (single flow? first batch table?) +
   confirm the copy below. */
export function V1() {
  return (
    <section data-section="V1" className="py-24">
      <Container>
        <Reveal>
          <Kicker>v1</Kicker>
          <Title className="mb-10">First designs, deliberately static</Title>
        </Reveal>
        <Reveal className="max-w-[680px] space-y-5">
          <Body>
            {/* TODO(caro): draft: */}
            I evaluated the options, picked the direction and wireframed the
            main screens by hand in Figma. Early backend and ops conversations
            go better over a static screen, the discussion stays on the concept
            instead of the polish.
          </Body>
        </Reveal>
        <Reveal className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-2">
          <PlaceholderShot label="V1 wireframes — single handover flow (TODO)" />
          <PlaceholderShot label="V1 wireframes — batch table (TODO)" />
        </Reveal>
      </Container>
    </section>
  );
}
