import { A, CARD_FRAME, Container, Kicker, Title, Body, CaseStudyCallout, Shot } from "../ui";
import { Reveal } from "../Reveal";
import { Parallax } from "../Parallax";
import { DotGlow } from "../DotGlow";
import { CircuitTrace } from "../CircuitTrace";

/* The product — one continuous walk through the product, replacing the old pillar
   cards + the separate Workspace / AIFeatures sections. Each block is a two-column
   row: copy on one side, the product visual on the other, sides ALTERNATING down the
   page (`flip`). Below 1070px the grid collapses and copy always leads, then the
   visual (the mobile stack — promoted from md, where 768-1070 never fit). */

type Block = {
  subhead: string;
  body: string[];
  asset: string;
  alt: string;
  /** small artifact clustered with the shot (cog-style stacked overlap):
      a code snippet, the notification routing or the Miniti pipeline. Only for
      the SMALL shots — board, portal and AI overview speak for themselves. */
  companion?: "health" | "cron" | "flow" | "miniti";
  /** true → visual on the LEFT, copy on the RIGHT (md+ only) */
  flip?: boolean;
  /** rendered width of the shot in px (md+). Tuned per shot by eye. */
  width: number;
  /** widen the visual COLUMN past the shot (shot hugs one side, companion
      takes the freed corner). md+ only. */
  columnWidth?: number;
  /** how wide a band the row occupies before copy and shot are pushed apart.
      All blocks ride the full 90% since the companion round (2026-07-13) —
      the narrower bands are kept in the type for future small rows. On very
      wide screens the 90% band steps down (80% ≥1624px, 70% ≥1888px, 60%
      ≥2000px) so the copy↔shot gap doesn't balloon. */
  band: "90" | "75" | "70";
  /** Draw the shared product-visual frame (radius, hairline, card fill, shadow).
      Off by default: these assets ship their own chrome, so the frame would box a box.
      The portal shot is the exception — it's a plain opaque rectangle. */
  framed?: boolean;
  /** extra classes on the SHOT's inner wrapper (md-gated by the caller) — e.g.
      inset the shot from its hugged edge without moving the companion, which
      anchors to the COLUMN edges */
  shotClassName?: string;
  /** extra classes on the copy block (md-gated by the caller) — e.g. shift the
      copy down to centre it on shot + companion as a GROUP (items-center only
      sees the in-flow shot; absolute companions don't count) */
  copyClassName?: string;
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
    band: "90",
    /* widened column: the shot hugs the LEFT of it, so the routing card can
       sit against the bottom-right corner instead of covering the front.
       780 (was 560) pulls the shot well left of the routing card — closer to
       the copy (a smaller copy gap is fine here, Caroline 2026-07-13) and
       clearly separated from the routing card, which stays put at the right. */
    columnWidth: 780,
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
    band: "90",
    width: 580,
    /* the snippet hangs 200px below the table; +100px centres the copy on the
       table+snippet GROUP */
    copyClassName: "min-[1070px]:translate-y-[100px]",
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
    companion: "miniti",
    band: "90",
    width: 566,
    alt: "Vector's Actions queue: a task drafted from a meeting transcript, marked 'From miniti', with create, edit and dismiss.",
  },
  {
    subhead: "Automated follow-ups",
    body: [
      "A weekly scanner on Vercel Cron walks every active onboarding and flags any task blocked or more than five days overdue. Each flag becomes a drafted email that only the task's owner sees, one approval away from sending.",
      "A task with no owner gets no follow-up. I chose clear responsibility over copying everyone in, and kept one plain tone for now. Adapting the writing to each user's voice is on the roadmap.",
    ],
    asset: "followup-v2.png",
    companion: "cron",
    band: "90",
    /* widened column (flipped block: shot hugs the RIGHT of it) — pushes the
       draft way over toward the copy so that gap gets much smaller, and frees
       the column's left edge for the cron snippet so it can't overshoot the
       band edge. */
    columnWidth: 760,
    width: 522,
    /* draft sits 150px in from the column's right edge; the cron snippet keeps
       anchoring to the COLUMN corner, so it stays put while the shot moves left */
    shotClassName: "min-[1070px]:mr-[150px]",
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
  className = "",
  bodyClassName = "",
  children,
}: {
  label: string;
  texture?: Texture;
  last?: boolean;
  /** extra classes on the room div — use `!` arbitrary utilities to override
      the baked pb-[140px] (e.g. `pb-[190px]!` for a roomier room) */
  className?: string;
  /** extra classes on the content wrapper — override its mt the same way */
  bodyClassName?: string;
  children: React.ReactNode;
}) {
  return (
    /* The hairline is the div's own border, so it sits EXACTLY where the texture
       starts and runs the full screen width. Each subsection's top border doubles
       as the previous one's bottom edge; `last` closes the final texture. */
    <div
      className={`relative border-t border-[rgba(241,234,241,0.14)] pb-[140px] ${
        last ? "border-b" : ""
      } ${className}`}
      style={texture ? TEXTURES[texture] : undefined}
    >
      {/* cursor-following lilac glow over the texture; content wrappers below are
          `relative` so they paint ABOVE this overlay */}
      {texture && <DotGlow pattern={texture} />}
      {/* scroll-drawn circuit spine down the left edge, one node per block */}
      <CircuitTrace />
      {/* room label: on the two-column layout (1070px+) it turns 90° and rides the
          circuit spine (between the screen edge and the line, so it can never collide
          with the 90% content band); below 1070 the rows use the mobile stack at px-6,
          which would run into the spine/label — so trace + vertical label hide and the
          label keeps its horizontal spot. Gates match ProductBlock's stack point. */}
      <p className="pointer-events-none absolute top-8 left-1.5 hidden rotate-180 font-[family-name:var(--font-mono)] text-sm tracking-[0.2em] text-[var(--case-study-muted)] [writing-mode:vertical-rl] min-[1070px]:block">
        /{label}
      </p>
      {/* max-sm:hidden — on phones the horizontal label is gone too (Caroline 2026-07-15);
          it still shows in the 640-1069 stacked band */}
      <Container className="relative max-sm:hidden min-[1070px]:hidden">
        <p className="pt-6 pl-2 font-[family-name:var(--font-mono)] text-sm tracking-[0.2em] text-[var(--case-study-muted)]">
          /{label}
        </p>
      </Container>
      <div className={`relative mt-16 space-y-[156px] md:mt-28 ${bodyClassName}`}>{children}</div>
    </div>
  );
}

