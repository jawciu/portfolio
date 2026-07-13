import { A, Container, Kicker, Title, Body, CaseStudyCallout, Shot } from "../ui";
import { Reveal } from "../Reveal";
import { Parallax } from "../Parallax";
import { DotGlow } from "../DotGlow";
import { CircuitTrace } from "../CircuitTrace";

/* The product — one continuous walk through the product, replacing the old pillar
   cards + the separate Workspace / AIFeatures sections. Each block is a two-column
   row: copy on one side, the product visual on the other, sides ALTERNATING down the
   page (`flip`). Below md the grid collapses and copy always leads, then the visual. */

type Block = {
  subhead: string;
  body: string[];
  asset: string;
  alt: string;
  /** small artifact clustered with the shot (cog-style stacked overlap):
      a code snippet or the notification-routing flow. Only for the SMALL
      shots — the big ones (board, portal, AI overview) speak for themselves. */
  companion?: "health" | "cron" | "flow";
  /** true → visual on the LEFT, copy on the RIGHT (md+ only) */
  flip?: boolean;
  /** rendered width of the shot in px (md+). Tuned per shot by eye. */
  width: number;
  /** how wide a band the row occupies before copy and shot are pushed apart.
      Big shots get the full 90%; the small panels tighten to 70% so the pair
      doesn't drift to opposite ends of the screen. */
  band: "90" | "75" | "70";
  /** Draw the shared product-visual frame (radius, hairline, card fill, shadow).
      Off by default: these assets ship their own chrome, so the frame would box a box.
      The portal shot is the exception — it's a plain opaque rectangle. */
  framed?: boolean;
};

const BLOCKS: Block[] = [
  {
    subhead: "Vendor board",
    body: [
      "Every onboarding runs as a Kanban board. I made the columns phases instead of statuses, so the board reads as the journey from kickoff to go-live, and progress lives on the task as a tag.",
      "Vendor and customer work from the same board. Both see the full plan, and the customer's portal focuses on their own tasks.",
    ],
    asset: "board-v2.png",
    band: "90",
    width: 624,
    alt: "Vector's vendor board: an onboarding as a Kanban board, phases as columns, tasks carrying owner, due date and status.",
  },
  {
    subhead: "Customer portal",
    body: [
      "The customer sees their progress and what needs their attention this week. The portal highlights their own tasks, so their work cuts through the noise.",
    ],
    asset: "portal-v2.png",
    band: "90",
    width: 828,
    framed: true,
    alt: "Vector's customer portal: the customer's own tasks, days to go-live, and a plain-language summary of where things stand.",
    flip: true,
  },
  {
    subhead: "Notifications centre",
    body: [
      "Everything the customer does flows back. A completed task, a new comment and a first portal visit each land in the vendor's notification centre, and one person's changes collapse into a single entry to keep the noise down.",
      "Email is saved for what needs the most visibility. Portal invites, task assignments and comment alerts go out through Resend, so they reach the customer where they already work.",
    ],
    asset: "notifications-v2.png",
    companion: "flow",
    band: "70",
    /* 392 = the old 435 −10%, ceded to the routing-flow companion */
    width: 392,
    alt: "Vector's notification centre: customer activity grouped by actor, showing completions, comments and first portal visits.",
  },
  {
    subhead: "Predictive health",
    body: [
      "Every onboarding is scored On track, At risk or Blocked. The triggers are all real task data, blocked or overdue work, a pace that overruns the go-live date, a third of the tasks stuck. I kept AI out of the scoring on purpose. It's deterministic JavaScript, so the same input always gives the same answer.",
    ],
    asset: "health-v2.png",
    companion: "health",
    band: "70",
    width: 580,
    alt: "Vector's health table: each company scored On track, At risk or Blocked, with task counts and how many are blocked.",
  },
  {
    subhead: "AI overview",
    body: [
      "Two views, because different roles need different depth and nobody needs everything at once.",
      "The portfolio high level view shows which onboardings need attention. Inside an onboarding it gets granular, with focus for today, this week, risks and wins. Every claim is anchored to a real task id.",
    ],
    asset: "insights-v2.png",
    band: "90",
    width: 828,
    alt: "Vector's AI insights for one onboarding: summary, risks, wins, and a prioritised focus list, each item citing a task id.",
    flip: true,
  },
  {
    subhead: "Turning meetings into tasks",
    body: [
      "What was agreed on a call is the easiest thing to lose in an onboarding, so Vector writes it up instead.",
      "I integrated an AI notetaker, Miniti. When a call ends it fires a webhook with the transcript, and a tool-use orchestrator reads it and drafts task creations, status changes and reassignments. It reads the board first, so work you already track becomes an update to the existing task instead of a duplicate.",
    ],
    asset: "actions-v2.png",
    band: "75",
    width: 566,
    alt: "Vector's Actions queue: a task drafted from a meeting transcript, marked 'From miniti', with create, edit and dismiss.",
  },
  {
    subhead: "Automated follow-ups",
    body: [
      "A weekly scanner on Vercel Cron walks every active onboarding and flags any task blocked or more than five days overdue. Each flag becomes a drafted email that only the task's owner sees, one approval away from sending.",
      "A task with no owner gets no follow-up. I chose clear responsibility over copying everyone in, and kept one plain tone for now. Mimicking each user's voice is its own project.",
    ],
    asset: "followup-v2.png",
    companion: "cron",
    band: "70",
    width: 522,
    alt: "Vector's draft follow-up: an AI-written email grounded in a blocked task, with dismiss, open in mail and comment.",
    flip: true,
  },
];

