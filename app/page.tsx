import Hero from "@/components/Hero";

// Barcode bar widths (px) — purely decorative
const BARS = [2, 1, 3, 1, 1, 2, 4, 1, 2, 1, 3, 1, 1, 5, 1, 2, 1, 3, 2, 1, 1, 4, 1, 2, 1, 1, 3, 1, 2, 1];

const TELEMETRY = [
  "SYS:CJ-2026  STATUS:ONLINE",
  "RENDER:WEBGL  FPS:60",
  "NODE:0x3F  LINK:STABLE",
  "PROC:DESIGN.EXE  MEM:OK",
  "SIG:▚▚▚░░  98.4%",
];

export default function Home() {
  return (
    <>
      <Hero />

      {/* Darkening for legibility — kept soft + off-center */}
      <div
        aria-hidden
        className="fixed inset-0 z-[5] pointer-events-none"
        style={{
          background:
            "radial-gradient(130% 120% at 18% 38%, rgba(5,7,10,0.82), rgba(5,7,10,0.2) 55%, transparent 75%)",
        }}
      />

      <main className="relative z-10 min-h-screen font-mono text-fg">
        {/* Top status bar */}
        <header className="flex items-start justify-between px-6 py-5 md:px-10 text-[10px] md:text-[11px] tracking-[0.25em] uppercase text-fg-muted">
          <span className="text-accent-cyan/80">C:\CAROLINE\PORTFOLIO\2026.EXE</span>
          <nav className="flex gap-5 md:gap-7">
            <a href="#work" className="hover:text-fg transition-colors">[ WORK ]</a>
            <a href="#about" className="hover:text-fg transition-colors">[ ABOUT ]</a>
            <a href="#index" className="hover:text-fg transition-colors">[ INDEX ]</a>
          </nav>
        </header>

        {/* Left telemetry column */}
        <aside className="absolute left-6 md:left-10 top-[42%] hidden md:block text-[10px] leading-[1.7] tracking-[0.12em] text-accent-cyan/45">
          {TELEMETRY.map((t) => (
            <div key={t}>{t}</div>
          ))}
        </aside>

        {/* Rotated right-edge label */}
        <div className="absolute right-2 top-1/2 -translate-y-1/2 hidden md:block [writing-mode:vertical-rl] rotate-180 text-[10px] tracking-[0.4em] uppercase text-fg-muted/50">
          Portfolio // 2026 // Selected_Works
        </div>

        {/* Main title block */}
        <section className="px-6 md:px-14 pt-[16vh] max-w-4xl">
          <div className="mb-5 text-[11px] md:text-[12px] tracking-[0.32em] uppercase text-accent-cyan/85">
            ▚ Product Designer — Consumer &amp; B2B
          </div>
          <h1
            data-text="CAROLINE JAWORSKY"
            className="glitch-text font-mono font-semibold uppercase leading-[0.95] tracking-tight text-[clamp(1.9rem,6vw,5rem)]"
          >
            Caroline
            <br />
            Jaworsky
          </h1>
          <p className="mt-7 max-w-md text-[12px] md:text-[13px] leading-relaxed text-fg-muted">
            <span className="text-accent-magenta">&gt;</span> digital_products /
            brand_systems / interface_craft
            <br />
            <span className="text-accent-magenta">&gt;</span> building at the edge
            of code &amp; craft
          </p>
        </section>

        {/* Bottom-left barcode */}
        <div
          aria-hidden
          className="absolute bottom-7 left-6 md:left-10 flex items-end gap-[2px] h-9 opacity-70"
        >
          {BARS.map((w, i) => (
            <span
              key={i}
              style={{ width: `${w}px` }}
              className="block h-full bg-fg/70"
            />
          ))}
        </div>

        {/* Bottom-right terminal prompt */}
        <footer className="absolute bottom-7 right-6 md:right-10 text-[10px] md:text-[11px] tracking-[0.25em] uppercase text-fg-muted">
          C:\&gt; available_for_select_projects
          <span className="caret ml-1 text-accent-cyan">█</span>
        </footer>
      </main>

      {/* Next section */}
      <section
        id="work"
        className="relative z-10 min-h-screen px-6 md:px-14 py-24 font-mono"
      >
        <div className="text-[11px] tracking-[0.3em] uppercase text-accent-cyan/70 mb-4">
          C:\&gt; dir /work
        </div>
        <h2 className="font-sans font-bold uppercase text-4xl md:text-6xl tracking-tight max-w-3xl">
          Selected Work
        </h2>
        <p className="mt-6 max-w-md text-[12px] text-fg-muted leading-relaxed">
          &gt; case_studies loading... reserved for the work.
        </p>
      </section>
    </>
  );
}