/* ---- companions: the small artifacts clustered with the small shots ---- */

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
  /* MinitiFlow hoists (function declaration), so the forward reference is fine */
  miniti: <MinitiFlow />,
};

/* MinitiFlow — the data's journey from a Miniti call to the review queue.
   Deliberately SLIM (Caroline 2026-07-13): step labels only, no file names,
   no per-step captions — the copy beside it already tells the story, this is
   just the shape of the pipeline. Keeps the card thin so it barely overlaps
   the actions shot. */
const MINITI_STEPS = [
  "call ends",
  "pass 1 / extraction",
  "pass 2 / orchestrator",
  "review queue",
] as const;

function MinitiFlow() {
  return (
    <div className={CARD_FRAME}>
      <p className="mb-4 font-[family-name:var(--font-mono)] text-[11px] lowercase tracking-[0.14em] text-[var(--case-study-muted)]">
        miniti → vector
      </p>
      <ol className="relative ml-1 space-y-4 border-l border-[rgba(241,234,241,0.14)] pl-5">
        {MINITI_STEPS.map((label, i) => (
          <li key={label} className="relative">
            {/* node on the rail, tinted along the lilac→peach AI gradient */}
            <span
              aria-hidden
              className="absolute top-[5px] -left-[24.5px] size-[7px] rounded-full"
              style={{
                backgroundColor: ["#c098ff", "#cf9cf5", "#e99ddb", "#ff9c7d"][i],
              }}
            />
            <p className="font-[family-name:var(--font-mono)] text-[13px] font-bold text-[var(--case-study-ink)]">
              {label}
            </p>
          </li>
        ))}
      </ol>
    </div>
  );
}

