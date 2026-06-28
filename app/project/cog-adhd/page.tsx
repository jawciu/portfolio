import type { Metadata } from "next";
import "../../../components/project/cog-adhd/theme.css";
import { StickyHero } from "../../../components/project/cog-adhd/StickyHero";
import { Hero } from "../../../components/project/cog-adhd/sections/Hero";
import { MyRole } from "../../../components/project/cog-adhd/sections/MyRole";
import { Interviews } from "../../../components/project/cog-adhd/sections/Interviews";
import { Competitive } from "../../../components/project/cog-adhd/sections/Competitive";
import { Findings } from "../../../components/project/cog-adhd/sections/Findings";
import { BookingDropoff } from "../../../components/project/cog-adhd/sections/BookingDropoff";
import { JourneyMap } from "../../../components/project/cog-adhd/sections/JourneyMap";
import { Strategy } from "../../../components/project/cog-adhd/sections/Strategy";
import { Methodology } from "../../../components/project/cog-adhd/sections/Methodology";
import { Challenges } from "../../../components/project/cog-adhd/sections/Challenges";
import { Solution } from "../../../components/project/cog-adhd/sections/Solution";
import { Results } from "../../../components/project/cog-adhd/sections/Results";
import { Takeaways } from "../../../components/project/cog-adhd/sections/Takeaways";
import { NextProject } from "../../../components/project/cog-adhd/sections/NextProject";

export const metadata: Metadata = {
  title: "Cog ADHD — Gaps & Opportunities in ADHD Therapy | Caroline Jaworsky",
  description:
    "Research & strategy case study: uncovering key user needs in ADHD therapy and turning insights into tested, shipped solutions for Cog Clinic.",
};

export default function CogAdhdCaseStudy() {
  return (
    <main className="cog-root min-h-screen w-full">
      {/* PINNED HERO — the hero is taller than the viewport, so it's pinned at a
          MEASURED `top: -(heroHeight - viewportHeight)` (see StickyHero): the
          visitor scrolls UP through it first — confetti → title → meta → the
          phone/tablet mockups slide into FULL view — and only then does it stick
          (showing the mockups) while the glass plate below rises over it. So the
          device assets are always seen in full before the glass starts covering. */}
      {/* DWELL SPACE — cream room BELOW the mockups, INSIDE the pinned hero. It
          lifts the mockups up off the screen bottom, so once the hero pins the
          glass plate (which now sits flush under the hero) rises up THROUGH this
          empty cream first, holding the mockups in full view while the glass
          visibly climbs toward them. Replaces the old transparent post-hero
          buffer, whose dead/frozen gap read as "end of page". The space is
          transparent over the cream `.cog-root`, so it's seamless. Tune the
          height to trade off how long the visuals dwell before the glass covers. */}
      <StickyHero>
        <Hero />
        <div aria-hidden className="h-[34vh]" />
      </StickyHero>

      {/* GLASS SEAM — ties the case study to the homepage: everything after the
          hero rides a frosted cream-glass plate that slides UP over the pinned
          hero (mirrors how About glides over the home WebGL hero). No -mt overlap
          now — the plate sits just below the hero, so it only enters AFTER the
          mockups are fully shown, then rises over them as you keep scrolling. Its
          frosted top is tinted slightly DARKER than the cream so the glass edge
          reads against the cream hero; the gradient then lands on SOLID cream FAST
          (~185px) so body copy never reads over a busy frost. rounded-t echoes About. */}
      <div
        className="relative z-10 rounded-t-[2.5rem] backdrop-blur-2xl backdrop-saturate-150 shadow-[0_-24px_60px_-20px_rgba(40,34,20,0.18)]"
        style={{
          background:
            "linear-gradient(180deg, rgba(206,201,186,0.62) 0px, rgba(222,217,204,0.7) 60px, rgba(238,235,227,0.9) 125px, rgba(245,244,239,0.98) 165px, #f5f4ef 185px)",
        }}
      >
        {/* glass rim glint — a soft bright hairline along the top edge */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 h-px rounded-t-[2.5rem]"
          style={{
            background:
              "linear-gradient(90deg, rgba(255,255,255,0), rgba(255,255,255,0.85) 22%, rgba(255,255,255,0.35) 50%, rgba(255,255,255,0.7) 78%, rgba(255,255,255,0))",
          }}
        />

        <div data-cog="MyRole"><MyRole /></div>
        <div data-cog="Interviews"><Interviews /></div>
        <div data-cog="Competitive"><Competitive /></div>
        <div data-cog="Findings"><Findings /></div>
        <div data-cog="BookingDropoff"><BookingDropoff /></div>
        <div data-cog="JourneyMap"><JourneyMap /></div>
        <div data-cog="Strategy"><Strategy /></div>
        <div data-cog="Methodology"><Methodology /></div>
        <div data-cog="Challenges"><Challenges /></div>
        <div data-cog="Solution"><Solution /></div>
        <div data-cog="Results"><Results /></div>
        <div data-cog="Takeaways"><Takeaways /></div>
        <div data-cog="NextProject"><NextProject /></div>
      </div>
    </main>
  );
}
