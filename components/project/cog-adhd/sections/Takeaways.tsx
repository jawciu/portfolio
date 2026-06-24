import { A, Container, Kicker, Title, Body } from "../ui";

const TAKEAWAYS = [
  {
    icon: "image-41.svg",
    label: "prioritisation",
    body: "Business goals, budgets, and timelines shape decisions. We prioritised feasible solutions with the highest user value.",
  },
  {
    icon: "image-44.svg",
    label: "communication",
    body: "Clear communication and early engineer involvement ensured smooth implementation and prevented wasted effort.",
  },
  {
    icon: "image-41.svg",
    label: "iteration",
    body: "A big vision serves as a north star, but progress comes from iterating in small steps and tracking feedback.",
  },
];

export function Takeaways() {
  return (
    <section data-section="Takeaways" className="py-16 md:py-24">
      <Container>
        <Kicker>KEY TAKEAWAYS</Kicker>
        <Title className="mt-3 max-w-3xl">DESIGN IS COMPLEX AND CONTEXT-DRIVEN</Title>

        <div className="mt-12 grid grid-cols-1 gap-x-10 gap-y-12 md:mt-16 md:grid-cols-3">
          {TAKEAWAYS.map((item, i) => (
            <div key={i}>
              <div className="flex h-20 items-end">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={A(item.icon)}
                  alt=""
                  aria-hidden="true"
                  className="h-20 w-auto"
                />
              </div>
              <h3 className="cog-label mt-4 text-base font-bold lowercase text-[var(--cog-ink)]">
                {item.label}
              </h3>
              <Body className="mt-3 text-[var(--cog-ink-soft)]">{item.body}</Body>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
