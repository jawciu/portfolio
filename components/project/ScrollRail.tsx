"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { getLenis } from "../SmoothScroll";
import { usePrefersReducedMotion } from "../../lib/usePrefersReducedMotion";

/**
 * SCROLL RAIL — right-edge progress + section indicator for case studies.
 *
 * Reads where you are in the page and reports it two ways at once: a dot per
 * section (filled = read, hollow = ahead, so you can see how much is left) and
 * the current section's eyebrow as a label.
 *
 * Dots only, with ONE rotated label travelling with the active dot
 * (writing-mode: vertical-rl, the site's existing idiom — same as the bento card
 * spines and Product's room labels). A second variant that laid every label out
 * horizontally was prototyped and cut (Caroline 2026-07-26): it made more sense
 * as an index, but its labels sat right on top of the image- and copy-heavy
 * sections, and would have been worse still on cog's 13 longer eyebrows.
 *
 * DELIBERATELY NOT ScrollTrigger. Every position here is read live from
 * getBoundingClientRect() inside a rAF-throttled scroll handler, so there is no
 * cached pixel geometry that can go stale after a late layout shift. That is the
 * exact failure mode that broke the wiki reveals on client-side nav (an unsized
 * hero video grew the document ~930px after the triggers had cached their
 * starts). A rail that reads live cannot inherit that bug.
 */

export type RailSection = {
  /**
   * Value of the page's section data attribute, e.g. "Product" for
   * data-vec="Product". OMIT it for the hero: the hero has no data-* wrapper of
   * its own (it lives inside StickyHero, and wrapping it would change the sticky
   * containing block), so the rail synthesises its span as document-top → the
   * first real section.
   */
  id?: string;
  /** short label — the section's eyebrow, or an authored one where there is no Kicker */
  label: string;
};

type Props = {
  sections: RailSection[];
  /** the page's section attribute name, e.g. "data-vec" */
  attr: string;
};

/** vertical distance between dot centres — also the dot button's hit area, so keep it >= 24 */
const GAP = 36;
/** the reading line: a section becomes current once its top crosses this fraction of the viewport */
const READ_LINE = 0.4;
/** click-to-jump lands the section this far below the top, clear of the nav */
const JUMP_OFFSET = -96;
/** the beat between the line moving and the dot lighting (or the reverse going up) */
const STEP_DELAY = 130;
/** how fast the line runs between two dots — quick, it's a step not a crawl */
const STEP_MS = 190;

