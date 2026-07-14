import { A, Container, Title, Body } from "../ui";
import { Reveal } from "../Reveal";

/* COMPARISON DUPLICATE #2 of MyRole (2026-07-14) — the HAIRLINE variant: icons
   redrawn in the exact visual language of Collaboration's "Working with AI"
   diagrams (uniform ~1px strokes, translucent lilac 0.45 / mint 0.4 / neutral
   rgba(241,234,241) lines, small full-opacity colour dots as the only solid
   elements). Third of the stacked comparison sections; once Caroline picks a
   winner, delete the losers (and their icon assets). */

const HATS = [
  {
    icon: "product-hairline.svg",
    label: "product",
    alt: "Hairline lightbulb icon with mint ray dots on a faint outlined card",
    body: "I conducted market research, set the ICP, scoped the product and made the feature bets.",
  },
  {
    icon: "design-system-hairline.svg",
    label: "design system",
    alt: "Hairline paint palette icon with coloured paint dots on a faint outlined card",
    body: "I created Vector's visual identity and a single source of truth for the design system.",
  },
  {
    icon: "built-hairline.svg",
    label: "architecture & build",
    alt: "Hairline plug connector icon with peach spark dots on a faint outlined card",
    body: "Agents wrote the syntax. I researched and approved every architecture and build call.",
  },
  {
    icon: "ai-orchestration-hairline.svg",
    label: "AI orchestration",
    alt: "Hairline node diagram icon with a pink junction dot on a faint outlined card",
    body: "I designed the AI layer, from grounded prompts to streaming tool use and observability.",
  },
] as const;

export function MyRoleHairline() {
  return (
    <section data-section="MyRoleHairline" className="pt-[88px] pb-0">
      <Container>
        <Reveal>
          <Title className="mb-12 md:mb-16">My role</Title>
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
