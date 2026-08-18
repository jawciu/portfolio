import type { RailSection } from "../ScrollRail";

/**
 * The scroll rail's roster for the Gateway study. Order and ids MUST match the
 * data-gw wrappers mounted in app/project/gateway/page.tsx — the rail resolves
 * each id with document.querySelector(`[data-gw="…"]`).
 *
 * Labels are the sections' own eyebrows (the <Kicker> copy) so the rail says
 * exactly what the page says, in sentence case since the rail lowercases them.
 * The four product sections are the exception: their eyebrows are the counter
 * "the product · 01…04", which says nothing about where you are, so those labels
 * come from the section titles instead. Plus the usual three:
 *   (the hero)  — no eyebrow, and no id either: it lives inside StickyHero, so
 *                 wrapping it in a data-gw div would change the sticky containing
 *                 block. The rail synthesises its span instead.
 *   MyRole      — has a Title but no Kicker.
 *   NextProject — trimmed to match the other studies' rails.
 *
 * NOTE: Gateway is still a SCAFFOLD (draft copy, noindex, not linked from the
 * homepage). Revisit these labels when the real copy lands — see OUTLINE.md.
 */
export const GATEWAY_RAIL: RailSection[] = [
  { label: "Intro" },
  { id: "MyRole", label: "My role" },
  { id: "Research", label: "Starting the project" },
  { id: "AIWorkflows", label: "AI workflows" },
  { id: "Problem", label: "Problem space" },
  { id: "Interviews", label: "Research" },
  { id: "V1", label: "Initial designs" },
  { id: "Testing", label: "Testing" },
  { id: "UpdatedDesigns", label: "Updated designs" },
  { id: "Status", label: "Next steps" },
  { id: "NextProject", label: "Next project" },
];
