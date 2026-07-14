import { Container, Kicker, Title, Body } from "../ui";
import { Reveal } from "../Reveal";

/* What's next — three simple pins (NOT a timeline: equal weight, no order).
   A pin = a solid circle with a line dropping out of it, both filled with
   Vector's lilac→peach AI gradient (Caroline's call: no hairline outline, way
   simpler than a teardrop). Each holds a white mark (Linear + Attio brand marks,
   a target for the evals) and carries a short "why this, why next" body. Inline
   SVG (not <img>), so the iOS Safari asset rule doesn't apply. */

const WHITE = "#ffffff";

/* Linear brand mark (simple-icons path, viewBox 0 0 24 24) */
function LinearMark() {
  return (
    <g transform="translate(20 18) scale(1)" fill={WHITE}>
      <path d="M2.886 4.18A11.982 11.982 0 0 1 11.99 0C18.624 0 24 5.376 24 12.009c0 3.64-1.62 6.903-4.18 9.105L2.887 4.18ZM1.817 5.626l16.556 16.556c-.524.33-1.075.62-1.65.866L.951 7.277c.247-.575.537-1.126.866-1.65ZM.322 9.163l14.515 14.515c-.71.172-1.443.282-2.195.322L0 11.358a12 12 0 0 1 .322-2.195Zm-.17 4.862 9.823 9.824a12.02 12.02 0 0 1-9.824-9.824Z" />
    </g>
  );
}

/* Attio brand mark (official double-slash "A", viewBox 0 0 31 26) */
function AttioMark() {
  return (
    <g transform="translate(20 20) scale(0.774)" fill={WHITE}>
      <path d="M22.9913 7.7644C23.4148 7.08496 23.4148 6.21112 22.9913 5.53553L20.4044 1.39536L20.1889 1.04697C19.802 0.429125 19.136 0.0595703 18.4046 0.0595703H12.5649C11.8354 0.0595703 11.1694 0.429125 10.7806 1.0489L0.323361 17.7847C0.113561 18.1196 0 18.5065 0 18.8992C0 19.2918 0.111636 19.6787 0.321436 20.0117L3.12582 24.5022C3.5127 25.1219 4.17866 25.4896 4.90815 25.4896H10.7479C11.4812 25.4896 12.1472 25.12 12.5321 24.5002L12.7458 24.1615C12.7458 24.1615 12.7458 24.1615 12.7458 24.1576C12.7458 24.1576 12.7496 24.1519 12.7496 24.1499L14.8342 20.8162L21.0127 10.9287L22.9875 7.76633L22.9913 7.7644ZM22.2002 7.26974C22.3215 7.07919 22.3812 6.86361 22.3812 6.64996C22.3812 6.43632 22.3215 6.22074 22.2002 6.03019L19.6134 1.89002C19.519 1.73797 19.3708 1.72064 19.3112 1.72064C19.2515 1.72064 19.1033 1.73797 19.0109 1.8881L8.7673 18.2794C8.53248 18.6586 8.53248 19.1417 8.7673 19.517L11.3561 23.6649C11.4504 23.8131 11.5967 23.8304 11.6564 23.8304C11.716 23.8304 11.8643 23.8131 11.9566 23.6649L22.2002 7.26974Z" />
      <path d="M30.6468 17.7823L28.0599 13.6422C28.0599 13.6422 28.0503 13.6248 28.0445 13.6172L27.8405 13.2919C27.4555 12.674 26.7895 12.3045 26.062 12.3025L21.8949 12.2891L21.6042 12.7549L16.6249 20.7234L16.3496 21.1642L18.4361 24.4978C18.821 25.1176 19.487 25.4872 20.2203 25.4872H26.06C26.7799 25.4872 27.4613 25.108 27.8424 24.4998L28.0483 24.1706C28.0483 24.1706 28.056 24.161 28.058 24.1572L30.6487 20.0112C31.0741 19.3337 31.0741 18.4579 30.6487 17.7823H30.6468ZM29.8615 19.5166C30.0982 19.1393 30.0982 18.6543 29.8615 18.277L27.2746 14.1368C27.1822 13.9867 27.034 13.9675 26.9743 13.9675C26.9647 13.9675 26.9551 13.9675 26.9454 13.9675C26.9262 13.9713 26.9031 13.9732 26.8762 13.9809C26.8088 13.9944 26.7318 14.0367 26.6702 14.1291C26.6683 14.133 26.6644 14.1388 26.6644 14.1388L24.0775 18.2809C24.0198 18.3732 23.9755 18.4753 23.9467 18.5773C23.8889 18.7851 23.8889 19.0084 23.9467 19.2163C23.9621 19.2683 23.9794 19.3183 24.0025 19.3683C24.0256 19.4203 24.0506 19.4684 24.0795 19.5146L26.6702 23.6606C26.7645 23.8107 26.9108 23.828 26.9705 23.828C27.0224 23.828 27.1398 23.8146 27.2303 23.7125C27.2419 23.6971 27.2553 23.6817 27.2669 23.6625L29.8576 19.5166H29.8615Z" />
    </g>
  );
}