/* Subsection wrapper — a thin hairline, a homepage-style /label, and an optional
   background texture behind everything in the group. Textures vary down the
   section (shared board dotted, predictive health plain, ai admin checked) so
   the three groups read as distinct rooms rather than one long corridor. */
type Texture = "dots" | "grid";

/* both textures share the 22px rhythm; the grid's lines cover far more area per
   cell than a dot does, so its alpha sits lower to read as the same dimness */
const TEXTURES: Record<Texture, React.CSSProperties> = {
  dots: {
    backgroundImage: "radial-gradient(rgba(241,234,241,0.11) 1px, transparent 1.4px)",
    backgroundSize: "22px 22px",
  },
  grid: {
    backgroundImage:
      "linear-gradient(rgba(241,234,241,0.035) 1px, transparent 1px), linear-gradient(90deg, rgba(241,234,241,0.035) 1px, transparent 1px)",
    backgroundSize: "22px 22px",
  },
};

function SubSection({
  label,
  texture,
  last = false,
  children,
}: {
  label: string;
  texture?: Texture;
  last?: boolean;
  children: React.ReactNode;
}) {
  return (
    /* The hairline is the div's own border, so it sits EXACTLY where the texture
       starts and runs the full screen width. Each subsection's top border doubles
       as the previous one's bottom edge; `last` closes the final texture. */
    <div
      className={`relative border-t border-[rgba(241,234,241,0.14)] pb-[140px] ${
        last ? "border-b" : ""
      }`}
      style={texture ? TEXTURES[texture] : undefined}
    >
      {/* cursor-following lilac glow over the texture; content wrappers below are
          `relative` so they paint ABOVE this overlay */}
      {texture && <DotGlow pattern={texture} />}
      {/* scroll-drawn circuit spine down the left edge, one node per block */}
      <CircuitTrace />
      {/* room label: on md+ it turns 90° and rides the circuit spine (between the
          screen edge and the line, so it can never collide with the content bands);
          below md the trace is hidden, so the label keeps its horizontal spot. */}
      <p className="pointer-events-none absolute top-8 left-1.5 hidden rotate-180 font-[family-name:var(--font-mono)] text-sm tracking-[0.2em] text-[var(--case-study-muted)] [writing-mode:vertical-rl] md:block">
        /{label}
      </p>
      <Container className="relative md:hidden">
        <p className="pt-6 pl-2 font-[family-name:var(--font-mono)] text-sm tracking-[0.2em] text-[var(--case-study-muted)]">
          /{label}
        </p>
      </Container>
      <div className="relative mt-16 space-y-[156px] md:mt-28">{children}</div>
    </div>
  );
}

/* ---- companions: the small artifacts clustered with the small shots ---- */

