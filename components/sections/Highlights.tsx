"use client";

import { useInView } from "@/lib/useInView";
import { StreamingText } from "./StreamingText";

// Streaming cascade timing (echoes the About bio's type-on). Lines reveal
// top-to-bottom within a card; cards cascade left-to-right off one scroll trigger.
const CPS = 280; // chars/sec — matches the About bio's fast type
const CARD_GAP = 130; // ms between cards
const LINE_GAP = 80; // ms between the 3 lines of a card

// ── DATA ──────────────────────────────────────────────────────────────
// Single source of truth — one object per career chapter. Add, reorder or
// retint by editing this array; the markup never changes. `accent` is a
// SPECTRUM token (see DESIGN.md / globals @theme) so colour enters the page
// as light, the way the orb + fireball + glass pools do — not as a fill.
type Highlight = {
  role: string;
  company: string;
  detail: string;
  accent: string;
};

const HIGHLIGHTS: Highlight[] = [
  {
    role: "founding designer",
    company: "COG · health-tech startup",
    detail: "pre-seed · built it 0→1",
    accent: "#ffcf52", // orb-3 — yellow (warm ramp yellow → orange → red, Caroline 2026-08-19)
  },
  {
    role: "product designer",
    company: "E.ON Next · energy",
    detail: "AI tools · end-to-end · B2B",
    accent: "#ff8526", // orb-2 — hot orange
  },
  // educator/BrainStation card removed 2026-08-19 (Caroline): scrubbed from
  // LinkedIn + CV during the repositioning, portfolio was the last trace.
  // Three cards = the three positioning pillars, one each.
  {
    role: "senior print designer",
    company: "Burberry · McQueen · fashion",
    detail: "top-label craft pedigree",
    accent: "#ff2f7e", // orb-1 — pink
  },
];

export function Highlights() {
  const { ref, inView } = useInView<HTMLUListElement>(0.3);

  return (
    // Sits on the black plate directly under About. Same full-bleed px box →
    // centred max-w-7xl/88rem → pl-2 column geometry as /about and /toolkit, so
    // every directory label shares one left edge down the page.
    <section
      aria-labelledby="highlights-label"
      className="px-8 pt-6 pb-10 md:px-12 md:pt-10 md:pb-28"
    >
      <div className="mx-auto w-full max-w-7xl 2xl:max-w-[88rem]">
        <p
          id="highlights-label"
          className="pl-2 font-mono text-xs md:text-sm tracking-[0.2em] text-fg/70"
        >
          /highlights
        </p>

        {/* role="list" + <li> → screen readers announce "list, N items". */}
        <ul
          ref={ref}
          role="list"
          className="mt-9 grid grid-cols-1 gap-x-8 gap-y-12 pl-2 sm:grid-cols-2 md:mt-12 md:flex md:justify-between md:gap-0"
        >
          {HIGHLIGHTS.map((item, i) => {
            const base = i * CARD_GAP;
            return (
              <li key={item.company} className="flex flex-col">
                {/* each line types in (top-to-bottom); the role label carries the
                    only colour — a spectrum token as signal, rest monochrome. */}
                <StreamingText
                  text={item.role}
                  active={inView}
                  cps={CPS}
                  delay={base}
                  className="font-mono text-xs uppercase tracking-[0.18em] md:text-sm"
                  style={{ color: item.accent }}
                />
                <StreamingText
                  text={item.company}
                  active={inView}
                  cps={CPS}
                  delay={base + LINE_GAP}
                  className="mt-4 font-body text-lg font-medium text-fg md:text-xl"
                />
                <StreamingText
                  text={item.detail}
                  active={inView}
                  cps={CPS}
                  delay={base + 2 * LINE_GAP}
                  className="mt-1.5 font-mono text-[11px] tracking-[0.2em] text-fg/70 max-sm:tracking-[0.04em] md:text-xs"
                />
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
