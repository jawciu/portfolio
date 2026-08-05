import { HeroFade, HeroStream } from "../../HeroIntro";
import { Container, PlaceholderShot } from "../ui";

/* Hero — template layout (mirrors wiki-whisperer): 2-line streamed title, then a
   two-column meta block (LEFT: brand + logo + role/tools vertical lists;
   RIGHT: summary + setting the stage), then the product-visual row.
   Pinned via StickyHero; the glass plate rises over it.
   TODO (visual pass): swap the PlaceholderShot for the real Gateway mockups
   (wiki-style device composition, see OUTLINE.md shot list). */

export function Hero() {
  return (
    <section data-section="Hero" className="relative">
      <Container className="pt-28 pb-[120px] md:pt-32">
        {/* Page title — H1, two lines via a manual break (desktop only; ≤640px the
            32px mobile title flows naturally). Space BEFORE the \n keeps the words
            apart when the <br/> is hidden on phones. */}
        {/* TODO(caro): title thesis — working option below, alternatives in OUTLINE.md */}
        <h1 className="case-study-title">
          <HeroStream step={0.01} breakClassName="max-sm:hidden">
            {"Gateway: Turning a Spreadsheet \nBack-channel into a Product"}
          </HeroStream>
        </h1>

        {/* Meta block: two columns. Only the H1 streams — everything else in the
            hero fades in as one unit, same recipe as the hero imagery. */}
        <HeroFade delay={150} duration={0.5}>
        <div className="mt-10 grid grid-cols-1 gap-10 md:grid-cols-2 md:gap-16">
          {/* LEFT: brand + mini role/tools table */}
          <div>
            <p className="case-study-hero-label">brand</p>
            <div className="mt-3 flex items-center gap-3">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/assets/e_on_next.png"
                alt="E.ON Next logo"
                className="h-8 w-auto object-contain"
              />
              <span className="font-[family-name:var(--font-mono)] text-[28px] font-bold tracking-wide text-[var(--case-study-ink)]">
                E.ON NEXT
              </span>
            </div>

            <div className="mt-8 grid max-w-md grid-cols-2 gap-6">
              <div>
                <p className="case-study-hero-label">role</p>
                <p className="case-study-body-md mt-2">
                  Research
                  <br />
                  UX/UI
                  <br />
                  Prototyping
                  <br />
                  Delivery
                </p>
              </div>
              <div>
                <p className="case-study-hero-label">tools</p>
                {/* TODO(caro): confirm the AI tooling names before this goes live —
                    notetaker (Marvin?), the AI-built prototype stack (OUTLINE.md
                    open facts 3). */}
                <p className="case-study-body-md mt-2">
                  Figma
                  <br />
                  Miro
                  <br />
                  Hey Marvin
                </p>
              </div>
            </div>
          </div>

          {/* RIGHT: summary + setting the stage */}
          <div className="space-y-6">
            <div>
              <p className="case-study-hero-label">summary</p>
              <p className="case-study-body-md mt-2">
                {/* TODO(caro): 1-2 sentence summary. Draft: */}
                I redesigned how housing developers hand new homes over to E.ON
                Next: from manually submitted Google Sheets into a self-serve
                product with autofill, live statuses and bulk validation. Gateway
                is currently in build with the engineering team.
              </p>
            </div>
            <div>
              <p className="case-study-hero-label">setting the stage</p>
              <p className="case-study-body-md mt-2">
                {/* TODO(caro): the step-up beat, in her words. Draft: */}
                Gateway wasn&apos;t my project. Its designer left the company with
                business-critical work already promised, and the product was
                suddenly without design. I stepped up, which meant entering the
                developer space, a domain completely new to me. I normally design
                for the contact centre.
              </p>
            </div>
          </div>
        </div>
        </HeroFade>

        {/* Product visual — PlaceholderShot until the Gateway mockups exist.
            HeroFade is display:contents, so only opacity animates. */}
        <HeroFade delay={150} duration={0.5}>
        <div className="mt-14">
          <PlaceholderShot label="hero visual — Gateway mockups (TODO)" ratio="16/9" />
        </div>
        </HeroFade>
      </Container>
    </section>
  );
}
