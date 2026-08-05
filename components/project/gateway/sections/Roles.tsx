import { Container, Kicker, Title, Body, PlaceholderShot } from "../ui";
import { Reveal } from "../Reveal";

/* Product block 4 — access roles: some submitters must not see financials.
   One paragraph, one screen; signals designing for organisations. */
export function Roles() {
  return (
    <section data-section="Roles" className="py-24">
      <Container>
        <Reveal>
          <Kicker>the product · 04</Kicker>
          <Title className="mb-10">Roles and access</Title>
        </Reveal>
        <Reveal className="max-w-[680px] space-y-5">
          <Body>
            {/* TODO(caro): draft: */}
            Not everyone submitting a handover should see the financials. Access
            roles shape what each person sees, so a developer&apos;s whole team can
            work in Gateway without exposing what shouldn&apos;t travel.
          </Body>
        </Reveal>
        <Reveal className="mt-12">
          <PlaceholderShot label="role-gated view (TODO)" ratio="16/7" />
        </Reveal>
      </Container>
    </section>
  );
}
