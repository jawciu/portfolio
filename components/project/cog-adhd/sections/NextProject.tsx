import { Container, Kicker } from "../ui";
import { Reveal } from "../Reveal";
import { CaseStudyButton } from "../../CaseStudyButton";

export function NextProject() {
  return (
    <section data-section="NextProject" className="pt-[120px] pb-[120px]">
      <Container>
        <Reveal>
          <Kicker>View next project</Kicker>
          <div className="flex flex-col items-start gap-6">
            <h3 className="case-study-section-heading mb-0!">
              Building marketing website
              <br />
              for a dual audience
            </h3>
            <CaseStudyButton href="#">
              CHECK IT OUT
            </CaseStudyButton>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
