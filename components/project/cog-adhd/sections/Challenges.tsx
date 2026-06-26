import { A, Container, Kicker, Title, Body } from "../ui";
import { Reveal } from "../Reveal";

export function Challenges() {
  return (
    <section data-section="Challenges" className="pt-[120px] pb-0 bg-[var(--cog-bg-section)]">
      <Container>
        <Reveal stagger={0.08}>
          <Kicker>Challenges</Kicker>
          <Title>
            Testing Shows
            <br />
            Information Overload
          </Title>
        </Reveal>
        <Reveal className="mt-6 md:mt-8 w-[510px] max-w-full">
          <Body>
            I started with a day-by-day layout and colour-coded progress bars to
            help users review their week and spot patterns. But, user testing
            showed that this layout was overwhelming.
          </Body>
        </Reveal>

        {/* Speech bubble + cluttered tracker phone */}
        <Reveal
          stagger={0.14}
          className="mt-12 md:mt-16 grid grid-cols-1 md:grid-cols-2 items-center gap-10 md:gap-16"
        >
          {/* Quote in a green thought bubble */}
          <div className="order-2 md:order-1 flex justify-center md:justify-start">
            <div className="relative w-full max-w-[400px]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={A("stack-5.png")}
                alt=""
                aria-hidden="true"
                className="w-full h-auto select-none"
              />
              <p className="case-study-quote absolute inset-x-[10%] top-[14%] bottom-[28%] flex items-center text-left">
                &ldquo;I&rsquo;m finding it hard to make sense of all the symptoms
                and analyse them day by day to see where my low points are.&rdquo;
              </p>
            </div>
          </div>

          {/* Cluttered "Your tracker history" phone screen — cropped at the bottom */}
          <div className="order-1 md:order-2 flex justify-center md:justify-end">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={A("image-31.png")}
              alt="Early version of the Cog tracker history screen showing a dense day-by-day list of colour-coded symptom progress bars"
              className="w-full max-w-[360px] object-cover object-top"
              style={{ aspectRatio: "1269 / 1950" }}
            />
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
