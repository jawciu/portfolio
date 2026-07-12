import { A, Container, LinkIcon, Shot } from "../ui";

/* Hero — mirrors the cog/wiki hero structure: 2-line title, a two-column meta block
   (LEFT: brand + role/tools lists; RIGHT: summary + setting the stage), then the
   product-visual row. Pinned via StickyHero; the dark glass plate rises over it. */

export function Hero() {
  return (
    <section data-section="Hero" className="relative">
      <Container className="pt-28 pb-[120px] md:pt-32">
        {/* Page title — H1, two lines via a manual break. */}
        <h1 className="case-study-title">
          Rethinking time-to-value
          <br />
          in B2B SaaS onboarding
        </h1>

        {/* Meta block: two columns */}
        <div className="mt-10 grid grid-cols-1 gap-10 md:grid-cols-2 md:gap-16">
          {/* LEFT: brand + mini role/tools table */}
          <div>
            <p className="case-study-hero-label">brand</p>
            <div className="mt-3 flex items-center gap-3">
              {/* Icon logo intentionally omitted until Vector has one of its own. */}
              <span className="font-[family-name:var(--font-mono)] text-[28px] font-bold tracking-wide text-[var(--cog-ink)]">
                VECTOR
              </span>
              <a
                href="https://vector.quest"
                target="_blank"
                rel="noopener noreferrer"
                className="ml-1 inline-flex items-center gap-1.5 font-[family-name:var(--font-mono)] text-[13px] text-[var(--cog-muted)] underline decoration-[var(--cog-line)] underline-offset-4 transition-colors hover:text-[var(--dark-green)]"
              >
                <LinkIcon />
                vector.quest
              </a>
            </div>

            <div className="mt-8 grid max-w-md grid-cols-2 gap-6">
              <div>
                <p className="case-study-hero-label">role</p>
                <p className="case-study-body-md mt-2">
                  Product
                  <br />
                  Design system
                  <br />
                  Data model
                  <br />
                  AI orchestration
                  <br />
                  Build &amp; deploy
                </p>
              </div>
              <div>
                <p className="case-study-hero-label">tools</p>
                <p className="case-study-body-md mt-2">
                  Cursor, Claude Code
                  <br />
                  Next.js 16
                  <br />
                  React 19, Tailwind v4
                  <br />
                  Prisma &amp; Supabase
                  <br />
                  Claude API
                  <br />
                  Resend
                  <br />
                  Playwright
                  <br />
                  Vercel
                </p>
              </div>
            </div>
          </div>

          {/* RIGHT: summary + setting the stage */}
          <div className="space-y-6">
            <div>
              <p className="case-study-hero-label">summary</p>
              <p className="case-study-body-md mt-2">
                Vector helps vendors cut time-to-value and stop first-90-day churn.
                It&apos;s a shared vendor/customer workspace with an AI layer that does
                the tedious work: drafting follow-ups, turning meeting transcripts into
                tasks, and surfacing risk before an onboarding goes sideways.
              </p>
            </div>
            <div>
              <p className="case-study-hero-label">setting the stage</p>
              <p className="case-study-body-md mt-2">
              I noticed an interesting problem, procured tools promise value, then lose momentum at onboarding, where context gets lost and time-to-value slips. While playing with agentic engineering tools and wanting to get better at building, I jumped into Claude Code and built a tool to help with the problem I saw.
              </p>
            </div>
          </div>
        </div>

        {/* Hero visual — the AI Insights view, the clearest proof of the product. Sits in
            the same framed treatment every Vector screenshot uses. */}
        <Shot
          src={A("hero-insights.png")}
          alt="Vector's AI Insights view: a streamed summary of one onboarding with risks, wins, focus for today and the week."
          className="mt-14"
          captionAlign="left"
          caption="All data is fictional; company names and logos are used for illustrative purposes only and do not represent real customer endorsements"
        />
      </Container>
    </section>
  );
}
