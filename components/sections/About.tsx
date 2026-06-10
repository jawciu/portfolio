"use client";

import Image from "next/image";
import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { useInView } from "@/lib/useInView";
import { StreamingText } from "./StreamingText";

gsap.registerPlugin(ScrollTrigger, useGSAP);

// Caroline's voice — kept casual on purpose (lowercase starts + unicode
// sprinkles are intentional). Paragraph breaks survive via whitespace-pre-line
// on the StreamingText element; the streaming reveal is length-agnostic.
const BIO = `I'm a multi-skilled product designer. I solve problems fast and focus on listening to users via qualitative methods and looking at data. ˚ ⊹ ｡ ·

✧ With my background in fashion and graphics I have attention to detail and an eye for design. I don't believe in pixel perfect but ship fast and learn, though because of my skills I can do good design fast.

♡ ❀ I'm forever learning. always on the new side quest building new skills and finding tools whilst working on yet another project. ° ◦

☆⋆✦ currently vibing with Claude and learning more about code architecture in the meantime. Also learning 3d :) Also trying to get to do a handstand. current sport quests: calisthenics, yoga, ultimate frisbee and squash. ✿`;

// Rim reflections, Apple-icon style (refs: Caroline's glass sphere + the
// Liquid Glass Podcasts icon; Icon Composer docs — "crisp specular highlights
// preserve contrast at the edges", lit from above). Each arc is an annular
// band with ASYMMETRIC edges: a long soft ramp from the inside (light
// dispersing into the glass) up to a peak, then a hard cut at the outer
// radius (the crisp specular line at the rim). Conic mask sets the arc span;
// scroll rotates each around the circle at its own rate.
const ARCS = [
  {
    // crown highlight — compact arc at the top
    band: "radial-gradient(circle closest-side at 50% 50%, transparent 62%, rgba(255,255,255,0.05) 76%, rgba(255,255,255,0.17) 89%, rgba(255,255,255,0.22) 92%, transparent 95.5%)",
    sweep:
      "conic-gradient(from 300deg, transparent 0deg, black 38deg, black 82deg, transparent 120deg, transparent 360deg)",
    fromDeg: -75,
    toDeg: 75,
  },
  {
    // crisp bright arc near the lower-right edge
    band: "radial-gradient(circle closest-side at 50% 50%, transparent 76%, rgba(255,255,255,0.06) 85%, rgba(255,255,255,0.28) 93%, rgba(255,255,255,0.34) 95%, transparent 97.5%)",
    sweep:
      "conic-gradient(from 75deg, transparent 0deg, black 22deg, black 60deg, transparent 82deg, transparent 360deg)",
    fromDeg: 95,
    toDeg: -50,
    // sparkle hotspot, offset right of the arc's centre (~105° around the
    // rim): tapered "window reflection" whose long edges bow with the circle.
    glint: { left: "91.5%", top: "61%", w: "12%", h: "6%", rot: 105, peak: 0.75 },
  },
];

