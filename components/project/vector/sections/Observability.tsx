import { Fragment } from "react";
import { CARD_FRAME, Container, Kicker, Title, Body } from "../ui";
import { Reveal } from "../Reveal";
import { Parallax } from "../Parallax";
import { DotGlow } from "../DotGlow";

/* PipelineView — the admin's Pipeline tab, recreated as a card (the live tab
   sits behind vendor auth, so this is a faithful rebuild of
   app/components/PipelineTimeline.js rather than a screenshot: same filter
   chips, same states, same expanded trace with its collapsed raw-JSON and
   transcript rows). Data is fictional, matching the demo book of business
   used across every other shot. */

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

/* the expanded trace under "Untitled meeting" — the transcript-match win.
   Open sections carry ▾; the collapsed rows nested under them (raw JSON,
   transcript) carry ▸, mirroring the real tab's disclosure anatomy. */
const PIPE_TRACE = [
  { k: "matched", v: "Function Health, via the transcript (title gave nothing)" },
  { k: "pass 1 / extraction", v: "5 claims, each with a verbatim source quote" },
  { k: "raw extraction JSON", nested: true },
  { k: "pass 2 / tool calls", v: "create_task ×2 · match_existing ×2 · update_status ×1" },
  { k: "raw tool calls JSON", nested: true },
  { k: "drafts", v: "5 in the review queue · $0.036" },
  { k: "full transcript", v: "20 utterances", nested: true },
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
                {PIPE_TRACE.map((row) =>
                  "nested" in row && row.nested ? (
                    <p key={row.k} className={`${mono} pl-4 text-[11px] leading-snug text-[var(--case-study-muted)]`}>
                      <span className="mr-1.5">▸</span>
                      {row.k}
                      {"v" in row && row.v ? ` · ${row.v}` : ""}
                    </p>
                  ) : (
                    <p key={row.k} className={`${mono} text-[11.5px] leading-snug`}>
                      <span className="mr-1.5 text-[var(--case-study-muted)]">▾</span>
                      <span className="text-[var(--case-study-ink)]">{row.k}</span>
                      <span className="text-[var(--case-study-muted)]">{"v" in row && row.v ? ` · ${row.v}` : ""}</span>
                    </p>
                  )
                )}
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

/* UsageView — the admin's "By feature" usage table, rebuilt as a card in the
   same family as PipelineView (the live tab sits behind vendor auth; same
   columns and feature kinds as app/admin/ai/page.js, fictional numbers from
   the demo book of business). The first row is expanded to the thing the
   rollup is made of: one individual call's full receipt. */

type UsageRow = {
  kind: string;
  calls: string;
  errors?: string;
  cost: string;
  p95: string;
  cache: string;
  open?: boolean;
};

const USAGE_ROWS: UsageRow[] = [
  { kind: "insight_onboarding", calls: "212", cost: "$1.84", p95: "3.1s", cache: "78%", open: true },
  { kind: "insight_portfolio", calls: "64", cost: "$0.71", p95: "4.2s", cache: "81%" },
  { kind: "miniti_extraction", calls: "58", errors: "1", cost: "$0.92", p95: "8.4s", cache: "46%" },
  { kind: "miniti_orchestrator", calls: "58", cost: "$0.60", p95: "6.1s", cache: "52%" },
  { kind: "scan_stale_followup", calls: "33", cost: "$0.19", p95: "2.3s", cache: "88%" },
];

/* the expanded receipt under insight_onboarding — one call, kept in full */
const RECEIPT = [
  ["tokens", "4 812 in · 3 921 cache read · 391 out"],
  ["cost / duration", "$0.0041 · 2.9s"],
  ["request id", "req_011CSHn3xAzKq…"],
] as const;

function UsageView() {
  const mono = "font-[family-name:var(--font-mono)]";
  const num = "text-right tabular-nums";
  return (
    <div className={CARD_FRAME}>
      <p className={`${mono} mb-4 text-[11px] lowercase tracking-[0.14em] text-[var(--case-study-muted)]`}>
        usage by feature / admin · last 30 days
      </p>

      <table className={`${mono} w-full border-collapse text-[12px]`}>
        <thead>
          <tr className="text-[11px] lowercase text-[var(--case-study-muted)]">
            <th className="pb-2 text-left font-normal">kind</th>
            <th className={`pb-2 ${num} font-normal`}>calls</th>
            <th className={`pb-2 ${num} font-normal max-sm:hidden`}>errors</th>
            <th className={`pb-2 ${num} font-normal`}>total cost</th>
            <th className={`pb-2 ${num} font-normal max-sm:hidden`}>p95</th>
            <th className={`pb-2 ${num} font-normal`}>cache hit</th>
          </tr>
        </thead>
        <tbody>
          {USAGE_ROWS.map(({ kind, calls, errors, cost, p95, cache, open }) => (
            <Fragment key={kind}>
              <tr className="border-t border-[var(--case-study-line)]">
                <td className="py-2 pr-3 text-[var(--case-study-ink)]">
                  <span className="mr-1.5 text-[var(--case-study-muted)]">{open ? "▾" : "▸"}</span>
                  {kind}
                </td>
                <td className={`py-2 ${num} text-[var(--case-study-muted)]`}>{calls}</td>
                <td className={`py-2 ${num} max-sm:hidden ${errors ? "text-[var(--vec-danger)]" : "text-[var(--case-study-muted)]"}`}>
                  {errors ?? "—"}
                </td>
                <td className={`py-2 ${num} text-[var(--case-study-muted)]`}>{cost}</td>
                <td className={`py-2 ${num} text-[var(--case-study-muted)] max-sm:hidden`}>{p95}</td>
                <td className={`py-2 ${num} text-[var(--case-study-muted)]`}>{cache}</td>
              </tr>
              {open && (
                <tr>
                  <td colSpan={6} className="pt-0.5 pb-2.5">
                    <div className="ml-4 space-y-1 border-l border-[var(--case-study-line)] py-1 pl-3.5">
                      <p className="text-[11px] lowercase tracking-[0.14em] text-[var(--case-study-muted)]">
                        one call, kept in full
                      </p>
                      {RECEIPT.map(([k, v]) => (
                        <p key={k} className="text-[11.5px] leading-snug">
                          <span className="text-[var(--case-study-ink)]">{k}</span>
                          <span className="text-[var(--case-study-muted)]"> · {v}</span>
                        </p>
                      ))}
                    </div>
                  </td>
                </tr>
              )}
            </Fragment>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/* dots texture — keep in sync with Product's `dots` TEXTURES entry (22px
   rhythm, same alpha) so the two rooms read as one system */
const DOTS: React.CSSProperties = {
  backgroundImage: "radial-gradient(rgba(241,234,241,0.11) 1px, transparent 1.4px)",
  backgroundSize: "22px 22px",
};

export function Observability() {
  return (
    <section data-section="Observability" className="pt-[120px] pb-0">
      {/* the textured room: hairlines exactly at the texture's edges, like
          Product's subsections; content wrappers are relative so they paint
          above the cursor glow */}
      <div
        className="relative border-y border-[rgba(241,234,241,0.14)] pb-[120px]"
        style={DOTS}
      >
        <DotGlow pattern="dots" />
        <Container className="relative pt-16 md:pt-24">
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
            I shipped backend dashboards to track Vector&apos;s AI features. It monitors latency and cost and helps me pinpoint and troubleshoot errors. The traces let me see where retrieval breaks down and which step to optimise.
            </Body>
          </Reveal>

          {/* the two admin cards as one overlapping cluster — the pipeline rides
              over the usage card's bottom row (md+; phones stack normally). One
              shared Parallax so the overlap never drifts apart. */}
          <Parallax speed={-18}>
            <div className="mt-12">
              <Reveal className="md:max-w-[760px]">
                <UsageView />
              </Reveal>
              <Reveal className="relative z-10 mt-8 md:-mt-16 md:ml-auto md:max-w-[760px]">
                <PipelineView />
              </Reveal>
            </div>
          </Parallax>
        </Container>
      </div>
    </section>
  );
}
