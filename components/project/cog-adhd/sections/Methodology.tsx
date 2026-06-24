import { A, Container, Kicker, Title, Body, Callout } from "../ui";

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
    <section data-section="Methodology" className="py-16 md:py-24">
      <Container>
        <Kicker>METHODOLOGY</Kicker>
        <Title>
          INVITING ENGINEERS
          <br />
          TO DISCUSSIONS EARLY ON
        </Title>

        <Body className="mt-6 max-w-2xl text-[var(--cog-muted)]">
          With this big vision in place, I focused on prioritising ideas.
          Transforming check in entries (symptoms, emotions, wins, and daily
          journals) into actionable insights would address key issues identified
          in the research.
        </Body>

        {/* PROBLEM cards — soft cream panels, generous top padding */}
        <div className="mt-16 grid grid-cols-1 gap-6 md:grid-cols-3">
          {PROBLEMS.map((p) => (
            <div
              key={p.n}
              className="rounded-lg bg-[var(--cog-bg-alt)] p-7 md:p-8"
            >
              <p className="cog-label text-[var(--cog-muted)]">
                problem #{p.n}
              </p>
              <h3 className="cog-label mt-4 text-[var(--cog-ink)]">{p.title}</h3>
              <Body className="mt-6 text-[var(--cog-ink-soft)]">{p.body}</Body>
            </div>
          ))}
        </div>

        {/* Firebase callout */}
        <Callout>
          Early on, I worked with engineers to figure out what was realistic. Our
          backend setup in Firebase couldn&apos;t support complex data aggregation
          without a major restructure, so we went with a lightweight weekly
          check-in history to launch fast and learn quickly.
        </Callout>
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

        <div className="mt-6 flex items-stretch gap-6 overflow-x-auto px-6 pb-2 md:px-10">
          {SKETCHES.map((file, i) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              key={file}
              src={A(file)}
              alt={`Exploratory wireframe sketches ${i + 1}`}
              className="h-56 w-auto shrink-0 md:h-72"
            />
          ))}
        </div>
      </div>
    </section>
  );
}
