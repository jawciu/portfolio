import { Container, Kicker, Title, Body, CaseStudyCallout } from "../ui";
import { Reveal } from "../Reveal";

const NEXT = [
  [
    "linear + attio",
    "Sync issue status with Linear both ways, and pull deal context from Attio, using the same orchestrator and review queue the meeting flow already runs on.",
  ],
  [
    "evals before autonomy",
    "Every call is already logged and costed, so the next step is measuring accuracy. Proper evals over follow-ups and meeting actions, scored against what actually gets approved, edited or rejected, and fed back into better prompts. I want to know how accurate the drafts are before any of them run on their own.",
  ],
] as const;

export function WhatsNext() {
  return (
    /* pt-[100px] = the plain half of the 200px gap to Collaboration's dots above */
    <section data-section="WhatsNext" className="pt-[100px] pb-[120px]">
      <Container>
        <Reveal>
          <Kicker>What&apos;s next</Kicker>
          <Title>
            Earning the next
            <br />
            slice of trust
          </Title>
        </Reveal>

        <Reveal
          stagger={0.12}
          className="mt-14 grid grid-cols-1 gap-x-10 gap-y-10 md:grid-cols-2"
        >
          {NEXT.map(([label, body]) => (
            <div key={label}>
              <div className="mb-4 h-px w-10 bg-[var(--green)]" />
              <p className="case-study-label mb-3">{label} &gt;</p>
              <Body>{body}</Body>
            </div>
          ))}
        </Reveal>

      </Container>
    </section>
  );
}
