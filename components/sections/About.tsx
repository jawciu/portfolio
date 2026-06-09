"use client";

import { useInView } from "@/lib/useInView";
import { StreamingText } from "./StreamingText";

// Caroline's voice — kept casual on purpose. Swap freely; the streaming reveal
// is length-agnostic.
const BIO =
  "I'm a multi-skilled product designer. I solve problems fast and focus on listening to users through qualitative methods and looking at the data. With a background in fashion and graphics I bring attention to detail and an eye for design. I don't believe in pixel-perfect — I ship fast and learn, and because of my range I can do good design quickly. I'm forever learning, always on the new side quest, building skills and finding tools while working on personal projects. Currently vibing with Claude and digging into code architecture. Also learning 3D :) and trying to land a handstand. Current sport quests: calisthenics, yoga, ultimate frisbee and squash.";

export function About() {
  const { ref, inView } = useInView<HTMLDivElement>(0.35);

  return (
    <section
      id="about"
      ref={ref}
      className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-10 px-8 py-28 md:grid-cols-[minmax(0,420px)_1fr] md:gap-16 md:px-12 md:py-40"
    >
      {/* Photo — placeholder until the real asset drops into /public/assets.
          Replace this block with a next/image <Image> at the same aspect. */}
      <div className="relative aspect-square w-full max-w-[420px] overflow-hidden rounded-[2rem] border border-fg/10">
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(120% 120% at 30% 20%, rgba(255,122,42,0.35), transparent 55%), radial-gradient(120% 120% at 80% 90%, rgba(122,59,255,0.4), transparent 55%), #0a0a0d",
          }}
        />
        <div className="absolute inset-0 grid place-items-center font-mono text-xs uppercase tracking-[0.3em] text-fg/40">
          [ portrait ]
        </div>
      </div>

      <div className="max-w-2xl">
        <div className="mb-6 font-mono text-xs uppercase tracking-[0.3em] text-fg-muted">
          {"// about"}
        </div>
        <StreamingText
          text={BIO}
          active={inView}
          className="font-body text-lg leading-relaxed text-fg/90 md:text-xl"
        />
      </div>
    </section>
  );
}
