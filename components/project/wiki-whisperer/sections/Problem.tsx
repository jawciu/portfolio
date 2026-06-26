import { Container, Kicker, Title, Body } from "../ui";
import { Reveal } from "../Reveal";

const LINES = [
  "Energy specialists are generalists. They handle any query, from billing to meter exchanges, across hundreds of processes, protocols and tools that never stop changing.",
  "Recalling the right answer with a customer on the line is genuinely hard, so the cognitive load is constant.",
  "The earlier tools did not solve it. Knowledge Owl was keyword search into documents, and Wiki Whisperer V1, the first AI attempt, launched to excitement then lost trust: it returned too many dead ends and forced specialists to phrase prompts in exactly the right way.",
  "The idea was right but the build could not deliver, and V1 ended its run with a 25% negative-feedback rate.",
  "So specialists fell back on the fastest thing they knew, interrupting a colleague. My goal was to design a tool they would reach for first.",
];

export function Problem() {
  return (
    <section data-section="Problem" className="pt-[120px] pb-0">
      <Container>
        <Reveal>
          <Kicker>Problem space</Kicker>
          <Title>A powerful tool no one trusted</Title>
        </Reveal>

        <Reveal stagger={0.1} className="flex max-w-[760px] flex-col gap-5">
          {LINES.map((line, i) => (
            <Body key={i}>{line}</Body>
          ))}
        </Reveal>
      </Container>
    </section>
  );
}
