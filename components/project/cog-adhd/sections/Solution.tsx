import { A, Container, Kicker, Title, Body, CaseStudyCallout } from "../ui";
import { Reveal } from "../Reveal";

/** The four question prompts, each paired with its orange icon-on-mint card. */
const PROMPTS = [
  { icon: "image-33.svg", text: "How has this week been overall?" },
  { icon: "image-34.svg", text: "Which days were the hardest for me?" },
  { icon: "image-35.svg", text: "What made those days so challenging?" },
  { icon: "image-36.svg", text: "What should I talk to my therapist about?" },
];

/** Bold mono feature label ending in a ">" chevron, e.g. "weekly overview graph >". */
function FeatureLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="font-[family-name:var(--font-mono)] text-[15px] font-bold lowercase tracking-tight text-[var(--cog-ink)]">
      {children} <span className="text-[var(--cog-green)]">&gt;</span>
    </p>
  );
}

export function Solution() {
  return (
    <section data-section="Solution" className="pt-[120px] pb-0 bg-[var(--cog-bg-section)]">
      <Container>
        <Reveal stagger={0.08}>
          <Kicker>Solution</Kicker>
          <Title>User Journey Shaping Clarity</Title>
        </Reveal>
        <Reveal className="mt-6 md:mt-8 max-w-[560px]">
          <Body>
            I focused my redesign on improving the user&rsquo;s journey when
            reviewing their check in data. The goal was to help users move
            seamlessly from identifying key pain points to diving deeper into
            specific insights.
          </Body>
        </Reveal>

        {/* Persona chip + 4 question prompts */}
        <Reveal
          stagger={0.12}
          className="mt-14 md:mt-20 flex flex-col gap-10 md:flex-row md:items-start md:gap-12"
        >
          {/* Katherine Bell persona */}
          <div className="flex shrink-0 flex-col items-start text-left md:w-[160px]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={A("image-32.png")}
              alt="Portrait of Katherine Bell, the therapy-client persona"
              className="w-[140px] h-auto select-none"
            />
            <p className="mt-3 font-[family-name:var(--font-body)] text-base font-bold text-[var(--cog-ink)]">
              Katherine Bell
            </p>
            <p className="mt-1 font-[family-name:var(--font-body)] text-[13px] text-[var(--cog-muted)]">
              Therapy Client
            </p>
          </div>

          {/* Question prompts, one per upcoming feature */}
          <div className="grid grid-cols-2 gap-x-6 gap-y-8 sm:grid-cols-4 md:flex-1">
            {PROMPTS.map((p) => (
              <div key={p.text} className="flex flex-col items-start">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={A(p.icon)}
                  alt=""
                  aria-hidden="true"
                  className="w-[140px] h-auto select-none"
                />
                <p className="case-study-quote mt-3">
                  &ldquo;{p.text}&rdquo;
                </p>
              </div>
            ))}
          </div>
        </Reveal>

        {/* Cluster 1 — mockups left, copy right */}
        <Reveal
          stagger={0.14}
          className="mt-16 md:mt-24 grid grid-cols-1 items-center gap-10 md:grid-cols-2 md:gap-14"
        >
          {/* Overview bar chart + overlapping Daily card — smaller + spread apart */}
          <div className="relative mx-auto w-full max-w-[460px]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={A("image-38.svg")}
              alt="Weekly overview screen plotting ADHD scores over the last 7 days as a bar chart"
              className="w-[60%] h-auto select-none rounded-[20px] border border-[#E3E2DA] shadow-[1px_1px_10px_2px_rgba(212,210,210,0.25)]"
            />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={A("image-37.svg")}
              alt="Daily check-in detail for Wednesday 11th Dec showing 'Your Highs' with mood and restlessness ratings"
              className="absolute right-0 top-[16%] w-[48%] h-auto select-none rounded-[20px] border border-[#E3E2DA] shadow-[1px_1px_10px_2px_rgba(212,210,210,0.25)]"
            />
          </div>

          <div className="space-y-10">
            <div className="space-y-3">
              <FeatureLabel>weekly overview graph</FeatureLabel>
              <Body>
                I designed a visual representation of the week to help users
                quickly understand key patterns. At a glance, users can spot the
                worst days and identify areas to explore further.
              </Body>
            </div>
            <div className="space-y-3">
              <FeatureLabel>two-tab view</FeatureLabel>
              <Body>
                To make navigation easier, I introduced a two-tab system that
                enables users to switch between a high-level weekly summary and
                detailed check-in data.
              </Body>
            </div>
          </div>
        </Reveal>

        {/* Cluster 2 — copy left, mockups right */}
        <Reveal
          stagger={0.14}
          className="mt-16 md:mt-24 grid grid-cols-1 items-center gap-10 md:grid-cols-2 md:gap-14"
        >
          <div className="order-2 space-y-10 md:order-1">
            <div className="space-y-3">
              <FeatureLabel>symptom ranking</FeatureLabel>
              <Body>
                To make the data more digestible, I grouped symptoms into
                categories: highs, lows, and neutrals. This provided clarity and
                allowed users to focus on what mattered most.
              </Body>
            </div>
            <div className="space-y-3">
              <FeatureLabel>journal and wins entries</FeatureLabel>
              <Body>
                Journals add valuable context by capturing what was happening on
                specific days, while &ldquo;wins&rdquo; serve as positive
                reinforcement, helping users stay motivated.
              </Body>
            </div>
          </div>

          {/* Journal/wins card + overlapping Highs/Lows card */}
          <div className="relative order-1 mx-auto w-full max-w-[420px] md:order-2">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={A("image-40.png")}
              alt="Journal entries screen with your journal comments, wins, and a 'You practiced self-help!' note"
              className="w-[64%] h-auto select-none rounded-[20px] border border-[#E3E2DA] shadow-[1px_1px_10px_2px_rgba(212,210,210,0.25)]"
            />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={A("image-39.svg")}
              alt="Symptom ranking screen grouping the week into Your Highs, Your Lows, and Your Neutral Zone"
              className="absolute right-[-14%] top-[-24%] w-[58%] h-auto select-none rounded-[20px] border border-[#E3E2DA] shadow-[1px_1px_10px_2px_rgba(212,210,210,0.25)] max-lg:right-0 max-lg:top-[-16%]"
            />
          </div>
        </Reveal>

        {/* Batch-booking callout */}
        <div className="mt-20 md:mt-28 max-w-[760px]">
          <CaseStudyCallout stream>
            In parallel, I also addressed session booking drop-off by introducing
            a batch booking feature, allowing users to schedule multiple therapy
            sessions at once.
          </CaseStudyCallout>
        </div>
      </Container>
    </section>
  );
}
