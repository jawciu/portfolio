import { Container, Kicker, Title, Body } from "../ui";
import { Reveal } from "../Reveal";
import { StreamingQuote } from "../StreamingQuote";

const WINS: { label: string; body: string; quote: string }[] = [
  {
    label: "high confidence >",
    body: "They called V2 'miles better' and trusted it with complex, multi-step tasks.",
    quote:
      "I find it's a lot more streamlined and a lot more accurate. No matter what you type, you get good information.",
  },
  {
    label: "structured answers >",
    body: "The scannable layout let them read while speaking to a customer.",
    quote:
      "I can actually read step-by-step instead of reading a massive paragraph.",
  },
  {
    label: "reduced reliance >",
    body: "The tool became a genuine second brain, quieting the constant asks for help.",
    quote:
      "It has information which most people in the office probably couldn't answer without asking someone in the field.",
  },
];

export function Wins() {
  return (
    <section data-section="Wins" className="pt-[120px] pb-0">
      <Container>
        <Reveal>
          <Kicker>Big wins</Kicker>
          <Title>From skepticism to reliance</Title>
        </Reveal>

        <Reveal className="max-w-[760px]">
          <Body>
            The clearest signal came from specialists themselves. They had gone from
            doubting the tool to depending on it.
          </Body>
        </Reveal>

        <Reveal stagger={0.12} className="mt-12 grid gap-8 md:grid-cols-3">
          {WINS.map((w) => (
            <div key={w.label} className="flex flex-col">
              <p className="case-study-label">{w.label}</p>
              <Body className="mt-3">{w.body}</Body>
              <StreamingQuote
                as="blockquote"
                className="case-study-quote mt-5 border-l-2 border-[var(--green)] pl-4"
              >
                {`“${w.quote}”`}
              </StreamingQuote>
              <span className="mt-2 pl-4 text-[14px] text-[var(--cog-muted)]">
                @Energy Specialist
              </span>
            </div>
          ))}
        </Reveal>
      </Container>
    </section>
  );
}
