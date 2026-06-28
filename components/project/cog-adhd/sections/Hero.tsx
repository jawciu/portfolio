import { A, Container } from "../ui";

export function Hero() {
  return (
    <section data-section="Hero" className="relative">
      {/* Confetti band — full-bleed transparent streamers (no background), tucked
          flush to the top edge of the screen under the transparent navbar. */}
      <div className="relative w-full overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={A("image-5.svg")}
          alt="Orange confetti streamers"
          className="block w-full h-[120px] opacity-80 md:h-[180px] object-cover object-top"
        />
      </div>

      <Container className="pt-10 pb-[120px] md:pt-14">
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
            <div className="mt-3 flex items-center gap-3">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/assets/cog-adhd-logo.png"
                alt="Cog ADHD logo"
                className="h-12 w-12 rounded-full object-cover"
              />
              <span className="font-[family-name:var(--font-mono)] text-[28px] font-bold tracking-wide text-[var(--cog-ink)]">
                COG ADHD
              </span>
            </div>

            <div className="mt-8 grid grid-cols-3 gap-6 max-w-md">
              <div>
                <p className="case-study-hero-label">role</p>
                <p className="case-study-body-md mt-2">
                  Research
                  <br />
                  Strategy
                  <br />
                  UX/UI
                </p>
              </div>
              <div>
                <p className="case-study-hero-label">time</p>
                <p className="case-study-body-md mt-2">2 months</p>
              </div>
              <div>
                <p className="case-study-hero-label">tools</p>
                <p className="case-study-body-md mt-2">
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
              <p className="case-study-body-md mt-2">
                As the Founding Designer at a pre-seed mental health startup, I led
                product discovery, uncovered key user needs, and turned insights into
                tested, shipped solutions. This resulted in an increase in therapy
                session bookings and growth in user engagement.
              </p>
            </div>
            <div>
              <p className="case-study-hero-label">setting the stage</p>
              <p className="case-study-body-md mt-2">
                Cog is a mobile app designed to support people with ADHD. A significant
                part of its offering is online therapy delivered through Cog Clinic. My
                goal was to understand ADHD therapy from multiple perspectives to
                identify problems and uncover focused design opportunities.
              </p>
            </div>
          </div>
        </div>

        {/* Device row: two phones + wide tablet — all three matched to the SAME
            HEIGHT (phones sized to the tablet's height via aspect), then ×1.2.
            Heights match because the width ratio = aspect ratio (phone 0.497 :
            tablet 1.305 ≈ 20.3% : 53.5%); max-w caps deliver the desktop ×1.2
            (phone 210 / tablet 552 → all render ~422px tall). */}
        <div className="mt-14 flex items-end justify-center gap-2 max-sm:flex-wrap md:gap-4 lg:gap-6">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={A("image-large-screens.svg")}
            alt="Cog app phone - check-in history bar chart"
            className="w-[20.3%] max-w-[210px] shrink-0 max-sm:w-[44%]"
          />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={A("image-large-screens-1.svg")}
            alt="Cog app phone - check-in history list"
            className="w-[20.3%] max-w-[210px] shrink-0 max-sm:w-[44%]"
          />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={A("image.svg")}
            alt="Cog Clinic dashboard - Katherine Bell overview"
            className="w-[53.5%] max-w-[552px] shrink-0 max-sm:mt-4 max-sm:w-full"
          />
        </div>
      </Container>
    </section>
  );
}
