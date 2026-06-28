import type { Metadata } from "next";
import "../../../components/project/wiki-whisperer/theme.css";
import { StickyHero } from "../../../components/project/wiki-whisperer/StickyHero";
import { SoftBlob } from "../../../components/project/wiki-whisperer/SoftBlob";
import { Hero } from "../../../components/project/wiki-whisperer/sections/Hero";
import { MyRole } from "../../../components/project/wiki-whisperer/sections/MyRole";
import { Problem } from "../../../components/project/wiki-whisperer/sections/Problem";
import { Redesign } from "../../../components/project/wiki-whisperer/sections/Redesign";
import { UnderTheHood } from "../../../components/project/wiki-whisperer/sections/UnderTheHood";
import { Measuring } from "../../../components/project/wiki-whisperer/sections/Measuring";
import { Wins } from "../../../components/project/wiki-whisperer/sections/Wins";
import { Impact } from "../../../components/project/wiki-whisperer/sections/Impact";
import { Feedback } from "../../../components/project/wiki-whisperer/sections/Feedback";
import { Rollout } from "../../../components/project/wiki-whisperer/sections/Rollout";
import { WhatsNext } from "../../../components/project/wiki-whisperer/sections/WhatsNext";
// Key takeaways hidden for now — restore this import + its <Takeaways /> below when ready.
// import { Takeaways } from "../../../components/project/wiki-whisperer/sections/Takeaways";
import { NextProject } from "../../../components/project/wiki-whisperer/sections/NextProject";

export const metadata: Metadata = {
  title:
    "Wiki Whisperer V2 - Designing a second AI brain for energy specialists | Caroline Jaworsky",
  description:
    "Product design case study: redesigning E.ON Next's autonomous AI agent into a tool energy specialists trust, reaching 89% adoption and clearing the way for a company-wide rollout.",
};

export default function WikiWhispererCaseStudy() {
  return (
    <main className="ww-root min-h-screen w-full">
      {/* PINNED HERO — taller than the viewport, pinned at a measured negative top so
          the device mockups scroll into FULL view before the glass plate rises over it. */}
      {/* DWELL SPACE — near-white room BELOW the mockups, INSIDE the pinned hero, so
          the glass plate (flush under the hero) rises up THROUGH it first, holding the
          mockups in full view while the glass visibly climbs toward them. Replaces the
          old transparent post-hero buffer, whose frozen gap read as "end of page".
          Transparent over the `.ww-root` near-white, so it's seamless. Tune the height
          to trade off how long the visuals dwell before the glass covers. */}
      <StickyHero>
        <Hero />
        <div aria-hidden className="h-[34vh]" />
      </StickyHero>

      {/* GLASS SEAM — everything after the hero rides a frosted lilac-glass plate that
          slides UP over the pinned hero (mirrors the homepage About-over-hero move).
          Gradient retinted to the E.ON Next light palette, landing on solid bg fast. */}
      <div
        className="relative isolate z-10 rounded-t-[2.5rem] backdrop-blur-2xl backdrop-saturate-150 shadow-[0_-24px_60px_-20px_rgba(60,29,122,0.18)]"
        style={{
          background:
            "linear-gradient(180deg, rgba(247,240,252,0.55) 0px, rgba(250,245,254,0.78) 70px, rgba(252,250,254,0.93) 138px, rgba(253,252,255,0.98) 172px, #fefcff 192px)",
        }}
      >
        {/* glass rim glint */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 h-px rounded-t-[2.5rem]"
          style={{
            background:
              "linear-gradient(90deg, rgba(255,255,255,0), rgba(255,255,255,0.85) 22%, rgba(255,255,255,0.35) 50%, rgba(255,255,255,0.7) 78%, rgba(255,255,255,0))",
          }}
        />

        {/* AMBIENT BLOBS — one continuous layer behind every section (lifted from the
            E.ON Next deck). Lives here, not per-section, so the soft peach→lilac washes
            bleed across section boundaries instead of being clipped at each edge. */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 -z-10 overflow-hidden rounded-t-[2.5rem]"
        >
          <SoftBlob className="left-[14%] top-[20%] h-[820px] w-[1000px]" />
          <SoftBlob className="right-[6%] top-[38%] h-[920px] w-[1100px]" />
          <SoftBlob className="left-[8%] top-[55%] h-[880px] w-[1060px]" />
          <SoftBlob className="right-[10%] top-[72%] h-[920px] w-[1120px]" />
        </div>

        {/* Sections sit transparent over the plate (solid --cog-bg) + the blob layer
            above, so the ambient washes read continuously behind the content. */}
        <div data-ww="MyRole"><MyRole /></div>
        <div data-ww="Problem"><Problem /></div>
        <div data-ww="Redesign"><Redesign /></div>
        <div data-ww="UnderTheHood"><UnderTheHood /></div>
        <div data-ww="Measuring"><Measuring /></div>
        <div data-ww="Feedback"><Feedback /></div>
        <div data-ww="Wins"><Wins /></div>
        <div data-ww="Impact"><Impact /></div>
        <div data-ww="Rollout"><Rollout /></div>
        <div data-ww="WhatsNext"><WhatsNext /></div>
        {/* <div data-ww="Takeaways"><Takeaways /></div> */}
        <div data-ww="NextProject"><NextProject /></div>
      </div>
    </main>
  );
}
