import { Container, Title, Statement } from "../ui";

export function BookingDropoff() {
  return (
    <section data-section="BookingDropoff" className="py-16 md:py-24">
      <Container>
        <Title className="text-[clamp(1.25rem,1rem+1vw,1.6rem)]">
          Session Booking Drop-off
        </Title>
        <div className="mt-6 md:mt-8 max-w-[820px]">
          <Statement>
            Beyond the core insights, I identified a high-impact friction: users
            valued individual and flexible session booking but often forgot to
            rebook, even when they wanted to continue. This presented a clear
            opportunity for a quick, valuable fix.
          </Statement>
        </div>
      </Container>
    </section>
  );
}
