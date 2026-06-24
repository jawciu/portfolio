import Link from "next/link";

export function Nav() {
  return (
    <nav
      data-section="Nav"
      className="sticky top-0 z-50 w-full border-b border-[var(--cog-line)] bg-[var(--cog-bg)]/90 backdrop-blur"
    >
      <div className="cog-container flex h-14 items-center justify-between">
        {/* LEFT: back-to-home logo mark */}
        <Link
          href="/"
          aria-label="Back to home"
          className="flex items-center gap-2"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/assets/cog-adhd-logo.png"
            alt="Cog logo"
            className="h-7 w-7 rounded-full"
          />
        </Link>

        {/* RIGHT: nav links */}
        <div className="cog-label flex items-center gap-6 text-[var(--cog-ink)]">
          <Link href="/" className="transition-opacity hover:opacity-60">
            Home
          </Link>
          <Link href="/#work" className="transition-opacity hover:opacity-60">
            Projects
          </Link>
          <Link href="/#about" className="transition-opacity hover:opacity-60">
            About
          </Link>
        </div>
      </div>
    </nav>
  );
}
