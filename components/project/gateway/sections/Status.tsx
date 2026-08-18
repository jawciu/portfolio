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
            Gateway is currently in build with the engineering team. The impact
            thesis is shorter handover cycles, less rework and less debt from
            dragged handovers. The baseline is captured; the numbers land here
            after launch.
          </Body>
          <Body>
            {/* Customer outcomes — Caroline's project records, 2026-08-06 */}
            For customers, it means moving into a new home and setting up an
            energy account straight away, instead of waiting on a handover
            stuck in a spreadsheet, with a welcome pack in days rather than
            weeks.
          </Body>
        </Reveal>
        {/* Internal stakeholder sentiment, anonymised to roles — TODO(caro):
            confirm whether names can be shown. */}
        <Reveal stagger={0.1} className="mt-12 max-w-[680px] space-y-8">
          <figure>
            <blockquote className="case-study-quote">
              &ldquo;Isn&apos;t it wonderful, bring it on, let&apos;s get this
              as soon as we possibly can.&rdquo;
            </blockquote>
            <figcaption className="mt-2 text-[14px] text-[var(--cog-muted)]">
              @Debt team, E.ON Next
            </figcaption>
          </figure>
          <figure>
            <blockquote className="case-study-quote">
              &ldquo;Exactly what I would want as a customer.&rdquo;
            </blockquote>
            <figcaption className="mt-2 text-[14px] text-[var(--cog-muted)]">
              @Customer journey team, E.ON Next
            </figcaption>
          </figure>
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
