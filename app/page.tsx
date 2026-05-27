import Hero from "@/components/Hero";

export default function Home() {
  return (
    <>
      <Hero />

      <main className="relative z-10 min-h-screen flex flex-col">
        {/* Top nav */}
        <header className="flex items-center justify-between px-8 py-6 md:px-14">
          <div className="font-display text-sm tracking-widest uppercase text-fg/80">
            Caroline Jaworsky
          </div>
          <nav className="hidden md:flex gap-8 text-sm text-fg-muted">
            <a href="#work" className="hover:text-fg transition-colors">
              Work
            </a>
            <a href="#about" className="hover:text-fg transition-colors">
              About
            </a>
            <a href="#contact" className="hover:text-fg transition-colors">
              Contact
            </a>
          </nav>
        </header>

        {/* Hero headline */}
        <section className="flex-1 flex items-center px-8 md:px-14">
          <div className="max-w-5xl">
            <p className="font-body text-sm md:text-base text-accent-cyan/80 tracking-widest uppercase mb-6">
              Product Designer · 2026
            </p>
            <h1 className="font-display text-[clamp(3rem,9vw,9rem)] leading-[0.95] tracking-tight font-medium">
              Designing
              <br />
              consumer &amp; B2B
              <br />
              <span className="italic font-light">interfaces.</span>
            </h1>
            <p className="mt-8 max-w-xl text-fg-muted text-base md:text-lg leading-relaxed">
              Selected work across digital products, brand systems, and the
              fuzzy spaces between code and craft.
            </p>
          </div>
        </section>

        {/* Scroll hint */}
        <footer className="px-8 md:px-14 pb-8 flex items-end justify-between">
          <div className="text-xs text-fg-muted/60 tracking-widest uppercase">
            Scroll
            <span aria-hidden className="ml-3 inline-block w-8 h-px bg-fg-muted/40 align-middle" />
          </div>
          <div className="text-xs text-fg-muted/60 tracking-widest uppercase">
            Available for select projects
          </div>
        </footer>
      </main>

      {/* Spacer so there's something to scroll to and the smooth-scroll wiring is alive */}
      <section className="relative z-10 min-h-screen px-8 md:px-14 py-24">
        <h2 className="font-display text-4xl md:text-6xl tracking-tight max-w-3xl">
          Selected Work
        </h2>
        <p className="mt-6 max-w-xl text-fg-muted">
          Case studies coming soon. This space is reserved for the work.
        </p>
      </section>
    </>
  );
}
