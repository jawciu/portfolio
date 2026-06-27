import { Container, Kicker, Title, CaseStudyCallout } from "../ui";
import { Reveal } from "../Reveal";

const SCOPE: { n: string; l1: string; l2: string }[] = [
  { n: "2", l1: "separate", l2: "user pilots" },
  { n: "14", l1: "control and", l2: "variant teams" },
  { n: "12", l1: "weeks of", l2: "testing" },
];

export function Measuring() {
  return (
    <section data-section="Measuring" className="pt-[120px] pb-0">
      <Container>
        <Reveal>
          <Kicker>User pilots</Kicker>
          <Title>Understanding the tool&apos;s <br /> real effect</Title>
        </Reveal>

        {/* pilot scope — centred big numbers (Geist ExtraBold) */}
        <Reveal
          stagger={0.1}
          className="mx-auto mt-14 flex max-w-[680px] justify-center gap-4 sm:gap-10"
        >
          {SCOPE.map((s) => (
            <div key={s.l2} className="flex flex-1 flex-col items-center text-center">
              <p className="font-[family-name:var(--font-body)] text-[44px] font-extrabold leading-none text-[#b52fa5] md:text-[66px]">
                {s.n}
              </p>
              <p className="case-study-body-md mt-3">
                {s.l1}
                <br />
                {s.l2}
              </p>
            </div>
          ))}
        </Reveal>

        {/* the honest, harder read — in the callout */}
        <Reveal className="mx-auto mt-16 max-w-[860px]">
          <CaseStudyCallout stream>
            Our data scientist compared treatment teams against matched control teams to
            isolate the tool&apos;s effects while I lead the qualitative side, interviewing
            specialists about their experiences.
          </CaseStudyCallout>
        </Reveal>
      </Container>
    </section>
  );
}
