import { A, Container, Kicker, Title, Body, CaseStudyCallout } from "../ui";
import { Reveal } from "../Reveal";

/* RESOLVED experiment (2026-08-18): Caroline picked the vector-Matching-style
   TIMELINE over the prose paragraphs — the prose intro was deleted; the
   timeline alone tells the problem story. Rail ramps purple → accent orchid
   (things getting worse); last stop is a hollow ring — the hole
   Gateway plugs. */
const STAGES = [
  [
    "stage #01",
    "Plot sold",
    "A new-build home is sold. The developer needs to hand the plot's energy account over to the new owner.",
  ],
  [
    "stage #02",
    "Spreadsheet",
    "The handover reaches E.ON Next as a manually filled spreadsheet. Nothing is validated on the way in.",
  ],
  [
    "stage #03",
    "back and forth",
    "Missing fields, typos and mismatched details bounce between ops and the developer over email.",
  ],
  [
    "stage #04",
    "The stall",
    "With no central place to track it, a handover still waiting on information gets forgotten in a flooded inbox.",
  ],
  [
    "the fallout",
    "Debt build",
    "The plot stays in the developer's name. The new owner can't set up an account, unbilled energy turns into debt.",
  ],
] as const;

/* Stop colours — purple #9254FF ramping into the accent orchid #FF83FF
   (Caroline 2026-08-18), interpolated evenly across the five stops. */
const RAMP = ["#9254ff", "#ad60ff", "#c86cff", "#e477ff", "#ff83ff"];

/* The business problem — handovers arrive as manually submitted Google Sheets;
   information gets lost, handovers drag, and the delay is where debt accrues.
   (The step-up beat — designer left, foreign domain, she volunteered — moved to
   the hero's setting-the-stage block, template layout, 2026-08-05.) */
export function Problem() {
  return (
    <section data-section="Problem" className="py-24">
      <Container>
        <Reveal>
          <Kicker>problem space</Kicker>
          <Title className="mb-10">Handovers lived in a spreadsheet</Title>
        </Reveal>
        {/* the problem story as a timeline (see note above) */}
        <Reveal stagger={0.12} className="grid grid-cols-1 lg:grid-cols-5">
          {STAGES.map(([label, title, body], i) => {
            const last = i === STAGES.length - 1;
            return (
              <div key={label} className="flex gap-5 lg:flex-col lg:gap-0">
                {/* marker + connecting rail */}
                <div className="flex flex-col items-center pt-1 lg:w-full lg:flex-row lg:pt-[5px]">
                  <span
                    aria-hidden
                    className="h-3 w-3 shrink-0 rounded-full"
                    style={
                      last
                        ? { border: `2px solid ${RAMP[i]}`, boxShadow: `0 0 12px ${RAMP[i]}55` }
                        : { background: RAMP[i], boxShadow: `0 0 12px ${RAMP[i]}55` }
                    }
                  />
                  {!last && (
                    <>
                      {/* vertical rail (stacked layout) */}
                      <span
                        aria-hidden
                        className="my-2 w-px flex-1 lg:hidden"
                        style={{ background: `linear-gradient(180deg, ${RAMP[i]}, ${RAMP[i + 1]})` }}
                      />
                      {/* horizontal rail (timeline layout) */}
                      <span
                        aria-hidden
                        className="mx-3 hidden h-px flex-1 lg:block"
                        style={{ background: `linear-gradient(90deg, ${RAMP[i]}, ${RAMP[i + 1]})` }}
                      />
                    </>
                  )}
                </div>
                <div className={`min-w-0 flex-1 lg:mt-6 lg:flex-none lg:pr-8 ${last ? "" : "pb-12 lg:pb-0"}`}>
                  <p className="font-[family-name:var(--font-mono)] text-[15px] font-bold uppercase tracking-[0.02em] text-[var(--cog-ink)]">
                    {label}
                  </p>
                  <h3 className="case-study-label mt-2 leading-[1.25]">{title}</h3>
                  <Body className="mt-3">{body}</Body>
                </div>
              </div>
            );
          })}
        </Reveal>

        <Reveal className="mt-24 max-w-[820px]">
          <CaseStudyCallout stream>
            {"**4 million** pounds of the Smart New Connections debt book is tied to customers waiting on a handover."}
          </CaseStudyCallout>
        </Reveal>
        <Reveal className="mt-24">
          {/* the real before-artefact (added 2026-08-18): the handover form
              spreadsheet, empty template as sent to developers; the internal
              email address is painted out of the source image. */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={A("handover-spreadsheet.png")}
            alt="The old handover form: a macro-enabled Excel spreadsheet with red mandatory columns, a click-here-to-validate button and instructions to email it back within seven days"
            width={3398}
            height={1268}
            className="block h-auto w-full rounded-[16px] border-[1.5px] border-[#F2E6E1]"
          />
        </Reveal>
      </Container>
    </section>
  );
}
