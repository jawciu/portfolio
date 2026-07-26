import type { RailSection } from "../ScrollRail";

/**
 * The scroll rail's roster for the Cog ADHD study. Order and ids MUST match the
 * data-cog wrappers mounted in app/project/cog-adhd/page.tsx — the rail resolves
 * each id with document.querySelector(`[data-cog="…"]`).
 *
 * Labels are the sections' own eyebrows (the <Kicker> copy) so the rail says
 * exactly what the page says, in sentence case since the rail lowercases them.
 * Four exceptions, authored here rather than added to the page:
 *   (the hero)     — no eyebrow, and no id either: it lives inside StickyHero, so
 *                    wrapping it in a data-cog div would change the sticky
 *                    containing block. The rail synthesises its span instead.
 *   MyRole         — has a Title but no Kicker.
 *   BookingDropoff — no Kicker; from its title "Session Booking Drop-off".
 *   JourneyMap     — no Kicker; from its title "Current therapy process /
 *                    client journey map", trimmed to the half that identifies it.
 *   NextProject    — its eyebrow is "View next project", trimmed for the rail
 *                    where the surrounding dots already imply "go".
 */
export const COG_RAIL: RailSection[] = [
  { label: "Intro" },
  { id: "MyRole", label: "My role" },
  { id: "Interviews", label: "Interviews" },
  { id: "Competitive", label: "Competitive analysis" },
  { id: "Findings", label: "Key research findings" },
  { id: "BookingDropoff", label: "Booking drop-off" },
  { id: "JourneyMap", label: "Client journey map" },
  { id: "Strategy", label: "Strategy" },
  { id: "Methodology", label: "Methodology" },
  { id: "Challenges", label: "Challenges" },
  { id: "Solution", label: "Solution" },
  { id: "Results", label: "Results" },
  { id: "Takeaways", label: "Key takeaways" },
  { id: "NextProject", label: "Next project" },
];