/* the companion cards share the framed Shot's EXACT surface (see ui.tsx):
   same radius, hairline, card fill and shadow as the customer-portal frame,
   so the cluster reads as one family of panels */
const CARD_FRAME =
  "rounded-[14px] border border-[var(--case-study-line)] bg-[var(--case-study-card)] p-5 shadow-[0_24px_60px_-24px_rgba(0,0,0,0.65)]";

/* SnippetCard — a tiny real-engineering snippet, set in the .vec-code
   treatment (theme.css). Kept to a handful of lines: it's a design artifact,
   not documentation. (ui.tsx has the bigger windowed CodeCard; this is the
   compact cluster variant.) */
function SnippetCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className={CARD_FRAME}>
      <p className="mb-3 font-[family-name:var(--font-mono)] text-[10px] lowercase tracking-[0.14em] text-[var(--case-study-muted)]">
        {title}
      </p>
      <pre className="vec-code overflow-x-auto">{children}</pre>
    </div>
  );
}

/* NotificationFlow — the REAL routing (lib/db.js): every mutation calls
   emitActivity(), which writes one ActivityLog row and fans out to two
   derivers. deriveNotifications: contact-authored events become vendor inbox
   rows (grouped per actor in 10-minute buckets). deriveCustomerEmails:
   high-signal vendor-authored events go to the customer through Resend.
   WHO acted decides the channel. Static diagram (pulses tried, cut as
   distracting); colours match the notifications asset — purple unread dots,
   green + pink avatars. */
const NF_ROWS = [
  { label: "task completed", y: 24, dest: "app" },
  { label: "new comment", y: 56, dest: "app" },
  { label: "portal visit", y: 88, dest: "app" },
  { label: "portal invite", y: 120, dest: "email" },
  { label: "task assigned", y: 152, dest: "email" },
  { label: "task commented", y: 184, dest: "email" },
] as const;

const NF_PURPLE = "var(--green)"; /* lilac accent — the asset's unread dots */
const NF_GREEN = "var(--vec-success)"; /* the asset's green avatars */
const NF_PINK = "#ff9ec4"; /* PINK like the asset's avatars (danger red was wrong) */
const NF_DOT = "rgba(241,234,241,0.35)"; /* plain gray event dots */

function NotificationFlow() {
  const mono = "var(--font-mono), monospace";
  const line = "rgba(241,234,241,0.16)";
  return (
    <div className={CARD_FRAME}>
      <p className="mb-3 font-[family-name:var(--font-mono)] text-[11px] lowercase tracking-[0.14em] text-[var(--case-study-muted)]">
        notification routing / lib/db.js
      </p>
      <svg
        viewBox="0 0 480 208"
        className="w-full"
        role="img"
        aria-label="Routing diagram: every event flows through emitActivity. Customer actions (task completed, new comment, portal visit) land in the vendor's notification centre; vendor actions (portal invite, task assigned, task commented) reach the customer as email through Resend."
      >
        {/* events → the emitActivity() hub */}
        {NF_ROWS.map(({ label, y }, i) => (
          <g key={label}>
            <text x={12} y={y + 4} fontSize={13} fontFamily={mono} fill="var(--case-study-ink-soft)">
              {label}
            </text>
            <circle cx={148} cy={y} r={2.5} fill={NF_DOT} />
            <path
              id={`vec-nf-in-${i}`}
              d={`M148 ${y} C 166 ${y}, 160 104, 176 104`}
              fill="none"
              stroke={line}
              strokeWidth={1}
            />
          </g>
        ))}

        {/* the hub: one writer, two derivers */}
        <rect x={176} y={88} width={134} height={32} rx={8} fill="none" stroke="rgba(156,255,166,0.4)" />
        <text x={243} y={108} textAnchor="middle" fontSize={13} fontFamily={mono} fill={NF_GREEN}>
          emitActivity()
        </text>

        {/* hub → destinations */}
        <path d="M310 104 C 320 104, 312 56, 324 56" fill="none" stroke={line} strokeWidth={1} />
        <path d="M310 104 C 320 104, 312 152, 324 152" fill="none" stroke={line} strokeWidth={1} />

        <rect x={324} y={38} width={150} height={36} rx={8} fill="none" stroke="rgba(192,152,255,0.45)" />
        <text x={399} y={60} textAnchor="middle" fontSize={11} fontFamily={mono} fill={NF_PURPLE}>
          notification centre
        </text>
        <rect x={324} y={134} width={150} height={36} rx={8} fill="none" stroke="rgba(255,158,196,0.45)" />
        <text x={399} y={156} textAnchor="middle" fontSize={11} fontFamily={mono} fill={NF_PINK}>
          email / resend
        </text>
      </svg>
    </div>
  );
}

