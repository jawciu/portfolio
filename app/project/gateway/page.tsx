import type { Metadata } from "next";
import "../../../components/project/gateway/theme.css";
import { ScrollReset } from "../../../components/ScrollReset";
import { ScrollRail } from "../../../components/project/ScrollRail";
import { GATEWAY_RAIL } from "../../../components/project/gateway/railSections";
import { StickyHero } from "../../../components/project/gateway/StickyHero";
import { SoftBlob } from "../../../components/project/gateway/SoftBlob";
import { Hero } from "../../../components/project/gateway/sections/Hero";
import { MyRole } from "../../../components/project/gateway/sections/MyRole";
import { Problem } from "../../../components/project/gateway/sections/Problem";
import { Research } from "../../../components/project/gateway/sections/Research";
import { AIWorkflows } from "../../../components/project/gateway/sections/AIWorkflows";
import { Interviews } from "../../../components/project/gateway/sections/Interviews";
import { V1 } from "../../../components/project/gateway/sections/V1";
import { Testing } from "../../../components/project/gateway/sections/Testing";
import { UpdatedDesigns } from "../../../components/project/gateway/sections/UpdatedDesigns";
import { Status } from "../../../components/project/gateway/sections/Status";
import { NextProject } from "../../../components/project/gateway/sections/NextProject";

/* SCAFFOLD (2026-07-22) — structure + draft copy only; every section carries
   TODO(caro) markers and PlaceholderShot frames. NOT linked from the homepage
   carousel / nav on purpose: reachable only at /project/gateway until Caroline
   calls the copy + assets final. */

export const metadata: Metadata = {
  title:
    "Gateway - Turning a manual legacy process into a self-serve product | Caroline Jaworsky",
  description:
    "Product design case study: redesigning how housing developers hand new homes over to E.ON Next - from manual Google Sheets to a self-serve product with autofill, live statuses and bulk validation.",
  robots: { index: false }, // TODO(caro): remove when the study goes live
};

export default function GatewayCaseStudy() {
  return (
    <main className="gw-root min-h-screen w-full">
      <ScrollReset />
      {/* SCROLL RAIL — right-edge section progress. Roster + labels live in
          railSections.ts; the anchors are the data-gw wrappers below. */}
      <ScrollRail sections={GATEWAY_RAIL} attr="data-gw" />
      {/* PINNED HERO — same pattern as wiki-whisperer: hero pins while the glass
          content plate rises over it. Dwell space kept short until the real hero
          visual exists. */}
      <StickyHero>
        <Hero />
        <div aria-hidden className="h-[20vh]" />
      </StickyHero>

      {/* GLASS SEAM — frosted light plate sliding up over the pinned hero.
          Retinted 2026-08-18 (Caroline): wiki's lilac stops swapped for the warm
          rosy-beige family of the hero-image glow (#E9DEE7 in sections/Hero.tsx),
          fading to the page white by 192px as before. */}
      <div
        /* shadow: warm rose-brown, not the old eon-purple-deep — at 0.18 over
           the near-white hero it reads as the same rosy beige as the hero-image
           glow (#EDE1E3 in sections/Hero.tsx); retune BOTH together. */
        className="relative isolate z-10 rounded-t-[2.5rem] backdrop-blur-2xl backdrop-saturate-150 shadow-[0_-24px_60px_-20px_rgba(128,88,98,0.18)]"
        style={{
          background:
            "linear-gradient(180deg, rgba(250,242,246,0.55) 0px, rgba(252,246,249,0.78) 70px, rgba(253,250,252,0.93) 138px, rgba(254,252,254,0.98) 172px, #fefcff 192px)",
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

        {/* AMBIENT BLOBS — one continuous layer behind every section. */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 -z-10 overflow-hidden rounded-t-[2.5rem]"
        >
          <SoftBlob className="left-[14%] top-[16%] h-[820px] w-[1000px]" />
          <SoftBlob className="right-[6%] top-[36%] h-[920px] w-[1100px]" />
          <SoftBlob className="left-[8%] top-[56%] h-[880px] w-[1060px]" />
          <SoftBlob className="right-[10%] top-[76%] h-[920px] w-[1120px]" />
        </div>

        <div data-gw="MyRole"><MyRole /></div>
        <div data-gw="Research"><Research /></div>
        <div data-gw="AIWorkflows"><AIWorkflows /></div>
        <div data-gw="Problem"><Problem /></div>
        <div data-gw="Interviews"><Interviews /></div>
        <div data-gw="V1"><V1 /></div>
        <div data-gw="Testing"><Testing /></div>
        <div data-gw="UpdatedDesigns"><UpdatedDesigns /></div>
        <div data-gw="Status"><Status /></div>
        <div data-gw="NextProject"><NextProject /></div>
      </div>
    </main>
  );
}
