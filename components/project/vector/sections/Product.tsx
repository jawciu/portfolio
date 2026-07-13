import { A, Container, Kicker, Title, Body, CaseStudyCallout, Shot } from "../ui";
import { Reveal } from "../Reveal";
import { Parallax } from "../Parallax";
import { DotGlow } from "../DotGlow";
import { CircuitTrace } from "../CircuitTrace";
import { TabHead } from "../TabHead";

/* The product — one continuous walk through the product, replacing the old pillar
   cards + the separate Workspace / AIFeatures sections. Each block is a two-column
   row: copy on one side, the product visual on the other, sides ALTERNATING down the
   page (`flip`). Below md the grid collapses and copy always leads, then the visual. */

type Block = {
  subhead: string;
  body: string[];
  asset: string;
  alt: string;
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
    band: "70",
    width: 435,
    alt: "Vector's notification centre: customer activity grouped by actor, showing completions, comments and first portal visits.",
  },
  {
    subhead: "Predictive health",
    body: [
      "Every onboarding is scored On track, At risk or Blocked. The triggers are all real task data, blocked or overdue work, a pace that overruns the go-live date, a third of the tasks stuck. I kept AI out of the scoring on purpose. It's deterministic JavaScript, so the same input always gives the same answer.",
    ],
    asset: "health-v2.png",
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
      "linear-gradient(rgba(241,234,241,0.07) 1px, transparent 1px), linear-gradient(90deg, rgba(241,234,241,0.07) 1px, transparent 1px)",
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

/* Each row is a centred BAND with the copy at one end and the shot at the other, pushed
   apart (space-between). Big shots ride the full 90% band; the small panels tighten to a
   70% band so the pair doesn't strand itself at opposite edges of the screen. Below md
   the band collapses: one column, copy first, shot full width. */
function ProductBlock({ subhead, body, asset, alt, flip, width, band, framed }: Block) {
  return (
    <Reveal
      className={`mx-auto flex flex-col gap-10 px-6 md:flex-row md:items-center md:justify-between md:gap-6 md:px-0 ${
        band === "90" ? "md:w-[90%]" : band === "75" ? "md:w-[75%]" : "md:w-[70%]"
      }`}
    >
      {/* COPY — also the anchor the room's CircuitTrace lights a node against,
          and the scroll band TabHead lights up in. */}
      <div data-trace-node className={`md:w-[424px] md:shrink-0 ${flip ? "md:order-2" : ""}`}>
        <TabHead>{subhead}</TabHead>
        {body.map((p) => (
          <Body key={p.slice(0, 24)} className="mt-4">
            {p}
          </Body>
        ))}
      </div>

      {/* VISUAL — frameless unless the asset lacks its own chrome (see `framed`). */}
      <div className={`w-full md:shrink-0 ${flip ? "md:order-1" : ""}`} style={{ maxWidth: width }}>
        <Parallax speed={20}>
          <Shot src={A(asset)} alt={alt} bare={!framed} />
        </Parallax>
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
          <Container>
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
