import { A, Container, Kicker, Title, Body } from "../ui";
import { Reveal } from "../Reveal";

const QUICK: [string, string][] = [
  ["speed >", "Snappier, streaming responses so the tool keeps pace with a live call."],
  [
    "pin answers >",
    "Specialists pin the answers they reach for most, one tap away when it counts.",
  ],
  [
    "search history >",
    "Past chats are searchable, so a solved question never has to be solved twice.",
  ],
];

const FEATURES: [string, string][] = [
  [
    "the flag form >",
    "A thumbs-down opens a quick form, a pattern specialists already knew, where they say exactly what was wrong and flag the specific source.",
  ],
  [
    "routed to be actioned >",
    "That feedback routes for traceability and to a channel where experts can resurface and fix it fast, turning every specialist into a contributor to the Wiki's accuracy.",
  ],
  [
    "context and copy >",
    "I also added context-boundary warnings with a one-click fresh chat, and a copy-to-clipboard action to drop answers straight into customer notes.",
  ],
];

export function Feedback() {
  return (
    <section data-section="Feedback" className="pt-[120px] pb-0">
      <Container>
        <Reveal>
          <Kicker>User-led refinement</Kicker>
          <Title>Energy specialists guiding <br/> product&rsquo;s improvement</Title>
        </Reveal>

        <Reveal className="max-w-[760px]">
          <Body>
            The pilots surfaced a steady stream of refinements. <br/> Some were quick usability
            wins that made V2 easier to live with on a call.
          </Body>
        </Reveal>

        {/* quick UX shoutouts — list left, product screenshots right */}
        <div className="mt-12 grid items-center gap-10 md:grid-cols-2 lg:gap-16">
          <Reveal stagger={0.12} className="flex flex-col gap-8">
            {QUICK.map(([label, line]) => (
              <div key={label}>
                <p className="case-study-label">{label}</p>
                <Body className="mt-2">{line}</Body>
              </div>
            ))}
          </Reveal>

          {/* two equal-height panels, 32px gap so the pinned tooltip stays visible.
              The SVGs bake in their own frame + shadow (and pin's tooltip overhangs
              the frame), so no wrapper card/background here. The SVGs are clipped flat
              at the bottom, so round the bottom corners to finish the panels. */}
          <Reveal className="flex h-[400px] items-stretch justify-center gap-8 md:h-[440px]">
            {/* pin-conversation panel (left) */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={A("pin.svg")}
              alt="Pinning a conversation from the chat list"
              className="h-full w-auto"
            />
            {/* search-history panel (right) */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={A("search.svg")}
              alt="Searchable chat history with pinned conversations"
              className="h-full w-auto"
            />
          </Reveal>
        </div>

        {/* the deeper piece — closing the loop on the knowledge itself */}
        <Reveal stagger={0.1} className="mt-14 flex max-w-[760px] flex-col gap-5">
          <Body>
            The bigger piece was the knowledge itself. V2 is only ever as good as the
            knowledge behind it, and the research showed two problems: gaps in the
            documentation, and a feedback process that lived in Slack, outside the tool, so
            specialists forgot to use it mid-call.
          </Body>
          <Body>So I designed feedback into the product.</Body>
        </Reveal>

        <Reveal stagger={0.12} className="mt-12 grid gap-8 md:grid-cols-3">
          {FEATURES.map(([label, body]) => (
            <div key={label} className="border-t-2 border-[var(--green)] pt-4">
              <p className="case-study-label">{label}</p>
              <Body className="mt-3">{body}</Body>
            </div>
          ))}
        </Reveal>

        {/* product visual — placeholder; the real flag-form screenshot must be anonymised */}
        <Reveal className="mt-14 flex h-[360px] w-full items-center justify-center rounded-2xl border border-dashed border-[var(--cog-line)] bg-[var(--cog-bg-alt)]">
          <span className="case-study-label text-[var(--cog-muted)]">
            flag-content form + routing (names anonymised)
          </span>
        </Reveal>
      </Container>
    </section>
  );
}
