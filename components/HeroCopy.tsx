"use client";

import { useEffect, useState } from "react";

// The headline types itself in on first paint — as if someone were keying it
// in live. Iosevka Charon (terminal-ish, quasi-proportional) sells the effect.
// ("Hi I'm Caroline," intro line removed 2026-08-17 per Caroline.)
const HEADLINE = "I turn early concepts into\nlaunch-ready products";

const START_DELAY = 350; // ms before the first character
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
  const [headLen, setHeadLen] = useState(0);
  const [done, setDone] = useState(false);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      setHeadLen(HEADLINE.length);
      setDone(true);
      return;
    }

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

    timer = setTimeout(typeHeadline, START_DELAY);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="font-hero">
      {/* Accessible, instantly-complete copy for screen readers */}
      <p className="sr-only">{HEADLINE.replace("\n", " ")}</p>

      <div aria-hidden className="flex flex-col gap-4">
        {/* Desktop keeps the authored break after "into" (pre-line renders the \n).
            Below md the \n collapses to a space (whitespace-normal) so the headline
            wraps naturally to three lines instead of stranding INTO alone. */}
        <h1 className="font-bold uppercase text-[clamp(2rem,5.2vw,4.25rem)] leading-[1.02] tracking-tight text-fg whitespace-pre-line max-md:whitespace-normal min-h-[2.04em]">
          {HEADLINE.slice(0, headLen)}
          <Caret blink={done} />
        </h1>
      </div>
    </div>
  );
}
