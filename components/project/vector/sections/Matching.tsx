import { Container, Kicker, Title, Body, CaseStudyCallout } from "../ui";
import { Reveal } from "../Reveal";

const SIGNALS = [
  [
    "attendee domains",
    "Miniti sits on the calendar, so every meeting arrives with its invite list. The strongest signal is an attendee's email domain matching a customer's.",
  ],
  [
    "contact emails",
    "Failing that, each attendee's email is looked up against the contacts of every onboarding. Slower, but precise.",
  ],
  [
    "the title",
    "Then the title is scanned for the significant words of a company name. “Acme weekly sync” matches Acme Co through “Acme”, and a stopword filter stops common words like “Co” from matching everything.",
  ],
  [
    "the transcript",
    "The last resort, for meetings titled “Untitled meeting”. The summary, topics, notes and full transcript are searched for a customer mention.",
  ],
] as const;

export function Matching() {
  return (
    <section data-section="Matching" className="pt-[120px] pb-0">
      <Container>
        <Reveal>
          <Kicker>The matching</Kicker>
          <Title>
            The right board first,
            <br />
            drafts second
          </Title>
        </Reveal>

        <Reveal className="max-w-[760px]">
          <Body>
            Before Vector drafts anything from a meeting, it has to answer a question I
            never let the model answer alone. Whose meeting was this? Deterministic code
            runs four checks, in order of trust.
          </Body>
        </Reveal>

        <Reveal
          stagger={0.1}
          className="mt-12 grid grid-cols-1 gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-4"
        >
          {SIGNALS.map(([label, body]) => (
            <div key={label}>
              <div className="mb-4 h-px w-10 bg-[var(--green)]" />
              <p className="case-study-label mb-3">{label} &gt;</p>
              <Body>{body}</Body>
            </div>
          ))}
        </Reveal>

        <Reveal className="mt-14 max-w-[760px] space-y-5">
          <Body>
            Zero candidates, or more than one, and Vector refuses to pick. The meeting
            parks in the inbox as &ldquo;Needs your input&rdquo;. You assign the onboarding
            with one click, and only then does the drafting run.
          </Body>
          <Body>
            Drafting itself is a two-pass job. Pass one only extracts facts from the
            transcript, the commitments, reported completions and decisions. Pass two is
            handed the board&apos;s open tasks alongside those facts, and its most
            important rule is to match before it creates. A commitment that maps to a task
            you already track becomes an update to it, a reported completion becomes a
            status change, and only genuinely new work becomes a new task.
          </Body>
        </Reveal>

        <Reveal className="mt-14 max-w-[860px]">
          <CaseStudyCallout stream>
            {"Vector never guesses whose meeting it was. The matching is deterministic code, and when the evidence is thin, the meeting waits for a human to point at the right board."}
          </CaseStudyCallout>
        </Reveal>
      </Container>
    </section>
  );
}
