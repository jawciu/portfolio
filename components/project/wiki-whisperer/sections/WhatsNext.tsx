import { A, Container, Kicker, Title, Body } from "../ui";
import { Reveal } from "../Reveal";

export function WhatsNext() {
  // relative isolate overflow-hidden: the opportunity-table image bleeds off the LEFT
  // edge of the screen and sits flush to the section bottom as a background element.
  // pb-0: the table is meant to be flush to the bottom boundary.
  return (
    <section
      data-section="WhatsNext"
      // max-lg:pb-24: NextProject overlaps this section by -mt-[64px] (the glass
      // seam echo). On lg+ the copy block's min-h leaves room, but stacked/mobile
      // the last paragraph sat flush at the bottom and got COVERED by the plate.
      className="relative isolate overflow-hidden pt-[120px] pb-0 max-lg:pb-24"
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

      {/* lower band: cropped opportunity table bleeds off the screen-left edge. The
          image box spans the FULL band height (inset-y-0) and the band height is driven
          by the copy, so image and copy occupy the exact same vertical extent — that
          makes items-center line the copy's centre up with the image's centre no matter
          how long the copy gets (a fixed-height bottom-pinned image would only match when
          the copy happened to be the same height). */}
      <div className="relative mt-12 lg:mt-16">
        {/* full-band-height crop box: width grows toward half the screen on wide
            viewports while object-cover scales/crops the table to the band height.
            Anchored top-left so the header + first rows stay; bleeds off the screen-left
            edge and fills top-to-bottom of the band. */}
        <div
          className="pointer-events-none absolute inset-y-0 left-0 -z-10 hidden overflow-hidden lg:block lg:w-[46%] xl:w-1/2"
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

        <Container className="flex justify-end lg:min-h-[330px] lg:items-start lg:pt-12 xl:min-h-[380px] xl:pt-16">
          <Reveal stagger={0.1} className="max-w-[440px]">
            <Body>
            Two larger improvements surfaced in research. <br/>  <br/>
            A CRM (Kraken) integration would connect Wiki Whisperer to customer data, pulling account-specific insights and resolving issues faster. <br/>  <br/>
            Energy specialists were also keen on images in responses. Particularly for questions about electricity meters, where a picture does a lot of the explaining.
            </Body>
          </Reveal>
        </Container>

        {/* below lg the absolute off-left bleed above is hidden entirely, which left
            this section imageless on phones — show the table as a regular in-flow
            visual instead (standard product-visual frame: 16px radius + hairline). */}
        <Container className="lg:hidden">
          <Reveal className="mt-10 overflow-hidden rounded-[16px] border-[1.5px] border-[#F7EBFF]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={A("opportunities-table-crop.png")}
              alt="Prioritised opportunity backlog: Kraken integration, copy to clipboard and visual UI guidance scored by value and complexity"
              className="block w-full"
            />
          </Reveal>
        </Container>
      </div>
    </section>
  );
}
