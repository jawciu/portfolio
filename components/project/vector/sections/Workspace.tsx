import { A, Container, Kicker, Title, Body, CaseStudyCallout, ShotRow } from "../ui";
import { Reveal } from "../Reveal";

const EMAIL = [
  [
    "transactional email",
    "Portal invites, task assignments and comment alerts go out through Resend, so updates reach the customer in their inbox without them needing to check another tool.",
  ],
  [
    "designed for the inbox",
    "The emails are dark-themed and table-based, with the color-scheme meta tags that stop Gmail from recolouring them. Email clients only respect old-school HTML, so that is what I wrote.",
  ],
  [
    "bounces become signals",
    "A signed Resend webhook reports hard bounces, and the contact is flagged on the onboarding, where the AI reads it as a risk. A dead email address surfaces straight away instead of weeks later.",
  ],
] as const;

export function Workspace() {
  return (
    <section data-section="Workspace" className="pt-[120px] pb-0">
      <Container>
        <Reveal>
          <Kicker>Pillar #01 · Shared workspace</Kicker>
          <Title>
            One board,
            <br />
            both sides see it
          </Title>
        </Reveal>

        <Reveal className="max-w-[760px]">
          <Body>
            The vendor works each onboarding as a Kanban board. Columns are phases, from
            Kickoff to Go-Live. Every task carries a status, an owner, dependencies and a
            Jira-style id like AC-12, so it can be referenced in a comment or an AI draft.
          </Body>
        </Reveal>

        <ShotRow
          src={A("board.png")}
          alt="Vector's Kanban board for one onboarding, with phase columns and status-tagged task cards."
          caption="The vendor workspace. Phases as columns, health at a glance."
          speed={24}
          className="mt-8"
        />

        <Reveal className="mt-16">
          <CaseStudyCallout stream>
            {"The customer clicks a magic link and lands straight on their tasks. No account, no password, no training. Every visit is tracked, so the vendor knows the moment they go quiet."}
          </CaseStudyCallout>
        </Reveal>

        <ShotRow
          src={A("portal.png")}
          alt="Vector's customer portal: the customer's own task list, go-live countdown and a plain-language AI summary."
          caption="The customer portal. Their tasks, their deadlines, a plain-language summary."
          speed={-22}
          className="mt-14"
        />

        <Reveal className="mt-16 max-w-[760px]">
          <Body>
            Everything the customer does flows back. A completed task, a new comment and a
            first portal visit each land in the vendor&apos;s notification centre, grouped
            by person, so five quick edits read as one line instead of five.
          </Body>
        </Reveal>

        <ShotRow
          src={A("notifications.png")}
          alt="Vector's notification centre, with customer activity grouped by person and expandable into individual events."
          caption="The notification centre. Customer activity, grouped by actor."
          speed={26}
          className="mt-8"
        />

        <Reveal
          stagger={0.12}
          className="mt-16 grid grid-cols-1 gap-x-10 gap-y-10 md:grid-cols-3"
        >
          {EMAIL.map(([label, body]) => (
            <div key={label}>
              <div className="mb-4 h-px w-10 bg-[var(--green)]" />
              <p className="case-study-label mb-3">{label} &gt;</p>
              <Body>{body}</Body>
            </div>
          ))}
        </Reveal>
      </Container>
    </section>
  );
}
