import { A, Container } from "../ui";

export function NextProject() {
  return (
    <section data-section="NextProject" className="relative">
      {/* ── View next project band ───────────────────────────────────────── */}
      <div className="relative overflow-hidden bg-[var(--cog-bg)]">
        <Container className="relative z-10 pt-16 md:pt-24">
          <p className="cog-title text-[var(--cog-ink)]">View Next Project</p>

          <div className="mt-10 max-w-[640px]">
            <h3 className="cog-title text-[clamp(1.6rem,1.1rem+2vw,2.4rem)] leading-[1.1]">
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

      {/* ── Footer ───────────────────────────────────────────────────────── */}
      <footer className="bg-[var(--cog-purple-deep)] text-[var(--cog-bg)]">
        <Container className="py-12 md:py-16">
          <div className="flex flex-col gap-10 md:flex-row md:items-start md:justify-between">
            <p className="font-[family-name:var(--font-mono)] text-sm font-semibold tracking-[0.02em] text-[var(--cog-bg)]">
              Caroline Jaworsky
            </p>

            <div className="max-w-[440px]">
              <p className="font-[family-name:var(--font-mono)] text-base font-bold uppercase tracking-[0.06em] text-[var(--cog-bg)]">
                Let&apos;s Connect
              </p>
              <p className="mt-4 font-[family-name:var(--font-body)] text-[14px] leading-[1.65] text-[var(--cog-bg)]/80">
                I find great joy in working with others and testing my skills in
                new environments. Whether you would like to collaborate on a
                project or simply want to chat, feel free to reach out to me.
              </p>

              <p className="mt-6 font-[family-name:var(--font-mono)] text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--cog-bg)]/70">
                Reach me here
              </p>
              <div className="mt-3 flex items-center gap-3">
                <a
                  href="https://www.linkedin.com/"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="LinkedIn"
                  className="text-[var(--cog-bg)] transition-opacity hover:opacity-70"
                >
                  <svg
                    width="22"
                    height="22"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5ZM3 9h4v12H3V9Zm6 0h3.83v1.64h.05c.53-1 1.84-2.06 3.78-2.06C20.6 8.58 22 10.2 22 13.2V21h-4v-6.92c0-1.65-.03-3.78-2.3-3.78-2.3 0-2.66 1.8-2.66 3.66V21H9V9Z" />
                  </svg>
                </a>
                <a
                  href="mailto:jaworskycaroline@gmail.com"
                  aria-label="Email"
                  className="text-[var(--cog-bg)] transition-opacity hover:opacity-70"
                >
                  <svg
                    width="22"
                    height="22"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    aria-hidden="true"
                  >
                    <rect x="3" y="5" width="18" height="14" rx="2" />
                    <path d="m3 7 9 6 9-6" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </Container>
      </footer>
    </section>
  );
}
