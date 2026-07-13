import { Container, Kicker, Title, Body } from "../ui";
import { Reveal } from "../Reveal";

/* The matching — the signals Vector checks, in order of trust, before it drafts
   anything from a meeting. A horizontal timeline: four signal stops, then the
   human fallback as the final stop. The rail runs Vector's AI gradient
   (lilac → peach); the last stop lands on peach with a hollow ring, because
   that's where the AI stops and a person steps in. Below lg the timeline turns
   vertical (five columns don't fit). */

const STOPS = [
  [
    "signal #01",
    "Attendee domains",
    "When a meeting has an invite list, a matching customer email domain is the strongest signal.",
  ],
  [
    "signal #02",
    "Contact emails",
    "Failing that, each attendee's email is looked up against every onboarding's contacts.",
  ],
  [
    "signal #03",
    "The title",
    "The title is scanned for the significant words of a company name e.g. “Raycast weekly sync”.",
  ],
  [
    "signal #04",
    "The transcript",
    "The last resort: summary, topics, notes and transcript are searched for a customer mention.",
  ],
  [
    "no signal",
    "Needs your input",
    "Zero or more than one candidate and the meeting lands in “to assign the inbox”.",
  ],
] as const;

/* Stop colours — Vector's AI gradient (--ai-from lilac → --ai-to peach)
   interpolated across the five stops, so the rail reads as one ramp. */
const RAMP = ["#c098ff", "#d099de", "#e09abe", "#ef9b9d", "#ff9c7d"];

export function Matching() {
  return (
    <section data-section="Matching" className="pt-[160px] pb-0">
      <Container>
        <Reveal>
          <Kicker>The matching</Kicker>
          <Title>Whose meeting was this?</Title>
        </Reveal>

        <Reveal stagger={0.12} className="grid grid-cols-1 lg:grid-cols-5">
          {STOPS.map(([label, title, body], i) => {
            const last = i === STOPS.length - 1;
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
                  <p className="font-[family-name:var(--font-mono)] text-[15px] font-bold uppercase tracking-[0.02em] text-[var(--case-study-ink)]">
                    {label}
                  </p>
                  <h3 className="case-study-label mt-2 leading-[1.25]">{title}</h3>
                  <Body className="mt-3">{body}</Body>
                </div>
              </div>
            );
          })}
        </Reveal>

        {/* ASSET SLOT — when the "Needs your input" ambiguous-matching shot arrives
            from Caroline, it sits below the timeline, full container width:
            <Reveal className="mt-16"><Shot src={A("matching-v2.png")} alt="…" bare /></Reveal>
            (add to SHOT_DIMS). */}
      </Container>
    </section>
  );
}
