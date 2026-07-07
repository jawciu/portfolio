import { A, Container, Kicker, Title, Body } from "../ui";
import { Reveal } from "../Reveal";

const QUICK: [string, string][] = [
  [
    "speed >",
    "In the first weeks of the trial, agents were hindered by latency, so we've refactored the architecture to improve the speed.",
  ],
  [
    "pin answers >",
    "Energy specialists find there are a few things they continuously keep asking, now they are just one tap away.",
  ],
  [
    "search history >",
    "Past chats are searchable, so energy specialists can go back to the knowledge they've already found.",
  ],
];

const FEATURES: [string, string][] = [
  [
    "the flag form >",
    "A thumbs-down opens a quick form, where agents say what was wrong and flag the specific source.",
  ],
  [
    "routed to be actioned >",
    "Feedback routes for traceability and to a Slack channel where experts can pick it up and fix it fast.",
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

      </Container>

      {/* quick UX shoutouts — product screenshots left, text right.
          Breakout: this block can run wider than the 1080px heading on large screens. */}
      <div className="mx-auto mt-12 w-full max-w-[1300px] px-6">
        <div className="grid items-center gap-10 lg:grid-cols-[auto_1fr] lg:gap-14">
          {/* two equal-height panels, tight gap so the pinned tooltip stays visible.
              The SVGs bake in their own frame + shadow (and pin's tooltip overhangs
              the frame), so no wrapper card/background here. */}
          {/* MOBILE (max-sm): order-2 sends the panels BELOW the speed/pin/search copy
              (grid respects CSS order — no duplicated markup, desktop untouched), and
              the two panels sit side by side at 1/3 width each, centred. */}
          <Reveal className="flex h-[380px] items-stretch justify-start gap-3 max-sm:order-2 max-sm:h-auto max-sm:items-start max-sm:justify-center max-sm:gap-4 sm:h-[440px] lg:h-[500px] xl:h-[572px]">
            {/* pin-conversation panel (left) */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={A("pin.png")}
              alt="Pinning a conversation from the chat list"
              className="h-full w-auto max-sm:h-auto max-sm:w-auto max-sm:min-w-0 max-sm:flex-1"
            />
            {/* search-history panel (right) */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={A("search.png")}
              alt="Searchable chat history with pinned conversations"
              className="h-full w-auto max-sm:h-auto max-sm:w-auto max-sm:min-w-0 max-sm:flex-1"
            />
          </Reveal>

          <Reveal stagger={0.12} className="flex flex-col gap-8">
            {QUICK.map(([label, line]) => (
              <div key={label}>
                <p className="case-study-label">{label}</p>
                <Body className="mt-2">{line}</Body>
              </div>
            ))}
          </Reveal>
        </div>
      </div>

      {/*<Container>

      the deeper piece — closing the loop on the knowledge itself 
          <Reveal stagger={0.1} className="mt-14 flex max-w-[760px] flex-col gap-5">
          <Body>
            V2 is only ever as good as the knowledge behind it, and the research showed
            gaps in the documentation, and a feedback process that lived in Slack and was
            often missed. So I designed feedback into the product.
            </Body>
        </Reveal>
      </Container> */}

      {/* feedback designed into the product — copy left, screenshots right.
          Breakout: this block can run wider than the 1080px heading on large screens.
          mt-[92px] = the standard mt-12 (48px) + an extra 44px gap from the quick-UX row. */}
      <div className="mx-auto mt-[92px] w-full max-w-[1300px] px-6">
        <div className="grid items-center gap-10 lg:grid-cols-[1fr_auto] lg:gap-14">
          <Reveal stagger={0.12} className="flex flex-col gap-8">
            {FEATURES.map(([label, body]) => (
              <div key={label}>
                <p className="case-study-label">{label}</p>
                <Body className="mt-2">{body}</Body>
              </div>
            ))}
          </Reveal>

          {/* two screenshots (flag form + routed-to-Slack). Row height tracks the
              larger feedback panel; flag form sits ~0.85x, feedback ~1.1x. */}
          <Reveal className="flex h-[374px] items-center justify-end gap-4 max-sm:h-auto max-sm:flex-col max-sm:items-center max-sm:gap-5 sm:h-[440px] lg:h-[506px] xl:h-[572px]">
            {/* flag-content form (vector card — already framed) */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={A("flag-form.svg")}
              alt="Flag-content form where agents say what was wrong and flag the source"
              className="h-[77%] w-auto max-sm:h-auto max-sm:w-full"
            />
            {/* routed to a Slack channel (flat screenshot — add rounded corners + lilac border) */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={A("feedback.png")}
              alt="Feedback routed to a Slack channel for experts to action"
              className="h-full w-auto rounded-[16px] border-[1.5px] border-[#F7EBFF] max-sm:h-auto max-sm:w-full"
            />
          </Reveal>
        </div>
      </div>
    </section>
  );
}
