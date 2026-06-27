import { A, Container } from "../ui";

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

        {/* Promo video — the hero hook (autoplay, muted, loop). The making-of story
            lives in the Rollout section. The "shadow" is a soft pink-to-lavender
            gradient glow behind the card (box-shadow can't take a gradient). */}
        <div className="relative mt-14">
          <div
            aria-hidden
            className="pointer-events-none absolute -bottom-4 left-5 right-5 top-8 rounded-[1.75rem] blur-lg"
            style={{ background: "linear-gradient(135deg, #FFF0F0, #F7EBFF)" }}
          />
          <div className="relative w-full overflow-hidden rounded-2xl border border-[var(--cog-line)]">
            <video
              id="hero-promo"
              src={A("promo.mp4")}
              autoPlay
              loop
              muted
              playsInline
              className="block h-auto w-full"
            />
          </div>
        </div>
      </Container>
    </section>
  );
}
