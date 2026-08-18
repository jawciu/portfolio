import { Container, Kicker, Title, Body, PlaceholderShot } from "../ui";
import { Reveal } from "../Reveal";

/* V1 / initial designs — Caroline's three-step timeline (2026-08-18, her copy,
   grammar-checked; replaces the old draft paragraph): sparkle markers = the
   AI-accelerated steps (1 and 3), plain dot = the by-hand wireframe step.
   Same rail pattern as Problem's timeline, single accent colour.
   TODO(caro): which V1 screens to show (single flow? first batch table?). */
const STEPS = [
  {
    ai: true,
    text: "I ideated options quickly with AI until I decided on a direction.",
  },
  {
    ai: false,
    text: "I wireframed key screens in more detail to pick up backend and ops conversations.",
  },
  {
    ai: true,
    text: "I rapidly created a prototype with AI that could be put in front of users.",
  },
];

/* Stop colours — same purple → accent-orchid ramp as the Problem timeline,
   interpolated across the three stops. */
const RAMP = ["#9254ff", "#c86cff", "#ff83ff"];

export function V1() {
  return (
    <section data-section="V1" className="py-24">
      <Container>
        <Reveal>
          <Kicker>initial designs</Kicker>
          <Title className="mb-10">Every workflow, full visibility, the right access</Title>
        </Reveal>
        <Reveal stagger={0.12} className="grid grid-cols-1 lg:grid-cols-3">
          {STEPS.map((s, i) => {
            const last = i === STEPS.length - 1;
            return (
              <div key={i} className="flex gap-5 lg:flex-col lg:gap-0">
                {/* marker + connecting rail (sparkle = AI step) */}
                <div className="flex flex-col items-center pt-1 lg:w-full lg:flex-row lg:pt-0">
                  <span
                    aria-hidden
                    className="flex h-5 w-5 shrink-0 items-center justify-center"
                  >
                    {s.ai ? (
                      <span
                        className="text-[20px] leading-none"
                        style={{ color: RAMP[i] }}
                      >
                        ✦
                      </span>
                    ) : (
                      <span
                        className="h-3 w-3 rounded-full"
                        style={{ background: RAMP[i] }}
                      />
                    )}
                  </span>
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
                <div
                  className={`min-w-0 flex-1 lg:mt-5 lg:flex-none lg:pr-8 ${last ? "" : "pb-12 lg:pb-0"}`}
                >
                  <Body>{s.text}</Body>
                </div>
              </div>
            );
          })}
        </Reveal>
        {/* Four key features, each a visual + a short description (Caroline's
            restructure, 2026-08-18: the product story now lives HERE as the
            initial designs, then Testing, then UpdatedDesigns shows what
            changed). Descriptions distilled from the old product sections —
            TODO(caro): confirm wording; swap PlaceholderShots for real screens. */}
        <Reveal
          stagger={0.1}
          className="mt-16 grid grid-cols-1 gap-x-12 gap-y-16 md:grid-cols-2"
        >
          {[
            {
              label: "single handover flow",
              body: "A single guided flow replaces the spreadsheet. Developers walk through one plot's handover step by step, with validation on every field.",
              shot: "V1 — single handover flow (TODO)",
            },
            {
              label: "batch table",
              body: "Bigger developers pick the plots they want to hand over and complete them in a familiar spreadsheet-style table inside Gateway.",
              shot: "V1 — batch table (TODO)",
            },
            {
              label: "the handovers hub",
              body: "Every handover and its status in one place. Each plot walks a visible path from Not Metered through to Handover Complete.",
              shot: "V1 — handovers hub (TODO)",
            },
            {
              label: "roles and access",
              body: "Access roles shape what each person sees, so a developer's whole team can work in Gateway without exposing financial data to those who must not see it.",
              shot: "V1 — role-gated view (TODO)",
            },
          ].map((f) => (
            <div key={f.label}>
              <PlaceholderShot label={f.shot} />
              <p className="case-study-label mt-6">{f.label}</p>
              <Body className="mt-3">{f.body}</Body>
            </div>
          ))}
        </Reveal>
      </Container>
    </section>
  );
}
