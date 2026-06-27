import { A, Container, Kicker } from "../ui";
import { Reveal } from "../Reveal";
import { CaseStudyButton } from "../../CaseStudyButton";

export function NextProject() {
  return (
    <section
      data-section="NextProject"
      // frosted glass band (same pattern as the wiki study) in the cog cream/green tone:
      // warm whisper tint, rim glint, and a soft shadow in the MyRole card green (#189E71).
      className="relative isolate overflow-hidden rounded-t-[2.5rem] bg-[#faf9f5] pt-[120px] pb-[160px] backdrop-blur-2xl backdrop-saturate-150 shadow-[0_-24px_60px_-20px_rgba(24,158,113,0.16)]"
    >
      {/* glass rim glint along the top edge */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-px rounded-t-[2.5rem]"
        style={{
          background:
            "linear-gradient(90deg, rgba(255,255,255,0), rgba(255,255,255,0.85) 22%, rgba(255,255,255,0.35) 50%, rgba(255,255,255,0.7) 78%, rgba(255,255,255,0))",
        }}
      />

      {/* decorative ribbon at the base of the band (the cog confetti ribbon) */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={A("image-44.svg")}
        alt=""
        aria-hidden="true"
        className="pointer-events-none absolute bottom-0 left-1/2 -z-10 w-[110%] max-w-none -translate-x-1/2 opacity-90"
      />

      <Container>
        <Reveal>
          <Kicker>View next project</Kicker>
          <div className="flex flex-col items-start gap-6">
            <h3 className="case-study-section-heading mb-0!">
              Designing an AI brain
              <br />
              for a support call centre
            </h3>
            <CaseStudyButton href="/project/wiki-whisperer">CHECK IT OUT</CaseStudyButton>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
