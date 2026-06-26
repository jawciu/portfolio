import { Container } from "../ui";

/* Hero — mirrors the cog hero structure: 2-line title, then a two-column meta block
   (LEFT: brand + logo + role/tools vertical lists; RIGHT: summary + setting the stage),
   then the product-visual row. Pinned via StickyHero; the glass plate rises over it.
   TODO (visual pass): swap the product-visual placeholder for the real V2 screens. */

export function Hero() {
  return (
    <section data-section="Hero" className="relative">
      <Container className="pt-28 pb-[120px] md:pt-32">
        {/* Page title — H1, two lines via a manual break. */}
        <h1 className="case-study-title">
          Designing an AI Brain
          <br />
          for a Support Call Centre
        </h1>

        {/* Meta block: two columns */}
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
              <span className="font-[family-name:var(--font-mono)] text-[28px] font-bold tracking-wide text-[var(--cog-ink)]">
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
                  Testing
                  <br />
                  Launch
                </p>
              </div>
              <div>
                <p className="case-study-hero-label">tools</p>
                <p className="case-study-body-md mt-2">
                  Figma Make
                  <br />
                  NotebookLM
                  <br />
                  Hey Marvin
                  <br />
                  Miro
                  <br />
                  Mixpanel
                  <br />
                  Opik
                </p>
              </div>
            </div>
          </div>

          {/* RIGHT: summary + setting the stage */}
          <div className="space-y-6">
            <div>
              <p className="case-study-hero-label">summary</p>
              <p className="case-study-body-md mt-2">
                I led the design of Wiki Whisperer V2, an autonomous AI agent that helps
                E.ON Next&apos;s energy specialists answer complex customer questions. It
                rebuilt a distrusted tool into one teams rely on, reached 89.4% adoption
                across the trial, and cleared the way for a company-wide rollout.
              </p>
            </div>
            <div>
              <p className="case-study-hero-label">setting the stage</p>
              <p className="case-study-body-md mt-2">
                At E.ON Next, support call agents (energy specialists) are generalists.
                Any customer can call about anything, from a billing error to solar panel
                installation. Recalling the right process under time pressure is hard, and the earlier
                tools had not made it easier. My job was to design one that eased the
                cognitive load, built trust and drove efficiency.
              </p>
            </div>
          </div>
        </div>

        {/* Product-visual row — placeholder until the Figma screens land */}
        <div className="mt-14 flex h-[320px] w-full items-center justify-center rounded-2xl border border-dashed border-[var(--cog-line)] bg-[var(--cog-bg-alt)] md:h-[420px]">
          <span className="case-study-label text-[var(--cog-muted)]">
            v2 product screens (desktop + tablet)
          </span>
        </div>
      </Container>
    </section>
  );
}
