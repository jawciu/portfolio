import { Container, Kicker, Title, CaseStudyCallout, Stats } from "../ui";
import { Reveal } from "../Reveal";

const SCOPE = [
  { n: "2", caption: <>separate<br />user pilots</> },
  { n: "14", caption: <>control and<br />variant teams</> },
  { n: "12", caption: <>weeks of<br />testing</> },
];

export function Measuring() {
  return (
    <section data-section="Measuring" className="pt-[120px] pb-0">
      <Container>
        <Reveal>
          <Kicker>User pilots</Kicker>
          <Title>Understanding the tool&apos;s <br /> real effect</Title>
        </Reveal>

        {/* pilot scope — centred big numbers (shared Stats component) */}
        <Stats className="mt-14" items={SCOPE} />

        {/* the honest, harder read — in the callout */}
        <Reveal className="mx-auto mt-16 max-w-[860px]">
          <CaseStudyCallout stream>
            Our data scientist compared treatment teams against matched control teams to
            isolate the tool&apos;s effects while I led the qualitative side, interviewing
            specialists about their experiences.
          </CaseStudyCallout>
        </Reveal>
      </Container>
    </section>
  );
}
