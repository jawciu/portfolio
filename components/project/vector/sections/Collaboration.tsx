import { CARD_FRAME, Container, Kicker, Title, Body } from "../ui";
import { Reveal } from "../Reveal";

/* Working with AI — the paragraphs stay lean; the WAY the collaboration ran is
   shown as three small workflow diagrams (Caroline's actual patterns building
   Vector: a builder/evaluator pair, a role-team judging one decision, and
   parallel git worktrees each running its own group of agents). Inline SVG
   (not <img>), so the iOS Safari asset rule doesn't apply. */

const MONO = "var(--font-mono), monospace";
const LINE = "rgba(241,234,241,0.16)";
const INK_SOFT = "var(--case-study-ink-soft)";
const LILAC = "var(--green)";
const MINT = "var(--vec-mint)";

function PairDiagram() {
  return (
    <svg viewBox="0 0 360 130" className="w-full" role="img" aria-label="Two agents in a loop: a builder builds, an evaluator critiques, and work only lands when the evaluator is satisfied.">
      <rect x={28} y={48} width={112} height={34} rx={8} fill="none" stroke="rgba(192,152,255,0.45)" />
      <text x={84} y={69} textAnchor="middle" fontSize={12} fontFamily={MONO} fill={LILAC}>
        builder
      </text>
      <rect x={220} y={48} width={112} height={34} rx={8} fill="none" stroke="rgba(157,255,244,0.4)" />
      <text x={276} y={69} textAnchor="middle" fontSize={12} fontFamily={MONO} fill={MINT}>
        evaluator
      </text>
      <path d="M140 48 C 165 26, 195 26, 220 48" fill="none" stroke={LINE} />
      <text x={180} y={24} textAnchor="middle" fontSize={10.5} fontFamily={MONO} fill={INK_SOFT}>
        build →
      </text>
      <path d="M220 82 C 195 104, 165 104, 140 82" fill="none" stroke={LINE} />
      <text x={180} y={116} textAnchor="middle" fontSize={10.5} fontFamily={MONO} fill={INK_SOFT}>
        ← critique
      </text>
    </svg>
  );
}

function TeamDiagram() {
  const roles = [
    ["designer", 30],
    ["developer", 65],
    ["ceo", 100],
  ] as const;
  return (
    <svg viewBox="0 0 360 130" className="w-full" role="img" aria-label="Three agents (a designer, a developer and a CEO) each judge the same decision from a different angle.">
      {roles.map(([label, y]) => (
        <g key={label}>
          <text x={30} y={y + 4} fontSize={12} fontFamily={MONO} fill={INK_SOFT}>
            {label}
          </text>
          <circle cx={128} cy={y} r={2.5} fill="rgba(241,234,241,0.35)" />
          <path d={`M128 ${y} C 158 ${y}, 172 65, 202 65`} fill="none" stroke={LINE} />
        </g>
      ))}
      <rect x={202} y={48} width={128} height={34} rx={8} fill="none" stroke="rgba(192,152,255,0.45)" />
      <text x={266} y={69} textAnchor="middle" fontSize={12} fontFamily={MONO} fill={LILAC}>
        the decision
      </text>
    </svg>
  );
}

function FleetDiagram() {
  const lanes = [
    ["wt/1", 30],
    ["wt/2", 65],
    ["wt/3", 100],
  ] as const;
  return (
    <svg viewBox="0 0 360 130" className="w-full" role="img" aria-label="Three parallel git worktrees, each with its own group of agents, merging into main.">
      {lanes.map(([label, y], lane) => (
        <g key={label}>
          <text x={30} y={y + 4} fontSize={11} fontFamily={MONO} fill={INK_SOFT}>
            {label}
          </text>
          <path d={`M70 ${y} L 246 ${y}`} fill="none" stroke={LINE} />
          {/* the lane's agent group, staggered so the lanes read as live */}
          {[0, 1, 2].map((i) => (
            <circle
              key={i}
              cx={100 + i * 30 + lane * 12}
              cy={y}
              r={3}
              fill={["#c098ff", "#e99ddb", "#9dfff4"][i]}
              opacity={0.9}
            />
          ))}
          <path d={`M246 ${y} C 268 ${y}, 274 65, 292 65`} fill="none" stroke={LINE} />
        </g>
      ))}
      <rect x={292} y={48} width={46} height={34} rx={8} fill="none" stroke="rgba(241,234,241,0.3)" />
      <text x={315} y={69} textAnchor="middle" fontSize={11} fontFamily={MONO} fill="var(--case-study-ink)">
        main
      </text>
    </svg>
  );
}

function PlanDiagram() {
  const steps = [
    ["goal", 42],
    ["options", 122],
  ] as const;
  return (
    <svg viewBox="0 0 360 130" className="w-full" role="img" aria-label="The goal leads to options with tradeoffs, then my call, then the build. Every plan ends with follow-up questions.">
      {steps.map(([label, x]) => (
        <g key={label}>
          <text x={x} y={58} textAnchor="middle" fontSize={12} fontFamily={MONO} fill={INK_SOFT}>
            {label}
          </text>
          <path d={`M${x + 32} 54 L ${x + 46} 54`} fill="none" stroke={LINE} />
        </g>
      ))}
      {/* the human decision is the highlighted node */}
      <rect x={178} y={37} width={92} height={34} rx={8} fill="none" stroke="rgba(192,152,255,0.45)" />
      <text x={224} y={58} textAnchor="middle" fontSize={12} fontFamily={MONO} fill={LILAC}>
        my call
      </text>
      <path d="M270 54 L 288 54" fill="none" stroke={LINE} />
      <text x={318} y={58} textAnchor="middle" fontSize={12} fontFamily={MONO} fill={INK_SOFT}>
        build
      </text>
      {/* the standing habit, looping under the chain */}
      <path d="M318 66 C 318 96, 60 96, 46 66" fill="none" stroke={LINE} strokeDasharray="3 4" />
      <text x={182} y={112} textAnchor="middle" fontSize={10.5} fontFamily={MONO} fill="var(--case-study-muted)">
        ↺ ask me follow-up questions
      </text>
    </svg>
  );
}

