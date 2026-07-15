"use client";

import { Fragment, useEffect, useRef, type ReactNode } from "react";
import { usePrefersReducedMotion } from "@/lib/usePrefersReducedMotion";

/* HeroIntro — load-time intro motion for the case-study heroes. The heroes sit at
   scroll 0, so the scroll-triggered Reveal never suits them; these primitives play
   once on page open instead.

   HeroStream — text streams in character by character, fast. Same DOM/CSS contract
   as each study's StreamingQuote (`.cs-char` spans under a `data-stream` wrapper,
   staggered inline transition-delays; theme.css owns the fade) but time-driven on
   mount instead of IntersectionObserver. Children must be a PLAIN STRING (like
   StreamingQuote) — "\n" renders as <br/>. Element children are deliberately not
   supported: walking element trees differs between the server pass and the
   deserialized client pass (RSC), which caused hydration mismatches.

   HeroFade — quick opacity fade for hero imagery. Renders a display:contents
   wrapper (no layout box, so flex/grid sizing of the content is untouched) and
   drives the fade on its real DOM children post-mount.

   Both render fully visible for SSR / no-JS / reduced motion and only hide after
   hydration commits — the same contract as StreamingQuote and Reveal. */

export function HeroStream({
  children,
  delay = 0,
  step = 0.003,
  breakClassName = "",
  className = "",
}: {
  /** plain text only; "\n" becomes a <br/> */
  children: string;
  /** ms before the first character shows */
  delay?: number;
  /** seconds between consecutive characters (~333 cps at the 0.003 default) */
  step?: number;
  /** classes for the <br/>s rendered from "\n" (e.g. "max-sm:hidden") */
  breakClassName?: string;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement | null>(null);
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const chars = Array.from(el.querySelectorAll<HTMLElement>(".cs-char"));
    if (reduced || !chars.length) {
      delete el.dataset.stream;
      return;
    }
    // Arm post-mount (SSR / no-JS already showed the text). The hide/reveal is
    // driven INLINE, not via the theme.css [data-stream] rules: this effect runs
    // during hydration, and in dev the route CSS can land milliseconds AFTER it —
    // the armed rule then never hides anything and the text pops in at once
    // (verified). Inline styles are immune to stylesheet timing. The data-stream
    // attribute is still flipped for parity with the StreamingQuote tooling.
    // The per-char inline transition-delay must be captured BEFORE the shorthand
    // writes below clobber it, and restored on cleanup (StrictMode re-runs).
    const delays = chars.map((c) => c.style.transitionDelay);
    el.dataset.stream = "armed";
    chars.forEach((c) => {
      c.style.transition = "none";
      c.style.opacity = "0";
    });
    // forced style flush so the hidden state commits before the reveal
    void el.getBoundingClientRect();
    const raf = requestAnimationFrame(() => {
      el.dataset.stream = "play";
      chars.forEach((c, k) => {
        c.style.transition = `opacity 0.12s ease ${delays[k] || "0s"}`;
        c.style.opacity = "1";
      });
    });
    return () => {
      cancelAnimationFrame(raf);
      delete el.dataset.stream;
      // Restore in TWO recalc passes: opacity must come back with transitions
      // dead, or the lingering per-char transition-delay turns the restore into
      // a staggered jump (duration 0 + delay > 0 still schedules a transition —
      // this froze the text hidden on the reduced-motion flip after hydration).
      chars.forEach((c) => {
        c.style.transition = "none";
        c.style.opacity = "";
      });
      void el.getBoundingClientRect();
      chars.forEach((c, k) => {
        c.style.transition = "";
        c.style.transitionDelay = delays[k];
      });
    };
  }, [reduced]);

  const lines = children.split("\n");
  let i = 0;

  return (
    <span ref={ref} className={className}>
      {/* full text for assistive tech; the streamed copy is decorative */}
      <span className="sr-only">{children.replace(/\n/g, " ")}</span>
      <span aria-hidden>
        {lines.map((line, li) => (
          <Fragment key={li}>
            {li > 0 && <br className={breakClassName} />}
            {[...line].map((ch, k) => (
              <span
                key={k}
                className="cs-char"
                style={{ transitionDelay: `${(delay / 1000 + i++ * step).toFixed(3)}s` }}
              >
                {ch}
              </span>
            ))}
          </Fragment>
        ))}
      </span>
    </span>
  );
}

// ---------------------------------------------------------------------------

export function HeroFade({
  children,
  delay = 0,
  duration = 0.45,
}: {
  children: ReactNode;
  /** ms before the fade starts */
  delay?: number;
  /** seconds the fade runs for */
  duration?: number;
}) {
  const ref = useRef<HTMLDivElement | null>(null);
  const reduced = usePrefersReducedMotion();

  // DOM-driven on the wrapper's real children: renders visible (SSR / no-JS /
  // reduced motion), then post-mount hides instantly and fades each child back to
  // its own computed opacity (so e.g. an opacity-80 image lands on 0.8, not 1).
  // Inline styles are cleared once the transition ends so the authored CSS owns
  // the elements again.
  useEffect(() => {
    const el = ref.current;
    if (!el || reduced) return;
    const targets = Array.from(el.children) as HTMLElement[];
    if (!targets.length) return;
    const finals = targets.map((t) => getComputedStyle(t).opacity);
    targets.forEach((t) => {
      t.style.transition = "none";
      t.style.opacity = "0";
    });
    const clear = () => {
      targets.forEach((t) => {
        t.style.opacity = "";
        t.style.transition = "";
      });
    };
    // forced reflow so the hidden state commits before the fade (see HeroStream)
    void el.getBoundingClientRect();
    const raf = requestAnimationFrame(() => {
      targets.forEach((t, k) => {
        t.style.transition = `opacity ${duration}s ease ${delay / 1000}s`;
        t.style.opacity = finals[k];
      });
    });
    const last = targets[targets.length - 1];
    last.addEventListener("transitionend", clear, { once: true });
    return () => {
      cancelAnimationFrame(raf);
      last.removeEventListener("transitionend", clear);
      clear();
    };
  }, [reduced, delay, duration]);

  // display:contents — the wrapper generates no box, so the children keep their
  // authored flex/grid sizing exactly as if unwrapped.
  return (
    <div ref={ref} style={{ display: "contents" }}>
      {children}
    </div>
  );
}
