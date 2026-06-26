import { Container, Kicker, Title, Body } from "../ui";
import { Reveal } from "../Reveal";

const NEXT: [string, string][] = [
  [
    "Kraken integration >",
    "Account-specific answers, the most requested next step, weighed against the risk of automating too much of the specialist's judgement.",
  ],
  [
    "see, not just read >",
    "Image support so specialists can upload a meter photo, and visual step-by-step guidance through the systems.",
  ],
  [
    "faster, in their control >",
    "A stop button, faster responses, and longer context so a chat does not break mid-case.",
  ],
  [
    "more accessible >",
    "Dictation, text-to-speech and export, so the tool fits more ways of working.",
  ],
];

export function WhatsNext() {
  return (
    <section data-section="WhatsNext" className="pt-[120px] pb-0">
      <Container>
        <Reveal>
          <Kicker>What&apos;s next</Kicker>
          <Title>From iteration to intention</Title>
        </Reveal>

        <Reveal stagger={0.12} className="grid gap-8 md:grid-cols-2">
          {NEXT.map(([label, body]) => (
            <div key={label}>
              <p className="case-study-label">{label}</p>
              <Body className="mt-2">{body}</Body>
            </div>
          ))}
        </Reveal>
      </Container>
    </section>
  );
}
