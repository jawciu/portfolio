import { A, Container, Kicker, Title, Body } from "../ui";

export function Challenges() {
  return (
    <section data-section="Challenges" className="py-16 md:py-24">
      <Container>
        <Kicker>Challenges</Kicker>
        <Title className="mt-3 md:mt-4">
          Testing Shows
          <br />
          Information Overload
        </Title>
        <div className="mt-6 md:mt-8 max-w-[640px]">
          <Body>
            I started with a day-by-day layout and colour-coded progress bars to
            help users review their week and spot patterns. But, user testing
            showed that this layout was overwhelming.
          </Body>
        </div>

        {/* Speech bubble + cluttered tracker phone */}
        <div className="mt-12 md:mt-16 grid grid-cols-1 md:grid-cols-2 items-center gap-10 md:gap-16">
          {/* Quote in a green thought bubble */}
          <div className="order-2 md:order-1 flex justify-center md:justify-end">
            <div className="relative w-full max-w-[380px]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={A("stack-5.png")}
                alt=""
                aria-hidden="true"
                className="w-full h-auto select-none"
              />
              <p className="absolute inset-x-[10%] top-[14%] bottom-[28%] flex items-center justify-center text-center font-[family-name:var(--font-mono)] text-[clamp(0.8rem,0.7rem+0.5vw,1rem)] leading-relaxed text-[var(--cog-ink)]">
                &ldquo;I&rsquo;m finding it hard to make sense of all the symptoms
                and analyse them day by day to see where my low points are.&rdquo;
              </p>
            </div>
          </div>

          {/* Cluttered "Your tracker history" phone screen */}
          <div className="order-1 md:order-2 flex justify-center md:justify-start">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={A("image-31.png")}
              alt="Early version of the Cog tracker history screen showing a dense day-by-day list of colour-coded symptom progress bars"
              className="w-full max-w-[300px] h-auto"
            />
          </div>
        </div>
      </Container>
    </section>
  );
}