export function ScrollRail({ sections, attr }: Props) {
  const reduced = usePrefersReducedMotion();

  // The rail renders SECTION INDICES, not a continuous fraction: the line sits ON
  // a dot rather than creeping between them, so it can never read as trailing the
  // lit dot mid-section. The two then fire as a quick one-two in the direction of
  // travel (Caroline 2026-07-26): scrolling down the line runs to the new dot
  // first and the dot lights straight after; scrolling up the dot goes dark first
  // and the line retreats straight after. Hence two indices, a leader and a
  // follower, rather than one — whichever moves second lags by STEP_DELAY, so the
  // pair always reads as cause then effect.
  //
  // -1 = preview state: no dot filled, no label. Only reachable on a roster with
  // no hero entry, where it means "section one not reached yet", so the rail
  // previews what's coming instead of claiming you're already in it.
  const [litIndex, setLitIndex] = useState(-1);
  const [fillIndex, setFillIndex] = useState(-1);
  const [hover, setHover] = useState<number | null>(null);

  const prevIndexRef = useRef(-1);
  const stepTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Called from the scroll rAF below, deliberately NOT from an effect body: this
  // is a response to an external event, and running it in an effect would mean
  // synchronous setState cascades on every scroll frame.
  const applyIndex = useCallback((next: number) => {
    const prev = prevIndexRef.current;
    if (next === prev) return;
    prevIndexRef.current = next;
    if (stepTimerRef.current) clearTimeout(stepTimerRef.current);
    if (reduced) {
      setLitIndex(next);
      setFillIndex(next);
      return;
    }
    const goingDown = next > prev;
    // the leader moves now, the follower one beat later
    (goingDown ? setFillIndex : setLitIndex)(next);
    stepTimerRef.current = setTimeout(
      () => (goingDown ? setLitIndex : setFillIndex)(next),
      STEP_DELAY,
    );
  }, [reduced]);

  const elsRef = useRef<(HTMLElement | null)[]>([]);

  useEffect(() => {
    const collect = () => {
      elsRef.current = sections.map((s) =>
        s.id ? document.querySelector<HTMLElement>(`[${attr}="${s.id}"]`) : null,
      );
    };
    collect();

    let frame = 0;
    const measure = () => {
      frame = 0;
      const els = elsRef.current;
      if (!els.length) return;

      const line = window.innerHeight * READ_LINE;
      const scrollY = window.scrollY;

      // The hero entry has no element of its own, so it gets a synthetic top in
      // the same viewport coordinates as everything else: the document top.
      // the section you are in = the last one whose top has crossed the line
      let active = 0;
      for (let i = 0; i < els.length; i++) {
        const el = els[i];
        const top = el ? el.getBoundingClientRect().top : -scrollY;
        if (top > line) break;
        active = i;
      }
      // With a hero entry (no id) the first dot IS the hero, so the rail is live
      // from scroll 0. Without one, section one counts as reached once its top
      // crosses that same line.
      const first = els[0];
      const reached = !first || first.getBoundingClientRect().top <= line;
      applyIndex(reached ? active : -1);
    };

    const onScroll = () => {
      if (frame) return;
      frame = requestAnimationFrame(measure);
    };

    measure();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    // sections can mount/resize after us (late images, fonts) — re-resolve then
    const ro = new ResizeObserver(onScroll);
    ro.observe(document.body);

    return () => {
      if (frame) cancelAnimationFrame(frame);
      if (stepTimerRef.current) clearTimeout(stepTimerRef.current);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      ro.disconnect();
    };
  }, [sections, attr, applyIndex]);

  const jump = useCallback((index: number) => {
    const el = elsRef.current[index];
    const lenis = getLenis();
    // the hero entry has no element — it IS the top of the page
    if (!el) {
      if (lenis) lenis.scrollTo(0);
      else window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    if (lenis) lenis.scrollTo(el, { offset: JUMP_OFFSET });
    else
      window.scrollTo({
        top: el.getBoundingClientRect().top + window.scrollY + JUMP_OFFSET,
        behavior: "smooth",
      });
  }, []);

  const shownIndex = hover ?? litIndex;
  const railHeight = (sections.length - 1) * GAP;
  const fillHeight = Math.max(fillIndex, 0) * GAP;
  const ease = reduced ? "none" : "opacity 400ms ease, transform 400ms ease";

  return (
    <nav
      aria-label="Case study sections"
      className="pointer-events-none fixed right-6 top-1/2 z-40 -translate-y-1/2 max-md:hidden"
    >
      <div className="relative flex items-center justify-end gap-3">
        {/* the travelling vertical label, centred on its dot */}
        <div
          className="relative"
          style={{ height: railHeight, width: 21 }}
          aria-hidden
        >
          <span
            className="absolute right-0 whitespace-nowrap"
            style={{
              top: shownIndex * GAP,
              transform: "translateY(-50%)",
              writingMode: "vertical-rl",
              fontFamily: "var(--font-body), sans-serif",
              // 14px — a step ABOVE the section eyebrow it mirrors (13px), her
              // call; the 10px it started at read as unnoticeable
              fontSize: 14,
              fontWeight: 700,
              letterSpacing: "0.18em",
              textTransform: "lowercase",
              color: hover !== null
                ? "var(--case-study-muted)"
                : "var(--case-study-ink)",
              // nothing to name while you're still on the hero
              opacity: shownIndex < 0 ? 0 : 1,
              transition: reduced ? "none" : `top 400ms ease, ${ease}`,
            }}
          >
            {sections[Math.max(shownIndex, 0)]?.label}
          </span>
        </div>

        <ul
          className="pointer-events-auto relative m-0 list-none p-0"
          // explicit width: every child is absolute, so the list would
          // otherwise collapse to 0 and left-1/2 would centre on nothing
          style={{ height: railHeight, width: GAP }}
          onMouseLeave={() => setHover(null)}
        >
          {/* the hairline the dots sit on, plus its fill */}
          <span
            aria-hidden
            className="absolute left-1/2 top-0 -translate-x-1/2"
            style={{
              width: 1,
              height: railHeight,
              background: "color-mix(in srgb, var(--case-study-muted) 32%, transparent)",
            }}
          />
          <span
            aria-hidden
            className="absolute left-1/2 top-0 -translate-x-1/2"
            style={{
              width: 1,
              height: fillHeight,
              background: "var(--case-study-accent)",
              transition: reduced ? "none" : `height ${STEP_MS}ms cubic-bezier(0.33, 0, 0.2, 1)`,
            }}
          />
          {sections.map((s, i) => (
            <li
              key={s.id ?? s.label}
              className="absolute left-1/2"
              style={{ top: i * GAP, transform: "translate(-50%, -50%)" }}
            >
              <button
                type="button"
                onClick={() => jump(i)}
                onMouseEnter={() => setHover(i)}
                onFocus={() => setHover(i)}
                onBlur={() => setHover(null)}
                aria-label={s.label}
                className="flex items-center justify-center bg-transparent"
                style={{ width: GAP, height: GAP, cursor: "pointer" }}
              >
                <Dot
                  done={i <= litIndex}
                  current={i === litIndex}
                  hovered={hover === i}
                  reduced={reduced}
                />
              </button>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}

function Dot({
  done,
  current,
  hovered,
  reduced,
}: {
  done: boolean;
  current: boolean;
  hovered?: boolean;
  reduced: boolean;
}) {
  return (
    <span
      aria-hidden
      className="block rounded-full"
      style={{
        width: current ? 13 : 11,
        height: current ? 13 : 11,
        background: done ? "var(--case-study-accent)" : "transparent",
        // hover puts the accent outline on any dot — lilac on Vector, green on
        // cog, pink on wiki, since it reads the theme's accent token, not a hex
        border:
          done || hovered
            ? "1px solid var(--case-study-accent)"
            : "1px solid var(--case-study-muted)",
        // the hollow dots ARE the "how many left" signal, so they can't be the
        // faintest thing on screen — at 0.5 they nearly vanished on Vector's near-black
        opacity: done || hovered ? 1 : 0.7,
        boxShadow: current
          ? "0 0 0 4px color-mix(in srgb, var(--case-study-accent) 22%, transparent)"
          : hovered
            ? "0 0 0 3px color-mix(in srgb, var(--case-study-accent) 30%, transparent)"
            : "none",
        // snappy: the dot is the second beat of a two-beat move with the line, so
        // a slow fade here would blur the one-two into a single mushy transition
        transition: reduced
          ? "none"
          : "width 170ms ease, height 170ms ease, background 150ms ease, border-color 150ms ease, box-shadow 170ms ease, opacity 150ms ease",
      }}
    />
  );
}
