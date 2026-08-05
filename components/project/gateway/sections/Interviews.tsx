import { Container, Kicker, Title, Body, CaseStudyCallout, InsightCard } from "../ui";
import { Reveal } from "../Reveal";

/* Research: who Caroline interviewed (three groups, mirrors cog's Interviews
   persona cards) and what the interviews found. Facts from Caroline 2026-08-05.
   Each insight pays off later: rhythms -> HandoverFlow/BulkUpload, forgotten
   handovers in email -> the Hub, financial access -> Roles. (The autofill
   finding came from TESTING, not research — it lives in Testing.tsx.)
   TODO: cog-style mascot illustrations for the three cards. */

const GROUPS = [
  {
    label: "smaller developers",
    body: "Hand over plot by plot, submitting each one as soon as the property is sold.",
  },
  {
    label: "bigger developers",
    body: "Compile handovers in a spreadsheet as they go, then process them in weekly batches.",
  },
  {
    label: "internal ops",
    body: "The E.ON Next operations teams that receive and process every handover.",
  },
];

const INSIGHTS = [
  {
    label: "insight 01",
    title: "One process, two rhythms",
    body: "Smaller developers hand over the moment a plot sells. Bigger developers batch theirs weekly through a spreadsheet. One rigid flow was never going to fit both.",
  },
  {
    label: "insight 02",
    title: "Forgotten handovers, buried in email",
    body: "With no centralised space to track a handover's state, developers lost sight of the ones still waiting on information from them. Everything ran over email, inboxes flooded, and handovers slipped further behind.",
  },
  {
    label: "insight 03",
    title: "Not everyone can see the financials",
    body: "In bigger firms, the people who process handovers often must not have access to financial data. Gateway handles a lot of developer invoicing, so access had to be designed in.",
  },
];

export function Interviews() {
  return (
    <section data-section="Interviews" className="py-24">
      <Container>
        <Reveal>
          <Kicker>research</Kicker>
          <Title className="mb-10">Every developer hands over differently</Title>
        </Reveal>
        <Reveal className="max-w-[680px] space-y-5">
          <Body>
            I interviewed property developers at both ends of the scale, and met
            repeatedly with the internal teams that process what they send.
          </Body>
        </Reveal>

        {/* three interviewee cards — cog persona-card pattern, mascots TODO */}
        <Reveal
          stagger={0.12}
          className="mt-12 flex flex-col items-center gap-8 sm:flex-row sm:items-stretch sm:justify-center sm:gap-12"
        >
          {GROUPS.map((g) => (
            <div
              key={g.label}
              className="w-full max-w-[260px] rounded-xl border border-[var(--cog-line)] bg-[var(--cog-card)] p-6"
            >
              <p className="case-study-label">{g.label}</p>
              <Body className="mt-3">{g.body}</Body>
            </div>
          ))}
        </Reveal>

        <Reveal className="mt-12">
          <CaseStudyCallout stream>
            My goal was to understand how each group actually processes a
            handover, so Gateway could fit the way they already work.
          </CaseStudyCallout>
        </Reveal>

        <Reveal
          stagger={0.1}
          className="mt-12 grid grid-cols-1 justify-items-center gap-8 md:grid-cols-3"
        >
          {INSIGHTS.map((i) => (
            <InsightCard
              key={i.label}
              width="auto"
              height="auto"
              label={i.label}
              title={i.title}
            >
              {i.body}
            </InsightCard>
          ))}
        </Reveal>
      </Container>
    </section>
  );
}
