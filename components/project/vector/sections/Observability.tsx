import { A, Container, Kicker, Title, Body, CaseStudyCallout, ShotRow } from "../ui";
import { Reveal } from "../Reveal";

export function Observability() {
  return (
    <section data-section="Observability" className="pt-[120px] pb-0">
      <Container>
        <Reveal>
          <Kicker>Observability</Kicker>
          <Title>
            Every call logged,
            <br />
            every failure visible
          </Title>
        </Reveal>

        <Reveal className="max-w-[760px] space-y-5">
          <Body>
            AI features fail quietly, so Vector ships with its own admin dashboard. Every
            Claude call is rolled up by feature, with calls, errors, total cost, p95
            latency and cache hit rate, and each individual call keeps its full token
            breakdown, dollar cost, duration and Anthropic request id.
          </Body>
          <Body>
            The pipeline view keeps every meeting event, filterable by processed, ambiguous,
            stuck or errored. Expanding one shows the extraction, the tool calls and the
            drafts it produced, next to the full transcript. When something goes wrong, I
            can see exactly where.
          </Body>
        </Reveal>

        <ShotRow
          src={A("admin-usage.png")}
          alt="Vector's AI admin dashboard: per-feature cost, latency and cache-hit stats, and a log of every Claude call with its token breakdown."
          caption="The AI admin. Cost, latency and cache hits by feature, and a log of every call."
          speed={-22}
          className="mt-8"
        />

        <Reveal className="mt-14">
          <CaseStudyCallout stream>
            {"This is the groundwork for the evals on the roadmap. Accuracy scoring only works if every call and every draft is already on record."}
          </CaseStudyCallout>
        </Reveal>
      </Container>
    </section>
  );
}
