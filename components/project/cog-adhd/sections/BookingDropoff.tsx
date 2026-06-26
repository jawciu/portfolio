import { Container, Title, CaseStudyCallout } from "../ui";

export function BookingDropoff() {
  return (
    <section data-section="BookingDropoff" className="pt-[120px] pb-[120px]">
      <Container>
        <Title>
          Session Booking Drop-off
        </Title>
        <div className="mt-6 md:mt-8 max-w-[820px]">
          <CaseStudyCallout>
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
