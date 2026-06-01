import Hero from "@/components/Hero";

export default function Home() {
  return (
    <>
      <Hero />

      {/* Darkening plate — just enough to seat the headline. Kept light + low
          so the left-rail glass (sphere + pill) reads vivid; the contrast it
          adds is pooled at the lower-left behind the copy, not the whole edge. */}
      <div
        aria-hidden
        className="fixed inset-0 z-[5] pointer-events-none"
        style={{
          background:
            "linear-gradient(180deg, rgba(7,7,9,0) 40%, rgba(7,7,9,0.45) 100%), radial-gradient(70% 50% at 22% 92%, rgba(7,7,9,0.55) 0%, rgba(7,7,9,0) 70%)",
        }}
      />

      <main className="relative z-10 min-h-screen flex flex-col">
        {/* Top bar */}
        <header className="flex items-center justify-between px-8 py-6 md:px-12">
          <div className="font-mono text-[11px] md:text-xs tracking-[0.2em] uppercase text-fg/70">
            C:\CAROLINE\PORTFOLIO\2026.EXE
          </div>
          <nav className="flex gap-6 md:gap-10 font-mono text-xs md:text-sm tracking-[0.25em] text-fg">
            <a href="#work" className="hover:text-fg/60 transition-colors">
              [ WORK ]
            </a>
            <a href="#about" className="hover:text-fg/60 transition-colors">
              [ ABOUT ]
            </a>
          </nav>
        </header>

        {/* Hero copy — sits lower-left, like the comp */}
        <section className="flex-1 flex flex-col justify-end px-8 md:px-12 pb-[18vh]">
          <div className="max-w-3xl">
            {/* role line */}
            <div className="flex items-center gap-4 mb-7 font-mono text-xs md:text-sm tracking-[0.25em] uppercase text-fg/85">
              <span aria-hidden className="inline-block w-3.5 h-3.5 bg-fg/90" />
              <span>Product Designer</span>
              <span aria-hidden className="text-fg/40">•</span>
              <span>AI Builder</span>
            </div>

            <p className="font-body text-lg md:text-2xl text-fg/80 mb-4">
              Hi I&rsquo;m Caroline,
            </p>
            <h1 className="font-body font-bold uppercase text-[clamp(2rem,5.2vw,4.25rem)] leading-[1.02] tracking-tight text-fg">
              I turn early concepts into
              <br />
              launch-ready products
            </h1>
          </div>
        </section>
      </main>

      {/* Vertical run label, right edge */}
      <div
        aria-hidden
        className="fixed right-3 top-1/2 z-10 -translate-y-1/2 font-mono text-[10px] md:text-xs tracking-[0.35em] uppercase text-fg/45 pointer-events-none"
        style={{ writingMode: "vertical-rl" }}
      >
        Portfolio // 2026 // Selected_Works
      </div>

      {/* Spacer so there's something to scroll to and the smooth-scroll wiring is alive */}
      <section
        id="work"
        className="relative z-10 min-h-screen px-8 md:px-12 py-24"
      >
        <h2 className="font-body font-bold uppercase text-4xl md:text-6xl tracking-tight max-w-3xl">
          Selected Work
        </h2>
        <p className="mt-6 max-w-xl text-fg-muted">
          Case studies coming soon. This space is reserved for the work.
        </p>
      </section>
    </>
  );
}
