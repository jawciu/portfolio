import { A, Container, Kicker, Title, Body, CaseStudyCallout, InsightCard } from "../ui";
import { Reveal } from "../Reveal";

/* Research: who Caroline interviewed (three groups, mirrors cog's Interviews
   persona cards) and what the interviews found. Facts from Caroline 2026-08-05.
   Each insight pays off later: rhythms -> HandoverFlow/BulkUpload, forgotten
   handovers in email -> the Hub, financial access -> Roles. (The autofill
   finding came from TESTING, not research — it lives in Testing.tsx.)
   TODO: cog-style mascot illustrations for the three cards. */

/* Card copy = WHO each group is (Caroline 2026-08-18: the how-they-submit
   material was duplicating insight 01 below — persona cards describe the
   people, insights carry the findings). Mascots are Caroline's (2026-08-18),
   cog-style half-over-the-card-top treatment.
   TODO(caro): check the two developer descriptions ring true. */
const GROUPS = [
  {
    label: "smaller developers",
    img: "dev-small.png",
    alt: "Small purple house illustration",
    /* rendered a notch smaller than its siblings (Caroline 2026-08-18) —
       scaled, not resized, so the card tops and labels stay aligned */
    imgClass: "scale-[0.72]",
    body: "Housebuilders selling a few plots at a time, handling handovers themselves.",
  },
  {
    label: "bigger developers",
    img: "dev-big.png",
    alt: "Bigger pink house illustration",
    body: "Large-scale developers whose teams submit and track handovers in volume.",
  },
  {
    label: "internal ops",
    img: "ops.png",
    alt: "Purple droplet mascot with glasses, holding a clipboard and pencil",
    body: "The E.ON Next operations teams that receive and process every handover.",
  },
];

const INSIGHTS = [
  {
    label: "insight 01",
    title: "Different workflows",
    body: "Smaller developers hand over the moment a plot sells. Bigger developers batch theirs weekly through a spreadsheet. One rigid flow was never going to fit both.",
  },
  {
    label: "insight 02",
    title: "Lack of visibility",
    body: "With no centralised space to track a handover's state, developers lost sight of the ones still waiting on information from them.",
  },
  {
    label: "insight 03",
    title: "Access restrictions",
    body: "In bigger firms, the people who process handovers must not have access to financial data. Gateway handles developer invoicing, so access had to be designed in.",
  },
];

export function Interviews() {
  return (
    <section data-section="Interviews" className="py-24">
      <Container>
        <Reveal>
          <Kicker>research</Kicker>
          <Title className="mb-10">The handover process from every side</Title>
        </Reveal>

        {/* three interviewee cards — cog persona-card pattern: mascot overhangs
            the card top (-mt-14 on a h-24 image); mt-20 under the title and
            gap-20 when stacked keep clearance for the overhang. */}
        <Reveal
          stagger={0.12}
          className="mt-40 flex flex-col items-center gap-20 sm:flex-row sm:items-stretch sm:justify-center sm:gap-12"
        >
          {GROUPS.map((g) => (
            <div
              key={g.label}
              className="w-full max-w-[260px] rounded-xl border border-[var(--cog-line)] bg-[var(--cog-card)] p-6"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={A(g.img)}
                alt={g.alt}
                className={`mx-auto -mt-14 mb-4 h-24 w-24 object-contain ${"imgClass" in g ? g.imgClass : ""}`}
              />
              <p className="case-study-label">{g.label}</p>
              <Body className="mt-3">{g.body}</Body>
            </div>
          ))}
        </Reveal>

        <Reveal className="mt-24 max-w-[820px]">
          <CaseStudyCallout stream>
            My goal was to understand how each group actually processes a
            handover, so Gateway could fit the way they already work.
          </CaseStudyCallout>
        </Reveal>

        {/* insights get their own eyebrow + heading (Caroline 2026-08-18).
            TODO(caro): heading is Claude's suggestion — tweak at will.
            mt-56: section-scale separation (she asked for 3x mt-24, then
            dialled back to ~80%) — reads as a new section without being one. */}
        <Reveal className="mt-56">
          <Kicker>key research findings</Kicker>
          <Title className="mb-10">One spreadsheet, three ways of working</Title>
        </Reveal>
        <Reveal
          stagger={0.1}
          className="grid grid-cols-1 justify-items-center gap-8 md:grid-cols-3"
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
