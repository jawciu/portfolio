import { A, Container, Kicker, Title, Body } from "../ui";
import { Reveal } from "../Reveal";

export function WhatsNext() {
  // pb-[120px]: this section sits directly above the tinted NextProject band, so it
  // needs bottom breathing space before the background-colour boundary.
  return (
    <section data-section="WhatsNext" className="pt-[120px] pb-[120px]">
      <Container>
        <Reveal>
          <Kicker>What&apos;s next</Kicker>
          <Title>
            Account specific information
            <br />
            and image support
          </Title>
        </Reveal>

        {/* illustration left, copy right (tight gap) */}
        <Reveal stagger={0.1} className="mt-14 grid items-center gap-8 lg:grid-cols-[auto_1fr] lg:gap-12">
          <div className="flex justify-center lg:justify-start">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={A("impact.svg")}
              alt="Onboarding ramp illustration"
              className="h-auto w-[255px] max-w-full"
            />
          </div>
          <div className="max-w-[480px]">
            <Body>
              Next are the bigger improvements flagged in the research: a Kraken integration
              for account-specific answers, and image support.
            </Body>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