/* Where each companion sits against its shot: below 1070px the cluster is an
   in-flow stack that MIRRORS the desktop stagger (Caroline 2026-07-14: same
   alignment as desktop, group centred but pieces staggered) — the column gets
   a 140px stagger budget (see ProductBlock), the shot slides to its desktop
   side and the companion takes the opposite one via ml-auto. From 1070px up
   the card pins absolutely to a CORNER of the asset. min-[1070px] everywhere,
   matching the row's stack point. */
const COMPANION_POS: Record<NonNullable<Block["companion"]>, string> = {
  /* desktop: bottom-RIGHT corner (the shot hugs the left of its widened column
     and the card takes the freed corner) → stacked: card right, shot left */
  flow: "relative z-10 -mt-10 w-full max-w-[440px] max-[1069px]:ml-auto min-[1070px]:absolute min-[1070px]:right-0 min-[1070px]:bottom-[-56px] min-[1070px]:mt-0 min-[1070px]:w-[440px]",
  /* desktop: bottom-LEFT of the health table, dropped WELL below it — the card
     mostly hangs off the table so the table's rows stay readable (it used to
     cover the right side; Caroline 2026-07-13) → stacked: card left, table right */
  health: "relative z-10 -mt-10 w-[88%] max-w-[430px] min-[1070px]:absolute min-[1070px]:left-[-24%] min-[1070px]:bottom-[-200px] min-[1070px]:mt-0 min-[1070px]:w-[430px]",
  /* desktop: bottom-RIGHT of the follow-up draft, overhanging the shot edge
     slightly (the copy gap absorbs it) → stacked: card right, draft left */
  cron: "relative z-10 -mt-10 w-[88%] max-w-[420px] max-[1069px]:ml-auto min-[1070px]:absolute min-[1070px]:right-[-6%] min-[1070px]:bottom-[-56px] min-[1070px]:mt-0 min-[1070px]:w-[400px]",
  /* desktop: bottom-LEFT of the actions queue — slimmed to labels only. z-0 (all
     widths) drops it UNDER the actions shot (the shot's wrapper carries z-[5]),
     so the overlapping corner tucks behind the card in the stack too */
  miniti: "relative z-0 -mt-10 w-[88%] max-w-[290px] min-[1070px]:absolute min-[1070px]:left-[calc(-34%_-_20px)] min-[1070px]:bottom-[-76px] min-[1070px]:mt-0 min-[1070px]:w-[290px]",
};

/* stacked-only (≤1069px) shot alignment inside the stagger-widened column: the
   shot takes its DESKTOP side, the companion (above) takes the other corner */
const COMPANION_STACK_SHOT: Record<NonNullable<Block["companion"]>, string> = {
  flow: "max-[1069px]:mr-auto",   // shot left, routing card right
  health: "max-[1069px]:ml-auto", // table right, snippet left
  cron: "max-[1069px]:mr-auto",   // draft left, cron snippet right
  miniti: "max-[1069px]:ml-auto", // actions right, pipeline card left
};

/* Each row is a centred BAND with the copy at one end and the shot at the other, pushed
   apart (space-between). Big shots ride the full 90% band; the small panels tighten to a
   70% band so the pair doesn't strand itself at opposite edges of the screen. Below
   1070px the band collapses: one column, copy first, shot full width (the mobile stack,
   promoted from md — the two-column row never fit 768-1070 without collisions). */