/* Evals mark — a target: measure first, autonomy after. All white and a touch
   thicker, so it carries the same visual weight as the white brand marks. */
function EvalsMark() {
  return (
    <g fill="none" stroke={WHITE} strokeWidth={1.8}>
      <circle cx={32} cy={30} r={10} />
      <circle cx={32} cy={30} r={5.5} />
      <circle cx={32} cy={30} r={1.6} fill={WHITE} stroke="none" />
    </g>
  );
}

/* A rail stop: grey circle (card fill, dull card-border hairline) with the white
   mark inside — the Matching rail's dot, grown into an icon holder. The marks
   are positioned for the old pin-head centre (32,30), so the wrapper g remaps
   them into this 52-box (centre 26,26). */
function Stop({ mark, title }: { mark: React.ReactNode; title: string }) {
  return (
    <svg viewBox="0 0 52 52" className="h-12 w-12 shrink-0" role="img" aria-label={title}>
      <circle
        cx={26}
        cy={26}
        r={25.4}
        fill="var(--case-study-card)"
        stroke="var(--case-study-line)"
        strokeWidth={1.2}
      />
      <g transform="translate(-6 -4)">{mark}</g>
    </svg>
  );
}

/* Rail stop colours — the AI gradient's ends + the Matching RAMP midpoint. The
   circles stay grey; only the dotted rails between them carry the ramp. */
const RAMP = ["#c098ff", "#e09abe", "#ff9c7d"] as const;

/* A dotted connecting rail: gradient-tinted like the Matching rail, but the
   colour shows through a repeating round-dot mask instead of a solid line. */
function railStyle(from: string, to: string, vertical: boolean): React.CSSProperties {
  const mask: React.CSSProperties = {
    maskImage: "radial-gradient(circle, #000 1.2px, transparent 1.4px)",
    maskSize: vertical ? "3px 9px" : "9px 3px",
    maskRepeat: vertical ? "repeat-y" : "repeat-x",
    maskPosition: "center",
  };
  return {
    background: `linear-gradient(${vertical ? 180 : 90}deg, ${from}, ${to})`,
    ...mask,
    WebkitMaskImage: mask.maskImage,
    WebkitMaskSize: mask.maskSize,
    WebkitMaskRepeat: mask.maskRepeat,
    WebkitMaskPosition: mask.maskPosition,
  };
}

const NEXT = [
  {
    label: "AI accuracy",
    title: "Evals",
    mark: <EvalsMark />,
    body: "The pipelines, the observability and a 30-case golden dataset are already built. The next step is measuring how accurate the drafts really are and iterating on the prompts.",
  },
  {
    label: "sync with linear",
    title: "Linear",
    mark: <LinearMark />,
    body: "Engineering teams already run on Linear. A two-way sync would keep both sides current. Issues raised in Linear appear in Vector, and tasks created in Vector land back in Linear.",
  },
  {
    label: "context from attio",
    title: "Attio",
    mark: <AttioMark />,
    body: "By the time onboarding kicks off, the customer's story already lives in the CRM. Pulling that context in from Attio means every onboarding starts informed.",
  },
] as const;

export function WhatsNext() {
  return (
    /* pt-[130px] = the plain dark zone below Collaboration's check texture
       (was 100, +30% on Caroline's 2026-07-14 spacing pass) */
    <section data-section="WhatsNext" className="pt-[130px] pb-[180px]">
      <Container>
        <Reveal>
          <Kicker>What&apos;s next</Kicker>
          <Title>
            Measured accuracy,
            <br />
            connected tools
          </Title>
        </Reveal>

        {/* three stops on a dotted rail (the Matching timeline's layout, but
            equal weight: grey icon circles, no order implied) */}
        <Reveal stagger={0.12} className="mt-16 grid grid-cols-1 md:grid-cols-3">
          {NEXT.map(({ label, title, mark, body }, i) => {
            const last = i === NEXT.length - 1;
            return (
              <div key={label} className="flex gap-5 md:flex-col md:gap-0">
                {/* stop + connecting rail */}
                <div className="flex flex-col items-center md:w-full md:flex-row">
                  <Stop mark={mark} title={title} />
                  {!last && (
                    <>
                      {/* vertical rail (stacked layout) */}
                      <span
                        aria-hidden
                        className="my-3 w-[3px] flex-1 md:hidden"
                        style={railStyle(RAMP[i], RAMP[i + 1], true)}
                      />
                      {/* horizontal rail (row layout) */}
                      <span
                        aria-hidden
                        className="mx-4 hidden h-[3px] flex-1 md:block"
                        style={railStyle(RAMP[i], RAMP[i + 1], false)}
                      />
                    </>
                  )}
                </div>
                {/* pr-12 / pb-18 = the old pr-8 / pb-12 column gaps + 50% (her ask) */}
                <div className={`min-w-0 flex-1 md:mt-6 md:flex-none md:pr-12 ${last ? "" : "pb-18 md:pb-0"}`}>
                  <p className="case-study-label mb-3">{label} &gt;</p>
                  <Body>{body}</Body>
                </div>
              </div>
            );
          })}
        </Reveal>
      </Container>
    </section>
  );
}
