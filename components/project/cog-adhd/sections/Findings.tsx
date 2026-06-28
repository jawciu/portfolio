import { A, Container, Kicker, Title, InsightCard } from "../ui";
import { Reveal } from "../Reveal";
import { StreamingQuote } from "../StreamingQuote";

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
    title: (
      <>
        clients&apos; motivation dips
        <br />
        without visible progress
      </>
    ),
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
    <section data-section="Findings" className="pt-[120px] pb-0">
      <Container>
        <Reveal stagger={0.08}>
          <Kicker>Key research findings</Kicker>
          <Title>
            Gaps in connection,
            <br />
            lack of structure and resources
          </Title>
        </Reveal>
      </Container>

      {/* Affinity map — full-bleed board cropped in height; the quote post-its
          overlap its lower edge (matches the original Framer layout). */}
      <div className="relative mt-10 md:mt-14">
        <Reveal className="w-full overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={A("image-19.png")}
            alt="Affinity map grouping research observations into themes such as establishing core needs, accountability, measuring progress, admin work, and risk assessment"
            className="h-[clamp(240px,34vw,400px)] w-full object-cover object-top"
          />
        </Reveal>

        <Container>
          {/* Quote post-its — pulled up to sit over the board */}
          <Reveal
            stagger={0.12}
            className="-mt-20 grid justify-items-center gap-5 md:-mt-28 md:grid-cols-3"
          >
            {QUOTES.map((q, i) => (
              <figure
                key={i}
                className={`flex h-[300px] w-[300px] max-w-full flex-col p-7 shadow-[0_8px_24px_rgba(0,0,0,0.12)] ${
                  q.tone === "green"
                    ? "bg-[var(--cog-postit-mint)]"
                    : "bg-[var(--cog-postit-orange)]"
                }`}
              >
                <StreamingQuote
                  as="blockquote"
                  className="case-study-quote flex flex-1 items-center"
                >
                  {`“${q.text}”`}
                </StreamingQuote>
                <figcaption className="text-right text-sm text-[var(--cog-ink-soft)]">
                  {q.by}
                </figcaption>
              </figure>
            ))}
          </Reveal>
        </Container>
      </div>

      <Container>
        {/* 4 insight cards — 2×2 grid of fixed 420×320 cards on #FAFAFA, each with a
            mono label, a case-study-label title and a green (#19a072) divider. */}
        <Reveal
          stagger={0.12}
          className="mt-16 flex flex-wrap justify-center gap-9"
        >
          {INSIGHTS.map((ins) => (
            <InsightCard key={ins.n} label={`Insight #${ins.n}`} title={ins.title}>
              {ins.body}
            </InsightCard>
          ))}
        </Reveal>
      </Container>
    </section>
  );
}
