import { Container, Kicker, Title, Body, CaseStudyCallout } from "../ui";
import { Reveal } from "../Reveal";

const FEATURES: [string, string][] = [
  [
    "conversational, not rigid >",
    "Multi-turn, natural dialogue replaced exact-phrase prompting, so specialists can untangle complex, layered cases in real time.",
  ],
  [
    "familiar by design >",
    "I patterned the interface on tools specialists already know, like ChatGPT and Gemini, so V2 added no new mental model, wrapped in E.ON Next's look and design system.",
  ],
  [
    "structured and sourced >",
    "Long paragraphs became scannable sections, bullets and step-by-step guides, each linked to its source so specialists can trust what they read.",
  ],
  [
    "creative on demand >",
    "Beyond answers, specialists can ask for tables, learning documents and more, using the Wiki in ways V1 never allowed.",
  ],
];

export function Redesign() {
  return (
    <section data-section="Redesign" className="pt-[120px] pb-0">
      <Container>
        <Reveal>
          <Kicker>The redesign</Kicker>
          <Title>From rigid prompts to fluid dialogue</Title>
        </Reveal>

        <Reveal className="max-w-[760px]">
          <Body>
            V2 had to undo V1&apos;s scars. I designed for trust and low effort first, so
            an answer is fast to believe and easy to act on while still talking to a
            customer.
          </Body>
        </Reveal>

        <Reveal stagger={0.12} className="mt-12 grid gap-8 md:grid-cols-2">
          {FEATURES.map(([label, body]) => (
            <div key={label}>
              <p className="case-study-label">{label}</p>
              <Body className="mt-2">{body}</Body>
            </div>
          ))}
        </Reveal>

        {/* product visual — placeholder until the Figma screens land */}
        <Reveal className="mt-14 flex h-[360px] w-full items-center justify-center rounded-2xl border border-dashed border-[var(--cog-line)] bg-[var(--cog-bg-alt)]">
          <span className="case-study-label text-[var(--cog-muted)]">
            v2 answer layout (structured + sourced)
          </span>
        </Reveal>

        <Reveal className="mt-12 max-w-[860px]">
          <CaseStudyCallout stream>
            An answer is only useful if the specialist trusts it enough to say it out loud. So I designed for trust before anything else.
          </CaseStudyCallout>
        </Reveal>
      </Container>
    </section>
  );
}
