import { A, Container, Kicker, Title, Body } from "../ui";

const TAKEAWAYS = [
  {
    icon: "image-41.svg",
    label: "prioritisation",
    body: "Business goals, budgets, and timelines shape decisions. We prioritised feasible solutions with the highest user value.",
  },
  {
    icon: "image-42.png",
    label: "communication",
    body: "Clear communication and early engineer involvement ensured smooth implementation and prevented wasted effort.",
  },
  {
    icon: "image-43.png",
    label: "iteration",
    body: "A big vision serves as a north star, but progress comes from iterating in small steps and tracking feedback.",
  },
];

export function Takeaways() {
  return (
    <section data-section="Takeaways" className="pt-[120px] pb-0 bg-[var(--cog-bg-section)]">
      <Container>
        <Kicker>KEY TAKEAWAYS</Kicker>
        <Title className="max-w-3xl">
          DESIGN IS COMPLEX
          <br />
          AND CONTEXT-DRIVEN
        </Title>

        <div className="grid grid-cols-1 gap-x-10 gap-y-12 md:grid-cols-3">
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
              <h3 className="case-study-label mt-4">{item.label}</h3>
              <Body className="mt-3 text-[var(--cog-ink-soft)]">{item.body}</Body>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
