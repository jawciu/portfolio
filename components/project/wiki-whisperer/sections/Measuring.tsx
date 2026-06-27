import { Container, Kicker, Title, Body } from "../ui";
import { Reveal } from "../Reveal";

const SCOPE: { n: string; caption: string }[] = [
  { n: "2", caption: "user pilots" },
  { n: "14", caption: "control and variant teams" },
  { n: "12", caption: "weeks of testing" },
];

export function Measuring() {
  return (
    <section data-section="Measuring" className="pt-[120px] pb-0">
      <Container>
        <Reveal>
          <Kicker>User pilots</Kicker>
          <Title>Isolating the tool&apos;s real effect</Title>
        </Reveal>

        {/* pilot scope — the setup, up front */}
        <Reveal
          stagger={0.1}
          className="mt-12 grid max-w-[760px] gap-x-8 gap-y-10 sm:grid-cols-3"
        >
          {SCOPE.map((s) => (
            <div key={s.caption}>
              <p className="font-[family-name:var(--font-hero)] text-5xl leading-none text-[var(--green)] md:text-6xl">
                {s.n}
              </p>
              <p className="case-study-body-md mt-3">{s.caption}</p>
            </div>
          ))}
        </Reveal>

        {/* how it was measured — the honest, harder read */}
        <Reveal stagger={0.1} className="mt-14 flex max-w-[760px] flex-col gap-5">
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
