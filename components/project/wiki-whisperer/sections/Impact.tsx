import { Container, Kicker, Title, Body, CaseStudyCallout, TestimonialBubble, Stats } from "../ui";
import { Reveal } from "../Reveal";

const STATS: { n: string; caption: string }[] = [
  { n: "89%", caption: "adoption across all trial teams" },
  { n: "97%", caption: "would recommend V2 to other specialists" },
  { n: "94%", caption: "said it helped prevent follow-up contacts" },
  { n: "91%", caption: "now rely less on the old Wiki or Slack" },
];

export function Impact() {
  return (
    <section data-section="Impact" className="pt-[120px] pb-0">
      <Container>
        <Reveal>
          <Kicker>Early impact</Kicker>
          <Title>Signals worth scaling</Title>
        </Reveal>

        {/* callout above the stats */}
        <Reveal className="mt-14 max-w-[860px]">
          <CaseStudyCallout stream>
            Some teams closed their support channels a couple of weeks into the trial, leaning on the tool instead of each other.
          </CaseStudyCallout>
        </Reveal>

        {/* headline numbers — centred big numbers (shared Stats component) */}
        <Stats className="mt-14" items={STATS} />

        {/* onboarding / bootcamp beat — copy left, quote in a speech bubble right */}
        <Reveal stagger={0.1} className="mt-14 grid items-center gap-10 lg:grid-cols-2 lg:gap-14">
          <div className="max-w-[520px]">
            <p className="case-study-label">In the new-starter academy &gt;</p>
            <Body className="mt-3">
              V2 compressed the learning curve and reduced the number of senior advisors
              needed on the floor.
            </Body>
          </div>
          <div className="flex justify-center lg:justify-end">
            <TestimonialBubble
              asset="bubble-1.png"
              quote="Wiki Whisperer V2 has significantly enhanced our onboarding, empowering new starters with consistent information and noticeable improvements in confidence, knowledge retention and engagement."
              who="@Academy Skills Lead"
              width={500}
            />
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
