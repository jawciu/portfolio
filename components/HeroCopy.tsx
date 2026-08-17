"use client";

import { useEffect, useState } from "react";

// The headline types itself in on first paint, then the intro paragraphs
// STREAM in after it (same feel as the About bio) — one timeline, so the copy
// never sits there fully-formed while the headline is still keying in.
// ("Hi I'm Caroline," intro line removed 2026-08-17 per Caroline.)
const HEADLINE = "I turn early concepts into\nlaunch-ready products";

const START_DELAY = 350; // ms before the first character
const HEADLINE_SPEED = 42;
const SUB_DELAY = 250; // beat between headline finishing and the stream
const SUB_CPS = 550; // paragraph stream speed (chars/second)

const MINT = "text-[#94FFD9]";
const BOLD = "text-fg font-semibold";

// Rich segments: cls styles the span; decor marks the unicode sparkles
// (aria-hidden on the visible layer, excluded from the sr-only text).
type Seg = { t: string; cls?: string; decor?: boolean };

const PARAGRAPHS: Seg[][] = [
  [
    { t: "I’m a designer with " },
    { t: "13 years", cls: BOLD },
    {
      t: " across physical and digital products. I started in luxury fashion, designing garments, graphics and brand identities for Alexander McQueen, Burberry and Casablanca. ",
    },
    { t: "˚ ⊹ ｡ ·", cls: MINT, decor: true },
  ],
  [
    { t: "✧ ", cls: MINT, decor: true },
    { t: "I spent two years as the " },
    { t: "founding designer at a pre-seed startup", cls: BOLD },
    {
      t: ", owning discovery, research and delivery, with 0-to-1 launches that lifted engagement by 30%.",
    },
  ],
  [
    { t: "✦ ", cls: MINT, decor: true },
    {
      t: "Today I build AI tools at E.ON Next, where my squad owns its products end to end. The knowledge assistant I designed reached a ",
    },
    { t: "97% would-recommend", cls: BOLD },
    { t: " score and a green light for company-wide rollout. " },
    { t: "° ◦", cls: MINT, decor: true },
  ],
];

const paraLen = (segs: Seg[]) => segs.reduce((n, s) => n + s.t.length, 0);
const SUB_TOTAL = PARAGRAPHS.reduce((n, p) => n + paraLen(p), 0);

// Render a paragraph's segments up to `count` visible characters.
function renderSegs(segs: Seg[], count: number) {
  const out: React.ReactNode[] = [];
  let used = 0;
  segs.forEach((s, i) => {
    if (used >= count) return;
    const take = Math.min(s.t.length, count - used);
    used += take;
    const slice = s.t.slice(0, take);
    out.push(
      s.cls || s.decor ? (
        <span key={i} className={s.cls} aria-hidden={s.decor || undefined}>
          {slice}
        </span>
      ) : (
        <span key={i}>{slice}</span>
      ),
    );
  });
  return out;
}

function Caret({ blink }: { blink: boolean }) {
  return (
    <span
      aria-hidden
      className="inline-block w-[0.08em] -mb-[0.12em] h-[0.92em] translate-x-[0.06em] bg-fg/85"
      style={
        blink ? { animation: "hero-caret-blink 1.05s step-end infinite" } : undefined
      }
    />
  );
}

export function HeroCopy() {
  const [headLen, setHeadLen] = useState(0);
  const [subLen, setSubLen] = useState(0);
  const [done, setDone] = useState(false);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      setHeadLen(HEADLINE.length);
      setSubLen(SUB_TOTAL);
      setDone(true);
      return;
    }

    let h = 0;
    let timer: ReturnType<typeof setTimeout>;
    let raf = 0;

    const streamSub = () => {
      let start = 0;
      const tick = (t: number) => {
        if (!start) start = t;
        const n = Math.min(SUB_TOTAL, Math.floor(((t - start) / 1000) * SUB_CPS));
        setSubLen(n);
        if (n < SUB_TOTAL) raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
    };

    const typeHeadline = () => {
      h += 1;
      setHeadLen(h);
      if (h < HEADLINE.length) {
        timer = setTimeout(typeHeadline, HEADLINE_SPEED);
      } else {
        setDone(true);
        timer = setTimeout(streamSub, SUB_DELAY);
      }
    };

    timer = setTimeout(typeHeadline, START_DELAY);
    return () => {
      clearTimeout(timer);
      cancelAnimationFrame(raf);
    };
  }, []);

  // Per-paragraph visible counts from the single stream counter.
  const counts: number[] = [];
  let remaining = subLen;
  for (const p of PARAGRAPHS) {
    const len = paraLen(p);
    counts.push(Math.max(0, Math.min(len, remaining)));
    remaining -= counts[counts.length - 1];
  }

  return (
    <div className="font-hero">
      {/* Accessible, instantly-complete copy for screen readers */}
      <p className="sr-only">
        {HEADLINE.replace("\n", " ")}{" "}
        {PARAGRAPHS.map((p) =>
          p.filter((s) => !s.decor).map((s) => s.t).join(""),
        ).join(" ")}
      </p>

      <div aria-hidden className="flex flex-col gap-4">
        {/* Desktop keeps the authored break after "into" (pre-line renders the \n).
            Below md the \n collapses to a space (whitespace-normal) so the headline
            wraps naturally to three lines instead of stranding INTO alone. */}
        <h1 className="font-bold uppercase text-[clamp(2rem,5.2vw,4.25rem)] leading-[1.02] tracking-tight text-fg whitespace-pre-line max-md:whitespace-normal min-h-[2.04em]">
          {HEADLINE.slice(0, headLen)}
          <Caret blink={done} />
        </h1>

        {/* Streamed intro paragraphs. Each <p> keeps an INVISIBLE full copy for
            sizing (no layout shift while streaming) with the streamed text
            overlaid on top — identical content prefix, identical wrapping. */}
        <div className="mt-10 max-w-[47rem] flex flex-col gap-6 font-body text-lg md:text-xl leading-relaxed text-fg/75 max-md:mt-6 max-md:gap-4 max-md:text-base">
          {PARAGRAPHS.map((p, i) => (
            <p key={i} className="relative">
              <span className="invisible">{renderSegs(p, Infinity)}</span>
              <span className="absolute inset-0">{renderSegs(p, counts[i])}</span>
            </p>
          ))}
        </div>
      </div>
    </div>
  );
}
