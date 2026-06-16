"use client";

import { useEffect, useRef } from "react";
import { Marquee } from "@/components/Marquee";

// The apps Caroline works in — design tools flowing into build/dev tools — on a
// full-bleed glass strip that loops left→right forever. The strip's glass
// background, its top/bottom glass edges, and the icons all dissolve into the
// dark page at both screen edges via one horizontal mask.
//
// Icon glass (Apple liquid-glass language): each tile has a soft face sheen plus
// a RIM shine with two bright arcs at OPPOSITE corners (top-left + bottom-right),
// so the top and bottom edges are each half-lit — in opposite halves. The rim
// shine ROTATES with scroll (one `--shine` angle var set on the section, every
// rim reads it) so the highlights travel around the tiles as you scroll, the way
// Apple's specular highlights move with device tilt.
//
// Icons live in /public/assets/toolkit. `contain` icons are bare brand glyphs
// (padded, centred on the dark tile); the rest are full app-icon art (object-
// cover fills the squircle). Plain <img> so SVG + png/webp/jpeg all just work.
type App = { src: string; label: string; contain?: boolean };

const APPS: App[] = [
  { src: "/assets/toolkit/figma.png", label: "Figma" },
  { src: "/assets/toolkit/illustrator.webp", label: "Illustrator" },
  { src: "/assets/toolkit/PS.png", label: "Photoshop" },
  { src: "/assets/toolkit/framer.svg", label: "Framer", contain: true },
  { src: "/assets/toolkit/miro.png", label: "Miro" },
  { src: "/assets/toolkit/asana.png", label: "Asana" },
  // product-journey tools — research, analytics, AI, 3D (sit between asana and
  // the dev tools)
  { src: "/assets/toolkit/notebooklm.webp", label: "NotebookLM" },
  { src: "/assets/toolkit/mixpanel.png", label: "Mixpanel", contain: true },
  { src: "/assets/toolkit/marvin.jpeg", label: "Marvin" },
  { src: "/assets/toolkit/spline.jpeg", label: "Spline" },
  { src: "/assets/toolkit/chatgpt.jpg", label: "ChatGPT" },
  { src: "/assets/toolkit/miniti.png", label: "Miniti" },
  { src: "/assets/toolkit/google-ai-studio.png", label: "Google AI Studio", contain: true },
  { src: "/assets/toolkit/obsidian1.png", label: "Obsidian" },
  // build / data / dev tools
  { src: "/assets/toolkit/cursor.jpeg", label: "Cursor" },
  { src: "/assets/toolkit/github.svg", label: "GitHub", contain: true },
  { src: "/assets/toolkit/vercel.svg", label: "Vercel", contain: true },
  { src: "/assets/toolkit/supabase.svg", label: "Supabase", contain: true },
  { src: "/assets/toolkit/surrealdb.svg", label: "SurrealDB" },
  { src: "/assets/toolkit/iterm.png", label: "iTerm" },
  { src: "/assets/toolkit/raycast.svg", label: "Raycast", contain: true },
  { src: "/assets/toolkit/claude-ai-icon.webp", label: "Claude" },
  { src: "/assets/toolkit/claudecode.webp", label: "Claude Code" },
  { src: "/assets/toolkit/opik.svg", label: "Opik", contain: true },
  { src: "/assets/toolkit/midjourney.png", label: "Midjourney" },
  { src: "/assets/toolkit/images.png", label: "Whispr Flow" },
];

// One marquee copy must exceed the viewport width or the loop shows a gap.
// 3× the set covers ultra-wide screens (and stays safe as Caroline adds icons).
const LOOP = [...APPS, ...APPS, ...APPS];

// Fades the whole strip — glass bg, edge lines, icons — into the dark at both ends.
const EDGE_FADE =
  "linear-gradient(90deg, transparent 0%, #000 10%, #000 90%, transparent 100%)";

// Two bright arcs at OPPOSITE corners (≈135° bottom-right, ≈315° top-left) with
// the rest dim, so each edge reads half-lit. The whole gradient is rotated by
// the scroll-driven `--shine` angle, sweeping the highlights around the rim.
const RIM_SHINE =
  "conic-gradient(from 0deg, rgba(255,255,255,0.02) 0deg, rgba(255,255,255,0.05) 55deg, rgba(255,255,255,0.55) 135deg, rgba(255,255,255,0.02) 185deg, rgba(255,255,255,0.02) 270deg, rgba(255,255,255,0.7) 315deg, rgba(255,255,255,0.05) 350deg, rgba(255,255,255,0.02) 360deg)";

