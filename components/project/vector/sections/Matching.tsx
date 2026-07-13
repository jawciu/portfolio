import { Container, Kicker, Title, Body, InsightCard } from "../ui";
import { Reveal } from "../Reveal";

/* The matching — the four signals Vector checks, in order of trust, before it drafts
   anything from a meeting. The heading asks the question; the cards answer it. */

const SIGNALS = [
  [
    "signal #01",
    "Attendee domains",
    "Miniti sits on the calendar, so every meeting arrives with its invite list. The strongest signal is an attendee's email domain matching a customer's.",
  ],
  [
    "signal #02",
    "Contact emails",
    "Failing that, each attendee's email is looked up against the contacts of every onboarding. Slower, but precise.",
  ],
  [
    "signal #03",
    "The title",
    "Then the title is scanned for the significant words of a company name. “Acme weekly sync” matches Acme Co through “Acme”, and a stopword filter stops common words like “Co” from matching everything.",
  ],
  [
    "signal #04",
    "The transcript",
    "The last resort, for meetings titled “Untitled meeting”. The summary, topics, notes and full transcript are searched for a customer mention.",
  ],
] as const;

export function Matching() {
  return (
    <section data-section="Matching" className="pt-[120px] pb-0">
      <Container>
        <Reveal>
          <Kicker>The matching</Kicker>
          <Title>Whose meeting was this?</Title>
        </Reveal>

        <Reveal
          stagger={0.1}
          className="mx-auto grid max-w-[900px] auto-rows-fr gap-9 md:grid-cols-2"
        >
          {SIGNALS.map(([label, title, body]) => (
            <InsightCard key={label} label={label} title={title} width="auto" height="auto">
              {body}
            </InsightCard>
          ))}
        </Reveal>

        {/* What happens when the signals DON'T settle it — copy left, and the
            ambiguous-meeting asset (incoming from Caroline) will sit alongside. */}
        <Reveal className="mt-16 grid grid-cols-1 items-center gap-10 md:grid-cols-2">
          <Body>
            Zero candidates, or more than one, and Vector refuses to pick. The meeting
            parks in the inbox as &ldquo;Needs your input&rdquo;, a person assigns the
            onboarding in one click, and only then does the drafting run.
          </Body>
          {/* ASSET SLOT — drop the "Needs your input" ambiguous-matching shot here:
              <Shot src={A("matching-v2.png")} alt="…" bare /> (add to SHOT_DIMS). */}
          <div aria-hidden className="hidden min-h-[220px] md:block" />
        </Reveal>
      </Container>
    </section>
  );
}
