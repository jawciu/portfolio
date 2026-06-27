import { Container, Kicker } from "../ui";
import { Reveal } from "../Reveal";
import { SoftBlob } from "../SoftBlob";
import { Parallax } from "../Parallax";
import { CaseStudyButton } from "../../CaseStudyButton";

export function NextProject() {
  return (
    <section
      data-section="NextProject"
      // frosted glass band (same pattern as the wiki study) in the cog cream/green tone:
      // warm whisper tint, rim glint, green-tinted soft shadow.
      className="relative isolate overflow-hidden rounded-t-[2.5rem] bg-[#faf9f5] pt-[120px] pb-[160px] backdrop-blur-2xl backdrop-saturate-150 shadow-[0_-24px_60px_-20px_rgba(0,107,75,0.14)]"
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

      {/* two blobs sitting low on the right, more visible and each scroll-drifting at
          its own (opposed) speed so they move separately from the copy as you scroll */}
      <Parallax speed={130} className="absolute bottom-[0%] right-[1%] -z-10 h-[380px] w-[620px]">
        <SoftBlob className="inset-0 h-full w-full opacity-100 blur-[56px]" />
      </Parallax>
      <Parallax speed={-90} className="absolute bottom-[16%] right-[24%] -z-10 h-[300px] w-[460px]">
        <SoftBlob className="inset-0 h-full w-full opacity-100 blur-[56px]" />
      </Parallax>

      <Container>
        <Reveal>
          <Kicker>View next project</Kicker>
          <div className="flex flex-col items-start gap-6">
            <h3 className="case-study-section-heading mb-0!">
              Building marketing website
              <br />
              for a dual audience
            </h3>
            <CaseStudyButton href="#">CHECK IT OUT</CaseStudyButton>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