/* Snippet contents are REAL lines from the vector repo (github.com/jawciu/vector)
   — lib/health.js and lib/ai/scan-stale.js — trimmed, not paraphrased. If the
   repo logic changes, re-check these against source before editing. */
const COMPANIONS: Record<NonNullable<Block["companion"]>, React.ReactNode> = {
  health: (
    <SnippetCard title="lib/health.js">
      <span className="tok-com">{"// no model in the loop, only task data\n"}</span>
      <span className="tok-key">{"const"}</span>
      {" BLOCKED_THRESHOLD = 0.3;\n\n"}
      <span className="tok-key">{"if"}</span>
      {" (blockedPct >= BLOCKED_THRESHOLD) {\n  status = "}
      <span className="tok-str">{'"Blocked"'}</span>
      {";\n  reasons."}
      <span className="tok-fn">{"push"}</span>
      {"(\n    "}
      <span className="tok-str">{"`${blockedCount} of ${total} tasks blocked`"}</span>
      {");\n}\n"}
      <span className="tok-com">{"// every flag carries its evidence\n"}</span>
      <span className="tok-key">{"return"}</span>
      {" { status, reasons };"}
    </SnippetCard>
  ),
  cron: (
    <SnippetCard title="lib/ai/scan-stale.js">
      <span className="tok-com">{'// vercel cron: Mondays 08:00, "0 8 * * 1"\n'}</span>
      <span className="tok-key">{"const"}</span>
      {" stale = tasks\n  ."}
      <span className="tok-fn">{"map"}</span>
      {"((t) => "}
      <span className="tok-fn">{"withStaleness"}</span>
      {"(t, today))\n  ."}
      <span className="tok-fn">{"filter"}</span>
      {"((t) => t.staleness !== "}
      <span className="tok-key">{"null"}</span>
      {")\n  "}
      <span className="tok-com">{"// no owner, no follow-up\n"}</span>
      {"  ."}
      <span className="tok-fn">{"filter"}</span>
      {"((t) => t.ownerId != "}
      <span className="tok-key">{"null"}</span>
      {")"}
    </SnippetCard>
  ),
  flow: <NotificationFlow />,
};

/* Where each companion sits against its shot (md+; phones keep the simple
   in-flow stack). The flow card outsizes its shrunk asset on purpose —
   Caroline traded 10% of the shot for a bigger, readable diagram. */
const COMPANION_POS: Record<NonNullable<Block["companion"]>, string> = {
  /* bottom-RIGHT corner of the notifications shot, oversized, deep overlap
     (~3× the original 56px) */
  flow: "relative z-10 -mt-10 w-full md:-mt-40 md:ml-auto md:mr-[-30%] md:w-[118%] md:max-w-[500px]",
  /* bottom-LEFT corner of the health table, a touch more overlap */
  health: "relative z-10 -mt-10 w-[88%] max-w-[430px] ml-[-6%] md:-mt-16 md:ml-[-10%]",
  /* bottom-LEFT corner of the follow-up draft */
  cron: "relative z-10 -mt-10 w-[88%] max-w-[420px] ml-[-6%] md:-mt-14 md:ml-[-10%]",
};

/* Each row is a centred BAND with the copy at one end and the shot at the other, pushed
   apart (space-between). Big shots ride the full 90% band; the small panels tighten to a
   70% band so the pair doesn't strand itself at opposite edges of the screen. Below md
   the band collapses: one column, copy first, shot full width. */
