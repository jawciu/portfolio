import { Container, Kicker, Title, Body, TestimonialBubble } from "../ui";
import { Reveal } from "../Reveal";

const WINS: { label: string; body: string; quote: string; asset: string; flip?: boolean }[] = [
  {
    label: "high confidence >",
    body: "They called V2 'miles better' and trusted it with complex, multi-step tasks.",
    quote:
      "I find it's a lot more streamlined and a lot more accurate. No matter what you type, you get good information.",
    asset: "bubble-1.png",
  },
  {
    label: "structured answers >",
    body: "The scannable layout let them read while speaking to a customer.",
    quote:
      "I can actually read step-by-step instead of reading a massive paragraph.",
    asset: "bubble-2.png",
  },
  {
    label: "reduced reliance >",
    body: "The tool became a genuine second brain, quieting the constant asks for help.",
    quote:
      "It has information which most people in the office probably couldn't answer without asking someone in the field.",
    asset: "bubble-3.png",
  },
];

export function Wins() {
  return (
    <section data-section="Wins" className="pt-[120px] pb-0">
      <Container>
        <Reveal>
          <Kicker>Big wins</Kicker>
          <Title>From scepticism to reliance</Title>
        </Reveal>

        <Reveal className="max-w-[760px]">
          <Body>
            The clearest signal came from specialists themselves. <br/> They had gone from
            doubting the tool to depending on it.
          </Body>
        </Reveal>

        <Reveal stagger={0.12} className="mt-12 grid items-start gap-8 md:grid-cols-3">
          {WINS.map((w) => (
            <TestimonialBubble
              key={w.label}
              asset={w.asset}
              quote={w.quote}
              who="@Energy Specialist"
              width={480}
              flip={w.flip}
            />
          ))}
        </Reveal>
      </Container>
    </section>
  );
}
