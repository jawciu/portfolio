import { A, Container, Kicker, Title, Body, CaseStudyCallout, InsightCard } from "../ui";
import { Reveal } from "../Reveal";

const FEATURES: [string, string, string][] = [
  [
    "principle #01",
    "conversational partner",
    "Multi-turn, natural dialogue replaced exact-phrase prompting, so agents can untangle complex, layered cases in real time.",
  ],
  [
    "principle #02",
    "familiar by design",
    "Built on E.ON Next's design system, the interface followed patterns agents already know from Gemini and ChatGPT, so V2 added no new mental model.",
  ],
  [
    "principle #03",
    "structured and sourced",
    "Long paragraphs became scannable sections, bullets and step-by-step guides, each linked to source articles so agents can trust what they read.",
  ],
  [
    "principle #04",
    "creative on demand",
    "Beyond answers, specialists can ask for tables, learning documents and more, using the Wiki in ways V1 never allowed.",
  ],
];

/** small right-aligned mono tag with an accent underline, sits above each design screenshot */
function DesignsTag() {
  return (
    <div className="mx-auto mt-14 flex max-w-[1000px] justify-end">
      <span className="cog-label border-b-2 border-[var(--green)] pb-2 pl-[84px] pr-3 text-right text-[var(--cog-ink)]">
        designs
      </span>
    </div>
  );
}

export function Redesign() {
  return (
    <section data-section="Redesign" className="pt-[120px] pb-0">
      <Container>
        <Reveal>
          <Kicker>THE REDESIGN</Kicker>
          <Title>building trust, usability and flexibility</Title>
        </Reveal>

        {/* <Reveal className="max-w-[760px]">
          <Body>
            V2 had to undo V1&apos;s scars. I designed for trust and low effort first, so
            an answer is fast to believe and easy to act on while still talking to a
            customer.
          </Body>
        </Reveal> */}

        {/* all four principles */}
        <Reveal
          stagger={0.12}
          className="mx-auto mt-12 grid max-w-[900px] auto-rows-fr gap-9 md:grid-cols-2"
        >
          {FEATURES.map(([label, title, body]) => (
            <InsightCard key={label} label={label} title={title} width="auto" height="auto">
              {body}
            </InsightCard>
          ))}
        </Reveal>

        {/* product visual — creative on demand (table) */}
        <Reveal>
          <DesignsTag />
        </Reveal>
        <Reveal className="mx-auto mt-4 max-w-[1000px] overflow-hidden rounded-[20px] max-sm:rounded-[10px] border border-[#F7EBFF] bg-white shadow-[1px_1px_10px_2px_rgba(212,210,210,0.25)]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={A("redesign-table.png")}
            alt="Wiki Whisperer V2 turning a tariff comparison into a structured table on demand"
            className="block w-full"
          />
        </Reveal>

        {/* product visual — structured + sourced (trust) */}
        <Reveal className="mx-auto mt-8 max-w-[1000px] overflow-hidden rounded-[20px] max-sm:rounded-[10px] border border-[#F7EBFF] bg-white shadow-[1px_1px_10px_2px_rgba(212,210,210,0.25)]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={A("redesign-trust.png")}
            alt="Wiki Whisperer V2 answer broken into scannable sections with linked, hoverable source citations"
            className="block w-full"
          />
        </Reveal>

        <Reveal className="mt-[104px] mb-[24px] max-sm:mt-[70px] max-sm:mb-4 max-w-[860px]">
          <CaseStudyCallout stream>
            An answer is only useful if the specialist trusts it enough to say it out loud. So we designed for trust and reliability before anything else.
          </CaseStudyCallout>
        </Reveal>
      </Container>
    </section>
  );
}
