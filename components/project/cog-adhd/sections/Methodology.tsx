import {
  A,
  Container,
  Kicker,
  Title,
  Body,
  CaseStudyCallout,
  InsightCard,
} from "../ui";
import { Reveal } from "../Reveal";

const PROBLEMS = [
  {
    n: "01",
    title: "Defining needs and goals is crucial yet challenging",
    body: "Access to symptoms history would allow users to identify patterns enabling more targeted goals.",
  },
  {
    n: "02",
    title: "session structure leads to unfocused therapy",
    body: "Users could use their check in data to share relevant information each week, streamlining session focus.",
  },
  {
    n: "03",
    title: "clients' motivation dips Without Visible Progress",
    body: "Check in analytics could help users monitor symptoms and see their progress more clearly.",
  },
];

// Hand-drawn blue-grey wireframe sketch frames (the PDF's "exploratory sketches"
// row). Each PNG is a composite of 3 frames; left→right the PDF reads
// Your Stats → Check in history → Analytics = image-29 → image-28 → image-30.
const SKETCHES = [
  "image-29.png",
  "image-28.png",
  "image-30.png",
];

export function Methodology() {
  return (
    <section data-section="Methodology" className="pt-[120px] pb-0 bg-[var(--cog-bg-section)]">
      <Container>
        <Reveal stagger={0.08}>
          <Kicker>METHODOLOGY</Kicker>
          <Title>
            INVITING ENGINEERS
            <br />
            TO DISCUSSIONS EARLY ON
          </Title>
        </Reveal>

        <Reveal>
          <Body className="mt-6 max-w-2xl text-[var(--cog-muted)]">
            With this big vision in place, I focused on prioritising ideas.
            Transforming check in entries (symptoms, emotions, wins, and daily
            journals) into actionable insights would address key issues
            identified in the research.
          </Body>
        </Reveal>
      </Container>

      {/* PROBLEM cards — wider band (outside the 1080 column) so all 3 fit on
          one row on desktop; wraps gracefully on narrower screens. */}
      <Reveal
        stagger={0.12}
        className="mx-auto mt-16 flex max-w-[1280px] flex-wrap justify-center gap-9 px-6"
      >
        {PROBLEMS.map((p) => (
          <InsightCard
            key={p.n}
            label={`Problem #${p.n}`}
            title={p.title}
            width={380}
            height={260}
          >
            {p.body}
          </InsightCard>
        ))}
      </Reveal>

      <Container>
        {/* Firebase callout */}
        <div className="mt-16">
          <CaseStudyCallout stream>
            Early on, I worked with engineers to figure out what was realistic.
            Our backend setup in Firebase couldn&apos;t support complex data
            aggregation without a major restructure, so we went with a
            lightweight weekly check-in history to launch fast and learn quickly.
          </CaseStudyCallout>
        </div>
      </Container>

      {/* exploratory sketches — full-bleed horizontal row of hand-drawn
          wireframe frames. Mono label sits top-right above the row, underlined
          in green (matches the PDF band). */}
      <div className="mt-16 md:mt-20">
        <Container>
          <p className="cog-label inline-block float-right border-b-2 border-[var(--cog-green)] pb-1 text-[var(--cog-ink)]">
            exploratory sketches
          </p>
          <div className="clear-both" />
        </Container>

        {/* Above 1200px the frames hold their large (≈1800-width) size and the
            centred row is CROPPED by the screen edges as it narrows (overflow
            clipped, both outer frames chopped). Below 1200px they start shrinking
            to fit (flex-1) so they stay usable on smaller screens. */}
        <Reveal
          stagger={0.12}
          className="mt-6 flex items-stretch justify-center gap-4 overflow-hidden px-4 pb-2 max-sm:gap-3 max-sm:px-0 sm:gap-6 min-[1200px]:px-0"
        >
          {SKETCHES.map((file, i) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              key={file}
              src={A(file)}
              alt={`Exploratory wireframe sketches ${i + 1}`}
              className="h-auto min-w-0 flex-1 object-contain max-sm:w-[48%] max-sm:flex-none min-[1200px]:w-[568px] min-[1200px]:flex-none"
            />
          ))}
        </Reveal>
      </div>
    </section>
  );
}
