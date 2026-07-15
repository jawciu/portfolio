import { Container, Kicker } from "../ui";
import { Reveal } from "../Reveal";
import { Parallax } from "../Parallax";
import { SoftBlob } from "../SoftBlob";
import { CaseStudyButton } from "../../CaseStudyButton";

/* Closing "View next project" — the frosted glass panel echoing the hero glass seam,
   retinted dark for Vector. One parallax SoftBlob drifts low on the right; the copy +
   CTA cross-link to the real next study (wiki-whisperer). (A "move the blob up into
   WhatsNext" experiment was tried and reverted same-day, 2026-07-14.) */
export function NextProject() {
  return (
    <section
      data-section="NextProject"
      /* dark drop shadow above the plate (same recipe as the main glass seam
         above MyRole) — was a lilac glow, Caroline wanted shadow not glow */
      className="relative isolate overflow-hidden rounded-t-[2.5rem] bg-[#1b1a22] pt-[120px] pb-[160px] max-sm:pt-[120px] max-sm:pb-[160px] backdrop-blur-2xl backdrop-saturate-150 shadow-[0_-32px_70px_-16px_rgba(0,0,0,0.85)]"
      /* dot texture = the shared `dots` recipe (22px rhythm, same dimness) —
         keep in sync with Product/Collaboration/Observability */
      style={{
        backgroundImage: "radial-gradient(rgba(241,234,241,0.11) 1px, transparent 1.4px)",
        backgroundSize: "22px 22px",
      }}
    >
      {/* rim glint (white — reads on the dark tint) */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-px rounded-t-[2.5rem]"
        style={{
          background:
            "linear-gradient(90deg, rgba(255,255,255,0), rgba(255,255,255,0.6) 22%, rgba(255,255,255,0.25) 50%, rgba(255,255,255,0.5) 78%, rgba(255,255,255,0))",
        }}
      />

      {/* one toned-down blob (was two at opacity-90 — read as too much colour) */}
      <Parallax
        speed={130}
        className="absolute bottom-[0%] right-[1%] -z-10 h-[380px] w-[620px]"
      >
        <SoftBlob className="inset-0 h-full w-full opacity-50 blur-[64px]" />
      </Parallax>

      <Container>
        <Reveal>
          <Kicker>View next project</Kicker>
          <div className="flex flex-col items-start gap-6">
            <h3 className="case-study-section-heading mb-0!">
              Designing an AI brain
              <br />
              for a support call centre
            </h3>
            <CaseStudyButton href="/project/wiki-whisperer" tone="light">
              CHECK IT OUT
            </CaseStudyButton>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
