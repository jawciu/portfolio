import { A, Container, Title, Body } from "../ui";
import { Reveal } from "../Reveal";

const ROLES = [
  {
    icon: "design.png",
    label: "design",
    alt: "Design icon on a lilac card",
    body: "I designed the product within E.ON Next's design system, following users' mental models to make it easy to use.",
  },
  {
    icon: "research.svg",
    label: "research",
    alt: "Research icon on a peach card",
    body: "I interviewed users across the pilots to capture their experience with the tool and surface areas of friction and improvement.",
  },
  {
    icon: "testing.png",
    label: "testing",
    alt: "Testing icon on a lilac card",
    body: "I helped to evaluate the trial, pairing user interviews with the treatment-versus-control analysis and iterated on the design based on feedback.",
  },
  {
    icon: "launch.png",
    label: "launch",
    alt: "Launch icon on a peach card",
    body: "I drove adoption for the rollout, leading design on a feature-hype video that I scripted and art-directed.",
  },
];

/* First section on the glass plate: pt-[88px] (the glass-seam exception). */
export function MyRole() {
  return (
    <section data-section="MyRole" className="pt-[88px] pb-0">
      <Container>
        <Reveal>
          <Title className="mb-12 md:mb-16">My role</Title>
        </Reveal>

        <Reveal
          stagger={0.1}
          className="grid grid-cols-1 gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-4"
        >
          {ROLES.map((r) => (
            <div key={r.label}>
              {/* Mobile (1-col): icon centred; the label+copy block is centred AS AN
                  ELEMENT (max-w + mx-auto) while its text stays left-aligned, so the
                  label and copy share a left edge. sm+ keeps the original left grid. */}
              <div className="mb-4 flex h-[72px] justify-center sm:justify-start">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={A(r.icon)} alt={r.alt} className="h-[72px] w-auto" />
              </div>
              <div className="max-sm:mx-auto max-sm:max-w-[85%]">
                <p className="case-study-label mb-3">{r.label} &gt;</p>
                <Body>{r.body}</Body>
              </div>
            </div>
          ))}
        </Reveal>
      </Container>
    </section>
  );
}
