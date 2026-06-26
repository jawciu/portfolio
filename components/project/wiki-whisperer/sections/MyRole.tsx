import { Container, Title, Body } from "../ui";
import { Reveal } from "../Reveal";

const STEPS: [string, string][] = [
  [
    "design >",
    "I designed the product within E.ON Next's design system, following users' mental models to make it easy to use..",
  ],
  [
    "research >",
    "I interviewed users across the pilots to capture their experience with the tool and surface areas of friction and improvement.",
  ],
  [
    "testing >",
    "I helped to evaluate the trial, pairing user interviews with the treatment-versus-control analysis and iterated on the design based on feedback.",
  ],
  [
    "launch >",
    "I drove adoption for the rollout, leading design on a feature-hype video that I scripted and art-directed.",
  ],
];

/* First section on the glass plate: pt-[88px] (the glass-seam exception). */
export function MyRole() {
  return (
    <section data-section="MyRole" className="pt-[88px] pb-0">
      <Container>
        <Reveal>
          <Title>My role</Title>
        </Reveal>

        <Reveal stagger={0.1} className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {STEPS.map(([label, body]) => (
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
