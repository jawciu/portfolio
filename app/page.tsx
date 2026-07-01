import { Suspense } from "react";
import { HeroCopy } from "@/components/HeroCopy";
import { TelemetryRail } from "@/components/TelemetryRail";
import { About } from "@/components/sections/About";
import { Highlights } from "@/components/sections/Highlights";
import { ProjectCarousel } from "@/components/sections/ProjectCarousel";
// PROTOTYPE — alternative project-showcase variants (?variant=shell|deck|bento).
// Remove this import + the Suspense block below and restore <ProjectCarousel />
// once a direction is chosen.
import { ProjectShowcasePrototype } from "@/components/sections/prototype/ProjectShowcasePrototype";
import { Toolkit } from "@/components/sections/Toolkit";

export default function Home() {
  return (
    <>
      {/* The WebGL hero now lives in the root layout (<PersistentHero/>) so it
          persists across navigation instead of tearing down its GPU context on
          every route change. It renders behind this page at z-0. */}

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
        {/* Top bar lives in the shared sticky <NavBar /> (root layout) now. */}

        {/* Hero copy — sits lower-left, like the comp */}
        <section className="flex-1 flex flex-col justify-center px-8 md:px-12">
          <div className="max-w-3xl flex flex-col gap-4">
            {/* role line */}
            <div className="flex items-center gap-4 mb-7 font-mono text-sm md:text-base tracking-[0.25em] max-sm:gap-2.5 max-sm:text-xs max-sm:tracking-[0.12em] uppercase text-fg/85">
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
        {/* -mt-px: overlap About by 1px — at fractional DPRs a sub-pixel gap
            opens between the two sections and the bright fixed canvas behind
            shines through as a hairline. */}
        <div className="-mt-px bg-bg">
          {/* Career highlights — sits on the black plate directly under About. */}
          <Highlights />
          <Toolkit />
          {/* pb adds +88px below the cards before the footer (48/80 base + 88). */}
          <section id="work" className="px-8 py-12 pb-[136px] md:px-12 md:py-20 md:pb-[168px]">
            <Suspense fallback={<ProjectCarousel />}>
              <ProjectShowcasePrototype />
            </Suspense>
          </section>
        </div>
      </div>
    </>
  );
}
