import { Container, InsightCard, Kicker, Title } from "../ui";
import { Reveal } from "../Reveal";

/* AI workflows — promoted from an aside inside Research to a section like any
   other (Caroline 2026-08-18): Kicker (pink sparkle on its left) + Title,
   then the three tool cards (template InsightCards). Robot removed at her
   request same day. Heading "Accelerate under pressure" is Caroline's. */
export function AIWorkflows() {
  return (
    <section data-section="AIWorkflows" className="py-24">
      <Container>
        <Reveal>
          <Kicker>
            <span aria-hidden className="gw-sparkle">✦</span> AI workflows
          </Kicker>
          <Title className="mb-10">Accelerate under pressure</Title>
        </Reveal>
        <Reveal
          stagger={0.1}
          className="grid grid-cols-1 gap-8 md:grid-cols-3"
        >
          <InsightCard
            width="auto"
            height="auto"
            label="miro ai"
            title="Synthesise the boards"
          >
            Miro AI helped me synthesise the inherited boards&apos; content and
            get up to speed with research.
          </InsightCard>
          <InsightCard
            width="auto"
            height="auto"
            label="notebooklm"
            title="Query every transcript"
          >
            Loading all the interview transcripts into NotebookLM and querying
            it filled in the gaps.
          </InsightCard>
          <InsightCard
            width="auto"
            height="auto"
            label="figma make"
            title="Generate quick ideas"
          >
            Figma Make allowed for generating quick ideas that could be refined
            or discarded.
          </InsightCard>
        </Reveal>
      </Container>
    </section>
  );
}
