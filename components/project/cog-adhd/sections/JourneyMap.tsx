import { A, Container, Title, Body } from "../ui";
import { Reveal } from "../Reveal";

export function JourneyMap() {
  return (
    <section
      data-section="JourneyMap"
      className="pt-[120px] pb-0 bg-[var(--cog-bg-section)]"
    >
      <Container>
        <Reveal>
          <Title>
            CURRENT THERAPY PROCESS -
            <br />
            CLIENT JOURNEY MAP
          </Title>
        </Reveal>
      </Container>

      {/* Everything below the heading sits at 85% screen width (≤1700px) /
          75% (>1700px), centred. */}
      <div className="mx-auto w-[85%] min-[1700px]:w-[75%]">
        <Reveal
          stagger={0.12}
          className="grid gap-10 md:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)_minmax(0,1.4fr)] md:gap-12"
        >
          {/* Persona chip */}
          <div>
            <div className="w-[240px] max-w-full">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={A("image-20.png")}
                alt="Portrait of Katherine Bell, the persona for the journey map"
                className="h-auto w-full"
              />
            </div>
            <p className="mt-4 font-[family-name:var(--font-body)] text-xl font-bold text-[var(--dark-green)]">
              Katherine Bell
            </p>
            <Body className="mt-2 pl-8 text-sm italic">
              &ldquo;I need therapy with continuity, clear progress, and
              actionable insights readily available.&rdquo;
            </Body>
          </div>

          {/* Scenario */}
          <div>
            <p className="case-study-label">scenario</p>
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
            <p className="case-study-label">expectations</p>
            <ul className="mt-3 space-y-2 text-sm text-[var(--soft-ink)]">
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
        </Reveal>

        {/* Journey map table (exported image) */}
        <Reveal className="mt-12 w-full overflow-x-auto md:mt-16">
          <div className="min-w-[900px]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={A("cog-clinic-current-journey-map.png")}
              alt="Cog Clinic current therapy process journey map: stages, actions, thoughts, touchpoints, emotions and opportunities across choose, prepare, introduce, remember, recall and analyse phases"
              className="h-auto w-full"
            />
          </div>
        </Reveal>
      </div>
    </section>
  );
}
