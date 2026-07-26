import type { RailSection } from "../ScrollRail";

/**
 * The scroll rail's roster for the Vector study. Order and ids MUST match the
 * data-vec wrappers mounted in app/project/vector/page.tsx — the rail resolves
 * each id with document.querySelector(`[data-vec="…"]`).
 *
 * Labels are the sections' own eyebrows (the <Kicker> copy), so the rail says
 * exactly what the page says. Three exceptions, all authored here rather than
 * added to the page:
 *   (the hero)     — no eyebrow, and no id either: it lives inside StickyHero, so
 *                    wrapping it in a data-vec div would change the sticky
 *                    containing block. The rail synthesises its span instead.
 *   MyRoleHairline — the section has a Title but no Kicker, so it has no eyebrow
 *                    to borrow.
 *   NextProject    — its eyebrow is "View next project", trimmed for the rail
 *                    where the surrounding dots already imply "go".
 */
export const VECTOR_RAIL: RailSection[] = [
  { label: "Intro" },
  { id: "MyRoleHairline", label: "My role" },
  { id: "Problem", label: "Problem space" },
  { id: "Product", label: "The product" },
  { id: "Matching", label: "The matching" },
  { id: "AILayer", label: "The AI layer" },
  { id: "Observability", label: "Observability" },
  { id: "Architecture", label: "Under the hood" },
  { id: "Collaboration", label: "Working with AI" },
  { id: "WhatsNext", label: "What's next" },
  { id: "NextProject", label: "Next project" },
];
