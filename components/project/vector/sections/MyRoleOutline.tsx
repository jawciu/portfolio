import { A, Container, Title, Body } from "../ui";
import { Reveal } from "../Reveal";

/* COMPARISON DUPLICATE of MyRole (2026-07-14) — same layout/copy, but the hat
   icons are the new OUTLINE redraws in the Vector palette (lilac card / glyph /
   mint + peach accents) instead of the filled light-study style. Mounted right
   under MyRole so Caroline can compare the two side by side; once she picks a
   winner, delete the losing section (and its icon assets). */

const HATS = [
  {
    icon: "product-outline.svg",
    label: "product",
    alt: "Outline lightbulb icon on a lilac outlined card",
    body: "I conducted market research, set the ICP, scoped the product and made the feature bets.",
  },
  {
    icon: "design-system-outline.svg",
    label: "design system",
    alt: "Outline paint palette icon on a peach outlined card",
    body: "I created Vector's visual identity and a single source of truth for the design system.",
  },
  {
    icon: "built-outline.svg",
    label: "architecture & build",
    alt: "Outline plug connector icon on a lilac outlined card",
    body: "Agents wrote the syntax. I researched and approved every architecture and build call.",
  },
  {
    icon: "ai-orchestration-outline.svg",
    label: "AI orchestration",
    alt: "Outline node diagram icon on a peach outlined card",
    body: "I designed the AI layer, from grounded prompts to streaming tool use and observability.",
  },
] as const;

export function MyRoleOutline() {
  return (
    <section data-section="MyRoleOutline" className="pt-[88px] pb-0">
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