export function About() {
  const { ref, inView } = useInView<HTMLDivElement>(0.35);
  const arcRefs = useRef<(HTMLDivElement | null)[]>([]);
  const ringRef = useRef<HTMLDivElement>(null);

  // Liquid-glass motion (research: Apple's glass reads "alive" because its
  // specular highlights MOVE with device motion — here scroll is the motion):
  // the rim arcs rotate around the disc as the section transits the viewport.
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const st = {
          trigger: ref.current,
          start: "top bottom",
          end: "bottom top",
          scrub: 0.6,
        };
        ARCS.forEach((a, i) => {
          gsap.fromTo(
            arcRefs.current[i],
            { rotate: a.fromDeg },
            { rotate: a.toDeg, ease: "none", scrollTrigger: st },
          );
        });
        gsap.fromTo(
          ringRef.current,
          { rotate: -130 },
          { rotate: 130, ease: "none", scrollTrigger: st },
        );
      });
    },
    { scope: ref },
  );

  return (
    // Glass sheet over the fixed hero canvas: backdrop blur frosts the orbs
    // behind it, the gradient starts translucent (orbs glow through) and lands
    // on solid bg BEFORE the bottom edge so the black plate below joins with
    // no visible line. The closely-spaced stops ease the landing — a linear
    // ramp straight into solid reads as a sharp edge (Mach band) where it
    // cuts the orb glow.
    <section
      id="about"
      ref={ref}
      className="relative overflow-hidden rounded-t-[2.5rem] backdrop-blur-2xl backdrop-saturate-150"
      style={{
        background:
          "linear-gradient(180deg, rgba(5,5,7,0.38) 0%, rgba(5,5,7,0.66) 55%, rgba(5,5,7,0.82) 72%, rgba(5,5,7,0.93) 84%, rgba(5,5,7,0.98) 92%, #050507 97%)",
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
      {/* Diagonal sheen sweeping across the surface — the Apple-glass move.
          Masked out before the section's bottom edge: its white wash would
          otherwise end in a hard cut against the black plate below (this was
          the visible straight line when scrolling past About). */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 mix-blend-screen"
        style={{
          background:
            "linear-gradient(115deg, rgba(255,255,255,0.085) 0%, rgba(255,255,255,0.035) 16%, transparent 30%, transparent 72%, rgba(255,255,255,0.04) 100%)",
          maskImage:
            "linear-gradient(180deg, black 0%, black 78%, transparent 96%)",
          WebkitMaskImage:
            "linear-gradient(180deg, black 0%, black 78%, transparent 96%)",
        }}
      />
      <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-10 px-8 py-28 md:grid-cols-[minmax(0,420px)_1fr] md:gap-16 md:px-12 md:py-40">
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
        </div>
        {/* sphere reflections — light/shadow arcs hugging the rim, rotated by
            scroll (see ARCS above). Siblings of the masked disc so the
            dissolve doesn't dim them; their ring gradients are radially
            bounded, so nothing square can show. */}
        {ARCS.map((a, i) => (
          <div
            key={i}
            ref={(el) => {
              arcRefs.current[i] = el;
            }}
            aria-hidden
            className="pointer-events-none absolute inset-7 rounded-full"
            style={{
              background: a.band,
              maskImage: a.sweep,
              WebkitMaskImage: a.sweep,
              // no blur filter — the soft inner falloff lives in the gradient
              // stops; blurring would kill the crisp outer specular line
              willChange: "transform",
            }}
          >
            {/* glint hotspot — child of the arc, so it orbits with it.
                Tapered "window reflection" (wide trailing end, narrowing
                forward) drawn as an SVG path so its long edges BOW with the
                circle's curvature ("up" in local space = outward after the
                rotate). Radial gradient fill + slight blur keep it soft. */}
            {a.glint && (
              <svg
                aria-hidden
                className="absolute mix-blend-screen"
                style={{
                  left: a.glint.left,
                  top: a.glint.top,
                  width: a.glint.w,
                  height: a.glint.h,
                  transform: `translate(-50%, -50%) rotate(${a.glint.rot}deg)`,
                  filter: "blur(1.5px)",
                  overflow: "visible",
                }}
                viewBox="0 0 100 50"
                preserveAspectRatio="none"
              >
                <defs>
                  <radialGradient id="glint-grad" cx="58%" cy="50%" r="62%">
                    <stop offset="0%" stopColor={`rgba(255,255,255,${a.glint.peak})`} />
                    <stop offset="55%" stopColor={`rgba(255,255,255,${a.glint.peak * 0.4})`} />
                    <stop offset="100%" stopColor="rgba(255,255,255,0)" />
                  </radialGradient>
                </defs>
                <path
                  d="M 0,34 Q 55,10 100,8 L 100,42 Q 55,36 0,46 Z"
                  fill="url(#glint-grad)"
                />
              </svg>
            )}
          </div>
        ))}
        {/* Glass edge — crisp ~2px glassmorphism ring OUTSIDE the dissolve
            mask (a sibling, so the fade can't eat it). Conic gradient so the
            border reads lit: brightest top-left, dimmer around. */}
        <div
          ref={ringRef}
          aria-hidden
          className="pointer-events-none absolute inset-7 rounded-full"
          style={{
            // tight bright "comet" + a dim counter-glint opposite, deep dark
            // between — concentrated segments make the scroll rotation READ
            // (a broad gradient slid invisibly along a 1px line)
            background:
              "conic-gradient(from 180deg, rgba(255,255,255,0.04), rgba(255,255,255,0.03) 40%, rgba(255,255,255,0.30) 56%, rgba(255,255,255,0.92) 62%, rgba(255,255,255,0.30) 68%, rgba(255,255,255,0.03) 82%, rgba(255,255,255,0.16) 92%, rgba(255,255,255,0.04))",
            willChange: "transform",
            maskImage:
              "radial-gradient(circle closest-side at 50% 50%, transparent 99.0%, black 99.3%, black 99.8%, transparent 100%)",
            WebkitMaskImage:
              "radial-gradient(circle closest-side at 50% 50%, transparent 99.0%, black 99.3%, black 99.8%, transparent 100%)",
          }}
        />
      </div>

      <div className="max-w-3xl">
        {/* Section label — same type treatment as the top-left path label
            (~/caro/portfolio/2026 in page.tsx). */}
        <div className="mb-6 font-mono text-xs md:text-sm tracking-[0.2em] text-fg/70">
          /about
        </div>
        <StreamingText
          text={BIO}
          active={inView}
          className="whitespace-pre-line font-body text-lg leading-relaxed text-fg/90 md:text-xl"
        />
      </div>
      </div>
    </section>
  );
}
