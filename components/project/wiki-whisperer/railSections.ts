import type { RailSection } from "../ScrollRail";

/**
 * The scroll rail's roster for the Wiki Whisperer study. Order and ids MUST match
 * the data-ww wrappers mounted in app/project/wiki-whisperer/page.tsx — the rail
 * resolves each id with document.querySelector(`[data-ww="…"]`).
 *
 * Labels are the sections' own eyebrows (the <Kicker> copy) so the rail says
 * exactly what the page says, in sentence case since the rail lowercases them.
 * Three exceptions, authored here rather than added to the page:
 *   (the hero)  — no eyebrow, and no id either: it lives inside StickyHero, so
 *                 wrapping it in a data-ww div would change the sticky containing
 *                 block. The rail synthesises its span instead.
 *   MyRole      — has a Title but no Kicker.
 *   NextProject — its eyebrow is "View next project", trimmed for the rail where
 *                 the surrounding dots already imply "go".
 *
 * Takeaways is deliberately absent: it is commented out in page.tsx. If it is
 * ever remounted, add it back here between WhatsNext and NextProject.
 */
export const WIKI_RAIL: RailSection[] = [
  { label: "Intro" },
  { id: "MyRole", label: "My role" },
  { id: "Problem", label: "Problem space" },
  { id: "Redesign", label: "The redesign" },
  { id: "UnderTheHood", label: "Under the hood" },
  { id: "Measuring", label: "User pilots" },
  { id: "Feedback", label: "User-led refinement" },
  { id: "Wins", label: "Big wins" },
  { id: "Impact", label: "Early impact" },
  { id: "Rollout", label: "The rollout" },
  { id: "WhatsNext", label: "What's next" },
  { id: "NextProject", label: "Next project" },
];
