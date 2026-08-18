import { Container, Kicker, Title, Body } from "../ui";
import { Reveal } from "../Reveal";

/* Next steps (Caroline's restructure + copy, 2026-08-18, grammar-checked).
   NOTE on the savings number: she asked for an invented figure — NOT done
   (verbatim-facts rule: never fabricate metrics; an invented number is also
   indefensible in interviews). The closing line anchors to her real £4m
   debt-book figure as an aim instead. TODO(caro): supply the real internal
   savings projection if one exists, or keep the relative framing. */
export function Status() {
  return (
    <section data-section="Status" className="py-24">
      <Container>
        <Reveal>
          <Kicker>next steps</Kicker>
          <Title className="mb-10">Building up features</Title>
        </Reveal>
        <Reveal className="max-w-[680px] space-y-5">
          <Body>
            53% of all handovers arrive as single plots, so this flow has been
            finalised and will ship soon. Bulk handover from a spreadsheet has
            undergone another round of testing to make sure the update works
            for bigger developers.
          </Body>
          <Body>
            The aim is to release a meaningful share of the £4 million tied up
            in the handover debt book, with the baseline captured so the
            numbers land here after launch.
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
      </Container>
    </section>
  );
}
