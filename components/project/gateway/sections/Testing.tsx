import { Container, Kicker, Title, Body, InsightCard } from "../ui";
import { Reveal } from "../Reveal";

/* Testing — what two rounds of testing surfaced (Caroline's facts, 2026-08-05).
   The autofill finding MOVED here from the research insights (it came from
   testing, her correction). The product answers follow in the product blocks:
   finding 01 -> the toggle in HandoverFlow, finding 02 -> the interim upload
   in BulkUpload. TODO(caro): who was in each round + an AI-built functioning
   prototype was the test vehicle — confirm and say so here? */

const FINDINGS = [
  {
    label: "finding 01",
    title: "Autofill divides the room",
    body: "Smaller developers loved the idea of prefilling from data E.ON Next already holds. Bigger developers pushed back, in their experience the held data is often wrong.",
  },
  {
    label: "finding 02",
    title: "Digitising yes, but not overnight",
    body: "Bigger developers welcomed digitising the process, but warned that some of their people would really struggle with the change, and forcing it straight away could go badly.",
  },
  {
    label: "finding 03",
    title: "The words needed work",
    body: "Testers were confused by statuses like To-Do versus Needs Completing, and feared losing work without a clear autosave cue. I renamed the status to Partially Done, scrapped the To-Do button and added Save and Continue.",
  },
];

/* Verbatim tester quotes from Caroline's records (2026-08-06), anonymised to
   roles per the portfolio convention. */
const QUOTES = [
  {
    text: "The Excel spreadsheet is very clunky to use, it feels outdated. This just feels like a much smoother, easier way of doing it.",
    who: "@Housing developer, user testing",
  },
  {
    text: "The fact that it would flag it up at this stage means you can query it before we even complete the handover, rather than going through potentially weeks and months of trying to sort out any mismatched data.",
    who: "@Housing developer, user testing",
  },
];

export function Testing() {
  return (
    <section data-section="Testing" className="py-24">
      <Container>
        <Reveal>
          <Kicker>testing</Kicker>
          <Title className="mb-10">Two rounds of testing changed the design</Title>
        </Reveal>
        <Reveal className="max-w-[680px] space-y-5">
          <Body>
            {/* TODO(caro): confirm the setup (who, how many, prototype used). Draft: */}
            I took the V1 designs through two rounds of testing with developers
            on both ends of the scale.
          </Body>
        </Reveal>
        <Reveal
          stagger={0.1}
          className="mt-12 grid grid-cols-1 justify-items-center gap-8 md:grid-cols-3"
        >
          {FINDINGS.map((f) => (
            <InsightCard
              key={f.label}
              width="auto"
              height="auto"
              label={f.label}
              title={f.title}
            >
              {f.body}
            </InsightCard>
          ))}
        </Reveal>
        <Reveal stagger={0.1} className="mt-12 max-w-[680px] space-y-8">
          {QUOTES.map((q) => (
            <figure key={q.who + q.text.slice(0, 16)}>
              <blockquote className="case-study-quote">
                &ldquo;{q.text}&rdquo;
              </blockquote>
              <figcaption className="mt-2 text-[14px] text-[var(--cog-muted)]">
                {q.who}
              </figcaption>
            </figure>
          ))}
        </Reveal>
        <Reveal className="mt-12 max-w-[680px]">
          <Body>
            The findings reshaped what shipped. Autofill became a choice, the
            words got plainer, and bulk handovers grew an interim path for the
            teams not ready to change.
          </Body>
        </Reveal>
      </Container>
    </section>
  );
}
