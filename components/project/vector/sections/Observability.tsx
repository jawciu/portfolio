import { A, CARD_FRAME, Container, Kicker, Title, Body, CaseStudyCallout, ShotRow } from "../ui";
import { Reveal } from "../Reveal";
import { Parallax } from "../Parallax";

/* PipelineView — the admin's Pipeline tab, recreated as a card (the live tab
   sits behind vendor auth, so this is a faithful rebuild of
   app/components/PipelineTimeline.js rather than a screenshot: same filter
   chips, same states, same expanded trace). Data is fictional, matching the
   demo book of business used across every other shot. */

const PIPE_FILTERS = [
  ["All", "24", true],
  ["Processed", "19", false],
  ["Ambiguous", "2", false],
  ["Stuck", "1", false],
  ["Errored", "1", false],
  ["Test", "1", false],
] as const;

const STATE_TINTS: Record<string, string> = {
  processed: "var(--vec-success)",
  ambiguous: "var(--vec-alert)",
  stuck: "var(--case-study-muted)",
  errored: "var(--vec-danger)",
};

type PipeRow = {
  title: string;
  state: keyof typeof STATE_TINTS;
  date: string;
  open?: boolean;
  error?: string;
};

const PIPE_ROWS: PipeRow[] = [
  { title: "Raycast weekly sync", state: "processed", date: "08/07/2026" },
  { title: "Untitled meeting", state: "processed", date: "06/07/2026", open: true },
  { title: "Modal kickoff call", state: "ambiguous", date: "07/07/2026" },
  { title: "beehiiv dashboards review", state: "errored", date: "04/07/2026", error: "Pass 2 timed out after 60s" },
];

/* the expanded trace under "Untitled meeting" — the transcript-match win */
const PIPE_TRACE = [
  ["matched", "Function Health, via the transcript (title gave nothing)"],
  ["pass 1 / extraction", "5 claims, each with a verbatim source quote"],
  ["pass 2 / tool calls", "create_task ×2 · match_existing ×2 · update_status ×1"],
  ["drafts", "5 in the review queue · $0.036 · full transcript kept"],
] as const;

function PipelineView() {
  const mono = "font-[family-name:var(--font-mono)]";
  return (
    <div className={CARD_FRAME}>
      <p className={`${mono} mb-4 text-[11px] lowercase tracking-[0.14em] text-[var(--case-study-muted)]`}>
        the pipeline view / admin
      </p>

      {/* filter chips, as in the real tab */}
      <div className="flex flex-wrap gap-1.5">
        {PIPE_FILTERS.map(([label, count, active]) => (
          <span
            key={label}
            className={`${mono} rounded-full border px-2.5 py-[3px] text-[11px] ${
              active
                ? "border-[rgba(241,234,241,0.3)] text-[var(--case-study-ink)]"
                : "border-[var(--case-study-line)] text-[var(--case-study-muted)]"
            }`}
          >
            {label} <span className="text-[var(--case-study-muted)]">{count}</span>
          </span>
        ))}
      </div>

      {/* event rows */}
      <ul className="mt-4 space-y-2">
        {PIPE_ROWS.map(({ title, state, date, open, error }) => (
          <li
            key={title}
            className={`rounded-[8px] border px-3.5 py-2.5 ${
              state === "errored" ? "border-[rgba(255,137,155,0.4)]" : "border-[var(--case-study-line)]"
            }`}
          >
            <div className="flex items-center justify-between gap-3">
              <p className={`${mono} min-w-0 truncate text-[12.5px] text-[var(--case-study-ink)]`}>
                <span className="mr-1.5 text-[var(--case-study-muted)]">{open ? "▾" : "▸"}</span>
                {title}
              </p>
              <p className={`${mono} shrink-0 text-[11px]`}>
                <span style={{ color: STATE_TINTS[state] }}>{state}</span>
                <span className="ml-2.5 text-[var(--case-study-muted)]">{date}</span>
              </p>
            </div>
            {error && (
              <p className={`${mono} mt-1 pl-4 text-[11px] text-[var(--vec-danger)]`}>{error}</p>
            )}
            {open && (
              <div className="mt-2.5 space-y-1.5 border-t border-[var(--case-study-line)] pt-2.5 pl-4">
                {PIPE_TRACE.map(([k, v]) => (
                  <p key={k} className={`${mono} text-[11.5px] leading-snug`}>
                    <span className="text-[var(--case-study-ink)]">{k}</span>
                    <span className="text-[var(--case-study-muted)]"> · {v}</span>
                  </p>
                ))}
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export function Observability() {
  return (
    <section data-section="Observability" className="pt-[120px] pb-0">
      <Container>
        <Reveal>
          <Kicker>Observability</Kicker>
          <Title>
            Every call logged,
            <br />
            every failure visible
          </Title>
        </Reveal>

        <Reveal className="max-w-[760px] space-y-5">
          <Body>
            AI features fail quietly, so Vector ships with its own admin dashboard. Every
            Claude call is rolled up by feature, with calls, errors, total cost, p95
            latency and cache hit rate, and each individual call keeps its full token
            breakdown, dollar cost, duration and Anthropic request id.
          </Body>
          <Body>
            The pipeline view keeps every meeting event, filterable by processed, ambiguous,
            stuck or errored. Expanding one shows the extraction, the tool calls and the
            drafts it produced, next to the full transcript. When something goes wrong, I
            can see exactly where.
          </Body>
        </Reveal>

        {/* usage by feature, as a card… */}
        <ShotRow
          src={A("admin-usage-features.png")}
          alt="Vector's AI usage by feature: calls, errors, total and average cost, p95 latency and cache hit rate for each AI surface."
          caption="Usage by feature. Cost, latency and cache hits for every AI surface, over 30 days."
          speed={-22}
          className="mt-8"
        />

        {/* …and the pipeline itself, one event expanded to its full trace */}
        <Reveal className="mt-14 md:ml-auto md:max-w-[760px]">
          <Parallax speed={26}>
            <PipelineView />
          </Parallax>
        </Reveal>

        <Reveal className="mt-14 max-w-[860px]">
          <CaseStudyCallout stream>
            {"This is the groundwork for the evals on the roadmap. Accuracy scoring only works if every call and every draft is already on record."}
          </CaseStudyCallout>
        </Reveal>
      </Container>
    </section>
  );
}
