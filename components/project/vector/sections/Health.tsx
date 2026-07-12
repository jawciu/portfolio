import { A, Container, Kicker, Title, Body, CaseStudyCallout, InsightCard, ShotRow } from "../ui";
import { Reveal } from "../Reveal";

const STATES = [
  [
    "on track",
    "None of the above",
    "No blockers, nothing meaningfully overdue, and the current pace clears the go-live date. This is where most onboardings should sit.",
  ],
  [
    "at risk",
    "Overdue, blocked or behind pace",
    "Any blocked task, a task a week overdue, three tasks overdue, or a pace problem, where the remaining work divided by the observed completion rate overruns the go-live date.",
  ],
  [
    "blocked",
    "A third of the work is stuck",
    "When 30% or more of the tasks are blocked, the whole onboarding is Blocked. A single stuck task can wait for a nudge, but a stuck third means the project itself has stalled.",
  ],
] as const;

export function Health() {
  return (
    <section data-section="Health" className="pt-[120px] pb-0">
      <Container>
        <Reveal>
          <Kicker>Pillar #03 · Predictive health</Kicker>
          <Title>
            On track, at risk or blocked,
            <br />
            with the reasons attached
          </Title>
        </Reveal>

        <Reveal className="max-w-[760px]">
          <Body>
            Every onboarding is scored On track, At risk or Blocked. The score is pure
            deterministic JavaScript reading real task data, with no AI involved, and the
            same input always gives the same answer. The AI reasons over the score, but it
            never produces it.
          </Body>
        </Reveal>

        <Reveal
          stagger={0.12}
          className="mt-14 grid auto-rows-fr gap-9 md:grid-cols-3"
        >
          {STATES.map(([label, title, body]) => (
            <InsightCard key={label} label={label} title={title} width="auto" height="auto">
              {body}
            </InsightCard>
          ))}
        </Reveal>

        <ShotRow
          src={A("workspace.png")}
          alt="Vector's workspace dashboard: every onboarding scored On track, At risk or Blocked, with a portfolio summary and per-account risk reasons."
          caption="The workspace. Every onboarding scored, its reasons in the risk panel."
          speed={24}
          className="mt-16"
        />

        <Reveal className="mt-16">
          <CaseStudyCallout stream>
            {"Every flag arrives with its evidence. 3 of 9 tasks blocked, 8 tasks overdue, customer dark for 64 days. When you can see why the flag was raised, you can act on it."}
          </CaseStudyCallout>
        </Reveal>
      </Container>
    </section>
  );
}
