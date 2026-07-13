import type { Metadata } from "next";
import "../../../components/project/vector/theme.css";
import { ScrollReset } from "../../../components/ScrollReset";
import { StickyHero } from "../../../components/project/vector/StickyHero";
import { SoftBlob } from "../../../components/project/vector/SoftBlob";
import { Hero } from "../../../components/project/vector/sections/Hero";
import { Problem } from "../../../components/project/vector/sections/Problem";
import { MyRole } from "../../../components/project/vector/sections/MyRole";
import { Product } from "../../../components/project/vector/sections/Product";
import { Matching } from "../../../components/project/vector/sections/Matching";
import { AILayer } from "../../../components/project/vector/sections/AILayer";
import { Observability } from "../../../components/project/vector/sections/Observability";
import { Architecture } from "../../../components/project/vector/sections/Architecture";
import { Collaboration } from "../../../components/project/vector/sections/Collaboration";
// WhatsNext unmounted 2026-07-13 (Caroline: still working on it) — NOT deleted,
// component stays on disk; re-add the import + mount below when it's ready.
// import { WhatsNext } from "../../../components/project/vector/sections/WhatsNext";
import { NextProject } from "../../../components/project/vector/sections/NextProject";

export const metadata: Metadata = {
  title:
    "Vector - Rethinking time-to-value in B2B SaaS onboarding | Caroline Jaworsky",
  description:
    "Product case study: Vector, a shared vendor/customer workspace with an AI layer that cuts time-to-value in B2B SaaS onboarding. Designed and built solo, with grounded, human-in-the-loop AI running live.",
};

export default function VectorCaseStudy() {
  return (
    <main className="vector-root min-h-screen w-full">
      <ScrollReset />
      {/* PINNED HERO — taller than the viewport, pinned at a measured negative top so
          the hero visual scrolls into FULL view before the glass plate rises over it. */}
      {/* DWELL SPACE — near-black room BELOW the visual, INSIDE the pinned hero, so the
          glass plate (flush under the hero) rises up THROUGH it first, holding the visual
          in view while the glass visibly climbs. Transparent over the .vector-root bg, so
          seamless. */}
      <StickyHero>
        {/* DOTS TEXTURE — one continuous 22px dot field across the hero AND the
            dwell space, so the pattern runs unbroken all the way down to the glass
            seam. Dots only (the check + blurred-bloom variants were tried and
            cut, 2026-07-13); values match Product's TEXTURES.dots — keep in sync.
            The soft radial patches under the dots lighten/darken areas so it
            reads as textured paper, not a flat repeat. */}
        <div
          style={{
            backgroundImage:
              "radial-gradient(rgba(241,234,241,0.11) 1px, transparent 1.4px)," +
              "radial-gradient(900px 700px at 18% 14%, rgba(241,234,241,0.045), transparent 70%)," +
              "radial-gradient(1100px 820px at 80% 36%, rgba(0,0,0,0.4), transparent 72%)," +
              "radial-gradient(1000px 780px at 38% 64%, rgba(241,234,241,0.035), transparent 70%)," +
              "radial-gradient(950px 720px at 86% 88%, rgba(0,0,0,0.34), transparent 74%)",
            backgroundSize: "22px 22px, 100% 100%, 100% 100%, 100% 100%, 100% 100%",
          }}
        >
          <Hero />
          <div aria-hidden className="h-[34vh]" />
        </div>
      </StickyHero>

      {/* GLASS SEAM — everything after the hero rides a frosted dark-glass plate that
          slides UP over the pinned hero (mirrors the homepage About-over-hero move).
          Gradient retinted to Vector's near-black surface, landing on solid bg fast. */}
      <div
        className="relative isolate z-10 rounded-t-[2.5rem] backdrop-blur-2xl backdrop-saturate-150 shadow-[0_-32px_70px_-16px_rgba(0,0,0,0.85)]"
        style={{
          background:
            "linear-gradient(180deg, rgba(20,20,26,0.55) 0px, rgba(20,20,26,0.78) 70px, rgba(20,20,26,0.93) 138px, rgba(20,20,26,0.98) 172px, #14141a 192px)",
        }}
      >
        {/* glass rim glint (white, reads on the dark seam) */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 h-px rounded-t-[2.5rem]"
          style={{
            background:
              "linear-gradient(90deg, rgba(255,255,255,0), rgba(255,255,255,0.6) 22%, rgba(255,255,255,0.25) 50%, rgba(255,255,255,0.5) 78%, rgba(255,255,255,0))",
          }}
        />

        {/* AMBIENT BLOBS — one continuous layer behind every section, so Vector's
            lilac→peach AI glow bleeds across section boundaries instead of being clipped
            at each edge. Luminous over the near-black plate. */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 -z-10 overflow-hidden rounded-t-[2.5rem]"
        >
          <SoftBlob className="left-[12%] top-[6%] h-[760px] w-[940px]" />
          <SoftBlob className="right-[4%] top-[20%] h-[880px] w-[1040px]" />
          <SoftBlob className="left-[6%] top-[36%] h-[840px] w-[1000px]" />
          <SoftBlob className="right-[8%] top-[52%] h-[880px] w-[1060px]" />
          <SoftBlob className="left-[10%] top-[68%] h-[820px] w-[980px]" />
          <SoftBlob className="right-[6%] top-[84%] h-[860px] w-[1020px]" />
        </div>

        <div data-vec="MyRole"><MyRole /></div>
        <div data-vec="Problem"><Problem /></div>
        <div data-vec="Product"><Product /></div>
        <div data-vec="Matching"><Matching /></div>
        <div data-vec="AILayer"><AILayer /></div>
        <div data-vec="Observability"><Observability /></div>
        <div data-vec="Architecture"><Architecture /></div>
        <div data-vec="Collaboration"><Collaboration /></div>
        {/* Takeaways unmounted 2026-07-09 — its old copy moved into Collaboration;
            remounts once Caroline provides the new "Key takeaways" copy. */}
        {/* WhatsNext unmounted 2026-07-13 — Caroline is still working on it;
            remount when ready: <div data-vec="WhatsNext"><WhatsNext /></div> */}
        <div data-vec="NextProject"><NextProject /></div>
      </div>
    </main>
  );
}