function NetDiagram() {
  const flows = [
    ["task ids", 30],
    ["draft edits", 65],
    ["portal auth", 100],
  ] as const;
  return (
    <svg viewBox="0 0 360 130" className="w-full" role="img" aria-label="The critical flows pass through the Playwright end-to-end suite before they count as safe.">
      {flows.map(([label, y]) => (
        <g key={label}>
          <text x={30} y={y + 4} fontSize={12} fontFamily={MONO} fill={INK_SOFT}>
            {label}
          </text>
          <path d={`M126 ${y} L 168 ${y}`} fill="none" stroke={LINE} />
          <path d={`M262 ${y} L 300 ${y}`} fill="none" stroke={LINE} />
          <text x={314} y={y + 4} fontSize={13} fontFamily={MONO} fill={MINT}>
            ✓
          </text>
        </g>
      ))}
      {/* the gate every flow passes through */}
      <rect x={168} y={16} width={94} height={98} rx={8} fill="none" stroke="rgba(157,255,244,0.4)" />
      <text x={215} y={60} textAnchor="middle" fontSize={12} fontFamily={MONO} fill={MINT}>
        playwright
      </text>
      <text x={215} y={76} textAnchor="middle" fontSize={11} fontFamily={MONO} fill="var(--case-study-muted)">
        e2e
      </text>
    </svg>
  );
}

function MemoryDiagram() {
  return (
    <svg viewBox="0 0 360 130" className="w-full" role="img" aria-label="Both deliberate decisions and walls we hit become skill files, and the next session loads them and starts smarter.">
      {/* knowledge arrives from both directions: chosen upfront, or earned */}
      <text x={64} y={42} textAnchor="middle" fontSize={12} fontFamily={MONO} fill={INK_SOFT}>
        a decision
      </text>
      <path d="M112 38 C 138 38, 146 55, 172 55" fill="none" stroke={LINE} />
      <text x={64} y={78} textAnchor="middle" fontSize={12} fontFamily={MONO} fill={INK_SOFT}>
        a wall
      </text>
      <path d="M96 74 C 132 74, 146 55, 172 55" fill="none" stroke={LINE} />
      <rect x={172} y={38} width={98} height={34} rx={8} fill="none" stroke="rgba(192,152,255,0.45)" />
      <text x={221} y={59} textAnchor="middle" fontSize={12} fontFamily={MONO} fill={LILAC}>
        skill.md
      </text>
      {/* the payoff loop: the next session starts from the skill */}
      <path d="M270 68 C 310 88, 240 104, 120 104 C 80 104, 60 90, 56 84" fill="none" stroke={LINE} strokeDasharray="3 4" />
      <text x={180} y={120} textAnchor="middle" fontSize={10.5} fontFamily={MONO} fill="var(--case-study-muted)">
        the next session loads it
      </text>
    </svg>
  );
}

const WORKFLOWS = [
  {
    label: "the pair",
    diagram: <PairDiagram />,
    caption:
      "Most features ran as a loop. One agent built, a second reviewed the work against the plan, and nothing landed until the evaluator was satisfied.",
  },
  {
    label: "the team",
    diagram: <TeamDiagram />,
    caption:
      "For the calls that shaped the product I set up a team: a designer, a developer and a CEO agent, each judging the same decision from a different angle.",
  },
  {
    label: "the fleet",
    diagram: <FleetDiagram />,
    caption:
      "Workstreams ran in parallel git worktrees, each with its own group of agents, so the build never waited on a single conversation.",
  },
  {
    label: "the plan",
    diagram: <PlanDiagram />,
    caption:
      "I never asked the AI to just build it. I set the goal, asked for options with tradeoffs, and made every call myself.",
  },
  {
    label: "the net",
    diagram: <NetDiagram />,
    caption:
      "Nobody reviews a solo build, so the flows I cannot afford to break run through Playwright end-to-end tests. The suite is the second pair of eyes.",
  },
  {
    label: "the memory",
    diagram: <MemoryDiagram />,
    caption:
      "Design rules and conventions became skills the AI loads every session, so it starts already knowing how Vector should work. The walls we did hit got written up the same way.",
  },
] as const;

export function Collaboration() {
  return (
    <section data-section="Collaboration" className="pt-[120px] pb-0">
      <Container>
        <Reveal>
          <Kicker>Working with AI</Kicker>
          <Title>
            I made the calls,
            <br />
            it wrote the code
          </Title>
        </Reveal>

        <Reveal className="max-w-[760px]">
          <Body>
            Vector was built as a pair, me and an AI coding agent, and the split of
            responsibilities never moved. I owned the product, the decisions and the
            review. The AI owned the typing. The shape of the collaboration changed
            with the job.
          </Body>
        </Reveal>

        {/* how the collaboration actually ran: six cards, one visual language.
            Row 1 = the shapes of the teams, row 2 = the habits that kept the
            build honest (was three columns of prose, condensed 2026-07-13). */}
        <Reveal stagger={0.1} className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-3">
          {WORKFLOWS.map(({ label, diagram, caption }) => (
            <div key={label} className={CARD_FRAME}>
              <p className="case-study-label mb-4">{label} &gt;</p>
              {diagram}
              <Body className="mt-4">{caption}</Body>
            </div>
          ))}
        </Reveal>
      </Container>
    </section>
  );
}
