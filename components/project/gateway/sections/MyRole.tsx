import { Container, Title, Body } from "../ui";
import { Reveal } from "../Reveal";

/* Mirrors wiki-whisperer MyRole (icon cards). Icons TODO — text-only until then.
   The step-up story (inherited an orphaned project, foreign domain) lives in
   the hero's setting-the-stage block, NOT here. Copy confirmed by Caroline
   2026-08-05. */
const ROLES = [
  {
    label: "research",
    body: "I interviewed housing developers and internal ops teams, synthesised the existing Miro board research, and ran two rounds of testing.",
  },
  {
    label: "design",
    body: "I designed the end-to-end UX and UI flows within E.ON Next's design system, expanding it where the product needed new patterns.",
  },
  {
    label: "prototyping",
    body: "I wireframed the main screens for stakeholder alignment, then used AI to build a functioning prototype for user testing.",
  },
  {
    label: "delivery",
    body: "I wrote the specs and documentation, and collaborate continuously with the engineering team that's building Gateway now.",
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
              <p className="case-study-label mb-3">{r.label} &gt;</p>
              <Body>{r.body}</Body>
            </div>
          ))}
        </Reveal>
      </Container>
    </section>
  );
}
