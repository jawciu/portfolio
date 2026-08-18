import { Container, Kicker, Title, Body, CaseStudyCallout, PlaceholderShot } from "../ui";
import { Reveal } from "../Reveal";

/* Updated designs — what changed after testing (Caroline's restructure,
   2026-08-18). Three updates, copy distilled from the old HandoverFlow /
   BulkUpload / Hub product sections (deleted same day, content absorbed here
   and in V1's feature grid — full copy in git history):
   01 autofill opt-in, 02 bulk from spreadsheet (THE MAIN UPDATE), 03 clearer
   statuses + hub columns.
   TODO(caro): confirm wording, esp. block 03's hub-columns detail; heading is
   Claude's suggestion; swap PlaceholderShots for the redesigned screens. */

const UPDATES = [
  {
    label: "01 · autofill became a choice",
    body: (
      <>
        The single flow can autofill by pulling back information E.ON Next
        already holds on each plot, so developers only type what&apos;s
        genuinely new. Testing showed trust in the held data varies by
        developer, so a toggle turns it on or off. Autofill where the data is
        trusted, a toggle where it isn&apos;t.
      </>
    ),
    shots: [
      "flow: autofill opt-in (TODO)",
      "flow: autofilled state (TODO)",
    ],
  },
  {
    label: "02 · bulk handovers from a spreadsheet",
    body: (
      <>
        The main update. For the teams not ready to change, a front-end
        developer and I teamed up on an interim bridge. They keep filling the
        spreadsheet they use today, upload it to Gateway as a CSV, and Gateway
        highlights every missing field and mismatched detail before submission.
        No autofill, no new habits. It isn&apos;t a solution we want to keep,
        it meets bigger developers where they are while the table flow earns
        their trust.
      </>
    ),
    shots: ["interim upload: missing + mismatched highlighting (TODO, anonymise)"],
  },
  {
    label: "03 · clearer statuses, easier navigation",
    body: (
      <>
        Testing also reworked the words. The confusing status became Partially
        Done, the To-Do button went, and Save and Continue made saving visible.
        The Handovers Hub gained columns that make a full book of handovers
        easier to navigate.
      </>
    ),
    shots: ["hub: renamed statuses + columns (TODO)"],
  },
];

export function UpdatedDesigns() {
  return (
    <section data-section="UpdatedDesigns" className="py-24">
      <Container>
        <Reveal>
          <Kicker>updated designs</Kicker>
          <Title className="mb-10">What the findings changed</Title>
        </Reveal>
        <div className="space-y-20">
          {UPDATES.map((u) => (
            <div key={u.label}>
              <Reveal className="max-w-[680px]">
                <p className="case-study-label">{u.label}</p>
                <Body className="mt-3">{u.body}</Body>
              </Reveal>
              <Reveal
                className={`mt-8 grid grid-cols-1 gap-8 ${
                  u.shots.length > 1 ? "md:grid-cols-2" : ""
                }`}
              >
                {u.shots.map((s) => (
                  <PlaceholderShot key={s} label={s} />
                ))}
              </Reveal>
            </div>
          ))}
        </div>
        <Reveal className="mt-20 max-w-[820px]">
          <CaseStudyCallout stream>
            Catch the bad data at the door, not in month three.
          </CaseStudyCallout>
        </Reveal>
      </Container>
    </section>
  );
}
