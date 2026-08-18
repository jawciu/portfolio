import { Container, Kicker, Title, Body, CaseStudyCallout, PlaceholderShot, Stats } from "../ui";
import { Reveal } from "../Reveal";

/* EXPERIMENT (2026-08-06, Caroline's ask): the problem story retold as a
   vector-Matching-style timeline BELOW the prose, so she can compare the two
   treatments side by side. Keep BOTH until she picks; if the timeline wins,
   the second/third paragraphs likely shrink. Rail ramps lavender → deep
   magenta (things getting worse); last stop is a hollow ring — the hole
   Gateway plugs. */
const STAGES = [
  [
    "stage #01",
    "Plot sold",
    "A new-build home is sold. The developer needs to hand the plot's energy account over to the new owner.",
  ],
  [
    "stage #02",
    "Spreadsheet submitted",
    "The handover reaches E.ON Next as a manually filled spreadsheet. Nothing is validated on the way in.",
  ],
  [
    "stage #03",
    "The back and forth",
    "Missing fields, typos and mismatched details bounce between ops and the developer over email.",
  ],
  [
    "stage #04",
    "The handover stalls",
    "With no central place to track it, a handover still waiting on information gets forgotten in a flooded inbox.",
  ],
  [
    "the fallout",
    "Debt builds",
    "The plot stays in the developer's name. The new owner can't set up an account, and unbilled energy turns into debt.",
  ],
] as const;

/* Stop colours — lavender ramping into the study's deep magenta. */
const RAMP = ["#c9a6f0", "#dd8ad4", "#e96bb0", "#e1418d", "#b3005f"];

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
        <Reveal className="max-w-[680px] space-y-5">
          {/* Caroline's copy, 2026-08-05 */}
          <Body>
            When a new-build home is sold, the property developer hands the
            plot&apos;s energy account over to the new owner. Today that handover
            reaches E.ON Next as a manually submitted spreadsheet.
          </Body>
          <Body>
            Nothing is validated, so submissions arrive with missing fields,
            typos and mismatched details, and the back and forth makes the
            process longer than it needs to be. Without a centralised space to
            track them, handovers in progress with issues get forgotten. The
            delays build up debt on accounts and make for a poor first
            experience for new property owners.
          </Body>
          <Body>
            {/* Facts from Caroline's project records, 2026-08-06 */}
            Until a handover is processed, the plot stays registered in the
            developer&apos;s name. New owners move in unable to set up their
            energy account, and welcome packs can arrive up to six weeks late.
          </Body>
        </Reveal>

        {/* — the same story as a timeline (comparison experiment, see note above) — */}
        <Reveal stagger={0.12} className="mt-16 grid grid-cols-1 lg:grid-cols-5">
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

        <Reveal className="mt-16">
          <CaseStudyCallout stream>
            10% of the Smart New Connections debt book is tied to customers
            waiting on a handover.
          </CaseStudyCallout>
        </Reveal>
        <Stats
          className="mt-6"
          items={[
            { n: "2,000", caption: "incomplete submissions arrive every year" },
            { n: "26", caption: "critical data mismatches submitted a year" },
            { n: "6", caption: "weeks late a welcome pack can arrive" },
          ]}
        />
        <Reveal className="mt-12">
          <PlaceholderShot label="before: the spreadsheet channel (anonymised) — TODO" />
        </Reveal>
      </Container>
    </section>
  );
}
