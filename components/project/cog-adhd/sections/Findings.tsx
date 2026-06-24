import { A, Container, Kicker, Title, Body } from "../ui";

const QUOTES = [
  {
    text: "Each week, I'm asked how my week's been, but all I remember is the last meeting I've had that day so we end up chatting about the first thing that comes to my mind",
    by: "@Cog clinic customer",
    tone: "green" as const,
  },
  {
    text: "Biggest challenge I face is a lack of engagement from my clients.",
    by: "@Cog clinic therapist",
    tone: "orange" as const,
  },
  {
    text: "I wish that I had a good sense of what day of the week I struggled with. I tried tracking it, especially when on medication, so then I know how things are going for me",
    by: "@Cog clinic customer",
    tone: "green" as const,
  },
];

const INSIGHTS = [
  {
    n: "01",
    title: "Defining needs and goals is crucial yet challenging",
    body: "Effective therapy relies on clients understanding their emotions and goals, but many struggle to express them, often giving vague responses like “I want to complete tasks more easily” because their needs aren’t fully clear.",
  },
  {
    n: "02",
    title: "session structure leads to unfocused therapy",
    body: "Sessions often start with “How’s your week been?”, often leading clients to recall recent events instead of key issues. This impacts the focus and outcomes of therapy.",
  },
  {
    n: "03",
    title: "clients' motivation dips Without Visible Progress",
    body: "Clients are driven by visible progress, but therapists lack structured tools to track it. Without consistent tracking, clients struggle to see improvements, leading to a lack of motivation.",
  },
  {
    n: "04",
    title: "therapists are drowning in administrative work",
    body: "Therapists handle extensive admin tasks including session summaries and risk assessments that can take 15–40 minutes per session, often unpaid. This extra workload contributes to burnout.",
  },
];

export function Findings() {
  return (
    <section data-section="Findings" className="py-16 md:py-24">
      <Container>
        <Kicker>Key research findings</Kicker>
        <Title>
          Gaps in connection,
          <br />
          lack of structure and resources
        </Title>
      </Container>

      {/* Affinity map — wide board, full bleed, scrollable on small screens */}
      <div className="mt-12 md:mt-16 overflow-x-auto">
        <div className="mx-auto w-full max-w-[1400px] px-4 md:px-8">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={A("image-19.png")}
            alt="Affinity map grouping research observations into themes such as establishing core needs, accountability, measuring progress, admin work, and risk assessment"
            className="w-full min-w-[900px] rounded-md border border-[var(--cog-line)]"
          />
        </div>
      </div>

      <Container>
        {/* Three quote cards */}
        <div className="mt-14 grid gap-5 md:grid-cols-3">
          {QUOTES.map((q, i) => (
            <figure
              key={i}
              className={`flex flex-col justify-between rounded-2xl p-6 ${
                q.tone === "green"
                  ? "bg-[var(--cog-mint)]"
                  : "bg-[var(--cog-orange)]"
              }`}
            >
              <blockquote
                className={`cog-callout border-0 pl-0 text-sm md:text-base ${
                  q.tone === "orange"
                    ? "text-white"
                    : "text-[var(--cog-ink)]"
                }`}
              >
                &ldquo;{q.text}&rdquo;
              </blockquote>
              <figcaption
                className={`cog-label mt-5 ${
                  q.tone === "orange"
                    ? "text-white/90"
                    : "text-[var(--cog-ink-soft)]"
                }`}
              >
                {q.by}
              </figcaption>
            </figure>
          ))}
        </div>

        {/* 4 insight cards — 2×2 grid */}
        <div className="mt-16 grid gap-x-12 gap-y-12 md:grid-cols-2">
          {INSIGHTS.map((ins) => (
            <div key={ins.n}>
              <p className="cog-label text-[var(--cog-muted)]">
                Insight #{ins.n}
              </p>
              <h3 className="cog-label mt-3 text-base md:text-lg text-[var(--cog-ink)]">
                {ins.title}
              </h3>
              <div className="mt-3 h-px w-full bg-[var(--cog-line)]" />
              <Body className="mt-4 text-[var(--cog-ink-soft)]">{ins.body}</Body>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
