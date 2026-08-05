import { Container, Kicker, Title, Body, Stats } from "../ui";
import { Reveal } from "../Reveal";

/* Honest status + impact hypothesis. Mirrors how the AI design system is
   presented as "in FE build". Swap the hypothesis for measured numbers
   post-launch — that's what turns this study into a Wiki-Whisperer-grade
   numbers story. */
export function Status() {
  return (
    <section data-section="Status" className="py-24">
      <Container>
        <Reveal>
          <Kicker>where it stands</Kicker>
          <Title className="mb-10">In build</Title>
        </Reveal>
        <Reveal className="max-w-[680px] space-y-5">
          <Body>
            {/* TODO(caro): draft: */}
            Gateway is currently in build with the engineering team. The impact
            thesis: shorter handover cycles, less rework, less debt from dragged
            handovers. The baseline is captured; the numbers land here after
            launch.
          </Body>
        </Reveal>
        {/* TODO(caro): replace with REAL baseline → target stats when known. */}
        <Stats
          items={[
            { n: "TODO", caption: "baseline: avg handover cycle" },
            { n: "TODO", caption: "baseline: submissions needing rework" },
            { n: "TODO", caption: "target after launch" },
          ]}
        />
      </Container>
    </section>
  );
}
