import { Container, Kicker } from "../ui";
import { Reveal } from "../Reveal";
import { SoftBlob } from "../SoftBlob";
import { Parallax } from "../Parallax";
import { CaseStudyButton } from "../../CaseStudyButton";

export function NextProject() {
  return (
    <section
      data-section="NextProject"
      className="relative isolate -mt-[64px] overflow-hidden rounded-t-[2.5rem] pt-[120px] pb-[160px] backdrop-blur-2xl backdrop-saturate-150 shadow-[0_-24px_60px_-20px_rgba(120,80,160,0.16)]"
      // frosted lilac glass panel — echoes the homepage About sheet / glass seam:
      // translucent so the ambient blobs frost through, plus a rim glint + soft top shadow.
      style={{
        background:
          "linear-gradient(180deg, rgba(252,248,255,0.5) 0%, rgba(252,248,255,0.72) 120px, rgba(252,248,255,0.84) 100%)",
      }}
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

      {/* two blobs sitting low on the right, more visible (opacity-100, crisper) and
          each scroll-drifting at a different speed than the copy for a parallax feel */}
      <Parallax speed={40} className="absolute bottom-[0%] right-[1%] -z-10 h-[380px] w-[620px]">
        <SoftBlob className="inset-0 h-full w-full opacity-100 blur-[56px]" />
      </Parallax>
      <Parallax speed={-26} className="absolute bottom-[16%] right-[24%] -z-10 h-[300px] w-[460px]">
        <SoftBlob className="inset-0 h-full w-full opacity-100 blur-[56px]" />
      </Parallax>

      <Container>
        <Reveal>
          <Kicker>View next project</Kicker>
          <div className="flex flex-col items-start gap-6">
            <h3 className="case-study-section-heading mb-0!">
              Gaps and opportunities
              <br />
              in ADHD therapy
            </h3>
            <CaseStudyButton href="/project/cog-adhd">
              CHECK IT OUT
            </CaseStudyButton>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
