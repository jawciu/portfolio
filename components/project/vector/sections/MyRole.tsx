import { A, Container, Kicker, Title, Body } from "../ui";
import { Reveal } from "../Reveal";

const HATS = [
  {
    icon: "product.svg",
    label: "product",
    alt: "Lightbulb icon on a lilac card",
    body: "I conducted market research, set the ICP, scoped the product and made the feature bets.",
  },
  {
    icon: "design-system.png",
    label: "design system",
    alt: "Paint palette icon on a pink card",
    body: "I created Vector's visual identity and a single source of truth for the design system.",
  },
  {
    icon: "built.svg",
    label: "architecture & build",
    alt: "Plug connector icon on a lilac card",
    body: "Agents wrote the syntax. I researched and approved every architecture and build call.",
  },
  {
    icon: "ai-orchestration.png",
    label: "AI orchestration",
    alt: "Node diagram icon on a pink card",
    body: "I designed the AI layer, from grounded prompts to streaming tool use and observability.",
  },
] as const;

export function MyRole() {
  return (
    <section data-section="MyRole" className="pt-[120px] pb-0">
      <Container>
        <Reveal>
          <Kicker>My role</Kicker>
          <Title>
            One designer + AI agents
            <br />
            = the whole stack
          </Title>
        </Reveal>

        <Reveal
          stagger={0.1}
          className="grid grid-cols-1 gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-4"
        >
          {HATS.map((h) => (
            <div key={h.label}>
              {/* Mobile (1-col): icon centred; the label+copy block is centred AS AN
                  ELEMENT (max-w + mx-auto) while its text stays left-aligned, so the
                  label and copy share a left edge. sm+ keeps the original left grid. */}
              <div className="mb-4 flex h-[72px] justify-center sm:justify-start">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={A(h.icon)} alt={h.alt} className="h-[72px] w-auto" />
              </div>
              <div className="max-sm:mx-auto max-sm:max-w-[85%]">
                <p className="case-study-label mb-3">{h.label} &gt;</p>
                <Body>{h.body}</Body>
              </div>
            </div>
          ))}
        </Reveal>
      </Container>
    </section>
  );
}
