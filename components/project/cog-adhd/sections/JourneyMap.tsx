import { A, Container, Title, Body } from "../ui";

export function JourneyMap() {
  return (
    <section
      data-section="JourneyMap"
      className="py-16 md:py-24 bg-[var(--cog-bg)]"
    >
      <Container>
        <Title className="text-2xl md:text-3xl">
          CURRENT THERAPY PROCESS - CLIENT JOURNEY MAP
        </Title>

        <div className="mt-10 grid gap-10 md:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)_minmax(0,1.4fr)] md:gap-12">
          {/* Persona chip */}
          <div>
            <div className="h-28 w-28 overflow-hidden rounded-full">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={A("image-2.svg")}
                alt="Portrait of Katherine Bell, the persona for the journey map"
                className="h-full w-full object-cover"
              />
            </div>
            <p className="cog-label mt-4 text-[var(--cog-green)]">
              Katherine Bell
            </p>
            <Body className="mt-2 text-sm">
              &ldquo;I need therapy with continuity, clear progress, and
              actionable insights readily available.&rdquo;
            </Body>
          </div>

          {/* Scenario */}
          <div>
            <p className="cog-label text-[var(--cog-muted)]">scenario</p>
            <Body className="mt-3 text-sm">
              Katherine is successful at work but struggles to balance it with
              her personal life and mental health, often feeling burnout. She
              wants to understand and manage her ADHD to feel less exhausted and
              anxious. Previous therapy felt chaotic and unexpected, leaving her
              unmotivated and uncertain about any progress.
            </Body>
          </div>

          {/* Expectations */}
          <div>
            <p className="cog-label text-[var(--cog-muted)]">expectations</p>
            <ul className="cog-body mt-3 space-y-2 text-sm">
              <li className="flex gap-2">
                <span className="text-[var(--cog-green)]">·</span>
                <span>
                  She wants to manage her ADHD effectively and work with a
                  therapist she can build rapport with.
                </span>
              </li>
              <li className="flex gap-2">
                <span className="text-[var(--cog-green)]">·</span>
                <span>
                  She seeks structured therapy with clear progress tracking to
                  stay motivated.
                </span>
              </li>
              <li className="flex gap-2">
                <span className="text-[var(--cog-green)]">·</span>
                <span>
                  She hopes her therapist will help identify key focus areas,
                  reducing the burden of recall.
                </span>
              </li>
            </ul>
          </div>
        </div>
      </Container>

      {/* Full-width journey map table (exported image) */}
      <div className="mt-12 w-full overflow-x-auto md:mt-16">
        <div className="min-w-[900px] px-4 md:px-8">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={A("cog-clinic-current-journey-map.svg")}
            alt="Cog Clinic current therapy process journey map: stages, actions, thoughts, touchpoints, emotions and opportunities across choose, prepare, introduce, remember, recall and analyse phases"
            className="h-auto w-full"
          />
        </div>
      </div>
    </section>
  );
}