// Border-ring mask (shows only the 1.5px padding band → a rim, not the face).
const RING_MASK: React.CSSProperties = {
  padding: "1.5px",
  WebkitMask:
    "linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)",
  WebkitMaskComposite: "xor",
  mask: "linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)",
  maskComposite: "exclude",
};

export function Toolkit() {
  const rootRef = useRef<HTMLElement>(null);

  // Drive the rim shine from scroll: one rAF-throttled handler sets `--shine`
  // (icon-rim rotation) and `--edge-shift` (top/bottom edge glint travel) on the
  // section; every rim + edge inherits them (cheap — two vars, GPU transforms).
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let raf = 0;
    const update = () => {
      raf = 0;
      const el = rootRef.current;
      if (!el) return;
      el.style.setProperty("--shine", `${window.scrollY * 0.16}deg`);
      // edge glints glide along the hairlines as you scroll. Each wraps into the
      // -120%→300% travel range; the bottom runs the opposite direction and is
      // phase-offset (≈half a cycle) so both reliably pass through view.
      const t = window.scrollY * 0.18;
      const wrap = (v: number) => (((v % 420) + 420) % 420) - 120;
      el.style.setProperty("--edge-shift", `${wrap(t)}%`);
      el.style.setProperty("--edge-shift-b", `${wrap(-t + 210)}%`);
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    update();
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <section ref={rootRef} aria-label="Toolkit" className="py-24 md:py-32">
      {/* identical column geometry to the #work /projects label (full-width px
          box → centred max-w-7xl/88rem → pl-2) so the two line up at every width */}
      <div className="mb-8 px-8 md:px-12">
        <div className="mx-auto w-full max-w-7xl 2xl:max-w-[88rem]">
          {/* directory-style label, matched to /about & /projects */}
          <div className="pl-2 font-mono text-xs md:text-sm tracking-[0.2em] text-fg/70">
            /toolkit
          </div>
        </div>
      </div>

      {/* full-bleed glass strip; everything inside fades into the dark at the ends */}
      <div
        className="relative"
        style={{ maskImage: EDGE_FADE, WebkitMaskImage: EDGE_FADE }}
      >
        {/* glass background band — translucent, lit toward the top */}
        <div
          aria-hidden
          className="absolute inset-0 backdrop-blur-xl backdrop-saturate-150"
          style={{
            background:
              "linear-gradient(180deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.015) 38%, rgba(10,10,13,0.22) 100%)",
          }}
        />
        {/* top + bottom glass edges — lit hairlines with a specular glint that
            sweeps along them (see .toolkit-edge in globals.css) */}
        <div aria-hidden className="toolkit-edge toolkit-edge--top" />
        <div aria-hidden className="toolkit-edge toolkit-edge--bottom" />

        {/* the looping apps, above the glass */}
        <div className="relative z-10">
          <Marquee durationSec={70} reverse>
            <div className="flex items-center gap-4 py-6 pr-4 md:gap-5 md:pr-5">
              {LOOP.map((app, i) => (
                <DockIcon key={`${app.label}-${i}`} app={app} />
              ))}
            </div>
          </Marquee>
        </div>
      </div>
    </section>
  );
}

function DockIcon({ app }: { app: App }) {
  return (
    <div
      className="relative size-14 flex-none overflow-hidden rounded-[1.15rem] md:size-16"
      style={{ background: "rgba(20,20,26,0.55)" }}
      title={app.label}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={app.src}
        alt={app.label}
        className={`h-full w-full ${app.contain ? "object-contain p-3.5" : "object-cover"}`}
      />
      {/* face sheen — soft glass gloss, upper-left */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(120% 85% at 28% 0%, rgba(255,255,255,0.22), transparent 52%)",
        }}
      />
      {/* moving rim shine — two bright arcs at opposite corners; rotates w/ scroll */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 overflow-hidden rounded-[1.15rem]"
        style={RING_MASK}
      >
        <div
          className="absolute inset-[-55%]"
          style={{
            background: RIM_SHINE,
            transform: "rotate(var(--shine, 0deg))",
            willChange: "transform",
          }}
        />
      </div>
      {/* faint static base rim for definition (dark bottom edge) */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-[1.15rem]"
        style={{
          boxShadow:
            "inset 0 -1px 1px rgba(0,0,0,0.45), inset 0 0 0 0.5px rgba(255,255,255,0.06)",
        }}
      />
    </div>
  );
}
