import { Container, Kicker, Title, Body } from "../ui";
import { Reveal } from "../Reveal";

export function Measuring() {
  return (
    <section data-section="Measuring" className="pt-[120px] pb-0">
      <Container>
        <Reveal>
          <Kicker>Measuring honestly</Kicker>
          <Title>Isolating the tool&apos;s real effect</Title>
        </Reveal>

        <Reveal stagger={0.1} className="flex max-w-[760px] flex-col gap-5">
          <Body>
            I did not want a flattering number, so the trial was measured carefully and
            two ways.
          </Body>
          <Body>
            Our data scientist compared treatment teams against matched control teams to
            isolate the tool&apos;s real effect, rather than comparing heavy and light
            users, where the keenest adopters can skew the picture. I ran the qualitative
            side, interviewing specialists about what had actually changed.
          </Body>
          <Body>
            It is the honest, harder read, and it set a clean baseline for what to scale
            next.
          </Body>
        </Reveal>
      </Container>
    </section>
  );
}
