import { Container, Kicker } from "../ui";
import { Reveal } from "../Reveal";
import { Parallax } from "../Parallax";
import { SoftBlob } from "../SoftBlob";
import { CaseStudyButton } from "../../CaseStudyButton";

/* Closing "View next project" — the frosted glass panel echoing the hero glass seam,
   retinted dark for Vector. Two parallax SoftBlobs drift low on the right; the copy +
   CTA cross-link to the real next study (wiki-whisperer). */
export function NextProject() {
  return (
    <section
      data-section="NextProject"
      className="relative isolate overflow-hidden rounded-t-[2.5rem] bg-[#1b1a22] pt-[120px] pb-[160px] backdrop-blur-2xl backdrop-saturate-150 shadow-[0_-24px_60px_-20px_rgba(192,152,255,0.18)]"
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

      <Parallax
        speed={130}
        className="absolute bottom-[0%] right-[1%] -z-10 h-[380px] w-[620px]"
      >
        <SoftBlob className="inset-0 h-full w-full opacity-90 blur-[64px]" />
      </Parallax>
      <Parallax
        speed={-90}
        className="absolute bottom-[16%] right-[24%] -z-10 h-[300px] w-[460px]"
      >
        <SoftBlob className="inset-0 h-full w-full opacity-90 blur-[64px]" />
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
