import { Suspense } from "react";
import Hero from "@/components/Hero";
import { HeroCopy } from "@/components/HeroCopy";
import { TelemetryRail } from "@/components/TelemetryRail";
import { About } from "@/components/sections/About";
import { ProjectsMarquee } from "@/components/sections/ProjectsMarquee";
import { ProjectCarousel } from "@/components/sections/ProjectCarousel";
// PROTOTYPE — alternative project-showcase variants (?variant=shell|deck|bento).
// Remove this import + the Suspense block below and restore <ProjectCarousel />
// once a direction is chosen.
import { ProjectShowcasePrototype } from "@/components/sections/prototype/ProjectShowcasePrototype";
import { Toolkit } from "@/components/sections/Toolkit";

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
          <div className="font-mono text-[11px] md:text-xs tracking-[0.2em] text-fg/70">
            ~/caro/portfolio/2026
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
        <section className="flex-1 flex flex-col justify-end px-8 md:px-12 pb-[calc(18vh+100px)]">
          <div className="max-w-3xl flex flex-col gap-4">
            {/* role line */}
            <div className="flex items-center gap-4 mb-7 font-mono text-xs md:text-sm tracking-[0.25em] uppercase text-fg/85">
              <span aria-hidden className="inline-block w-3.5 h-3.5 bg-fg/90" />
              <span>Product Designer</span>
              <span aria-hidden className="text-fg/40">•</span>
              <span>AI Builder</span>
            </div>

            <HeroCopy />
          </div>
        </section>
      </main>

      {/* Telemetry strip, right edge — live render facts about THIS visitor's session */}
      <TelemetryRail />

      {/* Below the hero: About is a glass sheet — the fixed WebGL canvas (z-0)
          glows through its backdrop blur, and its background gradient lands on
          solid bg so the opaque sections after it join seamlessly. */}
      <div className="relative z-10">
        <About />
        <div className="bg-bg">
          <ProjectsMarquee />
          <section id="work" className="px-8 py-12 md:px-12 md:py-20">
            <Suspense fallback={<ProjectCarousel />}>
              <ProjectShowcasePrototype />
            </Suspense>
          </section>
          <Toolkit />
        </div>
      </div>
    </>
  );
}
