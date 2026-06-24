import { A, Container, Kicker, Title, Body, Statement } from "../ui";

/** The four question prompts, each paired with its orange icon-on-mint card. */
const PROMPTS = [
  { icon: "image-22.svg", text: "How has this week been overall?" },
  { icon: "image-1.svg", text: "Which days were the hardest for me?" },
  { icon: "image-2.svg", text: "What made those days so challenging?" },
  { icon: "image-4.svg", text: "What should I talk to my therapist about?" },
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
    <section data-section="Solution" className="py-16 md:py-24">
      <Container>
        <Kicker>Solution</Kicker>
        <Title className="mt-3 md:mt-4">User Journey Shaping Clarity</Title>
        <div className="mt-6 md:mt-8 max-w-[560px]">
          <Body>
            I focused my redesign on improving the user&rsquo;s journey when
            reviewing their check in data. The goal was to help users move
            seamlessly from identifying key pain points to diving deeper into
            specific insights.
          </Body>
        </div>

        {/* Persona chip + 4 question prompts */}
        <div className="mt-14 md:mt-20 flex flex-col gap-10 md:flex-row md:items-start md:gap-12">
          {/* Katherine Bell persona */}
          <div className="flex shrink-0 flex-col items-center text-center md:w-[160px]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={A("image-20.svg")}
              alt="Portrait of Katherine Bell, the therapy-client persona"
              className="w-[92px] h-[92px] select-none"
            />
            <p className="mt-3 cog-label">Katherine Bell</p>
            <p className="mt-1 font-[family-name:var(--font-body)] text-[12px] text-[var(--cog-muted)]">
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
                  className="h-[58px] w-auto select-none"
                />
                <p className="mt-2 font-[family-name:var(--font-mono)] text-[12px] italic leading-relaxed text-[var(--cog-muted)]">
                  &ldquo;{p.text}&rdquo;
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Cluster 1 — mockups left, copy right */}
        <div className="mt-16 md:mt-24 grid grid-cols-1 items-center gap-10 md:grid-cols-2 md:gap-14">
          {/* Overview bar chart + overlapping Daily card */}
          <div className="relative mx-auto w-full max-w-[420px]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={A("image-38.svg")}
              alt="Weekly overview screen plotting ADHD scores over the last 7 days as a bar chart"
              className="w-[78%] h-auto select-none"
            />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={A("image-37.svg")}
              alt="Daily check-in detail for Wednesday 11th Dec showing 'Your Highs' with mood and restlessness ratings"
              className="absolute right-0 top-[6%] w-[60%] h-auto select-none drop-shadow-sm"
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
        </div>

        {/* Cluster 2 — copy left, mockups right */}
        <div className="mt-16 md:mt-24 grid grid-cols-1 items-center gap-10 md:grid-cols-2 md:gap-14">
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
              src={A("image-40.svg")}
              alt="Journal entries screen with your journal comments, wins, and a 'You practiced self-help!' note"
              className="w-[64%] h-auto select-none"
            />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={A("image-39.svg")}
              alt="Symptom ranking screen grouping the week into Your Highs, Your Lows, and Your Neutral Zone"
              className="absolute right-0 top-[14%] w-[58%] h-auto select-none drop-shadow-sm"
            />
          </div>
        </div>

        {/* Batch-booking statement */}
        <div className="mt-20 md:mt-28 max-w-[760px]">
          <Statement>
            In parallel, I also addressed session booking drop-off by introducing
            a batch booking feature, allowing users to schedule multiple therapy
            sessions at once.
          </Statement>
        </div>
      </Container>
    </section>
  );
}
