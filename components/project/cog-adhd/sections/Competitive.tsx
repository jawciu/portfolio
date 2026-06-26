import { A, Container, Kicker, Title, Body, CaseStudyCallout } from "../ui";

const LOGOS = [
  { file: "image-12.png", alt: "Agave Health logo" },
  { file: "image-13.png", alt: "inflow logo" },
  { file: "image-14.png", alt: "HelloSelf logo" },
  { file: "image-15.png", alt: "shimmer logo" },
  { file: "image-16.png", alt: "bloom logo" },
];

export function Competitive() {
  return (
    <section data-section="Competitive" className="pt-[120px] pb-0">
      <Container>
        <Kicker>Competitive Analysis</Kicker>
        <Title>
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

        {/* Row 1 — two big self-help screenshots on the LEFT, text on the RIGHT */}
        <div className="mt-16 grid items-center gap-8 md:grid-cols-2 md:gap-12">
          <div className="flex items-start justify-center gap-4 md:justify-start">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={A("image-11.png")}
              alt="Self-help app screen with a daily mood and emotion picker"
              className="w-1/2 max-w-[220px] object-contain"
            />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={A("image-10.png")}
              alt="Self-help app screen for picking guided journeys"
              className="w-1/2 max-w-[220px] object-contain"
            />
          </div>
          <Body>
            Self-help apps are typically designed to be engaging and fun,
            offering tools like mood check-ins, educational videos, and AI
            chatbots.
          </Body>
        </div>

        {/* Row 2 — text on the LEFT, two big therapy-platform screenshots on the RIGHT */}
        <div className="mt-16 grid items-center gap-8 md:grid-cols-2 md:gap-12">
          <Body className="md:order-1">
            Therapy platforms generally offer access to coaches through monthly
            subscriptions but lack tools that directly support the therapy
            process. Only a few, including our key competitors Inflow and Agave
            Health, included features like emotion or symptom check-ins.
          </Body>
          <div className="flex items-start justify-center gap-4 md:order-2 md:justify-end">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={A("image-17.png")}
              alt="Inflow therapy platform screen matching a client with a coach"
              className="w-1/2 max-w-[220px] object-contain"
            />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={A("image-18.png")}
              alt="Shimmer therapy platform screen showing 1:1 coaching sessions"
              className="w-1/2 max-w-[220px] object-contain"
            />
          </div>
        </div>

        {/* Gap callout */}
        <div className="mt-16">
          <CaseStudyCallout>
            This gap in therapy-support tools indicated a unique opportunity to
            develop features that actively support the therapeutic journey.
          </CaseStudyCallout>
        </div>
      </Container>
    </section>
  );
}
