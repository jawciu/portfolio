import { Container, Kicker, Title, Body, InsightCard } from "../ui";
import { Reveal } from "../Reveal";

/* Testing — what two rounds of testing surfaced (Caroline's facts, 2026-08-05).
   The autofill finding MOVED here from the research insights (it came from
   testing, her correction). The product answers follow in the product blocks:
   finding 01 -> the toggle in HandoverFlow, finding 02 -> the interim upload
   in BulkUpload. TODO(caro): who was in each round + an AI-built functioning
   prototype was the test vehicle — confirm and say so here? */

const FINDINGS = [
  {
    label: "finding 01",
    title: "Autofill divides the room",
    body: "Smaller developers loved the idea of prefilling from data E.ON Next already holds. Bigger developers pushed back, in their experience the held data is often wrong.",
  },
  {
    label: "finding 02",
    title: "Digitising yes, but not overnight",
    body: "Bigger developers welcomed digitising the process, but warned that some of their people would really struggle with the change, and forcing it straight away could go badly.",
  },
];

export function Testing() {
  return (
    <section data-section="Testing" className="py-24">
      <Container>
        <Reveal>
          <Kicker>testing</Kicker>
          <Title className="mb-10">Two rounds of testing changed the design</Title>
        </Reveal>
        <Reveal className="max-w-[680px] space-y-5">
          <Body>
            {/* TODO(caro): confirm the setup (who, how many, prototype used). Draft: */}
            I took the V1 designs through two rounds of testing with developers
            on both ends of the scale.
          </Body>
        </Reveal>
        <Reveal
          stagger={0.1}
          className="mt-12 grid grid-cols-1 justify-items-center gap-8 md:grid-cols-2"
        >
          {FINDINGS.map((f) => (
            <InsightCard
              key={f.label}
              width="auto"
              height="auto"
              label={f.label}
              title={f.title}
            >
              {f.body}
            </InsightCard>
          ))}
        </Reveal>
        <Reveal className="mt-12 max-w-[680px]">
          <Body>
            Both findings reshaped what shipped. Autofill became a choice, and
            bulk handovers grew an interim path for the teams not ready to
            change.
          </Body>
        </Reveal>
      </Container>
    </section>
  );
}
