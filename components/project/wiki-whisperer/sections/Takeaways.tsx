import { Container, Kicker, Title, Body } from "../ui";
import { Reveal } from "../Reveal";

const TAKEAWAYS: [string, string][] = [
  [
    "trust is a design problem >",
    "Adoption did not hinge on the model. It hinged on whether a specialist could believe and act on the answer, which is structure, sources and the right perspective.",
  ],
  [
    "measure honestly >",
    "Comparing against a real control, and saying plainly what is not yet proven, is what makes the wins credible.",
  ],
  [
    "adoption is the real metric >",
    "A great answer no one reaches for changes nothing, so I designed for the behaviour, not just the feature.",
  ],
];

export function Takeaways() {
  return (
    <section data-section="Takeaways" className="pt-[120px] pb-0">
      <Container>
        <Reveal>
          <Kicker>Key takeaways</Kicker>
          <Title>Designing trust into AI products</Title>
        </Reveal>

        <Reveal stagger={0.12} className="grid gap-8 md:grid-cols-3">
          {TAKEAWAYS.map(([label, body]) => (
            <div key={label} className="border-t-2 border-[var(--green)] pt-4">
              <p className="case-study-label">{label}</p>
              <Body className="mt-3">{body}</Body>
            </div>
          ))}
        </Reveal>
      </Container>
    </section>
  );
}
