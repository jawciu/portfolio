import { A, Body, CaseStudyCallout, Container, Kicker, Title } from "../ui";
import { Reveal } from "../Reveal";
import { Parallax } from "../Parallax";

/** small mono caption tag used on the dashboard concept mockups */
function DesignIdeaTag() {
  return (
    <span className="cog-label self-end border-b-2 border-[var(--green)] pb-2 pl-[84px] pr-3 text-right text-[var(--cog-ink)]">
      design idea
    </span>
  );
}

/* Overlapping product-card clusters. Sizes are the exact px Caroline specified;
   the whole cluster scales as one unit via the `--cs` custom property (so the
   overlap/aspect stay identical) and only goes full-size at lg. Every card gets a
   20px radius, a 1px #E3E2DA border and a soft #D4D2D2 @25% shadow. */
type StackCardData = {
  src: string;
  alt: string;
  w: number;
  h: number;
  top: number;
  left: number;
  z: number;
};

const VISION_STACK: StackCardData[] = [
  { src: "image-23.png", alt: "Cog home screen - Hi Katherine, your daily practice", w: 320, h: 523, top: 0, left: 300, z: 10 },
  { src: "image-21.png", alt: "Cog check-in - How is your focus?", w: 208, h: 321, top: 150, left: 0, z: 0 },
  { src: "image-22.png", alt: "Cog check-in - How is your punctuality?", w: 208, h: 320, top: 235, left: 170, z: 20 },
];
const VISION_STACK_W = 620;
const VISION_STACK_H = 555;

const JOURNAL_STACK: StackCardData[] = [
  { src: "image-24.png", alt: "Cog journal - What went well today?", w: 320, h: 523, top: 0, left: 0, z: 0 },
  { src: "image-25.png", alt: "Cog journal - What's been happening?", w: 300, h: 246, top: 55, left: 230, z: 10 },
];
const JOURNAL_STACK_W = 530;
const JOURNAL_STACK_H = 523;

function CardStack({
  cards,
  w,
  h,
}: {
  cards: StackCardData[];
  w: number;
  h: number;
}) {
  const u = (n: number) => `calc(var(--cs) * ${n}px)`;
  return (
    <div
      className="relative shrink-0 [--cs:0.5] min-[420px]:[--cs:0.62] sm:[--cs:0.8] lg:[--cs:1]"
      style={{ width: u(w), height: u(h) }}
    >
      {cards.map((c) => (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          key={c.src}
          src={A(c.src)}
          alt={c.alt}
          className="absolute rounded-[20px] border border-[#E3E2DA] object-cover shadow-[1px_1px_10px_2px_rgba(212,210,210,0.25)]"
          style={{
            width: u(c.w),
            height: u(c.h),
            top: u(c.top),
            left: u(c.left),
            zIndex: c.z,
          }}
        />
      ))}
    </div>
  );
}

export function Strategy() {
  return (
    <section data-section="Strategy" className="pt-[120px] pb-0 bg-[var(--cog-bg-section)]">
      <Container>
        <Reveal stagger={0.08}>
          <Kicker>Strategy</Kicker>
          <Title>
            Transforming therapy
            <br />
            with AI and data-driven solutions
          </Title>
        </Reveal>

        <div className="mt-8 md:mt-10">
          <CaseStudyCallout stream>
            The issues I uncovered revealed many opportunities for improvement.
            I began to imagine, what could a big picture product vision for Cog
            clinic look like?
          </CaseStudyCallout>
        </div>

        {/* Row 1 — copy left, daily-practice card cluster right */}
        <Reveal
          stagger={0.14}
          className="mt-12 flex flex-col gap-12 md:mt-16 lg:grid lg:grid-cols-[1fr_auto] lg:items-center lg:gap-14"
        >
          <div className="space-y-6">
            <Body>
              Cog allows users to track symptoms, emotions, wins and add daily
              journal entries for context.
            </Body>
            <Body>
              Why not use these tools to give users a clear, insightful view of
              their progress and overall well-being?
            </Body>
          </div>
          <div className="flex justify-center lg:justify-end">
            <Parallax speed={40}>
              <CardStack cards={VISION_STACK} w={VISION_STACK_W} h={VISION_STACK_H} />
            </Parallax>
          </div>
        </Reveal>

        {/* Row 2 — journal card cluster left, copy right */}
        <Reveal
          stagger={0.14}
          className="mt-12 flex flex-col gap-12 md:mt-16 lg:grid lg:grid-cols-[auto_1fr] lg:items-center lg:gap-14"
        >
          <div className="flex justify-center max-sm:order-2 lg:justify-start">
            <Parallax speed={-32}>
              <CardStack cards={JOURNAL_STACK} w={JOURNAL_STACK_W} h={JOURNAL_STACK_H} />
            </Parallax>
          </div>
          <div className="space-y-6 max-sm:order-1">
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
        </Reveal>

        {/* Centralised hub — concept dashboard 1 */}
        <Reveal className="mt-20 md:mt-28">
          <Body className="w-[510px] max-w-full">
            Additionally, a centralised hub would keep therapy organised; session
            summaries, homework, communication, reminders, and an archive all in
            one place, so nothing ever gets lost.
          </Body>
          <figure className="mt-3 flex flex-col">
            <DesignIdeaTag />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={A("image-26.png")}
              alt="Cog Clinic dashboard concept - Katherine Bell progress view with symptom-progress line chart and symptom-control donut charts"
              className="mt-3 w-full rounded-[20px] border border-[#E3E2DA] bg-[var(--cog-bg-alt)] shadow-[1px_1px_10px_2px_rgba(212,210,210,0.25)]"
            />
          </figure>
        </Reveal>

        {/* Automating admin — concept dashboard 2 */}
        <Reveal className="mt-20 md:mt-28">
          <Body className="w-[510px] max-w-full">
            Automating some of the admin work could further reduce clinician
            burnout. For example, after each session, AI could draft a session
            summary and risk assessment based on the user&rsquo;s data, allowing
            therapists to simply review it.
          </Body>
          <figure className="mt-3 flex flex-col">
            <DesignIdeaTag />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={A("image-27.png")}
              alt="Cog Clinic dashboard concept - Katherine Bell session view with an AI-drafted session summary"
              className="mt-3 w-full rounded-[20px] border border-[#E3E2DA] bg-[var(--cog-bg-alt)] shadow-[1px_1px_10px_2px_rgba(212,210,210,0.25)]"
            />
          </figure>
        </Reveal>
      </Container>
    </section>
  );
}
