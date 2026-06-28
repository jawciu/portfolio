// Global site footer — dark plate closing every page (home + case studies).
// Mounted once in app/layout.tsx. Distinct from any per-case-study footer band.
export function Footer() {
  return (
    <footer
      // z-10: sit above the homepage's fixed `z-[5]` darkening plate, which otherwise
      // paints over the footer (it's `pointer-events-none`) and greys the copy.
      className="relative z-10 bg-bg"
      // Re-theme the case-study body token for this dark surface: `.case-study-body-md`
      // stays self-contained (no stacked utilities) and reads light here.
      style={{ ["--soft-ink" as string]: "rgba(245,245,245,0.72)" }}
    >
      {/* glassy top edge — a lit bevel sitting a few px INTO the dark plate, so it
          reads as the edge of a glass plate even with a light section directly above
          (a white line exactly on the light/dark boundary would be invisible).
          Built from overlapping elliptical highlights at a few x-spots so the shine is
          UNEVEN — bright where light catches the glass, fading between — not a flat band. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-28"
        style={{
          background:
            "radial-gradient(46% 130% at 17% 4%, rgba(255,255,255,0.28), rgba(255,255,255,0) 70%)," +
            "radial-gradient(34% 120% at 47% 9%, rgba(255,255,255,0.10), rgba(255,255,255,0) 68%)," +
            "radial-gradient(40% 120% at 72% 2%, rgba(255,255,255,0.20), rgba(255,255,255,0) 70%)," +
            "radial-gradient(30% 110% at 92% 11%, rgba(255,255,255,0.06), rgba(255,255,255,0) 66%)",
        }}
      />
      {/* shiny specular rim line — same as the bento cards' top edge */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-px"
        style={{
          background:
            "linear-gradient(90deg, rgba(245,245,245,0.05), rgba(255,255,255,0.55) 22%, rgba(245,245,245,0.12) 55%, rgba(245,245,245,0.04))",
        }}
      />

      <div className="relative mx-auto max-w-7xl px-8 md:px-12 py-16 md:py-20">
        <div className="flex flex-col gap-12 md:flex-row md:items-start md:justify-between">
          {/* left: link to the portfolio source on GitHub, styled like the navbar
              ~/caro/portfolio/2026 path label. Opens in a new tab. */}
          <a
            href="https://github.com/jawciu/portfolio"
            target="_blank"
            rel="noreferrer"
            aria-label="Portfolio source on GitHub (opens in a new tab)"
            className="font-mono text-xs tracking-[0.2em] text-fg/70 transition-colors hover:text-fg md:text-sm"
          >
            github.com/jawciu/portfolio
          </a>

          <div className="max-w-[460px]">
          {/* same Iosevka heading treatment as every other heading (font-hero,
              uppercase, faux extra-bold via text-stroke since Charon has no 800). */}
          <h2
            className="font-hero font-bold uppercase tracking-[-0.01em] text-fg text-2xl md:text-[36px] leading-[1.08]"
            style={{ WebkitTextStroke: "0.6px currentColor" }}
          >
            Let&apos;s Connect
          </h2>

          <p className="case-study-body-md mt-5">
            I find great joy in working with others and testing my skills in new
            environments. Whether you would like to collaborate on a project or
            simply want to chat, feel free to reach out to me.
          </p>

          <p className="mt-7 font-[family-name:var(--font-body)] text-base font-bold text-fg">
            Reach me here
          </p>

          <div className="-ml-2 mt-2 flex items-center gap-1">
            {/* LinkedIn — the mark itself is white with the "in" knocked out
                (fill-rule evenodd) and rounded corners baked into the path; no
                badge background. Opens in a new tab. */}
            <a
              href="https://www.linkedin.com/in/carolinejaworsky/"
              target="_blank"
              rel="noreferrer"
              aria-label="LinkedIn - Caroline Jaworsky"
              className="inline-flex h-11 w-11 items-center justify-center rounded-md text-fg transition-colors hover:bg-fg/10"
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="currentColor"
                fillRule="evenodd"
                clipRule="evenodd"
                aria-hidden="true"
              >
                <path d="M22.23 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.23.79 24 1.77 24h20.46c.98 0 1.77-.77 1.77-1.73V1.73C24 .77 23.21 0 22.23 0zM7.12 20.45H3.56V9h3.56v11.45zM5.34 7.43a2.07 2.07 0 1 1 0-4.14 2.07 2.07 0 0 1 0 4.14zm15.11 13.02h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.86 0-2.14 1.45-2.14 2.94v5.67H9.34V9h3.42v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.45v6.29z" />
              </svg>
            </a>

            {/* Email — plain white envelope, no border; the box highlights faintly
                on hover. */}
            <a
              href="mailto:jaworskycaroline@gmail.com"
              aria-label="Email Caroline"
              className="inline-flex h-11 w-11 items-center justify-center rounded-md text-fg transition-colors hover:bg-fg/10"
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <rect x="3" y="5" width="18" height="14" rx="2" />
                <path d="m3.5 7 8.5 6 8.5-6" />
              </svg>
            </a>

            {/* GitHub — links to Caroline's GitHub homepage. Opens in a new tab. */}
            <a
              href="https://github.com/jawciu"
              target="_blank"
              rel="noreferrer"
              aria-label="GitHub - jawciu (opens in a new tab)"
              className="inline-flex h-11 w-11 items-center justify-center rounded-md text-fg transition-colors hover:bg-fg/10"
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="currentColor"
                aria-hidden="true"
              >
                <path d="M12 .5C5.37.5 0 5.87 0 12.5c0 5.3 3.44 9.8 8.21 11.39.6.11.82-.26.82-.58 0-.29-.01-1.04-.02-2.05-3.34.73-4.04-1.61-4.04-1.61-.55-1.39-1.33-1.76-1.33-1.76-1.09-.74.08-.73.08-.73 1.2.09 1.84 1.24 1.84 1.24 1.07 1.83 2.81 1.3 3.5.99.11-.78.42-1.3.76-1.6-2.67-.3-5.47-1.33-5.47-5.93 0-1.31.47-2.38 1.24-3.22-.13-.3-.54-1.52.12-3.18 0 0 1.01-.32 3.3 1.23a11.5 11.5 0 0 1 6 0c2.29-1.55 3.3-1.23 3.3-1.23.66 1.66.25 2.88.12 3.18.77.84 1.24 1.91 1.24 3.22 0 4.61-2.81 5.62-5.49 5.92.43.37.81 1.1.81 2.22 0 1.61-.01 2.9-.01 3.29 0 .32.21.7.82.58A12 12 0 0 0 24 12.5C24 5.87 18.63.5 12 .5z" />
              </svg>
            </a>
          </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
