import { A, Container, Kicker, Title, Subhead, Body, CaseStudyCallout, Shot } from "../ui";
import { Reveal } from "../Reveal";
import { Parallax } from "../Parallax";

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
      "The vendor works each onboarding as a Kanban board. Columns are the phases, from kickoff to go-live, and they flex to match how the company actually runs.",
      "When the customer needs to see the work, the vendor shares the board as a portal with a magic link.",
    ],
    asset: "board-v2.png",
    band: "90",
    width: 624,
    alt: "Vector's vendor board: an onboarding as a Kanban board, phases as columns, tasks carrying owner, due date and status.",
  },
  {
    subhead: "Customer portal",
    body: [
      "The customer sees their progress and what needs their attention this week. The tasks assigned to them are highlighted, so their work cuts through the noise.",
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
      "Everything the customer does flows back. A completed task, a new comment and a first portal visit each land in the vendor's notification centre.",
      "Portal invites, task assignments and comment alerts go out through Resend, so updates reach the customer in their inbox without them needing to check another tool.",
    ],
    asset: "notifications-v2.png",
    band: "70",
    width: 435,
    alt: "Vector's notification centre: customer activity grouped by actor, showing completions, comments and first portal visits.",
  },
  {
    subhead: "AI overview",
    body: [
      "The overview runs at two altitudes, so vendors spend less time working out what to prioritise.",
      "Across the whole business it is triage, a short read naming which onboardings deserve a closer look. Inside a single onboarding it gets granular: a headline, focus for today and this week, risks, wins and nudges, every claim anchored to a real task id.",
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
      "Staying on top of what was agreed on a vendor and customer call is one of the hardest parts of onboarding, so Vector writes it up instead.",
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
      "Stale tasks are watched for the vendor. A scanner runs weekly on Vercel Cron, walks every active onboarding, and flags a task as stale when it is blocked or more than five days overdue.",
      "Each one gets an AI-drafted email waiting in Actions, and the vendor only has to approve it to send. Any blocked or overdue task can be chased the same way, with one click.",
    ],
    asset: "followup-v2.png",
    band: "70",
    width: 522,
    alt: "Vector's draft follow-up: an AI-written email grounded in a blocked task, with dismiss, open in mail and comment.",
    flip: true,
  },
];

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
      {/* COPY */}
      <div className={`md:w-[424px] md:shrink-0 ${flip ? "md:order-2" : ""}`}>
        <Subhead>{subhead}</Subhead>
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
      {/* Heading rides the normal page grid… */}
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

      {/* …the rows sit OUTSIDE the container so their asset column can bleed out. */}
      <div className="mt-14 space-y-[156px]">
        <ProductBlock {...BLOCKS[0]} />

        <Container>
          <Reveal className="max-w-[860px]">
            <CaseStudyCallout stream>
              {"The customer clicks a magic link and lands straight on their tasks. No account, no password, no training. Every visit is tracked, so the vendor knows the moment they go quiet."}
            </CaseStudyCallout>
          </Reveal>
        </Container>

        {BLOCKS.slice(1).map((b) => (
          <ProductBlock key={b.subhead} {...b} />
        ))}
      </div>
    </section>
  );
}
