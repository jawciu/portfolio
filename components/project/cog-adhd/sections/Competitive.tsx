import { A, Container, Kicker, Title, Body, Callout } from "../ui";

const LOGOS = [
  { file: "image-12.png", alt: "Agave Health logo" },
  { file: "image-13.png", alt: "inflow logo" },
  { file: "image-14.png", alt: "HelloSelf logo" },
  { file: "image-15.png", alt: "shimmer logo" },
  { file: "image-16.png", alt: "bloom logo" },
];

export function Competitive() {
  return (
    <section data-section="Competitive" className="py-16 md:py-24">
      <Container>
        <Kicker>Competitive Analysis</Kicker>
        <Title className="mt-3">
          SPACE FOR OPPORTUNITY
          <br />
          IN THE THERAPY AIDING TOOLS
        </Title>

        <Body className="mt-6 max-w-2xl">
          I identified a variety of solutions for ADHD support, generally
          divided into two categories: self-help apps and therapy platforms.
        </Body>

        {/* Competitor logo row */}
        <div className="mt-12 grid grid-cols-2 items-center gap-8 sm:grid-cols-3 md:flex md:flex-wrap md:justify-between md:gap-10">
          {LOGOS.map((logo) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              key={logo.file}
              src={A(logo.file)}
              alt={logo.alt}
              className="h-8 w-auto object-contain opacity-80 grayscale md:h-9"
            />
          ))}
        </div>

        {/* Two-column comparison */}
        <div className="mt-16 grid gap-14 md:grid-cols-2 md:gap-12">
          {/* Self-help apps — screenshots left, text right */}
          <div className="flex items-start gap-6">
            <div className="flex shrink-0 gap-3">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={A("image-11.png")}
                alt="Self-help app screen with a daily mood and emotion picker"
                className="w-[120px] rounded-xl border border-[var(--cog-line)]"
              />
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={A("image-10.png")}
                alt="Self-help app screen for picking guided journeys"
                className="w-[120px] rounded-xl border border-[var(--cog-line)]"
              />
            </div>
            <Body className="self-center">
              Self-help apps are typically designed to be engaging and fun,
              offering tools like mood check-ins, educational videos, and AI
              chatbots.
            </Body>
          </div>

          {/* Therapy platforms — text left, screenshots right */}
          <div className="flex items-start gap-6">
            <Body className="self-center">
              Therapy platforms generally offer access to coaches through monthly
              subscriptions but lack tools that directly support the therapy
              process. Only a few, including our key competitors Inflow and Agave
              Health, included features like emotion or symptom check-ins.
            </Body>
            <div className="flex shrink-0 gap-3">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={A("image-17.png")}
                alt="Inflow therapy platform screen matching a client with a coach"
                className="w-[120px] rounded-xl border border-[var(--cog-line)]"
              />
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={A("image-18.png")}
                alt="Shimmer therapy platform screen showing 1:1 coaching sessions"
                className="w-[120px] rounded-xl border border-[var(--cog-line)]"
              />
            </div>
          </div>
        </div>

        {/* Gap callout */}
        <div className="mt-14">
          <Callout>
            This gap in therapy-support tools indicated a unique opportunity to
            develop features that actively support the therapeutic journey.
          </Callout>
        </div>
      </Container>
    </section>
  );
}
