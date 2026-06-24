import { A, Container, Body } from "../ui";

export function Hero() {
  return (
    <section data-section="Hero" className="relative">
      {/* Confetti band — full bleed orange streamers on the warm band */}
      <div className="relative w-full overflow-hidden bg-[var(--cog-bg-warm)]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={A("image-5.svg")}
          alt="Orange confetti streamers"
          className="block w-full h-[120px] md:h-[180px] object-cover object-top"
        />
      </div>

      <Container className="pt-10 pb-16 md:pt-14 md:pb-24">
        {/* Page title — main H1. See `.case-study-title` (template token). */}
        <h1 className="case-study-title">
          Gaps and Opportunities
          <br />
          in ADHD Therapy Processes
        </h1>

        {/* Meta block: two columns */}
        <div className="mt-10 grid grid-cols-1 gap-10 md:grid-cols-2 md:gap-16">
          {/* LEFT: brand + mini role/time/tools table */}
          <div>
            <p className="case-study-hero-label">brand</p>
            <div className="mt-3 flex items-center gap-2">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/assets/cog-adhd-logo.png"
                alt="Cog ADHD logo"
                className="h-6 w-6 rounded-full object-cover"
              />
              <span className="font-[family-name:var(--font-mono)] text-sm font-bold tracking-wide text-[var(--cog-ink)]">
                COG ADHD
              </span>
            </div>

            <div className="mt-8 grid grid-cols-3 gap-6 max-w-md">
              <div>
                <p className="case-study-hero-label">role</p>
                <p className="cog-body mt-2 text-sm leading-relaxed">
                  Research
                  <br />
                  Strategy
                  <br />
                  UX/UI
                </p>
              </div>
              <div>
                <p className="case-study-hero-label">time</p>
                <p className="cog-body mt-2 text-sm leading-relaxed">2 months</p>
              </div>
              <div>
                <p className="case-study-hero-label">tools</p>
                <p className="cog-body mt-2 text-sm leading-relaxed">
                  Figma
                  <br />
                  Miro
                  <br />
                  Notion
                  <br />
                  Asana
                </p>
              </div>
            </div>
          </div>

          {/* RIGHT: summary + setting the stage */}
          <div className="space-y-6">
            <div>
              <p className="case-study-hero-label">summary</p>
              <Body className="mt-2 text-sm leading-relaxed">
                As the Founding Designer at a pre-seed mental health startup, I led
                product discovery, uncovered key user needs, and turned insights into
                tested, shipped solutions. This resulted in an increase in therapy
                session bookings and growth in user engagement.
              </Body>
            </div>
            <div>
              <p className="case-study-hero-label">setting the stage</p>
              <Body className="mt-2 text-sm leading-relaxed">
                Cog is a mobile app designed to support people with ADHD. A significant
                part of its offering is online therapy delivered through Cog Clinic. My
                goal was to understand ADHD therapy from multiple perspectives to
                identify problems and uncover focused design opportunities.
              </Body>
            </div>
          </div>
        </div>

        {/* Device row: two phones + wide tablet */}
        <div className="mt-14 flex items-end justify-center gap-4 md:gap-6">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={A("image-large-screens.svg")}
            alt="Cog app phone — check-in history bar chart"
            className="w-[18%] max-w-[150px] shrink-0"
          />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={A("image-large-screens-1.svg")}
            alt="Cog app phone — check-in history list"
            className="w-[18%] max-w-[150px] shrink-0"
          />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={A("image.svg")}
            alt="Cog Clinic dashboard — Katherine Bell overview"
            className="w-[52%] max-w-[460px] shrink-0"
          />
        </div>
      </Container>
    </section>
  );
}
