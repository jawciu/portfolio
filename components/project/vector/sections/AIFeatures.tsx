import { A, Container, Kicker, Title, Body, CaseStudyCallout, ShotRow } from "../ui";
import { Reveal } from "../Reveal";

export function AIFeatures() {
  return (
    <section data-section="AIFeatures" className="pt-[120px] pb-0">
      <Container>
        <Reveal>
          <Kicker>Pillar #02 · The AI</Kicker>
          <Title>
            Follow-ups, meeting actions,
            <br />
            and the morning read
          </Title>
        </Reveal>

        <Reveal className="max-w-[760px]">
          <Body>
            Vector&apos;s AI does three jobs, and every one of them ends in a draft for a
            person to judge, never an action taken on its own.
          </Body>
        </Reveal>

        <Reveal className="mt-12 max-w-[760px]">
          <p className="case-study-label mb-3">follow-ups &gt;</p>
          <Body>
            One click on a blocked or overdue task drafts a chase-up email in one of three
            tones, friendly, firmer or escalation. Each draft is grounded in the
            task&apos;s real history and carries its id in the subject line. A weekly scan
            does the same for anything that has gone stale, scoped to each task&apos;s
            owner.
          </Body>
        </Reveal>

        <ShotRow
          src={A("followup.png")}
          alt="Vector's follow-up drafter in the task drawer: three tone options, a generated subject and body, and copy controls."
          caption="Draft follow-up. Three tones, grounded in the task. Vector never sends."
          speed={24}
          className="mt-8"
        />

        <Reveal className="mt-16 max-w-[760px]">
          <p className="case-study-label mb-3">meeting → tasks &gt;</p>
          <Body>
            A call ends, and Miniti (the meeting notetaker) fires a webhook with the
            transcript. A tool-use orchestrator reads it and drafts task creates, status
            changes and reassignments, each carrying the quote it came from. It reads the
            board first, so work you already track becomes an update to the existing task
            instead of a duplicate.
          </Body>
          <Body className="mt-4">
            The webhook is my favourite technical bit. It verifies a token, dedupes on the
            meeting id, and acks in about 200ms, well inside Miniti&apos;s 10-second,
            no-retry timeout. The heavy AI extraction runs after the response, so a slow
            model can never lose a meeting.
          </Body>
        </Reveal>

        <ShotRow
          src={A("ai-drafts.png")}
          alt="Vector's review queue: meeting-sourced task drafts and follow-ups, each with approve, edit and dismiss controls."
          caption="The review queue. Meeting-sourced drafts, each with approve, edit and dismiss."
          speed={-22}
          className="mt-8"
        />

        <Reveal className="mt-16 max-w-[760px]">
          <p className="case-study-label mb-3">the overview &gt;</p>
          <Body>
            The overview runs at two altitudes. Across the whole book of business it is
            triage, a short read that names which onboardings deserve a closer look today,
            so you are not scanning ten boards to find the problem. Inside a single
            onboarding it gets granular, with a headline, focus for today and this week,
            risks, wins and nudges, every claim anchored to a real task id.
          </Body>
        </Reveal>

        <ShotRow
          src={A("insights.png")}
          alt="Vector's AI insights for one onboarding: summary, risks, wins, and a prioritised focus list, each item citing a task id."
          caption="AI insights. Every claim cites the task it came from."
          speed={26}
          className="mt-8"
        />

        <Reveal className="mt-16">
          <CaseStudyCallout stream>
            {"Everything the AI drafts lands in a review queue, never the live board. Approve it, edit it first, or reject it. A person is always the last step."}
          </CaseStudyCallout>
        </Reveal>
      </Container>
    </section>
  );
}
