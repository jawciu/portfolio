import { A, Container, Kicker, Title, Body } from "../ui";
import { Reveal } from "../Reveal";

const TAKEAWAYS = [
  {
    icon: "image-41.png",
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
  // pb-[120px]: this section's tinted background ends at a boundary with the cream
  // NextProject below, so its content needs bottom breathing space before that line.
  return (
    <section data-section="Takeaways" className="pt-[120px] pb-[120px] max-sm:pb-[60px] bg-[var(--cog-bg-section)]">
      <Container>
        <Reveal stagger={0.08}>
          <Kicker>KEY TAKEAWAYS</Kicker>
          <Title className="max-w-3xl">
            DESIGN IS COMPLEX
            <br />
            AND CONTEXT-DRIVEN
          </Title>
        </Reveal>

        <Reveal
          stagger={0.12}
          className="grid grid-cols-1 gap-x-10 gap-y-12 max-sm:mt-28 md:grid-cols-3"
        >
          {TAKEAWAYS.map((item, i) => (
            <div key={i}>
              {/* Mobile (1-col): icon centred; the label+body block is centred AS AN
                  ELEMENT while its text stays left-aligned (same pattern as MyRole). */}
              <div className="flex h-20 items-end max-sm:justify-center">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={A(item.icon)}
                  alt=""
                  aria-hidden="true"
                  className="h-20 w-auto"
                />
              </div>
              <div className="max-sm:mx-auto max-sm:max-w-[85%]">
                <h3 className="case-study-label mt-4">{item.label}</h3>
                <Body className="mt-3 text-[var(--cog-ink-soft)]">{item.body}</Body>
              </div>
            </div>
          ))}
        </Reveal>
      </Container>
    </section>
  );
}