function ProductBlock({ subhead, body, asset, alt, companion, flip, width, band, framed }: Block) {
  return (
    <Reveal
      className={`mx-auto flex flex-col gap-10 px-6 md:flex-row md:items-center md:justify-between md:gap-6 md:px-0 ${
        band === "90" ? "md:w-[90%]" : band === "75" ? "md:w-[75%]" : "md:w-[70%]"
      }`}
    >
      {/* COPY — also the anchor the room's CircuitTrace lights a node against.
          Heading is static full-ink (the scroll-lit TabHead was tried and cut);
          the first paragraph gets double air under the heading. */}
      <div data-trace-node className={`md:w-[424px] md:shrink-0 ${flip ? "md:order-2" : ""}`}>
        <h3 className="font-[family-name:var(--font-mono)] text-[24px] font-extrabold tracking-[0.04em] text-[var(--case-study-ink)]">
          {subhead}
        </h3>
        {body.map((p, i) => (
          <Body key={p.slice(0, 24)} className={i === 0 ? "mt-8" : "mt-4"}>
            {p}
          </Body>
        ))}
      </div>

      {/* VISUAL — frameless unless the asset lacks its own chrome (see `framed`).
          A companion clusters against a corner of its shot (cog-style stacked
          overlap) with its own parallax speed, so the pair floats apart as you
          scroll. Each companion has a bespoke corner (COMPANION_POS): flow →
          bottom-left, health → bottom-right, cron → top-right (empty space in
          that asset). Below md they all stack in-flow. */}
      <div className={`relative w-full md:shrink-0 ${flip ? "md:order-1" : ""}`} style={{ maxWidth: width }}>
        <Parallax speed={20}>
          <Shot src={A(asset)} alt={alt} bare={!framed} />
        </Parallax>
        {companion && (
          <Parallax speed={34} className={COMPANION_POS[companion]}>
            {COMPANIONS[companion]}
          </Parallax>
        )}
      </div>
    </Reveal>
  );
}

export function Product() {
  return (
    /* overflow-x-hidden would BREAK the page's sticky glass seam (see CLAUDE.md), so the
       rows are padded, never translated — nothing can overflow horizontally. */
    <section data-section="Product" className="pt-[120px] pb-0">
      {/* The section heading lives INSIDE the first dotted room, so the texture
          (and its boundary hairline) starts above the whole Product header. The
          rows sit outside the Container so their asset column can bleed out. */}
      <div>
        <SubSection label="shared board" texture="dots">
          {/* heading → first block gap is HALF the room's 156px rhythm. Tailwind
              v4 space-y puts the margin on the PREVIOUS sibling's bottom, so the
              override lives here (a mt-! on the block does nothing). */}
          <Container className="mb-[78px]!">
            <Reveal>
              <Kicker>The product</Kicker>
              <Title>
                Shared board, AI admin,
                <br />
                predictive health
              </Title>
            </Reveal>
          </Container>

          <ProductBlock {...BLOCKS[0]} />

          <Container>
            <Reveal className="max-w-[860px]">
              <CaseStudyCallout stream>
                {"The customer clicks a magic link and lands straight on their tasks. No account, no password, no training. Every visit is tracked, so the vendor knows the moment they go quiet."}
              </CaseStudyCallout>
            </Reveal>
          </Container>

          <ProductBlock {...BLOCKS[1]} />
          <ProductBlock {...BLOCKS[2]} />
        </SubSection>

        <SubSection label="predictive health">
          <ProductBlock {...BLOCKS[3]} />

          <Container>
            <Reveal className="max-w-[860px]">
              <CaseStudyCallout stream>
                {"Every flag arrives with its evidence. 3 of 9 tasks blocked, 8 tasks overdue, customer dark for 64 days. When you can see why the flag was raised, you can act on it."}
              </CaseStudyCallout>
            </Reveal>
          </Container>
        </SubSection>

        <SubSection label="ai admin" texture="grid" last>
          <ProductBlock {...BLOCKS[4]} />
          <ProductBlock {...BLOCKS[5]} />
          <ProductBlock {...BLOCKS[6]} />

          <Container>
            <Reveal className="max-w-[860px]">
              <CaseStudyCallout stream>
                {"I gave the AI a review queue instead of write access to the board. It drafts, and the user decides whether to approve, edit or reject any task or follow-up."}
              </CaseStudyCallout>
            </Reveal>
          </Container>
        </SubSection>
      </div>
    </section>
  );
}
