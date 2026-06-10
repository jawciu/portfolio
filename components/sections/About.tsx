"use client";

import Image from "next/image";
import { useInView } from "@/lib/useInView";
import { StreamingText } from "./StreamingText";

// Caroline's voice — kept casual on purpose. Swap freely; the streaming reveal
// is length-agnostic.
const BIO =
  "I'm a multi-skilled product designer. I solve problems fast and focus on listening to users through qualitative methods and looking at the data. With a background in fashion and graphics I bring attention to detail and an eye for design. I don't believe in pixel-perfect — I ship fast and learn, and because of my range I can do good design quickly. I'm forever learning, always on the new side quest, building skills and finding tools while working on personal projects. Currently vibing with Claude and digging into code architecture. Also learning 3D :) and trying to land a handstand. Current sport quests: calisthenics, yoga, ultimate frisbee and squash.";

export function About() {
  const { ref, inView } = useInView<HTMLDivElement>(0.35);

  return (
    // Glass sheet over the fixed hero canvas: backdrop blur frosts the orbs
    // behind it, the gradient starts translucent (orbs glow through) and lands
    // on solid bg by the bottom edge so the next section joins seamlessly.
    <section
      id="about"
      ref={ref}
      className="relative overflow-hidden rounded-t-[2.5rem] backdrop-blur-2xl backdrop-saturate-150"
      style={{
        background:
          "linear-gradient(180deg, rgba(5,5,7,0.38) 0%, rgba(5,5,7,0.66) 55%, #050507 100%)",
      }}
    >
      {/* Specular rim — the top hairline brightens where the "light" hits
          (left third), like a glint running along a glass edge. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-px"
        style={{
          background:
            "linear-gradient(90deg, rgba(245,245,245,0.06), rgba(255,255,255,0.55) 18%, rgba(245,245,245,0.18) 42%, rgba(245,245,245,0.08) 70%, rgba(245,245,245,0.03))",
        }}
      />
      {/* Light pool bleeding down from the rim under the glint. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-44"
        style={{
          background:
            "radial-gradient(42% 100% at 18% 0%, rgba(255,255,255,0.10), transparent 70%)",
        }}
      />
      {/* Diagonal sheen sweeping across the surface — the Apple-glass move. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 mix-blend-screen"
        style={{
          background:
            "linear-gradient(115deg, rgba(255,255,255,0.085) 0%, rgba(255,255,255,0.035) 16%, transparent 30%, transparent 72%, rgba(255,255,255,0.04) 100%)",
        }}
      />
      <div className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-10 px-8 py-28 md:grid-cols-[minmax(0,420px)_1fr] md:gap-16 md:px-12 md:py-40">
      {/* Photo — circular cut-out set under a glass lens: rim glint, diagonal
          sheen and glare arc (same specular language as the About sheet),
          shaded inner edge so the disc reads curved. */}
      <div className="relative aspect-square w-full max-w-[420px] md:-ml-10">
        {/* Orb-edge treatment: the photo is inset (p-7) so the rim blur has
            room to SMEAR outward past the photo's edge — content bleeding
            into the dark like the orbs — before the outer mask dissolves it.
            No overflow clip; the PNG's own transparency is the circle. */}
        <div
          className="relative h-full w-full"
          style={{
            maskImage:
              "radial-gradient(circle closest-side at 50% 50%, black 40%, rgba(0,0,0,0.6) 62%, rgba(0,0,0,0.2) 84%, transparent 99%)",
            WebkitMaskImage:
              "radial-gradient(circle closest-side at 50% 50%, black 40%, rgba(0,0,0,0.6) 62%, rgba(0,0,0,0.2) 84%, transparent 99%)",
          }}
        >
          <Image
            src="/assets/portrait.png"
            alt="Caroline Jaworsky — profile portrait with a pink bougainvillea tucked behind her ear"
            fill
            sizes="(min-width: 768px) 420px, 90vw"
            className="object-contain p-7"
          />
          {/* heavy rim smear — blurred copy whose blur bleeds outward past
              the photo edge into the padding margin */}
          <Image
            src="/assets/portrait.png"
            alt=""
            aria-hidden
            fill
            sizes="(min-width: 768px) 420px, 90vw"
            className="object-contain p-7"
            style={{
              filter: "blur(24px) saturate(1.2)",
              maskImage:
                "radial-gradient(circle closest-side at 50% 50%, transparent 60%, black 88%)",
              WebkitMaskImage:
                "radial-gradient(circle closest-side at 50% 50%, transparent 60%, black 88%)",
            }}
          />
          {/* dark vignette — classic edge darkening over the blur */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                "radial-gradient(circle closest-side at 50% 50%, transparent 52%, rgba(5,5,7,0.55) 100%)",
            }}
          />
          {/* diagonal sheen across the lens */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 mix-blend-screen"
            style={{
              background:
                "linear-gradient(115deg, rgba(255,255,255,0.16) 0%, rgba(255,255,255,0.05) 22%, transparent 38%, transparent 72%, rgba(255,255,255,0.06) 100%)",
            }}
          />
          {/* glare arc near the top-left rim */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                "radial-gradient(42% 30% at 30% 10%, rgba(255,255,255,0.22), transparent 70%)",
            }}
          />
        </div>
        {/* Glass edge — crisp ~2px glassmorphism ring OUTSIDE the dissolve
            mask (a sibling, so the fade can't eat it). Conic gradient so the
            border reads lit: brightest top-left, dimmer around. */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-7 rounded-full"
          style={{
            background:
              "conic-gradient(from 90deg, rgba(255,255,255,0.10), rgba(255,255,255,0.02) 30%, rgba(255,255,255,0.90) 62%, rgba(255,255,255,0.04) 85%, rgba(255,255,255,0.10))",
            maskImage:
              "radial-gradient(circle closest-side at 50% 50%, transparent 99.0%, black 99.3%, black 99.8%, transparent 100%)",
            WebkitMaskImage:
              "radial-gradient(circle closest-side at 50% 50%, transparent 99.0%, black 99.3%, black 99.8%, transparent 100%)",
          }}
        />
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
      </div>
    </section>
  );
}