function ProductBlock({ subhead, body, asset, alt, companion, flip, width, columnWidth, band, framed, shotClassName = "", copyClassName = "" }: Block) {
  return (
    <Reveal
      className={`mx-auto flex flex-col gap-10 px-6 min-[1070px]:flex-row min-[1070px]:items-center min-[1070px]:justify-between min-[1070px]:gap-6 min-[1070px]:px-0 ${
        /* the 90 band tightens on very wide screens so the copy↔shot gap doesn't
           balloon. All tiers use min-[..px] variants: Tailwind v4 emits the
           arbitrary min-[] group BEFORE the named md: block, so a md:w- here
           would win over the wide tiers regardless of viewport. */
        band === "90"
          /* the 60% tier is floored at 1280px: the widest rows (424 copy + 828
             shot + 24 gap = 1276) would spill past a bare 60% band until
             ~2130px viewport, reading off-centre. max() keeps every row on the
             same band edge instead. */
          ? "min-[1070px]:w-[90%] min-[1624px]:w-[80%] min-[1888px]:w-[70%] min-[2000px]:w-[max(60%,1280px)]"
          : band === "75"
            ? "min-[1070px]:w-[75%]"
            : "min-[1070px]:w-[70%]"
      }`}
    >
      {/* COPY — also the anchor the room's CircuitTrace lights a node against.
          Heading is static full-ink (the scroll-lit TabHead was tried and cut);
          the first paragraph gets double air under the heading. Width is 424px
          from 1230px up, then hugs tighter 1:1 with the viewport down to the
          1070px stack point (clamp floor 264 = 424 − 160) — Caroline's call:
          the copy cedes width in that band so the visuals never ride over it. */}
      <div data-trace-node className={`min-[1070px]:w-[clamp(264px,calc(100vw-806px),424px)] min-[1070px]:shrink-0 ${flip ? "min-[1070px]:order-2" : ""} ${copyClassName}`}>
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
          scroll. Corners live in COMPANION_POS; below 1070px everything stacks
          in-flow. With `columnWidth` the shot hugs the column's copy-far side
          and the companion takes the freed corner. */}
      {/* the shot + column caps live in CSS vars so breakpoints can retier them:
          full size below 1070px (stacked) and from 1408px up; ×0.8 in the
          1070–1407px band, where full-size shots crowd the copy (424+24+828 =
          1276px outgrows the 90% band ≈1418px down). min-[..px] not md:/lg: —
          the arbitrary min-[] variant group is emitted before the named block,
          so mixing them on one property lets the named rule win at every width
          (see responsive-design skill).
          Stacked (<1070) the column caps at the SHOT width (not the widened
          columnWidth — that's dead space reserved for corner-anchoring, which is
          row-mode only) and centres via mx-auto: shot + companion move as ONE
          centred cluster. Companion rows widen that cap by a 140px stagger
          budget so the pieces can take opposite sides, mirroring the desktop
          arrangement (shot side in COMPANION_STACK_SHOT, companion side in
          COMPANION_POS); on phones the container is narrower than the shot, so
          the budget never bites and the stagger degrades gracefully to zero. */}
      <div
        className={`relative mx-auto w-full ${companion ? "max-w-[calc(var(--pb-shot)+140px)]" : "max-w-[var(--pb-shot)]"} min-[1070px]:mx-0 min-[1070px]:shrink-0 min-[1070px]:max-w-[calc(var(--pb-col)*0.8)] min-[1408px]:max-w-[var(--pb-col)] ${flip ? "min-[1070px]:order-1" : ""}`}
        style={{ "--pb-col": `${columnWidth ?? width}px`, "--pb-shot": `${width}px` } as React.CSSProperties}
      >
        {/* in a widened column the shot hugs the copy-FAR side: left on normal
            rows, right on flipped rows (so widening always moves it toward the copy).
            z-[5] layers the shot BETWEEN the companions: above z-0 ones
            (miniti tucks under it), below the default z-10 ones. */}
        <div
          style={{ "--pb-shot": `${width}px` } as React.CSSProperties}
          className={`relative z-[5] max-w-[var(--pb-shot)] min-[1070px]:max-w-[calc(var(--pb-shot)*0.8)] min-[1408px]:max-w-[var(--pb-shot)] ${companion ? COMPANION_STACK_SHOT[companion] : ""} ${columnWidth ? (flip ? "min-[1070px]:ml-auto" : "min-[1070px]:mr-auto") : ""} ${shotClassName}`}
        >
          <Parallax speed={20}>
            <Shot src={A(asset)} alt={alt} bare={!framed} />
          </Parallax>
        </div>
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
    <section data-section="Product" className="pt-[156px] max-sm:pt-[120px] pb-0">
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
                Shared view and AI
                <br />
                that keeps work on track
              </Title>
            </Reveal>
          </Container>

          <ProductBlock {...BLOCKS[0]} />

          {/* phone gaps ÷2 (Caroline 2026-07-15): -mt collapses against the room's
              156px space-y (156 − 78 = 78); the mb! beats space-y for the gap below */}
          <Container className="max-sm:-mt-[78px] max-sm:mb-[78px]!">
            <Reveal className="max-w-[860px]">
              <CaseStudyCallout stream>
                {"The customer clicks a magic link and lands straight on their tasks. No account, no password, no training. Every visit is tracked, so the vendor knows the moment they go quiet."}
              </CaseStudyCallout>
            </Reveal>
          </Container>

          <ProductBlock {...BLOCKS[1]} />
          {/* portal → notifications gap −30% on phones (156 − 47 = 109) */}
          <div className="max-sm:-mt-[47px]">
            <ProductBlock {...BLOCKS[2]} />
          </div>
        </SubSection>

        {/* roomier than the baked rhythm on both ends — the health room needs to
            breathe (Caroline 2026-07-13) */}
        {/* max-sm:pb = the gap AFTER the evidence callout ÷2 on phones (Caroline 2026-07-15) */}
        <SubSection label="predictive health" className="pb-[190px]! max-sm:pb-[95px]!" bodyClassName="md:mt-40!">
          <ProductBlock {...BLOCKS[3]} />

          {/* pt compensates for the health snippet hanging 200px below its block:
              the room's 156px rhythm alone would put the callout UNDER the snippet.
              144px of padding (padding never margin-collapses) lands the VISUAL
              gap at ~100px. */}
          <Container className="md:pt-[144px]">
            <Reveal className="max-w-[860px]">
              <CaseStudyCallout stream>
                {"Every flag arrives with its evidence. 3 of 9 tasks blocked, 8 tasks overdue, customer dark for 64 days. When you can see why the flag was raised, you can act on it."}
              </CaseStudyCallout>
            </Reveal>
          </Container>
        </SubSection>

        {/* max-sm:pb = the gap BELOW the review-queue callout ÷2 on phones (baked pb is 140) */}
        <SubSection label="ai admin" texture="grid" last className="max-sm:pb-[70px]!">
          <ProductBlock {...BLOCKS[4]} />
          {/* AI overview → meetings gap ÷2 on phones (156 − 78 = 78) */}
          <div className="max-sm:-mt-[78px]">
            <ProductBlock {...BLOCKS[5]} />
          </div>
          {/* +100px over the room's 156px rhythm between tasks and follow-ups
              (Caroline). Padding on a wrapper, NOT margin on the block — a
              margin would collapse into space-y's 156 and change nothing. */}
          {/* max-sm: meetings → follow-ups gap ÷2 on phones */}
          <div className="md:pt-[100px] max-sm:-mt-[78px]">
            <ProductBlock {...BLOCKS[6]} />
          </div>

          {/* +54px air both sides of the closing callout (Caroline) — padding,
              not margin, so it stacks on the room rhythm instead of collapsing */}
          {/* max-sm: review-queue callout gap above ÷2 on phones (below = the room's
              max-sm:pb on the SubSection) */}
          <Container className="md:pt-[54px] md:pb-[54px] max-sm:-mt-[78px]">
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
