import { Container, Kicker, Title, Body, CaseStudyCallout } from "../ui";
import { Reveal } from "../Reveal";
import { StreamingQuote } from "../StreamingQuote";

const STATS: { n: string; caption: string; delta?: string }[] = [
  { n: "89.4%", caption: "adoption across all trial teams" },
  { n: "96.9%", caption: "would recommend V2 to other specialists", delta: "+17% on V1" },
  { n: "93.8%", caption: "said it helped prevent follow-up contacts", delta: "+33.7% on V1" },
  { n: "90.6%", caption: "now rely less on the old Wiki or Slack", delta: "+40% on V1" },
];

export function Impact() {
  return (
    <section data-section="Impact" className="pt-[120px] pb-0">
      <Container>
        <Reveal>
          <Kicker>Early impact</Kicker>
          <Title>Signals worth scaling</Title>
        </Reveal>

        <Reveal stagger={0.1} className="flex max-w-[760px] flex-col gap-5">
          <Body>
            Adoption told the first story. Across the trial, V2 reached consistent use
            where V1 had been abandoned.
          </Body>
          <Body>
            Specialists then reported real change against V1, and some teams changed how
            they worked entirely.
          </Body>
        </Reveal>

        {/* headline numbers */}
        <Reveal stagger={0.1} className="mt-14 grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
          {STATS.map((s) => (
            <div key={s.n}>
              <p className="font-[family-name:var(--font-hero)] text-5xl leading-none text-[var(--green)] md:text-6xl">
                {s.n}
              </p>
              <p className="case-study-body-md mt-3">{s.caption}</p>
              {s.delta && (
                <p className="mt-1 text-[14px] italic text-[var(--cog-muted)]">{s.delta}</p>
              )}
            </div>
          ))}
        </Reveal>

        <Reveal className="mt-14 max-w-[860px]">
          <CaseStudyCallout stream>
            Some teams closed their support channels a couple of weeks into the trial, leaning on the tool instead of each other.
          </CaseStudyCallout>
        </Reveal>

        {/* onboarding / bootcamp beat */}
        <Reveal className="mt-14 max-w-[760px]">
          <p className="case-study-label">onboarding &gt;</p>
          <Body className="mt-3">
            In the new-starter academy, V2 compressed the learning curve, helping rookies
            reach floor competence faster and reducing how often they pull a senior advisor
            off the floor. Early and anecdotal, but it points to real savings.
          </Body>
          <StreamingQuote
            as="blockquote"
            className="case-study-quote mt-5 border-l-2 border-[var(--green)] pl-4"
          >
            {`“Wiki Whisperer V2 has significantly enhanced our onboarding, empowering new starters with consistent information and noticeable improvements in confidence, knowledge retention and engagement.”`}
          </StreamingQuote>
          <span className="mt-2 block pl-4 text-[14px] text-[var(--cog-muted)]">
            @Academy Skills Lead
          </span>
        </Reveal>

        {/* directional telemetry — placeholder charts until the visual pass */}
        <Reveal stagger={0.12} className="mt-14 grid gap-6 md:grid-cols-3">
          {[
            "customer happiness (CHI)",
            "repeat contacts",
            "complaint resolution",
          ].map((label) => (
            <div
              key={label}
              className="flex h-[200px] items-center justify-center rounded-2xl border border-dashed border-[var(--cog-line)] bg-[var(--cog-bg-alt)]"
            >
              <span className="case-study-label text-[var(--cog-muted)]">{label}</span>
            </div>
          ))}
        </Reveal>

        <Reveal className="mt-10 max-w-[760px]">
          <Body className="italic text-[var(--cog-muted)]">
            The operational telemetry above is directional. The full statistical tests are
            still running over a longer window, and adoption is where the value compounds.
          </Body>
        </Reveal>
      </Container>
    </section>
  );
}
