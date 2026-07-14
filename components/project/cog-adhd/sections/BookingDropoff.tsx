import { Container, Title, CaseStudyCallout } from "../ui";
import { Reveal } from "../Reveal";

export function BookingDropoff() {
  return (
    <section data-section="BookingDropoff" className="pt-[120px] pb-[120px] max-sm:pb-[60px]">
      <Container>
        <Reveal>
          <Title>
            Session Booking Drop-off
          </Title>
        </Reveal>
        <div className="mt-6 md:mt-8 max-w-[820px]">
          <CaseStudyCallout stream>
            Beyond the core insights, I identified a high-impact friction: users
            valued individual and flexible session booking but often forgot to
            rebook, even when they wanted to continue. This presented a clear
            opportunity for a quick, valuable fix.
          </CaseStudyCallout>
        </div>
      </Container>
    </section>
  );
}
