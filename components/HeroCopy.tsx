"use client";

import { useEffect, useState } from "react";

// The intro types itself in on first paint — "Hi I'm Caroline," then the
// headline — as if someone were keying it in live. Iosevka Charon
// (terminal-ish, quasi-proportional) sells the effect.
const INTRO = "Hi I’m Caroline,";
const HEADLINE = "I turn early concepts into\nlaunch-ready products";

const START_DELAY = 350; // ms before the first character
const INTRO_SPEED = 55; // ms per character
const PAUSE = 450; // beat between intro and headline
const HEADLINE_SPEED = 42;

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
  const [done, setDone] = useState(false);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      setIntroLen(INTRO.length);
      setHeadLen(HEADLINE.length);
      setDone(true);
      return;
    }

    let i = 0;
    let h = 0;
    let timer: ReturnType<typeof setTimeout>;

    const typeHeadline = () => {
      h += 1;
      setHeadLen(h);
      if (h < HEADLINE.length) {
        timer = setTimeout(typeHeadline, HEADLINE_SPEED);
      } else {
        setDone(true);
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
    return () => clearTimeout(timer);
  }, []);

  const introTyping = introLen < INTRO.length;
  const headlineStarted = headLen > 0;
  // Caret lives on the intro line until the headline starts keying in.
  const caretOnIntro = !headlineStarted && !done;

  return (
    <div className="font-hero">
      {/* Accessible, instantly-complete copy for screen readers */}
      <p className="sr-only">
        {INTRO} {HEADLINE.replace("\n", " ")}
      </p>

      <div aria-hidden className="flex flex-col gap-4">
        <p className="text-2xl md:text-4xl text-fg font-black">
          {INTRO.slice(0, introLen)}
          {caretOnIntro && <Caret blink={!introTyping} />}
        </p>
        <h1 className="font-bold uppercase text-[clamp(2rem,5.2vw,4.25rem)] leading-[1.02] tracking-tight text-fg whitespace-pre-line min-h-[2.04em]">
          {HEADLINE.slice(0, headLen)}
          {headlineStarted && <Caret blink={done} />}
        </h1>
      </div>
    </div>
  );
}
