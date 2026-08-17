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
import { SkillsGalaxy } from "@/components/sections/SkillsGalaxy";
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
          <div className="max-w-4xl flex flex-col gap-4">
            {/* role line */}
            <div className="flex items-center gap-4 mb-7 font-mono text-sm md:text-base tracking-[0.25em] max-sm:gap-2.5 max-sm:text-xs max-sm:tracking-[0.12em] uppercase text-fg/85">
              <span aria-hidden className="inline-block w-3.5 h-3.5 bg-fg/90" />
              <span>Founding designer</span>
              <span aria-hidden className="text-fg/40">•</span>
              <span>Design engineer</span>
            </div>

            <HeroCopy />

            {/* Subheading — the positioning copy (Caroline-approved 2026-08-17).
                Static on purpose: only the intro + headline get the typing effect. */}
            <div className="mt-10 max-w-[47rem] flex flex-col gap-6 font-body text-lg md:text-xl leading-relaxed text-fg/75">
              <p>
                I&rsquo;m a designer with{" "}
                <strong className="text-fg font-semibold">13 years</strong> across
                physical and digital products. I started in luxury fashion,
                designing garments, graphics and brand identities for Alexander
                McQueen, Burberry and Casablanca. <span aria-hidden className="text-[#94FFD9]">˚ ⊹ ｡ ·</span>
              </p>
              <p>
                <span aria-hidden className="text-[#94FFD9]">✧ </span>I spent two years as the{" "}
                <strong className="text-fg font-semibold">founding designer at a pre-seed startup</strong>,
                owning discovery, research and delivery, with 0-to-1 launches that
                lifted engagement by 30%.
              </p>
              <p>
                <span aria-hidden className="text-[#94FFD9]">✦ </span>Today I build AI tools at E.ON Next,
                where my squad owns its products end to end. The knowledge
                assistant I designed reached a{" "}
                <strong className="text-fg font-semibold">97% would-recommend</strong>{" "}
                score and a green light for company-wide rollout.{" "}
                <span aria-hidden className="text-[#94FFD9]">° ◦</span>
              </p>
            </div>
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
          {/* pb adds +88px below the cards (48/80 base + 88). */}
          {/* mobile pt-6 (was 12): halves the toolkit->projects gap on phones;
              md:pt-20 == the old md:py-20 top, so desktop is unchanged. */}
          <section id="work" className="px-8 pt-6 pb-[136px] md:px-12 md:pt-20 md:pb-[168px]">
            <Suspense fallback={<ProjectCarousel />}>
              <ProjectShowcasePrototype />
            </Suspense>
          </section>
          {/* Skills galaxy — interactive knowledge graph in a window frame.
              Self-contained: to re-home it, move this one mount. */}
          <SkillsGalaxy />
          <Toolkit />
        </div>
      </div>
    </>
  );
}
