import { A, Container, Title, Body } from "../ui";

const ROLES = [
  {
    icon: "image-1.svg",
    label: "research",
    alt: "Magnifying glass on a green diagonal card",
    body: "I interviewed customers, therapists, and clinic staff, carried out a competitive analysis, and analysed findings with the team.",
  },
  {
    icon: "image-35.svg",
    label: "synthesis",
    alt: "Lightbulb on a green diagonal card",
    body: "I identified friction points and improvement opportunities through affinity mapping, personas, and user journey analysis.",
  },
  {
    icon: "image-3.svg",
    label: "strategy",
    alt: "Upward arrows on a green diagonal card",
    body: "The number of opportunities identified was striking and helped me shape the long-term vision for Cog Clinic.",
  },
  {
    icon: "image-4.svg",
    label: "design",
    alt: "Orange burst on a green diagonal card",
    body: "I was responsible for designing a feasible solution to address the most urgent issue within the existing resource constraints.",
  },
];

export function MyRole() {
  return (
    <section data-section="MyRole" className="py-16 md:py-24">
      <Container>
        <Title className="mb-12 md:mb-16">MY ROLE</Title>

        <div className="grid grid-cols-1 gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
          {ROLES.map((r) => (
            <div key={r.label}>
              <div className="mb-4 h-[72px]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={A(r.icon)}
                  alt={r.alt}
                  className="h-[72px] w-auto"
                />
              </div>
              <p className="cog-label mb-3 font-bold text-[var(--cog-ink)]">
                {r.label} &gt;
              </p>
              <Body>{r.body}</Body>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
