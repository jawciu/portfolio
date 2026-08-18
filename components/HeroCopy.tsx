"use client";

import { useEffect, useState } from "react";

// The intro types itself in on first paint — "Hi I'm Caroline," then the
// headline — then the intro paragraphs STREAM in (same feel as the About bio),
// with the die-cut sticker avatar floated into the first paragraph so the
// lower lines wrap around it. One timeline drives the whole sequence.
const INTRO = "Hi I’m Caroline,";
const HEADLINE = "I turn early concepts into\nlaunch-ready products";

const START_DELAY = 350; // ms before the first character
const INTRO_SPEED = 55; // ms per intro character
const PAUSE = 450; // beat between intro and headline
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
      t: ", owning discovery, research and delivery, with 0-to-1 launches. Today I build AI tools at E.ON Next, where my squad owns its products end to end. ",
    },
    { t: "° ◦", cls: MINT, decor: true },
  ],
];

const paraLen = (segs: Seg[]) => segs.reduce((n, s) => n + s.t.length, 0);
const SUB_TOTAL = PARAGRAPHS.reduce((n, p) => n + paraLen(p), 0);

// Render a paragraph's segments: the first `count` characters visible, the
// remainder rendered INVISIBLE in the same inline flow — so the paragraph
// always occupies its final space (no layout shift, and text wraps correctly
// around the floated avatar).
function renderSplit(segs: Seg[], count: number) {
  const out: React.ReactNode[] = [];
  let used = 0;
  segs.forEach((s, i) => {
    const take = Math.max(0, Math.min(s.t.length, count - used));
    used += s.t.length;
    const vis = s.t.slice(0, take);
    const hid = s.t.slice(take);
    if (vis)
      out.push(
        <span key={`v${i}`} className={s.cls} aria-hidden={s.decor || undefined}>
          {vis}
        </span>,
      );
    if (hid)
      out.push(
        <span
          key={`h${i}`}
          className={s.cls ? `${s.cls} invisible` : "invisible"}
          aria-hidden={s.decor || undefined}
        >
          {hid}
        </span>,
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
  const [introLen, setIntroLen] = useState(0);
  const [headLen, setHeadLen] = useState(0);
  const [subLen, setSubLen] = useState(0);
  const [done, setDone] = useState(false);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      setIntroLen(INTRO.length);
      setHeadLen(HEADLINE.length);
      setSubLen(SUB_TOTAL);
      setDone(true);
      return;
    }

    let i = 0;
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

    const typeIntro = () => {
      i += 1;
      setIntroLen(i);
      if (i < INTRO.length) {
        timer = setTimeout(typeIntro, INTRO_SPEED);
      } else {
        timer = setTimeout(typeHeadline, PAUSE);
      }
    };

    timer = setTimeout(typeIntro, START_DELAY);
    return () => {
      clearTimeout(timer);
      cancelAnimationFrame(raf);
    };
  }, []);

  const introTyping = introLen < INTRO.length;
  const headlineStarted = headLen > 0;
  const caretOnIntro = !headlineStarted && !done;

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
        {INTRO} {HEADLINE.replace("\n", " ")}{" "}
        {PARAGRAPHS.map((p) =>
          p.filter((s) => !s.decor).map((s) => s.t).join(""),
        ).join(" ")}
      </p>

      <div aria-hidden className="flex flex-col gap-4">
        <p className="text-2xl md:text-4xl text-fg font-black">
          {INTRO.slice(0, introLen)}
          {caretOnIntro && <Caret blink={!introTyping} />}
        </p>
        {/* Desktop keeps the authored break after "into" (pre-line renders the \n).
            Below md the \n collapses to a space (whitespace-normal) so the headline
            wraps naturally to three lines instead of stranding INTO alone. */}
        <h1 className="font-bold uppercase text-[clamp(2rem,5.2vw,4.25rem)] leading-[1.02] tracking-tight text-fg whitespace-pre-line max-md:whitespace-normal min-h-[2.04em]">
          {HEADLINE.slice(0, headLen)}
          {headlineStarted && <Caret blink={done} />}
        </h1>

        {/* Streamed intro paragraphs. The avatar floats left inside the first
            one so its lower lines wrap around the sticker; the invisible
            remainder of each paragraph reserves final space (no layout shift). */}
        <div className="mt-10 max-w-[47rem] flex flex-col gap-6 font-body text-lg md:text-xl leading-relaxed text-fg/75 max-md:mt-6 max-md:gap-4 max-md:text-base">
          <p>
            <img
              src="/assets/avatar-diecut9.png"
              alt=""
              style={{ transformOrigin: "50% 92%" }}
              className={`float-left mr-4 mb-1 h-24 w-auto transition-opacity duration-700 motion-safe:animate-[avatar-sway_7s_ease-in-out_infinite] max-md:h-20 max-md:mr-3 ${
                subLen > 0 ? "opacity-100" : "opacity-0"
              }`}
            />
            {renderSplit(PARAGRAPHS[0], counts[0])}
          </p>
          <p>{renderSplit(PARAGRAPHS[1], counts[1])}</p>
        </div>
      </div>

      {/* Social links — outside the aria-hidden block so they stay reachable.
          They fade in once the paragraph stream completes. */}
      <div
        className={`mt-8 flex items-center gap-5 transition-opacity duration-700 max-md:mt-5 ${
          subLen >= SUB_TOTAL ? "opacity-100" : "opacity-0"
        }`}
      >
        <a
          href="https://github.com/jawciu"
          target="_blank"
          rel="noreferrer"
          aria-label="GitHub - jawciu (opens in a new tab)"
          className="transition hover:brightness-125"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/assets/icon-github.svg" alt="" width={38} height={38} />
        </a>
        <a
          href="https://www.linkedin.com/in/carolinejaworsky/"
          target="_blank"
          rel="noreferrer"
          aria-label="LinkedIn - Caroline Jaworsky (opens in a new tab)"
          className="transition hover:brightness-125"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/assets/icon-linkedin.svg" alt="" width={38} height={38} />
        </a>
      </div>
    </div>
  );
}
