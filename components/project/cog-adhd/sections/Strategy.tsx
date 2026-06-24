import { A, Body, Callout, Container, Kicker, Title } from "../ui";

/** small mono caption tag used on the dashboard concept mockups */
function DesignIdeaTag() {
  return (
    <span className="cog-label inline-block self-end text-[var(--cog-green)]">
      design idea
    </span>
  );
}

export function Strategy() {
  return (
    <section data-section="Strategy" className="py-16 md:py-24">
      <Container>
        <Kicker>Strategy</Kicker>
        <Title>
          Transforming therapy
          <br />
          with AI and data-driven solutions
        </Title>

        <div className="mt-8 md:mt-10">
          <Callout>
            The issues I uncovered revealed many opportunities for improvement.
            I began to imagine, what could a big picture product vision for Cog
            clinic look like?
          </Callout>
        </div>

        {/* Body column + the daily-practice card cluster */}
        <div className="mt-12 grid gap-12 md:mt-16 md:grid-cols-2 md:items-center md:gap-16">
          <div className="space-y-6">
            <Body>
              Cog allows users to track symptoms, emotions, wins and add daily
              journal entries for context.
            </Body>
            <Body>
              Why not use these tools to give users a clear, insightful view of
              their progress and overall well-being?
            </Body>
            <Body>
              This would also give therapists a better understanding of their
              patient&rsquo;s health and areas to focus on.
            </Body>
            <Body>
              With structured data available before sessions, patients
              wouldn&rsquo;t have to rely on memory, and seeing their progress
              could be a huge motivation boost.
            </Body>
          </div>

          {/* overlapping product cards: Hi Katherine + Focus + Punctuality */}
          <div className="relative mx-auto w-full max-w-md">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={A("image-23.svg")}
              alt="Cog app screen — Hi Katherine, your daily practice with ADHD strategies hub and daily check-in"
              className="relative z-10 ml-auto w-[72%] drop-shadow-sm"
            />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={A("image-21.svg")}
              alt="Cog app card — How is your focus?"
              className="absolute bottom-0 left-0 z-20 w-[46%] drop-shadow-md"
            />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={A("image-22.svg")}
              alt="Cog app card — How is your punctuality?"
              className="absolute bottom-[-6%] left-[34%] z-0 w-[46%] drop-shadow-sm"
            />
          </div>
        </div>

        {/* Centralised hub — concept dashboard 1 */}
        <div className="mt-20 md:mt-28">
          <Body className="mx-auto max-w-2xl">
            Additionally, a centralised hub would keep therapy organised; session
            summaries, homework, communication, reminders, and an archive all in
            one place, so nothing ever gets lost.
          </Body>
          <figure className="mt-8 flex flex-col">
            <DesignIdeaTag />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={A("image-26.svg")}
              alt="Cog Clinic dashboard concept — Katherine Bell progress view with symptom-progress line chart and symptom-control donut charts"
              className="mt-3 w-full rounded-2xl border border-[var(--cog-line)] bg-[var(--cog-bg-alt)] shadow-sm"
            />
          </figure>
        </div>

        {/* Automating admin — concept dashboard 2 */}
        <div className="mt-20 md:mt-28">
          <Body className="mx-auto max-w-2xl">
            Automating some of the admin work could further reduce clinician
            burnout. For example, after each session, AI could draft a session
            summary and risk assessment based on the user&rsquo;s data, allowing
            therapists to simply review it.
          </Body>
          <figure className="mt-8 flex flex-col">
            <DesignIdeaTag />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={A("image-27.svg")}
              alt="Cog Clinic dashboard concept — Katherine Bell session view with an AI-drafted session summary"
              className="mt-3 w-full rounded-2xl border border-[var(--cog-line)] bg-[var(--cog-bg-alt)] shadow-sm"
            />
          </figure>
        </div>
      </Container>
    </section>
  );
}
