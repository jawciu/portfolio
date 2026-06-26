import { A, Container, Kicker, Title, Body, CaseStudyCallout } from "../ui";
import { Reveal } from "../Reveal";

const REST = [
  "The earlier tools did not solve it. Wiki Whisperer V1, the first AI attempt, launched to excitement then quicklylost trust.",
  "It returned too many dead ends and forced specialists to phrase prompts in exactly the right way.",
];

export function Problem() {
  return (
    <section data-section="Problem" className="pt-[120px] pb-0">
      <Container>
        <Reveal>
          <Kicker>Problem space</Kicker>
          <Title>Cognitive overload, no reliable fallback</Title>
        </Reveal>

        {/* intro line — full width */}
        <Reveal className="max-w-[820px]">
          <Body>
            Energy specialists (support call centre agents at E.ON Next) need to handle any query across hundreds of processes, protocols and tools that never
            stop changing. Recalling the right answer, especially with a customer on the line is genuinely hard, so the cognitive load is constant.
          </Body>
        </Reveal>
        {/* two columns: product screenshot left, the rest of the copy right */}
        <Reveal
          stagger={0.12}
          className="mt-12 grid items-center gap-10 md:grid-cols-2 md:gap-14"
        >
          <div className="rounded-[20px] border border-[#E3E2DA] bg-white p-6 shadow-[1px_1px_10px_2px_rgba(212,210,210,0.25)]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={A("problem-chat.png")}
              alt="Wiki Whisperer V2 answering a back-billing question with linked source articles"
              className="block w-full"
            />
          </div>
          <div className="flex flex-col gap-5">
            {REST.map((line, i) => (
              <Body key={i}>{line}</Body>
            ))}
          </div>
        </Reveal>
        <Reveal className="mt-12 max-w-[820px]">
          <CaseStudyCallout stream>
          Specialists fell back on the fastest thing they knew, asking a colleague. <br />
          My goal was to design a tool they would reach for first.
          </CaseStudyCallout>
        </Reveal>
      </Container>
    </section>
  );
}
