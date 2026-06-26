// Global site footer — dark plate closing every page (home + case studies).
// Mounted once in app/layout.tsx. Distinct from any per-case-study footer band.
export function Footer() {
  return (
    <footer
      className="relative bg-bg border-t border-fg/10"
      // Re-theme the case-study body token for this dark surface: `.case-study-body-md`
      // stays self-contained (no stacked utilities) and reads light here.
      style={{ ["--soft-ink" as string]: "rgba(245,245,245,0.72)" }}
    >
      <div className="mx-auto max-w-7xl px-8 md:px-12 py-16 md:py-20">
        <div className="max-w-[460px] md:ml-auto">
          <h2 className="font-mono font-bold uppercase tracking-[0.04em] text-fg text-2xl md:text-[36px] leading-[1.05]">
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
              aria-label="LinkedIn — Caroline Jaworsky"
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
          </div>
        </div>
      </div>
    </footer>
  );
}
