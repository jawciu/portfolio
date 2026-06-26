import { A, Container } from "../ui";

export function NextProject() {
  return (
    <section data-section="NextProject" className="relative">
      {/* ── View next project band ───────────────────────────────────────── */}
      <div className="relative overflow-hidden bg-[var(--cog-bg-section)]">
        <Container className="relative z-10 pt-[120px]">
          <p className="case-study-section-heading text-[var(--cog-ink)]">View Next Project</p>

          <div className="mt-10 max-w-[640px]">
            <h3 className="case-study-section-heading mb-0! text-[clamp(1.6rem,1.1rem+2vw,2.4rem)] leading-[1.1]">
              Building Marketing Website
              <br />
              For A Dual Audience
            </h3>
            <a
              href="#"
              className="mt-7 inline-flex items-center rounded-full border border-[var(--cog-ink)] bg-[var(--cog-bg-alt)] px-6 py-2.5 font-[family-name:var(--font-mono)] text-[13px] font-semibold tracking-[0.02em] text-[var(--cog-ink)] transition-colors hover:bg-[var(--cog-mint-soft)]"
            >
              Check it out
            </a>
          </div>
        </Container>

        {/* decorative ribbon / confetti band over a purple stripe */}
        <div className="relative mt-12 h-[180px] md:h-[220px]">
          {/* scattered confetti dashes */}
          <span className="absolute left-[8%] top-[24%] h-2.5 w-7 -rotate-[25deg] rounded-full bg-[var(--cog-orange)]" />
          <span className="absolute left-[18%] top-[55%] h-2.5 w-8 rotate-[18deg] rounded-full bg-[var(--cog-mint)]" />
          <span className="absolute left-[30%] top-[18%] h-3 w-3 rotate-12 bg-[var(--cog-bg-alt)] shadow-sm" />
          <span className="absolute left-[46%] top-[40%] h-2.5 w-9 -rotate-[12deg] rounded-full bg-[var(--cog-green)]" />
          <span className="absolute left-[62%] top-[22%] h-2.5 w-7 rotate-[30deg] rounded-full bg-[var(--cog-orange)]" />
          <span className="absolute left-[78%] top-[50%] h-3 w-3 -rotate-12 bg-[var(--cog-bg-alt)] shadow-sm" />
          <span className="absolute left-[88%] top-[28%] h-2.5 w-8 rotate-[20deg] rounded-full bg-[var(--cog-mint)]" />

          {/* purple ribbon swooshes */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={A("image-44.svg")}
            alt=""
            aria-hidden="true"
            className="pointer-events-none absolute bottom-0 left-1/2 w-[110%] max-w-none -translate-x-1/2 object-cover opacity-90"
          />

          {/* solid purple stripe along the bottom */}
          <div className="absolute inset-x-0 bottom-0 h-9 bg-[var(--cog-purple)]" />
        </div>
      </div>

      {/* Footer removed — the shared global <Footer /> (app/layout.tsx) now closes
          every page, including case studies. */}
    </section>
  );
}
