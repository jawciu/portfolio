import { A, Container, Kicker, Title, Body } from "../ui";
import { Reveal } from "../Reveal";

export function WhatsNext() {
  // relative isolate overflow-hidden: the opportunity-table image bleeds off the LEFT
  // edge of the screen and sits flush to the section bottom as a background element.
  // pb-0: the table is meant to be flush to the bottom boundary.
  return (
    <section
      data-section="WhatsNext"
      className="relative isolate overflow-hidden pt-[120px] pb-0"
    >
      <Container>
        {/* eyebrow + heading in their normal place */}
        <Reveal>
          <Kicker>What&apos;s next</Kicker>
          <Title>
            Account specific information
            <br />
            and image support
          </Title>
        </Reveal>
      </Container>

      {/* lower band: cropped opportunity table bleeds off the screen-left edge + sits
          flush to the bottom; the copy is vertically centred against the table's height.
          The band min-height (lg) matches the table's rendered height so items-center
          aligns the copy to the image centre. */}
      <div className="relative mt-12 lg:mt-16">
        {/* fixed-height crop box: width grows toward half the screen on wide viewports
            while the height stays capped, so object-cover scales the table UP and crops
            it MORE as the screen widens. Anchored top-left so the header + first rows
            stay; flush to the screen-left edge + section bottom. */}
        <div
          className="pointer-events-none absolute bottom-0 left-0 -z-10 hidden overflow-hidden lg:block lg:h-[330px] lg:w-[46%] xl:h-[380px] xl:w-1/2"
          // fade the right edge into the page so the table dissolves into the
          // background instead of ending on a hard vertical line.
          style={{
            WebkitMaskImage:
              "linear-gradient(to right, #000 58%, transparent 100%)",
            maskImage: "linear-gradient(to right, #000 58%, transparent 100%)",
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={A("opportunities-table-crop.png")}
            alt="Prioritised opportunity backlog: Kraken integration, copy to clipboard and visual UI guidance scored by value and complexity"
            className="h-full w-full object-left-top object-cover"
          />
        </div>

        <Container className="flex justify-end lg:min-h-[330px] lg:items-center xl:min-h-[380px]">
          <Reveal stagger={0.1} className="max-w-[440px]">
            <Body>
              Next are the bigger improvements flagged in the research: a Kraken integration
              for account-specific answers, and image support.
            </Body>
          </Reveal>
        </Container>
      </div>
    </section>
  );
}
