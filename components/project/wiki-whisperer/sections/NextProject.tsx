import { Container, Kicker } from "../ui";
import { Reveal } from "../Reveal";
import { SoftBlob } from "../SoftBlob";
import { CaseStudyButton } from "../../CaseStudyButton";

export function NextProject() {
  return (
    <section
      data-section="NextProject"
      className="relative isolate overflow-hidden bg-[#fcf8ff] pt-[120px] pb-[160px]"
    >
      {/* blurry blob, sitting low on the right so it reads as part of this band */}
      <SoftBlob className="bottom-[2%] right-[2%] h-[330px] w-[560px]" />

      <Container>
        <Reveal>
          <Kicker>View next project</Kicker>
          <div className="flex flex-col items-start gap-6">
            <h3 className="case-study-section-heading mb-0!">
              Gaps and opportunities
              <br />
              in ADHD therapy
            </h3>
            <CaseStudyButton href="/project/cog-adhd" color="#b52fa5">
              CHECK IT OUT
            </CaseStudyButton>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
