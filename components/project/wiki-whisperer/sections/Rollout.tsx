import { A, Container, Kicker, Title, Body } from "../ui";
import { Reveal } from "../Reveal";
import { WatchVideoButton } from "../WatchVideoButton";

export function Rollout() {
  return (
    <section data-section="Rollout" className="pt-[120px] pb-0">
      <Container>
        <Reveal>
          <Kicker>The rollout</Kicker>
          <Title>
            Showcasing Wiki Whisperer&rsquo;s
            <br />
            new capabilities
          </Title>
        </Reveal>

        {/* copy + watch-video button left, wiki character right */}
        <Reveal stagger={0.1} className="mt-14 grid items-center gap-10 lg:grid-cols-2 lg:gap-14">
          <div className="flex max-w-[560px] flex-col items-start gap-5">
            <Body>
              The pilots surfaced one more thing. Some specialists were so burned by V1 that
              their expectations for V2 were low, they missed features or didn&rsquo;t realise
              the tool was conversational until we spoke with them.
            </Body>
            <Body>
              Adoption wasn&rsquo;t just a product problem, it was also a perception one. So
              for the company-wide rollout, I led the creation of a one-minute feature-showcase
              video to reset that first impression.
            </Body>
            {/* the promo video lives in the hero, so the button scrolls back up to it */}
            <div className="mt-3">
              <WatchVideoButton />
            </div>
          </div>
          <div className="flex justify-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={A("wiki-character.png")}
              alt="Wiki Whisperer leaf character holding a crystal-ball staff"
              className="h-auto w-[220px] max-w-full"
            />
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
